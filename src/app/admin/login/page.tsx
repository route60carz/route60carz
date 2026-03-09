'use client'

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, Shield } from 'lucide-react';

export default function AdminLoginPage() {
    const { login, isAdmin, loading: authLoading } = useAdminAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already logged in as admin
    useEffect(() => {
        if (!authLoading && isAdmin) {
            router.push('/admin');
        }
    }, [isAdmin, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { success, error } = login(email, password);
        if (!success) {
            setError(error);
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 size={40} className="text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-black text-white tracking-tighter">
                            ROUTE <span className="text-primary">60</span>
                        </h1>
                    </Link>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <Shield size={20} className="text-primary" />
                        <span className="text-white font-bold">Admin Portal</span>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                    {/* Header */}
                    <h2 className="text-xl font-bold text-white mb-2 text-center">Admin Sign In</h2>
                    <p className="text-secondary text-sm text-center mb-6">
                        Enter your admin credentials to access the dashboard
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-secondary uppercase tracking-widest mb-2">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-secondary uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Sign In to Admin'}
                        </button>
                    </form>

                    {/* Back to site */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-secondary text-sm hover:text-white transition-colors">
                            ← Back to Website
                        </Link>
                    </div>
                </div>

                {/* Info */}
                <p className="text-center text-xs text-secondary mt-6">
                    This area is restricted to administrators only.
                </p>
            </div>
        </div>
    );
}
