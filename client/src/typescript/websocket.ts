import { globals } from "./env";

let ws: WebSocket | null = null;

export function getWebSocket(): WebSocket {
  if (!ws || ws.readyState === WebSocket.CLOSED) {
    ws = new WebSocket(`ws://${globals.url_string.subdomain}:8080`);

    ws.onopen = () => console.log("[WebSocket] Connected");
    ws.onclose = () => console.log("[WebSocket] Disconnected");
    ws.onerror = (err) => console.error("[WebSocket] Error:", err);
  }

  return ws;
}