import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useLanguage } from "@/lib/language-provider"
import { doc, getDoc, collection, query, where, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { useCart } from "@/lib/CartContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronRight, 
  Star, 
  Truck, 
  ShieldCheck, 
  ArrowLeft,
  ZoomIn,
  X
} from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    fetchProductDetails()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  const fetchProductDetails = async () => {
    if (!id) return
    setLoading(true)
    try {
      const docRef = doc(db, "products", id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const productData: any = { id: docSnap.id, ...docSnap.data() }
        setProduct(productData)
        fetchRelatedProducts(productData.category, docSnap.id)
      } else {
        setProduct(null)
      }
    } catch (error) {
      console.error("Error fetching product", error)
      toast.error(language === 'ar' ? 'فشل تحميل المنتج' : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (category: string, currentProductId: string) => {
    try {
      const q = query(
        collection(db, "products"),
        where("category", "==", category),
        limit(5)
      )
      const querySnapshot = await getDocs(q)
      const products = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.id !== currentProductId)
        .slice(0, 4)
      setRelatedProducts(products)
    } catch (error) {
      console.error("Error fetching related products", error)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: Array.isArray(product.images) ? product.images[0] : product.image || "https://placehold.co/400",
        quantity: 1
      });
      toast.success(language === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart')
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: Array.isArray(product.images) ? product.images[0] : product.image || "https://placehold.co/400",
        quantity: 1
      });
      navigate('/checkout')
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePosition({ x, y })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.title || 'Product',
        url: window.location.href
      })
    } catch (error) {
      navigator.clipboard.writeText(window.location.href)
      toast.success(language === 'ar' ? 'تم نسخ الرابط' : 'Link copied to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
        <div className="flex gap-2 text-sm text-muted-foreground mb-8">
          <div className="h-4 bg-muted rounded w-16"></div>
          <div>/</div>
          <div className="h-4 bg-muted rounded w-24"></div>
          <div>/</div>
          <div className="h-4 bg-muted rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-xl w-full"></div>
            <div className="flex gap-4">
              <div className="h-20 w-20 bg-muted rounded-md"></div>
              <div className="h-20 w-20 bg-muted rounded-md"></div>
              <div className="h-20 w-20 bg-muted rounded-md"></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded w-1/3"></div>
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
            <div className="flex gap-4 pt-6">
              <div className="h-12 bg-muted rounded flex-1"></div>
              <div className="h-12 bg-muted rounded flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-7xl text-center">
        <h1 className="text-3xl font-bold mb-4">{language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}</h1>
        <p className="text-muted-foreground mb-8">{language === 'ar' ? 'عذراً، المنتج الذي تبحث عنه غير موجود أو تم حذفه.' : 'Sorry, the product you are looking for does not exist or has been removed.'}</p>
        <Button onClick={() => navigate('/products')} variant="default" className="font-bold tracking-widest">
          {language === 'ar' ? 'العودة للمتجر' : 'RETURN TO STORE'}
        </Button>
      </div>
    )
  }

  // Handle images array or fallback to single image
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image || "https://placehold.co/600x600?text=No+Image"]

  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <div className={`container mx-auto px-4 py-8 max-w-7xl ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-primary transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
        <ChevronRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
        <Link to="/products" className="hover:text-primary transition-colors">{language === 'ar' ? 'المنتجات' : 'Products'}</Link>
        <ChevronRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16 relative">
        {/* Gallery Section */}
        <div className="flex flex-col-reverse md:flex-row gap-4 md:sticky md:top-24 h-max">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[600px] pb-2 md:pb-0 hide-scrollbar mask-thumbnails">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${idx === activeImageIndex ? 'border-primary shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'border-transparent hover:border-primary/50'}`}
                >
                  <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="flex-1 relative aspect-[4/5] sm:aspect-square bg-muted/20 rounded-xl overflow-hidden border border-border/50 group">
            {discountPercentage > 0 && (
              <Badge className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground font-bold text-sm pointer-events-none">
                {language === 'ar' ? `خصم ${discountPercentage}%` : `-${discountPercentage}%`}
              </Badge>
            )}
            
            <div 
              className="absolute inset-0 cursor-zoom-in overflow-hidden"
              onClick={() => setIsModalOpen(true)}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => {
                setIsZoomed(false)
                setMousePosition({ x: 50, y: 50 })
              }}
              onMouseMove={handleMouseMove}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={images[activeImageIndex]}
                  alt={product.title}
                  className={`w-full h-full object-contain p-4 transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                  style={isZoomed ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    objectFit: 'cover'
                  } : {}}
                />
              </AnimatePresence>
            </div>
            
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute bottom-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col h-full font-sans">
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-primary font-bold tracking-widest text-xs sm:text-sm uppercase mb-1 sm:mb-2">{product.brand || product.category || 'Al-Faisaliah'}</p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-2 sm:mb-4">{product.title}</h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full shrink-0" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full shrink-0 hover:text-red-500 hover:border-red-500 transition-colors">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 text-primary">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-primary" />
                ))}
                <span className="text-foreground ml-1 font-medium">5.0</span>
              </div>
              <span>|</span>
              <span>SKU: {product.sku || product.id.substring(0, 8).toUpperCase()}</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl sm:text-4xl font-bold text-primary">SAR {Number(product.price).toFixed(2)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through mb-1">
                  SAR {Number(product.compareAtPrice).toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'السعر يشمل ضريبة القيمة المضافة' : 'Price includes VAT'}
            </p>
          </div>

          <Separator className="my-6" />

          {/* Availability */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2 font-medium">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-destructive'}`}></div>
              {product.stock > 0 
                ? (language === 'ar' ? 'متوفر في المخزون' : 'In Stock & Ready to Ship') 
                : (language === 'ar' ? 'نفذت الكمية' : 'Out of Stock')
              }
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg border border-border/50">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{language === 'ar' ? 'توصيل سريع' : 'Fast Delivery'}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{language === 'ar' ? 'خلال ٢-٤ أيام عمل' : 'Within 2-4 business days'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{language === 'ar' ? 'ضمان المنتج' : 'Warranty'}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{language === 'ar' ? 'ضمان لمدة سنة' : '1 Year Guarantee'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-auto">
            <Button 
              size="lg" 
              className="w-full text-base font-bold py-6 uppercase tracking-widest bg-primary text-black hover:bg-primary/90"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              {language === 'ar' ? 'اشتري الآن' : 'Buy Now'}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full text-base font-bold py-6 uppercase tracking-widest bg-background hover:bg-muted"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
            </Button>
          </div>

          <Separator className="my-8" />

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">{language === 'ar' ? 'تفاصيل المنتج' : 'Product Details'}</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description || (language === 'ar' ? 'لا يوجد تفاصيل إضافية لهذا المنتج.' : 'No additional details available for this product.')}
            </div>
            
            {/* Product Specifications Table */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">{language === 'ar' ? 'المواصفات' : 'Specifications'}</h3>
              <div className="border rounded-lg overflow-hidden divide-y divide-border">
                <div className="grid grid-cols-3">
                  <div className="p-3 bg-muted/50 font-medium text-sm">{language === 'ar' ? 'العلامة التجارية' : 'Brand'}</div>
                  <div className="p-3 col-span-2 text-sm">{product.brand || 'Al-Faisaliah'}</div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-3 bg-muted/50 font-medium text-sm">{language === 'ar' ? 'الفئة' : 'Category'}</div>
                  <div className="p-3 col-span-2 text-sm uppercase">{product.category}</div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-3 bg-muted/50 font-medium text-sm">{language === 'ar' ? 'رمز المنتج' : 'SKU'}</div>
                  <div className="p-3 col-span-2 text-sm font-mono">{product.sku || product.id.substring(0, 8).toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 pt-12 border-t border-primary/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {language === 'ar' ? 'منتجات ذات صلة' : 'You May Also Like'}
            </h2>
            <Link to={`/products?category=${product.category}`} className="text-primary text-sm font-bold uppercase tracking-widest hover:underline flex items-center gap-1 group">
              {language === 'ar' ? 'عرض الكل' : 'View All'}
              <ArrowRight className={`h-4 w-4 transition-transform ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div key={p.id} className="group cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-muted border border-border/50">
                  <img 
                    src={Array.isArray(p.images) ? p.images[0] : p.image || "https://placehold.co/400"} 
                    alt={p.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" className="font-bold shadow-lg" onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        image: Array.isArray(p.images) ? p.images[0] : p.image || "https://placehold.co/400",
                        quantity: 1
                      });
                      toast.success(language === 'ar' ? 'تمت الإضافة' : 'Added');
                    }}>
                      {language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base line-clamp-1 mb-1 group-hover:text-primary transition-colors">{p.title}</h3>
                  <div className="flex gap-2 items-center">
                    <span className="font-bold text-primary">SAR {Number(p.price).toFixed(2)}</span>
                    {p.compareAtPrice > p.price && (
                      <span className="text-xs text-muted-foreground line-through">SAR {Number(p.compareAtPrice).toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => setIsModalOpen(false)}
          >
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-4 right-4 rounded-full z-50 bg-background/50 hover:bg-background/80 backdrop-blur-sm border-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={images[activeImageIndex]} 
                alt={product.title} 
                className="w-full h-full object-contain"
              />
              
              {/* Optional: Add navigation inside modal if there are multiple images */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
                  {images.map((img: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${idx === activeImageIndex ? 'bg-primary w-4' : 'bg-primary/30 hover:bg-primary/50'}`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
