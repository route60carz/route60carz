'use client'

import React, { useState, useMemo, useEffect } from 'react';
import CarCard, { Car } from './CarCard';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'year-desc' },
    { label: 'Oldest First', value: 'year-asc' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A - Z', value: 'name-asc' },
    { label: 'Name: Z - A', value: 'name-desc' },
];

const CARS_PER_PAGE = 12;

const CITIES = ['All', 'Theni', 'Madurai', 'Chennai'];
const MAKES = [
    'All',
    'Ashok Leyland', 'Audi', 'BMW', 'Chevrolet', 'Citroen',
    'DatSun', 'Eicher Motors', 'Fiat', 'Force', 'Ford',
    'Hindustan Motors', 'Honda', 'Hyundai', 'Isuzu',
    'Jaguar', 'Jeep', 'Kia', 'Land Rover',
    'Mahindra', 'Mahindra Renault', 'Maruti Suzuki', 'Mercedes Benz',
    'MG', 'MINI', 'Mitsubishi', 'Nissan',
    'Others', 'Piaggio', 'Porsche', 'Premier',
    'Renault', 'Rolls-Royce', 'Skoda', 'SsangYong',
    'Tata', 'Toyota', 'Volkswagen', 'Volvo',
];
const FUEL_TYPES = ['All', 'Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const YEARS = ['All', ...Array.from({ length: 2026 - 1980 + 1 }, (_, i) => String(2026 - i))];

export default function CarGrid({ initialCars = [] }: { initialCars?: Car[] }) {
    const searchParams = useSearchParams();

    const [cars, setCars] = useState<Car[]>(initialCars);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('All');
    const [selectedMake, setSelectedMake] = useState('All');
    const [selectedFuel, setSelectedFuel] = useState('All');
    const [selectedYear, setSelectedYear] = useState('All');
    const [maxPrice, setMaxPrice] = useState(5000000);
    const [sortBy, setSortBy] = useState('year-desc');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCars(initialCars);
    }, [initialCars]);


    // Sync filters from URL search params
    useEffect(() => {
        const make = searchParams.get('make');
        const fuel = searchParams.get('fuel');
        const city = searchParams.get('city');
        const price = searchParams.get('maxPrice');
        const year = searchParams.get('year');

        if (make) setSelectedMake(make);
        if (fuel) setSelectedFuel(fuel);
        if (city) setSelectedCity(city);
        if (price) setMaxPrice(Number(price));
        if (year) setSelectedYear(year);
        setCurrentPage(1);
    }, [searchParams]);

    // Reset to page 1 when filters or sort change
    const resetPage = () => setCurrentPage(1);

    const filteredCars = useMemo(() => {
        const filtered = cars.filter(car => {
            const query = searchQuery.toLowerCase();
            const searchMatch = !query || `${car.make} ${car.model}`.toLowerCase().includes(query);
            const cityMatch = selectedCity === 'All' || car.city === selectedCity;
            const makeMatch = selectedMake === 'All' || car.make === selectedMake;
            const fuelMatch = selectedFuel === 'All' || car.fuel_type === selectedFuel;
            const yearMatch = selectedYear === 'All' || car.year === Number(selectedYear);
            const priceMatch = car.price <= maxPrice;
            return searchMatch && cityMatch && makeMatch && fuelMatch && yearMatch && priceMatch;
        });

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'year-desc': return b.year - a.year;
                case 'year-asc': return a.year - b.year;
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'name-asc': return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
                case 'name-desc': return `${b.make} ${b.model}`.localeCompare(`${a.make} ${a.model}`);
                default: return 0;
            }
        });

        return sorted;
    }, [cars, searchQuery, selectedCity, selectedMake, selectedFuel, selectedYear, maxPrice, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredCars.length / CARS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedCars = filteredCars.slice((safePage - 1) * CARS_PER_PAGE, safePage * CARS_PER_PAGE);

    return (
        <section className="bg-background py-20 px-6 sm:px-12 md:px-24">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tighter">
                    FEATURED <span className="text-primary">INVENTORY</span>
                </h2>

                {/* Search + Filters */}
                <div className="flex flex-wrap gap-6 mb-12 bg-white/5 rounded-2xl p-6 backdrop-blur-md">
                    {/* Search Bar */}
                    <div className="flex flex-col gap-2 w-full">
                        <label className="text-xs text-secondary uppercase tracking-widest">Search</label>
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                            <input
                                type="text"
                                placeholder="Search by make or model..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/50 text-white pl-10 pr-4 py-3 rounded-lg border border-white/10 focus:border-primary focus:outline-none placeholder:text-white/30 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <label className="text-xs text-secondary uppercase tracking-widest">City</label>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="bg-black/50 text-white p-3 rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                        >
                            {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <label className="text-xs text-secondary uppercase tracking-widest">Make</label>
                        <select
                            value={selectedMake}
                            onChange={(e) => setSelectedMake(e.target.value)}
                            className="bg-black/50 text-white p-3 rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                        >
                            {MAKES.map(make => <option key={make} value={make}>{make}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <label className="text-xs text-secondary uppercase tracking-widest">Fuel Type</label>
                        <select
                            value={selectedFuel}
                            onChange={(e) => setSelectedFuel(e.target.value)}
                            className="bg-black/50 text-white p-3 rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                        >
                            {FUEL_TYPES.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <label className="text-xs text-secondary uppercase tracking-widest">Model Year</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-black/50 text-white p-3 rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                        >
                            {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto flex-grow max-w-xs">
                        <label className="text-xs text-secondary uppercase tracking-widest">Max Price (INR)</label>
                        <input
                            type="range"
                            min="500000"
                            max="5000000"
                            step="100000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="accent-primary h-12 w-full"
                        />
                        <span className="text-sm font-bold text-primary">₹ {maxPrice.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* Sort Bar */}
                <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                    <p className="text-sm text-secondary">
                        Showing <span className="text-white font-semibold">{paginatedCars.length}</span> of <span className="text-white font-semibold">{filteredCars.length}</span> cars
                    </p>
                    <div className="flex items-center gap-2">
                        <ArrowUpDown size={14} className="text-secondary" />
                        <label className="text-xs text-secondary uppercase tracking-widest">Sort by</label>
                        <select
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value); resetPage(); }}
                            className="bg-black/50 text-white text-sm px-3 py-2 rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                        >
                            {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={40} className="text-primary animate-spin" />
                        <p className="text-secondary text-lg">Loading cars from database...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-20">
                        <p className="text-red-400 text-lg mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/80 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedCars.map(car => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </div>

                        {filteredCars.length === 0 && (
                            <div className="text-center py-20 text-secondary">
                                No cars found matching your criteria.
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (() => {
                            // Calculate visible page range (max 5 pages shown)
                            let startPage = Math.max(1, safePage - 2);
                            let endPage = Math.min(totalPages, startPage + 4);
                            if (endPage - startPage < 4) {
                                startPage = Math.max(1, endPage - 4);
                            }
                            const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

                            return (
                                <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={safePage <= 1}
                                        className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-white/5 text-white text-sm font-medium border border-white/10 transition-all hover:bg-primary hover:text-black hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-white disabled:hover:border-white/10"
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>

                                    {startPage > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentPage(1)}
                                                className="w-10 h-10 rounded-lg text-sm font-bold transition-all border bg-white/5 text-white border-white/10 hover:bg-white/10"
                                            >
                                                1
                                            </button>
                                            {startPage > 2 && (
                                                <span className="text-secondary text-sm px-1">...</span>
                                            )}
                                        </>
                                    )}

                                    {pages.map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all border ${page === safePage
                                                ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20'
                                                : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    {endPage < totalPages && (
                                        <>
                                            {endPage < totalPages - 1 && (
                                                <span className="text-secondary text-sm px-1">...</span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className="w-10 h-10 rounded-lg text-sm font-bold transition-all border bg-white/5 text-white border-white/10 hover:bg-white/10"
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={safePage >= totalPages}
                                        className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-white/5 text-white text-sm font-medium border border-white/10 transition-all hover:bg-primary hover:text-black hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:text-white disabled:hover:border-white/10"
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            );
                        })()}
                    </>
                )}
            </div>
        </section>
    );
}
