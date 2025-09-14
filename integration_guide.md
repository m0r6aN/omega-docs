# SWARM DASHBOARD INTEGRATION GUIDE v1.0

> **OMEGA Doctrine Compliance:** Unified v1.0 Architecture – Decentralized, Self-Healing, Event-Driven.  
> **Version:** 1.0 (Aligned with Backend Updates – Real-Time Streams, Aggregated Status, MCP Triggers).  
> **Motto:** *“Our superpositions have not yet been determined, therefore we are not responsible for anything you may observe.”*  

## Overview

This integration guide bridges our frontend (with hooks like `use-omega.ts`, `use-workflow-execution.ts`) to the enhanced backend services: **Orchestrator**, **Federation Core**, **Context Server**, and **WebSocket Service**. Key upgrades include:

- **Aggregated Ecosystem Intel:** Pull full swarm status (agents, titans, tools, health, down components) from a single endpoint.
- **MCP Triggers:** POST endpoints for genesis, mode toggles, and resurrections—secured with admin token.
- **Live Streams:** WebSocket channels for telemetry (metrics/updates) and events (healing, genesis, toggles)—broadcast in real-time over Redis.
- **Event Logs:** Pollable `/events` for fallback or historical telemetry.
- **Auth Layer:** Basic bearer token for admin actions (env: `ADMIN_TOKEN`).

All endpoints are Docker-exposed (e.g., Orchestrator on 9000, Federation on 9405, WebSocket on 9407). Use our `use-mcp.ts` or `use-omega.ts` hooks to consume—extend them for new data shapes.

## API Endpoints

Base URLs (from docker-compose):
- Orchestrator: `http://localhost:9000` (or internal: `http://orchestrator:9000`)
- Federation Core: `http://localhost:9405`
- Context Server: `http://localhost:9411`
- WebSocket: `ws://localhost:9407/ws`

### 1. Ecosystem Status (Aggregated Swarm Intel)
   - **Endpoint:** `GET /ecosystem_status` (Orchestrator – pulls from Federation/Context/Registries)
   - **Description:** Real-time snapshot: agents/titans/tools online, down components, health metrics, neural/sovereign modes, praetorian status. Use for Swarm Map population and Status Bar aggregates.
   - **Params:** None (optional: `?detail=true` for verbose metrics).
   - **Response (JSON):**
     ```json
     {
       "status": "operational" | "degraded",
       "sovereign_active": true,
       "neural_orchestration": true,
       "praetorian_control": true,
       "down_agents": ["claude_titan"],
       "agents_online": 15,
       "titans": [{"name": "gpt_titan", "status": "online", "load": 0.3}],
       "tools_available": 13,
       "services_active": 7,
       "neural_metrics": {"efficiency": 0.95},
       "praetorian_guard": {"status": "operational"},
       "federation_health": {"redis_connected": true},
       "auto_genesis_triggered": ["claude_titan"]  // If auto-heal fired
     }
     ```
   - **Integration Tip:** Poll every 10s via `useSWR` or `react-query` in `use-omega.ts`. Feed into `AgentNetworkGraph` for nodes/edges (e.g., color nodes red if down). Update Status Bar with aggregates (online/down counts).
   - **Error Handling:** On "degraded", show alert banner: "Swarm healing in progress..."

### 2. Trigger Genesis Protocol
   - **Endpoint:** `POST /trigger_genesis` (Orchestrator – sovereign-exposed)
   - **Description:** Launch agent creation/resurrection. Use from MCP Action Panel for "Spawn New Agent" or auto-heal buttons.
   - **Params (JSON Body):**
     ```json
     {
       "agent_type": "claude_titan",  // Required
       "capabilities": ["strategic_planning"]  // Optional
     }
     ```
   - **Response:**
     ```json
     {
       "genesis_protocol": "triggered",
       "agent_type": "claude_titan",
       "success": true,
       "sovereign_authority": true
     }
     ```
   - **Integration Tip:** Button in MCP Panel → POST via `fetch` or axios in `tool-caller.tsx`. On success, toast "Genesis Initiated!" and refresh ecosystem_status. Listen for "genesis_triggered" event on WebSocket for confirmation.

