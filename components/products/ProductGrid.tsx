import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
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
  const { targetRef, shouldLoadMore } = useScrollTrigger({
    threshold: 300, // Trigger when 300px from bottom
  });

  useEffect(() => {
    if (
      shouldLoadMore &&
      hasMore &&
      !isLoadingMore &&
      onLoadMore &&
      products.length > 0
    ) {
      onLoadMore();
    }
  }, [shouldLoadMore, hasMore, isLoadingMore, onLoadMore, products.length]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Scroll trigger element */}
      {hasMore && (
        <div
          ref={targetRef}
          className="flex justify-center py-8 min-h-[200px] "
          style={{
            minHeight: "200px",
          }}
        >
          {isLoadingMore ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner />
              <span className="text-gray-600">
                Loading more products... (Page {currentPage + 1})
              </span>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-2">
                Scroll down for more products
              </div>
              <div className="text-xs text-blue-500">
                SCROLL TRIGGER - Will load when 300px from viewport bottom
              </div>
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
