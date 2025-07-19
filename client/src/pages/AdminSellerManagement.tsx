import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Store, 
  CheckCircle,
  XCircle,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";

interface Seller {
  id: number;
  user_id: number;
  shop_name: string;
  business_number: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  description: string;
  is_approved: boolean;
  status: string;
  approved_at?: string;
  created_at: string;
  users?: {
    id: number;
    username: string;
    email: string;
    created_at: string;
  };
}

export default function AdminSellerManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch all sellers for admin
  const { data: sellers, isLoading } = useQuery({
    queryKey: ["/api/admin/sellers"],
    queryFn: async () => {
      const response = await fetch("/api/admin/sellers", {
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to fetch sellers");
      return response.json();
    }
  });

  // Seller approval mutation
  const approveSellerMutation = useMutation({
    mutationFn: async ({ sellerId, approved }: { sellerId: number; approved: boolean }) => {
      const response = await fetch(`/api/admin/sellers/${sellerId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ approved })
      });
      if (!response.ok) throw new Error("Failed to update approval status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers"] });
      toast({
        title: "판매자 승인 상태 변경",
        description: "판매자 승인 상태가 성공적으로 변경되었습니다.",
      });
    }
  });

  const filteredSellers = sellers?.filter((seller: Seller) => {
    const matchesSearch = seller.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.users?.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "approved") return matchesSearch && seller.is_approved;
    if (filterStatus === "pending") return matchesSearch && !seller.is_approved;
    
    return matchesSearch;
  });

  const getStatusBadge = (seller: Seller) => {
    if (!seller.is_approved) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">승인대기</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">승인완료</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">판매자 관리</h1>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="상점명, 이메일, 아이디로 검색..."
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredSellers?.map((seller: Seller) => (
            <Card key={seller.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Store className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{seller.shop_name}</CardTitle>
                      <p className="text-sm text-gray-500">@{seller.users?.username}</p>
                    </div>
                  </div>
                  {getStatusBadge(seller)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{seller.contact_email}</span>
                  </div>
                  
                  {seller.contact_phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{seller.contact_phone}</span>
                    </div>
                  )}
                  
                  {seller.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{seller.address}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>가입: {formatDate(seller.created_at)}</span>
                  </div>
                  
                  {seller.approved_at && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>승인: {formatDate(seller.approved_at)}</span>
                    </div>
                  )}
                </div>

                {seller.description && (
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-sm text-gray-600 line-clamp-2">{seller.description}</p>
                  </div>
                )}

                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500">사업자등록번호</p>
                  <p className="text-sm font-mono">{seller.business_number}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  {!seller.is_approved ? (
                    <Button 
                      size="sm" 
                      onClick={() => approveSellerMutation.mutate({ sellerId: seller.id, approved: true })}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      승인
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => approveSellerMutation.mutate({ sellerId: seller.id, approved: false })}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      승인취소
                    </Button>
                  )}

                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`mailto:${seller.contact_email}`, '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    연락하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredSellers?.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">조건에 맞는 판매자가 없습니다.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}