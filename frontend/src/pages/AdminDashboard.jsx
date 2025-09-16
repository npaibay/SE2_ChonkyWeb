import { Link } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

function AdminDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-chonky-brown-50">
      <HomeNavbar hideLoginButton />
      <div className="flex flex-col items-center justify-start flex-1 p-8">
        <div className="w-full max-w-4xl bg-gray-800/50 rounded-xl shadow-md p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-2 text-default-text">Admin Panel</h1>
          <p className="text-whitish mb-8">
            Welcome, <span className="font-semibold">{user.username || user.email}</span>{" "}
            <span className="text-sm text-yellow">(admin)</span>
          </p>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <LogoutButton />

            <Link
              to="/logs"
              className="bg-yellow hover:bg-yellow/90 text-default-text px-4 py-2 btn-rounded font-medium transition flex items-center justify-center"
            >
              📜 View Logs
            </Link>

            <Link
              to="/update-password"
              className="bg-peach hover:bg-peach/90 text-default-text px-4 py-2 btn-rounded font-medium transition flex items-center justify-center"
            >
              🔑 Update Password
            </Link>

            <Link
              to="/create-user"
              className="bg-green-600 hover:bg-green-700 text-default-text px-4 py-2 btn-rounded font-medium transition flex items-center justify-center"
            >
              ➕ Create User
            </Link>

            <Link
              to="/manage-roles"
              className="bg-purple-600 hover:bg-purple-700 text-default-text px-4 py-2 btn-rounded font-medium transition flex items-center justify-center"
            >
              🛡 Manage Roles
            </Link>

            {/* New Button: Add/Create Service */}
            <Link
              to="/admin/services/create"
              className="bg-poop hover:bg-poop-hover text-default-text px-4 py-2 btn-rounded font-medium transition flex items-center justify-center"
            >
              🛠 Add Service
            </Link>

            {/* New Buttons */}
            <Link
              to="/admin/products"
              className="bg-yellow hover:bg-yellow/90 text-default-text px-4 py-2 btn-rounded font-medium transition flex items-center justify-center"
            >
              🛒 Product Manager
            </Link>
            <Link
              to="/admin/pet-profiles"
              className="bg-peach hover:bg-peach/90 text-default-text px-4 py-2 btn-rounded font-medium transition flex items-center justify-center"
            >
              🐾 Pet Profile Manager
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
