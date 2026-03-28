export const queryKeys = {
  // User
  users: { current: ["user"] as const },

  // Products
  products: {
    all: ["products"] as const,
    list: (filters?: { page?: number; search?: string; limit?: number }) =>
      ["products", "list", filters] as const,
    detail: (slug: string) => ["products", "details", slug] as const,
    featured: ["products", "list", "featured"] as const,
  },

  categories: {
    all: ["categories"] as const,
    list: (filters?: { page?: number; search?: string }) =>
      ["categories", filters] as const,
    detail: (slug: string) => ["categories", slug] as const,
  },

  variationKinds: {
    all: ["variationKinds"] as const,
    list: (filters?: { page?: number }) => ["variationKinds", filters] as const,
    detail: (id: string | number) => ["variationKinds", id] as const,
  },

  variationOptions: {
    all: ["variationOptions"] as const,
  },

  productVariations: {
    all: ["productVariations"] as const,
  },

  wishlist: {
    all: ["wishlist"] as const,
    paginated: (page: number) => ["wishlist", page] as const,
    limited: (maxResults: number) =>
      ["wishlist", { max_results: maxResults }] as const,
  },

  admin: {
    statistics: ["adminStatistics"] as const,
  },
};
