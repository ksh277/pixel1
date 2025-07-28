import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  HelpCircle,
  ShoppingBag,
  Star,
  Palette,
  Megaphone,
  X,
  Send,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import belugaImage from "@assets/ChatGPT Image 2025년 7월 12일 오후 04_51_30_1752306698190.png";

interface BelugaMascotProps {
  variant:
    | "inquiry"
    | "empty-cart"
    | "login"
    | "mypage"
    | "error"
    | "review"
    | "design"
    | "event"
    | "loading";
  className?: string;
}

export function BelugaMascot({ variant, className = "" }: BelugaMascotProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      content: "안녕하세요. 올댓프린팅입니다! 😊\n발문해주셔서 감사합니다 :)",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "user",
          content: message,
          timestamp: new Date(),
        },
      ]);
      setMessage("");

      // 자동 응답 시뮬레이션
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "bot",
            content: "메시지를 확인했습니다. 곧 답변드리겠습니다.",
            timestamp: new Date(),
          },
        ]);
      }, 1000);
    }
  };

  const businessHours = {
    weekday: "AM 9시 ~ PM 6시",
    weekend: "PM 12시 ~ PM 1시",
    holiday: "(주말/공휴일 휴무)",
  };

  const variants = {
    inquiry: {
      icon: <MessageCircle className="w-6 h-6" />,
      message: t({
        ko: "무엇이든 물어보세요!",
        en: "Ask me anything!",
        ja: "何でも聞いてください！",
        zh: "有什么问题都可以问我！",
      }),
      position: "fixed bottom-4 right-4 z-[70]",
      size: "w-8 h-8",
      showTooltip: true,
    },
    "empty-cart": {
      icon: <ShoppingBag className="w-8 h-8" />,
      message: t({
        ko: "앗! 장바구니가 텅 비었어요…",
        en: "Oops! Your cart is empty…",
        ja: "あっ！カートが空です…",
        zh: "哎呀！购物车空了…",
      }),
      position: "mx-auto",
      size: "w-32 h-32",
      showTooltip: false,
    },
    login: {
      icon: <span className="text-2xl">👋</span>,
      message: t({
        ko: "처음이신가요? 벨루가가 도와드릴게요!",
        en: "New here? Beluga will help you!",
        ja: "初めてですか？ベルーガがお手伝いします！",
        zh: "第一次来吗？白鲸来帮您！",
      }),
      position: "mx-auto",
      size: "w-24 h-24",
      showTooltip: false,
    },
    mypage: {
      icon: <span className="text-2xl">🎁</span>,
      message: t({
        ko: "적립금 3,000원! 쿠폰도 있어요~",
        en: "3,000 points! You have coupons too~",
        ja: "3,000ポイント！クーポンもあります〜",
        zh: "3,000积分！还有优惠券哦~",
      }),
      position: "mx-auto",
      size: "w-20 h-20",
      showTooltip: false,
    },
    error: {
      icon: <HelpCircle className="w-8 h-8" />,
      message: t({
        ko: "앗! 벨루가가 길을 잃었어요...",
        en: "Oops! Beluga got lost...",
        ja: "あっ！ベルーガが迷子になりました...",
        zh: "哎呀！白鲸迷路了...",
      }),
      position: "mx-auto",
      size: "w-32 h-32",
      showTooltip: false,
    },
    review: {
      icon: <Star className="w-6 h-6" />,
      message: t({
        ko: "고객님의 소중한 리뷰를 기다려요!",
        en: "We're waiting for your precious review!",
        ja: "お客様の大切なレビューをお待ちしています！",
        zh: "我们期待您宝贵的评论！",
      }),
      position: "mx-auto",
      size: "w-16 h-16",
      showTooltip: false,
    },
    design: {
      icon: <Palette className="w-6 h-6" />,
      message: t({
        ko: "나만의 디자인을 올려주세요!",
        en: "Please upload your unique design!",
        ja: "あなただけのデザインをアップロードしてください！",
        zh: "请上传您独特的设计！",
      }),
      position: "mx-auto",
      size: "w-16 h-16",
      showTooltip: false,
    },
    event: {
      icon: <Megaphone className="w-6 h-6" />,
      message: t({
        ko: "진행 중인 이벤트 확인해보세요!",
        en: "Check out our ongoing events!",
        ja: "進行中のイベントをチェックしてください！",
        zh: "查看正在进行的活动！",
      }),
      position: "mx-auto",
      size: "w-16 h-16",
      showTooltip: false,
    },
    loading: {
      icon: (
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
      ),
      message: t({
        ko: "벨루가가 데이터를 불러오고 있어요… 잠시만요!",
        en: "Beluga is loading data… please wait!",
        ja: "ベルーガがデータを読み込んでいます… 少しお待ちください！",
        zh: "白鲸正在加载数据… 请稍候！",
      }),
      position: "mx-auto",
      size: "w-16 h-16",
      showTooltip: false,
    },
  };

  const config = variants[variant];

  if (variant === "inquiry") {
    return (
      <>
        {/* 채팅 위젯 */}
        {isChatOpen && (
          <div className="fixed bottom-24 right-6 z-[80] w-80 max-w-[calc(100vw-3rem)] h-96 max-h-[calc(100vh-8rem)] bg-white dark:bg-[#1a1a1a] rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* 헤더 */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">
                      올댓
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">올댓프린팅</h3>
                  <p className="text-xs text-blue-100">운영시간 보기 &gt;</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-blue-700 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* 메시지 영역 */}
            <div className="flex-1 p-4 h-64 overflow-y-auto bg-gray-50 dark:bg-[#1a1a1a]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                >
                  <div
                    className={`inline-block max-w-xs p-3 rounded-lg text-sm ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {msg.content.split("\n").map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>
              ))}

              {/* 운영시간 안내 */}
              <div className="mt-4 p-3 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    상담 가능시간 안내 (영업일기준)
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div>평일 {businessHours.weekday}</div>
                  <div>점심시간 {businessHours.weekend}</div>
                  <div>{businessHours.holiday}</div>
                </div>
              </div>
            </div>

            {/* 입력 영역 */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1a1a1a] dark:text-white"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gray-800 text-white hover:bg-gray-700 border-gray-600"
                >
                  문의하기 ▼
                </Button>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                월요일 오전 9:00부터 운영해요
              </div>
            </div>

            {/* 하단 버튼들 */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                다른 방법으로 문의
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-500 border-yellow-400"
                  title="카카오톡"
                >
                  <MessageCircle className="h-5 w-5 text-white" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 border-green-500"
                  title="네이버 톡톡"
                >
                  <MessageCircle className="h-5 w-5 text-white" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-12 h-12 rounded-full bg-gray-400 hover:bg-gray-500 border-gray-400"
                  title="더보기"
                >
                  <span className="text-white text-lg">⋯</span>
                </Button>
              </div>
              <div className="mt-3 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  채팅을 이용중
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 기존 문의하기 버튼 */}
        <div className={`${config.position} ${className}`}>
          <div className="relative">
            <Button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 border-2 border-blue-300 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 p-0 overflow-hidden relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label={t({
                ko: "문의하기 버튼",
                en: "Inquiry button",
                ja: "お問い合わせボタン",
                zh: "咨询按钮",
              })}
            >
              {/* Beluga Character - Fill entire button */}
              <img
                src={belugaImage}
                alt="Beluga Mascot"
                className="w-full h-full object-cover rounded-full"
              />

              {/* Text Label - Overlaid at bottom center */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white/80 rounded-full">
                <span className="text-xs font-bold text-blue-800 whitespace-nowrap">
                  {t({
                    ko: "문의하기",
                    en: "Inquiry",
                    ja: "お問い合わせ",
                    zh: "咨询",
                  })}
                </span>
              </div>
            </Button>

            {/* 말풍선 텍스트 */}
            {!isChatOpen && (
              <div className="absolute bottom-20 right-2 bg-white dark:bg-[#1a1a1a] px-3 py-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  올댓프린팅
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  운영시간 보기 &gt;
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
              </div>
            )}

            {config.showTooltip && isHovered && !isChatOpen && (
              <div className="absolute bottom-full right-0 mb-2 p-3 bg-white rounded-lg shadow-xl border border-blue-200 whitespace-nowrap animate-in fade-in-0 zoom-in-95">
                <div className="text-sm font-medium text-blue-900">
                  {config.message}
                </div>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={`${config.position} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <div className={`${config.size} relative`}>
          <img
            src={belugaImage}
            alt="Beluga Mascot"
            className="w-full h-full object-contain"
          />
          {variant === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="relative inline-block">
            <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-sm min-w-[120px] max-w-[240px] sm:max-w-sm">
              <p className="text-sm font-medium text-blue-900 text-center word-break-keep-all">
                <span className="inline-block whitespace-nowrap">
                  {config.message}
                </span>
              </p>
            </div>
            {/* Speech bubble tail */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-50"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Banner component for page headers
export function BelugaBanner({
  variant,
}: {
  variant: "review" | "design" | "event";
}) {
  const { t } = useLanguage();

  const bannerConfig = {
    review: {
      bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-900",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      message: t({
        ko: "고객님의 소중한 리뷰를 기다려요!",
        en: "We're waiting for your precious review!",
        ja: "お客様の大切なレビューをお待ちしています！",
        zh: "我们期待您宝贵的评论！",
      }),
    },
    design: {
      bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-900",
      icon: <Palette className="w-6 h-6 text-purple-500" />,
      message: t({
        ko: "나만의 디자인을 올려주세요!",
        en: "Please upload your unique design!",
        ja: "あなただけのデザインをアップロードしてください！",
        zh: "请上传您独特的设计！",
      }),
    },
    event: {
      bgColor: "bg-gradient-to-r from-red-50 to-orange-50",
      borderColor: "border-red-200",
      textColor: "text-red-900",
      icon: <Megaphone className="w-6 h-6 text-red-500" />,
      message: t({
        ko: "진행 중인 이벤트 확인해보세요!",
        en: "Check out our ongoing events!",
        ja: "進行中のイベントをチェックしてください！",
        zh: "查看正在进行的活动！",
      }),
    },
  };

  const config = bannerConfig[variant];

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2 mb-6`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 flex-shrink-0">
            <img
              src={belugaImage}
              alt="Beluga Mascot"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 flex items-center space-x-3">
            {config.icon}
            <p className={`text-lg font-semibold ${config.textColor}`}>
              {config.message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading overlay component
export function BelugaLoading({ isVisible }: { isVisible: boolean }) {
  const { t } = useLanguage();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <img
              src={belugaImage}
              alt="Beluga Mascot"
              className="w-full h-full object-contain animate-bounce"
            />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-blue-900 font-medium">
            {t({
              ko: "벨루가가 데이터를 불러오고 있어요… 잠시만요!",
              en: "Beluga is loading data… please wait!",
              ja: "ベルーガがデータを読み込んでいます… 少しお待ちください！",
              zh: "白鲸正在加载数据… 请稍候！",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
