import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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

  const fetchPages = async () => {
    try {
      const res = await axios.post(
        "https://gateway.dhanushop.com/api/PageMaster/GetPages",
        { Action: "select" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPages(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch pages", error);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

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
      setForm({
        PageName: "",
        ParentPageId: "0",
        PageUrl: "",
        DisplayOrder: "",
        IconClass: "",
      });
      setEditing(false);
      fetchPages();
    } catch (error) {
      console.error("Failed to submit page", error);
    }
  };

  const handleEdit = (page) => {
    setForm(page);
    setPageId(page.PageId);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(
        "https://gateway.dhanushop.com/api/PageMaster/DeletePages",
        { PageId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPages();
    } catch (error) {
      console.error("Failed to delete page", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Page Master</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        <select
          className="border p-2 rounded w-full"
          value={form.ParentPageId}
          onChange={(e) => setForm({ ...form, ParentPageId: e.target.value })}
        >
          <option value="0">No Parent</option>
          {pages.map((p) => (
            <option key={p.PageId} value={p.PageId}>
              {p.PageName}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {editing ? "Update Page" : "Add Page"}
      </button>

      <table className="w-full mt-8 border">
        <thead>
          <tr className="bg-gray-100">
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
              <td className="p-2 border">{page.PageName}</td>
              <td className="p-2 border">{page.PageUrl}</td>
              <td className="p-2 border">{page.ParentPageId}</td>
              <td className="p-2 border">{page.DisplayOrder}</td>
              <td className="p-2 border">{page.IconClass}</td>
              <td className="p-2 border">
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
  );
}
