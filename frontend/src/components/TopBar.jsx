import React, { useEffect, useState } from "react";

export default function TopBar() {
  const [wallClock, setWallClock] = useState("");
  const [matchSeconds, setMatchSeconds] = useState(67 * 60 + 12);

  useEffect(() => {
    const t1 = setInterval(() => setWallClock(new Date().toLocaleTimeString("en-GB")), 1000);
    const t2 = setInterval(() => setMatchSeconds((s) => s + 1), 1000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  const m = String(Math.floor(matchSeconds / 60)).padStart(2, "0");
  const s = String(matchSeconds % 60).padStart(2, "0");

  return (
    <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-gradient-to-b from-[#0E141C] to-bg sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-[15px] text-[#04140D]"
             style={{ background: "conic-gradient(from 220deg, #39D98A, #1C4A34, #39D98A)", boxShadow: "0 0 22px -4px #39D98A" }}>
          OS
        </div>
        <div>
          <div className="font-display font-bold text-[19px] leading-none tracking-wide">FIFA AI StadiumOS</div>
          <div className="text-[10.5px] text-muted uppercase tracking-[.14em] mt-0.5">Stadium Operations Intelligence</div>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4 px-4 py-1.5 border border-border rounded-lg bg-panel">
        <span className="w-[7px] h-[7px] rounded-full bg-red live-dot" style={{ boxShadow: "0 0 8px #FF5468" }} />
        <span className="font-display font-semibold text-[15px]">
          ARG <span className="font-mono text-pitch">1</span> — <span className="font-mono text-pitch">1</span> BRA
        </span>
        <span className="font-mono text-[13px] text-muted">{m}:{s}</span>
        <span className="font-mono text-[13px] text-muted">{wallClock}</span>
      </div>
    </div>
  );
}
