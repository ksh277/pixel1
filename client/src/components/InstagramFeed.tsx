import { useState } from "react";
import { Heart, MessageCircle, Eye } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

interface InstagramPost {
  id: number;
  image: string;
  likes: number;
  comments: number;
  caption: string;
  author: string;
  tags: string[];
}

const mockInstagramPosts: InstagramPost[] = [
  {
    id: 1,
    image: "https://picsum.photos/300/300?random=1",
    likes: 127,
    comments: 8,
    caption: "투명 아크릴 키링 완성! 홀로그램 효과가 너무 예뻐요 ✨",
    author: "디자이너***",
    tags: ["아크릴", "키링", "홀로그램"]
  },
  {
    id: 2,
    image: "https://picsum.photos/300/300?random=2",
    likes: 89,
    comments: 12,
    caption: "우드 스탠드 제작 완료! 나무 질감이 정말 고급스러워요 🌟",
    author: "창작자***",
    tags: ["우드", "스탠드", "고급"]
  },
  {
    id: 3,
    image: "https://picsum.photos/300/300?random=3",
    likes: 203,
    comments: 15,
    caption: "반투명 스마트톡 대박! 접착력도 좋고 회전도 부드러워요 💫",
    author: "사용자***",
    tags: ["스마트톡", "반투명", "회전"]
  },
  {
    id: 4,
    image: "https://picsum.photos/300/300?random=4",
    likes: 156,
    comments: 6,
    caption: "단체 키링 주문 완료! 팀원들 모두 만족해요 🎉",
    author: "팀리더***",
    tags: ["단체", "키링", "팀"]
  },
  {
    id: 5,
    image: "https://picsum.photos/300/300?random=5",
    likes: 178,
    comments: 9,
    caption: "홀로그램 스티커 반짝반짝! 노트북에 붙였는데 너무 이뻐요 ✨",
    author: "학생***",
    tags: ["홀로그램", "스티커", "노트북"]
  },
  {
    id: 6,
    image: "https://picsum.photos/300/300?random=6",
    likes: 245,
    comments: 18,
    caption: "나만의 캐릭터 굿즈 완성! 퀄리티가 정말 좋아요 🔥",
    author: "아티스트***",
    tags: ["캐릭터", "굿즈", "퀄리티"]
  }
];

export function InstagramFeed() {
  const { t } = useLanguage();
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      className="section-spacing bg-gray-50 dark:bg-[#0d1b2a] py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between section-header mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📸</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-white">
              {t({ 
                ko: "인스타그램 피드", 
                en: "Instagram Feed", 
                ja: "インスタグラムフィード", 
                zh: "Instagram动态" 
              })}
            </h2>
            <p className="text-sm text-muted-foreground dark:text-gray-300 hidden sm:block">
              {t({
                ko: "고객들이 직접 올린 굿즈 자랑 피드",
                en: "Customer showcase feed",
                ja: "お客様のグッズ自慢フィード",
                zh: "客户展示动态"
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Instagram Grid - Pure image grid without any background cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {mockInstagramPosts.map((post) => (
          <motion.div
            key={post.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="relative group aspect-square overflow-hidden rounded-lg cursor-pointer transition-all duration-300"
            onMouseEnter={() => setHoveredPost(post.id)}
            onMouseLeave={() => setHoveredPost(null)}
          >
            {/* Post Image - Pure image without any background container */}
            <img
              src={post.image}
              alt={post.caption}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "https://picsum.photos/300/300?random=99";
              }}
            />
            
            {/* Hover Overlay */}
            <div className={`absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-2 ${
              hoveredPost === post.id ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* Interaction Stats */}
              <div className="flex gap-3 mb-2">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  <span className="font-semibold text-sm">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-semibold text-sm">{post.comments}</span>
                </div>
              </div>
              
              {/* Caption */}
              <p className="text-center text-xs line-clamp-2 mb-1 text-white font-medium leading-snug">
                {post.caption}
              </p>
              
              {/* Author */}
              <p className="text-xs text-gray-100 leading-snug">
                by {post.author}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* View More Button */}
      <div className="text-center mt-8">
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium text-sm">
          {t({ 
            ko: "더 많은 피드 보기", 
            en: "View More Feed", 
            ja: "もっと見る", 
            zh: "查看更多动态" 
          })}
        </button>
      </div>
    </motion.section>
  );
}