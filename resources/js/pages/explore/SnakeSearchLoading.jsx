import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Globe2,
  Flag,
  Map,
  MapPin,
  Briefcase,
  Layers3,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { motion, animate, AnimatePresence } from "framer-motion";

const INTRO_DURATION = 2600;
const STEP_DURATION = 3.25;
const TOP_LEAD_DELAY = 0;
const SNAKE_FOLLOW_DELAY = 320;
const STEP_PAUSE = 2000;
const RESULT_DELAY = 1000;

const STEPS = [
  {
    id: "regions",
    title: "Checking Regions",
    description:
      "We are scanning all matching regional records connected to this case.",
    badge: "Regions checked",
    icon: Globe2,
  },
  {
    id: "country",
    title: "Checking Country",
    description:
      "We are checking whether this case matches a country-level result.",
    badge: "Country checked",
    icon: Flag,
  },
  {
    id: "state",
    title: "Checking State",
    description:
      "We are validating the state or province related to this case.",
    badge: "State checked",
    icon: Map,
  },
  {
    id: "city",
    title: "Checking City",
    description:
      "We are narrowing this case to the city-level location.",
    badge: "City checked",
    icon: MapPin,
  },
  {
    id: "sector",
    title: "Checking Sector",
    description:
      "We are checking the business sector attached to this case.",
    badge: "Sector checked",
    icon: Briefcase,
  },
  {
    id: "industries",
    title: "Checking Industries",
    description:
      "We are matching this case against industry classifications.",
    badge: "Industries checked",
    icon: Layers3,
  },
  {
    id: "verification",
    title: "Checking Verification",
    description:
      "We are confirming the verification status for this case.",
    badge: "Verification checked",
    icon: ShieldCheck,
  },
];

const companyName = "Raymoch Most Trust CTI Engine";

const NODE_ROTATIONS = [
  {
    label: "Keyword...",
    bg: "linear-gradient(135deg, rgba(37,99,235,0.30), rgba(59,130,246,0.10))",
    image:
      "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80')",
  },
  {
    label: "Regions...",
    bg: "linear-gradient(135deg, rgba(14,165,233,0.30), rgba(59,130,246,0.10))",
    image:
      "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&w=900&q=80')",
  },
  {
    label: "Location...",
    bg: "linear-gradient(135deg, rgba(16,185,129,0.30), rgba(59,130,246,0.10))",
    image:
      "url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80')",
  },
  {
    label: "Country...",
    bg: "linear-gradient(135deg, rgba(249,115,22,0.30), rgba(59,130,246,0.10))",
    image:
      "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80')",
  },
  {
    label: "State...",
    bg: "linear-gradient(135deg, rgba(168,85,247,0.30), rgba(59,130,246,0.10))",
    image:
      "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80')",
  },
  {
    label: "City...",
    bg: "linear-gradient(135deg, rgba(236,72,153,0.30), rgba(59,130,246,0.10))",
    image:
      "url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80')",
  },
  {
    label: "Sector...",
    bg: "linear-gradient(135deg, rgba(245,158,11,0.30), rgba(59,130,246,0.10))",
    image:
      "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80')",
  },
  {
    label: "Industry...",
    bg: "linear-gradient(135deg, rgba(34,197,94,0.30), rgba(59,130,246,0.10))",
    image:
      "url('https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=900&q=80')",
  },
  {
    label: "Verification Status...",
    bg: "linear-gradient(135deg, rgba(99,102,241,0.30), rgba(59,130,246,0.10))",
    image:
      "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80')",
  },
];

const CARD_POSITIONS = [
  "left-[7%] top-[12%]",
  "left-[26%] top-[8%]",
  "left-[42%] top-[54%]",
  "left-[57%] top-[54%]",
  "left-[66%] top-[9%]",
  "left-[79%] top-[9%]",
  "left-[79%] top-[55%]",
];

const STEP_TOTAL_MS =
  SNAKE_FOLLOW_DELAY + (STEP_DURATION + 0.2) * 1000 + STEP_PAUSE;

const TOTAL_OPERATION_MS =
  INTRO_DURATION + STEPS.length * STEP_TOTAL_MS + RESULT_DELAY;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function cubicBezier(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  return {
    x:
      mt * mt * mt * p0.x +
      3 * mt * mt * t * p1.x +
      3 * mt * t * t * p2.x +
      t * t * t * p3.x,
    y:
      mt * mt * mt * p0.y +
      3 * mt * mt * t * p1.y +
      3 * mt * t * t * p2.y +
      t * t * t * p3.y,
  };
}

