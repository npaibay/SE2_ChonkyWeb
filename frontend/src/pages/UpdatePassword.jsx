import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/update-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.detail || "Error updating password");
        return;
      }

      setMsg("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMsg("Server error, please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-white">Update Password</h1>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-white">Old Password</label>
          <input
            type="password"
            placeholder="Enter old password..."
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-white">New Password</label>
          <input
            type="password"
            placeholder="Enter new password..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition"
        >
          Update
        </button>
      </form>

      {msg && (
        <p className="mt-4 text-sm font-medium text-red-400">{msg}</p>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-400 hover:underline"
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}

export default UpdatePassword;
