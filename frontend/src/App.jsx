import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardRouter from "./pages/DashboardRouter";
import UpdatePassword from "./pages/UpdatePassword";
import CreateUser from "./pages/CreateUser";
import DeactivateAccount from "./pages/DeactivateAccount";
import Logs from "./pages/Logs";
import ManageRoles from "./pages/ManageRoles";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import AdminServiceManager from "./pages/AdminServiceManager";
import AdminProductManager from "./pages/AdminProductManager";
import AdminPetProfileManager from "./pages/AdminPetProfileManager";

// 🔒 Require any authenticated user
function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// 🔒 Require admin only
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen w-full flex flex-col text-white overflow-x-hidden">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Shared user/admin */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardRouter />
                </PrivateRoute>
              }
            />
            <Route
              path="/update-password"
              element={
                <PrivateRoute>
                  <UpdatePassword />
                </PrivateRoute>
              }
            />

            {/* Admin-only */}
            <Route
              path="/create-user"
              element={
                <AdminRoute>
                  <CreateUser />
                </AdminRoute>
              }
            />
            <Route
              path="/deactivate-account"
              element={
                <AdminRoute>
                  <DeactivateAccount />
                </AdminRoute>
              }
            />
            <Route
              path="/logs"
              element={
                <AdminRoute>
                  <Logs />
                </AdminRoute>
              }
            />
            <Route
              path="/manage-roles"
              element={
                <AdminRoute>
                  <ManageRoles />
                </AdminRoute>
              }
            />
            <Route path="/admin/services/create" element={<AdminServiceManager />} />
            <Route path="/admin/products" element={<AdminProductManager />} />
            <Route path="/admin/pet-profiles" element={<AdminPetProfileManager />} />

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
