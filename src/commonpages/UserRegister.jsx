import { apiFetch } from "../api";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function UserRegister() {
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/auth/user-register", {
        method: "POST",
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          password: e.target.password.value,
          agreedToTerms: e.target.agree.checked,
        }),
      });
      alert("User registered");
      e.target.reset();
    } catch (error) {
      alert("Failed to register user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left side form container */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-16">
        <form
          onSubmit={submit}
          className="w-full max-w-md space-y-6"
          autoComplete="off"
        >
          <h2 className="text-3xl font-extrabold text-black mb-8">
            User Register
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
              htmlFor="password"
              className="block text-sm font-medium text-black mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Checkbox */}
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
            {loading ? "Registering..." : "Register"}
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

      {/* Right side image */}
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
