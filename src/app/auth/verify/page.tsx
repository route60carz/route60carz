'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Loader2, ShieldCheck } from 'lucide-react';

function VerifyForm() {
    const { verifyEmail } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get('email') || '';

    const [email] = useState(emailFromUrl);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!emailFromUrl) {
            router.push('/auth/login');
        }
    }, [emailFromUrl, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await verifyEmail(email, otp);
        if (error) {
            setError(error);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => router.push('/'), 1500);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="w-full max-w-md text-center">
                    <div className="auth-card">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={32} className="text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                        <p className="text-secondary mb-6">
                            Your account has been verified. Redirecting you now...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-black text-white tracking-tighter">
                            ROUTE <span className="text-primary">60</span>
                        </h1>
                    </Link>
                </div>

                <div className="auth-card">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Mail size={32} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 text-center">Verify your email</h2>
                    <p className="text-secondary mb-6 text-center">
                        We&apos;ve sent a 6-digit OTP to <span className="text-white font-medium">{email}</span>.
                        Enter it below to verify your account.
                    </p>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="auth-label">Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter 6-digit OTP"
                                required
                                maxLength={6}
                                className="auth-input text-center text-2xl tracking-[0.5em] font-mono"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="auth-btn-primary w-full"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Verify Email'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-secondary mt-6">
                        Didn&apos;t receive the code? Check your spam folder or{' '}
                        <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                            try again
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 size={40} className="text-primary animate-spin" />
            </div>
        }>
            <VerifyForm />
        </Suspense>
    );
}
