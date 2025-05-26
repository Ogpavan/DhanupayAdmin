import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";


export default function PageMasterManager() {
  const token = Cookies.get("token");
  const [pages, setPages] = useState([]);
  const [form, setForm] = useState({
    PageName: "",
    ParentPageId: "0",
    PageUrl: "",
    DisplayOrder: "",
    IconClass: "",
  });
  const [editing, setEditing] = useState(false);
  const [pageId, setPageId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");




 
  const fetchPages = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pages/list`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPages(res.data || []);
    } catch (error) {
      console.error("Failed to fetch pages", error);
      Swal.fire("Error", "Failed to load pages", "error");
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const resetForm = () => {
    setForm({
      PageName: "",
      ParentPageId: "0",
      PageUrl: "",
      DisplayOrder: "",
      IconClass: "",
    });
    setPageId(null);
    setEditing(false);
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const url = editing
      ? `${import.meta.env.VITE_BACKEND_URL}/api/PageMaster/UpdatePages`
      : `${import.meta.env.VITE_BACKEND_URL}/api/PageMaster/InsertPages`;

    const payload = { ...form };
    if (editing) payload.PageId = pageId;

    try {
      await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: "success",
        title: editing ? "Page Updated" : "Page Added",
        showConfirmButton: false,
        timer: 1500,
      });

      fetchPages();
      closeModal();
    } catch (error) {
      console.error("Failed to submit page", error);
      Swal.fire("Error", "Failed to submit page", "error");
    }
  };

  const handleEdit = (page) => {
    setForm(page);
    setPageId(page.PageId);
    setEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this page?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/PageMaster/DeletePages`,
          { PageId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "success",
          title: "Page Deleted",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchPages();
      } catch (error) {
        console.error("Failed to delete page", error);
        Swal.fire("Error", "Failed to delete page", "error");
      }
    }
  };

  const renderPageRows = () => {
  const normalizedSearch = searchTerm.toLowerCase();

  // Group pages
  const parents = pages.filter((p) => p.ParentPageId === "0");
  const children = pages.filter((p) => p.ParentPageId !== "0");

  return parents
    .filter((parent) => {
      const matchesParent = Object.values(parent).some((val) =>
        val?.toString().toLowerCase().includes(normalizedSearch)
      );

      const hasMatchingChild = children.some(
        (child) =>
          child.ParentPageId === parent.PageId &&
          Object.values(child).some((val) =>
            val?.toString().toLowerCase().includes(normalizedSearch)
          )
      );

      return matchesParent || hasMatchingChild;
    })
    .map((parent) => (
      <React.Fragment key={parent.PageId}>
        <tr className="bg-gray-100">
          <td className="p-2 border font-bold">{parent.PageId}</td>
          <td className="p-2 border font-bold">{parent.PageName}</td>
          <td className="p-2 border">{parent.PageUrl}</td>
          <td className="p-2 border">{parent.ParentPageId}</td>
          <td className="p-2 border">{parent.DisplayOrder}</td>
          <td className="p-2 border">{parent.IconClass}</td>
          <td className="p-2 border whitespace-nowrap">
            <button onClick={() => handleEdit(parent)} className="text-blue-600 mr-2 hover:underline">Edit</button>
            <button onClick={() => handleDelete(parent.PageId)} className="text-red-600 hover:underline">Delete</button>
          </td>
        </tr>

        {children
          .filter(
            (child) =>
              child.ParentPageId === parent.PageId &&
              Object.values(child).some((val) =>
                val?.toString().toLowerCase().includes(normalizedSearch)
              )
          )
          .map((child) => (
            <tr key={child.PageId}>
              <td className="p-2 border">{child.PageId}</td>
              <td className="p-2 border pl-6 text-sm">↳ {child.PageName}</td>
              <td className="p-2 border">{child.PageUrl}</td>
              <td className="p-2 border">{child.ParentPageId}</td>
              <td className="p-2 border">{child.DisplayOrder}</td>
              <td className="p-2 border">{child.IconClass}</td>
              <td className="p-2 border whitespace-nowrap">
                <button onClick={() => handleEdit(child)} className="text-blue-600 mr-2 hover:underline">Edit</button>
                <button onClick={() => handleDelete(child.PageId)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
      </React.Fragment>
    ));
};


  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Page Master</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search pages..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={openModal}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + New Page
          </button>
        </div>
      </div>

      <div className="overflow-auto h-[70vh]">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Page ID</th>
              <th className="p-2 border">Page Name</th>
              <th className="p-2 border">URL</th>
              <th className="p-2 border">Parent ID</th>
              <th className="p-2 border">Order</th>
              <th className="p-2 border">Icon</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>{renderPageRows()}</tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <h3 className="text-lg font-bold mb-4">
              {editing ? "Edit Page" : "Add New Page"}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Page Name"
                className="border p-2 rounded w-full"
                value={form.PageName}
                onChange={(e) =>
                  setForm({ ...form, PageName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Page URL"
                className="border p-2 rounded w-full"
                value={form.PageUrl}
                onChange={(e) =>
                  setForm({ ...form, PageUrl: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Display Order"
                className="border p-2 rounded w-full"
                value={form.DisplayOrder}
                onChange={(e) =>
                  setForm({ ...form, DisplayOrder: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Icon Class"
                className="border p-2 rounded w-full"
                value={form.IconClass}
                onChange={(e) =>
                  setForm({ ...form, IconClass: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Parent Page ID"
                className="border p-2 rounded w-full"
                value={form.ParentPageId}
                onChange={(e) =>
                  setForm({ ...form, ParentPageId: e.target.value })
                }
              />
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {editing ? "Update Page" : "Add Page"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
