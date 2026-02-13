import { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";

export default function AdminDashboard() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/clients", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Error fetching clients: ${res.status}`);
      }
      const data = await res.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const approve = async (id) => {
    try {
      const res = await fetch(`/api/admin/approve-client/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Approve failed");
      loadClients();
    } catch (err) {
      alert(err.message);
    }
  };

  const cancel = async (id) => {
    try {
      const res = await fetch(`/api/admin/cancel-approval/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Cancel approval failed");
      loadClients();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading clients...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Clients</h2>
      <Sidebar/>
      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <table border="1" cellPadding={8} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.isApproved ? "Approved" : "Pending"}</td>
                <td>
                  {!client.isApproved ? (
                    <button
                      style={{ backgroundColor: "green", color: "white", marginRight: 8 }}
                      onClick={() => approve(client._id)}
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      style={{ backgroundColor: "red", color: "white" }}
                      onClick={() => cancel(client._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
