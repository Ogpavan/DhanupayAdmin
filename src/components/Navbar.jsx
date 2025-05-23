import Cookies from "js-cookie";
import Swal from "sweetalert2";
import React, { useState } from "react";
import { Bell, X } from "phosphor-react";

export default function Navbar() {
  const userType = Cookies.get("UserTypeName");
  const token = Cookies.get("token");

  const [notifications, setNotifications] = useState([
    "New transaction request received",
    "API balance is low",
    "System update available",
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminBalance, setAdminBalance] = useState(3000);
  const UserTypeName = Cookies.get("UserTypeName");
  // const fetchAdminBalance = async () => {
  //   if (!token) return;
  //   try {
  //     const response = await fetch("https://gateway.dhanushop.com/api/admin/balance", {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     if (response.ok && data.success) {
  //       setAdminBalance(data.balance);
  //     } else {
  //       setAdminBalance("Error");
  //     }
  //   } catch (error) {
  //     setAdminBalance("Error");
  //   }
  // };

  // useEffect(() => {
  //   fetchAdminBalance();
  // }, [token]);
  const UserName = decodeURIComponent(Cookies.get("UserName") || "");
  const AgentId = Cookies.get("AgentId") || "";
  console.log(AgentId)
  const handleLogout = async () => {
    const userId = Cookies.get("UserId");
    const token = Cookies.get("token");
    const userType = Cookies.get("UserTypeName");
    console.log(userType)
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
            Cookies.remove("UserTypeId");
            Cookies.remove("loginid");
            Cookies.remove("newUserId");
            Cookies.remove("role");
            Cookies.remove("AgentId");

            // Navigate based on UserTypeId from response
            if (data.UserTypeId === "1" || data.UserTypeId === 1) {
              window.location.href = "/administrator";
            } else {
              window.location.href = "/login";
            }
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
    <nav className="bg-indigo-700 text-white px-8 py-4 h-[10vh] flex items-center justify-between shadow-md relative">
      <h1 className="text-3xl flex items-center gap-2">
        <img src="/logo-DhanuPayy.png" alt="DhanuPay Logo" className="h-7 object-contain" />
        <span>DHANUPAY</span>
      </h1>

      <div className="flex items-center gap-6">


        <div className="flex flex-col items-end text-white">
          <span className="font-semibold">{UserName}</span>
          <span className="text-xs">
            {UserTypeName === "Employee"
              ? `Employee ID: ${AgentId}`
              : `Agent ID: ${AgentId} `}
          </span>
        </div>
        <div className="flex flex-col items-end text-white">
          <span className="font-semibold">designation</span>
          <span className="text-xs capitalize">
            
             ${userType}
            
          </span>
        </div>


        {/* //wallets */}
        {userType !== "Admin" && userType !== "Employee" && (
          <div className="flex flex-row gap-2 text-sm">
            <div className="flex justify-between items-center border-white hover:border-green-500 border-2 bg-indigo-800 text-white px-4 py-2 rounded-lg shadow">
              <span className="font-medium">Primary Wallet: </span>
              <span>{adminBalance !== null ? ` ₹ ${adminBalance}` : "Loading..."}</span>
            </div>

            <div className="flex justify-between items-center bg-indigo-800 border-white border-2 hover:border-green-500 text-white px-4 py-2 rounded-lg shadow">
              <span className="font-medium">Incentive Wallet: </span>
              <span>{adminBalance !== null ? ` ₹ ${adminBalance}` : "Loading..."}</span>
            </div>
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <div
            className="flex flex-col items-center cursor-pointer hover:text-blue-300 transition-all duration-200"
            onClick={toggleModal}
          >
            <div className="bg-white text-blue-600 rounded-full p-3 relative">
              <Bell size={16} weight="fill" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
          </div>

          {/* Notifications Modal */}
          {isModalOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={toggleModal}
              ></div>

              {/* Modal */}
              <div className="absolute top-12 right-0 z-50">
                <div className="bg-white rounded-lg shadow-2xl w-80 max-h-96 overflow-hidden border border-gray-200">
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Bell size={18} weight="fill" />
                      Notifications
                    </h3>
                    <button
                      onClick={toggleModal}
                      className="hover:bg-indigo-400 p-1 rounded-full transition-colors duration-200"
                    >
                      <X size={18} weight="bold" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification, index) => (
                          <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-150 group">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 leading-relaxed">{notification}</p>
                                <p className="text-xs text-gray-500 mt-1">Just now</p>
                              </div>
                              <button
                                onClick={() => removeNotification(index)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-3 p-1 rounded-full hover:bg-red-50 transition-all duration-200"
                                title="Remove notification"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="text-gray-400 mb-2">
                          <Bell size={32} />
                        </div>
                        <p className="text-gray-500 text-sm">No new notifications</p>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  {notifications.length > 0 && (
                    <div className="border-t border-gray-100 p-3 bg-gray-50">
                      <button
                        onClick={clearNotifications}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Clear All Notifications
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
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