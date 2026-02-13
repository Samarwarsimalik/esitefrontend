import { useState } from "react";
import { apiFetch } from "../api";

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/users/change-password", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMsg(data.message);
      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>

        {msg && (
          <p className="mb-3 text-green-600 bg-green-50 p-2 rounded">
            {msg}
          </p>
        )}
        {error && (
          <p className="mb-3 text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={form.oldPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
