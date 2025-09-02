import { useAuth } from "../context/AuthContext";

function LogoutButton() {
  const { logout, access, refresh } = useAuth();

  const handleLogout = async () => {
    try {
      if (refresh) {
        await fetch("http://127.0.0.1:8000/api/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ refresh }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout("You have been logged out.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
