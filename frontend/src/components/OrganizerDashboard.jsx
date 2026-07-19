import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale,
  BarElement, Filler, Tooltip, Legend,
} from "chart.js";
import StadiumMap from "./StadiumMap";
import { api } from "../api";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, BarElement, Filler, Tooltip, Legend);

function Panel({ title, sub, right, children }) {
  return (
    <div className="bg-gradient-to-b from-panel to-[#10161F] border border-border rounded-xl2 p-[18px] pb-5">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <div className="text-[14.5px] uppercase tracking-[.11em] text-muted font-display font-bold">{title}</div>
          {sub && <div className="text-[12px] text-muted2 mt-0.5">{sub}</div>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

const chartAxisOpts = {
  ticks: { color: "#5C6B7D", font: { family: "JetBrains Mono", size: 10 } },
  grid: { color: "#1A2330" },
};

export default function OrganizerDashboard({ zones }) {
  const [alerts, setAlerts] = useState([]);
  const [waste, setWaste] = useState([]);

  useEffect(() => {
    api.getAlerts().then(setAlerts).catch(() => {});
    api.getWaste().then(setWaste).catch(() => {});
    const iv = setInterval(() => api.getWaste().then(setWaste).catch(() => {}), 6000);
    return () => clearInterval(iv);
  }, []);

  const occAvg = zones.length ? Math.round(zones.reduce((a, z) => a + z.occupancy_pct, 0) / zones.length) : 0;
  const criticalCount = zones.filter((z) => z.occupancy_pct > 85).length;

  const kpis = [
    { label: "Total Attendance", val: (68000 + Math.round(Math.random() * 400)).toLocaleString(), delta: "+120 last 5 min", dir: "up" },
    { label: "Stadium Occupancy", val: `${occAvg}%`, delta: occAvg > 75 ? "trending up" : "stable", dir: occAvg > 75 ? "up" : "flat" },
    { label: "Active Alerts", val: criticalCount + 1, delta: criticalCount > 1 ? "needs attention" : "nominal", dir: criticalCount > 1 ? "up" : "down" },
    { label: "Avg Gate Wait", val: `${6 + (criticalCount > 0 ? 3 : 0)} min`, delta: "-1.2 min vs 15m ago", dir: "down" },
  ];

  const forecastData = {
    labels: Array.from({ length: 7 }, (_, i) => `+${i * 10}m`),
    datasets: [
      { label: "Gate B", data: [88, 90, 93, 96, 92, 85, 78], borderColor: "#FF5468", backgroundColor: "#FF546822", tension: 0.35, fill: true },
      { label: "Gate A", data: [44, 48, 55, 60, 58, 52, 47], borderColor: "#FFB53D", backgroundColor: "#FFB53D18", tension: 0.35, fill: true },
      { label: "Gate C", data: [38, 36, 34, 33, 31, 30, 28], borderColor: "#39D98A", backgroundColor: "#39D98A18", tension: 0.35, fill: true },
    ],
  };

  const wasteData = {
    labels: waste.map((w) => w.location),
    datasets: [{
      label: "Fill %",
      data: waste.map((w) => w.fill_level),
      backgroundColor: waste.map((w) => (w.fill_level > 85 ? "#FF5468" : w.fill_level >= 60 ? "#FFB53D" : "#39D98A")),
      borderRadius: 6,
    }],
  };

  return (
    <div>
      <div className="grid gap-[18px] grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-gradient-to-b from-panel to-[#10161F] border border-border rounded-xl2 p-4">
            <div className="font-mono text-[30px] font-semibold leading-none">{k.val}</div>
            <div className="text-muted text-[12px] mt-2 uppercase tracking-[.08em]">{k.label}</div>
            <div className={`text-[11.5px] mt-1.5 font-mono ${k.dir === "up" ? "text-red" : k.dir === "down" ? "text-pitch" : "text-muted"}`}>
              {k.dir === "up" ? "▲" : k.dir === "down" ? "▼" : "—"} {k.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-[18px] grid-cols-1 lg:grid-cols-2 mt-[18px]">
        <Panel
          title="Live Crowd Density — Stadium Bowl"
          sub="AI Crowd Prediction Agent · pushed over WebSocket every 4s"
          right={
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-mono ${criticalCount > 0 ? "bg-redDim text-red" : "bg-pitchDim text-pitch"}`}>
              {criticalCount > 0 ? `${criticalCount} zone${criticalCount > 1 ? "s" : ""} at risk` : "All zones nominal"}
            </span>
          }
        >
          <StadiumMap zones={zones} />
        </Panel>

        <Panel title="Crowd Forecast — Next 60 min" sub="Gate B trending toward congestion">
          <Line
            data={forecastData}
            options={{
              responsive: true,
              plugins: { legend: { labels: { color: "#8394A6", font: { family: "Inter", size: 11 } } } },
              scales: { x: chartAxisOpts, y: { ...chartAxisOpts, min: 0, max: 100 } },
            }}
          />
        </Panel>
      </div>

      <div className="grid gap-[18px] grid-cols-1 lg:grid-cols-2 mt-[18px]">
        <Panel title="Operations Alerts" sub="AI-generated, ranked by severity">
          {alerts.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-none text-[13.5px]">
              <span>{a.message}</span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono ${
                a.severity === "bad" ? "bg-redDim text-red" : a.severity === "warn" ? "bg-amberDim text-amber" : a.severity === "ok" ? "bg-pitchDim text-pitch" : "bg-blueDim text-blue"
              }`}>●</span>
            </div>
          ))}
        </Panel>

        <Panel title="Sustainability — Waste Bin Levels" sub="AI Sustainability Agent routing pickups">
          {waste.length > 0 && (
            <Bar
              data={wasteData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: "#8394A6", font: { family: "Inter", size: 10 } }, grid: { display: false } },
                  y: { ...chartAxisOpts, min: 0, max: 100 },
                },
              }}
            />
          )}
        </Panel>
      </div>
    </div>
  );
}
