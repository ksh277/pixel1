import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Filter, Grid3X3, List, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductListItem } from "@/components/ProductListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import type { Product, Category } from "@shared/schema";

export default function Products() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceFilters, setPriceFilters] = useState({
    under10k: false,
    between10k20k: false,
    over20k: false,
  });

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location) {
      case "/popular":
        return { ko: "인기상품", en: "Popular Items" };
      case "/new":
        return { ko: "신상품", en: "New Arrivals" };
      case "/trending":
        return { ko: "인기급상승", en: "Trending Now" };
      case "/picks":
        return { ko: "올댓추천", en: "Staff Picks" };
      case "/material":
        return { ko: "자재별 추천", en: "Material Recommendations" };
      case "/brand":
        return { ko: "브랜드 굿즈", en: "Brand Custom Goods" };
      case "/benefits":
        return { ko: "고객 혜택", en: "Customer Benefits" };
      default:
        return { ko: "전체 상품", en: "All Products" };
    }
  };

  const pageTitle = getPageTitle();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: () => api.getCategories(),
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", selectedCategory],
    queryFn: () =>
      api.getProducts(
        selectedCategory ? { category: parseInt(selectedCategory) } : {},
      ),
  });

  const handleAddToCart = (product: Product) => {
    toast({
      title: "장바구니에 추가됨",
      description: `${product.nameKo}이(가) 장바구니에 추가되었습니다.`,
    });
  };

  const handleToggleFavorite = (product: Product) => {
    toast({
      title: "찜 목록에 추가됨",
      description: `${product.nameKo}이(가) 찜 목록에 추가되었습니다.`,
    });
  };

  const handlePriceFilterChange = (filterType: string, checked: boolean) => {
    setPriceFilters((prev) => ({
      ...prev,
      [filterType]: checked,
    }));
  };

  const filteredProducts = products?.filter((product: Product) => {
    const matchesSearch =
      product.nameKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());

    // 가격 필터 적용
    const price = parseInt(product.basePrice);
    let matchesPrice = true;

    // 어떤 가격 필터도 선택되지 않았으면 모든 상품 표시
    const hasAnyPriceFilter =
      priceFilters.under10k ||
      priceFilters.between10k20k ||
      priceFilters.over20k;

    if (hasAnyPriceFilter) {
      matchesPrice = false;
      if (priceFilters.under10k && price < 10000) matchesPrice = true;
      if (priceFilters.between10k20k && price >= 10000 && price <= 20000)
        matchesPrice = true;
      if (priceFilters.over20k && price > 20000) matchesPrice = true;
    }

    return matchesSearch && matchesPrice;
  });

  const sortedProducts = filteredProducts?.sort((a: Product, b: Product) => {
    switch (sortBy) {
      case "price-low":
        return parseInt(a.basePrice) - parseInt(b.basePrice);
      case "price-high":
        return parseInt(b.basePrice) - parseInt(a.basePrice);
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });
  const popularProducts = (sortedProducts ?? []).filter((p) => p.isFeatured);
  const otherProducts = (sortedProducts ?? []).filter((p) => !p.isFeatured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t(pageTitle)}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t({
              ko: "나만의 디자인으로 특별한 굿즈를 만들어보세요",
              en: "Create special custom goods with your own design",
            })}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  필터
                </h3>

                {/* Search */}
                <div className="mb-6">
                  <Label
                    htmlFor="search"
                    className="text-sm font-medium text-foreground mb-2 block"
                  >
                    검색
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="제품 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Categories */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    카테고리
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="all-categories"
                        checked={selectedCategory === ""}
                        onCheckedChange={() => setSelectedCategory("")}
                      />
                      <Label htmlFor="all-categories" className="text-sm">
                        전체
                      </Label>
                    </div>
                    {categoriesLoading ? (
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="h-6 bg-muted rounded animate-pulse"
                          />
                        ))}
                      </div>
                    ) : (
                      categories?.map((category: Category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={
                              selectedCategory === category.id.toString()
                            }
                            onCheckedChange={() =>
                              setSelectedCategory(category.id.toString())
                            }
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="text-sm"
                          >
                            {category.nameKo}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Price Range */}
                <div className="mb-6">
                  <Label className="text-sm font-medium text-foreground mb-3 block">
                    가격 범위
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="price-under-10k"
                        checked={priceFilters.under10k}
                        onCheckedChange={(checked) =>
                          handlePriceFilterChange(
                            "under10k",
                            checked as boolean,
                          )
                        }
                      />
                      <Label htmlFor="price-under-10k" className="text-sm">
                        10,000원 미만
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="price-10k-20k"
                        checked={priceFilters.between10k20k}
                        onCheckedChange={(checked) =>
                          handlePriceFilterChange(
                            "between10k20k",
                            checked as boolean,
                          )
                        }
                      />
                      <Label htmlFor="price-10k-20k" className="text-sm">
                        10,000원 - 20,000원
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="price-over-20k"
                        checked={priceFilters.over20k}
                        onCheckedChange={(checked) =>
                          handlePriceFilterChange("over20k", checked as boolean)
                        }
                      />
                      <Label htmlFor="price-over-20k" className="text-sm">
                        20,000원 이상
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {sortedProducts?.length || 0}개의 제품
                </span>
                {selectedCategory && (
                  <Badge variant="secondary">
                    {
                      categories?.find(
                        (c: Category) => c.id.toString() === selectedCategory,
                      )?.nameKo
                    }
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="정렬 기준" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">인기순</SelectItem>
                    <SelectItem value="newest">최신순</SelectItem>
                    <SelectItem value="price-low">가격 낮은 순</SelectItem>
                    <SelectItem value="price-high">가격 높은 순</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="px-3"
                  >
                    <Grid3X3 className="h-4 w-4" />
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
            {productsLoading ? (
              <div
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
              >
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="h-64 bg-muted"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="h-8 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedProducts?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <SlidersHorizontal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">검색 결과가 없습니다</p>
                  <p className="text-sm">다른 키워드나 필터를 사용해보세요</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                  }}
                >
                  필터 초기화
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">🔥 인기상품</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {popularProducts.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="rounded-xl overflow-hidden shadow-md bg-white h-[270px]"
                    >
                      <img
                        src={product.imageUrl}
                        alt={language === "ko" ? product.nameKo : product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <h2 className="text-xl font-bold mb-4">📦 전체 상품</h2>
                <div className="space-y-4">
                  {otherProducts.map((product) => (
                    <ProductListItem key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
