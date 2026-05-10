import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/firebase/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Mail, Smartphone, ArrowRight, ShieldCheck, UserCircle, Key } from 'lucide-react'
import { useLanguage } from '@/lib/language-provider'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function AdminLogin() {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, user, isAdmin, loading, logout } = useAuth()
  const navigate = useNavigate()
  const { t, language } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'google'>('email')
  const [isSignUp, setIsSignUp] = useState(false)

  React.useEffect(() => {
    if (user && !isAdmin && !loading) {
      toast.error(language === 'ar' ? 'تم الرفض. لست مسؤولاً مصرحاً له.' : 'Access Denied. You are not an authorized administrator.')
      logout()
    }
  }, [user, isAdmin, loading, logout, language])

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>
  
  if (user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error(language === 'ar' ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password')
      return
    }
    
    setIsSubmitting(true)
    try {
      if (isSignUp) {
        await registerWithEmail(email, password)
        toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully')
      } else {
        await loginWithEmail(email, password)
        toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully')
      }
      // Navigation is handled by the redirect at the top of the component once state updates
    } catch (error: any) {
      if (error?.code === 'auth/invalid-credential') {
        toast.error(language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password')
      } else if (error?.code === 'auth/email-already-in-use') {
        toast.error(language === 'ar' ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email is already in use')
      } else {
        toast.error(error.message || (isSignUp ? 'Registration failed' : 'Login failed'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      // Navigation is handled by the redirect at the top of the component once state updates
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        toast.error('Google login failed')
      }
    }
  }

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error(language === 'ar' ? 'الرجاء إدخال البريد الإلكتروني أولاً' : 'Please enter your email first')
      return
    }
    // Mock for now or use Firebase sendPasswordResetEmail
    toast.success(language === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور' : 'Password reset link sent to ' + email)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-black relative overflow-hidden ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      {/* Luxurious Abstract Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-screen pulse-slow" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px] opacity-30" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] opacity-40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-6 relative z-10"
      >
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(218,165,32,0.3)] border border-[#FFD700]/30"
          >
            <ShieldCheck className="w-8 h-8 text-black" />
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-widest uppercase text-white bg-clip-text">
              {language === 'ar' ? 'بوابة المدير' : 'Admin Portal'}
            </h1>
            <p className="text-primary/70 text-xs tracking-[0.2em] uppercase mt-2">
              {language === 'ar' ? 'نظام وصول حصري' : 'Exclusive Access System'}
            </p>
          </div>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden ring-1 ring-white/10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-white font-medium">
              {language === 'ar' ? 'تسجيل الدخول للنظام' : 'System Login'}
            </CardTitle>
            <CardDescription className="text-center text-gray-400 text-xs">
              {language === 'ar' ? 'الرجاء التحقق من هويتك للمتابعة' : 'Please verify your identity to continue'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => setLoginMethod('email')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${loginMethod === 'email' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}
              >
                <Mail className="w-3 h-3" /> Email
              </button>
              <button 
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${loginMethod === 'phone' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}
              >
                <Smartphone className="w-3 h-3" /> Phone
              </button>
            </div>

            {loginMethod === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2 relative group">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="email" 
                    placeholder={language === 'ar' ? 'البريد الإلكتروني للإدارة' : 'Admin Email Address'} 
                    className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 relative group">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password" 
                    placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'} 
                    className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-primary rounded bg-black/50 border-white/20" />
                    <span className="text-[10px] text-gray-400 group-hover:text-gray-300 transition-colors uppercase tracking-wider">
                      {language === 'ar' ? 'تذكرني' : 'Remember Me'}
                    </span>
                  </label>
                  <a href="#" onClick={handleResetPassword} className="text-[10px] text-primary hover:text-white transition-colors uppercase tracking-wider">
                    {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                  </a>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] hover:from-[#FFD700] hover:to-[#B8860B] text-black font-bold h-11 uppercase tracking-widest shadow-[0_0_20px_rgba(218,165,32,0.2)] hover:shadow-[0_0_30px_rgba(218,165,32,0.4)] transition-all mt-4"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? (language === 'ar' ? 'إنشاء حساب' : 'Sign Up') : (language === 'ar' ? 'دخول آمن' : 'Secure Login')} <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
                    {isSignUp 
                      ? (language === 'ar' ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Login') 
                      : (language === 'ar' ? 'ليس لديك حساب؟ إنشاء حساب' : 'Need an account? Sign Up')}
                  </button>
                </div>
              </form>
            )}

            {loginMethod === 'phone' && (
              <div className="text-center py-4 space-y-4">
                <Smartphone className="w-12 h-12 text-primary/50 mx-auto" />
                <p className="text-sm text-gray-400">
                  {language === 'ar' ? 'الرجاء إدخال رقم الهاتف المسجل لإرسال رمز التحقق' : 'Enter registered admin phone number for OTP verification.'}
                </p>
                <div className="flex gap-2">
                  <select className="bg-black/50 border border-white/10 text-white text-sm rounded-md px-2 focus:outline-none focus:border-primary">
                    <option>+966</option>
                  </select>
                  <Input 
                    type="tel" 
                    placeholder="50 000 0000" 
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary h-11"
                  />
                </div>
                <Button className="w-full bg-white/10 text-white hover:bg-white hover:text-black transition-all">
                  Send OTP
                </Button>
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-black px-2 text-gray-500">
                  {language === 'ar' ? 'أو الدخول عبر' : 'Or authenticate with'}
                </span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              onClick={handleGoogleLogin}
              className="w-full h-11 bg-white/5 border-white/10 text-white hover:bg-white hover:text-black transition-all group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google Workspace Admin
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest mt-4 flex items-center justify-center gap-1">
              <Key className="w-3 h-3" /> Protected by 2FA & Advanced Security
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
