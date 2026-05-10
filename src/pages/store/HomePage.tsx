import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, ShoppingBag, ShieldCheck, Clock, MapPin, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useLanguage } from "@/lib/language-provider"

export default function HomePage() {
  const { t, language, dir } = useLanguage()
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  const featuredProducts = [
    { id: "1", title: language === 'ar' ? "مكبر صوت بلوتوث فاخر" : "Premium Bluetooth Speaker", price: 299.99, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=400&auto=format&fit=crop", category: "Audio", rating: 4.8 },
    { id: "2", title: language === 'ar' ? "منصة منزل ذكي ذكية" : "Smart Home Hub Max", price: 499.00, image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=400&auto=format&fit=crop", category: "Smart Home", rating: 4.9 },
    { id: "3", title: language === 'ar' ? "ساعة ذهبية فاخرة" : "Luxury Golden Watch", price: 899.50, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop", category: "Accessories", rating: 5.0 },
    { id: "4", title: language === 'ar' ? "سماعات عازلة للضوضاء" : "Wireless Noise-cancelling Headphones", price: 349.00, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop", category: "Audio", rating: 4.7 },
  ]

  // Timer logic for flash sale
  const [timeLeft, setTimeLeft] = useState({ hrs: 8, mins: 42, secs: 19 })
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 }
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 }
        if (prev.hrs > 0) return { ...prev, hrs: prev.hrs - 1, mins: 59, secs: 59 }
        return { hrs: 24, mins: 0, secs: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-white/20 hover:scale-110 transition-transform cursor-pointer">
          <span className="text-black font-black text-xl leading-none">?</span>
        </div>
      </div>

      {/* Main Content Layout (Bento Grid) */}
      <main className="flex-grow p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 md:auto-rows-[160px] gap-4 max-w-[1600px] mx-auto w-full">
        
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
        <div className="md:col-span-6 md:row-span-2 bg-primary text-black rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 min-h-[200px]">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.3em] mb-1">{t('home.flashSale')}</span>
            <h4 className="text-3xl lg:text-4xl font-black">
               {language === 'ar' ? 'خصم حتى 60%' : 'UP TO 60% OFF'}
            </h4>
            <Button className="mt-4 self-start bg-black text-primary hover:bg-white hover:text-black font-bold uppercase tracking-widest text-[10px] px-6 rounded-sm">
               {language === 'ar' ? 'احصل على العرض' : 'Grab Deal'}
            </Button>
          </div>
          <div className="flex gap-2 sm:gap-3" dir="ltr">
            <div className="flex flex-col items-center bg-black/10 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-black/10 min-w-[60px]">
              <span className="text-xl sm:text-3xl font-black">{timeLeft.hrs.toString().padStart(2, '0')}</span>
              <span className="text-[9px] uppercase font-bold mt-1">HRS</span>
            </div>
            <div className="flex flex-col items-center bg-black/10 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-black/10 min-w-[60px]">
              <span className="text-xl sm:text-3xl font-black">{timeLeft.mins.toString().padStart(2, '0')}</span>
              <span className="text-[9px] uppercase font-bold mt-1">MIN</span>
            </div>
            <div className="flex flex-col items-center bg-black/10 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-black/10 min-w-[60px]">
              <span className="text-xl sm:text-3xl font-black">{timeLeft.secs.toString().padStart(2, '0')}</span>
              <span className="text-[9px] uppercase font-bold mt-1">SEC</span>
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
          {featuredProducts.map((product) => (
            <Card key={product.id} className="border border-white/5 bg-[#0a0a0a] rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
              <CardContent className="p-0 relative flex flex-col h-full">
                <div className="relative aspect-square bg-[#111] overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100" />
                  
                  {/* Add to cart overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black to-transparent">
                    <Button className="w-full bg-primary text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black rounded">
                      {t('products.addToCart')}
                    </Button>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1">{t(`categories.${product.category.toLowerCase().replace(' ', '')}`)}</p>
                  <h3 className="font-medium text-sm leading-tight text-white mb-2 line-clamp-2">{product.title}</h3>
                  <div className={`flex items-center gap-1 mb-3 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  <p className="text-primary font-bold text-sm mt-auto" dir="ltr">{product.price.toFixed(2)} {t('products.sar')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

