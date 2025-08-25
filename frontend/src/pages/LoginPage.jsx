import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // username OR email
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    const isEmail = identifier.includes("@");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required for session cookies
        body: JSON.stringify({
          ...(isEmail ? { email: identifier } : { username: identifier }),
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.detail || "Invalid credentials");
        return;
      }

      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMsg("Server error, please try again.");
    }
  };

  return (
    <div>
      <h1>Sign in to your account</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email address or Username</label>
          <input
            type="text"
            placeholder="Enter your email or username..."
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign in</button>
      </form>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <div style={{ marginTop: "16px" }}>
        <span>New user? </span>
        <Link to="/create-user">Create an account</Link>
      </div>
    </div>
  );
}

export default LoginPage;
