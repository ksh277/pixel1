import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ShoppingCart,
  BarChart3,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  FileText
} from "lucide-react";

interface Seller {
  id: number;
  shopName: string;
  businessNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  bankAccount: string;
  bankName: string;
  isApproved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  basePrice: number;
  categoryId: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  isApproved: boolean;
  approvalDate: string | null;
  createdAt: string;
}

export default function SellerDashboard() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newProduct, setNewProduct] = useState({
    name: '',
    nameKo: '',
    description: '',
    descriptionKo: '',
    basePrice: '',
    categoryId: '',
    imageUrl: '',
    stock: ''
  });

  // Fetch seller info
  const { data: sellerInfo, isLoading: sellerLoading } = useQuery({
    queryKey: ['seller-info'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      return response.json();
    },
    enabled: isAuthenticated
  });

  // Fetch seller products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const response = await fetch('/api/seller/products', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    enabled: isAuthenticated && sellerInfo?.seller
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await fetch('/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
      setNewProduct({
        name: '',
        nameKo: '',
        description: '',
        descriptionKo: '',
        basePrice: '',
        categoryId: '',
        imageUrl: '',
        stock: ''
      });
      toast({
        title: "상품 등록 완료",
        description: "상품이 성공적으로 등록되었습니다. 관리자 승인을 기다려주세요.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "상품 등록 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Seller registration mutation
  const registerSellerMutation = useMutation({
    mutationFn: async (sellerData: any) => {
      const response = await fetch('/api/sellers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(sellerData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-info'] });
      toast({
        title: "판매자 등록 완료",
        description: "판매자 등록이 완료되었습니다. 승인을 기다려주세요.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "판매자 등록 실패",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.nameKo || !newProduct.basePrice || !newProduct.categoryId) {
      toast({
        title: "입력 오류",
        description: "필수 정보를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    addProductMutation.mutate({
      ...newProduct,
      basePrice: parseFloat(newProduct.basePrice),
      categoryId: parseInt(newProduct.categoryId),
      stock: parseInt(newProduct.stock) || 0
    });
  };

  const getStatusBadge = (status: string, isApproved: boolean) => {
    if (isApproved) {
      return <Badge className="bg-green-500">승인완료</Badge>;
    }
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">승인대기</Badge>;
      case 'rejected':
        return <Badge variant="destructive">승인거부</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-4">판매자 대시보드에 접근하려면 로그인해주세요.</p>
            <Link href="/login">
              <Button>로그인하기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sellerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show seller registration form if not registered
  if (!sellerInfo?.seller) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] py-8">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                판매자 등록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shopName">상점명 *</Label>
                  <Input 
                    id="shopName"
                    placeholder="상점명을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="businessNumber">사업자등록번호</Label>
                  <Input 
                    id="businessNumber"
                    placeholder="123-45-67890"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">연락처 이메일 *</Label>
                  <Input 
                    id="contactEmail"
                    type="email"
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">연락처 전화번호 *</Label>
                  <Input 
                    id="contactPhone"
                    placeholder="010-1234-5678"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">주소</Label>
                <Textarea 
                  id="address"
                  placeholder="상세 주소를 입력하세요"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">은행명</Label>
                  <Input 
                    id="bankName"
                    placeholder="국민은행"
                  />
                </div>
                <div>
                  <Label htmlFor="bankAccount">계좌번호</Label>
                  <Input 
                    id="bankAccount"
                    placeholder="123456-78-901234"
                  />
                </div>
              </div>
              <Button 
                onClick={() => {
                  const formData = {
                    shopName: (document.getElementById('shopName') as HTMLInputElement).value,
                    businessNumber: (document.getElementById('businessNumber') as HTMLInputElement).value,
                    contactEmail: (document.getElementById('contactEmail') as HTMLInputElement).value,
                    contactPhone: (document.getElementById('contactPhone') as HTMLInputElement).value,
                    address: (document.getElementById('address') as HTMLTextAreaElement).value,
                    bankName: (document.getElementById('bankName') as HTMLInputElement).value,
                    bankAccount: (document.getElementById('bankAccount') as HTMLInputElement).value,
                  };
                  registerSellerMutation.mutate(formData);
                }}
                disabled={registerSellerMutation.isPending}
                className="w-full"
              >
                {registerSellerMutation.isPending ? '등록 중...' : '판매자 등록하기'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const seller = sellerInfo.seller as Seller;
  const approvedProducts = products.filter((p: Product) => p.isApproved);
  const pendingProducts = products.filter((p: Product) => !p.isApproved);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            판매자 대시보드
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {seller.shopName} • {getStatusBadge(seller.status, seller.isApproved)}
          </p>
        </div>

        {/* Status Alert */}
        {!seller.isApproved && (
          <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-900/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                    판매자 승인 대기 중
                  </h3>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    관리자 승인 후 상품 등록이 가능합니다. 승인까지 1-3일 소요됩니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    총 상품
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {products.length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    승인된 상품
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {approvedProducts.length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    승인 대기
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pendingProducts.length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    총 재고
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {products.reduce((sum: number, p: Product) => sum + p.stock, 0)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">상품 관리</TabsTrigger>
            <TabsTrigger value="add-product">상품 등록</TabsTrigger>
            <TabsTrigger value="profile">판매자 정보</TabsTrigger>
          </TabsList>

          {/* Products Management */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  내 상품 목록
                </CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      등록된 상품이 없습니다
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      첫 번째 상품을 등록해보세요.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product: Product) => (
                      <div key={product.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img 
                            src={product.imageUrl || '/api/placeholder/80/80'} 
                            alt={product.nameKo}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {product.nameKo}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ₩{product.basePrice.toLocaleString()} • 재고 {product.stock}개
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge('pending', product.isApproved)}
                              {product.isActive ? (
                                <Badge variant="outline">활성</Badge>
                              ) : (
                                <Badge variant="secondary">비활성</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Product */}
          <TabsContent value="add-product">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  새 상품 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!seller.isApproved ? (
                  <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      <div>
                        <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                          판매자 승인이 필요합니다
                        </h3>
                        <p className="text-sm text-orange-600 dark:text-orange-300">
                          상품 등록을 위해서는 관리자의 판매자 승인이 필요합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productName">상품명 (영문) *</Label>
                      <Input 
                        id="productName"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Product Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productNameKo">상품명 (한글) *</Label>
                      <Input 
                        id="productNameKo"
                        value={newProduct.nameKo}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, nameKo: e.target.value }))}
                        placeholder="상품명"
                      />
                    </div>
                    <div>
                      <Label htmlFor="basePrice">가격 *</Label>
                      <Input 
                        id="basePrice"
                        type="number"
                        value={newProduct.basePrice}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, basePrice: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">재고 수량 *</Label>
                      <Input 
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">카테고리 *</Label>
                      <Select 
                        value={newProduct.categoryId} 
                        onValueChange={(value) => setNewProduct(prev => ({ ...prev, categoryId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name_ko}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="imageUrl">이미지 URL</Label>
                      <Input 
                        id="imageUrl"
                        value={newProduct.imageUrl}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">설명 (영문)</Label>
                      <Textarea 
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Product description"
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="descriptionKo">설명 (한글)</Label>
                      <Textarea 
                        id="descriptionKo"
                        value={newProduct.descriptionKo}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, descriptionKo: e.target.value }))}
                        placeholder="상품 설명"
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button 
                        onClick={handleAddProduct}
                        disabled={addProductMutation.isPending}
                        className="w-full"
                      >
                        {addProductMutation.isPending ? '등록 중...' : '상품 등록하기'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  판매자 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>상점명</Label>
                    <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {seller.shopName}
                    </p>
                  </div>
                  <div>
                    <Label>사업자등록번호</Label>
                    <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {seller.businessNumber || '미등록'}
                    </p>
                  </div>
                  <div>
                    <Label>연락처 이메일</Label>
                    <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {seller.contactEmail}
                    </p>
                  </div>
                  <div>
                    <Label>연락처 전화번호</Label>
                    <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {seller.contactPhone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <Label>주소</Label>
                    <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {seller.address || '미등록'}
                    </p>
                  </div>
                  <div>
                    <Label>은행명</Label>
                    <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {seller.bankName || '미등록'}
                    </p>
                  </div>
                  <div>
                    <Label>계좌번호</Label>
                    <p className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {seller.bankAccount || '미등록'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="font-semibold">승인 상태</p>
                    <div className="mt-1">
                      {getStatusBadge(seller.status, seller.isApproved)}
                    </div>
                  </div>
                  <Button variant="outline">
                    정보 수정
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}