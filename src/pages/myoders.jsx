import React, { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import UserSidebar from "./sidebar/UserSidebar";
import InvoiceGenerator from "./InvoiceGenerator";

const API = "http://localhost:5000/api";
const BASE_URL = "http://localhost:5000";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH ORDERS ---------------- */
  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/orders/my-orders`, {
          method: "GET",
          credentials: "include", // 🔥 LOGIN FIX
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load orders");
        }

        if (mounted) setOrders(data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => (mounted = false);
  }, []);

  /* ---------------- DELIVERY DATE ---------------- */
  const formatDeliveryDate = (orderDate, days) => {
    if (!orderDate || !days) return null;
    const date = new Date(orderDate);
    date.setDate(date.getDate() + Number(days));
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  /* ---------------- CANCEL ORDER ---------------- */
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`${API}/orders/${orderId}/cancel`, {
        method: "PUT",
        credentials: "include", // 🔥 IMPORTANT
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Cancel failed");
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: "cancelled" } : o
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  /* ---------------- STATES ---------------- */
  if (loading)
    return <div className="flex h-screen items-center justify-center">Loading orders...</div>;

  if (error)
    return <div className="flex h-screen items-center justify-center text-red-600">{error}</div>;

  if (!orders.length)
    return <div className="flex h-screen items-center justify-center">No orders found</div>;

  /* ---------------- UI ---------------- */
 return (
  <div className="min-h-screen bg-gray-50">
    {/* ===== SIDEBAR ===== */}
    <div className="md:fixed md:inset-y-0 md:left-0 md:w-64 z-40">
      <UserSidebar />
    </div>

    {/* ===== MAIN CONTENT ===== */}
    <main className="w-full md:ml-64 max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      
      <h1 className="mb-6 sm:mb-8 border-b pb-3 text-2xl sm:text-3xl font-bold">
        My Orders
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="mb-8 rounded-2xl border bg-white shadow-sm hover:shadow-md transition"
        >
          {/* ===== ORDER ITEMS ===== */}
          <div className="divide-y">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6"
              >
                {/* IMAGE */}
                <img
                  src={
                    item.featuredImage
                      ? `${BASE_URL}${item.featuredImage}`
                      : "/default-image.png"
                  }
                  alt={item.title}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl border object-cover"
                />

                {/* DETAILS */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {item.title || item.productId?.title}
                  </h3>

                  {item.sku && (
                    <p className="text-xs text-gray-500">
                      SKU: <span className="font-medium">{item.sku}</span>
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    {item.brand?.name && (
                      <span>
                        Brand: <b>{item.brand.name}</b>
                      </span>
                    )}
                    {item.category?.name && (
                      <span>
                        Category: <b>{item.category.name}</b>
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-700">
                    Qty {item.quantity} × ₹{item.price}
                  </p>

                  <p className="text-base font-semibold">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ===== FOOTER ===== */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t bg-gray-50 p-4 sm:p-6 rounded-b-2xl">
            
            {/* ORDER INFO */}
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <b>Order ID:</b> {order._id}
              </p>
              <p>
                <b>Placed on:</b>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span
                  className={`capitalize font-semibold ${
                    order.orderStatus === "cancelled"
                      ? "text-red-600"
                      : order.orderStatus === "delivered"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </p>
              <p className="text-base font-semibold text-gray-900">
                Total: ₹{order.totalAmount.toFixed(2)}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {order.orderStatus !== "cancelled" &&
                order.orderStatus !== "delivered" && (
                  <button
                    type="button"
                    onClick={() => cancelOrder(order._id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2
                      rounded-lg border border-red-500
                      px-5 py-2 text-sm font-semibold
                      text-red-600 bg-white
                      hover:bg-red-50 transition"
                  >
                    <XCircle size={16} />
                    Cancel Order
                  </button>
                )}

              <div className="w-full sm:w-auto">
                <InvoiceGenerator order={order} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  </div>
);
}
