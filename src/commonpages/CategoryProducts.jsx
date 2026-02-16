import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const API = "https://esitebackend.onrender.com/api";
const BASE_URL = "https://esitebackend.onrender.com";

/* ===== PRICE HELPER ===== */
const getProductPrice = (product) => {
  if (product.productType === "variable" && product.variations?.length) {
    const prices = product.variations.map((v) =>
      v.salePrice > 0 ? v.salePrice : v.price
    );
    return Math.min(...prices);
  }
  return product.salePrice > 0 ? product.salePrice : product.price;
};

export default function CategoryProducts() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${API}/products/public?category=${slug}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 capitalize">
          {slug}
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">
            No products found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p.slug}`)}
                className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg cursor-pointer transition-transform duration-200 hover:scale-105"
              >
                {p.featuredImage ? (
                  <img
                    src={`${BASE_URL}${p.featuredImage}`}
                    alt={p.title}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="h-56 w-full bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {p.brand?.name}
                  </p>
                  <p className="text-lg font-bold">
                    ₹{getProductPrice(p)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}