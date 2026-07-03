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
  description: "Schema for backpacks, sling bags, gym bags, hustle bags, toilet bags, and premium accessories.",
  requiredKeys: [...BASE_PRODUCT_SCHEMA.requiredKeys, "bagType", "bagMaterial", "strapType", "bagCapacity", "useCase"],
  sections: [
    ...BASE_PRODUCT_SCHEMA.sections,
    {
      key: "bag-variants",
      title: "Accessory Specifications",
      description: "Accessory construction, carry style, capacity, and usage details.",
      fields: ["colors", "bagType", "bagMaterial", "strapType", "bagCapacity", "useCase"],
    },
  ],
  fields: [
    ...BASE_PRODUCT_SCHEMA.fields,
    {
      key: "bagType",
      label: "Accessory Type",
      type: "select",
      section: "bag-variants",
      options: ["Backpack", "Sling Bag", "Gym Bag", "Hustle Bag", "Toilet Bag", "Hand-carry Case", "Accent Accessory"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories",
      },
    },
    {
      key: "bagMaterial",
      label: "Material Finish",
      type: "select",
      section: "bag-variants",
      options: ["Full-Grain Leather", "Durable Canvas", "Water-resistant Nylon", "Textured Finish", "Metal Accent Finish"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories",
      },
    },
    {
      key: "strapType",
      label: "Carry Style",
      type: "select",
      section: "bag-variants",
      options: ["Adjustable Shoulder Straps", "Removable Strap", "Dual Carry Handles", "Hook Strap", "No Strap"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories",
      },
    },
    {
      key: "bagCapacity",
      label: "Capacity Profile",
      type: "select",
      section: "bag-variants",
      options: ["Compact", "Medium", "Daily", "Travel", "One Size"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories",
      },
    },
    {
      key: "useCase",
      label: "Primary Use",
      type: "select",
      section: "bag-variants",
      options: ["Daily Commute", "Gym & Sport", "Weekend Travel", "Formal Use"],
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
    bagMaterial: "Full-Grain Leather",
    strapType: "Adjustable Shoulder Straps",
    bagCapacity: "Daily",
    useCase: "Daily Commute",
  };
}

export function getBagsSchemaField(key: string): ProductSchemaField | undefined {
  return BAGS_SCHEMA.fields.find((field) => field.key === key);
}
