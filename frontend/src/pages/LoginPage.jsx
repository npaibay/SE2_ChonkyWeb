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

  const notifyErr = (msg) =>
    (toast?.error ? toast.error(msg) : alert(msg));
  const notifyOk = (msg) =>
    (toast?.success ? toast.success(msg) : alert(msg));

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setAuthError(null);

    try {
      // 1) Get tokens (email OR username supported by your backend)
      const tokenRes = await fetch("/api/users/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (!tokenRes.ok) {
        const data = await tokenRes.json().catch(() => ({}));
        const msg = data?.detail || "Invalid credentials";
        setAuthError(msg);
        notifyErr(msg);
        setLoading(false);
        return;
      }

      const { access, refresh } = await tokenRes.json();

      // 2) Fetch profile with the access token
      const meRes = await fetch("/api/users/me/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });

      if (!meRes.ok) {
        setAuthError("Failed to load user profile.");
        notifyErr("Failed to load user profile.");
        setLoading(false);
        return;
      }

      const me = await meRes.json(); // { id, username, email, is_admin }

      // 3) Persist tokens with keys that your apiFetch expects
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // 4) Update context (your AuthContext.login may also navigate)
      login({ access, refresh }, me);

      // 5) Navigate to dashboard (safe even if login() already navigates)
      notifyOk("Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setAuthError("Server error, please try again.");
      notifyErr("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-chonky-brown-50 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-gray-800/50 p-6 sm:p-8 md:p-10 rounded-xl shadow-md">
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
              className="block mb-1 font-medium text-default-text text-sm sm:text-base"
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
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded bg-gray-700/60 border border-poop text-default-text placeholder-whitish text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow"
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-default-text text-sm sm:text-base"
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
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded bg-gray-700/60 border border-poop text-default-text placeholder-whitish text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-yellow/80" : "bg-yellow hover:bg-yellow/90"
            } text-default-text font-semibold py-2 sm:py-2.5 btn-rounded-3xl transition text-sm sm:text-base`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-whitish">
          <span>New user? </span>
          <Link to="/create-user" className="text-yellow font-bold hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
