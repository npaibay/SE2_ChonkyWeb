// src/utils/api.js
export async function apiFetch(url, options = {}) {
  const access = localStorage.getItem("access");

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  if (access) {
    headers["Authorization"] = `Bearer ${access}`;
  }

  const res = await fetch(url, { ...options, headers });

  // Handle expired/invalid token
  if (res.status === 401) {
    try {
      const data = await res.json();
      if (data.code === "token_not_valid" || data.detail?.includes("token")) {
        // store message so LoginPage can display it
        sessionStorage.setItem("authError", "Access token has expired. Please log in again.");
      }
    } catch {
      sessionStorage.setItem("authError", "Access token has expired. Please log in again.");
    }

    clearAuthAndRedirect();
  }

  return res;
}

export function clearAuthAndRedirect() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  window.location.href = "/"; // send user to login
}
