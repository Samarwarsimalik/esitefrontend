import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

const LogoutBtn = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await apiFetch("/auth/logout", {
      method: "POST",
    });

    // local storage clear
    localStorage.removeItem("role");

    // 🔥 redirect to login
    navigate("/login");
  };

  return (
    <button onClick={logout}>
      Logout
    </button>
  );
};

export default LogoutBtn;
