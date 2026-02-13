import React from "react";
import AttributeSelector from "./AttributeSelector";
import VariationList from "./VariationList";
import AddToCartButtons from "./AddToCartButtons";

export default function ProductInfo({
  product,
  selectedAttributes,
  setSelectedAttributes,
  selectedVariation,
  setSelectedVariation,
}) {
  const discountPercent =
    product.discountPercent ||
    ((selectedVariation && selectedVariation.salePrice && selectedVariation.salePrice < selectedVariation.price)
      ? Math.round(((selectedVariation.price - selectedVariation.salePrice) / selectedVariation.price) * 100)
      : product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0);

  const hasDiscount = discountPercent > 0;

  const today = new Date();
  const deliveryDate = product.estimateDeliveryDate
    ? new Date(today.getTime() + Number(product.estimateDeliveryDate) * 24 * 60 * 60 * 1000)
    : null;

  return (
    <div className="md:w-1/2 flex flex-col">
      <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
      <p className="text-gray-700 mb-4">{product.description || "No description"}</p>
      <p className="text-sm text-gray-500 mb-1">
        Category: <span className="font-medium">{product.category?.name || "N/A"}</span>
      </p>

      {product.brand?.name && (
        <p className="text-sm text-gray-500 mb-1">
          Brand: <span className="font-medium">{product.brand.name}</span>
        </p>
      )}

      {product.tags && product.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {product.tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
              {typeof tag === "string" ? tag : tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Attribute selectors */}
      {product.productType === "variable" && product.attributes && product.attributes.length > 0 && product.terms && product.terms.length > 0 ? (
        <AttributeSelector
          attributes={product.attributes}
          terms={product.terms}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
          product={product}
          setSelectedVariation={setSelectedVariation}
        />
      ) : product.productType === "variable" ? (
        <p className="text-red-600 mb-6">No attributes or terms defined for this variable product.</p>
      ) : null}

      {/* Variations list */}
      {product.productType === "variable" && product.variations && (
        <VariationList
          variations={product.variations}
          terms={product.terms}
          selectedVariation={selectedVariation}
          setSelectedVariation={setSelectedVariation}
        />
      )}

      {/* Price display */}
      <div className="mb-4 flex items-center gap-4">
        {hasDiscount ? (
          <>
            <p className="text-3xl font-bold text-green-600">
              ₹{(selectedVariation?.salePrice ?? product.salePrice).toLocaleString()}
            </p>
            <p className="text-xl line-through text-gray-400">
              ₹{(selectedVariation?.price ?? product.price).toLocaleString()}
            </p>
            <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">{discountPercent}% OFF</span>
          </>
        ) : (
          <p className="text-3xl font-bold text-gray-900">₹{(selectedVariation?.price ?? product.price).toLocaleString()}</p>
        )}
      </div>

      <p className="mb-4">
        Stock:{" "}
        <span className={(selectedVariation?.stockQty ?? product.stockQty) > 0 ? "text-blue-600" : "text-red-600"}>
          {selectedVariation?.stockQty ?? product.stockQty}
        </span>
      </p>

      <AddToCartButtons
        product={product}
        selectedVariation={selectedVariation}
      />

      {!(selectedVariation || product.productType === "simple") || (selectedVariation?.stockQty ?? product.stockQty) <= 0 ? (
        <p className="text-red-600 font-semibold">Out of stock</p>
      ) : null}

      {deliveryDate && (
        <p className="text-sm text-gray-600 mb-4">
          Estimated Delivery:{" "}
          <span className="font-semibold">
            {deliveryDate.toLocaleDateString(undefined, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </p>
      )}
    </div>
  );
}
