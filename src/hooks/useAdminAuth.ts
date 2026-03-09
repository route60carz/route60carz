'use client'

import { useState, useEffect, useCallback } from 'react';

const ADMIN_STORAGE_KEY = 'route60_admin_auth';

interface AdminAuthState {
    isAdmin: boolean;
    loading: boolean;
    email: string | null;
}

export function useAdminAuth() {
    const [state, setState] = useState<AdminAuthState>({
        isAdmin: false,
        loading: true,
        email: null,
    });

    useEffect(() => {
        // Function to check local storage
        const checkAuth = () => {
            try {
                const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.authenticated && parsed.email) {
                        setState({ isAdmin: true, loading: false, email: parsed.email });
                        return;
                    }
                }
            } catch {
                // Ignore parse errors
            }
            setState({ isAdmin: false, loading: false, email: null });
        };

        // Initial check
        checkAuth();

        // Listen for custom auth events from other hook instances
        window.addEventListener('admin-auth-change', checkAuth);
        // Also listen for cross-tab storage changes
        window.addEventListener('storage', checkAuth);

        return () => {
            window.removeEventListener('admin-auth-change', checkAuth);
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    const login = useCallback((email: string, password: string): { success: boolean; error: string | null } => {
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            return { success: false, error: 'Admin credentials not configured.' };
        }

        if (email === adminEmail && password === adminPassword) {
            const session = { authenticated: true, email, timestamp: Date.now() };
            localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
            setState({ isAdmin: true, loading: false, email });
            // Notify other instances (like AdminLayout)
            window.dispatchEvent(new Event('admin-auth-change'));
            return { success: true, error: null };
        }

        return { success: false, error: 'Invalid email or password.' };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        setState({ isAdmin: false, loading: false, email: null });
        // Notify other instances
        window.dispatchEvent(new Event('admin-auth-change'));
    }, []);

    return { ...state, login, logout };
}
