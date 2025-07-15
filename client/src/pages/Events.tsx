import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Search, Filter, ChevronRight, Trophy, Star, Heart, Eye, MessageSquare } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface Event {
  id: number;
  title: string;
  titleKo: string;
  category: string;
  status: "이벤트 행사" | "서브컬쳐 행사" | "페어" | "공모전";
  startDate: string;
  endDate: string;
  location?: string;
  participants: number;
  likes: number;
  views: number;
  comments: number;
  description: string;
  organizer: string;
  isHot?: boolean;
  isNew?: boolean;
  tags: string[];
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "The 30th Di Festa + The 10th Daegongji",
    titleKo: "제 30회 디페스타+제 10회 대공지",
    category: "서브컬쳐 행사",
    status: "서브컬쳐 행사",
    startDate: "2025.07.26",
    endDate: "2025.07.27",
    location: "서울 SETEC",
    participants: 2500,
    likes: 743,
    views: 11340,
    comments: 156,
    description: "한국의 대표적인 서브컬쳐 행사로 다양한 굿즈와 창작물을 만나볼 수 있습니다.",
    organizer: "디페스타",
    isHot: true,
    tags: ["#2547월", "#디페", "#디페스타", "#돌네", "#돌인네트워크", "#돌인국즈", "#굿즈행사", "#굿즈판매", "#서브컬쳐"]
  },
  {
    id: 2,
    title: "Comic World 324 Ilsan + Moongujeong 25",
    titleKo: "코믹월드 324 일산+문구전 25",
    category: "서브컬쳐 행사",
    status: "서브컬쳐 행사",
    startDate: "2025.09.13",
    endDate: "2025.09.14",
    location: "일산 킨텍스 제1전시관",
    participants: 1800,
    likes: 542,
    views: 8750,
    comments: 89,
    description: "코믹월드 324 일산 + 문구전 25 창작 일산 킨텍스 제1전시관 날짜 : 2025.09.13~2025.09.14",
    organizer: "코믹페어",
    tags: ["#코믹월드", "#일산", "#킨텍스", "#문구전", "#창작", "#동인지", "#굿즈"]
  },
  {
    id: 3,
    title: "Summer 2025 Moongujeong 23rd Day",
    titleKo: "코믹월드 SUMMER 2025+문구전 23회 일산",
    category: "이벤트 행사",
    status: "이벤트 행사",
    startDate: "2025.07.19",
    endDate: "2025.07.20",
    location: "일산 킨텍스",
    participants: 3200,
    likes: 892,
    views: 15600,
    comments: 234,
    description: "여름 특별 이벤트로 다양한 창작물과 굿즈를 만나보세요.",
    organizer: "코믹페어",
    isNew: true,
    tags: ["#여름이벤트", "#코믹월드", "#일산", "#킨텍스", "#문구전", "#창작"]
  },
  {
    id: 4,
    title: "Seoul Illustration Fair V.19",
    titleKo: "서울 일러스트레이션 페어 V.19",
    category: "페어",
    status: "페어",
    startDate: "2025.07.24",
    endDate: "2025.07.27",
    location: "서울 예술의전당",
    participants: 1500,
    likes: 456,
    views: 6200,
    comments: 78,
    description: "일러스트레이션 작가들의 작품을 만나볼 수 있는 전시회입니다.",
    organizer: "서울일러스트협회",
    tags: ["#일러스트", "#페어", "#서울", "#예술의전당", "#전시회"]
  }
];

export default function Events() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("최신순");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [activeTab, setActiveTab] = useState("전체");

  const categories = ["전체", "이벤트 행사", "서브컬쳐 행사", "페어", "공모전"];
  const sortOptions = ["최신순", "인기순", "조회순", "댓글순"];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.titleKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || event.status === selectedCategory;
    const matchesTab = activeTab === "전체" || event.status === activeTab;
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const totalCount = filteredEvents.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1F2D4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">홈</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/community" className="hover:text-gray-700 dark:hover:text-gray-300">커뮤니티</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white font-medium">행사/공모전</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t({ ko: "행사/공모전", en: "Events & Contests", ja: "イベント・コンテスト", zh: "活动与比赛" })}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t({ ko: "다양한 행사 및 공모전 정보를 확인하세요", en: "Check out various events and contest information", ja: "様々なイベントやコンテストの情報をご確認ください", zh: "查看各种活动和比赛信息" })}
          </p>
        </div>

        {/* Banner Events */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs mb-2">이벤트 행사</Badge>
                    <h3 className="font-bold text-blue-900 dark:text-blue-100 text-sm">코믹월드 SUMMER 2025+문구전 23회 일산</h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">(25.07.19~07.20)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs mb-2">이벤트 행사</Badge>
                    <h3 className="font-bold text-green-900 dark:text-green-100 text-sm">서울 일러스트레이션 페어 V.19</h3>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">(25.07.24~07.27)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="bg-purple-100 text-purple-800 text-xs mb-2">이벤트 행사</Badge>
                    <h3 className="font-bold text-purple-900 text-sm">제 30회 디페스타+제 10회 대공지</h3>
                    <p className="text-xs text-purple-700 mt-1">(25.07.26~07.27)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="전체" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              전체 <Badge variant="secondary" className="ml-1">{mockEvents.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="서브컬쳐 행사" className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              서브컬쳐 행사
            </TabsTrigger>
            <TabsTrigger value="페어" className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              페어
            </TabsTrigger>
            <TabsTrigger value="공모전" className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              공모전
            </TabsTrigger>
            <TabsTrigger value="이벤트 행사" className="flex items-center gap-1 lg:flex hidden">
              <Users className="w-4 h-4" />
              이벤트 행사
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="행사/공모전을 검색해보세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            전체 <span className="text-blue-600">{totalCount}</span>
          </h2>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">날짜별</span>
            <Filter className="w-4 h-4 text-gray-500 ml-2" />
            <span className="text-sm text-gray-600">지역</span>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge 
                          className={`text-xs px-2 py-1 ${
                            event.status === "서브컬쳐 행사" ? "bg-blue-100 text-blue-800" :
                            event.status === "페어" ? "bg-green-100 text-green-800" :
                            event.status === "공모전" ? "bg-purple-100 text-purple-800" :
                            "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {event.status}
                        </Badge>
                        {event.isHot && (
                          <Badge className="bg-red-100 text-red-800 text-xs">HOT</Badge>
                        )}
                        {event.isNew && (
                          <Badge className="bg-green-100 text-green-800 text-xs">NEW</Badge>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                        {event.titleKo} ({event.startDate}~{event.endDate})
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>접수 일정 : {event.startDate}~{event.endDate}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <span>장소 : {event.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.participants.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{event.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{event.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{event.comments}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {event.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ml-6 flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600">다른 검색어나 필터를 사용해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}