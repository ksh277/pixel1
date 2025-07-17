import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Puzzle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "wouter";

const heroSlides = [
  {
    id: 1,
    title: { ko: "나만의 특별한 디자인을 만들어보세요", en: "Create Your Own Special Design" },
    subtitle: { ko: "고품질 아크릴 키링부터 맞춤 스티커까지", en: "From high-quality acrylic keychains to custom stickers" },
    image: "/api/placeholder/800/600",
    ctaText: { ko: "디자인 시작하기", en: "Start Designing" },
    bgColor: "from-blue-400 to-purple-600"
  },
  {
    id: 2,
    title: { ko: "최고의 프린팅 기술로 제작합니다", en: "Made with the Best Printing Technology" },
    subtitle: { ko: "내구성과 선명함을 동시에 만족하는 제품", en: "Products that satisfy both durability and clarity" },
    image: "/api/placeholder/800/600",
    ctaText: { ko: "제품 보기", en: "View Products" },
    bgColor: "from-green-400 to-blue-500"
  },
  {
    id: 3,
    title: { ko: "빠른 배송, 확실한 품질보장", en: "Fast Delivery, Quality Guaranteed" },
    subtitle: { ko: "3일 이내 제작완료, 무료배송 서비스", en: "Completed within 3 days, free shipping service" },
    image: "/api/placeholder/800/600",
    ctaText: { ko: "주문하기", en: "Order Now" },
    bgColor: "from-pink-400 to-red-500"
  }
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full px-4 py-12 bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold leading-snug mb-2 break-keep">
            {t(heroSlides[currentSlide].title)}
          </h1>
          <p className="text-sm mt-2 mb-6 text-white/90">
            {t(heroSlides[currentSlide].subtitle)}
          </p>

          <div className="mt-6 space-y-3 max-w-sm mx-auto">
            <Link href="/editor">
              <Button className="w-full py-3 bg-white text-indigo-600 font-semibold rounded shadow hover:bg-gray-100 transition-colors">
                <span className="text-indigo-600 dark:text-indigo-600 font-semibold">
                  {t({ ko: "디자인 시작하기", en: "Start Designing" })}
                </span>
              </Button>
            </Link>
            <Link href="/additional-services">
              <Button 
                variant="outline" 
                className="w-full py-3 border border-white rounded text-white hover:bg-white hover:text-indigo-600 transition-colors bg-transparent"
                style={{ borderColor: 'white', color: 'white' }}
              >
                <span className="text-white dark:text-white font-semibold">
                  {t({ ko: "도안작업 서비스", en: "Design Service" })}
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white opacity-90 scale-110' 
                : 'bg-white opacity-40 hover:opacity-60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}