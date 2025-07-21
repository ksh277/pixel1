import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  Package,
  Star,
  Heart,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface Product {
  id: string;
  name: string;
  name_ko: string;
  description: string;
  description_ko: string;
  base_price: number;
  category_id: string;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  categories?: {
    id: string;
    name: string;
    name_ko: string;
  };
}

interface Category {
  id: string;
  name: string;
  name_ko: string;
  description: string;
  description_ko: string;
  is_active: boolean;
}

interface FilterState {
  searchText: string;
  selectedCategories: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  viewMode: 'grid' | 'list';
  showFeaturedOnly: boolean;
  showActiveOnly: boolean;
}

export default function ProductSearchPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  
  // Get search params from URL
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchText: initialSearch,
    selectedCategories: initialCategory ? [initialCategory] : [],
    minPrice: 0,
    maxPrice: 100000,
    sortBy: 'name',
    viewMode: 'grid',
    showFeaturedOnly: false,
    showActiveOnly: true,
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Categories query
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Products query with filters
  const { data: products, isLoading: productsLoading, refetch } = useQuery({
    queryKey: ['products', 'search', filters],
    queryFn: async () => {
      setIsSearching(true);
      
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
      if (filters.searchText.trim()) {
        query = query.or(
          `name.ilike.%${filters.searchText}%,name_ko.ilike.%${filters.searchText}%,description.ilike.%${filters.searchText}%,description_ko.ilike.%${filters.searchText}%`
        );
      }

      // Apply category filter
      if (filters.selectedCategories.length > 0) {
        query = query.in('category_id', filters.selectedCategories);
      }

      // Apply price range filter
      if (filters.minPrice > 0 || filters.maxPrice < 100000) {
        query = query.gte('base_price', filters.minPrice).lte('base_price', filters.maxPrice);
      }

      // Apply featured filter
      if (filters.showFeaturedOnly) {
        query = query.eq('is_featured', true);
      }

      // Apply active filter
      if (filters.showActiveOnly) {
        query = query.eq('is_active', true);
      }

      // Apply sorting
      switch (filters.sortBy) {
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

      const { data, error } = await query;
      
      setIsSearching(false);
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: true
  });

  // Update URL with current filters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.searchText) params.set('q', filters.searchText);
    if (filters.selectedCategories.length > 0) {
      params.set('category', filters.selectedCategories.join(','));
    }
    if (filters.minPrice > 0) params.set('min_price', filters.minPrice.toString());
    if (filters.maxPrice < 100000) params.set('max_price', filters.maxPrice.toString());
    if (filters.sortBy !== 'name') params.set('sort', filters.sortBy);
    if (filters.showFeaturedOnly) params.set('featured', '1');
    
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    if (location !== newUrl) {
      setLocation(newUrl);
    }
  }, [filters, location, setLocation]);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      searchText: value
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId]
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchText: '',
      selectedCategories: [],
      minPrice: 0,
      maxPrice: 100000,
      sortBy: 'name',
      viewMode: 'grid',
      showFeaturedOnly: false,
      showActiveOnly: true,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(price);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchText) count++;
    if (filters.selectedCategories.length > 0) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 100000) count++;
    if (filters.showFeaturedOnly) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            상품 검색
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="상품명으로 검색하세요..."
              value={filters.searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
            {filters.searchText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSearchChange('')}
                className="absolute right-2 top-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filters and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    필터
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {getActiveFiltersCount()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      초기화
                    </Button>
                  </div>
                </div>

                <Accordion type="multiple" defaultValue={['categories', 'price', 'features']}>
                  {/* Categories */}
                  <AccordionItem value="categories">
                    <AccordionTrigger className="text-sm font-medium">
                      카테고리
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {categoriesLoading ? (
                          <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded animate-pulse" />
                            ))}
                          </div>
                        ) : (
                          categories?.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={category.id}
                                checked={filters.selectedCategories.includes(category.id)}
                                onCheckedChange={() => handleCategoryToggle(category.id)}
                              />
                              <label
                                htmlFor={category.id}
                                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                              >
                                {category.name_ko || category.name}
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Price Range */}
                  <AccordionItem value="price">
                    <AccordionTrigger className="text-sm font-medium">
                      가격 범위
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">최소</label>
                            <Input
                              type="number"
                              value={filters.minPrice}
                              onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.maxPrice)}
                              className="text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400">최대</label>
                            <Input
                              type="number"
                              value={filters.maxPrice}
                              onChange={(e) => handlePriceRangeChange(filters.minPrice, Number(e.target.value))}
                              className="text-sm"
                              placeholder="100000"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatPrice(filters.minPrice)}</span>
                          <span>~</span>
                          <span>{formatPrice(filters.maxPrice)}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Features */}
                  <AccordionItem value="features">
                    <AccordionTrigger className="text-sm font-medium">
                      특징
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="featured"
                            checked={filters.showFeaturedOnly}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({ ...prev, showFeaturedOnly: !!checked }))
                            }
                          />
                          <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                            인기상품만
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="active"
                            checked={filters.showActiveOnly}
                            onCheckedChange={(checked) => 
                              setFilters(prev => ({ ...prev, showActiveOnly: !!checked }))
                            }
                          />
                          <label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                            판매중인 상품만
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {productsLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      검색 중...
                    </div>
                  ) : (
                    `총 ${products?.length || 0}개 상품`
                  )}
                </span>
                {filters.searchText && (
                  <Badge variant="outline">
                    "{filters.searchText}"
                  </Badge>
                )}
                {filters.selectedCategories.length > 0 && (
                  <Badge variant="outline">
                    {filters.selectedCategories.length}개 카테고리
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={filters.sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">이름순</SelectItem>
                    <SelectItem value="price_low">가격 낮은순</SelectItem>
                    <SelectItem value="price_high">가격 높은순</SelectItem>
                    <SelectItem value="newest">최신순</SelectItem>
                    <SelectItem value="featured">인기순</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, viewMode: prev.viewMode === 'grid' ? 'list' : 'grid' }))}
                >
                  {filters.viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Results Grid */}
            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-[#1a1a1a] rounded-t-lg" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded mb-2" />
                      <div className="h-3 bg-gray-200 dark:bg-[#1a1a1a] rounded mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className={`grid gap-6 ${
                filters.viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700">
                      <div className="relative">
                        <img
                          src={product.image_url || '/api/placeholder/400/300'}
                          alt={product.name_ko || product.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 left-2 flex space-x-1">
                          {product.is_featured && (
                            <Badge className="bg-red-500 text-white">
                              인기
                            </Badge>
                          )}
                          {product.categories && (
                            <Badge variant="secondary">
                              {product.categories.name_ko || product.categories.name}
                            </Badge>
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                            {product.name_ko || product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                          {product.description_ko || product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatPrice(product.base_price)}
                          </span>
                          <Button size="sm" variant="outline">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            담기
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  다른 검색어나 필터를 시도해보세요.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  필터 초기화
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}