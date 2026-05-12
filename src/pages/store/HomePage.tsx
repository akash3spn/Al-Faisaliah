import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, ShoppingBag, ShieldCheck, Clock, MapPin, Search } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useLanguage } from "@/lib/language-provider"
import { useCart } from "@/lib/CartContext"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase/client"

export default function HomePage() {
  const { t, language, dir } = useLanguage()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  const [trendingProducts, setTrendingProducts] = useState<any[]>([])
  const [loadingTrending, setLoadingTrending] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "products"), where("isTrending", "==", true))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      // Sort by createdAt desc in JS to avoid index requirements
      products.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0))
      setTrendingProducts(products)
      setLoadingTrending(false)
    }, (error) => {
      console.error("Error fetching trending products:", error)
      setLoadingTrending(false)
    })

    return () => unsubscribe()
  }, [])

  // Timer logic for flash sale
  const [targetDate, setTargetDate] = useState(() => {
    const saved = localStorage.getItem('flashSaleTargetDate')
    if (saved) return new Date(saved)
    const date = new Date()
    date.setHours(date.getHours() + 8)
    return date
  })

  const [timeLeft, setTimeLeft] = useState({ hrs: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance < 0) {
        return { hrs: 0, mins: 0, secs: 0 }
      }

      return {
        hrs: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + Math.floor(distance / (1000 * 60 * 60 * 24)) * 24,
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const newDate = new Date(e.target.value)
    setTargetDate(newDate)
    localStorage.setItem('flashSaleTargetDate', newDate.toISOString())
  }

  const toLocalISOString = (date: Date) => {
    const tzoffset = date.getTimezoneOffset() * 60000;
    return (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: language === 'ar' ? 'مؤسسة الفيصلية' : 'Al-Faisaliah Store',
          text: language === 'ar' ? 'اكتشف منتجاتنا الفاخرة!' : 'Check out our premium products!',
          url: window.location.origin,
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success(language === 'ar' ? 'تم نسخ الرابط بنجاح' : 'Link copied to clipboard!');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // User cancelled the share, do nothing
        return;
      }
      console.error('Error sharing:', error);
      // Fallback to clipboard if sharing fails for other reasons
      try {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success(language === 'ar' ? 'تم نسخ الرابط بنجاح' : 'Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard fallback also failed:', clipboardError);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-12 rtl:left-8 ltr:right-8 z-50 flex flex-col gap-3">
        <a 
          href="https://wa.me/966508073944" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-white/20 hover:scale-110 transition-transform"
          aria-label="Contact us on WhatsApp"
        >
          <div className="w-6 h-6 border-2 border-white rounded-bl-lg relative">
            <div className="absolute -right-1 -top-1 w-2 h-2 bg-white rounded-full"></div>
          </div>
        </a>
        <div 
          onClick={handleShare}
          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-white/20 hover:scale-110 transition-transform cursor-pointer"
        >
          <span className="text-black font-black text-xl leading-none">?</span>
        </div>
      </div>

      {/* Main Content Layout (Bento Grid) */}
      <main className="flex-grow p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 md:auto-rows-[160px] gap-4 max-w-[1600px] mx-auto w-full">
        
        {/* Mobile Search Bar */}
        <div className="md:hidden col-span-1 border border-primary/20 rounded-xl overflow-hidden relative mb-2">
          <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); const query = formData.get('search'); if (query) navigate(`/products?search=${query}`) }} className="relative bg-[#111]">
            <input 
              name="search"
              type="text" 
              placeholder={language === 'ar' ? 'البحث عن منتجات...' : 'Search products...'}
              className="bg-transparent text-white text-sm px-12 py-4 w-full focus:outline-none focus:bg-[#1a1a1a] transition-colors"
            />
            <Search className="h-5 w-5 text-primary/70 absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Hero Section (Promotional Slider) */}
        <div className="md:col-span-6 md:row-span-4 bg-[#111] border border-primary/30 rounded-2xl relative overflow-hidden group min-h-[400px]">
          <Carousel
            plugins={[plugin.current]}
            className="w-full h-full absolute inset-0"
            opts={{ loop: true, direction: dir }}
          >
            <CarouselContent className="h-full">
              <CarouselItem className="w-full h-full relative block">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-primary/10 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1601524909162-ae8725290836?q=80&w=1200&auto=format&fit=crop" 
                  alt="Premium Electronics" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute bottom-8 rtl:right-8 ltr:left-8 z-20 rtl:pl-8 ltr:pr-8">
                  <span className="inline-block px-3 py-1 bg-primary text-black text-[10px] font-bold mb-4 rounded-full uppercase tracking-tighter italic">
                    {language === 'ar' ? 'وصل حديثاً' : 'New Arrival'}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-light mb-2 leading-tight text-white">
                    {language === 'ar' ? 'الأجهزة الذكية' : 'Premium'} <br/>
                    <span className="font-black text-primary">{language === 'ar' ? 'الفاخرة' : 'Smart Devices'}</span>
                  </h2>
                  <p className="text-gray-400 max-w-md text-sm mb-6 leading-relaxed">
                    {language === 'ar' 
                      ? 'استمتع بتجربة الابتكار مع مجموعتنا المختارة بعناية من الإلكترونيات الراقية. جودة تتحدث عن نفسها.' 
                      : 'Experience the pinnacle of innovation with our curated selection of high-end electronics. Quality that speaks for itself.'}
                  </p>
                  <Button className="px-8 py-6 bg-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all rounded-sm">{t('home.shopNow')}</Button>
                </div>
              </CarouselItem>
              <CarouselItem className="w-full h-full relative block">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-primary/10 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop" 
                  alt="Premium Toys" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute bottom-8 rtl:right-8 ltr:left-8 z-20 rtl:pl-8 ltr:pr-8">
                  <span className="inline-block px-3 py-1 bg-primary text-black text-[10px] font-bold mb-4 rounded-full uppercase tracking-tighter italic">
                    {language === 'ar' ? 'مجموعة الأطفال' : 'Kids Collection'}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-light mb-2 leading-tight text-white">
                    {language === 'ar' ? 'فرحة' : 'Joy for'} <br/>
                    <span className="font-black text-primary">{language === 'ar' ? 'الأطفال والصغار' : 'Kids & Toddlers'}</span>
                  </h2>
                  <p className="text-gray-400 max-w-md text-sm mb-6 leading-relaxed">
                    {language === 'ar'
                      ? 'ألعاب تعليمية عالية الجودة تم اختيارها بعناية لأطفالك الصغار. امنحهم الأفضل دائمًا.'
                      : 'Educational and high-quality toys carefully selected for your little ones. Give them the best.'}
                  </p>
                  <Button className="px-8 py-6 bg-primary text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all rounded-sm">{t('home.shopNow')}</Button>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          
          {/* Abstract Tech Visuals for overlay flair */}
          <div className="absolute top-1/2 rtl:-left-12 ltr:-right-12 transform -translate-y-1/2 w-80 h-80 border-[20px] border-primary/10 rounded-full z-10 pointer-events-none"></div>
          <div className="absolute top-1/2 rtl:left-12 ltr:right-12 transform -translate-y-1/2 w-60 h-60 border-[2px] border-primary/20 rounded-full z-10 pointer-events-none"></div>
        </div>

        {/* Category: Security Systems */}
        <Link to="/categories/security" className="md:col-span-3 md:row-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-primary/50 transition-colors min-h-[200px]">
          <div>
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/40 mb-4 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            <h3 className="text-lg font-bold text-white">
              {language === 'ar' ? 'أنظمة الأمان' : 'Security Systems'}
            </h3>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
              {language === 'ar' ? 'كاميرات مراقبة وحماية ذكية' : 'CC Cameras & Smart Protection'}
            </p>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-xs text-primary group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform">
               {language === 'ar' ? '<- استكشف' : 'Explore ->'}
            </span>
            <div className={`w-12 h-12 border-t border-primary/20 ${language === 'ar' ? 'border-r rounded-tr-xl' : 'border-l rounded-tl-xl'}`}></div>
          </div>
        </Link>

        {/* Category: Kids Collection */}
        <Link to="/categories/toys" className="md:col-span-3 md:row-span-2 bg-white text-black border border-primary/30 rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative group hover:bg-gray-50 transition-colors min-h-[200px]">
          <div className="z-10">
            <h3 className="text-lg font-black text-black">
              {language === 'ar' ? 'عالم الأطفال' : 'Kids World'}
            </h3>
            <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest">
              {language === 'ar' ? 'دمى، سيارات وألعاب ذكية' : 'Dolls, Cars & Smart Toys'}
            </p>
          </div>
          <div className="z-10">
            <button className={`text-[10px] font-bold border-black pb-1 uppercase tracking-tighter ${language === 'ar' ? 'border-b-2 text-right w-fit' : 'border-b-2 text-left w-fit'}`}>
              {language === 'ar' ? 'عرض المتجر' : 'View Store'}
            </button>
          </div>
          <div className={`absolute ${language === 'ar' ? '-left-4' : '-right-4'} -bottom-4 w-28 h-28 bg-gray-100 rounded-full opacity-50 group-hover:scale-110 transition-transform`}></div>
        </Link>

        {/* Flash Sale Timer */}
        <div className="md:col-span-6 md:row-span-2 relative group min-h-[200px]">
          <div className="w-full h-full bg-[#D7B53A] text-black rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-[0.3em] mb-1">{t('home.flashSale')}</span>
              <h4 className="text-3xl lg:text-4xl font-black">
                 {language === 'ar' ? 'خصم حتى 60%' : 'UP TO 60% OFF'}
              </h4>
              <Button 
                className="mt-4 self-start bg-black text-[#D7B53A] hover:bg-white hover:text-black font-bold uppercase tracking-widest text-[10px] px-6 rounded-sm"
                onClick={() => navigate('/products')}
              >
                 {language === 'ar' ? 'احصل على العرض' : 'Grab Deal'}
              </Button>
            </div>
            <div className="flex gap-2 sm:gap-3" dir="ltr">
              <div className="flex flex-col items-center bg-black/10 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-black/10 min-w-[60px]">
                <span className="text-2xl sm:text-4xl font-bold font-mono tracking-tighter">{timeLeft.hrs.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">HRS</span>
              </div>
              <div className="flex flex-col items-center bg-black/10 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-black/10 min-w-[60px]">
                <span className="text-2xl sm:text-4xl font-bold font-mono tracking-tighter">{timeLeft.mins.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">MIN</span>
              </div>
              <div className="flex flex-col items-center bg-black/10 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-black/10 min-w-[60px]">
                <span className="text-2xl sm:text-4xl font-bold font-mono tracking-tighter">{timeLeft.secs.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase font-bold mt-1 tracking-wider">SEC</span>
              </div>
            </div>
          </div>
          
          {/* Admin Date Control visible on hover */}
          <div className="absolute -bottom-8 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity flex justify-center z-20 pointer-events-none group-hover:pointer-events-auto">
            <div className="bg-black/90 border border-white/20 px-3 py-2 rounded-lg flex items-center gap-2 shadow-xl backdrop-blur-md">
              <span className="text-[10px] text-[#D7B53A] font-bold uppercase tracking-wider">Admin Ends:</span>
              <input 
                type="datetime-local" 
                value={toLocalISOString(targetDate)} 
                onChange={handleDateChange} 
                className="bg-transparent text-white text-xs outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Admin Insights / Store Info snippet */}
        <div className="md:col-span-4 md:row-span-2 bg-[#111] border border-white/10 rounded-2xl p-5 flex flex-col justify-between min-h-[200px]">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {language === 'ar' ? 'الثقة والجودة' : 'Trust & Quality'}
            </h5>
            <div className="flex gap-1">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs text-gray-300 flex items-center gap-2"><Clock className="w-3 h-3 text-primary"/> {language === 'ar' ? 'توصيل سريع' : 'Fast Delivery'}</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase">{language === 'ar' ? 'خلال 24 ساعة' : 'Within 24h'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs text-gray-300 flex items-center gap-2"><ShoppingBag className="w-3 h-3 text-primary"/> {language === 'ar' ? 'دفع آمن' : 'Secure Checkout'}</span>
                <span className="text-[9px] font-bold text-primary uppercase">{language === 'ar' ? 'آمن 100%' : '100% Safe'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs text-gray-300 flex items-center gap-2"><MapPin className="w-3 h-3 text-primary"/> {language === 'ar' ? 'موقع الفرع' : 'Store Location'}</span>
                <span className="text-[9px] font-bold text-white uppercase">{language === 'ar' ? 'مدينة طريف' : 'Turaif City'}</span>
              </div>
          </div>
        </div>

        {/* Store Contact/Location */}
        <div className="md:col-span-2 md:row-span-2 bg-gradient-to-t from-black to-[#1a1a1a] border border-primary/20 rounded-2xl p-5 flex flex-col justify-between min-h-[200px]">
          <div className="space-y-1">
            <p className="text-[9px] text-primary uppercase font-bold tracking-widest">{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</p>
            <p className="text-xs font-medium text-white" dir="ltr">+966 508073944</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] text-primary uppercase font-bold tracking-widest">{language === 'ar' ? 'أين تجدنا' : 'Find Us'}</p>
            <p className="text-xs font-medium leading-tight text-gray-300">{language === 'ar' ? 'مدينة طريف،' : 'Turaif City,'} <br/>{language === 'ar' ? 'الحدود الشمالية،' : 'Northern Borders,'}<br/>{language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</p>
          </div>
        </div>

        {/* Newsletter Subscription (New Bento Block) */}
        <div className="md:col-span-6 md:row-span-2 bg-[#1a1a1a] border border-primary/20 rounded-2xl p-6 flex flex-col justify-center gap-4 min-h-[200px] relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none -left-full group-hover:left-0 transition-all duration-1000"></div>
           <div className="z-20 relative">
              <h3 className="text-xl font-bold tracking-tight text-white uppercase">{language === 'ar' ? 'انضم إلى' : 'Join The'} <span className="text-primary italic">{language === 'ar' ? 'الأسرة' : 'Club'}</span></h3>
              <p className="text-[10px] text-primary/80 uppercase tracking-widest mt-1 mb-4">{language === 'ar' ? 'اشترك للحصول على عروض حصرية' : 'Subscribe for exclusive offers'}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'YOUR EMAIL'}
                  className="bg-black/50 border border-white/10 text-white placeholder:text-white/30 px-4 py-2 w-full text-xs focus:outline-none focus:border-primary rounded"
                />
                <Button className="bg-primary text-black hover:bg-white text-[10px] font-bold uppercase tracking-widest px-6 rounded">
                  {language === 'ar' ? 'اشترك' : 'Subscribe'}
                </Button>
              </div>
           </div>
        </div>
      </main>

      {/* Trending Products */}
      <section className="p-4 md:p-6 max-w-[1600px] mx-auto w-full mt-8">
        <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-light text-white uppercase tracking-wider">{language === 'ar' ? 'الأكثر' : 'Trending'} <span className="font-bold text-primary">{language === 'ar' ? 'رواجاً الآن' : 'Now'}</span></h2>
            <p className="text-muted-foreground uppercase text-[10px] tracking-[0.2em] mt-1">{language === 'ar' ? 'المنتجات الأكثر طلباً هذا الأسبوع' : 'Most desired items this week'}</p>
          </div>
          <Link to="/products" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-white transition-colors">
            {t('home.viewAll')} {language === 'ar' ? '<-' : '->'}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loadingTrending ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse border border-white/5 bg-[#0a0a0a]">
                <div className="aspect-square bg-white/10 w-full" />
                <div className="p-4 space-y-3">
                  <div className="h-2 bg-white/10 rounded w-1/3" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))
          ) : trendingProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-white/5 rounded-xl bg-[#0a0a0a]">
              {language === 'ar' ? 'لا توجد منتجات رائجة حالياً.' : 'No trending products currently.'}
            </div>
          ) : (
            trendingProducts.map((product) => {
              const displayImage = (product.images && product.images.length > 0) ? product.images[0] : product.image;
              const displayTitle = language === 'ar' && product.titleAr ? product.titleAr : product.title;
              return (
              <Card key={product.id} className="border border-white/5 bg-[#0a0a0a] rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group cursor-pointer" onClick={() => window.location.href = `/product/${product.id}`}>
                <CardContent className="p-0 relative flex flex-col h-full">
                  <div className="relative aspect-square bg-[#111] overflow-hidden flex items-center justify-center">
                    {displayImage ? (
                      <img src={displayImage} alt={displayTitle} className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" />
                    ) : (
                      <ShoppingBag className="w-12 h-12 text-white/20" />
                    )}
                    
                    {/* Add to cart overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black to-transparent">
                      <Button 
                        className="w-full bg-primary text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black rounded"
                        onClick={(e) => { e.stopPropagation(); addToCart({ ...product, image: displayImage, title: displayTitle }); }}
                      >
                        {t('products.addToCart')}
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1">{product.category ? t(`categories.${product.category.toLowerCase().replace(' ', '')}`) : ''}</p>
                    <h3 className="font-medium text-sm leading-tight text-white mb-2 line-clamp-2">{displayTitle}</h3>
                    <div className={`flex items-center gap-1 mb-3 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating || 5) ? 'fill-primary text-primary' : 'text-gray-600'}`} />
                      ))}
                    </div>
                    <p className="text-primary font-bold text-sm mt-auto" dir="ltr">{Number(product.price || 0).toFixed(2)} {t('products.sar')}</p>
                  </div>
                </CardContent>
              </Card>
            )})
          )}
        </div>
      </section>
    </div>
  )
}

