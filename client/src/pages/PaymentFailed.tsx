import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, RefreshCw, ArrowLeft, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentFailed = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const processPaymentFailure = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId');
      const paymentMethod = urlParams.get('toss') ? 'toss' : 'kakao';
      
      if (orderId) {
        try {
          // Update payment status to failed
          await fetch('/api/payment/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: orderId,
              paymentMethod: paymentMethod,
              status: 'failed'
            }),
          });
        } catch (error) {
          console.error('Failed to update payment status:', error);
        }
      }
    };

    processPaymentFailure();
  }, []);

  const handleRetryPayment = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    
    if (orderId) {
      setLocation(`/payment/select/${orderId}`);
    } else {
      setLocation('/checkout');
    }
  };

  const commonFailureReasons = [
    {
      title: "카드 잔액 부족",
      description: "결제 카드의 잔액이 부족합니다.",
      solution: "다른 카드를 사용하거나 충전 후 다시 시도해주세요."
    },
    {
      title: "카드 정보 오류",
      description: "입력한 카드 정보가 올바르지 않습니다.",
      solution: "카드 번호, 유효기간, CVC 번호를 다시 확인해주세요."
    },
    {
      title: "일시적 오류",
      description: "결제 시스템의 일시적인 오류입니다.",
      solution: "잠시 후 다시 시도해주세요."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            결제에 실패했습니다
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            결제 처리 중 문제가 발생했습니다. 아래의 해결 방법을 확인해주세요.
          </p>
        </div>

        {/* Failure Info */}
        <Card className="mb-6 bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">결제 실패 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">주문번호:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new URLSearchParams(window.location.search).get('orderId') || '알 수 없음'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">결제방법:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new URLSearchParams(window.location.search).get('toss') ? 'Toss Payments' : '카카오페이'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">실패시간:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date().toLocaleString('ko-KR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Failure Reasons */}
        <Card className="mb-6 bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">자주 발생하는 결제 실패 원인</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonFailureReasons.map((reason, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">{reason.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {reason.description}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    해결방법: {reason.solution}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            onClick={handleRetryPayment}
            className="h-12"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 결제하기
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setLocation('/checkout')}
            className="h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            장바구니로 돌아가기
          </Button>
        </div>

        {/* Customer Support */}
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-400">
              문제가 계속 발생하나요?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              위의 해결 방법으로도 문제가 해결되지 않으면 고객센터로 연락해주세요.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-yellow-700 dark:text-yellow-300">
                <Phone className="w-4 h-4 mr-2" />
                <span>고객센터: 1588-1234 (평일 9:00-18:00)</span>
              </div>
              <div className="flex items-center text-yellow-700 dark:text-yellow-300">
                <Mail className="w-4 h-4 mr-2" />
                <span>이메일: support@pixelgoods.com</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 border-yellow-400 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
              onClick={() => setLocation('/contact')}
            >
              문의하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentFailed;