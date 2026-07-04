export const mockRegions = [
  {
    id: "reg_us",
    name: "United States",
    currency_code: "usd",
    countries: [
      { id: 1, iso_2: "us", name: "United States" }
    ]
  },
  {
    id: "reg_au",
    name: "Australia",
    currency_code: "aud",
    countries: [
      { id: 2, iso_2: "au", name: "Australia" }
    ]
  }
];

export const mockCollections = [
  {
    id: "col_featured",
    title: "Featured",
    handle: "featured",
    products: []
  }
];

export const mockCategories = [
  {
    id: "cat_shirts",
    name: "Shirts",
    handle: "shirts",
    category_children: []
  },
  {
    id: "cat_sweatshirts",
    name: "Sweatshirts",
    handle: "sweatshirts",
    category_children: []
  }
];

export const mockProducts = [
  {
    id: "prod_tshirt",
    title: "BPC-157 5mg Vial",
    handle: "bpc-157",
    description: "BPC-157 is a premium research-grade peptide pentadecane. Formulated as a freeze-dried lyophilized powder for laboratory research, providing tissue regeneration and recovery-boosting properties. Purity: 99.8%+ verified by independent HPLC.",
    thumbnail: "/assets/peptide-vial.png",
    images: [
      { url: "/assets/peptide-vial.png" }
    ],
    status: "published",
    weight: 10,
    options: [
      { id: "opt_vial_pack", title: "Pack Size", values: ["Single Vial", "5-Pack", "10-Pack"] }
    ],
    variants: [
      {
        id: "var_tshirt_s",
        sku: "BPC157-1VIAL",
        title: "Single Vial",
        inventory_quantity: 100,
        options: [{ option_id: "opt_vial_pack", value: "Single Vial" }],
        calculated_price: {
          calculated_amount: 79,
          original_amount: 79,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      },
      {
        id: "var_tshirt_m",
        sku: "BPC157-5PACK",
        title: "5-Pack",
        inventory_quantity: 50,
        options: [{ option_id: "opt_vial_pack", value: "5-Pack" }],
        calculated_price: {
          calculated_amount: 349,
          original_amount: 349,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      },
      {
        id: "var_tshirt_l",
        sku: "BPC157-10PACK",
        title: "10-Pack",
        inventory_quantity: 25,
        options: [{ option_id: "opt_vial_pack", value: "10-Pack" }],
        calculated_price: {
          calculated_amount: 599,
          original_amount: 599,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_sweatshirt",
    title: "TB-500 5mg Vial",
    handle: "tb-500",
    description: "TB-500 (Thymosin Beta-4) is a synthetic peptide known for promoting healing, cellular migration, and growth of new blood vessels. Formulated as a high-purity freeze-dried lyophilized powder for laboratory research.",
    thumbnail: "/assets/peptide-vial.png",
    images: [
      { url: "/assets/peptide-vial.png" }
    ],
    status: "published",
    weight: 10,
    options: [
      { id: "opt_vial_pack", title: "Pack Size", values: ["Single Vial", "5-Pack", "10-Pack"] }
    ],
    variants: [
      {
        id: "var_sweatshirt_s",
        sku: "TB500-1VIAL",
        title: "Single Vial",
        inventory_quantity: 100,
        options: [{ option_id: "opt_vial_pack", value: "Single Vial" }],
        calculated_price: {
          calculated_amount: 89,
          original_amount: 89,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      },
      {
        id: "var_sweatshirt_m",
        sku: "TB500-5PACK",
        title: "5-Pack",
        inventory_quantity: 50,
        options: [{ option_id: "opt_vial_pack", value: "5-Pack" }],
        calculated_price: {
          calculated_amount: 399,
          original_amount: 399,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_sweatpants",
    title: "GHK-Cu 50mg Vial",
    handle: "ghk-cu",
    description: "GHK-Cu is a high-concentration copper tripeptide compound studied for its cellular renewal, skin remodeling, and anti-aging research applications. Lyophilized powder.",
    thumbnail: "/assets/peptide-vial.png",
    images: [
      { url: "/assets/peptide-vial.png" }
    ],
    status: "published",
    weight: 10,
    options: [
      { id: "opt_vial_pack", title: "Pack Size", values: ["Single Vial", "5-Pack"] }
    ],
    variants: [
      {
        id: "var_sweatpants_s",
        sku: "GHKCU-1VIAL",
        title: "Single Vial",
        inventory_quantity: 100,
        options: [{ option_id: "opt_vial_pack", value: "Single Vial" }],
        calculated_price: {
          calculated_amount: 99,
          original_amount: 99,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  }
];

export const getMockResponse = (input: string, init?: any): any => {
  const url = String(input);
  
  if (url.includes("/store/regions/")) {
    const parts = url.split("/");
    const id = parts[parts.length - 1];
    const region = mockRegions.find(r => r.id === id) || mockRegions[0];
    return { region };
  }
  
  if (url.includes("/store/regions")) {
    return { regions: mockRegions };
  }

  if (url.includes("/store/collections/")) {
    const parts = url.split("/");
    const id = parts[parts.length - 1];
    const collection = mockCollections.find(c => c.id === id) || mockCollections[0];
    return { collection };
  }

  if (url.includes("/store/collections")) {
    return { collections: mockCollections, count: mockCollections.length };
  }

  if (url.includes("/store/product-categories") || url.includes("/store/categories")) {
    return { product_categories: mockCategories, count: mockCategories.length };
  }

  if (url.includes("/store/products/")) {
    const parts = url.split("/");
    const id = parts[parts.length - 1];
    const product = mockProducts.find(p => p.id === id || p.handle === id) || mockProducts[0];
    return { product };
  }

  if (url.includes("/store/products")) {
    return { products: mockProducts, count: mockProducts.length, limit: 100, offset: 0 };
  }

  if (url.includes("/store/carts")) {
    return {
      cart: {
        id: "mock_cart",
        items: [],
        region: mockRegions[0]
      }
    };
  }

  return null;
};
