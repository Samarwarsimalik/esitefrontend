import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

const API = "https://esitebackend.onrender.com/api";
const BASE_URL = "https://esitebackend.onrender.com";

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API}/categories`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

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

  const settings = {
    dots: false,
    infinite: categories.length > 5,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-lg py-10">
        Loading categories...
      </p>
    );
  }

  if (!categories.length) {
    return (
      <p className="text-center text-gray-500 text-lg py-10">
        No categories available.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-gray-900">
        Categories
      </h1>

      <Slider {...settings}>
        {categories.map((cat) => (
          <div key={cat._id} className="p-2">
            <div
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
          </div>
        ))}
      </Slider>
    </div>
  );
}