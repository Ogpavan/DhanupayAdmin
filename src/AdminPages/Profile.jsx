import React, { useState } from "react";
import { PencilSimple, List, ShieldCheck, Key } from "phosphor-react";
import Swal from "sweetalert2";
import ChangePasswordModal from "./ChangePasswordModal";  // Import ChangePasswordModal
import ChangeMpinModal from "./ChangeMpinModal";  // Import ChangeMpinModal

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [modalVisible, setModalVisible] = useState(null); // 'password' or 'mpin'

  const profile = {
    name: "Admin User",
    email: "admin@dhanupay.com",
    phone: "+91 9876543210",
    role: "Super Admin",
    lastLogin: "28 Apr 2025 - 04:10 PM",
  };

  return (
    <div className="rounded-lg max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-8 mb-6 border-b pb-2">
        {["profile", "security", "activity"].map((tab) => (
          <button
            key={tab}
            className={`flex items-center gap-2 px-4 py-2 text-lg rounded-t-lg ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "profile" && <PencilSimple size={18} />}
            {tab === "security" && <ShieldCheck size={18} />}
            {tab === "activity" && <List size={18} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {Object.entries(profile).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={value}
                disabled
              />
            </div>
          ))}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Last Login</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
              value={profile.lastLogin}
              disabled
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setModalVisible("password")}
              className="w-full flex items-center justify-center gap-2 border py-4 rounded-xl shadow-sm bg-gray-200"
            >
              <ShieldCheck size={25} weight="bold" />
              Change Password
            </button>
            <button
              onClick={() => setModalVisible("mpin")}
              className="w-full flex items-center justify-center gap-2 border py-4 rounded-xl shadow-sm bg-gray-200"
            >
              <Key size={25} weight="bold" />
              Change MPIN
            </button>
          </div>
        </div>
      )}

      {/* Activity Tab */}
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

      {/* Modal - Change Password */}
      {modalVisible === "password" && (
        <ChangePasswordModal onClose={() => setModalVisible(null)} />
      )}

      {/* Modal - Change MPIN */}
      {modalVisible === "mpin" && (
        <ChangeMpinModal onClose={() => setModalVisible(null)} />
      )}
    </div>
  );
}
