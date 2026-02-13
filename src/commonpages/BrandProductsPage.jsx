import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar"; // optional, if you have a navbar

export default function BrandProductsPage() {
  const { slug } = useParams(); // e.g., "ikea"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/products/public/by-brand?brand=${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(data => {
        setProducts(data || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
          Products for "{slug}"
        </h1>

        {loading && <p className="text-center">Loading products...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500">No products found for this brand.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
              >
                {product.featuredImage ? (
                  <img
                    src={`http://localhost:5000${product.featuredImage}`}
                    alt={product.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{product.title}</h2>
                  <p className="text-gray-700 mt-1">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
