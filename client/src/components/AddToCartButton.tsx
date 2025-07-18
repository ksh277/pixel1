import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { Product } from '@/lib/supabase';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  customizationOptions?: any;
  variant?: 'default' | 'icon' | 'compact';
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  customizationOptions,
  variant = 'default',
  className = '',
}) => {
  const { addToCart, isAddingToCart, currentUser } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!currentUser) {
      toast({
        title: "로그인이 필요합니다",
        description: "장바구니에 상품을 추가하려면 로그인해주세요.",
        variant: "destructive",
        action: (
          <Link href="/auth">
            <Button variant="outline" size="sm">
              로그인하기
            </Button>
          </Link>
        ),
      });
      return;
    }

    if (!product.is_available) {
      toast({
        title: "상품을 사용할 수 없습니다",
        description: "현재 이 상품은 구매할 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      productId: product.id,
      quantity,
      price: product.base_price,
      customizationOptions,
    });
  };

  if (variant === 'icon') {
    return (
      <Button
        onClick={handleAddToCart}
        disabled={isAddingToCart || !product.is_available}
        size="icon"
        variant="outline"
        className={`shrink-0 ${className}`}
      >
        {isAddingToCart ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleAddToCart}
        disabled={isAddingToCart || !product.is_available}
        size="sm"
        variant="outline"
        className={`shrink-0 ${className}`}
      >
        {isAddingToCart ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
        ) : (
          <ShoppingCart className="w-4 h-4 mr-2" />
        )}
        담기
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAddingToCart || !product.is_available}
      className={`w-full ${className}`}
    >
      {isAddingToCart ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
          추가 중...
        </div>
      ) : (
        <div className="flex items-center">
          <ShoppingCart className="w-4 h-4 mr-2" />
          장바구니에 추가
        </div>
      )}
    </Button>
  );
};