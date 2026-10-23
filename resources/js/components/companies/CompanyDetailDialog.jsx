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
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  TextField,
  Avatar,
  Grid,
  Snackbar,
} from "@mui/material";

// Header / general icons
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

// Contact Tab icons (even if not all used, we keep them available)
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";

// Tab icons
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";

// Gallery carousel icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// Social reaction icons
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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
const TAB_KEYS = [
  "overview",
  "financials",
  "team",
  "gallery",
  "documents",
  "contact",
  "location",
  "ai-insight",
];

const financialColumns = [
  { field: "fiscal_year", headerName: "Fiscal year", flex: 1, minWidth: 110 },
  {
    field: "revenue",
    headerName: "Revenue",
    flex: 1.2,
    minWidth: 130,
    valueFormatter: (params) => (params.value != null ? params.value : "—"),
  },
  {
    field: "ebitda",
    headerName: "EBITDA",
    flex: 1.1,
    minWidth: 120,
    valueFormatter: (params) => (params.value != null ? params.value : "—"),
  },
  {
    field: "net_income",
    headerName: "Net income",
    flex: 1.1,
    minWidth: 130,
    valueFormatter: (params) => (params.value != null ? params.value : "—"),
  },
  { field: "currency", headerName: "Currency", width: 110 },
  { field: "created_at", headerName: "Created at", flex: 1, minWidth: 140 },
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
      <Alert severity="warning" sx={{ mt: 1.5 }}>
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
            strokeColor: "#2563eb",
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


  // CHANGE this handler
const handleReactionClick = (reaction) => {
  setInfoReaction(reaction);
  setInfoCommentOpen(true); // show the grid message box

  // persist reaction immediately (without waiting for Post)
  if (company?.id) {
    const payload = {
      reaction,
      comment: infoComment || "",
    };
    window.localStorage.setItem(
      getCompanyReactionKey(company.id),
      JSON.stringify(payload)
    );
  }
};


// CHANGE this handler
const handlePostComment = async () => {
  try {
    await fetchJSON(
      `${API_BASE}/companies/${company.id}/reactions`,
      "POST",
      {
        reaction: infoReaction,
        comment: infoComment,
        session_id: getSessionId()
      }
    );

    setInfoCommentOpen(false); // hide grid box
  } catch (err) {
    console.error("Reaction post error:", err);
  }
};



  return (
    <Box sx={{ position: "relative" }}>
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: 360,
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
        <Alert severity="error" sx={{ mt: 1.5 }}>
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
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom out" arrow>
          <IconButton
            size={isMobile ? "small" : "medium"}
            sx={{ bgcolor: "white", boxShadow: 1 }}
            onClick={handleZoomOut}
          >
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Recenter on company" arrow>
          <IconButton
            size={isMobile ? "small" : "medium"}
            sx={{ bgcolor: "white", boxShadow: 1 }}
            onClick={handleRecenter}
          >
            <MyLocationIcon fontSize="small" />
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
          <LocationOnIcon sx={{ fontSize: 16, color: "#60a5fa" }} />
          <span>Main company</span>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <BusinessIcon sx={{ fontSize: 16, color: "#f97316" }} />
          <span>Nearby companies</span>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <MapIcon sx={{ fontSize: 16, color: "#22c55e" }} />
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
                  color="primary"
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

  // AI Insight UI-only state
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "This AI panel will eventually summarize signals from financials, team, and market data. For now, type your question to sketch the UX.",
      ts: new Date().toISOString(),
    },
  ]);
  const [aiInput, setAiInput] = useState("");

  // DOCUMENTS: search + inline PDF state
  const [docSearch, setDocSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docLoadingId, setDocLoadingId] = useState(null);
  const [pdfError, setPdfError] = useState("");

  // Tab wheel scroll throttle
  const tabsWheelLockRef = useRef(0);

  // Social reaction/comment state
  const [infoReaction, setInfoReaction] = useState(null); // "marked" | "future" | "satisfied" | "unsatisfied" | null
  const [infoCommentOpen, setInfoCommentOpen] = useState(false);
  const [infoCommentText, setInfoCommentText] = useState("");
  const [infoCommentLoading, setInfoCommentLoading] = useState(false);
  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
  const [infoSnackbarMessage, setInfoSnackbarMessage] = useState("");

  // Positioning for comment box
  const [infoAnchorX, setInfoAnchorX] = useState(null); // viewport X of clicked icon
  const reactionAreaRef = useRef(null); // wraps header + comment box
  const commentContainerRef = useRef(null); // container for comment box positioning

  const reactionLabelMap = {
    marked: "Information is marked",
    future: "Information for future use",
    satisfied: "Information satisfied",
    unsatisfied: "Information unsatisfied",
  };

  const getCompanyReactionKey = (companyId) =>`company_reaction_${companyId}`;


  const reactionColorMap = {
    marked: { bg: "#eef2ff", border: "#2563eb" },
    future: { bg: "#ecfdf3", border: "#16a34a" },
    satisfied: { bg: "#eff6ff", border: "#2563eb" },
    unsatisfied: { bg: "#fef2f2", border: "#dc2626" },
  };

  // ADD / UPDATE: useEffect that runs when dialog/list opens for a company
