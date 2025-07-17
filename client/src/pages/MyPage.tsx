import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  CreditCard,
  Eye,
  Star,
  LogOut,
  Edit3
} from "lucide-react";
import { BelugaMascot } from "@/components/BelugaMascot";

interface OrderHistory {
  id: string;
  orderDate: string;
  status: string;
  items: any[];
  total: number;
  trackingNumber?: string;
}

export default function MyPage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    // Load order history from localStorage
    const savedOrders = localStorage.getItem('orderHistory');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading order history:', error);
      }
    } else {
      // Initialize with sample order history
      const sampleOrders = [
        {
          id: "202501120001",
          orderDate: "2025-01-10T14:30:00.000Z",
          status: "delivered",
          items: [
            {
              id: 1,
              nameKo: "아크릴 키링",
              price: 8900,
              quantity: 2,
              image: "/api/placeholder/100/100"
            }
          ],
          total: 20800,
          trackingNumber: "CJ1234567890"
        },
        {
          id: "202501110001",
          orderDate: "2025-01-08T09:15:00.000Z",
          status: "shipping",
          items: [
            {
              id: 2,
              nameKo: "커스텀 스티커",
              price: 5500,
              quantity: 3,
              image: "/api/placeholder/100/100"
            }
          ],
          total: 19500,
          trackingNumber: "CJ0987654321"
        },
        {
          id: "202501100001",
          orderDate: "2025-01-05T16:45:00.000Z",
          status: "processing",
          items: [
            {
              id: 3,
              nameKo: "아크릴 스탠드",
              price: 15000,
              quantity: 1,
              image: "/api/placeholder/100/100"
            }
          ],
          total: 18000
        }
      ];
      setOrders(sampleOrders);
      localStorage.setItem('orderHistory', JSON.stringify(sampleOrders));
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
            {t({ ko: "제작중", en: "Processing" })}
          </Badge>
        );
      case 'shipping':
        return (
          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            {t({ ko: "배송중", en: "Shipping" })}
          </Badge>
        );
      case 'delivered':
        return (
          <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            {t({ ko: "배송완료", en: "Delivered" })}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            {t({ ko: "취소됨", en: "Cancelled" })}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t({ ko: "로그인이 필요합니다", en: "Login Required" })}
            </h2>
            <Link href="/login">
              <Button className="px-8 py-3">
                {t({ ko: "로그인", en: "Login" })}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* User Profile Header */}
        <Card className="mb-8 bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{user.email}</p>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {t({ ko: "일반 회원", en: "Regular Member" })}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t({ ko: "회원 가입일", en: "Member since" })}: {formatDate(user.joinDate || "2025-01-01")}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  <Edit3 className="h-4 w-4 mr-1" />
                  {t({ ko: "프로필 수정", en: "Edit Profile" })}
                </Button>
                <Button variant="outline" size="sm" onClick={logout} className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                  <LogOut className="h-4 w-4 mr-1" />
                  {t({ ko: "로그아웃", en: "Logout" })}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t({ ko: "총 주문", en: "Total Orders" })}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500 dark:text-red-400" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{favorites.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t({ ko: "찜한 상품", en: "Favorites" })}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="mb-2">
                <BelugaMascot variant="mypage" className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t({ ko: "적립 포인트", en: "Points" })}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 text-center">
              <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₩{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t({ ko: "총 구매액", en: "Total Spent" })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
            <TabsTrigger value="orders" className="flex items-center text-gray-700 dark:text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              {t({ ko: "주문내역", en: "Orders" })}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center text-gray-700 dark:text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Heart className="h-4 w-4 mr-2" />
              {t({ ko: "찜한상품", en: "Favorites" })}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center text-gray-700 dark:text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Star className="h-4 w-4 mr-2" />
              {t({ ko: "리뷰관리", en: "Reviews" })}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center text-gray-700 dark:text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              {t({ ko: "설정", en: "Settings" })}
            </TabsTrigger>
          </TabsList>

          {/* Order History Tab */}
          <TabsContent value="orders">
            <Card className="bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Package className="h-5 w-5 mr-2" />
                  {t({ ko: "주문 내역", en: "Order History" })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t({ ko: "주문 내역이 없습니다", en: "No Orders Yet" })}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {t({ ko: "첫 번째 주문을 해보세요!", en: "Place your first order!" })}
                    </p>
                    <Link href="/products">
                      <Button>
                        {t({ ko: "쇼핑하기", en: "Start Shopping" })}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-[#1e2b3c]">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {t({ ko: "주문번호", en: "Order" })} #{order.id}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(order.orderDate)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(order.status)}
                            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                              ₩{order.total.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              <img
                                src={item.image}
                                alt={item.nameKo}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white">{item.nameKo}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  ₩{item.price.toLocaleString()} × {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.trackingNumber && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {t({ ko: "송장번호", en: "Tracking Number" })}: {order.trackingNumber}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
                          <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                            <Eye className="h-4 w-4 mr-1" />
                            {t({ ko: "주문 상세", en: "View Details" })}
                          </Button>
                          {order.status === "delivered" && (
                            <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                              <Star className="h-4 w-4 mr-1" />
                              {t({ ko: "리뷰 작성", en: "Write Review" })}
                            </Button>
                          )}
                          {(order.status === "processing" || order.status === "shipping") && (
                            <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                              <MapPin className="h-4 w-4 mr-1" />
                              {t({ ko: "배송 조회", en: "Track Order" })}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card className="bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Heart className="h-5 w-5 mr-2" />
                  {t({ ko: "찜한 상품", en: "Favorite Products" })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t({ ko: "찜한 상품이 없습니다", en: "No Favorites Yet" })}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {t({ ko: "마음에 드는 상품을 찜해보세요!", en: "Save products you love!" })}
                    </p>
                    <Link href="/products">
                      <Button>
                        {t({ ko: "상품 둘러보기", en: "Browse Products" })}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((product) => (
                      <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#1e2b3c]">
                        <img
                          src={product.image}
                          alt={product.nameKo}
                          className="w-full h-48 object-cover rounded mb-4"
                        />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{product.nameKo}</h3>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                          ₩{product.price.toLocaleString()}
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            {t({ ko: "장바구니", en: "Add to Cart" })}
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Star className="h-5 w-5 mr-2" />
                  {t({ ko: "내 리뷰", en: "My Reviews" })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t({ ko: "작성한 리뷰가 없습니다", en: "No Reviews Yet" })}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t({ ko: "구매한 상품에 대한 리뷰를 작성해보세요!", en: "Write reviews for your purchased products!" })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Settings className="h-5 w-5 mr-2" />
                  {t({ ko: "계정 설정", en: "Account Settings" })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t({ ko: "개인정보", en: "Personal Information" })}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1e2b3c]">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {t({ ko: "이름", en: "Name" })}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">{user.name}</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        {t({ ko: "수정", en: "Edit" })}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1e2b3c]">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {t({ ko: "이메일", en: "Email" })}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        {t({ ko: "수정", en: "Edit" })}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1e2b3c]">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {t({ ko: "비밀번호", en: "Password" })}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">••••••••</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        {t({ ko: "변경", en: "Change" })}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t({ ko: "알림 설정", en: "Notification Settings" })}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1e2b3c]">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {t({ ko: "이메일 알림", en: "Email Notifications" })}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t({ ko: "주문 상태 및 프로모션 정보", en: "Order updates and promotions" })}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        {t({ ko: "설정", en: "Configure" })}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200 dark:bg-gray-700" />

                <div>
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                    {t({ ko: "계정 관리", en: "Account Management" })}
                  </h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full text-red-600 dark:text-red-400 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      {t({ ko: "계정 탈퇴", en: "Delete Account" })}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}