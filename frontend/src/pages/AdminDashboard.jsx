import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

function AdminDashboard() {
  const { user } = useAuth();

  if (!user) {
    return null; // handled by PrivateRoute
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-900 text-white p-8">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-md p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-300 mb-8">
          Welcome, <span className="font-semibold">{user.username || user.email}</span>{" "}
          <span className="text-sm text-blue-400">(admin)</span>
        </p>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <LogoutButton />

          <Link
            to="/logs"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium transition flex items-center justify-center"
          >
            📜 View Logs
          </Link>

          <Link
            to="/update-password"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition flex items-center justify-center"
          >
            🔑 Update Password
          </Link>

          <Link
            to="/create-user"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition flex items-center justify-center"
          >
            ➕ Create User
          </Link>

          <Link
            to="/manage-roles"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition flex items-center justify-center"
          >
            🛡 Manage Roles
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
