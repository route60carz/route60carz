'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ALL_BRANDS = [
    { name: 'Maruti Suzuki', slug: 'maruti-suzuki', ext: 'png' },
    { name: 'Hyundai', slug: 'hyundai', ext: 'png' },
    { name: 'Mahindra', slug: 'mahindra', ext: 'png' },
    { name: 'Toyota', slug: 'toyota', ext: 'png' },
    { name: 'Honda', slug: 'honda', ext: 'png' },
    { name: 'Tata', slug: 'tata', ext: 'png' },
    { name: 'Kia', slug: 'kia', ext: 'png' },
    { name: 'Ford', slug: 'ford', ext: 'png' },
    { name: 'Volkswagen', slug: 'volkswagen', ext: 'png' },
    { name: 'Renault', slug: 'renault', ext: 'png' },
    { name: 'BMW', slug: 'bmw', ext: 'png' },
    { name: 'Mercedes Benz', slug: 'mercedes-benz', ext: 'png' },
    { name: 'Audi', slug: 'audi', ext: 'png' },
    { name: 'Skoda', slug: 'skoda', ext: 'png' },
    { name: 'Nissan', slug: 'nissan', ext: 'png' },
    { name: 'MG', slug: 'mg', ext: 'png' },
    { name: 'Jeep', slug: 'jeep', ext: 'png' },
    { name: 'Jaguar', slug: 'jaguar', ext: 'png' },
    { name: 'Chevrolet', slug: 'chevrolet', ext: 'png' },
    { name: 'Citroen', slug: 'citroen', ext: 'png' },
    { name: 'Fiat', slug: 'fiat', ext: 'png' },
    { name: 'Isuzu', slug: 'isuzu', ext: 'png' },
    { name: 'Land Rover', slug: 'land-rover', ext: 'png' },
    { name: 'MINI', slug: 'mini', ext: 'png' },
    { name: 'Mitsubishi', slug: 'mitsubishi', ext: 'png' },
    { name: 'Porsche', slug: 'porsche', ext: 'png' },
    { name: 'Rolls-Royce', slug: 'rolls-royce', ext: 'png' },
    { name: 'Volvo', slug: 'volvo', ext: 'png' },
    { name: 'DatSun', slug: 'datsun', ext: 'png' },
    { name: 'Ashok Leyland', slug: 'ashok-leyland', ext: 'png' },
    { name: 'Eicher Motors', slug: 'eicher-motors', ext: 'png' },
    { name: 'Force', slug: 'force', ext: 'png' },
    { name: 'Hindustan Motors', slug: 'hindustan-motors', ext: 'svg' },
    { name: 'Mahindra Renault', slug: 'mahindra', ext: 'png' },
    { name: 'Piaggio', slug: 'piaggio', ext: 'png' },
    { name: 'Premier', slug: 'premier', ext: 'png' },
    { name: 'SsangYong', slug: 'ssangyong', ext: 'svg' },
    { name: 'Others', slug: 'others', ext: 'svg' },
];

// 3 rows × 8 cols (lg) = 24 items initially visible
const INITIAL_COUNT = 24;

export default function BrandGrid() {
    const [showAll, setShowAll] = useState(false);
    const visibleBrands = showAll ? ALL_BRANDS : ALL_BRANDS.slice(0, INITIAL_COUNT);

    return (
        <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {visibleBrands.map((brand) => (
                    <Link
                        key={brand.name}
                        href={`/?make=${encodeURIComponent(brand.name)}#inventory`}
                        className="brand-card"
                    >
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 overflow-hidden p-1.5 shadow-md">
                            <img
                                src={`/brands/${brand.slug}.${brand.ext}`}
                                alt={brand.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                                onError={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    img.style.display = 'none';
                                    img.parentElement!.innerHTML = `<span class="text-xs font-bold text-zinc-600">${brand.name.substring(0, 2).toUpperCase()}</span>`;
                                }}
                            />
                        </div>
                        <span className="text-[10px] font-semibold text-center leading-tight">{brand.name}</span>
                    </Link>
                ))}
            </div>

            <div className="text-center mt-8">
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline transition-colors cursor-pointer"
                >
                    {showAll ? 'Show Less' : 'View All Brands'}
                    {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>
        </>
    );
}
