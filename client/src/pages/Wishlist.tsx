import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

interface WishlistItem {
  id: string;
  name: string;
  base_price: number;
  image_url: string;
  category_id: number;
  description: string;
  addedAt: string;
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // 찜한 상품 목록 로드
    const loadWishlist = () => {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const items = JSON.parse(savedWishlist);
        setWishlistItems(items);
      }
      setLoading(false);
    };

    loadWishlist();
  }, []);

  const removeFromWishlist = (productId: string) => {
    const updatedItems = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedItems);
    localStorage.setItem('wishlist', JSON.stringify(updatedItems));
    
    toast({
      title: "찜 목록에서 제거됨",
      description: "상품이 찜 목록에서 제거되었습니다.",
    });
  };

  const addToCart = (product: WishlistItem) => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cartItems.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.base_price,
        image_url: product.image_url,
        quantity: 1,
        options: {}
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    toast({
      title: "장바구니에 추가됨",
      description: `${product.name}이(가) 장바구니에 추가되었습니다.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-300">
              찜 목록을 불러오는 중...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            찜한 상품
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {wishlistItems.length}개의 상품이 찜 목록에 있습니다.
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              찜한 상품이 없습니다
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              관심있는 상품을 찜해보세요!
            </p>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                상품 둘러보기
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <img
                    src={item.image_url || '/api/placeholder/300/300'}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      ₩{item.base_price.toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(item.addedAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addToCart(item)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      장바구니
                    </Button>
                    <Link href={`/product/${item.id}`}>
                      <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300">
                        상세보기
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}