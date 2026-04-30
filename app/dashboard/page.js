import Link from 'next/link';
import DashboardStats from '@/components/DashboardStats';
import StatusBadge from '@/components/StatusBadge';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

// Query MongoDB directly — no self-HTTP-fetch (breaks on Vercel)
async function getDashboardData() {
  try {
    await connectDB();

    const [result] = await Order.aggregate([
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: '$totalAmount' },
              },
            },
          ],
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ],
          recentOrders: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                orderId: 1,
                customerName: 1,
                totalAmount: 1,
                status: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);

    const summary = result.summary[0] || { totalOrders: 0, totalRevenue: 0 };

    const byStatus = { RECEIVED: 0, PROCESSING: 0, READY: 0, DELIVERED: 0 };
    result.byStatus.forEach(({ _id, count }) => {
      byStatus[_id] = count;
    });

    return {
      success: true,
      totalOrders: summary.totalOrders,
      totalRevenue: summary.totalRevenue,
      byStatus,
      recentOrders: result.recentOrders,
    };
  } catch (error) {
    console.error('Dashboard DB error:', error);
    return null;
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data || !data.success) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-medium">Failed to load dashboard data.</p>
        <p className="text-sm text-gray-400 mt-1">Check your MONGODB_URI in environment variables.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your laundry operations</p>
        </div>
        <Link
          href="/orders/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          + New Order
        </Link>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={data} />

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <Link href="/orders" className="text-sm text-indigo-600 hover:underline font-medium">
            View all →
          </Link>
        </div>

        {data.recentOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-gray-400">No orders yet.</p>
            <Link
              href="/orders/create"
              className="text-indigo-600 text-sm font-medium hover:underline mt-2 inline-block"
            >
              Create your first order
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Order ID</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Amount</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs">{order.orderId}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{order.customerName}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
