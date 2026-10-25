import { T, usePreferences as useTranslationPreferences } from '@/context/Preferences';
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUserAuth } from "@/context/UserAuthContext";
import { Loader2, UserPlus, LogIn } from "lucide-react";

export default function UserAuthModal({ open, onOpenChange }) {
 const { t: tr } = useTranslationPreferences();

  const { loginCustomer, registerCustomer } = useUserAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginCustomer(loginForm.email, loginForm.password);
      onOpenChange(false);
      setLoginForm({ email: "", password: "" });
    } catch (err) {
      // toast handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerCustomer(registerForm.name, registerForm.email, registerForm.password);
      onOpenChange(false);
      setRegisterForm({ name: "", email: "", password: "" });
    } catch (err) {
      // toast handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900"> <T>Customer Account</T> </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login" className="cursor-pointer"> <T>Sign In</T> </TabsTrigger>
            <TabsTrigger value="register" className="cursor-pointer"> <T>Register</T> </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Link to="/reset-password" onClick={() => onOpenChange(false)} className="block text-sm underline mb-4"> <T>Forgot password?</T> </Link>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="cust-email"> <T>Email Address</T> </Label>
                <Input
                  id="cust-email"
                  type="email"
                  required
                  placeholder={tr("your@email.com")}
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cust-password"> <T>Password</T> </Label>
                <Input
                  id="cust-password"
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full gap-2 cursor-pointer" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={16} /> : <LogIn size={16} />} <T>Sign In</T> </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name"> <T>Full Name</T> </Label>
                <Input
                  id="reg-name"
                  type="text"
                  required
                  placeholder={tr("John Doe")}
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-email"> <T>Email Address</T> </Label>
                <Input
                  id="reg-email"
                  type="email"
                  required
                  placeholder={tr("john@example.com")}
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-password"> <T>Password (min 6 chars)</T> </Label>
                <Input
                  id="reg-password"
                  type="password"
                  required
                  minLength={6}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full gap-2 cursor-pointer" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />} <T>Create Account</T> </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
