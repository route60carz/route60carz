'use client'

import React, { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAdmin, loading } = useAdminAuth();
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (!loading && !isAdmin && !isLoginPage) {
            router.push('/admin/login');
        }
    }, [isAdmin, loading, isLoginPage, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAdmin && !isLoginPage) {
        return null; // Will redirect in useEffect
    }

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex">
            <AdminSidebar />
            <main className="flex-1 lg:ml-64 min-h-screen">
                <div className="p-6 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
