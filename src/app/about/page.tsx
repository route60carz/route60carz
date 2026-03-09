import { Car, MapPin, Wrench, FileCheck, BadgeIndianRupee, ShieldCheck, Handshake, Phone, Mail, Clock, ChevronRight, Users, Star, Award } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="flex min-h-screen flex-col bg-black overflow-x-hidden">

            {/* ═══════════════════════════════════════════════ */}
            {/* HERO BANNER */}
            {/* ═══════════════════════════════════════════════ */}
            <section className="relative pt-36 pb-24 px-6 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-black to-zinc-950" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(198,217,50,0.08),transparent_60%)]" />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                }} />

                <div className="relative container mx-auto max-w-5xl text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <Star size={14} className="text-primary" />
                        <span className="text-primary text-xs font-semibold uppercase tracking-widest">Est. 2020</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
                        ABOUT <span className="text-primary">ROUTE 60</span><br />
                        <span className="text-zinc-400 text-2xl md:text-4xl font-light tracking-normal">Carz Trading</span>
                    </h1>
                    <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Theni&apos;s most trusted destination for premium pre-owned vehicles.
                        Quality cars, transparent deals, and a passion for excellence.
                    </p>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════ */}
            {/* ABOUT US — Our Story */}
            {/* ═══════════════════════════════════════════════ */}
            <section id="about" className="py-24 px-6 border-t border-white/5">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter">
                                THE BEST <span className="text-primary">CHOICE</span> FOR YOU
                            </h2>
                            <p className="text-secondary text-lg leading-relaxed mb-6">
                                Route 60 Carz Trading is a trusted source for buying and selling pre-owned cars
                                in Theni and across Tamil Nadu. We curate a wide range of second-hand cars, making
                                sure that you get the best match vehicle for your needs as well as requirements.
                            </p>
                            <p className="text-secondary leading-relaxed mb-6">
                                A user-friendly experience makes it easy for anyone to browse and buy second hand
                                cars with complete assurance. You will find the finest listings with the best value
                                on quality used cars while enjoying a pleasant, hassle-free experience.
                            </p>
                            <p className="text-secondary leading-relaxed mb-8">
                                At Route 60, we don&apos;t just offer you a product, but an experience. Right from
                                offering you technical inputs about cars, evaluating their cost, and verifying the
                                documents, to providing you with assistance in finding loans — we ensure an
                                absolutely hassle-free car buying journey.
                            </p>
                            <Link
                                href="/#inventory"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full text-sm hover:bg-white transition-colors"
                            >
                                Browse Cars <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-white/10">
                                <img
                                    src="/images/showroom.jpg"
                                    alt="Premium car showroom"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Stats overlaid */}
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                <div className="text-center bg-zinc-900/80 border border-white/5 backdrop-blur rounded-xl p-4">
                                    <div className="text-2xl md:text-3xl font-black text-primary">500+</div>
                                    <div className="text-[10px] text-secondary mt-1 uppercase tracking-widest">Cars Sold</div>
                                </div>
                                <div className="text-center bg-zinc-900/80 border border-white/5 backdrop-blur rounded-xl p-4">
                                    <div className="text-2xl md:text-3xl font-black text-primary">5+</div>
                                    <div className="text-[10px] text-secondary mt-1 uppercase tracking-widest">Years Exp.</div>
                                </div>
                                <div className="text-center bg-zinc-900/80 border border-white/5 backdrop-blur rounded-xl p-4">
                                    <div className="text-2xl md:text-3xl font-black text-primary">100%</div>
                                    <div className="text-[10px] text-secondary mt-1 uppercase tracking-widest">Happy Clients</div>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <span className="inline-flex items-center gap-2 bg-primary text-black px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-primary/20">
                                    ⭐ Since 2020
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════ */}
            {/* WHY CHOOSE US */}
            {/* ═══════════════════════════════════════════════ */}
            <section className="py-24 px-6 bg-zinc-950 border-t border-white/5">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter text-center">
                        WHY <span className="text-primary">CHOOSE US</span>
                    </h2>
                    <p className="text-secondary text-center mb-16 max-w-xl mx-auto">
                        A transparent approach is what sets us apart from the crowd. Ethical business practices have been the cornerstone of our success story.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Verified Vehicles', desc: 'Every car undergoes a rigorous 150+ point inspection before being listed. No hidden defects, ever.', icon: ShieldCheck },
                            { title: 'Best Pricing', desc: 'Fair market valuations powered by data. You always get the best price, whether buying or selling.', icon: BadgeIndianRupee },
                            { title: 'Transparent Deals', desc: 'Complete vehicle history, service records, and ownership details. Nothing is hidden from you.', icon: FileCheck },
                            { title: 'Expert Team', desc: 'Our team of automotive specialists bring years of experience to guide your every decision.', icon: Users },
                            { title: 'End-to-End Support', desc: 'From loan assistance to RC transfer and insurance, we handle every step of the process.', icon: Handshake },
                            { title: 'After-Sale Warranty', desc: 'Drive with confidence. Select vehicles come with extended warranty and service packages.', icon: Award },
                        ].map((item) => (
                            <div key={item.title} className="group relative bg-zinc-900/50 border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <item.icon size={32} className="text-primary mb-5 group-hover:scale-110 transition-transform" />
                                <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                                <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════ */}
            {/* WHAT WE DO (Services) */}
            {/* ═══════════════════════════════════════════════ */}
            <section id="services" className="py-24 px-6 border-t border-white/5">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter text-center">
                        WHAT WE <span className="text-primary">DO</span>
                    </h2>
                    <p className="text-secondary text-center mb-16">Everything you need, under one roof</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Buy a Car', desc: 'Browse thousands of verified pre-owned cars and find the perfect match for your needs and budget.', icon: Car },
                            { title: 'Sell Your Car', desc: 'Get an instant, fair valuation and sell your car quickly. We handle everything from paperwork to payment.', icon: BadgeIndianRupee },
                            { title: 'Loan Arrangement', desc: 'Easy financing options tailored to your budget. We partner with leading banks for the best rates.', icon: Handshake },
                            { title: 'Car Evaluation', desc: 'Our experts inspect every vehicle with a rigorous 150+ point checklist ensuring top quality.', icon: ShieldCheck },
                            { title: 'Car Refurbishment', desc: 'Every car is professionally refurbished — from mechanical tuning to cosmetic detailing.', icon: Wrench },
                            { title: 'Document Verification', desc: 'Complete document verification and seamless RC transfer handled by our dedicated team.', icon: FileCheck },
                        ].map((service) => (
                            <div key={service.title} className="service-card group">
                                <service.icon size={36} className="text-primary mb-5 group-hover:scale-110 transition-transform" />
                                <h3 className="text-white font-bold text-xl mb-3">{service.title}</h3>
                                <p className="text-secondary text-sm leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════ */}
            {/* HOW IT WORKS */}
            {/* ═══════════════════════════════════════════════ */}
            <section id="how-it-works" className="py-24 px-6 bg-zinc-950 border-t border-white/5">
                <div className="container mx-auto max-w-5xl text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                        HOW IT <span className="text-primary">WORKS</span>
                    </h2>
                    <p className="text-secondary mb-16">Four simple steps to drive your dream car home</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Fix Your Budget', desc: 'Decide on a comfortable budget range for your next car.', icon: BadgeIndianRupee },
                            { step: '02', title: 'Choose Your Car', desc: 'Browse our curated inventory & pick the perfect vehicle.', icon: Car },
                            { step: '03', title: 'Connect With Us', desc: 'Talk to us directly via WhatsApp or phone for best deals.', icon: Handshake },
                            { step: '04', title: 'Take A Test Drive', desc: 'Visit our showroom, test drive, and seal the deal.', icon: ShieldCheck },
                        ].map((item) => (
                            <div key={item.step} className="how-step-card">
                                <div className="how-step-number">{item.step}</div>
                                <item.icon size={32} className="text-primary mb-4" />
                                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════ */}
            {/* GET IN TOUCH */}
            {/* ═══════════════════════════════════════════════ */}
            <section id="contact" className="py-24 px-6 border-t border-white/5">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter text-center">
                        GET IN <span className="text-primary">TOUCH</span>
                    </h2>
                    <p className="text-secondary text-center mb-16">
                        Whether it is buying, selling or any query — our team is always here to help
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="contact-card">
                            <MapPin size={28} className="text-primary mb-4" />
                            <h3 className="text-white font-bold text-lg mb-2">Our Location</h3>
                            <p className="text-secondary text-sm">
                                7, Route 60 Cars Trading,<br />
                                near Little Kids School,<br />
                                Periyakulam, Endapuli,<br />
                                Tamil Nadu 625601
                            </p>
                        </div>
                        <div className="contact-card">
                            <Phone size={28} className="text-primary mb-4" />
                            <h3 className="text-white font-bold text-lg mb-2">Call Us</h3>
                            <a href="tel:+919677335554" className="text-primary font-bold text-lg hover:underline">+91 96773 35554</a>
                            <a href="mailto:route60carz@gmail.com" className="flex items-center gap-2 text-secondary text-sm mt-2 hover:text-primary transition-colors">
                                <Mail size={14} /> route60carz@gmail.com
                            </a>
                        </div>
                        <div className="contact-card">
                            <Clock size={28} className="text-primary mb-4" />
                            <h3 className="text-white font-bold text-lg mb-2">Business Hours</h3>
                            <p className="text-secondary text-sm">Mon - Sat: 9:00 AM - 8:00 PM</p>
                            <p className="text-secondary text-sm">Sun: 10:00 AM - 6:00 PM</p>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <a
                            href="https://wa.me/919677335554"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-black font-bold rounded-full text-sm hover:bg-white transition-colors shadow-lg shadow-primary/20"
                        >
                            💬 LET&apos;S TALK ON WHATSAPP
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
