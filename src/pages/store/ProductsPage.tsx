import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Filter, ArrowDownUp } from "lucide-react"
import { collection, query, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { Link, useSearchParams } from "react-router-dom"
import { useCart } from "@/lib/CartContext"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"))
        const querySnapshot = await getDocs(q)
        let items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        if (searchQuery) {
          items = items.filter(item => 
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }
        
        setProducts(items)
      } catch (error) {
        console.error("Error fetching products", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [searchQuery])

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-serif font-bold tracking-tight">All Products</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-none gap-2 font-medium">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" className="rounded-none gap-2 font-medium">
              <ArrowDownUp className="h-4 w-4" /> Sort By
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="border-none bg-background rounded-none shadow-sm hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-0 relative">
                  <div className="overflow-hidden relative aspect-[4/5] bg-muted">
                    <img 
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400"} 
                      alt={product.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/80 to-transparent">
                      <Button 
                        className="w-full bg-primary text-primary-foreground hover:bg-white hover:text-black rounded-none"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 text-center space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.category}</p>
                    <Link to={`/products/${product.id}`} className="hover:text-primary transition-colors block">
                      <h3 className="font-serif font-medium text-lg leading-tight line-clamp-2">{product.title}</h3>
                    </Link>
                    <div className="flex justify-center items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < (product.rating || 5) ? 'fill-primary text-primary' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-primary font-semibold text-lg pt-2 mt-auto">SAR {Number(product.price || 0).toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {products.length === 0 && (
              <div className="col-span-full py-24 text-center">
                 <p className="text-muted-foreground text-lg">No products found. Please check back later.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
