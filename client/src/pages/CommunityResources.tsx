import { useState } from "react";
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

interface Resource {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  category: "template" | "guide" | "color" | "resolution" | "font";
  type: "AI" | "PSD" | "PDF" | "PNG" | "TTF" | "OTF";
  fileSize: string;
  downloadCount: number;
  rating: number;
  ratingCount: number;
  isPremium: boolean;
  isNew: boolean;
  thumbnail: string;
  tags: string[];
  uploadDate: string;
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "Acrylic Keychain Template Pack",
    titleKo: "아크릴 키링 템플릿 팩",
    description: "Professional keychain templates with cutting lines and guides",
    descriptionKo: "재단선과 가이드가 포함된 전문 키링 템플릿",
    category: "template",
    type: "AI",
    fileSize: "15.2 MB",
    downloadCount: 2341,
    rating: 4.9,
    ratingCount: 127,
    isPremium: false,
    isNew: true,
    thumbnail: "/api/placeholder/300/200",
    tags: ["키링", "템플릿", "재단선", "가이드"],
    uploadDate: "2024.12.15"
  },
  {
    id: "2",
    title: "Production Guidelines Manual",
    titleKo: "제작 가이드 매뉴얼",
    description: "Complete guide for custom printing production processes",
    descriptionKo: "맞춤형 인쇄 제작 과정에 대한 완전한 가이드",
    category: "guide",
    type: "PDF",
    fileSize: "8.7 MB",
    downloadCount: 1567,
    rating: 4.8,
    ratingCount: 89,
    isPremium: false,
    isNew: false,
    thumbnail: "/api/placeholder/300/200",
    tags: ["제작", "가이드", "인쇄", "매뉴얼"],
    uploadDate: "2024.12.10"
  },
  {
    id: "3",
    title: "Color Palette Collection",
    titleKo: "컬러 팔레트 컬렉션",
    description: "Trending color palettes for 2024 design projects",
    descriptionKo: "2024년 디자인 프로젝트를 위한 트렌드 컬러 팔레트",
    category: "color",
    type: "AI",
    fileSize: "3.4 MB",
    downloadCount: 3456,
    rating: 4.7,
    ratingCount: 201,
    isPremium: true,
    isNew: true,
    thumbnail: "/api/placeholder/300/200",
    tags: ["컬러", "팔레트", "2024", "트렌드"],
    uploadDate: "2024.12.12"
  },
  {
    id: "4",
    title: "High Resolution Guide",
    titleKo: "고해상도 가이드",
    description: "Essential guide for preparing high-quality print files",
    descriptionKo: "고품질 인쇄 파일 준비를 위한 필수 가이드",
    category: "resolution",
    type: "PDF",
    fileSize: "12.1 MB",
    downloadCount: 987,
    rating: 4.9,
    ratingCount: 67,
    isPremium: false,
    isNew: false,
    thumbnail: "/api/placeholder/300/200",
    tags: ["해상도", "인쇄", "DPI", "품질"],
    uploadDate: "2024.12.08"
  },
  {
    id: "5",
    title: "Korean Font Bundle",
    titleKo: "한글 폰트 번들",
    description: "Premium Korean fonts for professional designs",
    descriptionKo: "전문적인 디자인을 위한 프리미엄 한글 폰트",
    category: "font",
    type: "TTF",
    fileSize: "45.3 MB",
    downloadCount: 1234,
    rating: 4.6,
    ratingCount: 156,
    isPremium: true,
    isNew: false,
    thumbnail: "/api/placeholder/300/200",
    tags: ["한글", "폰트", "타이포그래피", "디자인"],
    uploadDate: "2024.12.05"
  },
  {
    id: "6",
    title: "Sticker Template Set",
    titleKo: "스티커 템플릿 세트",
    description: "Various sticker shapes and sizes with cutting guides",
    descriptionKo: "재단 가이드가 포함된 다양한 스티커 모양과 크기",
    category: "template",
    type: "PSD",
    fileSize: "28.9 MB",
    downloadCount: 1876,
    rating: 4.8,
    ratingCount: 143,
    isPremium: false,
    isNew: true,
    thumbnail: "/api/placeholder/300/200",
    tags: ["스티커", "템플릿", "재단", "모양"],
    uploadDate: "2024.12.13"
  }
];

