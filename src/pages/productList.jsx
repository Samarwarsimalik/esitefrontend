import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar/ClientSidebar";
import { Edit, Trash2, Eye } from "lucide-react"; // Icons

const API = "http://localhost:5000/api";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/products/`, { withCredentials: true });
      setProducts(res.data.products || res.data || []);
    } catch { setError("Failed to load products"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`${API}/products/${id}`, { withCredentials: true });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch { alert("Delete failed"); } 
    finally { setDeletingId(null); }
  };

  const handleEdit = (id) => navigate(`/products/edit/${id}`);
const handleView = (product) => {
  // product.slug use karke navigate karo
  navigate(`/product/${product.slug}`);
};


  const getStockInfo = (product) => {
    let qty = product.productType === "variable" && product.variations?.length
      ? product.variations.reduce((sum,v)=>sum+(v.stockQty||0),0)
      : product.stockQty || 0;
    return { qty, status: qty>0?"In Stock":"Out of Stock" };
  };

  const getPriceDisplay = (product) => {
    if(product.productType==="variable" && product.variations?.length){
      const prices = product.variations.map(v=>v.salePrice??v.price??0);
      const min = Math.min(...prices), max = Math.max(...prices);
      return min===max ? `₹${min}` : `₹${min} – ₹${max}`;
    } else return `₹${product.price??"-"}`;
  };

  const timeAgo = (dateString) => {
    const seconds=Math.floor((new Date()-new Date(dateString))/1000);
    if(seconds<60) return `${seconds} sec ago`;
    const minutes=Math.floor(seconds/60); if(minutes<60) return `${minutes} min ago`;
    const hours=Math.floor(minutes/60); if(hours<24) return `${hours} hour${hours>1?"s":""} ago`;
    const days=Math.floor(hours/24); if(days<30) return `${days} day${days>1?"s":""} ago`;
    const months=Math.floor(days/30); if(months<12) return `${months} month${months>1?"s":""} ago`;
    const years=Math.floor(months/12); return `${years} year${years>1?"s":""} ago`;
  };

  const formatDate = (dateString) => {
    const date=new Date(dateString);
    let hours=date.getHours(), ampm=hours>=12?"pm":"am";
    hours=hours%12||12;
    const minutes=String(date.getMinutes()).padStart(2,"0");
    return `${date.getFullYear()}/${String(date.getMonth()+1).padStart(2,"0")}/${String(date.getDate()).padStart(2,"0")} at ${hours}:${minutes} ${ampm}`;
  };

  const filteredProducts = products.filter(product=>{
    const textMatch=product.title.toLowerCase().includes(searchText.toLowerCase()) || product.createdBy?.name?.toLowerCase().includes(searchText.toLowerCase());
    const categoryMatch=!categoryFilter || product.category?.name===categoryFilter;
    const stock=getStockInfo(product);
    const stockMatch=!stockFilter || (stockFilter==="in" && stock.status==="In Stock") || (stockFilter==="out" && stock.status==="Out of Stock");
    return textMatch && categoryMatch && stockMatch;
  });

  const categories = [...new Set(products.map(p=>p.category?.name).filter(Boolean))];

  if(loading) return <p className="text-center py-10 text-gray-500">Loading products...</p>;
  if(error) return (
    <div className="text-center py-10">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={fetchProducts} className="px-5 py-2 bg-gray-800 text-white rounded-lg">Retry</button>
    </div>
  );

  return (
    <div className="flex mx-auto p-4 gap-6 bg-white min-h-screen">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar className="bg-black text-white p-4 rounded-xl shadow-md"/>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Products Management</h1>
          <div className="mt-4 md:mt-0 bg-black text-white px-6 py-3 rounded-xl shadow">
            <p className="text-sm opacity-90">Total Products</p>
            <p className="text-2xl font-bold">{filteredProducts.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input type="text" placeholder="Search by title or created by..." value={searchText} onChange={e=>setSearchText(e.target.value)} className="px-4 py-2 border border-black rounded-lg bg-white text-black outline-none"/>
          <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="px-4 py-2 border border-black rounded-lg bg-white text-black outline-none">
            <option value="">All Categories</option>
            {categories.map(cat=><option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={stockFilter} onChange={e=>setStockFilter(e.target.value)} className="px-4 py-2 border border-black rounded-lg bg-white text-black outline-none">
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto border border-black rounded-xl flex-1">
          <table className="w-full text-sm text-black">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-center">Price</th>
                <th className="px-4 py-3 text-center">Category</th>
                <th className="px-4 py-3 text-center">Created By</th>
                <th className="px-4 py-3 text-center">Publish Date</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length===0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">No products found</td>
                </tr>
              ) : filteredProducts.map(product=>{
                const stock=getStockInfo(product);
                return (
                  <tr key={product._id} className="border-t hover:bg-gray-100 transition">
                    <td className="px-4 py-3 font-medium">{product.title}</td>
                    <td className="px-4 py-3 text-center">{getPriceDisplay(product)}</td>
                    <td className="px-4 py-3 text-center">{product.category?.name || "-"}</td>
                    <td className="px-4 py-3 text-center">{product.createdBy?.name || "-"}</td>
                    <td className="px-4 py-3 text-center">{product.createdAt ? `${timeAgo(product.createdAt)} (${formatDate(product.createdAt)})` : "-"}</td>
                    <td className="px-4 py-3 text-center">
                      {stock.status==="In Stock" ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-black text-white">In Stock ({stock.qty})</span>
                      ) : (
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-300 text-black">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {product.active ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-black text-white">Active</span>
                      ) : (
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-300 text-black">Inactive</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2 flex justify-center items-center">
                      <button onClick={()=>handleView(product)} className="p-2 rounded bg-gray-200 hover:bg-gray-300"><Eye size={16}/></button>
                      <button onClick={()=>handleEdit(product._id)} className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white"><Edit size={16}/></button>
                      <button onClick={()=>handleDelete(product._id)} disabled={deletingId===product._id} className="p-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
