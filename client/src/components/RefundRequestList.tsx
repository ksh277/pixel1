import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/components/SupabaseProvider';
import { isSupabaseConfigured } from '@/lib/supabase';

interface RefundRequest {
  id: number;
  order_id: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  resolved_at?: string;
  admin_note?: string;
  orders?: {
    id: number;
    total_amount: number;
    created_at: string;
    order_items: any[];
  };
}

export const RefundRequestList: React.FC = () => {
  // Auth context
  const { user: localUser } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const currentUser = isSupabaseConfigured ? supabaseUser : localUser;

  const { data: refundRequests, isLoading, error } = useQuery({
    queryKey: ['refund-requests', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      
      const response = await fetch(`/api/refund-requests/user/${currentUser.id}`);
      if (!response.ok) {
        throw new Error('환불 요청 목록을 불러오는데 실패했습니다.');
      }
      return response.json();
    },
    enabled: !!currentUser,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">검토 중</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600">승인됨</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">거절됨</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">
          환불 요청 목록을 불러오는데 실패했습니다.
        </p>
      </div>
    );
  }

  if (!refundRequests || refundRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">
          환불 요청 내역이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {refundRequests.map((request: RefundRequest) => (
        <div
          key={request.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(request.status)}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  주문 #{request.order_id}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  요청일: {new Date(request.requested_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
            {getStatusBadge(request.status)}
          </div>

          {request.orders && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                주문 금액: ₩{request.orders.total_amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                주문 날짜: {new Date(request.orders.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
          )}

          <div className="mb-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              환불 사유
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {request.reason}
            </p>
          </div>

          {request.admin_note && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                관리자 메모
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                {request.admin_note}
              </p>
            </div>
          )}

          {request.resolved_at && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              처리일: {new Date(request.resolved_at).toLocaleDateString('ko-KR')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};