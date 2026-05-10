import React, { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-provider"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Ticket, Search, Plus, Trash2, Edit2, Percent } from "lucide-react"

interface DiscountCode {
  id?: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
}

export default function AdminDiscounts() {
  const { language } = useLanguage()
  const [discounts, setDiscounts] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    active: boolean;
  }>({
    code: "",
    type: "percentage",
    value: 0,
    active: true,
  })

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, "discount_codes"))
      const discountsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as DiscountCode)
      setDiscounts(discountsData)
    } catch (error) {
      console.error("Error fetching discounts", error)
      toast.error(language === 'ar' ? 'فشل تحميل كوبونات الخصم' : 'Failed to load discount codes')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code || formData.value <= 0) {
      toast.error(language === 'ar' ? 'الرجاء إدخال كود صحيح وقيمة' : 'Please enter a valid code and value')
      return
    }

    try {
      const formattedData = {
        code: formData.code.toUpperCase().trim(),
        type: formData.type,
        value: Number(formData.value),
        active: formData.active
      }

      if (editingId) {
        await updateDoc(doc(db, "discount_codes", editingId), formattedData)
        toast.success(language === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully')
      } else {
        await addDoc(collection(db, "discount_codes"), formattedData)
        toast.success(language === 'ar' ? 'تم الإضافة بنجاح' : 'Added successfully')
      }

      setIsModalOpen(false)
      setFormData({ code: "", type: "percentage", value: 0, active: true })
      setEditingId(null)
      fetchDiscounts()
    } catch (error) {
      console.error("Error saving discount", error)
      toast.error(language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving discount code')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الكوبون؟' : 'Are you sure you want to delete this discount code?')) {
      try {
        await deleteDoc(doc(db, "discount_codes", id))
        toast.success(language === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully')
        fetchDiscounts()
      } catch (error) {
        console.error("Error deleting discount", error)
        toast.error(language === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error deleting discount code')
      }
    }
  }

  const handleEdit = (discount: DiscountCode) => {
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      active: discount.active
    })
    setEditingId(discount.id!)
    setIsModalOpen(true)
  }

  const toggleActive = async (discount: DiscountCode) => {
    try {
      await updateDoc(doc(db, "discount_codes", discount.id!), {
        active: !discount.active
      })
      toast.success(language === 'ar' ? 'تم تحديث الحالة' : 'Status updated')
      fetchDiscounts()
    } catch (error) {
      console.error("Error toggling status", error)
      toast.error(language === 'ar' ? 'فشل تحديث الحالة' : 'Failed to update status')
    }
  }

  const filteredDiscounts = discounts.filter(d => 
    d.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{language === 'ar' ? 'كوبونات الخصم' : 'Discount Codes'}</h2>
          <p className="text-muted-foreground">{language === 'ar' ? 'إدارة كوبونات الخصم والعروض' : 'Manage your store discount codes.'}</p>
        </div>
        <Button onClick={() => {
          setEditingId(null)
          setFormData({ code: "", type: "percentage", value: 0, active: true })
          setIsModalOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" /> 
          {language === 'ar' ? 'إضافة كوبون' : 'Add Discount Code'}
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={language === 'ar' ? 'ابحث عن كوبون...' : 'Search discount codes...'} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card border rounded-lg shadow-sm">
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">{language === 'ar' ? 'الكود' : 'Code'}</th>
                  <th className="px-6 py-4 font-medium">{language === 'ar' ? 'النوع' : 'Type'}</th>
                  <th className="px-6 py-4 font-medium">{language === 'ar' ? 'القيمة' : 'Value'}</th>
                  <th className="px-6 py-4 font-medium">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-4 font-medium text-right">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></td></tr>
                ) : filteredDiscounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Ticket className="h-8 w-8 opacity-20" />
                        <p>{language === 'ar' ? 'لا توجد كوبونات' : 'No discount codes found'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDiscounts.map((discount) => (
                    <tr key={discount.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-bold tracking-widest">{discount.code}</td>
                      <td className="px-6 py-4 uppercase text-xs">
                        {discount.type === 'percentage' ? (language === 'ar' ? 'نسبة مئوية' : 'Percentage') : (language === 'ar' ? 'مبلغ ثابت' : 'Fixed Amount')}
                      </td>
                      <td className="px-6 py-4">
                        {discount.type === 'percentage' ? `${discount.value}%` : `SAR ${discount.value}`}
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant={discount.active ? "default" : "secondary"} 
                          size="sm" 
                          onClick={() => toggleActive(discount)}
                          className={discount.active ? "bg-emerald-500 hover:bg-emerald-600 font-bold" : ""}
                        >
                          {discount.active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                        </Button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(discount)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-white" onClick={() => handleDelete(discount.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4">
              {editingId 
                ? (language === 'ar' ? 'تعديل كوبون' : 'Edit Discount Code') 
                : (language === 'ar' ? 'إضافة كوبون' : 'Add Discount Code')}
            </h3>
            
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  {language === 'ar' ? 'رمز الكوبون' : 'Discount Code'}
                </label>
                <Input 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. SUMMER20"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  {language === 'ar' ? 'نوع الخصم' : 'Discount Type'}
                </label>
                <div className="flex gap-4">
                  <div 
                    className={`flex-1 p-3 border rounded-lg cursor-pointer text-center ${formData.type === 'percentage' ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                    onClick={() => setFormData({...formData, type: 'percentage'})}
                  >
                    {language === 'ar' ? 'نسبة مئوية' : 'Percentage'}
                  </div>
                  <div 
                    className={`flex-1 p-3 border rounded-lg cursor-pointer text-center ${formData.type === 'fixed' ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                    onClick={() => setFormData({...formData, type: 'fixed'})}
                  >
                    {language === 'ar' ? 'مبلغ ثابت' : 'Fixed Amount'}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  {language === 'ar' ? 'القيمة' : 'Value'}
                </label>
                <div className="relative">
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.value || ''} 
                    onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
                    placeholder="20"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {formData.type === 'percentage' ? '%' : 'SAR'}
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.active} 
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button type="submit" className="flex-1">
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
