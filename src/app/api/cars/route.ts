import { NextResponse } from 'next/server';
import { getAllCars, insertCar } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cars = await getAllCars();
        return NextResponse.json(cars);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('API /api/cars error:', message);
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const car = await insertCar(body);
        return NextResponse.json(car, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('API /api/cars POST error:', message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
