import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreditCard, Search, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-provider"

export default function AdminPayments() {
  const { t, language } = useLanguage()

  return (
    <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('admin.payments')}</h2>
          <p className="text-muted-foreground mt-2 text-sm tracking-wide">
             {language === 'ar' ? 'مراجعة المعاملات وسجل المدفوعات.' : 'Review transactions and payment history.'}
          </p>
        </div>
      </div>

      <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="relative w-full sm:w-72">
               <Search className="absolute rtl:right-2.5 ltr:left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input 
                 type="search" 
                 placeholder={t('admin.search')} 
                 className="rtl:pr-8 ltr:pl-8 bg-background/50 border-border/50 focus-visible:ring-primary"
               />
             </div>
             <Button variant="outline" className="w-full sm:w-auto border-border/50 hover:bg-primary/10 hover:text-primary">
                <Download className="rtl:ml-2 ltr:mr-2 h-4 w-4" /> {language === 'ar' ? 'تصدير' : 'Export'}
             </Button>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
             <CreditCard className="h-12 w-12 text-primary/30 mb-4" />
             <p className="text-lg font-medium text-foreground">{language === 'ar' ? 'لا توجد معاملات حديثة' : 'No recent transactions'}</p>
             <p className="max-w-md mt-2 text-sm">
               {language === 'ar' 
                 ? 'بمجرد معالجة المبيعات، سيتم تتبعها بدقة هنا.' 
                 : 'Once sales are processed, they will be meticulously tracked here.'}
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
