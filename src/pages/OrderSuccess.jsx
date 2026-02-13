import React from "react";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <CheckCircle size={80} className="text-green-600" />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Placed Successfully 🎉
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and will be
          processed shortly.
        </p>

        {/* INFO BOX */}
        <div className="rounded-xl bg-gray-50 border p-4 text-left mb-6">
          <p className="text-sm text-gray-700">
            📦 You can track your order status from <b>My Orders</b>.
          </p>
          <p className="text-sm text-gray-700 mt-1">
            🧾 Invoice will be available once the order is processed.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate("/user/my-orders")}
            className="
              flex-1 flex items-center justify-center gap-2
              rounded-xl bg-black px-6 py-3
              text-white font-semibold
              hover:bg-gray-900 transition
            "
          >
            <ShoppingBag size={18} />
            My Orders
          </button>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="
              flex-1 rounded-xl border border-gray-300
              px-6 py-3 font-semibold text-gray-800
              hover:bg-gray-100 transition
            "
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
