import { ShoppingBag, Users, PackageOpen, TrendingUp, Settings, Logs, Sidebar, CreditCard } from "lucide-react"
import { Link, Outlet, useLocation, Navigate } from "react-router-dom"
import { useAuth } from "@/lib/firebase/AuthContext"
import { ModeToggle } from "@/components/mode-toggle"

export function AdminLayout() {
  const { isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>
  
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: TrendingUp },
    { name: "Products", path: "/admin/products", icon: PackageOpen },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", path: "/admin/customers", icon: Users },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/10 pointer-events-none z-[-1]" />
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background/80 backdrop-blur-xl lg:w-72 hidden md:block">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg leading-none">A</span>
            </div>
            <Link to="/" className="text-xl font-serif font-bold tracking-tight text-foreground uppercase tracking-widest pl-1">
              Al-Faisaliah
            </Link>
          </div>
        </div>
        
        <div className="p-4">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Overview
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
            <span className="font-serif font-bold text-primary tracking-widest">AL-FAISALIAH</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <ModeToggle />
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
              View Storefront
            </Link>
            <div className="h-8 w-8 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center">
               <span className="text-primary text-xs font-bold">AD</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
