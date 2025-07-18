import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Send, Eye } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { useCreateCommunityPost } from '@/hooks/useCommunityPosts'
import ImageUpload from '@/components/ImageUpload'

const CommunityWritePage = () => {
  const { user } = useSupabaseAuth()
  const [, setLocation] = useLocation()
  const createPost = useCreateCommunityPost()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    image_url: ''
  })

  const [isPreview, setIsPreview] = useState(false)

  const categories = [
    { value: 'general', label: '일반' },
    { value: 'question', label: '질문' },
    { value: 'tip', label: '팁' },
    { value: 'review', label: '후기' },
    { value: 'showcase', label: '자랑' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      return
    }

    if (!formData.title.trim()) {
      return
    }

    try {
      await createPost.mutateAsync({
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        image_url: formData.image_url.trim() || undefined
      })
      
      setLocation('/community')
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image_url: imageUrl
    }))
  }

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      image_url: ''
    }))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-[#1e2b3c] border-gray-700">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  로그인이 필요합니다
                </h2>
                <p className="text-gray-400 mb-6">
                  게시글을 작성하려면 로그인이 필요합니다.
                </p>
                <div className="space-x-4">
                  <Link href="/login">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                      커뮤니티로 돌아가기
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/community">
                <Button variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  목록
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-white">게시글 작성</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
                className="text-white border-gray-600 hover:bg-gray-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreview ? '편집' : '미리보기'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Write Form */}
            <Card className={`bg-[#1e2b3c] border-gray-700 ${isPreview ? 'lg:block hidden' : ''}`}>
              <CardHeader>
                <CardTitle className="text-white">글쓰기</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-white">제목 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="제목을 입력하세요"
                      className="bg-[#0f172a] border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-white">카테고리</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="bg-[#0f172a] border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1e2b3c] border-gray-600">
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">이미지 업로드 (선택)</Label>
                    <ImageUpload
                      onImageUpload={handleImageUpload}
                      onImageRemove={handleImageRemove}
                      currentImageUrl={formData.image_url}
                      disabled={createPost.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-white">내용</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="내용을 입력하세요"
                      rows={12}
                      className="bg-[#0f172a] border-gray-600 text-white placeholder-gray-400 resize-none"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      disabled={createPost.isPending || !formData.title.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {createPost.isPending ? '작성 중...' : '게시글 작성'}
                    </Button>
                    <Link href="/community">
                      <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                        취소
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className={`bg-[#1e2b3c] border-gray-700 ${isPreview ? '' : 'lg:block hidden'}`}>
              <CardHeader>
                <CardTitle className="text-white">미리보기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Preview Title */}
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      {formData.title || '제목을 입력하세요'}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>작성자: {user.user_metadata?.username || user.email}</span>
                      <span>카테고리: {categories.find(c => c.value === formData.category)?.label}</span>
                      <span>방금 전</span>
                    </div>
                  </div>

                  {/* Preview Image */}
                  {formData.image_url && (
                    <div className="mb-4">
                      <img
                        src={formData.image_url}
                        alt="미리보기"
                        className="w-full max-w-md h-auto rounded-lg bg-gray-700"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}

                  {/* Preview Content */}
                  <div className="prose prose-invert max-w-none">
                    {formData.content ? (
                      <div className="text-gray-300 whitespace-pre-wrap">
                        {formData.content}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">내용을 입력하세요</p>
                    )}
                  </div>

                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>댓글 0개</span>
                      <span>조회 0회</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityWritePage