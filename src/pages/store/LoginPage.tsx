import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/firebase/AuthContext";
import { useLanguage } from "@/lib/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(language === 'ar' ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');
      navigate("/");
    } catch (error: any) {
      if (error?.code === 'auth/invalid-credential') {
        toast.error(language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password');
      } else {
        toast.error(error.message || 'Login failed');
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
              {language === 'ar' ? 'تسجيل الدخول' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              {language === 'ar' ? 'أدخل بيانات الاعتماد الخاصة بك للوصول إلى حسابك' : 'Enter your credentials to access your account'}
            </p>
          </div>

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

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
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
                <>
                  {language === 'ar' ? 'دخول' : 'Sign In'} <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
            
            <div className="text-center mt-4">
              <Link to="/register" className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
                {language === 'ar' ? 'ليس لديك حساب؟ إنشاء حساب' : 'Need an account? Sign Up'}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
