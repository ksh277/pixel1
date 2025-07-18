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
  Package
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseAuth } from "@/components/SupabaseProvider";
import { isSupabaseConfigured } from "@/lib/supabase";
import UserMenu from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchModal } from "@/components/SearchModal";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";

export const Header = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { user: localUser, logout: localLogout } = useAuth();
  const { user: supabaseUser, loading: supabaseLoading } = useSupabaseAuth();
  const { toast } = useToast();
  const { itemCount } = useCart();
  
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

  const navItems = [
    { name: "홈", href: "/" },
    { name: "상품", href: "/products" },
    { name: "커뮤니티", href: "/community" },
    { name: "자료실", href: "/resources" },
    { name: "이벤트", href: "/events" },
  ];

  // Add Supabase specific nav items if configured
  if (isSupabaseConfigured) {
    navItems.push(
      { name: "Supabase 상품", href: "/supabase-products" },
      { name: "Supabase 데모", href: "/supabase-demo" }
    );
  }

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
              AllThatPrinting
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
          <Button variant="ghost" size="icon" onClick={() => setIsSearchModalOpen(true)}>
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
                      로그인
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default" size="sm">
                      회원가입
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
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default" size="sm">
                      회원가입
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
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
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Slide Panel */}
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-[#0f172a] shadow-xl border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">메뉴</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Navigation Section */}
              <div className="flex-1 py-4">
                <div className="px-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Navigation
                  </h3>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start px-4 py-3 text-base h-auto ${
                          location === item.href
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </nav>
                
                {/* User Section */}
                <div className="px-4 mt-8 mb-4">
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                      User Section
                    </h3>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {currentUser ? (
                    <>
                      <Link href="/mypage">
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-3 text-base h-auto text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-5 w-5 mr-3" />
                          마이페이지
                        </Button>
                      </Link>
                      
                      <Link href="/wishlist">
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-3 text-base h-auto text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Heart className="h-5 w-5 mr-3" />
                          <span className="flex items-center justify-between w-full">
                            찜한 상품
                            <Badge variant="secondary" className="ml-2">{wishlistCount}</Badge>
                          </span>
                        </Button>
                      </Link>
                      
                      <Link href="/cart">
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-3 text-base h-auto text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ShoppingCart className="h-5 w-5 mr-3" />
                          <span className="flex items-center justify-between w-full">
                            장바구니
                            {itemCount > 0 && (
                              <Badge variant="destructive" className="ml-2">
                                {itemCount > 99 ? '99+' : itemCount}
                              </Badge>
                            )}
                          </span>
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="space-y-2 px-4">
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="w-full justify-center"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          로그인
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button
                          variant="default"
                          className="w-full justify-center"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          회원가입
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {/* Dark Mode Toggle */}
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base text-gray-900 dark:text-white">다크모드</span>
                      <ThemeToggle />
                    </div>
                  </div>
                  
                  {/* Search */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-3 text-base h-auto text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      setIsSearchModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Search className="h-5 w-5 mr-3" />
                    검색
                  </Button>
                </div>
              </div>
              
              {/* Bottom Section */}
              {currentUser && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {getDisplayName()}님
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    onClick={async () => {
                      try {
                        // Local auth logout
                        if (localUser) {
                          localLogout();
                        }
                        
                        // Clear local storage
                        localStorage.removeItem('cart');
                        localStorage.removeItem('wishlist');
                        
                        setIsMobileMenuOpen(false);
                        toast({
                          title: "로그아웃 완료",
                          description: "성공적으로 로그아웃되었습니다.",
                        });
                        
                        // Redirect to home
                        window.location.href = '/';
                      } catch (error) {
                        console.error('Logout error:', error);
                        toast({
                          title: "로그아웃 오류",
                          description: "로그아웃 중 오류가 발생했습니다.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </Button>
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