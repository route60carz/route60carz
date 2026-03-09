import AdminCarsClient from '@/components/admin/AdminCarsClient';
import { getAllCars } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminCarsPage() {
    const cars = await getAllCars();

    return <AdminCarsClient initialCars={cars || []} />;
}
