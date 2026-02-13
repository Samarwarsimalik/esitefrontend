// TagManager.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import Sidebar from "./sidebar/Sidebar";

const API = "http://localhost:5000/api";

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export default function TagManager() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [tags, setTags] = useState([]);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${API}/tags`, { withCredentials: true });
      setTags(res.data);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setEditingId(null);
    setMsg("");
    setOpen(false);
  };

  const loadTagForEdit = (tag) => {
    setName(tag.name);
    setSlug(tag.slug);
    setDescription(tag.description || "");
    setEditingId(tag._id);
    setMsg("");
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = { name, description };

    try {
      if (editingId) {
        await axios.put(`${API}/tags/${editingId}`, payload, {
          withCredentials: true,
        });
        setMsg("✅ Tag updated successfully");
      } else {
        await axios.post(`${API}/tags`, payload, {
          withCredentials: true,
        });
        setMsg("✅ Tag added successfully");
      }

      resetForm();
      fetchTags();
    } catch (err) {
      console.error("Failed to submit tag:", err);
      setMsg("❌ Failed to submit tag");
    }
  };

  const deleteTag = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete tag "${name}"?`))
      return;

    try {
      await axios.delete(`${API}/tags/${id}`, { withCredentials: true });
      setMsg(`✅ Deleted tag "${name}"`);
      if (editingId === id) resetForm();
      fetchTags();
    } catch (err) {
      console.error("Failed to delete tag:", err);
      setMsg("❌ Failed to delete tag");
    }
  };

  // Filter tags based on search query (case insensitive)
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
         <Sidebar />
         <div className="flex-1 p-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
  
  <h1 className="text-2xl sm:text-3xl font-bold text-center md:text-left">
    Tags
  </h1>

  <button
    onClick={() => {
      resetForm();
      setOpen(true);
    }}
    className="flex items-center justify-center gap-2 
               bg-black text-white 
               px-4 sm:px-5 py-2 
               rounded-lg 
               hover:bg-gray-800 
               transition duration-200 
               w-full md:w-auto"
  >
    <Plus size={18} />
    <span className="text-sm sm:text-base">Add Tag</span>
  </button>

</div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search by tag name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-sm mb-6 focus:outline-none focus:ring-2 focus:ring-black"
        />

        {msg && (
          <p
            className={`mb-6 text-sm font-semibold ${
              msg.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}

        <div className="border rounded-lg">
  <div className="overflow-x-auto">
    <table className="min-w-[700px] w-full text-sm bg-white">
      
      <thead className="bg-black text-white">
        <tr>
          <th className="p-3 text-left whitespace-nowrap">Name</th>
          <th className="p-3 text-left whitespace-nowrap">Slug</th>
          <th className="p-3 text-left whitespace-nowrap">Description</th>
          <th className="p-3 text-center whitespace-nowrap">Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredTags.length === 0 && (
          <tr>
            <td colSpan={4} className="text-center p-4 text-gray-500">
              No tags found.
            </td>
          </tr>
        )}

        {filteredTags.map((tag) => (
          <tr
            key={tag._id}
            className="border-t hover:bg-gray-50 transition"
          >
            <td className="p-3 font-medium whitespace-nowrap">
              {tag.name}
            </td>

            <td className="p-3 text-gray-600 whitespace-nowrap">
              {tag.slug}
            </td>

            <td className="p-3 text-gray-600 max-w-xs truncate">
              {tag.description || "-"}
            </td>

            <td className="p-3">
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => loadTagForEdit(tag)}
                  className="hover:text-black transition"
                  aria-label="Edit tag"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => deleteTag(tag._id, tag.name)}
                  className="text-red-600 hover:text-red-800 transition"
                  aria-label="Delete tag"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>

    </table>
  </div>
</div>
      </div>

      {/* Modal for Add/Edit */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-lg">
            <button
              onClick={resetForm}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Close form"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Tag" : "Add Tag"}
            </h2>

            <form onSubmit={submit} className="space-y-4">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Tag name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                className="w-full border px-3 py-2 rounded bg-gray-100"
                value={slug}
                readOnly
                placeholder="Slug (auto-generated)"
              />

              <textarea
                className="w-full border px-3 py-2 rounded"
                rows={3}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                {editingId ? "Update Tag" : "Add Tag"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full mt-2 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
