import React from "react"
import { useLanguage } from "@/lib/language-provider"

export default function PrivacyPolicyPage() {
  const { t, language } = useLanguage()

  return (
    <div className="bg-background min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-black mb-8 text-foreground uppercase tracking-wider">
          {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>
        
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '1. جمع المعلومات' : '1. Information Collection'}
            </h2>
            <p>
              {language === 'ar' 
                ? 'نحن نجمع المعلومات عندما تسجل في موقعنا، تسجل الدخول إلى حسابك، تجري عملية شراء، و / أو تسجل الخروج. المعلومات التي يتم جمعها تتضمن اسمك وعنوان بريدك الإلكتروني ورقم هاتفك وتفاصيل الدفع الخاصة بك.'
                : 'We collect information when you register on our site, log into your account, make a purchase, and/or log out. The collected information includes your name, email address, phone number, and payment details.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '2. استخدام المعلومات' : '2. Use of Information'}
            </h2>
            <p className="mb-2">
              {language === 'ar' 
                ? 'أي من المعلومات التي نجمعها منك قد تستخدم في:'
                : 'Any of the information we collect from you may be used to:'}
            </p>
            <ul className="list-disc list-inside space-y-2 ltr:ml-4 rtl:mr-4">
              <li>{language === 'ar' ? 'تخصيص تجربتك وتلبية احتياجاتك الفردية' : 'Personalize your experience and meet your individual needs'}</li>
              <li>{language === 'ar' ? 'توفير محتوى إعلاني مخصص' : 'Provide customized advertising content'}</li>
              <li>{language === 'ar' ? 'تحسين موقعنا' : 'Improve our website'}</li>
              <li>{language === 'ar' ? 'تحسين خدمة العملاء واحتياجات الدعم' : 'Improve customer service and support needs'}</li>
              <li>{language === 'ar' ? 'الاتصال بك عبر البريد الإلكتروني' : 'Contact you via email'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '3. خصوصية التجارة الإلكترونية' : '3. E-commerce Privacy'}
            </h2>
            <p>
              {language === 'ar'
                ? 'نحن المالكون الوحيدون للمعلومات التي يتم جمعها على هذا الموقع. معلوماتك الشخصية لن يتم بيعها، تبادلها، نقلها، أو إعطاؤها لأي شركة أخرى لأي سبب كان، دون موافقتك، إلا للغرض الصريح المتمثل في تسليم المنتج أو الخدمة المشتراة.'
                : 'We are the sole owners of the information collected on this site. Your personally identifiable information will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without your consent, other than for the express purpose of delivering the purchased product or service.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '4. الكشف للأطراف الثالثة' : '4. Third-Party Disclosure'}
            </h2>
            <p>
              {language === 'ar'
                ? 'نحن لا نبيع أو نتاجر أو ننقل معلوماتك الشخصية إلى أطراف خارجية. هذا لا يشمل الأطراف الثالثة الموثوق بها التي تساعدنا في تشغيل موقعنا، أو إجراء أعمالنا، أو تقديم الخدمات لك، طالما أن هذه الأطراف توافق على الحفاظ على سرية هذه المعلومات.'
                : 'We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '5. حماية المعلومات' : '5. Information Protection'}
            </h2>
            <p>
              {language === 'ar'
                ? 'نحن ننفذ مجموعة متنوعة من الإجراءات الأمنية للحفاظ على سلامة معلوماتك الشخصية. نستخدم التشفير المتطور لحماية المعلومات الحساسة المرسلة عبر الإنترنت.'
                : 'We implement a variety of security measures to maintain the safety of your personal information. We use state-of-the-art encryption to protect sensitive information transmitted online.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground uppercase tracking-widest">
              {language === 'ar' ? '6. الموافقة' : '6. Consent'}
            </h2>
            <p>
              {language === 'ar'
                ? 'باستخدامك لموقعنا، فإنك توافق على سياسة الخصوصية الخاصة بنا.'
                : 'By using our site, you consent to our privacy policy.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
