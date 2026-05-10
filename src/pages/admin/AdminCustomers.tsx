import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Users, Search, Filter, Phone, MapPin, Mail, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-provider"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function AdminCustomers() {
  const { t, language } = useLanguage()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCustomers(usersData)
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast.error(language === 'ar' ? 'فشل إحضار العملاء' : 'Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  return (
    <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('admin.customers')}</h2>
          <p className="text-muted-foreground mt-2 text-sm tracking-wide">
            {language === 'ar' ? 'عرض وإدارة حسابات العملاء الخاصة بك.' : 'View and manage your customer accounts.'}
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
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
               <Users className="h-12 w-12 text-primary/30 mb-4" />
               <p className="text-lg font-medium text-foreground">{language === 'ar' ? 'لم يتم العثور على عملاء' : 'No customers found'}</p>
               <p className="max-w-md mt-2 text-sm">
                 {language === 'ar' 
                   ? 'ستظهر بيانات العملاء هنا عندما يقوم المستخدمون بإنشاء حسابات على الموقع.' 
                   : 'Customer data will populate here when users create accounts on the site.'}
               </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                    <th className="px-6 py-4">{language === 'ar' ? 'بيانات الاتصال' : 'Contact Data'}</th>
                    <th className="px-6 py-4">{language === 'ar' ? 'الدور' : 'Role'}</th>
                    <th className="px-6 py-4">{language === 'ar' ? 'تاريخ الانضمام' : 'Joined'}</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-border/10 hover:bg-muted/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center shrink-0">
                            {customer.profilePicUrl ? (
                              <img src={customer.profilePicUrl} alt="" className="w-full h-full object-cover rounded" />
                            ) : (
                              <Users className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{customer.fullName || 'User'}</p>
                            <p className="text-xs text-muted-foreground font-mono">{customer.id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-xs">
                            <Mail className="w-3 h-3 text-muted-foreground" /> {customer.email || 'N/A'}
                          </p>
                          {customer.phone && (
                            <p className="flex items-center gap-2 text-xs">
                              <Phone className="w-3 h-3 text-muted-foreground" /> {customer.phone}
                            </p>
                          )}
                          {(customer.city || customer.country) && (
                            <p className="flex items-center gap-2 text-xs">
                              <MapPin className="w-3 h-3 text-muted-foreground" /> 
                              {[customer.city, customer.country].filter(Boolean).join(', ')}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`capitalize border-none ${customer.role === 'customer' ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary'}`}>
                          {customer.role || 'user'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown'}
                        </div>
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
