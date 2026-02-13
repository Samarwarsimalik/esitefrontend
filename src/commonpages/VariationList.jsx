import React from "react";

export default function VariationList({ variations, terms, selectedVariation, setSelectedVariation }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Available Variations and Prices:</h3>
      <ul className="list-disc list-inside text-sm text-gray-700">
        {variations.map((variation) => {
          const termsNames = variation.attributeTermIds
            .map((termId) => terms.find((t) => t._id === termId)?.name)
            .filter(Boolean)
            .join(", ");

          const hasVarDiscount = variation.salePrice && variation.salePrice < variation.price;

          return (
            <li
              key={variation._id}
              className={`mb-1 cursor-pointer ${selectedVariation?._id === variation._id ? "font-bold text-blue-600" : ""}`}
              onClick={() => setSelectedVariation(variation)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSelectedVariation(variation);
              }}
              aria-pressed={selectedVariation?._id === variation._id}
            >
              <span className="mr-2 font-semibold">{termsNames || "Unnamed Variation"}</span>{" "}
              {hasVarDiscount ? (
                <>
                  <span className="font-bold text-green-600">₹{variation.salePrice.toLocaleString()}</span>{" "}
                  <span className="line-through text-gray-400">₹{variation.price.toLocaleString()}</span>
                </>
              ) : (
                <span className="font-bold text-gray-900">₹{variation.price.toLocaleString()}</span>
              )}
              {variation.stockQty <= 0 && <span className="text-red-600 ml-2">(Out of stock)</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
