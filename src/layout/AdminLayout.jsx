import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, Tags, Sparkles, Store, Menu, LogOut, Lock, AlertCircle, Loader2,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getToken, login, logout } from "@/services/authService";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/collections", label: "Collections", icon: Sparkles },
];

function AdminLoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("admin@saas-ecome.test");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.payload?.message || err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center mb-2">
            <Lock size={20} />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Sign In</CardTitle>
          <CardDescription>
            Enter your admin credentials to access the management dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@saas-ecome.test"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Sign In"}
            </Button>
            <div className="text-center pt-2">
              <Link to="/" className="text-xs text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1">
                <Store size={14} /> Back to Storefront
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SidebarLinks({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive ? "bg-white text-gray-900" : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setToken(null);
  };

  if (!token) {
    return <AdminLoginForm onLoginSuccess={() => setToken(getToken())} />;
  }

  const currentLabel =
    NAV_ITEMS.find((i) => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)))?.label || "Admin";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-gray-900 py-6">
        <Link to="/" className="px-6 text-white text-2xl font-bold tracking-tight mb-8">
          FASHION<span className="text-xs align-top ml-0.5">@</span>
          <span className="block text-xs font-medium tracking-wide text-gray-400 mt-1">Admin panel</span>
        </Link>
        <SidebarLinks />
        <div className="mt-auto px-3 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Store size={18} />
            Back to store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors text-left"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="bg-gray-900 border-none">
          <Link to="/" className="text-white text-xl font-bold tracking-tight mb-8 block">
            FASHION<span className="text-xs align-top ml-0.5">@</span>
          </Link>
          <SidebarLinks onNavigate={() => setMobileOpen(false)} />
          <div className="mt-6 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Store size={18} />
              Back to store
            </Link>
            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 text-left"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-700" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-bold text-gray-900">{currentLabel}</h1>
          </div>
          <button onClick={handleLogout} className="text-xs font-medium text-gray-500 hover:text-red-600 flex items-center gap-1 lg:hidden">
            <LogOut size={14} /> Sign out
          </button>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
