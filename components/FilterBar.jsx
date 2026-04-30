'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

const STATUS_OPTIONS = ['', 'RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

export default function FilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Update a single param while keeping others
    const updateParam = useCallback(
        (key, value) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            router.push(`${pathname}?${params.toString()}`);
        },
        [router, pathname, searchParams]
    );

    const clearAll = () => {
        router.push(pathname);
    };

    const hasFilters = search || status;

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Search input */}
            <input
                type="text"
                value={search}
                onChange={(e) => updateParam('search', e.target.value)}
                placeholder="Search by name or phone..."
                className="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            {/* Status filter */}
            <select
                value={status}
                onChange={(e) => updateParam('status', e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700"
            >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.filter(Boolean).map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>

            {/* Clear filters */}
            {hasFilters && (
                <button
                    onClick={clearAll}
                    className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Clear
                </button>
            )}
        </div>
    );
}