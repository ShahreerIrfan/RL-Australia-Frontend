export const mockRegions = [
  {
    id: "reg_us",
    name: "North America",
    currency_code: "usd",
    countries: [{ iso_2: "us" }]
  },
  {
    id: "reg_au",
    name: "Australia",
    currency_code: "aud",
    countries: [{ iso_2: "au" }]
  }
];

export const mockCollections = [
  {
    id: "col_peptides",
    title: "Peptides",
    handle: "peptides",
    products: []
  }
];

export const mockCategories = [
  {
    id: "cat_peptides",
    name: "Peptides",
    handle: "peptides",
    category_children: []
  },
  {
    id: "cat_nootropics",
    name: "Nootropics",
    handle: "nootropics",
    category_children: []
  },
  {
    id: "cat_supplements",
    name: "Supplements",
    handle: "supplements",
    category_children: []
  },
  {
    id: "cat_gummies",
    name: "Gummies",
    handle: "gummies",
    category_children: []
  },
  {
    id: "cat_addons",
    name: "Add-ons",
    handle: "add-ons",
    category_children: []
  }
];

export const mockProducts = [
  {
    id: "prod_1",
    title: "BPC-157",
    handle: "bpc-157-5mg-vial",
    description: "BPC-157 (Body Protection Compound-157) is a pentadecapeptide composed of 15 amino acids. Research shows it promotes accelerated tissue healing.",
    thumbnail: "/assets/products/bpc-157.png",
    images: [{ url: "/assets/products/bpc-157.png" }],
    status: "published",
    dosage: "5mg Vial",
    categories: [{ id: "cat_peptides", name: "Peptides", handle: "peptides" }],
    variants: [
      {
        id: "var_1",
        sku: "BPC157-5MG",
        title: "Single Vial",
        calculated_price: {
          calculated_amount: 49.95,
          original_amount: 64.95,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$49.95",
          original_price: "$64.95"
        }
      }
    ]
  },
  {
    id: "prod_2",
    title: "TB-500 (Thymosin Beta)",
    handle: "tb-500-5mg-vial",
    description: "TB-500 is a synthetic version of the active region of thymosin beta-4. It promotes wound healing and muscle recovery.",
    thumbnail: "/assets/products/asset 7.png",
    images: [{ url: "/assets/products/asset 7.png" }],
    status: "published",
    dosage: "5mg Vial",
    categories: [{ id: "cat_peptides", name: "Peptides", handle: "peptides" }],
    variants: [
      {
        id: "var_2",
        sku: "TB500-5MG",
        title: "Single Vial",
        calculated_price: {
          calculated_amount: 54.95,
          original_amount: 69.95,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$54.95",
          original_price: "$69.95"
        }
      }
    ]
  },
  {
    id: "prod_3",
    title: "GHK-Cu (Copper Peptide)",
    handle: "ghk-cu-50mg-vial",
    description: "GHK-Cu is a copper-binding tripeptide naturally occurring in human plasma. It encourages collagen synthesis and skin elasticity.",
    thumbnail: "/assets/products/asset 10.png",
    images: [{ url: "/assets/products/asset 10.png" }],
    status: "published",
    dosage: "50mg Vial",
    categories: [{ id: "cat_peptides", name: "Peptides", handle: "peptides" }],
    variants: [
      {
        id: "var_3",
        sku: "GHKCU-50MG",
        title: "Single Vial",
        calculated_price: {
          calculated_amount: 69.95,
          original_amount: 89.95,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$69.95",
          original_price: "$89.95"
        }
      }
    ]
  },
  {
    id: "prod_4",
    title: "CJC-1295 (No DAC)",
    handle: "cjc-1295-2mg-vial",
    description: "CJC-1295 without DAC is a synthetic growth hormone releasing hormone analog that stimulates growth hormone secretion.",
    thumbnail: "/assets/products/asset 8.png",
    images: [{ url: "/assets/products/asset 8.png" }],
    status: "published",
    dosage: "2mg Vial",
    categories: [{ id: "cat_peptides", name: "Peptides", handle: "peptides" }],
    variants: [
      {
        id: "var_4",
        sku: "CJC1295-2MG",
        title: "Single Vial",
        calculated_price: {
          calculated_amount: 44.95,
          original_amount: 59.95,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$44.95",
          original_price: "$59.95"
        }
      }
    ]
  },
  {
    id: "prod_5",
    title: "Semax (1%)",
    handle: "semax-1-percent",
    description: "Semax is a synthetic peptide nasal spray developed for mental clarity and neuroprotection.",
    thumbnail: "/assets/products/asset 9.png",
    images: [{ url: "/assets/products/asset 9.png" }],
    status: "published",
    dosage: "Nasal Spray · 3ml",
    categories: [{ id: "cat_nootropics", name: "Nootropics", handle: "nootropics" }],
    variants: [
      {
        id: "var_5",
        sku: "SEMAX-1PCT",
        title: "Single Spray",
        calculated_price: {
          calculated_amount: 59.95,
          original_amount: 74.95,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$59.95",
          original_price: "$74.95"
        }
      }
    ]
  },
  {
    id: "prod_6",
    title: "Selank (0.15%)",
    handle: "selank-nasal-spray",
    description: "Selank is a synthetic heptapeptide nasal spray for anxiety reduction and emotional balance.",
    thumbnail: "/assets/products/asset 6.png",
    images: [{ url: "/assets/products/asset 6.png" }],
    status: "published",
    dosage: "Nasal Spray · 5ml",
    categories: [{ id: "cat_nootropics", name: "Nootropics", handle: "nootropics" }],
    variants: [
      {
        id: "var_6",
        sku: "SELANK-015",
        title: "Single Spray",
        calculated_price: {
          calculated_amount: 64.95,
          original_amount: 79.95,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$64.95",
          original_price: "$79.95"
        }
      }
    ]
  },
  {
    id: "prod_7",
    title: "Tongkat Ali",
    handle: "tongkat-ali-200mg",
    description: "Highly concentrated 200:1 Tongkat Ali root extract to support energy and vitality.",
    thumbnail: "/assets/products/asset 7.png",
    images: [{ url: "/assets/products/asset 7.png" }],
    status: "published",
    dosage: "200:1 Extract · 60 Capsules",
    categories: [{ id: "cat_supplements", name: "Supplements", handle: "supplements" }],
    variants: [
      {
        id: "var_7",
        sku: "TONGKAT-200MG",
        title: "60 Capsules",
        calculated_price: {
          calculated_amount: 29.99,
          original_amount: 39.99,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$29.99",
          original_price: "$39.99"
        }
      }
    ]
  },
  {
    id: "prod_8",
    title: "Ashwagandha KSM-66",
    handle: "ashwagandha-ksm66",
    description: "Organic KSM-66 full-spectrum root extract for stress relief and cortisol support.",
    thumbnail: "/assets/products/asset 8.png",
    images: [{ url: "/assets/products/asset 8.png" }],
    status: "published",
    dosage: "600mg · 90 Capsules",
    categories: [{ id: "cat_supplements", name: "Supplements", handle: "supplements" }],
    variants: [
      {
        id: "var_8",
        sku: "ASHWA-KSM66",
        title: "90 Capsules",
        calculated_price: {
          calculated_amount: 24.99,
          original_amount: 34.99,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$24.99",
          original_price: "$34.99"
        }
      }
    ]
  },
  {
    id: "prod_9",
    title: "Protein + Creatine Gummies",
    handle: "protein-creatine-gummies",
    description: "Convenient workout gummies delivering premium creatine monohydrate and whey protein.",
    thumbnail: "/assets/products/asset 6.png",
    images: [{ url: "/assets/products/asset 6.png" }],
    status: "published",
    dosage: "30 Gummies",
    categories: [{ id: "cat_gummies", name: "Gummies", handle: "gummies" }],
    variants: [
      {
        id: "var_9",
        sku: "PROCRE-GUM",
        title: "30 Gummies",
        calculated_price: {
          calculated_amount: 16.99,
          original_amount: 19.99,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$16.99",
          original_price: "$19.99"
        }
      }
    ]
  },
  {
    id: "prod_10",
    title: "CoQ10",
    handle: "coq10",
    description: "High-absorption coenzyme Q10 softgels for cellular energy and cardiovascular health.",
    thumbnail: "/assets/products/asset 7.png",
    images: [{ url: "/assets/products/asset 7.png" }],
    status: "published",
    dosage: "60 Softgels · 100mg",
    categories: [{ id: "cat_supplements", name: "Supplements", handle: "supplements" }],
    variants: [
      {
        id: "var_10",
        sku: "COQ10-100MG",
        title: "60 Softgels",
        calculated_price: {
          calculated_amount: 18.99,
          original_amount: 23.99,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$18.99",
          original_price: "$23.99"
        }
      }
    ]
  },
  {
    id: "prod_11",
    title: "Beef Liver Pills",
    handle: "beef-liver-pills",
    description: "Desiccated grass-fed beef liver capsules rich in organic iron and Vitamin A.",
    thumbnail: "/assets/products/asset 8.png",
    images: [{ url: "/assets/products/asset 8.png" }],
    status: "published",
    dosage: "120 Capsules",
    categories: [{ id: "cat_addons", name: "Add-ons", handle: "add-ons" }],
    variants: [
      {
        id: "var_11",
        sku: "BEEFLIVER-120",
        title: "120 Capsules",
        calculated_price: {
          calculated_amount: 19.99,
          original_amount: 24.99,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$19.99",
          original_price: "$24.99"
        }
      }
    ]
  },
  {
    id: "prod_12",
    title: "L. Reuteri (Probiotic)",
    handle: "l-reuteri",
    description: "L. reuteri probiotic capsules to promote gut health and microbiome balance.",
    thumbnail: "/assets/products/asset 9.png",
    images: [{ url: "/assets/products/asset 9.png" }],
    status: "published",
    dosage: "30 Capsules",
    categories: [{ id: "cat_supplements", name: "Supplements", handle: "supplements" }],
    variants: [
      {
        id: "var_12",
        sku: "LREUTERI-PROB",
        title: "30 Capsules",
        calculated_price: {
          calculated_amount: 20.99,
          original_amount: 25.99,
          currency_code: "aud",
          price_type: "sale",
          calculated_price: "$20.99",
          original_price: "$25.99"
        }
      }
    ]
  }
];

