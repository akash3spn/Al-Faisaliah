import { useState } from "react"
import { ShoppingBag, Users, PackageOpen, TrendingUp, Settings, Logs, Sidebar, CreditCard, ShieldAlert, LogOut, Ticket } from "lucide-react"
import { Link, Outlet, useLocation, Navigate } from "react-router-dom"
import { useAuth } from "@/lib/firebase/AuthContext"
import { ModeToggle } from "@/components/mode-toggle"
import { useLanguage } from "@/lib/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"

export function AdminLayout() {
  const { isAdmin, role, loading, logout } = useAuth()
  const location = useLocation()
  const { t, language } = useLanguage()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  const allNavItems = [
    { name: t('admin.dashboard'), path: "/admin", icon: TrendingUp, roles: ['super_admin', 'admin', 'product_manager', 'order_manager', 'inventory_manager', 'customer_support', 'content_manager'] },
    { name: t('admin.discounts'), path: "/admin/discounts", icon: Ticket, roles: ['super_admin', 'admin', 'product_manager'] },
    { name: t('admin.products'), path: "/admin/products", icon: PackageOpen, roles: ['super_admin', 'admin', 'product_manager', 'inventory_manager', 'content_manager'] },
    { name: t('admin.orders'), path: "/admin/orders", icon: ShoppingBag, roles: ['super_admin', 'admin', 'order_manager', 'customer_support'] },
    { name: t('admin.customers'), path: "/admin/customers", icon: Users, roles: ['super_admin', 'admin', 'customer_support'] },
    { name: t('admin.managers'), path: "/admin/managers", icon: ShieldAlert, roles: ['super_admin', 'admin'] },
    { name: t('admin.payments'), path: "/admin/payments", icon: CreditCard, roles: ['super_admin', 'admin'] },
    { name: t('admin.settings'), path: "/admin/settings", icon: Settings, roles: ['super_admin', 'admin'] },
  ]

  const currentNav = allNavItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))
  
  // Protect routes based on role
  if (currentNav && role && !currentNav.roles.includes(role)) {
    if (location.pathname !== '/admin') {
      return <Navigate to="/admin" replace />
    }
  }

  const navItems = allNavItems.filter(item => !role || item.roles.includes(role))

  return (
    <div className={`flex min-h-screen bg-muted/30 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/10 pointer-events-none z-[-1]" />
      {/* Sidebar */}
      <aside className="w-64 border-l rtl:border-r border-r ltr:border-r bg-background/80 backdrop-blur-xl lg:w-72 hidden md:block">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg leading-none">A</span>
            </div>
            <Link to="/" className="text-xl font-bold tracking-tight text-foreground uppercase tracking-widest rtl:pr-2 ltr:pl-1">
              {language === 'ar' ? 'الفيصلية' : 'Al-Faisaliah'}
            </Link>
          </div>
        </div>
        
        <div className="p-4">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </div>
          <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background/50">
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-30 flex items-center px-4 justify-between md:justify-end shadow-sm">
          <div className="md:hidden flex items-center gap-2">
            <Sidebar className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary tracking-widest">{language === 'ar' ? 'الفيصلية' : 'AL-FAISALIAH'}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm rtl:gap-3">
            <LanguageSwitcher />
            <ModeToggle />
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
              {t('admin.viewStore')}
            </Link>
            <div className="h-8 w-8 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center">
               <span className="text-primary text-xs font-bold">AD</span>
            </div>
            <button onClick={() => logout()} className="text-muted-foreground hover:text-red-500 transition-colors p-1" title={language === 'ar' ? 'تسجيل الخروج' : 'Logout'}>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
