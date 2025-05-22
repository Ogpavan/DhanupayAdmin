// Main layout that includes the navbar, sidebar, and a dynamic content outlet

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "../App.css";


export default function MainLayout() {
  return (
    <div className="h-screen flex flex-col ">
      {/* Top Navbar */}
      <Navbar />

      {/* Flex container with Sidebar and Main Content */}
      <div className="flex flex-1">
        {/* Sidebar navigation */}
        <Sidebar />

        {/* Dynamic page content */}
        <main className="flex-1 px-6 py-3 marker:overflow-scroll  hide-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
