import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

const VALID_STATUSES = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];

// API 4: PATCH /api/orders/[id]/status (Update Order Status)
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Update in MongoDB
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: id },
      {
        status: status,
        updatedAt: new Date(),
      },
      { new: true }, // Return the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
