export async function apiFetch(url, options = {}) {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  // headers (don’t force Content-Type for FormData)
  const headers = new Headers(options.headers || {});
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (access && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  // normalize JSON body
  let body = options.body;
  if (!isFormData && body && typeof body === "object" && !(body instanceof Blob)) {
    body = JSON.stringify(body);
  }

  let res = await fetch(url, { ...options, headers, body });

  if (res.status === 401 && refresh) {
    // try refresh once
    const refreshRes = await fetch("/api/users/token/refresh/", {
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
        res = await fetch(url, { ...options, headers: retryHeaders, body });
      }
    }

    if (res.status === 401) {
      // still unauthorized → clear and let route guards redirect
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    }
  }

  return res;
}

export async function apiGet(url)    { return apiFetch(url, { method: "GET" }); }
export async function apiPost(url,b) { return apiFetch(url, { method: "POST", body: b }); }
export async function apiPatch(url,b){ return apiFetch(url, { method: "PATCH", body: b }); }
export async function apiDelete(url,b){return apiFetch(url, { method: "DELETE", body: b }); }
