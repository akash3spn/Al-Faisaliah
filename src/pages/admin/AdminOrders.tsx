import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Package, Search, Filter, Phone, MapPin, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-provider"
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminOrders() {
  const { t, language } = useLanguage()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setOrders(ordersData)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error(language === 'ar' ? 'فشل إحضار الطلبات' : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus })
      toast.success(language === 'ar' ? 'تم تحديث حالة الطلب' : 'Order status updated')
      fetchOrders()
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error(language === 'ar' ? 'فشل التحديث' : 'Failed to update status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500'
      case 'processing': return 'bg-blue-500/10 text-blue-500'
      case 'shipped': return 'bg-purple-500/10 text-purple-500'
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500'
      case 'cancelled': return 'bg-red-500/10 text-red-500'
      default: return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('admin.orders')}</h2>
          <p className="text-muted-foreground mt-2 text-sm tracking-wide">
            {language === 'ar' ? 'إدارة طلبات العملاء والتتبع.' : 'Manage customer orders and tracking.'}
          </p>
        </div>
      </div>

      <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="relative w-full sm:w-72">
               <Search className="absolute rtl:right-2.5 ltr:left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input 
                 type="search" 
                 placeholder={t('admin.search')} 
                 className="rtl:pr-8 ltr:pl-8 bg-background/50 border-border/50 focus-visible:ring-primary"
               />
             </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
               <Package className="h-12 w-12 text-primary/30 mb-4" />
               <p className="text-lg font-medium text-foreground">{language === 'ar' ? 'لا يوجد طلبات بعد' : 'No orders yet'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                    <th className="px-6 py-4">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th className="px-6 py-4">{language === 'ar' ? 'الإجمالي' : 'Total'}</th>
                    <th className="px-6 py-4">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th className="px-6 py-4 text-center">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border/10 hover:bg-muted/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{order.id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold">SAR {Number(order.total || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <Select 
                          value={order.status} 
                          onValueChange={(value) => handleUpdateStatus(order.id, value)}
                        >
                          <SelectTrigger className={`h-8 w-[120px] text-xs font-bold uppercase tracking-wider border-none ${getStatusColor(order.status)}`}>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">PENDING</SelectItem>
                            <SelectItem value="processing">PROCESSING</SelectItem>
                            <SelectItem value="shipped">SHIPPED</SelectItem>
                            <SelectItem value="delivered">DELIVERED</SelectItem>
                            <SelectItem value="cancelled">CANCELLED</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 border border-primary/20 hover:bg-primary/10">
                              <Eye className="h-4 w-4 text-primary" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-card border-border/50 shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-xl flex items-center justify-between">
                                <span>{language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'} #{order.id.slice(-6).toUpperCase()}</span>
                                <Badge variant="outline" className={`border-none ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </Badge>
                              </DialogTitle>
                            </DialogHeader>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-semibold mb-2 text-primary">{language === 'ar' ? 'معلومات العميل' : 'Customer Info'}</h4>
                                  <div className="bg-muted/10 p-3 rounded-lg border border-border/50 text-sm space-y-2">
                                    <p><span className="text-muted-foreground">{language === 'ar' ? 'الاسم:' : 'Name:'}</span> {order.customerName}</p>
                                    <p><span className="text-muted-foreground">{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</span> {order.customerEmail}</p>
                                    <p className="flex items-center gap-2"><Phone className="w-3 h-3 text-muted-foreground" /> {order.customerPhone}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-semibold mb-2 text-primary">{language === 'ar' ? 'عنوان التوصيل' : 'Shipping Address'}</h4>
                                  <div className="bg-muted/10 p-3 rounded-lg border border-border/50 text-sm space-y-1">
                                    <p className="flex items-start gap-2"><MapPin className="w-3 h-3 text-muted-foreground mt-1 shrink-0" /> 
                                      <span>
                                        {order.shippingAddress?.address}, {order.shippingAddress?.apartment && `Apt ${order.shippingAddress.apartment}, `}
                                        {order.shippingAddress?.city}, {order.shippingAddress?.region}
                                      </span>
                                    </p>
                                    {order.shippingAddress?.postalCode && <p className="text-muted-foreground pl-5">{language === 'ar' ? 'الرمز البريدي:' : 'Postal:'} {order.shippingAddress.postalCode}</p>}
                                    <p className="text-muted-foreground pl-5">{language === 'ar' ? 'الدولة:' : 'Country:'} {order.shippingAddress?.country || 'Saudi Arabia'}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-semibold mb-2 text-primary">{language === 'ar' ? 'المنتجات' : 'Items'}</h4>
                                  <div className="bg-muted/10 p-3 rounded-lg border border-border/50 text-sm max-h-40 overflow-y-auto space-y-3">
                                    {(order.items || []).map((item: any, i: number) => (
                                      <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-black/40 rounded flex items-center justify-center shrink-0">
                                            {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded" /> : <Package className="w-4 h-4 text-muted-foreground" />}
                                          </div>
                                          <div>
                                            <p className="font-medium leading-tight">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                          </div>
                                        </div>
                                        <p className="font-bold">SAR {(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-semibold mb-2 text-primary">{language === 'ar' ? 'الدفع' : 'Payment'}</h4>
                                  <div className="bg-muted/10 p-3 rounded-lg border border-border/50 text-sm space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="uppercase font-bold tracking-widest text-xs">{language === 'ar' ? 'طريقة الدفع' : 'Method'}: {order.paymentMethod || 'cod'}</span>
                                      <span className="text-muted-foreground">{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}: SAR {Number(order.subtotal || order.total || 0).toFixed(2)}</span>
                                    </div>
                                    {order.discountAmount > 0 && (
                                      <div className="flex justify-between items-center text-primary text-xs">
                                        <span>{language === 'ar' ? 'الخصم' : 'Discount'} ({order.discountCode})</span>
                                        <span>- SAR {Number(order.discountAmount).toFixed(2)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                                      <span className="font-bold">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                                      <span className="font-bold text-lg text-primary">SAR {Number(order.total || 0).toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-8 border-t border-border/50 pt-4">
                              <h4 className="text-sm font-semibold mb-3">{language === 'ar' ? 'تحديث الحالة' : 'Update Status'}</h4>
                              <div className="flex flex-wrap gap-2">
                                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                  <Button 
                                    key={s} 
                                    size="sm" 
                                    variant={order.status === s ? 'default' : 'outline'}
                                    disabled={order.status === s}
                                    onClick={() => handleUpdateStatus(order.id, s)}
                                    className="uppercase tracking-wider text-[10px] font-bold"
                                  >
                                    {s}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
