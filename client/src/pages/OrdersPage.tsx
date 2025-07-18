import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { Link } from 'wouter';
import { isSupabaseConfigured } from '@/lib/supabase';

const OrdersPage = () => {
  const { user } = useAuth();
  const { orders, isLoading, error } = useOrders();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '주문 접수';
      case 'processing':
        return '제작 중';
      case 'completed':
        return '주문 완료';
      case 'cancelled':
        return '주문 취소';
      default:
        return '주문 접수';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600';
      case 'processing':
        return 'bg-blue-600';
      case 'completed':
        return 'bg-green-600';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  // Show message if Supabase is not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-[#1e2b3c] border-gray-700">
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold mb-4 text-white">
                  주문 기능을 사용하려면 Supabase 설정이 필요합니다
                </h2>
                <p className="text-gray-400 mb-6">
                  .env 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정해주세요.
                </p>
                <Link href="/">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    홈으로 돌아가기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-[#1e2b3c] border-gray-700">
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold mb-4 text-white">
                  로그인이 필요합니다
                </h2>
                <p className="text-gray-400 mb-6">
                  주문 내역을 확인하려면 로그인이 필요합니다.
                </p>
                <Link href="/auth">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    로그인하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">주문 내역</h1>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-[#1e2b3c] border-gray-700">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-600 rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-600 rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-[#1e2b3c] border-gray-700">
              <CardContent className="p-8 text-center">
                <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <h2 className="text-2xl font-bold mb-4 text-white">
                  오류가 발생했습니다
                </h2>
                <p className="text-gray-400 mb-6">
                  주문 내역을 불러오는 중 오류가 발생했습니다.
                </p>
                <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                  다시 시도
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">주문 내역</h1>
              <p className="text-gray-400 mt-2">
                총 {orders.length}개의 주문이 있습니다
              </p>
            </div>
            <Link href="/cart">
              <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                장바구니로 가기
              </Button>
            </Link>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <Card className="bg-[#1e2b3c] border-gray-700">
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold mb-4 text-white">
                  주문 내역이 없습니다
                </h2>
                <p className="text-gray-400 mb-6">
                  아직 주문한 상품이 없습니다. 상품을 주문해보세요!
                </p>
                <Link href="/products">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    상품 둘러보기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="bg-[#1e2b3c] border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <CardTitle className="text-white">
                            주문번호: {order.id}
                          </CardTitle>
                          <p className="text-gray-400 text-sm">
                            {new Date(order.created_at).toLocaleString('ko-KR')}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="text-white font-semibold mb-2">주문 상품</h4>
                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                              <div className="flex-1">
                                <p className="text-white font-medium">
                                  {item.product_name || 'Unknown Product'}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  수량: {item.quantity}개
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-semibold">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-gray-600" />

                      {/* Order Summary */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400">총 주문 금액</p>
                          <p className="text-2xl font-bold text-white">
                            {formatPrice(order.total_price)}
                          </p>
                        </div>
                        <div className="flex space-x-3">
                          <Button variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-700">
                            <Eye className="w-4 h-4 mr-2" />
                            상세보기
                          </Button>
                          {order.status === 'pending' && (
                            <Button variant="outline" size="sm" className="text-red-400 border-red-400 hover:bg-red-900/20">
                              주문 취소
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;