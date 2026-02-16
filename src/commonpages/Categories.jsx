import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const API = "https://esitebackend.onrender.com/api";
const BASE_URL = "https://esitebackend.onrender.com";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API}/categories`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-gray-900">
          Categories
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">
            Loading categories...
          </p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No categories available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="relative cursor-pointer overflow-hidden rounded-3xl shadow-lg group hover:shadow-2xl transition-shadow duration-300"
              >
                {cat.image ? (
                  <img
                    src={`${BASE_URL}${cat.image}`}
                    alt={cat.name}
                    className="h-52 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-52 w-full bg-gray-200 flex items-center justify-center text-gray-400 font-semibold text-lg">
                    No Image
                  </div>
                )}

                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-center">
                  <h3 className="text-white text-lg sm:text-xl font-semibold capitalize">
                    {cat.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}