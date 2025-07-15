import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  productNameKo: string;
  thumbnail: string;
  averageRating: number;
  reviewCount: number;
  category: string;
  isNew: boolean;
  isPopular: boolean;
  isTrending: boolean;
  totalOrders: number;
}

const mockProductReviews: ProductReview[] = [
  {
    id: "1",
    productId: "1",
    productName: "Acrylic Keychain",
    productNameKo: "아크릴 키링",
    thumbnail: "/api/placeholder/150/150",
    averageRating: 4.9,
    reviewCount: 1247,
    category: "키링",
    isNew: false,
    isPopular: true,
    isTrending: true,
    totalOrders: 3456
  },
  {
    id: "2",
    productId: "2",
    productName: "Hologram Sticker",
    productNameKo: "홀로그램 스티커",
    thumbnail: "/api/placeholder/150/150",
    averageRating: 4.8,
    reviewCount: 892,
    category: "스티커",
    isNew: true,
    isPopular: false,
    isTrending: true,
    totalOrders: 2134
  },
  {
    id: "3",
    productId: "3",
    productName: "Acrylic Stand",
    productNameKo: "아크릴 스탠드",
    thumbnail: "/api/placeholder/150/150",
    averageRating: 4.7,
    reviewCount: 567,
    category: "스탠드",
    isNew: false,
    isPopular: true,
    isTrending: false,
    totalOrders: 1678
  },
  {
    id: "4",
    productId: "4",
    productName: "Smart Tok",
    productNameKo: "스마트톡",
    thumbnail: "/api/placeholder/150/150",
    averageRating: 4.6,
    reviewCount: 423,
    category: "스마트톡",
    isNew: true,
    isPopular: false,
    isTrending: true,
    totalOrders: 987
  },
  {
    id: "5",
    productId: "5",
    productName: "Photo Card Holder",
    productNameKo: "포토카드 홀더",
    thumbnail: "/api/placeholder/150/150",
    averageRating: 4.8,
    reviewCount: 756,
    category: "홀더",
    isNew: false,
    isPopular: true,
    isTrending: false,
    totalOrders: 2345
  },
  {
    id: "6",
    productId: "6",
    productName: "Custom Badge",
    productNameKo: "커스텀 배지",
    thumbnail: "/api/placeholder/150/150",
    averageRating: 4.5,
    reviewCount: 234,
    category: "배지",
    isNew: true,
    isPopular: false,
    isTrending: false,
    totalOrders: 654
  },
  {
    id: "7",
    productId: "7",
    productName: "Shaker Keychain",
    productNameKo: "셰이커 키링",
    thumbnail: "/api/placeholder/150/150",
    averageRating: 4.9,
    reviewCount: 1089,
    category: "키링",
    isNew: false,
    isPopular: true,
    isTrending: true,
    totalOrders: 2987
  },
  {
    id: "8",
    productId: "8",
    productName: "Carabiner Keychain",
    productNameKo: "카라비너 키링",
    thumbnail: "/api/placeholder/150/150",
    averageRating: 4.4,
    reviewCount: 321,
    category: "키링",
    isNew: false,
    isPopular: false,
    isTrending: false,
    totalOrders: 876
  },
  {
    id: "9",
    productId: "9",
    productName: "Mirror Acrylic",
    productNameKo: "거울 아크릴",
    thumbnail: "/api/placeholder/150/150",
    averageRating: 4.7,
    reviewCount: 445,
    category: "거울",
    isNew: true,
    isPopular: false,
    isTrending: true,
    totalOrders: 1234
  },
  {
    id: "10",
    productId: "10",
    productName: "Magnet Set",
    productNameKo: "자석 세트",
    thumbnail: "/api/placeholder/150/150",
    averageRating: 4.6,
    reviewCount: 298,
    category: "자석",
    isNew: false,
    isPopular: false,
    isTrending: false,
    totalOrders: 567
  }
];

