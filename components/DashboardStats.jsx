'use client';

const statCards = (stats) => [
    {
        label: 'Total Orders',
        value: stats.totalOrders,
        icon: '📦',
        color: 'bg-indigo-50 border-indigo-100',
        textColor: 'text-indigo-700',
    },
    {
        label: 'Total Revenue',
        value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
        icon: '💰',
        color: 'bg-emerald-50 border-emerald-100',
        textColor: 'text-emerald-700',
    },
    {
        label: 'Received',
        value: stats.byStatus.RECEIVED,
        icon: '📥',
        color: 'bg-slate-50 border-slate-100',
        textColor: 'text-slate-700',
    },
    {
        label: 'Processing',
        value: stats.byStatus.PROCESSING,
        icon: '⚙️',
        color: 'bg-amber-50 border-amber-100',
        textColor: 'text-amber-700',
    },
    {
        label: 'Ready',
        value: stats.byStatus.READY,
        icon: '✅',
        color: 'bg-emerald-50 border-emerald-100',
        textColor: 'text-emerald-700',
    },
    {
        label: 'Delivered',
        value: stats.byStatus.DELIVERED,
        icon: '🚀',
        color: 'bg-blue-50 border-blue-100',
        textColor: 'text-blue-700',
    },
];

export default function DashboardStats({ stats }) {
    const cards = statCards(stats);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {cards.map(({ label, value, icon, color, textColor }) => (
                <div
                    key={label}
                    className={`rounded-xl border p-4 flex flex-col gap-2 ${color}`}
                >
                    <span className="text-2xl">{icon}</span>
                    <div>
                        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}