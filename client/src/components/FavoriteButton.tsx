import React from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/hooks/useFavorites'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { isSupabaseConfigured } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface FavoriteButtonProps {
  productId: string
  variant?: 'default' | 'compact' | 'icon-only'
  className?: string
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  productId, 
  variant = 'default',
  className = '' 
}) => {
  const { user } = useSupabaseAuth()
  const { isFavorited, toggleFavorite, isToggling } = useFavorites()
  const { toast } = useToast()

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "찜 기능을 사용하려면 로그인해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!isSupabaseConfigured) {
      toast({
        title: "서비스 준비 중",
        description: "찜 기능을 사용할 수 없습니다.",
        variant: "destructive",
      })
      return
    }

    toggleFavorite({ productId })
  }

  const isCurrentlyFavorited = isFavorited(productId)

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={isToggling}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          isCurrentlyFavorited 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-red-500'
        } ${className}`}
        aria-label={isCurrentlyFavorited ? '찜 제거' : '찜 추가'}
      >
        <Heart 
          className={`w-4 h-4 ${isCurrentlyFavorited ? 'fill-current' : ''}`}
        />
      </button>
    )
  }

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleFavorite}
        disabled={isToggling}
        className={`h-8 px-2 ${className}`}
      >
        <Heart 
          className={`w-4 h-4 ${
            isCurrentlyFavorited 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-400'
          }`}
        />
      </Button>
    )
  }

  return (
    <Button
      variant={isCurrentlyFavorited ? "default" : "outline"}
      onClick={handleToggleFavorite}
      disabled={isToggling}
      className={`flex items-center gap-2 ${className}`}
    >
      <Heart 
        className={`w-4 h-4 ${
          isCurrentlyFavorited 
            ? 'fill-current text-white' 
            : 'text-gray-600'
        }`}
      />
      {isCurrentlyFavorited ? '찜 제거' : '찜 추가'}
    </Button>
  )
}

export default FavoriteButton
