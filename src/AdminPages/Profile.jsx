import React, { useEffect, useState, useMemo } from "react";
import { PencilSimple, List, ShieldCheck, Key } from "phosphor-react";
import Swal from "sweetalert2";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeMpinModal from "./ChangeMpinModal";
import axios from "axios";
import Cookies from "js-cookie";
import { FaSortDown, FaSortUp } from "react-icons/fa";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [modalVisible, setModalVisible] = useState(null); // 'password' or 'mpin'
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState([]);

  // Pagination & sorting/filter states for Activity Log
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "LoginTime", direction: "desc" });
  const [filterDates, setFilterDates] = useState({ from: "", to: "" });

  const token = Cookies.get("token");
  const userId = Cookies.get("UserId");

  useEffect(() => {
    const fetchProfileAndActivity = async () => {
      setLoading(true);
      try {
        const [profileRes, activityRes] = await Promise.all([
          axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/ProfileDetails`,
            { UserID: userId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
          axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/User/ActivityLog`,
            { UserID: userId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

        if (profileRes.data.success) {
          const { FirstName, LastName, Email, MobileNumber, Role } = profileRes.data;
          setProfile({
            name: `${FirstName} ${LastName}`,
            email: Email,
            phone: MobileNumber,
            role: Role,
            lastLogin: profileRes.data.LastLogin, // Assuming this is available, else remove
          });
        }

        setActivityLog(Array.isArray(activityRes.data) ? activityRes.data : []);
      } catch (error) {
        console.error("Error fetching profile or activity:", error);
        Swal.fire("Error", "Something went wrong", "error");
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      fetchProfileAndActivity();
    }
  }, [token, userId]);

  // Helper: Sort and filter activity log data
  const sortedActivity = useMemo(() => {
    let sortableItems = [...activityLog];

    // Filter by date range
    if (filterDates.from) {
      sortableItems = sortableItems.filter(
        (item) => new Date(item.LoginTime) >= new Date(filterDates.from)
      );
    }
    if (filterDates.to) {
      sortableItems = sortableItems.filter(
        (item) => new Date(item.LoginTime) <= new Date(filterDates.to)
      );
    }

    // Sort logic
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aKey = a[sortConfig.key] || "";
        let bKey = b[sortConfig.key] || "";

        if (sortConfig.key === "LoginTime" || sortConfig.key === "LogoutTime") {
          aKey = aKey ? new Date(aKey) : new Date(0);
          bKey = bKey ? new Date(bKey) : new Date(0);
        } else {
          aKey = aKey.toString().toLowerCase();
          bKey = bKey.toString().toLowerCase();
        }

        if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
        if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableItems;
  }, [activityLog, sortConfig, filterDates]);

  // Pagination
  const paginatedActivity = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedActivity.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedActivity, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedActivity.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center text-gray-600 py-8">No profile data available.</div>;
  }

  return (
    <div className="rounded-lg max-w-4xl mx-auto p-4">
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
              value={profile.lastLogin || "N/A"}
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
        <div className="text-sm text-gray-700 max-h-[450px] overflow-y-auto">
          {/* Filter by date range */}
          <div className="flex gap-4 mb-4 items-center">
            <label>
              From:{" "}
              <input
                type="date"
                value={filterDates.from}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilterDates((prev) => ({ ...prev, from: e.target.value }));
                }}
                className="border rounded px-2 py-1"
              />
            </label>
            <label>
              To:{" "}
              <input
                type="date"
                value={filterDates.to}
                onChange={(e) => {
                  setCurrentPage(1);
                  setFilterDates((prev) => ({ ...prev, to: e.target.value }));
                }}
                className="border rounded px-2 py-1"
              />
            </label>
            <button
              className=" underline"
              onClick={() => {
                setFilterDates({ from: "", to: "" });
                setCurrentPage(1);
              }}
            >
               Clear Filters
            </button>
          </div>

          {sortedActivity.length === 0 ? (
            <p>No activity found.</p>
          ) : (
            <>
              <table className="min-w-full text-left border text-xs">
                <thead className="bg-gray-100 cursor-pointer select-none">
                  {[
                    { label: "Login Time", key: "LoginTime" },
                    { label: "Logout Time", key: "LogoutTime" },
                    { label: "IP Address", key: "IPAddress" },
                    { label: "Media", key: "MediaType" },
                    { label: "Logout Type", key: "LogoutType" },
                  ].map(({ label, key }) => (
                    <th
                      key={key}
                      className="px-3 py-2 border"
                      onClick={() => requestSort(key)}
                    >
                      {label}
                      {sortConfig.key === key && (
                        <span>{sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />}</span>
                      )}
                    </th>
                  ))}
                </thead>
                <tbody>
                  {paginatedActivity.map((entry, idx) => (
                    <tr key={idx} className="even:bg-gray-50">
                      <td className="px-3 py-2 border">{entry.LoginTime}</td>
                      <td className="px-3 py-2 border">{entry.LogoutTime || "-"}</td>
                      <td className="px-3 py-2 border">{entry.IPAddress || "N/A"}</td>
                      <td className="px-3 py-2 border">{entry.MediaType}</td>
                      <td className="px-3 py-2 border">{entry.LogoutType || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-3">
                <div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="mx-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div>
                  <label>
                    Items per page:{" "}
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border rounded px-2 py-1"
                    >
                      {[5, 10, 20, 50].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Modals */}
      {modalVisible === "password" && <ChangePasswordModal onClose={() => setModalVisible(null)} />}
      {modalVisible === "mpin" && <ChangeMpinModal onClose={() => setModalVisible(null)} />}
    </div>
  );
}
