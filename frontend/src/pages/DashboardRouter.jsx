import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "./AdminPanel";   // use AdminPanel (not AdminDashboard)
import Dashboard from "./Dashboard";

function DashboardRouter() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Trust localStorage (simple for Sprint 1)
    const raw = localStorage.getItem("user");
    if (!raw) {
      navigate("/"); // no user, go back to login
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setUser(parsed);
    } catch {
      navigate("/"); // parsing failed, treat as not logged in
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-white text-lg">
        Loading...
      </div>
    );
  }

  return user.is_admin ? (
    <AdminPanel user={user} />
  ) : (
    <Dashboard user={user} />
  );
}

export default DashboardRouter;
