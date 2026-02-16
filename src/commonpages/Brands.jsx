import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://esitebackend.onrender.com/api/brands")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch brands");
        return res.json();
      })
      .then((data) => {
        setBrands(data || []);
        setLoading(false);
        // Trigger resize so slider recalculates width
        window.dispatchEvent(new Event("resize"));
      })
      .catch((err) => {
        console.error("Error fetching brands:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="text-center mt-20 text-xl text-gray-700">
        Loading brands...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-20 text-xl text-red-500">Error: {error}</div>
    );

  // Custom arrows
  const NextArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 right-2 sm:right-3 z-10 w-10 h-10 bg-black text-white flex items-center justify-center rounded-full cursor-pointer hover:bg-white hover:text-black transition-colors duration-300"
      style={{ transform: "translateY(-50%)" }}
      onClick={onClick}
    >
      <ChevronRight size={20} />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 left-2 sm:left-3 z-10 w-10 h-10 bg-black text-white flex items-center justify-center rounded-full cursor-pointer hover:bg-white hover:text-black transition-colors duration-300"
      style={{ transform: "translateY(-50%)" }}
      onClick={onClick}
    >
      <ChevronLeft size={20} />
    </div>
  );

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="w-full px-4 sm:px-6 py-12">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-gray-900">
        Explore Our Brands
      </h1>

      {brands.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No brands available.</p>
      ) : (
        <div className="relative w-full mx-auto">
          <Slider {...sliderSettings}>
            {brands.map((brand) => (
              <div
                key={brand._id}
                onClick={() => navigate(`/brand/${brand.slug}`)}
                className="px-2 cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                  {brand.image ? (
                    <img
                      src={`https://esitebackend.onrender.com${brand.image}`}
                      alt={brand.name}
                      className="w-full h-48 sm:h-56 md:h-60 lg:h-64 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 sm:h-56 md:h-60 lg:h-64 bg-gray-200 flex items-center justify-center text-gray-400 font-semibold text-lg rounded-2xl">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 w-full text-center">
                    <h3 className="text-white font-bold text-lg capitalize">
                      {brand.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}