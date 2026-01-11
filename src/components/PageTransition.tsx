'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import gsap from '@/lib/gsap';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const ref = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
        return () => {
            gsap.to(el, { opacity: 0, y: -10, duration: 0.25, ease: 'power1.in' });
        };
    }, [pathname]);

    return (
        <div ref={ref} style={{ width: '100%' }}>
            {children}
        </div>
    );
}
