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
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
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
    <div>
      <h1>Update Password</h1>

      <form onSubmit={handleUpdate}>
        <div>
          <label>Old Password</label>
          <input
            type="password"
            placeholder="Enter old password..."
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Update</button>
      </form>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      {/* Back button */}
      <div style={{ marginTop: "16px" }}>
        <button onClick={() => navigate(-1)}>⬅ Back</button>
      </div>
    </div>
  );
}

export default UpdatePassword;
