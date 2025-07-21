import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Star,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, Category } from "@shared/schema";

const ProductList: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "featured">(
    "featured",
  );

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<
    Product[]
  >({
    queryKey: ["/api/products"],
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["/api/categories"],
  });

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.nameKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === null || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory && product.isActive;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.nameKo.localeCompare(b.nameKo);
        case "price":
          return parseFloat(a.basePrice) - parseFloat(b.basePrice);
        case "featured":
          return b.isFeatured ? 1 : -1;
        default:
          return 0;
      }
    });

  const handleProductClick = (productId: number) => {
    setLocation(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    // Toggle favorite logic here
    console.log("Toggling favorite:", product);
  };

  const formatPrice = (price: string) => {
    return `₩${parseInt(price).toLocaleString()}`;
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700"
      onClick={() => handleProductClick(product.id)}
    >
      <CardHeader className="p-0 relative">
        <div className="aspect-square bg-gray-100 dark:bg-[#1a1a1a] rounded-t-lg overflow-hidden">
          <img
            src={product.imageUrl || "/api/placeholder/300/300"}
            alt={product.nameKo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        {product.isFeatured && (
          <Badge
            variant="destructive"
            className="absolute top-2 left-2 bg-red-500 text-white"
          >
            인기
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-[#1a1a1a]/80 dark:hover:bg-gray-800"
          onClick={(e) => handleToggleFavorite(e, product)}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
            {product.nameKo}
          </h3>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(product.basePrice)}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                4.5
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-500">
                (124)
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleAddToCart(e, product)}
              className="h-8 px-3 text-xs"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              담기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700"
      onClick={() => handleProductClick(product.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={product.imageUrl || "/api/placeholder/300/300"}
              alt={product.nameKo}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white text-base mb-1">
                  {product.nameKo}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {product.descriptionKo || product.description}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(product.basePrice)}
                  </span>
                  {product.isFeatured && (
                    <Badge
                      variant="destructive"
                      className="bg-red-500 text-white"
                    >
                      인기
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleToggleFavorite(e, product)}
                  className="h-8 w-8"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleAddToCart(e, product)}
                  className="h-8 px-3"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  담기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-[#1a1a1a] rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#1a1a1a] rounded-lg p-4"
                >
                  <div className="aspect-square bg-gray-200 dark:bg-[#1a1a1a] rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-[#1a1a1a] rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-20 dark:bg-[#1a1a1a] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            상품 목록
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            다양한 커스텀 굿즈를 만나보세요
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="상품명을 검색하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "price" | "featured")
              }
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white text-sm"
            >
              <option value="featured">인기순</option>
              <option value="name">이름순</option>
              <option value="price">가격순</option>
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              전체
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.nameKo}
              </Button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length}개의 상품이 있습니다
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">검색 결과가 없습니다</p>
                <p className="text-sm">다른 검색어나 카테고리를 시도해보세요</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
