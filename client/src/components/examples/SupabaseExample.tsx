import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { Loader2, Search, Heart, ShoppingCart, Star, AlertCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const SupabaseExample: React.FC = () => {
  const { toast } = useToast()
  const { user, signIn, signOut, loading: authLoading } = useSupabaseAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Sample data fetching functions
  const fetchSampleData = async () => {
    setLoading(true)
    try {
      // This would normally fetch from your Supabase database
      // For demo purposes, we'll show the structure
      console.log('Supabase client initialized:', supabase ? 'Yes' : 'No')
      
      // Example of how to fetch products
      // const { data: productsData, error } = await supabase
      //   .from('products')
      //   .select('*')
      //   .limit(6)
      
      toast({
        title: "데모 준비 완료",
        description: "Supabase 클라이언트가 초기화되었습니다.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "연결 오류",
        description: "Supabase 연결을 확인해주세요.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    if (!credentials.email || !credentials.password) {
      toast({
        title: "입력 오류",
        description: "이메일과 비밀번호를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    await signIn(credentials.email, credentials.password)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  useEffect(() => {
    fetchSampleData()
  }, [])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Supabase Integration Demo</h1>
        <p className="text-muted-foreground">
          AllThatPrinting 프로젝트의 Supabase 연동 예제
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button asChild variant="outline">
            <a href="/supabase-products">상품 목록 페이지 보기</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/">메인 페이지로 돌아가기</a>
          </Button>
        </div>
      </div>

      {/* Configuration Status */}
      {!isSupabaseConfigured && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertCircle className="w-5 h-5" />
              <div>
                <h4 className="font-medium">Supabase 설정 필요</h4>
                <p className="text-sm mt-1">
                  환경 변수 설정을 위해 .env 파일에 다음 변수들을 추가하세요:
                </p>
                <div className="mt-2 p-2 bg-orange-100 dark:bg-orange-800/30 rounded text-xs font-mono">
                  <div>VITE_SUPABASE_URL=your_supabase_project_url</div>
                  <div>VITE_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isSupabaseConfigured && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <h4 className="font-medium">Supabase 연결 완료</h4>
                <p className="text-sm mt-1">
                  데이터베이스 연결이 성공적으로 설정되었습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Authentication Section */}
      <Card>
        <CardHeader>
          <CardTitle>인증 상태</CardTitle>
          <CardDescription>
            현재 로그인 상태: {user ? `${user.email}` : '로그인되지 않음'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    placeholder="이메일 주소"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="비밀번호"
                  />
                </div>
              </div>
              <Button onClick={handleSignIn} className="w-full">
                로그인
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium">로그인 성공!</p>
                <p className="text-sm text-muted-foreground">사용자 ID: {user.id}</p>
              </div>
              <Button onClick={handleSignOut} variant="outline">
                로그아웃
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            상품 검색
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="상품 이름을 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {loading && (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">검색 중...</span>
              </div>
            )}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium mb-2">Supabase API 함수들</h4>
              <div className="space-y-2 text-sm">
                <div>✅ fetchProducts() - 상품 조회</div>
                <div>✅ fetchCategories() - 카테고리 조회</div>
                <div>✅ fetchOrders() - 주문 조회</div>
                <div>✅ fetchReviews() - 리뷰 조회</div>
                <div>✅ fetchEvents() - 이벤트 조회</div>
                <div>✅ fetchTemplates() - 템플릿 조회</div>
                <div>✅ searchProducts() - 상품 검색</div>
                <div>✅ addToCart() - 장바구니 추가</div>
                <div>✅ addToWishlist() - 위시리스트 추가</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="products">상품</TabsTrigger>
          <TabsTrigger value="categories">카테고리</TabsTrigger>
          <TabsTrigger value="orders">주문</TabsTrigger>
          <TabsTrigger value="reviews">리뷰</TabsTrigger>
          <TabsTrigger value="events">이벤트</TabsTrigger>
          <TabsTrigger value="templates">템플릿</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>상품 목록</CardTitle>
              <CardDescription>
                Supabase에서 가져온 상품 데이터
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Products API 예제</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>fetchProducts()</strong> - 모든 상품 조회</div>
                    <div><strong>fetchProducts( categoryId: 'uuid' )</strong> - 카테고리별 상품</div>
                    <div><strong>fetchProducts( featured: true )</strong> - 인기 상품</div>
                    <div><strong>fetchProducts( limit: 10, offset: 20 )</strong> - 페이지네이션</div>
                    <div><strong>fetchProductById('uuid')</strong> - 상품 상세 조회</div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">예상 상품 구조</h4>
                  <pre className="text-xs bg-gray-100 dark:bg-[#1a1a1a] p-2 rounded">
{`{
  id: "uuid",
  name: "Acrylic Keychain",
  name_ko: "아크릴 키링",
  description_ko: "고품질 아크릴 키링",
  category_id: "uuid",
  base_price: 3000,
  image_url: "https://...",
  is_featured: true,
  is_available: true,
  stock_quantity: 100,
  created_at: "2025-01-17T...",
  updated_at: "2025-01-17T..."
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>카테고리 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Categories API 예제</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>fetchCategories()</strong> - 모든 카테고리 조회</div>
                  <div><strong>fetchCategories( active: true )</strong> - 활성 카테고리만</div>
                  <div><strong>fetchCategories( parentId: 'uuid' )</strong> - 하위 카테고리</div>
                  <div><strong>fetchCategoryById('uuid')</strong> - 카테고리 상세</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>주문 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Orders API 예제</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>fetchOrders()</strong> - 모든 주문 조회</div>
                  <div><strong>fetchOrders( userId: 'uuid' )</strong> - 사용자별 주문</div>
                  <div><strong>fetchOrders( status: 'delivered' )</strong> - 상태별 주문</div>
                  <div><strong>fetchOrderById('uuid')</strong> - 주문 상세</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>리뷰 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Reviews API 예제</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>fetchReviews()</strong> - 모든 리뷰 조회</div>
                  <div><strong>fetchReviews( productId: 'uuid' )</strong> - 상품별 리뷰</div>
                  <div><strong>fetchReviews( featured: true )</strong> - 베스트 리뷰</div>
                  <div><strong>fetchReviews( minRating: 4 )</strong> - 높은 평점 리뷰</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>이벤트 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Events API 예제</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>fetchEvents()</strong> - 모든 이벤트 조회</div>
                  <div><strong>fetchEvents( active: true )</strong> - 진행중인 이벤트</div>
                  <div><strong>fetchEvents( eventType: 'sale' )</strong> - 타입별 이벤트</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>템플릿 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Templates API 예제</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>fetchTemplates()</strong> - 모든 템플릿 조회</div>
                  <div><strong>fetchTemplates( category: 'keyring' )</strong> - 카테고리별 템플릿</div>
                  <div><strong>fetchTemplates( featured: true )</strong> - 인기 템플릿</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SupabaseExample