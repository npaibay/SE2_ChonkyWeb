const API_BASE = (import.meta?.env?.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

function withBase(url) {
  // absolute (http/https) => leave as-is; otherwise prefix API_BASE
  return /^https?:\/\//i.test(url) ? url : `${API_BASE}${url}`;
}

export async function apiFetch(url, options = {}) {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  const headers = new Headers(options.headers || {});
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (access && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  let body = options.body;
  if (!isFormData && body && typeof body === "object" && !(body instanceof Blob)) {
    body = JSON.stringify(body);
  }

  let res = await fetch(withBase(url), { ...options, headers, body });

  // Try refresh once
  if (res.status === 401 && refresh) {
    const refreshRes = await fetch(withBase("/api/users/token/refresh/"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      if (data.access) {
        localStorage.setItem("access", data.access);
        const retryHeaders = new Headers(headers);
        retryHeaders.set("Authorization", `Bearer ${data.access}`);
        res = await fetch(withBase(url), { ...options, headers: retryHeaders, body });
      }
    }

    if (res.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    }
  }

  return res;
}

export const apiGet = (url) => apiFetch(url, { method: "GET" });
export const apiPost = (url, json) => apiFetch(url, { method: "POST", body: json });
export const apiPatch = (url, json) => apiFetch(url, { method: "PATCH", body: json });
export const apiDelete = (url, json) => apiFetch(url, { method: "DELETE", body: json });