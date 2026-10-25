import { translate } from '@/lib/translations';
import React, { createContext, useContext, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";

const UserAuthContext = createContext();

const USER_KEY = "customer_user";
const TOKEN_KEY = "customer_token";

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    try { return saved && localStorage.getItem(TOKEN_KEY) ? JSON.parse(saved) : null; } catch { return null; }
  });

  const [userToken, setUserToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const registerCustomer = async (name, email, password) => {
    try {
      const { data } = await apiClient.post("/auth/register", { name, email, password });
      if (data?.token && data?.user) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
        setUserToken(data.token);
        toast.success(translate(`Account created! Welcome, ${data.user.name}`));
        return data.user;
      }
    } catch (err) {
      toast.error(translate(err.payload?.message || err.message || "Failed to create account."));
      throw err;
    }
  };

  const loginCustomer = async (email, password) => {
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      if (data?.token && data?.user) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
        setUserToken(data.token);
        toast.success(translate(`Welcome back, ${data.user.name}!`));
        return data.user;
      }
    } catch (err) {
      toast.error(translate(err.payload?.message || err.message || "Invalid credentials."));
      throw err;
    }
  };

  const logoutCustomer = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setUserToken(null);
    toast.info(translate("Logged out successfully."));
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        userToken,
        isLoggedIn: !!user && !!userToken,
        registerCustomer,
        loginCustomer,
        logoutCustomer,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
