import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-white text-lg">
        Checking session…
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
