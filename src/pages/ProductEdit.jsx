import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductForm from "./AddProduct";

const API = "http://localhost:5000/api";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API}/products/${id}`, {
        withCredentials: true,
      });

      const p = res.data;

      // 🔥 ATTRIBUTES MAPPING
      const mappedAttributes =
        p.attributes?.map((a) => ({
          attributeId: a.attributeId?._id || a.attributeId,
          terms: a.terms?.map((t) => t._id),
        })) || [];

      // 🔥 VARIATIONS MAPPING
      const mappedVariations =
        p.variations?.map((v) => ({
          attributeTermIds:
            v.attributeTermIds ||
            v.attributes?.map((a) => a.term?._id) ||
            [],
          price: v.price,
          salePrice: v.salePrice,
          stockQty: v.stockQty,
          sku: v.sku,
          images: v.images || [],
        })) || [];

      setProduct({
        _id: p._id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        productType: p.productType,

        price: p.price,
        salePrice: p.salePrice,
        discountPercent: p.discountPercent,
        stockQty: p.stockQty,
        sku: p.sku,

        estimateDeliveryDate: p.estimateDeliveryDate,
        cutoffTime: p.cutoffTime,
        active: p.active,

        featuredImage: p.featuredImage,
        images: p.images || [],

        category: p.category?._id || "",
        brand: p.brand?._id || "",
        tags: p.tags?.map((t) => t._id) || [],

        attributes: mappedAttributes,
        variations: mappedVariations,
      });
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading product...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <ProductForm
        editingProduct={product}
        onSaved={() => navigate("/Allproducts")}
      />
    </div>
  );
}
