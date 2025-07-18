import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { 
  fetchDeliveryTracking, 
  createDeliveryTracking, 
  updateDeliveryTracking,
  fetchAllDeliveryTrackings 
} from '@/lib/supabaseApi'
import { useToast } from '@/hooks/use-toast'

export function useDeliveryTracking(orderId: string) {
  return useQuery({
    queryKey: ['delivery-tracking', orderId],
    queryFn: () => fetchDeliveryTracking(orderId),
    enabled: !!orderId,
  })
}

export function useAllDeliveryTrackings() {
  return useQuery({
    queryKey: ['delivery-trackings'],
    queryFn: fetchAllDeliveryTrackings,
  })
}

export function useCreateDeliveryTracking() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDeliveryTracking,
    onSuccess: () => {
      toast({
        title: "배송 정보가 등록되었습니다",
        description: "배송 추적 정보가 성공적으로 등록되었습니다.",
      })
      
      // Invalidate and refetch delivery tracking data
      queryClient.invalidateQueries({ queryKey: ['delivery-tracking'] })
      queryClient.invalidateQueries({ queryKey: ['delivery-trackings'] })
    },
    onError: (error) => {
      console.error('Delivery tracking creation error:', error)
      toast({
        title: "배송 정보 등록 실패",
        description: "배송 정보 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateDeliveryTracking() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ trackingId, updates }: { 
      trackingId: string; 
      updates: { 
        courier?: string; 
        tracking_number?: string; 
        status?: string; 
        estimated_delivery?: string; 
      } 
    }) => updateDeliveryTracking(trackingId, updates),
    onSuccess: () => {
      toast({
        title: "배송 정보가 업데이트되었습니다",
        description: "배송 추적 정보가 성공적으로 수정되었습니다.",
      })
      
      // Invalidate and refetch delivery tracking data
      queryClient.invalidateQueries({ queryKey: ['delivery-tracking'] })
      queryClient.invalidateQueries({ queryKey: ['delivery-trackings'] })
    },
    onError: (error) => {
      console.error('Delivery tracking update error:', error)
      toast({
        title: "배송 정보 수정 실패",
        description: "배송 정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    },
  })
}

// Delivery status helpers
export const getDeliveryStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'processing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'shipped':
    case 'in_transit':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    case 'out_for_delivery':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    case 'delivered':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'failed':
    case 'returned':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

export const getDeliveryStatusText = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return '배송 대기'
    case 'processing':
      return '배송 준비중'
    case 'shipped':
      return '배송 시작'
    case 'in_transit':
      return '배송 중'
    case 'out_for_delivery':
      return '배송 출발'
    case 'delivered':
      return '배송 완료'
    case 'failed':
      return '배송 실패'
    case 'returned':
      return '반송'
    default:
      return status || '상태 없음'
  }
}

export const getDeliveryStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return '⏳'
    case 'processing':
      return '📦'
    case 'shipped':
    case 'in_transit':
      return '🚚'
    case 'out_for_delivery':
      return '🚛'
    case 'delivered':
      return '✅'
    case 'failed':
    case 'returned':
      return '❌'
    default:
      return '📋'
  }
}