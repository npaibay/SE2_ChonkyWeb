import { useAuth } from "../context/AuthContext";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

// nested admin pages (render in the right panel)
import AdminAppointmentsPage from "./AdminAppointmentsPage";
import AdminFeedbackPage from "./AdminFeedbackPage";
import Logs from "./Logs";
import CreateUser from "./CreateUser";
import ManageRoles from "./ManageRoles";
import AdminProductManager from "./AdminProductManager";
import AdminServiceManager from "./AdminServiceManager";
import AdminPetProfileManager from "./AdminPetProfileManager";
import UpdatePassword from "./UpdatePassword";

// Sidebar item — uses ABSOLUTE paths so URLs don't keep appending
function AdminNavItem({ to, label, icon = null }) {
  const base =
    "block w-full text-left px-4 py-2 rounded-lg font-semibold transition active:scale-[.98] focus:outline-none";
  const idle = "bg-white/10 hover:bg-white/15 text-white";
  const active = "bg-white text-black shadow";
  return (
    <NavLink to={to} className={({ isActive }) => `${base} ${isActive ? active : idle}`}>
      <span className="inline-flex items-center gap-2">
        {icon} {label}
      </span>
    </NavLink>
  );
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Checking session…</div>;
  if (!user || !user.is_admin) return null; // AdminRoute/PrivateRoute handles redirect

  return (
    <div className="min-h-screen bg-[#5a2f12] text-white">
      {/* Header */}
      <header className="w-full bg-[#3a2a23]/95 sticky top-0 z-10 shadow">
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Admin Panel</h1>
            <p className="text-white/80 text-sm">Welcome, {user.username || "admin"}</p>
          </div>
          <div className="shrink-0">
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Body: sidebar (25%) + content (75%) */}
      <div className="w-full px-0 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar — flush left */}
          <aside className="lg:col-span-1">
            <div className="bg-[#3a2a23] rounded-2xl shadow-xl p-4 lg:sticky lg:top-24">
              <nav className="space-y-2">
                {/* Use absolute links so path doesn't append repeatedly */}
                <AdminNavItem to="/dashboard/appointments" label="Appointments" icon={<span>📅</span>} />
                <AdminNavItem to="/dashboard/feedback" label="Feedback & Reviews" icon={<span>💬</span>} />
                <AdminNavItem to="/dashboard/logs" label="View Logs" icon={<span>📄</span>} />
                <AdminNavItem to="/dashboard/create-user" label="Create User" icon={<span>➕</span>} />
                <AdminNavItem to="/dashboard/manage-roles" label="Manage Roles" icon={<span>🛡️</span>} />
                <AdminNavItem to="/dashboard/products" label="Product Manager" icon={<span>🛍️</span>} />
                <AdminNavItem to="/dashboard/services" label="Service Manager" icon={<span>🛠️</span>} />
                <AdminNavItem to="/dashboard/pet-profiles" label="Pet Profile Manager" icon={<span>🐾</span>} />
                <AdminNavItem to="/dashboard/update-password" label="Update Password" icon={<span>🔑</span>} />
              </nav>
              <div className="mt-4 text-sm text-white/70 px-1">
                <NavLink to="/dashboard" className="hover:underline">Dashboard home</NavLink>
              </div>
            </div>
          </aside>

          {/* Content area — nested routes render here */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-5 text-black">
              <Routes>
                {/* Overview (default) */}
                <Route
                  index
                  element={
                    <div className="text-gray-800">
                      <h2 className="text-2xl font-semibold mb-2">Overview</h2>
                      <p className="text-gray-600">
                        Pick a section on the left to manage appointments, review feedback, or handle admin tasks.
                      </p>
                    </div>
                  }
                />
                {/* All admin pages as nested routes */}
                <Route path="appointments" element={<AdminAppointmentsPage />} />
                <Route path="feedback" element={<AdminFeedbackPage />} />
                <Route path="logs" element={<Logs />} />
                <Route path="create-user" element={<CreateUser />} />
                <Route path="manage-roles" element={<ManageRoles />} />
                <Route path="products" element={<AdminProductManager />} />
                <Route path="services" element={<AdminServiceManager />} />
                <Route path="pet-profiles" element={<AdminPetProfileManager />} />
                <Route path="update-password" element={<UpdatePassword />} />
                {/* Unknown nested paths -> overview */}
                <Route path="*" element={<Navigate to="." replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}