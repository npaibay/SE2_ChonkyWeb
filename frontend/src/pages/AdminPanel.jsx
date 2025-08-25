import UpdatePassword from "./UpdatePassword";
import CreateUser from "./CreateUser";

function AdminPanel({ user }) {
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
    <div>
      <h1>Admin Panel</h1>
      <p>
        Welcome, {current.username || current.email}{" "}
        {current.is_admin ? "(admin)" : ""}
      </p>

      <div style={{ margin: "12px 0" }}>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <hr />

      <section style={{ marginTop: 16 }}>
        <h2>Update Password</h2>
        <UpdatePassword />
      </section>

      <hr />

      <section style={{ marginTop: 16 }}>
        <h2>Create User</h2>
        <CreateUser />
      </section>
    </div>
  );
}

export default AdminPanel;
