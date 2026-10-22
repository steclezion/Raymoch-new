import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Bell,
  BellRing,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Inbox,
  LoaderCircle,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import "../styles/notifications.css";

const FILTERS = [
  ["all", "All"],
  ["unread", "Unread"],
  ["security", "Security"],
  ["billing", "Billing"],
  ["account", "Account"],
  ["opportunities", "Opportunities"],
];

const CATEGORY = {
  security: { label: "Security", Icon: ShieldCheck },
  billing: { label: "Billing", Icon: CircleDollarSign },
  account: { label: "Account", Icon: UserRound },
  opportunities: { label: "Opportunity", Icon: BriefcaseBusiness },
  insights: { label: "Insight", Icon: Sparkles },
  system: { label: "Update", Icon: Bell },
};

async function request(url, csrf, method = "GET", body) {
  const response = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json", "X-CSRF-TOKEN": csrf } : {}),
      ...(method === "DELETE" ? { "X-CSRF-TOKEN": csrf } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "The request could not be completed.");
  return data;
}

function EmptyState({ searching }) {
  return <div className="notifications-empty">
    <span>{searching ? <Search /> : <Inbox />}</span>
    <h2>{searching ? "No matching notifications" : "You’re all caught up"}</h2>
    <p>{searching ? "Try a different search term or notification category." : "Important account activity and Raymoch updates will appear here."}</p>
  </div>;
}

