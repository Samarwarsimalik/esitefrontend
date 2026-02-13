import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import { Search, User, CheckSquare, Edit2, Trash2 } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(API_BASE + endpoint, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

const maskAadhaar = (num) => {
  if (!num || num.length < 4) return "xxxx xxxx xxxx";
  const last4 = num.slice(-4);
  return `xxxx xxxx xxxx ${last4}`;
};

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [approvedFilter, setApprovedFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, approvedFilter]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await apiFetch("/users");
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function filterUsers() {
    let filtered = [...users];
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    if (approvedFilter) {
      filtered = filtered.filter((u) =>
        approvedFilter === "approved" ? u.isApproved === true : u.isApproved === false
      );
    }
    setFilteredUsers(filtered);
  }

  // Calculate counts for each filter independently
  const totalUsers = users.length;

  const searchFilteredCount = searchTerm.trim()
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      ).length
    : 0;

  const roleFilteredCount = roleFilter
    ? users.filter((u) => u.role === roleFilter).length
    : 0;

  const approvedFilteredCount = approvedFilter
    ? users.filter((u) =>
        approvedFilter === "approved" ? u.isApproved === true : u.isApproved === false
      ).length
    : 0;

  // Decide which count to show (priority: search > role > approved)
  let countDisplay = null;
  if (searchTerm.trim()) {
    countDisplay = (
      <div className="border border-black rounded px-4 py-2 font-semibold">
        Search results: {searchFilteredCount}
      </div>
    );
  } else if (roleFilter) {
    countDisplay = (
      <div className="border border-black rounded px-4 py-2 font-semibold">
        Role "{roleFilter}": {roleFilteredCount}
      </div>
    );
  } else if (approvedFilter) {
    countDisplay = (
      <div className="border border-black rounded px-4 py-2 font-semibold">
        {approvedFilter === "approved" ? "Approved" : "Not Approved"}: {approvedFilteredCount}
      </div>
    );
  } else {
    countDisplay = (
      <div className="border border-black rounded px-4 py-2 font-semibold">
        Total Users: {totalUsers}
      </div>
    );
  }

  function startEdit(user) {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      phone: user.phone || "",
      isApproved: user.isApproved || false,
    });
  }

  function cancelEdit() {
    setEditingUser(null);
    setFormData({});
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function saveEdit() {
    try {
      await apiFetch(`/users/${editingUser._id}`, {
        method: "PUT",
        body: formData,
      });
      cancelEdit();
      fetchUsers();
    } catch (err) {
      alert("Failed to update user: " + err.message);
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await apiFetch(`/users/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  }

  if (loading) return <p className="text-black">Loading users...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 border-b border-black pb-2">All Users</h1>

        <div className="flex justify-between flexy mb-6 gap-6">
          {/* Left side: single count box */}
          {countDisplay}

          {/* Right side: filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-3 text-black opacity-60" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-black rounded pl-9 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex items-center space-x-2">
              <User size={20} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-black rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="client">Client</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <CheckSquare size={20} />
              <select
                value={approvedFilter}
                onChange={(e) => setApprovedFilter(e.target.value)}
                className="border border-black rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">All</option>
                <option value="approved">Approved</option>
                <option value="not_approved">Not Approved</option>
              </select>
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-black text-center mt-10 text-lg font-semibold">
            No users found matching your criteria.
          </p>
        ) : (
          <div className="overflow-x-auto border border-black rounded">
            <table className="min-w-full border-collapse border border-black">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3 border border-white">Profile Image</th>
                  <th className="p-3 border border-white">Name</th>
                  <th className="p-3 border border-white">Email</th>
                  <th className="p-3 border border-white">Role</th>
                  <th className="p-3 border border-white">Phone</th>
                  <th className="p-3 border border-white">Address</th>
                  <th className="p-3 border border-white">Aadhar No.</th>
                  <th className="p-3 border border-white">Approved</th>
                  <th className="p-3 border border-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) =>
                  editingUser && editingUser._id === user._id ? (
                    <tr key={user._id} className="bg-white text-black">
                      <td className="border border-black p-2 text-center">
                        {user.profileImage ? (
                          <img
                            src={`http://localhost:5000${user.profileImage}`}
                            alt={user.name}
                            className="w-12 h-12 object-cover mx-auto rounded"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="border border-black p-2">
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full border border-black rounded px-2 py-1"
                        />
                      </td>
                      <td className="border border-black p-2">
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-black rounded px-2 py-1"
                        />
                      </td>
                      <td className="border border-black p-2">
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full border border-black rounded px-2 py-1 bg-white"
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                          <option value="client">Client</option>
                        </select>
                      </td>
                      <td className="border border-black p-2">
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border border-black rounded px-2 py-1"
                        />
                      </td>
                      <td className="border border-black p-2">
                        {user.address
                          ? `${user.address.line1}, ${user.address.city}, ${user.address.state}, ${user.address.pincode}, ${user.address.country}`
                          : "-"}
                      </td>
                      <td className="border border-black p-2">{maskAadhaar(user.aadharNo)}</td>
                      <td className="border border-black p-2 text-center">
                        <input
                          type="checkbox"
                          name="isApproved"
                          checked={formData.isApproved}
                          onChange={handleChange}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="border border-black p-2 space-x-2 text-center">
                        <button
                          onClick={saveEdit}
                          className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded"
                          aria-label="Save"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
                          aria-label="Cancel"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={user._id} className="bg-white hover:bg-gray-100 text-black">
                      <td className="border border-black p-2 text-center">
                        {user.profileImage ? (
                          <img
                            src={`http://localhost:5000${user.profileImage}`}
                            alt={user.name}
                            className="w-12 h-12 object-cover mx-auto rounded"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="border border-black p-2">{user.name}</td>
                      <td className="border border-black p-2">{user.email}</td>
                      <td className="border border-black p-2">{user.role}</td>
                      <td className="border border-black p-2">{user.phone || "-"}</td>
                      <td className="border border-black p-2">
                        {user.address
                          ? `${user.address.line1}, ${user.address.city}, ${user.address.state}, ${user.address.pincode}, ${user.address.country}`
                          : "-"}
                      </td>
                      <td className="border border-black p-2">{maskAadhaar(user.aadharNo)}</td>
                      <td className="border border-black p-2 text-center">
                        {user.isApproved ? (
                          <span role="img" aria-label="Approved">
                            ✅
                          </span>
                        ) : (
                          <span role="img" aria-label="Not approved">
                            ❌
                          </span>
                        )}
                      </td>
                      <td className="border border-black p-2 space-x-2 text-center">
                        <button
                          onClick={() => startEdit(user)}
                          className="p-1 hover:bg-gray-200 rounded"
                          aria-label="Edit"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          aria-label="Delete"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
