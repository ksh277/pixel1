import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, MessageSquare, User, Calendar, Eye, Edit2, Trash2, Send, AlertCircle } from 'lucide-react'
import { Link, useParams } from 'wouter'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { useCommunityPost, useCreatePostComment, useDeleteCommunityPost, useDeletePostComment, getPostCategoryColor, getPostCategoryText, formatPostDate } from '@/hooks/useCommunityPosts'

const CommunityPostPage = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useSupabaseAuth()
  const { data: post, isLoading, error } = useCommunityPost(id!)
  const createComment = useCreatePostComment()
  const deletePost = useDeleteCommunityPost()
  const deleteComment = useDeletePostComment()
  
  const [commentContent, setCommentContent] = useState('')
  const [isCommentLoading, setIsCommentLoading] = useState(false)

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !commentContent.trim()) {
      return
    }

    setIsCommentLoading(true)
    try {
      await createComment.mutateAsync({
        post_id: id!,
        content: commentContent.trim()
      })
      setCommentContent('')
    } catch (error) {
      console.error('Error creating comment:', error)
    } finally {
      setIsCommentLoading(false)
    }
  }

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

  const handleDeleteComment = async (commentId: string) => {
    if (!user) {
      return
    }

    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await deleteComment.mutateAsync(commentId)
      } catch (error) {
        console.error('Error deleting comment:', error)
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
                  <span>{post.community_comments?.length || 0}개 댓글</span>
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
          <Card className="bg-[#1e2b3c] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                댓글 {post.community_comments?.length || 0}개
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <Textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    rows={4}
                    className="bg-[#0f172a] border-gray-600 text-white placeholder-gray-400 mb-4"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={!commentContent.trim() || isCommentLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isCommentLoading ? '작성 중...' : '댓글 작성'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="bg-[#0f172a] border border-gray-600 rounded-lg p-4 mb-6 text-center">
                  <p className="text-gray-400 mb-4">
                    댓글을 작성하려면 로그인이 필요합니다.
                  </p>
                  <Link href="/login">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      로그인
                    </Button>
                  </Link>
                </div>
              )}

              {/* Comments List */}
              {post.community_comments?.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">
                    아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {post.community_comments?.map((comment, index) => (
                    <div key={comment.id}>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-white">
                              {comment.users?.username || '익명'}
                            </span>
                            <span className="text-sm text-gray-400">
                              {formatPostDate(comment.created_at)}
                            </span>
                            {user && comment.user_id === user.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1 h-auto"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-gray-300 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                      {index < (post.community_comments?.length || 0) - 1 && (
                        <Separator className="bg-gray-600 mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CommunityPostPage