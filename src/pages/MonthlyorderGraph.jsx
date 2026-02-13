import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "http://localhost:5000/api";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function MonthlyOrdersAndSalesChart() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/orders/seller-orders`, {
          withCredentials: true,
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const currentYear = new Date().getFullYear();
  const monthlyData = Array(12).fill(null).map((_, idx) => ({
    month: MONTH_NAMES[idx],
    ordersCount: 0,
    salesAmount: 0,
  }));

  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (year === currentYear) {
      monthlyData[month].ordersCount += 1;

      if (order.orderStatus?.toLowerCase() === "delivered") {
        const orderTotal = order.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
        monthlyData[month].salesAmount += orderTotal;
      }
    }
  });

  if (loading) return <p className="text-center text-lg font-semibold">Loading chart...</p>;
  if (error) return <p className="text-center text-red-600 font-semibold">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
        Monthly Orders & Sales
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={monthlyData}
          margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#4B5563" }} />
          <YAxis
            yAxisId="left"
            orientation="left"
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#4B5563" }}
            label={{ value: "Orders", angle: -90, position: "insideLeft", offset: 10, fill: "#374151", fontWeight: "bold" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => `₹${value.toLocaleString()}`}
            tick={{ fontSize: 12, fill: "#4B5563" }}
            label={{ value: "Sales (₹)", angle: 90, position: "insideRight", offset: 10, fill: "#374151", fontWeight: "bold" }}
          />
          <Tooltip
            formatter={(value, name) =>
              name === "Sales Amount" ? `₹${value.toLocaleString()}` : value
            }
            contentStyle={{ fontSize: 14 }}
          />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 14 }} />
          <Bar
            yAxisId="left"
            dataKey="ordersCount"
            name="Orders"
            fill="#6366F1"
            barSize={24}
            radius={[5, 5, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="salesAmount"
            name="Sales Amount"
            fill="#10B981"
            barSize={24}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