export default function Notifications({ csrf = "", dataUrl = "/notifications/data", updateUrl = "/notifications/__ID__/read", destroyUrl = "/notifications/__ID__", readAllUrl = "/notifications/read-all", clearReadUrl = "/notifications/read" }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0, unread: 0 });
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");
  const [menu, setMenu] = useState("");
  const [message, setMessage] = useState(null);

  const notify = (type, text) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4200);
  };

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const data = await request(`${dataUrl}?page=${page}`, csrf);
      setItems(data.notifications || []);
      setMeta(data.meta || { current_page: 1, last_page: 1, total: 0, unread: 0 });
    } catch (error) { notify("error", error.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [dataUrl]);

  const counts = useMemo(() => items.reduce((result, item) => {
    result[item.category] = (result[item.category] || 0) + 1;
    return result;
  }, {}), [items]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const categoryMatch = active === "all" || (active === "unread" ? !item.read : item.category === active);
      const searchMatch = !term || `${item.title} ${item.message} ${item.category}`.toLowerCase().includes(term);
      return categoryMatch && searchMatch;
    });
  }, [active, items, query]);

  const replaceId = (template, id) => template.replace("__ID__", encodeURIComponent(id));

  const toggleRead = async (item, read = !item.read) => {
    setWorking(item.id); setMenu("");
    try {
      const data = await request(replaceId(updateUrl, item.id), csrf, "PATCH", { read });
      setItems((current) => current.map((entry) => entry.id === item.id ? data.notification : entry));
      setMeta((current) => ({ ...current, unread: data.unread }));
    } catch (error) { notify("error", error.message); }
    finally { setWorking(""); }
  };

  const open = async (item) => {
    if (!item.read) await toggleRead(item, true);
    window.location.assign(item.action_url || "/home");
  };

  const remove = async (item) => {
    setWorking(item.id); setMenu("");
    try {
      const data = await request(replaceId(destroyUrl, item.id), csrf, "DELETE");
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setMeta((current) => ({ ...current, total: Math.max(0, current.total - 1), unread: data.unread }));
      notify("success", data.message);
    } catch (error) { notify("error", error.message); }
    finally { setWorking(""); }
  };

  const markAllRead = async () => {
    setWorking("all");
    try {
      const data = await request(readAllUrl, csrf, "POST", {});
      setItems((current) => current.map((item) => ({ ...item, read: true, read_at: new Date().toISOString() })));
      setMeta((current) => ({ ...current, unread: data.unread }));
      notify("success", data.message);
    } catch (error) { notify("error", error.message); }
    finally { setWorking(""); }
  };

  const clearRead = async () => {
    if (!window.confirm("Remove all read notifications? This cannot be undone.")) return;
    setWorking("clear");
    try {
      const data = await request(clearReadUrl, csrf, "DELETE");
      setItems((current) => current.filter((item) => !item.read));
      setMeta((current) => ({ ...current, total: Math.max(0, current.total - data.deleted), unread: data.unread }));
      notify("success", data.message);
    } catch (error) { notify("error", error.message); }
    finally { setWorking(""); }
  };

  return <div className="notifications-page" onClick={() => menu && setMenu("")}>
    <HorizontalNavigation activePath="/notifications" />
    <main className="notifications-main">
      <header className="notifications-heading">
        <div><p>Activity center</p><h1>Notifications</h1><span>Stay current with account activity, opportunities, security alerts, and important updates.</span></div>
        <div className="notifications-heading__status"><span><BellRing /></span><div><strong>{meta.unread}</strong><small>Unread</small></div></div>
      </header>

      {message ? <div className={`notifications-message is-${message.type}`} role={message.type === "error" ? "alert" : "status"}><span>{message.type === "success" ? <Check /> : <X />}</span>{message.text}</div> : null}

      <section className="notifications-shell" aria-label="Notification inbox">
        <aside className="notifications-filters">
          <div className="notifications-filters__title"><strong>Inbox</strong><span>{meta.total}</span></div>
          <nav aria-label="Filter notifications">
            {FILTERS.map(([id, label]) => <button type="button" key={id} className={active === id ? "is-active" : ""} onClick={() => setActive(id)}><span>{label}</span><small>{id === "all" ? meta.total : id === "unread" ? meta.unread : counts[id] || 0}</small></button>)}
          </nav>
          <div className="notifications-filter-note"><ShieldCheck /><p><strong>Security messages stay visible</strong><span>Critical protection alerts cannot be disabled in settings.</span></p></div>
        </aside>

        <div className="notifications-inbox">
          <div className="notifications-toolbar">
            <label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notifications" aria-label="Search notifications" />{query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X /></button> : null}</label>
            <div><button type="button" onClick={markAllRead} disabled={!meta.unread || working === "all"}><CheckCheck /> <span>{working === "all" ? "Updating…" : "Mark all read"}</span></button><button type="button" onClick={clearRead} disabled={!items.some((item) => item.read) || working === "clear"}><Archive /> <span>Clear read</span></button><button type="button" className="is-icon" onClick={() => load(meta.current_page)} disabled={loading} aria-label="Refresh notifications"><RefreshCw /></button></div>
          </div>

          <div className="notifications-list" aria-live="polite">
            {loading ? <div className="notifications-loading"><LoaderCircle /> Loading notifications…</div> : null}
            {!loading && !visible.length ? <EmptyState searching={Boolean(query || active !== "all")} /> : null}
            {!loading && visible.map((item) => {
              const detail = CATEGORY[item.category] || CATEGORY.system;
              const Icon = detail.Icon;
              return <article key={item.id} className={`notification-card ${item.read ? "is-read" : "is-unread"}`}>
                <button className="notification-card__main" type="button" onClick={() => open(item)} disabled={working === item.id}>
                  <span className={`notification-card__icon is-${item.category}`}><Icon /></span>
                  <span className="notification-card__copy"><span className="notification-card__meta"><em>{detail.label}</em><small><Clock3 /> {item.relative_time}</small></span><strong>{item.title}</strong><span>{item.message}</span><small className="notification-card__action">{item.action_label} <ChevronRight /></small></span>
                  {!item.read ? <i className="notification-card__dot" aria-label="Unread" /> : null}
                </button>
                <div className="notification-card__menu"><button type="button" onClick={(event) => { event.stopPropagation(); setMenu(menu === item.id ? "" : item.id); }} aria-label={`More actions for ${item.title}`} aria-expanded={menu === item.id}><MoreHorizontal /></button>{menu === item.id ? <div onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => toggleRead(item)}>{item.read ? <BellRing /> : <Check />} Mark as {item.read ? "unread" : "read"}</button><button type="button" className="is-danger" onClick={() => remove(item)}><Trash2 /> Remove</button></div> : null}</div>
              </article>;
            })}
          </div>

          {meta.last_page > 1 ? <footer className="notifications-pagination"><p>Page {meta.current_page} of {meta.last_page}</p><div><button type="button" disabled={meta.current_page <= 1 || loading} onClick={() => load(meta.current_page - 1)}><ChevronLeft /> Previous</button><button type="button" disabled={meta.current_page >= meta.last_page || loading} onClick={() => load(meta.current_page + 1)}>Next <ChevronRight /></button></div></footer> : null}
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}
