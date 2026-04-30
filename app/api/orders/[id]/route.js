import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

// GET /api/orders/[id] — Get a single order by orderId
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const order = await Order.findOne({ orderId: id }).lean();

    if (!order) {
      return Response.json(
        { success: false, message: `Order "${id}" not found` },
        { status: 404 },
      );
    }

    return Response.json({ success: true, order });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/orders/[id] — Delete an order by orderId
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const order = await Order.findOneAndDelete({ orderId: id }).lean();

    if (!order) {
      return Response.json(
        { success: false, message: `Order "${id}" not found` },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: `Order "${id}" deleted successfully`,
    });
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
