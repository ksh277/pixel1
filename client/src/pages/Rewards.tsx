import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, 
  Star, 
  Crown, 
  Trophy, 
  Coins, 
  ShoppingBag, 
  Truck, 
  Percent,
  Calendar,
  Check,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Rewards() {
  const { language, t } = useLanguage();
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

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

  const coupons = [
    {
      title: { ko: "회원가입 축하", en: "Membership Join Reward", ja: "会員登録お祝い", zh: "会员注册奖励" },
      amount: "2,000",
      description: { ko: "가입 즉시 지급", en: "Issued immediately upon registration", ja: "登録後すぐに発行", zh: "注册后立即发放" },
      validity: { ko: "30일", en: "30 days", ja: "30日", zh: "30天" },
      icon: <Gift className="w-6 h-6" />,
      color: "bg-blue-500"
    },
    {
      title: { ko: "첫 구매 감사", en: "First Purchase Thanks", ja: "初回購入感謝", zh: "首次购买感谢" },
      amount: "1,000",
      description: { ko: "첫 주문 완료 시", en: "Upon first order completion", ja: "初回注文完了時", zh: "首次订单完成时" },
      validity: { ko: "60일", en: "60 days", ja: "60日", zh: "60天" },
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      title: { ko: "생일 축하", en: "Birthday Celebration", ja: "誕生日お祝い", zh: "生日庆祝" },
      amount: "1,000",
      description: { ko: "생일월 자동 지급", en: "Automatically issued on birthday month", ja: "誕生月自動発行", zh: "生日月自动发放" },
      validity: { ko: "30일", en: "30 days", ja: "30日", zh: "30天" },
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-purple-500"
    }
  ];

  const tiers = [
    {
      name: { ko: "BASIC", en: "BASIC", ja: "BASIC", zh: "BASIC" },
      icon: <Star className="w-6 h-6" />,
      requirement: { ko: "연간 300만원 미만", en: "Under 3 million KRW per year", ja: "年間300万ウォン未満", zh: "年消费300万韩元以下" },
      points: { ko: "결제금액의 1%", en: "1% of purchase amount", ja: "決済金額の1%", zh: "消费金额的1%" },
      shipping: { ko: "5만원 이상 무료배송", en: "Free shipping over 50,000 KRW", ja: "5万ウォン以上送料無料", zh: "消费满5万韩元免运费" },
      benefits: { ko: "기본 혜택", en: "Basic benefits", ja: "基本特典", zh: "基本优惠" },
      color: "bg-gray-100 border-gray-200",
      textColor: "text-gray-700"
    },
    {
      name: { ko: "SPECIAL", en: "SPECIAL", ja: "SPECIAL", zh: "SPECIAL" },
      icon: <Sparkles className="w-6 h-6" />,
      requirement: { ko: "연간 300만원 이상", en: "Over 3 million KRW per year", ja: "年間300万ウォン以上", zh: "年消费300万韩元以上" },
      points: { ko: "결제금액의 1% + 2%", en: "1% + 2% of purchase amount", ja: "決済金額の1% + 2%", zh: "消费金额的1% + 2%" },
      shipping: { ko: "3만원 이상 무료배송", en: "Free shipping over 30,000 KRW", ja: "3万ウォン以上送料無料", zh: "消费满3万韩元免运费" },
      benefits: { ko: "특별 할인 쿠폰", en: "Special discount coupons", ja: "特別割引クーポン", zh: "特别折扣优惠券" },
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700"
    },
    {
      name: { ko: "VIP", en: "VIP", ja: "VIP", zh: "VIP" },
      icon: <Crown className="w-6 h-6" />,
      requirement: { ko: "연간 600만원 이상", en: "Over 6 million KRW per year", ja: "年間600万ウォン以上", zh: "年消费600万韩元以上" },
      points: { ko: "결제금액의 1% + 4%", en: "1% + 4% of purchase amount", ja: "決済金額の1% + 4%", zh: "消费金额的1% + 4%" },
      shipping: { ko: "전 상품 무료배송", en: "Free shipping on all orders", ja: "全商品送料無料", zh: "全商品免运费" },
      benefits: { ko: "VIP 전용 혜택 + 브로셔", en: "VIP exclusive benefits + brochure", ja: "VIP専用特典 + パンフレット", zh: "VIP专享优惠 + 宣传册" },
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700"
    },
    {
      name: { ko: "VVIP", en: "VVIP", ja: "VVIP", zh: "VVIP" },
      icon: <Trophy className="w-6 h-6" />,
      requirement: { ko: "연간 1000만원 이상", en: "Over 10 million KRW per year", ja: "年間1000万ウォン以上", zh: "年消费1000万韩元以上" },
      points: { ko: "결제금액의 1% + 6%", en: "1% + 6% of purchase amount", ja: "決済金額の1% + 6%", zh: "消费金额的1% + 6%" },
      shipping: { ko: "전 상품 무료배송", en: "Free shipping on all orders", ja: "全商品送料無料", zh: "全商品免运费" },
      benefits: { ko: "VVIP 전용 혜택 + 샘플키트", en: "VVIP exclusive benefits + sample kit", ja: "VVIP専用特典 + サンプルキット", zh: "VVIP专享优惠 + 样品套装" },
      color: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t({ 
                ko: "리워드 포인트 / 멤버십 등급 혜택 안내", 
                en: "Reward Points / Membership Tier Benefits Guide",
                ja: "リワードポイント / メンバーシップ等級特典案内",
                zh: "积分奖励 / 会员等级优惠指南"
              })}
            </h1>
            <p className="text-xl opacity-90">
              {t({ 
                ko: "픽셀굿즈에 가입하고 포인트 리워드와 전용 등급 혜택을 누리세요!",
                en: "Join PixelGoods and enjoy point rewards and exclusive tier benefits!",
                ja: "PixelGoodsに加入してポイントリワードと専用等級特典をお楽しみください！",
                zh: "加入PixelGoods，享受积分奖励和专属等级优惠！"
              })}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Top Banner */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t({ 
                ko: "픽셀굿즈 가입 시 즉시 혜택!",
                en: "Instant Benefits When You Join PixelGoods!",
                ja: "PixelGoods加入時即時特典！",
                zh: "加入PixelGoods即享优惠！"
              })}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {t({ 
                ko: "픽셀굿즈에 가입하시면 ", 
                en: "When you join PixelGoods, you receive ",
                ja: "PixelGoodsに加入すると、",
                zh: "加入PixelGoods后，您将立即获得"
              })}
              <span className="font-bold text-blue-600">
                {t({ ko: "리워드 포인트", en: "reward points", ja: "リワードポイント", zh: "积分奖励" })}
              </span>
              {t({ ko: "와 ", en: " and ", ja: "と", zh: "和" })}
              <span className="font-bold text-purple-600">
                {t({ ko: "등급별 혜택", en: "tier-based benefits", ja: "等級別特典", zh: "等级优惠" })}
              </span>
              {t({ 
                ko: "을 바로 받으실 수 있습니다!",
                en: " right away!",
                ja: "をすぐに受け取ることができます！",
                zh: "！"
              })}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                <Coins className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reward Coupons Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t({ 
                ko: "지금 가입하고 3가지 리워드 쿠폰을 바로 받으세요!",
                en: "Sign up now and get 3 reward coupons instantly!",
                ja: "今すぐ登録して3つのリワードクーポンをすぐに受け取ってください！",
                zh: "立即注册，即刻获得3种奖励优惠券！"
              })}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.map((coupon, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className={`${coupon.color} p-4 text-white`}>
                    <div className="flex items-center justify-between mb-2">
                      {coupon.icon}
                      <Badge className="bg-white/20 text-white">
                        {t({ ko: "즉시 지급", en: "Instant", ja: "即時", zh: "即时" })}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg text-white">
                      {language === 'ko' ? coupon.title.ko : coupon.title.en}
                    </h3>
                    <div className="text-2xl font-bold text-white">
                      ₩{coupon.amount}
                    </div>
                    <p className="text-white/80 text-sm">
                      {language === 'ko' ? coupon.description.ko : coupon.description.en}
                    </p>
                  </div>
                  <CardContent className="p-6 bg-white dark:bg-white">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {t({ ko: "유효기간:", en: "Valid for:", ja: "有効期限:", zh: "有效期:" })} {language === 'ko' ? coupon.validity.ko : coupon.validity.en}
                      </div>
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            <p>
              {t({ 
                ko: "*쿠폰은 자동으로 지급됩니다. 유효기간은 쿠폰별로 다를 수 있습니다 (30~60일).",
                en: "*Coupons are automatically issued. Validity may vary (30~60 days).",
                ja: "*クーポンは自動的に発行されます。有効期限はクーポンによって異なる場合があります（30~60日）。",
                zh: "*优惠券将自动发放。有效期可能因优惠券而异（30~60天）。"
              })}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Tier Benefits Table */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t({ 
                ko: "등급별 멤버십 혜택 비교",
                en: "Compare Membership Benefits by Tier",
                ja: "等級別メンバーシップ特典比較",
                zh: "按等级比较会员优惠"
              })}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onMouseEnter={() => setHoveredTier(tier.name.ko)}
                onMouseLeave={() => setHoveredTier(null)}
                className={`transform transition-all duration-300 ${
                  hoveredTier === tier.name.ko ? 'scale-105' : ''
                }`}
              >
                <Card className={`h-full ${tier.color} border-2 hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-[#1a1a1a] dark:border-gray-700`}>
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center mb-4 ${tier.textColor}`}>
                      {tier.icon}
                    </div>
                    <CardTitle className={`text-xl font-bold ${tier.textColor}`}>
                      {tier.name.ko}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="bg-white/50 dark:bg-[#1a1a1a]/50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                          {t({ ko: "등급 조건", en: "Tier Requirement", ja: "等級条件", zh: "等级要求" })}
                        </div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {language === 'ko' ? tier.requirement.ko : tier.requirement.en}
                        </div>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-[#1a1a1a]/50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-1 flex items-center">
                          <Percent className="w-3 h-3 mr-1" />
                          {t({ ko: "포인트", en: "Points", ja: "ポイント", zh: "积分" })}
                        </div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {language === 'ko' ? tier.points.ko : tier.points.en}
                        </div>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-[#1a1a1a]/50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-1 flex items-center">
                          <Truck className="w-3 h-3 mr-1" />
                          {t({ ko: "배송", en: "Shipping", ja: "배송", zh: "配送" })}
                        </div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {language === 'ko' ? tier.shipping.ko : tier.shipping.en}
                        </div>
                      </div>
                      
                      <div className="bg-white/50 dark:bg-[#1a1a1a]/50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-1 flex items-center">
                          <Gift className="w-3 h-3 mr-1" />
                          {t({ ko: "추가 혜택", en: "Benefits", ja: "追加特典", zh: "附加优惠" })}
                        </div>
                        <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {language === 'ko' ? tier.benefits.ko : tier.benefits.en}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            <p>
              {t({ 
                ko: "*등급은 매년 1월 9일~12월 31일 기간 실제 결제 금액을 기준으로 산정됩니다.",
                en: "*Tiers are based on actual payment amounts from Jan 9 to Dec 31 annually.",
                ja: "*等級は毎年1月9日～12月31日の期間の実際の決済金額を基準に算定されます。",
                zh: "*等级基于每年1月9日至12月31日的实际付款金额计算。"
              })}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">
            {t({ 
              ko: "지금 가입하고 혜택을 받으세요!",
              en: "Join now and start enjoying the benefits!",
              ja: "今すぐ加入して特典を受け取ってください！",
              zh: "立即加入，开始享受优惠！"
            })}
          </h3>
          <p className="text-lg opacity-90 mb-6">
            {t({ 
              ko: "회원가입 즉시 2,000원 쿠폰과 다양한 혜택이 기다리고 있습니다.",
              en: "A 2,000 KRW coupon and various benefits are waiting for you upon registration.",
              ja: "会員登録後すぐに2,000ウォンクーポンと様々な特典があなたを待っています。",
              zh: "注册后立即获得2,000韩元优惠券和各种优惠等着您。"
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                <Gift className="w-5 h-5 mr-2" />
                {t({ ko: "무료 회원가입", en: "Free Registration", ja: "無料会員登録", zh: "免费注册" })}
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Star className="w-5 h-5 mr-2" />
                {t({ ko: "로그인", en: "Login", ja: "ログイン", zh: "登录" })}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}