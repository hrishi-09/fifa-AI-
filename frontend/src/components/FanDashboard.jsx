import React, { useState } from "react";
import AIChat from "./AIChat";

function Panel({ title, sub, right, children }) {
  return (
    <div className="bg-gradient-to-b from-panel to-[#10161F] border border-border rounded-xl2 p-[18px] pb-5">
      {(title || right) && (
        <div className="flex items-center justify-between mb-3.5">
          <div>
            {title && <div className="text-[14.5px] uppercase tracking-[.11em] text-muted font-display font-bold">{title}</div>}
            {sub && <div className="text-[12px] text-muted2 mt-0.5">{sub}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function Toggle({ label }) {
  const [on, setOn] = useState(false);
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-none">
      <span>{label}</span>
      <div
        onClick={() => setOn(!on)}
        className={`relative w-[38px] h-[21px] rounded-full border cursor-pointer transition-colors ${on ? "bg-pitchDim border-pitch" : "bg-panel2 border-border"}`}
      >
        <div className={`absolute top-[2px] w-[15px] h-[15px] rounded-full transition-all ${on ? "left-[19px] bg-pitch" : "left-[2px] bg-muted"}`} />
      </div>
    </div>
  );
}

export default function FanDashboard({ zones }) {
  const gateSorted = [...zones].sort((a, b) => a.occupancy_pct - b.occupancy_pct);

  return (
    <div>
      <div className="grid gap-[18px] grid-cols-1 lg:grid-cols-[1.3fr_.9fr]">
        <Panel title="AI Assistant" sub="Ask about gates, routes, food, transport or accessibility" right={<span className="text-[11px] px-2.5 py-1 rounded-full bg-pitchDim text-pitch font-mono">● Online</span>}>
          <AIChat
            role="fan"
            tag="FAN AI"
            welcome="Welcome to StadiumOS! Ask me anything — gates, routes, food, transport, or accessibility."
            quickChips={["How do I get to Gate C?", "Which gate has the shortest queue?", "I need a wheelchair accessible route", "Best transport option after the match"]}
          />
        </Panel>

        <Panel title="Smart Navigation" sub="Live route to your seat, Block 214" right={<span className="text-[11px] px-2.5 py-1 rounded-full bg-blueDim text-blue font-mono">4 min walk</span>}>
          {[
            "Enter via Gate C — North Concourse (lowest congestion)",
            "Follow signage to Ramp 4, keep right past the merchandise stand",
            "Take escalator to Level 2, Section 210–220",
            "Seat Block 214, Row F — arrive with 12 min to kickoff",
          ].map((step, i) => (
            <div key={i} className="flex gap-3 py-2.5 border-b border-dashed border-border last:border-none text-[13.5px]">
              <div className="w-[22px] h-[22px] rounded-full bg-panel2 border border-border flex items-center justify-center text-[11px] font-mono text-pitch flex-shrink-0">{i + 1}</div>
              <div>{step}</div>
            </div>
          ))}
          <div className="text-[14.5px] uppercase tracking-[.11em] text-muted font-display font-bold mt-[18px] mb-1">Accessibility</div>
          <Toggle label="Wheelchair route" />
          <Toggle label="Audio navigation" />
          <Toggle label="Sign language support desk" />
        </Panel>
      </div>

      <div className="grid gap-[18px] grid-cols-1 md:grid-cols-3 mt-[18px]">
        <Panel title="Gate Status">
          {gateSorted.slice(0, 5).map((z) => {
            const cls = z.occupancy_pct > 85 ? "bg-redDim text-red" : z.occupancy_pct >= 60 ? "bg-amberDim text-amber" : "bg-pitchDim text-pitch";
            return (
              <div key={z.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-none text-[13.5px]">
                <span>{z.name}</span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono ${cls}`}>{Math.round(z.occupancy_pct)}%</span>
              </div>
            );
          })}
        </Panel>
        <Panel title="Transport To Go">
          {[["Metro Line 3 · Stadium Stn", "3 min"], ["Shuttle Bus B12", "7 min"], ["Parking Lot D", "62% full"], ["Rideshare pickup zone", "9 min wait"]].map(([a, b]) => (
            <div key={a} className="flex items-center justify-between py-2.5 border-b border-border last:border-none text-[13.5px]">
              <span>{a}</span><span className="text-[11.5px] text-muted font-mono">{b}</span>
            </div>
          ))}
        </Panel>
        <Panel title="Live Alerts">
          {[
            { t: "Gate B approaching high occupancy — consider Gate C or H", cls: "text-amber" },
            { t: "Weather stable — no relocation needed", cls: "text-pitch" },
            { t: "Metro Line 3 running on schedule", cls: "text-blue" },
          ].map((a) => (
            <div key={a.t} className="flex items-center justify-between py-2.5 border-b border-border last:border-none text-[13.5px]">
              <span>{a.t}</span><span className={a.cls}>●</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
