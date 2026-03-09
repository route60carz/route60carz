'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: 'user' | 'admin';
    created_at: string;
}

interface AuthContextType {
    user: { email: string } | null;
    profile: Profile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: string | null; verifyNeeded?: boolean }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; verifyNeeded?: boolean }>;
    verifyEmail: (email: string, otp: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<{ email: string } | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch session on load
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser({ email: data.user.email });
                    setProfile(data.user);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                if (data.needsVerification) {
                    // Automatically trigger an OTP resend by hitting register in resend mode
                    fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, resend: true }),
                    }).catch(console.error);

                    return { error: data.error, verifyNeeded: true };
                }
                return { error: data.error || 'Failed to login' };
            }

            setUser({ email: data.user.email });
            setProfile(data.user);
            return { error: null };
        } catch (error: any) {
            return { error: 'Network error occurred.' };
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, fullName: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name: fullName }),
            });
            const data = await res.json();

            if (!res.ok) {
                return { error: data.error || 'Failed to register' };
            }

            // OTP sent successfully
            return { error: null, verifyNeeded: true };
        } catch (error: any) {
            return { error: 'Network error occurred.' };
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (email: string, otp: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();

            if (!res.ok) {
                return { error: data.error || 'Invalid OTP' };
            }

            setUser({ email: data.user.email });
            setProfile(data.user);
            return { error: null };
        } catch (error: any) {
            return { error: 'Network error occurred.' };
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = profile?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            signIn,
            signUp,
            verifyEmail,
            signOut,
            isAdmin,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
