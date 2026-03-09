'use client'

import React, { useEffect, useState } from 'react';
import {
    Car,
    DollarSign,
    CheckCircle,
    Clock,
    Loader2,
    Users,
    MessageSquare,
    TrendingUp,
    Calendar,
    ArrowUpRight,
    Plus,
    Eye,
    ExternalLink,
    Phone,
    User
} from 'lucide-react';
import Link from 'next/link';

interface CarStats {
    total: number;
    available: number;
    sold: number;
    pending: number;
}

interface RecentInquiry {
    id: string;
    name: string;
    phone: string;
    car_make: string;
    car_model: string;
    car_year: number;
    status: string;
    created_at: string;
}

interface RecentCar {
    id: string;
    make: string;
    model: string;
    year: number;
    status: string;
    price: number;
    created_at: string;
}

export default function AdminDashboard() {
    const [carStats, setCarStats] = useState<CarStats>({ total: 0, available: 0, sold: 0, pending: 0 });
    const [userCount, setUserCount] = useState(0);
    const [inquiryCount, setInquiryCount] = useState(0);
    const [newInquiryCount, setNewInquiryCount] = useState(0);
    const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
    const [recentCars, setRecentCars] = useState<RecentCar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);

        try {
            // Fetch all cars
            const carsRes = await fetch('/api/cars');
            const carsData = await carsRes.json();
            if (Array.isArray(carsData)) {
                setCarStats({
                    total: carsData.length,
                    available: carsData.filter((c: { status: string }) => c.status === 'available').length,
                    sold: carsData.filter((c: { status: string }) => c.status === 'sold').length,
                    pending: carsData.filter((c: { status: string }) => c.status === 'pending').length,
                });

                // Get recent 5 cars
                setRecentCars(carsData.slice(0, 5));
            }

            // Fetch user count
            const usersRes = await fetch('/api/profiles');
            const usersData = await usersRes.json();
            if (Array.isArray(usersData)) {
                setUserCount(usersData.length);
            }

            // Fetch inquiry counts
            const inquiriesRes = await fetch('/api/contact-inquiries');
            const inquiriesData = await inquiriesRes.json();
            if (Array.isArray(inquiriesData)) {
                setInquiryCount(inquiriesData.length);
                setNewInquiryCount(inquiriesData.filter((i: { status: string }) => i.status === 'new').length);

                // Get recent 5 inquiries
                const recent = inquiriesData
                    .sort((a: { created_at: string }, b: { created_at: string }) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    )
                    .slice(0, 5)
                    .map((item: {
                        id: string;
                        name: string;
                        phone: string;
                        car_make: string;
                        car_model: string;
                        car_year: number;
                        status: string;
                        created_at: string;
                    }) => ({
                        id: item.id,
                        name: item.name,
                        phone: item.phone,
                        car_make: item.car_make,
                        car_model: item.car_model,
                        car_year: item.car_year,
                        status: item.status,
                        created_at: item.created_at
                    }));
                setRecentInquiries(recent);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        }

        setLoading(false);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-emerald-500/20 text-emerald-400';
            case 'sold':
                return 'bg-blue-500/20 text-blue-400';
            case 'pending':
                return 'bg-amber-500/20 text-amber-400';
            case 'new':
                return 'bg-primary/20 text-primary';
            case 'contacted':
                return 'bg-emerald-500/20 text-emerald-400';
            case 'closed':
                return 'bg-white/10 text-secondary';
            default:
                return 'bg-white/10 text-secondary';
        }
    };

    const statsCards = [
        {
            label: 'Total Cars',
            value: carStats.total,
            icon: Car,
            color: 'text-primary',
            bg: 'bg-primary/10',
            trend: '+12%',
            trendUp: true
        },
        {
            label: 'Available',
            value: carStats.available,
            icon: CheckCircle,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            trend: '+5%',
            trendUp: true
        },
        {
            label: 'Sold',
            value: carStats.sold,
            icon: DollarSign,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            trend: '+8%',
            trendUp: true
        },
        {
            label: 'Pending',
            value: carStats.pending,
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
            trend: '-2%',
            trendUp: false
        },
    ];

    const additionalStats = [
        {
            label: 'Total Users',
            value: userCount,
            icon: Users,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            href: '/admin/users'
        },
        {
            label: 'Total Inquiries',
            value: inquiryCount,
            icon: MessageSquare,
            color: 'text-cyan-400',
            bg: 'bg-cyan-400/10',
            href: '/admin/inquiries'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-secondary text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/cars"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/80 transition-colors"
                    >
                        <Plus size={16} />
                        Add Car
                    </Link>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((card) => (
                    <div key={card.label} className="admin-stat-card group">
                        <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                                <card.icon size={24} className={card.color} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                <TrendingUp size={12} className={card.trendUp ? '' : 'rotate-180'} />
                                {card.trend}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-3xl font-black text-white">{card.value}</p>
                            <p className="text-sm text-secondary mt-1">{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {additionalStats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="admin-stat-card group flex items-center justify-between hover:border-primary/30 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                <stat.icon size={24} className={stat.color} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-sm text-secondary">{stat.label}</p>
                            </div>
                        </div>
                        <ArrowUpRight size={20} className="text-secondary group-hover:text-primary transition-colors" />
                    </Link>
                ))}
            </div>

            {/* New Inquiries Alert */}
            {newInquiryCount > 0 && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <MessageSquare size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-white font-medium">{newInquiryCount} New Inquir{newInquiryCount === 1 ? 'y' : 'ies'}</p>
                            <p className="text-secondary text-sm">You have new contact inquiries waiting for response</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/inquiries"
                        className="px-4 py-2 rounded-lg bg-primary text-black font-bold text-sm hover:bg-primary/80 transition-colors"
                    >
                        View All
                    </Link>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Inquiries */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white">Recent Inquiries</h2>
                            <p className="text-secondary text-sm">Latest contact requests</p>
                        </div>
                        <Link
                            href="/admin/inquiries"
                            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                        >
                            View All <ExternalLink size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentInquiries.length === 0 ? (
                            <div className="p-8 text-center">
                                <MessageSquare size={32} className="text-secondary mx-auto mb-2" />
                                <p className="text-secondary text-sm">No inquiries yet</p>
                            </div>
                        ) : (
                            recentInquiries.map((inquiry) => (
                                <div key={inquiry.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <User size={16} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{inquiry.name}</p>
                                                <p className="text-secondary text-sm flex items-center gap-1">
                                                    <Phone size={12} />
                                                    {inquiry.phone}
                                                </p>
                                                <p className="text-xs text-secondary mt-1">
                                                    {inquiry.car_year} {inquiry.car_make} {inquiry.car_model}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                                                {inquiry.status}
                                            </span>
                                            <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                                                <Calendar size={10} />
                                                {formatDate(inquiry.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Cars */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white">Recent Cars</h2>
                            <p className="text-secondary text-sm">Latest inventory additions</p>
                        </div>
                        <Link
                            href="/admin/cars"
                            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                        >
                            View All <ExternalLink size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentCars.length === 0 ? (
                            <div className="p-8 text-center">
                                <Car size={32} className="text-secondary mx-auto mb-2" />
                                <p className="text-secondary text-sm">No cars added yet</p>
                            </div>
                        ) : (
                            recentCars.map((car) => (
                                <Link
                                    key={car.id}
                                    href={`/cars/${car.id}`}
                                    className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4 block"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                            <Car size={16} className="text-secondary" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                {car.year} {car.make} {car.model}
                                            </p>
                                            <p className="text-primary text-sm font-medium">
                                                {formatPrice(car.price)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                                            {car.status}
                                        </span>
                                        <p className="text-xs text-secondary mt-1 flex items-center gap-1 justify-end">
                                            <Calendar size={10} />
                                            {formatDate(car.created_at)}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Link
                        href="/admin/cars"
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all group"
                    >
                        <Plus size={24} className="text-secondary group-hover:text-primary transition-colors" />
                        <span className="text-sm text-secondary group-hover:text-white transition-colors">Add Car</span>
                    </Link>
                    <Link
                        href="/admin/cars"
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all group"
                    >
                        <Eye size={24} className="text-secondary group-hover:text-primary transition-colors" />
                        <span className="text-sm text-secondary group-hover:text-white transition-colors">View Inventory</span>
                    </Link>
                    <Link
                        href="/admin/inquiries"
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all group"
                    >
                        <MessageSquare size={24} className="text-secondary group-hover:text-primary transition-colors" />
                        <span className="text-sm text-secondary group-hover:text-white transition-colors">Inquiries</span>
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all group"
                    >
                        <ExternalLink size={24} className="text-secondary group-hover:text-primary transition-colors" />
                        <span className="text-sm text-secondary group-hover:text-white transition-colors">View Website</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
