import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Upload, Heart, Eye, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface DesignShare {
  id: string;
  title: string;
  titleKo: string;
  author: string;
  authorNickname: string;
  thumbnail: string;
  category: string;
  likes: number;
  views: number;
  downloads: number;
  uploadDate: string;
  tags: string[];
  isPremium: boolean;
  isHot: boolean;
}

export default function CommunityDesignShare() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: designShares, isLoading } = useQuery({
    queryKey: ["/api/design-shares"],
  });

  const transformedDesignShares: DesignShare[] = designShares?.map((share: any) => ({
    id: share.id.toString(),
    title: share.title,
    titleKo: share.title,
    author: "작가***",
    authorNickname: "Designer",
    thumbnail: share.image_url || "/api/placeholder/300/300",
    category: share.category || "기타",
    likes: share.like_count || 0,
    views: 0,
    downloads: share.download_count || 0,
    uploadDate: new Date(share.created_at).toLocaleDateString(),
    tags: share.tags || [],
    isPremium: false,
    isHot: (share.like_count || 0) > 30
  })) || [];

  const filteredDesigns = transformedDesignShares.filter(design => {
    const matchesSearch = design.titleKo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || design.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      case "popular":
        return b.likes - a.likes;
      case "downloaded":
        return b.downloads - a.downloads;
      default:
        return 0;
    }
  });

  const handleLikeToggle = (designId: string) => {
    toast({
      title: "좋아요!",
      description: "도안에 좋아요를 눌렀습니다.",
    });
  };

  const handleUpload = () => {
    toast({
      title: "업로드 기능",
      description: "도안 업로드 창이 열립니다.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">도안을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6">
            <h1 className="text-2xl font-bold mb-2">도안 공유</h1>
            <p className="text-blue-100">창작자들의 멋진 도안을 공유하고 다운로드하세요!</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="도안 검색..."
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
                <SelectItem value="키링">키링</SelectItem>
                <SelectItem value="스티커">스티커</SelectItem>
                <SelectItem value="로고">로고</SelectItem>
                <SelectItem value="배경">배경</SelectItem>
                <SelectItem value="타이포그래피">타이포그래피</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 bg-white dark:bg-[#1e2b3c]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="popular">인기순</SelectItem>
                <SelectItem value="downloaded">다운로드순</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              도안 업로드
            </Button>
          </div>
        </div>

        {sortedDesigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              도안을 찾을 수 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              다른 검색어나 카테고리를 시도해보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedDesigns.map((design) => (
              <Card key={design.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <img 
                    src={design.thumbnail} 
                    alt={design.titleKo}
                    className="w-full h-48 object-cover"
                  />
                  {design.isHot && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      HOT
                    </Badge>
                  )}
                  {design.isPremium && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                      PREMIUM
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {design.titleKo}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {design.author}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {design.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {design.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {design.downloads}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLikeToggle(design.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}