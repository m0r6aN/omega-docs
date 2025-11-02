# Environment Examples (.env)

Minimal, gateway-first configuration for local development and Azure alignment. Use base URLs to derive endpoints and publish portless identities.

## Local Development (Docker + nginx gateway)

```dotenv
# --- Public identities (portless)
AGENT_PUBLIC_BASE=http://gateway/api
TITAN_PUBLIC_BASE=http://gateway/api/titans

# --- Agent registry base (derives register/heartbeat)
AGENT_REGISTRY_BASE=http://gateway/api/core/agent_registry

# --- Optional: direct service URLs (legacy / internal)
FEDERATION_CORE_URL=http://federation_core:9405
AGENT_REGISTRY_URL=http://agent_registry:9401
MCP_REGISTRY_URL=http://mcp_registry:9402
```

Verification (examples):

```bash
curl -sf http://localhost:8080/api/core/agent_registry/health
curl -sf http://localhost:8080/api/titans/claude/health
```

## Azure (Application Gateway)

Swap only the base values to your AGW listener path structure. No code changes required.

```dotenv
# Example Azure AGW listener base (adjust host/paths to your environment)
AGENT_PUBLIC_BASE=https://omega.your-domain.com/api
TITAN_PUBLIC_BASE=https://omega.your-domain.com/api/titans
AGENT_REGISTRY_BASE=https://omega.your-domain.com/api/core/agent_registry
```

Tips:
- Publish identities without ports using AGENT_PUBLIC_BASE / TITAN_PUBLIC_BASE
- Registration and heartbeat derive from AGENT_REGISTRY_BASE
- Keep legacy direct URLs for internal diagnostics only



---

## See also
- Developer → Configuration → [Identities and Routing](/docs/developer/config/identities-and-routing)
- Operations → [Gateway Ingress and Portless Identities](/docs/operations/gateway-ingress)
