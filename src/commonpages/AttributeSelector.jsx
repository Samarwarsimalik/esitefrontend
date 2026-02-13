import React from "react";

export default function AttributeSelector({ attributes, terms, selectedAttributes, setSelectedAttributes, product, setSelectedVariation }) {
  const handleAttributeChange = (attrId, selectedTermId) => {
    const newAttrs = { ...selectedAttributes, [attrId]: selectedTermId };
    setSelectedAttributes(newAttrs);

    if (!product) return;

    const match = product.variations.find((variation) => {
      if (!variation.attributeTermIds) return false;
      return product.attributes.every((attr, idx) => {
        const expectedTermId = newAttrs[attr.attributeId ? attr.attributeId : attr._id];
        const varTermId = variation.attributeTermIds[idx];
        return expectedTermId === varTermId;
      });
    });

    setSelectedVariation(match || null);
  };

  return (
    <div className="mb-6">
      {attributes.map((attr, idx) => {
        const attrId = attr.attributeId ? attr.attributeId : attr._id;
        const termsForAttr = terms.filter((t) => t.attribute && t.attribute._id === attrId);

        if (termsForAttr.length === 0) {
          return (
            <p key={idx} className="text-red-600">
              No terms defined for attribute {attr.name}
            </p>
          );
        }

        return (
          <div key={idx} className="mb-4">
            <label className="block font-semibold mb-1">{attr.name}</label>
            <select
              value={selectedAttributes[attrId] || ""}
              onChange={(e) => handleAttributeChange(attrId, e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            >
              <option value="">Select {attr.name}</option>
              {termsForAttr.map((term) => (
                <option key={term._id} value={term._id}>
                  {term.name}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
