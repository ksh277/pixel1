import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Star,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface DesignServiceOption {
  id: string;
  name: string;
  price: number;
  description: string;
  reviewCount: number;
  rating: number;
  likes: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images: string[];
}

const designServiceOptions: DesignServiceOption[] = [
  {
    id: "basic",
    name: "도안작업 [+3,000원]",
    price: 3000,
    description: "단순형 디자인 작업",
    reviewCount: 127,
    rating: 4.9,
    likes: 45,
  },
  {
    id: "standard",
    name: "도안작업 [+5,000원]",
    price: 5000,
    description: "표준형 디자인 작업",
    reviewCount: 89,
    rating: 4.8,
    likes: 32,
  },
  {
    id: "premium",
    name: "도안작업 [+7,000원]",
    price: 7000,
    description: "고급형 디자인 작업",
    reviewCount: 156,
    rating: 4.9,
    likes: 67,
  },
  {
    id: "deluxe",
    name: "도안작업 [+10,000원]",
    price: 10000,
    description: "디럭스형 디자인 작업",
    reviewCount: 203,
    rating: 5.0,
    likes: 89,
  },
  {
    id: "ultimate",
    name: "도안작업 [+15,000원]",
    price: 15000,
    description: "최고급형 디자인 작업",
    reviewCount: 78,
    rating: 4.9,
    likes: 34,
  },
];

const reviews: Review[] = [
  {
    id: "1",
    userName: "디자이너***",
    rating: 5,
    comment:
      "퀄리티가 정말 좋아요! 배경 제거도 깔끔하게 해주셨고 재단선도 정확해요.",
    date: "2024.12.15",
    images: ["/api/placeholder/150/150", "/api/placeholder/150/150"],
  },
  {
    id: "2",
    userName: "작가님***",
    rating: 4,
    comment: "생각보다 빠르게 작업해주셔서 만족합니다. 다음에도 이용할게요.",
    date: "2024.12.14",
    images: ["/api/placeholder/150/150"],
  },
  {
    id: "3",
    userName: "크리에이터***",
    rating: 5,
    comment: "복잡한 배경이었는데도 깔끔하게 처리해주셨어요. 최고!",
    date: "2024.12.13",
    images: [
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
      "/api/placeholder/150/150",
    ],
  },
];

const workExamples = [
  {
    title: "배경 없는 경우",
    description: "이미지 → 화이트 → 재단선",
    beforeImage: "/api/placeholder/120/120",
    afterImage: "/api/placeholder/120/120",
  },
  {
    title: "배경 단순한 경우",
    description: "이미지 → 화이트 → 재단선",
    beforeImage: "/api/placeholder/120/120",
    afterImage: "/api/placeholder/120/120",
  },
  {
    title: "배경 명확한 경우",
    description: "이미지 → 화이트 → 재단선",
    beforeImage: "/api/placeholder/120/120",
    afterImage: "/api/placeholder/120/120",
  },
];