export function AllReviewsListSection() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(mockProductReviews.length / itemsPerPage));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(mockProductReviews.length / itemsPerPage)) % Math.ceil(mockProductReviews.length / itemsPerPage));
  };

  const visibleReviews = mockProductReviews.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

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
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t({ ko: "사용 후기 모음", en: "Product Reviews Collection", ja: "使用レビュー集", zh: "产品评论合集" })}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {t({ ko: "실제 구매고객들의 생생한 후기를 확인해보세요", en: "Check out authentic reviews from real customers", ja: "実際の購入者の生の声をご確認ください", zh: "查看真实客户的真实评价" })}
          </p>
        </motion.div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t({ ko: "이전", en: "Previous", ja: "前へ", zh: "上一个" })}
          </Button>

          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(mockProductReviews.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex === Math.ceil(mockProductReviews.length / itemsPerPage) - 1}
          >
            {t({ ko: "다음", en: "Next", ja: "次へ", zh: "下一个" })}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Reviews List */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-[#1F2D4A] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex gap-6 overflow-x-auto pb-4">
            {visibleReviews.map((review, index) => (
              <motion.div
                key={review.id}
                variants={itemVariants}
                className="flex-shrink-0 w-64"
              >
                <Link href={`/product/${review.productId}`}>
                  <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white dark:bg-[#1F2D4A] border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <img
                          src={review.thumbnail}
                          alt={review.productNameKo}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        
                        {/* Overlay badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {review.isNew && (
                            <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
                          )}
                          {review.isPopular && (
                            <Badge className="bg-red-500 text-white text-xs">인기상품</Badge>
                          )}
                          {review.isTrending && (
                            <Badge className="bg-orange-500 text-white text-xs flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              HOT
                            </Badge>
                          )}
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 text-xs dark:text-white">
                            {review.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                          {review.productNameKo}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {renderStars(review.averageRating)}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {review.averageRating}
                          </span>
                        </div>

                        {/* Review Count */}
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                          <span>
                            {t({ ko: "리뷰", en: "Reviews", ja: "レビュー", zh: "评论" })} {review.reviewCount.toLocaleString()}개
                          </span>
                          <span>
                            {t({ ko: "주문", en: "Orders", ja: "注文", zh: "订单" })} {review.totalOrders.toLocaleString()}건
                          </span>
                        </div>

                        {/* Review Preview */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {t({ ko: "최근 리뷰", en: "Recent Review", ja: "最近のレビュー", zh: "最新评论" })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {review.averageRating >= 4.8 ? 
                              t({ ko: "품질이 정말 좋아요! 색감도 선명하고 만족스럽습니다.", en: "Quality is really good! Colors are vivid and satisfying.", ja: "品質が本当に良いです！色も鮮明で満足です。", zh: "质量真的很好！颜色鲜艳，很满意。" }) :
                              t({ ko: "생각보다 좋네요. 배송도 빠르고 포장도 깔끔했어요.", en: "Better than expected. Fast shipping and neat packaging.", ja: "思ったより良いです。配送も速く、包装も綺麗でした。", zh: "比预期的好。发货快，包装整洁。" })
                            }
                          </p>
                        </div>

                        {/* Action Button */}
                        <Button size="sm" variant="outline" className="w-full text-xs dark:border-gray-600 dark:text-gray-200">
                          {t({ ko: "후기 전체보기", en: "View All Reviews", ja: "全レビューを見る", zh: "查看所有评论" })}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {mockProductReviews.reduce((sum, review) => sum + review.reviewCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t({ ko: "총 후기", en: "Total Reviews", ja: "総レビュー", zh: "总评论" })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockProductReviews.reduce((sum, review) => sum + review.totalOrders, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t({ ko: "총 주문", en: "Total Orders", ja: "総注文", zh: "总订单" })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {(mockProductReviews.reduce((sum, review) => sum + review.averageRating, 0) / mockProductReviews.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t({ ko: "평균 평점", en: "Average Rating", ja: "平均評価", zh: "平均评分" })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {mockProductReviews.filter(review => review.averageRating >= 4.5).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t({ ko: "4.5점 이상", en: "4.5+ Rating", ja: "4.5点以上", zh: "4.5分以上" })}
            </div>
          </div>
        </motion.div>

        {/* View All Button */}
        <motion.div variants={itemVariants} className="text-center">
          <Link href="/reviews/all">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              {t({ ko: "모든 후기 보기", en: "View All Reviews", ja: "全てのレビューを見る", zh: "查看所有评论" })}
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}