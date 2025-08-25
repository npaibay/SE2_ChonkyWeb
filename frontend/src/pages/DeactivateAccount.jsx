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
    <div>
      <h1>Deactivate Account</h1>

      <form onSubmit={handleDeactivate}>
        <div>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username to deactivate..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <button type="submit">Deactivate</button>
      </form>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      {/* Back button */}
      <div style={{ marginTop: "16px" }}>
        <button onClick={() => navigate(-1)}>⬅ Back</button>
      </div>
    </div>
  );
}

export default DeactivateAccount;
