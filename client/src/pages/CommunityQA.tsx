import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Heart, 
  Eye, 
  MessageCircle, 
  User,
  Edit3,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface QAPost {
  id: number;
  category: string;
  title: string;
  content: string;
  hashtags: string[];
  author: string;
  date: string;
  likes: number;
  views: number;
  comments: number;
  isNew: boolean;
  isAnswered: boolean;
  isExpertAnswer: boolean;
  isUnanswered: boolean;
}

const samplePosts: QAPost[] = [
  {
    id: 1,
    category: "굿즈지식인",
    title: "아크릴 키링 칼선 어떻게 해야 깔끔하게 나올까요?",
    content: "처음 키링 제작하는데 칼선이 너무 울퉁불퉁하게 나와요. 디자인할 때 주의사항이나 팁이 있나요? 혹시 선 굵기나 모양에 제한이 있는지 궁금해요.",
    hashtags: ["칼선", "아크릴키링", "디자인팁"],
    author: "굿즈초보자",
    date: "2025-01-12",
    likes: 15,
    views: 124,
    comments: 8,
    isNew: true,
    isAnswered: true,
    isExpertAnswer: true,
    isUnanswered: false
  },
  {
    id: 2,
    category: "도안러구인",
    title: "로고 디자인 도움 구해요 (유료)",
    content: "카페 로고 디자인이 필요한데 혹시 도안 작업 가능하신 분 계신가요? 심플하고 모던한 느낌으로 부탁드려요. 예산은 10만원 정도 생각하고 있어요.",
    hashtags: ["로고디자인", "의뢰", "카페"],
    author: "카페사장님",
    date: "2025-01-12",
    likes: 7,
    views: 89,
    comments: 3,
    isNew: true,
    isAnswered: false,
    isExpertAnswer: false,
    isUnanswered: true
  },
  {
    id: 3,
    category: "굿즈지식인",
    title: "스마트톡 제작 시 최소 수량이 얼마나 되나요?",
    content: "개인적으로 스마트톡 몇 개만 만들고 싶은데 최소 제작 수량이 궁금해요. 혹시 1개부터도 주문 가능한가요?",
    hashtags: ["스마트톡", "최소수량", "개인주문"],
    author: "혼자만든다",
    date: "2025-01-11",
    likes: 23,
    views: 187,
    comments: 12,
    isNew: false,
    isAnswered: true,
    isExpertAnswer: true,
    isUnanswered: false
  },
  {
    id: 4,
    category: "굿즈지식인",
    title: "투명 아크릴과 일반 아크릴 차이점이 뭔가요?",
    content: "키링 제작할 때 투명 아크릴과 일반 아크릴 중 어떤 걸 선택해야 할지 모르겠어요. 가격 차이도 있나요?",
    hashtags: ["아크릴", "투명아크릴", "재질차이"],
    author: "재질고민중",
    date: "2025-01-11",
    likes: 31,
    views: 245,
    comments: 15,
    isNew: false,
    isAnswered: true,
    isExpertAnswer: false,
    isUnanswered: false
  },
  {
    id: 5,
    category: "도안러구인",
    title: "캐릭터 일러스트 작업 구해요",
    content: "귀여운 캐릭터 일러스트 작업 가능하신 분 계신가요? 키링이나 스티커로 제작 예정이에요. 포트폴리오 있으시면 공유 부탁드려요.",
    hashtags: ["캐릭터", "일러스트", "키링"],
    author: "굿즈덕후",
    date: "2025-01-10",
    likes: 12,
    views: 156,
    comments: 6,
    isNew: false,
    isAnswered: false,
    isExpertAnswer: false,
    isUnanswered: true
  },
  {
    id: 6,
    category: "굿즈지식인",
    title: "파일 형식은 어떤 걸로 올려야 하나요?",
    content: "포토샵으로 작업한 파일인데 PSD 그대로 올려도 되나요? 아니면 PNG나 PDF로 변환해야 하나요? 해상도는 어떻게 설정해야 하는지도 궁금해요.",
    hashtags: ["파일형식", "해상도", "포토샵"],
    author: "파일고민",
    date: "2025-01-10",
    likes: 45,
    views: 378,
    comments: 22,
    isNew: false,
    isAnswered: true,
    isExpertAnswer: true,
    isUnanswered: false
  }
];

type TabType = "전체" | "도안러구인" | "굿즈지식인";
type SortType = "최신순" | "인기순" | "댓글순" | "조회순";

export default function CommunityQA() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("전체");
  const [sortType, setSortType] = useState<SortType>("최신순");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs: TabType[] = ["전체", "도안러구인", "굿즈지식인"];

  const filteredPosts = samplePosts.filter(post => {
    const matchesTab = activeTab === "전체" || post.category === activeTab;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortType) {
      case "최신순":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "인기순":
        return b.likes - a.likes;
      case "댓글순":
        return b.comments - a.comments;
      case "조회순":
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const totalPosts = filteredPosts.length;

  return (
    <div className="min-h-screen bg-white dark:bg-[#333D4D]">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">🤔</div>
              <div className="relative">
                <div className="bg-white dark:bg-[#2C2C2C] rounded-2xl px-4 py-2 shadow-sm border border-blue-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    "이거 어떻게 하지? 물어봐야겠다~"
                  </p>
                </div>
                <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-[#2C2C2C]"></div>
              </div>
            </div>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium"
            >
              궁금햄물어봐
            </Button>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="bg-blue-600 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-medium">
            더이상 혼자 고민하지 마세요. 너무 어려우면, 언제든지 물어보세요!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-col space-y-4 mb-6 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mobile-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-md font-medium transition-colors text-sm mobile-tab-item",
                  activeTab === tab
                    ? "bg-white dark:bg-[#2C2C2C] text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {tab}
                {tab === "전체" && (
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                    ({totalPosts})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-3">
            {/* Sort Dropdown */}
            <Select value={sortType} onValueChange={(value) => setSortType(value as SortType)}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="최신순">최신순</SelectItem>
                <SelectItem value="인기순">인기순</SelectItem>
                <SelectItem value="댓글순">댓글순</SelectItem>
                <SelectItem value="조회순">조회순</SelectItem>
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="검색어를 입력해 보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>

            {/* Write Button */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              <Edit3 className="h-4 w-4 mr-2" />
              글쓰기
            </Button>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {sortedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-[#2C2C2C] border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge 
                          variant={post.category === "굿즈지식인" ? "default" : "secondary"}
                          className={cn(
                            "text-xs",
                            post.category === "굿즈지식인" ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          )}
                        >
                          {post.category}
                        </Badge>
                        {post.isUnanswered && (
                          <Badge variant="outline" className="text-xs text-orange-600 dark:text-orange-400 border-orange-600 dark:border-orange-400">
                            답변대기
                          </Badge>
                        )}
                        {post.isExpertAnswer && (
                          <Badge variant="default" className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                            올댓지식인 답변
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        {post.title}
                        {post.isNew && (
                          <span className="ml-2 text-red-500 text-sm font-bold">🔴 N</span>
                        )}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.hashtags.map((tag, i) => (
                          <span key={i} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{post.author}</span>
                          <span className="text-xs text-gray-400">{post.date}</span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
            <p className="text-gray-400 text-sm">다른 키워드로 검색해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}