### 3. Toggle Modes (Sovereign/Neural)
   - **Endpoint:** `POST /toggle_sovereign_mode` or `/toggle_neural_mode` (Orchestrator)
   - **Description:** Runtime mode switches. Use switches in MCP Panel.
   - **Params (JSON Body):**
     ```json
     {
       "enable": true  // Boolean
     }
     ```
   - **Response:**
     ```json
     {
       "status": "toggled",
       "sovereign_mode": true,  // Or neural_orchestration
       "authority": "supreme"
     }
     ```
   - **Integration Tip:** Toggle UI component → POST. Refresh status post-toggle. WebSocket will push "mode_toggle" event for live updates.

### 4. Resurrect Agent
   - **Endpoint:** `POST /resurrect_agent` (Orchestrator – proxies to Praetorian)
   - **Description:** Force-resurrect a down agent/titan. Button in Swarm Map (e.g., on red nodes).
   - **Params (JSON Body):**
     ```json
     {
       "agent_id": "claude_titan"
     }
     ```
   - **Response:**
     ```json
     {
       "resurrection": "success",
       "agent_id": "claude_titan"
     }
     ```
   - **Integration Tip:** Context menu on graph nodes → POST. WebSocket "agent_resurrected" event confirms.

### 5. Get Events/Logs
   - **Endpoint:** `GET /events?limit=50` (Federation Core – fallback to WebSocket)
   - **Description:** Recent events (healing, genesis, toggles, failures) for Event Feed component.
   - **Params:** `limit` (int, default 50).
   - **Response:**
     ```json
     [
       {
         "type": "genesis_triggered",
         "timestamp": "2025-07-16T12:00:00Z",
         "payload": {"agent_type": "claude_titan", "success": true}
       },
       ...
     ]
     ```
   - **Integration Tip:** Poll on load or use as fallback if WebSocket drops. Feed into LogStream for display.

### 6. Federation Status (Detailed)
   - **Endpoint:** `GET /status` (Federation Core – titan-specific)
   - **Description:** Titan health/load for detailed views.
   - **Response:** As in code (titans array with status/load/performance).
   - **Integration Tip:** Use in agent drilldown pages.

## WebSocket Integration

- **Endpoint:** `ws://localhost:9407/ws` (Secure: add token query `?token=ADMIN_TOKEN` for admin).
- **Channels (Redis-subscribed, auto-broadcast):**
  - **omega:telemetry:** Metrics/updates (e.g., {"type": "telemetry_update", "payload": {status data}}). Use for real-time graph pulses (node colors, loads).
  - **omega:events:** System events (e.g., {"type": "system_event", "payload": {event data}}). Stream to Event Feed: resurrections ("agent_resurrected"), genesis ("genesis_triggered"), modes ("mode_toggle"), degradations ("swarm_degraded").
- **Message Format:** All messages tagged with "type" for easy filtering in `use-workflow-execution.ts` or custom hook.
- **Integration Tip:** In `use-omega.ts`, connect WebSocket on mount, subscribe to channels. Dispatch to Redux/context for global updates. Handle reconnects with exponential backoff.
- **Auth:** For admin (triggers), pass `?token=ADMIN_TOKEN`—server verifies before allowing sensitive broadcasts.

## Testing & Fire Drills

- **Simulate Degradation:** `docker stop claude_titan` → Watch /ecosystem_status show "degraded", down_agents include it, auto_genesis_triggered fires. WebSocket pushes "swarm_degraded" then "genesis_triggered"/"agent_resurrected".
- **Trigger Genesis:** POST to /trigger_genesis → Event stream: "genesis_triggered".
- **Toggle Modes:** POST toggles → Event: "mode_toggle" → Refresh status shows change.
- **Resurrect:** Kill container, POST /resurrect_agent → Stream: "agent_resurrected".
- **Fallbacks:** If WebSocket down, poll /events and /ecosystem_status every 5s.

## Best Practices & Tips

- **Hooks Extension:** Add `useSwarmStatus` wrapping `useSWR('/ecosystem_status')` for graph/ bar.
- **Error Resilience:** On API errors, fallback to cached/local state, show "Swarm Syncing...".
- **Visuals:** Use Framer Motion for graph animations on updates (e.g., node pulse on resurrection).
- **Security:** All admin POSTs require token—set via env in frontend fetch headers.
- **Scalability:** WebSocket handles 1000+ connections; use Redis pub/sub for broadcast efficiency.
