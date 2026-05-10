import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, Users, ArrowUpRight, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { useLanguage } from "@/lib/language-provider"
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { format } from "date-fns"

export default function AdminDashboard() {
  const { t, language, dir } = useLanguage()
  
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Default chart data for the last 7 days starting at 0
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const today = new Date().getDay()
        const defaultChartData = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          return { name: days[d.getDay()], total: 0, date: d.toISOString().split('T')[0] }
        })

        // Fetch products count
        const productsSnap = await getDocs(collection(db, "products"))
        const productsCount = productsSnap.size

        // Fetch customers count
        const usersSnap = await getDocs(collection(db, "users"))
        const customersCount = usersSnap.size

        // Fetch orders
        const ordersRef = collection(db, "orders")
        const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"))
        const ordersSnap = await getDocs(ordersQuery)
        const ordersCount = ordersSnap.size
        
        let totalRevenue = 0
        const chartDataMap: Record<string, number> = {}

        const latestOrders: any[] = []
        ordersSnap.forEach((doc, index) => {
          const data = doc.data()
          totalRevenue += (data.total || 0)
          
          if (index < 6) {
            latestOrders.push({ id: doc.id, ...data })
          }

          // Group revenue by date for the chart
          if (data.createdAt) {
            const date = new Date(data.createdAt).toISOString().split('T')[0]
            chartDataMap[date] = (chartDataMap[date] || 0) + (data.total || 0)
          }
        })

        // Hydrate chart data
        const finalChartData = defaultChartData.map(day => ({
          ...day,
          total: chartDataMap[day.date] || 0
        }))

        setStats({
          revenue: totalRevenue,
          orders: ordersCount,
          products: productsCount,
          customers: customersCount
        })
        setRevenueData(finalChartData)
        setRecentOrders(latestOrders)
      } catch (error) {
        console.error("Error fetching dashboard data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    { title: t('admin.totalRevenue'), value: `SAR ${stats.revenue.toFixed(2)}`, icon: DollarSign, trend: ``, trendUp: true },
    { title: t('admin.totalOrders'), value: stats.orders.toString(), icon: ShoppingCart, trend: ``, trendUp: true },
    { title: t('admin.activeProducts'), value: stats.products.toString(), icon: Package, trend: ``, trendUp: true },
    { title: t('admin.totalCustomers'), value: stats.customers.toString(), icon: Users, trend: ``, trendUp: true },
  ]

  if (loading) {
    return <div className="flex h-64 items-center justify-center">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{t('admin.dashboardOverview')}</h2>
          <p className="text-muted-foreground mt-2 text-sm tracking-wide">{t('admin.welcomeBack')}</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-primary/20 backdrop-blur-md">
             {t('admin.systemStatus')}
           </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('admin.revenueOverview')}</CardTitle>
              <CardDescription>{t('admin.dailyRevenueDesc')}</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `SAR ${value}`}
                  />
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                     itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#D4AF37" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-3 border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm">
          <CardHeader>
            <CardTitle>{t('admin.recentOrders')}</CardTitle>
            <CardDescription>{t('admin.pendingOrdersDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                <p>No Data Yet</p>
                <p className="text-xs">Incoming orders will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6 mt-2">
                {recentOrders.map((order, index) => (
                  <div key={order.id || index} className="flex items-center group">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                       <span className="text-primary font-bold text-xs">O{index + 1}</span>
                    </div>
                    <div className="mx-4 space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors">Order #{order.id?.slice(-6).toUpperCase() || 'NEW'}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customerEmail || 'Guest'}
                      </p>
                    </div>
                    <div className="rtl:mr-auto ltr:ml-auto font-medium text-sm" dir="ltr">
                      +SAR {(order.total || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
