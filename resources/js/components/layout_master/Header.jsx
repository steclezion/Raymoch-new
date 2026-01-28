// resources/js/components/layout_master/Header.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useInRouterContext } from "react-router-dom";

// MUI
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Slide from "@mui/material/Slide";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Portal from "@mui/material/Portal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

/* =========================================================
   Router-safe primitives (prevents basename null crash)
========================================================= */
function SafeLink({ to, children, ...rest }) {
  const hasRouter = useInRouterContext?.() ?? false;
  if (hasRouter) return <Link to={to} {...rest}>{children}</Link>;
  return <a href={typeof to === "string" ? to : "/"} {...rest}>{children}</a>;
}

function RouterSafeButton({ to, children, sx, ...rest }) {
  const hasRouter = useInRouterContext?.() ?? false;
  if (hasRouter) {
    return (
      <Button component={Link} to={to} sx={sx} {...rest}>
        {children}
      </Button>
    );
  }
  return (
    <Button component="a" href={to} sx={sx} {...rest}>
      {children}
    </Button>
  );
}

/* =========================================================
   Styles
========================================================= */
const mobileMenuStyles = {
  drawerPaper: {
    width: { xs: 320, sm: 360 },
    maxWidth: "92vw",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    alignItems: "flex-start",
    p: 2.25,
    textAlign: "left",
  },
  link: {
    fontWeight: 800,
    textDecoration: "none",
    color: "#000",
    "&:hover": { textDecoration: "underline" },
  },
  actionStack: {
    display: "flex",
    flexDirection: "column",
    gap: 1.25,
    width: "100%",
    mt: 0.5,
  },
  actionBtn: {
    justifyContent: "flex-start",
    borderRadius: 999,
    py: 1.1,
    fontWeight: 800,
    textTransform: "none",
  },
};

// NOTE: We will render the dropdown inside a Portal as FIXED, so it always sits above EVERYTHING.
const desktopDropdownStyles = {
  panel: {
    position: "fixed",
    zIndex: 3000, // ✅ above AppBar/Drawer/Modal
    width: 760,
    maxWidth: "92vw",
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: "0 18px 45px rgba(0,0,0,.18)",
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    transformOrigin: "top left",
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 1.5,
    py: 1.25,
    cursor: "pointer",
    userSelect: "none",
    "&:hover": { backgroundColor: "action.hover" },
  },
  grid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
    gap: 1.5,
    px: 1.5,
    pb: 1.5,
    justifyItems: "start",
    alignItems: "start",
  },
  item: {
    width: "100%",
    textDecoration: "none",
    color: "text.primary",
  },
  card: {
    p: 1.5,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 8px 20px rgba(0,0,0,.06)",
    },
    transition: "transform .12s ease, box-shadow .12s ease",
  },
};

const secondaryNavBtnSx = {
  fontWeight: 800,
  textTransform: "none",
  color: "#000",
  "&:hover": {
    color: "#000",
    bgcolor: "action.hover",
  },
};

/* =========================================================
   Animated hamburger icon
========================================================= */
function HamburgerIcon({ open }) {
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: 24,
        height: 24,
        position: "relative",
        "& span": {
          position: "absolute",
          left: 0,
          width: "100%",
          height: 3,
          borderRadius: 2,
          backgroundColor: "text.primary",
          transition: "transform .18s ease, top .18s ease, opacity .18s ease",
        },
        "& span:nth-of-type(1)": {
          top: open ? "10px" : "5px",
          transform: open ? "rotate(45deg)" : "none",
        },
        "& span:nth-of-type(2)": { top: "10px", opacity: open ? 0 : 1 },
        "& span:nth-of-type(3)": {
          top: open ? "10px" : "15px",
          transform: open ? "rotate(-45deg)" : "none",
        },
      }}
    >
      <span />
      <span />
      <span />
    </Box>
  );
}

