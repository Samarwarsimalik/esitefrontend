import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Plus,
  X,
  Upload,
  Edit2,
  Trash2,
  Palette,
} from "lucide-react";
import Sidebar from "./sidebar/Sidebar";

const API = "https://esitebackend.onrender.com/api";

const COLORS = [
  "#000000",
  "#374151",
  "#6b7280",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const getImageUrl = (img) =>
  img?.startsWith("http") ? img : `https://esitebackend.onrender.com${img}`;

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [parents, setParents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [filterParent, setFilterParent] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#000000",
    parent: "",
    image: null,
  });

  const imgRef = useRef(null);

  // Autocomplete dropdown state
  const [parentDropdownOpen, setParentDropdownOpen] = useState(false);
  const [parentInput, setParentInput] = useState("");

  // Ref for autocomplete container to detect outside clicks
  const parentFilterRef = useRef(null);

  useEffect(() => {
    fetchAll();
  }, []);

  // Sync input with filterParent value
  useEffect(() => {
    if (filterParent) {
      const selectedParent = parents.find((p) => p._id === filterParent);
      setParentInput(selectedParent ? selectedParent.name : "");
    } else {
      setParentInput("");
    }
  }, [filterParent, parents]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        parentFilterRef.current &&
        !parentFilterRef.current.contains(event.target)
      ) {
        setParentDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAll = async () => {
    try {
      const [catsRes, parentsRes] = await Promise.all([
        axios.get(`${API}/categories`, { withCredentials: true }),
        axios.get(`${API}/categories/parents`, { withCredentials: true }),
      ]);
      setCategories(catsRes.data);
      setParents(parentsRes.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      color: "#000000",
      parent: "",
      image: null,
    });
    setEditingId(null);
    setMsg("");
    setOpen(false);
    if (imgRef.current) imgRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    const duplicate = categories.find(
      (c) =>
        c.name.toLowerCase().trim() === form.name.toLowerCase().trim() &&
        c._id !== editingId
    );

    if (duplicate) {
      setMsg("❌ Category already exists");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("color", form.color);
    if (form.parent) fd.append("parent", form.parent);
    if (form.image) fd.append("image", form.image);

    try {
      if (editingId) {
        await axios.put(`${API}/categories/${editingId}`, fd, {
          withCredentials: true,
        });
        setMsg("✅ Category updated successfully");
      } else {
        await axios.post(`${API}/categories`, fd, {
          withCredentials: true,
        });
        setMsg("✅ Category added successfully");
      }

      fetchAll();
      setTimeout(resetForm, 800);
    } catch (err) {
      setMsg(
        "❌ " + (err.response?.data?.message || "Something went wrong")
      );
    }
  };

  const editCategory = (cat) => {
    setForm({
      name: cat.name,
      description: cat.description || "",
      color: cat.color || "#000000",
      parent: cat.parent?._id || "",
      image: null,
    });
    setEditingId(cat._id);
    setOpen(true);
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`${API}/categories/${id}`, {
        withCredentials: true,
      });
      fetchAll();
    } catch (error) {
      alert("Failed to delete category");
    }
  };

  // Filter parents for autocomplete dropdown
  const filteredParents = parents.filter((p) =>
    p.name.toLowerCase().includes(parentInput.toLowerCase())
  );

  // Filtering categories by search and parent filter
  let filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  if (filterParent) {
    filtered = filtered.filter(
      (cat) => cat.parent?._id === filterParent
    );
  }

  return (
    
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6 overflow-auto">

      {/* MAIN */}
    
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
  
  <h1 className="text-2xl sm:text-3xl font-bold">
    Categories
  </h1>

  <button
    onClick={() => setOpen(true)}
    className="flex items-center justify-center gap-2 bg-black text-white px-4 sm:px-5 py-2 rounded hover:bg-gray-800 w-full sm:w-auto"
  >
    <Plus size={18} />
    <span className="text-sm sm:text-base">Add Category</span>
  </button>

</div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by category name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-72 focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* Autocomplete Parent Category Filter */}
          <div className="relative w-72" ref={parentFilterRef}>
            <input
              type="text"
              placeholder="Filter by Parent Category"
              value={parentInput}
              onChange={(e) => {
                setParentInput(e.target.value);
                setParentDropdownOpen(true);
                setFilterParent(""); // Reset filter while typing
              }}
              onFocus={() => setParentDropdownOpen(true)}
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-black"
              autoComplete="off"
            />

            {parentInput && (
              <button
                onClick={() => {
                  setParentInput("");
                  setFilterParent("");
                  setParentDropdownOpen(false);
                }}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                title="Clear filter"
                type="button"
              >
                ×
              </button>
            )}

            {parentDropdownOpen && filteredParents.length > 0 && (
              <ul className="absolute z-50 bg-white border w-full max-h-60 overflow-auto rounded shadow-md mt-1">
                {filteredParents.map((p) => (
                  <li
                    key={p._id}
                    onClick={() => {
                      setFilterParent(p._id);
                      setParentInput(p.name);
                      setParentDropdownOpen(false);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {p.name}
                  </li>
                ))}
              </ul>
            )}

            {parentDropdownOpen && filteredParents.length === 0 && (
              <div className="absolute z-50 bg-white border w-full rounded shadow-md mt-1 px-3 py-2 text-gray-500">
                No parent categories found.
              </div>
            )}
          </div>

          {/* Clear Parent Filter Button */}
          {filterParent && (
            <button
              onClick={() => {
                setFilterParent("");
                setParentInput("");
              }}
              className="ml-2 px-3 py-1 border rounded text-sm"
              title="Clear Parent Filter"
            >
              Clear Parent Filter
            </button>
          )}
        </div>

        {/* TABLE */}
       <div className="border rounded-lg">
  <div className="overflow-x-auto">
    <table className="min-w-[900px] w-full bg-white text-sm">
      
      <thead className="bg-black text-white">
        <tr>
          <th className="p-3 text-center">Image</th>
          <th className="p-3 text-center">Name</th>
          <th className="p-3 text-center">Parent</th>
          <th className="p-3 text-center">Color</th>
          <th className="p-3 text-center">Description</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {filtered.map((cat) => (
          <tr
            key={cat._id}
            className="border-t hover:bg-gray-50 transition"
          >
            <td className="p-3 text-center">
              {cat.image ? (
                <img
                  src={getImageUrl(cat.image)}
                  className="w-10 h-10 rounded object-cover mx-auto"
                  alt={cat.name}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded mx-auto"
                  style={{ background: cat.color }}
                />
              )}
            </td>

            <td className="font-semibold text-center">
              {cat.name}
            </td>

            <td className="text-gray-600 text-center">
              {cat.parent?.name || "-"}
            </td>

            <td className="text-center">
              <div
                className="w-6 h-6 rounded border mx-auto"
                style={{ background: cat.color }}
              />
            </td>

            <td className="text-gray-600 text-center max-w-xs truncate">
              {cat.description || "-"}
            </td>

            <td className="flex gap-3 justify-center p-3">
              <button
                onClick={() => editCategory(cat)}
                className="hover:text-black"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => deleteCategory(cat._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}

        {filtered.length === 0 && (
          <tr>
            <td
              colSpan={6}
              className="text-center p-4 text-gray-500"
            >
              No categories found.
            </td>
          </tr>
        )}
      </tbody>

    </table>
  </div>
</div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[460px] rounded-xl p-6 relative shadow-lg">
            <button onClick={resetForm} className="absolute top-3 right-3" title="Close">
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Category" : "Add Category"}
            </h2>

            {msg && (
              <p
                className={`mb-3 text-sm font-semibold ${
                  msg.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {msg}
              </p>
            )}

            <form onSubmit={submit} className="space-y-4">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Category name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              {/* PARENT CATEGORY SELECT */}
              <select
                className="w-full border px-3 py-2 rounded"
                value={form.parent}
                onChange={(e) =>
                  setForm({ ...form, parent: e.target.value })
                }
              >
                <option value="">No Parent</option>
                {parents.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <textarea
                className="w-full border px-3 py-2 rounded"
                rows="3"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              {/* COLOR PICKER */}
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Palette size={16} /> Color
                </p>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        form.color === c
                          ? "border-black scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>

                <input
                  type="color"
                  value={form.color}
                  onChange={(e) =>
                    setForm({ ...form, color: e.target.value })
                  }
                />
              </div>

              {/* IMAGE UPLOAD */}
              <label className="flex items-center gap-3 border px-3 py-2 rounded cursor-pointer hover:bg-gray-50">
                <Upload size={18} />
                Upload Image
                <input
                  type="file"
                  hidden
                  ref={imgRef}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.files[0],
                    })
                  }
                />
              </label>

              <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                {editingId ? "Update Category" : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
