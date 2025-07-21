import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Upload, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

export default function CommunityWrite() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  if (!user) {
    setLocation("/login");
    return null;
  }

  const categories = [
    { value: "showcase", label: t({ ko: "작품 자랑", en: "Showcase", ja: "作品自慢", zh: "作品展示" }) },
    { value: "tutorial", label: t({ ko: "튜토리얼", en: "Tutorial", ja: "チュートリアル", zh: "教程" }) },
    { value: "question", label: t({ ko: "질문", en: "Question", ja: "質問", zh: "问题" }) },
    { value: "tip", label: t({ ko: "팁 공유", en: "Tips", ja: "ヒント", zh: "技巧分享" }) },
    { value: "review", label: t({ ko: "후기", en: "Review", ja: "レビュー", zh: "评价" }) },
    { value: "general", label: t({ ko: "일반", en: "General", ja: "一般", zh: "一般" }) }
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
    
    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: t({ ko: "필수 항목 누락", en: "Missing Required Fields", ja: "必須項目不足", zh: "缺少必填项" }),
        description: t({ ko: "제목, 내용, 카테고리를 모두 입력해주세요", en: "Please fill in title, content, and category", ja: "タイトル、内容、カテゴリを入力してください", zh: "请填写标题、内容和分类" }),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for demo
      const newPost = {
        id: Date.now(),
        title,
        content,
        category,
        tags,
        images,
        author: user.name,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        views: 0
      };
      
      const existingPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
      existingPosts.unshift(newPost);
      localStorage.setItem('communityPosts', JSON.stringify(existingPosts));
      
      toast({
        title: t({ ko: "게시물 작성 완료", en: "Post Created", ja: "投稿完了", zh: "发布成功" }),
        description: t({ ko: "커뮤니티에 게시물이 성공적으로 등록되었습니다", en: "Your post has been published successfully", ja: "コミュニティに投稿されました", zh: "您的帖子已成功发布" }),
      });
      
      setLocation("/community");
    } catch (error) {
      toast({
        title: t({ ko: "오류", en: "Error", ja: "エラー", zh: "错误" }),
        description: t({ ko: "게시물 작성 중 오류가 발생했습니다", en: "An error occurred while creating the post", ja: "投稿中にエラーが発生しました", zh: "发布时发生错误" }),
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
            <Link href="/community">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t({ ko: "커뮤니티로 돌아가기", en: "Back to Community", ja: "コミュニティに戻る", zh: "返回社区" })}
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t({ ko: "커뮤니티 글 작성", en: "Write Community Post", ja: "コミュニティ投稿", zh: "社区发帖" })}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t({ ko: "창작자들과 경험과 지식을 공유해보세요", en: "Share your experiences and knowledge with creators", ja: "クリエイターと体験や知識を共有しましょう", zh: "与创作者分享您的经验和知识" })}
          </p>
        </div>

        {/* Writing Form */}
        <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              {t({ ko: "새 게시물 작성", en: "Create New Post", ja: "新しい投稿を作成", zh: "创建新帖子" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t({ ko: "카테고리", en: "Category", ja: "カテゴリ", zh: "分类" })} *
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t({ ko: "카테고리를 선택하세요", en: "Select a category", ja: "カテゴリを選択", zh: "选择分类" })} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t({ ko: "제목", en: "Title", ja: "タイトル", zh: "标题" })} *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t({ ko: "게시물 제목을 입력하세요", en: "Enter post title", ja: "投稿タイトルを入力", zh: "输入帖子标题" })}
                  className="text-gray-900 dark:text-white"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t({ ko: "내용", en: "Content", ja: "内容", zh: "内容" })} *
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t({ ko: "게시물 내용을 입력하세요...", en: "Enter post content...", ja: "投稿内容を入力...", zh: "输入帖子内容..." })}
                  className="min-h-[200px] text-gray-900 dark:text-white"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t({ ko: "태그", en: "Tags", ja: "タグ", zh: "标签" })} ({t({ ko: "최대 5개", en: "Max 5", ja: "最大5個", zh: "最多5个" })})
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder={t({ ko: "태그 입력", en: "Enter tag", ja: "タグを入力", zh: "输入标签" })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
                    {t({ ko: "추가", en: "Add", ja: "追加", zh: "添加" })}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t({ ko: "이미지", en: "Images", ja: "画像", zh: "图片" })} ({t({ ko: "최대 5개", en: "Max 5", ja: "最大5個", zh: "最多5个" })})
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {t({ ko: "이미지를 드래그하거나 클릭하여 업로드", en: "Drag images or click to upload", ja: "画像をドラッグまたはクリックしてアップロード", zh: "拖拽图片或点击上传" })}
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
                      {t({ ko: "이미지 선택", en: "Select Images", ja: "画像を選択", zh: "选择图片" })}
                    </label>
                  </Button>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
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
                <Link href="/community">
                  <Button type="button" variant="outline">
                    {t({ ko: "취소", en: "Cancel", ja: "キャンセル", zh: "取消" })}
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Send className="h-4 w-4 mr-2 animate-spin" />
                      {t({ ko: "게시 중...", en: "Publishing...", ja: "投稿中...", zh: "发布中..." })}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t({ ko: "게시하기", en: "Publish", ja: "投稿する", zh: "发布" })}
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