import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  ShoppingCart, 
  Heart, 
  Search, 
  Menu, 
  X, 
  LogOut,
  Settings,
  Package,
  Bell,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import { isSupabaseConfigured } from "@/lib/supabase";
import UserMenu from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchModal } from "@/components/SearchModal";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useNotifications } from "@/hooks/useNotifications";
import { useLanguage } from "@/hooks/useLanguage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export const Header = () => {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const { user: localUser, logout: localLogout } = useAuth();
  const { toast } = useToast();
  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();
  const { language, setLanguage, t } = useLanguage();
  
  // Conditionally use Supabase auth hook
  let supabaseUser = null;
  let supabaseLoading = false;
  
  try {
    if (isSupabaseConfigured) {
      const supabaseAuth = useSupabaseAuth();
      supabaseUser = supabaseAuth.user;
      supabaseLoading = supabaseAuth.loading;
    }
  } catch (error) {
    // If Supabase auth fails, fall back to local auth
    console.warn('Supabase auth not available, using local auth');
  }
  
  // Get wishlist count from localStorage
  const getWishlistCount = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      return wishlist.length;
    } catch {
      return 0;
    }
  };

  // Update wishlist count when component mounts and when storage changes
  useEffect(() => {
    setWishlistCount(getWishlistCount());
    
    const handleStorageChange = () => {
      setWishlistCount(getWishlistCount());
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlist-updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlist-updated', handleStorageChange);
    };
  }, []);

  // Use Supabase auth if configured, otherwise fall back to local auth
  const currentUser = isSupabaseConfigured ? supabaseUser : localUser;
  const isLoading = isSupabaseConfigured ? supabaseLoading : false;

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const navItems = [
    { name: t({ ko: "홈", en: "Home", ja: "ホーム", zh: "首页" }), href: "/" },
    { name: t({ ko: "상품", en: "Products", ja: "商品", zh: "产品" }), href: "/products" },
    { name: t({ ko: "커뮤니티", en: "Community", ja: "コミュニティ", zh: "社区" }), href: "/community" },
    { name: t({ ko: "자료실", en: "Resources", ja: "資料室", zh: "资源" }), href: "/resources" },
    { name: t({ ko: "이벤트", en: "Events", ja: "イベント", zh: "活动" }), href: "/events" },
  ];



  const getDisplayName = () => {
    if (isSupabaseConfigured && supabaseUser) {
      if (supabaseUser.user_metadata?.username) {
        return supabaseUser.user_metadata.username;
      }
      if (supabaseUser.email) {
        return supabaseUser.email.split('@')[0];
      }
    }
    if (localUser) {
      return localUser.username || localUser.email?.split('@')[0] || '사용자';
    }
    return '사용자';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              pixelgoods
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder={t({ ko: "상품검색...", en: "Search products...", ja: "商品検索...", zh: "搜索商品..." })}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
          <Button variant="ghost" size="icon" onClick={() => setIsSearchModalOpen(true)} className="md:hidden">
            <Search className="h-4 w-4" />
          </Button>

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Favorites */}
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-4 w-4" />
              {/* Wishlist count badge */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>

          {/* Notifications */}
          {currentUser && (
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}

          {/* Language Selector */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-20 h-10 border-0 bg-transparent">
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-50 dark:bg-gray-50 border border-gray-200">
              <SelectItem value="ko" className="hover:bg-gray-100 text-gray-900">한국어</SelectItem>
              <SelectItem value="en" className="hover:bg-gray-100 text-gray-900">English</SelectItem>
              <SelectItem value="ja" className="hover:bg-gray-100 text-gray-900">日本語</SelectItem>
              <SelectItem value="zh" className="hover:bg-gray-100 text-gray-900">中文</SelectItem>
            </SelectContent>
          </Select>

          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* User Authentication */}
          {isSupabaseConfigured ? (
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              ) : currentUser ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">
                    {getDisplayName()}님
                  </span>
                  <UserMenu />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth">
                    <Button variant="outline" size="sm">
                      {t({ ko: "로그인", en: "Login", ja: "ログイン", zh: "登录" })}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default" size="sm">
                      {t({ ko: "회원가입", en: "Sign Up", ja: "会員登録", zh: "注册" })}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">
                    {getDisplayName()}님
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={async () => {
                      if (isSupabaseConfigured) {
                        // Handle Supabase logout if needed
                      } else {
                        await localLogout();
                      }
                      toast({
                        title: t({ ko: "로그아웃 완료", en: "Logout Complete", ja: "ログアウト完了", zh: "登出完成" }),
                        description: t({ ko: "안전하게 로그아웃되었습니다.", en: "You have been safely logged out.", ja: "安全にログアウトされました。", zh: "您已安全登出。" }),
                      });
                      setLocation('/');
                    }}
                    title="로그아웃"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      {t({ ko: "로그인", en: "Login", ja: "ログイン", zh: "登录" })}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default" size="sm">
                      {t({ ko: "회원가입", en: "Sign Up", ja: "会員登録", zh: "注册" })}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile Search Button */}
          <Button variant="ghost" size="icon" onClick={() => setIsSearchModalOpen(true)}>
            <Search className="h-4 w-4" />
          </Button>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay Background */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Slide Menu */}
          <div 
            className="fixed top-0 right-0 h-screen w-[85%] max-w-sm bg-white dark:bg-[#1a1a1a] shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out overflow-y-auto"
            style={{ transform: 'translateX(0)', minHeight: '100vh' }}
          >
            {/* Header */}
            <div className="bg-gray-100 dark:bg-[#1a1a1a] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">한국어</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <button 
                className="text-2xl text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ×
              </button>
            </div>
            
            {/* Mobile Search Bar */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder={t({ ko: "상품검색...", en: "Search products...", ja: "商品検索...", zh: "搜索商品..." })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </form>
            </div>

            {/* Mobile Navigation */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center justify-between py-3 text-base font-medium text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
                      {item.name}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* User Actions */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{getDisplayName()}님</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t({ ko: "환영합니다", en: "Welcome", ja: "いらっしゃいませ", zh: "欢迎" })}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex flex-col items-center py-3 text-center">
                        <div className="relative">
                          <ShoppingCart className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {itemCount}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {t({ ko: "장바구니", en: "Cart", ja: "カート", zh: "购物车" })}
                        </span>
                      </div>
                    </Link>
                    <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex flex-col items-center py-3 text-center">
                        <div className="relative">
                          <Heart className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            0
                          </span>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {t({ ko: "찜하기", en: "Wishlist", ja: "お気に入り", zh: "收藏" })}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={async () => {
                        if (isSupabaseConfigured) {
                          // Handle Supabase logout if needed
                        } else {
                          await localLogout();
                        }
                        toast({
                          title: t({ ko: "로그아웃 완료", en: "Logout Complete", ja: "ログアウト完了", zh: "登出完成" }),
                          description: t({ ko: "안전하게 로그아웃되었습니다.", en: "You have been safely logged out.", ja: "安全にログアウトされました。", zh: "您已安全登出。" }),
                        });
                        setIsMobileMenuOpen(false);
                        setLocation('/');
                      }}
                      className="flex flex-col items-center py-3 text-center"
                    >
                      <LogOut className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {t({ ko: "로그아웃", en: "Logout", ja: "ログアウト", zh: "登出" })}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {t({ ko: "로그인", en: "Login", ja: "ログイン", zh: "登录" })}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full">
                      {t({ ko: "회원가입", en: "Sign Up", ja: "会員登録", zh: "注册" })}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Categories */}
            <div className="flex-1 px-4 py-4 space-y-3">
              {/* 아크릴굿즈 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-black dark:text-white py-3">아크릴굿즈</div>
                <div className="pl-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <Link href="/products?category=keyring" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">아크릴키링</div>
                  </Link>
                  <Link href="/products?category=corot" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">코롯토</div>
                  </Link>
                  <Link href="/products?category=smart-tok" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">스마트톡</div>
                  </Link>
                  <Link href="/products?category=stand" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">스탠드/디오라마</div>
                  </Link>
                  <Link href="/products?category=holder" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">포카홀더/포토액자</div>
                  </Link>
                  <Link href="/products?category=others" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">아크릴셰이커</div>
                  </Link>
                  <Link href="/products?category=carabiner" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">아크릴카라비너</div>
                  </Link>
                  <Link href="/products?category=badge" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">거울</div>
                  </Link>
                  <Link href="/products?category=magnet" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">자석/메시/코스터</div>
                  </Link>
                  <Link href="/products?category=stationery" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">문구류(잡화, 볼펜 등)</div>
                  </Link>
                  <Link href="/products?category=cutting" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">아크릴 제단</div>
                  </Link>
                </div>
              </div>
              
              {/* 우드굿즈 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-black dark:text-white py-3">우드굿즈</div>
                <div className="pl-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <Link href="/products?category=wood-keyring" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">우드키링</div>
                  </Link>
                  <Link href="/products?category=wood-magnet" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">우드마그넷</div>
                  </Link>
                  <Link href="/products?category=wood-stand" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">우드스탠드</div>
                  </Link>
                  <Link href="/products?category=wood-goods" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-2">핸드폰굿즈</div>
                  </Link>
                </div>
              </div>
              
              {/* 포장/부자재 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-black dark:text-white py-3">포장/부자재</div>
                <div className="pl-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <Link href="/products?category=packaging" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-1">스와치</div>
                  </Link>
                  <Link href="/products?category=materials" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-1">부자재</div>
                  </Link>
                  <Link href="/products?category=tools" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="py-1">포장재</div>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Bottom Actions */}
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-around">
                <Link href="/wishlist">
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                </Link>
                <Link href="/notifications">
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Bell className="w-6 h-6" />
                  </button>
                </Link>
                <div className="p-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
            
            {/* User Authentication */}
            <div className="px-4 py-2">
              {isSupabaseConfigured ? (
                <div>
                  {isLoading ? (
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  ) : currentUser ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {getDisplayName()}님
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={async () => {
                          // Handle Supabase logout if needed
                          toast({
                            title: "로그아웃 완료",
                            description: "안전하게 로그아웃되었습니다.",
                          });
                          setLocation('/');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        로그아웃
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link href="/auth">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                          로그인
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="default" size="sm" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                          회원가입
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {currentUser ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {getDisplayName()}님
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={async () => {
                          await localLogout();
                          toast({
                            title: "로그아웃 완료",
                            description: "안전하게 로그아웃되었습니다.",
                          });
                          setLocation('/');
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        로그아웃
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link href="/login">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                          로그인
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="default" size="sm" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                          회원가입
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </header>
  );
};