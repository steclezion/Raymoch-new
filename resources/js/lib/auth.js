// resources/js/lib/auth.js

export async function getAuthUser() {
  const res = await fetch("/auth/user", {
    method: "GET",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  const json = await res.json().catch(() => ({}));

  // Your backend returns: { authenticated: boolean, user: {...} }
  return {
    authenticated: !!json.authenticated,
    user: json.user || null,
  };
}

export async function logoutRequest({ logoutUrl = "/logout", csrfToken } = {}) {
  const token =
    csrfToken ||
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
    "";

  // Laravel expects POST logout (recommended).
  // If your route is GET /logout, you can still redirect,
  // but POST is more secure and standard.
  const res = await fetch(logoutUrl, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "X-CSRF-TOKEN": token,
    },
  });

  // Some apps return 204, some return json.
  const json = await res.json().catch(() => ({}));

  return { ok: res.ok, json };
}