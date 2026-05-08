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

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  })

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
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        images: formData.image ? [formData.image] : [],
        updatedAt: Date.now(),
      }

      if (editingId) {
         // get existing to preserve createdAt
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
      setFormData({ title: "", description: "", category: "", price: "", stock: "", image: "" })
      setEditingId(null)
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
      description: product.description || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      image: product.images?.[0] || "",
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground">Products</h2>
          <p className="text-muted-foreground mt-2 text-sm tracking-wide">Manage your inventory and catalog.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
           setIsDialogOpen(open)
           if (!open) {
             setEditingId(null)
             setFormData({ title: "", description: "", category: "", price: "", stock: "", image: "" })
           }
        }}>
          <DialogTrigger className={buttonVariants({ className: "font-semibold gap-2" })}>
            <Plus className="h-4 w-4" /> Add Product
          </DialogTrigger>
          <DialogContent className="max-w-2xl font-sans">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                Fill out the details for the product. It will be immediately available in the store.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Input id="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Price (SAR)</Label>
                  <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">Stock</Label>
                  <Input id="stock" type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">Image URL</Label>
                  <Input id="image" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="col-span-3" placeholder="https://images.unsplash..."/>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right mt-3">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="col-span-3" rows={4} required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{editingId ? "Save Changes" : "Create Product"}</Button>
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
               Loading premium inventory...
             </div>
          ) : (
            <div className="relative w-full overflow-auto text-sm">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b border-border/50 bg-muted/20">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider text-left">Product</th>
                    <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider text-left">Category</th>
                    <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider text-right">Price</th>
                    <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider text-right">Stock</th>
                    <th className="h-12 px-4 align-middle font-semibold text-muted-foreground uppercase text-xs tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0 font-sans">
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
                      <td className="p-4 align-middle text-right font-medium">SAR {product.price?.toFixed(2)}</td>
                      <td className="p-4 align-middle text-right">
                         <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'}`}>
                           {product.stock}
                         </span>
                      </td>
                      <td className="p-4 align-middle text-right">
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
                           No products found. Click "Add Product" to create one.
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
