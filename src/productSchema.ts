export type ProductStatus = "draft" | "active" | "sold_out" | "archived";
export type ProductDeliveryMethod = "Pickup" | "Local delivery" | "Courier" | "Shipping";

export type ProductFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "boolean"
  | "image[]"
  | "checkbox"
  | "radio";

export interface ProductSchemaField {
  key: string;
  label: string;
  type: ProductFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  section?: string;
  dependsOn?: {
    field: string;
    value: string | string[];
  };
}

export interface ProductSchemaSection {
  key: string;
  title: string;
  description?: string;
  fields: string[];
}

export interface ProductSchema {
  key: string;
  title: string;
  description: string;
  fields: ProductSchemaField[];
  sections: ProductSchemaSection[];
  requiredKeys: string[];
}

export interface ProductDraftValues {
  name: string;
  priceUSD: number | null;
  priceMWK: number | null;
  collectionCategory: string;
  category: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  description: string;
  status: ProductStatus;
  stock: number | null;
  deliveryMethod: ProductDeliveryMethod | "";
  deliveryNote: string;
  details: string[];

  // Apparel specific
  fit?: string;
  material?: string;
  apparelGender?: string;
  sleeveType?: string;

  // Bags & Accessories specific
  bagType?: string;
  bagMaterial?: string;
  strapType?: string;
  bagCapacity?: string;
  useCase?: string;

  // Fragrances specific
  volume?: string;
  scentFamily?: string;
  fragranceGender?: string;
  concentration?: string;
  longevity?: string;
  notes?: string[];
}

export const SUBCATEGORIES_MAP: Record<string, string[]> = {
  "Apparel": ["T-shirts", "Hoodies", "Sweaters", "Tracksuits", "Golf shirts", "Jackets", "3/4 sleeve shirts", "Caps"],
  "Bags & Accessories": ["Backpacks", "Sling bags", "Gym bags", "Hustle bags", "Toilet bags"],
  "Fragrances": ["Perfumes", "Colognes"]
};

