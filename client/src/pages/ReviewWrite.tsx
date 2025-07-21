import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Upload, X, Send, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

export default function ReviewWrite() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  if (!user) {
    setLocation("/login");
    return null;
  }

  const products = [
    { id: "1", name: t({ ko: "아크릴 키링", en: "Acrylic Keyring", ja: "アクリルキーリング", zh: "亚克力钥匙链" }) },
    { id: "2", name: t({ ko: "아크릴 스탠드", en: "Acrylic Stand", ja: "アクリルスタンド", zh: "亚克力支架" }) },
    { id: "3", name: t({ ko: "스마트톡", en: "Smart Tok", ja: "スマートトーク", zh: "手机支架" }) },
    { id: "4", name: t({ ko: "포카홀더", en: "Photo Card Holder", ja: "フォトカードホルダー", zh: "卡套" }) },
    { id: "5", name: t({ ko: "아크릴 뱃지", en: "Acrylic Badge", ja: "アクリルバッジ", zh: "亚克力徽章" }) },
    { id: "6", name: t({ ko: "홀로그램 키링", en: "Hologram Keyring", ja: "ホログラムキーリング", zh: "全息钥匙链" }) },
    { id: "7", name: t({ ko: "거울 아크릴", en: "Mirror Acrylic", ja: "ミラーアクリル", zh: "镜面亚克力" }) },
    { id: "8", name: t({ ko: "셰이커 키링", en: "Shaker Keyring", ja: "シェーカーキーリング", zh: "摇摆钥匙链" }) }
  ];

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast({
        title: t({ ko: "오류", en: "Error", ja: "エラー", zh: "错误" }),
        description: t({ ko: "최대 5개의 이미지만 업로드 가능합니다", en: "Maximum 5 images allowed", ja: "最大5枚まで", zh: "最多5张图片" }),
        variant: "destructive",
      });
      return;
    }
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId || !rating || !title.trim() || !content.trim()) {
      toast({
        title: t({ ko: "필수 항목 누락", en: "Missing Required Fields", ja: "必須項目不足", zh: "缺少必填项" }),
        description: t({ ko: "상품, 평점, 제목, 내용을 모두 입력해주세요", en: "Please fill in product, rating, title, and content", ja: "商品、評価、タイトル、内容を入力してください", zh: "请填写商品、评分、标题和内容" }),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for demo
      const newReview = {
        id: Date.now(),
        productId,
        productName: products.find(p => p.id === productId)?.name || '',
        rating,
        title,
        content,
        images,
        author: user.name,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        likes: 0,
        helpful: 0,
        verified: true
      };
      
      const existingReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
      existingReviews.unshift(newReview);
      localStorage.setItem('userReviews', JSON.stringify(existingReviews));
      
      toast({
        title: t({ ko: "후기 작성 완료", en: "Review Created", ja: "レビュー完了", zh: "评价完成" }),
        description: t({ ko: "후기가 성공적으로 등록되었습니다. 포인트 적립이 완료되었습니다!", en: "Your review has been published successfully. Points have been credited!", ja: "レビューが正常に登録されました。ポイントが付与されました！", zh: "您的评价已成功发布。积分已到账！" }),
      });
      
      setLocation("/reviews/all");
    } catch (error) {
      toast({
        title: t({ ko: "오류", en: "Error", ja: "エラー", zh: "错误" }),
        description: t({ ko: "후기 작성 중 오류가 발생했습니다", en: "An error occurred while creating the review", ja: "レビュー作成中にエラーが発生しました", zh: "创建评价时发生错误" }),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#1a1a1a] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/reviews/all">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t({ ko: "후기 목록으로 돌아가기", en: "Back to Reviews", ja: "レビューリストに戻る", zh: "返回评价列表" })}
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t({ ko: "후기 작성", en: "Write Review", ja: "レビュー作成", zh: "写评价" })}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t({ ko: "상품 사용 후기를 남겨주세요. 포인트도 적립해드려요!", en: "Share your product experience. Earn points too!", ja: "商品使用後の感想をお聞かせください。ポイントも付与いたします！", zh: "请分享您的产品使用体验。还可以获得积分！" })}
          </p>
        </div>

        {/* Points Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {t({ ko: "후기 작성 혜택", en: "Review Benefits", ja: "レビュー特典", zh: "评价福利" })}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t({ ko: "텍스트 후기 3,000P · 사진 후기 5,000P · 베스트 후기 10,000P", en: "Text review 3,000P · Photo review 5,000P · Best review 10,000P", ja: "テキストレビュー3,000P · 写真レビュー5,000P · ベストレビュー10,000P", zh: "文字评价3,000P · 图片评价5,000P · 最佳评价10,000P" })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Writing Form */}
        <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {t({ ko: "상품 후기 작성", en: "Write Product Review", ja: "商品レビュー作成", zh: "撰写产品评价" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t({ ko: "상품 선택", en: "Select Product", ja: "商品選択", zh: "选择产品" })} *
                </label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t({ ko: "후기를 작성할 상품을 선택하세요", en: "Select a product to review", ja: "レビューする商品を選択", zh: "选择要评价的产品" })} />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t({ ko: "평점", en: "Rating", ja: "評価", zh: "评分" })} *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className={`text-2xl transition-colors ${
                        star <= rating 
                          ? 'text-yellow-400 hover:text-yellow-500' 
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    >
                      <Star className={`h-8 w-8 ${star <= rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {rating > 0 && `${rating}/5`}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t({ ko: "제목", en: "Title", ja: "タイトル", zh: "标题" })} *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t({ ko: "후기 제목을 입력하세요", en: "Enter review title", ja: "レビュータイトルを入力", zh: "输入评价标题" })}
                  className="text-gray-900 dark:text-white"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t({ ko: "후기 내용", en: "Review Content", ja: "レビュー内容", zh: "评价内容" })} *
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t({ ko: "상품 사용 후기를 자세히 적어주세요...", en: "Please write your detailed product review...", ja: "商品使用後の感想を詳しく書いてください...", zh: "请详细写下您的产品使用体验..." })}
                  className="min-h-[200px] text-gray-900 dark:text-white"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t({ ko: "사진 첨부", en: "Photo Upload", ja: "写真添付", zh: "上传照片" })} 
                  <span className="text-sm text-blue-600 dark:text-blue-400 ml-2">
                    (+2,000P {t({ ko: "추가 적립", en: "bonus", ja: "追加獲得", zh: "额外积分" })})
                  </span>
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {t({ ko: "상품 사진을 첨부하면 더 많은 포인트를 받을 수 있어요", en: "Upload product photos to earn more points", ja: "商品写真を添付するとより多くのポイントがもらえます", zh: "上传产品照片可获得更多积分" })}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button type="button" variant="outline" asChild>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {t({ ko: "사진 선택", en: "Select Photos", ja: "写真を選択", zh: "选择照片" })}
                    </label>
                  </Button>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Review ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Link href="/reviews/all">
                  <Button type="button" variant="outline">
                    {t({ ko: "취소", en: "Cancel", ja: "キャンセル", zh: "取消" })}
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Send className="h-4 w-4 mr-2 animate-spin" />
                      {t({ ko: "등록 중...", en: "Publishing...", ja: "登録中...", zh: "发布中..." })}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t({ ko: "후기 등록", en: "Publish Review", ja: "レビュー登録", zh: "发布评价" })}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}