import { NavLink, useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";
import {
  LayoutDashboard,
  Package,
  PlusSquare,
  ShoppingBag,
  User,
  KeyRound,
  LogOut,
} from "lucide-react";
import ProfileAvatar from "../../components/ProfileAvatar";

export default function ClientSidebar() {
  const navigate = useNavigate();

  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    localStorage.removeItem("role");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
     ${
       isActive
         ? "bg-black text-white"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  const iconClass = "w-5 h-5";

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0">
      
      {/* ===== HEADER ===== */}
      <div className="px-6 py-5 border-b">
        <div className="flex items-center gap-3">
          <ProfileAvatar />
          <h1 className="text-lg font-bold tracking-widest text-black">
            CLIENT PANEL
          </h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Seller Dashboard
        </p>
      </div>

      {/* ===== NAV ===== */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <NavLink to="/client" end className={linkClass}>
          <LayoutDashboard className={iconClass} />
          Dashboard
        </NavLink>

        <NavLink to="/add-product" className={linkClass}>
          <PlusSquare className={iconClass} />
          Add Product
        </NavLink>

        <NavLink to="/allproducts" className={linkClass}>
          <Package className={iconClass} />
          My Products
        </NavLink>

        <NavLink to="/client/orders" className={linkClass}>
          <ShoppingBag className={iconClass} />
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

      {/* ===== LOGOUT ===== */}
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
  );
}
