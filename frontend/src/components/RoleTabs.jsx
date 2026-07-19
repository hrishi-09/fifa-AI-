import React from "react";

const ROLES = [
  { id: "fan", label: "Fan" },
  { id: "volunteer", label: "Volunteer" },
  { id: "organizer", label: "Organizer" },
  { id: "security", label: "Security" },
];

export default function RoleTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 px-6 pt-3.5 border-b border-border overflow-x-auto">
      {ROLES.map((r) => (
        <div
          key={r.id}
          onClick={() => onChange(r.id)}
          className={`flex items-center gap-2 px-[18px] py-2.5 rounded-t-lg cursor-pointer font-display font-semibold text-[15px] tracking-wide border border-transparent border-b-0 transition-colors whitespace-nowrap
            ${active === r.id
              ? "text-text bg-panel border-border shadow-[0_-2px_0_0_#39D98A_inset]"
              : "text-muted hover:text-text"}`}
        >
          {r.label}
        </div>
      ))}
    </div>
  );
}
