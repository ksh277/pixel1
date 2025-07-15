import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Moon, Sun, Menu, User, Heart, ChevronDown, ChevronRight, ChevronUp, Globe, Settings } from "lucide-react";
import { useThemeContext } from "./ThemeProvider";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['customer', 'participation', 'goods']);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { theme, toggleTheme } = useThemeContext();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  // Update cart count when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = localStorage.getItem('cart');
        if (cart) {
          const parsedCart = JSON.parse(cart);
          const totalItems = parsedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartItemCount(totalItems);
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error('Error parsing cart:', error);
        setCartItemCount(0);
      }
    };

    updateCartCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Custom event listener for cart updates
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setLocation(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const categoryNavItems = [
    { id: 'reviews', label: { ko: "사용후기 💕", en: "Reviews 💕", ja: "レビュー 💕", zh: "使用心得 💕" }, href: "/reviews" },
    { id: 'collections', label: { ko: "모음전 🏷️", en: "Collections 🏷️", ja: "コレクション 🏷️", zh: "合集 🏷️" }, href: "/collections" },
    { id: 'resources', label: { ko: "자료실", en: "Resources", ja: "資料室", zh: "资料室" }, href: "/resources" },
    { id: 'events', label: { ko: "이벤트", en: "Events", ja: "イベント", zh: "活动" }, href: "/events" },
    { id: 'support', label: { ko: "문의게시판", en: "Support", ja: "お問い合わせ", zh: "咨询版" }, href: "/support" },
    { id: 'payment', label: { ko: "추가결제", en: "Payment", ja: "追加支払い", zh: "追加付款" }, href: "/payment" },
    { id: 'benefits', label: { ko: "회원등급혜택", en: "Member Benefits", ja: "会员特典", zh: "会员福利" }, href: "/rewards" }
  ];

  // Mobile menu structure with sections
  const mobileMenuSections = [
    {
      id: 'customer',
      title: { ko: "고객 기능", en: "Customer Features", ja: "顧客機能", zh: "客户功能" },
      items: [
        { id: 'printing', label: { ko: "프린팅", en: "Printing", ja: "印刷", zh: "印刷" }, href: "/products" },
        { id: 'community', label: { ko: "커뮤니티", en: "Community", ja: "コミュニティ", zh: "社区" }, href: "/community" },
        { id: 'editor', label: { ko: "굿즈 에디터", en: "Goods Editor", ja: "グッズエディタ", zh: "商品编辑器" }, href: "/editor" },
        { id: 'cart', label: { ko: "장바구니", en: "Shopping Cart", ja: "ショッピングカート", zh: "购物车" }, href: "/cart" },
        ...(user 
          ? [
              { id: 'mypage', label: { ko: "마이페이지", en: "My Page", ja: "マイページ", zh: "我的页面" }, href: "/mypage" },
              ...(user.isAdmin ? [{ id: 'admin', label: { ko: "관리자 모드", en: "Admin Mode", ja: "管理者モード", zh: "管理员模式" }, href: "/admin" }] : []),
              { id: 'logout', label: { ko: "로그아웃", en: "Logout", ja: "ログアウト", zh: "登出" }, href: "/logout", onClick: logout }
            ]
          : [
              { id: 'login', label: { ko: "로그인", en: "Login", ja: "ログイン", zh: "登录" }, href: "/login" },
              { id: 'register', label: { ko: "회원가입", en: "Sign Up", ja: "会員登録", zh: "注册" }, href: "/register" }
            ]
        )
      ]
    },
    {
      id: 'participation',
      title: { ko: "고객참여", en: "Customer Participation", ja: "顧客参加", zh: "客户参与" },
      items: [
        { id: 'reviews', label: { ko: "사용후기 💕", en: "Reviews 💕", ja: "レビュー 💕", zh: "使用心得 💕" }, href: "/reviews" },
        { id: 'collections', label: { ko: "모음전 🏷️", en: "Collections 🏷️", ja: "コレクション 🏷️", zh: "合集 🏷️" }, href: "/collections" },
        { id: 'resources', label: { ko: "자료실", en: "Resources", ja: "資料室", zh: "资料室" }, href: "/resources" },
        { id: 'events', label: { ko: "이벤트", en: "Events", ja: "イベント", zh: "活动" }, href: "/events" },
        { id: 'support', label: { ko: "문의게시판", en: "Support", ja: "お問い合わせ", zh: "咨询版" }, href: "/support" }
      ]
    },
    {
      id: 'goods',
      title: { ko: "굿즈 카테고리", en: "Goods Categories", ja: "グッズカテゴリ", zh: "商品类别" },
      items: [
        {
          id: 'acrylic',
          label: { ko: "아크릴굿즈", en: "Acrylic Goods", ja: "アクリルグッズ", zh: "亚克力商品" },
          href: "/category/acrylic",
          subItems: [
            { id: 'keyring', label: { ko: "아크릴키링", en: "Acrylic Keyring", ja: "アクリルキーリング", zh: "亚克力钥匙扣" }, href: "/category/acrylic/keyring" },
            { id: 'korotto', label: { ko: "코롯토", en: "Korotto", ja: "コロット", zh: "Korotto" }, href: "/category/acrylic/korotto" },
            { id: 'smarttok', label: { ko: "스마트톡", en: "Smart Tok", ja: "スマートトック", zh: "智能支架" }, href: "/category/acrylic/smarttok" },
            { id: 'stand', label: { ko: "스탠드/디오라마", en: "Stand/Diorama", ja: "スタンド/ジオラマ", zh: "支架/立体模型" }, href: "/category/acrylic/stand" },
            { id: 'holder', label: { ko: "포카홀더/포토액자", en: "Card Holder/Photo Frame", ja: "カードホルダー/フォトフレーム", zh: "卡片夹/相框" }, href: "/category/acrylic/holder" },
            { id: 'shaker', label: { ko: "아크릴쉐이커", en: "Acrylic Shaker", ja: "アクリルシェイカー", zh: "亚克力摇摆器" }, href: "/category/acrylic/shaker" },
            { id: 'carabiner', label: { ko: "아크릴카라비너", en: "Acrylic Carabiner", ja: "アクリルカラビナ", zh: "亚克力登山扣" }, href: "/category/acrylic/carabiner" },
            { id: 'mirror', label: { ko: "거울", en: "Mirror", ja: "ミラー", zh: "镜子" }, href: "/category/acrylic/mirror" },
            { id: 'magnet', label: { ko: "자석/뱃지/코스터", en: "Magnet/Badge/Coaster", ja: "マグネット/バッジ/コースター", zh: "磁铁/徽章/杯垫" }, href: "/category/acrylic/magnet" },
            { id: 'stationery', label: { ko: "문구류(집게, 볼펜 등)", en: "Stationery (Clips, Pens, etc.)", ja: "文具類(クリップ、ペンなど)", zh: "文具类(夹子、笔等)" }, href: "/category/acrylic/stationery" },
            { id: 'cutting', label: { ko: "아크릴 재단", en: "Acrylic Cutting", ja: "アクリル裁断", zh: "亚克力切割" }, href: "/category/acrylic/cutting" }
          ]
        },
        {
          id: 'wood',
          label: { ko: "우드굿즈", en: "Wood Goods", ja: "ウッドグッズ", zh: "木制商品" },
          href: "/category/wood",
          subItems: [
            { id: 'wood-keyring', label: { ko: "우드키링", en: "Wood Keyring", ja: "ウッドキーリング", zh: "木制钥匙扣" }, href: "/category/wood/keyring" },
            { id: 'wood-magnet', label: { ko: "우드마그넷", en: "Wood Magnet", ja: "ウッドマグネット", zh: "木制磁铁" }, href: "/category/wood/magnet" },
            { id: 'wood-stand', label: { ko: "우드스탠드", en: "Wood Stand", ja: "ウッドスタンド", zh: "木制支架" }, href: "/category/wood/stand" }
          ]
        },
        {
          id: 'lanyard',
          label: { ko: "랜야드굿즈", en: "Lanyard Goods", ja: "ランヤードグッズ", zh: "挂绳商品" },
          href: "/category/lanyard"
        },
        {
          id: 'packaging',
          label: { ko: "포장/부자재", en: "Packaging/Materials", ja: "パッケージ/副資材", zh: "包装/辅助材料" },
          href: "/category/packaging",
          subItems: [
            { id: 'swatch', label: { ko: "스와치", en: "Swatch", ja: "スウォッチ", zh: "色卡" }, href: "/category/packaging/swatch" },
            { id: 'materials', label: { ko: "부자재", en: "Materials", ja: "副資材", zh: "辅助材料" }, href: "/category/packaging/materials" },
            { id: 'packaging-items', label: { ko: "포장재", en: "Packaging Items", ja: "包装材", zh: "包装材料" }, href: "/category/packaging/items" }
          ]
        }
      ]
    }
  ];

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-end text-sm">
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/mypage" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t({ ko: "마이페이지", en: "My Page", ja: "マイページ", zh: "我的页面" })}
                </Link>
                {user.isAdmin && (
                  <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t({ ko: "관리자 모드", en: "Admin Mode", ja: "管理者モード", zh: "管理员模式" })}
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t({ ko: "로그아웃", en: "Logout", ja: "ログアウト", zh: "登出" })}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t({ ko: "로그인", en: "Login", ja: "ログイン", zh: "登录" })}
                </Link>
                <Link href="/register" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t({ ko: "회원가입", en: "Sign Up", ja: "会員登録", zh: "注册" })}
                </Link>
              </>
            )}
            
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={language === lang.code ? "bg-muted" : ""}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white dark:bg-[#3F4C5F] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold text-foreground">
                PIXEL<span className="text-blue-600">GOODS</span>
              </span>
            </Link>

            {/* Main Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/products" className="text-foreground hover:text-muted-foreground transition-colors font-medium">
                {t({ ko: "프린팅", en: "Printing", ja: "印刷", zh: "印刷" })}
              </Link>
              <Link href="/community" className="text-foreground hover:text-muted-foreground transition-colors font-medium">
                {t({ ko: "커뮤니티", en: "Community", ja: "コミュニティ", zh: "社区" })}
              </Link>
              <Link href="/editor" className="text-foreground hover:text-muted-foreground transition-colors font-medium">
                {t({ ko: "굿즈 에디터", en: "Goods Editor", ja: "グッズエディタ", zh: "商品编辑器" })}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t({ ko: "상품명을 입력하세요", en: "Enter product name", ja: "商品名を入力", zh: "输入商品名称" })}
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSearch(searchQuery)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>

              {/* Profile/Account */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>{user.name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/mypage" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        {t({ ko: "마이페이지", en: "My Page", ja: "マイページ", zh: "我的页面" })}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/wishlist" className="flex items-center w-full">
                        <Heart className="mr-2 h-4 w-4" />
                        {t({ ko: "찜한 상품", en: "Favorites", ja: "お気に入り", zh: "收藏" })}
                      </Link>
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem>
                        <Link href="/admin" className="flex items-center w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          {t({ ko: "관리자 모드", en: "Admin Mode", ja: "管理者モード", zh: "管理员模式" })}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>
                      <span className="mr-2">🚪</span>
                      {t({ ko: "로그아웃", en: "Logout", ja: "ログアウト", zh: "登出" })}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              {/* Favorites */}
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Mobile Search */}
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder={t({ ko: "상품명을 입력하세요", en: "Enter product name", ja: "商品名を入力", zh: "输入商品名称" })}
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSearch(searchQuery)}
                      className="px-3"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Mobile Menu Sections */}
                  <div className="flex flex-col space-y-6">
                    {mobileMenuSections.map((section) => (
                      <div key={section.id} className="border-b border-gray-200 dark:border-gray-800 pb-4">
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="flex items-center justify-between w-full py-2 px-3 text-left font-semibold text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            📁 {t(section.title)}
                          </span>
                          {expandedSections.includes(section.id) ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>

                        {/* Section Items */}
                        {expandedSections.includes(section.id) && (
                          <div className="mt-2 space-y-1">
                            {section.items.map((item) => (
                              <div key={item.id}>
                                {/* Main Item */}
                                {item.onClick ? (
                                  <button
                                    onClick={item.onClick}
                                    className="flex items-center justify-between py-2 px-6 text-foreground hover:bg-muted rounded-md transition-colors w-full text-left"
                                  >
                                    <span className="text-sm">
                                      {t(item.label)}
                                    </span>
                                  </button>
                                ) : (
                                  <Link
                                    href={item.href}
                                    className="flex items-center justify-between py-2 px-6 text-foreground hover:bg-muted rounded-md transition-colors"
                                  >
                                    <span className="text-sm">
                                      {t(item.label)}
                                    </span>
                                    {item.subItems && (
                                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                    )}
                                  </Link>
                                )}

                                {/* Sub Items */}
                                {item.subItems && (
                                  <div className="ml-4 mt-1 space-y-1">
                                    {item.subItems.map((subItem) => (
                                      <Link
                                        key={subItem.id}
                                        href={subItem.href}
                                        className="flex items-center py-1.5 px-6 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                                      >
                                        • {t(subItem.label)}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Category Navigation Bar */}
      <nav className="bg-white dark:bg-[#3F4C5F] border-b border-gray-200 dark:border-gray-800 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="hidden md:flex items-center space-x-8 py-3 overflow-x-auto">
              {categoryNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-foreground ${
                    location === item.href
                      ? 'text-foreground border-b-2 border-orange-500 pb-2'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(item.label)}
                </Link>
              ))}
            </div>
            
            {/* Mobile Category Scroll */}
            <div className="md:hidden flex items-center space-x-6 py-3 overflow-x-auto">
              {categoryNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`whitespace-nowrap text-sm font-medium transition-colors ${
                    location === item.href
                      ? 'text-foreground border-b-2 border-orange-500 pb-2'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(item.label)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}