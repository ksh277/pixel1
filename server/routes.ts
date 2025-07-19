import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabase } from "./lib/supabase";
import { insertUserSchema, insertProductSchema, insertProductReviewSchema, insertProductLikeSchema, insertCartItemSchema, insertOrderSchema, insertOrderItemSchema, insertPaymentSchema, insertCouponSchema, insertAdminLogSchema, insertCommunityPostSchema, insertCommunityCommentSchema, insertBelugaTemplateSchema, insertGoodsEditorDesignSchema, insertInquirySchema, insertNotificationSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// JWT Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: '토큰이 필요합니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: '토큰이 유효하지 않습니다.' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware
  app.use(cookieParser());
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;
      
      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({ message: "모든 필드를 입력해주세요." });
      }
      
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username, email')
        .or(`username.eq.${username},email.eq.${email}`)
        .single();
      
      if (existingUser) {
        return res.status(400).json({ 
          message: existingUser.username === username 
            ? "이미 사용 중인 아이디입니다." 
            : "이미 사용 중인 이메일입니다." 
        });
      }
      
      // Hash password with bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          username,
          email,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: "회원가입에 실패했습니다." });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: newUser.id, 
          username: newUser.username, 
          email: newUser.email,
          isAdmin: newUser.is_admin || false 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Set cookie with token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // Remove password before sending response
      const { password: _, ...userWithoutPassword } = newUser;
      res.status(201).json({ 
        ...userWithoutPassword,
        token 
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "회원가입에 실패했습니다." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validation
      if (!username || !password) {
        return res.status(400).json({ message: "아이디와 비밀번호를 입력해주세요." });
      }
      
      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error || !user) {
        return res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
      }
      
      // Check password with bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          isAdmin: user.is_admin || false 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Set cookie with token
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // Remove password before sending response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        ...userWithoutPassword,
        token 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "로그인에 실패했습니다." });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json({ message: "로그아웃되었습니다." });
  });

  // Check authentication status
  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, username, email, first_name, last_name, is_admin, created_at, updated_at')
        .eq('id', req.user.id)
        .single();
      
      if (error || !user) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Auth check error:', error);
      res.status(500).json({ message: "인증 확인에 실패했습니다." });
    }
  });

  // Wishlist routes
  app.get("/api/wishlist/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { data: wishlist, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          products (
            id, name, name_ko, base_price, image_url, category_id
          )
        `)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching wishlist:', error);
        return res.status(500).json({ message: "Failed to fetch wishlist" });
      }
      
      res.json(wishlist);
    } catch (error) {
      console.error('Error in wishlist endpoint:', error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const { user_id, product_id } = req.body;
      const { data: wishlistItem, error } = await supabase
        .from('wishlist')
        .insert([{ user_id, product_id }])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding to wishlist:', error);
        return res.status(500).json({ message: "Failed to add to wishlist" });
      }
      
      res.status(201).json(wishlistItem);
    } catch (error) {
      console.error('Error in wishlist endpoint:', error);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:userId/:productId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const productId = parseInt(req.params.productId);
      
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      
      if (error) {
        console.error('Error removing from wishlist:', error);
        return res.status(500).json({ message: "Failed to remove from wishlist" });
      }
      
      res.json({ message: "Removed from wishlist" });
    } catch (error) {
      console.error('Error in wishlist endpoint:', error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  // Cart routes
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id, name, name_ko, base_price, image_url, category_id
          )
        `)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).json({ message: "Failed to fetch cart" });
      }
      
      res.json(cartItems);
    } catch (error) {
      console.error('Error in cart endpoint:', error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const { user_id, product_id, quantity, options } = req.body;
      
      // Check if item already exists in cart
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user_id)
        .eq('product_id', product_id)
        .single();
      
      if (existingItem) {
        // Update quantity
        const { data: updatedItem, error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + quantity,
            options: options || existingItem.options
          })
          .eq('id', existingItem.id)
          .select()
          .single();
        
        if (updateError) {
          console.error('Error updating cart item:', updateError);
          return res.status(500).json({ message: "Failed to update cart item" });
        }
        
        res.json(updatedItem);
      } else {
        // Add new item
        const { data: cartItem, error } = await supabase
          .from('cart_items')
          .insert([{ user_id, product_id, quantity, options }])
          .select()
          .single();
        
        if (error) {
          console.error('Error adding to cart:', error);
          return res.status(500).json({ message: "Failed to add to cart" });
        }
        
        res.status(201).json(cartItem);
      }
    } catch (error) {
      console.error('Error in cart endpoint:', error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.delete("/api/cart/:userId/:itemId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const itemId = parseInt(req.params.itemId);
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('id', itemId);
      
      if (error) {
        console.error('Error removing from cart:', error);
        return res.status(500).json({ message: "Failed to remove from cart" });
      }
      
      res.json({ message: "Removed from cart" });
    } catch (error) {
      console.error('Error in cart endpoint:', error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Orders routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { user_id, total_amount, shipping_address, payment_method, items } = req.body;
      
      // 1. 재고 확인 먼저 수행
      for (const item of items) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock, name_ko, is_active')
          .eq('id', item.product_id)
          .single();
        
        if (productError || !product) {
          return res.status(400).json({ 
            message: `상품 정보를 찾을 수 없습니다. (상품 ID: ${item.product_id})` 
          });
        }
        
        if (!product.is_active) {
          return res.status(400).json({ 
            message: `${product.name_ko}는 현재 판매 중단된 상품입니다.` 
          });
        }
        
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            message: `${product.name_ko}의 재고가 부족합니다. (요청: ${item.quantity}개, 재고: ${product.stock}개)` 
          });
        }
      }
      
      // 2. 재고 차감 (주문 생성 전에 미리 차감)
      for (const item of items) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock: supabase.sql`stock - ${item.quantity}` 
          })
          .eq('id', item.product_id);
        
        if (stockError) {
          console.error('Error updating stock:', stockError);
          return res.status(500).json({ message: "재고 업데이트 중 오류가 발생했습니다." });
        }
      }
      
      // 3. 주문 생성
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id,
          total_amount,
          shipping_address,
          payment_method,
          status: 'preparing'  // 주문 상태를 preparing으로 설정
        }])
        .select()
        .single();
      
      if (orderError) {
        console.error('Error creating order:', orderError);
        
        // 주문 생성 실패 시 재고 복구
        for (const item of items) {
          await supabase
            .from('products')
            .update({ 
              stock: supabase.sql`stock + ${item.quantity}` 
            })
            .eq('id', item.product_id);
        }
        
        return res.status(500).json({ message: "주문 생성 중 오류가 발생했습니다." });
      }
      
      // 4. 주문 항목 추가
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        options: item.options
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        console.error('Error adding order items:', itemsError);
        
        // 주문 항목 추가 실패 시 재고 복구 및 주문 삭제
        for (const item of items) {
          await supabase
            .from('products')
            .update({ 
              stock: supabase.sql`stock + ${item.quantity}` 
            })
            .eq('id', item.product_id);
        }
        
        await supabase.from('orders').delete().eq('id', order.id);
        
        return res.status(500).json({ message: "주문 항목 추가 중 오류가 발생했습니다." });
      }
      
      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user_id);
      
      res.status(201).json(order);
    } catch (error) {
      console.error('Error in orders endpoint:', error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get user orders
  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              id, name, name_ko, image_url, base_price
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user orders:', error);
        return res.status(500).json({ message: "Failed to fetch orders" });
      }
      
      res.json(orders);
    } catch (error) {
      console.error('Error in user orders endpoint:', error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Update user profile
  app.patch("/api/users/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { first_name, last_name, email, phone, address } = req.body;
      
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          first_name,
          last_name,
          email,
          phone,
          address,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: "Failed to update profile" });
      }
      
      // Remove password before sending response
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error in user update endpoint:', error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get("/api/orders/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              id, name, name_ko, image_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: "Failed to fetch orders" });
      }
      
      res.json(orders);
    } catch (error) {
      console.error('Error in orders endpoint:', error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/orders/:orderId", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const { status } = req.body;
      
      const { data: order, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ message: "Failed to update order" });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error in orders endpoint:', error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Community posts routes
  app.get("/api/community/posts", async (req, res) => {
    try {
      const { data: posts, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching community posts:', error);
        return res.status(500).json({ message: "Failed to fetch community posts" });
      }
      
      res.json(posts);
    } catch (error) {
      console.error('Error in community posts endpoint:', error);
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  // User's community posts
  app.get("/api/community/posts/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { data: posts, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user posts:', error);
        return res.status(500).json({ message: "Failed to fetch user posts" });
      }
      
      res.json(posts);
    } catch (error) {
      console.error('Error in user posts endpoint:', error);
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  // User's favorites
  app.get("/api/favorites/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { data: favorites, error } = await supabase
        .from('favorites')
        .select(`
          *,
          products (
            id, name, name_ko, base_price, image_url, category_id
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user favorites:', error);
        return res.status(500).json({ message: "Failed to fetch user favorites" });
      }
      
      res.json(favorites);
    } catch (error) {
      console.error('Error in user favorites endpoint:', error);
      res.status(500).json({ message: "Failed to fetch user favorites" });
    }
  });

  // User's orders
  app.get("/api/orders/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              id, name, name_ko, image_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user orders:', error);
        return res.status(500).json({ message: "Failed to fetch user orders" });
      }
      
      res.json(orders);
    } catch (error) {
      console.error('Error in user orders endpoint:', error);
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  });

  // Product images
  app.get("/api/products/:productId/images", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const { data: images, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('display_order');
      
      if (error) {
        console.error('Error fetching product images:', error);
        return res.status(500).json({ message: "Failed to fetch product images" });
      }
      
      res.json(images);
    } catch (error) {
      console.error('Error in product images endpoint:', error);
      res.status(500).json({ message: "Failed to fetch product images" });
    }
  });

  // Product reviews
  app.get("/api/products/:productId/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const { data: reviews, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          users (
            username
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching product reviews:', error);
        return res.status(500).json({ message: "Failed to fetch product reviews" });
      }
      
      res.json(reviews);
    } catch (error) {
      console.error('Error in product reviews endpoint:', error);
      res.status(500).json({ message: "Failed to fetch product reviews" });
    }
  });

  // Toggle favorite
  app.post("/api/favorites/toggle", async (req, res) => {
    try {
      const { user_id, product_id } = req.body;
      
      // Check if favorite exists
      const { data: existing, error: checkError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user_id)
        .eq('product_id', product_id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking favorite:', checkError);
        return res.status(500).json({ message: "Failed to check favorite status" });
      }
      
      if (existing) {
        // Remove favorite
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user_id)
          .eq('product_id', product_id);
        
        if (deleteError) {
          console.error('Error removing favorite:', deleteError);
          return res.status(500).json({ message: "Failed to remove favorite" });
        }
        
        res.json({ isFavorite: false });
      } else {
        // Add favorite
        const { error: insertError } = await supabase
          .from('favorites')
          .insert([{ user_id, product_id }]);
        
        if (insertError) {
          console.error('Error adding favorite:', insertError);
          return res.status(500).json({ message: "Failed to add favorite" });
        }
        
        res.json({ isFavorite: true });
      }
    } catch (error) {
      console.error('Error in toggle favorite endpoint:', error);
      res.status(500).json({ message: "Failed to toggle favorite" });
    }
  });

  // Add to cart
  app.post("/api/cart/add", async (req, res) => {
    try {
      const { user_id, product_id, quantity, customization } = req.body;
      
      // Check if item already exists in cart
      const { data: existing, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user_id)
        .eq('product_id', product_id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking cart item:', checkError);
        return res.status(500).json({ message: "Failed to check cart item" });
      }
      
      if (existing) {
        // Update quantity
        const { data: updated, error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existing.quantity + quantity,
            customization: customization || existing.customization
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (updateError) {
          console.error('Error updating cart item:', updateError);
          return res.status(500).json({ message: "Failed to update cart item" });
        }
        
        res.json(updated);
      } else {
        // Add new item
        const { data: newItem, error: insertError } = await supabase
          .from('cart_items')
          .insert([{ user_id, product_id, quantity, customization }])
          .select()
          .single();
        
        if (insertError) {
          console.error('Error adding to cart:', insertError);
          return res.status(500).json({ message: "Failed to add to cart" });
        }
        
        res.json(newItem);
      }
    } catch (error) {
      console.error('Error in add to cart endpoint:', error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.get("/api/community/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { data: post, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error in community post endpoint:', error);
      res.status(500).json({ message: "Failed to fetch community post" });
    }
  });

  // Design shares routes
  app.get("/api/design-shares", async (req, res) => {
    try {
      const { data: designs, error } = await supabase
        .from('design_shares')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching design shares:', error);
        return res.status(500).json({ message: "Failed to fetch design shares" });
      }
      
      res.json(designs);
    } catch (error) {
      console.error('Error in design shares endpoint:', error);
      res.status(500).json({ message: "Failed to fetch design shares" });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({ message: "Failed to fetch events" });
      }
      
      res.json(events);
    } catch (error) {
      console.error('Error in events endpoint:', error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Resources routes
  app.get("/api/resources", async (req, res) => {
    try {
      const { data: resources, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching resources:', error);
        return res.status(500).json({ message: "Failed to fetch resources" });
      }
      
      res.json(resources);
    } catch (error) {
      console.error('Error in resources endpoint:', error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // Q&A routes
  app.get("/api/qna", async (req, res) => {
    try {
      const { data: qnaPosts, error } = await supabase
        .from('qna_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching Q&A posts:', error);
        return res.status(500).json({ message: "Failed to fetch Q&A posts" });
      }
      
      res.json(qnaPosts);
    } catch (error) {
      console.error('Error in Q&A endpoint:', error);
      res.status(500).json({ message: "Failed to fetch Q&A posts" });
    }
  });

  // Notifications routes
  app.get("/api/notifications/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ message: "Failed to fetch notifications" });
      }
      
      res.json(notifications);
    } catch (error) {
      console.error('Error in notifications endpoint:', error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const validatedData = insertNotificationSchema.parse(req.body);
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert([validatedData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({ message: "Failed to create notification" });
      }
      
      res.json(notification);
    } catch (error) {
      console.error('Error in create notification endpoint:', error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { data: notification, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({ message: "Failed to mark notification as read" });
      }
      
      res.json(notification);
    } catch (error) {
      console.error('Error in mark notification as read endpoint:', error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.patch("/api/notifications/user/:userId/read-all", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { data: notifications, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
        .select();
      
      if (error) {
        console.error('Error marking all notifications as read:', error);
        return res.status(500).json({ message: "Failed to mark all notifications as read" });
      }
      
      res.json(notifications);
    } catch (error) {
      console.error('Error in mark all notifications as read endpoint:', error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ message: "Failed to fetch categories" });
      }
      
      res.json(categories);
    } catch (error) {
      console.error('Error in categories endpoint:', error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const { data: category, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching category:', error);
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error('Error in category endpoint:', error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, search } = req.query;
      let query = supabase.from('products').select('*');

      if (category) {
        query = query.eq('category_id', parseInt(category as string));
      }
      
      if (featured === "true") {
        query = query.eq('is_featured', true);
      }
      
      // Search filtering
      if (search) {
        const searchTerm = search as string;
        query = query.or(`name.ilike.%${searchTerm}%,name_ko.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      // 활성화된 상품만 가져오기
      query = query.eq('is_active', true);
      
      const { data: products, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: "Failed to fetch products" });
      }
      
      // 재고 정보와 품절 상태 추가
      const productsWithStock = products.map(product => ({
        ...product,
        reviewCount: 0,
        likeCount: 0,
        isOutOfStock: product.stock <= 0,
        isLowStock: product.stock > 0 && product.stock <= 5
      }));
      
      res.json(productsWithStock);
    } catch (error) {
      console.error('Error in products endpoint:', error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Search products endpoint
  app.get("/api/products/search", async (req, res) => {
    try {
      const { q, category, priceRange, sortBy } = req.query;
      
      let products = await storage.getProducts();
      
      // Text search
      if (q) {
        const searchTerm = (q as string).toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.nameKo.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
      }
      
      // Category filter
      if (category && category !== "all") {
        products = products.filter(product => 
          product.categoryId.toString() === category
        );
      }
      
      // Price range filter
      if (priceRange && priceRange !== "all") {
        products = products.filter(product => {
          const price = product.price;
          switch (priceRange) {
            case "under10": return price < 10000;
            case "10to30": return price >= 10000 && price < 30000;
            case "30to50": return price >= 30000 && price < 50000;
            case "over50": return price >= 50000;
            default: return true;
          }
        });
      }
      
      // Sorting
      if (sortBy) {
        products.sort((a, b) => {
          switch (sortBy) {
            case "latest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "priceLow": return a.price - b.price;
            case "priceHigh": return b.price - a.price;
            case "name": return a.nameKo.localeCompare(b.nameKo);
            case "popular": return (b.reviews || 0) - (a.reviews || 0);
            default: return 0;
          }
        });
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Admin Product Management (connected to database)
  app.post("/api/products", async (req, res) => {
    try {
      const productData = req.body;
      const { data: product, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: "Failed to create product" });
      }
      
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const { data: product, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: "Failed to update product" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: "Failed to delete product" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Product Reviews
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviewData = insertProductReviewSchema.parse({ ...req.body, productId });
      const review = await storage.createProductReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  // Product Likes
  app.post("/api/products/:id/like", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      // Check if already liked
      const isLiked = await storage.isProductLiked(productId, userId);
      if (isLiked) {
        return res.status(400).json({ message: "Product already liked" });
      }
      
      const like = await storage.likeProduct(productId, userId);
      res.status(201).json(like);
    } catch (error) {
      res.status(500).json({ message: "Failed to like product" });
    }
  });

  app.delete("/api/products/:id/like", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const success = await storage.unlikeProduct(productId, userId);
      if (!success) {
        return res.status(404).json({ message: "Like not found" });
      }
      
      res.json({ message: "Product unliked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unlike product" });
    }
  });

  app.get("/api/products/:id/liked", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const isLiked = await storage.isProductLiked(productId, parseInt(userId as string));
      res.json({ isLiked });
    } catch (error) {
      res.status(500).json({ message: "Failed to check like status" });
    }
  });

  // User Authentication
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Cart
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Cart item removed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Orders
  app.get("/api/orders/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  // Community
  app.get("/api/community/posts", async (req, res) => {
    try {
      const posts = await storage.getCommunityPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.get("/api/community/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const result = await storage.db.execute(
        `SELECT p.*, u.username, u.first_name, u.last_name 
         FROM community_posts p 
         JOIN users u ON p.user_id = u.id 
         WHERE p.id = ?`,
        [postId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Comments
  app.get("/api/community/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const result = await storage.db.execute(
        `SELECT c.*, u.username, u.first_name, u.last_name 
         FROM community_comments c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.post_id = ? 
         ORDER BY c.created_at DESC`,
        [postId]
      );
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/community/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const { user_id, comment } = req.body;
      
      if (!user_id || !comment) {
        return res.status(400).json({ message: "User ID and comment are required" });
      }
      
      // Create the comment
      const result = await storage.db.execute(
        "INSERT INTO community_comments (post_id, user_id, comment) VALUES (?, ?, ?) RETURNING *",
        [postId, user_id, comment]
      );
      
      // Get the comment with user info
      const commentWithUser = await storage.db.execute(
        `SELECT c.*, u.username, u.first_name, u.last_name 
         FROM community_comments c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.id = ?`,
        [result.rows[0].id]
      );
      
      // Get post details and create notification for post author
      const postResult = await storage.db.execute(
        "SELECT p.*, u.username as author_username FROM community_posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?",
        [postId]
      );
      
      const commenterResult = await storage.db.execute(
        "SELECT username FROM users WHERE id = ?",
        [user_id]
      );
      
      if (postResult.rows.length > 0 && commenterResult.rows.length > 0) {
        const post = postResult.rows[0] as any;
        const commenter = commenterResult.rows[0] as any;
        
        // Don't notify if user is commenting on their own post
        if (post.user_id !== user_id) {
          await storage.db.execute(
            "INSERT INTO notifications (user_id, title, message, related_post_id) VALUES (?, ?, ?, ?)",
            [
              post.user_id,
              "💬 새 댓글 알림",
              `${commenter.username}님이 "${post.title}" 게시물에 댓글을 남겼습니다.`,
              postId
            ]
          );
        }
      }
      
      res.status(201).json(commentWithUser.rows[0]);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.delete("/api/community/posts/:postId/comments/:commentId", async (req, res) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const { user_id } = req.body;
      
      if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      // Check if user owns the comment
      const checkResult = await storage.db.execute(
        "SELECT user_id FROM community_comments WHERE id = ?",
        [commentId]
      );
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      if (checkResult.rows[0].user_id !== user_id) {
        return res.status(403).json({ message: "Not authorized to delete this comment" });
      }
      
      await storage.db.execute(
        "DELETE FROM community_comments WHERE id = ?",
        [commentId]
      );
      
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  app.post("/api/community/posts", async (req, res) => {
    try {
      const postData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  app.post("/api/community/posts/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.likeCommunityPost(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.get("/api/community/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getCommunityComments(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/community/posts/:id/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const commentData = insertCommunityCommentSchema.parse({ ...req.body, postId });
      const comment = await storage.createCommunityComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ message: "Invalid comment data" });
    }
  });

  // Beluga Templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getBelugaTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getBelugaTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertBelugaTemplateSchema.parse(req.body);
      const template = await storage.createBelugaTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  app.patch("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertBelugaTemplateSchema.partial().parse(req.body);
      const template = await storage.updateBelugaTemplate(id, updates);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBelugaTemplate(id);
      if (!success) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  app.post("/api/templates/reorder", async (req, res) => {
    try {
      const { templateIds } = req.body;
      if (!Array.isArray(templateIds)) {
        return res.status(400).json({ message: "templateIds must be an array" });
      }
      const success = await storage.reorderBelugaTemplates(templateIds);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to reorder templates" });
    }
  });

  // Order Items
  app.get("/api/orders/:orderId/items", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const orderItems = await storage.getOrderItems(orderId);
      res.json(orderItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order items" });
    }
  });

  app.post("/api/orders/:orderId/items", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const orderItemData = insertOrderItemSchema.parse({ ...req.body, orderId });
      const orderItem = await storage.createOrderItem(orderItemData);
      res.status(201).json(orderItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid order item data" });
    }
  });

  // Payments
  app.get("/api/orders/:orderId/payments", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const payments = await storage.getPayments(orderId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post("/api/orders/:orderId/payments", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const paymentData = insertPaymentSchema.parse({ ...req.body, orderId });
      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data" });
    }
  });

  app.patch("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const payment = await storage.updatePaymentStatus(id, status);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment" });
    }
  });

  // Coupons
  app.get("/api/coupons", async (req, res) => {
    try {
      const coupons = await storage.getCoupons();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });

  app.get("/api/coupons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const coupon = await storage.getCoupon(id);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coupon" });
    }
  });

  app.get("/api/coupons/code/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const coupon = await storage.getCouponByCode(code);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coupon" });
    }
  });

  app.post("/api/coupons", async (req, res) => {
    try {
      const couponData = insertCouponSchema.parse(req.body);
      const coupon = await storage.createCoupon(couponData);
      res.status(201).json(coupon);
    } catch (error) {
      res.status(400).json({ message: "Invalid coupon data" });
    }
  });

  app.patch("/api/coupons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertCouponSchema.partial().parse(req.body);
      const coupon = await storage.updateCoupon(id, updates);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error) {
      res.status(400).json({ message: "Invalid coupon data" });
    }
  });

  app.delete("/api/coupons/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCoupon(id);
      if (!success) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete coupon" });
    }
  });

  // Admin Logs
  app.get("/api/admin/logs", async (req, res) => {
    try {
      const logs = await storage.getAdminLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin logs" });
    }
  });

  app.post("/api/admin/logs", async (req, res) => {
    try {
      const logData = insertAdminLogSchema.parse(req.body);
      const log = await storage.createAdminLog(logData);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ message: "Invalid admin log data" });
    }
  });

  // Goods Editor Design routes
  app.get("/api/designs", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const designs = await storage.getGoodsEditorDesigns(userId ? parseInt(userId) : undefined);
      res.json(designs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch designs" });
    }
  });

  app.post("/api/designs", async (req, res) => {
    try {
      const designData = insertGoodsEditorDesignSchema.parse(req.body);
      const design = await storage.createGoodsEditorDesign(designData);
      res.status(201).json(design);
    } catch (error) {
      res.status(400).json({ message: "Invalid design data" });
    }
  });

  app.get("/api/designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.getGoodsEditorDesignById(id);
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      res.json(design);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch design" });
    }
  });

  app.put("/api/designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const design = await storage.updateGoodsEditorDesign(id, updateData);
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      res.json(design);
    } catch (error) {
      res.status(500).json({ message: "Failed to update design" });
    }
  });

  app.delete("/api/designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGoodsEditorDesign(id);
      if (!success) {
        return res.status(404).json({ message: "Design not found" });
      }
      res.json({ message: "Design deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete design" });
    }
  });

  // Inquiry routes
  app.get("/api/inquiries", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const inquiries = await storage.getInquiries(userId ? parseInt(userId) : undefined);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(inquiryData);
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(400).json({ message: "Invalid inquiry data" });
    }
  });

  app.get("/api/inquiries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const inquiry = await storage.getInquiryById(id);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiry" });
    }
  });

  app.put("/api/inquiries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const inquiry = await storage.updateInquiry(id, updateData);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  // Goods Editor Design routes
  app.get("/api/goods-editor-designs", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const designs = await storage.getGoodsEditorDesigns(userId ? parseInt(userId) : undefined);
      res.json(designs);
    } catch (error) {
      console.error("Error fetching designs:", error);
      res.status(500).json({ error: "Failed to fetch designs" });
    }
  });

  app.get("/api/goods-editor-designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.getGoodsEditorDesignById(id);
      
      if (!design) {
        return res.status(404).json({ error: "Design not found" });
      }
      
      res.json(design);
    } catch (error) {
      console.error("Error fetching design:", error);
      res.status(500).json({ error: "Failed to fetch design" });
    }
  });

  app.post("/api/goods-editor-designs", async (req, res) => {
    try {
      const validatedData = insertGoodsEditorDesignSchema.parse(req.body);
      const design = await storage.createGoodsEditorDesign(validatedData);
      res.json(design);
    } catch (error) {
      console.error("Error creating design:", error);
      res.status(500).json({ error: "Failed to create design" });
    }
  });

  app.put("/api/goods-editor-designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.updateGoodsEditorDesign(id, req.body);
      
      if (!design) {
        return res.status(404).json({ error: "Design not found" });
      }
      
      res.json(design);
    } catch (error) {
      console.error("Error updating design:", error);
      res.status(500).json({ error: "Failed to update design" });
    }
  });

  app.delete("/api/goods-editor-designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGoodsEditorDesign(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Design not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting design:", error);
      res.status(500).json({ error: "Failed to delete design" });
    }
  });

  // Inquiry routes (additional endpoints)
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.json(inquiry);
    } catch (error) {
      console.error("Error creating inquiry:", error);
      res.status(500).json({ error: "Failed to create inquiry" });
    }
  });

  app.get("/api/inquiries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const inquiry = await storage.getInquiryById(id);
      
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      
      res.json(inquiry);
    } catch (error) {
      console.error("Error fetching inquiry:", error);
      res.status(500).json({ error: "Failed to fetch inquiry" });
    }
  });

  // Placeholder image endpoint
  app.get("/api/placeholder/:width/:height", async (req, res) => {
    const width = parseInt(req.params.width) || 300;
    const height = parseInt(req.params.height) || 300;
    
    // Generate a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" font-size="16" fill="#666">
          ${width}×${height}
        </text>
      </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });

  // Notification routes
  app.get("/api/notifications/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const result = await storage.db.execute(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY sent_at DESC",
        [userId]
      );
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error in notifications endpoint:', error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notification = req.body;
      const result = await storage.db.execute(
        "INSERT INTO notifications (user_id, title, message, is_read, related_post_id, related_order_id) VALUES (?, ?, ?, ?, ?, ?) RETURNING *",
        [
          notification.user_id,
          notification.title,
          notification.message,
          notification.is_read || false,
          notification.related_post_id || null,
          notification.related_order_id || null
        ]
      );
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error in create notification endpoint:', error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const result = await storage.db.execute(
        "UPDATE notifications SET is_read = true WHERE id = ? RETURNING *",
        [notificationId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error in mark notification as read endpoint:', error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.patch("/api/notifications/user/:userId/read-all", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const result = await storage.db.execute(
        "UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false RETURNING *",
        [userId]
      );
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error in mark all notifications as read endpoint:', error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // Product search endpoint
  app.get("/api/products/search", async (req, res) => {
    try {
      const { q, category, min_price, max_price, sort, featured } = req.query;
      
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            name_ko
          )
        `);

      // Apply search filter
      if (q && typeof q === 'string') {
        query = query.or(
          `name.ilike.%${q}%,name_ko.ilike.%${q}%,description.ilike.%${q}%,description_ko.ilike.%${q}%`
        );
      }

      // Apply category filter
      if (category && typeof category === 'string') {
        const categories = category.split(',').filter(Boolean);
        if (categories.length > 0) {
          query = query.in('category_id', categories);
        }
      }

      // Apply price range filter
      if (min_price && typeof min_price === 'string') {
        query = query.gte('base_price', parseInt(min_price));
      }
      if (max_price && typeof max_price === 'string') {
        query = query.lte('base_price', parseInt(max_price));
      }

      // Apply featured filter
      if (featured === '1') {
        query = query.eq('is_featured', true);
      }

      // Always show active products
      query = query.eq('is_active', true);

      // Apply sorting
      switch (sort) {
        case 'price_low':
          query = query.order('base_price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('base_price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'featured':
          query = query.order('is_featured', { ascending: false }).order('name');
          break;
        default:
          query = query.order('name');
      }

      const { data: products, error } = await query;
      
      if (error) {
        console.error('Error searching products:', error);
        return res.status(500).json({ message: "Failed to search products" });
      }
      
      res.json(products || []);
    } catch (error) {
      console.error('Error in product search endpoint:', error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  // Refund request endpoints
  app.post("/api/refund-requests", async (req, res) => {
    try {
      const { data: refundRequest, error } = await supabase
        .from('refund_requests')
        .insert(req.body)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating refund request:', error);
        return res.status(500).json({ message: "Failed to create refund request" });
      }
      
      res.json(refundRequest);
    } catch (error) {
      console.error('Error in refund request creation endpoint:', error);
      res.status(500).json({ message: "Failed to create refund request" });
    }
  });

  app.get("/api/refund-requests/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const { data: refundRequests, error } = await supabase
        .from('refund_requests')
        .select(`
          *,
          orders (
            id,
            total_amount,
            created_at,
            order_items
          )
        `)
        .eq('user_id', userId)
        .order('requested_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user refund requests:', error);
        return res.status(500).json({ message: "Failed to fetch refund requests" });
      }
      
      res.json(refundRequests || []);
    } catch (error) {
      console.error('Error in user refund requests endpoint:', error);
      res.status(500).json({ message: "Failed to fetch refund requests" });
    }
  });

  app.get("/api/refund-requests/check/:orderId", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      
      const { data: existingRequest, error } = await supabase
        .from('refund_requests')
        .select('*')
        .eq('order_id', orderId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking refund request:', error);
        return res.status(500).json({ message: "Failed to check refund request" });
      }
      
      res.json({ exists: !!existingRequest, request: existingRequest });
    } catch (error) {
      console.error('Error in refund request check endpoint:', error);
      res.status(500).json({ message: "Failed to check refund request" });
    }
  });

  app.patch("/api/refund-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      if (updateData.status === 'approved' || updateData.status === 'rejected') {
        updateData.resolved_at = new Date().toISOString();
      }
      
      const { data: refundRequest, error } = await supabase
        .from('refund_requests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating refund request:', error);
        return res.status(500).json({ message: "Failed to update refund request" });
      }
      
      res.json(refundRequest);
    } catch (error) {
      console.error('Error in refund request update endpoint:', error);
      res.status(500).json({ message: "Failed to update refund request" });
    }
  });

  // Payment system endpoints
  app.post("/api/kakao/pay", async (req, res) => {
    try {
      const { orderId, userId, itemName, totalAmount, quantity } = req.body;
      
      // KakaoPay API 요청
      const response = await fetch('https://kapi.kakao.com/v1/payment/ready', {
        method: 'POST',
        headers: {
          'Authorization': `KakaoAK ${process.env.KAKAO_ADMIN_KEY || 'YOUR_KAKAO_ADMIN_KEY'}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: new URLSearchParams({
          cid: 'TC0ONETIME',
          partner_order_id: orderId.toString(),
          partner_user_id: userId.toString(),
          item_name: itemName,
          quantity: quantity.toString(),
          total_amount: totalAmount.toString(),
          tax_free_amount: '0',
          approval_url: `${process.env.VITE_APP_URL || 'http://localhost:5000'}/payment-success?kakao=1&orderId=${orderId}`,
          fail_url: `${process.env.VITE_APP_URL || 'http://localhost:5000'}/payment-failed?kakao=1&orderId=${orderId}`,
          cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:5000'}/payment-failed?kakao=1&orderId=${orderId}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`KakaoPay API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // 결제 준비 성공 시 리디렉션 URL 반환
      res.json({ redirectUrl: data.next_redirect_pc_url, tid: data.tid });
    } catch (error) {
      console.error('KakaoPay payment error:', error);
      res.status(500).json({ message: "KakaoPay payment initialization failed" });
    }
  });

  app.post("/api/payment/complete", async (req, res) => {
    try {
      const { orderId, paymentMethod, status } = req.body;
      
      // Update payments table
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .update({
          status: status,
          payment_method: paymentMethod,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId)
        .select()
        .single();
      
      if (paymentError) {
        console.error('Error updating payment:', paymentError);
        return res.status(500).json({ message: "Failed to update payment status" });
      }
      
      // Update orders table
      const orderStatus = status === 'success' ? 'completed' : 'failed';
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .update({
          status: orderStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();
      
      if (orderError) {
        console.error('Error updating order:', orderError);
        return res.status(500).json({ message: "Failed to update order status" });
      }
      
      res.json({ 
        orderId: orderId,
        paymentMethod: paymentMethod,
        status: status,
        amount: payment.amount,
        order: order 
      });
    } catch (error) {
      console.error('Error in payment completion endpoint:', error);
      res.status(500).json({ message: "Failed to complete payment processing" });
    }
  });

  app.get("/api/payment/:orderId", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      
      const { data: payment, error } = await supabase
        .from('payments')
        .select(`
          *,
          orders (
            id,
            total_amount,
            status,
            created_at
          )
        `)
        .eq('order_id', orderId)
        .single();
      
      if (error) {
        console.error('Error fetching payment:', error);
        return res.status(500).json({ message: "Failed to fetch payment information" });
      }
      
      res.json(payment);
    } catch (error) {
      console.error('Error in payment info endpoint:', error);
      res.status(500).json({ message: "Failed to fetch payment information" });
    }
  });

  // Create order endpoint
  app.post("/api/orders", async (req, res) => {
    try {
      const { user_id, total_amount, status, shipping_address, shipping_phone, shipping_name, special_requests, order_items } = req.body;
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert([{
          user_id,
          total_amount,
          status: status || 'pending',
          shipping_address: {
            address: shipping_address,
            phone: shipping_phone,
            name: shipping_name,
            special_requests: special_requests || ''
          },
          order_items: order_items || []
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: "Failed to create order" });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error in order creation endpoint:', error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Create payment endpoint
  app.post("/api/payments", async (req, res) => {
    try {
      const { order_id, amount, method, status } = req.body;
      
      const { data: payment, error } = await supabase
        .from('payments')
        .insert([{
          order_id,
          amount,
          method: method || 'toss',
          status: status || 'pending'
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating payment:', error);
        return res.status(500).json({ message: "Failed to create payment" });
      }
      
      res.json(payment);
    } catch (error) {
      console.error('Error in payment creation endpoint:', error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  // Order Detail API Endpoints
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: '유효하지 않은 주문 ID입니다.' });
      }

      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error || !order) {
        return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ message: '주문 정보를 불러오는데 실패했습니다.' });
    }
  });

  app.get("/api/payments/order/:orderId", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: '유효하지 않은 주문 ID입니다.' });
      }

      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching payment:', error);
        return res.status(500).json({ message: '결제 정보를 불러오는데 실패했습니다.' });
      }

      res.json(payment || null);
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ message: '결제 정보를 불러오는데 실패했습니다.' });
    }
  });

  app.get("/api/shipping/:orderId", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: '유효하지 않은 주문 ID입니다.' });
      }

      const { data: shipping, error } = await supabase
        .from('shipping_info')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching shipping info:', error);
        return res.status(500).json({ message: '배송 정보를 불러오는데 실패했습니다.' });
      }

      res.json(shipping || null);
    } catch (error) {
      console.error('Error fetching shipping info:', error);
      res.status(500).json({ message: '배송 정보를 불러오는데 실패했습니다.' });
    }
  });

  app.get("/api/delivery-tracking/:orderId", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: '유효하지 않은 주문 ID입니다.' });
      }

      const { data: tracking, error } = await supabase
        .from('delivery_tracking')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching delivery tracking:', error);
        return res.status(500).json({ message: '배송 추적 정보를 불러오는데 실패했습니다.' });
      }

      res.json(tracking || null);
    } catch (error) {
      console.error('Error fetching delivery tracking:', error);
      res.status(500).json({ message: '배송 추적 정보를 불러오는데 실패했습니다.' });
    }
  });

  app.get("/api/print-jobs/:orderId", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: '유효하지 않은 주문 ID입니다.' });
      }

      const { data: printJob, error } = await supabase
        .from('print_jobs')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching print job:', error);
        return res.status(500).json({ message: '프린트 작업 정보를 불러오는데 실패했습니다.' });
      }

      res.json(printJob || null);
    } catch (error) {
      console.error('Error fetching print job:', error);
      res.status(500).json({ message: '프린트 작업 정보를 불러오는데 실패했습니다.' });
    }
  });

  // Refund Request API Endpoints
  app.post("/api/refund-requests", async (req, res) => {
    try {
      const { order_id, reason, amount, description } = req.body;
      
      if (!order_id || !reason || !amount) {
        return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
      }

      // Check if refund request already exists
      const { data: existingRequest, error: checkError } = await supabase
        .from('refund_requests')
        .select('*')
        .eq('order_id', order_id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing refund request:', checkError);
        return res.status(500).json({ message: '환불 요청 확인 중 오류가 발생했습니다.' });
      }

      if (existingRequest) {
        return res.status(400).json({ message: '이미 환불 요청이 존재합니다.' });
      }

      const { data: refundRequest, error } = await supabase
        .from('refund_requests')
        .insert([{
          order_id,
          reason,
          amount,
          description,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating refund request:', error);
        return res.status(500).json({ message: '환불 요청 생성에 실패했습니다.' });
      }

      res.json(refundRequest);
    } catch (error) {
      console.error('Error creating refund request:', error);
      res.status(500).json({ message: '환불 요청 생성에 실패했습니다.' });
    }
  });

  app.get("/api/refund-requests/check/:orderId", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: '유효하지 않은 주문 ID입니다.' });
      }

      const { data: refundRequest, error } = await supabase
        .from('refund_requests')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking refund request:', error);
        return res.status(500).json({ message: '환불 요청 확인에 실패했습니다.' });
      }

      res.json({
        exists: !!refundRequest,
        request: refundRequest || null
      });
    } catch (error) {
      console.error('Error checking refund request:', error);
      res.status(500).json({ message: '환불 요청 확인에 실패했습니다.' });
    }
  });

  app.get("/api/refund-requests/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: '유효하지 않은 사용자 ID입니다.' });
      }

      const { data: refundRequests, error } = await supabase
        .from('refund_requests')
        .select(`
          *,
          orders (
            id,
            total_amount,
            created_at,
            status
          )
        `)
        .eq('orders.user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching refund requests:', error);
        return res.status(500).json({ message: '환불 요청 목록을 불러오는데 실패했습니다.' });
      }

      res.json(refundRequests || []);
    } catch (error) {
      console.error('Error fetching refund requests:', error);
      res.status(500).json({ message: '환불 요청 목록을 불러오는데 실패했습니다.' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
