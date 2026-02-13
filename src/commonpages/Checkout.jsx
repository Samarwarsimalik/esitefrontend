import React, { useState } from "react";
import axios from "axios";

export default function Checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.quantity * (item.salePrice || item.price),
    0
  );

  const calculateEstimatedDeliveryDateISO = (estimateDays, cutoffTime) => {
    if (!estimateDays) return null;

    const now = new Date();

    const [cutoffHours, cutoffMinutes] = cutoffTime
      ? cutoffTime.split(":").map(Number)
      : [23, 59];

    const cutoffDate = new Date(now);
    cutoffDate.setHours(cutoffHours, cutoffMinutes, 0, 0);

    let deliveryDate = new Date(now);

    if (now > cutoffDate) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    deliveryDate.setDate(deliveryDate.getDate() + Number(estimateDays));

    return deliveryDate.toISOString();
  };

  const getEstimatedDeliveryDate = (estimateDays, cutoffTime) => {
    if (!estimateDays) return "N/A";

    const now = new Date();

    const [cutoffHours, cutoffMinutes] = cutoffTime
      ? cutoffTime.split(":").map(Number)
      : [23, 59];

    const cutoffDate = new Date(now);
    cutoffDate.setHours(cutoffHours, cutoffMinutes, 0, 0);

    let deliveryDate = new Date(now);

    if (now > cutoffDate) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    deliveryDate.setDate(deliveryDate.getDate() + Number(estimateDays));

    const options = { year: "numeric", month: "short", day: "numeric" };
    return deliveryDate.toLocaleDateString(undefined, options);
  };

  const placeCODOrder = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await axios.post(
        "/api/orders/cod",
        {
           cartItems: cart.map((item) => ({
                  _id: item._id,
                  productId: item.productId || item._id,
                  title: item.title,
                  price: item.price,
                  seller: item.seller,
                  quantity: item.quantity,
                  featuredImage: item.featuredImage,
                  sku: item.sku,
                  variation: item.variation || null,
                  selectedTerms: item.selectedTerms || {},
                  brand: item.brand || {},
                  category: item.category || {},
                  cutoffTime: item.cutoffTime || "",
                  estimateDeliveryDate: item.estimateDeliveryDate || "",
                  stockQty: item.stockQty || 0,
                })),
          totalAmount,
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            address: form.address,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        },
        { withCredentials: true }
      );

      localStorage.removeItem("cart");
      window.location.href = "/order-success";
    } catch (error) {
      alert("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data: order } = await axios.post(
        "/api/payment/create-order",
        { amount: totalAmount },
        { withCredentials: true }
      );

      const options = {
        key: "rzp_test_S4ph1RU1MZ6gRW",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "My Shop",
        handler: async (response) => {
          try {
            await axios.post(
              "/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentMethod: "razorpay",
                cartItems: cart.map((item) => ({
                  _id: item._id,
                  productId: item.productId || item._id,
                  title: item.title,
                  price: item.price,
                  seller: item.seller,
                  quantity: item.quantity,
                  featuredImage: item.featuredImage,
                  sku: item.sku,
                  variation: item.variation || null,
                  selectedTerms: item.selectedTerms || {},
                  brand: item.brand || {},
                  category: item.category || {},
                  cutoffTime: item.cutoffTime || "",
                  estimateDeliveryDate: item.estimateDeliveryDate || "",
                  stockQty: item.stockQty || 0,
                })),
                totalAmount,
                customer: {
                  name: form.name,
                  email: form.email,
                  phone: form.phone,
                },
                shippingAddress: {
                  address: form.address,
                  city: form.city,
                  state: form.state,
                  pincode: form.pincode,
                },
              },
              { withCredentials: true }
            );

            localStorage.removeItem("cart");
            window.location.href = "/order-success";
          } catch (err) {
            alert("Payment verification failed, please contact support.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      alert("Payment initiation failed. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans text-gray-900">
      <h2 className="text-3xl font-bold mb-6 border-b-2 border-black pb-2">
        Checkout
      </h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 border-b border-gray-300 pb-3"
            >
              <img
                src={
                  item.featuredImage
                    ? `http://localhost:5000${item.featuredImage}`
                    : ""
                }
                alt={item.title}
                className="w-20 h-20 object-cover rounded-md border border-gray-400"
              />
              <div className="flex-1">
                <p className="font-semibold">{item.title}</p>
                <p>
                  Qty: {item.quantity} × ₹{item.salePrice || item.price}
                </p>
                <p className="text-green-700 font-medium mt-1">
                  Estimated Delivery:{" "}
                  {getEstimatedDeliveryDate(item.estimateDeliveryDate, item.cutoffTime)}
                </p>
              </div>
              <div className="font-bold text-lg">
                ₹{item.quantity * (item.salePrice || item.price)}
              </div>
            </div>
          ))}
        </div>
        <h3 className="text-2xl font-bold mt-6">Total: ₹{totalAmount}</h3>
      </section>

      <form className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="w-full border border-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </form>

      <div className="mt-8 flex gap-4">
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`flex-1 py-3 rounded-lg font-semibold border-2 border-black transition
            ${
              loading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-black text-white hover:bg-white hover:text-black"
            }`}
          aria-label="Pay Online"
        >
          {loading ? "Processing..." : "Pay Online"}
        </button>
        <button
          onClick={placeCODOrder}
          disabled={loading}
          className={`flex-1 py-3 rounded-lg font-semibold border-2 border-black transition
            ${
              loading
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-white text-black hover:bg-black hover:text-white"
            }`}
          aria-label="Cash on Delivery"
        >
          {loading ? "Processing..." : "Cash on Delivery"}
        </button>
      </div>
    </div>
  );
}
