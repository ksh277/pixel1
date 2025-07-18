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

// Product Reviews API
export const fetchProductReviews = async (productId: string) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .select(`
      *,
      users(username, email, avatar_url)
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching product reviews:', error)
    throw error
  }

  return data
}

export const createProductReview = async (review: {
  user_id: string
  product_id: string
  rating: number
  review_text: string
}) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .insert([review])
    .select(`
      *,
      users(username, email, avatar_url)
    `)
    .single()

  if (error) {
    console.error('Error creating product review:', error)
    throw error
  }

  return data
}

export const updateProductReview = async (reviewId: string, updates: {
  rating?: number
  review_text?: string
}) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .update(updates)
    .eq('id', reviewId)
    .select(`
      *,
      users(username, email, avatar_url)
    `)
    .single()

  if (error) {
    console.error('Error updating product review:', error)
    throw error
  }

  return data
}

export const deleteProductReview = async (reviewId: string) => {
  const { error } = await supabase
    .from('product_reviews')
    .delete()
    .eq('id', reviewId)

  if (error) {
    console.error('Error deleting product review:', error)
    throw error
  }

  return true
}

export const fetchUserReviewForProduct = async (userId: string, productId: string) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .select(`
      *,
      users(username, email, avatar_url)
    `)
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error('Error fetching user review:', error)
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

// Removed duplicate function - using the one at the end of the file

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

// Cart API (using cart_items table)
export const fetchCart = async (userId: string) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      products(
        id,
        name,
        name_ko,
        base_price,
        image_url,
        is_available,
        categories(name, name_ko)
      )
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
  quantity: number = 1, 
  price: number,
  customizationOptions?: any
) => {
  // Check if item already exists in cart
  const { data: existingItem, error: fetchError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking existing cart item:', fetchError)
    throw fetchError
  }

  if (existingItem) {
    // Update existing item quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({
        quantity: existingItem.quantity + quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingItem.id)
      .select()

    if (error) {
      console.error('Error updating cart item:', error)
      throw error
    }

    return data
  } else {
    // Create new cart item
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{
        user_id: userId,
        product_id: productId,
        quantity,
        price,
        customization_options: customizationOptions
      }])
      .select()

    if (error) {
      console.error('Error adding to cart:', error)
      throw error
    }

    return data
  }
}

export const updateCartItem = async (
  cartItemId: string, 
  quantity: number, 
  customizationOptions?: any
) => {
  const { data, error } = await supabase
    .from('cart_items')
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
    .from('cart_items')
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

export const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
  const { data, error } = await supabase
    .from('cart_items')
    .update({
      quantity,
      updated_at: new Date().toISOString()
    })
    .eq('id', cartItemId)
    .select()

  if (error) {
    console.error('Error updating cart item quantity:', error)
    throw error
  }

  return data
}

export const clearCart = async (userId: string) => {
  const { data, error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)

  if (error) {
    console.error('Error clearing cart:', error)
    throw error
  }

  return data
}

// Order API
export const createOrder = async (userId: string, cartItems: any[]) => {
  try {
    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => {
      const price = item.price || item.products?.base_price || 0;
      return total + (price * item.quantity);
    }, 0);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        total_price: totalPrice,
        status: 'pending',
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price || item.products?.base_price || 0,
          product_name: item.products?.name_ko || item.products?.name,
          customization_options: item.customization_options
        }))
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // Create print jobs for each item
    const printJobs = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      status: 'pending',
      customization_options: item.customization_options,
      created_at: new Date().toISOString()
    }));

    if (printJobs.length > 0) {
      const { error: printJobsError } = await supabase
        .from('print_jobs')
        .insert(printJobs);

      if (printJobsError) {
        console.error('Error creating print jobs:', printJobsError);
        // Don't throw here as the order was created successfully
      }
    }

    // Clear user's cart
    await clearCart(userId);

    return order;
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

export const fetchUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }

  return data;
};

export const fetchOrderById = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      print_jobs(*)
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    throw error;
  }

  return data;
};