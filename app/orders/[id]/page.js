'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import StatusBadge from '@/components/StatusBadge';

const STATUS_OPTIONS = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function OrderDetailPage() {
  // useParams() works in React 18 — replaces the broken use(params) pattern
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.message || 'Order not found');
        } else {
          setOrder(data.order);
          setNewStatus(data.order.status);
        }
      } catch {
        setError('Failed to load order. Check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!data.success) {
        setToast(`Error: ${data.message}`);
      } else {
        setOrder(data.order);
        setToast('Status updated successfully!');
      }
    } catch {
      setToast('Network error. Please try again.');
    } finally {
      setUpdating(false);
      setTimeout(() => setToast(''), 3000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-40 bg-gray-200 rounded-xl" />
        <div className="h-60 bg-gray-200 rounded-xl" />
        <div className="h-28 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <Link href="/orders" className="text-indigo-600 hover:underline text-sm font-medium">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${
            toast.startsWith('Error')
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
          }`}
        >
          {toast}
        </div>
      )}

      {/* Back link */}
      <Link
        href="/orders"
        className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 w-fit"
      >
        ← Back to Orders
      </Link>

      {/* Order Header Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-mono text-gray-400 mb-1">{order.orderId}</p>
            <h1 className="text-xl font-bold text-gray-900">{order.customerName}</h1>
            <p className="text-gray-500 mt-0.5">{order.phoneNumber}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-sm">
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">
              Order Date
            </p>
            <p className="text-gray-700">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">
              Est. Delivery
            </p>
            <p className="text-gray-700">{formatDate(order.estimatedDelivery)}</p>
          </div>
        </div>
      </div>

      {/* Garments Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Garments</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Type</th>
              <th className="text-center px-6 py-3 font-medium text-gray-500">Qty</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Price/item</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.garments.map((g, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-800">{g.type}</td>
                <td className="px-6 py-3 text-center text-gray-600">{g.quantity}</td>
                <td className="px-6 py-3 text-right text-gray-600">₹{g.pricePerItem}</td>
                <td className="px-6 py-3 text-right font-semibold text-gray-800">₹{g.subtotal}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-indigo-50 border-t-2 border-indigo-100">
              <td colSpan={3} className="px-6 py-4 font-bold text-gray-700">
                Total
              </td>
              <td className="px-6 py-4 text-right font-bold text-indigo-700 text-lg">
                ₹{order.totalAmount}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Status Update */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Update Status</h2>
        <div className="flex gap-3">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={updating || newStatus === order.status}
            className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updating ? 'Updating...' : 'Update'}
          </button>
        </div>
        {newStatus === order.status && (
          <p className="text-xs text-gray-400">Select a different status to update.</p>
        )}
      </div>
    </div>
  );
}
