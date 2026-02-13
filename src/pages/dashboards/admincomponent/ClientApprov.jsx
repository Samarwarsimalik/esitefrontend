import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../sidebar/Sidebar";

const AdminClientApproval = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, approved, pending

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/clients", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load clients");
      }

      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `/api/admin/approve-client/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Approve failed");

      setClients((prev) =>
        prev.map((client) =>
          client._id === id
            ? { ...client, isApproved: true }
            : client
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancel = async (id) => {
    try {
      const response = await fetch(
        `/api/admin/cancel-approval/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Cancel failed");

      setClients((prev) =>
        prev.map((client) =>
          client._id === id
            ? { ...client, isApproved: false }
            : client
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter clients based on search term and status
  const filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && client.isApproved) ||
      (statusFilter === "pending" && !client.isApproved);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-6">
          Client Approval
        </h1>

        {/* Search + Filter */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
          <input
            type="text"
            placeholder="Search by name or email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-black"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {loading && <p>Loading clients...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && filteredClients.length === 0 && (
          <p>No clients found.</p>
        )}

        {!loading && filteredClients.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Aadhaar</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{client.name}</td>
                    <td className="px-4 py-3">{client.email}</td>
                    <td className="px-4 py-3">{client.phone || "-"}</td>
                    <td className="px-4 py-3">{client.aadharNo || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          client.isApproved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {client.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!client.isApproved ? (
                        <button
                          onClick={() => handleApprove(client._id)}
                          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCancel(client._id)}
                          className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminClientApproval;
