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
  Bell
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
    { name: "홈", href: "/" },
    { name: "상품", href: "/products" },
    { name: "커뮤니티", href: "/community" },
    { name: "자료실", href: "/resources" },
    { name: "이벤트", href: "/events" },
  ];

  // Add Supabase specific nav items if configured
  if (isSupabaseConfigured) {
    navItems.push(
      { name: "Supabase 상품", href: "/supabase-products" }
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
                placeholder="상품검색..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        title: "로그아웃 완료",
                        description: "안전하게 로그아웃되었습니다.",
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
          {/* Overlay Background */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Slide Menu */}
          <div 
            className="fixed top-0 right-0 h-full w-[75%] max-w-xs bg-white dark:bg-[#0f172a] shadow-lg flex flex-col p-6 transform transition-transform duration-300 ease-in-out"
            style={{ transform: 'translateX(0)' }}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-2xl text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ×
            </button>
            
            {/* Navigation Links */}
            <div className="mt-12 space-y-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${
                      location === item.href 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </button>
                </Link>
              ))}
            </div>
            
            {/* Search Box */}
            <div className="mt-6">
              <form onSubmit={handleSearch} className="w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="상품검색..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </form>
            </div>
            
            {/* User Actions */}
            <div className="mt-6 space-y-4">
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
              
              {currentUser ? (
                <div className="space-y-3 text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {getDisplayName()}님
                  </span>
                  <button
                    onClick={async () => {
                      if (isSupabaseConfigured) {
                        // Handle Supabase logout if needed
                      } else {
                        await localLogout();
                      }
                      toast({
                        title: "로그아웃 완료",
                        description: "안전하게 로그아웃되었습니다.",
                      });
                      setIsMobileMenuOpen(false);
                      setLocation('/');
                    }}
                    className="w-full py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors font-medium"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/login">
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2 px-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded-lg transition-colors"
                    >
                      로그인
                    </button>
                  </Link>
                  <Link href="/register">
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      회원가입
                    </button>
                  </Link>
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