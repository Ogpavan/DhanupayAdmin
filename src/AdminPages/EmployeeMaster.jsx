import React, { useEffect, useState } from "react";
import UserDetailsModal from "../AdminPages/RegistrationSteps/UserDetailsModal";
import KycDetailsModal from "./RegistrationSteps/KycDetailsModal.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const EmployeeMaster = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusLoadingIds, setStatusLoadingIds] = useState([]);
  const [statusMessages, setStatusMessages] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const token = Cookies.get("token");
  const userId = Cookies.get("UserId");
 //employes master 


    const fetchUsers = async () => {
      setLoading(true);
      try {
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
          setUsers(response.data.users || []);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchUsers();
  }, [token, userId]);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleViewKyc = (user) => {
    setSelectedUser(user);
    setShowKycModal(true);
  };

  const handleStatusChange = async (user, newStatus) => {
    if (!token || !userId) {
      alert("Authorization token or UserId missing");
      return;
    }

    const newUserId = user.NewUserID;
    setStatusLoadingIds((ids) => [...ids, newUserId]);
    setStatusMessages((msgs) => ({ ...msgs, [newUserId]: "" }));

    try {
      const response = await axios.post(
        "https://gateway.dhanushop.com/api/users/ChangeUserStatus",
        {
          UserID: userId,
          NewUserId: newUserId,
          UserStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setStatusMessages((msgs) => ({
          ...msgs,
          [newUserId]: "Status updated successfully",
        }));

        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.NewUserID === newUserId ? { ...u, UserStatus: newStatus } : u
          )
        );
      } else {
        setStatusMessages((msgs) => ({
          ...msgs,
          [newUserId]: "Failed to update status",
        }));
      }
    } catch (error) {
      setStatusMessages((msgs) => ({
        ...msgs,
        [newUserId]: "Error updating status",
      }));
    } finally {
      setStatusLoadingIds((ids) => ids.filter((id) => id !== newUserId));
    }
  };

   
  // Filter & Paginate
  const filteredUsers = users.filter(
    (user) => user.UserType?.toLowerCase() == "1"
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
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
        <h2 className="text-2xl font-semibold">Employee Summary</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate("/admin/employeeregistration")}
        >
          Add New Employee
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
            <th className="px-4 py-2 border">User Status</th>
            <th className="px-4 py-2 border">Login Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => {
            const isEsignVerified = user.IsEsignVerified === "True";
            const userStatus = user.UserStatus || "Pending";
            const isLoading = statusLoadingIds.includes(user.NewUserID);

            return (
              <tr key={user.NewUserID}>
                <td className="px-4 py-2 border">{user.usertypename}</td>
                <td className="px-4 py-2 border">{user.FirstName}</td>
                <td className="px-4 py-2 border">{user.LastName}</td>
                <td className="px-4 py-2 border">{user.MobileNumber}</td>
                <td className="px-4 py-2 border">{user.Email}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleViewKyc(user)}
                    className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${
                      user.KycStatus === "Approved"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {user.KycStatus === "Approved" ? "Verified" : "Pending"}
                  </button>
                </td>
                  <td
                  className={`px-4 py-2 border ${
                    user.EsignStatus?.toLowerCase() === "verified"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {user.EsignStatus}
                </td>
                <td className="px-4 py-2 border">
                  <select
                    disabled={isLoading}
                    value={userStatus}
                    onChange={(e) => handleStatusChange(user, e.target.value)}
                    className={`border rounded-full px-2 py-1 text-sm text-white transition-colors duration-200 ${
                      userStatus === "Verified"
                        ? "bg-green-600"
                        : userStatus === "Pending"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </td>
                <td
  className={`px-4 py-2 border ${
    user.LoginStatus.toLowerCase() === "active"
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {user.LoginStatus.toLowerCase()}
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          formData={selectedUser}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showKycModal && selectedUser && (
        <KycDetailsModal
          formData={selectedUser}
          onClose={() => {
            setShowKycModal(false);
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default EmployeeMaster;
