import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

const VALID_STATUSES = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];

// PATCH /api/orders/[id]/status — Update the status of an order
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return Response.json(
        {
          success: false,
          message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const order = await Order.findOneAndUpdate(
      { orderId: id },
      { status },
      { new: true },
    ).lean();

    if (!order) {
      return Response.json(
        { success: false, message: `Order "${id}" not found` },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Status updated successfully",
      order,
    });
  } catch (error) {
    console.error("PATCH /api/orders/[id]/status error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
