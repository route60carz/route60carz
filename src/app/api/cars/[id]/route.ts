import { NextResponse } from 'next/server';
import { getCarById, updateCar, deleteCar } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const car = await getCarById(id);
        if (!car) {
            return NextResponse.json({ error: 'Car not found' }, { status: 404 });
        }
        return NextResponse.json(car);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('API /api/cars/[id] GET error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const car = await updateCar(id, body);
        if (!car) {
            return NextResponse.json({ error: 'Car not found' }, { status: 404 });
        }
        return NextResponse.json(car);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('API /api/cars/[id] PUT error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const deleted = await deleteCar(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Car not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('API /api/cars/[id] DELETE error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
