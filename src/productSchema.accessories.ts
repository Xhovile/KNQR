import {
  BASE_PRODUCT_SCHEMA,
  ProductDraftValues,
  ProductSchema,
  ProductSchemaField,
  createEmptyBaseProductDraft,
} from "./productSchema.base";

export const ACCESSORIES_SCHEMA: ProductSchema = {
  key: "product-accessories",
  title: "Accessories Schema",
  description: "Schema for standalone accessories such as belts, wallets, sunglasses, jewellery, watches, and scarves.",
  requiredKeys: [...BASE_PRODUCT_SCHEMA.requiredKeys, "accessoryType", "accessoryMaterial", "accessoryUseCase"],
  sections: [
    ...BASE_PRODUCT_SCHEMA.sections,
    {
      key: "accessories-variants",
      title: "Accessory Specifications",
      description: "Accessory type, material, styling, and use-case details.",
      fields: ["sizes", "colors", "accessoryType", "accessoryMaterial", "accessoryStyle", "accessoryUseCase"],
    },
  ],
  fields: [
    ...BASE_PRODUCT_SCHEMA.fields,
    {
      key: "accessoryType",
      label: "Accessory Type",
      type: "select",
      section: "accessories-variants",
      options: ["Belt", "Wallet", "Sunglasses", "Jewellery", "Watch", "Scarf", "Keyring", "Case"],
      dependsOn: {
        field: "collectionCategory",
        value: "Accessories",
      },
    },
    {
      key: "accessoryMaterial",
      label: "Material Finish",
      type: "select",
      section: "accessories-variants",
      options: ["Leather", "Metal", "Fabric", "Plastic", "Mixed Material", "Textured Finish"],
      dependsOn: {
        field: "collectionCategory",
        value: "Accessories",
      },
    },
    {
      key: "accessoryStyle",
      label: "Style Profile",
      type: "select",
      section: "accessories-variants",
      options: ["Minimal", "Statement", "Classic", "Sport", "Formal", "Casual"],
      dependsOn: {
        field: "collectionCategory",
        value: "Accessories",
      },
    },
    {
      key: "accessoryUseCase",
      label: "Primary Use",
      type: "select",
      section: "accessories-variants",
      options: ["Daily Wear", "Formal Wear", "Travel", "Gift", "Occasion Wear"],
      dependsOn: {
        field: "collectionCategory",
        value: "Accessories",
      },
    },
  ],
};

export function createEmptyAccessoriesProductDraft(): ProductDraftValues {
  return {
    ...createEmptyBaseProductDraft(),
    collectionCategory: "Accessories",
    category: "Belts",
    accessoryType: "Belt",
    accessoryMaterial: "Leather",
    accessoryStyle: "Classic",
    accessoryUseCase: "Daily Wear",
  };
}

export function getAccessoriesSchemaField(key: string): ProductSchemaField | undefined {
  return ACCESSORIES_SCHEMA.fields.find((field) => field.key === key);
}