export default function Header({ routes = {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Desktop explore dropdown state
  const [openExplore, setOpenExplore] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // For Portal dropdown positioning
  const btnRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 80, left: 16, width: 760 });

  const safeRoutes = useMemo(() => ({
    home: routes.home ?? "/",
    explore: routes.explore ?? "/explore",
    services: routes.services ?? "/services",
    insights: routes.insights ?? "/insights",
    about: routes.about ?? "/about",
    matching: routes.matching ?? "/matching",
    verification: routes.verification ?? "/verification",
    incentives: routes.incentives ?? "/incentives",
    whitespace: routes.whitespace ?? "/whitespace",
    login: routes.login ?? "/login",
    signup: routes.signup ?? "/signup",
    trial: (typeof routes.trial === "string" ? routes.trial : routes.trial?.page) ?? "/request-trial",
  }), [routes]);

  const computeDropdownPosition = () => {
    const el = btnRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const gap = 10;

    // dropdown below button, aligned left with button
    const top = rect.bottom + gap;
    const left = rect.left;

    // responsive width
    const maxWidth = Math.min(760, Math.floor(window.innerWidth * 0.92));
    const width = maxWidth;

    // keep within viewport (shift left if overflow)
    const overflowRight = left + width - window.innerWidth;
    const safeLeft = overflowRight > 0 ? Math.max(8, left - overflowRight - 8) : Math.max(8, left);

    setDropdownPos({ top, left: safeLeft, width });
  };

  // Close on ESC
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setOpenExplore(false);
        setShowGrid(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  // If switching to mobile, close desktop dropdown
  useEffect(() => {
    if (isMobile) {
      setOpenExplore(false);
      setShowGrid(false);
    }
  }, [isMobile]);

  // Recompute dropdown position when opened + on resize/scroll
  useEffect(() => {
    if (!openExplore) return;

    computeDropdownPosition();
    const onResize = () => computeDropdownPosition();
    const onScroll = () => computeDropdownPosition();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [openExplore]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Top bar */}
      <Toolbar sx={{ minHeight: 64 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            {/* Brand + Explore */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, position: "relative" }}>
              <SafeLink to={safeRoutes.home} style={{ textDecoration: "none" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="svg"
                    width="28"
                    height="28"
                    viewBox="0 0 200 200"
                    aria-hidden="true"
                    sx={{ color: "primary.main" }}
                  >
                    <polygon
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      points="100,18 172,59 172,141 100,182 28,141 28,59"
                    />
                    <text
                      x="100"
                      y="118"
                      textAnchor="middle"
                      style={{ fill: "currentColor", font: "700 105px Georgia",color: "#0a2a6b" }}
                    >
                      R
                    </text>
                  </Box>
                  <Typography sx={{ fontWeight: 900, fontSize: "1.25rem", color: "#0a2a6b" }}>
                    Raymoch
                  </Typography>
                </Box>
              </SafeLink>

              {/* Explore (desktop) */}
              {!isMobile && (
                <ClickAwayListener
                  onClickAway={() => {
                    setOpenExplore(false);
                    setShowGrid(false);
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Button
                      ref={btnRef}
                      variant="text"
                      onClick={() => {
                        setOpenExplore((v) => !v);
                        setShowGrid(false);
                        // compute now for first open
                        setTimeout(() => computeDropdownPosition(), 0);
                      }}
                      endIcon={openExplore ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
                      sx={{
                        fontWeight: 900,
                        textTransform: "none",
                        borderRadius: 2,
                        px: 1,
                        color: "text.primary",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      Explore
                    </Button>

                    {/* ✅ PORTAL dropdown: ALWAYS above any element */}
                    <Portal>
                      <Slide direction="down" in={openExplore} mountOnEnter unmountOnExit>
                        <Paper
                          sx={{
                            ...desktopDropdownStyles.panel,
                            top: dropdownPos.top,
                            left: dropdownPos.left,
                            width: dropdownPos.width,
                          }}
                          role="menu"
                          aria-label="Explore"
                        >
                          <Box sx={desktopDropdownStyles.head} onClick={() => setShowGrid((v) => !v)}>
                            <Typography sx={{ fontWeight: 900, color: "primary.dark" }}>
                              Explore services
                            </Typography>
                            <Typography sx={{ fontWeight: 900 }}>
                              {showGrid ? "▲" : "▼"}
                            </Typography>
                          </Box>

                          <Collapse in={showGrid} timeout={180}>
                            <Box sx={desktopDropdownStyles.grid}>
                              <SafeLink to={safeRoutes.matching} style={desktopDropdownStyles.item}>
                                <Paper sx={desktopDropdownStyles.card} variant="outlined">
                                  <Typography sx={{ fontWeight: 900, mb: 0.5 }}>Trusted Matching</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Get paired with credible businesses using CTI &amp; verification.
                                  </Typography>
                                </Paper>
                              </SafeLink>

                              <SafeLink to={safeRoutes.verification} style={desktopDropdownStyles.item}>
                                <Paper sx={desktopDropdownStyles.card} variant="outlined">
                                  <Typography sx={{ fontWeight: 900, mb: 0.5 }}>Verification</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    CTI badges, document checks, and data provenance.
                                  </Typography>
                                </Paper>
                              </SafeLink>

                              <SafeLink to={safeRoutes.insights} style={desktopDropdownStyles.item}>
                                <Paper sx={desktopDropdownStyles.card} variant="outlined">
                                  <Typography sx={{ fontWeight: 900, mb: 0.5 }}>Research &amp; Insights</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Sector reports, trends, and regional briefs.
                                  </Typography>
                                </Paper>
                              </SafeLink>

                              <SafeLink to={safeRoutes.services} style={desktopDropdownStyles.item}>
                                <Paper sx={desktopDropdownStyles.card} variant="outlined">
                                  <Typography sx={{ fontWeight: 900, mb: 0.5 }}>Programs &amp; Services</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Advisory, partner programs, and support options.
                                  </Typography>
                                </Paper>
                              </SafeLink>

                              <SafeLink to={safeRoutes.incentives} style={desktopDropdownStyles.item}>
                                <Paper sx={desktopDropdownStyles.card} variant="outlined">
                                  <Typography sx={{ fontWeight: 900, mb: 0.5 }}>Policy &amp; Incentives</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Tax credits, grants, and regulatory signals.
                                  </Typography>
                                </Paper>
                              </SafeLink>

                              <SafeLink to={safeRoutes.whitespace} style={desktopDropdownStyles.item}>
                                <Paper sx={desktopDropdownStyles.card} variant="outlined">
                                  <Typography sx={{ fontWeight: 900, mb: 0.5 }}>Whitespace Map</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Where demand outpaces supply across sectors.
                                  </Typography>
                                </Paper>
                              </SafeLink>
                            </Box>
                          </Collapse>
                        </Paper>
                      </Slide>
                    </Portal>
                  </Box>
                </ClickAwayListener>
              )}
            </Box>

            {/* Right side */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              {!isMobile ? (
                <>
                  <Box component="form" action={safeRoutes.explore} sx={{ width: { md: 260, lg: 320 } }}>
                    <TextField
                      size="small"
                      name="q"
                      placeholder="Search companies, sectors, regions…"
                      fullWidth
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 999 } }}
                    />
                  </Box>

                  <Button
                    component="a"
                    href={safeRoutes.trial}
                    target="_blank"
                    variant="contained"
                    sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none", bgcolor: "#f59e0b" }}
                  >
                    Request a free trial
                  </Button>

                  <Button
                    component="a"
                    href={safeRoutes.login}
                    target="_blank"
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
                  >
                    Login
                  </Button>

                  <Button
                    component="a"
                    href={safeRoutes.signup}
                    target="_blank"
                    variant="contained"
                    sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none", bgcolor: "#16a34a" }}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <IconButton aria-label="Open menu" onClick={() => setMobileOpen(true)} sx={{ borderRadius: 2 }}>
                  <HamburgerIcon open={mobileOpen} />
                </IconButton>
              )}
            </Box>
          </Box>
        </Container>
      </Toolbar>

      {/* Secondary nav (desktop only) - black labels */}
      {!isMobile && (
        <Box sx={{ bgcolor: "grey.100", borderTop: "1px solid", borderColor: "divider" }}>
          <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: "flex", gap: 2, py: 1, flexWrap: "wrap", alignItems: "center" }}>
              <RouterSafeButton to={safeRoutes.explore} sx={secondaryNavBtnSx}>Businesses</RouterSafeButton>
              <RouterSafeButton to={safeRoutes.services} sx={secondaryNavBtnSx}>Services</RouterSafeButton>
              <RouterSafeButton to={safeRoutes.insights} sx={secondaryNavBtnSx}>Research &amp; Insights</RouterSafeButton>
              <RouterSafeButton to={safeRoutes.about} sx={secondaryNavBtnSx}>Who We Are</RouterSafeButton>
            </Box>
          </Container>
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: mobileMenuStyles.drawerPaper }}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.25 }}>
          <Typography sx={{ fontWeight: 900 }}>Menu</Typography>
          <IconButton aria-label="Close menu" onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={mobileMenuStyles.content} className="raymochMobileMenu">
          <SafeLink to={safeRoutes.explore} style={mobileMenuStyles.link} onClick={() => setMobileOpen(false)}>
            Businesses
          </SafeLink>
          <SafeLink to={safeRoutes.services} style={mobileMenuStyles.link} onClick={() => setMobileOpen(false)}>
            Services
          </SafeLink>
          <SafeLink to={safeRoutes.insights} style={mobileMenuStyles.link} onClick={() => setMobileOpen(false)}>
            Research &amp; Insights
          </SafeLink>
          <SafeLink to={safeRoutes.about} style={mobileMenuStyles.link} onClick={() => setMobileOpen(false)}>
            Who We Are
          </SafeLink>

          <Divider flexItem sx={{ width: "100%" }} />

          <Box sx={mobileMenuStyles.actionStack}>
            <Button
              component="a"
              href={safeRoutes.login}
              variant="contained"
              color="primary"
              sx={mobileMenuStyles.actionBtn}
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Button>

            <Button
              component="a"
              href={safeRoutes.signup}
              variant="contained"
              sx={{ ...mobileMenuStyles.actionBtn, bgcolor: "#16a34a" }}
              onClick={() => setMobileOpen(false)}
            >
              Sign up
            </Button>

            <Button
              component="a"
              href={safeRoutes.trial}
              variant="contained"
              sx={{ ...mobileMenuStyles.actionBtn, bgcolor: "#f59e0b" }}
              onClick={() => setMobileOpen(false)}
            >
              Request a free trial
            </Button>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
