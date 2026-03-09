'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, ChevronDown, MessageCircle, User, Shield, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const carBrands = [
    // Column 1
    ['Audi', 'BMW', 'Chevrolet', 'Fiat'],
    // Column 2
    ['Mahindra', 'Maruti Suzuki', 'Mercedes Benz', 'Nissan'],
    // Column 3
    ['Mahindra Renault', 'DatSun', 'Isuzu', 'MINI'],
    // Column 4
    ['Piaggio', 'Rolls-Royce', '', ''],

    // Row separator (group 2)
    ['Force', 'Ford', 'Hindustan Motors', 'Honda'],
    ['Porsche', 'Premier', 'Renault', 'Skoda'],
    ['SsangYong', 'Jeep', 'Others', 'MG'],

    // Row separator (group 3)
    ['Mitsubishi', 'Hyundai', 'Jaguar', 'Land Rover'],
    ['Tata', 'Toyota', 'Volkswagen', 'Volvo'],
    ['Kia', 'Citroen', 'Eicher Motors', 'Ashok Leyland'],
];

// Flatten for mobile view
const allBrands = [
    'Audi', 'BMW', 'Chevrolet', 'Fiat',
    'Force', 'Ford', 'Hindustan Motors', 'Honda',
    'Mitsubishi', 'Hyundai', 'Jaguar', 'Land Rover',
    'Mahindra', 'Maruti Suzuki', 'Mercedes Benz', 'Nissan',
    'Porsche', 'Premier', 'Renault', 'Skoda',
    'Tata', 'Toyota', 'Volkswagen', 'Volvo',
    'Mahindra Renault', 'DatSun', 'Isuzu', 'MINI',
    'SsangYong', 'Jeep', 'Others', 'MG',
    'Kia', 'Citroen', 'Eicher Motors', 'Ashok Leyland',
    'Piaggio', 'Rolls-Royce',
];

