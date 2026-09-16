import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  Building2,
  Camera,
  ChevronDown,
  Edit3,
  Globe2,
  Handshake,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Save,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  UserRound,
  X,
} from "lucide-react";

import { getAuthUser, logoutRequest } from "../lib/auth";
import ConfirmationDialog from "./modals/ConfirmationDialog.jsx";
import AIBusinessSearchModal from "./modals/AIBusinessSearchModal.jsx";
import "./horizontal-navigation.css";

import useRefreshingFavicon from "./behaviours/useRefreshingFavicon.jsx";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/home" },
  { label: "Businesses", icon: Building2, href: "/explore", badge: "46" },
  { label: "Matching", icon: Handshake, href: "/matching" },
  { label: "Investors", icon: Users, href: "/investors" },
  { label: "Verification", icon: ShieldCheck, href: "/verification" },
  { label: "Market Insights", icon: Globe2, href: "/insights" },
];

const EXPLORE_ITEMS = [
  {
    label: "Trusted Matching",
    description: "Connect with credible businesses using CTI and verification.",
    href: "/matching",
  },
  {
    label: "Verification",
    description: "Review CTI badges, document checks, and data provenance.",
    href: "/verification",
  },
  {
    label: "Research & Insights",
    description: "Explore sector reports, trends, and regional briefs.",
    href: "/insights",
  },
  {
    label: "Programs & Services",
    description: "Discover advisory, partner programs, and support options.",
    href: "/services",
  },
  {
    label: "Policy & Incentives",
    description: "Track tax credits, grants, and regulatory signals.",
    href: "/incentives",
  },
  {
    label: "Whitespace Map",
    description: "See where demand outpaces supply across sectors.",
    href: "/whitespace",
  },
];

const BRAND_NAME = "Raymoch";
const BRAND_ICON_URL = "/images/logo_preview_exact.svg";

function BrandMark() {
  return (
    <span className="ray-nav__brand-mark" aria-hidden="true">
      <svg viewBox="0 0 200 200" role="presentation" focusable="false">
        <image
          href={BRAND_ICON_URL}
          x="0"
          y="0"
          width="200"
          height="200"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    </span>
  );
}

function NavigationTooltip({ children }) {
  return (
    <span className="ray-nav__tooltip" role="tooltip" aria-hidden="true">
      {children}
    </span>
  );
}

function normalizePath(path) {
  if (!path) return "/";
  const normalized = path.split("?")[0].replace(/\/+$/, "");
  return normalized || "/";
}

const PAGE_TITLES = {
  "/": "Home",
  "/home": "Home",
  "/dashboard": "Dashboard",
  "/explore": "Businesses",
  "/matching": "Matching",
  "/investors": "Investors",
  "/verification": "Verification",
  "/insights": "Market Insights",
  "/services": "Services",
  "/incentives": "Policy & Incentives",
  "/whitespace": "Whitespace Map",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/search": "Search",
  "/profile": "Profile",
};

function getPageTitle(path) {
  const normalizedPath = normalizePath(path);

  const exactTitle = PAGE_TITLES[normalizedPath];
  if (exactTitle) return `Raymoch-${exactTitle}`;

  // Nested pages inherit the title of their top-level section.
  const parentPath = Object.keys(PAGE_TITLES)
    .filter((route) => route !== "/")
    .sort((a, b) => b.length - a.length)
    .find((route) => normalizedPath.startsWith(`${route}/`));

  if (parentPath) return `Raymoch-${PAGE_TITLES[parentPath]}`;

  // Produce a readable title for routes that are not listed above.
  const fallbackTitle = normalizedPath
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return `Raymoch-${fallbackTitle || "Home"}`;
}

function absoluteImageUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/") ? path : `/storage/${path}`;
}

function getCsrfToken() {
  return (
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
    window.APP?.csrf ||
    ""
  );
}

