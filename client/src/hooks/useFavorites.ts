import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { fetchUserFavorites, toggleFavorite, isFavorite } from '@/lib/supabaseApi'
import { useToast } from '@/hooks/use-toast'
import { isSupabaseConfigured } from '@/lib/supabase'

export const useFavorites = () => {
  const { user } = useSupabaseAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => user?.id ? fetchUserFavorites(user.id) : [],
    enabled: !!user?.id && isSupabaseConfigured,
  })

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ productId }: { productId: string }) => {
      if (!user?.id) throw new Error('User not authenticated')
      return toggleFavorite(user.id, productId)
    },
    onSuccess: (isFavorited, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] })
      
      toast({
        title: isFavorited ? "찜 추가 완료" : "찜 제거 완료",
        description: isFavorited ? "관심 상품에 추가되었습니다." : "관심 상품에서 제거되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "오류 발생",
        description: "찜 상태를 변경할 수 없습니다.",
        variant: "destructive",
      })
    },
  })

  const isFavorited = (productId: string) => {
    return favorites?.some(fav => fav.product_id === productId) || false
  }

  return {
    favorites,
    isLoading,
    isFavorited,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isToggling: toggleFavoriteMutation.isPending,
  }
}

export const useIsFavorite = (productId: string) => {
  const { user } = useSupabaseAuth()
  const [favoriteState, setFavoriteState] = useState(false)
  
  const { data: isFavorited, isLoading } = useQuery({
    queryKey: ['isFavorite', user?.id, productId],
    queryFn: () => user?.id ? isFavorite(user.id, productId) : false,
    enabled: !!user?.id && !!productId && isSupabaseConfigured,
  })

  useEffect(() => {
    if (isFavorited !== undefined) {
      setFavoriteState(isFavorited)
    }
  }, [isFavorited])

  return {
    isFavorited: favoriteState,
    isLoading,
  }
}