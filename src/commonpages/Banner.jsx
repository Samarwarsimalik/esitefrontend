import React from "react";
import { useNavigate } from "react-router-dom"; // React Router hook

export default function EcommerceBanner() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/shop"); // change "/shop" to your shop page route
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[400px] md:h-[500px] lg:h-[550px]">
      {/* Background image */}
      <img
        src="http://localhost:5000/uploads/products/ban.png"
        alt="E-commerce Banner"
        className="w-full h-full object-cover brightness-90"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Shop the Best Deals Online
        </h1>
        <p className="text-white/90 text-lg sm:text-xl mb-6">
          Find top-quality products at unbeatable prices
        </p>
        <button
          onClick={handleShopNow}
          className="bg-white text-black font-bold py-3 px-8 rounded-full shadow-lg hover:bg-black hover:text-white transition-all duration-300"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}
