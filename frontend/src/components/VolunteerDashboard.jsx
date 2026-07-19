import React, { useEffect, useState } from "react";
import AIChat from "./AIChat";
import { api } from "../api";

const REQUEST_POOL = [
  "Visitor asking for nearest wheelchair-accessible restroom, Section 108",
  "Family requesting stroller parking near Gate C",
  "Fan reporting a slippery step near Ramp 2",
  "Visitor needs Portuguese translation support, Gate B",
  "Elderly couple requesting golf-cart assistance to Block 340",
];

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

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.getTasks().then(setTasks).catch(() => {});
    const pushOne = () => {
      const txt = REQUEST_POOL[Math.floor(Math.random() * REQUEST_POOL.length)];
      setRequests((r) => [{ txt, time: new Date().toLocaleTimeString("en-GB") }, ...r].slice(0, 6));
    };
    pushOne(); pushOne(); pushOne();
    const iv = setInterval(pushOne, 9000);
    return () => clearInterval(iv);
  }, []);

  async function toggleTask(t) {
    const updated = await api.updateTask(t.id, !t.done);
    setTasks((ts) => ts.map((x) => (x.id === t.id ? updated : x)));
  }

  const openCount = tasks.filter((t) => !t.done).length;

  return (
    <div>
      <div className="grid gap-[18px] grid-cols-1 lg:grid-cols-[1.3fr_.9fr]">
        <Panel
          title="Your Tasks — Zone Gate B Team"
          sub="Auto-prioritized by AI Volunteer Agent"
          right={<span className="text-[11px] px-2.5 py-1 rounded-full bg-amberDim text-amber font-mono">{openCount} open</span>}
        >
          {tasks.map((t) => (
            <div key={t.id} className="flex items-start gap-2.5 py-2.5 border-b border-border last:border-none">
              <div
                onClick={() => toggleTask(t)}
                className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex-shrink-0 mt-0.5 cursor-pointer flex items-center justify-center transition-colors ${
                  t.done ? "bg-pitch border-pitch" : "border-muted2"
                }`}
              >
                {t.done && <span className="text-[12px] text-[#04140D] font-bold">✓</span>}
              </div>
              <div className={t.done ? "line-through text-muted2" : ""}>{t.title}</div>
            </div>
          ))}
        </Panel>

        <Panel title="AI Volunteer Assistant" sub="Instant answers for visitor questions">
          <AIChat
            role="volunteer"
            tag="VOLUNTEER AI"
            welcome="Volunteer Assistant ready. Ask me anything a visitor might ask, and I'll give you the exact answer to relay."
            height="300px"
          />
        </Panel>
      </div>

      <div className="mt-[18px]">
        <Panel title="Live Visitor Requests" sub="Streaming in from the fan app" right={<span className="text-[11px] px-2.5 py-1 rounded-full bg-blueDim text-blue font-mono">Live</span>}>
          {requests.map((r, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-none text-[13.5px]">
              <span>{r.txt}</span>
              <span className="text-[11.5px] text-muted font-mono">{r.time}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}
