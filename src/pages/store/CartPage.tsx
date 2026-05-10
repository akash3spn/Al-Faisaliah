import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/lib/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language-provider";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toast.success(language === 'ar' ? 'تم استلام طلبك بنجاح' : 'Order placed successfully!');
    clearCart();
    navigate('/');
  };

  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-card/30 rounded-2xl border border-border">
            <h2 className="text-xl font-medium mb-4">{language === 'ar' ? 'السلة فارغة' : 'Your cart is empty'}</h2>
            <p className="text-muted-foreground mb-8">
              {language === 'ar' ? 'لم تقم بإضافة أي منتجات حتى الآن.' : 'You have not added any products yet.'}
            </p>
            <Link to="/products">
              <Button size="lg" className="font-bold">
                {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border border-border">
                  <div className="w-24 h-24 bg-muted rounded-md overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">No Image</div>
                    )}
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left sm:rtl:text-right">
                    <h3 className="font-medium text-lg leading-tight">{item.title}</h3>
                    <p className="text-primary font-bold mt-1">SAR {item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-xl border border-border sticky top-24">
                <h3 className="text-xl font-bold mb-6">{language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span className="font-medium">SAR {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                    <span className="font-medium text-emerald-500">{language === 'ar' ? 'مجاني' : 'Free'}</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="font-bold text-lg">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                    <span className="font-bold text-lg text-primary">SAR {cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handleCheckout} className="w-full font-bold uppercase tracking-widest py-6">
                  {language === 'ar' ? 'إتمام الشراء' : 'Checkout'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
