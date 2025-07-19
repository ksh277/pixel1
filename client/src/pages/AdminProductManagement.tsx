import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  name_ko: string;
  description?: string;
  description_ko?: string;
  base_price: number;
  category_id: number;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
  is_approved: boolean;
  stock: number;
  seller_id?: number;
  created_at: string;
  categories?: {
    id: number;
    name: string;
    name_ko: string;
  };
  sellers?: {
    id: number;
    shop_name: string;
  };
}

export default function AdminProductManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all products for admin
  const { data: products, isLoading } = useQuery({
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
    queryKey: ["/api/categories"]
  });

  // Product approval mutation
  const approveProductMutation = useMutation({
    mutationFn: async ({ productId, approved }: { productId: number; approved: boolean }) => {
      const response = await fetch(`/api/admin/products/${productId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ approved })
      });
      if (!response.ok) throw new Error("Failed to update approval status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "상품 승인 상태 변경",
        description: "상품 승인 상태가 성공적으로 변경되었습니다.",
      });
    }
  });

  // Product status toggle mutation
  const toggleProductMutation = useMutation({
    mutationFn: async ({ productId, isActive }: { productId: number; isActive: boolean }) => {
      const response = await fetch(`/api/admin/products/${productId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ is_active: isActive })
      });
      if (!response.ok) throw new Error("Failed to update product status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "상품 상태 변경",
        description: "상품 상태가 성공적으로 변경되었습니다.",
      });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({
        title: "상품 삭제",
        description: "상품이 성공적으로 삭제되었습니다.",
      });
    }
  });

  const filteredProducts = products?.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.name_ko.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "approved") return matchesSearch && product.is_approved;
    if (filterStatus === "pending") return matchesSearch && !product.is_approved;
    if (filterStatus === "active") return matchesSearch && product.is_active;
    if (filterStatus === "inactive") return matchesSearch && !product.is_active;
    
    return matchesSearch;
  });

  const getStatusBadge = (product: Product) => {
    if (!product.is_active) {
      return <Badge variant="secondary">비활성</Badge>;
    }
    if (!product.is_approved) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">승인대기</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">승인완료</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">상품 관리</h1>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="상품명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="approved">승인완료</SelectItem>
                <SelectItem value="pending">승인대기</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredProducts?.map((product: Product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(product)}
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{product.name_ko}</h3>
                  <p className="text-sm text-gray-600">{product.name}</p>
                  <p className="text-lg font-bold text-blue-600">
                    ₩{product.base_price.toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>재고: {product.stock}개</span>
                  {product.sellers && (
                    <span>판매자: {product.sellers.shop_name}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {!product.is_approved ? (
                    <Button 
                      size="sm" 
                      onClick={() => approveProductMutation.mutate({ productId: product.id, approved: true })}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      승인
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => approveProductMutation.mutate({ productId: product.id, approved: false })}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      승인취소
                    </Button>
                  )}

                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleProductMutation.mutate({ 
                      productId: product.id, 
                      isActive: !product.is_active 
                    })}
                  >
                    {product.is_active ? "비활성화" : "활성화"}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    수정
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>상품 삭제</AlertDialogTitle>
                        <AlertDialogDescription>
                          정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteProductMutation.mutate(product.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          삭제
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredProducts?.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">조건에 맞는 상품이 없습니다.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}