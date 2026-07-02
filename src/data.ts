import { Product } from "./types";

import trousersImg from "./assets/images/knqr_trousers_1782618856513.jpg";
import necklaceImg from "./assets/images/knqr_necklace_1782618869518.jpg";
import blouseImg from "./assets/images/knqr_blouse_1782618882678.jpg";
import blackShirtImg from "./assets/images/knqr_black_shirt_1782625829276.jpg";
import apparelNewImg from "./assets/images/knqr_apparel_new_1782625253891.jpg";
import accessoryNewImg from "./assets/images/knqr_accessory_new_1782625265014.jpg";
import fragranceNewImg from "./assets/images/knqr_fragrance_new_1782625278359.jpg";

export const PRODUCTS: Product[] = [
  {
    id: "knqr-trousers-lux",
    name: "KNQR Luxury Trousers",
    priceUSD: 120,
    priceMWK: 210000,
    image: trousersImg,
    category: "Tracksuits",
    collectionCategory: "Apparel",
    description: "Bespoke tailored trousers crafted with the finest Malawian cotton blend. Designed for effortless grace, comfort, and premium structure.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Slate", "Charcoal", "Oatmeal"],
    details: ["Premium finish", "Locally sourced", "Ethically Crafted"],
    status: "active",
    stock: 15,
    delivery: {
      available: true,
      methods: ["Courier", "Local delivery", "Pickup"],
      note: "Standard 24-hour delivery within Blantyre and Lilongwe."
    },
    fit: "Regular Fit",
    material: "95% Malawian Cotton, 5% Elastane",
    apparelGender: "Unisex",
    sleeveType: "N/A"
  },
  {
    id: "knqr-black-shirt",
    name: "KNQR Sleek Black Shirt",
    priceUSD: 65,
    priceMWK: 115000,
    image: blackShirtImg,
    category: "T-shirts",
    collectionCategory: "Apparel",
    description: "A signature minimalist black tee with high-contrast tracking and elegant tailoring. Designed as a modern wardrobe staple.",
    sizes: ["M", "L", "XL"],
    colors: ["Deep Onyx"],
    details: ["Premium finish", "Limited edition", "Ethically Crafted"],
    status: "active",
    stock: 25,
    delivery: {
      available: true,
      methods: ["Courier", "Local delivery"],
      note: "Dispatched within 12 hours of payment validation."
    },
    fit: "Slim Fit",
    material: "100% Giza Cotton",
    apparelGender: "Unisex",
    sleeveType: "Short Sleeve"
  },
  {
    id: "knqr-blouse-signature",
    name: "KNQR Signature Blouse",
    priceUSD: 85,
    priceMWK: 150000,
    image: blouseImg,
    category: "3/4 sleeve shirts",
    collectionCategory: "Apparel",
    description: "Flowing silhouette tailored with lightweight breathable fabric. Elegant draping that transitions perfectly from daytime leadership to twilight soirées.",
    sizes: ["S", "M", "L"],
    colors: ["Ivory", "Cream"],
    details: ["Handmade", "Premium finish"],
    status: "active",
    stock: 10,
    delivery: {
      available: true,
      methods: ["Courier", "Pickup"],
      note: "Available for pickup in our Blantyre showroom or courier nationwide."
    },
    fit: "Relaxed Fit",
    material: "Silk & Cotton Blend",
    apparelGender: "Female",
    sleeveType: "3/4 Sleeve"
  },
  {
    id: "knqr-utility-jacket",
    name: "KNQR Technical Outerwear",
    priceUSD: 180,
    priceMWK: 315000,
    image: apparelNewImg,
    category: "Jackets",
    collectionCategory: "Apparel",
    description: "High-performance technical jacket designed to brave the elements while retaining a sleek urban profile. Structured shoulder lines and bespoke metallic hardware.",
    sizes: ["M", "L", "XL"],
    colors: ["Military Green", "Obsidian Black"],
    details: ["Waterproof Materials", "Premium finish", "Limited edition"],
    status: "active",
    stock: 8,
    delivery: {
      available: true,
      methods: ["Courier", "Local delivery", "Shipping"],
      note: "International shipping available. Regional delivery takes 1-3 business days."
    },
    fit: "Structured Fit",
    material: "Water-Resistant Technical Nylon",
    apparelGender: "Unisex",
    sleeveType: "Long Sleeve"
  },
  {
    id: "knqr-silver-necklace",
    name: "KNQR Handcrafted Silver Chain",
    priceUSD: 150,
    priceMWK: 262500,
    image: necklaceImg,
    category: "Backpacks",
    collectionCategory: "Bags & Accessories",
    description: "Bespoke handcrafted sterling silver neck ornament. Every link is meticulously forged by local artisans to signify strength, ambition, and focus.",
    sizes: ["One Size"],
    colors: ["Sterling Silver"],
    details: ["Handmade", "Limited edition", "Locally sourced"],
    status: "active",
    stock: 5,
    delivery: {
      available: true,
      methods: ["Courier", "Pickup"],
      note: "Presented in a velvet-lined custom wooden jewelry chest."
    },
    bagType: "Accessory",
    bagMaterial: "Sterling Silver",
    strapType: "Chain Link",
    bagCapacity: "N/A",
    useCase: "Statement Wear"
  },
  {
    id: "knqr-hustle-portfolio",
    name: "KNQR Leather Hustle Bag",
    priceUSD: 210,
    priceMWK: 367500,
    image: accessoryNewImg,
    category: "Hustle bags",
    collectionCategory: "Bags & Accessories",
    description: "An elegant full-grain genuine leather portfolio bag designed for the relentless modern builder. Includes dedicated protective compartments for tablets, notebooks, and writing instruments.",
    sizes: ["One Size"],
    colors: ["Tobacco Brown", "Ebony Black"],
    details: ["Handmade", "Premium finish", "Locally sourced"],
    status: "active",
    stock: 12,
    delivery: {
      available: true,
      methods: ["Courier", "Local delivery", "Pickup"],
      note: "Includes lifetime stitching and hardware warranty."
    },
    bagType: "Portfolio / Briefcase",
    bagMaterial: "Full-Grain Genuine Cowhide Leather",
    strapType: "Detachable & Adjustable Leather Shoulder Strap",
    bagCapacity: "12L",
    useCase: "Professional & Travel"
  },
  {
    id: "knqr-solitude-perfume",
    name: "KNQR Solitude Eau de Parfum",
    priceUSD: 95,
    priceMWK: 166250,
    image: fragranceNewImg,
    category: "Perfumes",
    collectionCategory: "Fragrances",
    description: "An evocative olfactory experience opening with crisp top notes of cedarwood and amber, settling into a deep, earthy vetiver base. Inspired by the serene quietness of ambition.",
    sizes: ["100ml"],
    colors: ["Amber Gold"],
    details: ["Premium finish", "Locally sourced", "Limited edition"],
    status: "active",
    stock: 30,
    delivery: {
      available: true,
      methods: ["Courier", "Local delivery", "Pickup"],
      note: "Shipped in compliance with regional safe hazmat perfume transport regulations."
    },
    volume: "100ml",
    scentFamily: "Woody & Earthy",
    fragranceGender: "Unisex / Fluid",
    concentration: "Eau de Parfum (EDP)",
    longevity: "Long-Lasting (8-10 Hours)",
    notes: ["Amber", "Cedarwood", "Bergamot", "Vetiver"]
  }
];

export const AMBITION_QUOTES = [
  {
    quote: "Do not wait for opportunities. CONQUER the present and carve your own path.",
    author: "Hayze Engola, Founder"
  },
  {
    quote: "Our struggles are just chapters in our masterclass of greatness. Keep building, keep inspiring.",
    author: "KNQR Collective"
  },
  {
    quote: "From Blantyre to the world, Malawian creativity is limitless. Ambition is our fuel.",
    author: "KNQR Mindset"
  }
];
