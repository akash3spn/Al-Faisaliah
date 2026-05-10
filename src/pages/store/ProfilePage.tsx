import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useLanguage } from "@/lib/language-provider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { updateProfile, updateEmail } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCircle, Mail, Phone, MapPin, Building2, Globe } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    zipCode: "",
    country: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(prev => ({
            ...prev,
            fullName: data.fullName || user.displayName || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            address: data.address || "",
            city: data.city || "",
            region: data.region || "",
            zipCode: data.zipCode || "",
            country: data.country || ""
          }));
        } else {
          setProfile(prev => ({
            ...prev,
            fullName: user.displayName || "",
            email: user.email || ""
          }));
        }
      } catch (error) {
        console.error("Error fetching profile", error);
        toast.error(language === 'ar' ? 'حدث خطأ أثناء جلب تفاصيل الحساب' : 'Error fetching profile details');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      // Update Firebase Auth profile
      if (profile.fullName !== user.displayName) {
        await updateProfile(user, { displayName: profile.fullName });
      }

      // Update Firestore document
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        region: profile.region,
        zipCode: profile.zipCode,
        country: profile.country,
        updatedAt: new Date().toISOString()
      });
      
      toast.success(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
    } catch (error: any) {
      console.error("Error saving profile", error);
      toast.error(error.message || (language === 'ar' ? 'فشل تحديث الملف الشخصي' : 'Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-zinc-50 border-b border-gray-100 px-6 py-8 md:px-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UserCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wider">{profile.fullName || (language === 'ar' ? 'اسم المستخدم' : 'User Name')}</h1>
          <p className="text-muted-foreground text-sm tracking-wider">{profile.email}</p>
        </div>

        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="pl-10 bg-gray-50 text-gray-500"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="+966 50 000 0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {language === 'ar' ? 'الدولة' : 'Country'}
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder={language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {language === 'ar' ? 'المدينة' : 'City'}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder={language === 'ar' ? 'الرياض' : 'Riyadh'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {language === 'ar' ? 'المنطقة / الحي' : 'Region / District'}
              </label>
              <Input
                name="region"
                value={profile.region}
                onChange={handleChange}
                placeholder={language === 'ar' ? 'حي الياسمين' : 'Al Yasmin District'}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {language === 'ar' ? 'العنوان بالتفصيل' : 'Detailed Address'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder={language === 'ar' ? 'اسم الشارع، رقم المبنى' : 'Street name, Building number'}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={saving}
              className="px-8 uppercase tracking-widest font-bold"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>{language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
