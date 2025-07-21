import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { ProductCard } from "@/components/ProductCard";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@shared/schema";

export default function SearchResults() {
  const { t } = useLanguage();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // URL에서 검색어 추출
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialQuery = urlParams.get('query') || urlParams.get('keyword') || '';
  
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      // 검색 기록에 추가
      setSearchHistory(prev => {
        const newHistory = [initialQuery, ...prev.filter(h => h !== initialQuery)].slice(0, 5);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        return newHistory;
      });
    }
    
    // 로컬 스토리지에서 검색 기록 로드
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, [initialQuery]);

  // 상품 데이터 가져오기 (검색 API 사용)
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/search", searchQuery, selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory !== "all") params.append('category', selectedCategory);
      if (priceRange !== "all") params.append('priceRange', priceRange);
      if (sortBy) params.append('sortBy', sortBy);
      
      const response = await fetch(`/api/products/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      return response.json();
    },
  });

  // 검색 결과는 백엔드에서 이미 필터링되어 옴
  const sortedProducts = products;

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query);
      setLocation(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleRemoveHistory = (item: string) => {
    const newHistory = searchHistory.filter(h => h !== item);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const categories = [
    { id: "all", name: { ko: "전체", en: "All", ja: "すべて", zh: "全部" } },
    { id: "1", name: { ko: "아크릴굿즈", en: "Acrylic Goods", ja: "アクリルグッズ", zh: "亚克力商品" } },
    { id: "2", name: { ko: "우드굿즈", en: "Wood Goods", ja: "ウッドグッズ", zh: "木制商品" } },
    { id: "3", name: { ko: "랜야드굿즈", en: "Lanyard Goods", ja: "ランヤードグッズ", zh: "挂绳商品" } },
    { id: "4", name: { ko: "포장/부자재", en: "Packaging", ja: "パッケージ", zh: "包装" } },
  ];

  const priceRanges = [
    { id: "all", name: { ko: "전체 가격", en: "All Prices", ja: "すべての価格", zh: "所有价格" } },
    { id: "under10", name: { ko: "1만원 미만", en: "Under ₩10,000", ja: "1万円未満", zh: "1万韩元以下" } },
    { id: "10to30", name: { ko: "1만원 ~ 3만원", en: "₩10,000 ~ ₩30,000", ja: "1万円 ~ 3万円", zh: "1-3万韩元" } },
    { id: "30to50", name: { ko: "3만원 ~ 5만원", en: "₩30,000 ~ ₩50,000", ja: "3万円 ~ 5万円", zh: "3-5万韩元" } },
    { id: "over50", name: { ko: "5만원 이상", en: "Over ₩50,000", ja: "5万円以上", zh: "5万韩元以上" } },
  ];

  const sortOptions = [
    { id: "latest", name: { ko: "최신순", en: "Latest", ja: "最新順", zh: "最新" } },
    { id: "popular", name: { ko: "인기순", en: "Popular", ja: "人気順", zh: "热门" } },
    { id: "priceLow", name: { ko: "낮은 가격순", en: "Price: Low to High", ja: "価格: 安い順", zh: "价格: 低到高" } },
    { id: "priceHigh", name: { ko: "높은 가격순", en: "Price: High to Low", ja: "価格: 高い順", zh: "价格: 高到低" } },
    { id: "name", name: { ko: "이름순", en: "Name", ja: "名前順", zh: "名称" } },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 검색 헤더 */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-5 h-5 text-gray-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t({ ko: "상품 검색", en: "Product Search", ja: "商品検索", zh: "商品搜索" })}
              </h1>
            </div>
            
            {/* 검색창 */}
            <div className="flex space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t({ ko: "상품명을 입력하세요", en: "Enter product name", ja: "商品名を入力", zh: "输入商品名称" })}
                  className="pl-10 pr-4 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                />
              </div>
              <Button 
                onClick={() => handleSearch(searchQuery)}
                className="h-12 px-6"
              >
                {t({ ko: "검색", en: "Search", ja: "検索", zh: "搜索" })}
              </Button>
            </div>

            {/* 검색 기록 */}
            {searchHistory.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t({ ko: "최근 검색", en: "Recent Searches", ja: "最近の検索", zh: "最近搜索" })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 pr-1"
                    >
                      <span onClick={() => handleSearch(item)}>{item}</span>
                      <button
                        onClick={() => handleRemoveHistory(item)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 필터 및 정렬 */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t({ ko: "카테고리", en: "Category", ja: "カテゴリ", zh: "类别" })} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {t(category.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t({ ko: "가격대", en: "Price Range", ja: "価格帯", zh: "价格范围" })} />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.id} value={range.id}>
                      {t(range.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t({ ko: "정렬", en: "Sort", ja: "並び替え", zh: "排序" })} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {t(option.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 검색 결과 */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {searchQuery ? (
                <>
                  "<span className="font-medium">{searchQuery}</span>" {t({ ko: "검색 결과", en: "search results", ja: "検索結果", zh: "搜索结果" })} {sortedProducts.length}{t({ ko: "개", en: " items", ja: "件", zh: "个" })}
                </>
              ) : (
                <>
                  {t({ ko: "전체 상품", en: "All Products", ja: "すべての商品", zh: "所有商品" })} {sortedProducts.length}{t({ ko: "개", en: " items", ja: "件", zh: "个" })}
                </>
              )}
            </p>
          </div>

          {/* 상품 그리드 */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-[#1a1a1a] rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-[#1a1a1a] rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-[#1a1a1a] rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    {t({ ko: "검색 결과가 없습니다", en: "No search results", ja: "検索結果がありません", zh: "没有搜索结果" })}
                  </h3>
                  <p className="text-sm">
                    {t({ ko: "다른 검색어로 다시 시도해보세요", en: "Try searching with different keywords", ja: "他のキーワードで再試行してください", zh: "请尝试其他关键词" })}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}