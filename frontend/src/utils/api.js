export async function apiFetch(url, options = {}) {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  // Build headers safely
  const headers = new Headers(options.headers || {});
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  // Only set Content-Type if we're sending JSON (not FormData/Blob)
  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (access && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  // Normalize JSON body
  let body = options.body;
  if (!isFormData && body && typeof body === "object" && !(body instanceof Blob)) {
    body = JSON.stringify(body);
  }

  let res = await fetch(url, { ...options, headers, body });

  // Attempt refresh once on 401
  if (res.status === 401 && refresh) {
    const rHeaders = new Headers({ "Content-Type": "application/json", Accept: "application/json" });
    const refreshRes = await fetch("/api/users/token/refresh/", {
      method: "POST",
      headers: rHeaders,
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      if (data.access) {
        // save new access and retry original request
        localStorage.setItem("access", data.access);

        const retryHeaders = new Headers(headers);
        retryHeaders.set("Authorization", `Bearer ${data.access}`);

        res = await fetch(url, { ...options, headers: retryHeaders, body });
      }
    }

    // If still unauthorized after refresh, clear auth (let route guards redirect)
    if (res.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    }
  }

  return res;
}

/* ---------------- Convenience helpers (optional) ---------------- */

export async function apiGet(url) {
  return apiFetch(url, { method: "GET" });
}

export async function apiPost(url, json) {
  return apiFetch(url, { method: "POST", body: json });
}

export async function apiPatch(url, json) {
  return apiFetch(url, { method: "PATCH", body: json });
}

export async function apiDelete(url, json) {
  return apiFetch(url, { method: "DELETE", body: json });
}