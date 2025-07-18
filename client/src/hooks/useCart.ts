import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseAuth } from '@/components/SupabaseProvider';
import { useAuth } from '@/contexts/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { 
  fetchCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  updateCartItemQuantity
} from '@/lib/supabaseApi';
import { useToast } from '@/hooks/use-toast';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { user: localUser } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const { toast } = useToast();

  // Use Supabase auth if configured, otherwise fall back to local auth
  const currentUser = isSupabaseConfigured ? supabaseUser : localUser;
  const userId = currentUser?.id;

  // Fetch cart items
  const {
    data: cartItems = [],
    isLoading: isLoadingCart,
    error: cartError,
    refetch: refetchCart
  } = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => fetchCart(userId!),
    enabled: !!userId && isSupabaseConfigured,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity = 1, price, customizationOptions }: {
      productId: string;
      quantity?: number;
      price: number;
      customizationOptions?: any;
    }) => {
      if (!userId) throw new Error('로그인이 필요합니다');
      return addToCart(userId, productId, quantity, price, customizationOptions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      toast({
        title: "장바구니에 추가되었습니다",
        description: "상품이 성공적으로 장바구니에 추가되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast({
        title: "오류가 발생했습니다",
        description: "장바구니에 추가하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Update cart item mutation
  const updateCartItemMutation = useMutation({
    mutationFn: ({ cartItemId, quantity, customizationOptions }: {
      cartItemId: string;
      quantity: number;
      customizationOptions?: any;
    }) => updateCartItem(cartItemId, quantity, customizationOptions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      toast({
        title: "장바구니가 업데이트되었습니다",
        description: "상품 수량이 성공적으로 변경되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Error updating cart item:', error);
      toast({
        title: "오류가 발생했습니다",
        description: "장바구니 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Update cart item quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: {
      cartItemId: string;
      quantity: number;
    }) => updateCartItemQuantity(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
    onError: (error) => {
      console.error('Error updating quantity:', error);
      toast({
        title: "오류가 발생했습니다",
        description: "수량 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (cartItemId: string) => removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      toast({
        title: "상품이 제거되었습니다",
        description: "장바구니에서 상품이 성공적으로 제거되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Error removing from cart:', error);
      toast({
        title: "오류가 발생했습니다",
        description: "상품 제거 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error('로그인이 필요합니다');
      return clearCart(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      toast({
        title: "장바구니가 비워졌습니다",
        description: "모든 상품이 장바구니에서 제거되었습니다.",
      });
    },
    onError: (error) => {
      console.error('Error clearing cart:', error);
      toast({
        title: "오류가 발생했습니다",
        description: "장바구니 비우기 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Calculate totals
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.price || item.products?.base_price || 0;
    return total + (price * item.quantity);
  }, 0);

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    // Data
    cartItems,
    cartTotal,
    itemCount,
    isLoadingCart,
    cartError,
    currentUser,
    
    // Actions
    addToCart: addToCartMutation.mutate,
    updateCartItem: updateCartItemMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    refetchCart,
    
    // Loading states
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingCart: updateCartItemMutation.isPending,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };
};