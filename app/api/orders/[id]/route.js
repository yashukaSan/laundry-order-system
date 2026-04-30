import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

// API 3: GET /api/orders/[id] (Get Single Order)
export async function GET(request,{ params }) {
  try {
    await dbConnect();
    const { id } = await params;

    console.log("GET /api/orders/[id] id:", id);

    // Find by custom 'orderId' field, not the MongoDB '_id'
    let order = await Order.findOne({ orderId: id });

    // If not found by orderId, try by _id (for backward compatibility)
    if (!order) {
      order = await Order.findById(id);
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// API 6: DELETE /api/orders/[id] (Delete Order — Bonus)
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    console.log("DELETE /api/orders/[id] id:", id);

    let deletedOrder = await Order.findOneAndDelete({ orderId: id });

    // If not found by orderId, try by _id
    if (!deletedOrder) {
      deletedOrder = await Order.findByIdAndDelete(id);
    }

    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order ${id} deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
