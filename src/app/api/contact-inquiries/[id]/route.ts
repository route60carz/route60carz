import { NextResponse } from 'next/server';
import { deleteInquiry } from '@/lib/db';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        if (!id) {
            return NextResponse.json(
                { error: 'Inquiry ID is required' },
                { status: 400 }
            );
        }

        const deleted = await deleteInquiry(id);
        
        if (!deleted) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('API /api/contact-inquiries/[id] DELETE error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
