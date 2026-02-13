 import { apiFetch } from "../api";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ClientRegister() {
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/auth/client-register", {
        method: "POST",
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          aadharNo: e.target.aadhar.value,
          phone: e.target.phone.value,
          agreedToTerms: e.target.agree.checked, // checkbox value
        }),
      });
      alert("Client created. Password will be sent to your email after admin approval.");
      e.target.reset();
    } catch (error) {
      alert("Failed to create client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left side form */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-16">
        <form
          onSubmit={submit}
          className="w-full max-w-md space-y-6"
          autoComplete="off"
        >
          <h2 className="text-3xl font-extrabold text-black mb-8">
            Client Register
          </h2>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              required
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="aadhar"
              className="block text-sm font-medium text-black mb-1"
            >
              Aadhar No
            </label>
            <input
              id="aadhar"
              name="aadhar"
              type="text"
              placeholder="12 digit Aadhar Number"
              pattern="\d{12}"
              title="Enter 12 digit Aadhar number"
              required
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-black mb-1"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="10 digit Phone Number"
              pattern="\d{10}"
              title="Enter 10 digit phone number"
              required
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Checkbox for terms */}
          <div className="flex items-center">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              required
              className="h-4 w-4 text-black border-black rounded focus:ring-black"
            />
            <label
              htmlFor="agree"
              className="ml-2 block text-sm text-black select-none"
            >
              I agree to the terms and conditions
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-md ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            } transition`}
          >
            {loading ? "Creating..." : "Create Client"}
          </button>

          <p className="mt-4 text-sm text-black">
            Already registered?{" "}
            <Link to="/login" className="underline hover:text-black">
              Login
            </Link>
          </p>

          <p className="mt-6 text-center text-sm text-black">
            Please make sure all details are correct before submitting.
          </p>
        </form>
      </div>

      {/* Right side image with e-commerce related picture */}
      <div
        className="flex-1 relative"
        style={{
          minHeight: "100vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=90')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>
    </div>
  );
}
