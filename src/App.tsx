import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/lib/firebase/AuthContext"
import { LanguageProvider } from "@/lib/language-provider"
import { CartProvider } from "@/lib/CartContext"
import { StoreLayout } from "@/components/layout/StoreLayout"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Toaster } from "@/components/ui/sonner"

// Storefront Pages
import HomePage from "./pages/store/HomePage"
import ProductsPage from "./pages/store/ProductsPage"
import CartPage from "./pages/store/CartPage"
// import ProductDetailPage from "./pages/store/ProductDetailPage"

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminOrders from "./pages/admin/AdminOrders"
import AdminCustomers from "./pages/admin/AdminCustomers"
import AdminPayments from "./pages/admin/AdminPayments"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminManagers from "./pages/admin/AdminManagers"
import AdminSettings from "./pages/admin/AdminSettings"

import { ThemeProvider } from "@/components/theme-provider"

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LanguageProvider>
        <AuthProvider>
          <Toaster position="top-center" />
          <CartProvider>
            <BrowserRouter>
              <Routes>
              {/* Storefront Routes */}
              <Route element={<StoreLayout />}>
                 <Route path="/" element={<HomePage />} />
                 <Route path="/products" element={<ProductsPage />} />
                 <Route path="/categories/:slug" element={<ProductsPage />} />
                 <Route path="/cart" element={<CartPage />} />
                 {/* <Route path="/products/:id" element={<ProductDetailPage />} /> */}
              </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="managers" element={<AdminManagers />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

