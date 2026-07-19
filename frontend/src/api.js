const BASE = "/api";

async function j(res) {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const api = {
  getZones: () => fetch(`${BASE}/zones/`).then(j),
  getAlerts: () => fetch(`${BASE}/alerts/`).then(j),
  getWaste: () => fetch(`${BASE}/alerts/waste`).then(j),
  getIncidents: () => fetch(`${BASE}/incidents/`).then(j),
  createIncident: (payload) =>
    fetch(`${BASE}/incidents/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(j),
  getResponsePlan: (id) => fetch(`${BASE}/incidents/${id}/response-plan`).then(j),
  getTasks: () => fetch(`${BASE}/tasks/`).then(j),
  updateTask: (id, done) =>
    fetch(`${BASE}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    }).then(j),
  chat: (prompt, role) =>
    fetch(`${BASE}/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, role }),
    }).then(j),
};

export function connectLiveFeed(onMessage) {
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  const ws = new WebSocket(`${proto}://${window.location.host}/ws/live`);
  ws.onmessage = (evt) => {
    try {
      onMessage(JSON.parse(evt.data));
    } catch (e) {
      /* ignore malformed frames */
    }
  };
  ws.onclose = () => {
    // simple auto-reconnect after 3s
    setTimeout(() => connectLiveFeed(onMessage), 3000);
  };
  return ws;
}
