import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const API = "https://esitebackend.onrender.com/api";
const BASE_URL = "https://esitebackend.onrender.com";

const getProductPrice = (product) => {
  if (product.productType === "variable" && product.variations?.length) {
    const prices = product.variations.map((v) =>
      v.salePrice > 0 ? v.salePrice : v.price
    );
    return Math.min(...prices);
  }
  return product.salePrice > 0 ? product.salePrice : product.price;
};

export default function ProductSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/products/public`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const isVariable = product.productType === "variable";

    if (isVariable) {
      alert("Please select this product from detail page");
      navigate(`/product/${product.slug}`);
      return;
    }

    if (product.stockQty <= 0) {
      alert("Out of stock");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex(
      (item) => item.productId === product._id
    );

    if (existingIndex > -1) {
      if (cart[existingIndex].quantity < product.stockQty) {
        cart[existingIndex].quantity += 1;
      } else {
        alert("No more stock available");
        return;
      }
    } else {
      cart.push({
        productId: product._id,
        title: product.title,
        quantity: 1,
        stockQty: product.stockQty,
        price: product.salePrice || product.price,
        featuredImage: product.featuredImage,
        sku: product.sku || "",
        brand: product.brand || null,
        category: product.category || null,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  const settings = {
    dots: false,
    infinite: products.length > 5,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 py-10">
        Loading products...
      </p>
    );
  }

  if (!products.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No products available.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        Featured Products
      </h2>

      <Slider {...settings}>
        {products.map((p) => (
          <div key={p._id} className="p-2">
            <div
              onClick={() => navigate(`/product/${p.slug}`)}
              className="border rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer bg-white"
            >
              <img
                src={
                  p.featuredImage
                    ? `${BASE_URL}${p.featuredImage}`
                    : "/placeholder.png"
                }
                alt={p.title}
                className="h-48 sm:h-56 w-full object-cover"
              />

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold line-clamp-2 mb-1">
                  {p.title}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  {p.brand?.name}
                </p>

                <p className="text-lg font-bold mb-4">
                  ₹{getProductPrice(p)}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(p);
                  }}
                  disabled={p.stockQty <= 0}
                  className="mt-auto bg-black text-white py-2 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {p.stockQty <= 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}