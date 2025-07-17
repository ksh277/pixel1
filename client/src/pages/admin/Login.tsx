import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, [navigate]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch("/api/admin/status");
      const data = await response.json();
      if (data.isAdmin) {
        navigate("/admin");
      }
    } catch (err) {
      // Not logged in, continue to login form
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("adminAuth", "true");
        toast({
          title: "로그인 성공",
          description: "관리자 대시보드로 이동합니다.",
        });
        navigate("/admin");
      } else {
        setError(data.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d1b2a] p-4">
      <Card className="w-full max-w-md bg-white dark:bg-[#1e2b3c] shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-white dark:bg-[#1e2b3c]">
          <CardTitle className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            관리자 로그인
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white dark:bg-[#1e2b3c] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-sm text-red-700 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                사용자명
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin 또는 superadmin"
                required
                disabled={loading}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                required
                disabled={loading}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center font-medium">
              테스트 계정
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
              admin/12345 또는 superadmin/12345
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
