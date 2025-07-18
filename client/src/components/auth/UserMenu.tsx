import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { useToast } from '@/hooks/use-toast'
import { User, LogOut, Heart, ShoppingCart, Settings, Package } from 'lucide-react'
import { Link } from 'wouter'

const UserMenu: React.FC = () => {
  const { user, signOut } = useSupabaseAuth()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "로그아웃 완료",
        description: "안전하게 로그아웃되었습니다.",
      })
    } catch (error) {
      toast({
        title: "로그아웃 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      })
    }
  }

  const getDisplayName = () => {
    if (user?.user_metadata?.username) {
      return user.user_metadata.username
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return '사용자'
  }

  const getInitials = () => {
    const name = getDisplayName()
    return name.charAt(0).toUpperCase()
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={getDisplayName()} />
            <AvatarFallback className="bg-blue-600 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700" align="end">
        <DropdownMenuLabel className="text-gray-900 dark:text-white">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
            <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        <Link href="/mypage">
          <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <User className="mr-2 h-4 w-4" />
            <span>마이페이지</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/wishlist">
          <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <Heart className="mr-2 h-4 w-4" />
            <span>찜한 상품</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/cart">
          <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>장바구니</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/mypage">
          <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <Package className="mr-2 h-4 w-4" />
            <span>주문 내역</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/mypage">
          <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings className="mr-2 h-4 w-4" />
            <span>설정</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu