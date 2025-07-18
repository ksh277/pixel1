import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { 
  fetchCommunityPosts, 
  fetchCommunityPost, 
  createCommunityPost, 
  updateCommunityPost, 
  deleteCommunityPost,
  fetchPostComments,
  createPostComment,
  deletePostComment
} from '@/lib/supabaseApi'
import { useToast } from '@/hooks/use-toast'

export function useCommunityPosts() {
  return useQuery({
    queryKey: ['community-posts'],
    queryFn: fetchCommunityPosts,
  })
}

export function useCommunityPost(postId: string) {
  return useQuery({
    queryKey: ['community-post', postId],
    queryFn: () => fetchCommunityPost(postId),
    enabled: !!postId,
  })
}

export function useCreateCommunityPost() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      toast({
        title: "게시글이 작성되었습니다",
        description: "새로운 게시글이 성공적으로 작성되었습니다.",
      })
      
      // Invalidate and refetch community posts
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
    },
    onError: (error) => {
      console.error('Community post creation error:', error)
      toast({
        title: "게시글 작성 실패",
        description: "게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateCommunityPost() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, updates }: { 
      postId: string; 
      updates: { 
        title?: string; 
        content?: string; 
        category?: string; 
        image_url?: string; 
      } 
    }) => updateCommunityPost(postId, updates),
    onSuccess: () => {
      toast({
        title: "게시글이 수정되었습니다",
        description: "게시글이 성공적으로 수정되었습니다.",
      })
      
      // Invalidate and refetch community posts
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
      queryClient.invalidateQueries({ queryKey: ['community-post'] })
    },
    onError: (error) => {
      console.error('Community post update error:', error)
      toast({
        title: "게시글 수정 실패",
        description: "게시글 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    },
  })
}

export function useDeleteCommunityPost() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCommunityPost,
    onSuccess: () => {
      toast({
        title: "게시글이 삭제되었습니다",
        description: "게시글이 성공적으로 삭제되었습니다.",
      })
      
      // Invalidate and refetch community posts
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
    },
    onError: (error) => {
      console.error('Community post deletion error:', error)
      toast({
        title: "게시글 삭제 실패",
        description: "게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    },
  })
}

// Comment hooks
export function usePostComments(postId: string) {
  return useQuery({
    queryKey: ['post-comments', postId],
    queryFn: () => fetchPostComments(postId),
    enabled: !!postId,
  })
}

export function useCreatePostComment() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPostComment,
    onSuccess: () => {
      toast({
        title: "댓글이 작성되었습니다",
        description: "새로운 댓글이 성공적으로 작성되었습니다.",
      })
      
      // Invalidate and refetch comments
      queryClient.invalidateQueries({ queryKey: ['post-comments'] })
      queryClient.invalidateQueries({ queryKey: ['community-post'] })
    },
    onError: (error) => {
      console.error('Comment creation error:', error)
      toast({
        title: "댓글 작성 실패",
        description: "댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    },
  })
}

export function useDeletePostComment() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePostComment,
    onSuccess: () => {
      toast({
        title: "댓글이 삭제되었습니다",
        description: "댓글이 성공적으로 삭제되었습니다.",
      })
      
      // Invalidate and refetch comments
      queryClient.invalidateQueries({ queryKey: ['post-comments'] })
      queryClient.invalidateQueries({ queryKey: ['community-post'] })
    },
    onError: (error) => {
      console.error('Comment deletion error:', error)
      toast({
        title: "댓글 삭제 실패",
        description: "댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    },
  })
}

// Utility functions for post categories
export const getPostCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'general':
    case '일반':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'question':
    case '질문':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'tip':
    case '팁':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    case 'review':
    case '후기':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    case 'showcase':
    case '자랑':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

export const getPostCategoryText = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'general':
      return '일반'
    case 'question':
      return '질문'
    case 'tip':
      return '팁'
    case 'review':
      return '후기'
    case 'showcase':
      return '자랑'
    default:
      return category || '일반'
  }
}

export const formatPostDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes}분 전`
  } else if (hours < 24) {
    return `${hours}시간 전`
  } else if (days < 7) {
    return `${days}일 전`
  } else {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
}