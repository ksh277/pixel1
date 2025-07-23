import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  User,
  Search,
  Plus,
  Calendar,
  Eye,
  Heart,
  Filter,
} from "lucide-react";
import { Link } from "wouter";
import { useSupabaseAuth } from "@/components/SupabaseProvider";

const CommunityPage = () => {
  const { user } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample products/posts data
  const posts = [
    {
      id: 1,
      title: "렌티큘러 스마트톡 굿즈 제작 후기",
      content: "시선이 머무는 굿즈로 렌티큘러 3중 굿즈를 제작했습니다. 정말 만족스러운 결과물이에요!",
      category: "showcase",
      author: {
        username: "굿즈러버",
        avatar: "/api/placeholder/40/40"
      },
      created_at: "2025-01-20T10:30:00Z",
      likes: 15,
      comments: 3,
      views: 120,
      image_url: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "아크릴 키링 제작 가이드",
      content: "처음 제작하시는 분들을 위한 아크릴 키링 제작 팁과 주의사항을 공유합니다.",
      category: "tip",
      author: {
        username: "제작마스터",
        avatar: "/api/placeholder/40/40"
      },
      created_at: "2025-01-19T15:20:00Z",
      likes: 24,
      comments: 8,
      views: 450,
      image_url: "/api/placeholder/300/200"
    }
  ];

  const categories = [
    { value: "all", label: "전체" },
    { value: "general", label: "일반" },
    { value: "question", label: "질문" },
    { value: "tip", label: "팁" },
    { value: "review", label: "후기" },
    { value: "showcase", label: "자랑" },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper functions for displaying post data
  const getPostCategoryColor = (category: string) => {
    const colors = {
      general: "bg-blue-500",
      question: "bg-green-500", 
      tip: "bg-yellow-500",
      review: "bg-purple-500",
      showcase: "bg-pink-500"
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
  };

  const getPostCategoryText = (category: string) => {
    const texts = {
      general: "일반",
      question: "질문",
      tip: "팁", 
      review: "후기",
      showcase: "자랑"
    };
    return texts[category as keyof typeof texts] || category;
  };

  const formatPostDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return "1일 전";
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">커뮤니티</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {posts.length}개의 게시글
              </p>
            </div>
            {user ? (
              <Link href="/community/write">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  글쓰기
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="text-white border-gray-600 hover:bg-gray-700 w-full md:w-auto"
                >
                  로그인하고 글쓰기
                </Button>
              </Link>
            )}
          </div>

          {/* Search and Filter */}
          <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="제목이나 내용으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-32 bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-600 text-black dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-600">
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          {filteredPosts?.length === 0 ? (
            <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
                  {searchTerm || selectedCategory !== "all"
                    ? "검색 결과가 없습니다"
                    : "첫 번째 게시글을 작성해보세요"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm || selectedCategory !== "all"
                    ? "다른 검색어나 카테고리를 시도해보세요."
                    : "아직 작성된 게시글이 없습니다. 커뮤니티에 첫 번째 게시글을 남겨보세요!"}
                </p>
                {user && (
                  <Link href="/community/write">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      글쓰기
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPosts?.map((post) => (
                <Card
                  key={post.id}
                  className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#253041] transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {post.category && (
                            <Badge
                              className={getPostCategoryColor(post.category)}
                            >
                              {getPostCategoryText(post.category)}
                            </Badge>
                          )}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatPostDate(post.created_at)}
                          </span>
                        </div>

                        <Link href={`/community/${post.id}`}>
                          <h3 className="text-lg font-semibold text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors mb-2 cursor-pointer">
                            {post.title}
                          </h3>
                        </Link>

                        {post.content && (
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                            {post.content.substring(0, 150)}
                            {post.content.length > 150 && "..."}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{post.author?.username || "익명"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views || 0}</span>
                          </div>
                        </div>
                      </div>

                      {post.image_url && (
                        <div className="ml-4 flex-shrink-0">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded-lg bg-gray-700"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
