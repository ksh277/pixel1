import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Package, Users, ShoppingCart, TrendingUp, Plus, Edit, Trash2, Settings } from "lucide-react";
import type { Product, Category, InsertProduct } from "@shared/schema";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    nameKo: "",
    description: "",
    descriptionKo: "",
    imageUrl: "",
    basePrice: "",
    categoryId: "",
    isFeatured: false,
  });
  const [editing, setEditing] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, [navigate]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch("/api/admin/status");
      const data = await response.json();
      if (!data.isAdmin) {
        navigate("/admin/login");
      }
    } catch (err) {
      navigate("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      localStorage.removeItem("adminAuth");
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
    enabled: !isLoading,
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    enabled: !isLoading,
  });

  const createProduct = useMutation({
    mutationFn: async (data: InsertProduct) => {
      return await apiRequest("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      resetForm();
      setIsDialogOpen(false);
      toast({
        title: "상품 추가 완료",
        description: "새로운 상품이 성공적으로 추가되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "상품 추가 실패",
        description: error.message || "상품 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<InsertProduct>;
    }) => {
      return await apiRequest(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditing(null);
      resetForm();
      setIsDialogOpen(false);
      toast({
        title: "상품 수정 완료",
        description: "상품 정보가 성공적으로 수정되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "상품 수정 실패",
        description: error.message || "상품 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/products/${id}`, {
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
        description: error.message || "상품 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setForm({
      name: "",
      nameKo: "",
      description: "",
      descriptionKo: "",
      imageUrl: "",
      basePrice: "",
      categoryId: "",
      isFeatured: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      basePrice: parseFloat(form.basePrice),
      categoryId: parseInt(form.categoryId),
    } as InsertProduct;
    
    if (editing) {
      updateProduct.mutate({ id: editing.id, data });
    } else {
      createProduct.mutate(data);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      nameKo: product.nameKo || "",
      description: product.description || "",
      descriptionKo: product.descriptionKo || "",
      imageUrl: product.imageUrl,
      basePrice: product.basePrice.toString(),
      categoryId: product.categoryId.toString(),
      isFeatured: product.isFeatured || false,
    });
    setIsDialogOpen(true);
  };

  const toggleHot = (p: Product) => {
    updateProduct.mutate({ id: p.id, data: { isFeatured: !p.isFeatured } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600">pixelgoods 관리 시스템</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                관리자
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
              <div className="text-2xl font-bold">{products?.length || 0}</div>
              <p className="text-xs text-muted-foreground">등록된 상품</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 회원</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">가입 회원</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 주문</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,456</div>
              <p className="text-xs text-muted-foreground">처리된 주문</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 매출</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩45,231,000</div>
              <p className="text-xs text-muted-foreground">이번 달 매출</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">상품 관리</TabsTrigger>
            <TabsTrigger value="reviews">리뷰 관리</TabsTrigger>
            <TabsTrigger value="users">사용자 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">상품 관리</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditing(null); resetForm(); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    상품 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editing ? "상품 수정" : "상품 추가"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">상품명 (영어)</Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Acrylic Keychain"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nameKo">상품명 (한국어)</Label>
                        <Input
                          id="nameKo"
                          value={form.nameKo}
                          onChange={(e) => setForm({ ...form, nameKo: e.target.value })}
                          placeholder="아크릴 키링"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">설명 (영어)</Label>
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Product description..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="descriptionKo">설명 (한국어)</Label>
                      <Textarea
                        id="descriptionKo"
                        value={form.descriptionKo}
                        onChange={(e) => setForm({ ...form, descriptionKo: e.target.value })}
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
                          value={form.basePrice}
                          onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                          placeholder="8900"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryId">카테고리</Label>
                        <Select
                          value={form.categoryId}
                          onValueChange={(value) => setForm({ ...form, categoryId: value })}
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
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        placeholder="/api/placeholder/300/300"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={form.isFeatured}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="isFeatured">인기 상품으로 설정</Label>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        취소
                      </Button>
                      <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                        {createProduct.isPending || updateProduct.isPending ? "저장 중..." : "저장"}
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-500">상품을 불러오는 중...</p>
                    </div>
                  ) : products?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">등록된 상품이 없습니다.</p>
                    </div>
                  ) : (
                    products?.map((product: Product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{product.nameKo || product.name}</h3>
                            <p className="text-sm text-gray-500">
                              ₩{parseInt(product.basePrice.toString()).toLocaleString()}
                            </p>
                            {product.isFeatured && (
                              <Badge variant="secondary" className="mt-1">
                                인기 상품
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            수정
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleHot(product)}
                          >
                            {product.isFeatured ? "HOT 해제" : "HOT 설정"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteProduct.mutate(product.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            삭제
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>리뷰 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock review data */}
                  {[
                    {
                      id: 1,
                      user: "사용자123",
                      product: "아크릴 키링",
                      rating: 5,
                      comment: "정말 만족합니다! 품질이 좋아요.",
                      date: "2024-01-15"
                    },
                    {
                      id: 2,
                      user: "고객456",
                      product: "스탠드 키링",
                      rating: 4,
                      comment: "배송이 빨랐습니다. 잘 받았어요.",
                      date: "2024-01-14"
                    },
                    {
                      id: 3,
                      user: "리뷰어789",
                      product: "투명 키링",
                      rating: 3,
                      comment: "보통이에요. 괜찮은 것 같아요.",
                      date: "2024-01-13"
                    }
                  ].map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">{review.user}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {review.product}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            ⭐ {review.rating}
                          </Badge>
                          <Button variant="destructive" size="sm">
                            삭제
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>사용자 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock user data */}
                  {[
                    {
                      id: 1,
                      username: "user123",
                      email: "user123@example.com",
                      joinDate: "2024-01-01",
                      orders: 5
                    },
                    {
                      id: 2,
                      username: "customer456",
                      email: "customer456@example.com",
                      joinDate: "2024-01-05",
                      orders: 2
                    },
                    {
                      id: 3,
                      username: "buyer789",
                      email: "buyer789@example.com",
                      joinDate: "2024-01-10",
                      orders: 8
                    }
                  ].map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{user.username}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">
                            가입일: {user.joinDate} | 주문: {user.orders}회
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            관리자 권한
                          </Button>
                          <Button variant="destructive" size="sm">
                            정지
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
