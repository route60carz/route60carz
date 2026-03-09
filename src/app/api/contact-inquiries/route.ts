import { NextResponse } from 'next/server';
import { insertInquiry, getAllInquiries, updateInquiryStatus } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { car_id, name, phone, message } = body;

        // Get the current user session
        const session = await getSession();
        const user_id = session?.user?.id || null;

        // Validate required fields
        if (!car_id || !name || !phone) {
            return NextResponse.json(
                { error: 'Missing required fields: car_id, name, and phone are required.' },
                { status: 400 }
            );
        }

        // Validate phone number (basic validation)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            return NextResponse.json(
                { error: 'Please enter a valid 10-digit phone number.' },
                { status: 400 }
            );
        }

        // Insert the inquiry
        const data = await insertInquiry({
            car_id,
            user_id,
            name,
            phone,
            message: message || null,
            status: 'new',
        });

        return NextResponse.json({
            success: true,
            inquiry_id: data.id,
            message: 'Your inquiry has been submitted successfully.',
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const inquiries = await getAllInquiries();
        return NextResponse.json(inquiries);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inquiries' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: 'Missing required fields: id and status are required.' },
                { status: 400 }
            );
        }

        const updated = await updateInquiryStatus(id, status);
        if (!updated) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating inquiry status:', error);
        return NextResponse.json(
            { error: 'Failed to update inquiry status' },
            { status: 500 }
        );
    }
}
