"use client";

import { useState, useEffect } from "react";
import { FilterOptions } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { useCategories } from "@/hooks/useProducts";

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const ProductFilters = ({
  filters,
  onFiltersChange,
}: ProductFiltersProps) => {
  const { categories, isLoading } = useCategories();
  const [searchInput, setSearchInput] = useState(filters.searchQuery);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, searchQuery: searchInput });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category });
  };

  const handleSortChange = (sortBy: FilterOptions["sortBy"]) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFiltersChange({
      category: "all",
      sortBy: "title",
      searchQuery: "",
    });
  };

  if (!mounted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <form onSubmit={handleSearchSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white cursor-pointer"
          />
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>

        <select
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer  focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          disabled={isLoading}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) =>
            handleSortChange(e.target.value as FilterOptions["sortBy"])
          }
          className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
        >
          <option value="title">Sort by Name</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>

        <Button
          variant="outline"
          onClick={clearFilters}
          className="cursor-pointer"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
