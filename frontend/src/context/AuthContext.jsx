import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // hydrate once on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccess = localStorage.getItem("access");
    const storedRefresh = localStorage.getItem("refresh");
    if (storedUser && storedAccess) {
      setUser(JSON.parse(storedUser));
      setAccess(storedAccess);
      setRefresh(storedRefresh || null);
    }
    setLoading(false);
  }, []);

  // multi-tab sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "access" && !e.newValue) {
        // someone logged out in another tab
        setAccess(null); setRefresh(null); setUser(null);
      }
      if (e.key === "user" && e.newValue) {
        setUser(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (tokens, userData, redirectTo = "/dashboard") => {
    setAccess(tokens.access);
    setRefresh(tokens.refresh);
    setUser(userData);
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    try { navigate(redirectTo); } catch {}
  };

  const logout = (message) => {
    setAccess(null);
    setRefresh(null);
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    if (message) sessionStorage.setItem("authError", message);
    try { navigate("/login"); } catch { window.location.href = "/login"; }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const value = useMemo(
    () => ({ user, access, refresh, loading, login, logout, updateUser }),
    [user, access, refresh, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
