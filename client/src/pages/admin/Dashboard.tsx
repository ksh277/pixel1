import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Product, InsertProduct } from "@shared/schema";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"products" | "reviews" | "users">(
    "products",
  );
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    basePrice: "",
  });
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    if (localStorage.getItem("adminAuth") !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const createProduct = useMutation({
    mutationFn: async (data: InsertProduct) => {
      await apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setForm({ name: "", description: "", imageUrl: "", basePrice: "" });
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
      await apiRequest("PATCH", `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditing(null);
      setForm({ name: "", description: "", imageUrl: "", basePrice: "" });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      basePrice: parseFloat(form.basePrice),
      categoryId: 1,
      nameKo: form.name,
      descriptionKo: form.description,
      imageUrl: form.imageUrl,
    } as InsertProduct;
    if (editing) {
      updateProduct.mutate({ id: editing.id, data });
    } else {
      createProduct.mutate(data);
    }
  };

  const toggleHot = (p: Product) => {
    updateProduct.mutate({ id: p.id, data: { isFeatured: !p.isFeatured } });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-4">
        <Button
          variant={activeTab === "products" ? undefined : "outline"}
          onClick={() => setActiveTab("products")}
        >
          상품 관리
        </Button>
        <Button
          variant={activeTab === "reviews" ? undefined : "outline"}
          onClick={() => setActiveTab("reviews")}
        >
          리뷰 관리
        </Button>
        <Button
          variant={activeTab === "users" ? undefined : "outline"}
          onClick={() => setActiveTab("users")}
        >
          사용자 관리
        </Button>
      </div>

      {activeTab === "products" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editing ? "상품 수정" : "상품 추가"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">가격</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.basePrice}
                    onChange={(e) =>
                      setForm({ ...form, basePrice: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="desc">설명</Label>
                  <Input
                    id="desc"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="img">이미지 URL</Label>
                  <Input
                    id="img"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  {editing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditing(null);
                        setForm({
                          name: "",
                          description: "",
                          imageUrl: "",
                          basePrice: "",
                        });
                      }}
                    >
                      취소
                    </Button>
                  )}
                  <Button type="submit">{editing ? "수정" : "추가"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>상품 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.isArray(products) &&
                  products.map((p: Product) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between border p-2 rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-gray-500">
                          ₩{parseInt(p.basePrice).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(p)}
                        >
                          수정
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleHot(p)}
                        >
                          {p.isFeatured ? "HOT 해제" : "HOT 설정"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProduct.mutate(p.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "reviews" && (
        <Card>
          <CardHeader>
            <CardTitle>리뷰 관리 (Mock)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              리뷰 관리 기능은 샘플 데이터로 표시됩니다.
            </p>
          </CardContent>
        </Card>
      )}

      {activeTab === "users" && (
        <Card>
          <CardHeader>
            <CardTitle>사용자 관리 (Mock)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              사용자 목록 조회 기능은 샘플 데이터로 표시됩니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
