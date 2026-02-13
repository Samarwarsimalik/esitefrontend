import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [productsAttributes, setProductsAttributes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

    // Prepare a map of productId -> attributes (to resolve selectedTerms later)
    // Since your cart only has selectedTerms but not full attribute info,
    // ideally you fetch or pass attribute data here.
    // For demo, we store attributes for each product from cart items if present.

    // Assuming each cart item also has attributes saved (or you can fetch product detail here).
    // If not available, you will need to fetch product details for each item.

    // Example: Let's fetch product attributes for all items in cart (async)
    async function fetchAttributes() {
      const attrsMap = {};
      for (const item of cart) {
        // Only fetch if not already fetched
        if (!attrsMap[item.productId]) {
          try {
            const res = await fetch(`/api/products/${item.productId}`);
            const data = await res.json();
            attrsMap[item.productId] = data.product?.attributes || [];
          } catch (e) {
            attrsMap[item.productId] = [];
          }
        }
      }
      setProductsAttributes(attrsMap);
    }

    fetchAttributes();

  }, []);

  // Helper to resolve selectedTerms IDs into human-readable "Color: Red" etc
  const getSelectedAttributesDisplay = (selectedTerms, attributes) => {
    return Object.entries(selectedTerms || {}).map(([attrId, termId]) => {
      const attr = attributes.find(a => a.attributeId._id === attrId);
      if (!attr) return null;
      const term = attr.terms.find(t => t._id === termId);
      if (!term) return null;

      return `${attr.attributeId.name}: ${term.name}`;
    }).filter(Boolean);
  };

  // Quantity change handlers
  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) => {
      const updated = [...prev];
      if (newQty <= updated[index].stockQty) {
        updated[index].quantity = newQty;
      } else {
        alert("No more stock available");
      }
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  // Remove item
  const removeItem = (index) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate total
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-6">
        {cartItems.map((item, i) => {
          const attrs = getSelectedAttributesDisplay(item.selectedTerms, productsAttributes[item.productId] || []);

          return (
            <div key={item._id} className="flex gap-6 border p-4 rounded">
              <img
                src={`http://localhost:5000${item.featuredImage}`}
                alt={item.title}
                className="w-32 h-32 object-cover rounded"
              />

              <div className="flex-1 flex flex-col">
                <h2 className="text-xl font-semibold">{item.title}</h2>

                {attrs.length > 0 && (
                  <ul className="text-sm text-gray-700 mb-2">
                    {attrs.map((attrText, idx) => (
                      <li key={idx}>{attrText}</li>
                    ))}
                  </ul>
                )}

                <p className="text-sm text-gray-600 mb-1">SKU: {item.sku}</p>
                {item.brand && <p className="text-sm mb-1">Brand: {item.brand.name || item.brand}</p>}
                {item.category && <p className="text-sm mb-1">Category: {item.category.name || item.category}</p>}
                <p className="text-lg font-semibold mb-2">Price: ₹{item.price}</p>

                <div className="flex items-center gap-4">
                  <label>
                    Quantity:
                    <input
                      type="number"
                      min={1}
                      max={item.stockQty}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(i, Number(e.target.value))}
                      className="ml-2 w-16 border rounded px-2 py-1"
                    />
                  </label>

                  <button
                    onClick={() => removeItem(i)}
                    className="text-red-600 underline"
                  >
                    Remove
                  </button>
                </div>

                {item.stockQty <= 0 && (
                  <p className="text-red-600 mt-2">Out of stock</p>
                )}

                {item.estimateDeliveryDate && (
                  <p className="text-sm mt-2">
                    Estimated Delivery: {item.estimateDeliveryDate} days
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex justify-end items-center gap-6">
        <p className="text-2xl font-bold">Total: ₹{total}</p>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
