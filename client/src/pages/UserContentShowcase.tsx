import { BestReviewsSection } from "@/components/BestReviewsSection";
import { ReviewRewardsSection } from "@/components/ReviewRewardsSection";
import { CommunityShowcaseSection } from "@/components/CommunityShowcaseSection";
import { AllReviewsListSection } from "@/components/AllReviewsListSection";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

export default function UserContentShowcase() {
  const { t } = useLanguage();

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A1A1A]">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1A1A1A] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t({ ko: "고객 후기 & 커뮤니티", en: "Customer Reviews & Community", ja: "顧客レビュー・コミュニティ", zh: "客户评论与社区" })}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t({ ko: "실제 고객들의 생생한 후기와 창작자들의 작품을 만나보세요", en: "Discover authentic customer reviews and creators' amazing works", ja: "実際のお客様の生の声とクリエイターの作品をご覧ください", zh: "发现真实客户评论和创作者的精彩作品" })}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto py-4">
            <a href="#best-reviews" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap">
              💌 {t({ ko: "베스트 리뷰", en: "Best Reviews", ja: "ベストレビュー", zh: "最佳评论" })}
            </a>
            <a href="#review-rewards" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap">
              🎁 {t({ ko: "리뷰 혜택", en: "Review Rewards", ja: "レビュー特典", zh: "评论奖励" })}
            </a>
            <a href="#community-showcase" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap">
              🎨 {t({ ko: "굿즈 자랑", en: "Goods Showcase", ja: "グッズ自慢", zh: "商品展示" })}
            </a>
            <a href="#all-reviews" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap">
              📊 {t({ ko: "전체 후기", en: "All Reviews", ja: "全レビュー", zh: "所有评论" })}
            </a>
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="space-y-16"
      >
        {/* Section 1: Best Reviews */}
        <motion.section id="best-reviews" variants={itemVariants} className="bg-white dark:bg-[#1A1A1A]">
          <BestReviewsSection />
        </motion.section>

        {/* Section 2: Review Rewards */}
        <motion.section id="review-rewards" variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <ReviewRewardsSection />
        </motion.section>

        {/* Section 3: Community Showcase */}
        <motion.section id="community-showcase" variants={itemVariants} className="bg-white dark:bg-[#1A1A1A]">
          <CommunityShowcaseSection />
        </motion.section>

        {/* Section 4: All Reviews List */}
        <motion.section id="all-reviews" variants={itemVariants} className="bg-gray-50 dark:bg-[#1A1A1A]">
          <AllReviewsListSection />
        </motion.section>
      </motion.div>

      {/* Call to Action Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t({ ko: "지금 바로 시작해보세요!", en: "Start Right Now!", ja: "今すぐ始めましょう！", zh: "立即开始！" })}
            </h2>
            <p className="text-xl opacity-90 mb-8">
              {t({ ko: "나만의 특별한 굿즈를 만들고 후기를 남겨보세요", en: "Create your own special goods and leave reviews", ja: "自分だけの特別なグッズを作り、レビューを残してみましょう", zh: "创造你自己的特殊商品并留下评论" })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {t({ ko: "제품 둘러보기", en: "Browse Products", ja: "製品を見る", zh: "浏览产品" })}
              </a>
              <a href="/community" className="bg-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30">
                {t({ ko: "커뮤니티 참여", en: "Join Community", ja: "コミュニティに参加", zh: "加入社区" })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}