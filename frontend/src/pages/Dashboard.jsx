import UpdatePassword from "./UpdatePassword";

function Dashboard({ user }) {
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
    <div className="w-full max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-2">User Dashboard</h1>
      <p className="text-lg mb-6">
        Welcome, <span className="font-medium">{current.username || current.email}</span>
      </p>

      {/* Logout */}
      <div className="mb-8">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <hr className="border-gray-700 mb-8" />

      {/* Update Password */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Update Password</h2>
        <UpdatePassword />
      </section>

      {/* Normal user content */}
      <div>
        <p className="text-sm text-gray-300">Normal user content goes here.</p>
      </div>
    </div>
  );
}

export default Dashboard;
