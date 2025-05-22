import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const token = Cookies.get("token");

export default function PageMasterManager() {
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

 const fetchPages = async () => {
  try {
    const res = await axios.post(
      "https://gateway.dhanushop.com/api/pages/list",
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
      ? "https://gateway.dhanushop.com/api/PageMaster/UpdatePages"
      : "https://gateway.dhanushop.com/api/PageMaster/InsertPages";

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
        "https://gateway.dhanushop.com/api/PageMaster/DeletePages",
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

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Page Master</h2>
        <button
          onClick={openModal}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + New Page
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full mt-4 border text-sm">
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
          <tbody>
            {pages.map((page) => (
              <tr key={page.PageId}>
                <td className="p-2 border">{page.PageId}</td>
                <td className="p-2 border">{page.PageName}</td>
                <td className="p-2 border">{page.PageUrl}</td>
                <td className="p-2 border">{page.ParentPageId}</td>
                <td className="p-2 border">{page.DisplayOrder}</td>
                <td className="p-2 border">{page.IconClass}</td>
                <td className="p-2 border whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(page)}
                    className="text-blue-600 mr-2 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(page.PageId)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
                onChange={(e) => setForm({ ...form, PageName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Page URL"
                className="border p-2 rounded w-full"
                value={form.PageUrl}
                onChange={(e) => setForm({ ...form, PageUrl: e.target.value })}
              />
              <input
                type="text"
                placeholder="Display Order"
                className="border p-2 rounded w-full"
                value={form.DisplayOrder}
                onChange={(e) => setForm({ ...form, DisplayOrder: e.target.value })}
              />
              <input
                type="text"
                placeholder="Icon Class"
                className="border p-2 rounded w-full"
                value={form.IconClass}
                onChange={(e) => setForm({ ...form, IconClass: e.target.value })}
              />
              <input
                type="text"
                placeholder="Parent Page ID"
                className="border p-2 rounded w-full"
                value={form.ParentPageId}
                onChange={(e) => setForm({ ...form, ParentPageId: e.target.value })}
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
