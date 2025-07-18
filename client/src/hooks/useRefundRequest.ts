import { useQuery } from '@tanstack/react-query';

interface RefundRequestCheck {
  exists: boolean;
  request?: any;
}

export const useRefundRequestCheck = (orderId: number) => {
  return useQuery<RefundRequestCheck>({
    queryKey: ['refund-request-check', orderId],
    queryFn: async () => {
      const response = await fetch(`/api/refund-requests/check/${orderId}`);
      if (!response.ok) {
        throw new Error('환불 요청 확인에 실패했습니다.');
      }
      return response.json();
    },
    enabled: !!orderId,
  });
};

export const useUserRefundRequests = (userId: number) => {
  return useQuery({
    queryKey: ['refund-requests', userId],
    queryFn: async () => {
      const response = await fetch(`/api/refund-requests/user/${userId}`);
      if (!response.ok) {
        throw new Error('환불 요청 목록을 불러오는데 실패했습니다.');
      }
      return response.json();
    },
    enabled: !!userId,
  });
};