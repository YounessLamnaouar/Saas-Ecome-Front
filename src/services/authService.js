import { apiClient } from "@/lib/apiClient";

const TOKEN_KEY = "admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export async function login(email, password) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  localStorage.setItem(TOKEN_KEY, data.token);
  return data.user;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}