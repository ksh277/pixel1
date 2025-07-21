import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, ChevronLeft, ChevronRight, User, Star, TrendingUp, PenTool } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { createSampleNotifications } from "@/utils/notificationUtils";
import type { CommunityPost } from "@shared/schema";

export default function Community() {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/community/posts"],
  });

  // Use mock data for now since we don't have actual community posts
  const bestContent = [
    {
      id: 1,
      title: "회전 스핀 아크릴 키링",
      author: "네기디***",
      image: "/api/placeholder/300/300",
      likes: 245,
      comments: 18,
      category: "아크릴키링",
      description: "360도 회전하는 멋진 키링입니다!"
    },
    {
      id: 2,
      title: "홀로그램 스티커 제작 후기",
      author: "모토***",
      image: "/api/placeholder/300/300",
      likes: 189,
      comments: 12,
      category: "스티커",
      description: "반짝반짝 예쁜 홀로그램 효과"
    }
  ];

  const itemsPerView = 3;
  const maxSlides = Math.ceil(bestContent.length / itemsPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  const scrollToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleLike = (postId: number) => {
    toast({
      title: t({ ko: "좋아요!", en: "Liked!" }),
      description: t({ ko: "게시물에 좋아요를 눌렀습니다.", en: "You liked this post." }),
    });
  };

  const handleCreateSampleNotifications = async () => {
    if (!user?.id) {
      toast({
        title: "로그인 필요",
        description: "알림을 생성하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSampleNotifications(user.id);
      toast({
        title: "알림 생성 완료",
        description: "샘플 알림이 생성되었습니다. 헤더의 벨 아이콘을 확인해보세요!",
      });
    } catch (error) {
      console.error("Error creating sample notifications:", error);
      toast({
        title: "알림 생성 실패",
        description: "알림 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a]">
      {/* Navigation is now handled globally in Layout component */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Notification Button */}
        {user && (
          <div className="mb-8 text-center">
            <Button 
              onClick={handleCreateSampleNotifications}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              테스트 알림 생성하기
            </Button>
          </div>
        )}
        
        {/* Best Content Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t({ ko: "이번주 베스트 콘텐츠", en: "This Week's Best Content" })}
            </h2>
            <span className="text-2xl">👍</span>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Carousel */}
            <div 
              ref={carouselRef}
              className="overflow-hidden rounded-lg"
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: maxSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bestContent
                        .slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView)
                        .map((item) => (
                          <Link key={item.id} href={`/reviews/${item.id}`}>
                            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white dark:bg-[#1e293b] border-gray-200 dark:border-[#334155]">
                              <div className="relative aspect-square">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <Badge className="absolute top-3 left-3 bg-orange-500 text-white font-bold text-xs px-2 py-1">
                                  BEST
                                </Badge>
                                <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
                                  {item.category}
                                </div>
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-slate-300 mb-3 line-clamp-2">
                                  {item.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-400">
                                    <User className="h-4 w-4" />
                                    <span>{item.author}</span>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleLike(item.id);
                                      }}
                                      className="flex items-center space-x-1 text-gray-600 dark:text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                      <Heart className="h-4 w-4" />
                                      <span className="text-sm">{item.likes}</span>
                                    </button>
                                    <div className="flex items-center space-x-1 text-gray-600 dark:text-slate-400">
                                      <MessageCircle className="h-4 w-4" />
                                      <span className="text-sm">{item.comments}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800/90 hover:bg-gray-800 dark:bg-[#1e293b]/90 dark:hover:bg-[#1e293b] rounded-full p-2 shadow-lg transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/90 hover:bg-gray-800 dark:bg-[#1e293b]/90 dark:hover:bg-[#1e293b] rounded-full p-2 shadow-lg transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Dot Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide 
                    ? 'bg-orange-500' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Engagement Section */}
        <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl p-8 text-center mb-12 border border-gray-200 dark:border-[#334155]">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t({ ko: "참여하고 포인트 받아요!", en: "Participate and Get Points!" })}
            </h3>
          </div>
          <p className="text-lg text-gray-700 dark:text-slate-300 mb-4">
            {t({ ko: "글만 써도 3,000원, 사진 올리면 5,000원 적립!", en: "Get 3,000 KRW for writing, 5,000 KRW for photos!" })}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-orange-500 text-white px-4 py-2">
              {t({ ko: "글쓰기 3,000원", en: "Writing 3,000 KRW" })}
            </Badge>
            <Badge className="bg-yellow-500 text-white px-4 py-2">
              {t({ ko: "사진업로드 5,000원", en: "Photo Upload 5,000 KRW" })}
            </Badge>
            <Badge className="bg-red-500 text-white px-4 py-2">
              {t({ ko: "베스트 선정시 10,000원", en: "Best Selection 10,000 KRW" })}
            </Badge>
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t({ ko: "최근 게시물", en: "Recent Posts" })}
            </h2>
            <div className="flex items-center gap-3">
              {user && (
                <Link href="/community/write">
                  <Button size="sm" className="flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    {t({ ko: "글 작성하기", en: "Write Post", ja: "投稿作成", zh: "写帖子" })}
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm" className="text-gray-900 dark:text-white border-gray-300 dark:border-white hover:bg-gray-100 dark:hover:bg-white hover:text-gray-900 dark:hover:text-[#0f172a]">
                {t({ ko: "더보기", en: "View More" })}
              </Button>
            </div>
          </div>
          
          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden bg-white dark:bg-[#1e293b] border-gray-200 dark:border-[#334155]">
                  <div className="aspect-square bg-gray-200 dark:bg-[#334155] animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-[#334155] animate-pulse rounded mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-[#334155] animate-pulse rounded mb-4" />
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 dark:bg-[#334155] animate-pulse rounded w-16" />
                      <div className="h-3 bg-gray-200 dark:bg-[#334155] animate-pulse rounded w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.slice(0, 4).map((post: CommunityPost) => (
                <Link key={post.id} href={`/community/${post.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer bg-white dark:bg-[#1e293b] border-gray-200 dark:border-[#334155]">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                      <img 
                        src="/api/placeholder/300/300" 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-slate-300 mb-4 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-400">
                          <User className="h-4 w-4" />
                          <span>익명***</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLike(post.id);
                            }}
                            className="flex items-center space-x-1 text-gray-600 dark:text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <div className="flex items-center space-x-1 text-gray-600 dark:text-slate-400">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">0</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-600 dark:text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t({ ko: "아직 게시물이 없습니다", en: "No posts yet" })}
              </h3>
              <p className="text-gray-600 dark:text-slate-300">
                {t({ ko: "첫 번째 게시물을 작성해보세요!", en: "Be the first to create a post!" })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}