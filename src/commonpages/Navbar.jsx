import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, LogIn } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const goToDashboard = () => {
    if (!user) return;

    if (user.role === "admin") navigate("/admin");
    else if (user.role === "client") navigate("/client");
    else navigate("/user");
  };

  return (
    <nav className="bg-white border-b p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        🛒 MyShop
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/categories">Categories</Link>


        {user ? (
          <button
            onClick={goToDashboard}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <User size={22} />
          </button>
        ) : (
          <Link
            to="/login"
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <LogIn size={22} />
          </Link>
        )}
      </div>
    </nav>
  );
}