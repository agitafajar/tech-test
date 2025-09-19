"use client";

import { useState, useMemo } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { FilterOptions } from "@/types/product";
import { sortProducts } from "@/utils/productUtils";

export default function Home() {
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    sortBy: "title",
    searchQuery: "",
  });

  const { products, isLoading, error } = useProducts({
    category: filters.category !== "all" ? filters.category : undefined,
    search: filters.searchQuery || undefined,
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
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Product Store
          </h1>
          <p className="text-gray-600">
            Discover amazing products with optimized performance
          </p>
        </header>

        <ProductFilters filters={filters} onFiltersChange={setFilters} />

        <div className="mb-4">
          <p className="text-gray-600">
            {isLoading
              ? "Loading..."
              : `Showing ${sortedProducts.length} products`}
          </p>
        </div>

        <ProductGrid products={sortedProducts} isLoading={isLoading} />
      </div>
    </div>
  );
}
