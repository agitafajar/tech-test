import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);

  const getAvailabilityVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return "success";
      case "low stock":
        return "warning";
      case "out of stock":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative aspect-square">
          {!imageError ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image not available</span>
            </div>
          )}
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              -{Math.round(product.discountPercentage)}%
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  $
                  {(
                    product.price /
                    (1 - product.discountPercentage / 100)
                  ).toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant={getAvailabilityVariant(product.availabilityStatus)}>
              {product.availabilityStatus}
            </Badge>
            <span className="text-sm text-gray-500">{product.brand}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
