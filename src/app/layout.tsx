import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppFooter from '@/layout/AppFooter';
import AppNavbar from '@/layout/AppNavbar';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: '学而思编程 - 受益一生的能力',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AppNavbar />
                <div className="mt-5 mb-5 flex-1">{children}</div>
                <AppFooter />
            </body>
        </html>
    );
}
