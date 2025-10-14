// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardRouter from "./pages/DashboardRouter";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

// Guards
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

// (Optional) still have a dedicated page for this
import DeactivateAccount from "./pages/DeactivateAccount";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen w-full flex flex-col text-white overflow-x-hidden">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected (user OR admin) */}
            <Route element={<PrivateRoute />}>
              {/* NOTE: /* allows nested routes inside DashboardRouter */}
              <Route path="/dashboard/*" element={<DashboardRouter />} />
            </Route>

            {/* --- Redirect old top-level admin URLs into the dashboard layout --- */}
            <Route path="/logs" element={<Navigate to="/dashboard/logs" replace />} />
            <Route path="/create-user" element={<Navigate to="/dashboard/create-user" replace />} />
            <Route path="/manage-roles" element={<Navigate to="/dashboard/manage-roles" replace />} />
            <Route path="/admin/products" element={<Navigate to="/dashboard/products" replace />} />
            <Route path="/admin/services/create" element={<Navigate to="/dashboard/services" replace />} />
            <Route path="/admin/pet-profiles" element={<Navigate to="/dashboard/pet-profiles" replace />} />
            <Route path="/update-password" element={<Navigate to="/dashboard/update-password" replace />} />

            {/* If you still need a separate admin-only route outside dashboard, keep it here */}
            <Route element={<AdminRoute />}>
              <Route path="/deactivate-account" element={<DeactivateAccount />} />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
            {/*
              Prefer redirect instead of a 404?
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
