import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';

// Helper to generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
    try {
        const { email, password, full_name, resend } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Missing email' }, { status: 400 });
        }

        const sql = getDb();
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Check if user exists
        const existingUsers = await sql`SELECT id, is_email_verified FROM profiles WHERE email = ${email} LIMIT 1`;

        if (existingUsers.length > 0) {
            const user = existingUsers[0];

            if (user.is_email_verified) {
                return NextResponse.json({ error: 'User already exists. Please log in.' }, { status: 400 });
            }

            // User exists but is NOT verified (e.g., they hit resend or tried signing up again).
            // Update their OTP.
            if (!resend && password && full_name) {
                // If they provided full info again, we can also update their hash/name if needed, 
                // but let's just update the OTP for now.
                const password_hash = await bcrypt.hash(password, 10);
                await sql`
                    UPDATE profiles 
                    SET 
                        verification_otp = ${otp},
                        verification_otp_expires_at = ${expiresAt},
                        full_name = ${full_name},
                        password_hash = ${password_hash}
                    WHERE id = ${user.id}
                `;
            } else {
                // Just resend path
                await sql`
                    UPDATE profiles 
                    SET 
                        verification_otp = ${otp},
                        verification_otp_expires_at = ${expiresAt}
                    WHERE id = ${user.id}
                `;
            }

        } else {
            // New user registration
            if (!password || !full_name) {
                return NextResponse.json({ error: 'Missing password or full name' }, { status: 400 });
            }

            const password_hash = await bcrypt.hash(password, 10);

            // Create user profile
            await sql`
                INSERT INTO profiles (email, full_name, password_hash, role, is_email_verified, verification_otp, verification_otp_expires_at)
                VALUES (${email}, ${full_name}, ${password_hash}, 'user', FALSE, ${otp}, ${expiresAt})
            `;
        }

        // Send the Verification Email holding the OTP
        const emailSent = await sendVerificationEmail(email, otp);

        if (!emailSent) {
            return NextResponse.json({ error: 'Verification email could not be sent. Please try again later.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'OTP sent to your email.' });
    } catch (error: any) {
        console.error('Registration/OTP error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
