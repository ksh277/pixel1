import { useState } from "react";
import { Calendar, Users, Gift, Trophy, Star, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BelugaMascot } from "@/components/BelugaMascot";

interface Event {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  status: "진행중" | "예정" | "마감";
  statusColor: string;
  deadline: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  maxParticipants?: number;
  prize: string;
  prizeKo: string;
  image: string;
  category: string;
  tags: string[];
  isHot: boolean;
  requirements: string[];
  requirementsKo: string[];
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "New Year Design Contest",
    titleKo: "신년 디자인 공모전",
    description: "Create amazing New Year themed designs and win exciting prizes!",
    descriptionKo: "멋진 신년 테마 디자인을 만들고 흥미진진한 상품을 받아가세요!",
    status: "진행중",
    statusColor: "bg-green-500",
    deadline: "2024-12-31",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    participantCount: 1247,
    maxParticipants: 2000,
    prize: "1st Prize: ₩500,000, 2nd Prize: ₩300,000, 3rd Prize: ₩100,000",
    prizeKo: "1등: ₩500,000, 2등: ₩300,000, 3등: ₩100,000",
    image: "/api/placeholder/400/300",
    category: "공모전",
    tags: ["신년", "디자인", "공모전", "상금"],
    isHot: true,
    requirements: ["Original design only", "Submit in high resolution", "Korean theme preferred"],
    requirementsKo: ["독창적인 디자인만 가능", "고해상도로 제출", "한국적 테마 우대"]
  },
  {
    id: "2",
    title: "Member Registration Event",
    titleKo: "회원가입 이벤트",
    description: "Join our community and receive special welcome coupons!",
    descriptionKo: "커뮤니티에 가입하고 특별한 환영 쿠폰을 받아보세요!",
    status: "진행중",
    statusColor: "bg-blue-500",
    deadline: "2024-12-25",
    startDate: "2024-12-01",
    endDate: "2024-12-25",
    participantCount: 3456,
    prize: "₩5,000 coupon + 10% discount",
    prizeKo: "₩5,000 쿠폰 + 10% 할인",
    image: "/api/placeholder/400/300",
    category: "이벤트",
    tags: ["회원가입", "쿠폰", "할인", "신규회원"],
    isHot: false,
    requirements: ["New members only", "Complete profile setup", "Verify email"],
    requirementsKo: ["신규 회원만 가능", "프로필 설정 완료", "이메일 인증"]
  },
  {
    id: "3",
    title: "Holiday Season Special",
    titleKo: "홀리데이 시즌 스페셜",
    description: "Upload your holiday designs and get featured on our homepage!",
    descriptionKo: "홀리데이 디자인을 업로드하고 홈페이지에 소개되어 보세요!",
    status: "예정",
    statusColor: "bg-yellow-500",
    deadline: "2025-01-15",
    startDate: "2024-12-20",
    endDate: "2025-01-15",
    participantCount: 0,
    maxParticipants: 500,
    prize: "Homepage feature + ₩50,000 gift card",
    prizeKo: "홈페이지 소개 + ₩50,000 상품권",
    image: "/api/placeholder/400/300",
    category: "이벤트",
    tags: ["홀리데이", "업로드", "홈페이지", "상품권"],
    isHot: true,
    requirements: ["Holiday theme required", "Original content only", "High quality images"],
    requirementsKo: ["홀리데이 테마 필수", "독창적 내용만 가능", "고품질 이미지"]
  }
];

