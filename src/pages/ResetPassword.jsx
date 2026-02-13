import { useState } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMsg(data.message);

      if (res.ok) {
        setForm({ email: "", otp: "", newPassword: "" });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const bgImageUrl =
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1350&q=80";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <form
        onSubmit={submit}
        className="max-w-md w-full p-6 border border-gray-300 rounded-md shadow-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#222" }}>
          Reset Password
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          placeholder="OTP"
          value={form.otp}
          onChange={(e) => setForm({ ...form, otp: e.target.value })}
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="New Password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <p className="text-sm text-gray-500 mb-4">
          Password must be at least 6 characters.
        </p>

        <button
          type="submit"
          className="w-full py-2 rounded transition"
          style={{
            backgroundColor: "#000",
            color: "#fff",
            border: "2px solid #000",
            fontWeight: "600",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#fff";
            e.target.style.color = "#000";
            e.target.style.borderColor = "#000";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#000";
            e.target.style.color = "#fff";
            e.target.style.borderColor = "#000";
          }}
        >
          Reset Password
        </button>

        {msg && <p className="mt-4 text-green-600 text-center">{msg}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </form>
    </div>
  );
}
