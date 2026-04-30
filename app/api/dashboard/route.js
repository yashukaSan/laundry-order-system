import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

// API 5: GET /api/dashboard (Dashboard Stats)
export async function GET() {
  try {
    await dbConnect();

    // 1. Get total orders count
    const totalOrders = await Order.countDocuments();

    // 2. Get total revenue (sum of all totalAmounts)
    const revenueAggregation = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalRevenue =
      revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // 3. Count orders per status
    const statusAggregation = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the status counts into a clean object
    const byStatus = {
      RECEIVED: 0,
      PROCESSING: 0,
      READY: 0,
      DELIVERED: 0,
    };

    statusAggregation.forEach((stat) => {
      if (byStatus[stat._id] !== undefined) {
        byStatus[stat._id] = stat.count;
      }
    });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderId customerName status totalAmount createdAt");

    // Return the clean JSON response requested
    return NextResponse.json({
      success: true,
      totalOrders,
      totalRevenue,
      byStatus,
      recentOrders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
