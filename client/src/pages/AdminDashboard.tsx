import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, Category, InsertProduct } from "@shared/schema";
import { 
  Package, 
  Users, 
  User,
  ShoppingCart, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  ArrowUpDown,
  Settings,
  FileText,
  DollarSign,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Search
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form states
  const [productFormData, setProductFormData] = useState({
    name: "",
    nameKo: "",
    description: "",
    descriptionKo: "",
    basePrice: "",
    categoryId: "",
    imageUrl: "",
    isFeatured: false
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  // Data fetching
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/admin/products"],
    queryFn: async () => {
      const response = await fetch("/api/admin/products", {
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    }
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats", {
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    }
  });

  const { data: sellers } = useQuery({
    queryKey: ["/api/admin/sellers"],
    queryFn: async () => {
      const response = await fetch("/api/admin/sellers", {
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to fetch sellers");
      return response.json();
    }
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (productData: InsertProduct) => {
      await apiRequest("/api/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "상품 추가 완료",
        description: "새로운 상품이 성공적으로 추가되었습니다.",
      });
      setIsProductDialogOpen(false);
      resetProductForm();
    },
    onError: (error) => {
      toast({
        title: "상품 추가 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProduct> }) => {
      await apiRequest(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "상품 수정 완료",
        description: "상품 정보가 성공적으로 수정되었습니다.",
      });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      resetProductForm();
    },
    onError: (error) => {
      toast({
        title: "상품 수정 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/products/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "상품 삭제 완료",
        description: "상품이 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "상품 삭제 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form handlers
  const resetProductForm = () => {
    setProductFormData({
      name: "",
      nameKo: "",
      description: "",
      descriptionKo: "",
      basePrice: "",
      categoryId: "",
      imageUrl: "",
      isFeatured: false
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...productFormData,
      basePrice: parseFloat(productFormData.basePrice),
      categoryId: parseInt(productFormData.categoryId),
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      nameKo: product.nameKo || "",
      description: product.description || "",
      descriptionKo: product.descriptionKo || "",
      basePrice: product.basePrice.toString(),
      categoryId: product.categoryId.toString(),
      imageUrl: product.imageUrl,
      isFeatured: product.isFeatured || false
    });
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      setLocation("/login");
    }
  }, [isAuthenticated, user, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600">픽셀굿즈 관리 시스템</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                {user.firstName} 관리자
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 상품</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% 전월 대비</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 회원</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,945</div>
              <p className="text-xs text-muted-foreground">+5% 전월 대비</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 주문</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,456</div>
              <p className="text-xs text-muted-foreground">+23% 전월 대비</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 매출</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩45,231,000</div>
              <p className="text-xs text-muted-foreground">+18% 전월 대비</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7">
            <TabsTrigger value="products">상품 관리</TabsTrigger>
            <TabsTrigger value="sections">섹션 관리</TabsTrigger>
            <TabsTrigger value="templates">템플릿 관리</TabsTrigger>
            <TabsTrigger value="services">추가서비스</TabsTrigger>
            <TabsTrigger value="users">회원 관리</TabsTrigger>
            <TabsTrigger value="orders">주문 관리</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">상품 관리</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingProduct(null); resetProductForm(); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    상품 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? "상품 수정" : "상품 추가"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">상품명 (영어)</Label>
                        <Input
                          id="name"
                          value={productFormData.name}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Acrylic Keychain"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nameKo">상품명 (한국어)</Label>
                        <Input
                          id="nameKo"
                          value={productFormData.nameKo}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, nameKo: e.target.value }))}
                          placeholder="아크릴 키링"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">설명 (영어)</Label>
                      <Textarea
                        id="description"
                        value={productFormData.description}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Product description..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="descriptionKo">설명 (한국어)</Label>
                      <Textarea
                        id="descriptionKo"
                        value={productFormData.descriptionKo}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, descriptionKo: e.target.value }))}
                        placeholder="상품 설명..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="basePrice">가격 (₩)</Label>
                        <Input
                          id="basePrice"
                          type="number"
                          value={productFormData.basePrice}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, basePrice: e.target.value }))}
                          placeholder="8900"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryId">카테고리</Label>
                        <Select
                          value={productFormData.categoryId}
                          onValueChange={(value) => setProductFormData(prev => ({ ...prev, categoryId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((category: Category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.nameKo || category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="imageUrl">이미지 URL</Label>
                      <Input
                        id="imageUrl"
                        value={productFormData.imageUrl}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="/api/placeholder/300/300"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={productFormData.isFeatured}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="isFeatured">인기 상품으로 설정</Label>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                        취소
                      </Button>
                      <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                        {createProductMutation.isPending || updateProductMutation.isPending ? "저장 중..." : "저장"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>상품 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {productsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">상품을 불러오는 중...</p>
                    </div>
                  ) : products?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">등록된 상품이 없습니다.</p>
                    </div>
                  ) : (
                    products?.map((product: Product) => (
                      <div key={product.id} className="admin-product-card">
                        <div className="admin-product-info">
                          <div className="admin-product-image">
                            <img 
                              src={product.imageUrl} 
                              alt={product.nameKo || product.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/api/placeholder/300/300";
                              }}
                            />
                          </div>
                          <div className="admin-product-details">
                            <h3 className="font-medium text-gray-900 truncate">
                              {product.nameKo || product.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">
                              ₩{parseInt(product.basePrice).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              카테고리: {categories?.find(c => c.id === product.categoryId)?.nameKo || '미분류'}
                            </p>
                            {product.isFeatured && (
                              <Badge variant="secondary" className="mt-1">인기 상품</Badge>
                            )}
                          </div>
                        </div>
                        <div className="admin-product-actions">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            <ArrowUpDown className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>상품을 삭제하시겠습니까?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  "{product.nameKo || product.name}" 상품을 삭제하면 복구할 수 없습니다. 정말로 삭제하시겠습니까?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  삭제
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">섹션 관리</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                섹션 추가
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>홈페이지 섹션 구성</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                    <div>
                      <h3 className="font-medium">🔥 인기상품</h3>
                      <p className="text-sm text-gray-600">4열 상품 그리드</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">🧡 따끈따끈한 신상품</h3>
                      <p className="text-sm text-gray-600">최신 제품 4열 그리드</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">🤗 창작자들의 소중한 리뷰</h3>
                      <p className="text-sm text-gray-600">고객 리뷰 및 평점</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">회원 관리</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                회원 추가
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>회원 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">admin</h3>
                        <p className="text-sm text-gray-600">관리자</p>
                        <p className="text-sm text-gray-500">admin@allthatprinting.com</p>
                        <p className="text-sm text-green-600">포인트: 50,000P | 주문: 50건</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">관리자</Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">superadmin</h3>
                        <p className="text-sm text-gray-600">슈퍼관리자</p>
                        <p className="text-sm text-gray-500">superadmin@pixelgoods.com</p>
                        <p className="text-sm text-green-600">포인트: 100,000P | 주문: 100건</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">슈퍼관리자</Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">user1</h3>
                        <p className="text-sm text-gray-600">일반회원</p>
                        <p className="text-sm text-gray-500">user1@example.com</p>
                        <p className="text-sm text-green-600">포인트: 5,000P | 주문: 10건</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">일반회원</Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">ham5752</h3>
                        <p className="text-sm text-gray-600">김승환</p>
                        <p className="text-sm text-gray-500">ham5752@example.com</p>
                        <p className="text-sm text-green-600">포인트: 2,000P | 주문: 0건 | 평생회원</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">평생회원</Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">주문 관리</h2>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>최근 주문</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">주문 #2025-001</h3>
                      <p className="text-sm text-gray-600">아크릴 키링 × 2</p>
                      <p className="text-sm text-gray-500">2025-01-13 10:30</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₩17,800</p>
                      <Badge variant="outline">처리중</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">템플릿 관리</h2>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  카테고리 관리
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  템플릿 추가
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">기본 템플릿</p>
                      <p className="text-2xl font-bold text-blue-600">7개</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">렌티큘러 템플릿</p>
                      <p className="text-2xl font-bold text-purple-600">3개</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">일반 템플릿</p>
                      <p className="text-2xl font-bold text-green-600">5개</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">총 다운로드</p>
                      <p className="text-2xl font-bold text-orange-600">7,234</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 렌야드 스트랩 키링 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">렌야드 스트랩 키링</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500">템플릿 이미지</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>크기: 50×50mm</p>
                      <p>다운로드: 1,247회</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        AI (2.4MB)
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        PSD (8.1MB)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 렌티큘러 스탠드 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">렌티큘러 스탠드</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500">템플릿 이미지</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>크기: 70×140mm</p>
                      <p>다운로드: 934회</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        AI (3.2MB)
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        PSD (9.7MB)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 스마트톡 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">스마트톡</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500">템플릿 이미지</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>크기: 40×40mm</p>
                      <p>다운로드: 1,567회</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        AI (1.8MB)
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        PSD (6.3MB)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 코롯토 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">코롯토</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500">템플릿 이미지</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>크기: 60×80mm</p>
                      <p>다운로드: 756회</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        AI (2.1MB)
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        PSD (7.8MB)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 포카홀더 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">포카홀더</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500">템플릿 이미지</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>크기: 55×85mm</p>
                      <p>다운로드: 1,023회</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        AI (2.7MB)
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        PSD (8.9MB)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 자석/문구류 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">자석/문구류</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-500">템플릿 이미지</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>크기: 50×50mm</p>
                      <p>다운로드: 634회</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        AI (1.9MB)
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        PSD (5.2MB)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">추가서비스 관리</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                서비스 추가
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>추가결제 서비스 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">기본 도안작업</h3>
                        <p className="text-sm text-gray-600">₩3,000</p>
                        <p className="text-sm text-gray-500">24시간 내 완성</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">프리미엄 도안작업</h3>
                        <p className="text-sm text-gray-600">₩5,000</p>
                        <p className="text-sm text-gray-500">12시간 내 완성</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">디럭스 도안작업</h3>
                        <p className="text-sm text-gray-600">₩7,000</p>
                        <p className="text-sm text-gray-500">6시간 내 완성</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">퀵비 서비스</h3>
                        <p className="text-sm text-gray-600">₩10,000</p>
                        <p className="text-sm text-gray-500">2시간 내 완성</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">급한작업 서비스</h3>
                        <p className="text-sm text-gray-600">₩15,000</p>
                        <p className="text-sm text-gray-500">1시간 내 완성</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">설정</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    404 페이지 설정
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    사용자가 존재하지 않는 페이지에 접근할 때 표시될 메시지를 설정합니다.
                  </p>
                  <Button variant="outline" className="w-full">
                    404 페이지 편집
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    추가결제 메뉴
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    도안작업, 퀵서비스 등 추가결제 항목을 관리합니다.
                  </p>
                  <Button variant="outline" className="w-full">
                    추가결제 메뉴 관리
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    커뮤니티 메뉴
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    커뮤니티 메뉴 항목을 관리합니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">이벤트 (구: 행사/공모전)</span>
                      <Badge variant="outline" className="text-green-600 bg-green-50">NEW</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">자료실 (구: 올댓노트)</span>
                      <Badge variant="outline" className="text-green-600 bg-green-50">NEW</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    템플릿 라이브러리
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    벨루가 굿즈 템플릿을 관리합니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm">기본 템플릿</span>
                      <Badge variant="outline" className="text-blue-600 bg-blue-50">7개</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span className="text-sm">렌티큘러 템플릿</span>
                      <Badge variant="outline" className="text-purple-600 bg-purple-50">3개</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">일반 템플릿</span>
                      <Badge variant="outline" className="text-green-600 bg-green-50">5개</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}