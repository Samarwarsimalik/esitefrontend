const variationImagesFiles = files.variationImages || [];
let imgIndex = 0;

variations = variations.map((v, i) => {
  // 🔥 frontend se aayi images (delete ke baad [] ho sakti hain)
  let finalImages = Array.isArray(v.images) ? [...v.images] : [];

  // agar naye files aaye hain to unhe ADD karo
  if (variationImagesFiles[imgIndex]) {
    finalImages.push(`/uploads/${variationImagesFiles[imgIndex].filename}`);
    imgIndex++;
  }

  return {
    ...v,
    images: finalImages, // ✅ REPLACED, not merged with old DB images
  };
});