import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import UpdatePassword from "./UpdatePassword";

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2">User Dashboard</h1>
      <p className="text-lg mb-6">
        Welcome,{" "}
        <span className="font-medium">{user.username || user.email}</span>
      </p>

      <div className="mb-8">
        <LogoutButton />
      </div>

      <hr className="border-gray-700 mb-8" />

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Update Password</h2>
        <UpdatePassword />
      </section>

      <div>
        <p className="text-sm text-gray-300">Normal user content goes here.</p>
      </div>
    </div>
  );
}

export default Dashboard;
