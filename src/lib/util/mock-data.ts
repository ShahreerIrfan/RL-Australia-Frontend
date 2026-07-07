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
    id: "prod_1",
    title: "BPC-157 5mg Vial",
    handle: "bpc-157-5mg-vial",
    description: "BPC-157 is a premium research-grade peptide pentadecane. Formulated as a freeze-dried lyophilized powder for laboratory research, providing tissue regeneration and recovery-boosting properties. Purity: 99.8%+ verified by independent HPLC.",
    thumbnail: "/assets/products/asset 6.png",
    images: [{ url: "/assets/products/asset 6.png" }],
    status: "published",
    weight: 10,
    dosage: "5mg Vial",
    purity: "99.8%+",
    molecular_weight: "1419.5 g/mol",
    molecular_formula: "C62H98N16O22",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["Single Vial", "5-Pack"] }],
    variants: [
      {
        id: "var_1_s",
        sku: "BPC157-1VIAL",
        title: "Single Vial",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "Single Vial" }],
        calculated_price: {
          calculated_amount: 49.95,
          original_amount: 64.95,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_2",
    title: "TB-500 (Thymosin Beta)",
    handle: "tb-500-5mg-vial",
    description: "TB-500 (Thymosin Beta-4) is a synthetic peptide known for promoting healing, cellular migration, and growth of new blood vessels. Formulated as a high-purity freeze-dried lyophilized powder.",
    thumbnail: "/assets/products/asset 7.png",
    images: [{ url: "/assets/products/asset 7.png" }],
    status: "published",
    weight: 10,
    dosage: "5mg Vial",
    purity: "99.5%+",
    molecular_weight: "4963.5 g/mol",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["Single Vial"] }],
    variants: [
      {
        id: "var_2_s",
        sku: "TB500-1VIAL",
        title: "Single Vial",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "Single Vial" }],
        calculated_price: {
          calculated_amount: 54.95,
          original_amount: 69.95,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_3",
    title: "GHK-Cu (Copper Peptide)",
    handle: "ghk-cu-50mg-vial",
    description: "GHK-Cu is a high-concentration copper tripeptide compound studied for its cellular renewal, skin remodeling, and anti-aging research applications.",
    thumbnail: "/assets/products/asset 10.png",
    images: [{ url: "/assets/products/asset 10.png" }],
    status: "published",
    weight: 10,
    dosage: "50mg Vial",
    purity: "99.2%+",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["Single Vial"] }],
    variants: [
      {
        id: "var_3_s",
        sku: "GHKCU-1VIAL",
        title: "Single Vial",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "Single Vial" }],
        calculated_price: {
          calculated_amount: 69.95,
          original_amount: 89.95,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_4",
    title: "CJC-1295 (No DAC)",
    handle: "cjc-1295-2mg-vial",
    description: "CJC-1295 is a synthetic analog of growth hormone-releasing hormone (GHRH) used to stimulate GH secretion in research models.",
    thumbnail: "/assets/products/asset 8.png",
    images: [{ url: "/assets/products/asset 8.png" }],
    status: "published",
    weight: 10,
    dosage: "2mg Vial",
    purity: "99.7%+",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["Single Vial"] }],
    variants: [
      {
        id: "var_4_s",
        sku: "CJC1295-1VIAL",
        title: "Single Vial",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "Single Vial" }],
        calculated_price: {
          calculated_amount: 44.95,
          original_amount: 59.95,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_5",
    title: "Semax (1%)",
    handle: "semax-1-percent",
    description: "Semax is a synthetic peptide drug developed for its neuroprotective and cognitive enhancement research applications.",
    thumbnail: "/assets/products/asset 9.png",
    images: [{ url: "/assets/products/asset 9.png" }],
    status: "published",
    dosage: "Nasal Spray · 3ml",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["Single Spray"] }],
    variants: [
      {
        id: "var_5_s",
        sku: "SEMAX-1",
        title: "Single Spray",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "Single Spray" }],
        calculated_price: {
          calculated_amount: 59.95,
          original_amount: 74.95,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_6",
    title: "Selank (0.15%)",
    handle: "selank-nasal-spray",
    description: "Selank is a synthetic heptapeptide anxiolytic drug developed for stress-reduction and general cognitive support research.",
    thumbnail: "/assets/products/asset 6.png",
    images: [{ url: "/assets/products/asset 6.png" }],
    status: "published",
    dosage: "Nasal Spray · 5ml",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["Single Spray"] }],
    variants: [
      {
        id: "var_6_s",
        sku: "SELANK-015",
        title: "Single Spray",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "Single Spray" }],
        calculated_price: {
          calculated_amount: 64.95,
          original_amount: 79.95,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_7",
    title: "Tongkat Ali",
    handle: "tongkat-ali-200mg",
    description: "Standardized Tongkat Ali extract containing bioactive eurycomanone for general performance and hormone optimization research.",
    thumbnail: "/assets/products/asset 7.png",
    images: [{ url: "/assets/products/asset 7.png" }],
    status: "published",
    dosage: "200:1 Extract · 60 Capsules",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["60 Capsules"] }],
    variants: [
      {
        id: "var_7_s",
        sku: "TONGKAT-200",
        title: "60 Capsules",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "60 Capsules" }],
        calculated_price: {
          calculated_amount: 29.99,
          original_amount: 39.99,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_8",
    title: "Ashwagandha KSM-66",
    handle: "ashwagandha-ksm66",
    description: "Highly bioavailable standardized KSM-66 Ashwagandha root extract for stress mitigation and cognitive health research.",
    thumbnail: "/assets/products/asset 8.png",
    images: [{ url: "/assets/products/asset 8.png" }],
    status: "published",
    dosage: "600mg · 90 Capsules",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["90 Capsules"] }],
    variants: [
      {
        id: "var_8_s",
        sku: "ASHWA-KSM",
        title: "90 Capsules",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "90 Capsules" }],
        calculated_price: {
          calculated_amount: 24.99,
          original_amount: 34.99,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_9",
    title: "Protein + Creatine Gummies",
    handle: "protein-creatine-gummies",
    description: "Convenient and delicious gummies combining high-purity micronized Creatine Monohydrate with protein building blocks.",
    thumbnail: "/assets/products/asset 6.png",
    images: [{ url: "/assets/products/asset 6.png" }],
    status: "published",
    dosage: "30 Gummies",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["30 Gummies"] }],
    variants: [
      {
        id: "var_9_s",
        sku: "GUMMY-PC",
        title: "30 Gummies",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "30 Gummies" }],
        calculated_price: {
          calculated_amount: 16.99,
          original_amount: 19.99,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_10",
    title: "CoQ10",
    handle: "coq10",
    description: "Coenzyme Q10 softgels designed to support cellular energy production, cardiovascular function, and antioxidant status.",
    thumbnail: "/assets/products/asset 7.png",
    images: [{ url: "/assets/products/asset 7.png" }],
    status: "published",
    dosage: "60 Softgels · 100mg",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["60 Softgels"] }],
    variants: [
      {
        id: "var_10_s",
        sku: "COQ10-100",
        title: "60 Softgels",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "60 Softgels" }],
        calculated_price: {
          calculated_amount: 18.99,
          original_amount: 23.99,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_11",
    title: "Beef Liver Pills",
    handle: "beef-liver-pills",
    description: "100% pasture-raised, grass-fed beef liver capsules rich in micronutrients, iron, Vitamin A, and B-vitamins.",
    thumbnail: "/assets/products/asset 8.png",
    images: [{ url: "/assets/products/asset 8.png" }],
    status: "published",
    dosage: "120 Capsules",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["120 Capsules"] }],
    variants: [
      {
        id: "var_11_s",
        sku: "BEEFLIVER",
        title: "120 Capsules",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "120 Capsules" }],
        calculated_price: {
          calculated_amount: 19.99,
          original_amount: 24.99,
          currency_code: "aud",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_12",
    title: "L. Reuteri (Probiotic)",
    handle: "l-reuteri",
    description: "Standardized Lactobacillus Reuteri probiotic capsules studied for gastrointestinal health and gut microbiome optimization.",
    thumbnail: "/assets/products/asset 9.png",
    images: [{ url: "/assets/products/asset 9.png" }],
    status: "published",
    dosage: "30 Capsules",
    options: [{ id: "opt_pack", title: "Pack Size", values: ["30 Capsules"] }],
    variants: [
      {
        id: "var_12_s",
        sku: "REUTERI-30",
        title: "30 Capsules",
        inventory_quantity: 100,
        options: [{ option_id: "opt_pack", value: "30 Capsules" }],
        calculated_price: {
          calculated_amount: 20.99,
          original_amount: 25.99,
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
