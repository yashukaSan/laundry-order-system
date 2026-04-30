import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import priceConfig from "@/lib/priceConfig";
import generateOrderId from "@/lib/generateOrderId";

// API 1: POST /api/orders (Create Order)
export async function POST(request) {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("Connected to DB");
    console.log("Order model:", Order);

    const body = await request.json();
    console.log("Request body:", body);
    const { customerName, phoneNumber, garments } = body;

    let totalAmount = 0;

    // Process garments and calculate subtotal
    const processedGarments = garments.map((item) => {
      const pricePerItem = priceConfig[item.type] || 0;
      console.log(`Price for ${item.type}:`, pricePerItem);
      const subtotal = pricePerItem * item.quantity;
      totalAmount += subtotal;
      return { ...item, pricePerItem, subtotal };
    });

    console.log("Processed garments:", processedGarments);
    console.log("Total amount:", totalAmount);

    const orderId = generateOrderId();
    console.log("Generated orderId:", orderId);

    // Calculate estimated delivery (Today + 3 days)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    // Save to MongoDB
    console.log("Creating order in DB...");
    const newOrder = await Order.create({
      orderId,
      customerName,
      phoneNumber,
      garments: processedGarments,
      totalAmount,
      estimatedDelivery,
      status: "RECEIVED", // Default status
    });
    console.log("Order created:", newOrder._id, newOrder.orderId);

    return NextResponse.json(
      { success: true, orderId, totalAmount, order: newOrder },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/orders:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// API 2: GET /api/orders (List All Orders with Filters)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    // Parse query params
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const phone = searchParams.get("phone");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Build dynamic filter
    const filter = {};
    console.log("GET /api/orders params:", { status, search, phone, page, limit });
    if (status) filter.status = status;
    if (phone) filter.phoneNumber = phone;
    if (search) {
      // Case-insensitive search on customerName
      filter.customerName = { $regex: search, $options: "i" };
    }

    // Pagination logic
    const skip = (page - 1) * limit;

    // Fetch from MongoDB
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(filter);

    return NextResponse.json({
      success: true,
      count: orders.length,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      orders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
