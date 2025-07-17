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

const mockDesignShares: DesignShare[] = [
  {
    id: "1",
    title: "Cute Cat Character Keychain",
    titleKo: "귀여운 고양이 캐릭터 키링",
    author: "디자이너***",
    authorNickname: "CatLover92",
    thumbnail: "/api/placeholder/300/300",
    category: "키링",
    likes: 245,
    views: 1240,
    downloads: 89,
    uploadDate: "2024.12.15",
    tags: ["고양이", "캐릭터", "키링", "귀여운"],
    isPremium: false,
    isHot: true
  },
  {
    id: "2",
    title: "Minimalist Logo Design",
    titleKo: "미니멀 로고 디자인",
    author: "작가님***",
    authorNickname: "MinimalDesign",
    thumbnail: "/api/placeholder/300/300",
    category: "로고",
    likes: 189,
    views: 980,
    downloads: 156,
    uploadDate: "2024.12.14",
    tags: ["미니멀", "로고", "심플", "브랜딩"],
    isPremium: true,
    isHot: false
  },
  {
    id: "3",
    title: "Flower Pattern Background",
    titleKo: "꽃 패턴 배경",
    author: "크리에이터***",
    authorNickname: "FlowerArt",
    thumbnail: "/api/placeholder/300/300",
    category: "배경",
    likes: 167,
    views: 756,
    downloads: 234,
    uploadDate: "2024.12.13",
    tags: ["꽃", "패턴", "배경", "자연"],
    isPremium: false,
    isHot: true
  },
  {
    id: "4",
    title: "Geometric Shapes Collection",
    titleKo: "기하학적 도형 컬렉션",
    author: "디자이너***",
    authorNickname: "GeoDesigner",
    thumbnail: "/api/placeholder/300/300",
    category: "도형",
    likes: 298,
    views: 1456,
    downloads: 178,
    uploadDate: "2024.12.12",
    tags: ["기하학", "도형", "모던", "컬렉션"],
    isPremium: true,
    isHot: true
  },
  {
    id: "5",
    title: "Vintage Typography Set",
    titleKo: "빈티지 타이포그래피 세트",
    author: "타이포***",
    authorNickname: "VintageType",
    thumbnail: "/api/placeholder/300/300",
    category: "타이포그래피",
    likes: 134,
    views: 623,
    downloads: 92,
    uploadDate: "2024.12.11",
    tags: ["빈티지", "타이포그래피", "레트로", "폰트"],
    isPremium: false,
    isHot: false
  },
  {
    id: "6",
    title: "Kawaii Food Stickers",
    titleKo: "카와이 음식 스티커",
    author: "스티커***",
    authorNickname: "KawaiiFood",
    thumbnail: "/api/placeholder/300/300",
    category: "스티커",
    likes: 412,
    views: 2103,
    downloads: 345,
    uploadDate: "2024.12.10",
    tags: ["카와이", "음식", "스티커", "일본"],
    isPremium: false,
    isHot: true
  }
];

export default function CommunityDesignShare() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [likedDesigns, setLikedDesigns] = useState<string[]>([]);

  const filteredDesigns = mockDesignShares.filter(design => {
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
    setLikedDesigns(prev => 
      prev.includes(designId) 
        ? prev.filter(id => id !== designId)
        : [...prev, designId]
    );
  };

  const handleUpload = () => {
    toast({
      title: "업로드 기능",
      description: "도안 업로드 창이 열립니다.",
    });
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t({ ko: "도안공유", en: "Design Sharing", ja: "デザイン共有", zh: "设计分享" })}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t({ ko: "창작자들의 아름다운 디자인을 공유하고 다운로드하세요", en: "Share and download beautiful designs from creators", ja: "クリエイターの美しいデザインを共有・ダウンロード", zh: "分享和下载创作者的美丽设计" })}
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6 border-0 dark:border dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                  <Input
                    placeholder={t({ ko: "디자인 검색...", en: "Search designs...", ja: "デザイン検索...", zh: "搜索设计..." })}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t({ ko: "전체", en: "All", ja: "全て", zh: "全部" })}</SelectItem>
                    <SelectItem value="키링">{t({ ko: "키링", en: "Keyring", ja: "キーリング", zh: "钥匙扣" })}</SelectItem>
                    <SelectItem value="스티커">{t({ ko: "스티커", en: "Sticker", ja: "ステッカー", zh: "贴纸" })}</SelectItem>
                    <SelectItem value="로고">{t({ ko: "로고", en: "Logo", ja: "ロゴ", zh: "徽标" })}</SelectItem>
                    <SelectItem value="배경">{t({ ko: "배경", en: "Background", ja: "背景", zh: "背景" })}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">{t({ ko: "최신순", en: "Latest", ja: "最新", zh: "最新" })}</SelectItem>
                    <SelectItem value="popular">{t({ ko: "인기순", en: "Popular", ja: "人気", zh: "热门" })}</SelectItem>
                    <SelectItem value="downloaded">{t({ ko: "다운로드순", en: "Downloaded", ja: "ダウンロード", zh: "下载" })}</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  {t({ ko: "업로드", en: "Upload", ja: "アップロード", zh: "上传" })}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Design Grid */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#1a2332] rounded-lg shadow-sm p-6 border-0 dark:border dark:border-gray-700">
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {sortedDesigns.map((design) => (
                <Card key={design.id} className="group hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-[#1a2332] border-gray-200 dark:border-gray-700">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={design.thumbnail}
                        alt={design.titleKo}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      
                      {/* Overlay badges */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        {design.isHot && (
                          <Badge className="bg-red-500 text-white text-xs">HOT</Badge>
                        )}
                        {design.isPremium && (
                          <Badge className="bg-yellow-500 text-white text-xs">PREMIUM</Badge>
                        )}
                      </div>

                      {/* Like button */}
                      <button
                        onClick={() => handleLikeToggle(design.id)}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            likedDesigns.includes(design.id)
                              ? "text-red-500 fill-current"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        />
                      </button>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span className="text-sm">{design.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">{design.likes}</span>
                            </div>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            {t({ ko: "다운로드", en: "Download", ja: "ダウンロード", zh: "下载" })}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {design.titleKo}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {t({ ko: "작가", en: "by", ja: "作者", zh: "作者" })} {design.author}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {design.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{design.uploadDate}</span>
                        <span>{design.downloads} {t({ ko: "다운로드", en: "downloads", ja: "ダウンロード", zh: "下载" })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}