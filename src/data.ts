import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "knqr-trousers",
    name: "Apparel",
    priceUSD: 100,
    priceMWK: 175000,
    image: "/src/assets/images/knqr_trousers_1782618856513.jpg",
    category: "Apparel",
    description: "Expertly tailored relaxed-fit apparel made from lightweight Malawian-sourced fabric. Features double pleats, comfortable side pockets, and custom organic fastenings. Designed for ultimate versatility and effortless elegance.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Earthy Brown", "Desert Sand", "Slate Charcoal"],
    details: [
      "Premium Organic Fibers",
      "Locally designed and ethically manufactured in Blantyre, Malawi",
      "Breathable material perfect for warm climates",
      "Dry clean recommended"
    ]
  },
  {
    id: "knqr-necklace",
    name: "Bags & Accessories",
    priceUSD: 100,
    priceMWK: 175000,
    image: "/src/assets/images/knqr_necklace_1782618869518.jpg",
    category: "Accessories",
    description: "An elegant, minimalist accessory designed as a physical representation of the KNQR spirit—unyielding, ambitious, and bold. Hand-polished to a reflective mirror finish, built to elevate any curated look.",
    sizes: ["One Size"],
    colors: ["24K Gold Plated"],
    details: [
      "Fine craftsmanship and luxury finishes",
      "Hypoallergenic and tarnish-resistant coating",
      "Packaged in a premium signature velvet pouch"
    ]
  },
  {
    id: "knqr-blouse",
    name: "Fragrances",
    priceUSD: 100,
    priceMWK: 175000,
    image: "/src/assets/images/knqr_blouse_1782618882678.jpg",
    category: "Apparel",
    description: "An evocative, premium-grade signature fragrance with a sophisticated fluid character. Crafted with clean natural notes. Perfect for transitioning seamlessly from creative workspace to high-end evening experiences.",
    sizes: ["50ml", "100ml"],
    colors: ["Original Essence"],
    details: [
      "Premium heavyweight natural fragrance oils",
      "Exquisite bottle design and crafted packaging",
      "Long-lasting luxury scent projection"
    ]
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
