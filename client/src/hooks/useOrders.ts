import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrder, fetchUserOrders, fetchOrderById } from '@/lib/supabaseApi'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export const useOrders = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const {
    data: orders = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => fetchUserOrders(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createOrderMutation = useMutation({
    mutationFn: ({ userId, cartItems }: { userId: string; cartItems: any[] }) => 
      createOrder(userId, cartItems),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast({
        title: "주문이 완료되었습니다",
        description: `주문번호: ${order.id}`,
      })
    },
    onError: (error) => {
      console.error('Order creation failed:', error)
      toast({
        title: "주문 실패",
        description: "주문 처리 중 오류가 발생했습니다. 다시 시도해 주세요.",
        variant: "destructive",
      })
    },
  })

  const placeOrder = async (cartItems: any[]) => {
    if (!user?.id) {
      toast({
        title: "로그인이 필요합니다",
        description: "주문하려면 먼저 로그인해 주세요.",
        variant: "destructive",
      })
      return null
    }

    try {
      const order = await createOrderMutation.mutateAsync({ 
        userId: user.id, 
        cartItems 
      })
      return order
    } catch (error) {
      console.error('Failed to place order:', error)
      return null
    }
  }

  return {
    orders,
    isLoading,
    error,
    refetch,
    placeOrder,
    isPlacingOrder: createOrderMutation.isPending,
  }
}

export const useOrder = (orderId: string) => {
  const {
    data: order,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  })

  return {
    order,
    isLoading,
    error,
    refetch,
  }
}