# Infrastructure Guide (v1.0.0)

## Service Endpoints

These are provided via env (Docker service DNS inside the network):

- Federation: `FEDERATION_CORE_URL`, WS: `FEDERATION_WS_URL` :contentReference[oaicite:13]{index=13}  
- Registries: `AGENT_REGISTRY_URL`, `AGENT_HEARTBEAT_URL`, MCP registry + heartbeat :contentReference[oaicite:14]{index=14}  
- Context Server: `CONTEXT_SERVER_URL` (no inline literals in code) :contentReference[oaicite:15]{index=15}  

## Observability

- **Prometheus**: push/pull via `PROMETHEUS_URL` :contentReference[oaicite:16]{index=16}  
- **Log Level**: `LOG_LEVEL`, log file optional (`LOG_FILE`) :contentReference[oaicite:17]{index=17}

## Data Plane

- **Redis**: `REDIS_URL` (preferred) or `REDIS_HOST`/`REDIS_PORT`; channels are configured (`REDIS_CHANNEL_*`) for federation & feedback. :contentReference[oaicite:18]{index=18}  
- **Mongo**: `MONGODB_URI` for memory provider. :contentReference[oaicite:19]{index=19}

## Health & Remediation

- **Praetorian Guard** checks Redis/Mongo/Federation/Context and can remediate. Configure via env; do not hardcode URLs; uses control tools for start/stop/force checks. :contentReference[oaicite:20]{index=20}
- Genesis Health Sentinel thresholds are set via env (restart windows, retries, timeouts). :contentReference[oaicite:21]{index=21}
