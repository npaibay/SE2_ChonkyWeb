import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; // works if you installed toastify

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const isEmail = identifier.includes("@");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...(isEmail ? { email: identifier } : { username: identifier }),
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // use toast if available, else alert
        (toast?.error || alert)(data.detail || "Invalid credentials");
        return;
      }

      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));
      (toast?.success || alert)("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      (toast?.error || alert)("Server error, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-white">ChonkyBoi Pet Store and Grooming Salon</h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-white">
              Email address or Username
            </label>
            <input
              type="text"
              placeholder="Enter your email or username..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-white">Password</label>
            <input
              type="password"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-300 text-center">
          <span>New user? </span>
          <Link to="/create-user" className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
