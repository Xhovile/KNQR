import {
  BASE_PRODUCT_SCHEMA,
  ProductDraftValues,
  ProductSchema,
  ProductSchemaField,
  createEmptyBaseProductDraft,
} from "./productSchema.base";

export const FRAGRANCES_SCHEMA: ProductSchema = {
  key: "product-fragrances",
  title: "Fragrances Schema",
  description: "Schema for perfumes and colognes with scent, concentration, and longevity fields.",
  requiredKeys: [...BASE_PRODUCT_SCHEMA.requiredKeys, "volume", "scentFamily", "fragranceGender", "concentration", "longevity"],
  sections: [
    ...BASE_PRODUCT_SCHEMA.sections,
    {
      key: "fragrance-variants",
      title: "Fragrance Specifications",
      description: "Bottle size, scent profile, concentration, and wear performance.",
      fields: ["sizes", "volume", "scentFamily", "fragranceGender", "concentration", "longevity", "notes"],
    },
  ],
  fields: [
    ...BASE_PRODUCT_SCHEMA.fields,
    {
      key: "volume",
      label: "Bottle Volume",
      type: "select",
      section: "fragrance-variants",
      options: ["30ml", "50ml", "100ml", "150ml", "Travel Size (2ml)"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances",
      },
    },
    {
      key: "scentFamily",
      label: "Scent Family",
      type: "select",
      section: "fragrance-variants",
      options: ["Fresh", "Woody", "Amber", "Floral", "Spicy"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances",
      },
    },
    {
      key: "fragranceGender",
      label: "Wear Profile",
      type: "radio",
      section: "fragrance-variants",
      options: ["Unisex", "Men", "Women"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances",
      },
    },
    {
      key: "concentration",
      label: "Concentration",
      type: "select",
      section: "fragrance-variants",
      options: ["Extrait de Parfum", "Eau de Parfum", "Eau de Toilette", "Eau de Cologne"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances",
      },
    },
    {
      key: "longevity",
      label: "Longevity",
      type: "select",
      section: "fragrance-variants",
      options: ["Light (2-4 Hours)", "Moderate (4-6 Hours)", "Long-Lasting (6-8 Hours)", "Extended (8+ Hours)"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances",
      },
    },
    {
      key: "notes",
      label: "Fragrance Notes",
      type: "multiselect",
      section: "fragrance-variants",
      options: ["Bergamot", "Sandalwood", "Amber", "Vetiver", "Vanilla", "Oud", "Black Pepper", "Cedarwood", "Patchouli", "Neroli", "Cardamom"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances",
      },
    },
  ],
};

export function createEmptyFragrancesProductDraft(): ProductDraftValues {
  return {
    ...createEmptyBaseProductDraft(),
    collectionCategory: "Fragrances",
    category: "Perfumes",
    sizes: ["30ml", "100ml"],
    volume: "100ml",
    scentFamily: "Woody",
    fragranceGender: "Unisex",
    concentration: "Eau de Parfum",
    longevity: "Long-Lasting (6-8 Hours)",
    notes: [],
  };
}

export function getFragrancesSchemaField(key: string): ProductSchemaField | undefined {
  return FRAGRANCES_SCHEMA.fields.find((field) => field.key === key);
}
