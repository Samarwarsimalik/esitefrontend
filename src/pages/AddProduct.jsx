import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

// AttributesSection component
function AttributesSection({ allAttributes, allTerms, attributes, setAttributes }) {
  const addAttribute = () => {
    setAttributes([...attributes, { attributeId: "", terms: [] }]);
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index, attributeId) => {
    const newAttrs = [...attributes];
    newAttrs[index] = { attributeId, terms: [] };
    setAttributes(newAttrs);
  };

  const handleTermToggle = (attrIndex, termId) => {
    const newAttrs = [...attributes];
    const currentTerms = newAttrs[attrIndex].terms;
    if (currentTerms.includes(termId)) {
      newAttrs[attrIndex].terms = currentTerms.filter((t) => t !== termId);
    } else {
      newAttrs[attrIndex].terms = [...currentTerms, termId];
    }
    setAttributes(newAttrs);
  };

  const getTermsForAttribute = (attributeId) =>
    allTerms.filter((term) => term.attribute?._id === attributeId);

  return (
    <section className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Attributes</h3>
      {attributes.map((attr, idx) => (
        <div
          key={idx}
          className="relative border border-gray-300 rounded-md p-4 mb-4 bg-white shadow-sm"
        >
          <button
            type="button"
            onClick={() => removeAttribute(idx)}
            className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
            aria-label="Remove attribute"
          >
            &times;
          </button>

          <select
            value={attr.attributeId}
            onChange={(e) => handleAttributeChange(idx, e.target.value)}
            required
            className="w-full mb-3 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Attribute</option>
            {allAttributes.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>

          {attr.attributeId && (
            <div className="flex flex-wrap gap-4">
              {getTermsForAttribute(attr.attributeId).map((term) => (
                <label
                  key={term._id}
                  className="flex items-center space-x-2 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={attr.terms.includes(term._id)}
                    onChange={() => handleTermToggle(idx, term._id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{term.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addAttribute}
        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        + Add Attribute
      </button>
    </section>
  );
}

// VariationsSection component with image upload
function VariationsSection({
  attributes,
  allAttributes,
  allTerms,
  variations,
  setVariations,
}) {
  const removeVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariationField = (index, field, value) => {
    const newVars = [...variations];
    newVars[index][field] = value;
    setVariations(newVars);
  };

  const updateVariationAttributeTerm = (variationIndex, attrIndex, termId) => {
    const newVars = [...variations];
    if (!newVars[variationIndex].attributeTermIds)
      newVars[variationIndex].attributeTermIds = [];
    newVars[variationIndex].attributeTermIds[attrIndex] = termId;
    setVariations(newVars);
  };

  const getTermsForAttribute = (attributeId) =>
    allTerms.filter((term) => term.attribute?._id === attributeId);

  // Handle variation image uploads and previews
  const handleVariationImagesChange = (variationIndex, e) => {
    const files = Array.from(e.target.files);
    const newVars = [...variations];
    if (!Array.isArray(newVars[variationIndex].images)) {
      newVars[variationIndex].images = [];
    }
    newVars[variationIndex].images = [...newVars[variationIndex].images, ...files];
    setVariations(newVars);
  };

  const removeVariationImage = (variationIndex, imgIndex) => {
    const newVars = [...variations];
    newVars[variationIndex].images = newVars[variationIndex].images.filter((_, i) => i !== imgIndex);
    setVariations(newVars);
  };

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        attributeTermIds: [],
        price: undefined,
        salePrice: undefined,
        stockQty: 0,
        sku: "",
        images: [],
      },
    ]);
  };

  return (
    <section className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Variations</h3>
      {variations.map((variation, idx) => (
        <div
          key={idx}
          className="relative border border-gray-400 rounded-md p-4 mb-4 bg-white shadow-sm"
        >
          <button
            type="button"
            onClick={() => removeVariation(idx)}
            className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-6 h-6 flex items-center justify-center focus:outline-none"
            aria-label="Remove variation"
          >
            &times;
          </button>

          <div className="space-y-3">
            {attributes.map((attr, attrIdx) => (
              <div key={attrIdx} className="flex items-center space-x-3">
                <label className="w-36 font-medium">
                  {allAttributes.find((a) => a._id === attr.attributeId)?.name || "Attribute"}:
                </label>
                <select
                  value={variation.attributeTermIds?.[attrIdx] || ""}
                  onChange={(e) => updateVariationAttributeTerm(idx, attrIdx, e.target.value)}
                  required
                  className="flex-grow rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Term</option>
                  {getTermsForAttribute(attr.attributeId).map((term) => (
                    <option key={term._id} value={term._id}>
                      {term.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="flex flex-wrap gap-4 mt-2">
              <input
                type="number"
                placeholder="Price"
                value={variation.price ?? ""}
                onChange={(e) =>
                  updateVariationField(idx, "price", e.target.value ? Number(e.target.value) : undefined)
                }
                required
                className="w-28 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Sale Price"
                value={variation.salePrice ?? ""}
                onChange={(e) =>
                  updateVariationField(idx, "salePrice", e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-28 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Stock Qty"
                value={variation.stockQty ?? 0}
                onChange={(e) =>
                  updateVariationField(idx, "stockQty", e.target.value ? Number(e.target.value) : 0)
                }
                required
                className="w-28 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="SKU"
                value={variation.sku ?? ""}
                onChange={(e) => updateVariationField(idx, "sku", e.target.value)}
                className="w-36 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Variation images input */}
            <div>
              <label className="block font-medium mb-1">Variation Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleVariationImagesChange(idx, e)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {(variation.images || []).map((img, i) => {
                  const url = img instanceof File ? URL.createObjectURL(img) : img;
                  return (
                    <div
                      key={i}
                      className="relative w-20 h-20 border border-gray-300 rounded overflow-hidden"
                    >
                      <img
                        src={url}
                        alt={`Variation ${idx} Img ${i}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariationImage(idx, i)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        aria-label="Remove image"
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addVariation}
        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        + Add Variation
      </button>
    </section>
  );
}

// Main ProductForm component
export default function ProductForm({ editingProduct = null, onSaved }) {
  const [title, setTitle] = useState(editingProduct?.title || "");
  const [slug, setSlug] = useState(editingProduct?.slug || "");
  const [description, setDescription] = useState(editingProduct?.description || "");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [existingFeaturedImage, setExistingFeaturedImage] = useState(editingProduct?.featuredImage || "");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(editingProduct?.images || []);
  const [productType, setProductType] = useState(editingProduct?.productType || "simple");
  const [price, setPrice] = useState(editingProduct?.price || "");
  const [salePrice, setSalePrice] = useState(editingProduct?.salePrice || "");
  const [discountPercent, setDiscountPercent] = useState(editingProduct?.discountPercent || "");
  const [stockQty, setStockQty] = useState(editingProduct?.stockQty || 0);
  const [sku, setSku] = useState(editingProduct?.sku || "");
  const [estimateDeliveryDate, setEstimateDeliveryDate] = useState(
    editingProduct?.estimateDeliveryDate ? editingProduct.estimateDeliveryDate.substring(0, 10) : ""
  );
  const [cutoffTime, setCutoffTime] = useState(editingProduct?.cutoffTime || "");
  const [active, setActive] = useState(editingProduct?.active ?? true);

  const [allAttributes, setAllAttributes] = useState([]);
  const [allTerms, setAllTerms] = useState([]);

  // Initialize variations and ensure images array for each variation
  const [variations, setVariations] = useState(() => {
    if (editingProduct?.variations) {
      return editingProduct.variations.map((v) => ({
        ...v,
        images: Array.isArray(v.images) ? v.images : [],
      }));
    }
    return [];
  });

  const [attributes, setAttributes] = useState(editingProduct?.attributes || []);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(editingProduct?.category || "");
  const [selectedBrand, setSelectedBrand] = useState(editingProduct?.brand || "");
  const [selectedTags, setSelectedTags] = useState(editingProduct?.tags || []);

  const [msg, setMsg] = useState("");

  useEffect(() => {
    setSlug(slugify(title));
  }, [title]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attrRes, termRes, catRes, brandRes, tagRes] = await Promise.all([
          axios.get(`${API}/attributes`),
          axios.get(`${API}/terms`),
          axios.get(`${API}/categories`),
          axios.get(`${API}/brands`),
          axios.get(`${API}/tags`),
        ]);
        setAllAttributes(attrRes.data);
        setAllTerms(termRes.data);
        setCategories(catRes.data);
        setBrands(brandRes.data);
        setTags(tagRes.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  const handleFeaturedImageChange = (e) => {
    if (e.target.files.length > 0) setFeaturedImage(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setFeaturedImage(null);
    setExistingFeaturedImage("");
    setImages([]);
    setExistingImages([]);
    setProductType("simple");
    setPrice("");
    setSalePrice("");
    setDiscountPercent("");
    setStockQty(0);
    setSku("");
    setEstimateDeliveryDate("");
    setCutoffTime("");
    setActive(true);
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedTags([]);
    setAttributes([]);
    setVariations([]);
    setMsg("");
  };

  const submit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    // Basic fields (title, slug, description, etc.) appended here ...
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("productType", productType);
    if (productType === "simple") formData.append("price", price);
    if (salePrice) formData.append("salePrice", salePrice);
    if (discountPercent) formData.append("discountPercent", discountPercent);
    formData.append("stockQty", stockQty);
    if (sku) formData.append("sku", sku);
    if (estimateDeliveryDate) formData.append("estimateDeliveryDate", estimateDeliveryDate);
    if (cutoffTime) formData.append("cutoffTime", cutoffTime);
    formData.append("active", active);
    if (selectedCategory) formData.append("category", selectedCategory);
    if (selectedBrand) formData.append("brand", selectedBrand);
    formData.append("tags", JSON.stringify(selectedTags));
    formData.append("attributes", JSON.stringify(attributes));

    // Variations metadata WITHOUT images
    const variationsWithoutImages = variations.map(({ images, ...rest }) => rest);
    formData.append("variations", JSON.stringify(variationsWithoutImages));

    // Featured Image
    if (featuredImage) formData.append("featuredImage", featuredImage);

    // Gallery Images (new uploads)
    images.forEach((imgFile) => {
      formData.append("images", imgFile);
    });

    // Existing gallery images (edit mode)
    if (existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    // **Variation Images: append ALL images from all variations under the SAME field "variationImages"**
    variations.forEach((variation) => {
      if (variation.images && variation.images.length > 0) {
        variation.images.forEach((file) => {
          if (file instanceof File) {
            formData.append("variationImages", file);  // IMPORTANT: same field name here
          }
        });
      }
    });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };

    let response;
    if (editingProduct) {
      response = await axios.put(`${API}/products/${editingProduct._id}`, formData, config);
      setMsg("✅ Product updated successfully");
    } else {
      response = await axios.post(`${API}/products`, formData, config);
      setMsg("✅ Product created successfully");
    }

    resetForm();
    if (onSaved) onSaved(response.data);
  } catch (err) {
    console.error("Failed to save product:", err);
    setMsg("❌ Failed to save product: " + (err.response?.data?.message || err.message));
  }
};


  return (
    <form onSubmit={submit} className="max-w-4xl mx-auto p-4 bg-gray-50 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">{editingProduct ? "Edit Product" : "Add Product"}</h2>

      {msg && (
        <div
          className={`mb-4 p-3 rounded ${
            msg.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
          role="alert"
        >
          {msg}
        </div>
      )}

      {/* Title and Slug */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Product Title"
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          placeholder="product-slug"
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Product Type */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Product Type</label>
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="simple">Simple</option>
          <option value="variable">Variable</option>
        </select>
      </div>

      {/* Simple product price */}
      {productType === "simple" && (
        <div className="mb-4 flex space-x-4">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Sale Price"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="mb-4">
    <input
      type="number"
      placeholder="Discount Percent"
      value={discountPercent}
      onChange={(e) => setDiscountPercent(e.target.value)}
      min={0}
      max={100}
      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
        </div>
        
      )}

      {/* Attributes */}
      <AttributesSection
        allAttributes={allAttributes}
        allTerms={allTerms}
        attributes={attributes}
        setAttributes={setAttributes}
      />

      {/* Variations */}
      {productType === "variable" && (
        <VariationsSection
          attributes={attributes}
          allAttributes={allAttributes}
          allTerms={allTerms}
          variations={variations}
          setVariations={setVariations}
        />
      )}

      {/* Featured Image */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Featured Image</label>
        {existingFeaturedImage && !featuredImage && (
          <img
            src={existingFeaturedImage}
            alt="Featured"
            className="w-32 h-32 object-cover rounded mb-2"
          />
        )}
        {featuredImage && (
          <img
            src={URL.createObjectURL(featuredImage)}
            alt="Featured Preview"
            className="w-32 h-32 object-cover rounded mb-2"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFeaturedImageChange}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Gallery Images */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Gallery Images</label>

        <div className="flex flex-wrap gap-2 mb-2">
          {existingImages.map((img, i) => (
            <div key={i} className="relative w-20 h-20 border rounded overflow-hidden">
              <img
                src={img}
                alt={`Gallery ${i}`}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(i)}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                aria-label="Remove image"
              >
                &times;
              </button>
            </div>
          ))}
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 border rounded overflow-hidden">
              <img
                src={URL.createObjectURL(img)}
                alt={`New Gallery ${i}`}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                aria-label="Remove image"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImagesChange}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category, Brand, Tags */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Brand</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
    <label className="block font-semibold mb-1">Tags</label>
    <select
      multiple
      value={selectedTags}
      onChange={(e) => {
        const options = e.target.options;
        const values = [];
        for (let i = 0; i < options.length; i++) {
          if (options[i].selected) values.push(options[i].value);
        }
        setSelectedTags(values);
      }}
      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      size={Math.min(tags.length, 5)} // To show a few options without scrolling too much
    >
      {tags.map((tag) => (
        <option key={tag._id} value={tag._id}>
          {tag.name}
        </option>
      ))}
    </select>
  </div>
      </div>

      {/* Stock and SKU for simple product */}
      {productType === "simple" && (
        <div className="mb-4 flex space-x-4">
          <input
            type="number"
            placeholder="Stock Quantity"
            value={stockQty}
            onChange={(e) => setStockQty(Number(e.target.value))}
            className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Estimate Delivery Date & Cutoff Time */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Estimate Delivery Date</label>
          <input
            type="number"
            value={estimateDeliveryDate}
            onChange={(e) => setEstimateDeliveryDate(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Cutoff Time</label>
          <input
            type="time"
            value={cutoffTime}
            onChange={(e) => setCutoffTime(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Active toggle */}
      <div className="mb-6 flex items-center space-x-2">
        <input
          type="checkbox"
          checked={active}
          onChange={() => setActive(!active)}
          id="activeCheckbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="activeCheckbox" className="font-semibold">
          Active
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {editingProduct ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
