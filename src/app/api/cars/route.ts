import { NextResponse } from 'next/server';
import { getAllCars, insertCar, getPaginatedCars } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '12', 10);
        const offset = (page - 1) * limit;

        const { cars, total } = await getPaginatedCars(limit, offset);
        
        return NextResponse.json({
            cars,
            total,
            page,
            limit
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('API /api/cars error:', message);
        return NextResponse.json({ error: message, cars: [], total: 0, page: 1, limit: 12 }, { status: 500 });
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
