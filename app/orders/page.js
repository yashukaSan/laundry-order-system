"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OrderCard from "../../components/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (!data.success) {
          setError(data.error || "Failed to load orders.");
        } else {
          setOrders(data.orders);
        }
      } catch (err) {
        setError("Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete order.");
      }

      setOrders((current) => current.filter((order) => order.orderId !== orderId));
    } catch (err) {
      setError(err.message || "Unable to delete order.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 text-gray-500">Loading orders...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">View all orders and navigate to order details.</p>
        </div>
        <Link
          href="/orders/create"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          + New Order
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500">No orders found yet.</p>
          <Link href="/orders/create" className="text-indigo-600 hover:underline mt-3 inline-block">
            Create the first order
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderCard key={order.orderId} order={order} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
