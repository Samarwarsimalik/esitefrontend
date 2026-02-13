import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar/Sidebar"; // Assuming your Sidebar component path
import { X, Edit2, Trash2 } from "lucide-react";

const API = "http://localhost:5000/api";

const slugify = (text) =>
  text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

export default function TermManager() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [attribute, setAttribute] = useState("");
  const [parent, setParent] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [terms, setTerms] = useState([]);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  useEffect(() => {
    fetchAttributes();
  }, []);

  useEffect(() => {
    if (attribute) fetchTerms(attribute);
    else setTerms([]);
  }, [attribute]);

  const fetchAttributes = async () => {
    try {
      const res = await axios.get(`${API}/attributes`);
      setAttributes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTerms = async (attrId) => {
    try {
      const res = await axios.get(`${API}/terms?attributeId=${attrId}`);
      setTerms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setAttribute("");
    setParent("");
    setEditingId(null);
    setMsg("");
    setOpen(false);
  };

  const loadForEdit = (term) => {
    setName(term.name);
    setSlug(term.slug);
    setDescription(term.description || "");
    setAttribute(term.attribute?._id || "");
    setParent(term.parent?._id || "");
    setEditingId(term._id);
    setMsg("");
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!attribute) {
      setMsg("❌ Select an attribute first");
      return;
    }

    const payload = {
      name,
      description,
      attribute,
      parent: parent || null,
    };

    try {
      if (editingId) {
        await axios.put(`${API}/terms/${editingId}`, payload);
        setMsg("✅ Term updated");
      } else {
        await axios.post(`${API}/terms`, payload);
        setMsg("✅ Term added");
      }
      resetForm();
      fetchTerms(attribute);
    } catch (err) {
      console.error(err);
      setMsg("❌ Operation failed");
    }
  };

  const deleteTerm = async (id, name) => {
    if (!window.confirm(`Delete term "${name}"?`)) return;
    try {
      await axios.delete(`${API}/terms/${id}`);
      setMsg(`✅ Deleted term "${name}"`);
      if (editingId === id) resetForm();
      fetchTerms(attribute);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to delete");
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r border-gray-300">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Terms</h1>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
          >
            + Add Term
          </button>
        </div>

        {/* Message */}
        {msg && (
          <p
            className={`mb-4 text-sm font-semibold ${
              msg.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}

        {/* Modal Form */}
        {open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-xl p-6 relative shadow-lg">
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
                aria-label="Close form"
              >
                <X size={24} />
              </button>

              <h2 className="text-xl font-bold mb-6">
                {editingId ? "Edit Term" : "Add Term"}
              </h2>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-semibold">Attribute</label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    value={attribute}
                    onChange={(e) => setAttribute(e.target.value)}
                    required
                  >
                    <option value="">Select Attribute</option>
                    {attributes.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold">Term Name</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Term name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold">Slug (auto-generated)</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                    value={slug}
                    readOnly
                    placeholder="Slug (auto-generated)"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold">Parent Term (optional)</label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    value={parent}
                    onChange={(e) => setParent(e.target.value)}
                  >
                    <option value="">No Parent (Main Term)</option>
                    {terms
                      .filter((t) => t._id !== editingId) // avoid self parent
                      .map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold">Description (optional)</label>
                  <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                >
                  {editingId ? "Update Term" : "Add Term"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Terms List */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Existing Terms</h3>

          {terms.length === 0 ? (
            <p className="text-gray-600">No terms found.</p>
          ) : (
            <ul className="space-y-4">
              {terms.map((term) => (
                <li
                  key={term._id}
                  className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <strong className="text-lg">{term.name}</strong>{" "}
                    <span className="text-gray-600 text-sm">
                      (Attribute: {term.attribute.name})
                    </span>
                    <br />
                    {term.parent ? (
                      <span className="text-gray-500 text-sm">
                        Parent: {term.parent.name}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm italic">
                        No Parent
                      </span>
                    )}
                    <p className="mt-2 text-gray-700">{term.description}</p>
                  </div>

                  <div className="mt-3 md:mt-0 flex gap-3">
                    <button
                      onClick={() => loadForEdit(term)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => deleteTerm(term._id, term.name)}
                      className="text-red-600 hover:text-red-900 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
