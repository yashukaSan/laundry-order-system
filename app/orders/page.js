import { Suspense } from "react";
import Link from "next/link";
import OrderCard from "@/components/OrderCard";
import FilterBar from "@/components/FilterBar";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

// Query MongoDB directly — no self-HTTP-fetch (breaks on Vercel)
async function getOrders(searchParams) {
  try {
    await connectDB();

    const filter = {};

    const status = searchParams?.status;
    const search = searchParams?.search;
    const phone = searchParams?.phone;
    const garment = searchParams?.garment;

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

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const total = await Order.countDocuments(filter);

    return { success: true, orders, total };
  } catch (error) {
    console.error("Orders DB error:", error);
    return null;
  }
}

export default async function OrdersPage({ searchParams }) {
  // In Next.js 14 searchParams is a plain object — no await needed
  const params = searchParams || {};
  const data = await getOrders(params);

  const activeFilters = [params.status, params.search, params.garment].filter(
    Boolean,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data?.total ?? "—"} order{data?.total !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link
          href="/orders/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          + New Order
        </Link>
      </div>

      {/* Filter Bar — wrapped in Suspense because it uses useSearchParams internally */}
      <Suspense
        fallback={<div className="h-11 bg-gray-100 rounded-lg animate-pulse" />}
      >
        <FilterBar />
      </Suspense>

      {/* Orders Grid */}
      {!data || !data.success ? (
        <div className="text-center py-20 text-red-500 font-medium">
          Failed to load orders. Check your MONGODB_URI.
        </div>
      ) : data.orders.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-16 text-center">
          <p className="text-4xl mb-3">🧺</p>
          <p className="text-gray-500 font-medium">
            {activeFilters.length > 0
              ? "No orders match your filters."
              : "No orders yet."}
          </p>
          {activeFilters.length === 0 && (
            <Link
              href="/orders/create"
              className="text-indigo-600 text-sm font-medium hover:underline mt-2 inline-block"
            >
              Create your first order
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
