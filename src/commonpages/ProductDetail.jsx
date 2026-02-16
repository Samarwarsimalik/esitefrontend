import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL || "https://esitebackend.onrender.com";

/* ---------- STAR RATING ---------- */
const StarRating = ({ value = 0, editable = false, onChange }) => {
  const rounded = Math.round(value);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => editable && onChange(i)}
          className={`text-xl ${editable ? "cursor-pointer" : ""} ${
            i <= rounded ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      {!editable && (
        <span className="text-sm text-gray-500 ml-1">({value.toFixed(1)})</span>
      )}
    </div>
  );
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTerms, setSelectedTerms] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    axios
      .get(`${API_BASE}/api/products/slug/${slug}`)
      .then((res) => {
        const data = res.data.product || res.data;
        setProduct(data);
        setReviews(data.reviews || []);

        if (data.productType === "variable" && data.variations?.length) {
          const first = data.variations[0];
          setSelectedVariation(first);

          const auto = {};
          data.attributes.forEach((attr) => {
            const termId = first.attributeTermIds.find((id) =>
              attr.terms.some((t) => t._id === id)
            );
            if (termId) auto[attr.attributeId._id] = termId;
          });
          setSelectedTerms(auto);
        }
      })
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  const handleTermSelect = (attributeId, termId) => {
    setSelectedTerms((prev) => {
      const updated = { ...prev, [attributeId]: termId };
      const match = product.variations.find((v) =>
        v.attributeTermIds.every((id) => Object.values(updated).includes(id))
      );
      setSelectedVariation(match || null);
      return updated;
    });
  };

  const isVariable = product?.productType === "variable";

  const basePrice = isVariable ? selectedVariation?.price ?? 0 : product?.price ?? 0;
  const salePrice = isVariable ? selectedVariation?.salePrice ?? basePrice : product?.salePrice ?? basePrice;
  const stockQty = isVariable ? selectedVariation?.stockQty ?? 0 : product?.stockQty ?? 0;

  const showDiscount = salePrice && salePrice < basePrice;
  const discountPercent = showDiscount ? Math.round(((basePrice - salePrice)/basePrice)*100) : 0;
  const displaySKU = isVariable ? selectedVariation?.sku || "Select variation" : product?.sku || "N/A";

  const mainImage = isVariable ? selectedVariation?.images?.[0] || product?.featuredImage : product?.featuredImage;
  const displayImages = isVariable ? selectedVariation?.images || [] : product?.images || [];

  const handleAddToCart = () => {
    if (isVariable && !selectedVariation) return alert("Select variation first");
    if (stockQty <= 0) return alert("Out of stock");

    const sellerId = typeof product.createdBy === "object" ? product.createdBy._id : product.createdBy;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex((item) => {
      if (isVariable) return item.productId === product._id && item.variation === selectedVariation._id;
      else return item._id === product._id;
    });

    if (existingIndex > -1) {
      if (cart[existingIndex].quantity < stockQty) cart[existingIndex].quantity += 1;
      else return alert("No more stock available");
    } else {
      cart.push({
        _id: isVariable ? selectedVariation._id : product._id,
        productId: product._id,
        title: product.title,
        seller: sellerId,
        price: isVariable ? selectedVariation.salePrice || selectedVariation.price : product.salePrice || product.price,
        quantity: 1,
        stockQty,
        featuredImage: isVariable ? (selectedVariation.images?.[0] || product.featuredImage) : product.featuredImage,
        variation: isVariable ? selectedVariation._id : null,
        sku: displaySKU,
        brand: product.brand || null,
        category: product.category || null,
        selectedTerms: isVariable ? selectedTerms : {}
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Write something");

    try {
      setSubmitting(true);
      await axios.post(`${API_BASE}/api/products/${product._id}/review`, { rating, comment });
      const res = await axios.get(`${API_BASE}/api/products/slug/${slug}`);
      setReviews(res.data.product?.reviews || []);
      setRating(5);
      setComment("");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button onClick={() => navigate("/products")} className="mb-6 text-sm text-blue-600">← Back</button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img src={mainImage ? `${API_BASE}${mainImage}` : "/placeholder.png"} alt="" className="w-full max-w-md rounded shadow" />
          {displayImages.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {displayImages.map((img, i) => (
                <img key={i} src={`${API_BASE}${img}`} className="w-20 h-20 object-cover border rounded" alt="" />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <StarRating value={reviews.length ? reviews.reduce((a,r)=>a+r.rating,0)/reviews.length : 0} />

          <p className="mt-3 text-gray-600">{product.description}</p>

          {product.brand && <p><b>Brand:</b> {product.brand.name}</p>}
          {product.category && <p><b>Category:</b> {product.category.name}</p>}

          {isVariable && product.attributes.map(attr => (
            <div key={attr._id} className="mt-5">
              <p className="font-semibold mb-2">{attr.attributeId.name}</p>
              <div className="flex gap-3 flex-wrap">
                {attr.terms.map(term => (
                  <button
                    key={term._id}
                    onClick={()=>handleTermSelect(attr.attributeId._id, term._id)}
                    className={`px-4 py-2 border rounded ${selectedTerms[attr.attributeId._id] === term._id ? "bg-black text-white": ""}`}
                  >
                    {term.name}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6 flex items-center gap-4">
            {showDiscount ? (
              <>
                <span className="text-3xl font-bold">₹{salePrice}</span>
                <span className="line-through text-gray-400">₹{basePrice}</span>
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded">{discountPercent}% OFF</span>
              </>
            ) : <span className="text-3xl font-bold">₹{basePrice}</span>}
          </div>

          <p className="mt-2">Stock: <span className={stockQty>0?"text-green-600":"text-red-600"}>{stockQty}</span></p>

          <div className="flex gap-4 mt-6">
            <button onClick={handleAddToCart} disabled={(isVariable && !selectedVariation) || stockQty<=0} className="flex-1 bg-black text-white py-3 rounded">Add to Cart</button>
            <button onClick={handleBuyNow} disabled={(isVariable && !selectedVariation) || stockQty<=0} className="flex-1 bg-gray-800 text-white py-3 rounded">Buy Now</button>
          </div>
        </div>
      </div>

      <hr className="my-10" />
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
      {reviews.map(r=>(
        <div key={r._id} className="border p-4 rounded mb-4">
          <StarRating value={r.rating} />
          <p className="mt-2">{r.comment}</p>
          <p className="text-sm text-gray-500 mt-1">– {r.userName}</p>
        </div>
      ))}

      <form onSubmit={submitReview} className="max-w-lg space-y-4">
        <StarRating value={rating} editable onChange={setRating} />
        <textarea value={comment} onChange={e=>setComment(e.target.value)} className="w-full border p-3 rounded" rows={4}/>
        <button type="submit" disabled={submitting} className="bg-black text-white px-6 py-3 rounded">Submit Review</button>
      </form>
    </div>
  );
}