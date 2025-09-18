import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function ManageRoles({ onDone }) {
  const navigate = useNavigate();
  const { access, logout } = useAuth(); // ✅ use access token directly
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("user");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // -------------------
  // Fetch wrapper with token
  // -------------------
  const authFetch = async (url, options = {}) => {
    if (!access) {
      toast.error("You must be logged in.");
      navigate("/login");
      return null;
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Accept: "application/json",
        Authorization: `Bearer ${access}`, // ✅ attach access token
      },
    });

    if (res.status === 401) {
      logout("Session expired, please log in again.");
      return null;
    }

    return res;
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError("");
    try {
      const res = await authFetch("http://127.0.0.1:8000/api/users/");
      if (!res) return;

      const raw = await res.json().catch(() => []);
      if (!res.ok) throw new Error(raw?.detail || "Failed to load users");

      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw.results)
        ? raw.results
        : [];
      setUsers(list);
    } catch (err) {
      setUsersError(err.message || "Failed to load users");
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!usersLoading && users.length && !selectedUser) {
      setSelectedUser(users[0]?.username || "");
    }
  }, [usersLoading, users, selectedUser]);

  // -------------------
  // Role mapping
  // -------------------
  const roleFlags = useMemo(() => {
    switch (role) {
      case "staff":
        return { is_staff: true, is_superuser: false };
      case "superuser":
        return { is_staff: true, is_superuser: true };
      default:
        return { is_staff: false, is_superuser: false };
    }
  }, [role]);

  // -------------------
  // Submit handler
  // -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setBusy(true);

    try {
      const res = await authFetch("http://127.0.0.1:8000/api/update-role/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: selectedUser,
          ...roleFlags,
        }),
      });

      if (!res) return;

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.detail || "Error updating roles");
        return;
      }

      setMsg(data.detail || "Roles updated successfully.");
      toast.success("Role updated!");

      if (typeof onDone === "function") {
        setTimeout(() => onDone(), 600);
      }
    } catch (err) {
      setError("Server error, please try again.");
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  // -------------------
  // UI
  // -------------------
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-chonky-brown-50 px-4">
      <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-md">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded btn-rounded bg-gray-700 hover:bg-gray-600 text-white transition"
          >
            <span aria-hidden>←</span>
            Back to Admin Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-1 text-white">Manage Roles</h1>
        <p className="text-sm text-gray-300 mb-6">
          Choose a user and assign a role.{" "}
          <span className="text-yellow-300">User</span> has no admin permissions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User dropdown */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">User</label>
            <select
              className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-white outline-none focus:border-blue-500 disabled:opacity-60"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              disabled={usersLoading}
              required
            >
              <option value="" disabled>
                {usersLoading
                  ? "Loading users…"
                  : usersError
                  ? `Error: ${usersError}`
                  : "Select a user…"}
              </option>

              {!usersLoading &&
                !usersError &&
                users.map((u) => (
                  <option key={u.id ?? u.username} value={u.username}>
                    {u.username}{" "}
                    {u.is_superuser
                      ? "(superuser)"
                      : u.is_staff
                      ? "(staff)"
                      : ""}
                  </option>
                ))}
            </select>
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Role</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {["user", "staff", "superuser"].map((r) => (
                <label
                  key={r}
                  className="inline-flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 cursor-pointer hover:border-blue-500"
                >
                  <input
                    type="radio"
                    name="role"
                    className="accent-blue-600"
                    value={r}
                    checked={role === r}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="text-white text-sm capitalize">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={busy || usersLoading || !selectedUser}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-4 py-2 btn-rounded-3xl"
            >
              {busy ? "Updating…" : "Update Roles"}
            </button>
          </div>

          {/* Messages */}
          {msg && <p className="text-green-400 text-sm">{msg}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ManageRoles;
