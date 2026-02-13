import { Outlet } from "react-router-dom";
import UserSidebar from "../sidebar/UserSidebar";

export default function Admin() {
  return (
    <div className="flex">
      <UserSidebar />

      <main className="flex-1 min-h-screen bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}
