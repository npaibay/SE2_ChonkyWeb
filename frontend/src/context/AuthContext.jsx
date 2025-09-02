import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [access, setAccess] = useState(localStorage.getItem("access"));
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh"));

  // ✅ Always at top level
  const navigate = useNavigate();

  // login helper
  const login = (tokens, userData) => {
    setAccess(tokens.access);
    setRefresh(tokens.refresh);
    setUser(userData);
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // logout helper
  const logout = (message) => {
    setAccess(null);
    setRefresh(null);
    setUser(null);
    localStorage.clear();
    if (message) sessionStorage.setItem("authError", message);

    try {
      navigate("/"); // ✅ uses hook normally
    } catch {
      window.location.href = "/"; // ✅ fallback if no Router
    }
  };

  return (
    <AuthContext.Provider value={{ user, access, refresh, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
