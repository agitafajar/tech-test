import { Product, FilterOptions } from '@/types/product';

export const sortProducts = (products: Product[], sortBy: FilterOptions['sortBy']): Product[] => {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'rating':
      return sortedProducts.sort((a, b) => b.rating - a.rating);
    case 'title':
    default:
      return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  }
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const calculateDiscountedPrice = (price: number, discountPercentage: number): number => {
  return price * (1 - discountPercentage / 100);
};

export const getStockStatus = (stock: number): { status: string; variant: 'success' | 'warning' | 'error' } => {
  if (stock === 0) {
    return { status: 'Out of Stock', variant: 'error' };
  } else if (stock <= 10) {
    return { status: 'Low Stock', variant: 'warning' };
  } else {
    return { status: 'In Stock', variant: 'success' };
  }
};

export const formatCategoryName = (category: unknown): string => {
  if (typeof category !== 'string') {
    return String(category);
  }
  
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};