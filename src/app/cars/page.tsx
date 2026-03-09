import CarGrid from '@/components/inventory/CarGrid';
import { getAllCars } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CarsPage() {
    const cars = await getAllCars();

    return (
        <div className="pt-24 min-h-screen bg-black overflow-x-hidden">
            <CarGrid initialCars={cars || []} />
        </div>
    );
}
