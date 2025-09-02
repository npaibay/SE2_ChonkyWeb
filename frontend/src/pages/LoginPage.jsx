import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/pictures/chonky_boi-logo-01.png";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const errorMsg = sessionStorage.getItem("authError");
    if (errorMsg) {
      setAuthError(errorMsg);
      sessionStorage.removeItem("authError");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        (toast?.error || alert)(data.detail || "Invalid credentials");
        setLoading(false);
        return;
      }

      const { access, refresh } = await res.json();

      // fetch profile
      const meRes = await fetch("http://127.0.0.1:8000/api/me/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      if (meRes.ok) {
        const me = await meRes.json();
        login({ access, refresh }, me);
      } else {
        sessionStorage.setItem("authError", "Failed to load user profile.");
        navigate("/");
        return;
      }

      (toast?.success || alert)("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      sessionStorage.setItem("authError", "Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-gray-800 p-6 sm:p-8 md:p-10 rounded-xl shadow-md">
        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            src={logo}
            alt="Chonky Boi Pet Store"
            className="mx-auto object-contain w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64"
            draggable="false"
          />
        </div>

        {authError && (
          <div className="mb-4 text-center text-red-400 font-medium text-sm">
            {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div>
            <label
              htmlFor="identifier"
              className="block mb-1 font-medium text-white text-sm sm:text-base"
            >
              Email address or Username
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="Enter your email or username..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-white text-sm sm:text-base"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 sm:py-2.5 rounded transition text-sm sm:text-base`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-gray-300">
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
