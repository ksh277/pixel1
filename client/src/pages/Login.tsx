import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, AlertCircle, Shield, MessageCircle } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [secureLogin, setSecureLogin] = useState(false);
  const [error, setError] = useState("");
  
  const { login, isLoading, redirectPath } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const success = await login(formData.username, formData.password);
      
      if (success) {
        // Force page refresh to ensure UI updates
        window.location.href = redirectPath || '/';
      } else {
        setError(t({ 
          ko: "아이디 또는 비밀번호가 잘못되었습니다.", 
          en: "Invalid username or password." 
        }));
      }
    } catch (error) {
      setError(t({ 
        ko: "로그인 중 오류가 발생했습니다.", 
        en: "An error occurred during login." 
      }));
    }
  };

  const handleSnsLogin = (provider: 'kakao' | 'naver') => {
    console.log(`${provider} 로그인 시도`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-lg bg-white dark:bg-[#1a2332] border-gray-200 dark:border-gray-700">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {t({ ko: "로그인", en: "Login" })}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 bg-white dark:bg-[#1a2332]">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Demo credentials info */}
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                {t({ ko: "테스트 계정", en: "Demo Account", ja: "テストアカウント", zh: "测试账号" })}
              </p>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p>• {t({ ko: "관리자", en: "Admin", ja: "管理者", zh: "管理员" })}: <span className="font-mono bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">admin</span> / <span className="font-mono bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">12345</span></p>
                <p>• {t({ ko: "사용자", en: "User", ja: "ユーザー", zh: "用户" })}: <span className="font-mono bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">user1</span> / <span className="font-mono bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">12345</span></p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  ⚠️ {t({ ko: "실제 배포 시 이 안내는 제거됩니다.", en: "This guide will be removed in production.", ja: "本番環境では削除されます。", zh: "正式部署时将删除此指南。" })}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="username"
                  type="text"
                  placeholder="아이디"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-12 text-base"
                />
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 text-base pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                <div className="flex items-center justify-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="secure-login"
                      checked={secureLogin}
                      onCheckedChange={(checked) => setSecureLogin(checked as boolean)}
                    />
                    <label htmlFor="secure-login" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      보안접속
                    </label>
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-black dark:bg-blue-600 text-white hover:bg-gray-800 dark:hover:bg-blue-700 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
            
            {/* Find ID/Password Links */}
            <div className="flex justify-center space-x-4 text-sm">
              <Link href="/find-id" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                아이디 찾기
              </Link>
              <span className="text-gray-400 dark:text-gray-500">|</span>
              <Link href="/find-password" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                비밀번호 찾기
              </Link>
            </div>
            
            {/* SNS Login */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">간편 로그인</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 border-yellow-400 hover:bg-yellow-50"
                  onClick={() => handleSnsLogin('kakao')}
                >
                  <MessageCircle className="w-5 h-5 mr-2 text-yellow-600" />
                  카카오
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 border-green-500 hover:bg-green-50"
                  onClick={() => handleSnsLogin('naver')}
                >
                  <span className="w-5 h-5 mr-2 bg-green-500 text-white rounded text-xs flex items-center justify-center font-bold">N</span>
                  네이버
                </Button>
              </div>
            </div>
            
            {/* Sign up promotion */}
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-3">
                아직 회원이 아니신가요? 지금 회원가입을 하시면<br />
                다양한 특별 혜택이 준비되어 있습니다.
              </p>
              <Link href="/register">
                <Button 
                  variant="outline" 
                  className="w-full h-10 border-gray-300 hover:bg-white"
                >
                  회원가입
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}