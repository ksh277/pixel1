import { useState } from "react";
import { Link } from "wouter";
import { Star, ArrowRight, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

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
}

const mockReviewsData: ReviewData[] = [
  {
    id: 1,
    productId: 1,
    productName: "Acrylic Keyring",
    productNameKo: "아크릴 키링",
    productImage: "/api/placeholder/300/300",
    rating: 5,
    reviewText:
      "퀄리티가 정말 좋아요! 디자인도 깨끗하게 나왔고 배송도 빨랐습니다. 다음에 또 주문할게요.",
    reviewerNickname: "작가님***",
    reviewDate: "2024.12.15",
    isHot: true,
    totalReviews: 127,
  },
  {
    id: 2,
    productId: 2,
    productName: "Acrylic Stand",
    productNameKo: "아크릴 스탠드",
    productImage: "/api/placeholder/300/300",
    rating: 4,
    reviewText:
      "생각보다 두께감이 있어서 안정적이에요. 색상도 예쁘게 나왔습니다.",
    reviewerNickname: "디자이너***",
    reviewDate: "2024.12.14",
    isHot: true,
    totalReviews: 89,
  },
  {
    id: 3,
    productId: 3,
    productName: "Smart Tok",
    productNameKo: "스마트톡",
    productImage: "/api/placeholder/300/300",
    rating: 5,
    reviewText:
      "홀로그램 효과가 진짜 예뻐요! 친구들이 어디서 만들었냐고 계속 물어봐요.",
    reviewerNickname: "크리에이터***",
    reviewDate: "2024.12.13",
    isHot: false,
    totalReviews: 156,
  },
  {
    id: 4,
    productId: 4,
    productName: "Photo Card Holder",
    productNameKo: "포카홀더",
    productImage: "/api/placeholder/300/300",
    rating: 5,
    reviewText:
      "사이즈가 딱 맞고 마감처리도 깔끔해요. 포카 보관용으로 최고입니다!",
    reviewerNickname: "아티스트***",
    reviewDate: "2024.12.12",
    isHot: true,
    totalReviews: 203,
  },
];

export function UserReviewsSection() {
  const { language, t } = useLanguage();
  const [displayedReviews] = useState(mockReviewsData.slice(0, 4));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

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

  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">😊</span>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {t({
                    ko: "창작자들의 진짜 후기",
                    en: "Real Reviews from Our Creators",
                    ja: "クリエイターたちの本当のレビュー",
                    zh: "创作者们的真实评价",
                  })}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {t({
                    ko: "우리 서비스를 이용한 창작자들이 남긴 실제 후기를 확인해보세요",
                    en: "Check out real reviews left by creators who have used our service",
                    ja: "私たちのサービスを利用したクリエイターが残した実際のレビューをご確認ください",
                    zh: "查看使用我们服务的创作者留下的真实评价",
                  })}
                </p>
              </div>
            </div>
            <Link href="/reviews/all">
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2"
              >
                {t({
                  ko: "더보기",
                  en: "See More",
                  ja: "もっと見る",
                  zh: "查看更多",
                })}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedReviews.map((review, index) => (
              <motion.div key={review.id} variants={itemVariants}>
                <Card className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md p-2 h-[270px] flex flex-col justify-between hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
                  <Link href={`/reviews/${review.id}`}>
                    <CardContent className="p-0 flex flex-col justify-between h-full">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                        <img
                          src={review.productImage}
                          alt={
                            language === "ko"
                              ? review.productNameKo
                              : review.productName
                          }
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/api/placeholder/300/300";
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
                            {review.totalReviews}{" "}
                            {t({
                              ko: "리뷰",
                              en: "reviews",
                              ja: "レビュー",
                              zh: "评价",
                            })}
                          </Badge>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="p-4 space-y-3">
                        {/* Product Name */}
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                          {language === "ko"
                            ? review.productNameKo
                            : review.productName}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                            {review.rating}.0
                          </span>
                        </div>

                        {/* Review Text */}
                        <p className="text-sm text-gray-700 dark:text-white leading-relaxed">
                          {truncateText(review.reviewText)}
                        </p>

                        {/* Reviewer Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
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
          </div>

          {/* Mobile See More Button */}
          <div className="md:hidden text-center">
            <Link href="/reviews/all">
              <Button className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white">
                {t({
                  ko: "전체 후기 보기",
                  en: "See All Reviews",
                  ja: "すべてのレビューを見る",
                  zh: "查看所有评价",
                })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
