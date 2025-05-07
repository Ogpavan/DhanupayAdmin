import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const UserTypeAndRoleManager = () => {
  const [userTypes, setUserTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [newUserType, setNewUserType] = useState({ name: "", description: "" });
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const Token = Cookies.get("token");
    const UserId = Cookies.get("UserId");

    if (Token && UserId) {
      setToken(Token);
      setUserId(UserId);
    } else {
      alert("Token or UserId is missing");
    }
  }, []);

  // Fetch User Types
  const fetchUserTypes = async () => {
    if (!token || !userId) return;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/TypeMaster/list`,
        { userId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUserTypes(response.data);
    } catch (error) {
      console.error("Error fetching user types:", error);
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, [token, userId]);

  // Fetch Roles
  const fetchRoles = async () => {
    if (!token || !userId) return;
    try {
      const endpoint = selectedUserType
        ? `${import.meta.env.VITE_BACKEND_URL}/api/role/listByUserTypeID`
        : `${import.meta.env.VITE_BACKEND_URL}/api/role/list`;
      const data = selectedUserType
        ? { userId: userId, UserTypeID: selectedUserType }
        : { userId: userId };

      const response = await axios.post(endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [selectedUserType, token, userId]);

  // Create User Type
  const createUserType = async () => {
    if (!token || !userId) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/TypeMaster/create`,
        {
          userId: userId,
          UserTypeName: newUserType.name,
          UserTypeDescription: newUserType.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNewUserType({ name: "", description: "" });
      alert("User Type created successfully.");
      fetchUserTypes(); // Reload user types
    } catch (error) {
      console.error("Error creating user type:", error);
    }
  };

  // Create Role
  const createRole = async () => {
    if (!token || !userId) return;
    try {
      const requestData = {
        userId: userId,
        RoleName: newRole.name,
        RoleDescription: newRole.description,
        UserTypeID: selectedUserType,
      };
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/role/create`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNewRole({ name: "", description: "" });
      alert("Role created successfully.");
      fetchRoles(); // Reload roles
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };
  const deleteRole = async (roleIdToDelete) => {
    if (!token || !userId) return;
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/role/delete`,
        { RoleID: roleIdToDelete, UserId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        Swal.fire("Deleted!", "Role has been deleted.", "success");
        fetchRoles(); // Reload roles after deletion
      } else {
        Swal.fire("Error", "Failed to delete the role.", "error");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      Swal.fire("Error", "An error occurred while deleting the role.", "error");
    }
  };
  
  const confirmDeleteRole = (roleIdToDelete) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this role? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRole(roleIdToDelete);
      }
    });
  };
  

  return (
    <div className=" flex  gap-4 p-4">
      {/* Roles List */}
      
      {/* Forms for User Type and Role Management */}
      <div className="space-y-4 w-1/3">
        {/* User Type Management */}
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-bold mb-4">User Type Management</h2>
          <input
            type="text"
            placeholder="User Type Name"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={newUserType.name}
            onChange={(e) => setNewUserType({ ...newUserType, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="User Type Description"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={newUserType.description}
            onChange={(e) => setNewUserType({ ...newUserType, description: e.target.value })}
          />
          <button
            onClick={createUserType}
            className="bg-blue-500 text-white w-full py-2 px-4 rounded hover:bg-blue-600"
          >
            Create User Type
          </button>
        </div>

        {/* Role Management */}
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-bold mb-4">Role Management</h2>
          <select
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
          >
            <option value="">Select User Type</option>
            {userTypes.map((type) => (
              <option key={type.UserTypeID} value={type.UserTypeID}>
                {type.UserTypeName}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Role Name"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role Description"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={newRole.description}
            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
          />
          <button
            onClick={createRole}
            className="bg-green-500 text-white py-2 w-full px-4 rounded hover:bg-green-600"
          >
            Create Role
          </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded p-4 w-full">
        <h2 className="text-xl font-bold mb-4">Roles List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Role Name</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">User Type</th>
              
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
  {roles.map((role) => (
    <tr key={role.RoleID}>
      <td className="border border-gray-300 p-2">{role.RoleName}</td>
      <td className="border border-gray-300 p-2">{role.RoleDescription}</td>
      <td className="border border-gray-300 p-2">{role.UserType}</td>
      <td className="border border-gray-300 p-2 text-center">
        <button
          onClick={() => confirmDeleteRole(role.RoleID)}
          className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

    </div>
  );
};

export default UserTypeAndRoleManager;
