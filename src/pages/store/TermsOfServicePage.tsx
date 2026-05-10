import React from "react"
import { useLanguage } from "@/lib/language-provider"

export default function TermsOfServicePage() {
  const { language } = useLanguage()

  return (
    <div className="bg-background min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-black mb-8 text-foreground uppercase tracking-wider">
          {language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}
        </h1>
        
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '1. مقدمة' : '1. Introduction'}
            </h2>
            <p>
              {language === 'ar' 
                ? 'مرحباً بك في متجر الفيصلية. من خلال الوصول إلى موقعنا أو استخدام خدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. يُرجى قراءتها بعناية.'
                : 'Welcome to Al-Faisaliah Store. By accessing our website or using our services, you agree to be bound by these Terms of Service. Please read them carefully.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '2. المشتريات والدفع' : '2. Purchases and Payment'}
            </h2>
            <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
              <li>{language === 'ar' ? 'نحتفظ بالحق في رفض أي طلب تضعه معنا.' : 'We reserve the right to refuse any order you place with us.'}</li>
              <li>{language === 'ar' ? 'يجب أن تكون جميع تفاصيل الدفع المُقدمة دقيقة وكاملة.' : 'All payment details provided must be accurate and complete.'}</li>
              <li>{language === 'ar' ? 'الأسعار وتوافر المنتجات عرضة للتغيير دون إشعار مسبق.' : 'Prices and availability of products are subject to change without notice.'}</li>
              <li>{language === 'ar' ? 'في حالة وجود خطأ في التسعير، يحق للمتجر إلغاء الطلب واسترداد المبلغ للعميل.' : 'In the event of a pricing error, the store reserves the right to cancel the order and issue a refund.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '3. سياسة الإرجاع والاسترداد' : '3. Return and Refund Policy'}
            </h2>
            <p className="mb-2">
              {language === 'ar'
                ? 'نحن نسعى لضمان رضاك التام. إذا لم تكن راضيًا عن مشترياتك:'
                : 'We strive to ensure your complete satisfaction. If you are not satisfied with your purchase:'}
            </p>
            <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
              <li>{language === 'ar' ? 'يمكن إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام، بشرط أن تكون في حالتها الأصلية وغير مستخدمة.' : 'Products can be returned within 14 days of receipt, provided they are in their original and unused condition.'}</li>
              <li>{language === 'ar' ? 'المنتجات القابلة للتلف أو التي تم فتحها قد لا تكون مؤهلة للإرجاع لأسباب صحية.' : 'Perishable or opened items may not be eligible for return due to health and safety reasons.'}</li>
              <li>{language === 'ar' ? 'يتحمل العميل تكلفة الشحن للإرجاع إلا إذا كان هناك خطأ من طرف المتجر.' : 'The customer bears the cost of return shipping unless there is a store error.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '4. الملكية الفكرية' : '4. Intellectual Property'}
            </h2>
            <p>
              {language === 'ar'
                ? 'جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص والرسومات والشعارات والصور والبرمجيات، هي ملك لمتجر الفيصلية وهي محمية بموجب قوانين حقوق الطبع والنشر. لا يُسمح باستخدام أي جزء من هذه المحتويات للاستخدام التجاري دون إذن كتابي من الإدارة.'
                : 'All content on this site, including text, graphics, logos, images, and software, is the property of Al-Faisaliah Store and is protected by copyright laws. Any commercial use of this content without written permission from management is strictly prohibited.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '5. إخلاء المسؤولية عن الضمانات' : '5. Disclaimer of Warranties'}
            </h2>
            <p>
              {language === 'ar'
                ? 'يتم تقديم المنتجات والخدمات على هذا الموقع "كما هي" دون أي ضمانات من أي نوع، صريحة كانت أو ضمنية. نحن لا نضمن أن المنتجات ستلبي تماماً الدقة أو الموثوقية المتوقعة من العميل لأغراض محددة.'
                : 'The products and services on this site are provided "as is" without any warranties of any kind, whether express or implied. We do not warrant that the products will perfectly meet the exact accuracy or reliability expected by the customer for specific purposes.'}
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '6. حدود المسؤولية' : '6. Limitation of Liability'}
            </h2>
            <p>
              {language === 'ar'
                ? 'في أي حال من الأحوال، لا يتحمل متجر الفيصلية المسؤولية عن أية أضرار مباشرة أو غير مباشرة أو عرضية أو تبعية تنشأ عن استخدام أو عدم القدرة على استخدام الموقع أو المنتجات المشتراة.'
                : 'In no event shall Al-Faisaliah Store be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the site or the purchased products.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '7. التعديلات' : '7. Modifications'}
            </h2>
            <p>
              {language === 'ar'
                ? 'يحتفظ المتجر بالحق في تحديث، تغيير أو استبدال أي جزء من هذه الشروط من خلال نشر التحديثات على موقعنا.'
                : 'The store reserves the right to update, change, or replace any part of these Terms by posting updates on our website.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
