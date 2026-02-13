import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./sidebar/Sidebar";

const API_BASE = "http://localhost:5000/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/orders`, { withCredentials: true });
        setOrders(res.data);
        setFilteredOrders(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply search & filter whenever inputs or orders change
  useEffect(() => {
    let filtered = [...orders];

    if (statusFilter) {
      filtered = filtered.filter(
        (order) =>
          order.orderStatus?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await axios.put(
        `${API_BASE}/orders/${orderId}/status`,
        { orderStatus: newStatus },
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-white bg-black">
        Loading orders...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-semibold mt-10 bg-black text-white min-h-screen flex justify-center items-center">
        {error}
      </div>
    );

  const statusStyles = {
    processing: "bg-gray-300 text-black",
    shipped: "bg-gray-500 text-white",
    delivered: "bg-black text-white",
    cancelled: "bg-white text-black border border-black",
  };

  return (
    <div className=" flexy flex min-h-screen bg-gray-50 text-black">
      {/* Sidebar */}
      
        <Sidebar />
 

      {/* Main Content */}
      <main className="flex-grow p-10">
        <h1 className="text-3xl font-bold mb-8 border-b border-black pb-4">
          Orders Management
        </h1>

        {/* Search & Filter */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-wrap gap-6 mb-8 items-end"
        >
          <div className="flex flex-col flex-grow min-w-[240px]">
            <label htmlFor="search" className="font-semibold mb-2">
              Search by Order ID or Email
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="rounded border border-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex flex-col min-w-[200px]">
            <label htmlFor="status" className="font-semibold mb-2">
              Filter by Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded border border-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
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
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition font-semibold"
          >
            Clear Filters
          </button>
        </form>

        {/* Orders Table Container */}
        <div className="overflow-auto max-h-[70vh] border border-gray-300 rounded bg-white shadow-sm">
          <table className="min-w-full border-collapse table-auto">
            <thead className="sticky top-0 bg-black text-white z-10">
              <tr>
                <th className="py-3 px-5 text-left font-semibold border-b border-gray-700">
                  Order ID
                </th>
                <th className="py-3 px-5 text-left font-semibold border-b border-gray-700">
                  User Email
                </th>
                <th className="py-3 px-5 text-left font-semibold border-b border-gray-700">
                  Total Amount (₹)
                </th>
                <th className="py-3 px-5 text-left font-semibold border-b border-gray-700">
                  Payment Status
                </th>
                <th className="py-3 px-5 text-left font-semibold border-b border-gray-700">
                  Order Status
                </th>
                <th className="py-3 px-5 text-left font-semibold border-b border-gray-700">
                  Change Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-700 font-medium"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="even:bg-white odd:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="border-b border-gray-300 px-5 py-4 font-mono text-sm max-w-xs break-words text-black">
                      {order._id}
                    </td>
                    <td className="border-b border-gray-300 px-5 py-4 text-sm text-black">
                      {order.user?.email || "N/A"}
                    </td>
                    <td className="border-b border-gray-300 px-5 py-4 font-semibold text-black">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="border-b border-gray-300 px-5 py-4 capitalize text-black">
                      {order.paymentStatus || "N/A"}
                    </td>
                    <td className="border-b border-gray-300 px-5 py-4 text-black">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          statusStyles[order.orderStatus?.toLowerCase()] ||
                          "bg-gray-200 text-black"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="border-b border-gray-300 px-5 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        disabled={updatingOrderId === order._id}
                        className={`rounded border border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition ${
                          updatingOrderId === order._id
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
