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
    <div className="min-h-screen flex flex-col bg-chonky-brown-50">
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md p-8 bg-bg-bottom rounded-xl shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-default-text text-center">
            Create User
          </h1>

          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block mb-1 font-medium text-default-text"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 rounded bg-chonky-brown-50 text-default-text border-none focus:ring-2 focus:ring-yellow"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-default-text"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded bg-chonky-brown-50 text-default-text border-none focus:ring-2 focus:ring-yellow"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-default-text"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded bg-chonky-brown-50 text-default-text border-none focus:ring-2 focus:ring-yellow"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow hover:bg-yellow/90 text-default-text py-2 btn-rounded-3xl font-semibold transition"
            >
              Create
            </button>
          </form>

          {msg && (
            <p className="mt-4 text-sm text-red-400 font-medium">{msg}</p>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-yellow hover:underline"
            >
              ⬅ Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateUser;
