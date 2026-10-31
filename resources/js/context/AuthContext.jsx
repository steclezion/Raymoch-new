import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { clearAuthUserCache, getAuthUser } from "../lib/auth.js";
import { LoginActivityService } from "../services/LoginActivityService.js";

const AuthCtx = createContext(null);

export function useAuth() {
  const context = useContext(AuthCtx);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider />");
  return context;
}

function getCsrf() {
  return window.APP?.csrf ?? window.LOGIN_BOOT?.csrf ??
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "";
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [booted, setBooted] = useState(false);
  const bcRef = useRef(null);
  const activityServiceRef = useRef(null);

  const refreshAuth = async () => {
    try {
      const { authenticated, user } = await getAuthUser();
      setIsAuthenticated(authenticated);
      setAuthUser(authenticated ? user || null : null);
    } catch {
      setIsAuthenticated(false);
      setAuthUser(null);
    } finally {
      setBooted(true);
    }
  };

  const login = (user) => {
    setIsAuthenticated(true);
    setAuthUser(user || null);
  };

  const logout = async ({ silent = false, broadcast = true } = {}) => {
    clearAuthUserCache();
    try {
      await fetch("/logout", { method: "POST", headers: { Accept: "application/json", "X-CSRF-TOKEN": getCsrf() }, credentials: "include" });
    } catch {}
    setIsAuthenticated(false);
    setAuthUser(null);
    try { localStorage.setItem("raymoch:logout", String(Date.now())); } catch {}
    if (broadcast && bcRef.current) {
      try { bcRef.current.postMessage({ type: "logout" }); } catch {}
    }
    if (!silent) window.location.href = "/";
  };

  useEffect(() => { refreshAuth(); }, []);

  useEffect(() => {
    if (!booted || !isAuthenticated) {
      activityServiceRef.current?.stop();
      activityServiceRef.current = null;
      return undefined;
    }
    const service = new LoginActivityService({
      onAcknowledgement: (state) => window.dispatchEvent(new CustomEvent("raymoch:login-activity", { detail: state })),
      onExpired: () => {
        clearAuthUserCache();
        setIsAuthenticated(false);
        setAuthUser(null);
        window.location.replace("/");
      },
    });
    activityServiceRef.current = service;
    service.start();
    return () => {
      service.stop();
      if (activityServiceRef.current === service) activityServiceRef.current = null;
    };
  }, [booted, isAuthenticated]);

  useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      bcRef.current = new BroadcastChannel("raymoch-auth");
      bcRef.current.onmessage = (event) => {
        if (event?.data?.type === "logout") {
          setIsAuthenticated(false);
          setAuthUser(null);
          window.location.href = "/";
        }
      };
    }
    return () => { try { bcRef.current?.close(); } catch {} };
  }, []);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === "raymoch:logout" && event.newValue) {
        setIsAuthenticated(false);
        setAuthUser(null);
        window.location.href = "/";
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(() => ({ isAuthenticated, authUser, booted, refreshAuth, login, logout }), [isAuthenticated, authUser, booted]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
