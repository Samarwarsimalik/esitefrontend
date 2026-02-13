import { apiFetch } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

 const submit = async (e) => {
  e.preventDefault();

  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: e.target.email.value,
      password: e.target.password.value,
    }),
  });

  const data = await res.json();

  // ❌ ERROR CASE
  if (!res.ok) {
    alert(data.message || "Login failed");
    return; // ⛔ yahin stop
  }

  // ✅ SUCCESS CASE
  localStorage.setItem("role", data.role);
  navigate(`/${data.role}`);
};

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-black">
      
      {/* LEFT IMAGE */}
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
          alt="Fashion"
          className="h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-16 left-12 text-white max-w-sm">
          <h1 className="text-4xl font-bold tracking-wide">MINIMAL STORE</h1>
          <p className="mt-3 text-sm opacity-80">
            Curated fashion & lifestyle pieces for modern living.
          </p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center bg-white px-6">
        <form
          onSubmit={submit}
          className="w-full max-w-md bg-white border border-gray-200 rounded-xl
                     p-10 space-y-7 shadow-sm"
        >
          <div>
            <h2 className="text-3xl font-semibold text-black">Sign in</h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back. Please enter your details.
            </p>
          </div>

          <div className="space-y-5">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
              className="w-full px-4 py-3.5 border border-gray-300 rounded-md
                         focus:border-black focus:outline-none transition"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3.5 border border-gray-300 rounded-md
                         focus:border-black focus:outline-none transition"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-black" />
              Remember me
            </label>

            <Link to="/forgot-password" className="underline text-black">
              Forgot?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3.5 rounded-md
                       tracking-widest text-sm font-medium
                       hover:scale-[1.02] active:scale-[0.98]
                       transition-all"
          >
            SIGN IN
          </button>

          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link to="/register" className="underline text-black">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
