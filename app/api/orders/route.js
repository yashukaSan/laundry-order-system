import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import GARMENT_PRICES from "@/lib/priceConfig";
import generateOrderId from "@/lib/generateOrderId";

// GET /api/orders — List all orders with optional filters
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const phone = searchParams.get("phone");
    const garment = searchParams.get("garment");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const filter = {};

    if (
      status &&
      ["RECEIVED", "PROCESSING", "READY", "DELIVERED"].includes(status)
    ) {
      filter.status = status;
    }
    if (search) {
      filter.customerName = { $regex: search, $options: "i" };
    }
    if (phone) {
      filter.phoneNumber = { $regex: phone, $options: "i" };
    }
    if (garment) {
      filter["garments.type"] = { $regex: garment, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(filter);

    // .lean() returns plain JS objects — avoids Mongoose serialization issues on Vercel
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return Response.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// POST /api/orders — Create a new order
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { customerName, phoneNumber, garments } = body;

    // --- Validation ---
    if (!customerName || customerName.trim() === "") {
      return Response.json(
        { success: false, message: "Customer name is required" },
        { status: 400 },
      );
    }

    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber.trim())) {
      return Response.json(
        {
          success: false,
          message: "A valid 10-digit phone number is required",
        },
        { status: 400 },
      );
    }

    if (!garments || !Array.isArray(garments) || garments.length === 0) {
      return Response.json(
        { success: false, message: "At least one garment is required" },
        { status: 400 },
      );
    }

    // --- Price calculation ---
    const processedGarments = [];
    let totalAmount = 0;

    for (const garment of garments) {
      const { type, quantity } = garment;

      if (!GARMENT_PRICES[type]) {
        return Response.json(
          { success: false, message: `Unknown garment type: "${type}"` },
          { status: 400 },
        );
      }

      const qty = parseInt(quantity);
      if (!qty || qty < 1) {
        return Response.json(
          {
            success: false,
            message: `Quantity must be at least 1 for ${type}`,
          },
          { status: 400 },
        );
      }

      const pricePerItem = GARMENT_PRICES[type];
      const subtotal = pricePerItem * qty;
      totalAmount += subtotal;

      processedGarments.push({ type, quantity: qty, pricePerItem, subtotal });
    }

    // Estimated delivery = 3 days from now
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    // Retry once on duplicate orderId (extremely rare but safe)
    let order;
    let attempts = 0;
    while (attempts < 3) {
      try {
        const orderId = generateOrderId();
        order = await Order.create({
          orderId,
          customerName: customerName.trim(),
          phoneNumber: phoneNumber.trim(),
          garments: processedGarments,
          totalAmount,
          estimatedDelivery,
          status: "RECEIVED",
        });
        break;
      } catch (err) {
        if (err.code === 11000) {
          // Duplicate orderId — retry with a new one
          attempts++;
          if (attempts >= 3) throw err;
        } else {
          throw err;
        }
      }
    }

    return Response.json(
      { success: true, orderId: order.orderId, totalAmount, order },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
