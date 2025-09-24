import axios from "axios";
import { Product, ProductsResponse, Category } from "@/types/product";

const API_BASE_URL = "https://dummyjson.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const productApi = {
  // Get all products with optional filtering
  getProducts: async (params?: {
    limit?: number;
    skip?: number;
    page?: number;
    category?: string;
    search?: string;
  }): Promise<ProductsResponse> => {
    let url = "/products";

    // Calculate skip from page if page is provided
    let skip = params?.skip || 0;
    if (params?.page && params?.limit) {
      skip = (params.page - 1) * params.limit;
    }

    if (params?.category && params.category !== "all") {
      url = `/products/category/${params.category}`;
    } else if (params?.search) {
      url = `/products/search?q=${params.search}`;
    }

    const response = await api.get<ProductsResponse>(url, {
      params: {
        limit: params?.limit || 10,
        skip: skip,
      },
    });

    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Get all categories - now returns Category objects
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/products/categories");
    return response.data;
  },
};
