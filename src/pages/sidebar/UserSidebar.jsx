import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../../api";
import {
  Home,
  ShoppingCart,
  Box,
  User,
  CreditCard,
  KeyRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import ProfileAvatar from "../../components/ProfileAvatar";

export default function UserSidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
     ${
       isActive
         ? "bg-black text-white shadow-md"
         : "text-gray-700 hover:bg-gray-100 hover:pl-6"
     }`;

  const iconClass = "w-5 h-5";

  return (
    <>
      {/* ===== MOBILE TOP BAR ===== */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ProfileAvatar />
          <h1 className="text-sm font-bold tracking-widest">
            USER PANEL
          </h1>
        </div>

        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ===== OVERLAY ===== */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed md:fixed top-0 left-0 z-50
        w-64 h-screen bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 flex flex-col`}
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <ProfileAvatar />
              <h1 className="text-lg font-bold tracking-widest">
                USER DASHBOARD
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Welcome Back!
            </p>
          </div>

          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <NavLink to="/user" end className={linkClass}>
            <Home className={iconClass} />
            Dashboard
          </NavLink>

          <NavLink to="/" className={linkClass}>
            <Box className={iconClass} />
            Products
          </NavLink>

          <NavLink to="/cart" className={linkClass}>
            <ShoppingCart className={iconClass} />
            Cart
          </NavLink>

          <NavLink to="/user/orders" className={linkClass}>
            <CreditCard className={iconClass} />
            Orders
          </NavLink>

          <NavLink to="/profile" className={linkClass}>
            <User className={iconClass} />
            Profile
          </NavLink>

          <NavLink to="/change-password" className={linkClass}>
            <KeyRound className={iconClass} />
            Change Password
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg
                       text-sm font-medium text-gray-700
                       hover:bg-black hover:text-white transition-all"
          >
            <LogOut className={iconClass} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}