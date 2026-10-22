const CHANNEL = "raymoch-login-activity";
const ACTIVITY_KEY = "raymoch:activity";
const LOGOUT_KEY = "raymoch:logout";
const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000;
const TOUCH_THROTTLE_MS = 30 * 1000;

function csrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
}

export class LoginActivityService {
  constructor({ onAcknowledgement, onExpired } = {}) {
    this.onAcknowledgement = onAcknowledgement;
    this.onExpired = onExpired;
    this.lastActivityAt = Date.now();
    this.lastTouchAt = 0;
    this.timeoutMs = DEFAULT_TIMEOUT_MS;
    this.expired = false;
    this.finished = false;
    this.events = ["pointerdown", "keydown", "scroll", "touchstart"];
    this.recordActivity = this.recordActivity.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
    this.handleStorage = this.handleStorage.bind(this);
  }

  async start() {
    if (this.controller) return;
    this.controller = new AbortController();
    this.events.forEach((name) => window.addEventListener(name, this.recordActivity, { passive: true }));
    document.addEventListener("visibilitychange", this.handleVisibility);
    window.addEventListener("storage", this.handleStorage);

    if (typeof BroadcastChannel !== "undefined") {
      this.channel = new BroadcastChannel(CHANNEL);
      this.channel.onmessage = (event) => this.receiveSignal(event.data);
    }

    await this.touch(true);
    this.statusInterval = window.setInterval(() => this.checkStatus(), 60 * 1000);
    this.scheduleExpiryCheck();
  }

  stop() {
    this.events.forEach((name) => window.removeEventListener(name, this.recordActivity));
    document.removeEventListener("visibilitychange", this.handleVisibility);
    window.removeEventListener("storage", this.handleStorage);
    window.clearTimeout(this.touchTimer);
    window.clearTimeout(this.expiryTimer);
    window.clearInterval(this.statusInterval);
    this.controller?.abort();
    this.controller = null;
    this.channel?.close();
    this.channel = null;
  }

  recordActivity(event) {
    if (this.expired || event?.isTrusted === false) return;
    this.lastActivityAt = Date.now();
    this.broadcast({ type: "activity", at: this.lastActivityAt });
    this.scheduleTouch();
    this.scheduleExpiryCheck();
  }

  receiveSignal(message) {
    if (message?.type === "activity" && Number.isFinite(message.at)) {
      this.lastActivityAt = Math.max(this.lastActivityAt, message.at);
      this.scheduleExpiryCheck();
    } else if (message?.type === "expired") {
      this.finishExpired(message.payload);
    }
  }

  handleStorage(event) {
    if (event.key === ACTIVITY_KEY && event.newValue) {
      const at = Number(event.newValue);
      if (Number.isFinite(at)) this.receiveSignal({ type: "activity", at });
    } else if (event.key === LOGOUT_KEY && event.newValue) {
      this.finishExpired({ redirect: "/" });
    }
  }

  handleVisibility() {
    if (document.visibilityState !== "visible") return;
    this.checkLocalExpiry();
    this.checkStatus();
  }

  broadcast(message) {
    try { this.channel?.postMessage(message); } catch {}
    if (message.type === "activity") {
      try { localStorage.setItem(ACTIVITY_KEY, String(message.at)); } catch {}
    }
  }

  scheduleTouch() {
    if (this.touchTimer) return;
    const delay = Math.max(0, TOUCH_THROTTLE_MS - (Date.now() - this.lastTouchAt));
    this.touchTimer = window.setTimeout(() => {
      this.touchTimer = null;
      this.touch();
    }, delay);
  }

  async touch(force = false) {
    if (this.expired || (!force && Date.now() - this.lastTouchAt < TOUCH_THROTTLE_MS)) return;
    this.lastTouchAt = Date.now();
    await this.request("/auth/activity/touch", "POST");
  }

  async checkStatus() {
    if (this.expired) return;
    this.checkLocalExpiry();
    if (!this.expired) await this.request("/auth/activity/status", "GET");
  }

  scheduleExpiryCheck() {
    window.clearTimeout(this.expiryTimer);
    const remaining = Math.max(0, this.timeoutMs - (Date.now() - this.lastActivityAt));
    this.expiryTimer = window.setTimeout(() => this.checkLocalExpiry(), remaining + 50);
  }

  checkLocalExpiry() {
    if (!this.expired && Date.now() - this.lastActivityAt >= this.timeoutMs) this.expire();
  }

  async expire() {
    if (this.expired) return;
    this.expired = true;
    const payload = await this.request("/auth/activity/expire", "POST", true);
    this.finishExpired(payload || { redirect: "/" });
  }

  async request(url, method, allowExpired = false) {
    try {
      const response = await fetch(url, {
        method,
        credentials: "same-origin",
        headers: { Accept: "application/json", ...(method === "POST" ? { "X-CSRF-TOKEN": csrfToken() } : {}) },
        signal: this.controller?.signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (payload.timeout_seconds) this.timeoutMs = payload.timeout_seconds * 1000;
      this.onAcknowledgement?.(payload);
      if (!allowExpired && (response.status === 401 || payload.expired || payload.authenticated === false)) this.finishExpired(payload);
      return payload;
    } catch (error) {
      if (error?.name !== "AbortError") this.onAcknowledgement?.({ acknowledged: false, offline: true });
      return null;
    }
  }

  finishExpired(payload = {}) {
    if (this.finished) return;
    this.expired = true;
    this.finished = true;
    try { localStorage.setItem(LOGOUT_KEY, String(Date.now())); } catch {}
    try { this.channel?.postMessage({ type: "expired", payload }); } catch {}
    this.onExpired?.({ ...payload, redirect: "/" });
    this.stop();
  }
}
