import React from "react";

export default function ProductImages({ product, setProduct }) {
  return (
    <div className="md:w-1/2 flex flex-col items-center">
      {product.featuredImage ? (
        <img
          src={`http://localhost:5000${product.featuredImage}`}
          alt={product.title || "Product Image"}
          className="w-full max-w-md rounded-lg shadow-lg object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full max-w-md h-64 bg-gray-200 flex items-center justify-center rounded-lg">
          <span className="text-gray-400">No image available</span>
        </div>
      )}

      {product.images && product.images.length > 0 && (
        <div className="mt-4 flex gap-4 overflow-x-auto">
          {product.images.map((imgUrl, idx) => (
            <img
              key={idx}
              src={`http://localhost:5000${imgUrl}`}
              alt={`${product.title} image ${idx + 1}`}
              className={`w-24 h-24 rounded-md object-cover flex-shrink-0 cursor-pointer border ${
                product.featuredImage === imgUrl ? "border-blue-500" : "border-gray-300"
              } hover:border-blue-700 transition`}
              loading="lazy"
              onClick={() => setProduct((prev) => ({ ...prev, featuredImage: imgUrl }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
