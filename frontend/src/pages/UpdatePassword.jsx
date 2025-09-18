import { useState } from "react";
import { Link } from "react-router-dom";

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("info");

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
        setMsgType("error");
        return;
      }

      setMsg("Password updated successfully!");
      setMsgType("success");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMsg("Server error, please try again.");
      setMsgType("error");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-chonky-brown-50 px-4">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        {/* Back button */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded btn-rounded bg-gray-700 hover:bg-gray-600 text-white transition"
          >
            <span aria-hidden>←</span>
            Back to Admin Dashboard
          </Link>
        </div>

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
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 btn-rounded-3xl font-semibold transition"
          >
            Update
          </button>
        </form>

        {msg && (
          <p
            className={`mt-4 text-sm font-medium ${
              msgType === "success"
                ? "text-green-400"
                : msgType === "error"
                ? "text-red-400"
                : "text-white"
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

export default UpdatePassword;
