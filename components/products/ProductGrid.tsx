import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useEffect } from "react";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  currentPage?: number;
}

export const ProductGrid = ({
  products,
  isLoading,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  currentPage = 1,
}: ProductGridProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "260px",
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, isLoadingMore, onLoadMore]);

  if (isLoading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={targetRef} className="flex justify-center py-8">
          {isLoadingMore ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner />
              <span className="text-gray-600">
                Loading more products... (Page {currentPage + 1})
              </span>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              Scroll down for more products
            </div>
          )}
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Youve reached the end! ({products.length} products loaded across{" "}
            {currentPage} pages)
          </p>
        </div>
      )}
    </div>
  );
};
