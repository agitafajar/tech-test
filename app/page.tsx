"use client";

import { useState, useMemo } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import { FilterOptions } from "@/types/product";
import { sortProducts } from "@/utils/productUtils";

export default function Home() {
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    sortBy: "title",
    searchQuery: "",
  });

  const {
    products,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    currentPage,
    totalPages,
    totalProducts,
  } = useInfiniteProducts({
    category: filters.category !== "all" ? filters.category : undefined,
    search: filters.searchQuery || undefined,
    limit: 10, // Changed from 20 to 10 to match API default
  });

  const sortedProducts = useMemo(() => {
    return sortProducts(products, filters.sortBy);
  }, [products, filters.sortBy]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Products
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Catalog
          </h1>
          <p className="text-gray-600">
            Discover amazing products with advanced filtering and search
          </p>
        </header>

        <ProductFilters filters={filters} onFiltersChange={setFilters} />

        <div className="mb-4">
          <p className="text-gray-600">
            {isLoading && products.length === 0
              ? "Loading..."
              : `Showing ${sortedProducts.length} of ${totalProducts} products${
                  currentPage > 1
                    ? ` (Page ${currentPage} of ${totalPages})`
                    : ""
                }${hasMore ? " (scroll for more)" : ""}`}
          </p>
        </div>

        <ProductGrid
          products={sortedProducts}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
