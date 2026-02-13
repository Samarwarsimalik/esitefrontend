import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X, Plus, Upload, Palette, Edit2, Trash2 } from "lucide-react";
import Sidebar from "./sidebar/Sidebar";

const API = "http://localhost:5000/api";

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

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export default function BrandManager() {
  const [brands, setBrands] = useState([]);
  const [parents, setParents] = useState([]);

  const [search, setSearch] = useState("");
  const [filterParent, setFilterParent] = useState("");

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    color: "#000000",
    description: "",
    parent: "", // store parent _id here
    image: null,
  });

  const [msg, setMsg] = useState("");
  const imgRef = useRef(null);

  // --- Autocomplete state ---
  const [parentInput, setParentInput] = useState("");
  const [filteredParents, setFilteredParents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    setForm((f) => ({ ...f, slug: slugify(f.name) }));
  }, [form.name]);

  useEffect(() => {
    fetchParents();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (parentInput.trim() === "") {
      setFilteredParents(parents);
    } else {
      setFilteredParents(
        parents.filter((p) =>
          p.name.toLowerCase().includes(parentInput.toLowerCase())
        )
      );
    }
  }, [parentInput, parents]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchParents = async () => {
    try {
      const res = await axios.get(`${API}/brands/parents`, {
        withCredentials: true,
      });
      setParents(res.data);
      setFilteredParents(res.data);
    } catch (err) {
      console.error("Failed to fetch parent brands", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${API}/brands`, {
        withCredentials: true,
      });
      setBrands(res.data);
    } catch (err) {
      console.error("Failed to fetch brands", err);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      color: "#000000",
      description: "",
      parent: "",
      image: null,
    });
    setEditingId(null);
    setMsg("");
    setParentInput("");
    setDropdownOpen(false);
    setHighlightedIndex(-1);
    if (imgRef.current) imgRef.current.value = "";
  };

  const openAddForm = () => {
    resetForm();
    setOpen(true);
  };

  const loadBrandForEdit = (brand) => {
    setForm({
      name: brand.name,
      slug: brand.slug,
      color: brand.color || "#000000",
      description: brand.description || "",
      parent: brand.parent?._id || "",
      image: null,
    });
    setEditingId(brand._id);
    setMsg("");
    setOpen(true);

    setParentInput(brand.parent?.name || "");
    setDropdownOpen(false);
    setHighlightedIndex(-1);
    if (imgRef.current) imgRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    const duplicate = brands.find(
      (b) =>
        b.name.toLowerCase().trim() === form.name.toLowerCase().trim() &&
        b._id !== editingId
    );
    if (duplicate) {
      setMsg("❌ Brand with this name already exists");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("color", form.color);
    fd.append("description", form.description);
    if (form.parent) fd.append("parent", form.parent);
    if (form.image) fd.append("image", form.image);

    try {
      if (editingId) {
        await axios.put(`${API}/brands/${editingId}`, fd, {
          withCredentials: true,
        });
        setMsg("✅ Brand updated successfully");
      } else {
        await axios.post(`${API}/brands`, fd, {
          withCredentials: true,
        });
        setMsg("✅ Brand added successfully");
      }
      fetchBrands();
      fetchParents();
      setTimeout(() => {
        resetForm();
        setOpen(false);
      }, 1000);
    } catch (err) {
      setMsg(
        "❌ " + (err.response?.data?.message || "Something went wrong")
      );
    }
  };

  const deleteBrand = async (id, name) => {
    if (!window.confirm(`Delete brand "${name}"?`)) return;

    try {
      await axios.delete(`${API}/brands/${id}`, {
        withCredentials: true,
      });
      setMsg(`✅ Brand "${name}" deleted`);
      if (editingId === id) resetForm();
      fetchBrands();
      fetchParents();
    } catch (err) {
      setMsg("❌ Failed to delete brand");
    }
  };

  // Filtering brands by search and parent filter
  let filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filterParent) {
    filtered = filtered.filter((b) => b.parent?._id === filterParent);
  }

  const getImageUrl = (img) =>
    img?.startsWith("http") ? img : `http://localhost:5000${img}`;

  // Handle selecting an item from autocomplete
  const handleSelectParent = (parent) => {
    setForm((f) => ({ ...f, parent: parent._id }));
    setParentInput(parent.name);
    setDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  // Keyboard navigation handlers for autocomplete
  const handleKeyDown = (e) => {
    if (!dropdownOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredParents.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredParents.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredParents.length) {
        handleSelectParent(filteredParents[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 p-6 overflow-auto">
       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
  
  <h1 className="text-2xl sm:text-3xl font-bold text-center md:text-left">
    Brands
  </h1>

  <button
    onClick={openAddForm}
    className="flex items-center justify-center gap-2 
               bg-black text-white 
               px-4 sm:px-5 py-2 
               rounded-lg 
               hover:bg-gray-800 
               transition duration-200 
               w-full md:w-auto"
  >
    <Plus size={18} />
    <span className="text-sm sm:text-base">Add Brand</span>
  </button>

</div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Search by brand name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-72 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <select
            className="border px-3 py-2 rounded"
            value={filterParent}
            onChange={(e) => setFilterParent(e.target.value)}
          >
            <option value="">Filter by Parent Brand</option>
            {parents.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* BRAND TABLE */}
      <div className="border rounded-lg">
  <div className="overflow-x-auto">
    <table className="min-w-[900px] w-full bg-white text-sm">
      
      <thead className="bg-black text-white">
        <tr>
          <th className="p-3 text-center whitespace-nowrap">Image</th>
          <th className="p-3 text-center whitespace-nowrap">Name</th>
          <th className="p-3 text-center whitespace-nowrap">Parent</th>
          <th className="p-3 text-center whitespace-nowrap">Color</th>
          <th className="p-3 text-center whitespace-nowrap">Description</th>
          <th className="p-3 text-center whitespace-nowrap">Actions</th>
        </tr>
      </thead>

      <tbody>
        {filtered.map((brand) => (
          <tr
            key={brand._id}
            className="border-t hover:bg-gray-50 transition"
          >
            <td className="p-3 text-center">
              {brand.image ? (
                <img
                  src={getImageUrl(brand.image)}
                  alt={brand.name}
                  className="w-12 h-12 object-contain mx-auto rounded"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded mx-auto"
                  style={{ backgroundColor: brand.color }}
                />
              )}
            </td>

            <td className="p-3 font-semibold text-center whitespace-nowrap">
              {brand.name}
            </td>

            <td className="p-3 text-gray-600 text-center whitespace-nowrap">
              {brand.parent?.name || "-"}
            </td>

            <td className="p-3 text-center">
              <div
                className="w-6 h-6 rounded border mx-auto"
                style={{ backgroundColor: brand.color }}
              />
            </td>

            <td className="p-3 text-gray-600 text-center max-w-xs truncate">
              {brand.description || "-"}
            </td>

            <td className="p-3">
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => loadBrandForEdit(brand)}
                  className="hover:text-black transition"
                  title="Edit Brand"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => deleteBrand(brand._id, brand.name)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete Brand"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}

        {filtered.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center p-4 text-gray-500">
              No brands found.
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
          <div
            className="bg-white w-[460px] rounded-xl p-6 relative shadow-lg"
            ref={autocompleteRef}
          >
            <button
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Brand" : "Add Brand"}
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

            <form onSubmit={submit} className="space-y-4" autoComplete="off">
              {/* Name */}
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Brand name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              {/* Slug */}
              <input
                className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                value={slugify(form.name)}
                readOnly
                placeholder="Slug (auto-generated)"
              />

              {/* Autocomplete Parent */}
              <div className="relative">
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Parent Brand (optional)"
                  value={parentInput}
                  onChange={(e) => {
                    setParentInput(e.target.value);
                    setDropdownOpen(true);
                    setForm((f) => ({ ...f, parent: "" })); // reset selected parent ID
                    setHighlightedIndex(-1);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                  aria-autocomplete="list"
                  aria-controls="parent-listbox"
                  aria-expanded={dropdownOpen}
                  role="combobox"
                />

                {dropdownOpen && (
                  <ul
                    id="parent-listbox"
                    role="listbox"
                    className="absolute z-10 max-h-48 w-full overflow-auto rounded border bg-white shadow-lg"
                  >
                    {filteredParents.length === 0 && (
                      <li
                        className="p-2 text-gray-500"
                        role="option"
                        aria-disabled="true"
                      >
                        No matching brands
                      </li>
                    )}
                    {filteredParents.map((p, i) => (
                      <li
                        key={p._id}
                        role="option"
                        aria-selected={highlightedIndex === i}
                        className={`cursor-pointer px-3 py-2 ${
                          highlightedIndex === i ? "bg-gray-200" : ""
                        }`}
                        onMouseDown={() => handleSelectParent(p)} // use onMouseDown to prevent losing focus before click
                        onMouseEnter={() => setHighlightedIndex(i)}
                      >
                        {p.name}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Clear button */}
                {form.parent && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, parent: "" }));
                      setParentInput("");
                      setDropdownOpen(false);
                      setHighlightedIndex(-1);
                    }}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    title="Clear parent"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Description */}
              <textarea
                className="w-full border px-3 py-2 rounded resize-none"
                rows="3"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              {/* COLOR PICKER TEMPLATE */}
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Palette size={16} /> Brand Color
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
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) =>
                    setForm({ ...form, color: e.target.value })
                  }
                  className="w-20 h-10 cursor-pointer border rounded"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <label className="flex items-center gap-3 border px-3 py-2 rounded cursor-pointer hover:bg-gray-50">
                <Upload size={18} />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
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
                {editingId ? "Update Brand" : "Add Brand"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
