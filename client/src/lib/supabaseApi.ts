import { supabase } from './supabase'
import type { 
  Product, 
  Category, 
  User, 
  Order, 
  OrderItem, 
  Review, 
  Community, 
  Event, 
  Template, 
  AdditionalService, 
  Wishlist, 
  Cart 
} from './supabase'

// Products API
export const fetchProducts = async (options?: {
  categoryId?: string
  featured?: boolean
  available?: boolean
  limit?: number
  offset?: number
}) => {
  let query = supabase.from('products').select(`
    *,
    categories(name, name_ko),
    reviews(rating, id)
  `)

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }
  
  if (options?.featured !== undefined) {
    query = query.eq('is_featured', options.featured)
  }
  
  if (options?.available !== undefined) {
    query = query.eq('is_available', options.available)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    throw error
  }

  return data
}

export const fetchProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name, name_ko),
      reviews(*, users(username, avatar_url))
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    throw error
  }

  return data
}

// Categories API
export const fetchCategories = async (options?: {
  parentId?: string
  active?: boolean
}) => {
  let query = supabase.from('categories').select('*')

  if (options?.parentId) {
    query = query.eq('parent_id', options.parentId)
  }

  if (options?.active !== undefined) {
    query = query.eq('is_active', options.active)
  }

  query = query.order('sort_order', { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }

  return data
}

export const fetchCategoryById = async (id: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    throw error
  }

  return data
}

// Users API
export const fetchUsers = async (options?: {
  adminOnly?: boolean
  membershipTier?: string
  limit?: number
}) => {
  let query = supabase.from('users').select('*')

  if (options?.adminOnly) {
    query = query.eq('is_admin', true)
  }

  if (options?.membershipTier) {
    query = query.eq('membership_tier', options.membershipTier)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching users:', error)
    throw error
  }

  return data
}

export const fetchUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    throw error
  }

  return data
}

// Orders API
export const fetchOrders = async (options?: {
  userId?: string
  status?: string
  limit?: number
  offset?: number
}) => {
  let query = supabase.from('orders').select(`
    *,
    users(username, email),
    order_items(*, products(name, name_ko, image_url))
  `)

  if (options?.userId) {
    query = query.eq('user_id', options.userId)
  }

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching orders:', error)
    throw error
  }

  return data
}

export const fetchOrderById = async (id: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      users(username, email, phone),
      order_items(*, products(name, name_ko, image_url, base_price))
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    throw error
  }

  return data
}

// Reviews API
export const fetchReviews = async (options?: {
  productId?: string
  userId?: string
  featured?: boolean
  minRating?: number
  limit?: number
  offset?: number
}) => {
  let query = supabase.from('reviews').select(`
    *,
    users(username, avatar_url),
    products(name, name_ko, image_url)
  `)

  if (options?.productId) {
    query = query.eq('product_id', options.productId)
  }

  if (options?.userId) {
    query = query.eq('user_id', options.userId)
  }

  if (options?.featured !== undefined) {
    query = query.eq('is_featured', options.featured)
  }

  if (options?.minRating) {
    query = query.gte('rating', options.minRating)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }

  return data
}

// Community API
export const fetchCommunityPosts = async (options?: {
  category?: string
  featured?: boolean
  userId?: string
  limit?: number
  offset?: number
}) => {
  let query = supabase.from('community').select(`
    *,
    users(username, avatar_url)
  `)

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.featured !== undefined) {
    query = query.eq('is_featured', options.featured)
  }

  if (options?.userId) {
    query = query.eq('user_id', options.userId)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching community posts:', error)
    throw error
  }

  return data
}

