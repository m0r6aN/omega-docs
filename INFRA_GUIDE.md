# Infrastructure Guide (v1.0.0)

## Service Endpoints and Identity

Prefer base URLs for derived endpoints and stable, portless identities. Explicit URLs remain supported as fallback.

- Federation: `FEDERATION_CORE_URL`, WS: `FEDERATION_WS_URL`
- Registries (preferred): `AGENT_REGISTRY_BASE` → derives
  - Register: `{AGENT_REGISTRY_BASE}/register/agent`
  - Heartbeat: `{AGENT_REGISTRY_BASE}/heartbeat/agent`
  - Fallbacks: `AGENT_REGISTRY_URL`, `AGENT_HEARTBEAT_URL`
- Context Server: `CONTEXT_SERVER_URL` (no inline literals in code)
- Public Identity (no ports):
  - Titans: `TITAN_PUBLIC_BASE` (preferred) or `AGENT_PUBLIC_BASE`
  - Agents: `AGENT_PUBLIC_BASE` (preferred) or `AGENT_HOST` (fallback)
- Local Gateway (dev):
  - Internal DNS: `http://gateway/`
  - External: `http://localhost:8080/`
  - Paths: `/api/core/agent_registry`, `/api/titans/{titan}`

## Observability

- **Prometheus**: push/pull via `PROMETHEUS_URL` :contentReference[oaicite:16]{index=16}  
- **Log Level**: `LOG_LEVEL`, log file optional (`LOG_FILE`) :contentReference[oaicite:17]{index=17}

## Data Plane

- **Redis**: `REDIS_URL` (preferred) or `REDIS_HOST`/`REDIS_PORT`; channels are configured (`REDIS_CHANNEL_*`) for federation & feedback. :contentReference[oaicite:18]{index=18}  
- **Mongo**: `MONGODB_URI` for memory provider. :contentReference[oaicite:19]{index=19}

## Health & Remediation

- **Praetorian Guard** checks Redis/Mongo/Federation/Context and can remediate. Configure via env; do not hardcode URLs; uses control tools for start/stop/force checks. :contentReference[oaicite:20]{index=20}
- Genesis Health Sentinel thresholds are set via env (restart windows, retries, timeouts). :contentReference[oaicite:21]{index=21}