export const PRODUCT_SCHEMA: ProductSchema = {
  key: "product",
  title: "Product Schema",
  description: "The source of truth for product create/edit forms, validation, and media.",
  requiredKeys: [
    "name",
    "priceUSD",
    "priceMWK",
    "collectionCategory",
    "category",
    "description",
    "status",
    "stock",
    "deliveryMethod",
  ],
  sections: [
    {
      key: "basic",
      title: "Basic Info",
      description: "Define the visual identity, title, story, and status of the product.",
      fields: ["name", "collectionCategory", "category", "description", "status"],
    },
    {
      key: "pricing",
      title: "Pricing",
      description: "Set the cost and track available warehouse quantity.",
      fields: ["priceUSD", "priceMWK", "stock"],
    },
    {
      key: "media",
      title: "Media",
      description: "Select product images from the device. Files stay staged locally until Publish.",
      fields: ["image", "images"],
    },
    {
      key: "variants",
      title: "Variants",
      description: "Customize sizes, colors, and dynamic category-specific options.",
      fields: [
        "sizes", 
        "colors",
        // Apparel
        "fit",
        "material",
        "apparelGender",
        "sleeveType",
        // Bags
        "bagType",
        "bagMaterial",
        "strapType",
        "bagCapacity",
        "useCase",
        // Fragrances
        "volume",
        "scentFamily",
        "fragranceGender",
        "concentration",
        "longevity",
        "notes"
      ],
    },
    {
      key: "delivery",
      title: "Delivery",
      description: "Configure shipment modes and regional handoff instructions.",
      fields: ["deliveryMethod", "deliveryNote"],
    },
    {
      key: "extras",
      title: "Details",
      description: "Add key sourcing, craft, and highlight tags for the buyer.",
      fields: ["details"],
    },
  ],
  fields: [
    {
      key: "name",
      label: "Product Name",
      type: "text",
      required: true,
      section: "basic",
      placeholder: "Enter product name",
    },
    {
      key: "collectionCategory",
      label: "Collection Category",
      type: "select",
      required: true,
      section: "basic",
      options: ["Apparel", "Bags & Accessories", "Fragrances"],
    },
    {
      key: "category",
      label: "Sub Category",
      type: "select",
      required: true,
      section: "basic",
      options: [
        "T-shirts", "Hoodies", "Sweaters", "Tracksuits", "Golf shirts", "Jackets", "3/4 sleeve shirts", "Caps",
        "Backpacks", "Sling bags", "Gym bags", "Hustle bags", "Toilet bags",
        "Perfumes", "Colognes"
      ],
    },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      required: true,
      section: "basic",
      placeholder: "Describe the product clearly",
    },
    {
      key: "status",
      label: "Status",
      type: "radio",
      required: true,
      section: "basic",
      options: ["draft", "active", "sold_out", "archived"],
      helpText: "Controls whether the product is public, hidden, or out of stock.",
    },
    {
      key: "priceUSD",
      label: "Price (USD)",
      type: "number",
      required: true,
      section: "pricing",
      placeholder: "100",
    },
    {
      key: "priceMWK",
      label: "Price (MWK)",
      type: "number",
      required: true,
      section: "pricing",
      placeholder: "175000",
    },
    {
      key: "stock",
      label: "Stock Count",
      type: "number",
      required: true,
      section: "pricing",
      placeholder: "12",
    },
    {
      key: "image",
      label: "Primary Image",
      type: "text",
      required: false,
      section: "media",
      placeholder: "Managed after publish",
      helpText: "The editor stages device images locally and saves Cloudinary URLs only when you publish.",
    },
    {
      key: "images",
      label: "Gallery Images",
      type: "image[]",
      required: false,
      section: "media",
      helpText: "Device-selected photos are uploaded on Publish and stored as URLs in the product record.",
    },
    {
      key: "sizes",
      label: "Sizes",
      type: "multiselect",
      section: "variants",
      options: ["XS", "S", "M", "L", "XL", "One Size", "50ml", "100ml"],
      dependsOn: {
        field: "collectionCategory",
        value: ["Apparel", "Fragrances"]
      }
    },
    {
      key: "colors",
      label: "Colors",
      type: "multiselect",
      section: "variants",
      options: ["Earthy Brown", "Desert Sand", "Slate Charcoal", "24K Gold Plated", "Original Essence"],
      dependsOn: {
        field: "collectionCategory",
        value: ["Apparel", "Bags & Accessories"]
      }
    },
    {
      key: "fit",
      label: "Product Fit Style",
      type: "select",
      section: "variants",
      options: ["Regular Fit", "Slim Fit", "Oversized", "Relaxed Fit", "Athletic Fit"],
      dependsOn: {
        field: "collectionCategory",
        value: "Apparel"
      }
    },
    {
      key: "material",
      label: "Fabric Composition",
      type: "select",
      section: "variants",
      options: ["100% Malawian Cotton", "Heavyweight Fleece Cotton", "Premium Linen Blend", "Polyester Tech Blend", "Nylon Sport", "Merino Wool Blend"],
      dependsOn: {
        field: "collectionCategory",
        value: "Apparel"
      }
    },
    {
      key: "apparelGender",
      label: "Target Gender Profile",
      type: "radio",
      section: "variants",
      options: ["Unisex", "Men", "Women"],
      dependsOn: {
        field: "collectionCategory",
        value: "Apparel"
      }
    },
    {
      key: "sleeveType",
      label: "Sleeve Type",
      type: "select",
      section: "variants",
      options: ["Short Sleeve", "Long Sleeve", "Sleeveless", "3/4 Sleeve", "None"],
      dependsOn: {
        field: "collectionCategory",
        value: "Apparel"
      }
    },
    {
      key: "bagType",
      label: "Accessory / Bag Category",
      type: "select",
      section: "variants",
      options: ["Backpack", "Sling Bag", "Gym Bag", "Hustle Bag", "Toilet Bag", "Hand-carried Case", "Jewelry / Accent"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories"
      }
    },
    {
      key: "bagMaterial",
      label: "Accessory Material Sourcing",
      type: "select",
      section: "variants",
      options: ["Full-Grain Genuine Leather", "Ultra-durable Canvas", "Water-resistant Ballistic Nylon", "24K Gold Plated Brass", "Sterling Silver Coated"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories"
      }
    },
    {
      key: "strapType",
      label: "Strap Style",
      type: "select",
      section: "variants",
      options: ["Adjustable Padded Shoulder Straps", "Removable Chain Strap", "Dual Reinforced Carry Handles", "Elastic Hook Strap", "None"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories"
      }
    },
    {
      key: "bagCapacity",
      label: "Volume Capacity",
      type: "select",
      section: "variants",
      options: ["Under 5L (Compact)", "5L - 15L (Medium)", "15L - 30L (Daily)", "Over 30L (Travel)", "One Size (Accessory)"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories"
      }
    },
    {
      key: "useCase",
      label: "Primary Intended Use",
      type: "select",
      section: "variants",
      options: ["Daily Commute & Office", "Gym & Active Sports", "Weekend Travel & Outing", "Formal & Evening Accents"],
      dependsOn: {
        field: "collectionCategory",
        value: "Bags & Accessories"
      }
    },
    {
      key: "volume",
      label: "Volume Options",
      type: "select",
      section: "variants",
      options: ["50ml", "100ml", "150ml", "Sample Vial (2ml)"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances"
      }
    },
    {
      key: "scentFamily",
      label: "Olfactive Scent Sensation Family",
      type: "select",
      section: "variants",
      options: ["Woody & Earthy", "Oriental & Amber", "Fresh & Citrusy", "Warm & Spicy", "Floral & Aromatic"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances"
      }
    },
    {
      key: "fragranceGender",
      label: "Target Profile Scent",
      type: "radio",
      section: "variants",
      options: ["Unisex / Fluid", "Pour Homme (Masculine)", "Pour Femme (Feminine)"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances"
      }
    },
    {
      key: "concentration",
      label: "Fragrance Strength Profile",
      type: "select",
      section: "variants",
      options: ["Extrait de Parfum (Highest)", "Eau de Parfum (EDP)", "Eau de Toilette (EDT)", "Eau de Cologne"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances"
      }
    },
    {
      key: "longevity",
      label: "Average Scent Projection Longevity",
      type: "select",
      section: "variants",
      options: ["Light (2-4 Hours)", "Moderate (4-6 Hours)", "Long-Lasting (6-8 Hours)", "Eternal (8-12+ Hours)"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances"
      }
    },
    {
      key: "notes",
      label: "Olfactive Fragrance Notes",
      type: "multiselect",
      section: "variants",
      options: ["Bergamot", "Sandalwood", "Amber Noir", "Malawian Vetiver", "Sweet Vanilla", "Oud Wood", "Black Pepper", "Cedarwood", "Patchouli", "Neroli", "Cardamom"],
      dependsOn: {
        field: "collectionCategory",
        value: "Fragrances"
      }
    },
    {
      key: "deliveryMethod",
      label: "Default Delivery Method",
      type: "select",
      required: true,
      section: "delivery",
      options: ["Pickup", "Local delivery", "Courier", "Shipping"],
    },
    {
      key: "deliveryNote",
      label: "Delivery Guidelines / Notes",
      type: "textarea",
      section: "delivery",
      placeholder: "Provide special local handoff or delivery notes here...",
    },
    {
      key: "details",
      label: "Highlighted Selling Points",
      type: "multiselect",
      section: "extras",
      options: ["Premium finish", "Limited edition", "Handmade", "Locally sourced", "Ethically Crafted", "Waterproof Materials"],
    },
  ],
};

