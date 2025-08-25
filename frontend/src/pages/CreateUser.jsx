import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/create-user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.detail || "Error creating user");
        return;
      }

      const data = await res.json();
      setMsg(`User "${data.user.username}" created successfully!`);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setMsg("Server error, please try again.");
    }
  };

  return (
    <div>
      <h1>Create User</h1>

      <form onSubmit={handleCreate}>
        <div>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Create</button>
      </form>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      {/* Back button */}
      <div style={{ marginTop: "16px" }}>
        <button onClick={() => navigate(-1)}>⬅ Back</button>
      </div>
    </div>
  );
}

export default CreateUser;
