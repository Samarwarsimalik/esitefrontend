import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "http://localhost:5000/api";

const COLORS = ["#6366F1", "#10B981", "#FBBF24", "#EF4444"]; // Indigo, Green, Yellow, Red

export default function DashboardPieChartWithStats() {
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

  const statusCounts = orders.reduce(
    (acc, order) => {
      const status = order.orderStatus?.toLowerCase() || "unknown";
      if (acc[status] !== undefined) {
        acc[status]++;
      }
      return acc;
    },
    { processing: 0, shipped: 0, delivered: 0, cancelled: 0 }
  );

  const totalOrders = orders.length;

  const data = [
    { name: "Processing", value: statusCounts.processing },
    { name: "Shipped", value: statusCounts.shipped },
    { name: "Delivered", value: statusCounts.delivered },
    { name: "Cancelled", value: statusCounts.cancelled },
  ];

  if (loading) return <p className="text-center text-lg font-semibold">Loading chart...</p>;
  if (error) return <p className="text-center text-red-600 font-semibold">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
        Order Status Distribution
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={40} wrapperStyle={{ fontSize: 14 }} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 text-center space-y-2 text-gray-700 font-medium">
        <p>
          Total Orders: <span className="text-indigo-600 font-bold">{totalOrders}</span>
        </p>
        <p>
          Processing: <span className="text-indigo-500">{statusCounts.processing}</span>
        </p>
        <p>
          Shipped: <span className="text-green-500">{statusCounts.shipped}</span>
        </p>
        <p>
          Delivered: <span className="text-yellow-500">{statusCounts.delivered}</span>
        </p>
        <p>
          Cancelled: <span className="text-red-500">{statusCounts.cancelled}</span>
        </p>
      </div>
    </div>
  );
}