export default function HorizontalNavigation({
  activePath,
  isAuthed: isAuthedProp,
  authLoading: authLoadingProp,
  authUser: authUserProp,
  avatarSrc: avatarSrcProp,
  openProfileModal,
  routes = {},
  setIsAuthed,
  setAuthUser,
  setProfileOpen,
}) {
  useRefreshingFavicon(BRAND_ICON_URL, 5_000);

  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
  const [localProfileOpen, setLocalProfileOpen] = useState(false);
  const [profileModalClosing, setProfileModalClosing] = useState(false);
  const [sessionAuthed, setSessionAuthed] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null);
  const [profilePictureOpen, setProfilePictureOpen] = useState(false);
  const [brandAnimationCycle, setBrandAnimationCycle] = useState(0);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [businessSearchOpen, setBusinessSearchOpen] = useState(false);
  const [supportModalClosing, setSupportModalClosing] = useState(false);
  const [supportQuestion, setSupportQuestion] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportMessages, setSupportMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Hello! I’m the Raymoch assistant. How can I help you today?",
    },
  ]);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    avatar: null,
    avatarPreview: "",
  });
  const navigationRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileFileRef = useRef(null);
  const profileCloseTimerRef = useRef(null);
  const supportInputRef = useRef(null);
  const supportMessagesRef = useRef(null);
  const supportAbortRef = useRef(null);
  const supportCloseTimerRef = useRef(null);
  const supportMessageIdRef = useRef(1);
  const hasControlledAuth = typeof isAuthedProp === "boolean";
  const isAuthed = hasControlledAuth ? isAuthedProp : sessionAuthed;
  const authLoading = hasControlledAuth
    ? Boolean(authLoadingProp)
    : sessionLoading;
  const authUser = authUserProp ?? sessionUser;
  const avatarSrc =
    avatarSrcProp ||
    absoluteImageUrl(authUser?.avatar_url || authUser?.avatar);
  const currentPath = normalizePath(
    activePath || (typeof window !== "undefined" ? window.location.pathname : "/home"),
  );
  const dashboardActive =
    currentPath === "/dashboard" || currentPath.startsWith("/dashboard/");
  const safeRoutes = {
    search: typeof routes.search === "string" ? routes.search : "/search",
    logout: typeof routes.logout === "string" ? routes.logout : "/logout",
    profileUpdate:
      typeof routes.profileUpdate === "string"
        ? routes.profileUpdate
        : "/profile/update",
    supportAssistant:
      typeof routes.supportAssistant === "string"
        ? routes.supportAssistant
        : "/api/verification/assistant",
    businessSearchAssistant: typeof routes.businessSearchAssistant === "string" ? routes.businessSearchAssistant : "/api/business-search/validate",
  };

  useEffect(() => {
    document.title = getPageTitle(currentPath);
  }, [currentPath]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setBrandAnimationCycle((cycle) => cycle + 1);
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!supportModalOpen) return;
    supportMessagesRef.current?.scrollTo({
      top: supportMessagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [supportMessages, supportLoading, supportModalOpen]);

  useEffect(() => {
    return () => {
      supportAbortRef.current?.abort();
      if (profileCloseTimerRef.current) {
        window.clearTimeout(profileCloseTimerRef.current);
      }
      if (supportCloseTimerRef.current) {
        window.clearTimeout(supportCloseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hasControlledAuth) {
      setSessionLoading(false);
      return undefined;
    }

    let active = true;

    async function refreshAuth() {
      setSessionLoading(true);

      try {
        const { authenticated, user } = await getAuthUser();
        if (!active) return;

        setSessionAuthed(Boolean(authenticated));
        setSessionUser(user || null);
      } catch {
        if (!active) return;

        setSessionAuthed(false);
        setSessionUser(null);
      } finally {
        if (active) setSessionLoading(false);
      }
    }

    refreshAuth();

    return () => {
      active = false;
    };
  }, [hasControlledAuth]);

  useEffect(() => {
    return () => {
      if (profileForm.avatarPreview) {
        URL.revokeObjectURL(profileForm.avatarPreview);
      }
    };
  }, [profileForm.avatarPreview]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!dropdownRef.current?.contains(event.target)) setExploreOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setExploreOpen(false);
        setMobileOpen(false);
        if (profilePictureOpen) {
          setProfilePictureOpen(false);
        } else if (supportModalOpen) {
          closeSupportModal();
        } else {
          closeProfileEditor();
        }
      }
    }

    function handleResize() {
      if (window.innerWidth > 1180) {
        setMobileOpen(false);
        setExploreOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [localProfileOpen, profilePictureOpen, supportModalOpen]);

  function closeMobileNavigation() {
    setMobileOpen(false);
    setExploreOpen(false);
  }

  function resetProfileForm(user = authUser) {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      avatar: null,
      avatarPreview: "",
    });

    if (profileFileRef.current) profileFileRef.current.value = "";
  }

  function closeProfileEditor() {
    setProfilePictureOpen(false);
    if (!localProfileOpen) return;
    if (profileCloseTimerRef.current) {
      window.clearTimeout(profileCloseTimerRef.current);
    }
    setProfileModalClosing(true);
    profileCloseTimerRef.current = window.setTimeout(() => {
      setLocalProfileOpen(false);
      setProfileModalClosing(false);
      setProfileEditing(false);
      setProfileFeedback(null);
      resetProfileForm();
      profileCloseTimerRef.current = null;
    }, 220);
  }

  async function handleLogout() {
    try {
      await logoutRequest({ logoutUrl: safeRoutes.logout });
    } catch {
      // Ignore request errors and clear the local session state below.
    } finally {
      setSessionAuthed(false);
      setSessionUser(null);
      setIsAuthed?.(false);
      setAuthUser?.(null);
      setProfileOpen?.(false);
      closeMobileNavigation();
      window.location.assign("/");
    }
  }

  function requestLogoutConfirmation(event) {
    event.preventDefault();
    closeMobileNavigation();
    setLogoutConfirmationOpen(true);
  }

  function handleProfileOpen() {
    closeMobileNavigation();

    if (typeof openProfileModal === "function") {
      openProfileModal();
      return;
    }

    resetProfileForm();
    if (profileCloseTimerRef.current) {
      window.clearTimeout(profileCloseTimerRef.current);
      profileCloseTimerRef.current = null;
    }
    setProfileModalClosing(false);
    setProfileEditing(false);
    setProfileFeedback(null);
    setLocalProfileOpen(true);
  }

  function handleProfileFieldChange(event) {
    const { name, value } = event.target;
    setProfileFeedback(null);
    setProfileForm((current) => ({ ...current, [name]: value }));
  }

  function handleProfileAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileFeedback({ type: "error", text: "Choose a valid image file." });
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileFeedback({
        type: "error",
        text: "The profile picture must be 5 MB or smaller.",
      });
      event.target.value = "";
      return;
    }

    const avatarPreview = URL.createObjectURL(file);
    setProfileFeedback(null);
    setProfileForm((current) => ({
      ...current,
      avatar: file,
      avatarPreview,
    }));
  }

  async function handleProfileSave(event) {
    event.preventDefault();

    const name = profileForm.name.trim();

    if (!name) {
      setProfileFeedback({ type: "error", text: "Full name is required." });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (profileForm.avatar) formData.append("avatar", profileForm.avatar);

    setProfileSaving(true);
    setProfileFeedback(null);

    try {
      const response = await fetch(safeRoutes.profileUpdate, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": getCsrfToken(),
        },
        credentials: "same-origin",
        body: formData,
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        const firstValidationError = Object.values(json?.errors || {})
          .flat()
          .find(Boolean);
        throw new Error(
          firstValidationError || json?.message || "The profile could not be updated.",
        );
      }

      const nextUser = json?.user || {
        ...authUser,
        name,
        ...(json?.avatar_url ? { avatar_url: json.avatar_url } : {}),
      };

      setSessionUser(nextUser);
      setAuthUser?.(nextUser);
      resetProfileForm(nextUser);
      setProfileEditing(false);
      setProfileFeedback({
        type: "success",
        text: json?.message || "Your profile was updated successfully.",
      });
    } catch (error) {
      setProfileFeedback({
        type: "error",
        text: error?.message || "The profile could not be updated.",
      });
    } finally {
      setProfileSaving(false);
    }
  }

  function pushSupportMessage(text, sender = "assistant", tone = "default") {
    supportMessageIdRef.current += 1;
    setSupportMessages((messages) => [
      ...messages,
      { id: supportMessageIdRef.current, sender, text, tone },
    ]);
  }

  function openSupportModal(event) {
    event?.preventDefault();
    closeMobileNavigation();
    if (supportCloseTimerRef.current) {
      window.clearTimeout(supportCloseTimerRef.current);
    }
    setSupportModalClosing(false);
    setSupportModalOpen(true);
    window.setTimeout(() => supportInputRef.current?.focus(), 260);
  }

  function closeSupportModal() {
    supportAbortRef.current?.abort();
    if (supportCloseTimerRef.current) {
      window.clearTimeout(supportCloseTimerRef.current);
    }
    setSupportModalClosing(true);
    supportCloseTimerRef.current = window.setTimeout(() => {
      setSupportModalOpen(false);
      setSupportModalClosing(false);
      supportCloseTimerRef.current = null;
    }, 220);
  }

  async function handleSupportSubmit(event) {
    event.preventDefault();
    const question = supportQuestion.trim();
    if (!question || supportLoading) return;

    const conversation = supportMessages.slice(-8).map(({ sender, text }) => ({
      role: sender === "user" ? "user" : "assistant",
      content: text,
    }));

    pushSupportMessage(question, "user");
    setSupportQuestion("");
    setSupportLoading(true);

    supportAbortRef.current?.abort();
    const controller = new AbortController();
    supportAbortRef.current = controller;

    try {
      const response = await fetch(safeRoutes.supportAssistant, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCsrfToken(),
        },
        credentials: "same-origin",
        signal: controller.signal,
        body: JSON.stringify({
          question,
          current_step: 1,
          form_context: { source: "navigation_help", path: currentPath },
          conversation,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.message || "The assistant is temporarily unavailable.",
        );
      }

      const answer = data?.answer || data?.reply || data?.message;
      if (!answer) throw new Error("The assistant returned no answer.");
      pushSupportMessage(answer);
    } catch (error) {
      if (error?.name !== "AbortError") {
        pushSupportMessage(
          error?.message || "The assistant could not answer. Please try again.",
          "assistant",
          "error",
        );
      }
    } finally {
      if (supportAbortRef.current === controller) {
        supportAbortRef.current = null;
        setSupportLoading(false);
      }
    }
  }

  return (
    <>
      <header
        ref={navigationRef}
        className={`ray-nav ${mobileOpen ? "is-mobile-open" : ""}`}
      >
        <div className="ray-nav__top-tier">
        <a href="/" className="ray-nav__brand" aria-label="Raymoch home">
          <BrandMark key={`mark-${brandAnimationCycle}`} />
          <strong
            key={`name-${brandAnimationCycle}`}
            className="ray-nav__brand-name"
            aria-label={BRAND_NAME}
          >
            {BRAND_NAME.split("").map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="ray-nav__brand-letter"
                style={{ "--letter-index": index }}
                aria-hidden="true"
              >
                {letter}
              </span>
            ))}
          </strong>
        </a>

        <div className="ray-nav__dropdown ray-nav__explore" ref={dropdownRef}>
          <button
            className={`ray-nav__link ray-nav__dropdown-trigger ray-nav__explore-trigger ${exploreOpen ? "is-open" : ""}`}
            type="button"
            onClick={() => setExploreOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={exploreOpen}
            aria-controls="raymoch-explore-menu"
          >
            <span className="ray-nav__explore-grid" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>Explore</span>
            <ChevronDown size={15} aria-hidden="true" />
          </button>

          {exploreOpen ? (
            <div
              id="raymoch-explore-menu"
              className="ray-nav__dropdown-menu ray-nav__explore-menu"
              role="menu"
              aria-label="Explore services"
            >
              <div className="ray-nav__explore-heading">Explore services</div>
              <div className="ray-nav__explore-grid-menu">
                {EXPLORE_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    role="menuitem"
                    onClick={closeMobileNavigation}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <form className="ray-nav__search" action={safeRoutes.search} role="search" onSubmit={(event) => { event.preventDefault(); setBusinessSearchOpen(true); }}>
          <label className="ray-nav__sr-only" htmlFor="raymoch-navigation-search">
            Search companies, sectors, or regions
          </label>
          <input
            id="raymoch-navigation-search"
            type="search"
            name="q"
            onFocus={() => setBusinessSearchOpen(true)}
            onClick={() => setBusinessSearchOpen(true)}
            readOnly
            aria-haspopup="dialog"
            aria-expanded={businessSearchOpen}
            aria-controls="raymoch-ai-business-search"
            title="Open guided AI Business Search"
            placeholder="Search companies, sectors, regions…"
          />
        </form>

        <button
          className="ray-nav__menu-button"
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="raymoch-primary-navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        </div>

        <div
          id="raymoch-primary-navigation"
          className={`ray-nav__mobile-panel ${mobileOpen ? "is-open" : ""}`}
        >
          <nav className="ray-nav__links" aria-label="Main navigation">
            {NAV_ITEMS.map(({ label, icon: Icon, href, badge }) => {
              const itemPath = normalizePath(href);
              const active =
                currentPath === itemPath ||
                (itemPath !== "/" &&
                  itemPath !== "/home" &&
                  currentPath.startsWith(`${itemPath}/`));

              return (
                <a
                  key={label}
                  className={`ray-nav__link ${active ? "is-active" : ""}`}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMobileNavigation}
                >
                  <Icon size={17} aria-hidden="true" />
                  <span>{label}</span>
                  {badge ? <span className="ray-nav__badge">{badge}</span> : null}
                </a>
              );
            })}
          </nav>

          <div className="ray-nav__actions">
            <a
              className={`ray-nav__icon-link ${dashboardActive ? "is-active" : ""}`}
              href="/dashboard"
              aria-label="Dashboard"
              aria-current={dashboardActive ? "page" : undefined}
              onClick={closeMobileNavigation}
            >
              <LayoutDashboard className="ray-nav__utility-icon" aria-hidden="true" />
              <span className="ray-nav__action-label">Dashboard</span>
              <NavigationTooltip>Dashboard</NavigationTooltip>
            </a>

            {isAuthed && !authLoading ? (
              <button
                className="ray-nav__icon-link"
                type="button"
                aria-label="Open user profile"
                onClick={handleProfileOpen}
              >
                {avatarSrc ? (
                  <img
                    className="ray-nav__utility-icon ray-nav__profile-avatar"
                    src={avatarSrc}
                    alt={authUser?.name || "User"}
                  />
                ) : (
                  <UserRound className="ray-nav__utility-icon" aria-hidden="true" />
                )}
                <span className="ray-nav__action-label">User Profile</span>
                <NavigationTooltip>User Profile</NavigationTooltip>
              </button>
            ) : null}

            <a
              className="ray-nav__icon-link ray-nav__notification"
              href="/notifications"
              aria-label="Notifications"
              onClick={closeMobileNavigation}
            >
              <Bell className="ray-nav__utility-icon" aria-hidden="true" />
              <span className="ray-nav__action-label">Notifications</span>
              <span className="ray-nav__notification-dot" aria-hidden="true" />
              <NavigationTooltip>Notifications</NavigationTooltip>
            </a>

            <a
              className="ray-nav__icon-link"
              href={safeRoutes.logout}
              aria-label="Logout"
              onClick={requestLogoutConfirmation}
            >
              <LogOut className="ray-nav__utility-icon" aria-hidden="true" />
              <span className="ray-nav__action-label">Logout</span>
              <NavigationTooltip>Logout</NavigationTooltip>
            </a>

            <a
              className="ray-nav__icon-link"
              href="/settings"
              aria-label="Settings"
              onClick={closeMobileNavigation}
            >
              <Settings className="ray-nav__utility-icon" aria-hidden="true" />
              <span className="ray-nav__action-label">Settings</span>
              <NavigationTooltip>Settings</NavigationTooltip>
            </a>
            <button
              className="ray-nav__icon-link ray-nav__support"
              type="button"
              aria-label="Help and Support"
              onClick={openSupportModal}
            >
              <HelpCircle className="ray-nav__utility-icon" aria-hidden="true" />
              <span className="ray-nav__action-label">Support</span>
              <NavigationTooltip>Help &amp; Support</NavigationTooltip>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <button
          className="ray-nav__scrim"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileNavigation}
        />
      ) : null}

      {localProfileOpen ? (
        <div
          className={`ray-profile__backdrop ${profileModalClosing ? "is-closing" : ""}`}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeProfileEditor();
            }
          }}
        >
          <section
            className="ray-profile"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ray-profile-title"
          >
            <div className="ray-profile__header">
              <div className="ray-profile__identity">
                {profileForm.avatarPreview || avatarSrc ? (
                  <button
                    className="ray-profile__avatar ray-profile__avatar-button"
                    type="button"
                    aria-label="Enlarge profile picture"
                    title="Enlarge profile picture"
                    onClick={() => setProfilePictureOpen(true)}
                  >
                    <img
                      src={profileForm.avatarPreview || avatarSrc}
                      alt={`${authUser?.name || "User"}'s profile`}
                    />
                  </button>
                ) : (
                  <span className="ray-profile__avatar" aria-hidden="true">
                    <UserRound size={28} />
                  </span>
                )}
                <div>
                  <p className="ray-profile__eyebrow">Signed-in account</p>
                  <h2 id="ray-profile-title">User Profile</h2>
                </div>
              </div>

              <button
                className="ray-profile__close"
                type="button"
                aria-label="Close user profile"
                onClick={closeProfileEditor}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {profileEditing ? (
              <form className="ray-profile__form" onSubmit={handleProfileSave}>
                <label className="ray-profile__field">
                  <span>Full name</span>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileFieldChange}
                    autoComplete="name"
                    required
                    disabled={profileSaving}
                  />
                </label>

                <div className="ray-profile__field">
                  <span>
                    <Camera size={17} aria-hidden="true" /> Profile picture
                  </span>
                  <input
                    ref={profileFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileAvatarChange}
                    disabled={profileSaving}
                  />
                  <small>JPG, PNG, GIF, or WebP up to 5 MB.</small>
                </div>

                {profileFeedback ? (
                  <p
                    className={`ray-profile__feedback ray-profile__feedback--${profileFeedback.type}`}
                    role={profileFeedback.type === "error" ? "alert" : "status"}
                  >
                    {profileFeedback.text}
                  </p>
                ) : null}

                <div className="ray-profile__actions">
                  <button
                    type="button"
                    onClick={() => {
                      resetProfileForm();
                      setProfileFeedback(null);
                      setProfileEditing(false);
                    }}
                    disabled={profileSaving}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={profileSaving}>
                    <Save size={17} aria-hidden="true" />
                    {profileSaving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <dl className="ray-profile__details">
                  <div className="ray-profile__detail">
                    <dt>
                      <UserRound size={17} aria-hidden="true" /> Full name
                    </dt>
                    <dd>{authUser?.name || "Not provided"}</dd>
                  </div>
                  <div className="ray-profile__detail">
                    <dt>
                      <Mail size={17} aria-hidden="true" /> Email address
                    </dt>
                    <dd>{authUser?.email || "Not provided"}</dd>
                  </div>
                  {authUser?.id != null ? (
                    <div className="ray-profile__detail">
                      <dt>Account ID</dt>
                      <dd>{authUser.id}</dd>
                    </div>
                  ) : null}
                </dl>

                {profileFeedback ? (
                  <p
                    className={`ray-profile__feedback ray-profile__feedback--${profileFeedback.type}`}
                    role="status"
                  >
                    {profileFeedback.text}
                  </p>
                ) : null}

                <button
                  className="ray-profile__edit"
                  type="button"
                  onClick={() => {
                    resetProfileForm();
                    setProfileFeedback(null);
                    setProfileEditing(true);
                  }}
                >
                  <Edit3 size={17} aria-hidden="true" /> Edit profile
                </button>

                <div className="ray-profile__status">
                  <span aria-hidden="true" /> Authenticated
                </div>
              </>
            )}
          </section>
        </div>
      ) : null}

      {profilePictureOpen && (profileForm.avatarPreview || avatarSrc) ? (
        <div
          className="ray-profile-picture__backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setProfilePictureOpen(false);
            }
          }}
        >
          <section
            className="ray-profile-picture"
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged profile picture"
          >
            <button
              className="ray-profile-picture__close"
              type="button"
              aria-label="Close enlarged profile picture"
              onClick={() => setProfilePictureOpen(false)}
              autoFocus
            >
              <X size={20} aria-hidden="true" />
            </button>
            <img
              src={profileForm.avatarPreview || avatarSrc}
              alt={`${authUser?.name || "User"}'s profile`}
            />
          </section>
        </div>
      ) : null}

      <AIBusinessSearchModal
        open={businessSearchOpen}
        onClose={() => setBusinessSearchOpen(false)}
        regionsEndpoint={typeof routes.businessSearchRegions === "string" ? routes.businessSearchRegions : "/api/business-search/get-regions"}
        countriesEndpoint={typeof routes.businessSearchCountries === "string" ? routes.businessSearchCountries : "/api/business-search/get-countries"}
        statesEndpoint={typeof routes.businessSearchStates === "string" ? routes.businessSearchStates : "/api/business-search/get-states"}
      />

      {supportModalOpen ? (
        <div
          className={`ray-support__backdrop ${supportModalClosing ? "is-closing" : ""}`}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSupportModal();
          }}
        >
          <section
            className="ray-support"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ray-support-title"
          >
            <header className="ray-support__header">
              <div className="ray-support__heading">
                <span className="ray-support__mark" aria-hidden="true">
                  <Sparkles size={21} />
                </span>
                <div>
                  <strong id="ray-support-title">Raymoch Help &amp; Support</strong>
                  <span>Clear guidance, whenever you need it</span>
                </div>
              </div>
              <button
                className="ray-support__close"
                type="button"
                aria-label="Close Help and Support"
                onClick={closeSupportModal}
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            <div
              ref={supportMessagesRef}
              className="ray-support__messages"
              aria-live="polite"
              aria-busy={supportLoading}
            >
              {supportMessages.map((message) => (
                <article
                  key={message.id}
                  className={`ray-support__message is-${message.sender} ${
                    message.tone === "error" ? "is-error" : ""
                  }`}
                >
                  {message.sender === "assistant" ? (
                    <span className="ray-support__message-icon" aria-hidden="true">
                      <Sparkles size={15} />
                    </span>
                  ) : null}
                  <div>
                    <strong>
                      {message.sender === "user" ? "You" : "Raymoch Assistant"}
                    </strong>
                    <p>{message.text}</p>
                  </div>
                </article>
              ))}

              {supportLoading ? (
                <div className="ray-support__thinking" role="status">
                  <span />
                  <span />
                  <span />
                  <span className="ray-support__thinking-label">Thinking</span>
                </div>
              ) : null}
            </div>

            <form className="ray-support__composer" onSubmit={handleSupportSubmit}>
              <label htmlFor="ray-support-question">Ask Raymoch</label>
              <div className="ray-support__input-row">
                <input
                  ref={supportInputRef}
                  id="ray-support-question"
                  type="text"
                  value={supportQuestion}
                  onChange={(event) => setSupportQuestion(event.target.value)}
                  placeholder="Type your question…"
                  maxLength={2000}
                  autoComplete="off"
                  disabled={supportLoading}
                />
                <button
                  type="submit"
                  disabled={supportLoading || !supportQuestion.trim()}
                  aria-label="Send question"
                >
                  <Send size={18} aria-hidden="true" />
                  <span>Send</span>
                </button>
              </div>
              <small>Press Enter to send. Please don’t share passwords or sensitive IDs.</small>
            </form>
          </section>
        </div>
      ) : null}

      <ConfirmationDialog
        open={logoutConfirmationOpen}
        title="You are logging out"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Logout"
        cancelLabel="Stay signed in"
        tone="danger"
        onConfirm={() => {
          setLogoutConfirmationOpen(false);
          handleLogout();
        }}
        onCancel={() => setLogoutConfirmationOpen(false)}
      />
    </>
  );
}
