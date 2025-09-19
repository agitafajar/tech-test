import useSWR from 'swr';
import { productApi } from '@/lib/api';
import { Product } from '@/types/product';

export const useProduct = (id: string) => {
  const { data, error, isLoading } = useSWR<Product>(
    id ? ['product', id] : null,
    () => productApi.getProduct(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
    }
  );

  return {
    product: data,
    isLoading,
    error,
  };
};