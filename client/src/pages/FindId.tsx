import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, ArrowLeft, User } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function FindId() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [foundId, setFoundId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/find-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setFoundId(data.username);
        setIsSubmitted(true);
        toast({
          title: "아이디 찾기 완료",
          description: "등록된 이메일로 아이디를 확인했습니다.",
        });
      } else {
        setError(data.message || "등록된 이메일을 찾을 수 없습니다.");
      }
    } catch (error) {
      setError("아이디 찾기 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted && foundId) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#1a1a1a] flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card className="shadow-lg bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                아이디 찾기 완료
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6 bg-white dark:bg-[#1a1a1a]">
              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  입력하신 이메일 주소로 등록된 아이디입니다.
                </p>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-center space-x-2">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-lg font-bold text-blue-800 dark:text-blue-300">
                      {foundId}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  찾으신 아이디로 로그인해 주세요.
                </p>
              </div>
              
              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700">
                    로그인하러 가기
                  </Button>
                </Link>
                
                <Link href="/find-password">
                  <Button variant="outline" className="w-full h-12 border-gray-300 dark:border-gray-600">
                    비밀번호 찾기
                  </Button>
                </Link>
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
              아이디 찾기
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              회원가입 시 등록한 이메일 주소를 입력해 주세요.
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
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-white">
                  이메일 주소 *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  등록된 이메일 주소로 아이디를 확인해 드립니다.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 text-base font-medium"
                disabled={isLoading || !email}
              >
                {isLoading ? "아이디 찾는 중..." : "아이디 찾기"}
              </Button>
            </form>
            
            <div className="space-y-3">
              <div className="text-center">
                <Link href="/find-password" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  비밀번호를 잊으셨나요?
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