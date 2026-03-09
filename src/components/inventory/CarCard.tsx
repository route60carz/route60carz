'use client'

import Image from 'next/image';

export interface Car {
    id: string;
    make: string;
    model: string;
    price: number;
    city: string;
    image_url: string;
    gallery_images?: string[] | null;
    year: number;
    fuel_type: string;
    status: string;
}

export default function CarCard({ car }: { car: Car }) {
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(car.price);

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-sm ring-1 ring-white/10 transition-all hover:scale-[1.01] hover:shadow-[0_4px_30px_rgba(198,217,50,0.1)] hover:ring-primary/50">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-800">
                {car.image_url ? (
                    <Image
                        src={car.image_url}
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-secondary">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                        <p className="font-mono text-xs text-primary mb-1">
                            {car.year} • {car.fuel_type} • {car.city}
                        </p>
                        <h3 className="text-xl font-bold text-white tracking-tight leading-none group-hover:text-primary transition-colors">
                            {car.make} {car.model}
                        </h3>
                    </div>
                    {car.status === 'sold' && (
                        <span className="bg-red-500/80 text-white text-xs font-bold px-2 py-1 rounded-full">SOLD</span>
                    )}
                </div>
            </div>

            <div className="p-5 flex items-center justify-between border-t border-white/5 bg-black/40">
                <div className="flex flex-col">
                    <span className="text-xs text-secondary uppercase tracking-widest">Price</span>
                    <span className="text-lg font-bold text-white">{formattedPrice}</span>
                </div>
                <a href={`/cars/${car.id}`} className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary hover:text-black hover:shadow-[0_0_15px_rgba(198,217,50,0.4)] block text-center">
                    View Details
                </a>
            </div>
        </div>
    )
}