function buildSnakePath() {
  return [
    { type: "line", from: { x: 90, y: 450 }, to: { x: 220, y: 450 } },
    {
      type: "curve",
      from: { x: 220, y: 450 },
      cp1: { x: 300, y: 450 },
      cp2: { x: 300, y: 285 },
      to: { x: 420, y: 285 },
    },
    { type: "line", from: { x: 420, y: 285 }, to: { x: 610, y: 285 } },
    {
      type: "curve",
      from: { x: 610, y: 285 },
      cp1: { x: 720, y: 285 },
      cp2: { x: 720, y: 455 },
      to: { x: 860, y: 455 },
    },
    { type: "line", from: { x: 860, y: 455 }, to: { x: 1040, y: 455 } },
    {
      type: "curve",
      from: { x: 1040, y: 455 },
      cp1: { x: 1160, y: 455 },
      cp2: { x: 1160, y: 270 },
      to: { x: 1320, y: 270 },
    },
    { type: "line", from: { x: 1320, y: 270 }, to: { x: 1525, y: 270 } },
  ];
}

function snakePathD(segments) {
  return segments
    .map((segment, index) => {
      if (segment.type === "line") {
        return `${
          index === 0 ? `M ${segment.from.x} ${segment.from.y}` : ""
        } L ${segment.to.x} ${segment.to.y}`;
      }

      return `${
        index === 0 ? `M ${segment.from.x} ${segment.from.y}` : ""
      } C ${segment.cp1.x} ${segment.cp1.y}, ${segment.cp2.x} ${segment.cp2.y}, ${segment.to.x} ${segment.to.y}`;
    })
    .join(" ");
}

function pointAtProgress(segments, progress) {
  const p = clamp(progress, 0, 1);

  const lengths = segments.map((segment) => {
    if (segment.type === "line") {
      return Math.hypot(
        segment.to.x - segment.from.x,
        segment.to.y - segment.from.y
      );
    }

    let length = 0;
    let prev = segment.from;

    for (let i = 1; i <= 36; i += 1) {
      const t = i / 36;
      const next = cubicBezier(
        segment.from,
        segment.cp1,
        segment.cp2,
        segment.to,
        t
      );
      length += Math.hypot(next.x - prev.x, next.y - prev.y);
      prev = next;
    }

    return length;
  });

  const total = lengths.reduce((a, b) => a + b, 0);
  let target = total * p;

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    const len = lengths[i];

    if (target <= len || i === segments.length - 1) {
      const t = len === 0 ? 0 : target / len;

      if (segment.type === "line") {
        return {
          x: lerp(segment.from.x, segment.to.x, t),
          y: lerp(segment.from.y, segment.to.y, t),
        };
      }

      return cubicBezier(segment.from, segment.cp1, segment.cp2, segment.to, t);
    }

    target -= len;
  }

  return segments[segments.length - 1].to;
}

function topBarProgress(activeStep, intra) {
  return ((activeStep + intra) / STEPS.length) * 100;
}

function nodeProgress(index, activeStep, snakeIntra) {
  if (index < activeStep) return 1;
  if (index > activeStep) return 0;
  return snakeIntra;
}

