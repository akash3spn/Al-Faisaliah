import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useLanguage } from "@/lib/language-provider";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronDown, ChevronUp, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    const q = query(collection(db, "orders"), where("userId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Check for modified orders to show real-time notifications
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const newStatus = change.doc.data().status;
          const orderId = change.doc.id.slice(-8).toUpperCase();
          const isArabic = language === 'ar';
          let statusLabel = newStatus;
          switch (newStatus) {
            case 'pending': statusLabel = isArabic ? 'قيد الانتظار' : 'Pending'; break;
            case 'processing': statusLabel = isArabic ? 'قيد التجهيز' : 'Processing'; break;
            case 'shipped': statusLabel = isArabic ? 'تم الشحن' : 'Shipped'; break;
            case 'delivered': statusLabel = isArabic ? 'تم التوصيل' : 'Delivered'; break;
            case 'cancelled': statusLabel = isArabic ? 'ملغي' : 'Cancelled'; break;
          }
          toast.success(isArabic ? `تم تحديث حالة الطلب #${orderId} إلى ${statusLabel}` : `Order #${orderId} status updated to ${statusLabel}`);
        }
      });

      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort orders locally to avoid requiring composite indexes
      ordersData.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, navigate]);

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    const isArabic = language === 'ar';
    switch (status) {
      case 'pending': return isArabic ? 'قيد الانتظار' : 'Pending';
      case 'processing': return isArabic ? 'قيد التجهيز' : 'Processing';
      case 'shipped': return isArabic ? 'تم الشحن' : 'Shipped';
      case 'delivered': return isArabic ? 'تم التوصيل' : 'Delivered';
      case 'cancelled': return isArabic ? 'ملغي' : 'Cancelled';
      default: return status;
    }
  };

  const renderTimeline = (currentStatus: string) => {
    const isArabic = language === 'ar';
    const stages = [
      { id: 'pending', label: isArabic ? 'تم الطلب' : 'Ordered' },
      { id: 'processing', label: isArabic ? 'قيد التجهيز' : 'Processing' },
      { id: 'shipped', label: isArabic ? 'في الطريق' : 'Shipped' },
      { id: 'delivered', label: isArabic ? 'تم التوصيل' : 'Delivered' }
    ];

    if (currentStatus === 'cancelled') {
        return (
            <div className="flex items-center text-red-500 mt-6 mb-4">
                <XCircle className="w-6 h-6 mr-2 rtl:ml-2" />
                <span className="font-bold">{isArabic ? 'تم إلغاء الطلب' : 'Order Cancelled'}</span>
            </div>
        );
    }

    let currentIndex = stages.findIndex(s => s.id === currentStatus);
    if (currentIndex === -1) currentIndex = 0; // Default to first stage implicitly

    return (
      <div className="relative mt-8 mb-6 overflow-hidden">
        <div className="flex justify-between relative pl-4 pr-4">
            {/* Background Line */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-muted rounded-full" />
          
            {/* Active Line */}
          <div 
            className="absolute top-4 left-0 h-1 bg-primary rounded-full transition-all duration-700 ease-in-out z-0 rtl:left-auto rtl:right-0" 
            style={{ 
                width: language === 'ar' ? '100%' : `${(currentIndex / (stages.length - 1)) * 100}%`,
                transform: language === 'ar' ? `scaleX(${currentIndex / (stages.length - 1)})` : 'none',
                transformOrigin: language === 'ar' ? 'right' : 'left'
            }} 
          />

          {stages.map((stage, index) => {
            const isActive = index <= currentIndex;
            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${isActive ? 'bg-primary border-primary text-black' : 'bg-card border-muted text-muted-foreground'}`}>
                  {isActive && index < currentIndex ? <CheckCircle2 className="w-5 h-5 text-black" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <div className={`mt-2 text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium animate-pulse">{language === 'ar' ? 'جاري تحميل الطلبات...' : 'Loading Orders...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">{language === 'ar' ? 'طلباتي' : 'My Orders'}</h1>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-sm py-1 px-3">
                {orders.length} {language === 'ar' ? 'طلب' : `Order${orders.length !== 1 ? 's' : ''}`}
            </Badge>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 bg-card/30 rounded-3xl border border-border/50 backdrop-blur-sm">
            <Package className="w-20 h-20 mx-auto text-primary/30 mb-6" />
            <h2 className="text-2xl font-bold mb-4">{language === 'ar' ? 'لا توجد طلبات بعد' : 'No Orders Yet'}</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {language === 'ar' 
                ? 'لم تقم بإجراء أي طلبات حتى الآن. اكتشف منتجاتنا الفاخرة وابدأ التسوق.' 
                : 'You have not placed any orders yet. Discover our premium products and start shopping.'}
            </p>
            <Link to="/products">
              <Button size="lg" className="font-bold tracking-widest uppercase bg-primary text-black hover:bg-white hover:text-black transition-colors rounded-xl h-14 px-8">
                {language === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              
              return (
                <Card key={order.id} className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30">
                  {/* Order Header / Summary */}
                  <div 
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer group"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-4 sm:mb-0">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">{language === 'ar' ? 'رقم الطلب' : 'Order ID'}</p>
                        <p className="font-mono font-bold text-lg leading-none">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="hidden sm:block w-px bg-border/80 h-10"></div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">{language === 'ar' ? 'التاريخ' : 'Date'}</p>
                        <p className="font-medium text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="hidden sm:block w-px bg-border/80 h-10"></div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">{language === 'ar' ? 'الإجمالي' : 'Total'}</p>
                        <p className="font-bold text-primary text-lg leading-none">SAR {Number(order.total || 0).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col sm:items-end justify-between items-center bg-muted/40 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
                      <Badge variant="outline" className={`border mb-0 sm:mb-2 text-sm py-1 px-3 flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </Badge>
                      <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        {isExpanded ? (
                          <>{language === 'ar' ? 'إخفاء التفاصيل' : 'Hide Details'} <ChevronUp className="w-4 h-4 ml-1 rtl:mr-1" /></>
                        ) : (
                          <>{language === 'ar' ? 'عرض التفاصيل' : 'View Details'} <ChevronDown className="w-4 h-4 ml-1 rtl:mr-1" /></>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-border/50 bg-black/20 animate-in slide-in-from-top-4 fade-in duration-300">
                      <div className="p-5 sm:p-8">
                        {/* Status Timeline */}
                        {renderTimeline(order.status)}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                          {/* Items List */}
                          <div className="space-y-4">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                {language === 'ar' ? 'المنتجات المطلوبة' : 'Ordered Items'}
                            </h3>
                            <div className="space-y-4 pr-2">
                              {(order.items || []).map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 bg-muted/20 p-3 rounded-xl border border-white/5">
                                  <div className="w-16 h-16 rounded-lg bg-black/50 overflow-hidden shrink-0 border border-white/10">
                                    {item.image ? (
                                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-6 h-6 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-grow">
                                    <h4 className="font-semibold line-clamp-1 leading-tight">{item.title}</h4>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm text-muted-foreground">Qty: <span className="font-bold text-foreground">{item.quantity}</span></p>
                                        <p className="font-bold text-primary">SAR {(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping & Payment Info */}
                          <div className="space-y-8">
                            <div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    {language === 'ar' ? 'معلومات التوصيل' : 'Shipping Information'}
                                </h3>
                                <div className="bg-muted/20 p-5 rounded-xl border border-white/5 space-y-2 text-sm leading-relaxed text-muted-foreground">
                                    <p><strong className="text-foreground">{order.customerName}</strong></p>
                                    <p>{order.shippingAddress?.address}</p>
                                    {order.shippingAddress?.apartment && <p>Apt/Suite: {order.shippingAddress.apartment}</p>}
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.region}</p>
                                    <p>{order.shippingAddress?.country || "Saudi Arabia"}</p>
                                    <p className="mt-2 text-foreground font-medium pt-2 border-t border-white/5">
                                        {language === 'ar' ? 'رقم التواصل:' : 'Phone:'} <span dir="ltr">{order.customerPhone}</span>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    {language === 'ar' ? 'ملخص الدفع' : 'Payment Summary'}
                                </h3>
                                <div className="bg-muted/20 p-5 rounded-xl border border-white/5 space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</span>
                                        <Badge variant="outline" className="uppercase font-bold tracking-widest text-[10px] bg-background">
                                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                        <span className="font-medium">SAR {Number(order.subtotal || order.total || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{language === 'ar' ? 'رسوم التوصيل' : 'Delivery Charge'}</span>
                                        <span className="text-emerald-500 font-medium">{language === 'ar' ? 'مجاني' : 'Free'}</span>
                                    </div>
                                    {order.discountAmount > 0 && (
                                      <div className="flex justify-between items-center text-sm text-primary">
                                          <span>{language === 'ar' ? 'الخصم' : 'Discount'} ({order.discountCode})</span>
                                          <span className="font-medium">- SAR {Number(order.discountAmount).toFixed(2)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-center pt-3 border-t border-white/5 text-base">
                                        <span className="font-bold">{language === 'ar' ? 'الإجمالي' : 'Total Amount'}</span>
                                        <span className="font-bold text-primary text-xl">SAR {Number(order.total || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