useEffect(() => {
  if (!open || !company?.id) return;

  try {
    const raw = window.localStorage.getItem(
      getCompanyReactionKey(company.id)
    );

    if (raw) {
      const saved = JSON.parse(raw);
      setInfoReaction(saved.reaction || null);
      setInfoComment(saved.comment || "");
    } else {
      setInfoReaction(null);
      setInfoComment("");
    }
  } catch (e) {
    console.warn("Failed to load saved reaction", e);
    setInfoReaction(null);
    setInfoComment("");
  }

  // when opening, keep the box hidden until user clicks reaction again
  setInfoCommentOpen(false);
}, [open, company?.id]);


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
    setAiMessages([
      {
        id: 1,
        from: "bot",
        text: "This AI panel will eventually summarize signals from financials, team, and market data. For now, type your question to sketch the UX.",
        ts: new Date().toISOString(),
      },
    ]);
    setAiInput("");
    setDocSearch("");
    setSelectedDoc(null);
    setDocLoadingId(null);
    setPdfError("");
    setInfoReaction(null);
    setInfoCommentOpen(false);
    setInfoCommentText("");
    setInfoCommentLoading(false);
    setInfoSnackbarOpen(false);
    setInfoSnackbarMessage("");
    setInfoAnchorX(null);
    loadTabData("overview", company);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, company?.id]);

  // Close comment box when clicking outside header + message box
  useEffect(() => {
    if (!open) return;

    const handleGlobalClick = (e) => {
      if (!reactionAreaRef.current) return;
      const clickedInside = reactionAreaRef.current.contains(e.target);
      if (!clickedInside) {
        setInfoCommentOpen(false);
        setInfoReaction(null);
        setInfoAnchorX(null);
      }
    };

    document.addEventListener("mousedown", handleGlobalClick);
    return () => {
      document.removeEventListener("mousedown", handleGlobalClick);
    };
  }, [open]);

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
    // Close the comment box when changing tabs
    setInfoCommentOpen(false);
    setInfoReaction(null);
    setInfoAnchorX(null);
    if (company) {
      loadTabData(newValue, company);
    }
  };

  // Allow switching tabs with mouse wheel / touchpad when hovering over Tabs
  const handleTabsWheel = (event) => {
    const now = Date.now();
    if (now - tabsWheelLockRef.current < 220) return;

    const { deltaX, deltaY } = event;
    const dominant = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
    if (Math.abs(dominant) < 5) return;

    const currentIndex = TAB_KEYS.indexOf(activeTab);
    let nextIndex = currentIndex;

    if (dominant > 0 && currentIndex < TAB_KEYS.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (dominant < 0 && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }

    if (nextIndex !== currentIndex) {
      tabsWheelLockRef.current = now;
      handleTabChange(null, TAB_KEYS[nextIndex]);
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
    // clicking the same reaction while box is open closes it
    if (infoReaction === key && infoCommentOpen) {
      setInfoCommentOpen(false);
      setInfoReaction(null);
      setInfoAnchorX(null);
      return;
    }

    // compute the center X of the clicked icon (relative to viewport)
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      setInfoAnchorX(centerX);
    }

    setInfoReaction(key);
    setInfoCommentText("");
    setInfoCommentOpen(true);
  };

  const handleInfoCommentSubmit = async () => {
    if (!infoReaction || !company?.id) return;
    const trimmed = infoCommentText.trim();
    if (!trimmed) return;

    setInfoCommentLoading(true);
    try {
      await postCompanyReaction(company.id, infoReaction, trimmed);
      setInfoCommentLoading(false);
      setInfoCommentOpen(false);
      setInfoReaction(null);
      setInfoCommentText("");
      setInfoAnchorX(null);
      setInfoSnackbarMessage("Your comment has been posted.");
      setInfoSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setInfoCommentLoading(false);
      setInfoSnackbarMessage(err.message || "Failed to post comment.");
      setInfoSnackbarOpen(true);
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

  /* ------------------------ AI Insight UI handlers ------------------------ */
  const handleSendAiMessage = () => {
    const trimmed = aiInput.trim();
    if (!trimmed) return;
    const nextId = aiMessages.length ? aiMessages[aiMessages.length - 1].id + 1 : 1;
    const userMessage = {
      id: nextId,
      from: "user",
      text: trimmed,
      ts: new Date().toISOString(),
    };
    const botMessage = {
      id: nextId + 1,
      from: "bot",
      text:
        "This is a placeholder AI response. In production, this panel will use your Raymoch signals to generate insights about this company.",
      ts: new Date().toISOString(),
    };
    setAiMessages((prev) => [...prev, userMessage, botMessage]);
    setAiInput("");
  };

  const handleAiKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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

  const activeTabIndex = TAB_KEYS.indexOf(activeTab);
  const tabProgressRatio =
    activeTabIndex <= 0
      ? 0
      : activeTabIndex >= TAB_KEYS.length - 1
      ? 1
      : activeTabIndex / (TAB_KEYS.length - 1);

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
            overflow: "hidden",
            border: "1px solid rgba(148,163,184,0.55)",
            boxShadow: "0 18px 45px rgba(15,23,42,0.22)",
            backgroundColor: "#ffffff",
            width: "100%",
            ...(isMobile
              ? { height: "100%", maxHeight: "100%" }
              : { maxWidth: "1550px", height: "92vh", maxHeight: "92vh" }),
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "200%",
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
              bgcolor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              "&:hover": { bgcolor: "white" },
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* Header + reaction area wrapper */}
          <Box ref={reactionAreaRef}>
            {/* Header */}
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 1.5, sm: 2 },
                borderBottom: "1px solid #eef0f6",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                rowGap: 1,
                background: "#ffffff",
                flexShrink: 0,
              }}
            >
              {/* Left: company title + meta */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {overviewData?.CompanyName || company?.name || "Loading..."}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {overviewData?.Sector || company?.sector || "—"} •{" "}
                  {overviewData?.Country || company?.country || "—"}
                </Typography>
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
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mr: 0.5, fontWeight: 500 }}
                  >
                    Social reaction
                  </Typography>

                  {/* information is marked (checkmark) */}
                  <Tooltip title="Information is marked" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => handleInfoReactionClick("marked", e)}
                      sx={{
                        borderRadius: "999px",
                        bgcolor:
                          infoReaction === "marked"
                            ? "primary.main"
                            : "rgba(37,99,235,0.10)",
                        color:
                          infoReaction === "marked"
                            ? "common.white"
                            : "primary.main",
                        boxShadow:
                          infoReaction === "marked"
                            ? "0 0 0 1px rgba(37,99,235,0.35)"
                            : "none",
                      }}
                    >
                      <CheckCircleOutlineIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>

                  {/* information for future use (bookmark) */}
                  <Tooltip title="Information for future use" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => handleInfoReactionClick("future", e)}
                      sx={{
                        borderRadius: "999px",
                        bgcolor:
                          infoReaction === "future"
                            ? "success.main"
                            : "rgba(22,163,74,0.10)",
                        color:
                          infoReaction === "future"
                            ? "common.white"
                            : "success.main",
                        boxShadow:
                          infoReaction === "future"
                            ? "0 0 0 1px rgba(34,197,94,0.35)"
                            : "none",
                      }}
                    >
                      <BookmarkBorderIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>

                  {/* information satisfied (like) */}
                  <Tooltip title="Information satisfied" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => handleInfoReactionClick("satisfied", e)}
                      sx={{
                        borderRadius: "999px",
                        bgcolor:
                          infoReaction === "satisfied"
                            ? "primary.main"
                            : "rgba(37,99,235,0.10)",
                        color:
                          infoReaction === "satisfied"
                            ? "common.white"
                            : "primary.main",
                        boxShadow:
                          infoReaction === "satisfied"
                            ? "0 0 0 1px rgba(37,99,235,0.35)"
                            : "none",
                      }}
                    >
                      <ThumbUpAltOutlinedIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>

                  {/* information unsatisfied (dislike) */}
                  <Tooltip title="Information unsatisfied" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => handleInfoReactionClick("unsatisfied", e)}
                      sx={{
                        borderRadius: "999px",
                        bgcolor:
                          infoReaction === "unsatisfied"
                            ? "error.main"
                            : "rgba(239,68,68,0.12)",
                        color:
                          infoReaction === "unsatisfied"
                            ? "common.white"
                            : "error.main",
                        boxShadow:
                          infoReaction === "unsatisfied"
                            ? "0 0 0 1px rgba(239,68,68,0.4)"
                            : "none",
                      }}
                    >
                      <ThumbDownAltOutlinedIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Box>

            {/* Reaction Comment Box - appears above Tabs */}
            <Fade
              in={infoCommentOpen && Boolean(infoReaction)}
              timeout={220}
              unmountOnExit
            >
              <Box
                ref={commentContainerRef}
                sx={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  mt: 1,
                  mb: 1.5,
                  zIndex: 10,
                }}
              >
                <Box
                  sx={(theme) => {
                    const cfg =
                      infoReaction && reactionColorMap[infoReaction]
                        ? reactionColorMap[infoReaction]
                        : null;

                    const bg = cfg
                      ? cfg.bg
                      : theme.palette.background.paper;
                    const border = cfg ? cfg.border : "rgba(148,163,184,0.5)";

                    // position relative to clicked icon
                    let leftPx = "50%";
                    if (infoAnchorX && commentContainerRef.current) {
                      const parentRect =
                        commentContainerRef.current.getBoundingClientRect();
                      const rel = infoAnchorX - parentRect.left;
                      leftPx = `${rel}px`;
                    }

                    return {
                      position: "absolute",
                      top: 0,
                      left: leftPx,
                      transform: "translateX(-50%)",
                      maxWidth: 260,
                      width: "100%",
                      borderRadius: 2,
                      p: 1.2,
                      bgcolor: bg,
                      border: `1px solid ${border}`,
                      boxShadow: "0 8px 18px rgba(15,23,42,0.18)",
                    };
                  }}
                >
                  {/* Arrow pointing to the clicked reaction icon */}
                  <Box
                    sx={(theme) => {
                      const cfg =
                        infoReaction && reactionColorMap[infoReaction]
                          ? reactionColorMap[infoReaction]
                          : null;
                      const bg = cfg
                        ? cfg.bg
                        : theme.palette.background.paper;

                      return {
                        position: "absolute",
                        top: -6,
                        left: "50%",
                        transform: "translateX(-50%) rotate(45deg)",
                        width: 10,
                        height: 10,
                        bgcolor: bg,
                        borderLeft: "1px solid rgba(148,163,184,0.35)",
                        borderTop: "1px solid rgba(148,163,184,0.35)",
                      };
                    }}
                  />

                  {/* Title */}
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, mb: 0.6, display: "block" }}
                  >
                    {infoReaction ? reactionLabelMap[infoReaction] : "Comment"}
                  </Typography>

                  {/* Input + Buttons */}
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        maxRows={3}
                        autoFocus
                        placeholder="Write a short comment…"
                        value={infoCommentText}
                        onChange={(e) => setInfoCommentText(e.target.value)}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => {
                          setInfoCommentOpen(false);
                          setInfoReaction(null);
                          setInfoAnchorX(null);
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        size="small"
                        variant="contained"
                        disabled={
                          infoCommentLoading ||
                          !infoCommentText.trim() ||
                          !infoReaction
                        }
                        onClick={handleInfoCommentSubmit}
                      >
                        {infoCommentLoading ? "Posting…" : "Post"}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Fade>
          </Box>

          {/* Tabs header */}
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              onWheel={handleTabsWheel}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: { xs: 1.5, sm: 3 },
                borderBottom: "1px solid #eef0f6",
                bgcolor: "#f8f9ff",
              }}
              TabIndicatorProps={{
                sx: {
                  height: 3,
                  borderRadius: 999,
                  background: "linear-gradient(90deg,#3b82f6,#22c55e,#f97316)",
                },
              }}
            >
              <Tab
                value="overview"
                icon={<DashboardOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="Overview"
                sx={{
                  color:
                    activeTab === "overview" ? "primary.main" : "text.secondary",
                  "& .MuiTab-iconWrapper": {
                    color: activeTab === "overview" ? "primary.main" : "#111827",
                  },
                }}
              />
              <Tab
                value="financials"
                icon={<PaidOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="Financials"
                sx={{
                  color:
                    activeTab === "financials"
                      ? "primary.main"
                      : "text.secondary",
                  "& .MuiTab-iconWrapper": {
                    color:
                      activeTab === "financials" ? "primary.main" : "#111827",
                  },
                }}
              />
              <Tab
                value="team"
                icon={<GroupsOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="Team"
                sx={{
                  color: activeTab === "team" ? "primary.main" : "text.secondary",
                  "& .MuiTab-iconWrapper": {
                    color: activeTab === "team" ? "primary.main" : "#111827",
                  },
                }}
              />
              <Tab
                value="gallery"
                icon={<PhotoLibraryOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="Gallery"
                sx={{
                  color:
                    activeTab === "gallery" ? "primary.main" : "text.secondary",
                  "& .MuiTab-iconWrapper": {
                    color: activeTab === "gallery" ? "primary.main" : "#111827",
                  },
                }}
              />
              <Tab
                value="documents"
                icon={<DescriptionOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="Documents"
                sx={{
                  color:
                    activeTab === "documents"
                      ? "primary.main"
                      : "text.secondary",
                  "& .MuiTab-iconWrapper": {
                    color:
                      activeTab === "documents" ? "primary.main" : "#111827",
                  },
                }}
              />
              <Tab
                value="contact"
                icon={<ContactMailOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="Contact"
                sx={{
                  color:
                    activeTab === "contact" ? "primary.main" : "text.secondary",
                  "& .MuiTab-iconWrapper": {
                    color: activeTab === "contact" ? "primary.main" : "#111827",
                  },
                }}
              />
              <Tab
                value="location"
                icon={<PlaceOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="Location"
                sx={{
                  color:
                    activeTab === "location" ? "primary.main" : "text.secondary",
                  "& .MuiTab-iconWrapper": {
                    color:
                      activeTab === "location" ? "primary.main" : "#111827",
                  },
                }}
              />
              <Tab
                value="ai-insight"
                icon={<PsychologyOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="AI Insight"
                sx={{
                  color:
                    activeTab === "ai-insight"
                      ? "primary.main"
                      : "text.secondary",
                  "& .MuiTab-iconWrapper": {
                    color:
                      activeTab === "ai-insight"
                        ? "primary.main"
                        : "#111827",
                  },
                }}
              />
            </Tabs>

            {isMobile && (
              <Box
                sx={{
                  px: { xs: 1.5, sm: 3 },
                  pb: 0.5,
                  pt: 0.5,
                  bgcolor: "#f8f9ff",
                }}
              >
                <Box
                  sx={{
                    height: 4,
                    borderRadius: 999,
                    bgcolor: "#e5e7eb",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${(tabProgressRatio || 0) * 100}%`,
                      transition: "width 180ms ease-out",
                      background:
                        "linear-gradient(90deg,#3b82f6,#22c55e,#f97316)",
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  Swipe / use arrows to move between Overview, Financials, Team,
                  Gallery, Documents, Contact, Location, and AI Insight.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Tab content (scrollable area) */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: "#f5f6fb",
              flexGrow: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "auto",
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
              <Box hidden={activeTab !== "overview"}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems="flex-start"
                >
                  <Box
                    sx={{
                      flex: 2,
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
                          <XAxis dataKey="name" />
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
                      flex: 1.3,
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
                        label={
                          company?.verified ? "Verified profile" : "Not yet verified"
                        }
                        color={company?.verified ? "success" : "default"}
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
              <Box hidden={activeTab !== "financials"}>
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
                    {/* Data Table */}
                    <Box sx={{ flex: 1.6 }}>
                      <TableContainer
                        component={Paper}
                        sx={{
                          borderRadius: 2,
                          boxShadow: "0 8px 20px rgba(15,23,42,.06)",
                        }}
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Fiscal year</TableCell>
                              <TableCell>Revenue</TableCell>
                              <TableCell>EBITDA</TableCell>
                              <TableCell>Net income</TableCell>
                              <TableCell>Currency</TableCell>
                              <TableCell>Created at</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {financialData.map((row, idx) => (
                              <TableRow
                                key={row.id ?? idx}
                                hover
                                selected={idx === selectedFinancialIndex}
                                onClick={() => setSelectedFinancialIndex(idx)}
                                sx={{ cursor: "pointer" }}
                              >
                                <TableCell>{row.fiscal_year ?? "—"}</TableCell>
                                <TableCell>
                                  {row.revenue != null ? row.revenue : "—"}
                                </TableCell>
                                <TableCell>
                                  {row.ebitda != null ? row.ebitda : "—"}
                                </TableCell>
                                <TableCell>
                                  {row.net_income != null ? row.net_income : "—"}
                                </TableCell>
                                <TableCell>{row.currency ?? "—"}</TableCell>
                                <TableCell>{row.created_at ?? "—"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
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
                        minWidth: { xs: "100%", md: 280 },
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
                                <Cell fill="#3b82f6" />
                                <Cell fill="#22c55e" />
                                <Cell fill="#f97316" />
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
              <Box hidden={activeTab !== "team"}>
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
                        <Grid item xs={12} sm={6} md={4} key={member.id ?? idx}>
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
                                  bgcolor: avatarUrl ? undefined : "#1d4ed8",
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
              <Box hidden={activeTab !== "gallery"}>
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
                                                                height: 220,
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
                                                        <FiberManualRecordIcon
                                                            sx={{
                                                                fontSize: 10,
                                                                color:
                                                                    idx ===
                                                                    galleryIndex
                                                                        ? "primary.main"
                                                                        : "#9ca3af",
                                                            }}
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
                            <Box hidden={activeTab !== "documents"}>
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
                                                <Table size="small">
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
                                                    severity="error"
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
                                                                    height: 500,
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
                            <Box hidden={activeTab !== "contact"}>
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
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={4}
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
                                                                            : "#1d4ed8",
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
                            <Box hidden={activeTab !== "location"}>
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
                            <Box hidden={activeTab !== "ai-insight"}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ mb: 0.5 }}
                                >
                                    AI Insight (experimental)
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1.5 }}
                                >
                                    This space is a prototype for AI-assisted
                                    insights about{" "}
                                    <strong>{company?.name}</strong>. Messages
                                    stay only in the browser – there is no
                                    backend or real AI call yet.
                                </Typography>
                                <Box className="ai-chat">
                                    <Box className="ai-chat-messages">
                                        {aiMessages.map((m) => (
                                            <Box
                                                key={m.id}
                                                className={`ai-chat-bubble ${
                                                    m.from === "user"
                                                        ? "ai-chat-bubble-user"
                                                        : "ai-chat-bubble-bot"
                                                }`}
                                            >
                                                <Typography variant="body2">
                                                    {m.text}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Box className="ai-chat-input-row">
                                        <TextField
                                            value={aiInput}
                                            onChange={(e) =>
                                                setAiInput(e.target.value)
                                            }
                                            onKeyDown={handleAiKeyDown}
                                            size="small"
                                            fullWidth
                                            multiline
                                            maxRows={3}
                                            placeholder="Ask anything about this company (UI only; no real AI yet)…"
                                        />
                                        <Tooltip title="Send (UI only)">
                                            <span>
                                                <IconButton
                                                    sx={{ ml: 1 }}
                                                    onClick={
                                                        handleSendAiMessage
                                                    }
                                                    disabled={!aiInput.trim()}
                                                >
                                                    <SendIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
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
