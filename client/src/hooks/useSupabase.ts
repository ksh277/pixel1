import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import * as supabaseApi from '../lib/supabaseApi'

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
    queryFn: () => supabaseApi.fetchProducts(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => supabaseApi.fetchProductById(id),
    enabled: !!id,
  })
}

// Categories hooks
export const useCategories = (options?: {
  parentId?: string
  active?: boolean
}) => {
  return useQuery({
    queryKey: ['categories', options],
    queryFn: () => supabaseApi.fetchCategories(options),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => supabaseApi.fetchCategoryById(id),
    enabled: !!id,
  })
}

// Orders hooks
export const useOrders = (options?: {
  userId?: string
  status?: string
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: ['orders', options],
    queryFn: () => supabaseApi.fetchOrders(options),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => supabaseApi.fetchOrderById(id),
    enabled: !!id,
  })
}

// Reviews hooks
export const useReviews = (options?: {
  productId?: string
  userId?: string
  featured?: boolean
  minRating?: number
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: ['reviews', options],
    queryFn: () => supabaseApi.fetchReviews(options),
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}

// Community hooks
export const useCommunityPosts = (options?: {
  category?: string
  featured?: boolean
  userId?: string
  limit?: number
  offset?: number
}) => {
  return useQuery({
    queryKey: ['community', options],
    queryFn: () => supabaseApi.fetchCommunityPosts(options),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Events hooks
export const useEvents = (options?: {
  active?: boolean
  eventType?: string
  limit?: number
}) => {
  return useQuery({
    queryKey: ['events', options],
    queryFn: () => supabaseApi.fetchEvents(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Templates hooks
export const useTemplates = (options?: {
  category?: string
  featured?: boolean
  limit?: number
}) => {
  return useQuery({
    queryKey: ['templates', options],
    queryFn: () => supabaseApi.fetchTemplates(options),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Additional Services hooks
export const useAdditionalServices = (options?: {
  serviceType?: string
  active?: boolean
}) => {
  return useQuery({
    queryKey: ['additional-services', options],
    queryFn: () => supabaseApi.fetchAdditionalServices(options),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Wishlist hooks
export const useWishlist = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => supabaseApi.fetchWishlist(user!.id),
    enabled: !!user?.id,
  })
}

export const useAddToWishlist = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (productId: string) => supabaseApi.addToWishlist(user!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] })
    },
  })
}

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (productId: string) => supabaseApi.removeFromWishlist(user!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] })
    },
  })
}

// Cart hooks
export const useCart = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['cart', user?.id],
    queryFn: () => supabaseApi.fetchCart(user!.id),
    enabled: !!user?.id,
  })
}

export const useAddToCart = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ 
      productId, 
      quantity, 
      customizationOptions 
    }: { 
      productId: string
      quantity: number
      customizationOptions?: any 
    }) => supabaseApi.addToCart(user!.id, productId, quantity, customizationOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    },
  })
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ 
      cartItemId, 
      quantity, 
      customizationOptions 
    }: { 
      cartItemId: string
      quantity: number
      customizationOptions?: any 
    }) => supabaseApi.updateCartItem(cartItemId, quantity, customizationOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    },
  })
}

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (cartItemId: string) => supabaseApi.removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] })
    },
  })
}

// Statistics hooks
export const useStatistics = () => {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => supabaseApi.fetchStatistics(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Search hooks
export const useSearchProducts = (query: string, options?: {
  categoryId?: string
  limit?: number
}) => {
  return useQuery({
    queryKey: ['search', query, options],
    queryFn: () => supabaseApi.searchProducts(query, options),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Real-time hooks
export const useRealtimeProducts = (callback: (payload: any) => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      const subscription = supabaseApi.subscribeToProducts((payload) => {
        callback(payload)
        queryClient.invalidateQueries({ queryKey: ['products'] })
      })
      return subscription
    },
  })
}

export const useRealtimeOrders = (callback: (payload: any) => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      const subscription = supabaseApi.subscribeToOrders((payload) => {
        callback(payload)
        queryClient.invalidateQueries({ queryKey: ['orders'] })
      })
      return subscription
    },
  })
}

export const useRealtimeReviews = (callback: (payload: any) => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      const subscription = supabaseApi.subscribeToReviews((payload) => {
        callback(payload)
        queryClient.invalidateQueries({ queryKey: ['reviews'] })
      })
      return subscription
    },
  })
}