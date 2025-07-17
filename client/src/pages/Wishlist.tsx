import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ShoppingCart, Trash2, ArrowLeft, SortAsc } from "lucide-react";
import { motion } from "framer-motion";
import { BelugaMascot } from "@/components/BelugaMascot";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: number;
  name: string;
  nameKo: string;
  price: number;
  image: string;
  category: string;
  categoryKo: string;
  dateAdded: string;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
}

export default function Wishlist() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
  }, [user]);

  // Load wishlist from localStorage
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist);
          setWishlistItems(parsedWishlist);
        } else {
          // Sample data for demonstration
          const sampleWishlist = [
            {
              id: 1,
              name: "Acrylic Keychain",
              nameKo: "아크릴 키링",
              price: 8900,
              image: "/api/placeholder/300/300",
              category: "Keychains",
              categoryKo: "키링",
              dateAdded: "2024-01-12",
              isNew: true
            },
            {
              id: 2,
              name: "Custom Sticker",
              nameKo: "커스텀 스티커",
              price: 5500,
              originalPrice: 7500,
              image: "/api/placeholder/300/300",
              category: "Stickers",
              categoryKo: "스티커",
              dateAdded: "2024-01-10",
              isSale: true
            },
            {
              id: 3,
              name: "Acrylic Stand",
              nameKo: "아크릴 스탠드",
              price: 15000,
              image: "/api/placeholder/300/300",
              category: "Stands",
              categoryKo: "스탠드",
              dateAdded: "2024-01-08"
            }
          ];
          setWishlistItems(sampleWishlist);
          localStorage.setItem('wishlist', JSON.stringify(sampleWishlist));
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadWishlist();
    }
  }, [user]);

  // Sort wishlist items
  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case "oldest":
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.nameKo.localeCompare(b.nameKo);
      default:
        return 0;
    }
  });

  const removeFromWishlist = (itemId: number) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    toast({
      title: t({ ko: "찜 목록에서 제거됨", en: "Removed from wishlist" }),
      description: t({ ko: "상품이 찜 목록에서 제거되었습니다", en: "Item has been removed from your wishlist" }),
    });
  };

  const addToCart = (item: WishlistItem) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((cartItem: any) => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          nameKo: item.nameKo,
          price: item.price,
          quantity: 1,
          image: item.image,
          options: {}
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      toast({
        title: t({ ko: "장바구니에 추가됨", en: "Added to cart" }),
        description: t({ ko: "상품이 장바구니에 추가되었습니다", en: "Item has been added to your cart" }),
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: t({ ko: "오류", en: "Error" }),
        description: t({ ko: "장바구니 추가 중 오류가 발생했습니다", en: "An error occurred while adding to cart" }),
        variant: "destructive",
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#1F2D4A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="mr-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t({ ko: "홈으로", en: "Home" })}
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t({ ko: "찜 목록", en: "Wishlist" })}
                </h1>
              </div>
            </div>
          </div>
          
          {/* Loading Skeleton */}
          <ProductCardSkeleton count={8} />
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#1F2D4A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t({ ko: "홈으로", en: "Home" })}
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t({ ko: "찜 목록", en: "Wishlist" })}
              </h1>
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="mb-8">
              <BelugaMascot variant="empty-cart" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t({ ko: "찜한 상품이 없습니다", en: "No items in your wishlist" })}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {t({ ko: "마음에 드는 상품을 찜해보세요", en: "Add items to your wishlist to see them here" })}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/products">
                <Button className="px-8 py-3">
                  {t({ ko: "상품 둘러보기", en: "Browse Products" })}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#1F2D4A] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t({ ko: "홈으로", en: "Home" })}
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t({ ko: "찜 목록", en: "Wishlist" })}
              </h1>
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <SortAsc className="w-4 h-4 text-gray-500 dark:text-gray-300" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    {t({ ko: "최근 찜한 순", en: "Recently Added" })}
                  </SelectItem>
                  <SelectItem value="oldest">
                    {t({ ko: "오래된 순", en: "Oldest First" })}
                  </SelectItem>
                  <SelectItem value="price-low">
                    {t({ ko: "가격 낮은 순", en: "Price: Low to High" })}
                  </SelectItem>
                  <SelectItem value="price-high">
                    {t({ ko: "가격 높은 순", en: "Price: High to Low" })}
                  </SelectItem>
                  <SelectItem value="name">
                    {t({ ko: "이름 순", en: "Name" })}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300">
            {t({ ko: `총 ${wishlistItems.length}개의 상품을 찜했습니다`, en: `${wishlistItems.length} items in your wishlist` })}
          </p>
        </div>

        {/* Wishlist Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedItems.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Card className="group hover:shadow-md transition-shadow cursor-pointer overflow-hidden bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="relative">
                    <Link href={`/product/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.nameKo}
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 space-y-1">
                      {item.isNew && (
                        <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
                      )}
                      {item.isSale && (
                        <Badge className="bg-red-500 text-white text-xs">SALE</Badge>
                      )}
                    </div>
                    
                    {/* Remove from wishlist button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full shadow-sm transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                          {item.categoryKo}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.dateAdded).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-sm leading-tight text-gray-900 dark:text-white line-clamp-2">
                        {item.nameKo}
                      </h3>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          ₩{item.price.toLocaleString()}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                            ₩{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center space-x-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="flex-1 text-xs"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        {t({ ko: "장바구니", en: "Add to Cart" })}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromWishlist(item.id)}
                        className="px-3"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link href="/products">
            <Button variant="outline" size="lg" className="px-8">
              {t({ ko: "더 많은 상품 보기", en: "Browse More Products" })}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}