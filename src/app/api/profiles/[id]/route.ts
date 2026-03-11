import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify the requester is an admin
        const session = await getSession();
        const adminSecret = request.headers.get('x-admin-secret');
        
        const isDbAdmin = session?.user && session.user.role === 'admin';
        const isEnvAdmin = adminSecret && adminSecret === process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

        if (!isDbAdmin && !isEnvAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
        }

        const sql = getDb();

        // Prevent deleting yourself
        if (session.user.id === id) {
            return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
        }

        // Nullify user references in contact_inquiries first (foreign key)
        await sql`UPDATE contact_inquiries SET user_id = NULL WHERE user_id = ${id}`;

        // Delete the profile
        const deleted = await sql`DELETE FROM profiles WHERE id = ${id} RETURNING id`;

        if (deleted.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
