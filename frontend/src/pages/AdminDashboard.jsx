import { useState } from "react";
import { Link } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import Modal from "../components/Modal";
import AdminPetProfileManager from "./AdminPetProfileManager"; // Import the manager
import AdminServiceManager from "./AdminServiceManager"; // Import the service manager
import AdminProductManager from "./AdminProductManager"; // Import the product manager

function AdminDashboard() {
  const { user } = useAuth();
  const [openPetProfile, setOpenPetProfile] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [openProduct, setOpenProduct] = useState(false); // State for product manager modal

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-chonky-brown-50">
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

            {/* Product Manager as a modal */}
            <button
              onClick={() => setOpenProduct(true)}
              className="bg-yellow hover:bg-yellow/90 text-default-text px-4 py-2 btn-rounded font-medium transition flex items-center justify-center"
            >
              🛒 Product Manager
            </button>
            {/* Pet Profile Manager as a modal */}
            <button
              onClick={() => setOpenPetProfile(true)}
              className="bg-peach hover:bg-peach/90 text-default-text px-4 py-2 btn-rounded font-medium transition flex items-center justify-center"
            >
              🐾 Pet Profile Manager
            </button>
            {/* Service Manager as a modal */}
            <button
              onClick={() => setOpenService(true)}
              className="bg-blue-600 hover:bg-blue-700 text-default-text px-4 py-2 btn-rounded font-medium transition flex items-center justify-center"
            >
              ⚙️ Service Manager
            </button>
          </div>
        </div>
      </div>
      {/* Modal for Product Manager */}
      <Modal open={openProduct} onClose={() => setOpenProduct(false)}>
        <AdminProductManager asModal onClose={() => setOpenProduct(false)} />
      </Modal>
      {/* Modal for Pet Profile Manager */}
      <Modal open={openPetProfile} onClose={() => setOpenPetProfile(false)}>
        <AdminPetProfileManager asModal onClose={() => setOpenPetProfile(false)} />
      </Modal>
      {/* Modal for Service Manager */}
      <Modal open={openService} onClose={() => setOpenService(false)}>
        <AdminServiceManager asModal onClose={() => setOpenService(false)} />
      </Modal>
    </div>
  );
}

export default AdminDashboard;
