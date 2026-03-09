import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const sql = getDb();

        // Find user
        const users = await sql`SELECT id, email, full_name, role, password_hash, is_email_verified, created_at FROM profiles WHERE email = ${email} LIMIT 1`;
        if (users.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }

        const user = users[0];

        // Ensure email is verified
        if (!user.is_email_verified && user.role !== 'admin') {
            return NextResponse.json({
                error: 'Please verify your email address to log in.',
                needsVerification: true
            }, { status: 403 });
        }

        // Check password (handle legacy users without password_hash)
        if (!user.password_hash) {
            return NextResponse.json({ error: 'Please sign up again via social or reset password' }, { status: 400 });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }

        // Update login timestamp
        await sql`UPDATE profiles SET last_login_at = NOW() WHERE id = ${user.id}`;

        const userData = {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            created_at: user.created_at
        };

        // Create session
        await createSession(userData);

        return NextResponse.json({ user: userData });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
