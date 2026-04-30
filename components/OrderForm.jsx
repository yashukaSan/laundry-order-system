'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GARMENT_PRICES = {
    Shirt: 30,
    Pants: 40,
    Saree: 80,
    Jacket: 100,
    Kurta: 50,
    Suit: 150,
    Bedsheet: 60,
    'T-Shirt': 25,
    Dress: 70,
    Blazer: 120,
};

const GARMENT_TYPES = Object.keys(GARMENT_PRICES);

const defaultGarment = () => ({ type: GARMENT_TYPES[0], quantity: 1 });

export default function OrderForm() {
    const router = useRouter();

    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [garments, setGarments] = useState([defaultGarment()]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null); // { orderId, totalAmount }

    // Calculate estimated total on client side
    const estimatedTotal = garments.reduce((sum, g) => {
        return sum + (GARMENT_PRICES[g.type] || 0) * (parseInt(g.quantity) || 0);
    }, 0);

    const updateGarment = (index, field, value) => {
        setGarments((prev) =>
            prev.map((g, i) => (i === index ? { ...g, [field]: value } : g))
        );
    };

    const addGarment = () => setGarments((prev) => [...prev, defaultGarment()]);

    const removeGarment = (index) => {
        if (garments.length === 1) return; // keep at least one
        setGarments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName,
                    phoneNumber,
                    garments: garments.map((g) => ({
                        type: g.type,
                        quantity: parseInt(g.quantity),
                    })),
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || 'Failed to create order');
                return;
            }

            setSuccess({ orderId: data.orderId, totalAmount: data.totalAmount });

            // Redirect after 3 seconds
            setTimeout(() => router.push('/orders'), 3000);
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Success banner
    if (success) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-xl font-bold text-emerald-800 mb-2">Order Created Successfully!</h2>
                <p className="text-emerald-700 mb-1">
                    Order ID: <span className="font-mono font-bold">{success.orderId}</span>
                </p>
                <p className="text-emerald-700 mb-6">
                    Total Bill: <span className="font-bold">₹{success.totalAmount}</span>
                </p>
                <p className="text-sm text-emerald-600">Redirecting to orders list...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Customer Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <h2 className="font-semibold text-gray-800">Customer Information</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="10-digit number"
                        maxLength={10}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Garments */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">Garments</h2>
                    <button
                        onClick={addGarment}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                    >
                        + Add Garment
                    </button>
                </div>

                {/* Header row */}
                <div className="grid grid-cols-12 gap-3 text-xs font-medium text-gray-500 px-1">
                    <div className="col-span-5">TYPE</div>
                    <div className="col-span-3">QTY</div>
                    <div className="col-span-3">SUBTOTAL</div>
                    <div className="col-span-1" />
                </div>

                {garments.map((g, index) => {
                    const subtotal = (GARMENT_PRICES[g.type] || 0) * (parseInt(g.quantity));

                    return (
                        <div key={index} className="grid grid-cols-12 gap-3 items-center">
                            {/* Garment Type */}
                            <div className="col-span-5">
                                <select
                                    value={g.type}
                                    onChange={(e) => updateGarment(index, 'type', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                >
                                    {GARMENT_TYPES.map((type) => (
                                        <option key={type} value={type}>
                                            {type} (₹{GARMENT_PRICES[type]})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity */}
                            <div className="col-span-3">
                                <input
                                    type="number"
                                    min={1}
                                    value={g.quantity}
                                    onChange={(e) => updateGarment(index, 'quantity', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Subtotal */}
                            <div className="col-span-3">
                                <p className="text-sm font-medium text-gray-700 py-2.5 px-3 bg-gray-50 rounded-lg">
                                    ₹{subtotal}
                                </p>
                            </div>

                            {/* Remove */}
                            <div className="col-span-1 flex justify-center">
                                <button
                                    onClick={() => removeGarment(index)}
                                    disabled={garments.length === 1}
                                    className="text-gray-300 hover:text-red-500 disabled:cursor-not-allowed text-lg leading-none transition-colors"
                                    title="Remove garment"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="font-semibold text-gray-700">Estimated Total</span>
                    <span className="text-xl font-bold text-indigo-700">₹{estimatedTotal}</span>
                </div>
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? 'Creating Order...' : 'Create Order'}
            </button>
        </div>
    );
}