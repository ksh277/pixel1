import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, MessageCircle, ChevronRight } from "lucide-react";

interface Collection {
  id: string;
  title: { ko: string; en: string; ja: string; zh: string };
  subtitle: { ko: string; en: string; ja: string; zh: string };
  imageUrl: string;
  label: { ko: string; en: string; ja: string; zh: string };
  labelColor: string;
  likes: number;
  views: number;
  comments: number;
  href: string;
}

export default function Collections() {
  const { t } = useLanguage();
  const [likedCollections, setLikedCollections] = useState<string[]>([]);

  const collections: Collection[] = [
    {
      id: "color-acrylic",
      title: { ko: "컬러 아크릴 모음전", en: "Color Acrylic Collection", ja: "カラーアクリルコレクション", zh: "彩色亚克力合集" },
      subtitle: { ko: "내 그림에 맞는 컬러 아크릴을 선택해 굿즈를 만들어보세요", en: "Choose the right color acrylic for your artwork", ja: "あなたの絵に合うカラーアクリルを選んでグッズを作ってみましょう", zh: "选择适合你画作的彩色亚克力制作商品" },
      imageUrl: "/api/placeholder/400/300",
      label: { ko: "BEST", en: "BEST", ja: "BEST", zh: "BEST" },
      labelColor: "bg-red-500",
      likes: 1247,
      views: 15420,
      comments: 89,
      href: "/collections/color-acrylic"
    },
    {
      id: "movement-series",
      title: { ko: "굿즈가 움직인다?! 무브먼트 시리즈", en: "Moving Goods?! Movement Series", ja: "グッズが動く?！ムーブメントシリーズ", zh: "商品会动?！动态系列" },
      subtitle: { ko: "아크릴에 모듈로 움직임을 추가한 특별한 굿즈", en: "Special goods with movement modules added to acrylic", ja: "アクリルにモジュールで動きを加えた特別なグッズ", zh: "在亚克力上添加运动模块的特殊商品" },
      imageUrl: "/api/placeholder/400/300",
      label: { ko: "NEW", en: "NEW", ja: "NEW", zh: "NEW" },
      labelColor: "bg-green-500",
      likes: 892,
      views: 8340,
      comments: 45,
      href: "/collections/movement-series"
    },
    {
      id: "background-tags",
      title: { ko: "너의 배경이 되어줄게", en: "I'll Be Your Background", ja: "あなたの背景になってあげる", zh: "我来做你的背景" },
      subtitle: { ko: "태그, 픽셀굿즈에서 해결하세요", en: "Tags, solved by PixelGoods", ja: "タグ、PixelGoodsで解決しましょう", zh: "标签，由PixelGoods解决" },
      imageUrl: "/api/placeholder/400/300",
      label: { ko: "HOT", en: "HOT", ja: "HOT", zh: "HOT" },
      labelColor: "bg-orange-500",
      likes: 634,
      views: 7820,
      comments: 32,
      href: "/collections/background-tags"
    },
    {
      id: "emotional-deco",
      title: { ko: "감성 데코템 만들기", en: "Creating Emotional Deco Items", ja: "感性デコアイテム作り", zh: "制作感性装饰品" },
      subtitle: { ko: "뮤트컬러, 유광 아크릴 등 신상 굿즈 모음", en: "Collection of new goods including mute colors and glossy acrylic", ja: "ミュートカラー、光沢アクリルなど新商品コレクション", zh: "包括哑光色、光泽亚克力等新商品合集" },
      imageUrl: "/api/placeholder/400/300",
      label: { ko: "TREND", en: "TREND", ja: "TREND", zh: "TREND" },
      labelColor: "bg-purple-500",
      likes: 1156,
      views: 12340,
      comments: 67,
      href: "/collections/emotional-deco"
    },
    {
      id: "retro-vintage",
      title: { ko: "레트로 빈티지 굿즈", en: "Retro Vintage Goods", ja: "レトロヴィンテージグッズ", zh: "复古怀旧商品" },
      subtitle: { ko: "옛날 감성이 물씬 나는 따뜻한 굿즈 컬렉션", en: "Warm goods collection with nostalgic vibes", ja: "昔の感性があふれる温かいグッズコレクション", zh: "充满怀旧气息的温暖商品合集" },
      imageUrl: "/api/placeholder/400/300",
      label: { ko: "CLASSIC", en: "CLASSIC", ja: "CLASSIC", zh: "CLASSIC" },
      labelColor: "bg-amber-600",
      likes: 789,
      views: 9560,
      comments: 41,
      href: "/collections/retro-vintage"
    },
    {
      id: "minimal-modern",
      title: { ko: "미니멀 모던 스타일", en: "Minimal Modern Style", ja: "ミニマルモダンスタイル", zh: "极简现代风格" },
      subtitle: { ko: "심플하고 세련된 현대적 디자인의 굿즈", en: "Simple and sophisticated modern design goods", ja: "シンプルで洗練された現代デザインのグッズ", zh: "简约精致的现代设计商品" },
      imageUrl: "/api/placeholder/400/300",
      label: { ko: "PREMIUM", en: "PREMIUM", ja: "PREMIUM", zh: "PREMIUM" },
      labelColor: "bg-slate-600",
      likes: 943,
      views: 11280,
      comments: 58,
      href: "/collections/minimal-modern"
    }
  ];

  const handleLike = (collectionId: string) => {
    setLikedCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a]">
      {/* Header Section */}
      <div className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t({ ko: "모음전", en: "Collections", ja: "コレクション", zh: "合集" })} 🏷️
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t({ 
                ko: "굿즈 아이디어가 부족할 때, 종류가 너무 많아 선택이 어려운 당신을 위해 준비했어요.", 
                en: "Prepared for you when you lack goods ideas or find it difficult to choose from too many options.", 
                ja: "グッズのアイデアが不足している時、種類が多すぎて選択が困難なあなたのために準備しました。", 
                zh: "当您缺乏商品创意或选择困难时，我们为您精心准备。" 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Card key={collection.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
              <div className="relative">
                <img 
                  src={collection.imageUrl} 
                  alt={t(collection.title)}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge 
                  className={`absolute top-3 left-3 text-white font-bold ${collection.labelColor}`}
                >
                  {t(collection.label)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors"
                  onClick={() => handleLike(collection.id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${likedCollections.includes(collection.id) ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                  {t(collection.title)}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                  {t(collection.subtitle)}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{collection.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{collection.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{collection.comments}</span>
                    </div>
                  </div>
                </div>
                
                <Link href={collection.href}>
                  <Button className="w-full group">
                    {t({ ko: "컬렉션 보기", en: "View Collection", ja: "コレクションを見る", zh: "查看合集" })}
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-lg font-medium mb-4">
              {t({ 
                ko: "굿즈 제작이 처음이신가요? 👉 굿즈에디터로 바로 제작해보세요!", 
                en: "New to goods creation? 👉 Try making it right away with Goods Editor!", 
                ja: "グッズ制作が初めてですか？👉 グッズエディターで今すぐ作ってみましょう！", 
                zh: "第一次制作商品？👉 用商品编辑器立即制作！" 
              })}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/editor">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold">
                  {t({ ko: "굿즈에디터", en: "Goods Editor", ja: "グッズエディター", zh: "商品编辑器" })}
                </Button>
              </Link>
              <Link href="/support">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 font-bold">
                  {t({ ko: "문의하기", en: "Contact Us", ja: "お問い合わせ", zh: "联系我们" })}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}