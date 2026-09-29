import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Loader2, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const OPTIONS = [
  ["pie", "Pie chart"],
  ["area", "Area chart"],
  ["stacked_bar", "Stacked bars"],
  ["histogram", "Histogram"],
  ["gantt", "Gantt chart"],
];

const DEFAULT_DESIGN = {
  title: "Live Search Intelligence",
  subtitle: "Performance across every search index",
  insight: "Chart generated from the latest search-stage metrics.",
  palette: ["#2563eb", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981"],
};

function localPoints(statusData) {
  let cursor = 0;
  return Object.entries(statusData?.steps || {}).map(([key, step]) => {
    const duration = Math.max(0, Number(step?.elapsed_ms || 0));
    const start = cursor;
    cursor += duration;
    return {
      key,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      label: String(step?.display_name ?? step?.label ?? key),
      value: Math.max(0, Number(step?.found_count || 0)),
      duration_ms: duration,
      attempts: Math.max(0, Number(step?.attempts || 0)),
      effectiveness: Math.max(0, Math.min(100, Number(step?.effectiveness || 0))),
      status: String(step?.status || "queued"),
      start_offset_ms: start,
      end_offset_ms: cursor,
    };
  });
}

function histogram(points) {
  if (!points.length) return [];
  const values = points.map((point) => point.value);
  const maximum = Math.max(...values, 1);
  const size = Math.max(1, Math.ceil(maximum / 5));
  return Array.from({ length: 5 }, (_, index) => {
    const minimum = index * size;
    const maximumForBin = index === 4 ? Infinity : minimum + size;
    return {
      title: index === 4 ? `${minimum}+` : `${minimum}–${maximumForBin - 1}`,
      frequency: values.filter((value) => value >= minimum && value < maximumForBin).length,
    };
  });
}

function Chart({ type, points, palette }) {
  const common = (
    <>
      <CartesianGrid stroke="#dbeafe" strokeDasharray="4 6" vertical={false} />
      <XAxis dataKey="title" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={{ border: "1px solid #dbeafe", borderRadius: 14, boxShadow: "0 16px 40px rgba(15,23,42,.12)" }} />
    </>
  );

  if (type === "pie") {
    return (
      <PieChart>
        <Pie data={points} dataKey="value" nameKey="title" innerRadius="48%" outerRadius="78%" paddingAngle={3} cornerRadius={6}>
          {points.map((point, index) => <Cell key={point.key} fill={palette[index % palette.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    );
  }

  if (type === "area") {
    return (
      <AreaChart data={points} margin={{ top: 12, right: 18, left: 0, bottom: 4 }}>
        <defs>
          <linearGradient id="rmArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette[0]} stopOpacity={0.55} />
            <stop offset="100%" stopColor={palette[0]} stopOpacity={0.04} />
          </linearGradient>
        </defs>
        {common}
        <Area type="monotone" dataKey="value" name="Companies" stroke={palette[0]} strokeWidth={3} fill="url(#rmArea)" animationDuration={900} />
      </AreaChart>
    );
  }

  if (type === "stacked_bar") {
    return (
      <BarChart data={points} margin={{ top: 12, right: 18, left: 0, bottom: 4 }}>
        {common}
        <Legend />
        <Bar dataKey="value" name="Companies" stackId="metrics" fill={palette[0]} radius={[6, 6, 0, 0]} animationDuration={850} />
        <Bar dataKey="attempts" name="Attempts" stackId="metrics" fill={palette[2]} radius={[6, 6, 0, 0]} animationDuration={1050} />
      </BarChart>
    );
  }

  if (type === "histogram") {
    return (
      <BarChart data={histogram(points)} margin={{ top: 12, right: 18, left: 0, bottom: 4 }}>
        {common}
        <Bar dataKey="frequency" name="Indexes" fill={palette[1]} radius={[8, 8, 0, 0]} animationDuration={900} />
      </BarChart>
    );
  }

  return (
    <BarChart layout="vertical" data={points} margin={{ top: 12, right: 28, left: 14, bottom: 4 }}>
      <CartesianGrid stroke="#dbeafe" strokeDasharray="4 6" horizontal={false} />
      <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} unit="ms" />
      <YAxis type="category" dataKey="title" width={82} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
      <Tooltip formatter={(value, name) => name === "Offset" ? [`${value} ms`, name] : [`${value} ms`, "Duration"]} />
      <Bar dataKey="start_offset_ms" name="Offset" stackId="timeline" fill="transparent" isAnimationActive={false} />
      <Bar dataKey="duration_ms" name="Duration" stackId="timeline" fill={palette[4]} radius={[0, 8, 8, 0]} animationDuration={1000} />
    </BarChart>
  );
}

export default function SearchResultsChart({ token, statusData }) {
  const [type, setType] = useState("pie");
  const [payload, setPayload] = useState({ design: DEFAULT_DESIGN, data: localPoints(statusData) });
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const localData = useMemo(() => localPoints(statusData), [statusData]);
  const completedSteps = Number(statusData?.meta?.completed_steps || 0);
  const searchFinished = Boolean(statusData?.meta?.is_completed);

  useEffect(() => {
    if (!token) {
      setPayload({ design: DEFAULT_DESIGN, data: localData });
      return undefined;
    }

    const controller = new AbortController();
    const deadline = window.setTimeout(() => controller.abort(), 2800);
    setLoading(true);
    setNotice("");

    fetch(`/api/main-search/${encodeURIComponent(token)}/chart?chart_type=${encodeURIComponent(type)}`, {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data?.ok) throw new Error(data?.message || "Unable to prepare chart.");
        setPayload({ design: data.design, data: data.data });
        if (data.generated_by === "fallback") setNotice("Fast local design used.");
      })
      .catch((error) => {
        setPayload({ design: DEFAULT_DESIGN, data: localData });
        setNotice(error.name === "AbortError" ? "Fast local chart shown." : error.message);
      })
      .finally(() => {
        window.clearTimeout(deadline);
        setLoading(false);
      });

    return () => {
      window.clearTimeout(deadline);
      controller.abort();
    };
  }, [token, type, completedSteps, searchFinished]);

  const { design, data } = payload;

  return (
    <section className="rm-chart-card">
      <style>{styles}</style>
      <header className="rm-chart-header">
        <div>
          <span className="rm-chart-kicker"><Sparkles size={13} /> AI-assisted visualization</span>
          <h2>{design.title}</h2>
          <p>{design.subtitle}</p>
        </div>
        <label className="rm-chart-select">
          <BarChart3 size={17} />
          <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Chart type">
            {OPTIONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
      </header>

      <div className="rm-chart-stage">
        <AnimatePresence mode="wait">
          <motion.div key={type} className={loading ? "rm-chart-canvas loading" : "rm-chart-canvas"} initial={{ opacity: 0, filter: "blur(9px)", y: 8 }} animate={{ opacity: 1, filter: loading ? "blur(5px)" : "blur(0px)", y: 0 }} exit={{ opacity: 0, filter: "blur(8px)", y: -6 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <ResponsiveContainer width="100%" height="100%">
              <Chart type={type} points={data} palette={design.palette || DEFAULT_DESIGN.palette} />
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
        {loading && <div className="rm-chart-loading"><Loader2 className="rm-spin" size={22} /><strong>Designing {OPTIONS.find(([value]) => value === type)?.[1]}…</strong><span>Updating all search indexes</span></div>}
      </div>

      <footer className="rm-chart-footer"><p>{design.insight}</p>{notice && <span>{notice}</span>}</footer>
    </section>
  );
}

const styles = `
  .rm-chart-card{width:100%;border:1px solid #dbeafe;border-radius:24px;background:linear-gradient(145deg,#fff,#f8fbff);box-shadow:0 18px 45px rgba(15,23,42,.08);overflow:hidden}.rm-chart-header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:20px 22px 15px}.rm-chart-kicker{display:inline-flex;align-items:center;gap:6px;color:#2563eb;font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.rm-chart-header h2{margin:6px 0 3px;color:#0f172a;font-size:21px}.rm-chart-header p{margin:0;color:#64748b;font-size:12px}.rm-chart-select{display:flex;align-items:center;gap:8px;padding:9px 12px;border:1px solid #bfdbfe;border-radius:13px;background:#eff6ff;color:#2563eb}.rm-chart-select select{border:0;outline:0;background:transparent;color:#0f172a;font:700 13px/1 inherit;cursor:pointer}.rm-chart-stage{position:relative;height:340px;padding:6px 14px 2px}.rm-chart-canvas{width:100%;height:100%;transition:filter .45s,opacity .45s}.rm-chart-canvas.loading{opacity:.42;pointer-events:none}.rm-chart-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:7px;color:#1d4ed8;background:rgba(248,250,252,.28);backdrop-filter:blur(2px);z-index:2}.rm-chart-loading span{color:#64748b;font-size:11px}.rm-chart-footer{display:flex;justify-content:space-between;gap:14px;padding:13px 22px 17px;border-top:1px solid #eff6ff}.rm-chart-footer p{margin:0;color:#334155;font-size:12px}.rm-chart-footer span{color:#64748b;font-size:11px}.rm-spin{animation:rmChartSpin 1s linear infinite}@keyframes rmChartSpin{to{transform:rotate(360deg)}}@media(max-width:640px){.rm-chart-header{flex-direction:column}.rm-chart-select{width:100%}.rm-chart-select select{flex:1}.rm-chart-stage{height:300px}.rm-chart-footer{flex-direction:column}}@media(prefers-reduced-motion:reduce){.rm-chart-card *{animation:none!important;transition:none!important}}
`;
