'use client';

import Link from 'next/link';
import StatusBadge from './StatusBadge';

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function OrderCard({ order, onDelete }) {
    const { orderId, customerName, phoneNumber, totalAmount, status, createdAt, garments } = order;

    const garmentSummary = garments
        .map((g) => `${g.type} ×${g.quantity}`)
        .join(', ');

    return (
        <div className="relative">
            <Link href={`/orders/${orderId || order._id}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                        <p className="text-xs font-mono text-gray-400 mb-1">{orderId}</p>
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {customerName}
                        </h3>
                        <p className="text-sm text-gray-500">{phoneNumber}</p>
                    </div>
                    <StatusBadge status={status} />
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
        {onDelete && (
            <button
                type="button"
                onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onDelete(orderId);
                }}
                className="absolute top-14 right-8 bg-red-100 text-red-700 px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors"
            >
                Delete
            </button>
        )}
        </div>
    );
}