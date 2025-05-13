import React, { useState } from "react";
import UserDetailsModal from "./UserDetailsModal";
import KycDetailsModal from "./KycDetailsModal";
import RegistrationModal from "./RegistrationModal";
import { X } from "phosphor-react";
import { useNavigate } from "react-router-dom";



const UserSummaryTable = ({ formData = {} }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);   const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);

  const navigate = useNavigate();

  const data = {
    userType: formData.userType || "Retailer",
    firstName: formData.firstName || "Pawan",
    lastName: formData.lastName || "Pal",
    mobile: formData.mobile || "9876543210",
    email: formData.email || "pawan@example.com",
    city: formData.resCity || "New Delhi",
    shopName: formData.shopName || "Acheivers Cafe",
    kycVerified: formData.kycVerified ?? true,
    esignVerified: formData.esignVerified ?? false,
  };

  const documentStatusKeys = [
    "aadhaarFrontStatus",
    "aadhaarBackStatus",
    "panStatus",
    "profilePhotoStatus",
    "shopPhotoStatus",
    "videoStatus",
  ];

  const isAllApproved = documentStatusKeys.every(
    (key) => formData[key] === "Approved"
  );

  return (
    <div className="overflow-auto">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl font-semibold">User Summary</h2>
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      onClick={() => navigate("/admin/registrationmodal")}>
  Create New User
</button>

      </div>

      <table className="min-w-full border border-gray-300 text-sm text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">User Type</th>
            <th className="px-4 py-2 border">First Name</th>
            <th className="px-4 py-2 border">Last Name</th>
            <th className="px-4 py-2 border">Mobile</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">City</th>
            <th className="px-4 py-2 border">Shop Name</th>
            <th className="px-4 py-2 border">KYC</th>
            <th className="px-4 py-2 border">eSign</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 border">{data.userType}</td>
            <td className="px-4 py-2 border">{data.firstName}</td>
            <td className="px-4 py-2 border">{data.lastName}</td>
            <td className="px-4 py-2 border">{data.mobile}</td>
            <td className="px-4 py-2 border">{data.email}</td>
            <td className="px-4 py-2 border">{data.city}</td>
            <td className="px-4 py-2 border">{data.shopName || "-"}</td>
            <td className="px-4 py-2 border text-center">
              <button
                onClick={() => setShowKycModal(true)}
                className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${
                  isAllApproved ? "bg-green-600" : "bg-yellow-600"
                }`}
              >
                {isAllApproved ? "Verified" : "Pending"}
              </button>
            </td>
            <td className={`px-4 py-2 border ${data.esignVerified ? "text-green-600" : "text-red-600"}`}>
              {data.esignVerified ? "Verified" : "Not Verified"}
            </td>
            <td className="px-4 py-2 border">
              <button
                onClick={() => setShowDetailsModal(true)}
                className="text-blue-600 hover:underline"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {showDetailsModal && (
        <UserDetailsModal formData={formData} onClose={() => setShowDetailsModal(false)} />
      )}

      {showKycModal && (
        <KycDetailsModal formData={formData} onClose={() => setShowKycModal(false)} />
      )}

        
 </div>
  );
};

export default UserSummaryTable;
