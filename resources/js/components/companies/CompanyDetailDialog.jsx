// resources/js/components/companies/CompanyDetailDialog.jsx
// ------------------------------------------------------------------
// Company detail dialog with tabs:
//  - Overview (summary + Recharts)
//  - Financials (MUI DataGrid)
//  - Team (MUI Table)
//  - Gallery (MUI ImageList)
//  - Documents (MUI DataGrid + iframe PDF preview)
//  - Contact
//  - Location (classic Google Maps Marker)
//  - AI Insight (UI-only chat)
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
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
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

// Financial table columns
const financialColumns = [
  {
    field: "fiscal_year",
    headerName: "Fiscal year",
    flex: 1,
    minWidth: 110,
  },
  {
    field: "revenue",
    headerName: "Revenue",
    flex: 1.2,
    minWidth: 130,
    valueFormatter: (params) =>
      params.value != null ? params.value : "—",
  },
  {
    field: "ebitda",
    headerName: "EBITDA",
    flex: 1.1,
    minWidth: 120,
    valueFormatter: (params) =>
      params.value != null ? params.value : "—",
  },
  {
    field: "net_income",
    headerName: "Net income",
    flex: 1.1,
    minWidth: 130,
    valueFormatter: (params) =>
      params.value != null ? params.value : "—",
  },
  {
    field: "currency",
    headerName: "Currency",
    width: 110,
  },
  {
    field: "created_at",
    headerName: "Created at",
    flex: 1,
    minWidth: 140,
  },
];

