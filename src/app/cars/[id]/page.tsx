'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Calendar, MapPin, Fuel, CheckCircle, Loader2, MessageCircle, ChevronRight, X, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import ContactInquiryForm from '@/components/modals/ContactInquiryForm';
import SuccessModal from '@/components/modals/SuccessModal';
import LoginPromptModal from '@/components/modals/LoginPromptModal';
import { useAuth } from '@/context/AuthContext';

interface CarDetail {
    id: string;
    make: string;
    model: string;
    price: number;
    year: number;
    city: string;
    image_url: string;
    gallery_images?: string[] | null;
    fuel_type: string;
    status: string;
    description?: string;
    mileage?: number;
}

type ModalState = 'closed' | 'form' | 'success' | 'login';

export default function CarDetails() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { profile, loading: authLoading } = useAuth();

    const [car, setCar] = useState<CarDetail | null>(null);
    const [relatedCars, setRelatedCars] = useState<CarDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState<ModalState>('closed');
    const [selectedImage, setSelectedImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchCar() {
            if (!id) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/cars/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setCar(data);

                    // Fetch related cars of same make
                    const allRes = await fetch('/api/cars');
                    if (allRes.ok) {
                        const allCars = await allRes.json();
                        const related = allCars
                            .filter((c: CarDetail) => c.make === data.make && c.id !== data.id && c.status === 'available')
                            .slice(0, 6);
                        setRelatedCars(related);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch car:', err);
            }
            setLoading(false);
        }
        fetchCar();
    }, [id]);

    const handleContactNow = () => {
        if (authLoading) return;
        if (profile) {
            setModalState('form');
        } else {
            setModalState('login');
        }
    };

    const handleLoginSuccess = () => {
        setModalState('form');
    };

    const handleFormSuccess = () => {
        setModalState('success');
    };

    const handleContinueToInventory = () => {
        setModalState('closed');
        router.push('/#inventory');
    };

    const scrollRelated = (dir: 'left' | 'right') => {
        if (scrollRef.current) {
            const amount = dir === 'left' ? -320 : 320;
            scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 size={40} className="text-primary animate-spin" />
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4 bg-black">
                <h1 className="text-4xl font-bold text-white mb-4">Car Not Found</h1>
                <p className="text-secondary mb-8">The vehicle you are looking for does not exist or has been sold.</p>
                <a href="/#inventory" className="px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-white transition-colors">
                    Back to Inventory
                </a>
            </div>
        );
    }

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(car.price);

    const carName = `${car.year} ${car.make} ${car.model}`;

    // Build all images: main + gallery from DB
    const allImages: string[] = [];
    if (car.image_url) allImages.push(car.image_url);
    if (car.gallery_images && car.gallery_images.length > 0) {
        car.gallery_images.forEach(img => {
            if (img && img.trim()) allImages.push(img);
        });
    }

    const galleryThumbnails = allImages.slice(1, 5); // up to 4 sub-images

    return (
        <main className="min-h-screen pt-32 pb-12 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <a href="/#inventory" className="inline-flex items-center text-secondary hover:text-primary mb-6 transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back to Inventory
                </a>

                {/* ═══ INFO + HERO LAYOUT ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                    {/* Main Image */}
                    <div
                        className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
                        onClick={() => { setSelectedImage(0); setLightboxOpen(true); }}
                    >
                        {allImages[0] ? (
                            <Image
                                src={allImages[0]}
                                alt={carName}
                                fill
                                className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-secondary bg-zinc-900">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn size={18} className="text-white" />
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center flex-wrap gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${car.status === 'sold'
                                ? 'bg-red-500/20 text-red-400 border-red-500/20'
                                : car.status === 'pending'
                                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                                    : 'bg-primary/20 text-primary border-primary/20'
                                }`}>
                                {car.status === 'sold' ? 'Sold' : car.status === 'pending' ? 'Pending' : 'Available'}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black mb-1 tracking-tight">
                            {car.make} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary">{car.model}</span>
                        </h1>

                        <p className="text-3xl font-bold text-primary mb-6">{formattedPrice}</p>

                        <div className="flex flex-wrap gap-4 mb-6 text-sm text-secondary">
                            <span className="flex items-center gap-1.5"><MapPin size={15} /> {car.city}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={15} /> {car.year}</span>
                            <span className="flex items-center gap-1.5"><Fuel size={15} /> {car.fuel_type}</span>
                        </div>

                        {car.description && (
                            <p className="text-secondary leading-relaxed mb-6">{car.description}</p>
                        )}

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {['Certified Inspection', 'Easy Financing', 'RC Transfer Included', '1 Year Warranty'].map((feature) => (
                                <div key={feature} className="flex items-center text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-primary mr-2 shrink-0" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href={`https://wa.me/919677335554?text=${encodeURIComponent(`Hi, I'm interested in the ${car.year} ${car.make} ${car.model} (${formattedPrice})`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 px-6 py-3.5 bg-primary text-black font-bold rounded-xl text-center hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(198,217,50,0.3)] text-sm"
                            >
                                Inquire on WhatsApp
                            </a>
                            <button
                                onClick={handleContactNow}
                                className="flex-1 px-6 py-3.5 bg-white/10 text-white font-bold rounded-xl text-center hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center gap-2 text-sm"
                            >
                                <MessageCircle size={16} />
                                Contact Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* ═══ THUMBNAIL GALLERY ═══ */}
                {galleryThumbnails.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
                        {galleryThumbnails.map((img, idx) => (
                            <div
                                key={idx}
                                className="relative aspect-[3/2] rounded-xl overflow-hidden border border-white/10 cursor-pointer group"
                                onClick={() => { setSelectedImage(idx + 1); setLightboxOpen(true); }}
                            >
                                <Image
                                    src={img}
                                    alt={`${carName} - View ${idx + 2}`}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                    <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ═══ RELATED CARS ═══ */}
                {relatedCars.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                                    More from <span className="text-primary">{car.make}</span>
                                </h2>
                                <p className="text-secondary text-sm mt-1">Similar vehicles you might like</p>
                            </div>
                            <div className="hidden md:flex gap-2">
                                <button onClick={() => scrollRelated('left')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-secondary hover:text-white hover:bg-white/10 transition-colors">
                                    <ChevronLeft size={18} />
                                </button>
                                <button onClick={() => scrollRelated('right')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-secondary hover:text-white hover:bg-white/10 transition-colors">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
                            {relatedCars.map((rc) => (
                                <Link
                                    key={rc.id}
                                    href={`/cars/${rc.id}`}
                                    className="shrink-0 w-[260px] snap-start bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        {rc.image_url ? (
                                            <Image
                                                src={rc.image_url}
                                                alt={`${rc.make} ${rc.model}`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                sizes="260px"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-secondary bg-zinc-800">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-white text-sm truncate">{rc.year} {rc.make} {rc.model}</h3>
                                        <p className="text-primary font-bold text-base mt-1">
                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(rc.price)}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-secondary">
                                            <span className="flex items-center gap-1"><Fuel size={12} /> {rc.fuel_type}</span>
                                            <span className="flex items-center gap-1"><MapPin size={12} /> {rc.city}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* ═══ LIGHTBOX ═══ */}
            {lightboxOpen && allImages.length > 0 && (
                <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
                    <button className="absolute top-6 right-6 text-white/60 hover:text-white p-2 z-10" onClick={() => setLightboxOpen(false)}>
                        <X size={28} />
                    </button>
                    {allImages.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-10"
                                onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => Math.max(0, prev - 1)); }}
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-10"
                                onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => Math.min(allImages.length - 1, prev + 1)); }}
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}
                    <div className="relative w-[90vw] h-[80vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={allImages[selectedImage]}
                            alt={`${carName} - Image ${selectedImage + 1}`}
                            fill
                            className="object-contain"
                            sizes="90vw"
                        />
                    </div>
                    {allImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {allImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                                    className={`w-3 h-3 rounded-full transition-all ${idx === selectedImage ? 'bg-primary scale-125' : 'bg-white/30 hover:bg-white/60'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ═══ MODALS ═══ */}
            <LoginPromptModal
                isOpen={modalState === 'login'}
                onClose={() => setModalState('closed')}
                onSuccess={handleLoginSuccess}
            />

            <ContactInquiryForm
                isOpen={modalState === 'form'}
                onClose={() => setModalState('closed')}
                onSubmitSuccess={handleFormSuccess}
                carId={car.id}
                carName={carName}
            />

            <SuccessModal
                isOpen={modalState === 'success'}
                onClose={() => setModalState('closed')}
                onContinue={handleContinueToInventory}
            />
        </main>
    );
}
