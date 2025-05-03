

import Cookies from "js-cookie";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import {
  Gear,
  Bell,
  MagnifyingGlass,
  WarningCircle,
  Plug, // Replacing Wifi with Plug icon
  Users,
  User, // Added Users icon for user-specific options
} from "phosphor-react";

// Navbar.jsx
export default function Navbar() {
  const userType = Cookies.get("UserTypeName");
  const token = Cookies.get("token"); 
  const UserName = Cookies.get("UserName"); // Fetching user type (admin or user)
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal visibility state
  const [notifications, setNotifications] = useState([ // Sample notifications
    "New transaction request received",
    "API balance is low",
    "System update available",
  ]);

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
      localStorage.clear();
      await Swal.fire({
        title: "Successful",
        text: "Logged out successfully",
        icon: "success",
      });

      // Redirect to the login page
      window.location.href = "/";
    }
  };

  // Conditional rendering for admin and user options
  const adminData = [
    { icon: "settings", label: "More Options", action: "moreOptionsAction" },
    { icon: "warning", label: "VQ Alerts", action: "vqAlertsAction" },
    { icon: "search", label: "Search", action: "searchAction" },
    { icon: "bell", label: "Bell", action: "bellAction" },
    { icon: "api", label: "API Balance", action: "apiDashboardAction" },
  ];

  const userData = [
    { icon: "bell", label: "Notifications", action: "bellAction" },
    { icon: "settings", label: "Account Settings", action: "accountSettingsAction" },
  ];

  // Sidebar options based on role
  const roleBasedData = UserName === "Admin" ? adminData : userData;


  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const clearNotifications = () => {
    setNotifications([]);  // Clears all notifications
  };

  const removeNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index)); // Removes a specific notification
  };

  return (
    <nav className="bg-indigo-700 text-white px-8 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-semibold">Dhanupay {userType}</h1>
      <div className="flex items-center gap-6">
        {/* Role-based options */}
        {roleBasedData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer hover:text-blue-300 transition-all duration-200"
            onClick={() => item.action === "bellAction" ? toggleModal() : alert(item.action)} // Show modal when bell clicked
          >
            <div className="bg-white text-blue-600 rounded-full p-3 mb-2">
              {getIcon(item.icon)}
            </div>
            <span className="text-xs">{item.label}</span>
          </div>
        ))}

        <span className="text-sm text-white">Hi, {userType}</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
        >
          Logout
        </button>
      </div>

      {/* Modal for Notifications */}
      {isModalOpen && (
        <div className="fixed  top-14 right-[24vw]  bg-opacity-50 flex items-center text-black justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Notifications</h3>
            <ul className="space-y-2">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li key={index} className="text-sm text-gray-700 flex justify-between items-center">
                    <span>{notification}</span>
                    <button
                      onClick={() => removeNotification(index)} // Removes the notification one by one
                      className="text-red-500 ml-2"
                    >
                      &#10005;
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">No notifications</li>
              )}
            </ul>
            <div className="flex justify-end mt-4">
              {/* <button
                className="bg-indigo-700 text-white py-2 px-4 rounded-lg"
                onClick={toggleModal}
              >
                Close
              </button> */}
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
                onClick={clearNotifications}  // Clears all notifications
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
