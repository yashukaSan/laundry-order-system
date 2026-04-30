import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

// GET /api/dashboard — Returns summary stats
export async function GET() {
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

    return Response.json({
      success: true,
      totalOrders: summary.totalOrders,
      totalRevenue: summary.totalRevenue,
      byStatus,
      recentOrders: result.recentOrders,
    });
  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    return Response.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
