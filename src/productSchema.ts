export * from "./productSchema.base";
export * from "./productSchema.apparel";
export * from "./productSchema.bags";
export * from "./productSchema.accessories";
export * from "./productSchema.fragrances";

import { BASE_PRODUCT_SCHEMA, ProductSchema } from "./productSchema.base";
import { APPAREL_SCHEMA } from "./productSchema.apparel";
import { BAGS_SCHEMA } from "./productSchema.bags";
import { ACCESSORIES_SCHEMA } from "./productSchema.accessories";
import { FRAGRANCES_SCHEMA } from "./productSchema.fragrances";

const SCHEMAS: Record<string, ProductSchema> = {
  Apparel: APPAREL_SCHEMA,
  "Bags & Accessories": BAGS_SCHEMA,
  Accessories: ACCESSORIES_SCHEMA,
  Fragrances: FRAGRANCES_SCHEMA,
};

export function getProductSchemaForCategory(category?: string) {
  return SCHEMAS[category || ""] ?? BASE_PRODUCT_SCHEMA;
}
