'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Car,
    ChevronLeft,
    ChevronRight,
    Shield,
    Menu,
    X,
    Users,
    MessageSquare,
    LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Manage Cars', href: '/admin/cars', icon: Car },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const sidebar = (
        <aside
            className={`admin-sidebar ${collapsed ? 'admin-sidebar-collapsed' : ''}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <Link href="/admin" className="flex items-center gap-2">
                            <Shield size={20} className="text-primary" />
                            <span className="text-white font-black text-sm tracking-tight">
                                ADMIN
                            </span>
                        </Link>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-secondary hover:text-white hover:bg-white/5 transition-colors"
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-secondary hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`admin-nav-item ${isActive ? 'admin-nav-item-active' : ''}`}
                        >
                            <item.icon size={18} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-2">
                <Link
                    href="/"
                    className="admin-nav-item mt-1 text-secondary hover:text-white w-full"
                >
                    <ChevronLeft size={18} className="shrink-0" />
                    {!collapsed && <span className="whitespace-nowrap">Back to Site</span>}
                </Link>

                <button
                    onClick={() => {
                        // Clear the local storage session
                        localStorage.removeItem('route60_admin_auth');
                        window.dispatchEvent(new Event('admin-auth-change'));
                        window.location.href = '/admin/login';
                    }}
                    className="admin-nav-item text-red-500 hover:text-red-400 hover:bg-red-500/10 w-full text-left"
                >
                    <LogOut size={18} className="text-red-500 shrink-0" />
                    {!collapsed && <span className="whitespace-nowrap">Log Out</span>}
                </button>
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white shadow-lg"
            >
                <Menu size={18} />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:block">{sidebar}</div>

            {/* Mobile sidebar */}
            <div
                className={`lg:hidden fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {sidebar}
            </div>
        </>
    );
}
