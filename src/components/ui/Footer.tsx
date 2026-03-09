import Link from 'next/link';
import { Phone, Mail, Instagram, Facebook, Youtube, Linkedin, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative z-10 bg-zinc-950 border-t border-white/5 pt-16 pb-8 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/route_60_carz.png" alt="Route 60" className="w-10 h-10 object-contain" />
                            <span className="text-lg font-bold text-white">ROUTE <span className="text-primary">60</span></span>
                        </div>
                        <p className="text-secondary text-sm leading-relaxed mb-6">
                            Theni&apos;s premier destination for premium pre-owned vehicles. Quality cars, transparent deals.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/ROUTE6OCARZ" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-secondary hover:text-white hover:bg-primary transition-all duration-300" aria-label="Facebook">
                                <Facebook size={18} />
                            </a>
                            <a href="https://www.instagram.com/route60carz" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-secondary hover:text-white hover:bg-[#E4405F] transition-all duration-300" aria-label="Instagram">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-secondary hover:text-white hover:bg-[#FF0000] transition-all duration-300" aria-label="YouTube">
                                <Youtube size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-secondary hover:text-white hover:bg-[#0A66C2] transition-all duration-300" aria-label="LinkedIn">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Popular Brands */}
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Popular Brands</h4>
                        <ul className="space-y-2">
                            {['Maruti Suzuki', 'Hyundai', 'Mahindra', 'Toyota', 'Honda', 'Kia'].map(b => (
                                <li key={b}><Link href={`/?make=${encodeURIComponent(b)}#inventory`} className="text-secondary text-sm hover:text-primary transition-colors">{b}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* What We Do */}
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">What We Do</h4>
                        <ul className="space-y-2">
                            {[
                                { label: 'Buy a Car', href: '/about#services' },
                                { label: 'Sell Your Car', href: '/about#services' },
                                { label: 'Loan Arrangement', href: '/about#services' },
                                { label: 'Car Evaluation', href: '/about#services' },
                                { label: 'Car Refurbishment', href: '/about#services' },
                                { label: 'Document Verification', href: '/about#services' },
                            ].map(item => (
                                <li key={item.label}><Link href={item.href} className="text-secondary text-sm hover:text-primary transition-colors">{item.label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Contact Us</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="tel:+919677335554" className="flex items-center gap-2 text-secondary text-sm hover:text-primary transition-colors">
                                    <Phone size={14} /> +91 96773 35554
                                </a>
                            </li>
                            <li>
                                <a href="mailto:route60carz@gmail.com" className="flex items-center gap-2 text-secondary text-sm hover:text-primary transition-colors">
                                    <Mail size={14} /> route60carz@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="https://wa.me/919677335554" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-secondary text-sm hover:text-green-400 transition-colors">
                                    💬 WhatsApp Us
                                </a>
                            </li>
                            <li>
                                <div className="flex items-start gap-2 text-secondary text-sm">
                                    <MapPin size={14} className="mt-0.5 shrink-0" />
                                    <span>7, Route 60 Cars Trading, near Little Kids School, Periyakulam, Endapuli, Tamil Nadu 625601</span>
                                </div>
                            </li>
                        </ul>

                        <div className="mt-6">
                            <a
                                href="https://wa.me/919677335554"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-bold rounded-full text-sm hover:bg-white transition-colors"
                            >
                                LET&apos;S TALK
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-zinc-600 tracking-widest uppercase">
                        &copy; {new Date().getFullYear()} Route 60 Carz Trading. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-xs text-zinc-600 hover:text-secondary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-xs text-zinc-600 hover:text-secondary transition-colors">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