/* --------------------------- Dialog Transition --------------------------- */
const DialogTransition = React.forwardRef(function DialogTransition(
  props,
  ref
) {
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

        const mainTitle =
          company?.name || company?.CompanyName || "Company location";

        const mainMarker = new window.google.maps.Marker({
          map,
          position: center,
          title: mainTitle,
        });
        markers.push(mainMarker);

        nearby.forEach((n) => {
          const pos = {
            lat: Number(n.latitude),
            lng: Number(n.longitude),
          };

          const nearbyMarker = new window.google.maps.Marker({
            map,
            position: pos,
            title: n.company_name,
          });
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
                    const pos = {
                      lat: Number(n.latitude),
                      lng: Number(n.longitude),
                    };
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
  const [pdfError, setPdfError] = useState(""); // error message for file

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

    loadTabData("overview", company);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, company?.id]);

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

    // AI Insight is UI-only – no backend
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
      already =
        Array.isArray(documentsData) &&
        documentsData.length &&
        company?.id === c.id;
      url = `${base}/documents${qs}`;
    } else if (tab === "contact") {
      already = contactData.length && company?.id === c.id;
      url = `${base}/contact${qs}`;
    } else if (tab === "location") {
      already = locationData && company?.id === c.id;
      const baseLoc = `${API_BASE}/companies/${c.id}/location`;
      url = sid
        ? `${baseLoc}?session_id=${encodeURIComponent(sid)}`
        : baseLoc;
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
    if (company) {
      loadTabData(newValue, company);
    }
  };

  const activeTabIndex = TAB_KEYS.indexOf(activeTab);
  const tabProgressRatio =
    activeTabIndex <= 0
      ? 0
      : activeTabIndex >= TAB_KEYS.length - 1
      ? 1
      : activeTabIndex / (TAB_KEYS.length - 1);

  /* ------------------------ Overview chart summary ------------------------ */
  const summaryChartData = useMemo(
    () => [
      { name: "Financial years", value: financialData.length || 0 },
      { name: "Team members", value: teamData.length || 0 },
      { name: "Gallery images", value: galleryData.length || 0 },
      { name: "Documents", value: documentsData.length || 0 },
      {
        name: "Contacts",
        value: contactData.length || 0,
      },
      {
        name: "Nearby companies",
        value:
          locationData && Array.isArray(locationData?.nearby)
            ? locationData.nearby.length
            : 0,
      },
    ],
    [
      financialData,
      teamData,
      galleryData,
      documentsData,
      contactData,
      locationData,
    ]
  );

  /* ------------------------ AI Insight UI handlers ------------------------ */
  const handleSendAiMessage = () => {
    const trimmed = aiInput.trim();
    if (!trimmed) return;

    const nextId = aiMessages.length
      ? aiMessages[aiMessages.length - 1].id + 1
      : 1;

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

      return (
        title.includes(q) ||
        type.includes(q) ||
        year.includes(q)
      );
    });
  }, [documentsData, docSearch]);

  // Prefer file_path (from DB), fallback to other URL-like fields
  const getDocUrl = (d) => {
    if (!d) {
      console.log("[DOC] getDocUrl called with null/undefined row");
      return "";
    }

    const raw =
      d.file_path ||
      d.url ||
      d.document_url ||
      d.file_url ||
      d.path ||
      "";
    console.log("[DOC] Row object:", d);
    console.log("[DOC] Raw file path/url from row:", raw);

    if (!raw) return "";

    // Absolute URL
    if (/^https?:\/\//i.test(raw)) {
      console.log("[DOC] Using absolute URL:", raw);
      return raw;
    }

    // Normalize relative paths against your Laravel base
    const base = API_BASE.replace(/\/api\/?$/i, ""); // e.g. https://site.com
    const normalized = `${base}/${raw.replace(/^\/+/, "")}`;
    console.log("[DOC] Normalized URL:", normalized);
    return normalized;
  };

  // Click "Open" in row: set loading state and selectedDoc
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
        setDocLoadingId(id); // show spinner overlay until iframe loads
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

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        // We keep fullScreen on mobile, but otherwise use a constant viewport size.
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 5,
            overflow: "hidden",
            border: "1px solid rgba(148,163,184,0.55)",
            boxShadow: "0 18px 45px rgba(15,23,42,0.22)",
            backgroundColor: "#ffffff",
            width: isMobile ? "100vw" : "90vw",
            maxWidth: "none",
            height: isMobile ? "100vh" : "90vh",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
        TransitionComponent={DialogTransition}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0, // important for inner flex children to overflow correctly
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
              "&:hover": {
                bgcolor: "white",
              },
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>

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
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900, display: "flex", alignItems: "center" }}
              >
                {overviewData?.CompanyName || company?.name || "Loading..."}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {overviewData?.Sector || company?.sector || "—"} •{" "}
                {overviewData?.Country || company?.country || "—"}
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "row", sm: "row" }}
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              sx={{ mt: { xs: 1, sm: 0 } }}
            >
              <Tooltip title="Back to all companies list" arrow>
                <Button variant="outlined" size="small" onClick={onClose}>
                  All Companies
                </Button>
              </Tooltip>

              <Tooltip title="Request a warm introduction to this company" arrow>
                <Button variant="contained" size="small">
                  Request intro
                </Button>
              </Tooltip>

              <Tooltip title="Save this company to your watchlist" arrow>
                <Button variant="outlined" size="small">
                  Save
                </Button>
              </Tooltip>

              <Tooltip title="Share this company profile" arrow>
                <Button variant="outlined" size="small">
                  Share
                </Button>
              </Tooltip>

              <Tooltip
                title="This panel shows detailed information about the selected company, including overview, financials, team, gallery, documents, contacts, location and experimental AI insights."
                arrow
                placement="left"
              >
                <IconButton
                  size="small"
                  sx={{
                    ml: 0.5,
                    color: "text.secondary",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Tabs header + scrollable content wrapper */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0, // so the content area can shrink and scroll
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: { xs: 1.5, sm: 3 },
                borderBottom: "1px solid #eef0f6",
                bgcolor: "#f8f9ff",
                flexShrink: 0,
              }}
              TabIndicatorProps={{
                sx: {
                  height: 3,
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg,#3b82f6,#22c55e,#f97316)",
                },
              }}
            >
              <Tab label="Overview" value="overview" />
              <Tab label="Financials" value="financials" />
              <Tab label="Team" value="team" />
              <Tab label="Gallery" value="gallery" />
              <Tab label="Documents" value="documents" />
              <Tab label="Contact" value="contact" />
              <Tab label="Location" value="location" />
              <Tab label="AI Insight" value="ai-insight" />
            </Tabs>

            {/* Mobile swipe-progress indicator */}
            {isMobile && (
              <Box
                sx={{
                  px: { xs: 1.5, sm: 3 },
                  pb: 0.5,
                  pt: 0.5,
                  bgcolor: "#f8f9ff",
                  flexShrink: 0,
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

            {/* Scrollable tab content area */}
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: "#f5f6fb",
                flex: 1,
                minHeight: 0,
                overflowX: "auto",
                overflowY: "auto", // both scrollbars
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
                    {/* Summary + snapshot & chart */}
                    <Box
                      sx={{
                        flex: 2,
                        bgcolor: "#ffffff",
                        borderRadius: 3,
                        p: 2.2,
                        boxShadow: "0 10px 30px rgba(17,24,39,.06)",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
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

                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
                        Snapshot
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {overviewData?.Snapshot ||
                          "Snapshot visualizations will appear here in a future version."}
                      </Typography>

                      <Divider sx={{ my: 1.5 }} />

                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
                        Key metrics overview
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 1 }}
                      >
                        Live summary based on financials, team, gallery,
                        documents, contacts, and nearby companies.
                      </Typography>
                      <Box sx={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
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

                    {/* Trust & verification */}
                    <Box
                      sx={{
                        flex: 1.3,
                        bgcolor: "#ffffff",
                        borderRadius: 3,
                        p: 2.2,
                        boxShadow: "0 10px 30px rgba(17,24,39,.06)",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
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
                            company?.verified
                              ? "Verified profile"
                              : "Not yet verified"
                          }
                          color={company?.verified ? "success" : "default"}
                          size="small"
                        />
                        {company?.cti?.tier && (
                          <Chip
                            label={`CTI tier: ${company.cti.tier}`}
                            size="small"
                          />
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

              {/* FINANCIALS – MUI DataGrid */}
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
                    <Box
                      sx={{
                        height: 420,
                        width: "100%",
                        bgcolor: "#ffffff",
                        borderRadius: 2,
                        boxShadow: "0 8px 20px rgba(15,23,42,.06)",
                        p: 1,
                      }}
                    >
                      <DataGrid
                        rows={financialData.map((row, idx) => ({
                          id: row.id ?? idx,
                          ...row,
                        }))}
                        columns={financialColumns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        density="compact"
                        disableSelectionOnClick
                      />
                    </Box>
                  )}
                </Box>
              </Fade>

              {/* TEAM – MUI Table */}
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
                            <TableCell>Name</TableCell>
                            <TableCell>Role / Title</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Location</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {teamData.map((member, idx) => (
                            <TableRow key={member.id ?? idx}>
                              <TableCell>
                                {member.full_name || member.name || "—"}
                              </TableCell>
                              <TableCell>
                                {member.role_type ||
                                  member.job_title ||
                                  member.role ||
                                  "—"}
                              </TableCell>
                              <TableCell>{member.email || "—"}</TableCell>
                              <TableCell>{member.phone || "—"}</TableCell>
                              <TableCell>
                                {member.city || member.country || "—"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Fade>

              {/* GALLERY – MUI ImageList */}
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
                    <ImageList
                      cols={3}
                      gap={12}
                      sx={{
                        m: 0,
                        "& img": {
                          objectFit: "cover",
                        },
                      }}
                    >
                      {galleryData.map((g, idx) => {
                        const src =
                          g.image_url ||
                          g.url ||
                          g.path ||
                          g.thumbnail_url ||
                          "";
                        const title = g.caption || g.title || "Gallery image";
                        const isPrimary = g.is_primary ? "Primary" : "";

                        return (
                          <ImageListItem key={g.id ?? idx}>
                            {src ? (
                              <img
                                src={src}
                                alt={title}
                                loading="lazy"
                              />
                            ) : (
                              <Box
                                sx={{
                                  height: 140,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  bgcolor: "#f3f4f6",
                                }}
                              >
                                <Typography variant="body2">
                                  {title}
                                </Typography>
                              </Box>
                            )}
                            <ImageListItemBar
                              title={title}
                              subtitle={isPrimary}
                              position="below"
                            />
                          </ImageListItem>
                        );
                      })}
                    </ImageList>
                  )}
                </Box>
              </Fade>

              {/* DOCUMENTS – MUI DataGrid + iframe PDF preview */}
              <Fade
                in={!tabLoading["documents"] && activeTab === "documents"}
                timeout={200}
                unmountOnExit
              >
                <Box hidden={activeTab !== "documents"}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Documents
                  </Typography>
                  {documentsData.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No documents attached yet.
                    </Typography>
                  ) : (
                    <>
                      <Box
                        sx={{
                          bgcolor: "#ffffff",
                          borderRadius: 2,
                          boxShadow: "0 8px 20px rgba(15,23,42,.06)",
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
                            onChange={(e) => setDocSearch(e.target.value)}
                          />
                        </Box>

                        {/* Material Data Table with [Title, Type, Year, Action] */}
                        <Box sx={{ height: 360, width: "100%" }}>
                          <DataGrid
                            rows={filteredDocuments.map((d, idx) => ({
                              id: d.id ?? idx,
                              ...d,
                            }))}
                            columns={[
                              {
                                field: "title",
                                headerName: "Title",
                                flex: 2,
                                minWidth: 180,
                                valueGetter: (params) => {
                                  const row = params?.row || {};
                                  console.log("[DOC TITLE] Row object:", row);
                                  return (
                                    row.title ||
                                    row.name ||
                                    "Document"
                                  );
                                },
                              },
                              {
                                field: "document_type",
                                headerName: "Type",
                                flex: 1.2,
                                minWidth: 140,
                                valueGetter: (params) => {
                                  const row = params?.row || {};
                                  return (
                                    row.document_type ||
                                    row.type ||
                                    row.mime ||
                                    "—"
                                  );
                                },
                              },
                              {
                                field: "year",
                                headerName: "Year",
                                width: 110,
                                valueGetter: (params) => {
                                  const row = params?.row || {};
                                  if (row.year) return row.year;
                                  if (row.created_at) {
                                    const d = new Date(row.created_at);
                                    if (!isNaN(d.getTime())) {
                                      return d.getFullYear();
                                    }
                                  }
                                  return "—";
                                },
                              },
                              {
                                field: "action",
                                headerName: "Action",
                                width: 150,
                                sortable: false,
                                filterable: false,
                                renderCell: (params) => {
                                  const row = params?.row || {};
                                  const url = getDocUrl(row);
                                  const id =
                                    row.id ??
                                    row.file_path ??
                                    row.path ??
                                    row.url ??
                                    null;
                                  const isLoading =
                                    docLoadingId != null &&
                                    docLoadingId === id;

                                  return (
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleOpenDoc(row)}
                                      sx={{
                                        borderRadius: 999,
                                        px: 2,
                                        textTransform: "none",
                                        minWidth: 88,
                                      }}
                                      disabled={!url}
                                    >
                                      {isLoading ? (
                                        <CircularProgress
                                          size={16}
                                          color="inherit"
                                        />
                                      ) : (
                                        "Open"
                                      )}
                                    </Button>
                                  );
                                },
                              },
                            ]}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 25]}
                            density="compact"
                            disableSelectionOnClick
                          />
                        </Box>
                      </Box>

                      {/* Inline PDF / file viewer under the table */}
                      <Box
                        sx={{
                          mt: 2,
                          bgcolor: "#ffffff",
                          borderRadius: 2.5,
                          boxShadow: "0 10px 26px rgba(15,23,42,.10)",
                          p: 2,
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Document preview
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1.5 }}
                        >
                          Select <strong>Open</strong> in the table above to
                          preview a PDF document from the{" "}
                          <code>file_path</code> stored in the database.
                        </Typography>

                        {pdfError && (
                          <Alert severity="error" sx={{ mb: 1.5 }}>
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
                            const url = getDocUrl(selectedDoc);
                            if (!url) {
                              return (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  This document does not have a valid file path.
                                </Typography>
                              );
                            }

                            const title =
                              selectedDoc.title ||
                              selectedDoc.name ||
                              "Document";
                            const isPdf = url.toLowerCase().includes(".pdf");

                            // Non-PDF: show link
                            if (!isPdf) {
                              return (
                                <Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 0.5 }}
                                  >
                                    This file is not a PDF. You can open it in a
                                    new tab:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ wordBreak: "break-all" }}
                                  >
                                    <a
                                      href={url}
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
                                  sx={{ mb: 1, fontWeight: 600 }}
                                >
                                  {title}
                                </Typography>

                                {/* PDF iframe preview */}
                                <Box
                                  sx={{
                                    width: "100%",
                                    maxWidth: 800,
                                    height: 500,
                                    mx: "auto",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    boxShadow:
                                      "0 8px 18px rgba(15,23,42,0.15)",
                                    border: "1px solid #e5e7eb",
                                    position: "relative",
                                  }}
                                >
                                  {/* Simple loading cover while iframe loads */}
                                  {docLoadingId && (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: "rgba(255,255,255,0.7)",
                                        zIndex: 2,
                                      }}
                                    >
                                      <CircularProgress size={24} />
                                    </Box>
                                  )}
                                  <iframe
                                    src={url}
                                    title={title}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      border: "none",
                                    }}
                                    onLoad={() => setDocLoadingId(null)}
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    mt: 1.5,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Button
                                    size="small"
                                    component="a"
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Open in new tab
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
              <Fade
                in={!tabLoading["contact"] && activeTab === "contact"}
                timeout={200}
                unmountOnExit
              >
                <Box hidden={activeTab !== "contact"}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Contact information
                  </Typography>
                  {contactData.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No contact info available yet.
                    </Typography>
                  ) : (
                    <Stack spacing={1.2}>
                      {contactData.map((c, idx) => (
                        <Box
                          key={c.id ?? idx}
                          sx={{
                            bgcolor: "#ffffff",
                            borderRadius: 2,
                            p: 1.5,
                            boxShadow: "0 4px 10px rgba(15,23,42,.04)",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {c.label || c.type || "Contact"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {c.value || c.detail || "—"}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              </Fade>

              {/* LOCATION */}
              <Fade
                in={!tabLoading["location"] && activeTab === "location"}
                timeout={200}
                unmountOnExit
              >
                <Box hidden={activeTab !== "location"}>
                  {locationData ? (
                    <LocationMap data={locationData} company={company} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No location data yet.
                    </Typography>
                  )}
                </Box>
              </Fade>

              {/* AI INSIGHT – UI-only chat */}
              <Fade
                in={activeTab === "ai-insight"}
                timeout={200}
                unmountOnExit
              >
                <Box hidden={activeTab !== "ai-insight"}>
                  <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                    AI Insight (experimental)
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    This space is a prototype for AI-assisted insights about{" "}
                    <strong>{company?.name}</strong>. Messages stay only in the
                    browser – there is no backend or real AI call yet.
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
                          <Typography variant="body2">{m.text}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Box className="ai-chat-input-row">
                      <TextField
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
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
                            onClick={handleSendAiMessage}
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
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
