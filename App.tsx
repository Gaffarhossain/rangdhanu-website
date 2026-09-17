import { BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminLayout from "./pages/admin/AdminLayout";
import PublicLayout from "./pages/public/PublicLayout";
import HomePage from "./pages/public/HomePage";
import ShopPage from "./pages/public/ShopPage";
import ProductDetailsPage from "./pages/public/ProductDetailsPage";
import CartPage from "./pages/public/CartPage";
import CheckoutPage from "./pages/public/CheckoutPage";
import OrderSuccessPage from "./pages/public/OrderSuccessPage";
import TrackOrderPage from "./pages/public/TrackOrderPage";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { CartProvider } from "./context/CartContext";

function HashRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.hash === "#/home") {
      navigate("/", { replace: true });
    }
  }, [navigate]);
  return null;
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <HashRedirect />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="track-order" element={<TrackOrderPage />} />
            <Route path="about" element={<div className="max-w-7xl mx-auto px-4 py-24 text-center">About Page Coming Soon</div>} />
            <Route path="contact" element={<div className="max-w-7xl mx-auto px-4 py-24 text-center">Contact Page Coming Soon</div>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="ticker" element={<Navigate to="/admin/settings?tab=general" replace />} />
            <Route path="hero" element={<Navigate to="/admin/settings?tab=hero" replace />} />
            <Route path="offers" element={<Navigate to="/admin/settings?tab=offers" replace />} />
            <Route path="delivery" element={<Navigate to="/admin/settings?tab=delivery" replace />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<div className="p-6 text-gray-500">Categories Management Coming Soon</div>} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<div className="p-6 text-gray-500">Customers Coming Soon</div>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
