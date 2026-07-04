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
    title: "Medusa T-Shirt",
    handle: "t-shirt",
    description: "Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.",
    thumbnail: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
    images: [
      { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png" },
      { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png" }
    ],
    status: "published",
    weight: 400,
    options: [
      { id: "opt_size", title: "Size", values: ["S", "M", "L", "XL"] }
    ],
    variants: [
      {
        id: "var_tshirt_s",
        sku: "SHIRT-S-BLACK",
        title: "S / Black",
        inventory_quantity: 10,
        options: { Size: "S" },
        calculated_price: {
          calculated_amount: 15,
          original_amount: 15,
          currency_code: "usd",
          calculated_price: { price_list_type: null }
        }
      },
      {
        id: "var_tshirt_m",
        sku: "SHIRT-M-BLACK",
        title: "M / Black",
        inventory_quantity: 10,
        options: { Size: "M" },
        calculated_price: {
          calculated_amount: 15,
          original_amount: 15,
          currency_code: "usd",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_sweatshirt",
    title: "Medusa Sweatshirt",
    handle: "sweatshirt",
    description: "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
    thumbnail: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
    images: [
      { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png" }
    ],
    status: "published",
    weight: 400,
    options: [
      { id: "opt_size", title: "Size", values: ["S", "M", "L", "XL"] }
    ],
    variants: [
      {
        id: "var_sweatshirt_s",
        sku: "SWEATSHIRT-S",
        title: "S",
        inventory_quantity: 10,
        options: { Size: "S" },
        calculated_price: {
          calculated_amount: 25,
          original_amount: 25,
          currency_code: "usd",
          calculated_price: { price_list_type: null }
        }
      }
    ]
  },
  {
    id: "prod_sweatpants",
    title: "Medusa Sweatpants",
    handle: "sweatpants",
    description: "Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.",
    thumbnail: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
    images: [
      { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png" }
    ],
    status: "published",
    weight: 400,
    options: [
      { id: "opt_size", title: "Size", values: ["S", "M", "L", "XL"] }
    ],
    variants: [
      {
        id: "var_sweatpants_s",
        sku: "SWEATPANTS-S",
        title: "S",
        inventory_quantity: 10,
        options: { Size: "S" },
        calculated_price: {
          calculated_amount: 30,
          original_amount: 30,
          currency_code: "usd",
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
