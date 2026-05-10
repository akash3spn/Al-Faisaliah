import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Plus, Pencil, Trash, Image as ImageIcon } from "lucide-react"
import { collection, query, getDocs, addDoc, serverTimestamp, setDoc, doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useLanguage } from "@/lib/language-provider"

export default function AdminProducts() {
  const { t, language } = useLanguage()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    image: "",
    videoUrl: "",
    sku: "",
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    isFlashSale: false,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      category: "",
      price: "",
      discountPrice: "",
      stock: "",
      image: "",
      videoUrl: "",
      sku: "",
      isFeatured: false,
      isTrending: false,
      isNewArrival: false,
      isFlashSale: false,
    })
    setEditingId(null)
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "products"))
      const querySnapshot = await getDocs(q)
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setProducts(items)
    } catch (error) {
       console.error("Error fetching products", error)
       toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const productData = {
        title: formData.title,
        titleAr: formData.titleAr,
        description: formData.description,
        descriptionAr: formData.descriptionAr,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stock: parseInt(formData.stock) || 0,
        images: formData.image ? [formData.image] : [], // Simplified for demo, could handle multiple
        videoUrl: formData.videoUrl,
        sku: formData.sku,
        isFeatured: formData.isFeatured,
        isTrending: formData.isTrending,
        isNewArrival: formData.isNewArrival,
        isFlashSale: formData.isFlashSale,
        updatedAt: Date.now(),
      }

      if (editingId) {
         const existing = products.find(p => p.id === editingId)
         await setDoc(doc(db, "products", editingId), {
           ...existing,
           ...productData,
         })
         toast.success("Product updated successfully")
      } else {
         await addDoc(collection(db, "products"), {
           ...productData,
           createdAt: Date.now(),
         })
         toast.success("Product created successfully")
      }
      setIsDialogOpen(false)
      fetchProducts()
      resetForm()
    } catch (error: any) {
       console.error("Error saving product", error)
       toast.error(error.message || "Failed to save product")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await deleteDoc(doc(db, "products", id))
      toast.success("Product deleted successfully")
      fetchProducts()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product")
    }
  }

  const openEdit = (product: any) => {
    setEditingId(product.id)
    setFormData({
      title: product.title || "",
      titleAr: product.titleAr || "",
      description: product.description || "",
      descriptionAr: product.descriptionAr || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      discountPrice: product.discountPrice?.toString() || "",
      stock: product.stock?.toString() || "",
      image: product.images?.[0] || "",
      videoUrl: product.videoUrl || "",
      sku: product.sku || "",
      isFeatured: product.isFeatured || false,
      isTrending: product.isTrending || false,
      isNewArrival: product.isNewArrival || false,
      isFlashSale: product.isFlashSale || false,
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('admin.products')}</h2>
          <p className="text-muted-foreground mt-2 text-sm tracking-wide">{t('admin.manageInventory')}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
           setIsDialogOpen(open)
           if (!open) {
             setEditingId(null)
             setFormData({ title: "", description: "", category: "", price: "", stock: "", image: "" })
           }
        }}>
          <DialogTrigger className={buttonVariants({ className: "font-semibold gap-2" })}>
            <Plus className="h-4 w-4" /> {t('admin.addProduct')}
          </DialogTrigger>
          <DialogContent className={`max-w-2xl max-h-[85vh] overflow-y-auto ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
            <DialogHeader>
              <DialogTitle>{editingId ? t('admin.editProduct') : t('admin.addProduct')}</DialogTitle>
              <DialogDescription>
                {t('admin.productDetails')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Label>
                  <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleAr">{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Label>
                  <Input id="titleAr" value={formData.titleAr} onChange={e => setFormData({...formData, titleAr: e.target.value})} />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">{language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="descriptionAr">{language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
                  <Textarea id="descriptionAr" value={formData.descriptionAr} onChange={e => setFormData({...formData, descriptionAr: e.target.value})} rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">{t('admin.category')}</Label>
                  <Input id="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU / Barcode</Label>
                  <Input id="sku" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">{t('admin.price')}</Label>
                  <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">{language === 'ar' ? 'سعر الخصم' : 'Discount Price'}</Label>
                  <Input id="discountPrice" type="number" step="0.01" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">{t('admin.stock')}</Label>
                  <Input id="stock" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">{language === 'ar' ? 'رابط الفيديو' : 'Video URL'}</Label>
                  <Input id="videoUrl" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} placeholder="https://youtube.com/..."/>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image">{t('admin.imageUrl')}</Label>
                  <Input id="image" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash..." required/>
                   <p className="text-xs text-muted-foreground mt-1">Multi-image upload simulation (comma separated in future)</p>
                </div>

                <div className="md:col-span-2 mt-4 space-y-4 border-t border-border/50 pt-4">
                   <Label className="text-base font-semibold">{language === 'ar' ? 'حالة المنتج' : 'Product Status'}</Label>
                   <div className="grid grid-cols-2 gap-4">
                     <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all">
                       <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="accent-primary w-4 h-4" />
                       <span className="text-sm font-medium">{language === 'ar' ? 'ميز المنتج' : 'Featured Product'}</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all">
                       <input type="checkbox" checked={formData.isTrending} onChange={e => setFormData({...formData, isTrending: e.target.checked})} className="accent-primary w-4 h-4" />
                       <span className="text-sm font-medium">{language === 'ar' ? 'عرض כتريند' : 'Trending'}</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all">
                       <input type="checkbox" checked={formData.isNewArrival} onChange={e => setFormData({...formData, isNewArrival: e.target.checked})} className="accent-primary w-4 h-4" />
                       <span className="text-sm font-medium">{language === 'ar' ? 'وصل حديثاً' : 'New Arrival'}</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all">
                       <input type="checkbox" checked={formData.isFlashSale} onChange={e => setFormData({...formData, isFlashSale: e.target.checked})} className="accent-primary w-4 h-4" />
                       <span className="text-sm font-medium">{language === 'ar' ? 'تخفيضات سريعة' : 'Flash Sale'}</span>
                     </label>
                   </div>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" className="w-full sm:w-auto">{editingId ? t('admin.saveChanges') : t('admin.createProduct')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
             <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
               <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
               {t('admin.loading')}
             </div>
          ) : (
            <div className="relative w-full overflow-auto text-sm">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b border-border/50 bg-muted/20">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider rtl:text-right ltr:text-left">{t('admin.products')}</th>
                    <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider rtl:text-right ltr:text-left">{t('admin.category')}</th>
                    <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider rtl:text-left ltr:text-right">{t('admin.price')}</th>
                    <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider rtl:text-left ltr:text-right">{t('admin.stock')}</th>
                    <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider rtl:text-left ltr:text-right">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody className={`[&_tr:last-child]:border-0 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border/50 transition-colors hover:bg-primary/5 group">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted border border-border/50 flex items-center justify-center shrink-0">
                             {product.images?.[0] ? (
                               <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                             ) : (
                               <ImageIcon className="h-4 w-4 text-muted-foreground" />
                             )}
                          </div>
                          <span className="font-medium truncate max-w-[200px] group-hover:text-primary transition-colors">{product.title}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">{product.category}</td>
                      <td className="p-4 align-middle rtl:text-left ltr:text-right font-medium" dir="ltr">SAR {product.price?.toFixed(2)}</td>
                      <td className="p-4 align-middle rtl:text-left ltr:text-right">
                         <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'}`}>
                           {product.stock}
                         </span>
                      </td>
                      <td className="p-4 align-middle rtl:text-left ltr:text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(product)} className="hover:bg-primary/20 hover:text-primary">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/20" onClick={() => handleDelete(product.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                     <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                           {t('admin.noProducts')}
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
