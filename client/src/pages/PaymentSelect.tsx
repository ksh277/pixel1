import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, ArrowLeft, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  available: boolean;
}

const PaymentSelect = () => {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute('/payment/select/:orderId');
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const orderId = params?.orderId;
  const urlParams = new URLSearchParams(window.location.search);
  const amount = parseInt(urlParams.get('amount') || '0');
  const orderName = urlParams.get('orderName') || '픽셀굿즈 주문';

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'toss',
      name: 'Toss Payments',
      description: '간편하고 안전한 토스 결제',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'bg-blue-600',
      available: true
    },
    {
      id: 'kakao',
      name: '카카오페이',
      description: '카카오톡으로 간편결제',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'bg-yellow-500',
      available: true
    }
  ];

  const handlePayment = async (method: string) => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "결제를 위해 로그인이 필요합니다.",
        variant: "destructive"
      });
      setLocation('/login');
      return;
    }

    if (!orderId || !amount) {
      toast({
        title: "결제 정보 오류",
        description: "주문 정보를 확인할 수 없습니다.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (method === 'toss') {
        await handleTossPayment();
      } else if (method === 'kakao') {
        await handleKakaoPayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "결제 오류",
        description: "결제 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTossPayment = async () => {
    // Load Toss Payments SDK
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.onload = () => {
      const tossPayments = (window as any).TossPayments(
        process.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'
      );

      tossPayments.requestPayment('카드', {
        amount: amount,
        orderId: `order_${orderId}_${Date.now()}`,
        orderName: orderName,
        customerName: user?.username || '고객',
        successUrl: `${window.location.origin}/payment-success?toss=1&orderId=${orderId}`,
        failUrl: `${window.location.origin}/payment-failed?toss=1&orderId=${orderId}`,
      });
    };
    document.head.appendChild(script);
  };

  const handleKakaoPayment = async () => {
    try {
      const response = await fetch('/api/kakao/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          userId: user?.id || 1,
          itemName: orderName,
          totalAmount: amount,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('카카오페이 결제 요청 실패');
      }

      const data = await response.json();
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('리디렉션 URL을 받지 못했습니다');
      }
    } catch (error) {
      console.error('KakaoPay error:', error);
      toast({
        title: "카카오페이 오류",
        description: "카카오페이 결제를 시작할 수 없습니다.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/checkout')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            결제 방법 선택
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              결제 방법을 선택해주세요
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              안전하고 편리한 결제 서비스를 제공합니다
            </p>
          </div>
        </div>

        {/* Payment Info */}
        <Card className="mb-8 bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">결제 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">주문번호:</span>
                <span className="font-medium text-gray-900 dark:text-white">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">상품명:</span>
                <span className="font-medium text-gray-900 dark:text-white">{orderName}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">결제 금액:</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {amount.toLocaleString()}원
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card 
              key={method.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700 ${
                !method.available ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => method.available && !isProcessing && handlePayment(method.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${method.color} text-white`}>
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {method.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.available ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        사용 가능
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-400 border-gray-400">
                        준비 중
                      </Badge>
                    )}
                    <Shield className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <Shield className="w-5 h-5" />
              <span className="font-medium">안전한 결제 시스템</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              SSL 암호화 및 PCI DSS 인증을 통해 안전한 결제를 보장합니다.
            </p>
          </CardContent>
        </Card>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#1e2b3c] p-8 rounded-lg shadow-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  결제 처리 중...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  잠시만 기다려주세요. 결제 페이지로 이동합니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSelect;