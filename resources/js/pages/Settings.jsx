import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  LockKeyhole,
  LogOut,
  Mail,
  MonitorCog,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import "../styles/settings.css";

async function api(url, csrf, method = "GET", body) {
  const response = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json", "X-CSRF-TOKEN": csrf } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(Object.values(data.errors || {}).flat()[0] || data.message || "The request could not be completed.");
    error.fields = data.errors || {};
    throw error;
  }
  return data;
}

const SECTIONS = [
  ["account", "Account", UserRound],
  ["security", "Security", ShieldCheck],
  ["notifications", "Notifications", Bell],
  ["appearance", "Appearance", Palette],
];

function Toggle({ checked, onChange, label, description, disabled = false }) {
  return (
    <label className="settings-toggle-row">
      <span><strong>{label}</strong><small>{description}</small></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} disabled={disabled} />
      <i aria-hidden="true"><span /></i>
    </label>
  );
}

export default function Settings({ csrf = "", dataUrl = "/settings/data", profileUrl = "/settings/profile", passwordUrl = "/settings/password", preferencesUrl = "/settings/preferences" }) {
  const [active, setActive] = useState("account");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState({ name: "", email: "", avatar_url: "", authenticator_enabled: false });
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [preferences, setPreferences] = useState({ appearance: "system", compact_mode: false, email_security: true, email_product: true, email_research: false });
  const [passwords, setPasswords] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    api(dataUrl, csrf)
      .then((data) => {
        setUser(data.user);
        setProfile({ name: data.user.name || "", email: data.user.email || "" });
        setPreferences(data.preferences);
      })
      .catch((error) => setMessage({ type: "error", text: error.message }))
      .finally(() => setLoading(false));
  }, [csrf, dataUrl]);

  useEffect(() => {
    const root = document.documentElement;
    const mode = preferences.appearance;
    const dark = mode === "dark" || (mode === "system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
    root.dataset.raymochTheme = dark ? "dark" : "light";
    root.dataset.raymochDensity = preferences.compact_mode ? "compact" : "comfortable";
    localStorage.setItem("raymoch:appearance", mode);
    localStorage.setItem("raymoch:density", preferences.compact_mode ? "compact" : "comfortable");
    return () => {
      delete root.dataset.raymochTheme;
      delete root.dataset.raymochDensity;
    };
  }, [preferences.appearance, preferences.compact_mode]);

  const initials = useMemo(() => (user.name || "R").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase(), [user.name]);
  const notify = (type, text) => { setMessage({ type, text }); window.setTimeout(() => setMessage(null), 4500); };

  const saveProfile = async (event) => {
    event.preventDefault(); setSaving("profile"); setMessage(null);
    try {
      const data = await api(profileUrl, csrf, "PUT", profile);
      setUser((current) => ({ ...current, ...data.user }));
      notify("success", data.message);
    } catch (error) { notify("error", error.message); }
    finally { setSaving(""); }
  };

  const savePassword = async (event) => {
    event.preventDefault(); setSaving("password"); setMessage(null);
    try {
      const data = await api(passwordUrl, csrf, "PUT", passwords);
      setPasswords({ current_password: "", password: "", password_confirmation: "" });
      notify("success", data.message);
    } catch (error) { notify("error", error.message); }
    finally { setSaving(""); }
  };

  const savePreferences = async () => {
    setSaving("preferences"); setMessage(null);
    try { const data = await api(preferencesUrl, csrf, "PUT", preferences); setPreferences(data.preferences); notify("success", data.message); }
    catch (error) { notify("error", error.message); }
    finally { setSaving(""); }
  };

  const logout = async () => {
    setSaving("logout");
    try { await fetch("/logout", { method: "POST", credentials: "same-origin", headers: { Accept: "application/json", "X-CSRF-TOKEN": csrf } }); }
    finally { window.location.replace("/"); }
  };

  return (
    <div className="settings-page">
      <HorizontalNavigation activePath="/settings" />
      <main className="settings-main">
        <header className="settings-heading"><div><p>Personal workspace</p><h1>Settings</h1><span>Manage your account, security, communications, and display preferences.</span></div><span className="settings-saved"><Check size={15} /> Secure account settings</span></header>
        {message ? <div className={`settings-message is-${message.type}`} role={message.type === "error" ? "alert" : "status"}>{message.text}</div> : null}

        <div className="settings-layout">
          <aside className="settings-sidebar">
            <div className="settings-person">
              {user.avatar_url ? <img src={user.avatar_url} alt="" /> : <span>{initials}</span>}
              <div><strong>{user.name || "Your account"}</strong><small>{user.email}</small></div>
            </div>
            <nav aria-label="Settings sections">{SECTIONS.map(([id, label, Icon]) => <button key={id} type="button" className={active === id ? "is-active" : ""} onClick={() => setActive(id)}><Icon size={18} /><span>{label}</span><ChevronRight size={16} /></button>)}</nav>
            <button className="settings-logout" type="button" onClick={logout} disabled={saving === "logout"}><LogOut size={17} /> {saving === "logout" ? "Signing out…" : "Sign out"}</button>
          </aside>

          <section className="settings-content" aria-live="polite">
            {loading ? <div className="settings-loading"><span /> Loading your settings…</div> : null}

            {!loading && active === "account" ? <div className="settings-section">
              <div className="settings-section__title"><span><UserRound /></span><div><h2>Account information</h2><p>Keep your identity and contact information accurate.</p></div></div>
              <form className="settings-form" onSubmit={saveProfile}>
                <label>Full name<input type="text" value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} autoComplete="name" required /></label>
                <label>Email address<span className="settings-input-icon"><Mail size={17} /><input type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} autoComplete="email" required /></span><small>This email is used for sign-in and account recovery.</small></label>
                <div className="settings-actions"><button disabled={saving === "profile"}><Save size={17} /> {saving === "profile" ? "Saving…" : "Save account details"}</button></div>
              </form>
              <div className="settings-link-card"><div><strong>Profile picture</strong><p>Update your avatar from the User Profile menu in the navigation bar.</p></div><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Open navigation</button></div>
            </div> : null}

            {!loading && active === "security" ? <div className="settings-section">
              <div className="settings-section__title"><span><ShieldCheck /></span><div><h2>Security and sign-in</h2><p>Strengthen access to your Raymoch account.</p></div></div>
              <div className="settings-security-card"><span><KeyRound /></span><div><strong>Authenticator security</strong><p>{user.authenticator_enabled ? "Enabled — every login requires a rotating six-digit code." : "Add Microsoft or Google Authenticator for stronger sign-in protection."}</p></div><a href="/security/authenticator">{user.authenticator_enabled ? "Manage" : "Set up"}</a></div>
              <form className="settings-form settings-password" onSubmit={savePassword}>
                <div className="settings-form-heading"><div><h3>Change password</h3><p>Use at least 10 characters with uppercase, lowercase, and a number.</p></div><button type="button" className="settings-eye" onClick={() => setShowPasswords((value) => !value)}>{showPasswords ? <EyeOff size={17} /> : <Eye size={17} />} {showPasswords ? "Hide" : "Show"}</button></div>
                <label>Current password<input type={showPasswords ? "text" : "password"} value={passwords.current_password} onChange={(event) => setPasswords((current) => ({ ...current, current_password: event.target.value }))} autoComplete="current-password" required /></label>
                <div className="settings-form-grid"><label>New password<input type={showPasswords ? "text" : "password"} value={passwords.password} onChange={(event) => setPasswords((current) => ({ ...current, password: event.target.value }))} autoComplete="new-password" required /></label><label>Confirm new password<input type={showPasswords ? "text" : "password"} value={passwords.password_confirmation} onChange={(event) => setPasswords((current) => ({ ...current, password_confirmation: event.target.value }))} autoComplete="new-password" required /></label></div>
                <div className="settings-actions"><button disabled={saving === "password" || !passwords.current_password || !passwords.password}><LockKeyhole size={17} /> {saving === "password" ? "Updating…" : "Update password"}</button></div>
              </form>
              <div className="settings-session"><MonitorCog /><div><strong>Automatic session protection</strong><p>You are signed out after 30 minutes without activity. Activity is synchronized across open Raymoch tabs.</p></div></div>
            </div> : null}

            {!loading && active === "notifications" ? <div className="settings-section">
              <div className="settings-section__title"><span><Bell /></span><div><h2>Notification preferences</h2><p>Choose which useful updates arrive by email.</p></div></div>
              <div className="settings-toggle-list"><Toggle checked={preferences.email_security} onChange={(value) => setPreferences((current) => ({ ...current, email_security: value }))} label="Security alerts" description="Important sign-in, password, and account protection messages." disabled /><Toggle checked={preferences.email_product} onChange={(value) => setPreferences((current) => ({ ...current, email_product: value }))} label="Product updates" description="New Raymoch capabilities and improvements." /><Toggle checked={preferences.email_research} onChange={(value) => setPreferences((current) => ({ ...current, email_research: value }))} label="Research and market insights" description="Selected opportunity intelligence and research releases." /></div>
              <p className="settings-required-note"><ShieldCheck size={15} /> Security alerts are required and cannot be disabled.</p>
              <div className="settings-actions"><button type="button" onClick={savePreferences} disabled={saving === "preferences"}><Save size={17} /> {saving === "preferences" ? "Saving…" : "Save preferences"}</button></div>
            </div> : null}

            {!loading && active === "appearance" ? <div className="settings-section">
              <div className="settings-section__title"><span><Palette /></span><div><h2>Appearance</h2><p>Choose how Raymoch looks and feels on this device.</p></div></div>
              <div className="settings-theme-grid">{[["light", "Light", Sun], ["dark", "Dark", Moon], ["system", "System", Laptop]].map(([id, label, Icon]) => <button type="button" key={id} className={preferences.appearance === id ? "is-active" : ""} onClick={() => setPreferences((current) => ({ ...current, appearance: id }))}><Icon /><strong>{label}</strong><small>{id === "system" ? "Match your device" : `${label} interface`}</small>{preferences.appearance === id ? <Check className="settings-theme-check" /> : null}</button>)}</div>
              <div className="settings-toggle-list"><Toggle checked={preferences.compact_mode} onChange={(value) => setPreferences((current) => ({ ...current, compact_mode: value }))} label="Compact layout" description="Reduce spacing to display more information at once." /></div>
              <div className="settings-actions"><button type="button" onClick={savePreferences} disabled={saving === "preferences"}><Save size={17} /> {saving === "preferences" ? "Saving…" : "Save appearance"}</button></div>
            </div> : null}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
