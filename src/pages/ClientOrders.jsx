import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cell } from "recharts";
import Sidebar from "./sidebar/Sidebar";
import ClideSidebar from "./sidebar/ClientSidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API_BASE = "http://localhost:5000/api";

const STATUS_STYLES = {
  processing: "bg-gray-300 text-black",
  shipped: "bg-gray-600 text-white",
  delivered: "bg-green-600 text-white",
  cancelled: "bg-red-600 text-white",
};
const statusColors = {
  processing: "#9CA3AF", // gray-400
  shipped: "#4B5563",    // gray-700
  delivered: "#16A34A",  // green-600
  cancelled: "#DC2626",  // red-600
  unknown: "#6B7280",
}
export default function SellerOrdersPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function fetchUserAndOrders() {
      try {
        setLoadingUser(true);
        setError(null);

        const userResponse = await axios.get(`${API_BASE}/auth/me`, {
          withCredentials: true,
        });
        setUser(userResponse.data);
        setLoadingUser(false);

        setLoadingOrders(true);
        const ordersResponse = await axios.get(`${API_BASE}/orders/seller-orders`, {
          withCredentials: true,
        });

        setOrders(ordersResponse.data);
        setFilteredOrders(ordersResponse.data);
        setLoadingOrders(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to load data";
        setError(errorMessage);
        setLoadingUser(false);
        setLoadingOrders(false);
      }
    }

    fetchUserAndOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesStatus =
        !statusFilter ||
        order.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer?.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);

    try {
      await axios.put(
        `${API_BASE}/orders/${orderId}/status`,
        { orderStatus: newStatus },
        { withCredentials: true }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      alert("Failed to update order status");
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loadingUser || loadingOrders) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500 font-semibold px-4 text-center">
        {error}
      </div>
    );
  }

  const renderOrderItem = (item) => {
    const hasVariation = Boolean(item.variation);
    const imgSrc = item.featuredImage
      ? item.featuredImage.startsWith("http")
        ? item.featuredImage
        : API_BASE.replace("/api", "") + item.featuredImage
      : "/placeholder.png";

    return (
      <li
        key={item._id}
        className="flex items-center gap-5 mb-4 border-b border-gray-300 pb-3"
      >
        <img
          src={imgSrc}
          alt={item.title}
          className="w-20 h-20 object-cover rounded-lg shadow"
        />
        <div>
          <p className="font-semibold text-lg mb-1">
            {item.productId?.title || item.title}{" "}
            {hasVariation && (
              <span className="text-xs text-gray-600 font-normal">(Variation)</span>
            )}
          </p>
          <p className="text-gray-800 mb-1">
            Qty: {item.quantity} | Price: ₹{item.price}
          </p>
          <p className="text-xs text-gray-500">
            SKU: {item.sku || "N/A"} | Variation ID:{" "}
            {hasVariation ? item.variation : "N/A"}
          </p>
        </div>
      </li>
    );
  };

  // Prepare data for the bar chart
  const orderStatusCounts = orders.reduce(
    (acc, order) => {
      const status = order.orderStatus?.toLowerCase() || "unknown";
      if (acc[status] !== undefined) {
        acc[status]++;
      }
      return acc;
    },
    { processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
  );

  const chartData = Object.entries(orderStatusCounts).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div className="flex min-h-screen bg-white text-black">
      <aside className="w-64 bg-black text-white shadow-lg">
        {user?.role === "client" ? <ClideSidebar /> : null}
        {user?.role === "admin" ? <Sidebar /> : null}
      </aside>

      <main className="flex-grow p-10 overflow-auto max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 border-b border-gray-400 pb-4">
          Orders Management - Seller:{" "}
          <span className="text-gray-800">{user?.name}</span>
        </h1>

        {/* Filters */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-wrap gap-6 mb-10 items-end"
        >
          <div className="flex flex-col flex-grow min-w-[260px]">
            <label htmlFor="search" className="font-semibold mb-2 text-gray-900">
              Search by Order ID or Customer Email
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="rounded-md border border-gray-400 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex flex-col min-w-[220px]">
            <label htmlFor="status" className="font-semibold mb-2 text-gray-900">
              Filter by Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-400 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
            }}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md font-semibold transition"
          >
            Clear Filters
          </button>
        </form>

        {/* Chart */}
        <section className="mb-12 w-full h-64">
          <h2 className="text-xl font-semibold mb-4">Order Status Overview</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="status"
                textTransform="capitalize"
                tick={{ fontWeight: "bold" }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
                <Bar dataKey="count" radius={[5, 5, 0, 0]}>
      {chartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={statusColors[entry.status] || statusColors.unknown} />
      ))}
    </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <p className="text-center font-semibold text-gray-500">No orders found.</p>
        ) : (
          filteredOrders.map((order) => {
            const soldByUser = order.items.filter(
              (item) => item.seller === user._id
            );
            const boughtByUser = order.items.filter(
              (item) => item.seller !== user._id
            );

            const status = order.orderStatus?.toLowerCase();

            let deliveryInfo;
            if (status === "delivered") {
              deliveryInfo = (
                <span className="text-green-600 font-semibold capitalize">
                  Delivered
                </span>
              );
            } else if (status === "cancelled") {
              deliveryInfo = (
                <span className="text-red-600 font-semibold capitalize">
                  Cancelled
                </span>
              );
            } else if (order.items.length > 0) {
              const date = new Date(
                new Date(order.createdAt).getTime() +
                  Number(order.items[0].estimateDeliveryDate || 0) *
                    24 *
                    60 *
                    60 *
                    1000
              );
              deliveryInfo = date.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              });
            } else {
              deliveryInfo = "N/A";
            }

            return (
              <article
                key={order._id}
                className="mb-12 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
              >
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Order ID:</strong>{" "}
                  <code className="bg-gray-100 px-1 rounded">{order._id}</code>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <section className="mb-5">
                  <h3 className="font-semibold mb-2 text-lg border-b border-gray-300 pb-1">
                    Customer Details
                  </h3>
                  <p>
                    <strong>Name:</strong> {order.customer?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.customer?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.customer?.phone || "N/A"}
                  </p>
                </section>

                <section className="mb-5">
                  <h3 className="font-semibold mb-2 text-lg border-b border-gray-300 pb-1">
                    Shipping Address
                  </h3>
                  <p>
                    {order.shippingAddress?.address || "N/A"},{" "}
                    {order.shippingAddress?.city || "N/A"},{" "}
                    {order.shippingAddress?.state || "N/A"} -{" "}
                    {order.shippingAddress?.pincode || "N/A"}
                  </p>
                </section>

                <section className="mb-5">
                  <ul className="list-none p-0">{boughtByUser.map(renderOrderItem)}</ul>
                </section>

                <p className="mb-4 text-sm text-gray-600">
                  <strong>Estimated Delivery Date:</strong> {deliveryInfo}
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-xs font-semibold capitalize ${
                      STATUS_STYLES[order.orderStatus?.toLowerCase()] ||
                      "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>

                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    disabled={updatingOrderId === order._id}
                    className={`rounded border border-gray-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition ${
                      updatingOrderId === order._id ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </article>
            );
          })
        )}
      </main>
    </div>
  );
}
