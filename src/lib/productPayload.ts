import { Product } from "../types";
import { ProductDraftValues } from "../productSchema";

export function buildProductFromDraft(values: ProductDraftValues, base?: Product): Product {
  const common = {
    name: values.name,
    priceUSD: values.priceUSD || 0,
    priceMWK: values.priceMWK || 0,
    image: values.image || "",
    images: values.images || [],
    category: values.category || "T-shirts",
    collectionCategory: values.collectionCategory,
    description: values.description,
    sizes: values.sizes,
    colors: values.colors,
    details: values.details,
    status: values.status,
    stock: values.stock || 0,
    delivery: {
      available: values.deliveryMethod !== "Pickup",
      methods: [values.deliveryMethod].filter(Boolean) as string[],
      note: values.deliveryNote,
    },
    fit: values.fit,
    material: values.material,
    apparelGender: values.apparelGender,
    sleeveType: values.sleeveType,
    bagType: values.bagType,
    bagMaterial: values.bagMaterial,
    strapType: values.strapType,
    bagCapacity: values.bagCapacity,
    useCase: values.useCase,
    volume: values.volume,
    scentFamily: values.scentFamily,
    fragranceGender: values.fragranceGender,
    concentration: values.concentration,
    longevity: values.longevity,
    notes: values.notes,
  };

  if (base) {
    return { ...base, ...common };
  }

  const newId = `knqr-${values.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

  return {
    id: newId,
    ...common,
  };
}
