"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useProduct } from "@/hooks/useProduct";
import { ImageCarousel } from "@/components/products/ImageCarousel";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { formatPrice, getStockStatus } from "@/utils/productUtils";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Product Not Found
          </h1>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 ">
        <Link
          href="/"
          className="inline-flex items-center bg-blue-600 px-4 py-2 rounded-md text-white mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              <ImageCarousel images={product.images} title={product.title} />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <p className="text-gray-600 text-lg">{product.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(
                          product.price / (1 - product.discountPercentage / 100)
                        )}
                      </span>
                      <Badge variant="error">
                        -{Math.round(product.discountPercentage)}% OFF
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">
                    ({product.rating.toFixed(1)})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Brand</h3>
                  <p className="text-gray-600">{product.brand}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                  <p className="text-gray-600 capitalize">{product.category}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Availability
                </h3>
                <div className="flex items-center space-x-4">
                  <Badge variant={stockStatus.variant}>
                    {stockStatus.status}
                  </Badge>
                  <span className="text-gray-600">
                    {product.stock} units available
                  </span>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
