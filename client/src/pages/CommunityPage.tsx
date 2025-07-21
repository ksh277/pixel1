import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, User, Search, Plus, Calendar, Eye, Heart, Filter } from 'lucide-react'
import { Link } from 'wouter'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { useCommunityPosts, getPostCategoryColor, getPostCategoryText, formatPostDate } from '@/hooks/useCommunityPosts'

const CommunityPage = () => {
  const { user } = useSupabaseAuth()
  const { data: posts, isLoading, error } = useCommunityPosts()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'general', label: '일반' },
    { value: 'question', label: '질문' },
    { value: 'tip', label: '팁' },
    { value: 'review', label: '후기' },
    { value: 'showcase', label: '자랑' },
  ]

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-700 rounded w-1/3"></div>
              <div className="h-16 bg-gray-700 rounded"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-[#1a1a1a] border-gray-700">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <h2 className="text-2xl font-bold mb-4 text-white">
                  오류가 발생했습니다
                </h2>
                <p className="text-gray-400 mb-6">
                  커뮤니티 게시글을 불러오는 중 오류가 발생했습니다.
                </p>
                <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                  다시 시도
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white">커뮤니티</h1>
              <p className="text-gray-400 mt-2">
                {posts?.length || 0}개의 게시글
              </p>
            </div>
            {user ? (
              <Link href="/community/write">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  글쓰기
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700 w-full md:w-auto">
                  로그인하고 글쓰기
                </Button>
              </Link>
            )}
          </div>

          {/* Search and Filter */}
          <Card className="bg-[#1a1a1a] border-gray-700 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="제목이나 내용으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-32 bg-[#1a1a1a] border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-gray-600">
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          {filteredPosts?.length === 0 ? (
            <Card className="bg-[#1a1a1a] border-gray-700">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold mb-4 text-white">
                  {searchTerm || selectedCategory !== 'all' ? '검색 결과가 없습니다' : '첫 번째 게시글을 작성해보세요'}
                </h2>
                <p className="text-gray-400 mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? '다른 검색어나 카테고리를 시도해보세요.'
                    : '아직 작성된 게시글이 없습니다. 커뮤니티에 첫 번째 게시글을 남겨보세요!'
                  }
                </p>
                {user && (
                  <Link href="/community/write">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      글쓰기
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPosts?.map((post) => (
                <Card key={post.id} className="bg-[#1a1a1a] border-gray-700 hover:bg-[#253041] transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {post.category && (
                            <Badge className={getPostCategoryColor(post.category)}>
                              {getPostCategoryText(post.category)}
                            </Badge>
                          )}
                          <span className="text-sm text-gray-400">
                            {formatPostDate(post.created_at)}
                          </span>
                        </div>
                        
                        <Link href={`/community/${post.id}`}>
                          <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors mb-2 cursor-pointer">
                            {post.title}
                          </h3>
                        </Link>
                        
                        {post.content && (
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {post.content.substring(0, 150)}
                            {post.content.length > 150 && '...'}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{post.users?.username || '익명'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments?.length || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>0</span>
                          </div>
                        </div>
                      </div>
                      
                      {post.image_url && (
                        <div className="ml-4 flex-shrink-0">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded-lg bg-gray-700"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommunityPage