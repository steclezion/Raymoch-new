// resources/js/components/Market_Insight.jsx
import React, { useMemo, useState } from "react";

// Your master layout parts (same as Entire.jsx)
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";

// ✅ Material UI
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Divider,
} from "@mui/material";

/**
 * Market_Insight.jsx
 * - MUI-only UI (sx styling)
 * - Matches screenshot layout: Title, pulse pill, search pill, tag pills, 6 cards grid
 * - Header/Footer same as Entire.jsx (imported)
 */
const Market_Insight = () => {
  // mock pulse
  const pulse = useMemo(
    () => ({
      badge: "Latest",
      headline: "SME credit up 8.4% YoY in Kenya",
      sub: "As of Sep 15, 2025 — Raymoch blend v0.1",
    }),
    []
  );

  const [query, setQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Nav tags + cards (same labels as screenshot)
  const tiles = useMemo(
    () => [
      {
        key: "countries",
        title: "Countries",
        desc: "Macro, FDI, SME climate, policy notes.",
      },
      { key: "sectors", title: "Sectors", desc: "Trends, unit economics, risk flags." },
      { key: "themes", title: "Themes", desc: "Cross-cutting plays: diaspora capital, logistics…" },
      { key: "reports", title: "Reports", desc: "Investor notes & downloadable snapshots." },
      { key: "news", title: "News & Deals", desc: "Raises, exits, and policy moves that matter." },
      { key: "data", title: "Data Explorer", desc: "Time series & comparables." },
    ],
    []
  );

  const onSearch = (e) => {
    e.preventDefault();
    // keep behavior simple — you can wire routing later
    // eslint-disable-next-line no-console
    console.log("search:", { query, verifiedOnly });
  };

  const brand = {
    blue: "var(--brand-blue, #0328aeed)",
    blue700: "var(--brand-blue-700, #213bb1)",
    ink: "var(--ink, #101114)",
    muted: "var(--muted, #3c4b69)",
    border: "var(--border, #e8e8ee)",
    card: "var(--card, #ffffff)",
    shadow: "var(--shadow, 0 6px 22px rgba(10,42,107,.08))",
    radius: "var(--radius, 14px)",
    pill: "var(--pill, 999px)",
    accent: "var(--accent-gold, #7a7797a8)",
    bg: "var(--bg, #fafafa)",
  };

  return (
    <>
      {/* Page background like screenshot */}
      <Box
        sx={{
          minHeight: "100dvh",
          background: brand.bg,
          color: brand.ink,
        }}
      >
        <Header />

        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              letterSpacing: ".2px",
              color: brand.blue700,
              fontSize: { xs: 42, md: 56 },
              lineHeight: 1.05,
            }}
          >
            Market Insights
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: brand.muted,
              fontSize: { xs: 15, md: 16 },
              maxWidth: 900,
            }}
          >
            Country snapshots, sector briefs, and real-world signals — minus the noise.
          </Typography>

          {/* Pulse pill */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              border: `1px solid ${brand.border}`,
              boxShadow: brand.shadow,
              borderRadius: brand.pill,
              px: { xs: 2, md: 2.5 },
              py: 1.6,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              overflow: "hidden",
              background: brand.card,
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: brand.accent,
                boxShadow: `0 0 0 0 rgba(122,119,151,.35)`,
                animation: "rmPulse 2s infinite",
                "@keyframes rmPulse": {
                  "0%": { boxShadow: "0 0 0 0 rgba(122,119,151,.35)" },
                  "70%": { boxShadow: "0 0 0 12px rgba(122,119,151,0)" },
                  "100%": { boxShadow: "0 0 0 0 rgba(122,119,151,0)" },
                },
              }}
            />

            <Chip
              label={pulse.badge}
              size="small"
              sx={{
                fontWeight: 800,
                bgcolor: brand.accent,
                color: "#111",
                borderRadius: brand.pill,
              }}
            />

            <Typography sx={{ fontWeight: 900, color: "#0f172a", whiteSpace: "nowrap" }}>
              {pulse.headline}
            </Typography>

            <Typography
              sx={{
                color: brand.muted,
                fontSize: 13,
                ml: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1,
              }}
            >
              {pulse.sub}
            </Typography>
          </Paper>

          {/* Search pill */}
          <Paper
            component="form"
            onSubmit={onSearch}
            elevation={0}
            sx={{
              mt: 3,
              border: `1px solid ${brand.border}`,
              boxShadow: brand.shadow,
              borderRadius: brand.pill,
              px: { xs: 1.2, md: 1.6 },
              py: 1.1,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              background: brand.card,
            }}
          >
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search insights, reports, countries, or sectors…"
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
              sx={{
                px: 1,
                "& input": { fontSize: 15 },
              }}
            />

            <FormControlLabel
              sx={{
                m: 0,
                mr: { xs: 0, md: 0.5 },
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
              control={
                <Checkbox
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  sx={{
                    p: 0.5,
                    mr: 0.8,
                    color: "#9aa3b2",
                    "&.Mui-checked": { color: brand.blue700 },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: 14, color: "#0f172a" }}>
                  Raymoch-verified only
                </Typography>
              }
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: brand.pill,
                textTransform: "none",
                fontWeight: 900,
                px: 2.2,
                py: 1.1,
                bgcolor: brand.blue700,
                boxShadow: "none",
                "&:hover": { bgcolor: brand.blue700, opacity: 0.92, boxShadow: "none" },
              }}
            >
              Search
            </Button>
          </Paper>

          {/* Tag pills row */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {tiles.map((t) => (
              <Chip
                key={t.key}
                label={t.title}
                clickable
                onClick={() => console.log("go:", t.key)}
                sx={{
                  borderRadius: brand.pill,
                  border: `1px solid ${brand.border}`,
                  bgcolor: "#fff",
                  fontWeight: 700,
                  color: "#111827",
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              />
            ))}
          </Stack>

          {/* Cards grid */}
          <Grid container spacing={2.5} sx={{ mt: 2.5 }}>
            {tiles.map((t) => (
              <Grid item xs={12} sm={6} md={4} key={t.key}>
                <Card
                  elevation={0}
                  sx={{
                    border: `1px solid ${brand.border}`,
                    borderRadius: `calc(${brand.radius} + 6px)`,
                    boxShadow: brand.shadow,
                    background: "#fff",
                    height: "100%",
                  }}
                >
                  <CardActionArea
                    onClick={() => console.log("open:", t.key)}
                    sx={{
                      height: "100%",
                      borderRadius: `calc(${brand.radius} + 6px)`,
                      alignItems: "stretch",
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          color: brand.blue700,
                          fontSize: 18,
                          mb: 0.6,
                        }}
                      >
                        {t.title}
                      </Typography>
                      <Typography sx={{ color: brand.muted, fontSize: 14.5, lineHeight: 1.55 }}>
                        {t.desc}
                      </Typography>

                      <Divider sx={{ mt: 2, opacity: 0.5 }} />

                      <Typography
                        sx={{
                          mt: 1.2,
                          fontSize: 12.5,
                          color: "#6b7280",
                          fontWeight: 700,
                        }}
                      >
                        Click to open →
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Footer />
      </Box>
    </>
  );
};

export default Market_Insight;
