import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./sidebar/Sidebar";
import {
  Edit2 as EditIcon,
  Trash2 as DeleteIcon,
  Plus as AddIcon,
  X as CloseIcon,
  Search as SearchIcon,
} from "lucide-react";

const API = "https://esitebackend.onrender.com/api";

/* ---------- SLUGIFY ---------- */
const slugify = (text = "") =>
  text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

export default function AttributeTermManager() {
  /* ================= ATTRIBUTE ================= */
  const [attrName, setAttrName] = useState("");
  const [attrSlug, setAttrSlug] = useState("");
  const [attrDescription, setAttrDescription] = useState("");
  const [attrEditingId, setAttrEditingId] = useState(null);
  const [attrFormOpen, setAttrFormOpen] = useState(false);

  /* ================= TERM ================= */
  const [termName, setTermName] = useState("");
  const [termSlug, setTermSlug] = useState("");
  const [termDescription, setTermDescription] = useState("");
  const [termEditingId, setTermEditingId] = useState(null);
  const [termParentAttrId, setTermParentAttrId] = useState(null);
  const [termFormOpen, setTermFormOpen] = useState(false);

  /* ================= DATA ================= */
  const [attributes, setAttributes] = useState([]);
  const [termsByAttribute, setTermsByAttribute] = useState({});
  const [search, setSearch] = useState("");

  /* ================= SLUG ================= */
  useEffect(() => setAttrSlug(slugify(attrName)), [attrName]);
  useEffect(() => setTermSlug(slugify(termName)), [termName]);

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    const res = await axios.get(`${API}/attributes`);
    setAttributes(res.data);
    res.data.forEach((a) => fetchTerms(a._id));
  };

  const fetchTerms = async (attributeId) => {
    const res = await axios.get(`${API}/terms?attributeId=${attributeId}`);
    setTermsByAttribute((p) => ({ ...p, [attributeId]: res.data }));
  };

  /* ================= ATTRIBUTE ACTIONS ================= */
  const submitAttribute = async (e) => {
    e.preventDefault();

    const payload = {
      name: attrName,
      slug: attrSlug,
      description: attrDescription,
    };

    attrEditingId
      ? await axios.put(`${API}/attributes/${attrEditingId}`, payload)
      : await axios.post(`${API}/attributes`, payload);

    closeAttrModal();
    fetchAttributes();
  };

  const deleteAttribute = async (id) => {
    if (!window.confirm("Delete attribute and its terms?")) return;
    await axios.delete(`${API}/attributes/${id}`);
    fetchAttributes();
  };

  /* ================= TERM ACTIONS ================= */
  const openTermModal = (attrId, term = null) => {
    setTermParentAttrId(attrId);

    if (term) {
      setTermEditingId(term._id);
      setTermName(term.name);
      setTermDescription(term.description || "");
    } else {
      setTermEditingId(null);
      setTermName("");
      setTermDescription("");
    }

    setTermFormOpen(true);
  };

  const submitTerm = async (e) => {
    e.preventDefault();

    const payload = {
      name: termName,
      slug: termSlug,
      description: termDescription,
      attribute: termParentAttrId,
    };

    termEditingId
      ? await axios.put(`${API}/terms/${termEditingId}`, payload)
      : await axios.post(`${API}/terms`, payload);

    closeTermModal();
    fetchTerms(termParentAttrId);
  };

  const deleteTerm = async () => {
    if (!window.confirm("Delete term?")) return;
    await axios.delete(`${API}/terms/${termEditingId}`);
    closeTermModal();
    fetchTerms(termParentAttrId);
  };

  /* ================= MODAL CLOSE ================= */
  const closeAttrModal = () => {
    setAttrFormOpen(false);
    setAttrEditingId(null);
    setAttrName("");
    setAttrDescription("");
  };

  const closeTermModal = () => {
    setTermFormOpen(false);
    setTermEditingId(null);
    setTermName("");
    setTermDescription("");
  };

  /* ================= FILTER ================= */
  const filteredAttributes = attributes.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div className="flex flexy min-h-screen bg-gray-50 text-black">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* HEADER */}
       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
  
  <h1 className="text-xl sm:text-2xl font-bold text-center md:text-left">
    Attributes
  </h1>

  <button
    onClick={() => setAttrFormOpen(true)}
    className="flex items-center justify-center gap-2
               bg-black text-white
               px-4 py-2
               rounded-lg
               hover:bg-gray-800
               transition duration-200
               w-full md:w-auto"
  >
    <AddIcon size={16} />
    <span className="text-sm sm:text-base">Add Attribute</span>
  </button>

</div>

       {/* SEARCH */}
