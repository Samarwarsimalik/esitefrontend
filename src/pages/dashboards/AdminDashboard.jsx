import { Outlet } from "react-router-dom";
import ClientSidebar from "../sidebar/Sidebar";
import MonthlyorderGraph from "../MonthlyorderGraph";
import Graph from "../Graph";

export default function Admin() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      {/* Sidebar */}
      <ClientSidebar />

      {/* Main Content */}
      <main className="flex-1 w-full p-4 sm:p-6 md:p-8 overflow-auto">
        {/* Nested Routes */}
        <Outlet />

        {/* Graph Section */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <MonthlyorderGraph />
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <Graph />
          </div>

        </div>
      </main>
    </div>
  );
}
