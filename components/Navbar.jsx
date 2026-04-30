'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/orders', label: 'Orders' },
    { href: '/orders/create', label: '+ New Order' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-2xl">🧺</span>
                        <span className="font-bold text-gray-900 text-lg tracking-tight">LaundryPro</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-1">
                        {navLinks.map(({ href, label }) => {
                            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href) && href !== '/orders/create');
                            const isNew = href === '/orders/create';

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isNew
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : isActive
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}