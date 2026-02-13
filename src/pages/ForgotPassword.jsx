import { useState } from "react";
import { apiFetch } from "../api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track button state
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true); // Disable button immediately

    const res = await apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("resetEmail", email);
      navigate("/reset-password");
    } else {
      setMsg(data.message);
      setIsSubmitting(false); // Re-enable button if error
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
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "30px 40px",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#222" }}>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px 15px",
            marginBottom: "20px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
          disabled={isSubmitting} // disable input during submission
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#000",
            border: "2px solid #000",
            borderRadius: "4px",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            transition: "none", // no hover effect once disabled
          }}
          // Remove hover effects, button stays black always
        >
          {isSubmitting ? "Sending..." : "Send OTP"}
        </button>

        {msg && (
          <p style={{ color: "red", marginTop: "15px", fontWeight: "600" }}>
            {msg}
          </p>
        )}
      </form>
    </div>
  );
}
