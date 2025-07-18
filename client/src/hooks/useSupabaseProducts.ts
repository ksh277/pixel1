import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProducts, fetchProduct, fetchProductsByCategory, fetchFeaturedProducts } from '@/lib/supabaseApi'

// Products hooks
export const useProducts = (options?: {
  categoryId?: string
  featured?: boolean
  available?: boolean
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: () => fetchProducts(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => fetchProductsByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => fetchFeaturedProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => fetchCategory(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Import the functions we need
import { fetchCategories, fetchCategory } from '@/lib/supabaseApi'