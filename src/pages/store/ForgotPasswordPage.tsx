import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useLanguage } from "@/lib/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(language === 'ar' ? 'الرجاء إدخال البريد الإلكتروني' : 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsSent(true);
      toast.success(language === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور' : 'Password reset link sent to your email');
    } catch (error: any) {
      if (error?.code === 'auth/user-not-found') {
        toast.error(language === 'ar' ? 'لم يتم العثور على حساب بهذا البريد الإلكتروني' : 'No account found with this email');
      } else {
        toast.error(error.message || 'Failed to send password reset email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black opacity-90" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <Link to="/login" className="inline-flex items-center text-sm mb-6 text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </Link>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
              {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
            </h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mt-4 leading-relaxed">
              {language === 'ar' 
                ? 'أدخل بريدك الإلكتروني أدناه وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.' 
                : 'Enter your email address below and we will send you a link to reset your password.'}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-bold tracking-wider uppercase rounded-xl transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>{language === 'ar' ? 'إرسال الرابط' : 'Send Reset Link'}</>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {language === 'ar' ? 'تحقق من بريدك الإلكتروني' : 'Check your email'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'ar' 
                  ? 'لقد أرسلنا تعليمات استعادة كلمة المرور إلى بريدك الإلكتروني.' 
                  : 'We have sent password recovery instructions to your email.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
