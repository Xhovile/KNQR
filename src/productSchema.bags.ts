import {
  BASE_PRODUCT_SCHEMA,
  ProductDraftValues,
  ProductSchema,
  ProductSchemaField,
  createEmptyBaseProductDraft,
} from "./productSchema.base";

export const BAGS_SCHEMA: ProductSchema = {
  key: "product-bags",
  title: "Bags & Accessories Schema",
  description: "Schema for backpacks, sling bags, gym bags, hustle bags, toilet bags, and other accessories.",
  requiredKeys: [...BASE_PRODUCT_SCHEMA.requiredKeys, "bagType", "bagMaterial", "strapType", "bagCapacity", "useCase"],
  sections: [
    ...BASE_PRODUCT_SCHEMA.sections,
    {
      key: "bag-variants",
      title: "Bags & Accessories Variants",
      description: "Accessory-specific construction, carrying style, and usage details.",
      fields: ["colors", "bagType", "bagMaterial", "strapType", "bagCapacity", "useCase"],
    },
  ],
  fields: [
    ...BASE_PRODUCT_SCHEMA.fields,
    {
      key: "bagType",
      label: "Accessory / Bag Category",
      type: "select",
      section: "bag-variants",
      options: ["Backpack", "Sling Bag", "Gym Bag", "Hustle Bag", "Toilet Bag", "Hand-carried Case", "Jewelry / Accent"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories",
      },
    },
    {
      key: "bagMaterial",
      label: "Accessory Material Sourcing",
      type: "select",
      section: "bag-variants",
      options: [
        "Full-Grain Genuine Leather",
        "Ultra-durable Canvas",
        "Water-resistant Ballistic Nylon",
        "24K Gold Plated Brass",
        "Sterling Silver Coated",
      ],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories",
      },
    },
    {
      key: "strapType",
      label: "Strap Style",
      type: "select",
      section: "bag-variants",
      options: [
        "Adjustable Padded Shoulder Straps",
        "Removable Chain Strap",
        "Dual Reinforced Carry Handles",
        "Elastic Hook Strap",
        "None",
      ],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories",
      },
    },
    {
      key: "bagCapacity",
      label: "Volume Capacity",
      type: "select",
      section: "bag-variants",
      options: ["Under 5L (Compact)", "5L - 15L (Medium)", "15L - 30L (Daily)", "Over 30L (Travel)", "One Size (Accessory)"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories",
      },
    },
    {
      key: "useCase",
      label: "Primary Intended Use",
      type: "select",
      section: "bag-variants",
      options: ["Daily Commute & Office", "Gym & Active Sports", "Weekend Travel & Outing", "Formal & Evening Accents"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories",
      },
    },
  ],
};

export function createEmptyBagsProductDraft(): ProductDraftValues {
  return {
    ...createEmptyBaseProductDraft(),
    collectionCategory: "Bags & Accessories",
    category: "Backpacks",
    bagType: "Backpack",
    bagMaterial: "Full-Grain Genuine Leather",
    strapType: "Adjustable Padded Shoulder Straps",
    bagCapacity: "15L - 30L (Daily)",
    useCase: "Daily Commute & Office",
  };
}

export function getBagsSchemaField(key: string): ProductSchemaField | undefined {
  return BAGS_SCHEMA.fields.find((field) => field.key === key);
}
