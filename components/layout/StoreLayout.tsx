// Remove serif and adjust colors
import { Button, buttonVariants } from "@/components/ui/button"
import { ShoppingCart, LogOut, Package, Search, Menu, UserCircle, Store } from "lucide-react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/firebase/AuthContext"
import { useLanguage } from "@/lib/language-provider"
import { useCart } from "@/lib/CartContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

export function StoreLayout() {
  const { user, isAdmin, loginWithGoogle, logout } = useAuth()
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  const { cartCount } = useCart()

  return (
    <div className={`flex min-h-screen flex-col ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <header className="sticky top-0 z-50 w-full bg-black border-b border-primary/20">
        {/* Main Header */}
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-primary" onClick={() => navigate("/")}>
              <Menu className="h-5 w-5" />
            </Button>
            <a href="https://al-faisaliah.vercel.app/" className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm rotate-45 shrink-0 hidden sm:flex">
                <span className="-rotate-45 text-black font-black text-xl">F</span>
              </div>
              <div className="flex flex-col">
                <h1 className={`text-xl font-bold tracking-widest text-white m-0 leading-tight ${language === 'en' ? 'uppercase' : ''}`}>
                  {language === 'ar' ? 'مؤسسة' : 'Al-Faisaliah'} <span className="text-primary">{language === 'ar' ? 'الفيصلية' : 'Store'}</span>
                </h1>
                <p className="text-[10px] text-primary/80 tracking-[0.2em] uppercase m-0 leading-tight">
                  {language === 'ar' ? 'طريف، المملكة العربية السعودية' : 'Turaif City, Saudi Arabia'}
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Link to="/" className="text-primary border-b border-primary pb-1">{t('nav.home')}</Link>
            <Link to="/products" className="hover:text-primary transition-colors">{t('nav.shop')}</Link>
            <Link to="/categories/electronics" className="hover:text-primary transition-colors">{t('categories.electronics')}</Link>
            <Link to="/categories/toys" className="hover:text-primary transition-colors">{t('categories.babyToys')}</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); const query = formData.get('search'); if (query) navigate(`/products?search=${query}`) }} className="hidden md:flex relative group">
              <input 
                name="search"
                type="text" 
                placeholder={language === 'ar' ? 'البحث...' : 'Search...'}
                className="bg-[#1a1a1a] text-white text-xs border border-[#333] rounded px-10 py-2 focus:outline-none focus:border-primary transition-colors w-48 uppercase tracking-wider"
              />
              <Search className="h-4 w-4 text-primary/70 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
            </form>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-white hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-primary text-black font-bold">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full text-white hover:text-primary" })}>
                  <UserCircle className="h-6 w-6" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`w-56 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/my-orders")} className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" /> {t('nav.myOrders')}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
                      <Store className="mr-2 h-4 w-4" /> {t('nav.admin')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button size="sm" variant="outline" className="hidden sm:flex font-bold rounded-full cursor-pointer text-[10px] tracking-wide border-primary/50 text-white hover:bg-primary hover:text-black hover:border-primary">
                  {t('nav.login')}
                </Button>
              </Link>
            )}
            
            <div className="hidden sm:flex items-center gap-4 border-l border-[#333] pl-4 rtl:pr-4 rtl:border-l-0 rtl:border-r">
               <ModeToggle />
               <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col bg-background relative overflow-x-hidden">
        <Outlet />
      </main>

      <footer className="bg-black border-t border-primary/20 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-6 text-[10px] tracking-widest text-gray-500 uppercase font-medium">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
          <span>{language === 'ar' ? 'شحن مجاني للطلبات فوق ٥٠٠ ر.س' : 'Free Shipping Over SAR 500'}</span>
          <span className="text-primary hidden sm:inline">•</span>
          <span>{language === 'ar' ? 'دفع آمن' : 'Secure Checkout'}</span>
          <span className="text-primary hidden sm:inline">•</span>
          <span>{language === 'ar' ? 'دعم ٢٤/٧' : '24/7 Support'}</span>
        </div>
        <div className="flex flex-wrap flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-4 md:mt-0">
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
            <a href="#" className="hover:text-primary transition-colors">{language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="text-primary/50 hover:text-primary border border-primary/20 hover:border-primary/50 px-2 py-1 flex items-center gap-1 transition-all rounded">
              <Store className="w-3 h-3" />
              {language === 'ar' ? 'دخول الإدارة' : 'Admin Login'}
            </Link>
            <span className="text-white">© {new Date().getFullYear()} {language === 'ar' ? 'مؤسسة الفيصلية' : 'Al-Faisaliah Store'}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

