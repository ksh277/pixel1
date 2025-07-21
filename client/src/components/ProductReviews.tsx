import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Star, User, Edit2, Trash2, MessageSquare, StarIcon } from 'lucide-react'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { useProductReviews, useUserReviewForProduct, useCreateProductReview, useUpdateProductReview, useDeleteProductReview } from '@/hooks/useProductReviews'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ProductReviewsProps {
  productId: string
  productName: string
}

const StarRating = ({ rating, onRatingChange, readonly = false }: { 
  rating: number; 
  onRatingChange?: (rating: number) => void; 
  readonly?: boolean 
}) => {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={cn(
            'w-5 h-5 cursor-pointer transition-colors',
            star <= (hoverRating || rating) 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300 dark:text-gray-600',
            readonly && 'cursor-default'
          )}
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
        />
      ))}
    </div>
  )
}

const ReviewForm = ({ 
  productId, 
  existingReview, 
  onClose 
}: { 
  productId: string; 
  existingReview?: any; 
  onClose: () => void 
}) => {
  const { user } = useSupabaseAuth()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [reviewText, setReviewText] = useState(existingReview?.review_text || '')
  
  const createReview = useCreateProductReview(productId)
  const updateReview = useUpdateProductReview(productId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    if (rating === 0) return
    
    try {
      if (existingReview) {
        await updateReview.mutateAsync({
          reviewId: existingReview.id,
          updates: { rating, review_text: reviewText }
        })
      } else {
        await createReview.mutateAsync({
          user_id: user.id,
          product_id: productId,
          rating,
          review_text: reviewText
        })
      }
      onClose()
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  return (
    <div className="bg-[#1a1a1a] text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">평점</label>
          <StarRating rating={rating} onRatingChange={setRating} />
          {rating === 0 && (
            <p className="text-sm text-red-400 mt-1">평점을 선택해주세요</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">리뷰 내용</label>
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="이 상품에 대한 솔직한 리뷰를 작성해주세요..."
            className="min-h-[100px] bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-400"
            rows={4}
          />
        </div>
        
        <div className="flex space-x-3">
          <Button 
            type="submit" 
            disabled={rating === 0 || createReview.isPending || updateReview.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createReview.isPending || updateReview.isPending ? '저장 중...' : existingReview ? '수정하기' : '등록하기'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  )
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const { user } = useSupabaseAuth()
  const { reviews, isLoading, averageRating, totalReviews } = useProductReviews(productId)
  const { data: userReview } = useUserReviewForProduct(user?.id || '', productId)
  const deleteReview = useDeleteProductReview(productId)
  
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@')
    const maskedUsername = username.slice(0, 2) + '*'.repeat(Math.max(0, username.length - 2))
    return `${maskedUsername}@${domain}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview.mutateAsync(reviewId)
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] text-white p-6 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-700 h-24 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] text-white rounded-lg">
      <Card className="bg-[#1a1a1a] border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-xl text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                상품 리뷰 ({totalReviews})
              </CardTitle>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <StarRating rating={Math.round(averageRating)} readonly />
                  <span className="text-lg font-semibold text-white">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  {totalReviews}개의 리뷰
                </span>
              </div>
            </div>
            
            {user && (
              <div className="flex space-x-2">
                {userReview ? (
                  <div className="flex space-x-2">
                    <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-white hover:bg-gray-700"
                          onClick={() => setEditingReview(userReview)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          리뷰 수정
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-[#1a1a1a] border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">리뷰 수정</DialogTitle>
                        </DialogHeader>
                        <ReviewForm 
                          productId={productId}
                          existingReview={editingReview}
                          onClose={() => {
                            setShowReviewForm(false)
                            setEditingReview(null)
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-400 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          리뷰 삭제
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#1a1a1a] border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">리뷰 삭제</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-300">
                            이 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-gray-600 text-white hover:bg-gray-700">
                            취소
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteReview(userReview.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : (
                  <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        리뷰 작성
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-[#1a1a1a] border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">리뷰 작성</DialogTitle>
                      </DialogHeader>
                      <ReviewForm 
                        productId={productId}
                        onClose={() => setShowReviewForm(false)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[#1a1a1a] p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.users?.avatar_url} />
                      <AvatarFallback className="bg-gray-600 text-white">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-white">
                          {review.users?.username || maskEmail(review.users?.email || '')}
                        </span>
                        <StarRating rating={review.rating} readonly />
                        <span className="text-sm text-gray-400">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                      
                      {review.review_text && (
                        <p className="text-gray-300 leading-relaxed">
                          {review.review_text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 mb-4">
                아직 리뷰가 없습니다.
              </p>
              {user && (
                <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      첫 번째 리뷰 작성하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-[#1a1a1a] border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">리뷰 작성</DialogTitle>
                    </DialogHeader>
                    <ReviewForm 
                      productId={productId}
                      onClose={() => setShowReviewForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductReviews