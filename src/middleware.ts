import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow admin login page to pass through
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    // Admin route protection is handled client-side in the admin layout
    // This middleware just passes through — the admin layout checks auth state
    // and shows login redirect or "Access Denied" as needed
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
