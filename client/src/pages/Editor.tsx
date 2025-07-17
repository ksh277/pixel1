import { useState, useRef, useCallback, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Upload,
  X,
  Undo2,
  Redo2,
  Move,
  Trash2,
  Download,
  Save,
  FolderOpen,
  Home,
  RotateCcw,
  Scissors,
  HelpCircle,
  Settings,
  Puzzle,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DraggableImage } from "@/components/DraggableImage";

interface ProductType {
  id: string;
  name: { ko: string; en: string; ja: string; zh: string };
  description: { ko: string; en: string; ja: string; zh: string };
  icon: string;
  defaultSize: { width: number; height: number };
  available: boolean;
}

interface CanvasImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipped: boolean;
  maintainAspectRatio: boolean;
}

export default function Editor() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [showProductSelector, setShowProductSelector] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const [canvasSize, setCanvasSize] = useState({ width: 50, height: 50 });
  const [images, setImages] = useState<CanvasImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [ringPosition, setRingPosition] = useState<"top" | "left" | "right">(
    "top",
  );
  const [ringSize, setRingSize] = useState(3);
  const [whiteAreaAdjustment, setWhiteAreaAdjustment] = useState(0);
  const [removeWhiteSpill, setRemoveWhiteSpill] = useState(false);
  const [doubleSided, setDoubleSided] = useState(false);
  const [currentSide, setCurrentSide] = useState<"front" | "back">("front");
  const [showMobileToolbar, setShowMobileToolbar] = useState(false);
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize scroll position to top when editor page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const productTypes: ProductType[] = [
    {
      id: "keyring",
      name: { ko: "키링", en: "Keyring", ja: "キーリング", zh: "钥匙扣" },
      description: {
        ko: "타공 포함 아크릴 키링",
        en: "Acrylic keyring with hole",
        ja: "穴あきアクリルキーリング",
        zh: "带孔亚克力钥匙扣",
      },
      icon: "🔑",
      defaultSize: { width: 50, height: 50 },
      available: true,
    },
    {
      id: "stand",
      name: { ko: "스탠드", en: "Stand", ja: "スタンド", zh: "支架" },
      description: {
        ko: "받침대 포함 자립형",
        en: "Self-standing with base",
        ja: "台座付き自立式",
        zh: "带底座自立式",
      },
      icon: "🎯",
      defaultSize: { width: 60, height: 80 },
      available: true,
    },
    {
      id: "corot",
      name: { ko: "코롯토", en: "Corot", ja: "コロット", zh: "科罗托" },
      description: {
        ko: "평면형 캐릭터 굿즈",
        en: "Flat character goods",
        ja: "平面キャラクターグッズ",
        zh: "平面角色商品",
      },
      icon: "🎨",
      defaultSize: { width: 40, height: 60 },
      available: true,
    },
    {
      id: "photoholder",
      name: {
        ko: "포카홀더",
        en: "Photo Holder",
        ja: "フォトホルダー",
        zh: "相片夹",
      },
      description: {
        ko: "카드 프레임형 굿즈",
        en: "Card frame goods",
        ja: "カード型フレーム",
        zh: "卡片框架商品",
      },
      icon: "🖼️",
      defaultSize: { width: 55, height: 85 },
      available: true,
    },
    {
      id: "smarttok",
      name: {
        ko: "스마트톡",
        en: "Smart Tok",
        ja: "スマートトック",
        zh: "智能支架",
      },
      description: {
        ko: "후면 접착 특형 악세사리",
        en: "Adhesive tok accessory",
        ja: "背面接着トック型",
        zh: "后面粘贴支架配件",
      },
      icon: "📱",
      defaultSize: { width: 40, height: 40 },
      available: true,
    },
    {
      id: "badge",
      name: { ko: "뱃지", en: "Badge", ja: "バッジ", zh: "徽章" },
      description: {
        ko: "원형/사각형 뱃지",
        en: "Round/square badge",
        ja: "円形/四角形バッジ",
        zh: "圆形/方形徽章",
      },
      icon: "🏅",
      defaultSize: { width: 44, height: 44 },
      available: true,
    },
    {
      id: "magnet",
      name: {
        ko: "자석/문구류",
        en: "Magnet/Stationery",
        ja: "磁石/文具類",
        zh: "磁铁/文具",
      },
      description: {
        ko: "냉장고 부착용 굿즈",
        en: "Refrigerator goods",
        ja: "冷蔵庫取付グッズ",
        zh: "冰箱贴商品",
      },
      icon: "🧲",
      defaultSize: { width: 50, height: 50 },
      available: true,
    },
    {
      id: "carabiner",
      name: { ko: "카라비너", en: "Carabiner", ja: "カラビナ", zh: "登山扣" },
      description: {
        ko: "고리형 연결 장치",
        en: "Ring-type connector",
        ja: "リング型接続装置",
        zh: "环形连接装置",
      },
      icon: "🔗",
      defaultSize: { width: 30, height: 60 },
      available: false,
    },
  ];

  const handleProductSelect = (product: ProductType) => {
    if (!product.available) return;
    setSelectedProduct(product);
    setCanvasSize(product.defaultSize);
    setShowProductSelector(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(
          t({
            ko: "이미지 파일만 업로드 가능합니다.",
            en: "Only image files are allowed.",
            ja: "画像ファイルのみアップロード可能です。",
            zh: "仅允许上传图片文件。",
          }),
        );
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(
          t({
            ko: "파일 크기는 10MB 이하여야 합니다.",
            en: "File size must be under 10MB.",
            ja: "ファイルサイズは10MB以下でなければなりません。",
            zh: "文件大小必须在10MB以下。",
          }),
        );
        return;
      }

      // Create blob URL for immediate preview
      const blobUrl = URL.createObjectURL(file);
      const newImage: CanvasImage = {
        id: Date.now().toString(),
        src: blobUrl,
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        rotation: 0,
        flipped: false,
        maintainAspectRatio: true,
      };

      setImages([...images, newImage]);
      setSelectedImage(newImage.id);

      // Clear error for this image if it was previously failed
      setImageLoadErrors((prev) => prev.filter((id) => id !== newImage.id));
    }

    // Reset input
    event.target.value = "";
  };

  const handleImageError = (imageId: string) => {
    setImageLoadErrors((prev) => [...prev, imageId]);
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoadErrors((prev) => prev.filter((id) => id !== imageId));
  };

  const handleImageMove = (id: string, deltaX: number, deltaY: number) => {
    setImages(
      images.map((img) =>
        img.id === id ? { ...img, x: img.x + deltaX, y: img.y + deltaY } : img,
      ),
    );
  };

  const handleImageResize = (
    id: string,
    newWidth: number,
    newHeight: number,
  ) => {
    setImages(
      images.map((img) =>
        img.id === id ? { ...img, width: newWidth, height: newHeight } : img,
      ),
    );
  };

  const handleImageRotate = (id: string, rotation: number) => {
    setImages(
      images.map((img) => (img.id === id ? { ...img, rotation } : img)),
    );
  };

  const handleImageFlip = (id: string) => {
    setImages(
      images.map((img) =>
        img.id === id ? { ...img, flipped: !img.flipped } : img,
      ),
    );
  };

  const handleAspectRatioToggle = (id: string) => {
    setImages(
      images.map((img) =>
        img.id === id
          ? { ...img, maintainAspectRatio: !img.maintainAspectRatio }
          : img,
      ),
    );
  };

  const centerImage = (id: string) => {
    const image = images.find((img) => img.id === id);
    if (image) {
      const centerX = (canvasSize.width - image.width) / 2;
      const centerY = (canvasSize.height - image.height) / 2;
      setImages(
        images.map((img) =>
          img.id === id ? { ...img, x: centerX, y: centerY } : img,
        ),
      );
    }
  };

  const resetImagePosition = (id: string) => {
    setImages(
      images.map((img) => (img.id === id ? { ...img, x: 10, y: 10 } : img)),
    );
  };

  const deleteSelectedImage = () => {
    if (selectedImage) {
      setImages(images.filter((img) => img.id !== selectedImage));
      setSelectedImage(null);
    }
  };

  const clearCanvas = () => {
    setImages([]);
    setSelectedImage(null);
  };

  if (showProductSelector) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#1F2D4A] p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t({
                ko: "제작할 제품을 선택해주세요",
                en: "Select Product to Create",
                ja: "製作する製品を選択してください",
                zh: "请选择要制作的产品",
              })}
            </h1>
            <p className="text-lg text-gray-600 dark:text-white max-w-2xl mx-auto">
              {t({
                ko: "원하는 굿즈를 클릭하여 전문 에디터를 시작하세요",
                en: "Click your desired goods to start the professional editor",
                ja: "お好みのグッズをクリックしてプロエディタを開始",
                zh: "点击所需商品开始专业编辑器",
              })}
            </p>
          </div>

          {/* Product Grid - Responsive Korean E-commerce Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-4 py-2">
            {productTypes.map((product) => (
              <div
                key={product.id}
                className={cn(
                  "bg-white dark:bg-[#1F2D4A] rounded-xl shadow-md p-3 relative cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
                  "flex flex-col justify-between min-h-[420px] max-h-[420px] overflow-hidden",
                  product.available
                    ? "hover:border-blue-200 border border-gray-200 dark:border-gray-700"
                    : "opacity-60 cursor-not-allowed border border-gray-200 dark:border-gray-700",
                )}
                onClick={() => handleProductSelect(product)}
              >
                {/* Status Badge - Top Left */}
                <div className="absolute top-2 left-2 z-10">
                  {product.available ? (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {t({ ko: "HIT", en: "HIT", ja: "HIT", zh: "HIT" })}
                    </span>
                  ) : (
                    <span className="bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded">
                      {t({
                        ko: "준비중",
                        en: "SOON",
                        ja: "準備中",
                        zh: "准备中",
                      })}
                    </span>
                  )}
                </div>

                {/* Product Image Placeholder - Fixed Height */}
                <div className="product-thumbnail w-full h-36 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center border border-gray-200 dark:border-gray-600 flex-shrink-0">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                    <span className="text-xs text-gray-500 dark:text-white">
                      {t({
                        ko: "이미지 준비중",
                        en: "Image Ready",
                        ja: "画像準備中",
                        zh: "图片准备中",
                      })}
                    </span>
                  </div>
                </div>

                {/* Content Area - Flexible grow */}
                <div className="flex-grow flex flex-col">
                  {/* Product Tags */}
                  <div className="mb-2">
                    <span className="inline-block border border-gray-300 dark:border-gray-600 text-xs text-gray-600 dark:text-white px-2 py-0.5 rounded-full">
                      {product.id === "keyring" &&
                        t({
                          ko: "타공포함",
                          en: "With Hole",
                          ja: "穴あき",
                          zh: "带孔",
                        })}
                      {product.id === "stand" &&
                        t({
                          ko: "자립형",
                          en: "Self-standing",
                          ja: "自立式",
                          zh: "自立式",
                        })}
                      {product.id === "corot" &&
                        t({
                          ko: "평면형",
                          en: "Flat Type",
                          ja: "平面型",
                          zh: "平面型",
                        })}
                      {product.id === "photoholder" &&
                        t({
                          ko: "프레임형",
                          en: "Frame Type",
                          ja: "フレーム型",
                          zh: "框架型",
                        })}
                      {product.id === "smarttok" &&
                        t({
                          ko: "접착형",
                          en: "Adhesive",
                          ja: "接着型",
                          zh: "粘贴型",
                        })}
                      {product.id === "badge" &&
                        t({
                          ko: "원형/사각",
                          en: "Round/Square",
                          ja: "円形/四角",
                          zh: "圆形/方形",
                        })}
                      {product.id === "magnet" &&
                        t({
                          ko: "자석형",
                          en: "Magnetic",
                          ja: "磁石型",
                          zh: "磁铁型",
                        })}
                      {product.id === "carabiner" &&
                        t({
                          ko: "고리형",
                          en: "Hook Type",
                          ja: "フック型",
                          zh: "钩型",
                        })}
                    </span>
                  </div>

                  {/* Product Name */}
                  <div className="font-semibold text-sm mb-1 text-gray-900 dark:text-white line-clamp-2">
                    {t(product.name)} ({product.defaultSize.width}×
                    {product.defaultSize.height}mm)
                  </div>
                </div>

                {/* Bottom Section - Always at bottom */}
                <div className="mt-auto space-y-2">
                  {/* Price */}
                  <div>
                    <div className="text-sm font-bold text-black dark:text-white">
                      {product.id === "keyring" && "1,500원"}
                      {product.id === "stand" && "2,500원"}
                      {product.id === "corot" && "1,800원"}
                      {product.id === "photoholder" && "2,200원"}
                      {product.id === "smarttok" && "2,800원"}
                      {product.id === "badge" && "1,200원"}
                      {product.id === "magnet" && "1,800원"}
                      {product.id === "carabiner" && "3,200원"}
                    </div>
                    <div className="text-xs line-through text-gray-400 dark:text-gray-500">
                      {product.id === "keyring" && "2,000원"}
                      {product.id === "stand" && "3,000원"}
                      {product.id === "corot" && "2,200원"}
                      {product.id === "photoholder" && "2,800원"}
                      {product.id === "smarttok" && "3,500원"}
                      {product.id === "badge" && "1,600원"}
                      {product.id === "magnet" && "2,200원"}
                      {product.id === "carabiner" && "3,800원"}
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="text-xs text-gray-500 dark:text-white">
                    {product.available ? (
                      <>
                        {product.id === "keyring" &&
                          t({
                            ko: "리뷰 342개",
                            en: "342 reviews",
                            ja: "レビュー342件",
                            zh: "342个评论",
                          })}
                        {product.id === "stand" &&
                          t({
                            ko: "리뷰 189개",
                            en: "189 reviews",
                            ja: "レビュー189件",
                            zh: "189个评论",
                          })}
                        {product.id === "corot" &&
                          t({
                            ko: "리뷰 256개",
                            en: "256 reviews",
                            ja: "レビュー256件",
                            zh: "256个评论",
                          })}
                        {product.id === "photoholder" &&
                          t({
                            ko: "리뷰 134개",
                            en: "134 reviews",
                            ja: "レビュー134件",
                            zh: "134个评论",
                          })}
                        {product.id === "smarttok" &&
                          t({
                            ko: "리뷰 298개",
                            en: "298 reviews",
                            ja: "レビュー298件",
                            zh: "298个评论",
                          })}
                        {product.id === "badge" &&
                          t({
                            ko: "리뷰 167개",
                            en: "167 reviews",
                            ja: "レビュー167件",
                            zh: "167个评论",
                          })}
                        {product.id === "magnet" &&
                          t({
                            ko: "리뷰 223개",
                            en: "223 reviews",
                            ja: "レビュー223件",
                            zh: "223个评论",
                          })}
                        {product.id === "carabiner" &&
                          t({
                            ko: "곧 출시",
                            en: "Coming soon",
                            ja: "近日発売",
                            zh: "即将推出",
                          })}
                      </>
                    ) : (
                      t({
                        ko: "곧 출시",
                        en: "Coming soon",
                        ja: "近日発売",
                        zh: "即将推出",
                      })
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    className={cn(
                      "w-full text-xs font-medium transition-all py-2",
                      product.available
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed",
                    )}
                    disabled={!product.available}
                  >
                    {product.available
                      ? t({
                          ko: "제작 시작",
                          en: "Start Creating",
                          ja: "製作開始",
                          zh: "开始制作",
                        })
                      : t({
                          ko: "준비 중",
                          en: "Coming Soon",
                          ja: "準備中",
                          zh: "准备中",
                        })}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Help Section */}
          <Card className="bg-white dark:bg-[#1F2D4A] shadow-lg border-2 border-blue-100 dark:border-blue-800">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t({
                  ko: "처음 제작시 필독",
                  en: "First Time Production Guide",
                  ja: "初回製作時必読",
                  zh: "首次制作必读",
                })}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t({
                  ko: "고품질 제작을 위한 필수 정보를 확인해보세요",
                  en: "Check essential information for high-quality production",
                  ja: "高品質製作のための必須情報をご確認ください",
                  zh: "查看高质量制作的必要信息",
                })}
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowHelp(true)}
                className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                {t({
                  ko: "처음 제작시 필독",
                  en: "First Time Guide",
                  ja: "初回製作時必読",
                  zh: "首次制作必读",
                })}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Dialog */}
        <Dialog open={showHelp} onOpenChange={setShowHelp}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {t({
                  ko: "제작 필독사항",
                  en: "Production Guide",
                  ja: "製作必読事項",
                  zh: "制作必读事项",
                })}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">
                  {t({
                    ko: "이미지 업로드 가이드",
                    en: "Image Upload Guide",
                    ja: "画像アップロードガイド",
                    zh: "图片上传指南",
                  })}
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>
                    {t({
                      ko: "300DPI 이상의 고해상도 이미지를 권장합니다",
                      en: "High resolution images (300DPI+) recommended",
                      ja: "300DPI以上の高解像度画像を推奨",
                      zh: "建议使用300DPI以上的高分辨率图片",
                    })}
                  </li>
                  <li>
                    {t({
                      ko: "PNG, JPG, JPEG 형식을 지원합니다",
                      en: "PNG, JPG, JPEG formats supported",
                      ja: "PNG、JPG、JPEG形式をサポート",
                      zh: "支持PNG、JPG、JPEG格式",
                    })}
                  </li>
                  <li>
                    {t({
                      ko: "파일 크기는 최대 10MB까지 가능합니다",
                      en: "Maximum file size: 10MB",
                      ja: "ファイルサイズは最大10MBまで",
                      zh: "文件大小最大10MB",
                    })}
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  {t({
                    ko: "제작 시 주의사항",
                    en: "Production Notes",
                    ja: "製作時の注意事項",
                    zh: "制作注意事项",
                  })}
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>
                    {t({
                      ko: "고리 부분은 자동으로 타공됩니다",
                      en: "Ring holes are automatically punched",
                      ja: "リング部分は自動的に打ち抜かれます",
                      zh: "环孔部分自动打孔",
                    })}
                  </li>
                  <li>
                    {t({
                      ko: "화이트 영역 조절로 투명도를 설정할 수 있습니다",
                      en: "Adjust transparency with white area control",
                      ja: "白い領域調整で透明度を設定できます",
                      zh: "可通过白色区域调节设置透明度",
                    })}
                  </li>
                  <li>
                    {t({
                      ko: "앞뒤 다른 디자인으로 제작 가능합니다",
                      en: "Different designs for front and back available",
                      ja: "表裏異なるデザインで製作可能",
                      zh: "可制作正反面不同设计",
                    })}
                  </li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="editor-wrapper min-h-screen bg-background dark:bg-[#1F2D4A] flex flex-col overflow-x-hidden max-w-full">
      {/* Header */}
      <header className="bg-background dark:bg-[#1F2D4A] shadow-sm border-b dark:border-gray-700 px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProductSelector(true)}
              className="text-xs sm:text-sm"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {isMobile
                ? t({ ko: "제품", en: "Product", ja: "製品", zh: "产品" })
                : t({
                    ko: "제품 선택",
                    en: "Select Product",
                    ja: "製品選択",
                    zh: "选择产品",
                  })}
            </Button>
            {selectedProduct && (
              <div className="text-xs sm:text-sm text-gray-600 dark:text-white hidden sm:block">
                <span>
                  {t(selectedProduct.name)} ({canvasSize.width}×
                  {canvasSize.height}mm)
                </span>
              </div>
            )}
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <Undo2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <Redo2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 sm:p-2 hidden sm:inline-flex"
            >
              <Move className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteSelectedImage}
              className="p-1 sm:p-2"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 sm:p-2 hidden sm:inline-flex"
            >
              <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 sm:p-2">
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProductSelector(true)}
              className="p-1 sm:p-2"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Toolbar Toggle */}
      {isMobile && (
        <div className="bg-background dark:bg-[#1F2D4A] border-b px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileToolbar(!showMobileToolbar)}
            className="w-full justify-between"
          >
            <span className="text-sm">
              {t({
                ko: "에디터 도구",
                en: "Editor Tools",
                ja: "エディタツール",
                zh: "编辑器工具",
              })}
            </span>
            {showMobileToolbar ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      <div className={cn("flex-1 flex", isMobile ? "flex-col" : "flex-row")}>
        {/* Mobile Collapsible Toolbar */}
        {isMobile && showMobileToolbar && (
          <div className="bg-background dark:bg-[#1F2D4A] border-b p-4 max-h-64 overflow-y-auto">
            <div className="space-y-4">
              {/* Size Controls */}
              <div>
                <Label className="text-sm font-medium mb-2 block text-gray-900 dark:text-white">
                  {t({
                    ko: "사이즈 (mm)",
                    en: "Size (mm)",
                    ja: "サイズ (mm)",
                    zh: "尺寸 (mm)",
                  })}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    value={canvasSize.width}
                    onChange={(e) =>
                      setCanvasSize({
                        ...canvasSize,
                        width: parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-sm"
                    placeholder={t({
                      ko: "가로",
                      en: "Width",
                      ja: "横",
                      zh: "宽",
                    })}
                  />
                  <Input
                    type="number"
                    value={canvasSize.height}
                    onChange={(e) =>
                      setCanvasSize({
                        ...canvasSize,
                        height: parseInt(e.target.value) || 0,
                      })
                    }
                    className="text-sm"
                    placeholder={t({
                      ko: "세로",
                      en: "Height",
                      ja: "縦",
                      zh: "高",
                    })}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t({
                  ko: "이미지 업로드",
                  en: "Image Upload",
                  ja: "画像アップロード",
                  zh: "图片上传",
                })}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Mobile Image Controls */}
              {selectedImage && (
                <div className="space-y-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Label className="text-sm font-medium block text-gray-900 dark:text-white">
                    {t({
                      ko: "이미지 제어",
                      en: "Image Controls",
                      ja: "画像コントロール",
                      zh: "图像控制",
                    })}
                  </Label>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        selectedImage && centerImage(selectedImage)
                      }
                    >
                      {t({
                        ko: "중앙 정렬",
                        en: "Center",
                        ja: "中央",
                        zh: "居中",
                      })}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        selectedImage && resetImagePosition(selectedImage)
                      }
                    >
                      {t({
                        ko: "위치 초기화",
                        en: "Reset Pos",
                        ja: "リセット",
                        zh: "重置位置",
                      })}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-white">
                        {t({ ko: "가로", en: "Width", ja: "幅", zh: "宽" })}
                      </Label>
                      <Input
                        type="number"
                        value={
                          images.find((img) => img.id === selectedImage)
                            ?.width || 0
                        }
                        onChange={(e) => {
                          const newWidth = parseInt(e.target.value) || 0;
                          const image = images.find(
                            (img) => img.id === selectedImage,
                          );
                          if (image) {
                            handleImageResize(
                              selectedImage,
                              newWidth,
                              image.height,
                            );
                          }
                        }}
                        className="text-sm"
                        min="20"
                        max="350"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-white">
                        {t({ ko: "세로", en: "Height", ja: "高さ", zh: "高" })}
                      </Label>
                      <Input
                        type="number"
                        value={
                          images.find((img) => img.id === selectedImage)
                            ?.height || 0
                        }
                        onChange={(e) => {
                          const newHeight = parseInt(e.target.value) || 0;
                          const image = images.find(
                            (img) => img.id === selectedImage,
                          );
                          if (image) {
                            handleImageResize(
                              selectedImage,
                              image.width,
                              newHeight,
                            );
                          }
                        }}
                        className="text-sm"
                        min="20"
                        max="350"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-80 bg-background dark:bg-[#1F2D4A] shadow-sm border-r p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Size Controls */}
              <div>
                <Label className="text-sm font-medium mb-3 block text-gray-900 dark:text-white">
                  {t({
                    ko: "사이즈 (mm)",
                    en: "Size (mm)",
                    ja: "サイズ (mm)",
                    zh: "尺寸 (mm)",
                  })}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-white">
                      {t({ ko: "가로", en: "Width", ja: "横", zh: "宽" })}
                    </Label>
                    <Input
                      type="number"
                      value={canvasSize.width}
                      onChange={(e) =>
                        setCanvasSize({
                          ...canvasSize,
                          width: parseInt(e.target.value) || 0,
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-white">
                      {t({ ko: "세로", en: "Height", ja: "縦", zh: "高" })}
                    </Label>
                    <Input
                      type="number"
                      value={canvasSize.height}
                      onChange={(e) =>
                        setCanvasSize({
                          ...canvasSize,
                          height: parseInt(e.target.value) || 0,
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label className="text-sm font-medium mb-3 block text-gray-900 dark:text-white">
                  {t({
                    ko: "이미지 업로드",
                    en: "Image Upload",
                    ja: "画像アップロード",
                    zh: "图片上传",
                  })}
                </Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t({
                    ko: "+ 내 PC 이미지 불러오기",
                    en: "+ Load Image from PC",
                    ja: "+ PCから画像を読み込み",
                    zh: "+ 从PC加载图片",
                  })}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Background Removal */}
              <div>
                <Button variant="outline" className="w-full" onClick={() => {}}>
                  <Scissors className="h-4 w-4 mr-2" />
                  {t({
                    ko: "배경이미지 제거",
                    en: "Remove Background",
                    ja: "背景画像除去",
                    zh: "移除背景图片",
                  })}
                </Button>
              </div>

              {/* Double Sided */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="double-sided"
                  checked={doubleSided}
                  onCheckedChange={(checked) =>
                    setDoubleSided(checked as boolean)
                  }
                />
                <Label htmlFor="double-sided" className="text-sm text-gray-900 dark:text-white">
                  {t({
                    ko: "앞뒤 다르게 그리기",
                    en: "Different Front/Back",
                    ja: "表裏異なる描画",
                    zh: "正反面不同绘制",
                  })}
                </Label>
              </div>

              {doubleSided && (
                <div className="flex space-x-2">
                  <Button
                    variant={currentSide === "front" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentSide("front")}
                    className="flex-1"
                  >
                    {t({ ko: "앞면", en: "Front", ja: "表面", zh: "正面" })}
                  </Button>
                  <Button
                    variant={currentSide === "back" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentSide("back")}
                    className="flex-1"
                  >
                    {t({ ko: "뒷면", en: "Back", ja: "裏面", zh: "背面" })}
                  </Button>
                </div>
              )}

              {/* Selected Image Controls */}
              {selectedImage && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Label className="text-sm font-medium block text-gray-900 dark:text-white">
                    {t({
                      ko: "선택된 이미지 제어",
                      en: "Selected Image Controls",
                      ja: "選択画像コントロール",
                      zh: "选定图像控制",
                    })}
                  </Label>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        selectedImage && centerImage(selectedImage)
                      }
                    >
                      {t({
                        ko: "중앙 정렬",
                        en: "Center",
                        ja: "中央揃え",
                        zh: "居中对齐",
                      })}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        selectedImage && resetImagePosition(selectedImage)
                      }
                    >
                      {t({
                        ko: "위치 초기화",
                        en: "Reset Position",
                        ja: "位置リセット",
                        zh: "重置位置",
                      })}
                    </Button>
                  </div>

                  {/* Manual Size Controls */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-gray-500">
                        {t({
                          ko: "가로 (px)",
                          en: "Width (px)",
                          ja: "幅 (px)",
                          zh: "宽度 (px)",
                        })}
                      </Label>
                      <Input
                        type="number"
                        value={
                          images.find((img) => img.id === selectedImage)
                            ?.width || 0
                        }
                        onChange={(e) => {
                          const newWidth = parseInt(e.target.value) || 0;
                          const image = images.find(
                            (img) => img.id === selectedImage,
                          );
                          if (image) {
                            handleImageResize(
                              selectedImage,
                              newWidth,
                              image.height,
                            );
                          }
                        }}
                        className="text-sm"
                        min="20"
                        max="500"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">
                        {t({
                          ko: "세로 (px)",
                          en: "Height (px)",
                          ja: "高さ (px)",
                          zh: "高度 (px)",
                        })}
                      </Label>
                      <Input
                        type="number"
                        value={
                          images.find((img) => img.id === selectedImage)
                            ?.height || 0
                        }
                        onChange={(e) => {
                          const newHeight = parseInt(e.target.value) || 0;
                          const image = images.find(
                            (img) => img.id === selectedImage,
                          );
                          if (image) {
                            handleImageResize(
                              selectedImage,
                              image.width,
                              newHeight,
                            );
                          }
                        }}
                        className="text-sm"
                        min="20"
                        max="500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Clear Canvas */}
              <Button
                variant="destructive"
                className="w-full"
                onClick={clearCanvas}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {t({
                  ko: "캔버스 초기화",
                  en: "Clear Canvas",
                  ja: "キャンバスクリア",
                  zh: "清空画布",
                })}
              </Button>
            </div>
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-8">
            <div className="relative bg-white rounded-lg shadow-lg border-2 border-gray-300 overflow-hidden canvas-container">
              <div
                className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
                style={{
                  width: isMobile
                    ? `${Math.min(canvasSize.width * 3, 350)}px`
                    : `${canvasSize.width * 4}px`,
                  height: isMobile
                    ? `${Math.min(canvasSize.height * 3, 350)}px`
                    : `${canvasSize.height * 4}px`,
                  maxWidth: isMobile ? "350px" : "600px",
                  maxHeight: isMobile ? "350px" : "600px",
                }}
              >
                {/* Canvas Background */}
                <div className="absolute inset-0 bg-white rounded-lg"></div>

                {/* Uploaded Images */}
                {images.map((image) => (
                  <DraggableImage
                    key={image.id}
                    id={image.id}
                    src={image.src}
                    position={{ x: image.x, y: image.y }}
                    size={{ width: image.width, height: image.height }}
                    rotation={image.rotation}
                    isSelected={selectedImage === image.id}
                    onSelect={setSelectedImage}
                    onMove={handleImageMove}
                    onResize={handleImageResize}
                    onRotate={handleImageRotate}
                    onFlip={handleImageFlip}
                    onDelete={(id) => {
                      setImages(images.filter((img) => img.id !== id));
                      setSelectedImage(null);
                    }}
                    canvasBounds={{
                      width: isMobile
                        ? Math.min(canvasSize.width * 3, 350)
                        : canvasSize.width * 4,
                      height: isMobile
                        ? Math.min(canvasSize.height * 3, 350)
                        : canvasSize.height * 4,
                    }}
                    maintainAspectRatio={image.maintainAspectRatio}
                    onAspectRatioToggle={handleAspectRatioToggle}
                  />
                ))}

                {/* Empty State */}
                {images.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">
                        {t({
                          ko: "이미지를 업로드해주세요",
                          en: "Please upload an image",
                          ja: "画像をアップロードしてください",
                          zh: "请上传图片",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Product Guide Overlay */}
                {selectedProduct && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Ring Position Indicator */}
                    <div
                      className={cn(
                        "absolute w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full opacity-50",
                        ringPosition === "top" &&
                          "top-2 left-1/2 transform -translate-x-1/2",
                        ringPosition === "left" &&
                          "left-2 top-1/2 transform -translate-y-1/2",
                        ringPosition === "right" &&
                          "right-2 top-1/2 transform -translate-y-1/2",
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="bg-white border-t p-2 sm:p-4">
            <div
              className={cn(
                "flex items-center justify-center",
                isMobile ? "flex-col space-y-2" : "space-x-8",
              )}
            >
              {/* Ring Position */}
              <div className="flex items-center space-x-2">
                <Label className="text-xs sm:text-sm font-medium">
                  {t({
                    ko: "고리방향",
                    en: "Ring Position",
                    ja: "リング位置",
                    zh: "环位置",
                  })}
                  :
                </Label>
                <Select
                  value={ringPosition}
                  onValueChange={(value: any) => setRingPosition(value)}
                >
                  <SelectTrigger className="w-20 sm:w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">
                      {t({ ko: "상단", en: "Top", ja: "上", zh: "上" })}
                    </SelectItem>
                    <SelectItem value="left">
                      {t({ ko: "왼쪽", en: "Left", ja: "左", zh: "左" })}
                    </SelectItem>
                    <SelectItem value="right">
                      {t({ ko: "오른쪽", en: "Right", ja: "右", zh: "右" })}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ring Size */}
              <div className="flex items-center space-x-2">
                <Label className="text-xs sm:text-sm font-medium">
                  {t({
                    ko: "고리크기",
                    en: "Ring Size",
                    ja: "リングサイズ",
                    zh: "环尺寸",
                  })}
                  :
                </Label>
                <Select
                  value={ringSize.toString()}
                  onValueChange={(value) => setRingSize(parseFloat(value))}
                >
                  <SelectTrigger className="w-16 sm:w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2mm</SelectItem>
                    <SelectItem value="2.5">2.5mm</SelectItem>
                    <SelectItem value="3">3mm</SelectItem>
                    <SelectItem value="4">4mm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* White Area Adjustment */}
              {!isMobile && (
                <div className="flex items-center space-x-2">
                  <Label className="text-xs sm:text-sm font-medium">
                    {t({
                      ko: "화이트영역",
                      en: "White Area",
                      ja: "白い領域",
                      zh: "白色区域",
                    })}
                    :
                  </Label>
                  <div className="w-20 sm:w-24">
                    <Slider
                      value={[whiteAreaAdjustment]}
                      onValueChange={(value) =>
                        setWhiteAreaAdjustment(value[0])
                      }
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Remove White Spill */}
              {!isMobile && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remove-white-spill"
                    checked={removeWhiteSpill}
                    onCheckedChange={(checked) =>
                      setRemoveWhiteSpill(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="remove-white-spill"
                    className="text-xs sm:text-sm"
                  >
                    {t({
                      ko: "흰색 돌출 제거",
                      en: "Remove White Spill",
                      ja: "白い突出除去",
                      zh: "移除白色溢出",
                    })}
                  </Label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-4 z-50">
        {/* Inquiry Button (Top) */}
        <Button
          variant="outline"
          size="lg"
          className="bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200 rounded-full px-6 py-3 flex items-center space-x-2 transition-all hover:shadow-xl"
          onClick={() => {
            // Navigate to inquiry or chat
            window.open("/inquiry", "_blank");
          }}
        >
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-sm sm:text-base">
              {t({
                ko: "문의하기",
                en: "Inquiry",
                ja: "お問い合わせ",
                zh: "咨询",
              })}
            </span>
          </div>
        </Button>

        {/* Editor Button (Bottom) */}
        <Button
          size="lg"
          className="bg-black hover:bg-gray-800 text-white shadow-lg rounded-full px-6 py-3 flex items-center space-x-2 transition-all hover:shadow-xl"
          onClick={() => setShowProductSelector(true)}
        >
          <div className="flex items-center space-x-2">
            <Puzzle className="h-5 w-5" />
            <span className="font-medium text-sm sm:text-base">
              {t({
                ko: "🧩 올댓에디터",
                en: "🧩 AllThat Editor",
                ja: "🧩 オールザットエディタ",
                zh: "🧩 全能编辑器",
              })}
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
}
