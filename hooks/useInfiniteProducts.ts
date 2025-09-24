import { useState, useEffect, useCallback } from "react";
import { productApi } from "@/lib/api";
import { Product } from "@/types/product";

interface UseInfiniteProductsParams {
  category?: string;
  search?: string;
  limit?: number;
}

export const useInfiniteProducts = (params: UseInfiniteProductsParams = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const limit = params.limit || 10; // Changed from 20 to 10 to match API default

  const fetchProducts = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        setError(null);

        const pageToFetch = reset ? 1 : currentPage + 1;
        const skip = (pageToFetch - 1) * limit;

        const response = await productApi.getProducts({
          ...params,
          limit,
          skip,
        });

        if (reset) {
          setProducts(response.products);
          setCurrentPage(1);
          setTotalProducts(response.total);
        } else {
          // Append new products to existing ones
          setProducts((prev) => [...prev, ...response.products]);
          setCurrentPage(pageToFetch);
          setTotalProducts(response.total);
        }

        // Check if there are more products to load
        // More accurate calculation: check if we've loaded all products
        const totalLoadedProducts = reset ? response.products.length : products.length + response.products.length;
        setHasMore(totalLoadedProducts < response.total);
        
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [params.category, params.search, limit, currentPage, products.length]
  );

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchProducts(false);
    }
  }, [fetchProducts, isLoadingMore, hasMore]);

  const refresh = useCallback(() => {
    setCurrentPage(1);
    setTotalProducts(0);
    fetchProducts(true);
  }, [fetchProducts]);

  useEffect(() => {
    refresh();
  }, [params.category, params.search]);

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    currentPage,
    totalProducts,
    totalPages,
  };
};