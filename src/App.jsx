import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./components/Footer";
import PageLayout from "./layout/PageLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import LikedProducts from "./pages/LikedProducts";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Navbar from "./components/Navbar";
import Collection from "./components/Collection";
import AdminLayout from "./layout/AdminLayout";

// Admin is code-split so storefront visitors never download recharts/admin UI.
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProductsList = lazy(() => import("./pages/admin/products/ProductsList"));
const ProductForm = lazy(() => import("./pages/admin/products/ProductForm"));
const CategoriesList = lazy(() => import("./pages/admin/categories/CategoriesList"));
const Collections = lazy(() => import("./pages/admin/Collections"));

const Admin = ({ children }) => (
  <AdminLayout>
    <Suspense fallback={<p className="text-gray-400">Loading…</p>}>{children}</Suspense>
  </AdminLayout>
);

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: "ease-in-cubic",
      offset: 100,
    });
  }, []);

  return (
    <div>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar transparent={false} bg="bg-amber-600" />
              <Home />
              <Footer />
            </>
          }
        />
        <Route path="/shop" element={<PageLayout><Shop /></PageLayout>} />
        <Route path="/collection" element={<PageLayout><Collection /></PageLayout>} />
        <Route path="/product/:id" element={<PageLayout><ProductDetail /></PageLayout>} />
        <Route path="/cart" element={<PageLayout><Cart /></PageLayout>} />
        <Route path="/liked" element={<PageLayout><LikedProducts /></PageLayout>} />
        <Route path="/checkout" element={<PageLayout><Checkout /></PageLayout>} />
        <Route path="/order-confirmation" element={<PageLayout><OrderConfirmation /></PageLayout>} />

        {/* --- Admin --- */}
        <Route path="/admin" element={<Admin><Dashboard /></Admin>} />
        <Route path="/admin/products" element={<Admin><ProductsList /></Admin>} />
        <Route path="/admin/products/new" element={<Admin><ProductForm /></Admin>} />
        <Route path="/admin/products/:id/edit" element={<Admin><ProductForm /></Admin>} />
        <Route path="/admin/categories" element={<Admin><CategoriesList /></Admin>} />
        <Route path="/admin/collections" element={<Admin><Collections /></Admin>} />
      </Routes>
    </div>
  );
}
