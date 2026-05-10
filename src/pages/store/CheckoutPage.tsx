import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useLanguage } from "@/lib/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRight, CreditCard, Wallet, MapPin, Map, Navigation, Phone, User as UserIcon, Building2 } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    region: "",
    country: "Saudi Arabia",
    postalCode: "",
    notes: "",
    paymentMethod: "cod" // 'cod', 'card', 'apple', 'stc'
  });

  React.useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart.length, navigate]);

  if (cart.length === 0) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setPaymentMethod = (method: string) => {
    setFormData({ ...formData, paymentMethod: method });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.region) {
      toast.error(language === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        userId: user?.uid || null,
        customerEmail: user?.email || "Guest",
        customerName: formData.fullName,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          region: formData.region,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        items: cart,
        total: cartTotal,
        status: "pending",
        createdAt: Date.now(),
      };

      await addDoc(collection(db, "orders"), orderData);

      toast.success(language === 'ar' ? 'تم استلام طلبك بنجاح' : 'Order placed successfully!');
      clearCart();
      navigate("/");
    } catch (error: any) {
      console.error("Order creation failed", error);
      toast.error(language === 'ar' ? 'فشل إتمام الطلب' : 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{language === 'ar' ? 'إتمام الشراء' : 'Checkout'}</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *</label>
                  <Input name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">{language === 'ar' ? 'رقم الجوال' : 'Phone Number'} *</label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {language === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">{language === 'ar' ? 'العنوان (الشارع والحي)' : 'Address (Street & District)'} *</label>
                  <Input name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">{language === 'ar' ? 'المدينة' : 'City'} *</label>
                    <Input name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">{language === 'ar' ? 'المنطقة' : 'Region'} *</label>
                    <Input name="region" value={formData.region} onChange={handleChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">{language === 'ar' ? 'رقم المبنى/الشقة' : 'Building/Apartment'}</label>
                    <Input name="apartment" value={formData.apartment} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">{language === 'ar' ? 'الدولة' : 'Country'} *</label>
                    <Input name="country" value={formData.country} onChange={handleChange} required disabled />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">{language === 'ar' ? 'الرمز البريدي' : 'Postal Code'}</label>
                    <Input name="postalCode" value={formData.postalCode} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">{language === 'ar' ? 'ملاحظات التوصيل' : 'Delivery Notes'}</label>
                  <Textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/10' : 'border-border hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className={formData.paymentMethod === 'cod' ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="font-medium">{language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
                  </div>
                </div>
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-primary bg-primary/10' : 'border-border hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className={formData.paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="font-medium">{language === 'ar' ? 'بطاقة الائتمان / مدى' : 'Credit Card / Mada'}</span>
                  </div>
                </div>
                <div 
                  onClick={() => setPaymentMethod('apple')}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'apple' ? 'border-primary bg-primary/10' : 'border-border hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Apple Pay</span>
                  </div>
                </div>
                <div 
                  onClick={() => setPaymentMethod('stc')}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'stc' ? 'border-primary bg-primary/10' : 'border-border hover:border-white/20'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-emerald-500">stc pay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-xl border border-border sticky top-24">
              <h3 className="text-xl font-bold mb-6">{language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-medium">SAR {Number(cartTotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                  <span className="font-medium text-emerald-500">{language === 'ar' ? 'مجاني' : 'Free'}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="font-bold text-lg">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span className="font-bold text-lg text-primary">SAR {Number(cartTotal || 0).toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full font-bold uppercase tracking-widest py-6">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    {language === 'ar' ? 'تأكيد الطلب' : 'Place Order'} <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
