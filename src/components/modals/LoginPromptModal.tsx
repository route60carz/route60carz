'use client'

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Lock, User as UserIcon, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function LoginPromptModal({ isOpen, onClose, onSuccess }: LoginPromptModalProps) {
    const { signIn, signUp, verifyEmail } = useAuth();
    const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (mode === 'verify') {
            const { error: authError } = await verifyEmail(email, otp);
            if (authError) {
                setError(authError);
            } else {
                onSuccess();
            }
            setLoading(false);
            return;
        }

        const action = mode === 'login'
            ? signIn(email, password)
            : signUp(email, password, fullName);

        const { error: authError, verifyNeeded } = await action;

        if (authError) {
            setError(authError);
        } else if (verifyNeeded) {
            setMode('verify');
        } else {
            onSuccess();
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-sm relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-secondary hover:text-white transition-colors"
                    disabled={loading}
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                        {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Verify Email'}
                    </h2>
                    <p className="text-secondary text-sm mb-6">
                        {mode === 'login'
                            ? 'Sign in to contact the seller and view details.'
                            : mode === 'register' ? 'Sign up to build your profile and submit inquiries.'
                                : `We sent a 6-digit code to ${email}.`}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'verify' ? (
                            <div className="relative">
                                <ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-secondary/50 font-mono tracking-widest text-center"
                                />
                            </div>
                        ) : (
                            <>
                                {mode === 'register' && (
                                    <div className="relative">
                                        <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Full Name"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-secondary/50"
                                        />
                                    </div>
                                )}

                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-secondary/50"
                                    />
                                </div>

                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                                    <input
                                        type="password"
                                        required
                                        placeholder="Password"
                                        minLength={6}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-secondary/50"
                                    />
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Sign Up' : 'Verify'}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {mode !== 'verify' && (
                        <div className="mt-6 text-center text-sm">
                            <span className="text-secondary">
                                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            </span>
                            <button
                                type="button"
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                className="text-primary font-bold hover:text-white transition-colors"
                            >
                                {mode === 'login' ? 'Sign up' : 'Sign in'}
                            </button>
                        </div>
                    )}

                    {mode === 'verify' && (
                        <div className="mt-6 text-center text-sm flex flex-col items-center gap-2">
                            <span className="text-secondary">Didn't receive the code?</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setLoading(true);
                                    // Resend OTP via standard register route with 'resend' flag logic we added
                                    fetch('/api/auth/register', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ email, resend: true }),
                                    }).finally(() => setLoading(false));
                                }}
                                className="text-primary font-bold hover:text-white transition-colors"
                            >
                                Resend OTP
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('login')}
                                className="text-secondary mt-2 underline hover:text-white transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
