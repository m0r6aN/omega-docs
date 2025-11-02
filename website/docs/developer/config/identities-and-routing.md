# Identities and Routing: Base URLs + Gateway

Configure portless public identities and derive endpoints from base URLs.

## Keys
- AGENT_REGISTRY_BASE: Base for register/heartbeat
- AGENT_PUBLIC_BASE: Preferred agent public identity
- TITAN_PUBLIC_BASE: Preferred titan public identity (fallback to AGENT_PUBLIC_BASE)

## Derived Endpoints
- Register: {AGENT_REGISTRY_BASE}/register/agent
- Heartbeat: {AGENT_REGISTRY_BASE}/heartbeat/agent

## Public Identity (Portless)
- Use TITAN_PUBLIC_BASE or AGENT_PUBLIC_BASE to publish identity without ports.
- Example: http://gateway/api/titans/claude

## Local Gateway Parity
- External: http://localhost:8080/
- Internal DNS: http://gateway/
- Paths: /api/core/agent_registry, /api/titans/{titan}

## Quick Verification
```bash
curl -sf http://localhost:8080/api/titans/claude/health
curl -sf http://localhost:8080/api/core/agent_registry/health
```


## Gateway Identities vs. Direct Ports

| Aspect | Gateway-First (Recommended) | Direct Ports (Legacy/Debug) |
|---|---|---|
| URL Shape | http://gateway/api/titans/claude | http://claude_titan:9600 |
| Public Identity | Portless via AGENT_PUBLIC_BASE/TITAN_PUBLIC_BASE | Includes host:port, not stable |
| Register/Heartbeat | Derived from AGENT_REGISTRY_BASE | Hardcoded URLs, per-service |
| Azure Migration | Swap BASE only (zero-rework) | Refactor URLs in code/config |
| Use Case | Default for local + cloud parity | Local debugging of a single container |


## Migration to Azure AGW
Swap only the BASE to the AGW listener path; no code changes.



---

## See also
- Operations → [Gateway Ingress and Portless Identities](/docs/operations/gateway-ingress)
- Developer → Configuration → [Environment Examples (.env)](/docs/developer/config/env-examples)
