import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { createSession } from '@/lib/session';

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Missing email or OTP' }, { status: 400 });
        }

        const sql = getDb();

        // Find user
        const users = await sql`SELECT id, email, full_name, role, verification_otp, verification_otp_expires_at, is_email_verified FROM profiles WHERE email = ${email} LIMIT 1`;
        if (users.length === 0) {
            return NextResponse.json({ error: 'User does not exist.' }, { status: 400 });
        }

        const user = users[0];

        if (user.is_email_verified) {
            return NextResponse.json({ error: 'Email is already verified. Please sign in directly.' }, { status: 400 });
        }

        if (user.verification_otp !== otp) {
            return NextResponse.json({ error: 'Incorrect OTP. Please try again.' }, { status: 400 });
        }

        if (new Date(user.verification_otp_expires_at) < new Date()) {
            return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
        }

        // OTP is correct! Update the user.
        await sql`
            UPDATE profiles 
            SET 
                is_email_verified = TRUE,
                verification_otp = NULL,
                verification_otp_expires_at = NULL,
                last_login_at = NOW()
            WHERE id = ${user.id}
        `;

        const userData = {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            created_at: user.created_at
        };

        // Create session
        await createSession(userData);

        return NextResponse.json({ success: true, user: userData });
    } catch (error: any) {
        console.error('Verify error:', error);
        return NextResponse.json({ error: 'Internal server error while verifying.' }, { status: 500 });
    }
}
