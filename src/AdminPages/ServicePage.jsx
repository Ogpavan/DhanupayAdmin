import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    Action: "insert",
    ServiceID: "",
    CategoryID: "",
    ServiceName: "",
    StatusChangeRemark: "",
    CreatedBy: "",
  });
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = Cookies.get("token");
  const userid = Cookies.get("UserId");
  const navigate = useNavigate();

  useEffect(() => {
    if (userid) {
      setFormData((prev) => ({ ...prev, CreatedBy: userid }));
    }
    fetchServices();
    fetchCategories();
  }, [userid]);

  const fetchServices = async () => {
    try {
      const { data } = await axios.post(
        "https://gateway.dhanushop.com/api/Service/Services",
        {
          Action: "select",
          ServiceID: "N/A ",
          CategoryID: " N/A",
          ServiceName: "Fetch ",
          StatusChangeRemark: " ",
          CreatedBy: userid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Services data", data);
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch services error:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.post(
        "https://gateway.dhanushop.com/api/Service/Servicecategory",
        {
          Action: "select",
          CategoryID: "N/A",
          CategoryName: "fetch",
          StatusChangeRemark: "",
          CreatedBy: userid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Categories data", data);
      const activeCategories = Array.isArray(data)

        ? data.filter((cat) => cat.IsActive !== "False")
        : [];
      setCategories(activeCategories);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };


  //*********************for CRUD oeration on HOLD*********************************************************
  // const handleChange = (e) => {
  //   setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!formData.ServiceName || !formData.CategoryID) {
  //     return Swal.fire("Error", "Please fill all required fields.", "error");
  //   }

  //   try {
  //     const { data } = await axios.post(
  //       "https://gateway.dhanushop.com/api/Service/Services",
  //       {
  //         ...formData,
  //         Action: modalType === "add" ? "insert" : "update",
  //         CreatedBy: userid,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     Swal.fire("Success", data.message || "Operation successful", "success");
  //     fetchServices();
  //     closeModal();
  //   } catch (error) {
  //     console.error("Submit error:", error);
  //     Swal.fire("Error", "Operation failed.", "error");
  //   }
  // };

  // const handleDelete = async (service) => {
  //   const result = await Swal.fire({
  //     title: `Delete "${service.ServiceName}"?`,
  //     text: "This action cannot be undone.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Yes, delete it!",
  //   });

  //   if (result.isConfirmed) {
  //     try {
  //       const { data } = await axios.post(
  //         "https://gateway.dhanushop.com/api/Service/Services",
  //         {
  //           Action: "delete",
  //           ServiceID: service.ServiceID,
  //           CategoryID: service.CategoryID,
  //           StatusChangeRemark: "Deleted",
  //           CreatedBy: userid,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       Swal.fire("Deleted!", data.message || "Service deleted.", "success");
  //       fetchServices();
  //     } catch (error) {
  //       console.error("Delete error:", error);
  //       Swal.fire("Error", "Failed to delete service.", "error");
  //     }
  //   }
  // };

  // const openModal = (type, service = null) => {
  //   if (type === "update" && service) {
  //     setFormData({
  //       Action: "update",
  //       ServiceID: service.ServiceID,
  //       CategoryID: service.CategoryID,
  //       ServiceName: service.ServiceName,
  //       StatusChangeRemark: "",
  //       CreatedBy: userid,
  //     });
  //   } else {
  //     setFormData({
  //       Action: "insert",
  //       ServiceID: "",
  //       CategoryID: "",
  //       ServiceName: "",
  //       StatusChangeRemark: "",
  //       CreatedBy: userid,
  //     });
  //   }
  //   setModalType(type);
  //   setShowModal(true);
  // };

  // const closeModal = () => {
  //   setShowModal(false);
  //   setModalType(null);
  // };
  //*********************for CRUD oeration on HOLD*********************************************************
 
 
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Services</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/admin/ServiceMaster")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            View all Categories
          </button>
          {/* <button
            onClick={() => openModal("add")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Service
          </button> */}
        </div>
      </div>

      <div className="overflow-x-auto bg-white p-4">
        <table className="w-full table-auto border-collapse border border-gray-800">
          <thead>
            <tr className="bg-gray-200 text-center border">
              <th className="border border-gray-800 p-2">S.No</th>
              <th className="border border-gray-800 p-2">Service Name</th>
              <th className="border border-gray-800 p-2">Category</th>
              {/* <th className="border p-2">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {services
  .filter((srv) => srv.ServiceID && srv.ServiceID.trim() !== "")
  .map((srv, idx) => (
    <tr key={idx} className="text-sm text-center">
      <td className="border p-2">{idx + 1}</td>
      <td className="border p-2">{srv.ServiceName}</td>
      <td className="border p-2">
        {
          categories.find((cat) => cat.CategoryID === srv.CategoryID)?.CategoryName || "-"
        }
      </td>
      {/* <td className="border p-2 space-x-2">
        <button
          onClick={() => openModal("update", srv)}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(srv)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </td> */}
    </tr>
))}

          </tbody>
        </table>
      </div>

      {/* {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "add" ? "Add Service" : "Update Service"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Service Name *</label>
                <input
                  type="text"
                  name="ServiceName"
                  value={formData.ServiceName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Category *</label>
                <select
                  name="CategoryID"
                  value={formData.CategoryID}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.CategoryID} value={cat.CategoryID}>
                      {cat.CategoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {modalType === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ServicesPage;