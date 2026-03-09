'use client'

import React, { useState } from 'react';
import { X, Loader2, User, Phone, MessageSquare } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

interface ContactInquiryFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
    carId: string;
    carName: string;
}

export default function ContactInquiryForm({
    isOpen,
    onClose,
    onSubmitSuccess,
    carId,
    carName
}: ContactInquiryFormProps) {
    const { profile } = useAuth();
    const [name, setName] = useState(profile?.full_name || '');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setError(null);
            setMessage('');
            if (profile?.full_name && !name) {
                setName(profile.full_name);
            }
        }
    }, [isOpen, profile, name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('/api/contact-inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    car_id: carId,
                    name,
                    phone,
                    message: message || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
            }

            console.log('Inquiry submitted successfully:', data);

            // Reset form
            setName('');
            setPhone('');
            setMessage('');
            onSubmitSuccess();
        } catch (err) {
            console.error('Submit error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-secondary hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Contact Us</h2>
                    <p className="text-secondary text-sm">
                        Interested in <span className="text-primary font-medium">{carName}</span>
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-secondary uppercase tracking-widest mb-2">
                            Your Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-secondary uppercase tracking-widest mb-2">
                            Phone Number <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your phone number"
                                required
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit phone number"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-secondary uppercase tracking-widest mb-2">
                            Message <span className="text-secondary">(Optional)</span>
                        </label>
                        <div className="relative">
                            <MessageSquare size={16} className="absolute left-3 top-3 text-secondary" />
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Any specific questions or requirements?"
                                rows={3}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name || !phone}
                        className="w-full py-3 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Submit Inquiry'}
                    </button>
                </form>
            </div>
        </div>
    );
}
