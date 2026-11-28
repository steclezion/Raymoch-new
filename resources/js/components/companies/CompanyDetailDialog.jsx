// resources/js/components/companies/CompanyDetailDialog.jsx
// ------------------------------------------------------------------
// Company detail dialog with tabs:
//  - Overview (summary + Recharts)
//  - Financials (MUI Table + Pie chart on row click)
//  - Team (card-style listing)
//  - Gallery (Carousel / Slider)
//  - Documents (MUI Table + iframe PDF preview)
//  - Contact
//  - Location (Google Maps AdvancedMarkerElement)
//  - AI Insight (UI-only chat)
//  + Header social reactions + comment box
// ------------------------------------------------------------------
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Typography,
  Stack,
  Tooltip,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
  Alert,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Popover,
  TextField,
  Avatar,
  Grid,
  Snackbar,
} from "@mui/material";

import {
  Badge, BadgeAlert, BadgeCheck, BadgeX, Clock, ShieldCheck,
  LayoutDashboard, CircleDollarSign, UsersRound, Images, FileText, ContactRound, Sparkles,
  Circle, CircleAlert, TriangleAlert,
  Map as MapIcon,
  MapPin as LocationOnIcon,
  Building2 as BusinessIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  LocateFixed as MyLocationIcon,
  X as CloseIcon,
  Send as SendIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ThumbsUp as ThumbUpAltOutlinedIcon,
  ThumbsDown as ThumbDownAltOutlinedIcon,
  Bookmark as BookmarkBorderIcon,
  CircleCheck as CheckCircleOutlineIcon,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../../styles/companies.css";
import "../../styles/company-detail-dialog.css";
import {
  API_BASE,
  fetchJSON,
  loadGoogleMapsScript,
  GOOGLE_MAPS_KEY,
  getSessionId,
} from "../../utils/api.js";

/* ------------------------------ Constants ------------------------------ */
async function postCompanyInsight(companyId, action, data, signal) {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  const response = await fetch(`/api/company-insight/${encodeURIComponent(companyId)}/${action}`, {
    method: "POST",
    credentials: "same-origin",
    headers: { Accept: "application/json", "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken || "" },
    body: JSON.stringify(data),
    signal,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Company Insight is temporarily unavailable.");
  return result;
}

const REACTIONS = {
  marked: { label: "Mark information", icon: CheckCircleOutlineIcon, bg: "#f4e8d6", ink: "#5b3825" },
  future: { label: "Save for future use", icon: BookmarkBorderIcon, bg: "#f8edd6", ink: "#80571e" },
  satisfied: { label: "Satisfied with information", icon: ThumbUpAltOutlinedIcon, bg: "#e8f0e9", ink: "#466a56" },
  unsatisfied: { label: "Unsatisfied with information", icon: ThumbDownAltOutlinedIcon, bg: "#f8e7e2", ink: "#934835" },
};

const reactionCommentKey = (companyId, reaction) =>
  `raymoch:company:${companyId}:reaction:${reaction}:comment`;

const reactionTooltipStyle = {
  bgcolor: "#271b15",
  color: "#fffdf9",
  px: 1.25,
  py: 0.75,
  borderRadius: "6px",
  fontSize: ".82rem",
  lineHeight: 1.35,
  boxShadow: "0 3px 10px #0002",
};

const VERIFICATION_BADGES = new Map([
  ["verified", [BadgeCheck, "Verified", "#466a56"]],
  ["unverified", [BadgeAlert, "Unverified", "#9c6648"]],
  ["rejected", [BadgeX, "Verification rejected", "#a63d35"]],
  ["verification rejected", [BadgeX, "Verification rejected", "#a63d35"]],
  ["not yet verified", [Badge, "Not yet verified", "#746b64"]],
  ["pending", [Clock, "Pending verification", "#89601f"]],
  ["pending verification", [Clock, "Pending verification", "#89601f"]],
  ["trusted", [ShieldCheck, "Trusted business", "#466a56"]],
  ["trusted business", [ShieldCheck, "Trusted business", "#466a56"]],
]);



const financialNumber = (value) => {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const financialNumberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

const financialColumns = [
  { field: "fiscal_year", headerName: "Fiscal year", type: "number", minWidth: 110, valueGetter: financialNumber },
  ...[["revenue", "Revenue"], ["ebitda", "EBITDA"], ["net_income", "Net income"]].map(([field, headerName]) => ({
    field,
    headerName,
    type: "number",
    flex: 1,
    minWidth: 120,
    valueGetter: financialNumber,
    valueFormatter: (value) => value == null ? "—" : financialNumberFormat.format(value),
  })),
  { field: "currency", headerName: "Currency", minWidth: 105 },
  { field: "created_at", headerName: "Created at", flex: 1, minWidth: 150 },
];

/* --------------------------- Dialog Transition --------------------------- */
const DialogTransition = React.forwardRef(function DialogTransition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

/* ---------------------------- Location Map ---------------------------- */
function LocationMap({ data, company }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const centerRef = useRef(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [loadError, setLoadError] = useState("");
  const nearby = data?.nearby || [];

  if (!data || !data.location) {
    return (
      <Typography variant="body2" color="text.secondary">
        No location has been added for this company yet.
      </Typography>
    );
  }

  if (!GOOGLE_MAPS_KEY) {
    return (
      <Alert severity="warning" icon={<TriangleAlert size={20} />} sx={{ mt: 1.5 }}>
        Google Maps API key is missing. Please set
        <code style={{ margin: "0 4px" }}>VITE_GOOGLE_MAPS_KEY</code> in your
        <strong>.env</strong> and restart Vite.
      </Alert>
    );
  }

  useEffect(() => {
    let markers = [];
    let polylines = [];

    async function initMap() {
      try {
        setLoadingMap(true);
        setLoadError("");

        await loadGoogleMapsScript();

        const center = {
          lat: Number(data.location.latitude),
          lng: Number(data.location.longitude),
        };
        centerRef.current = center;

        if (!containerRef.current) {
          setLoadingMap(false);
          return;
        }

        const map = new window.google.maps.Map(containerRef.current, {
          center,
          zoom: 13,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        });

        mapRef.current = map;

        const mainTitle = company?.name || company?.CompanyName || "Company location";

  // ✅ Use classic google.maps.Marker (old method)
const mainMarker = new window.google.maps.Marker({
  map,
  position: center,
  title: mainTitle,
});
markers.push(mainMarker);

        nearby.forEach((n) => {
          const pos = { lat: Number(n.latitude), lng: Number(n.longitude) };

          const nearbyMarker = new window.google.maps.Marker({
              map,
              position: pos,
              title: n.company_name,
            }
          );
          markers.push(nearbyMarker);

          const polyline = new window.google.maps.Polyline({
            path: [center, pos],
            strokeColor: "#5b3825",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          });
          polyline.setMap(map);
          polylines.push(polyline);
        });

        setLoadingMap(false);
      } catch (err) {
        console.error("Map load error", err);
        setLoadError(err.message || "Failed to load Google Maps.");
        setLoadingMap(false);
      }
    }

    initMap();

    return () => {
      markers.forEach((m) => {
        if (m.setMap) m.setMap(null);
        if (m.map) m.map = null;
      });
      polylines.forEach((p) => p.setMap && p.setMap(null));
    };
  }, [data, company?.id, nearby.length]);

  const handleZoomIn = () => {
    const map = mapRef.current;
    if (!map) return;
    const currentZoom = map.getZoom() || 13;
    map.setZoom(Math.min(currentZoom + 1, 18));
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    const currentZoom = map.getZoom() || 13;
    map.setZoom(Math.max(currentZoom - 1, 3));
  };

  const handleRecenter = () => {
    const map = mapRef.current;
    const center = centerRef.current;
    if (!map || !center) return;
    map.panTo(center);
    map.setZoom(13);
  };






  return (
    <Box sx={{ position: "relative" }}>
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: "clamp(220px, 48dvh, 440px)",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          bgcolor: "#f9fafb",
        }}
      />

      {loadingMap && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: "rgba(15,23,42,0.78)",
              color: "white",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CircularProgress size={18} sx={{ color: "white" }} />
            <Typography variant="caption">Loading map…</Typography>
          </Box>
        </Box>
      )}

      {loadError && (
        <Alert severity="error" icon={<CircleAlert size={20} />} sx={{ mt: 1.5 }}>
          {loadError}
        </Alert>
      )}

      {/* Map controls */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Tooltip title="Zoom in" arrow>
          <IconButton
            size={isMobile ? "small" : "medium"}
            sx={{ bgcolor: "white", boxShadow: 1 }}
            onClick={handleZoomIn}
          >
            <ZoomInIcon size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom out" arrow>
          <IconButton
            size={isMobile ? "small" : "medium"}
            sx={{ bgcolor: "white", boxShadow: 1 }}
            onClick={handleZoomOut}
          >
            <ZoomOutIcon size={18} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Recenter on company" arrow>
          <IconButton
            size={isMobile ? "small" : "medium"}
            sx={{ bgcolor: "white", boxShadow: 1 }}
            onClick={handleRecenter}
          >
            <MyLocationIcon size={18} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Legend */}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "rgba(15,23,42,0.88)",
          color: "white",
          px: 2,
          py: 1,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          gap: 2,
          fontSize: 12,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <LocationOnIcon size={16} color={"#5b3825"} />
          <span>Main company</span>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <BusinessIcon size={16} color={"#9c6648"} />
          <span>Nearby companies</span>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <MapIcon size={16} color={"#466a56"} />
          <span>Lines show distance (miles)</span>
        </Stack>
      </Box>

      {/* Nearby distances */}
      <Box sx={{ mt: 2 }}>
        {nearby.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No nearby companies found around this location.
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {nearby.map((n) => (
              <Tooltip
                key={n.company_id}
                title={`${n.company_name} — ${n.distance_miles} miles`}
                arrow
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#5b3825" }}
                  className="distance-link"
                  onClick={() => {
                    if (!mapRef.current) return;
                    const pos = { lat: Number(n.latitude), lng: Number(n.longitude) };
                    mapRef.current.panTo(pos);
                    mapRef.current.setZoom(14);
                  }}
                >
                  {n.company_name} — {n.distance_miles} miles away
                </Typography>
              </Tooltip>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

/* ========================== Detail Dialog ========================== */
export default function CompanyDetailDialog({ open, onClose, company }) {
  const tabsId = useId();
  const tabId = (tab) => `${tabsId}-tab-${tab}`;
  const panelId = (tab) => `${tabsId}-panel-${tab}`;
  const panelProps = (tab) => ({
    id: panelId(tab),
    role: "tabpanel",
    "aria-labelledby": tabId(tab),
    hidden: activeTab !== tab,
    tabIndex: 0,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activeTab, setActiveTab] = useState("overview");
  const [tabLoading, setTabLoading] = useState({});
  const [tabProgress, setTabProgress] = useState({});
  const [overviewData, setOverviewData] = useState(null);
  const [financialData, setFinancialData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [locationData, setLocationData] = useState(null);
  const [infoComment, setInfoComment] = useState("");
  // Selected financial row index for pie chart
  const [selectedFinancialIndex, setSelectedFinancialIndex] = useState(null);

  // Gallery carousel index
  const [galleryIndex, setGalleryIndex] = useState(0);

  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const aiInputRef = useRef(null);
  const aiMessagesRef = useRef(null);

  useEffect(() => {
    if (!aiMessages.length) return;
    const frame = requestAnimationFrame(() => {
      const conversation = aiMessagesRef.current;
      if (conversation) conversation.scrollTop = conversation.scrollHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [aiMessages]);
  const [aiComposerOptions, setAiComposerOptions] = useState({ starters: [], corrections: {} });
  const correctedAiInput = aiInput.replace(/\p{L}+/gu, (word) => {
    const key = word.toLowerCase();
    return Object.hasOwn(aiComposerOptions.corrections, key) ? aiComposerOptions.corrections[key] : word;
  });
  const aiSearchTerms = correctedAiInput.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [];
  const aiSuggestions = aiSearchTerms.length
    ? aiComposerOptions.starters.filter((starter) =>
        aiSearchTerms.some((term) => starter.toLowerCase().includes(term)),
      )
    : aiComposerOptions.starters;
  const [aiPending, setAiPending] = useState(false);
  const [aiError, setAiError] = useState("");
  const aiRequestRef = useRef(null);
  const aiSelectionRef = useRef(null);

  useEffect(() => {
    if (!open || company?.id == null) return;
    const controller = new AbortController();
    aiSelectionRef.current = postCompanyInsight(company.id, "selection", {}, controller.signal)
      .then((options) => {
        if (controller.signal.aborted) return false;
        setAiComposerOptions({ starters: options.starters ?? [], corrections: options.corrections ?? {} });
        return true;
      }, () => false);
    return () => {
      controller.abort();
      aiRequestRef.current?.abort();
      aiRequestRef.current = null;
      aiSelectionRef.current = null;
    };
  }, [open, company?.id]);

  // DOCUMENTS: search + inline PDF state
  const [docSearch, setDocSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docLoadingId, setDocLoadingId] = useState(null);
  const [pdfError, setPdfError] = useState("");

  // Tab wheel scroll throttle

  const [infoReaction, setInfoReaction] = useState(null);
  const [infoAnchor, setInfoAnchor] = useState(null);
  const [infoCommentText, setInfoCommentText] = useState("");
  const [infoCommentLoading, setInfoCommentLoading] = useState(false);
  const [infoCommentError, setInfoCommentError] = useState("");
  const [savedComments, setSavedComments] = useState({});
  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
  const [infoSnackbarMessage, setInfoSnackbarMessage] = useState("");
  const reaction = REACTIONS[infoReaction];
  const reactionPopoverId = `${tabsId}-reaction-comment`;


  // Reset when dialog opens for a new company
  useEffect(() => {
    if (!open || !company) return;
    setActiveTab("overview");
    setTabLoading({});
    setTabProgress({});
    setOverviewData(null);
    setFinancialData([]);
    setTeamData([]);
    setGalleryData([]);
    setDocumentsData([]);
    setContactData([]);
    setLocationData(null);
    setSelectedFinancialIndex(null);
    setGalleryIndex(0);
    setAiMessages([]);
    setAiComposerOptions({ starters: [], corrections: {} });
    setAiInput("");
    setAiPending(false);
    setAiError("");
    setDocSearch("");
    setSelectedDoc(null);
    setDocLoadingId(null);
    setPdfError("");
    setInfoReaction(null);
    setInfoAnchor(null);
    setInfoCommentText("");
    setInfoCommentLoading(false);
    setInfoCommentError("");
    setInfoSnackbarOpen(false);
    setInfoSnackbarMessage("");
    const comments = {};
    if (company.id != null) {
      try {
        for (const key of Object.keys(REACTIONS)) {
          const comment = window.localStorage.getItem(reactionCommentKey(company.id, key));
          if (comment) comments[key] = comment;
        }
      } catch {
        // Posting still works if browser storage is unavailable.
      }
    }
    setSavedComments(comments);
    loadTabData("overview", company);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, company?.id]);



  // Default-select first financial row for pie chart when data loads
  useEffect(() => {
    if (financialData && financialData.length > 0) {
      setSelectedFinancialIndex(0);
    } else {
      setSelectedFinancialIndex(null);
    }
  }, [financialData]);

  // Reset gallery index when gallery data loads
  useEffect(() => {
    if (galleryData && galleryData.length > 0) {
      setGalleryIndex(0);
    } else {
      setGalleryIndex(0);
    }
  }, [galleryData]);

  /* -------------------------- Tab progress helpers -------------------------- */
  const startTabLoading = (tab) => {
    setTabLoading((prev) => ({ ...prev, [tab]: true }));
    setTabProgress((prev) => ({ ...prev, [tab]: 10 }));
    const id = window.setInterval(() => {
      setTabProgress((prev) => {
        const cur = prev[tab] ?? 10;
        return { ...prev, [tab]: cur < 90 ? cur + 10 : cur };
      });
    }, 130);
    return id;
  };

  const stopTabLoading = (tab, intervalId) => {
    window.clearInterval(intervalId);
    setTabProgress((prev) => ({ ...prev, [tab]: 100 }));
    setTabLoading((prev) => ({ ...prev, [tab]: false }));
  };

  /* ---------------------------- Data fetch per tab ---------------------------- */
  async function loadTabData(tab, c) {
    if (!c) return;
    if (tab === "ai-insight") return;

    const sid = getSessionId();
    const base = `${API_BASE}/companies/${c.id}`;
    const qs = sid ? `?session_id=${encodeURIComponent(sid)}` : "";
    let url = "";
    let already = false;

    if (tab === "overview") {
      already = overviewData && overviewData.id === c.id;
      url = `${base}/overview${qs}`;
    } else if (tab === "financials") {
      already = financialData.length && company?.id === c.id;
      url = `${base}/financials${qs}`;
    } else if (tab === "team") {
      already = teamData.length && company?.id === c.id;
      url = `${base}/team${qs}`;
    } else if (tab === "gallery") {
      already = galleryData.length && company?.id === c.id;
      url = `${base}/gallery${qs}`;
    } else if (tab === "documents") {
      already = Array.isArray(documentsData) && documentsData.length && company?.id === c.id;
      url = `${base}/documents${qs}`;
    } else if (tab === "contact") {
      already = contactData.length && company?.id === c.id;
      url = `${base}/contact${qs}`;
    } else if (tab === "location") {
      already = locationData && company?.id === c.id;
      const baseLoc = `${API_BASE}/companies/${c.id}/location`;
      url = sid ? `${baseLoc}?session_id=${encodeURIComponent(sid)}` : baseLoc;
    }

    if (!url || already) return;

    const intervalId = startTabLoading(tab);
    try {
      const js = await fetchJSON(url);
      if (tab === "overview") setOverviewData(js.data || null);
      if (tab === "financials") setFinancialData(js.data || []);
      if (tab === "team") setTeamData(js.data || []);
      if (tab === "gallery") setGalleryData(js.data || []);
      if (tab === "documents") setDocumentsData(js.data || []);
      if (tab === "contact") setContactData(js.data || []);
      if (tab === "location") setLocationData(js.data || null);
    } catch (e) {
      console.error("Tab load error", tab, e);
    } finally {
      stopTabLoading(tab, intervalId);
    }
  }

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    setInfoAnchor(null);
    if (company) {
      loadTabData(newValue, company);
    }
  };

  /* ----------------- Reaction comment API + handlers ----------------- */
  const postCompanyReaction = async (companyId, reactionType, comment) => {
    const sessionId = getSessionId();

    const res = await fetch(`${API_BASE}/companies/${companyId}/reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        reaction_type: reactionType,
        comment,
        session_id: sessionId,
      }),
    });

    if (!res.ok) {
      let errMsg = "Failed to post reaction.";
      try {
        const err = await res.json();
        if (err?.message) errMsg = err.message;
      } catch (_) {}
      throw new Error(errMsg);
    }

    return res.json();
  };

  const handleInfoReactionClick = (key, event) => {
    setInfoReaction(key);
    setInfoAnchor(event.currentTarget);
    setInfoCommentText(savedComments[key] ?? "");
    setInfoCommentError("");
  };

  const handleInfoCommentSubmit = async (event) => {
    event.preventDefault();
    const trimmed = infoCommentText.trim();
    if (!infoReaction || company?.id == null || !trimmed || infoCommentLoading) return;

    const key = infoReaction;
    const companyId = company.id;
    setInfoCommentLoading(true);
    setInfoCommentError("");
    try {
      await postCompanyReaction(companyId, key, trimmed);
      setSavedComments((previous) => ({ ...previous, [key]: trimmed }));
      setInfoAnchor(null);
      try {
        window.localStorage.setItem(reactionCommentKey(companyId, key), trimmed);
        setInfoSnackbarMessage("Your comment has been posted and saved here.");
      } catch {
        setInfoSnackbarMessage("Comment posted. Browser storage is unavailable.");
      }
      setInfoSnackbarOpen(true);
    } catch (error) {
      setInfoCommentError(error.message || "Could not post your comment.");
    } finally {
      setInfoCommentLoading(false);
    }
  };

  const handleInfoSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setInfoSnackbarOpen(false);
  };

  /* ------------------------ Overview chart summary ------------------------ */
  const summaryChartData = useMemo(
    () => [
      { name: "Financial years", value: financialData.length || 0 },
      { name: "Team members", value: teamData.length || 0 },
      { name: "Gallery images", value: galleryData.length || 0 },
      { name: "Documents", value: documentsData.length || 0 },
      { name: "Contacts", value: contactData.length || 0 },
      {
        name: "Nearby companies",
        value:
          locationData && Array.isArray(locationData?.nearby)
            ? locationData.nearby.length
            : 0,
      },
    ],
    [financialData, teamData, galleryData, documentsData, contactData, locationData]
  );

  /* ------------------------ Financial pie chart data ------------------------ */
  const financialRows = useMemo(
    () => financialData.map((row, index) => ({ ...row, financialIndex: index })),
    [financialData],
  );

  const selectedFinancialRow = useMemo(() => {
    if (
      selectedFinancialIndex == null ||
      !financialData ||
      !financialData.length
    ) {
      return null;
    }
    return financialData[selectedFinancialIndex] || null;
  }, [selectedFinancialIndex, financialData]);

  const financialPieData = useMemo(() => {
    if (!selectedFinancialRow) return [];
    const rev = Number(selectedFinancialRow.revenue) || 0;
    const ebitda = Number(selectedFinancialRow.ebitda) || 0;
    const net = Number(selectedFinancialRow.net_income) || 0;

    return [
      { name: "Revenue", value: rev },
      { name: "EBITDA", value: ebitda },
      { name: "Net income", value: net },
    ];
  }, [selectedFinancialRow]);

  const handleSendAiMessage = async () => {
    const question = aiInput.trim();
    if (!question || company?.id == null || aiRequestRef.current) return;
    const controller = new AbortController();
    aiRequestRef.current = controller;
    setAiError("");
    setAiPending(true);
    try {
      if (!(await aiSelectionRef.current)) {
        const options = await postCompanyInsight(company.id, "selection", {}, controller.signal);
        setAiComposerOptions({ starters: options.starters ?? [], corrections: options.corrections ?? {} });
        aiSelectionRef.current = Promise.resolve(true);
      }
      const result = await postCompanyInsight(company.id, "question", { question }, controller.signal);
      if (controller.signal.aborted) return;
      setAiMessages((previous) => [
        ...previous,
        { id: previous.length, from: "user", text: result.question || question },
        { id: previous.length + 1, from: "bot", text: result.answer },
      ]);
      setAiInput("");
    } catch (error) {
      if (!controller.signal.aborted) setAiError(error.message);
    } finally {
      if (aiRequestRef.current === controller) {
        aiRequestRef.current = null;
        setAiPending(false);
        requestAnimationFrame(() => {
          const input = aiInputRef.current;
          if (input?.getClientRects().length) input.focus({ preventScroll: true });
        });
      }
    }
  };

  const handleAiKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendAiMessage();
    }
  };

  /* ------------------------ DOCUMENTS: search + URL helper ------------------------ */
  const filteredDocuments = useMemo(() => {
    const q = docSearch.trim().toLowerCase();
    if (!q) return documentsData;
    return documentsData.filter((d) => {
      const title = (d.title || d.name || "").toLowerCase();
      const type = (d.document_type || d.type || d.mime || "").toLowerCase();
      const year = (d.year || "").toString().toLowerCase();
      return title.includes(q) || type.includes(q) || year.includes(q);
    });
  }, [documentsData, docSearch]);

  const getDocUrl = (d) => {
    if (!d) return "";
    const raw = d.file_path || d.url || d.document_url || d.file_url || d.path || "";
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) {
      return raw;
    }
    const base = API_BASE.replace(/\/api\/?$/i, "");
    const normalized = `${base}/${raw.replace(/^\/+/, "")}`;
    return normalized;
  };

  const handleOpenDoc = (d) => {
    try {
      setPdfError("");
      if (!d) {
        setPdfError("File not present for this document.");
        setSelectedDoc(null);
        setDocLoadingId(null);
        return;
      }
      const url = getDocUrl(d);
      if (!url) {
        setPdfError("File not present or file_path is empty.");
        setSelectedDoc(d);
        setDocLoadingId(null);
        return;
      }
      const id = d.id ?? d.file_path ?? d.path ?? d.url ?? null;
      if (id != null) {
        setDocLoadingId(id);
      } else {
        setDocLoadingId(null);
      }
      setSelectedDoc(d);
    } catch (err) {
      console.error("Error while opening document", err);
      setPdfError("File not present or cannot be opened.");
      setSelectedDoc(d || null);
      setDocLoadingId(null);
    }
  };

  /* ------------------------ TEAM: helper for initials ------------------------ */
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  /* -------------------------------- UI -------------------------------- */
  if (!company) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Typography variant="body2">No company is selected.</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const galleryHasMany = galleryData.length > 1;
  const currentGalleryItem = galleryData[galleryIndex] || {};

  const handlePrevGallery = () => {
    if (!galleryData.length) return;
    setGalleryIndex((prev) => (prev === 0 ? galleryData.length - 1 : prev - 1));
  };

  const handleNextGallery = () => {
    if (!galleryData.length) return;
    setGalleryIndex((prev) =>
      prev === galleryData.length - 1 ? 0 : prev + 1
    );
  };

  const verificationStatus = [company?.VerificationStatus, company?.verification_status, overviewData?.VerificationStatus]
    .map((status) => String(status ?? "").trim())
    .find(Boolean) || (company?.verified ? "Verified" : "");
  const statusKey = verificationStatus.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  const [VerificationIcon, verificationLabel, verificationColor] = VERIFICATION_BADGES.get(statusKey)
    ?? [Badge, verificationStatus || "Verification status unavailable", "#746b64"];



  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        fullScreen={isMobile}
        TransitionComponent={DialogTransition}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 5,
            fontFamily: "var(--font-family-sans, Inter, system-ui, sans-serif)",
            "& .MuiTypography-body1, & .MuiTypography-body2": { fontSize: ".92rem", lineHeight: 1.65 },
            "& .MuiTypography-caption": { fontSize: ".77rem" },
            "& .MuiButton-root": { fontSize: ".79rem" },
            "& .MuiButton-containedPrimary": { bgcolor: "#5b3825", "&:hover": { bgcolor: "#271b15" } },
            "& .MuiChip-colorPrimary": { bgcolor: "#f4e8d6", color: "#5b3825" },
            "& .MuiIconButton-colorPrimary, & .MuiButton-textPrimary, & .MuiButton-outlinedPrimary": { color: "#5b3825" },
            overflow: "hidden",
            border: "1px solid #e6d1bb",
            boxShadow: "0 18px 45px rgba(56,33,22,0.22)",
            backgroundColor: "#fbf8f3",
            color: "#382116",
            width: "100%",
            ...(isMobile
              ? { height: "100%", maxHeight: "100%" }
              : { maxWidth: "1550px", height: "92dvh", maxHeight: "calc(100dvh - 32px)", m: 2, width: "calc(100% - 32px)" }),
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <Box className="dialog-arrow" />

          {/* Top-right close button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 20,
              bgcolor: "#fffdfa",
              color: "#6f452e",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              "&:hover": { bgcolor: "#f4e8d6" },
            }}
            size="small"
          >
            <CloseIcon size={18} />
          </IconButton>

          {/* Header + reaction area wrapper */}
          <Box sx={{ flexShrink: 0, maxHeight: "45dvh", overflowY: "auto" }}>
            {/* Header */}
            <Box
              sx={{
                pl: { xs: 2, sm: 3 },
                pr: 6,
                py: { xs: 1.5, sm: 2 },
                borderBottom: "1px solid #eef0f6",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                rowGap: 1,
                background: "#fffdfa",
                flexShrink: 0,
              }}
            >
              {/* Left: company title + meta */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 750,
                    fontSize: "1.35rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {overviewData?.CompanyName || company?.name || "Loading..."}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Stage: {company.stage || "Not available"}
                  </Typography>
                  <Tooltip title={verificationLabel}>
                    <Box component="span" role="img" tabIndex={0} aria-label={verificationLabel} sx={{ display: "inline-flex", color: verificationColor }}>
                      <VerificationIcon size={18} aria-hidden="true" />
                    </Box>
                  </Tooltip>
                </Box>
              </Box>

              {/* Right: social reaction controls */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  mt: { xs: 1, sm: 0 },
                }}
              >
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }} alignItems="center">
                  {Object.entries(REACTIONS).map(([key, { label, icon: Icon, bg, ink }]) => {
                    const expanded = Boolean(infoAnchor) && infoReaction === key;
                    const saved = Boolean(savedComments[key]);
                    const tooltip = saved ? `${label} · View saved comment` : label;
                    return (
                      <Tooltip key={key} title={tooltip} slotProps={{ tooltip: { sx: reactionTooltipStyle } }}>
                        <IconButton
                          aria-label={tooltip}
                          aria-haspopup="dialog"
                          aria-expanded={expanded}
                          aria-controls={expanded ? reactionPopoverId : undefined}
                          onClick={(event) => handleInfoReactionClick(key, event)}
                          sx={{
                            border: "1px solid",
                            borderColor: saved || expanded ? ink : "#dfd2c3",
                            color: ink,
                            bgcolor: saved || expanded ? bg : "#fffdf9",
                            transition: "transform 150ms ease, background-color 150ms ease",
                            "&:hover": { bgcolor: bg },
                            "&:active": { transform: "scale(.93)" },
                          }}
                        >
                          <Icon size={19} aria-hidden="true" />
                        </IconButton>
                      </Tooltip>
                    );
                  })}
                </Stack>
              </Box>
            </Box>

            <Popover
              open={Boolean(open && infoAnchor && reaction)}
              anchorEl={infoAnchor}
              onClose={() => { if (!infoCommentLoading) setInfoAnchor(null); }}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              marginThreshold={12}
              slotProps={{ paper: { sx: {
                mt: 1,
                width: 360,
                maxWidth: "calc(100vw - 24px)",
                borderRadius: "20px",
                bgcolor: reaction?.bg,
                color: reaction?.ink,
                border: "1px solid #dfd2c3",
                boxShadow: "0 14px 40px rgba(56,33,22,.20)",
              } } }}
            >
              <Box component="form" id={reactionPopoverId} role="dialog"
                aria-labelledby={`${reactionPopoverId}-title`} onSubmit={handleInfoCommentSubmit} sx={{ p: 2 }}>
                <Typography id={`${reactionPopoverId}-title`} sx={{ fontSize: ".92rem", fontWeight: 750, mb: 1.5 }}>
                  {reaction?.label}
                </Typography>
                <TextField
                  fullWidth multiline minRows={3} maxRows={6} size="small"
                  autoFocus label="Company comment" value={infoCommentText}
                  onChange={(event) => setInfoCommentText(event.target.value)}
                  disabled={infoCommentLoading}
                  error={Boolean(infoCommentError)} helperText={infoCommentError}
                  slotProps={{ htmlInput: { maxLength: 2000 } }}
                  sx={{ "& .MuiInputBase-root": { bgcolor: "#fffdf9", borderRadius: 2 } }}
                />
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1.5 }}>
                  <Button size="small" onClick={() => setInfoAnchor(null)} disabled={infoCommentLoading} sx={{ color: "inherit", textTransform: "none" }}>Cancel</Button>
                  <Button type="submit" size="small" variant="contained"
                    disabled={infoCommentLoading || !infoCommentText.trim() || infoCommentText.trim() === savedComments[infoReaction]}
                    sx={{ borderRadius: 999, bgcolor: "#5b3825", textTransform: "none", "&:hover": { bgcolor: "#271b15" } }}>
                    {infoCommentLoading ? "Saving…" : "Save comment"}
                  </Button>
                </Stack>
              </Box>
            </Popover>
          </Box>

          {/* Tabs header */}
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="Company details"
              variant="scrollable"
              visibleScrollbar
              scrollButtons={false}
              sx={{
                px: { xs: 1.5, sm: 3 },
                bgcolor: "#fffdf9",
                borderBottom: "1px solid #dfd2c3",
                "& .MuiTabs-scroller": { scrollbarWidth: "thin", scrollbarColor: "#9c6648 #f5efe6" },
                "& .MuiTabs-list": { gap: 0.5, py: 0.75, position: "relative", zIndex: 1 },
                "& .MuiTabs-indicator": {
                  top: 6,
                  bottom: 6,
                  height: "auto",
                  borderRadius: 999,
                  bgcolor: "#f4e8d6",
                  boxShadow: "inset 0 0 0 1px #dfd2c3, 0 1px 2px rgba(56,33,22,.12)",
                  pointerEvents: "none",
                  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                },
                "& .MuiTab-root": {
                  minHeight: 44,
                  px: 1.75,
                  borderRadius: 999,
                  fontSize: ".79rem",
                  fontWeight: 750,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  color: "#746b64",
                  "&:hover": { bgcolor: "rgba(156,102,72,.08)" },
                  "&.Mui-focusVisible": { outline: "2px solid #9c6648", outlineOffset: -3 },
                  "&.Mui-selected": { color: "#271b15" },
                },
              }}
            >
              <Tab value="overview" id={tabId("overview")} aria-controls={panelId("overview")} label="Overview" icon={<LayoutDashboard size={16} />} iconPosition="start" />
              <Tab value="financials" id={tabId("financials")} aria-controls={panelId("financials")} label="Financials" icon={<CircleDollarSign size={16} />} iconPosition="start" />
              <Tab value="team" id={tabId("team")} aria-controls={panelId("team")} label="Team" icon={<UsersRound size={16} />} iconPosition="start" />
              <Tab value="gallery" id={tabId("gallery")} aria-controls={panelId("gallery")} label="Gallery" icon={<Images size={16} />} iconPosition="start" />
              <Tab value="documents" id={tabId("documents")} aria-controls={panelId("documents")} label="Documents" icon={<FileText size={16} />} iconPosition="start" />
              <Tab value="contact" id={tabId("contact")} aria-controls={panelId("contact")} label="Contact" icon={<ContactRound size={16} />} iconPosition="start" />
              <Tab value="location" id={tabId("location")} aria-controls={panelId("location")} label="Location" icon={<LocationOnIcon size={16} />} iconPosition="start" />
              <Tab value="ai-insight" id={tabId("ai-insight")} aria-controls={panelId("ai-insight")} label="AI Insight" icon={<Sparkles size={16} />} iconPosition="start" />
            </Tabs>


          </Box>

          {/* Tab content (scrollable area) */}
          <Box
            sx={{
              p: { xs: 1.5, sm: 3 },
              bgcolor: "#f7f2ea",
              flex: "1 1 0",
              minHeight: 0,
              minWidth: 0,
              overflowY: "auto",
              overflowWrap: "anywhere",
              "& .MuiTableContainer-root": { maxWidth: "100%", overflowX: "auto" },
            }}
          >
            {tabLoading[activeTab] && activeTab !== "ai-insight" && (
              <Box sx={{ textAlign: "center", my: 2 }}>
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    value={tabProgress[activeTab] ?? 10}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="caption" component="div">
                      {`${Math.round(tabProgress[activeTab] ?? 10)}%`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* OVERVIEW */}
            <Fade
              in={!tabLoading["overview"] && activeTab === "overview"}
              timeout={200}
              unmountOnExit
            >
              <Box {...panelProps("overview")}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems="stretch"
                >
                  <Box
                    sx={{
                      flex: { md: 2 },
                      minWidth: 0,
                      bgcolor: "#ffffff",
                      borderRadius: 3,
                      p: 2.2,
                      boxShadow: "0 10px 30px rgba(17,24,39,.06)",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      Summary
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {overviewData?.Summary || "—"}
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      Snapshot
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {overviewData?.Snapshot ||
                        "Snapshot visualizations will appear here in a future version."}
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      Key metrics overview
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1 }}
                    >
                      Live summary based on financials, team, gallery, documents,
                      contacts, and nearby companies.
                    </Typography>
                    <Box sx={{ width: "100%", minWidth: 0 }}>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={summaryChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" interval="preserveStartEnd" minTickGap={12} tick={{ fontSize: 11 }} />
                          <YAxis allowDecimals={false} />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="value" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      flex: { md: 1.3 },
                      minWidth: 0,
                      bgcolor: "#ffffff",
                      borderRadius: 3,
                      p: 2.2,
                      boxShadow: "0 10px 30px rgba(17,24,39,.06)",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      Trust &amp; Verification
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.2}
                      sx={{ mb: 2 }}
                    >
                      <Chip
                        label={verificationLabel}
                        icon={<VerificationIcon size={15} />}
                        sx={{ color: verificationColor, "& .MuiChip-icon": { color: "inherit" } }}
                        size="small"
                      />
                      {company?.cti?.tier && (
                        <Chip label={`CTI tier: ${company.cti.tier}`} size="small" />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      This block can show verification dates, data sources, and
                      confidence scores driven from your Laravel backend.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Fade>

            {/* FINANCIALS – MUI Table + Pie chart */}
            <Fade
              in={!tabLoading["financials"] && activeTab === "financials"}
              timeout={200}
              unmountOnExit
            >
              <Box {...panelProps("financials")}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Financial information
                </Typography>
                {financialData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No financial records available for this company yet.
                  </Typography>
                ) : (
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems="stretch"
                  >
                    <Box sx={{ flex: { md: 1.6 }, minWidth: 0 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", minHeight: 280, maxHeight: 550 }}>
                        <DataGrid
                          aria-label="Financial records"
                          rows={financialRows}
                          columns={financialColumns}
                          getRowId={(row) => row.financialIndex}
                          showToolbar
                          disableRowSelectionOnClick
                          onRowClick={({ row }) => setSelectedFinancialIndex(row.financialIndex)}
                          onCellKeyDown={({ row }, event) => {
                            if (event.key === "Enter" && event.target === event.currentTarget) {
                              setSelectedFinancialIndex(row.financialIndex);
                            }
                          }}
                          getRowClassName={({ row }) =>
                            row.financialIndex === selectedFinancialIndex ? "financial-row-selected" : ""
                          }
                          pageSizeOptions={[5, 10, 25]}
                          initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                            sorting: { sortModel: [{ field: "fiscal_year", sort: "desc" }] },
                          }}
                          sx={{
                            fontFamily: "var(--font-family-sans, Inter, system-ui, sans-serif)",
                            fontSize: ".92rem",
                            color: "#271b15",
                            bgcolor: "#fffdf9",
                            borderColor: "#dfd2c3",
                            borderRadius: 2,
                            "& .MuiDataGrid-columnHeader, & .MuiDataGrid-filler": { bgcolor: "#f5efe6" },
                            "& .MuiDataGrid-columnHeaderTitle": { fontSize: ".79rem", fontWeight: 750 },
                            "& .MuiDataGrid-cell, & .MuiDataGrid-footerContainer": { borderColor: "#dfd2c3" },
                            "& .MuiDataGrid-toolbar, & .MuiDataGrid-footerContainer": { color: "#5b3825" },
                            "& .MuiDataGrid-row:hover": { bgcolor: "#f7f2ea", cursor: "pointer" },
                            "& .MuiDataGrid-row.financial-row-selected": { bgcolor: "#f4e8d6" },
                          }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        Click on a row to update the pie chart with its Revenue /
                        EBITDA / Net income breakdown.
                      </Typography>
                    </Box>

                    {/* Pie chart for selected year */}
                    <Box
                      sx={{
                        flex: 1,
                        bgcolor: "#ffffff",
                        borderRadius: 2,
                        p: 2,
                        boxShadow: "0 8px 20px rgba(15,23,42,.06)",
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Year breakdown
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Interactive pie chart showing how <strong>Revenue</strong>,{" "}
                        <strong>EBITDA</strong>, and <strong>Net income</strong>{" "}
                        relate for the selected fiscal year.
                      </Typography>

                      {selectedFinancialRow && financialPieData.length ? (
                        <Box sx={{ width: "100%", minWidth: 0 }}>
                          <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                              <RechartsTooltip />
                              <Legend />
                              <Pie
                                data={financialPieData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius="80%"
                                isAnimationActive={true}
                                label
                              >
                                <Cell fill="#c89855" />
                                <Cell fill="#466a56" />
                                <Cell fill="#9c6648" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 2 }}
                        >
                          Select a row in the table to see the pie chart.
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                )}
              </Box>
            </Fade>

            {/* TEAM – professional card-style listing */}
            <Fade
              in={!tabLoading["team"] && activeTab === "team"}
              timeout={200}
              unmountOnExit
            >
              <Box {...panelProps("team")}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Leadership &amp; team
                </Typography>
                {teamData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No team members have been added yet.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {teamData.map((member, idx) => {
                      const name = member.full_name || member.name || "—";
                      const role =
                        member.role_type ||
                        member.job_title ||
                        member.role ||
                        "—";
                      const email = member.email || "";
                      const phone = member.phone || "";
                      const location =
                        member.city || member.country || member.location || "";
                      const avatarUrl =
                        member.photo_url ||
                        member.avatar_url ||
                        member.profile_image ||
                        "";
                      const isKey = member.is_key_contact;

                      return (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={member.id ?? idx}>
                          <Paper
                            elevation={3}
                            sx={{
                              borderRadius: 2.5,
                              p: 2,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              boxShadow: "0 10px 26px rgba(15,23,42,0.07)",
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Avatar
                                src={avatarUrl || undefined}
                                alt={name}
                                sx={{
                                  width: 48,
                                  height: 48,
                                  bgcolor: avatarUrl ? undefined : "#5b3825",
                                  fontWeight: 600,
                                }}
                              >
                                {!avatarUrl && getInitials(name)}
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {role}
                                </Typography>
                              </Box>
                            </Stack>

                            <Stack spacing={0.5} sx={{ mt: 1.5, flexGrow: 1 }}>
                              {location && (
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Location:</strong> {location}
                                </Typography>
                              )}
                              {email && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ wordBreak: "break-all" }}
                                >
                                  <strong>Email:</strong>{" "}
                                  <a
                                    href={`mailto:${email}`}
                                    style={{
                                      color: "inherit",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {email}
                                  </a>
                                </Typography>
                              )}
                              {phone && (
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Phone:</strong>{" "}
                                  <a
                                    href={`tel:${phone}`}
                                    style={{
                                      color: "inherit",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {phone}
                                  </a>
                                </Typography>
                              )}
                            </Stack>

                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ mt: 1.5 }}
                              flexWrap="wrap"
                            >
                              {isKey && (
                                <Chip
                                  size="small"
                                  color="primary"
                                  label="Key contact"
                                />
                              )}
                            </Stack>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            </Fade>

            {/* GALLERY – Carousel / Slider */}
            <Fade
              in={!tabLoading["gallery"] && activeTab === "gallery"}
              timeout={200}
              unmountOnExit
            >
              <Box {...panelProps("gallery")}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Gallery
                </Typography>
                {galleryData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No gallery items yet.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      bgcolor: "#ffffff",

                                            borderRadius: 3,
                                            p: 2,
                                            boxShadow:
                                                "0 10px 26px rgba(15,23,42,.08)",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: "relative",
                                                borderRadius: 3,
                                                overflow: "hidden",
                                                minHeight: 220,
                                                bgcolor: "#020617",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            {(() => {
                                                const g = currentGalleryItem;
                                                const src =
                                                    g.image_url ||
                                                    g.url ||
                                                    g.path ||
                                                    g.thumbnail_url ||
                                                    "";
                                                const title =
                                                    g.caption ||
                                                    g.title ||
                                                    "Gallery image";
                                                if (!src) {
                                                    return (
                                                        <Box
                                                            sx={{
                                                                height: "clamp(150px, 34dvh, 320px)",
                                                                width: "100%",
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                bgcolor:
                                                                    "#0f172a",
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                color="grey.100"
                                                            >
                                                                {title}
                                                            </Typography>
                                                        </Box>
                                                    );
                                                }
                                                return (
                                                    <Box
                                                        component="img"
                                                        src={src}
                                                        alt={title}
                                                        sx={{
                                                            width: "100%",
                                                            maxHeight: 340,
                                                            objectFit: "cover",
                                                            display: "block",
                                                        }}
                                                    />
                                                );
                                            })()}

                                            {/* Carousel arrows */}
                                            {galleryHasMany && (
                                                <>
                                                    <IconButton
                                                        onClick={
                                                            handlePrevGallery
                                                        }
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            top: "50%",
                                                            left: 8,
                                                            transform:
                                                                "translateY(-50%)",
                                                            bgcolor:
                                                                "rgba(15,23,42,0.75)",
                                                            color: "white",
                                                            "&:hover": {
                                                                bgcolor:
                                                                    "rgba(15,23,42,0.95)",
                                                            },
                                                        }}
                                                        size="small"
                                                    >
                                                        <ChevronLeftIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={
                                                            handleNextGallery
                                                        }
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            top: "50%",
                                                            right: 8,
                                                            transform:
                                                                "translateY(-50%)",
                                                            bgcolor:
                                                                "rgba(15,23,42,0.75)",
                                                            color: "white",
                                                            "&:hover": {
                                                                bgcolor:
                                                                    "rgba(15,23,42,0.95)",
                                                            },
                                                        }}
                                                        size="small"
                                                    >
                                                        <ChevronRightIcon />
                                                    </IconButton>
                                                </>
                                            )}

                                            {/* Caption overlay */}
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    px: 2,
                                                    py: 1,
                                                    bgcolor:
                                                        "linear-gradient(to top,rgba(0,0,0,.6),transparent)",
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "grey.100",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {currentGalleryItem.caption ||
                                                        currentGalleryItem.title ||
                                                        "Gallery image"}
                                                </Typography>
                                                {currentGalleryItem.is_primary && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: "grey.300",
                                                        }}
                                                    >
                                                        Primary visual
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>

                                        {/* Dots indicator */}
                                        {galleryHasMany && (
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                justifyContent="center"
                                                sx={{ mt: 1.5 }}
                                            >
                                                {galleryData.map((_, idx) => (
                                                    <IconButton
                                                        key={idx}
                                                        size="small"
                                                        onClick={() =>
                                                            setGalleryIndex(idx)
                                                        }
                                                        sx={{
                                                            p: 0.3,
                                                        }}
                                                    >
                                                        <Circle
                                                            size={8}
                                                            fill="currentColor"
                                                            color={idx === galleryIndex ? "#5b3825" : "#9ca3af"}
                                                        />
                                                    </IconButton>
                                                ))}
                                            </Stack>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        </Fade>

                        {/* DOCUMENTS */}
                        <Fade
                            in={
                                !tabLoading["documents"] &&
                                activeTab === "documents"
                            }
                            timeout={200}
                            unmountOnExit
                        >
                            <Box {...panelProps("documents")}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Documents
                                </Typography>
                                {documentsData.length === 0 ? (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        No documents attached yet.
                                    </Typography>
                                ) : (
                                    <>
                                        <Box
                                            sx={{
                                                bgcolor: "#ffffff",
                                                borderRadius: 2,
                                                boxShadow:
                                                    "0 8px 20px rgba(15,23,42,.06)",
                                                p: 1.5,
                                            }}
                                        >
                                            {/* Search input */}
                                            <Box
                                                sx={{
                                                    mb: 1.5,
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                <TextField
                                                    size="small"
                                                    label="Search documents"
                                                    variant="outlined"
                                                    value={docSearch}
                                                    onChange={(e) =>
                                                        setDocSearch(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Box>

                                            {/* MUI Table */}
                                            <TableContainer>
                                                <Table size="small" sx={{ minWidth: 520 }}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>
                                                                Title
                                                            </TableCell>
                                                            <TableCell>
                                                                Type
                                                            </TableCell>
                                                            <TableCell>
                                                                Year
                                                            </TableCell>
                                                            <TableCell>
                                                                Action
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {filteredDocuments.map(
                                                            (row, idx) => {
                                                                const url =
                                                                    getDocUrl(
                                                                        row
                                                                    );
                                                                const id =
                                                                    row.id ??
                                                                    row.file_path ??
                                                                    row.path ??
                                                                    row.url ??
                                                                    null;
                                                                const isLoading =
                                                                    docLoadingId !=
                                                                        null &&
                                                                    docLoadingId ===
                                                                        id;

                                                                const title =
                                                                    row.title ||
                                                                    row.name ||
                                                                    "Document";
                                                                const type =
                                                                    row.document_type ||
                                                                    row.type ||
                                                                    row.mime ||
                                                                    "—";
                                                                let year = "—";
                                                                if (row.year) {
                                                                    year =
                                                                        row.year;
                                                                } else if (
                                                                    row.created_at
                                                                ) {
                                                                    const d =
                                                                        new Date(
                                                                            row.created_at
                                                                        );
                                                                    if (
                                                                        !isNaN(
                                                                            d.getTime()
                                                                        )
                                                                    ) {
                                                                        year =
                                                                            d.getFullYear();
                                                                    }
                                                                }

                                                                return (
                                                                    <TableRow
                                                                        key={
                                                                            row.id ??
                                                                            idx
                                                                        }
                                                                    >
                                                                        <TableCell>
                                                                            {
                                                                                title
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {
                                                                                type
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {
                                                                                year
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Button
                                                                                size="small"
                                                                                variant="contained"
                                                                                color="primary"
                                                                                onClick={() =>
                                                                                    handleOpenDoc(
                                                                                        row
                                                                                    )
                                                                                }
                                                                                sx={{
                                                                                    borderRadius: 999,
                                                                                    px: 2,
                                                                                    textTransform:
                                                                                        "none",
                                                                                    minWidth: 88,
                                                                                }}
                                                                                disabled={
                                                                                    !url
                                                                                }
                                                                            >
                                                                                {isLoading ? (
                                                                                    <CircularProgress
                                                                                        size={
                                                                                            16
                                                                                        }
                                                                                        color="inherit"
                                                                                    />
                                                                                ) : (
                                                                                    "Open"
                                                                                )}
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            }
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>

                                        {/* Inline PDF / file viewer */}
                                        <Box
                                            sx={{
                                                mt: 2,
                                                bgcolor: "#ffffff",
                                                borderRadius: 2.5,
                                                boxShadow:
                                                    "0 10px 26px rgba(15,23,42,.10)",
                                                p: 2,
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ mb: 0.5 }}
                                            >
                                                Document preview
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mb: 1.5 }}
                                            >
                                                Select <strong>Open</strong> in
                                                the table above to preview a PDF
                                                document from the{" "}
                                                <code>file_path</code> stored in
                                                the database.
                                            </Typography>
                                            {pdfError && (
                                                <Alert
                                                    severity="error" icon={<CircleAlert size={20} />}
                                                    sx={{ mb: 1.5 }}
                                                >
                                                    {pdfError}
                                                </Alert>
                                            )}
                                            {!selectedDoc ? (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    No document selected yet.
                                                </Typography>
                                            ) : (
                                                (() => {
                                                    const url =
                                                        getDocUrl(selectedDoc);
                                                    if (!url) {
                                                        return (
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                This document
                                                                does not have a
                                                                valid file path.
                                                            </Typography>
                                                        );
                                                    }
                                                    const title =
                                                        selectedDoc.title ||
                                                        selectedDoc.name ||
                                                        "Document";
                                                    const isPdf = url
                                                        .toLowerCase()
                                                        .includes(".pdf");

                                                    if (!isPdf) {
                                                        return (
                                                            <Box>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        mb: 0.5,
                                                                    }}
                                                                >
                                                                    This file is
                                                                    not a PDF.
                                                                    You can open
                                                                    it in a new
                                                                    tab:
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        wordBreak:
                                                                            "break-all",
                                                                    }}
                                                                >
                                                                    <a
                                                                        href={
                                                                            url
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        {url}
                                                                    </a>
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    }

                                                    return (
                                                        <>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    mb: 1,
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {title}
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    width: "100%",
                                                                    maxWidth: 800,
                                                                    height: "clamp(240px, 65dvh, 620px)",
                                                                    mx: "auto",
                                                                    borderRadius: 2,
                                                                    overflow:
                                                                        "hidden",
                                                                    boxShadow:
                                                                        "0 8px 18px rgba(15,23,42,0.15)",
                                                                    border: "1px solid #e5e7eb",
                                                                    position:
                                                                        "relative",
                                                                }}
                                                            >
                                                                {docLoadingId && (
                                                                    <Box
                                                                        sx={{
                                                                            position:
                                                                                "absolute",
                                                                            inset: 0,
                                                                            display:
                                                                                "flex",
                                                                            alignItems:
                                                                                "center",
                                                                            justifyContent:
                                                                                "center",
                                                                            bgcolor:
                                                                                "rgba(255,255,255,0.7)",
                                                                            zIndex: 2,
                                                                        }}
                                                                    >
                                                                        <CircularProgress
                                                                            size={
                                                                                24
                                                                            }
                                                                        />
                                                                    </Box>
                                                                )}
                                                                <iframe
                                                                    src={url}
                                                                    title={
                                                                        title
                                                                    }
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "100%",
                                                                        border: "none",
                                                                    }}
                                                                    onLoad={() =>
                                                                        setDocLoadingId(
                                                                            null
                                                                        )
                                                                    }
                                                                />
                                                            </Box>
                                                            <Box
                                                                sx={{
                                                                    mt: 1.5,
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "flex-end",
                                                                }}
                                                            >
                                                                <Button
                                                                    size="small"
                                                                    component="a"
                                                                    href={url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Open in new
                                                                    tab
                                                                </Button>
                                                            </Box>
                                                        </>
                                                    );
                                                })()
                                            )}
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Fade>

                        {/* CONTACT */}
                        {/* CONTACT */}
                        <Fade
                            in={
                                !tabLoading["contact"] &&
                                activeTab === "contact"
                            }
                            timeout={200}
                            unmountOnExit
                        >
                            <Box {...panelProps("contact")}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Contact information
                                </Typography>
                                {contactData.length === 0 ? (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        No team members are available to show as
                                        contacts yet.
                                    </Typography>
                                ) : (
                                    <Grid container spacing={2}>
                                        {contactData.map((member, idx) => {
                                            const name =
                                                member.full_name ||
                                                member.name ||
                                                "";
                                            const role =
                                                member.role_type ||
                                                member.job_title ||
                                                member.role ||
                                                "";
                                            const email = member.email || "";
                                            const phone = member.phone || "";
                                            const location =
                                                member.city ||
                                                member.country ||
                                                member.location ||
                                                "";
                                            const avatarUrl =
                                                member.photo_url ||
                                                member.avatar_url ||
                                                member.profile_image ||
                                                "";
                                            const isKey = member.is_key_contact;

                                            return (
                                                <Grid
                                                    size={{ xs: 12, sm: 6, lg: 4 }}
                                                    key={member.id ?? idx}
                                                >
                                                    <Paper
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 2.5,
                                                            height: "100%",
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            boxShadow:
                                                                "0 8px 22px rgba(15,23,42,0.06)",
                                                            border: "1px solid rgba(148,163,184,0.35)",
                                                            bgcolor: "#ffffff",
                                                        }}
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            spacing={1.8}
                                                            alignItems="center"
                                                        >
                                                            <Avatar
                                                                src={
                                                                    avatarUrl ||
                                                                    undefined
                                                                }
                                                                alt={name}
                                                                sx={{
                                                                    width: 46,
                                                                    height: 46,
                                                                    bgcolor:
                                                                        avatarUrl
                                                                            ? undefined
                                                                            : "#5b3825",
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {!avatarUrl &&
                                                                    getInitials(
                                                                        name
                                                                    )}
                                                            </Avatar>
                                                            <Box
                                                                sx={{
                                                                    minWidth: 0,
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                        mb: 0.2,
                                                                    }}
                                                                >
                                                                    {name}
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {role}
                                                                </Typography>
                                                                {location && (
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                        sx={{
                                                                            display:
                                                                                "block",
                                                                            mt: 0.3,
                                                                        }}
                                                                    >
                                                                        {
                                                                            location
                                                                        }
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Stack>

                                                        <Stack
                                                            spacing={0.4}
                                                            sx={{
                                                                mt: 1.5,
                                                                flexGrow: 1,
                                                            }}
                                                        >
                                                            {email && (
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        wordBreak:
                                                                            "break-all",
                                                                    }}
                                                                    color="text.secondary"
                                                                >
                                                                    <strong>
                                                                        Email:{" "}
                                                                    </strong>
                                                                    <a
                                                                        href={`mailto:${email}`}
                                                                        style={{
                                                                            color: "inherit",
                                                                            textDecoration:
                                                                                "none",
                                                                        }}
                                                                    >
                                                                        {email}
                                                                    </a>
                                                                </Typography>
                                                            )}
                                                            {phone && (
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    <strong>
                                                                        Phone:{" "}
                                                                    </strong>
                                                                    <a
                                                                        href={`tel:${phone}`}
                                                                        style={{
                                                                            color: "inherit",
                                                                            textDecoration:
                                                                                "none",
                                                                        }}
                                                                    >
                                                                        {phone}
                                                                    </a>
                                                                </Typography>
                                                            )}
                                                        </Stack>

                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            sx={{ mt: 1.3 }}
                                                            flexWrap="wrap"
                                                        >
                                                            {isKey && (
                                                                <Chip
                                                                    size="small"
                                                                    color="primary"
                                                                    label="Key contact"
                                                                />
                                                            )}
                                                        </Stack>
                                                    </Paper>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                )}
                            </Box>
                        </Fade>

                        {/* LOCATION */}
                        <Fade
                            in={
                                !tabLoading["location"] &&
                                activeTab === "location"
                            }
                            timeout={200}
                            unmountOnExit
                        >
                            <Box {...panelProps("location")}>
                                {locationData ? (
                                    <LocationMap
                                        data={locationData}
                                        company={company}
                                    />
                                ) : (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        No location data yet.
                                    </Typography>
                                )}
                            </Box>
                        </Fade>

                        {/* AI INSIGHT */}
                        <Fade
                            in={activeTab === "ai-insight"}
                            timeout={200}
                            unmountOnExit
                        >
                            <Box {...panelProps("ai-insight")}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ mb: 0.5 }}
                                >
                                    AI Insight
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1.5 }}
                                >
                                    Ask about the available records for <strong>{company?.name}</strong>.
                                    Each question retrieves matching records from Raymoch.
                                </Typography>
                                <Box className="ai-chat">
                                    <Box ref={aiMessagesRef} className="ai-chat-messages" role="log" aria-label="AI Insight answers" tabIndex={0}>
                                        {!aiMessages.length && (
                                            <Typography variant="body2">Try asking for the most recent financial results or a summary of the leadership team.</Typography>
                                        )}
                                        {aiMessages.map((m) => (
                                            <Box
                                                key={m.id}
                                                className={`ai-chat-bubble ${
                                                    m.from === "user"
                                                        ? "ai-chat-bubble-user"
                                                        : "ai-chat-bubble-bot"
                                                }`}
                                            >
                                                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                                                    {m.text}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                    {aiError && <Alert severity="error" icon={<CircleAlert size={20} />}>{aiError}</Alert>}
                                    {aiPending && <Typography role="status" sx={{ px: 2 }}>Retrieving company records…</Typography>}
                                    <Box className="ai-chat-composer">
                                        {(aiSuggestions.length > 0 || correctedAiInput !== aiInput) && (
                                            <Box className="ai-chat-suggestions" aria-label="Question suggestions">
                                                {correctedAiInput !== aiInput && (
                                                    <button type="button" onClick={() => {
                                                        setAiInput(correctedAiInput);
                                                        aiInputRef.current?.focus();
                                                    }}>Use “{correctedAiInput}”</button>
                                                )}
                                                {aiSuggestions.map((suggestion) => (
                                                    <button key={suggestion} type="button" onClick={() => {
                                                        setAiInput(suggestion);
                                                        aiInputRef.current?.focus();
                                                    }}>{suggestion}</button>
                                                ))}
                                            </Box>
                                        )}
                                        <Box className="ai-chat-input-row">
                                            <TextField
                                                inputRef={aiInputRef}
                                                value={aiInput}
                                                onChange={(event) => setAiInput(event.target.value)}
                                                onKeyDown={handleAiKeyDown}
                                                variant="standard"
                                                fullWidth multiline maxRows={4}
                                                placeholder="Ask about this company…"
                                                disabled={aiPending}
                                                slotProps={{
                                                    input: { disableUnderline: true },
                                                    htmlInput: { maxLength: 1500, spellCheck: true, autoCorrect: "on", "aria-label": "Question about the selected company" },
                                                }}
                                            />
                                            <IconButton
                                                className="ai-chat-send"
                                                onClick={handleSendAiMessage}
                                                disabled={aiPending || !aiInput.trim()}
                                                aria-label="Send company question"
                                            >
                                                <SendIcon size={18} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Fade>
                    </Box>
                    <Snackbar
  open={infoSnackbarOpen}
  autoHideDuration={3000}
  onClose={handleInfoSnackbarClose}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
>
  <Alert
    onClose={handleInfoSnackbarClose}
    severity="success"
    icon={<CheckCircleOutlineIcon size={20} />}
    slots={{ closeIcon: CloseIcon }}
    sx={{ width: "100%" }}
  >
    {infoSnackbarMessage || "Your comment has been posted."}
  </Alert>
</Snackbar>

                </DialogContent>
            </Dialog>
        </>
    );
}
