import { useState } from "react";

function ManageRoles({ onDone }) {
  const [username, setUsername] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setBusy(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/update-role/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username,
          is_staff: isStaff,
          is_superuser: isSuperuser,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.detail || "Error updating roles");
        return;
        }

      setMsg(data.detail || "Roles updated successfully.");
      // Optional: clear form
      // setUsername(""); setIsStaff(false); setIsSuperuser(false);

      // If parent passed onDone, allow closing after success
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Username</label>
        <input
          type="text"
          className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-white outline-none focus:border-blue-500"
          placeholder="Enter username…"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6">
        <label className="inline-flex items-center gap-2 text-gray-200">
          <input
            type="checkbox"
            className="h-4 w-4 accent-blue-600"
            checked={isStaff}
            onChange={(e) => setIsStaff(e.target.checked)}
          />
          <span>Staff</span>
        </label>

        <label className="inline-flex items-center gap-2 text-gray-200">
          <input
            type="checkbox"
            className="h-4 w-4 accent-purple-600"
            checked={isSuperuser}
            onChange={(e) => setIsSuperuser(e.target.checked)}
          />
          <span>Superuser</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-4 py-2 rounded"
        >
          {busy ? "Updating…" : "Update Roles"}
        </button>
      </div>

      {/* Messages */}
      {msg && <p className="text-green-400 text-sm">{msg}</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </form>
  );
}

export default ManageRoles;
