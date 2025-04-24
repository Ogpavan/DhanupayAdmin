import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import {
  Gear,
  Bell,
  MagnifyingGlass,
  WarningCircle,
  Plug // Replacing Wifi with Plug icon
} from "phosphor-react";

// Navbar.jsx
export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);

  // Fetch data from JSON (or later from API)
  useEffect(() => {
    const fetchData = async () => {
      // For demo purposes, you can load the JSON directly
      const jsonData = [
        {
          icon: "settings",
          label: "More Options",
          action: "moreOptionsAction",
        },
        {
          icon: "warning",
          label: "VQ Alerts",
          action: "vqAlertsAction",
        },
        {
          icon: "search",
          label: "Search",
          action: "searchAction",
        },
        {
          icon: "bell",
          label: "Bell",
          action: "bellAction",
        },
        {
          icon: "api",
          label: "API Balance",
          action: "apiDashboardAction",
        },
      ];
      setData(jsonData);
    };
    fetchData();
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case "settings":
        return <Gear size={24} weight="fill" />;
      case "warning":
        return <WarningCircle size={24} weight="fill" />;
      case "search":
        return <MagnifyingGlass size={24} weight="fill" />;
      case "bell":
        return <Bell size={24} weight="fill" />;
      case "api":
        return <Plug size={24} weight="fill" />;
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    // Clear localStorage before the confirmation
    localStorage.clear();

    // Show the confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    });

    // If the user confirms, proceed with logout and redirection
    if (result.isConfirmed) {
      await Swal.fire({
        title: "Successful",
        text: "Logged out successfully",
        icon: "success",
      });

      // Redirect to the login page
      window.location.href = "/login";
    }
  };

  return (
    <nav className="bg-indigo-700  text-white px-8 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-semibold">Dhanupay Admin</h1>
      <div className="flex items-center gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center text-white cursor-pointer hover:text-blue-300 transition-all duration-200"
            onClick={() => alert(item.action)} // Placeholder for the action
          >
            <div className="bg-white text-blue-600 rounded-full p-3 mb-2">
              {getIcon(item.icon)}
            </div>
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
        <span className="text-sm text-white">Hi, {user?.username || "Admin"}</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
