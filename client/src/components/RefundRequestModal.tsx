import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/components/SupabaseProvider';
import { isSupabaseConfigured } from '@/lib/supabase';

interface RefundRequestModalProps {
  orderId: number;
  isOpen: boolean;
  onClose: () => void;
  orderAmount: number;
  orderDate: string;
}

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  orderId,
  isOpen,
  onClose,
  orderAmount,
  orderDate
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Auth context
  const { user: localUser } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const currentUser = isSupabaseConfigured ? supabaseUser : localUser;

  const refundMutation = useMutation({
    mutationFn: async (refundData: any) => {
      const response = await fetch('/api/refund-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refundData),
      });
      
      if (!response.ok) {
        throw new Error('환불 요청 생성에 실패했습니다.');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "환불 요청 완료",
        description: "환불 요청이 성공적으로 접수되었습니다. 검토 후 연락드리겠습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ['refund-requests', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['orders', currentUser?.id] });
      onClose();
      setReason('');
    },
    onError: (error: Error) => {
      toast({
        title: "환불 요청 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast({
        title: "환불 사유 필요",
        description: "환불 사유를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "로그인 필요",
        description: "환불 요청을 하려면 로그인해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await refundMutation.mutateAsync({
        order_id: orderId,
        user_id: currentUser.id,
        reason: reason.trim(),
        status: 'pending'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            환불 요청
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              주문 정보
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>주문 번호: #{orderId}</p>
            <p>주문 금액: ₩{orderAmount.toLocaleString()}</p>
            <p>주문 날짜: {new Date(orderDate).toLocaleDateString('ko-KR')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reason" className="text-gray-900 dark:text-white">
              환불 사유 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="환불을 원하는 사유를 상세히 작성해주세요..."
              className="mt-2 min-h-[100px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>안내사항:</strong>
              <br />
              • 환불 요청 후 1-3일 내에 검토 결과를 알려드립니다.
              <br />
              • 승인된 환불은 3-5일 내에 처리됩니다.
              <br />
              • 문의사항이 있으시면 고객센터로 연락주세요.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !reason.trim()}
            >
              {isSubmitting ? '처리 중...' : '환불 요청'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};