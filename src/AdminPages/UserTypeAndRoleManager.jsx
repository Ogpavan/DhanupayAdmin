import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UserTypeAndRoleManager = () => {
  const [userTypes, setUserTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [newUserType, setNewUserType] = useState({ name: "", description: "" });
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [token, setToken] = useState("");
  const [userId,setUserid]=useState("");


  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("UserId");
    if (token && userId) {
      setToken(token);
      setUserid(userId);
       
      console.log(token)
    }
    else{
        alert("Token or Userid is missing");
    }
  }, []);

  // Fetch user types
  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await axios.post(
          "https://gateway.dhanushop.com/api/TypeMaster/list",
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
    fetchUserTypes();
  }, [token,userId]);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const endpoint = selectedUserType
          ? "https://gateway.dhanushop.com/api/role/listByUserTypeID"
          : "https://gateway.dhanushop.com/api/role/list";
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
    fetchRoles();
  }, [selectedUserType, token]);

  // Create a new User Type
  const createUserType = async () => {
    try {
      await axios.post(
        "https://gateway.dhanushop.com/api/TypeMaster/create",
        {
          userId: 2,
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
    } catch (error) {
      console.error("Error creating user type:", error);
    }
  };

  // Create a new Role
  const createRole = async () => {
    try {
      await axios.post(
        "https://gateway.dhanushop.com/api/role/create",
        {
          userId: userId,
          RoleName: newRole.name,
          RoleDescription: newRole.description,
          UserTypeID: selectedUserType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNewRole({ name: "", description: "" });
      alert("Role created successfully.");
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  return (
    <div className="p-4">
      {/* User Type Management */}
      <div className="bg-white shadow-md rounded p-4 mb-4">
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
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create User Type
        </button>
      </div>

      {/* Role Management */}
      <div className="bg-white shadow-md rounded p-4 mb-4">
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
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Create Role
        </button>
      </div>

      {/* Roles List */}
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-bold mb-4">Roles List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Role Name</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">User Type</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.RoleID}>
                <td className="border border-gray-300 p-2">{role.RoleNAme}</td>
                <td className="border border-gray-300 p-2">{role.RoleDescription}</td>
                <td className="border border-gray-300 p-2">{role.UserType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTypeAndRoleManager;
