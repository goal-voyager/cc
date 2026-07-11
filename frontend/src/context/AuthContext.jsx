import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("cc_token");
    if (!token) {
      setLoading(false);
      return;
    }
    apiGet("/auth/me")
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem("cc_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await apiPost("/auth/login", { email, password });
    localStorage.setItem("cc_token", res.token);
    setUser(res.user);
    return res.user;
  }

  async function register(name, email, password, role) {
    const res = await apiPost("/auth/register", { name, email, password, role });
    localStorage.setItem("cc_token", res.token);
    setUser(res.user);
    return res.user;
  }

  function logout() {
    localStorage.removeItem("cc_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