export function createEmptyProductDraft(): ProductDraftValues {
  return {
    name: "",
    priceUSD: null,
    priceMWK: null,
    collectionCategory: "Apparel",
    category: "T-shirts",
    image: "",
    images: [],
    sizes: [],
    colors: [],
    description: "",
    status: "draft",
    stock: null,
    deliveryMethod: "",
    deliveryNote: "",
    details: [],

    // Defaults for Apparel
    fit: "Regular Fit",
    material: "100% Malawian Cotton",
    apparelGender: "Unisex",
    sleeveType: "Short Sleeve",

    // Defaults for Bags
    bagType: "Backpack",
    bagMaterial: "Full-Grain Genuine Leather",
    strapType: "Adjustable Padded Shoulder Straps",
    bagCapacity: "15L - 30L (Daily)",
    useCase: "Daily Commute & Office",

    // Defaults for Fragrances
    volume: "100ml",
    scentFamily: "Woody & Earthy",
    fragranceGender: "Unisex / Fluid",
    concentration: "Eau de Parfum (EDP)",
    longevity: "Long-Lasting (6-8 Hours)",
    notes: []
  };
}

export function getProductSchemaField(key: string): ProductSchemaField | undefined {
  return PRODUCT_SCHEMA.fields.find((field) => field.key === key);
}
