// resources/js/lib/auth.js

let authRequest = null;

export function clearAuthUserCache() {
  authRequest = null;
}

export async function getAuthUser() {
  if (!authRequest) {
    authRequest = fetch("/auth/user", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));

        return {
          authenticated: res.ok && !!json.authenticated,
          user: json.user || null,
        };
      })
      .catch((error) => {
        authRequest = null;
        throw error;
      });
  }

  return authRequest;
}

export async function logoutRequest({ logoutUrl = "/logout", csrfToken } = {}) {
  clearAuthUserCache();
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