export default function CommunityEvents() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleParticipate = (eventId: string) => {
    toast({
      title: t({ ko: "참여 신청", en: "Participation Request", ja: "参加申請", zh: "参与申请" }),
      description: t({ ko: "이벤트 참여 신청이 완료되었습니다!", en: "Event participation request completed!", ja: "イベント参加申請が完了しました！", zh: "活动参与申请已完成！" }),
    });
  };

  const getStatusBadge = (event: Event) => {
    const colors = {
      "진행중": "bg-green-500 text-white",
      "예정": "bg-yellow-500 text-white",
      "마감": "bg-gray-500 text-white"
    };
    
    return (
      <Badge className={colors[event.status]}>
        {event.status}
      </Badge>
    );
  };

  const calculateProgress = (event: Event) => {
    if (!event.maxParticipants) return 0;
    return (event.participantCount / event.maxParticipants) * 100;
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
            <div className="mb-6">
              <BelugaMascot variant="event" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t({ ko: "이벤트", en: "Events", ja: "イベント", zh: "活动" })}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {t({ ko: "다양한 혜택과 재미있는 이벤트에 참여하세요", en: "Join various benefits and exciting events", ja: "様々な特典と楽しいイベントに参加しましょう", zh: "参加各种福利和有趣的活动" })}
            </p>
          </motion.div>

          {/* Event Statistics */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center bg-white dark:bg-[#1F2D4A] border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {t({ ko: "진행중인 이벤트", en: "Active Events", ja: "進行中のイベント", zh: "进行中的活动" })}
                </div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white dark:bg-[#1F2D4A] border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">4,703</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {t({ ko: "총 참여자", en: "Total Participants", ja: "総参加者", zh: "总参与者" })}
                </div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white dark:bg-[#1F2D4A] border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <Gift className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">₩950,000</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {t({ ko: "총 상금", en: "Total Prizes", ja: "総賞金", zh: "总奖金" })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Event Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {mockEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white dark:bg-[#1F2D4A] border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.titleKo}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {getStatusBadge(event)}
                    {event.isHot && (
                      <Badge className="bg-red-500 text-white">HOT</Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 dark:bg-[#1F2D4A]/90 dark:text-white">
                      {event.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                    {event.titleKo}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {event.descriptionKo}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Deadline */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {t({ ko: "마감", en: "Deadline", ja: "締切", zh: "截止日期" })}: {event.deadline}
                    </span>
                    <span className="text-red-500 font-medium">
                      ({getDaysRemaining(event.deadline)}일 남음)
                    </span>
                  </div>

                  {/* Participants */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="dark:text-gray-300">{t({ ko: "참여자", en: "Participants", ja: "参加者", zh: "参与者" })}</span>
                      </div>
                      <span className="font-medium dark:text-gray-200">
                        {event.participantCount.toLocaleString()}
                        {event.maxParticipants && ` / ${event.maxParticipants.toLocaleString()}`}
                      </span>
                    </div>
                    {event.maxParticipants && (
                      <Progress value={calculateProgress(event)} className="h-2" />
                    )}
                  </div>

                  {/* Prize */}
                  <div className="flex items-start gap-2 text-sm">
                    <Gift className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">{t({ ko: "상금", en: "Prize", ja: "賞金", zh: "奖金" })}: </span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{event.prizeKo}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button
                      onClick={() => handleParticipate(event.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={event.status === "마감"}
                    >
                      {event.status === "마감" ? (
                        t({ ko: "마감됨", en: "Closed", ja: "終了", zh: "已结束" })
                      ) : event.status === "예정" ? (
                        t({ ko: "알림 받기", en: "Get Notified", ja: "通知を受け取る", zh: "获取通知" })
                      ) : (
                        <>
                          {t({ ko: "참여하기", en: "Participate", ja: "参加する", zh: "参与" })}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              {t({ ko: "더 많은 이벤트가 준비되어 있습니다!", en: "More events are coming soon!", ja: "さらなるイベントが準備されています！", zh: "更多活动即将到来！" })}
            </h2>
            <p className="text-lg mb-6 opacity-90">
              {t({ ko: "알림을 받고 최신 이벤트 소식을 놓치지 마세요", en: "Get notifications and don't miss the latest event news", ja: "通知を受け取り、最新のイベント情報をお見逃しなく", zh: "接收通知，不要错过最新的活动消息" })}
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              {t({ ko: "알림 신청하기", en: "Subscribe to Notifications", ja: "通知申請", zh: "订阅通知" })}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}