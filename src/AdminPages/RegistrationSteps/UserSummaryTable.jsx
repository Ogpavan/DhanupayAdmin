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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("token"); // Ensure 'token' is stored in cookies
        const userId = Cookies.get("UserId") || "2"; // Default to '2' if not found

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
          setUsers(response.data.users || []);
        } else {
          console.error("API call successful but users not found.");
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

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
          {users.map((user) => {
            const isKYCVerified = user.IsKYC === "True" && user.IsDocumentVerified === "True";
            const isEsignVerified = user.IsEsignVerified === "True";

            return (
              <tr key={user.UserId}>
                <td className="px-4 py-2 border">{user.UserType || "-"}</td>
                <td className="px-4 py-2 border">{user.FirstName || "-"}</td>
                <td className="px-4 py-2 border">{user.LastName || "-"}</td>
                <td className="px-4 py-2 border">{user.MobileNumber || "-"}</td>
                <td className="px-4 py-2 border">{user.Email || "-"}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowKycModal(true);
                    }}
                    className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${
                      isKYCVerified ? "bg-green-600" : "bg-yellow-600"
                    }`}
                  >
                    {isKYCVerified ? "Verified" : "Pending"}
                  </button>
                </td>
                <td className={`px-4 py-2 border ${isEsignVerified ? "text-green-600" : "text-red-600"}`}>
                  {isEsignVerified ? "Verified" : "Not Verified"}
                </td>
                <td className="px-4 py-2 border">
                  <button
onClick={() => {
  setSelectedUser({
    userType: user.UserType,
    firstName: user.FirstName,
    lastName: user.LastName,
    mobile: user.MobileNumber,
    altMobile: user.AlternateMobileNumber,
    email: user.Email,

    resState: user.PersonalStateID,
    resCity: user.PersonalCityID,
    resPincode: user.PersonalPincode,
    resHouseNo: user.PersonalAddressLine1,
    resArea: user.PersonalAddressLine2,
    resLandmark: user.PersonalLandmark,

    shopName: user.ShopName,
    shopAddress: `${user.ShopAddressLine1 || ""} ${user.ShopAddressLine2 || ""}`.trim(),

    busState: user.ShopStateID,
    busCity: user.ShopCityID,
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
    PAN: { name: user.PanCardFile },
  });

  setShowDetailsModal(true);
}}

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
        <UserDetailsModal formData={selectedUser} onClose={() => setShowDetailsModal(false)} />
      )}

      {showKycModal && selectedUser && (
        <KycDetailsModal formData={selectedUser} onClose={() => setShowKycModal(false)} />
      )}
    </div>
  );
};

export default UserSummaryTable;
