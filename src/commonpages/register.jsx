import { Link } from "react-router-dom";

export default function RegisterSelection() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative font-sans px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md w-full text-center text-gray-100">
        {/* Logo/Icon */}
        <div className="flex items-center space-x-3">
          {/* Shopping Bag Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 11h14l-1.5 9h-11L5 11z"
            />
          </svg>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">
            Register
          </h1>
        </div>

        {/* Description */}
        <p className="text-gray-300">
          Choose your registration type to begin your shopping journey.
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-6 w-full">
          <Link
            to="/client-register"
            className="flex-1 px-6 py-3 bg-white text-black rounded-md font-semibold shadow-md hover:bg-gray-200 transition"
          >
            Client Register
          </Link>
          <Link
            to="/user-register"
            className="flex-1 px-6 py-3 border border-white text-white rounded-md font-semibold hover:bg-white hover:text-black transition"
          >
            User Register
          </Link>
        </div>
      </div>
    </div>
  );
}
