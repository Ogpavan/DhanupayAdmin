import React, { useEffect, useState } from "react";
import UserDetailsModal from "./UserDetailsModal";
import KycDetailsModal from "./KycDetailsModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const UserSummaryTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();



  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const userId = Cookies.get("UserId");

        // console.log("[DEBUG] Token and UserId from cookies:", token, userId);

        if (!token || !userId) {
          console.error("Missing token or userId in cookies");
          setUsers([]);
          setLoading(false);
          return;
        }

        const response = await axios.post(
          "https://gateway.dhanushop.com/api/users/AllUserDetails",
          { UserID: userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          console.log("[DEBUG] Users fetched from API:", response.data.users);
          setUsers(response.data.users || []);
        } else {
          console.error("API call successful but users not found.");
          setUsers([]);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewDetails = (user) => {
    const formattedUser = {
      usertypename: user.usertypename,
      userId: user.userId,
      newuserId: user.NewUserId,
      
      firstName: user.FirstName,
      lastName: user.LastName,
      mobile: user.MobileNumber,
      altMobile: user.AlternateMobileNumber,
      email: user.Email,
      resState: user.personalsatename,
      resCity: user.personalcityname,
      resPincode: user.PersonalPincode,
      resHouseNo: user.PersonalAddressLine1,
      resArea: user.PersonalAddressLine2,
      resLandmark: user.PersonalLandmark,
      shopName: user.ShopName,
      shopAddress: `${user.ShopAddressLine1 || ""} ${user.ShopAddressLine2 || ""}`.trim(),
      busState: user.shopsatename,
      busCity: user.shopcityname,
      busPincode: user.ShopPincode,
      busLandmark: user.ShopLandmark,
      businessName: user.BusinessName,
      firmName: user.FirmName,
      aadhaar: user.AadhaarNumber,
      pan: user.PanNumber,
      kycVerified: user.IsKYC === "True" && user.IsDocumentVerified === "True",
      esignVerified: user.IsEsignVerified === "True",
      video: { name: user.VideoFileName },
      profilePhoto: { name: user.ProfilePhotoName },
      shopPhoto: { name: user.ShopPhotoName },
      aadhaarFront: { name: user.AadhaarFrontFile },
      aadhaarBack: { name: user.AadhaarBackFile },
      panCardFile: { name: user.PanCardFile },
    };

    setSelectedUser(formattedUser);
    setShowDetailsModal(true);
  };

const handleViewKyc = (user) => {
  const formattedUser = {
    ...user,
    userId: user.UserId || user.userId || "",
    newUserId: user.NewUserId || user.newUserId || "",
    aadhaarNumber: user.AadhaarNumber || "",
    panNumber: user.PanNumber || "",
  };

  // console.log("[DEBUG] KYC Modal opening with data:", formattedUser); // ✅ Use correct variable name

  setSelectedUser(formattedUser);
  setShowKycModal(true);
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        {/* Simple spinner using Tailwind */}
        <svg
          className="animate-spin h-12 w-12 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl font-semibold">User Summary</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/admin/registrationmodal")}
        >
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
            <th className="px-4 py-2 border">KYC</th>
            <th className="px-4 py-2 border">eSign</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.UserType?.toLowerCase() !== "employee")
            .map((user) => {
              const isKYCVerified = user.IsKYC === "True" && user.IsDocumentVerified === "True";
              const isEsignVerified = user.IsEsignVerified === "True";

              return (
                <tr key={user.UserId || user.NewUserID}>
                  <td className="px-4 py-2 border">{user.usertypename}</td>
                  <td className="px-4 py-2 border">{user.FirstName}</td>
                  <td className="px-4 py-2 border">{user.LastName}</td>
                  <td className="px-4 py-2 border">{user.MobileNumber}</td>
                  <td className="px-4 py-2 border">{user.Email}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleViewKyc(user)}
                      className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${
                        isKYCVerified ? "bg-green-600" : "bg-yellow-600"
                      }`}
                    >
                      {isKYCVerified ? "Verified" : "Pending"}
                    </button>
                  </td>
                  <td
                    className={`px-4 py-2 border ${
                      isEsignVerified ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isEsignVerified ? "Verified" : "Not Verified"}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          formData={selectedUser}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showKycModal && selectedUser && (
        <KycDetailsModal
          formData={selectedUser}
          onClose={() => setShowKycModal(false)}
        />
      )}
    </div>
  );
};

export default UserSummaryTable;
