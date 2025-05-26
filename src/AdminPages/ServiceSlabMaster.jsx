import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";

function ServiceSlabMaster() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [slabs, setSlabs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSlab, setNewSlab] = useState({ OperatorName: "", MinValue: "", MaxValue: "" });

  const token = Cookies.get("token");
  const userid = Cookies.get("UserId");

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedService) {
      fetchSlabs();
    }
  }, [selectedCategory, selectedService]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Service/Servicecategory`,
        {
          Action: "select",
          CategoryID: "N/A",
          CategoryName: "fetch",
          StatusChangeRemark: "",
          CreatedBy: userid,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const active = data.filter((cat) => cat.IsActive !== "False");
      setCategories(active);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Service/Services`,
        {
          Action: "select",
          ServiceID: "N/A",
          CategoryID: "N/A",
          ServiceName: "fetch",
          StatusChangeRemark: "",
          CreatedBy: userid,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchSlabs = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Service/ServiceSlab`,
        {
          Action: "select",
          CategoryID: selectedCategory,
          ServiceID: selectedService,
          OperatorName: "",
          MinValue: "",
          MaxValue: "",
          CreatedBy: userid,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sorted = (Array.isArray(data) ? data : []).sort((a, b) => a.MinValue - b.MinValue);
      setSlabs(sorted);
    } catch (error) {
      console.error("Error fetching slabs:", error);
    }
  };

  const handleAddSlab = async () => {
  const { OperatorName, MinValue, MaxValue } = newSlab;
  if (!OperatorName || !MinValue || !MaxValue) {
    Swal.fire("Error", "All fields are required", "error");
    return;
  }

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/serviceoperator/create`,
      {
        userId: userid,
        serviceCategoryId: selectedCategory,
        serviceId: selectedService,
        operatorName: OperatorName,
        minAmount: MinValue,
        maxAmount: MaxValue,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    Swal.fire("Success", data.message || "Service operator created successfully.", "success");
    setShowModal(false);
    fetchSlabs();
  } catch (error) {
    console.error("Add slab error:", error);
    Swal.fire("Error", "Failed to add service operator", "error");
  }
};


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Service Slab Master</h1>

      <div className="flex gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded w-1/3"
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.CategoryID} value={cat.CategoryID}>
              {cat.CategoryName}
            </option>
          ))}
        </select>

        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="border p-2 rounded w-1/3"
        >
          <option value="">-- Select Service --</option>
          {services
            .filter((srv) => srv.CategoryID === selectedCategory)
            .map((srv) => (
              <option key={srv.ServiceID} value={srv.ServiceID}>
                {srv.ServiceName}
              </option>
            ))}
        </select>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add New Slab
        </button>
      </div>

        {selectedCategory && selectedService && slabs.length > 0 && (
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">S.No</th>
              <th className="border px-4 py-2">Operator Name</th>
              <th className="border px-4 py-2">Min Value</th>
              <th className="border px-4 py-2">Max Value</th>
            </tr>
          </thead>
          <tbody>
            {slabs.map((slab, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{slab.OperatorName}</td>
                <td className="border px-4 py-2">{slab.MinValue}</td>
                <td className="border px-4 py-2">{slab.MaxValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Slab</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Operator Name"
                className="w-full border p-2 rounded"
                value={newSlab.OperatorName}
                onChange={(e) => setNewSlab({ ...newSlab, OperatorName: e.target.value })}
              />
              <input
                type="number"
                placeholder="Min Value"
                className="w-full border p-2 rounded"
                value={newSlab.MinValue}
                onChange={(e) => setNewSlab({ ...newSlab, MinValue: e.target.value })}
              />
              <input
                type="number"
                placeholder="Max Value"
                className="w-full border p-2 rounded"
                value={newSlab.MaxValue}
                onChange={(e) => setNewSlab({ ...newSlab, MaxValue: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSlab}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceSlabMaster;
