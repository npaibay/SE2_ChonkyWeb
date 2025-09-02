import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-white text-lg">
        Loading...
      </div>
    );
  }

  return user.is_admin ? (
    <AdminDashboard user={user} />
  ) : (
    <UserDashboard user={user} />
  );
}

export default DashboardRouter;
