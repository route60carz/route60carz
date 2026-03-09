'use client'

import { usePathname } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');
    const isAuth = pathname.startsWith('/auth');
    const hideChrome = isAdmin || isAuth;

    if (hideChrome) {
        return <>{children}</>;
    }

    return (
        <SmoothScroll>
            <Navbar />
            {children}
            <Footer />
        </SmoothScroll>
    );
}