export default function Navbar() {
    const { user, profile, signOut, isAdmin, loading: authLoading } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [makeOpen, setMakeOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileMakeOpen, setMobileMakeOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const makeRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const handleSignOut = async () => {
        await signOut();
        setUserMenuOpen(false);
        window.location.href = '/';
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (makeRef.current && !makeRef.current.contains(e.target as Node)) setMakeOpen(false);
            if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false);
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <>
            {/* ───── Top Contact Strip ───── */}
            <div
                className={`fixed top-0 left-0 right-0 z-[60] bg-zinc-950 border-b border-white/5 transition-all duration-300 ${scrolled ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center h-9 text-xs">
                    <a href="tel:+919677335554" className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors">
                        <Phone size={12} />
                        <span>+91 96773 35554</span>
                    </a>
                    <a
                        href="https://wa.me/919677335554"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-secondary hover:text-green-400 transition-colors"
                    >
                        <MessageCircle size={12} />
                        <span>WhatsApp Us</span>
                    </a>
                </div>
            </div>

            {/* ───── Main Navbar ───── */}
            <nav
                className={`fixed left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'top-0 bg-black/85 backdrop-blur-xl shadow-lg shadow-black/30 py-3'
                    : 'top-9 bg-black/40 backdrop-blur-md py-4'
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">

                    {/* ── Logo - Left Corner ── */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <div className="relative w-10 h-10 group-hover:scale-105 transition-transform">
                            <img src="/route_60_carz.png" alt="Route 60 Carz" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-base font-bold text-white tracking-tight whitespace-nowrap group-hover:text-primary transition-colors">
                            ROUTE <span className="text-primary">60</span> CARZ
                        </span>
                    </Link>

                    {/* ── Desktop Nav Links (center) ── */}
                    <div className="hidden lg:flex items-center gap-6 ml-12">
                        {/* Home */}
                        <Link
                            href="/"
                            className={`nav-link ${pathname === '/' ? 'nav-link-active' : ''}`}
                        >
                            HOME
                        </Link>

                        {/* About Dropdown */}
                        <div ref={aboutRef} className="relative">
                            <button
                                className={`nav-link flex items-center gap-1 ${aboutOpen ? 'nav-link-active' : ''}`}
                                onMouseEnter={() => setAboutOpen(true)}
                                onClick={() => setAboutOpen(!aboutOpen)}
                            >
                                ABOUT
                                <ChevronDown size={14} className={`transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {aboutOpen && (
                                <div
                                    className="dropdown-menu w-52"
                                    onMouseEnter={() => setAboutOpen(true)}
                                    onMouseLeave={() => setAboutOpen(false)}
                                >
                                    <Link href="/about" className="dropdown-item" onClick={() => setAboutOpen(false)}>
                                        Who We Are
                                    </Link>
                                    <Link href="/about#services" className="dropdown-item" onClick={() => setAboutOpen(false)}>
                                        What We Do
                                    </Link>
                                    <Link href="/about#how-it-works" className="dropdown-item" onClick={() => setAboutOpen(false)}>
                                        How It Works
                                    </Link>
                                    <Link href="/about#contact" className="dropdown-item" onClick={() => setAboutOpen(false)}>
                                        Contact Us
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Make (Brands) Mega Dropdown */}
                        <div ref={makeRef} className="relative">
                            <button
                                className={`nav-link flex items-center gap-1 ${makeOpen ? 'nav-link-active' : ''}`}
                                onMouseEnter={() => setMakeOpen(true)}
                                onClick={() => setMakeOpen(!makeOpen)}
                            >
                                MAKE
                                <ChevronDown size={14} className={`transition-transform duration-200 ${makeOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {makeOpen && (
                                <div
                                    className="mega-dropdown"
                                    onMouseEnter={() => setMakeOpen(true)}
                                    onMouseLeave={() => setMakeOpen(false)}
                                >
                                    <div className="mega-dropdown-header">
                                        <span>Browse by Brand</span>
                                    </div>
                                    <div className="mega-dropdown-grid">
                                        {/* Group 1 */}
                                        <div className="mega-col">
                                            {['Audi', 'BMW', 'Chevrolet', 'Fiat'].map(b => (
                                                <a key={b} href={`/?make=${encodeURIComponent(b)}#inventory`} className="mega-item" onClick={() => setMakeOpen(false)}>{b}</a>
                                            ))}
                                        </div>
                                        <div className="mega-col">
                                            {['Mahindra', 'Maruti Suzuki', 'Mercedes Benz', 'Nissan'].map(b => (
                                                <a key={b} href={`/?make=${encodeURIComponent(b)}#inventory`} className="mega-item" onClick={() => setMakeOpen(false)}>{b}</a>
                                            ))}
                                        </div>
                                        <div className="mega-col">
                                            {['Mahindra Renault', 'DatSun', 'Isuzu', 'MINI'].map(b => (
                                                <a key={b} href={`/?make=${encodeURIComponent(b)}#inventory`} className="mega-item" onClick={() => setMakeOpen(false)}>{b}</a>
                                            ))}
                                        </div>
                                        <div className="mega-col">
                                            {['Piaggio', 'Rolls-Royce'].map(b => (
                                                <a key={b} href={`/?make=${encodeURIComponent(b)}#inventory`} className="mega-item" onClick={() => setMakeOpen(false)}>{b}</a>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mega-dropdown-divider" />
                                    <div className="mega-dropdown-grid">
                                        <div className="mega-col">
                                            {['Force', 'Ford', 'Hindustan Motors', 'Honda'].map(b => (
                                                <a key={b} href={`/?make=${encodeURIComponent(b)}#inventory`} className="mega-item" onClick={() => setMakeOpen(false)}>{b}</a>
                                            ))}
                                        </div>
                                        <div className="mega-col">
                                            {['Porsche', 'Premier', 'Renault', 'Skoda'].map(b => (
                                                <a key={b} href={`/?make=${encodeURIComponent(b)}#inventory`} className="mega-item" onClick={() => setMakeOpen(false)}>{b}</a>
                                            ))}
                                        </div>
                                        <div className="mega-col">
                                            {['SsangYong', 'Jeep', 'Others', 'MG'].map(b => (
                                                <a key={b} href={`/?make=${encodeURIComponent(b)}#inventory`} className="mega-item" onClick={() => setMakeOpen(false)}>{b}</a>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mega-dropdown-divider" />
                                    <div className="mega-dropdown-grid">
                                        <div className="mega-col">
                                            {['Mitsubishi', 'Hyundai', 'Jaguar', 'Land Rover'].map(b => (
                                                <a key={b} href={`/?make=${encodeURIComponent(b)}#inventory`} className="mega-item" onClick={() => setMakeOpen(false)}>{b}</a>
                                            ))}
                                        </div>
                                        <div className="mega-col">
                                            {['Tata', 'Toyota', 'Volkswagen', 'Volvo'].map(b => (
                                                <a key={b} href={`/?make=${encodeURIComponent(b)}#inventory`} className="mega-item" onClick={() => setMakeOpen(false)}>{b}</a>
                                            ))}
                                        </div>
                                        <div className="mega-col">
                                            {['Kia', 'Citroen', 'Eicher Motors', 'Ashok Leyland'].map(b => (
                                                <a key={b} href={`/?make=${encodeURIComponent(b)}#inventory`} className="mega-item" onClick={() => setMakeOpen(false)}>{b}</a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Listings / Find Cars */}
                        <Link href="/#find-cars" className="nav-link">
                            LISTINGS
                        </Link>

                        {/* Inventory */}
                        <Link href="/#inventory" className="nav-link">
                            INVENTORY
                        </Link>

                        {/* Contact */}
                        <Link href="/about#contact" className="nav-link">
                            CONTACT
                        </Link>
                    </div>

                    {/* ── Right Side: CTA + Auth ── */}
                    <div className="hidden lg:flex items-center gap-4">
                        <a
                            href="https://wa.me/919677335554"
                            target="_blank"
                            rel="noreferrer"
                            className="px-5 py-2 bg-primary text-black font-bold rounded-full text-sm whitespace-nowrap hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg shadow-primary/20"
                        >
                            LET&apos;S TALK
                        </a>

                        {!authLoading && (
                            user ? (
                                <div ref={userMenuRef} className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                                    >
                                        <User size={16} />
                                    </button>
                                    {userMenuOpen && (
                                        <div className="dropdown-menu w-48 !left-auto right-0 !transform-none">
                                            <div className="px-3 py-2 border-b border-white/5">
                                                <p className="text-xs text-white font-medium truncate">{profile?.full_name || user.email}</p>
                                                <p className="text-xs text-secondary truncate">{user.email}</p>
                                            </div>
                                            {isAdmin && (
                                                <Link href="/admin" className="dropdown-item flex items-center gap-2" onClick={() => setUserMenuOpen(false)}>
                                                    <Shield size={14} /> Admin Panel
                                                </Link>
                                            )}
                                            <button onClick={handleSignOut} className="dropdown-item flex items-center gap-2 w-full text-left text-red-400 hover:!text-red-300 hover:!bg-red-500/10">
                                                <LogOut size={14} /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="px-4 py-2 rounded-full bg-white/5 text-white text-sm font-medium border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                                >
                                    Login
                                </Link>
                            )
                        )}
                    </div>

                    {/* ── Mobile Hamburger ── */}
                    <button
                        className="lg:hidden relative z-[70] text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* ───── Mobile Menu Overlay ───── */}
            <div
                className={`fixed inset-0 z-[55] lg:hidden transition-all duration-500 ${mobileOpen
                    ? 'visible opacity-100'
                    : 'invisible opacity-0'
                    }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />

                {/* Slide-in Panel */}
                <div
                    className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-zinc-950 shadow-2xl shadow-black/50 transition-transform duration-500 ease-out flex flex-col ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <span className="text-lg font-bold text-white tracking-tight">
                            ROUTE <span className="text-primary">60</span>
                        </span>
                        <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white p-1">
                            <X size={22} />
                        </button>
                    </div>

                    {/* Mobile Links */}
                    <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
                        <Link href="/" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                            Home
                        </Link>

                        {/* About accordion */}
                        <button
                            className="mobile-nav-link flex items-center justify-between w-full"
                            onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                        >
                            <span>About</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${mobileAboutOpen ? 'max-h-60' : 'max-h-0'}`}>
                            <Link href="/about" className="mobile-sub-link" onClick={() => setMobileOpen(false)}>Who We Are</Link>
                            <Link href="/about#services" className="mobile-sub-link" onClick={() => setMobileOpen(false)}>What We Do</Link>
                            <Link href="/about#how-it-works" className="mobile-sub-link" onClick={() => setMobileOpen(false)}>How It Works</Link>
                            <Link href="/about#contact" className="mobile-sub-link" onClick={() => setMobileOpen(false)}>Contact Us</Link>
                        </div>

                        {/* Make accordion */}
                        <button
                            className="mobile-nav-link flex items-center justify-between w-full"
                            onClick={() => setMobileMakeOpen(!mobileMakeOpen)}
                        >
                            <span>Make</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${mobileMakeOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${mobileMakeOpen ? 'max-h-[800px]' : 'max-h-0'}`}>
                            <div className="grid grid-cols-2 gap-x-2 px-6 py-2">
                                {allBrands.map(b => (
                                    <a key={b} href={`/?make=${encodeURIComponent(b)}#inventory`} className="mobile-brand-item" onClick={() => setMobileOpen(false)}>{b}</a>
                                ))}
                            </div>
                        </div>

                        <Link href="/#find-cars" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                            Listings
                        </Link>
                        <Link href="/#inventory" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                            Inventory
                        </Link>
                        <Link href="/about#contact" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                            Contact
                        </Link>
                    </div>

                    {/* Mobile Footer */}
                    <div className="p-6 border-t border-white/10 space-y-3">
                        {!authLoading && (
                            user ? (
                                <>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium truncate">{profile?.full_name || user.email}</p>
                                            <p className="text-xs text-secondary">{profile?.role}</p>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 text-white font-medium rounded-full text-sm border border-white/10 hover:bg-white/10 transition-colors"
                                        >
                                            <Shield size={14} />
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 text-red-400 text-sm hover:text-red-300 transition-colors"
                                    >
                                        <LogOut size={14} />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 text-white font-medium rounded-full text-sm border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <User size={14} />
                                    Login / Sign Up
                                </Link>
                            )
                        )}
                        <a
                            href="https://wa.me/919677335554"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-black font-bold rounded-full text-sm hover:bg-white transition-colors"
                        >
                            <MessageCircle size={16} />
                            LET&apos;S TALK
                        </a>
                        <a href="tel:+919677335554" className="flex items-center justify-center gap-2 text-secondary text-sm hover:text-primary transition-colors">
                            <Phone size={14} />
                            +91 96773 35554
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
