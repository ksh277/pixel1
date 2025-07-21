import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Image, Video, Archive, ChevronRight, Star, Sparkles, Eye, Heart } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Link } from "wouter";
import { BelugaMascot } from "@/components/BelugaMascot";
import { useQuery } from "@tanstack/react-query";
import type { BelugaTemplate } from "@shared/schema";

export default function Resources() {
  const { language, t } = useLanguage();
  
  // Fetch templates from API
  const { data: templates = [], isLoading } = useQuery<BelugaTemplate[]>({
    queryKey: ['/api/templates'],
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">홈</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100 font-medium">자료실</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t({ ko: "자료실", en: "Resources" })}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t({ 
              ko: "굿즈 제작에 필요한 다양한 자료를 다운로드하세요", 
              en: "Download various materials needed for goods production" 
            })}
          </p>
        </div>

        {/* Featured Beluga Templates Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  {t({ ko: "🐋 벨루가 굿즈 템플릿", en: "🐋 Beluga Goods Templates", ja: "🐋 ベルーガグッズテンプレート", zh: "🐋 白鲸商品模板" })}
                </h2>
                <p className="text-blue-100 mb-4">
                  {t({ ko: "픽셀굿즈 공식 벨루가 캐릭터로 나만의 굿즈를 만들어보세요", en: "Create your own goods with PixelGoods's official Beluga character", ja: "PixelGoods公式ベルーガキャラクターで自分だけのグッズを作ってみましょう", zh: "使用PixelGoods官方白鲸角色制作属于你的商品" })}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    {t({ ko: "7종 템플릿", en: "7 Templates", ja: "7種テンプレート", zh: "7种模板" })}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {t({ ko: "2000px 고해상도", en: "2000px High Resolution", ja: "2000px高解像度", zh: "2000px高分辨率" })}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Beluga Templates Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t({ ko: "벨루가 굿즈 템플릿", en: "Beluga Goods Templates", ja: "ベルーガグッズテンプレート", zh: "白鲸商品模板" })}
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/editor">
                {t({ ko: "에디터로 바로가기", en: "Go to Editor", ja: "エディターへ", zh: "前往编辑器" })}
              </Link>
            </Button>
          </div>
          
          {/* Template Cards Grid - 4 columns PC, 3 tablet, 2 mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="group bg-white shadow-sm border border-gray-200 animate-pulse">
                  <div className="aspect-square bg-gray-200 border-b border-gray-200"></div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              templates.map((template) => (
                <Card key={template.id} className="group bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700">
                  {/* Badge Overlays */}
                  <div className="relative">
                    {template.status === "HOT" && (
                      <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-2 py-1">
                        HOT
                      </Badge>
                    )}
                    {template.status === "NEW" && (
                      <Badge className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs px-2 py-1">
                        NEW
                      </Badge>
                    )}
                    {template.status === "인기" && (
                      <Badge className="absolute top-2 left-2 z-10 bg-blue-500 text-white text-xs px-2 py-1">
                        인기
                      </Badge>
                    )}
                    
                    {/* Image Placeholder - Ready for dynamic image insertion */}
                    <div 
                      className="image-placeholder aspect-square bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-center group-hover:bg-gray-50 dark:group-hover:bg-gray-600 transition-colors"
                      data-template-id={template.id}
                      data-src={template.imageUrl || ""}
                    >
                      <div className="text-gray-400 dark:text-gray-500 text-center">
                        <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <span className="text-xs">이미지 준비중</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-3 sm:p-4">
                    {/* Template Name */}
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {language === 'ko' ? template.titleKo : template.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2 leading-relaxed">
                      {language === 'ko' ? template.descriptionKo : template.description}
                    </p>
                    
                    {/* File Type & Resolution */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200">
                        {template.format}
                      </Badge>
                      <span className="text-xs text-gray-500 font-medium">
                        2000px
                      </span>
                    </div>
                    
                    {/* Download Count */}
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <Download className="w-3 h-3 mr-1" />
                      <span>{template.downloads.toLocaleString()}</span>
                    </div>
                    
                    {/* Download Button */}
                    <Button 
                      className="w-full text-sm py-2 bg-blue-600 hover:bg-blue-700 text-white" 
                      size="sm"
                      data-template-id={template.id}
                      data-download-url=""
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {t({ ko: "다운로드", en: "Download", ja: "ダウンロード", zh: "下载" })}
                    </Button>
                    
                    {/* Size Information Below Button */}
                    <div className="text-center mt-2 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500 font-medium">
                        {template.size}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  {t({ ko: "자료 이용 안내", en: "Resource Usage Guide" })}
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• {t({ ko: "모든 자료는 회원 가입 후 무료로 다운로드 가능합니다", en: "All materials are free to download after registration" })}</li>
                  <li>• {t({ ko: "상업적 사용이 가능하며, 재배포는 금지됩니다", en: "Commercial use is allowed, redistribution is prohibited" })}</li>
                  <li>• {t({ ko: "자료 사용 시 출처 표기를 권장합니다", en: "Source attribution is recommended when using materials" })}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}