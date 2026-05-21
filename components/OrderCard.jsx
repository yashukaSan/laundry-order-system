'use client';

import Link from 'next/link';
import StatusBadge from './StatusBadge';

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function OrderCard({ order }) {
    const { orderId, customerName, phoneNumber, totalAmount, status, createdAt, garments } = order;

    const garmentSummary = garments
        .map((g) => `${g.type} ×${g.quantity}`)
        .join(', ');

    return (
        <Link href={`/orders/${orderId}`}>
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                        <p className="text-xs font-mono text-gray-400 mb-1 truncate">{orderId}</p>
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors truncate">
                            {customerName}
                        </h3>
                        <p className="text-sm text-gray-500">{phoneNumber}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <StatusBadge status={status} />
                    </div>
                </div>

                {/* Garments summary */}
                <p className="text-sm text-gray-500 mb-3 truncate" title={garmentSummary}>
                    {garmentSummary}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-400">{formatDate(createdAt)}</span>
                    <span className="font-bold text-gray-900">₹{totalAmount}</span>
                </div>
            </div>
        </Link>
    );
}
