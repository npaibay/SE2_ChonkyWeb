import { useAuth } from "../context/AuthContext";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import UpdatePassword from "./UpdatePassword";

// user pages
import ShopPage from "./ShopPage";
import CartPage from "./CartPage";
import AppointmentsPage from "./AppointmentsPage";
import FeedbackPage from "./FeedbackPage";

function UserDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Checking session…</div>;
  if (!user) return null; // PrivateRoute handles redirect

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">User Dashboard</h1>
        <p className="text-lg mb-6">
          Welcome, <span className="font-medium">{user.username || user.email}</span>
        </p>

        <div className="mb-6">
          <LogoutButton />
        </div>

        <hr className="border-gray-700 mb-6" />

        <section className="mb-2">
          <h2 className="text-2xl font-semibold mb-4">Update Password</h2>
          <UpdatePassword />
        </section>
      </div>

      {/* Body: sidebar + main */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-lg shadow p-4 md:col-span-1">
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <nav>
            <ul className="space-y-2">
              <li><Link to="shop" className="text-blue-600 hover:underline">🛍️ Shop</Link></li>
              <li><Link to="cart" className="text-blue-600 hover:underline">🧺 Cart</Link></li>
              <li><Link to="appointments" className="text-blue-600 hover:underline">📅 Appointments</Link></li>
              <li><Link to="feedback" className="text-blue-600 hover:underline">💬 Feedback</Link></li>
            </ul>
          </nav>
        </aside>

        {/* Main content (nested routes render here) */}
        <main className="bg-white rounded-lg shadow p-4 md:col-span-3">
          <Routes>
            <Route
              index
              element={
                <div>
                  <h2 className="text-xl font-semibold mb-2">Getting started</h2>
                  <p className="text-gray-600">
                    Use the links on the left to shop products, manage your cart, book appointments, or leave feedback.
                  </p>
                </div>
              }
            />
            <Route path="shop" element={<ShopPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            {/* Catch-all unknown user subpaths -> user dashboard home */}
            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
