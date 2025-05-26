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
        const fetchRoles = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/role/list`, {
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

        fetchRoles();
    }, [token]);

    const fetchRolePermissions = async (roleId) => {
        console.log("Fetching permissions for role:", roleId);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/RolePermission/GetRolesPermission`,
                { RoleId: roleId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const pagesData = response.data || [];
            console.log("API response for permissions:", pagesData);

            setPages(pagesData);

            // Create permissions map - only track if page has access (all permissions are "1")
            const permissionMap = {};

            const processPages = (pagesList) => {
                pagesList.forEach((page) => {
                    // Only consider pages with URLs as selectable
                    if (page.to) {
                        permissionMap[page.PageId] = page.CanView === "1" &&
                            page.CanCreate === "1" &&
                            page.CanUpdate === "1" &&
                            page.CanDelete === "1";
                    }

                    // Process nested pages if they exist
                    if (page.nested && page.nested.length > 0) {
                        processPages(page.nested);
                    }
                });
            };

            processPages(pagesData);
            console.log("Processed permissions:", permissionMap);
            setPermissions(permissionMap);

        } catch (error) {
            console.error("Error fetching role permissions:", error);
            Swal.fire("Error", "Failed to load role permissions", "error");
        }
    };

    const handlePermissionChange = (pageId) => {
        if (!selectedRoleId) {
            Swal.fire("Warning", "Please select a role first", "warning");
            return;
        }

        // Update local state only
        setPermissions((prev) => ({
            ...prev,
            [pageId]: !prev[pageId]
        }));
    };

    const handleSavePermissions = async () => {
        if (!selectedRoleId) {
            Swal.fire("Warning", "Please select a role first", "warning");
            return;
        }

        // Get all pages that have URLs (selectable pages)
        const getAllSelectablePages = (pagesList) => {
            let selectablePages = [];
            pagesList.forEach((page) => {
                if (page.to) {
                    selectablePages.push(page.PageId);
                }
                if (page.nested && page.nested.length > 0) {
                    selectablePages = [...selectablePages, ...getAllSelectablePages(page.nested)];
                }
            });
            return selectablePages;
        };

        const allSelectablePages = getAllSelectablePages(pages);

        try {
            // Show loading
            Swal.fire({
                title: 'Updating Permissions...',
                text: 'Please wait while we save your changes.',
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            // Update permissions for all selectable pages
            for (const pageId of allSelectablePages) {
                const isSelected = permissions[pageId] || false;

                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/RolePermission/InsertRolePermission`,
                    {
                        RoleId: selectedRoleId,
                        PageID: pageId.toString(),
                        CanView: isSelected ? "1" : "0",
                        CanCreate: isSelected ? "1" : "0",
                        CanUpdate: isSelected ? "1" : "0",
                        CanDelete: isSelected ? "1" : "0",
                        CreatedBy: userId,
                        IsActive: "1"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            Swal.fire({
                title: "Success",
                text: "All permissions updated successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error("Failed to save permissions", error);
            Swal.fire("Error", "Failed to save permissions. Please try again.", "error");
        }
    };

    const renderPageTree = (pagesList = pages, level = 0) => {
        return pagesList.map((page) => {
            const hasChildren = page.nested && page.nested.length > 0;
            const isExpanded = expanded[page.PageId];
            const hasUrl = page.to;

            return (
                <div key={page.PageId} className="mb-1">
                    <div
                        style={{ paddingLeft: `${level * 20}px` }}
                        className="flex items-center space-x-2 py-2"
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

                        {hasUrl ? (
                            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                <input
                                    type="checkbox"
                                    checked={permissions[page.PageId] || false}
                                    onChange={() => handlePermissionChange(page.PageId)}
                                    className="w-4 h-4"
                                />
                                <span className="text-gray-800 select-none">
                                    {page.label}
                                </span>
                            </label>
                        ) : (
                            <span className="font-semibold text-blue-600 select-none">
                                {page.label}
                            </span>
                        )}
                    </div>

                    {hasChildren && isExpanded && (
                        <div className="ml-4 border-l-2 border-gray-200 pl-2">
                            {renderPageTree(page.nested, level + 1)}
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
                            setPages([]);
                            if (roleId) {
                                await fetchRolePermissions(roleId);
                            }
                        }}
                    >
                        <option value="">-- Select Role --</option>
                        {roles.map((role) => (
                            <option key={role.RoleID} value={role.RoleID}>
                                {role.RoleName}
                            </option>
                        ))}
                    </select>
                </div>

                {pages.length > 0 && (
                    <div>
                        <label className="block mb-4 text-gray-700 font-bold">
                            Available Pages
                        </label>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded">
                                <strong>Note:</strong> Select pages to grant all permissions (View, Create, Update, Delete).
                                Click "Update Permissions" button to save all changes at once.
                            </div>
                            <div className="space-y-1 max-h-96 overflow-y-auto">
                                {renderPageTree()}
                            </div>
                        </div>
                    </div>
                )}

                {selectedRoleId && pages.length > 0 && (
                    <button
                        onClick={handleSavePermissions}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                        Update Permissions
                    </button>
                )}

                {!selectedRoleId && (
                    <div className="text-center text-gray-500 py-8">
                        Please select a role to view and manage page permissions.
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeePermission;