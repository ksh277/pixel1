import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, Star, Calendar, User, Filter, Search, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { BelugaMascot } from "@/components/BelugaMascot";

interface ReviewData {
  id: number;
  productId: number;
  productName: string;
  productNameKo: string;
  productImage: string;
  rating: number;
  reviewText: string;
  reviewerNickname: string;
  reviewDate: string;
  isHot: boolean;
  totalReviews: number;
  productCategory: string;
}

const allReviewsData: ReviewData[] = [
  {
    id: 1,
    productId: 1,
    productName: "Acrylic Keyring",
    productNameKo: "아크릴 키링",
    productImage: "/api/placeholder/300/300",
    rating: 5,
    reviewText: "퀄리티가 정말 좋아요! 디자인도 깨끗하게 나왔고 배송도 빨랐습니다. 다음에 또 주문할게요. 색상도 선명하고 두께감도 적당해서 만족합니다.",
    reviewerNickname: "작가님***",
    reviewDate: "2024.12.15",
    isHot: true,
    totalReviews: 127,
    productCategory: "keyring"
  },
  {
    id: 2,
    productId: 2,
    productName: "Acrylic Stand",
    productNameKo: "아크릴 스탠드",
    productImage: "/api/placeholder/300/300",
    rating: 4,
    reviewText: "생각보다 두께감이 있어서 안정적이에요. 색상도 예쁘게 나왔습니다. 책상 위에 놓으니 포인트가 되네요. 다만 가격이 조금 비싸긴 해요.",
    reviewerNickname: "디자이너***",
    reviewDate: "2024.12.14",
    isHot: true,
    totalReviews: 89,
    productCategory: "stand"
  },
  {
    id: 3,
    productId: 3,
    productName: "Smart Tok",
    productNameKo: "스마트톡",
    productImage: "/api/placeholder/300/300",
    rating: 5,
    reviewText: "홀로그램 효과가 진짜 예뻐요! 친구들이 어디서 만들었냐고 계속 물어봐요. 접착력도 좋고 스마트폰 거치대로도 훌륭합니다.",
    reviewerNickname: "크리에이터***",
    reviewDate: "2024.12.13",
    isHot: false,
    totalReviews: 156,
    productCategory: "smarttok"
  },
  {
    id: 4,
    productId: 4,
    productName: "Photo Card Holder",
    productNameKo: "포카홀더",
    productImage: "/api/placeholder/300/300",
    rating: 5,
    reviewText: "사이즈가 딱 맞고 마감처리도 깔끔해요. 포카 보관용으로 최고입니다! 투명도도 높아서 포카가 잘 보여요.",
    reviewerNickname: "아티스트***",
    reviewDate: "2024.12.12",
    isHot: true,
    totalReviews: 203,
    productCategory: "holder"
  },
  {
    id: 5,
    productId: 5,
    productName: "Acrylic Badge",
    productNameKo: "아크릴 뱃지",
    productImage: "/api/placeholder/300/300",
    rating: 4,
    reviewText: "뱃지 퀄리티가 좋네요. 핀도 튼튼하고 디자인이 선명하게 나왔어요. 가방에 달고 다니기 좋습니다.",
    reviewerNickname: "일러스터***",
    reviewDate: "2024.12.11",
    isHot: false,
    totalReviews: 78,
    productCategory: "badge"
  },
  {
    id: 6,
    productId: 6,
    productName: "Hologram Keyring",
    productNameKo: "홀로그램 키링",
    productImage: "/api/placeholder/300/300",
    rating: 5,
    reviewText: "홀로그램 효과가 정말 예뻐요! 빛에 따라 색이 변하는 게 신기해요. 친구들 선물로도 좋을 것 같아요.",
    reviewerNickname: "그래픽***",
    reviewDate: "2024.12.10",
    isHot: true,
    totalReviews: 164,
    productCategory: "keyring"
  },
  {
    id: 7,
    productId: 7,
    productName: "Mirror Acrylic",
    productNameKo: "거울 아크릴",
    productImage: "/api/placeholder/300/300",
    rating: 4,
    reviewText: "거울 효과가 깔끔해요. 반사도 잘 되고 스크래치도 잘 안 나는 것 같아요. 포장도 꼼꼼하게 해주셨네요.",
    reviewerNickname: "웹툰***",
    reviewDate: "2024.12.09",
    isHot: false,
    totalReviews: 95,
    productCategory: "keyring"
  },
  {
    id: 8,
    productId: 8,
    productName: "Acrylic Shaker",
    productNameKo: "아크릴 셰이커",
    productImage: "/api/placeholder/300/300",
    rating: 5,
    reviewText: "셰이커 안에 있는 글리터가 정말 예뻐요! 흔들 때마다 반짝반짝 빛나는 게 매력적이에요. 아이들이 특히 좋아해요.",
    reviewerNickname: "만화가***",
    reviewDate: "2024.12.08",
    isHot: true,
    totalReviews: 142,
    productCategory: "shaker"
  }
];

type SortOption = "latest" | "oldest" | "rating-high" | "rating-low";
type FilterOption = "all" | "keyring" | "stand" | "smarttok" | "holder" | "badge" | "shaker";

export default function ReviewsAll() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = allReviewsData;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(review => 
        review.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.productNameKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterBy !== "all") {
      filtered = filtered.filter(review => review.productCategory === filterBy);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.reviewDate.replace(/\./g, '-')).getTime() - new Date(a.reviewDate.replace(/\./g, '-')).getTime();
        case "oldest":
          return new Date(a.reviewDate.replace(/\./g, '-')).getTime() - new Date(b.reviewDate.replace(/\./g, '-')).getTime();
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, sortBy, filterBy]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1F2D4A]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1F2D4A] shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t({ ko: "홈으로", en: "Back to Home", ja: "ホームへ", zh: "回到首页" })}
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                  {t({ ko: "홈", en: "Home", ja: "ホーム", zh: "首页" })}
                </Link>
                <span>›</span>
                <span className="text-gray-900 dark:text-white">
                  {t({ ko: "전체 후기", en: "All Reviews", ja: "全てのレビュー", zh: "所有评价" })}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t({ ko: "총", en: "Total", ja: "合計", zh: "总计" })} {filteredAndSortedReviews.length}
              {t({ ko: "개의 후기", en: " reviews", ja: "件のレビュー", zh: "条评价" })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t({
                  ko: "전체 창작자 후기",
                  en: "All Creator Reviews",
                  ja: "全クリエイターレビュー",
                  zh: "所有创作者评价"
                })}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t({
                  ko: "우리 서비스를 이용한 창작자들의 솔직한 후기를 모두 확인해보세요",
                  en: "Check out all honest reviews from creators who used our service",
                  ja: "私たちのサービスを利用したクリエイターの正直なレビューをすべてご確認ください",
                  zh: "查看所有使用我们服务的创作者的真实评价"
                })}
              </p>
            </div>
            <div className="hidden md:block">
              <BelugaMascot variant="review" />
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t({ ko: "후기 검색...", en: "Search reviews...", ja: "レビューを検索...", zh: "搜索评价..." })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter and Sort */}
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t({ ko: "카테고리", en: "Category", ja: "カテゴリ", zh: "分类" })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t({ ko: "전체", en: "All", ja: "全て", zh: "全部" })}</SelectItem>
                <SelectItem value="keyring">{t({ ko: "키링", en: "Keyring", ja: "キーリング", zh: "钥匙链" })}</SelectItem>
                <SelectItem value="stand">{t({ ko: "스탠드", en: "Stand", ja: "スタンド", zh: "支架" })}</SelectItem>
                <SelectItem value="smarttok">{t({ ko: "스마트톡", en: "Smart Tok", ja: "スマートトーク", zh: "手机支架" })}</SelectItem>
                <SelectItem value="holder">{t({ ko: "홀더", en: "Holder", ja: "ホルダー", zh: "卡套" })}</SelectItem>
                <SelectItem value="badge">{t({ ko: "뱃지", en: "Badge", ja: "バッジ", zh: "徽章" })}</SelectItem>
                <SelectItem value="shaker">{t({ ko: "셰이커", en: "Shaker", ja: "シェーカー", zh: "摇摆器" })}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t({ ko: "정렬", en: "Sort", ja: "並び替え", zh: "排序" })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">{t({ ko: "최신순", en: "Latest", ja: "最新順", zh: "最新" })}</SelectItem>
                <SelectItem value="oldest">{t({ ko: "오래된순", en: "Oldest", ja: "古い順", zh: "最旧" })}</SelectItem>
                <SelectItem value="rating-high">{t({ ko: "평점 높은순", en: "High Rating", ja: "評価高い順", zh: "高评分" })}</SelectItem>
                <SelectItem value="rating-low">{t({ ko: "평점 낮은순", en: "Low Rating", ja: "評価低い順", zh: "低评分" })}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reviews Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAndSortedReviews.map((review) => (
            <motion.div key={review.id} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer dark:bg-[#1F2D4A] dark:border-gray-700">
                <Link href={`/reviews/${review.id}`}>
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                      <img
                        src={review.productImage}
                        alt={language === 'ko' ? review.productNameKo : review.productName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/api/placeholder/300/300";
                        }}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-2">
                        {review.isHot && (
                          <Badge className="bg-red-500 text-white text-xs font-bold">
                            HOT
                          </Badge>
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-black/70 text-white text-xs">
                          {review.totalReviews} {t({ ko: "리뷰", en: "reviews", ja: "レビュー", zh: "评价" })}
                        </Badge>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="p-4 space-y-3">
                      {/* Product Name */}
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        {language === 'ko' ? review.productNameKo : review.productName}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                          {review.rating}.0
                        </span>
                      </div>

                      {/* Full Review Text */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {review.reviewText}
                      </p>

                      {/* Reviewer Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t dark:border-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{review.reviewerNickname}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{review.reviewDate}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredAndSortedReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
              {t({ ko: "검색 결과가 없습니다", en: "No reviews found", ja: "レビューが見つかりません", zh: "未找到评价" })}
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {t({ ko: "다른 검색어나 필터를 시도해보세요", en: "Try different search terms or filters", ja: "異なる検索語やフィルターを試してください", zh: "请尝试其他搜索词或筛选条件" })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}