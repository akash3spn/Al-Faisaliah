import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Settings } from "lucide-react"
import { useLanguage } from "@/lib/language-provider"

export default function AdminSettings() {
  const { t, language } = useLanguage()

  return (
    <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('admin.settings')}</h2>
          <p className="text-muted-foreground mt-2 text-sm tracking-wide">
             {language === 'ar' ? 'قم بتكوين تفضيلات المتجر ومعلمات النظام.' : 'Configure your store preferences and system parameters.'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm">
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'الإعدادات العامة' : 'General Settings'}</CardTitle>
            <CardDescription>{language === 'ar' ? 'إدارة معلومات المتجر الرئيسية' : 'Manage your main store information'}</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{language === 'ar' ? 'اسم المتجر' : 'Store Name'}</label>
                  <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" value={language === 'ar' ? 'متجر الفيصلية' : 'Al-Faisaliah Store'} readOnly />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">{language === 'ar' ? 'بريد الدعم' : 'Support Email'}</label>
                  <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-left" dir="ltr" value="admin@alfaisaliah.com" readOnly />
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm">
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'صيانة النظام' : 'System Maintenance'}</CardTitle>
            <CardDescription>{language === 'ar' ? 'العناصر المتقدمة وإدارة قاعدة البيانات' : 'Advanced tools and database management'}</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-center h-32 rounded-lg border border-dashed border-border/50 bg-muted/20">
               <span className="text-muted-foreground flex items-center gap-2">
                 <Settings className="h-5 w-5" /> {language === 'ar' ? 'وضع الصيانة قيد التشغيل' : 'Maintenance Mode active'}
               </span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
