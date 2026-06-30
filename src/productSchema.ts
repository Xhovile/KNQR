export * from "./productSchema.base";
export * from "./productSchema.apparel";
export * from "./productSchema.bags";
export * from "./productSchema.fragrances";

import { BASE_PRODUCT_SCHEMA } from "./productSchema.base";
import { APPAREL_SCHEMA } from "./productSchema.apparel";
import { BAGS_SCHEMA } from "./productSchema.bags";
import { FRAGRANCES_SCHEMA } from "./productSchema.fragrances";

export const PRODUCT_SCHEMAS = {
  Apparel: APPAREL_SCHEMA,
  "Bags & Accessories": BAGS_SCHEMA,
  Fragrances: FRAGRANCES_SCHEMA,
} as const;

export function getProductSchemaForCategory(category?: string) {
  return (
    PRODUCT_SCHEMAS[category as keyof typeof PRODUCT_SCHEMAS] ?? BASE_PRODUCT_SCHEMA
  );
}
