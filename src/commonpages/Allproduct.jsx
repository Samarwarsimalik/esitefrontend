import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

/* ================= API BASE ================= */
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://esitebackend.onrender.com";

/* ===== PRICE HELPER ===== */
const getProductPrice = (product) => {
  if (!product) return 0;

  if (product.productType === "variable" && product.variations?.length) {
    const prices = product.variations.map((v) =>
      v.salePrice > 0 ? v.salePrice : v.price
    );
    return Math.min(...prices);
  }

  return product.salePrice > 0 ? product.salePrice : product.price;
};

export default function Products() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchQuery =
    new URLSearchParams(location.search).get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/public`);
        const data = await res.json();

        const list = Array.isArray(data) ? data : data.products || [];

        setProducts(list);

        if (list.length > 0) {
          const prices = list.map(getProductPrice);
          const max = Math.max(...prices);
          setMaxPrice(max);
          setPriceRange([0, max]);
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= FILTER DATA ================= */

  const categories = useMemo(
    () =>
      [...new Set(products.map((p) => p.category?.name).filter(Boolean))],
    [products]
  );

  const brands = useMemo(
    () =>
      [...new Set(products.map((p) => p.brand?.name).filter(Boolean))],
    [products]
  );

  /* ================= FILTER LOGIC ================= */

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const price = getProductPrice(p);

      return (
        (!selectedCategories.length ||
          selectedCategories.includes(p.category?.name)) &&
        (!selectedBrands.length ||
          selectedBrands.includes(p.brand?.name)) &&
        price >= priceRange[0] &&
        price <= priceRange[1] &&
        (!searchQuery ||
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [
    products,
    selectedCategories,
    selectedBrands,
    priceRange,
    searchQuery,
  ]);

  const toggle = (value, state, setState) => {
    setState(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value]
    );
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Shop Products
          </h1>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden border px-4 py-2 rounded-xl text-sm"
          >
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ================= SIDEBAR ================= */}
          <aside
            className={`
              ${showFilters ? "block" : "hidden"}
              lg:block
              border rounded-2xl p-6 space-y-8 h-fit bg-white
            `}
          >
            {/* CATEGORY */}
            <div>
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-2 max-h-40 overflow-auto">
                {categories.map((c) => (
                  <label key={c} className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c)}
                      onChange={() =>
                        toggle(c, selectedCategories, setSelectedCategories)
                      }
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* BRAND */}
            <div>
              <h3 className="font-semibold mb-3">Brand</h3>
              <div className="space-y-2 max-h-40 overflow-auto">
                {brands.map((b) => (
                  <label key={b} className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() =>
                        toggle(b, selectedBrands, setSelectedBrands)
                      }
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>

            {/* PRICE */}
            {maxPrice > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Price</h3>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([0, Number(e.target.value)])
                  }
                  className="w-full accent-black"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹0</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedBrands([]);
                setPriceRange([0, maxPrice]);
              }}
              className="w-full border rounded-xl py-2 text-sm hover:bg-gray-100"
            >
              Reset Filters
            </button>
          </aside>

          {/* ================= PRODUCTS ================= */}
          <div className="lg:col-span-3">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filteredProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/product/${p.slug}`)}
                    className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer bg-white"
                  >
                    <img
                      src={
                        p.featuredImage
                          ? `${API_BASE}${p.featuredImage}`
                          : "https://via.placeholder.com/400x300"
                      }
                      alt={p.title}
                      className="h-48 sm:h-56 w-full object-cover"
                    />

                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-2">
                        {p.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {p.brand?.name}
                      </p>

                      <p className="text-lg font-bold mt-1">
                        ₹{getProductPrice(p)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}