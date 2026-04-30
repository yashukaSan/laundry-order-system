import Link from "next/link";
import OrderForm from "../../../components/OrderForm";

export default function CreateOrderPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/orders"
          className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-4"
        >
          ← Back to Orders
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in customer details and add garments
        </p>
      </div>

      {/* Form */}
      <OrderForm />
    </div>
  );
}
