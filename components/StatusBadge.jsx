'use client';

const statusStyles = {
    RECEIVED: 'bg-slate-100 text-slate-700 border border-slate-200',
    PROCESSING: 'bg-amber-100 text-amber-700 border border-amber-200',
    READY: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    DELIVERED: 'bg-blue-100 text-blue-700 border border-blue-200',
};

const statusDot = {
    RECEIVED: 'bg-slate-400',
    PROCESSING: 'bg-amber-400',
    READY: 'bg-emerald-400',
    DELIVERED: 'bg-blue-400',
};

export default function StatusBadge({ status }) {
    const style = statusStyles[status] || 'bg-gray-100 text-gray-700';
    const dot = statusDot[status] || 'bg-gray-400';

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {status}
        </span>
    );
}