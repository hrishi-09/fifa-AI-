import React, { useEffect, useState } from "react";
import { api } from "../api";

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

const CAM_LABELS = [
  "Gate A Concourse", "Gate B Entry", "Gate C Ramp", "Pitch Perimeter N", "Food Court", "Parking Lot D",
  "Gate D West", "Concourse East", "Medical Bay", "Gate E NE", "Section 108", "Exit Ramp 4",
];
const ALERT_CAMS = new Set([1, 10]);

const RESPONSE_STEPS = [
  "Incident detected — Zone Gate B, Section 108 (crowd surge report)",
  "Nearest medical team: Team M2, ETA 2 min 10s",
  "Recommended evacuation lane: Exit Ramp 4 → Concourse East",
  "Crowd control gate opened: Gate D auxiliary to relieve pressure",
];

export default function SecurityDashboard() {
  const [incidents, setIncidents] = useState([]);

  const load = () => api.getIncidents().then(setIncidents).catch(() => {});
  useEffect(() => { load(); }, []);

  async function simulate() {
    await api.createIncident({
      description: "AI flagged unusual crowd motion, Gate E concourse",
      zone_id: "E",
      severity: "warn",
    });
    load();
  }

  const kpis = [
    { label: "Active Incidents", val: incidents.filter((i) => i.status !== "resolved").length, dir: "flat", delta: "medium severity" },
    { label: "Response Time Avg", val: "2m 10s", dir: "down", delta: "-18s vs baseline" },
    { label: "Cameras Monitored", val: "12 / 12", dir: "flat", delta: "all feeds active" },
  ];

  return (
    <div>
      <div className="grid gap-[18px] grid-cols-1 md:grid-cols-3">
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
          title="Emergency & Incident Log"
          sub="AI Emergency Agent · auto-triaged"
          right={
            <button onClick={simulate} className="border border-border rounded-lg px-3.5 py-1.5 font-display font-bold text-[13px] hover:border-pitch hover:text-pitch transition-colors">
              Simulate Incident
            </button>
          }
        >
          {incidents.map((inc) => (
            <div key={inc.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-none text-[13.5px]">
              <span><span className="text-muted2 text-[11px] font-mono mr-1.5">{inc.code}</span>— {inc.description}</span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono uppercase ${
                inc.severity === "bad" ? "bg-redDim text-red" : inc.severity === "warn" ? "bg-amberDim text-amber" : "bg-pitchDim text-pitch"
              }`}>
                {inc.severity === "bad" ? "critical" : inc.severity === "warn" ? "watch" : "resolved"}
              </span>
            </div>
          ))}
        </Panel>

        <Panel title="Active Response Plan" sub="Fastest path — Incident #INC-2291">
          {RESPONSE_STEPS.map((step, i) => (
            <div key={i} className="flex gap-3 py-2.5 border-b border-dashed border-border last:border-none text-[13.5px]">
              <div className="w-[22px] h-[22px] rounded-full bg-panel2 border border-border flex items-center justify-center text-[11px] font-mono text-pitch flex-shrink-0">{i + 1}</div>
              <div>{step}</div>
            </div>
          ))}
          <div className="flex gap-3 py-2.5 text-[13.5px] items-center">
            <div className="w-[22px] h-[22px] rounded-full bg-panel2 border border-border flex items-center justify-center text-[11px] font-mono text-pitch flex-shrink-0">5</div>
            <div>Status: <span className="text-[11px] px-2.5 py-0.5 rounded-full font-mono bg-amberDim text-amber">Monitoring</span></div>
          </div>
        </Panel>
      </div>

      <div className="mt-[18px]">
        <Panel title="Camera AI — Anomaly Detection" sub="12 feeds monitored · behavior & density analysis">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {CAM_LABELS.map((label, i) => {
              const alert = ALERT_CAMS.has(i);
              return (
                <div
                  key={label}
                  className="aspect-[16/10] rounded-lg border border-border relative overflow-hidden flex items-end p-2"
                  style={{ background: "repeating-linear-gradient(115deg, #101820 0 2px, #0B1218 2px 4px)" }}
                >
                  <span className={`absolute top-2 right-2 text-[9.5px] px-1.5 py-0.5 rounded font-mono tracking-wide ${alert ? "bg-redDim text-red" : "bg-pitchDim text-pitch"}`}>
                    {alert ? "AI: ALERT" : "AI: NORMAL"}
                  </span>
                  <span className="text-[10px] font-mono text-muted bg-black/50 px-1.5 py-0.5 rounded">{label}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