export const getMockResponse = (input: string, init?: any): any => {
  const url = String(input);
  
  if (url.includes("/store/regions/")) {
    const parts = url.split("/");
    let id = parts[parts.length - 1];
    if (id.includes("?")) {
      id = id.split("?")[0];
    }
    const region = mockRegions.find(r => r.id === id) || mockRegions[0];
    return { region };
  }
  
  if (url.includes("/store/regions")) {
    return { regions: mockRegions };
  }

  if (url.includes("/store/collections/")) {
    const parts = url.split("/");
    let id = parts[parts.length - 1];
    if (id.includes("?")) {
      id = id.split("?")[0];
    }
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
    let id = parts[parts.length - 1];
    if (id.includes("?")) {
      id = id.split("?")[0];
    }
    let handle: string | null = null;
    try {
      const parsedUrl = new URL(url, "http://localhost");
      handle = parsedUrl.searchParams.get("handle");
    } catch {}
    const product = mockProducts.find(p => p.id === id || p.handle === id || (handle && p.handle === handle)) || mockProducts[0];
    return { product };
  }

  if (url.includes("/store/products")) {
    // Check if there is a handle parameter in the URL or query object
    let handle: string | null = null;
    try {
      const parsedUrl = new URL(url, "http://localhost");
      handle = parsedUrl.searchParams.get("handle");
    } catch {}

    if (!handle && init?.query?.handle) {
      handle = init.query.handle;
    }

    if (handle) {
      const product = mockProducts.find(p => p.handle === handle) || mockProducts[0];
      return { products: [product], count: 1, limit: 1, offset: 0 };
    }

    // Check if there is a category_id parameter
    let categoryId: string | null = null;
    try {
      const parsedUrl = new URL(url, "http://localhost");
      categoryId = parsedUrl.searchParams.get("category_id");
    } catch {}

    if (!categoryId && init?.query?.category_id) {
      const queryCatId = init.query.category_id;
      categoryId = Array.isArray(queryCatId) ? queryCatId[0] : queryCatId;
    }

    // Check if there is an id parameter
    let id: string | null = null;
    try {
      const parsedUrl = new URL(url, "http://localhost");
      id = parsedUrl.searchParams.get("id");
    } catch {}

    if (!id && init?.query?.id) {
      const queryId = init.query.id;
      id = Array.isArray(queryId) ? queryId[0] : queryId;
    }

    if (id) {
      const product = mockProducts.find(p => p.id === id) || mockProducts[0];
      return { products: [product], count: 1, limit: 1, offset: 0 };
    }

    let productsToReturn = mockProducts;
    if (categoryId) {
      const matchedCat = mockCategories.find(c => c.id === categoryId);
      const catHandle = matchedCat?.handle || categoryId;
      productsToReturn = mockProducts.filter(p => p.categories?.some(c => c.id === categoryId || c.handle === catHandle));
    }

    return { products: productsToReturn, count: productsToReturn.length, limit: 100, offset: 0 };
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
