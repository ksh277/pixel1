import { Gift, Camera, Star, MessageSquare, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

interface RewardTier {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  reward: string;
  rewardKo: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const rewardTiers: RewardTier[] = [
  {
    id: "text",
    title: "Text Review",
    titleKo: "텍스트 리뷰",
    description: "Share your honest thoughts about the product",
    descriptionKo: "제품에 대한 솔직한 후기를 남겨주세요",
    reward: "₩1,000",
    rewardKo: "₩1,000",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    id: "photo",
    title: "Photo/Video Review",
    titleKo: "포토/비디오 리뷰",
    description: "Show us your product with photos or videos",
    descriptionKo: "사진이나 영상으로 제품을 보여주세요",
    reward: "₩3,000",
    rewardKo: "₩3,000",
    icon: Camera,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    id: "best",
    title: "Best Review",
    titleKo: "베스트 리뷰",
    description: "Get selected as the best review by our team",
    descriptionKo: "운영진이 선정하는 베스트 리뷰로 선택되세요",
    reward: "₩10,000",
    rewardKo: "₩10,000",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  }
];

export function ReviewRewardsSection() {
  const { t } = useLanguage();

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t({ ko: "후기를 부탁해~", en: "Please Leave a Review~", ja: "レビューをお願いします~", zh: "请留下评论~" })}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {t({ ko: "소중한 후기를 남겨주시면 포인트를 드려요!", en: "Leave a precious review and get points!", ja: "貴重なレビューを残していただくとポイントを差し上げます！", zh: "留下宝贵的评论即可获得积分！" })}
          </p>
          <div className="flex justify-center">
            <Badge className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 text-sm">
              {t({ ko: "여러분의 후기가 정말 큰 도움이 돼요!", en: "Your reviews are a huge help!", ja: "皆様のレビューが本当に大きな助けになります！", zh: "您的评论对我们帮助很大！" })}
            </Badge>
          </div>
        </motion.div>

        {/* Reward Tiers */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewardTiers.map((tier, index) => {
            const IconComponent = tier.icon;
            return (
              <Card key={tier.id} className="relative group hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-[#1F2D4A] border-gray-200 dark:border-gray-700">
                <CardHeader className="text-center pb-3">
                  <div className={`w-16 h-16 mx-auto rounded-full ${tier.bgColor} dark:bg-opacity-20 flex items-center justify-center mb-4`}>
                    <IconComponent className={`h-8 w-8 ${tier.color}`} />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    {t({ ko: tier.titleKo, en: tier.title, ja: tier.titleKo, zh: tier.titleKo })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t({ ko: tier.descriptionKo, en: tier.description, ja: tier.descriptionKo, zh: tier.descriptionKo })}
                  </p>
                  
                  <div className="py-3">
                    <div className={`text-2xl font-bold ${tier.color} mb-1`}>
                      {tier.rewardKo}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t({ ko: "포인트 적립", en: "Points Earned", ja: "ポイント獲得", zh: "积分奖励" })}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-gray-50 dark:group-hover:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  >
                    {t({ ko: "리뷰 작성하기", en: "Write Review", ja: "レビューを書く", zh: "写评论" })}
                  </Button>
                </CardContent>

                {/* Special Badge for Best Review */}
                {tier.id === "best" && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-lg">
                      HOT
                    </Badge>
                  </div>
                )}
              </Card>
            );
          })}
        </motion.div>

        {/* Important Notice */}
        <motion.div variants={itemVariants} className="bg-gray-50 dark:bg-[#1F2D4A] rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t({ ko: "리뷰 적립 안내", en: "Review Rewards Notice", ja: "レビュー積立案内", zh: "评论奖励须知" })}
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• {t({ ko: "주문번호당 1회만 적립됩니다 (여러 리뷰 작성시에도 1회만)", en: "Rewards only given once per order number even if multiple reviews are submitted", ja: "注文番号あたり1回のみ積立されます（複数レビュー作成時も1回のみ）", zh: "每个订单号只能获得一次奖励（即使提交多个评论）" })}</li>
                <li>• {t({ ko: "베스트 리뷰는 운영진이 매주 선정합니다", en: "Best reviews are selected by our team weekly", ja: "ベストレビューは運営陣が毎週選定します", zh: "最佳评论由我们的团队每周选出" })}</li>
                <li>• {t({ ko: "포인트는 리뷰 승인 후 3일 이내에 적립됩니다", en: "Points are credited within 3 days after review approval", ja: "ポイントはレビュー承認後3日以内に積立されます", zh: "积分将在评论通过后3天内发放" })}</li>
                <li>• {t({ ko: "부적절한 리뷰는 삭제되며 포인트가 차감될 수 있습니다", en: "Inappropriate reviews may be deleted and points deducted", ja: "不適切なレビューは削除され、ポイントが差し引かれる場合があります", zh: "不当评论可能会被删除并扣除积分" })}</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12,547</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t({ ko: "총 리뷰", en: "Total Reviews", ja: "総レビュー", zh: "总评论" })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">8,321</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t({ ko: "포토 리뷰", en: "Photo Reviews", ja: "フォトレビュー", zh: "照片评论" })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">156</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t({ ko: "베스트 리뷰", en: "Best Reviews", ja: "ベストレビュー", zh: "最佳评论" })}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">₩4.9M</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {t({ ko: "지급된 포인트", en: "Points Distributed", ja: "支給されたポイント", zh: "已发放积分" })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}