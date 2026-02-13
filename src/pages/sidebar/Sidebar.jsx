import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../../api";
import {
  LayoutDashboard,
  PlusSquare,
  Layers,
  Tag,
  Award,
  Settings,
  ShoppingBag,
  UserCheck,
  Users,
  KeyRound,
  Package,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import ProfileAvatar from "../../components/ProfileAvatar";

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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
    <>
      {/* ===== MOBILE TOP BAR ===== */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <ProfileAvatar />
          <h1 className="text-sm font-bold tracking-widest">ADMIN</h1>
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
        className={`fixed md:static top-0 left-0 z-50
        w-64 min-h-screen bg-white border-r border-gray-200
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 flex flex-col`}
      >
        {/* ===== HEADER ===== */}
        <div className="px-6 py-5 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ProfileAvatar />
            <h1 className="text-lg font-bold tracking-widest text-black">
              ADMIN PANEL
            </h1>
          </div>

          {/* Close button mobile */}
          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== NAV ===== */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard className={iconClass} />
            Dashboard
          </NavLink>

          <NavLink to="/add-product" className={linkClass}>
            <PlusSquare className={iconClass} />
            Add Product
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            <Package className={iconClass} />
            All Products
          </NavLink>

          <NavLink to="/admin/categories" className={linkClass}>
            <Layers className={iconClass} />
            Categories
          </NavLink>

          <NavLink to="/admin/brands" className={linkClass}>
            <Award className={iconClass} />
            Brands
          </NavLink>

          <NavLink to="/admin/tags" className={linkClass}>
            <Tag className={iconClass} />
            Tags
          </NavLink>

          <NavLink to="/admin/attributes" className={linkClass}>
            <Settings className={iconClass} />
            Attributes
          </NavLink>

          <NavLink to="/admin/orders" className={linkClass}>
            <ShoppingBag className={iconClass} />
            Orders
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <Users className={iconClass} />
            Users
          </NavLink>

          <NavLink to="/admin/clientapprov" className={linkClass}>
            <UserCheck className={iconClass} />
            Client Approval
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
    </>
  );
}