function StageArt({ stage }) {
  const arts = {
    regions: (
      <svg viewBox="0 0 1600 620" className="h-full w-full">
        <g fill="none" stroke="rgba(100,116,139,0.20)" strokeWidth="1.3">
          <path d="M80 120 C 240 60, 320 70, 410 130 S 650 220, 840 160 S 1130 60, 1320 120 S 1460 210, 1540 170" />
          <path d="M65 300 C 210 240, 350 245, 500 310 S 820 400, 1040 330 S 1320 250, 1540 310" />
          <path d="M140 475 C 330 430, 560 430, 780 480 S 1180 530, 1510 470" />
          <path d="M260 70 L 300 560" />
          <path d="M570 55 L 620 560" />
          <path d="M990 70 L 1020 560" />
          <path d="M1310 85 L 1360 535" />
        </g>
        <g fill="rgba(59,130,246,0.10)">
          <circle cx="420" cy="285" r="92" />
          <circle cx="610" cy="285" r="66" />
          <circle cx="860" cy="455" r="78" />
          <circle cx="1040" cy="455" r="58" />
        </g>
      </svg>
    ),
    country: (
      <svg viewBox="0 0 1600 620" className="h-full w-full">
        <g fill="rgba(148,163,184,0.13)" stroke="rgba(148,163,184,0.18)" strokeWidth="1">
          <path d="M250 150 L420 95 L555 170 L510 320 L340 345 L210 255 Z" />
          <path d="M850 170 L1040 120 L1160 215 L1120 355 L925 390 L790 270 Z" />
          <path d="M1210 355 L1370 325 L1475 395 L1440 500 L1270 520 L1175 430 Z" />
        </g>
        <g fill="none" stroke="rgba(59,130,246,0.16)" strokeWidth="2">
          <path d="M250 150 L420 95 L555 170 L510 320 L340 345 L210 255 Z" />
          <path d="M850 170 L1040 120 L1160 215 L1120 355 L925 390 L790 270 Z" />
        </g>
      </svg>
    ),
    state: (
      <svg viewBox="0 0 1600 620" className="h-full w-full">
        <g fill="none" stroke="rgba(100,116,139,0.22)" strokeWidth="1">
          {Array.from({ length: 10 }).map((_, i) => (
            <path key={i} d={`M ${220 + i * 90} 110 L ${240 + i * 85} 520`} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <path
              key={`h-${i}`}
              d={`M 180 ${140 + i * 70} C 420 ${120 + i * 65}, 860 ${160 + i * 60}, 1450 ${140 + i * 70}`}
            />
          ))}
        </g>
        <g fill="rgba(59,130,246,0.08)">
          <rect x="360" y="180" rx="26" ry="26" width="240" height="160" />
          <rect x="905" y="245" rx="26" ry="26" width="220" height="150" />
        </g>
      </svg>
    ),
    city: (
      <svg viewBox="0 0 1600 620" className="h-full w-full">
        <g fill="rgba(148,163,184,0.12)">
          <circle cx="520" cy="300" r="150" />
          <circle cx="520" cy="300" r="88" />
          <circle cx="520" cy="300" r="18" />
        </g>
        <g fill="none" stroke="rgba(59,130,246,0.18)" strokeWidth="2">
          <circle cx="520" cy="300" r="150" />
          <circle cx="520" cy="300" r="88" />
          <path d="M520 140 L520 460" />
          <path d="M360 300 L680 300" />
        </g>
        <g fill="rgba(100,116,139,0.14)">
          <rect x="920" y="150" width="58" height="300" rx="10" />
          <rect x="990" y="110" width="76" height="340" rx="10" />
          <rect x="1080" y="170" width="64" height="280" rx="10" />
          <rect x="1160" y="200" width="54" height="250" rx="10" />
        </g>
      </svg>
    ),
    sector: (
      <svg viewBox="0 0 1600 620" className="h-full w-full">
        <g fill="rgba(148,163,184,0.13)">
          <rect x="230" y="170" width="200" height="200" rx="28" />
          <rect x="500" y="130" width="220" height="240" rx="28" />
          <rect x="790" y="180" width="200" height="200" rx="28" />
          <rect x="1070" y="145" width="250" height="235" rx="28" />
        </g>
        <g fill="none" stroke="rgba(59,130,246,0.18)" strokeWidth="2">
          <path d="M430 270 L500 250" />
          <path d="M720 250 L790 280" />
          <path d="M990 280 L1070 255" />
        </g>
      </svg>
    ),
    industries: (
      <svg viewBox="0 0 1600 620" className="h-full w-full">
        <g fill="rgba(148,163,184,0.12)" stroke="rgba(100,116,139,0.14)" strokeWidth="1">
          <circle cx="420" cy="250" r="74" />
          <circle cx="630" cy="220" r="58" />
          <circle cx="810" cy="330" r="86" />
          <circle cx="1015" cy="235" r="66" />
          <circle cx="1225" cy="320" r="78" />
        </g>
        <g fill="none" stroke="rgba(59,130,246,0.18)" strokeWidth="2">
          <path d="M494 250 L572 226" />
          <path d="M686 245 L738 292" />
          <path d="M896 300 L954 260" />
          <path d="M1081 260 L1158 302" />
        </g>
      </svg>
    ),
    verification: (
      <svg viewBox="0 0 1600 620" className="h-full w-full">
        <g fill="rgba(148,163,184,0.12)">
          <path d="M800 115 L1040 195 L1000 420 L800 520 L600 420 L560 195 Z" />
        </g>
        <g
          fill="none"
          stroke="rgba(59,130,246,0.18)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M700 315 L780 395 L940 235" />
        </g>
      </svg>
    ),
  };

  return arts[stage] || null;
}

