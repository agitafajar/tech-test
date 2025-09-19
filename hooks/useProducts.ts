import useSWR from 'swr';
import { productApi } from '@/lib/api';
import { ProductsResponse, Category } from '@/types/product';

interface UseProductsParams {
  category?: string;
  search?: string;
  limit?: number;
  skip?: number;
}

export const useProducts = (params: UseProductsParams = {}) => {
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    ['products', params],
    () => productApi.getProducts(params),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    products: data?.products || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  };
};

export const useCategories = () => {
  const { data, error, isLoading } = useSWR<Category[]>(
    'categories',
    productApi.getCategories,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
    }
  );

  return {
    categories: data || [],
    isLoading,
    error,
  };
};