import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Image, Palette, Settings, Search, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function CommunityResources() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: resources, isLoading } = useQuery({
    queryKey: ["/api/resources"],
  });

  const transformedResources = resources?.map((resource: any) => ({
    id: resource.id,
    title: resource.title,
    description: resource.description,
    category: resource.category || "guide",
    type: resource.file_type || "PDF",
    downloadCount: resource.download_count || 0,
    isNew: resource.is_new || false,
    thumbnail: "/api/placeholder/300/200",
    tags: []
  })) || [];

  const filteredResources = transformedResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (resourceId: string) => {
    toast({
      title: "다운로드 시작",
      description: "파일 다운로드가 시작되었습니다.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">자료를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-2xl font-bold mb-2">자료실</h1>
          <p className="text-blue-100">굿즈 제작에 필요한 다양한 자료들을 다운로드하세요!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="자료 검색..."
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
              <SelectItem value="all">전체 자료</SelectItem>
              <SelectItem value="template">템플릿</SelectItem>
              <SelectItem value="guide">가이드</SelectItem>
              <SelectItem value="color">컬러</SelectItem>
              <SelectItem value="font">폰트</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
              <div className="relative">
                <img 
                  src={resource.thumbnail} 
                  alt={resource.title}
                  className="w-full h-32 object-cover"
                />
                {resource.isNew && (
                  <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                    NEW
                  </Badge>
                )}
                <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                  {resource.type}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {resource.downloadCount}
                  </span>
                  <span>{resource.category}</span>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleDownload(resource.id)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  다운로드
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              자료를 찾을 수 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              다른 검색어나 카테고리를 시도해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}