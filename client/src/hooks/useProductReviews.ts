import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { 
  fetchProductReviews, 
  createProductReview, 
  updateProductReview, 
  deleteProductReview,
  fetchUserReviewForProduct 
} from '@/lib/supabaseApi'
import { useToast } from '@/hooks/use-toast'

export function useProductReviews(productId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch all reviews for a product
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: () => fetchProductReviews(productId),
    enabled: !!productId,
  })

  // Calculate average rating and total reviews
  const averageRating = reviews?.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const totalReviews = reviews?.length || 0

  return {
    reviews,
    isLoading,
    error,
    averageRating,
    totalReviews,
  }
}

export function useUserReviewForProduct(userId: string, productId: string) {
  return useQuery({
    queryKey: ['user-review', userId, productId],
    queryFn: () => fetchUserReviewForProduct(userId, productId),
    enabled: !!userId && !!productId,
  })
}

export function useCreateProductReview(productId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProductReview,
    onSuccess: () => {
      toast({
        title: "리뷰가 등록되었습니다",
        description: "소중한 의견을 주셔서 감사합니다.",
      })
      
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] })
      queryClient.invalidateQueries({ queryKey: ['user-review'] })
    },
    onError: (error) => {
      console.error('Review creation error:', error)
      toast({
        title: "리뷰 등록 실패",
        description: "리뷰 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateProductReview(productId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, updates }: { reviewId: string; updates: { rating?: number; review_text?: string } }) =>
      updateProductReview(reviewId, updates),
    onSuccess: () => {
      toast({
        title: "리뷰가 수정되었습니다",
        description: "리뷰가 성공적으로 업데이트되었습니다.",
      })
      
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] })
      queryClient.invalidateQueries({ queryKey: ['user-review'] })
    },
    onError: (error) => {
      console.error('Review update error:', error)
      toast({
        title: "리뷰 수정 실패",
        description: "리뷰 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteProductReview(productId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProductReview,
    onSuccess: () => {
      toast({
        title: "리뷰가 삭제되었습니다",
        description: "리뷰가 성공적으로 삭제되었습니다.",
      })
      
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] })
      queryClient.invalidateQueries({ queryKey: ['user-review'] })
    },
    onError: (error) => {
      console.error('Review deletion error:', error)
      toast({
        title: "리뷰 삭제 실패",
        description: "리뷰 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    },
  })
}