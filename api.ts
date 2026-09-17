const API_URL = "/api/proxy";

const getLocal = (key: string, def: any) => {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
  } catch (e) {}
  return def;
};

const setLocal = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

const defaultSettings = {
  TickerEnabled: "true",
  TickerMessages: "Welcome to Rangdhanu! Free shipping over 2000 BDT.",
  TickerBgColor: "#000000",
  TickerTextColor: "#ffffff",
  HeroEnabled: "true",
  HeroDesktopUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
  HeroHeading: "Rangdhanu Exclusive",
  HeroSubheading: "Discover the latest trends",
  DeliveryEnabled: "true",
  DeliveryInsideDhaka: "60",
  DeliveryOutsideDhaka: "120"
};

const defaultProducts = [
  { productId: "p1", name: "Elegant Summer Dress", categoryId: "Women", price: 1500, oldPrice: 2000, discount: 25, stock: 10, images: '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400"]', description: "A beautiful summer dress perfect for casual outings.", active: true, newArrival: true, popular: true },
  { productId: "p2", name: "Classic White Sneakers", categoryId: "Men", price: 2000, stock: 50, images: '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"]', description: "Comfortable daily wear sneakers with premium grip.", active: true, popular: true },
  { productId: "p3", name: "Vintage Leather Jacket", categoryId: "Men", price: 4500, oldPrice: 5000, discount: 10, stock: 5, images: '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"]', description: "Classic vintage leather jacket for a bold look.", active: true, newArrival: false },
  { productId: "p4", name: "Floral Maxi Skirt", categoryId: "Women", price: 1200, stock: 15, images: '["https://images.unsplash.com/photo-1583496920915-d91abf07eb78?w=400"]', description: "Breathable and stylish floral skirt.", active: true, popular: true },
  { productId: "p5", name: "Minimalist Wrist Watch", categoryId: "Accessories", price: 2500, oldPrice: 3500, discount: 28, stock: 20, images: '["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400"]', description: "Sleek, minimalist design suitable for any occasion.", active: true, newArrival: true },
  { productId: "p6", name: "Polarized Sunglasses", categoryId: "Accessories", price: 800, stock: 30, images: '["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400"]', description: "UV protection sunglasses for everyday travel.", active: true, popular: true }
];

async function fetchWithFallback(url: string, options: any, fallbackKey: string, defaultData: any, isPost = false) {
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    if (res.ok && !data.error) {
      if (!isPost) setLocal(fallbackKey, data); // Cache successful GET
      return data;
    }
    console.warn("API returned error, using fallback.");
  } catch (e) {
    console.warn("API fetch failed, using fallback.");
  }
  
  if (isPost) return { success: true, fallback: true };
  return getLocal(fallbackKey, defaultData);
}

export const api = {
  getProducts: () => fetchWithFallback(`${API_URL}?action=getProducts`, undefined, "rangdhanu_products", defaultProducts),
  getSiteSettings: () => fetchWithFallback(`${API_URL}?action=getSiteSettings`, undefined, "rangdhanu_settings", defaultSettings),
  getOffers: () => fetchWithFallback(`${API_URL}?action=getOffers`, undefined, "rangdhanu_offers", []),
  getDeliveryCharges: () => fetchWithFallback(`${API_URL}?action=getDeliveryCharges`, undefined, "rangdhanu_delivery", []),
  getOrders: () => fetchWithFallback(`${API_URL}?action=getOrders`, undefined, "rangdhanu_orders", []),
  
  createOrder: async (order: any) => {
    const res = await fetchWithFallback(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "createOrder", order })
    }, "rangdhanu_orders", [], true);
    
    if (res.fallback) {
      const orders = getLocal("rangdhanu_orders", []);
      orders.push(order);
      setLocal("rangdhanu_orders", orders);
    }
    return res;
  },
  
  createProduct: async (product: any) => {
    const res = await fetchWithFallback(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "createProduct", product })
    }, "rangdhanu_products", [], true);
    if (res.fallback) {
      const prods = getLocal("rangdhanu_products", defaultProducts);
      prods.push(product);
      setLocal("rangdhanu_products", prods);
    }
    return res;
  },

  updateProduct: async (product: any) => {
    const res = await fetchWithFallback(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateProduct", product })
    }, "rangdhanu_products", [], true);
    if (res.fallback) {
      let prods = getLocal("rangdhanu_products", defaultProducts);
      const idx = prods.findIndex((p:any) => p.productId === product.productId);
      if (idx >= 0) prods[idx] = product;
      else prods.push(product);
      setLocal("rangdhanu_products", prods);
    }
    return res;
  },

  deleteProduct: async (productId: string) => {
    const res = await fetchWithFallback(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteProduct", productId })
    }, "rangdhanu_products", [], true);
    if (res.fallback) {
      const prods = getLocal("rangdhanu_products", defaultProducts);
      setLocal("rangdhanu_products", prods.filter((p:any) => p.productId !== productId));
    }
    return res;
  },

  updateSiteSettings: async (settings: any) => {
    const res = await fetchWithFallback(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateSiteSettings", settings })
    }, "rangdhanu_settings", {}, true);
    if (res.fallback) setLocal("rangdhanu_settings", settings);
    return res;
  },
  
  saveOffer: async (offer: any) => {
    const res = await fetchWithFallback(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "saveOffer", offer })
    }, "rangdhanu_offers", [], true);
    if (res.fallback) {
      let offers = getLocal("rangdhanu_offers", []);
      const idx = offers.findIndex((o:any) => o.OfferID === offer.OfferID);
      if (idx >= 0) offers[idx] = offer;
      else offers.push(offer);
      setLocal("rangdhanu_offers", offers);
    }
    return res;
  },

  deleteOffer: async (offerId: string) => {
    const res = await fetchWithFallback(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteOffer", offerId })
    }, "rangdhanu_offers", [], true);
    if (res.fallback) {
      const offers = getLocal("rangdhanu_offers", []);
      setLocal("rangdhanu_offers", offers.filter((o:any) => o.OfferID !== offerId));
    }
    return res;
  },

  uploadImage: async (base64: string, filename?: string) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "uploadImage", base64, filename })
      });
      const data = await res.json();
      if (res.ok && !data.error) return data;
      console.warn("Drive upload failed", data.error);
    } catch(e) {}
    // Fallback: return data URI directly for local preview
    return { success: true, fileUrl: base64, fallback: true };
  }
};