<div className="mb-4 w-full md:w-80">
  <div className="flex items-center gap-2 
                  border border-black 
                  rounded-lg 
                  px-3 py-2 
                  bg-white
                  focus-within:ring-2 focus-within:ring-black
                  transition">

    <SearchIcon size={16} className="text-gray-600" />

    <input
      className="outline-none w-full text-sm"
      placeholder="Search attribute..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
</div>

        {/* TABLE */}
        <div className="border border-black rounded-lg">
  <div className="overflow-x-auto">
    <table className="min-w-[700px] w-full bg-white text-sm">
      
      <thead className="border-b border-black bg-black text-white">
        <tr>
          <th className="p-3 text-left whitespace-nowrap">Attribute</th>
          <th className="p-3 text-left whitespace-nowrap">Terms</th>
          <th className="p-3 text-left whitespace-nowrap">Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredAttributes.map((attr) => (
          <tr key={attr._id} className="border-b border-black">

            {/* Attribute */}
            <td className="p-3 align-top">
              <div className="font-medium whitespace-nowrap">
                {attr.name}
              </div>
              <div className="text-sm text-gray-600 max-w-xs truncate">
                {attr.description}
              </div>
            </td>

            {/* Terms */}
            <td className="p-3 align-top">
              <div className="flex flex-wrap gap-2">
                {termsByAttribute[attr._id]?.map((t) => (
                  <span
                    key={t._id}
                    onClick={() => openTermModal(attr._id, t)}
                    className="border border-black px-2 py-1 text-xs sm:text-sm 
                               cursor-pointer whitespace-nowrap
                               hover:bg-black hover:text-white transition"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </td>

            {/* Actions */}
            <td className="p-3 align-top">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setAttrEditingId(attr._id);
                    setAttrName(attr.name);
                    setAttrDescription(attr.description || "");
                    setAttrFormOpen(true);
                  }}
                  className="p-2 border border-black 
                             hover:bg-black hover:text-white transition"
                >
                  <EditIcon size={16} />
                </button>

                <button
                  onClick={() => deleteAttribute(attr._id)}
                  className="p-2 border border-black 
                             hover:bg-black hover:text-white transition"
                >
                  <DeleteIcon size={16} />
                </button>

                <button
                  onClick={() => openTermModal(attr._id)}
                  className="p-2 border border-black 
                             hover:bg-black hover:text-white transition"
                >
                  <AddIcon size={16} />
                </button>
              </div>
            </td>

          </tr>
        ))}
      </tbody>

    </table>
  </div>
</div>

        {/* ATTRIBUTE MODAL */}
        {attrFormOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <form
              onSubmit={submitAttribute}
              className="relative bg-white border border-black p-6 w-[400px] space-y-3"
            >
              <button
                type="button"
                onClick={closeAttrModal}
                className="absolute top-3 right-3"
              >
                <CloseIcon size={18} />
              </button>

              <h2 className="font-bold text-lg">
                {attrEditingId ? "Edit Attribute" : "Add Attribute"}
              </h2>

              <input
                className="w-full border border-black px-3 py-2"
                placeholder="Name"
                value={attrName}
                onChange={(e) => setAttrName(e.target.value)}
              />

              <input
                className="w-full border border-black px-3 py-2 bg-gray-100"
                value={attrSlug}
                readOnly
              />

              <textarea
                className="w-full border border-black px-3 py-2"
                placeholder="Description"
                value={attrDescription}
                onChange={(e) => setAttrDescription(e.target.value)}
              />

              <button className="w-full border border-black py-2 hover:bg-black hover:text-white">
                Save
              </button>
            </form>
          </div>
        )}

        {/* TERM MODAL */}
        {termFormOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <form
              onSubmit={submitTerm}
              className="relative bg-white border border-black p-6 w-[400px] space-y-3"
            >
              <button
                type="button"
                onClick={closeTermModal}
                className="absolute top-3 right-3"
              >
                <CloseIcon size={18} />
              </button>

              <h2 className="font-bold text-lg">
                {termEditingId ? "Edit Term" : "Add Term"}
              </h2>

              <input
                className="w-full border border-black px-3 py-2"
                placeholder="Name"
                value={termName}
                onChange={(e) => setTermName(e.target.value)}
              />

              <input
                className="w-full border border-black px-3 py-2 bg-gray-100"
                value={termSlug}
                readOnly
              />

              <textarea
                className="w-full border border-black px-3 py-2"
                placeholder="Description"
                value={termDescription}
                onChange={(e) => setTermDescription(e.target.value)}
              />

              <div className="flex justify-between">
                {termEditingId && (
                  <button
                    type="button"
                    onClick={deleteTerm}
                    className="border border-black px-4 py-2 hover:bg-black hover:text-white"
                  >
                    Delete
                  </button>
                )}

                <button className="border border-black px-4 py-2 hover:bg-black hover:text-white">
                  {termEditingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
