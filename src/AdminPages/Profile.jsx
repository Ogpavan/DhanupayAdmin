import { useState } from "react";
import { PencilSimple, Lock, List } from "phosphor-react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  const profile = {
    name: "Admin User",
    email: "admin@dhanupay.com",
    phone: "+91 9876543210",
    role: "Super Admin",
    lastLogin: "28 Apr 2025 - 04:10 PM",
  };

  return (
    <div className="rounded-lg p-6 max-w-4xl mx-auto  ">
 

      {/* Tab Buttons */}
      <div className="flex gap-8 mb-6 border-b pb-2">
        <button
          className={`flex items-center gap-2 px-4 py-2 text-lg rounded-t-lg ${
            activeTab === "profile"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <PencilSimple size={18} /> Profile Info
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 text-lg rounded-t-lg ${
            activeTab === "security"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("security")}
        >
          <Lock size={18} /> Security
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 text-lg rounded-t-lg ${
            activeTab === "activity"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("activity")}
        >
          <List size={18} /> Activity Log
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {Object.entries(profile).map(([key, value]) => (
            <div key={key} className="flex flex-col ">
              <label className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={value}
                disabled
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="flex flex-col ">
            <label className="font-medium text-gray-700">Last Login</label>
            <input
              type="text"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
              value={profile.lastLogin}
              disabled
            />
          </div>

          
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Current MPIN</label>
            <input
              type="password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter new 6-digit MPIN"
              maxLength={6}
              inputMode="numeric"
            />
          </div>
 
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">New MPIN</label>
            <input
              type="password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter new 6-digit MPIN"
              maxLength={6}
              inputMode="numeric"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Confirm MPIN</label>
            <input
              type="password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Re-enter MPIN"
              maxLength={6}
              inputMode="numeric"
            />
          </div>
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300">
            Update MPIN
          </button>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="text-sm text-gray-700">
          <ul className="list-disc ml-5 space-y-3">
            <li>Logged in from IP 192.168.0.15 at 04:10 PM</li>
            <li>Edited City List - Noida added</li>
            <li>Deleted user account #R123456</li>
            <li>Approved PAN KYC for Retailer #R08934</li>
          </ul>
        </div>
      )}
    </div>
  );
}
