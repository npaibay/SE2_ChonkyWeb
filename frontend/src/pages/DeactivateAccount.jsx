import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DeactivateAccount() {
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleDeactivate = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/deactivate-user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.detail || "Error deactivating user");
        return;
      }

      const data = await res.json();
      setMsg(data.detail || `User "${username}" deactivated.`);
      setUsername("");
    } catch (err) {
      console.error(err);
      setMsg("Server error, please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Deactivate Account</h1>

      <form onSubmit={handleDeactivate} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            placeholder="Enter username to deactivate..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition"
        >
          Deactivate
        </button>
      </form>

      {msg && (
        <p className="mt-4 text-sm text-red-400 font-medium">{msg}</p>
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

export default DeactivateAccount;