function RotatingNode({
  content,
  size = 168,
  floating = true,
  outerRing = true,
  textSize = "text-[13px]",
  overlayClass = "bg-slate-900/18",
  progress = 0,
}) {
  const progressPct = clamp(progress, 0, 100);
  const strokeWidth = 8;
  const radius = size / 2 - strokeWidth / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progressPct / 100) * circumference;

  return (
    <motion.div
      animate={
        floating
          ? {
              y: [0, -8, 0],
              boxShadow: [
                "0 22px 60px rgba(15,23,42,0.16)",
                "0 30px 75px rgba(56,189,248,0.24)",
                "0 22px 60px rgba(15,23,42,0.16)",
              ],
            }
          : {}
      }
      transition={
        floating
          ? {
              y: { repeat: Infinity, duration: 2.4, ease: "easeInOut" },
              boxShadow: {
                repeat: Infinity,
                duration: 2.4,
                ease: "easeInOut",
              },
            }
          : {}
      }
      className="relative flex items-center justify-center"
      style={{ width: size + 18, height: size + 18 }}
    >
      <svg
        width={size + 18}
        height={size + 18}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={(size + 18) / 2}
          cy={(size + 18) / 2}
          r={radius}
          fill="none"
          stroke="rgba(186,230,253,0.45)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={(size + 18) / 2}
          cy={(size + 18) / 2}
          r={radius}
          fill="none"
          stroke="#7dd3fc"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            filter: "drop-shadow(0 0 12px rgba(125,211,252,0.65))",
          }}
        />
      </svg>

      <motion.div
        className="relative flex items-center justify-center overflow-hidden rounded-full border-[6px] border-white/85"
        style={{
          width: size,
          height: size,
          backgroundImage: `${content.bg}, ${content.image}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 22px 60px rgba(15,23,42,0.16)",
        }}
      >
        <div className={`absolute inset-0 ${overlayClass}`} />
        <div className="absolute inset-0 rounded-full ring-1 ring-white/45" />
        {outerRing && (
          <div className="absolute -inset-4 rounded-full border border-sky-200/40" />
        )}

        <div className="absolute top-4 z-20 rounded-full bg-white/82 px-3 py-1 text-[11px] font-black text-sky-700 shadow-sm backdrop-blur-md">
          {Math.round(progressPct)}%
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={content.label}
            initial={{ rotateY: -90, opacity: 0, scale: 0.84 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 90, opacity: 0, scale: 0.84 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center px-4 text-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className={`rounded-full bg-white/78 px-4 py-3 font-extrabold leading-tight text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-md ${textSize}`}
            >
              {content.label}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function CenterShowcaseNode({ content, progress }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    >
      <RotatingNode content={content} size={168} progress={progress} />
    </motion.div>
  );
}

export default function SnakeSearchLoading() {
  const segments = useMemo(() => buildSnakePath(), []);
  const pathD = useMemo(() => snakePathD(segments), [segments]);

  const [screen, setScreen] = useState("intro");
  const [introProgress, setIntroProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [topIntra, setTopIntra] = useState(0);
  const [snakeIntra, setSnakeIntra] = useState(0);
  const [done, setDone] = useState(false);
  const [badgeHistory, setBadgeHistory] = useState([]);
  const [centerNodeIndex, setCenterNodeIndex] = useState(0);
  const [introNodeIndex, setIntroNodeIndex] = useState(0);

  const timeoutRefs = useRef([]);
  const topControlsRef = useRef(null);
  const snakeControlsRef = useRef(null);

  const nodes = [
    { x: 420, y: 285, step: 0 },
    { x: 610, y: 285, step: 1 },
    { x: 860, y: 455, step: 2 },
    { x: 1040, y: 455, step: 3 },
    { x: 1320, y: 270, step: 4 },
    { x: 1425, y: 270, step: 5 },
    { x: 1525, y: 270, step: 6 },
  ];

  useEffect(() => {
    const intro = animate(0, 100, {
      duration: INTRO_DURATION / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        setIntroProgress(v);

        const totalStops = NODE_ROTATIONS.length;
        const progressRatio = v / 100;
        const idx = Math.min(
          totalStops - 1,
          Math.floor(progressRatio * totalStops)
        );
        setIntroNodeIndex(idx);
      },
      onComplete: () => setScreen("search"),
    });

    return () => intro.stop();
  }, []);

  useEffect(() => {
    if (screen !== "search") return;

    let current = 0;

    const clearAll = () => {
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
      topControlsRef.current?.stop();
      snakeControlsRef.current?.stop();
    };

    const runStep = (index) => {
      if (index >= STEPS.length) {
        setDone(true);
        setActiveStep(STEPS.length - 1);
        setTopIntra(1);
        setSnakeIntra(1);

        const doneTimer = setTimeout(() => setScreen("result"), RESULT_DELAY);
        timeoutRefs.current.push(doneTimer);
        return;
      }

      setActiveStep(index);
      setTopIntra(0);
      setSnakeIntra(0);

      const leadTimer = setTimeout(() => {
        topControlsRef.current = animate(0, 1, {
          duration: STEP_DURATION,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: setTopIntra,
        });
      }, TOP_LEAD_DELAY);

      const snakeTimer = setTimeout(() => {
        snakeControlsRef.current = animate(0, 1, {
          duration: STEP_DURATION + 0.2,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: setSnakeIntra,
          onComplete: () => {
            setBadgeHistory((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
            current += 1;
            const nextTimer = setTimeout(() => runStep(current), STEP_PAUSE);
            timeoutRefs.current.push(nextTimer);
          },
        });
      }, SNAKE_FOLLOW_DELAY);

      timeoutRefs.current.push(leadTimer, snakeTimer);
    };

    runStep(0);
    return clearAll;
  }, [screen]);

  useEffect(() => {
    if (screen !== "search") return;

    const interval = setInterval(() => {
      setCenterNodeIndex((prev) => (prev + 1) % NODE_ROTATIONS.length);
    }, 1600);

    return () => clearInterval(interval);
  }, [screen]);

  const snakeGlobalProgress =
    screen === "search" ? (activeStep + snakeIntra) / STEPS.length : 0;

  const runner = pointAtProgress(segments, snakeGlobalProgress);
  const centerNodeContent = NODE_ROTATIONS[centerNodeIndex];
  const introNodeContent = NODE_ROTATIONS[introNodeIndex];

  const elapsedSearchMs =
    activeStep * STEP_TOTAL_MS +
    SNAKE_FOLLOW_DELAY +
    snakeIntra * ((STEP_DURATION + 0.2) * 1000);

  const overallPercent =
    screen === "intro"
      ? (introProgress / 100) * (INTRO_DURATION / TOTAL_OPERATION_MS) * 100
      : screen === "search"
        ? ((INTRO_DURATION + elapsedSearchMs) / TOTAL_OPERATION_MS) * 100
        : 100;

  const bgThemes = [
    "from-[#fcfcfc] via-[#f4f5f6] to-[#ededee]",
    "from-[#ffffff] via-[#f5f5f5] to-[#eceff1]",
    "from-[#fbfbfb] via-[#f1f3f5] to-[#e9ecef]",
    "from-[#ffffff] via-[#f4f4f5] to-[#ececec]",
    "from-[#fcfcfd] via-[#f3f4f6] to-[#e8eaed]",
    "from-[#fbfcfd] via-[#f4f6f8] to-[#e9edf1]",
    "from-[#ffffff] via-[#f5f7f9] to-[#ebeff3]",
  ];

  if (screen === "intro") {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <RotatingNode
            content={introNodeContent}
            size={144}
            textSize="text-[12px]"
            outerRing={true}
            floating={true}
            progress={overallPercent}
          />
        </motion.div>

        <h1 className="mb-8 text-center text-5xl font-semibold tracking-tight text-slate-700">
          Let&apos;s Get Started
        </h1>

        <div className="w-full max-w-xl">
          <div className="h-4 w-full overflow-hidden rounded-full bg-[#d8e2f8] shadow-inner">
            <motion.div
              className="h-full rounded-full bg-[#1458f5]"
              animate={{ width: `${introProgress}%` }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.18 }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (screen === "result") {
    return (
      <div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-10 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        >
          <div className="mb-5 flex items-center gap-3 text-green-700">
            <CheckCircle2 className="h-7 w-7" />
            <span className="text-2xl font-bold">
              Search completed successfully
            </span>
          </div>
          <div className="text-lg text-slate-600">
            We finished processing{" "}
            <span className="font-semibold text-slate-800">{companyName}</span>.
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-br ${bgThemes[activeStep]} text-slate-700 transition-all duration-700`}
      animate={{ opacity: 1 }}
    >
      <header className="border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-3xl font-black tracking-tight">
            <span className="text-slate-700">Ray</span>
            <span className="text-green-500">Search</span>
          </div>

          <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm">
            Search in progress
          </div>
        </div>

        <div className="h-2 w-full bg-[#e7edf8]">
          <motion.div
            className="h-full rounded-r-full bg-[#0f3a97]"
            animate={{ width: `${topBarProgress(activeStep, topIntra)}%` }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.25 }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex items-center justify-center gap-3 text-center text-4xl font-black text-slate-700">
          <Search className="h-9 w-9" />
          <span>{companyName}</span>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const visible = badgeHistory.includes(index) || index <= activeStep;

            return (
              <motion.div
                key={step.id}
                initial={false}
                animate={{
                  opacity: visible ? 1 : 0.32,
                  scale: visible ? 1 : 0.95,
                }}
                className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-xs font-bold text-[#1f5fff] shadow-sm backdrop-blur-md"
              >
                <Icon className="h-4 w-4" />
                {step.badge}
              </motion.div>
            );
          })}
        </div>

        <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/35 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={STEPS[activeStep].id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-[1] origin-center"
            >
              <div className="absolute inset-0 opacity-70">
                <StageArt stage={STEPS[activeStep].id} />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.78),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(226,232,240,0.58),transparent_38%)]" />

          <CenterShowcaseNode
            content={centerNodeContent}
            progress={overallPercent}
          />

          <svg viewBox="0 0 1600 620" className="relative z-10 h-[620px] w-full">
            <path
              d={pathD}
              fill="none"
              stroke="#d9e4f8"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={pathD}
              fill="none"
              stroke="#1658f5"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1700"
              strokeDashoffset={1700 - snakeGlobalProgress * 1700}
              style={{
                filter: "drop-shadow(0 8px 18px rgba(22,88,245,0.18))",
              }}
            />

            {nodes.map((node, index) => {
              const Icon = STEPS[node.step].icon;
              const active = index <= activeStep;
              const pulse = nodeProgress(index, activeStep, snakeIntra);

              return (
                <g key={node.step} transform={`translate(${node.x}, ${node.y})`}>
                  <circle r="28" fill={active ? "#1658f5" : "#dfe8f7"} />
                  <foreignObject x={-12} y={-12} width="24" height="24">
                    <div className="flex h-full w-full items-center justify-center">
                      <Icon
                        className={`h-6 w-6 ${
                          active ? "text-white" : "text-slate-400"
                        }`}
                      />
                    </div>
                  </foreignObject>

                  {active && (
                    <circle
                      r={36 + pulse * 5}
                      fill="none"
                      stroke="rgba(22,88,245,0.10)"
                      strokeWidth="10"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          <motion.div
            className="absolute z-20 text-[30px] leading-none drop-shadow-sm"
            animate={{
              x: runner.x - 14,
              y: [runner.y - 18, runner.y - 24, runner.y - 18],
              rotate: [0, -8, 0, 8, 0],
            }}
            transition={{
              x: { ease: [0.22, 1, 0.36, 1], duration: 0.22 },
              y: { repeat: Infinity, duration: 0.7, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 0.8, ease: "easeInOut" },
            }}
          >
            🦇
          </motion.div>

          <div className="pointer-events-none absolute inset-0 z-20">
            {STEPS.map((step, index) => (
              <StepCard
                key={step.id}
                className={CARD_POSITIONS[index]}
                step={step}
                isActive={activeStep === index}
                isPast={activeStep > index || done}
              />
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
}

function StepCard({ step, isActive, isPast, className }) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isActive || isPast ? 1 : 0.16,
        scale: isActive ? 1 : 0.96,
        y: isActive ? -6 : 0,
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute w-[220px] ${className}`}
    >
      <div className="rounded-2xl border border-white/80 bg-[rgba(255,255,255,0.62)] p-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
        <div className="mb-2 flex items-center gap-2">
          <div
            className={`rounded-xl p-2 ${
              isActive || isPast
                ? "bg-blue-50 text-[#1658f5]"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="text-sm font-extrabold leading-tight text-slate-700">
            {step.title}
          </div>
        </div>

        <p className="text-xs leading-5 text-slate-600">{step.description}</p>
      </div>
    </motion.div>
  );
}