import ScrollSequence from '@/components/hero/ScrollSequence';
import CarGrid from '@/components/inventory/CarGrid';
import TawkToWidget from '@/components/ui/TawkToWidget';
import BrandGrid from '@/components/home/BrandGrid';
import Link from 'next/link';
import { Suspense } from 'react';
import { Car, MapPin, BadgeIndianRupee, Phone, Mail } from 'lucide-react';
import { getAllCars } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cars = await getAllCars();

  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden">
      {/* ═══════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════ */}
      <ScrollSequence />

      {/* All content below hero gets z-10 to clear pinned canvas */}
      <div className="relative z-10 bg-black">

        {/* ═══════════════════════════════════════════════ */}
        {/* INTRO / TAGLINE */}
        {/* ═══════════════════════════════════════════════ */}
        <section id="intro" className="py-24 px-6 text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
              Redefining <span className="text-primary italic">Luxury</span>
            </h2>
            <p className="text-secondary leading-relaxed text-lg">
              Route 60 Carz Trading is the fastest, easiest, and most trusted way to
              buy and sell pre-owned cars in Theni. We curate premium vehicles from
              trusted sources, making your dream car purchase smooth and hassle-free.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* FIND CARS BY CHOICE (Tabs: Budget / Body / Fuel / City) */}
        {/* ═══════════════════════════════════════════════ */}
        <section id="find-cars" className="py-20 px-6 bg-zinc-950 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter text-center">
              FIND THE CAR OF YOUR <span className="text-primary">CHOICE</span>
            </h2>
            <p className="text-secondary text-center mb-12">Browse our collection by budget, body type, fuel, or city</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Budget */}
              <div className="find-card group">
                <div className="find-card-icon">
                  <BadgeIndianRupee size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">By Budget</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/?maxPrice=300000#inventory" className="find-card-link">Below ₹3 Lakhs</Link></li>
                  <li><Link href="/?maxPrice=500000#inventory" className="find-card-link">₹3 - ₹5 Lakhs</Link></li>
                  <li><Link href="/?maxPrice=800000#inventory" className="find-card-link">₹5 - ₹8 Lakhs</Link></li>
                  <li><Link href="/?maxPrice=1000000#inventory" className="find-card-link">₹8 - ₹10 Lakhs</Link></li>
                  <li><Link href="/?maxPrice=1500000#inventory" className="find-card-link">₹10 - ₹15 Lakhs</Link></li>
                  <li><Link href="/?maxPrice=5000000#inventory" className="find-card-link">Above ₹20 Lakhs</Link></li>
                </ul>
              </div>

              {/* Body Type */}
              <div className="find-card group">
                <div className="find-card-icon">
                  <Car size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">By Body Type</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/#inventory" className="find-card-link">Sedan</Link></li>
                  <li><Link href="/#inventory" className="find-card-link">Hatchback</Link></li>
                  <li><Link href="/#inventory" className="find-card-link">SUV</Link></li>
                  <li><Link href="/#inventory" className="find-card-link">MUV</Link></li>
                  <li><Link href="/#inventory" className="find-card-link">Crossover</Link></li>
                  <li><Link href="/#inventory" className="find-card-link">Convertible</Link></li>
                </ul>
              </div>

              {/* Fuel */}
              <div className="find-card group">
                <div className="find-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M3 12v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" /><path d="M18 14v4a2 2 0 0 1-2 2" /><circle cx="8" cy="16" r="2" /></svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-3">By Fuel Type</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/?fuel=Petrol#inventory" className="find-card-link">Petrol</Link></li>
                  <li><Link href="/?fuel=Diesel#inventory" className="find-card-link">Diesel</Link></li>
                  <li><Link href="/?fuel=CNG#inventory" className="find-card-link">CNG</Link></li>
                  <li><Link href="/?fuel=LPG#inventory" className="find-card-link">LPG</Link></li>
                  <li><Link href="/?fuel=Hybrid#inventory" className="find-card-link">Hybrid</Link></li>
                  <li><Link href="/?fuel=Electric#inventory" className="find-card-link">Electric</Link></li>
                </ul>
              </div>

              {/* City */}
              <div className="find-card group">
                <div className="find-card-icon">
                  <MapPin size={28} />
                </div>
                <h3 className="text-white font-bold text-lg mb-3">By City</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/?city=Theni#inventory" className="find-card-link">Theni</Link></li>
                  <li><Link href="/?city=Madurai#inventory" className="find-card-link">Madurai</Link></li>
                  <li><Link href="/?city=Chennai#inventory" className="find-card-link">Chennai</Link></li>
                  <li><Link href="/?city=Coimbatore#inventory" className="find-card-link">Coimbatore</Link></li>
                  <li><Link href="/?city=Dindigul#inventory" className="find-card-link">Dindigul</Link></li>
                  <li><Link href="/?city=Salem#inventory" className="find-card-link">Salem</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* BROWSE BY BRAND */}
        {/* ═══════════════════════════════════════════════ */}
        <section id="brands" className="py-20 px-6 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter text-center">
              BROWSE BY <span className="text-primary">BRAND</span>
            </h2>
            <p className="text-secondary text-center mb-12">Find your favourite make from our extensive collection</p>
            <BrandGrid />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* FEATURED INVENTORY */}
        {/* ═══════════════════════════════════════════════ */}
        <div id="inventory">
          <Suspense fallback={<div className="py-20 text-center text-secondary">Loading inventory...</div>}>
            <CarGrid initialCars={cars || []} />
          </Suspense>
        </div>
      </div>

      {/* Tawk.to Live Chat */}
      <TawkToWidget />
    </main>
  );
}
