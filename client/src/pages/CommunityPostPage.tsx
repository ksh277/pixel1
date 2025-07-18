import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { ArrowLeft, MessageSquare, User, Calendar, Eye, Edit2, Trash2, AlertCircle } from 'lucide-react'
import { Link, useParams } from 'wouter'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { useCommunityPost, useDeleteCommunityPost, getPostCategoryColor, getPostCategoryText, formatPostDate } from '@/hooks/useCommunityPosts'
import CommentSection from '@/components/CommentSection'

const CommunityPostPage = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useSupabaseAuth()
  const { data: post, isLoading, error } = useCommunityPost(id!)
  const deletePost = useDeleteCommunityPost()

  const handleDeletePost = async () => {
    if (!user || !post || post.user_id !== user.id) {
      return
    }

    if (window.confirm('게시글을 삭제하시겠습니까?')) {
      try {
        await deletePost.mutateAsync(id!)
        window.location.href = '/community'
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }



  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-700 rounded w-1/4"></div>
              <div className="h-64 bg-gray-700 rounded"></div>
              <div className="h-48 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-[#1e2b3c] border-gray-700">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <h2 className="text-2xl font-bold mb-4 text-white">
                  게시글을 찾을 수 없습니다
                </h2>
                <p className="text-gray-400 mb-6">
                  요청하신 게시글이 존재하지 않거나 삭제되었습니다.
                </p>
                <Link href="/community">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    커뮤니티로 돌아가기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const isAuthor = user && post.user_id === user.id

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/community">
              <Button variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록
              </Button>
            </Link>
            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-gray-600 hover:bg-gray-700"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeletePost}
                  className="text-red-400 border-red-400 hover:bg-red-900/20"
                  disabled={deletePost.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </Button>
              </div>
            )}
          </div>

          {/* Post Content */}
          <Card className="bg-[#1e2b3c] border-gray-700 mb-8">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-4">
                {post.category && (
                  <Badge className={getPostCategoryColor(post.category)}>
                    {getPostCategoryText(post.category)}
                  </Badge>
                )}
                <span className="text-sm text-gray-400">
                  {formatPostDate(post.created_at)}
                </span>
              </div>
              <CardTitle className="text-2xl text-white mb-4">
                {post.title}
              </CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{post.users?.username || '익명'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments?.length || 0}개 댓글</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>0회 조회</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {post.image_url && (
                <div className="mb-6">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full max-w-2xl h-auto rounded-lg bg-gray-700"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              {post.content && (
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <CommentSection 
            postId={id!} 
            commentsCount={post.comments?.length || 0}
          />
        </div>
      </div>
    </div>
  )
}

export default CommunityPostPage