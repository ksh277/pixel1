import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Puzzle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "wouter";
import heroImage from "@assets/4adbd4f4-b8b6-4cc8-ee8f-551893ab1baa_1753143805891.gif";

const heroSlides = [
  {
    id: 1,
    title: {
      ko: "나만의 특별한 디자인을 만들어보세요",
      en: "Create Your Own Special Design",
    },
    subtitle: {
      ko: "고품질 아크릴 키링부터 맞춤 스티커까지",
      en: "From high-quality acrylic keychains to custom stickers",
    },
    image: heroImage,
    ctaText: { ko: "디자인 시작하기", en: "Start Designing" },
    bgColor: "from-blue-400 to-purple-600",
  },
  {
    id: 2,
    title: {
      ko: "시선이 머무는 굿즈, 렌티큘러 3중 굿즈",
      en: "Eye-catching goods, Lenticular 3-layer goods",
    },
    subtitle: {
      ko: "렌티큘러 스마트톡 굿즈, 스마트톡까지 제안이 가능한 신경쓸 지점 먼나세요!",
      en: "Lenticular smart tok goods, proposing smart tok - details you should consider!",
    },
    image: heroImage,
    ctaText: { ko: "상품 보기", en: "View Products" },
    bgColor: "from-green-400 to-blue-500",
  },
  {
    id: 3,
    title: {
      ko: "빠른 배송, 확실한 품질보장",
      en: "Fast Delivery, Quality Guaranteed",
    },
    subtitle: {
      ko: "3일 이내 제작완료, 무료배송 서비스",
      en: "Completed within 3 days, free shipping service",
    },
    image: heroImage,
    ctaText: { ko: "주문하기", en: "Order Now" },
    bgColor: "from-pink-400 to-red-500",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(1); // Start with slide 1 (GIF image)
  const { t } = useLanguage();

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <img
            src={heroSlides[currentSlide].image}
            alt={t(heroSlides[currentSlide].title)}
            className="w-full max-w-5xl mx-auto h-auto object-contain"
          />
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators - positioned over the image */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white opacity-90 scale-110"
                : "bg-white opacity-40 hover:opacity-60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
