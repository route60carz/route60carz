'use client'

import React, { useEffect, useState } from 'react';
import {
    Loader2,
    MessageSquare,
    Phone,
    User,
    Calendar,
    Car,
    Mail,
    CheckCircle,
    Clock,
    XCircle,
    ExternalLink,
    Filter,
    Trash2
} from 'lucide-react';
import Link from 'next/link';

interface ContactInquiry {
    id: string;
    car_id: string;
    user_id: string;
    name: string;
    phone: string;
    message: string | null;
    status: 'new' | 'contacted' | 'closed';
    created_at: string;
    car_make: string | null;
    car_model: string | null;
    car_year: number | null;
    user_email: string | null;
    user_full_name: string | null;
}

type StatusFilter = 'all' | 'new' | 'contacted' | 'closed';

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/contact-inquiries');
            const data = await res.json();

            if (!res.ok) {
                setError(`Failed to load inquiries: ${data.error || 'Unknown error'}`);
            } else {
                setInquiries(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            setError(`Failed to load inquiries: ${err instanceof Error ? err.message : 'Unknown error'}`);
            console.error('Error fetching inquiries:', err);
        }
        setLoading(false);
    };

    const updateStatus = async (inquiryId: string, newStatus: 'new' | 'contacted' | 'closed') => {
        setUpdating(inquiryId);

        try {
            const res = await fetch('/api/contact-inquiries', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: inquiryId, status: newStatus }),
            });

            if (res.ok) {
                setInquiries(inquiries.map(inq =>
                    inq.id === inquiryId ? { ...inq, status: newStatus } : inq
                ));
            } else {
                console.error('Error updating status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
        setUpdating(null);
    };

    const deleteInquiry = async (inquiryId: string) => {
        if (!confirm('Are you sure you want to delete this inquiry?')) return;
        
        setUpdating(inquiryId);
        try {
            const res = await fetch(`/api/contact-inquiries/${inquiryId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setInquiries(inquiries.filter(inq => inq.id !== inquiryId));
            } else {
                console.error('Error deleting inquiry');
            }
        } catch (err) {
            console.error('Error deleting inquiry:', err);
        }
        setUpdating(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'new':
                return <Clock size={12} />;
            case 'contacted':
                return <CheckCircle size={12} />;
            case 'closed':
                return <XCircle size={12} />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
            case 'contacted':
                return 'bg-primary/20 text-primary border-primary/20';
            case 'closed':
                return 'bg-white/10 text-secondary border-white/10';
            default:
                return 'bg-white/10 text-secondary border-white/10';
        }
    };

    const filteredInquiries = statusFilter === 'all'
        ? inquiries
        : inquiries.filter(inq => inq.status === statusFilter);

    const statusCounts = {
        all: inquiries.length,
        new: inquiries.filter(inq => inq.status === 'new').length,
        contacted: inquiries.filter(inq => inq.status === 'contacted').length,
        closed: inquiries.filter(inq => inq.status === 'closed').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <MessageSquare size={24} className="text-primary" />
                        Contact Inquiries
                    </h1>
                    <p className="text-secondary text-sm mt-1">
                        Manage customer contact requests
                    </p>
                </div>
                <div className="text-sm text-secondary">
                    {inquiries.length} total inquiries
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                <Filter size={16} className="text-secondary flex-shrink-0" />
                {(['all', 'new', 'contacted', 'closed'] as StatusFilter[]).map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${statusFilter === status
                            ? 'bg-primary text-black'
                            : 'bg-white/5 text-secondary hover:bg-white/10'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        <span className="ml-2 opacity-60">({statusCounts[status]})</span>
                    </button>
                ))}
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            {filteredInquiries.length === 0 ? (
                <div className="text-center py-20">
                    <MessageSquare size={48} className="text-secondary mx-auto mb-4" />
                    <p className="text-secondary">
                        {statusFilter === 'all'
                            ? 'No inquiries found'
                            : `No ${statusFilter} inquiries`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredInquiries.map((inquiry) => (
                        <div
                            key={inquiry.id}
                            className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                {/* Main Info */}
                                <div className="flex-1 space-y-3">
                                    {/* Car Info */}
                                    {inquiry.car_make && (
                                        <div className="flex items-center gap-2 text-primary">
                                            <Car size={16} />
                                            <Link
                                                href={`/cars/${inquiry.car_id}`}
                                                className="font-medium hover:underline flex items-center gap-1"
                                            >
                                                {inquiry.car_year} {inquiry.car_make} {inquiry.car_model}
                                                <ExternalLink size={12} />
                                            </Link>
                                        </div>
                                    )}

                                    {/* Contact Info */}
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-2 text-white">
                                            <User size={14} className="text-secondary" />
                                            <span className="font-medium">{inquiry.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-secondary">
                                            <Phone size={14} />
                                            <a
                                                href={`tel:${inquiry.phone}`}
                                                className="hover:text-primary transition-colors"
                                            >
                                                {inquiry.phone}
                                            </a>
                                        </div>
                                        {inquiry.user_email && (
                                            <div className="flex items-center gap-2 text-secondary">
                                                <Mail size={14} />
                                                <span>{inquiry.user_email}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Message */}
                                    {inquiry.message && (
                                        <p className="text-secondary text-sm bg-white/5 rounded-lg p-3 mt-2">
                                            &quot;{inquiry.message}&quot;
                                        </p>
                                    )}

                                    {/* Date */}
                                    <div className="flex items-center gap-2 text-xs text-secondary">
                                        <Calendar size={12} />
                                        {formatDate(inquiry.created_at)}
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex flex-col items-end gap-3">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(inquiry.status)}`}>
                                        {getStatusIcon(inquiry.status)}
                                        {inquiry.status}
                                    </span>

                                    {/* Status Actions */}
                                    <div className="flex items-center gap-2">
                                        {inquiry.status !== 'contacted' && (
                                            <button
                                                onClick={() => updateStatus(inquiry.id, 'contacted')}
                                                disabled={updating === inquiry.id}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50"
                                            >
                                                {updating === inquiry.id ? <Loader2 size={12} className="animate-spin" /> : 'Mark Contacted'}
                                            </button>
                                        )}
                                        {inquiry.status !== 'closed' && (
                                            <button
                                                onClick={() => updateStatus(inquiry.id, 'closed')}
                                                disabled={updating === inquiry.id}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-secondary hover:bg-white/10 transition-colors disabled:opacity-50"
                                            >
                                                Close
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteInquiry(inquiry.id)}
                                            disabled={updating === inquiry.id}
                                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                            title="Delete Inquiry"
                                        >
                                            {updating === inquiry.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
