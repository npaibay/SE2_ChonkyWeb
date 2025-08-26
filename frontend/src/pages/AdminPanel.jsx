import { useState } from "react";
import UpdatePassword from "./UpdatePassword";
import CreateUser from "./CreateUser";
import ManageRoles from "./ManageRoles";   // 👈 PB7 component
import { Link } from "react-router-dom";

function AdminPanel({ user }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showManageRolesModal, setShowManageRolesModal] = useState(false); // 👈 PB7 modal

  let current = user;
  if (!current) {
    try {
      const raw = localStorage.getItem("user");
      if (raw) current = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse user:", err);
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  if (!current) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-bold mb-2 text-white">Admin Panel</h1>
      <p className="text-lg mb-6 text-white">
        Welcome, <span className="font-medium">{current.username || current.email}</span>{" "}
        {current.is_admin && <span className="text-sm text-gray-400">(admin)</span>}
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          🚪 Logout
        </button>

        <Link to="/logs">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            📜 View Logs
          </button>
        </Link>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
        >
          🔐 Update Password
        </button>

        <button
          onClick={() => setShowCreateUserModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          👤 Create User
        </button>

        {/* 👇 PB7 Manage Roles */}
        <button
          onClick={() => setShowManageRolesModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          🛡️ Manage Roles
        </button>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-2 right-2 text-white hover:text-red-400 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-white">Update Password</h2>
            <UpdatePassword />
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowCreateUserModal(false)}
              className="absolute top-2 right-2 text-white hover:text-red-400 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-white">Create User</h2>
            <CreateUser />
          </div>
        </div>
      )}

      {/* 👇 PB7 Manage Roles Modal */}
      {showManageRolesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowManageRolesModal(false)}
              className="absolute top-2 right-2 text-white hover:text-red-400 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-white">Manage User Roles</h2>
            <ManageRoles onDone={() => setShowManageRolesModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
