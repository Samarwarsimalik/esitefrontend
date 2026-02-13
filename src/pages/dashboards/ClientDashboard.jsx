import { Outlet } from "react-router-dom";
import ClientSidebar from "../sidebar/ClientSidebar";
import MonthlyorderGraph from "../MonthlyorderGraph";
import Graph from "../Graph";

export default function Admin() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <ClientSidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />

        <div className="mt-8 flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <MonthlyorderGraph />
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <Graph />
          </div>
        </div>
      </main>
    </div>
  );
}
