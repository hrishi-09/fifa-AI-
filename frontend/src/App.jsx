import React, { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import RoleTabs from "./components/RoleTabs";
import FanDashboard from "./components/FanDashboard";
import VolunteerDashboard from "./components/VolunteerDashboard";
import OrganizerDashboard from "./components/OrganizerDashboard";
import SecurityDashboard from "./components/SecurityDashboard";
import { api, connectLiveFeed } from "./api";

export default function App() {
  const [role, setRole] = useState("fan");
  const [zones, setZones] = useState([]);

  // Initial load from REST, then keep in sync via WebSocket pushes from the
  // background simulation loop running on the backend (see app/main.py).
  useEffect(() => {
    api.getZones().then(setZones).catch(() => {});
    const ws = connectLiveFeed((msg) => {
      if (msg.type === "tick") {
        setZones((prev) =>
          msg.zones.map((z) => ({ ...prev.find((p) => p.id === z.id), ...z }))
        );
      }
    });
    return () => ws.close();
  }, []);

  return (
    <div>
      <TopBar />
      <RoleTabs active={role} onChange={setRole} />
      <div className="max-w-[1440px] mx-auto px-6 py-5 pb-16">
        {role === "fan" && <FanDashboard zones={zones} />}
        {role === "volunteer" && <VolunteerDashboard />}
        {role === "organizer" && <OrganizerDashboard zones={zones} />}
        {role === "security" && <SecurityDashboard />}
      </div>
      <div className="text-center text-muted2 text-[11.5px] mt-4 font-mono pb-8">
        FIFA AI StadiumOS — live data simulated for demonstration
      </div>
    </div>
  );
}
