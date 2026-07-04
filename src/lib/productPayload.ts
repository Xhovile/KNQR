import { Product } from "../types";
import { ProductDraftValues } from "../productSchema";

const MWK_PER_USD = 2000;

function deriveUsdFromMwk(priceMWK: number | null | undefined): number {
  if (!priceMWK || Number.isNaN(priceMWK)) return 0;
  return Math.round((priceMWK / MWK_PER_USD) * 100) / 100;
}

export function buildProductFromDraft(values: ProductDraftValues, base?: Product): Product {
  const computedUSD = deriveUsdFromMwk(values.priceMWK ?? undefined);
  const fallbackUSD = values.priceUSD || 0;

  const common: any = {
    name: values.name,
    priceUSD: computedUSD || fallbackUSD,
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
    accessoryType: (values as any).accessoryType,
    accessoryMaterial: (values as any).accessoryMaterial,
    accessoryStyle: (values as any).accessoryStyle,
    accessoryUseCase: (values as any).accessoryUseCase,
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