export default function CommunityResources() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.titleKo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      case "popular":
        return b.downloadCount - a.downloadCount;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleDownload = (resourceId: string, title: string) => {
    toast({
      title: t({ ko: "다운로드 시작", en: "Download Started", ja: "ダウンロード開始", zh: "开始下载" }),
      description: `${title} ${t({ ko: "파일을 다운로드합니다.", en: "file is downloading.", ja: "ファイルをダウンロードしています。", zh: "文件正在下载。" })}`,
    });
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "template":
        return <Image className="h-5 w-5" />;
      case "guide":
        return <FileText className="h-5 w-5" />;
      case "color":
        return <Palette className="h-5 w-5" />;
      case "resolution":
        return <Settings className="h-5 w-5" />;
      case "font":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      "AI": "bg-orange-100 text-orange-800",
      "PSD": "bg-blue-100 text-blue-800",
      "PDF": "bg-red-100 text-red-800",
      "PNG": "bg-green-100 text-green-800",
      "TTF": "bg-purple-100 text-purple-800",
      "OTF": "bg-purple-100 text-purple-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#1F2D4A]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t({ ko: "자료실", en: "Resources", ja: "資料室", zh: "资料室" })}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t({ ko: "굿즈 제작에 필요한 자료를 다운로드하세요", en: "Download resources needed for goods production", ja: "グッズ制作に必要な資料をダウンロードしてください", zh: "下载制作商品所需的资料" })}
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#1F2D4A] rounded-lg shadow-sm p-6 border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={t({ ko: "자료 검색...", en: "Search resources...", ja: "資料検索...", zh: "搜索资料..." })}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t({ ko: "전체", en: "All", ja: "全て", zh: "全部" })}</SelectItem>
                    <SelectItem value="template">{t({ ko: "템플릿", en: "Templates", ja: "テンプレート", zh: "模板" })}</SelectItem>
                    <SelectItem value="guide">{t({ ko: "제작 가이드", en: "Production Guide", ja: "制作ガイド", zh: "制作指南" })}</SelectItem>
                    <SelectItem value="color">{t({ ko: "색상표현", en: "Color Guide", ja: "カラーガイド", zh: "色彩指南" })}</SelectItem>
                    <SelectItem value="resolution">{t({ ko: "해상도 가이드", en: "Resolution Guide", ja: "解像度ガイド", zh: "分辨率指南" })}</SelectItem>
                    <SelectItem value="font">{t({ ko: "폰트", en: "Fonts", ja: "フォント", zh: "字体" })}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">{t({ ko: "최신순", en: "Latest", ja: "最新", zh: "最新" })}</SelectItem>
                    <SelectItem value="popular">{t({ ko: "인기순", en: "Popular", ja: "人気", zh: "热门" })}</SelectItem>
                    <SelectItem value="rating">{t({ ko: "평점순", en: "Rating", ja: "評価", zh: "评分" })}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Resource Categories */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
                <TabsTrigger value="all">{t({ ko: "전체", en: "All", ja: "全て", zh: "全部" })}</TabsTrigger>
                <TabsTrigger value="template">{t({ ko: "템플릿", en: "Templates", ja: "テンプレート", zh: "模板" })}</TabsTrigger>
                <TabsTrigger value="guide">{t({ ko: "가이드", en: "Guides", ja: "ガイド", zh: "指南" })}</TabsTrigger>
                <TabsTrigger value="color">{t({ ko: "색상", en: "Colors", ja: "カラー", zh: "颜色" })}</TabsTrigger>
                <TabsTrigger value="resolution">{t({ ko: "해상도", en: "Resolution", ja: "解像度", zh: "分辨率" })}</TabsTrigger>
                <TabsTrigger value="font">{t({ ko: "폰트", en: "Fonts", ja: "フォント", zh: "字体" })}</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedResources.map((resource) => (
                    <Card key={resource.id} className="group hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(resource.category)}
                            <CardTitle className="text-lg line-clamp-1">{resource.titleKo}</CardTitle>
                          </div>
                          <div className="flex gap-1">
                            {resource.isNew && (
                              <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
                            )}
                            {resource.isPremium && (
                              <Badge className="bg-yellow-500 text-white text-xs">PREMIUM</Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="relative">
                          <img
                            src={resource.thumbnail}
                            alt={resource.titleKo}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className={getTypeColor(resource.type)}>
                              {resource.type}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {resource.descriptionKo}
                        </p>

                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            {renderStars(resource.rating)}
                            <span className="text-gray-600">({resource.ratingCount})</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {resource.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{resource.fileSize}</span>
                          <span>{resource.downloadCount.toLocaleString()} {t({ ko: "다운로드", en: "downloads", ja: "ダウンロード", zh: "下载" })}</span>
                        </div>

                        <Button
                          onClick={() => handleDownload(resource.id, resource.titleKo)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {t({ ko: "다운로드", en: "Download", ja: "ダウンロード", zh: "下载" })}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Individual category tabs would filter the same data */}
              {["template", "guide", "color", "resolution", "font"].map(category => (
                <TabsContent key={category} value={category} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedResources.filter(r => r.category === category).map((resource) => (
                      <Card key={resource.id} className="group hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(resource.category)}
                              <CardTitle className="text-lg line-clamp-1">{resource.titleKo}</CardTitle>
                            </div>
                            <div className="flex gap-1">
                              {resource.isNew && (
                                <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
                              )}
                              {resource.isPremium && (
                                <Badge className="bg-yellow-500 text-white text-xs">PREMIUM</Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="relative">
                            <img
                              src={resource.thumbnail}
                              alt={resource.titleKo}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className={getTypeColor(resource.type)}>
                                {resource.type}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {resource.descriptionKo}
                          </p>

                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              {renderStars(resource.rating)}
                              <span className="text-gray-600">({resource.ratingCount})</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {resource.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{resource.fileSize}</span>
                            <span>{resource.downloadCount.toLocaleString()} {t({ ko: "다운로드", en: "downloads", ja: "ダウンロード", zh: "下载" })}</span>
                          </div>

                          <Button
                            onClick={() => handleDownload(resource.id, resource.titleKo)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {t({ ko: "다운로드", en: "Download", ja: "ダウンロード", zh: "下载" })}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}