// Events API
export const fetchEvents = async (options?: {
  active?: boolean
  eventType?: string
  limit?: number
}) => {
  let query = supabase.from('events').select('*')

  if (options?.active !== undefined) {
    query = query.eq('is_active', options.active)
  }

  if (options?.eventType) {
    query = query.eq('event_type', options.eventType)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  query = query.order('start_date', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching events:', error)
    throw error
  }

  return data
}

// Templates API
export const fetchTemplates = async (options?: {
  category?: string
  featured?: boolean
  limit?: number
}) => {
  let query = supabase.from('templates').select('*')

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.featured !== undefined) {
    query = query.eq('is_featured', options.featured)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  query = query.order('download_count', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching templates:', error)
    throw error
  }

  return data
}

// Additional Services API
export const fetchAdditionalServices = async (options?: {
  serviceType?: string
  active?: boolean
}) => {
  let query = supabase.from('additional_services').select('*')

  if (options?.serviceType) {
    query = query.eq('service_type', options.serviceType)
  }

  if (options?.active !== undefined) {
    query = query.eq('is_active', options.active)
  }

  query = query.order('price', { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching additional services:', error)
    throw error
  }

  return data
}

// Wishlist API
export const fetchWishlist = async (userId: string) => {
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      *,
      products(*, categories(name, name_ko))
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching wishlist:', error)
    throw error
  }

  return data
}

export const addToWishlist = async (userId: string, productId: string) => {
  const { data, error } = await supabase
    .from('wishlist')
    .insert([{ user_id: userId, product_id: productId }])
    .select()

  if (error) {
    console.error('Error adding to wishlist:', error)
    throw error
  }

  return data
}

export const removeFromWishlist = async (userId: string, productId: string) => {
  const { data, error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) {
    console.error('Error removing from wishlist:', error)
    throw error
  }

  return data
}

// Cart API
export const fetchCart = async (userId: string) => {
  const { data, error } = await supabase
    .from('cart')
    .select(`
      *,
      products(*, categories(name, name_ko))
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cart:', error)
    throw error
  }

  return data
}

export const addToCart = async (
  userId: string, 
  productId: string, 
  quantity: number, 
  customizationOptions?: any
) => {
  const { data, error } = await supabase
    .from('cart')
    .insert([{ 
      user_id: userId, 
      product_id: productId, 
      quantity,
      customization_options: customizationOptions 
    }])
    .select()

  if (error) {
    console.error('Error adding to cart:', error)
    throw error
  }

  return data
}

export const updateCartItem = async (
  cartItemId: string, 
  quantity: number, 
  customizationOptions?: any
) => {
  const { data, error } = await supabase
    .from('cart')
    .update({ 
      quantity, 
      customization_options: customizationOptions,
      updated_at: new Date().toISOString()
    })
    .eq('id', cartItemId)
    .select()

  if (error) {
    console.error('Error updating cart item:', error)
    throw error
  }

  return data
}

export const removeFromCart = async (cartItemId: string) => {
  const { data, error } = await supabase
    .from('cart')
    .delete()
    .eq('id', cartItemId)

  if (error) {
    console.error('Error removing from cart:', error)
    throw error
  }

  return data
}

// Statistics API
export const fetchStatistics = async () => {
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalUsers },
    { count: totalReviews }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true })
  ])

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalReviews
  }
}

// Search API
export const searchProducts = async (query: string, options?: {
  categoryId?: string
  limit?: number
}) => {
  let supabaseQuery = supabase
    .from('products')
    .select(`
      *,
      categories(name, name_ko)
    `)
    .or(`name.ilike.%${query}%,name_ko.ilike.%${query}%,description.ilike.%${query}%,description_ko.ilike.%${query}%`)

  if (options?.categoryId) {
    supabaseQuery = supabaseQuery.eq('category_id', options.categoryId)
  }

  if (options?.limit) {
    supabaseQuery = supabaseQuery.limit(options.limit)
  }

  const { data, error } = await supabaseQuery

  if (error) {
    console.error('Error searching products:', error)
    throw error
  }

  return data
}

// Real-time subscriptions
export const subscribeToProducts = (callback: (payload: any) => void) => {
  return supabase
    .channel('products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
    .subscribe()
}

export const subscribeToOrders = (callback: (payload: any) => void) => {
  return supabase
    .channel('orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
    .subscribe()
}

export const subscribeToReviews = (callback: (payload: any) => void) => {
  return supabase
    .channel('reviews')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, callback)
    .subscribe()
}

// Favorites API
export const fetchUserFavorites = async (userId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      products(
        id,
        name,
        name_ko,
        base_price,
        image_url,
        is_available,
        is_featured
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user favorites:', error)
    throw error
  }

  return data
}

export const addToFavorites = async (userId: string, productId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{ 
      user_id: userId, 
      product_id: productId 
    }])
    .select()

  if (error) {
    console.error('Error adding to favorites:', error)
    throw error
  }

  return data
}

export const removeFromFavorites = async (userId: string, productId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)

  if (error) {
    console.error('Error removing from favorites:', error)
    throw error
  }

  return data
}

export const isFavorite = async (userId: string, productId: string) => {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking favorite status:', error)
    throw error
  }

  return !!data
}

export const toggleFavorite = async (userId: string, productId: string) => {
  const favorite = await isFavorite(userId, productId)
  
  if (favorite) {
    await removeFromFavorites(userId, productId)
    return false
  } else {
    await addToFavorites(userId, productId)
    return true
  }
}