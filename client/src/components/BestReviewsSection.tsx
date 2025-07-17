import { useState } from "react";
import {
  Star,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface BestReview {
  id: string;
  productId: string;
  productName: string;
  productNameKo: string;
  reviewText: string;
  reviewImage: string;
  userNickname: string;
  rating: number;
  reviewDate: string;
  likes: number;
  comments: number;
  isBestReview: boolean;
}

const mockBestReviews: BestReview[] = [
  {
    id: "1",
    productId: "1",
    productName: "Acrylic Keychain",
    productNameKo: "아크릴 키링",
    reviewText:
      "정말 예쁘게 나왔어요! 품질이 너무 좋고 색감도 선명하네요. 다음에 또 주문할게요~",
    reviewImage: "/api/placeholder/300/300",
    userNickname: "키링러버***",
    rating: 5,
    reviewDate: "2024.12.15",
    likes: 89,
    comments: 12,
    isBestReview: true,
  },
  {
    id: "2",
    productId: "2",
    productName: "Hologram Sticker",
    productNameKo: "홀로그램 스티커",
    reviewText:
      "홀로그램 효과가 정말 예뻐요! 각도에 따라 색이 바뀌는 게 신기해요. 친구들이 다 부러워해요!",
    reviewImage: "/api/placeholder/300/300",
    userNickname: "반짝이좋아***",
    rating: 5,
    reviewDate: "2024.12.14",
    likes: 156,
    comments: 23,
    isBestReview: true,
  },
  {
    id: "3",
    productId: "3",
    productName: "Acrylic Stand",
    productNameKo: "아크릴 스탠드",
    reviewText:
      "투명도가 좋고 두께감도 만족스러워요. 캐릭터가 정말 예쁘게 서있어요!",
    reviewImage: "/api/placeholder/300/300",
    userNickname: "스탠드마니아***",
    rating: 5,
    reviewDate: "2024.12.13",
    likes: 124,
    comments: 18,
    isBestReview: true,
  },
  {
    id: "4",
    productId: "4",
    productName: "Smart Tok",
    productNameKo: "스마트톡",
    reviewText:
      "휴대폰 거치할 때 정말 편하고 디자인도 마음에 들어요. 접착력도 좋아요!",
    reviewImage: "/api/placeholder/300/300",
    userNickname: "스마트유저***",
    rating: 5,
    reviewDate: "2024.12.12",
    likes: 98,
    comments: 15,
    isBestReview: true,
  },
  {
    id: "5",
    productId: "5",
    productName: "Photo Card Holder",
    productNameKo: "포토카드 홀더",
    reviewText:
      "포카 보관하기 정말 좋아요! 크기도 딱 맞고 투명도도 좋아서 포카가 잘 보여요.",
    reviewImage: "/api/placeholder/300/300",
    userNickname: "포카컬렉터***",
    rating: 5,
    reviewDate: "2024.12.11",
    likes: 167,
    comments: 21,
    isBestReview: true,
  },
  {
    id: "6",
    productId: "6",
    productName: "Custom Badge",
    productNameKo: "커스텀 배지",
    reviewText:
      "디자인이 너무 귀엽게 나왔어요! 크기도 적당하고 색상도 선명해서 만족합니다.",
    reviewImage: "/api/placeholder/300/300",
    userNickname: "배지마니아***",
    rating: 5,
    reviewDate: "2024.12.10",
    likes: 134,
    comments: 19,
    isBestReview: true,
  },
];

export function BestReviewsSection() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const nextSlide = () => {
    setCurrentIndex(
      (prev) => (prev + 1) % Math.ceil(mockBestReviews.length / 3),
    );
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + Math.ceil(mockBestReviews.length / 3)) %
        Math.ceil(mockBestReviews.length / 3),
    );
  };

  const visibleReviews = mockBestReviews.slice(
    currentIndex * 3,
    (currentIndex + 1) * 3,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 dark:bg-[#0d1b2a]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Best Review 💌
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t({
              ko: "올댓프린팅이 직접 선별한 베스트 리뷰",
              en: "Selected directly by AllThatPrinting",
              ja: "オールザットプリンティングが直接選んだベストレビュー",
              zh: "AllThatPrinting直接精选的最佳评论",
            })}
          </p>
        </div>

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
            {Array.from({ length: Math.ceil(mockBestReviews.length / 3) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ),
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={
              currentIndex === Math.ceil(mockBestReviews.length / 3) - 1
            }
          >
            {t({ ko: "다음", en: "Next", ja: "次へ", zh: "下一个" })}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-700 shadow-md p-2 h-[270px] flex flex-col justify-between hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
                {/* Best Review Ribbon */}
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 text-xs font-bold transform rotate-12 translate-x-2 -translate-y-1 shadow-lg">
                    BEST
                  </div>
                </div>

                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={review.reviewImage}
                      alt={review.productNameKo}
                      className="w-full h-48 object-cover"
                    />

                    {/* Product Badge */}
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white text-xs">
                        {review.productNameKo}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                        ({review.rating}.0)
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {review.reviewText}
                    </p>

                    {/* User Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{review.userNickname}</span>
                      <span>{review.reviewDate}</span>
                    </div>

                    {/* Interaction Stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{review.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{review.comments}</span>
                        </div>
                      </div>

                      <Link href={`/reviews/${review.id}`}>
                        <Button size="sm" variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-200">
                          {t({
                            ko: "자세히",
                            en: "Details",
                            ja: "詳細",
                            zh: "详情",
                          })}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/reviews/all">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              {t({
                ko: "모든 베스트 리뷰 보기",
                en: "View All Best Reviews",
                ja: "全てのベストレビューを見る",
                zh: "查看所有最佳评论",
              })}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
