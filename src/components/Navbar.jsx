import Cookies from "js-cookie";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import { Bell } from "phosphor-react";

export default function Navbar() {
  const userType = Cookies.get("UserTypeName");
  const token = Cookies.get("token");
  const UserName = Cookies.get("UserName");
  const [notifications, setNotifications] = useState([
    "New transaction request received",
    "API balance is low",
    "System update available",
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminBalance, setAdminBalance] = useState(3000);

  // Fetch Admin Balance
  // useEffect(() => {
  //   const fetchAdminBalance = async () => {
  //     if (!token) return;
  //     try {
  //       const response = await fetch("https://gateway.dhanushop.com/api/admin/balance", {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       const data = await response.json();

  //       if (response.ok && data.success) {
  //         setAdminBalance(data.balance); // Assuming `data.balance` contains the admin balance
  //       } else {
  //         console.error("Failed to fetch admin balance:", data.message);
  //         setAdminBalance("Error");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching admin balance:", error);
  //       setAdminBalance("Error");
  //     }
  //   };

  //   fetchAdminBalance();
  // }, [token]);

  const handleLogout = async () => {
    const userId = Cookies.get("UserId");
    const token = Cookies.get("token");

    if (!userId || !token) {
      Swal.fire({
        title: "Error",
        text: "User ID or token is missing. Unable to logout.",
        icon: "error",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "No, Stay Logged In",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("https://gateway.dhanushop.com/api/users/Logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ UserId: userId }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          Swal.fire({
            title: "Success",
            text: data.Message || "Logged out successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            Cookies.remove("token");
            Cookies.remove("UserTypeName");
            Cookies.remove("UserName");
            Cookies.remove("UserId");
            localStorage.clear();
            window.location.href = "/";
          });
        } else {
          Swal.fire({
            title: "Error",
            text: data.Message || "Failed to logout. Please try again.",
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "An error occurred while logging out. Please try again.",
          icon: "error",
        });
      }
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const clearNotifications = () => setNotifications([]);
  const removeNotification = (index) => setNotifications(notifications.filter((_, i) => i !== index));

  return (
    <nav className="bg-indigo-700 text-white px-8 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-2xl font-semibold">Dhanupay {UserName}</h1>
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div
          className="flex flex-col items-center cursor-pointer hover:text-blue-300 transition-all duration-200"
          onClick={toggleModal}
        >
          <div className="bg-white text-blue-600 rounded-full p-3 mb-2">
            <Bell size={24} weight="fill" />
          </div>
          <span className="text-xs">Notifications</span>
        </div>

        <p className="flex flex-col">  Balance:       <span className="text-2xl text-white">
          {adminBalance !== null ? `₹${adminBalance}` : "Loading..."}
        </span>
        </p>

        <button
          onClick={handleLogout}
          className="text-sm bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
        >
          Logout
        </button>
      </div>

      {/* Modal for Notifications */}
      {isModalOpen && (
        <div className="fixed top-14 right-[24vw] bg-opacity-50 flex items-center text-black justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Notifications</h3>
            <ul className="space-y-2">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li key={index} className="text-sm text-gray-700 flex justify-between items-center">
                    <span>{notification}</span>
                    <button
                      onClick={() => removeNotification(index)}
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
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
                onClick={clearNotifications}
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
