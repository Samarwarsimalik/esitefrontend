import React from "react";
import { useNavigate } from "react-router-dom";

export default function AddToCartButtons({ product, selectedVariation }) {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const itemToAdd =
      product.productType === "variable"
        ? selectedVariation
          ? {
              ...selectedVariation,
              title: product.title,
              featuredImage: product.featuredImage,
              _id: selectedVariation._id,
            }
          : null
        : product;

    if (!itemToAdd) {
      alert("Please select all product options");
      return;
    }

    if (itemToAdd.stockQty <= 0) {
      alert("Product is out of stock");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex((item) => item._id === itemToAdd._id);

    if (existingIndex !== -1) {
      if (cart[existingIndex].quantity + 1 > itemToAdd.stockQty) {
        alert("Cannot add more than available stock");
        return;
      }
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...itemToAdd, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.title} added to cart`);
    navigate("/cart");
  };

  const handleBuyNow = () => {
    const itemToBuy =
      product.productType === "variable"
        ? selectedVariation
          ? {
              ...selectedVariation,
              title: product.title,
              featuredImage: product.featuredImage,
              _id: selectedVariation._id,
            }
          : null
        : product;

    if (!itemToBuy) {
      alert("Please select all product options");
      return;
    }

    if (itemToBuy.stockQty <= 0) {
      alert("Product is out of stock");
      return;
    }

    alert(`Proceed to buy ${product.title}`);
    navigate("/checkout");
  };

  const disabled =
    !(selectedVariation || product.productType === "simple") || (selectedVariation?.stockQty ?? product.stockQty) <= 0;

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={handleAddToCart}
        disabled={disabled}
        className={`flex-1 py-3 rounded-lg font-semibold transition ${
          !disabled ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-400 cursor-not-allowed text-gray-700"
        }`}
        aria-disabled={disabled}
      >
        Add to Cart
      </button>

      <button
        onClick={handleBuyNow}
        disabled={disabled}
        className={`flex-1 py-3 rounded-lg font-semibold transition ${
          !disabled ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-400 cursor-not-allowed text-gray-700"
        }`}
        aria-disabled={disabled}
      >
        Buy Now
      </button>
    </div>
  );
}
