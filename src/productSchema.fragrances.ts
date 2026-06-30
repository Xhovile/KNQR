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
      title: "Fragrance Variants",
      description: "Scent profile, bottle size, and performance details.",
      fields: ["sizes", "volume", "scentFamily", "fragranceGender", "concentration", "longevity", "notes"],
    },
  ],
  fields: [
    ...BASE_PRODUCT_SCHEMA.fields,
    {
      key: "volume",
      label: "Volume Options",
      type: "select",
      section: "fragrance-variants",
      options: ["50ml", "100ml", "150ml", "Sample Vial (2ml)"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances",
      },
    },
    {
      key: "scentFamily",
      label: "Olfactive Scent Sensation Family",
      type: "select",
      section: "fragrance-variants",
      options: ["Woody & Earthy", "Oriental & Amber", "Fresh & Citrusy", "Warm & Spicy", "Floral & Aromatic"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances",
      },
    },
    {
      key: "fragranceGender",
      label: "Target Profile Scent",
      type: "radio",
      section: "fragrance-variants",
      options: ["Unisex / Fluid", "Pour Homme (Masculine)", "Pour Femme (Feminine)"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances",
      },
    },
    {
      key: "concentration",
      label: "Fragrance Strength Profile",
      type: "select",
      section: "fragrance-variants",
      options: ["Extrait de Parfum (Highest)", "Eau de Parfum (EDP)", "Eau de Toilette (EDT)", "Eau de Cologne"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances",
      },
    },
    {
      key: "longevity",
      label: "Average Scent Projection Longevity",
      type: "select",
      section: "fragrance-variants",
      options: ["Light (2-4 Hours)", "Moderate (4-6 Hours)", "Long-Lasting (6-8 Hours)", "Eternal (8-12+ Hours)"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances",
      },
    },
    {
      key: "notes",
      label: "Olfactive Fragrance Notes",
      type: "multiselect",
      section: "fragrance-variants",
      options: ["Bergamot", "Sandalwood", "Amber Noir", "Malawian Vetiver", "Sweet Vanilla", "Oud Wood", "Black Pepper", "Cedarwood", "Patchouli", "Neroli", "Cardamom"],
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
    sizes: ["50ml", "100ml"],
    volume: "100ml",
    scentFamily: "Woody & Earthy",
    fragranceGender: "Unisex / Fluid",
    concentration: "Eau de Parfum (EDP)",
    longevity: "Long-Lasting (6-8 Hours)",
    notes: [],
  };
}

export function getFragrancesSchemaField(key: string): ProductSchemaField | undefined {
  return FRAGRANCES_SCHEMA.fields.find((field) => field.key === key);
}
