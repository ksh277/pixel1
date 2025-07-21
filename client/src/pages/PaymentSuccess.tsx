import React, { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, CreditCard, Calendar, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const processPaymentResult = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId');
      const paymentMethod = urlParams.get('toss') ? 'toss' : 'kakao';
      
      if (!orderId) {
        toast({
          title: "오류",
          description: "주문 정보를 찾을 수 없습니다.",
          variant: "destructive"
        });
        setLocation('/');
        return;
      }

      try {
        // Update payment status in database
        const response = await fetch('/api/payment/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderId,
            paymentMethod: paymentMethod,
            status: 'success'
          }),
        });

        if (!response.ok) {
          throw new Error('결제 완료 처리 실패');
        }

        const data = await response.json();
        setPaymentData(data);
        
        toast({
          title: "결제 완료!",
          description: "주문이 성공적으로 처리되었습니다.",
        });
      } catch (error) {
        console.error('Payment completion error:', error);
        toast({
          title: "처리 오류",
          description: "결제 완료 처리 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentResult();
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            결제 완료 처리 중...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            잠시만 기다려주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            결제가 완료되었습니다!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            주문해주셔서 감사합니다. 빠른 시일 내에 제작을 시작하겠습니다.
          </p>
        </div>

        {/* Payment Details */}
        <Card className="mb-6 bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <CreditCard className="w-5 h-5 mr-2" />
              결제 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">주문번호</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {paymentData?.orderId || new URLSearchParams(window.location.search).get('orderId')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">결제방법</p>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new URLSearchParams(window.location.search).get('toss') ? 'Toss Payments' : '카카오페이'}
                  </p>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    완료
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">결제금액</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {paymentData?.amount?.toLocaleString() || '0'}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">결제시간</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date().toLocaleString('ko-KR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Package className="w-5 h-5 mr-2" />
              다음 단계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">주문 확인</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">결제 완료 후 주문이 확인되었습니다.</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">제작 시작</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">1-2일 내에 제작을 시작합니다.</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">배송 준비</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">제작 완료 후 배송을 준비합니다.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/mypage')}
            className="h-12"
          >
            <Calendar className="w-4 h-4 mr-2" />
            주문 내역 확인
          </Button>
          <Button 
            onClick={() => setLocation('/')}
            className="h-12"
          >
            쇼핑 계속하기
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Support Notice */}
        <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              <strong>문의사항이 있으신가요?</strong><br />
              제작 과정에서 궁금한 점이 있으시면 언제든지 고객센터로 연락주세요.
              카카오톡 채널 또는 이메일로 문의 가능합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;