export default function DesignServiceProduct() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [likedOptions, setLikedOptions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  const currentProduct = designServiceOptions[0]; // Main product being viewed

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleLikeToggle = (optionId: string) => {
    setLikedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const handleAddToCart = () => {
    toast({
      title: "장바구니에 추가되었습니다",
      description: `${currentProduct.name} ${quantity}개가 장바구니에 추가되었습니다.`,
    });
  };

  const handleOrderNow = () => {
    toast({
      title: "주문 진행",
      description: "주문 페이지로 이동합니다.",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t({
                ko: "홈으로",
                en: "Back to Home",
                ja: "ホームへ",
                zh: "回到首页",
              })}
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Product Detail Section */}
          <motion.section
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                      도안작업
                    </div>
                    <div className="text-lg text-gray-600">Design Setup</div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentProduct.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ₩{currentProduct.price.toLocaleString()}
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      {t({
                        ko: "무료배송",
                        en: "Free Shipping",
                        ja: "送料無料",
                        zh: "免费配送",
                      })}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(currentProduct.rating)}
                    <span className="text-sm text-gray-600">
                      {currentProduct.rating} ({currentProduct.reviewCount}{" "}
                      {t({
                        ko: "리뷰",
                        en: "reviews",
                        ja: "レビュー",
                        zh: "评价",
                      })}
                      )
                    </span>
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      {t({
                        ko: "수량",
                        en: "Quantity",
                        ja: "数量",
                        zh: "数量",
                      })}
                      :
                    </span>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleOrderNow}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    >
                      {t({
                        ko: "주문하기",
                        en: "Order Now",
                        ja: "注文する",
                        zh: "立即订购",
                      })}
                    </Button>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={handleAddToCart}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {t({
                          ko: "장바구니",
                          en: "Cart",
                          ja: "カート",
                          zh: "购物车",
                        })}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        {t({
                          ko: "위시리스트",
                          en: "Wishlist",
                          ja: "ウィッシュリスト",
                          zh: "收藏",
                        })}
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-green-500 text-white hover:bg-green-600"
                      >
                        {t({
                          ko: "네이버페이",
                          en: "Naver Pay",
                          ja: "ネイバーペイ",
                          zh: "Naver Pay",
                        })}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Work Description Section */}
          <motion.section
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t({
                    ko: "작업 안내",
                    en: "Work Guide",
                    ja: "作業案内",
                    zh: "工作指南",
                  })}
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                    {t({
                      ko: "단순형",
                      en: "Simple Type",
                      ja: "シンプル型",
                      zh: "简单型",
                    })}
                  </Badge>
                  <span className="text-lg text-gray-600">
                    {t({
                      ko: "작업비용",
                      en: "Work Cost",
                      ja: "作業費用",
                      zh: "工作费用",
                    })}
                    : ₩{currentProduct.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2 mb-6">
                  <Button
                    variant={
                      selectedCategory === "keyring" ? "default" : "outline"
                    }
                    onClick={() => setSelectedCategory("keyring")}
                  >
                    {t({
                      ko: "키링",
                      en: "Keyring",
                      ja: "キーリング",
                      zh: "钥匙链",
                    })}
                  </Button>
                  <Button
                    variant={
                      selectedCategory === "korotto" ? "default" : "outline"
                    }
                    onClick={() => setSelectedCategory("korotto")}
                  >
                    {t({
                      ko: "코롯토",
                      en: "Korotto",
                      ja: "コロット",
                      zh: "可乐图",
                    })}
                  </Button>
                </div>
              </div>

              {/* Work Examples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {workExamples.map((example, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-center mb-3">
                        {example.title}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <img
                          src={example.beforeImage}
                          alt="Before"
                          className="w-12 h-12 rounded border"
                        />
                        <span className="text-gray-400">→</span>
                        <img
                          src={example.afterImage}
                          alt="After"
                          className="w-12 h-12 rounded border"
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {example.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Common Guidelines */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">
                  {t({
                    ko: "공통 유의사항",
                    en: "Common Guidelines",
                    ja: "共通注意事項",
                    zh: "通用注意事项",
                  })}
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    •{" "}
                    {t({
                      ko: "고화질 이미지를 업로드해주세요 (300dpi 이상 권장)",
                      en: "Please upload high-quality images (300dpi or higher recommended)",
                      ja: "高画質の画像をアップロードしてください（300dpi以上推奨）",
                      zh: "请上传高质量图像（建议300dpi以上）",
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t({
                      ko: "배경이 복잡한 경우 추가 비용이 발생할 수 있습니다",
                      en: "Additional costs may apply for complex backgrounds",
                      ja: "背景が複雑な場合、追加費用が発生する場合があります",
                      zh: "复杂背景可能产生额外费用",
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t({
                      ko: "작업 완료까지 1-2일 소요됩니다",
                      en: "Work completion takes 1-2 days",
                      ja: "作業完了まで1-2日かかります",
                      zh: "工作完成需要1-2天",
                    })}
                  </li>
                  <li>
                    •{" "}
                    {t({
                      ko: "수정 요청은 1회까지 무료입니다",
                      en: "One revision request is free",
                      ja: "修正依頼は1回まで無料です",
                      zh: "免费提供一次修改",
                    })}
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Reviews Section */}
          <motion.section
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t({
                  ko: "고객 리뷰",
                  en: "Customer Reviews",
                  ja: "カスタマーレビュー",
                  zh: "客户评价",
                })}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  {currentProduct.rating}
                </span>
                {renderStars(currentProduct.rating)}
                <span className="text-sm text-gray-600">
                  ({currentProduct.reviewCount}{" "}
                  {t({ ko: "리뷰", en: "reviews", ja: "レビュー", zh: "评价" })}
                  )
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-1 text-sm text-gray-800">
                      <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                      <div className="text-xs text-gray-500">
                        by {review.userName} ・ {review.date}
                      </div>
                    </div>
                    {review.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="w-full h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Additional Options Section */}
          <motion.section
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t({
                  ko: "추가결제",
                  en: "Additional Payment",
                  ja: "追加支払い",
                  zh: "追加付款",
                })}
              </h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue
                    placeholder={t({
                      ko: "정렬",
                      en: "Sort",
                      ja: "並び替え",
                      zh: "排序",
                    })}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    {t({
                      ko: "신상품",
                      en: "Newest",
                      ja: "新商品",
                      zh: "最新商品",
                    })}
                  </SelectItem>
                  <SelectItem value="price-low">
                    {t({
                      ko: "가격 낮은순",
                      en: "Price Low to High",
                      ja: "価格安い順",
                      zh: "价格由低到高",
                    })}
                  </SelectItem>
                  <SelectItem value="price-high">
                    {t({
                      ko: "가격 높은순",
                      en: "Price High to Low",
                      ja: "価格高い順",
                      zh: "价格由高到低",
                    })}
                  </SelectItem>
                  <SelectItem value="rating">
                    {t({
                      ko: "평점순",
                      en: "Rating",
                      ja: "評価順",
                      zh: "评分排序",
                    })}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designServiceOptions.map((option) => (
                <Card
                  key={option.id}
                  className="hover:shadow-md transition-shadow relative group"
                >
                  <CardContent className="p-4">
                    <button
                      onClick={() => handleLikeToggle(option.id)}
                      className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          likedOptions.includes(option.id)
                            ? "text-red-500 fill-current"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-800">
                          {option.price.toLocaleString()}원
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-sm text-center mb-2">
                      {option.name}
                    </h3>

                    <div className="flex items-center justify-center gap-1 mb-2">
                      {renderStars(option.rating)}
                      <span className="text-xs text-gray-600 ml-1">
                        ({option.reviewCount})
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 text-center mb-3">
                      {option.description}
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "상품 선택됨",
                          description: `${option.name}이 선택되었습니다.`,
                        });
                      }}
                    >
                      {t({
                        ko: "선택하기",
                        en: "Select",
                        ja: "選択",
                        zh: "选择",
                      })}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>

      {/* Fixed Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-4 z-50">
        <Link href="/inquiry">
          <Button
            variant="outline"
            size="lg"
            className="bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200 rounded-full px-6 py-3 flex items-center space-x-2"
          >
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <span className="font-medium">
              {t({
                ko: "문의하기",
                en: "Inquiry",
                ja: "お問い合わせ",
                zh: "咨询",
              })}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
