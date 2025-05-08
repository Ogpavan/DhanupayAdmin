import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newService, setNewService] = useState({ ServiceName: '', CategoryID: '', UserID: '' });
  const [editService, setEditService] = useState(null); // To hold service details being edited

  const token = Cookies.get('token');
  const userID = Cookies.get('UserId'); // Assume `userID` is stored in cookies

  // Fetch Services from Backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/services/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchServices();
  }, [token]);

  // Handle Add Service
  const handleAddService = async () => {
    if (!newService.ServiceName || !newService.CategoryID) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      const serviceData = { ...newService, UserID: userID };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/services/add`,
        serviceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newAddedService = response.data;
      setServices((prevServices) => [...prevServices, newAddedService]); // Append to state
      setNewService({ ServiceName: '', CategoryID: '', UserID: '' });
      setIsAddModalOpen(false);
      alert('Service added successfully!');
    } catch (err) {
      alert('Failed to add the service.');
    }
  };

  // Handle Update Service
  const handleUpdateService = async () => {
    if (!editService.ServiceName || !editService.CategoryID) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      // Include UserID from cookies
      const updatedServiceData = { ...editService, UserID: userID }; // userID retrieved from cookies

      // Send update request
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/services/update`,
        updatedServiceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state with the new data
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.ServiceID === editService.ServiceID ? { ...service, ...updatedServiceData } : service
        )
      );

      setEditService(null);
      setIsEditModalOpen(false);
      alert('Service updated successfully!');
    } catch (err) {
      alert('Failed to update the service.');
    }
  };

  // Handle Deactivate Service
  const handleDeactivateService = async (serviceID) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/services/deactivate?id=${serviceID}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local state by setting IsActive to 0
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.ServiceID === serviceID ? { ...service, IsActive: 0 } : service
        )
      );

      alert('Service deactivated successfully!');
    } catch (err) {
      alert('Failed to deactivate the service.');
    }
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewService({ ServiceName: '', CategoryID: '', UserID: '' });
  };

  const openEditModal = (service) => {
    setEditService(service);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditService(null);
  };

  // Render Component
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="flex w-full justify-between mb-4">
        <h1 className="text-2xl font-semibold">Services</h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Add Service
        </button>
      </div>

      {/* Service List */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Service ID</th>
            <th className="border border-gray-300 px-4 py-2">Category ID</th>
            <th className="border border-gray-300 px-4 py-2">Service Name</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.ServiceID} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{service.ServiceID}</td>
              <td className="border border-gray-300 px-4 py-2">{service.CategoryID}</td>
              <td className="border border-gray-300 px-4 py-2">{service.ServiceName}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="px-2 py-1 bg-blue-500 text-white rounded-md mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeactivateService(service.ServiceID)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                >
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-xl font-semibold">Add Service</h2>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Service Name</label>
              <input
                type="text"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                value={newService.ServiceName}
                onChange={(e) =>
                  setNewService({ ...newService, ServiceName: e.target.value })
                }
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Category ID</label>
              <input
                type="text"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                value={newService.CategoryID}
                onChange={(e) =>
                  setNewService({ ...newService, CategoryID: e.target.value })
                }
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeAddModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {isEditModalOpen && editService && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-xl font-semibold">Update Service</h2>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Service Name</label>
              <input
                type="text"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                value={editService.ServiceName}
                onChange={(e) =>
                  setEditService({ ...editService, ServiceName: e.target.value })
                }
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Category ID</label>
              <input
                type="text"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                value={editService.CategoryID}
                onChange={(e) =>
                  setEditService({ ...editService, CategoryID: e.target.value })
                }
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateService}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Update Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
