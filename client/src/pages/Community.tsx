import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, ChevronLeft, ChevronRight, User, Star, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { api } from "@/lib/api";
import type { CommunityPost } from "@shared/schema";

export default function Community() {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/community/posts"],
  });

  // Navigation is now handled globally in Layout component

  // Mock best content data
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
    },
    {
      id: 3,
      title: "투명 아크릴 스탠드 DIY",
      author: "짱구***",
      image: "/api/placeholder/300/300",
      likes: 156,
      comments: 24,
      category: "아크릴스탠드",
      description: "투명한 아크릴로 만든 깔끔한 스탠드"
    },
    {
      id: 4,
      title: "커스텀 폰케이스 제작",
      author: "디모***",
      image: "/api/placeholder/300/300",
      likes: 134,
      comments: 9,
      category: "폰케이스",
      description: "나만의 디자인으로 만든 특별한 케이스"
    },
    {
      id: 5,
      title: "레진 아트 키링 완성",
      author: "토루***",
      image: "/api/placeholder/300/300",
      likes: 98,
      comments: 15,
      category: "레진아트",
      description: "레진으로 만든 아름다운 키링"
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

  return (
    <div className="min-h-screen bg-white dark:bg-[#333D4D]">
      {/* Navigation is now handled globally in Layout component */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Best Content Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <h2 className="text-2xl font-bold text-foreground">
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
                            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
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
                                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {item.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
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
                                      className="flex items-center space-x-1 text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                      <Heart className="h-4 w-4" />
                                      <span className="text-sm">{item.likes}</span>
                                    </button>
                                    <div className="flex items-center space-x-1 text-muted-foreground">
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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5" />
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
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-8 text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            <h3 className="text-xl font-bold text-foreground">
              {t({ ko: "참여하고 포인트 받아요!", en: "Participate and Get Points!" })}
            </h3>
          </div>
          <p className="text-lg text-muted-foreground mb-4">
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
            <h2 className="text-2xl font-bold text-foreground">
              {t({ ko: "최근 게시물", en: "Recent Posts" })}
            </h2>
            <Button variant="outline" size="sm">
              {t({ ko: "더보기", en: "View More" })}
            </Button>
          </div>
          
          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-3 bg-muted animate-pulse rounded mb-4" />
                    <div className="flex justify-between">
                      <div className="h-3 bg-muted animate-pulse rounded w-16" />
                      <div className="h-3 bg-muted animate-pulse rounded w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.slice(0, 4).map((post: CommunityPost) => (
                <Link key={post.id} href={`/reviews/${post.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                      <img 
                        src="/api/placeholder/300/300" 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
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
                            className="flex items-center space-x-1 text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <div className="flex items-center space-x-1 text-muted-foreground">
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
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t({ ko: "아직 게시물이 없습니다", en: "No posts yet" })}
              </h3>
              <p className="text-muted-foreground">
                {t({ ko: "첫 번째 게시물을 작성해보세요!", en: "Be the first to create a post!" })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}