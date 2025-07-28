import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, ArrowLeft, Mail, Phone, Shield } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function FindPassword() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [tempPassword, setTempPassword] = useState("");
  
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/find-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: method === 'email' ? formData.email : undefined,
          phone: method === 'phone' ? formData.phone : undefined,
          method
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setTempPassword(data.tempPassword);
        setIsSubmitted(true);
        toast({
          title: "비밀번호 재설정 완료",
          description: `임시 비밀번호가 ${method === 'email' ? '이메일' : '휴대폰'}로 전송되었습니다.`,
        });
      } else {
        setError(data.message || "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
      }
    } catch (error) {
      setError("비밀번호 찾기 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted && tempPassword) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#1a1a1a] flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card className="shadow-lg bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                비밀번호 재설정 완료
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6 bg-white dark:bg-[#1a1a1a]">
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  임시 비밀번호가 {method === 'email' ? '이메일' : '휴대폰'}로 전송되었습니다.
                </p>
                
                <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg border-2 border-orange-200 dark:border-orange-700">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                      임시 비밀번호
                    </span>
                  </div>
                  <div className="text-lg font-bold text-orange-800 dark:text-orange-300 bg-white dark:bg-gray-800 p-2 rounded border">
                    {tempPassword}
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">보안을 위한 안내</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 text-left">
                    <li>• 로그인 후 반드시 비밀번호를 변경해 주세요</li>
                    <li>• 임시 비밀번호는 24시간 후 자동으로 만료됩니다</li>
                    <li>• 다른 사람과 임시 비밀번호를 공유하지 마세요</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700">
                    로그인하러 가기
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-gray-300 dark:border-gray-600"
                  onClick={() => {
                    setIsSubmitted(false);
                    setTempPassword("");
                    setFormData({ username: "", email: "", phone: "" });
                  }}
                >
                  다시 찾기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-lg bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              비밀번호 찾기
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              아이디와 본인확인 정보를 입력해 주세요.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6 bg-white dark:bg-[#1a1a1a]">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-white">
                  아이디 *
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                  required
                />
              </div>

              <Tabs value={method} onValueChange={(value) => setMethod(value as 'email' | 'phone')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="email" className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>이메일</span>
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>휴대폰</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="email" className="space-y-2 mt-4">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-white">
                    이메일 주소 *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                    required={method === 'email'}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    회원가입 시 등록한 이메일 주소를 입력해 주세요.
                  </p>
                </TabsContent>
                
                <TabsContent value="phone" className="space-y-2 mt-4">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-white">
                    휴대폰 번호 *
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                    disabled={isLoading}
                    required={method === 'phone'}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    회원가입 시 등록한 휴대폰 번호를 입력해 주세요.
                  </p>
                </TabsContent>
              </Tabs>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 text-base font-medium"
                disabled={isLoading || !formData.username || (method === 'email' ? !formData.email : !formData.phone)}
              >
                {isLoading ? "비밀번호 찾는 중..." : "임시 비밀번호 발급"}
              </Button>
            </form>
            
            <div className="space-y-3">
              <div className="text-center">
                <Link href="/find-id" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  아이디를 잊으셨나요?
                </Link>
              </div>
              
              <div className="flex items-center justify-center">
                <Link href="/login" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  로그인으로 돌아가기
                </Link>
              </div>
            </div>
            
            {/* 회원가입 안내 */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center border dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                아직 회원이 아니신가요?
              </p>
              <Link href="/register">
                <Button 
                  variant="outline" 
                  className="w-full h-10 border-gray-300 dark:border-gray-500 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-white"
                >
                  회원가입하기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}