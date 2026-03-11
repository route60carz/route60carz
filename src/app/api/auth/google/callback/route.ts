import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { createSession } from '@/lib/session';

interface GoogleTokenResponse {
    access_token: string;
    id_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
}

interface GoogleUserInfo {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    given_name: string;
    family_name?: string;
    picture: string;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Handle Google errors
    if (error) {
        console.error('Google OAuth error:', error);
        return NextResponse.redirect(
            `${siteUrl}/auth/login?error=${encodeURIComponent('Google sign-in was cancelled or failed.')}`
        );
    }

    if (!code) {
        return NextResponse.redirect(
            `${siteUrl}/auth/login?error=${encodeURIComponent('No authorization code received from Google.')}`
        );
    }

    // Validate CSRF state
    const cookieHeader = request.headers.get('cookie') || '';
    const stateCookie = cookieHeader
        .split(';')
        .map(c => c.trim())
        .find(c => c.startsWith('google_oauth_state='));
    const savedState = stateCookie?.split('=')[1];

    if (!state || !savedState || state !== savedState) {
        console.error('OAuth state mismatch:', { state, savedState });
        return NextResponse.redirect(
            `${siteUrl}/auth/login?error=${encodeURIComponent('Security validation failed. Please try again.')}`
        );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return NextResponse.redirect(
            `${siteUrl}/auth/login?error=${encodeURIComponent('Google OAuth is not configured on the server.')}`
        );
    }

    try {
        // Exchange authorization code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: `${siteUrl}/api/auth/google/callback`,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            const errBody = await tokenResponse.text();
            console.error('Google token exchange failed:', errBody);
            return NextResponse.redirect(
                `${siteUrl}/auth/login?error=${encodeURIComponent('Failed to authenticate with Google. Please try again.')}`
            );
        }

        const tokens: GoogleTokenResponse = await tokenResponse.json();

        // Fetch user profile from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });

        if (!userInfoResponse.ok) {
            console.error('Failed to fetch Google user info');
            return NextResponse.redirect(
                `${siteUrl}/auth/login?error=${encodeURIComponent('Failed to get user info from Google.')}`
            );
        }

        const googleUser: GoogleUserInfo = await userInfoResponse.json();

        if (!googleUser.email) {
            return NextResponse.redirect(
                `${siteUrl}/auth/login?error=${encodeURIComponent('No email address associated with this Google account.')}`
            );
        }

        const sql = getDb();

        // Check if user already exists
        const existingUsers = await sql`
            SELECT id, email, full_name, role, created_at 
            FROM profiles 
            WHERE email = ${googleUser.email} 
            LIMIT 1
        `;

        let userData;

        if (existingUsers.length > 0) {
            // Existing user — update last login
            const user = existingUsers[0];
            await sql`UPDATE profiles SET last_login_at = NOW() WHERE id = ${user.id}`;
            userData = {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                created_at: user.created_at,
            };
        } else {
            // New user — create profile (auto-verified, no password)
            const newUsers = await sql`
                INSERT INTO profiles (email, full_name, role, is_email_verified, auth_provider, last_login_at)
                VALUES (${googleUser.email}, ${googleUser.name}, 'user', TRUE, 'google', NOW())
                RETURNING id, email, full_name, role, created_at
            `;
            userData = newUsers[0];
        }

        // Create JWT session
        await createSession(userData);

        // Clear the CSRF cookie and redirect to home
        const response = NextResponse.redirect(siteUrl);
        response.cookies.set('google_oauth_state', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        });

        return response;
    } catch (err: any) {
        console.error('Google OAuth callback error:', err);
        return NextResponse.redirect(
            `${siteUrl}/auth/login?error=${encodeURIComponent('An unexpected error occurred during Google sign-in.')}`
        );
    }
}
