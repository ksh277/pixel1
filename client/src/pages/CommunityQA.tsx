import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Search, Filter, User, Eye, Heart, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function CommunityQA() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const { data: qnaPosts, isLoading } = useQuery({
    queryKey: ["/api/qna"],
  });

  const transformedPosts = qnaPosts?.map((post: any) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category || "product",
    tags: post.tags || [],
    status: post.status || "pending",
    viewCount: post.view_count || 0,
    likeCount: post.like_count || 0,
    answerCount: post.answer_count || 0,
    createdAt: post.created_at,
    author: "회원***"
  })) || [];

  const filteredPosts = transformedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "popular":
        return b.likeCount - a.likeCount;
      case "answered":
        return b.answerCount - a.answerCount;
      default:
        return 0;
    }
  });

  const handleAskQuestion = () => {
    toast({
      title: "질문 작성",
      description: "질문 작성 페이지로 이동합니다.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">질문을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-2xl font-bold mb-2">궁금햄물어봐</h1>
          <p className="text-blue-100">궁금한 점이 있으시면 언제든지 질문해 주세요!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="질문 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-[#1e2b3c] border-gray-300 dark:border-gray-600"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48 bg-white dark:bg-[#1e2b3c]">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              <SelectItem value="product">상품 문의</SelectItem>
              <SelectItem value="shipping">배송 문의</SelectItem>
              <SelectItem value="payment">결제 문의</SelectItem>
              <SelectItem value="design">디자인 문의</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full lg:w-48 bg-white dark:bg-[#1e2b3c]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="answered">답변순</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAskQuestion} className="bg-blue-600 hover:bg-blue-700">
            <MessageCircle className="w-4 h-4 mr-2" />
            질문하기
          </Button>
        </div>

        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={post.status === "answered" ? "default" : "secondary"}
                        className={post.status === "answered" ? "bg-green-500" : "bg-yellow-500"}
                      >
                        {post.status === "answered" ? "답변완료" : "답변대기"}
                      </Badge>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.answerCount}
                      </span>
                    </div>
                  </div>
                </div>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              질문이 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              첫 번째 질문을 남겨보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}