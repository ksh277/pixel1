import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Grid, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { useLanguage } from "@/hooks/useLanguage";

interface Product {
  id: number;
  name: string;
  nameEn?: string;
  basePrice: string;
  description?: string;
  images?: string[];
  category?: string;
  featured?: boolean;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  nameEn?: string;
}

const ProductList = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilters, setPriceFilters] = useState({
    under10k: false,
    between10k20k: false,
    over20k: false,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product: Product) => {
      // Search filter
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.nameEn && product.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        (product.category && selectedCategories.includes(product.category));

      // Price filter
      let matchesPrice = !priceFilters.under10k && !priceFilters.between10k20k && !priceFilters.over20k;
      if (!matchesPrice) {
        const price = parseInt(product.basePrice);
        if (priceFilters.under10k && price < 10000) matchesPrice = true;
        if (priceFilters.between10k20k && price >= 10000 && price <= 20000) matchesPrice = true;
        if (priceFilters.over20k && price > 20000) matchesPrice = true;
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategories, priceFilters]);

  const sortedProducts = useMemo(() => {
    if (!filteredProducts) return [];

    return [...filteredProducts].sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "price-low":
          return parseInt(a.basePrice) - parseInt(b.basePrice);
        case "price-high":
          return parseInt(b.basePrice) - parseInt(a.basePrice);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [filteredProducts, sortBy]);

  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked 
        ? [...prev, categoryName]
        : prev.filter(cat => cat !== categoryName)
    );
  };

  const handlePriceFilterChange = (filterKey: string, checked: boolean) => {
    setPriceFilters(prev => ({ ...prev, [filterKey]: checked }));
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t({ ko: "전체 상품", en: "All Products", ja: "全商品", zh: "全部商品" })}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t({ 
              ko: "다양한 맞춤 인쇄 상품을 만나보세요", 
              en: "Discover various custom printing products",
              ja: "様々なカスタム印刷商品をご覧ください",
              zh: "发现各种定制印刷产品"
            })}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  {t({ ko: "필터", en: "Filters", ja: "フィルター", zh: "筛选" })}
                </h3>

                {/* Search */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                    {t({ ko: "검색", en: "Search", ja: "検索", zh: "搜索" })}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder={t({ ko: "제품 검색...", en: "Search products...", ja: "商品検索...", zh: "搜索商品..." })}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div className="mb-6">
                    <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
                      {t({ ko: "카테고리", en: "Categories", ja: "カテゴリー", zh: "分类" })}
                    </Label>
                    <div className="space-y-2">
                      {categories.map((category: Category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.name)}
                            onCheckedChange={(checked) => 
                              handleCategoryChange(category.name, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`category-${category.id}`}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Filters */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white mb-3 block">
                    {t({ ko: "가격대", en: "Price Range", ja: "価格帯", zh: "价格区间" })}
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="under10k"
                        checked={priceFilters.under10k}
                        onCheckedChange={(checked) => 
                          handlePriceFilterChange("under10k", checked as boolean)
                        }
                      />
                      <Label htmlFor="under10k" className="text-sm text-gray-700 dark:text-gray-300">
                        ₩10,000 {t({ ko: "미만", en: "under", ja: "未満", zh: "以下" })}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="between10k20k"
                        checked={priceFilters.between10k20k}
                        onCheckedChange={(checked) => 
                          handlePriceFilterChange("between10k20k", checked as boolean)
                        }
                      />
                      <Label htmlFor="between10k20k" className="text-sm text-gray-700 dark:text-gray-300">
                        ₩10,000 - ₩20,000
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="over20k"
                        checked={priceFilters.over20k}
                        onCheckedChange={(checked) => 
                          handlePriceFilterChange("over20k", checked as boolean)
                        }
                      />
                      <Label htmlFor="over20k" className="text-sm text-gray-700 dark:text-gray-300">
                        ₩20,000 {t({ ko: "이상", en: "over", ja: "以上", zh: "以上" })}
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {sortedProducts.length}개의 상품
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">
                      {t({ ko: "이름순", en: "Name", ja: "名前順", zh: "按名称" })}
                    </SelectItem>
                    <SelectItem value="price-low">
                      {t({ ko: "가격 낮은순", en: "Price: Low to High", ja: "価格: 安い順", zh: "价格：低到高" })}
                    </SelectItem>
                    <SelectItem value="price-high">
                      {t({ ko: "가격 높은순", en: "Price: High to Low", ja: "価格: 高い順", zh: "价格：高到低" })}
                    </SelectItem>
                    <SelectItem value="newest">
                      {t({ ko: "최신순", en: "Newest", ja: "新しい順", zh: "最新" })}
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="px-3"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                : "space-y-4"
            }>
              {sortedProducts.map((product: Product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Empty State */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 mb-2">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t({ ko: "검색 결과가 없습니다", en: "No products found", ja: "商品が見つかりません", zh: "未找到商品" })}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t({ 
                    ko: "다른 검색어나 필터를 시도해보세요", 
                    en: "Try different keywords or filters",
                    ja: "別のキーワードやフィルターをお試しください",
                    zh: "尝试其他关键词或筛选条件"
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;