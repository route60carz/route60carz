import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (!clientId) {
        return NextResponse.json(
            { error: 'Google OAuth is not configured on the server.' },
            { status: 500 }
        );
    }

    // Generate a random state parameter for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');

    const redirectUri = `${siteUrl}/api/auth/google/callback`;

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        state: state,
        prompt: 'consent',
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    // Store state in a cookie for CSRF validation on callback
    const response = NextResponse.redirect(googleAuthUrl);
    response.cookies.set('google_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600, // 10 minutes
        path: '/',
    });

    return response;
}
