import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";

const EmployeePermission = () => {
    const [roles, setRoles] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [permissions, setPermissions] = useState({});
    const [pages, setPages] = useState([]);
    const [expanded, setExpanded] = useState({});
    const token = Cookies.get("token");
    const userId = Cookies.get("UserId");

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const res = await axios.post(
                    "https://gateway.dhanushop.com/api/pages/list",
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const rawPages = res.data || [];

                const structured = rawPages.reduce((acc, page) => {
                    const parentId = page.ParentPageId || "0";
                    if (!acc[parentId]) acc[parentId] = [];
                    acc[parentId].push(page);
                    return acc;
                }, {});

                setPages(structured);
            } catch (error) {
                console.error("Failed to fetch pages", error);
                Swal.fire("Error", "Failed to load pages", "error");
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await fetch("https://gateway.dhanushop.com/api/role/list", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({}),
                });

                const result = await response.json();
                const employeeRoles = result.filter((role) => role.UserType === "Employee");
                setRoles(employeeRoles);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchPages();
        fetchRoles();
    }, [token]);

    const fetchRolePermissions = async (roleId) => {
        console.log("Fetching permissions for role:", roleId);
        try {
            const response = await axios.post(
                "https://gateway.dhanushop.com/api/RolePermission/GetRolesPermission",
                { RoleId: roleId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const existingPermissions = response.data;
            const permissionMap = {};

            existingPermissions.forEach((perm) => {
                if (perm.pageid) {
                    permissionMap[perm.pageid] = true;
                }
            });

            console.log(permissionMap);
            console.log("Loaded permissions:", permissionMap);
            setPermissions(permissionMap);
        } catch (error) {
            console.error("Error fetching role permissions:", error);
            Swal.fire("Error", "Failed to load role permissions", "error");
        }
    };


    const handlePermissionChange = (pageId) => {
        setPermissions((prev) => ({
            ...prev,
            [pageId]: !prev[pageId],
        }));
    };

    const handleSave = async () => {
        if (!selectedRoleId) {
            Swal.fire("Warning", "Please select a role", "warning");
            return;
        }

        const selectedPageIds = Object.entries(permissions)
            .filter(([, value]) => value)
            .map(([pageId]) => pageId);

        if (selectedPageIds.length === 0) {
            Swal.fire("Warning", "Please select at least one page", "warning");
            return;
        }

        try {
            for (const pageId of selectedPageIds) {
                await axios.post(
                    "https://gateway.dhanushop.com/api/RolePermission/InsertRolePermission",
                    {
                        RoleId: selectedRoleId,
                        PageID: pageId,
                        CanView: "1",
                        CanCreate: "1",
                        CanUpdate: "1",
                        CanDelete: "1",
                        CreatedBy: userId,
                        IsActive: "1",
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            Swal.fire("Success", "Permissions successfully saved!", "success");
        } catch (error) {
            console.error("Failed to save permissions", error);
            Swal.fire("Error", "Failed to save permissions", "error");
        }
    };

    const renderPageTree = (parentId = "0", level = 0) => {
        if (!pages[parentId]) return null;

        return pages[parentId].map((page) => {
            const hasChildren = pages[page.PageId]?.length > 0;
            const isExpanded = expanded[page.PageId];

            return (
                <div key={page.PageId}>
                    <div
                        style={{ paddingLeft: `${level * 16}px` }}
                        className="flex items-center space-x-2 py-1 relative"
                    >
                        {hasChildren ? (
                            <button
                                onClick={() =>
                                    setExpanded((prev) => ({
                                        ...prev,
                                        [page.PageId]: !prev[page.PageId],
                                    }))
                                }
                                className="text-xs w-5 h-5 flex items-center justify-center text-gray-600 border rounded hover:bg-gray-100"
                                title={isExpanded ? "Collapse" : "Expand"}
                            >
                                {isExpanded ? "−" : "+"}
                            </button>
                        ) : (
                            <span className="w-5" />
                        )}

                        {page.PageUrl ? (
                            <input
                                type="checkbox"
                                checked={permissions[String(page.PageId)] || false}
                                onChange={() => handlePermissionChange(String(page.PageId))}
                            />



                        ) : (
                            <span className="w-5" />
                        )}

                        <span className={`text-gray-800 ${!page.PageUrl ? "font-semibold" : ""}`}>
                            {page.PageName}
                        </span>
                    </div>

                    {hasChildren && isExpanded && (
                        <div className="ml-2 border-l border-gray-300 pl-2">
                            {renderPageTree(page.PageId, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="px-6 pt-[2vh] h-[calc(100vh-13vh)] overflow-y-scroll hide-scrollbar">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Assign Page Access</h1>

                <div>
                    <label className="block mb-2 text-gray-700 font-medium">Select Role</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-xl max-w-sm"
                        value={selectedRoleId}
                        onChange={async (e) => {
                            const roleId = e.target.value;
                            setSelectedRoleId(roleId);
                            setPermissions({});
                            if (roleId) {
                                await fetchRolePermissions(roleId);
                            }
                        }}
                    >
                        <option value="">-- Select --</option>
                        {roles.map((role) => (
                            <option key={role.RoleID} value={role.RoleID}>
                                {role.RoleName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 text-gray-700 font-bold">All Pages</label>
                    <div className="space-y-2">{renderPageTree()}</div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                >
                    Save Permissions
                </button>
            </div>
        </div>
    );
};

export default EmployeePermission;
