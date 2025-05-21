import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AssignServicesModal = ({ user, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token");
  const currentUserId = Cookies.get("UserId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, assignedRes] = await Promise.all([
          axios.post(
            "https://gateway.dhanushop.com/api/Service/Servicecategory",
            {
              Action: "select",
              CategoryID: "",
              CategoryName: "bbps",
              StatusChangeRemark: "",
              CreatedBy: "",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
          axios.post(
            "https://gateway.dhanushop.com/api/User/GetMappedServices",
            {
              UserId: parseInt(currentUserId),
              NewUserId: user.NewUserID,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

        const available = categoriesRes.data || [];
        const assigned = assignedRes.data?.ServiceCategoryIds || [];

        setCategories(available);
        setSelectedIds(assigned.map(String));
      } catch (err) {
        console.error("Error loading data", err);
      }
    };

    fetchData();
  }, [token, user.NewUserID, currentUserId]);

  const toggleCategory = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://gateway.dhanushop.com/api/User/ServiceMapping",
        {
          UserId: parseInt(currentUserId),
          NewUserId: user.NewUserID,
          ServiceCategoryIds: selectedIds.map(Number),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success) {
        alert("Services assigned successfully.");
        onSuccess?.();
        onClose();
      } else {
        alert("Failed to assign services.");
      }
    } catch (err) {
      console.error("Error assigning services:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 sm:px-6">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
          Assign Services to {user.FirstName}
        </h2>

        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <label
                key={cat.CategoryID}
                className="flex items-center gap-2 text-sm sm:text-base"
              >
                <input
                  type="checkbox"
                  value={cat.CategoryID}
                  checked={selectedIds.includes(cat.CategoryID)}
                  onChange={() => toggleCategory(cat.CategoryID)}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-gray-700">{cat.CategoryName}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No service categories found.</p>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleAssign}
            className={`w-full sm:w-auto px-4 py-2 rounded text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignServicesModal;
