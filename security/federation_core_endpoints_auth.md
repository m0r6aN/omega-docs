# 🔱 OMEGA Federation Core - Endpoints & Authentication Guide

## Overview

This document provides a comprehensive guide to the federation_core service's WebSocket/REST endpoints and authentication mechanisms. Enhanced with egress controls, prompt firewall integration, WebSocket hardening, ingress validation, secrets hygiene, and runtime safety measures for impenetrable security.

## 📍 Service Information

- **Service Name**: `federation_core`
- **Port**: `9405`
- **Host**: `federation_core` (container) / `localhost` (dev)
- **Base URL**: `http://federation_core:9405`
- **MCP Server Port**: `9405` (same as main service)

## 🌐 REST Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `GET` | `/mcp` | Public MCP server information |

### Authenticated REST Endpoints

| Method | Endpoint | Required Role | Description |
|--------|----------|---------------|-------------|
| `GET` | `/metrics` | `operator` | Prometheus metrics |
| `POST` | `/collaboration/start` | `viewer` | Start a new collaboration (payload validated via Prompt Firewall) |

### MCP Endpoints (Sub-mounted at `/mcp`)

| Method | Endpoint | Required Role | Description |
|--------|----------|---------------|-------------|
| `POST` | `/mcp/tools/invoke` | `viewer` | Invoke MCP tools (guarded by tool schema validation and egress policy) |
| `GET` | `/mcp/info` | None | Public MCP server info |
| `GET` | `/mcp/resources/prompts/{name}` | `viewer` | Get prompt resources (sanitized outputs) |
| `GET` | `/mcp/resources/policies/{name}` | `operator` | Get policy resources |
| `GET` | `/mcp/resources/list` | `viewer` | List available resources |

## ⚡ WebSocket Endpoints

### General Federation Stream

- **Endpoint**: `/ws`
- **Authentication**: JWT token via query parameter (per-message re-validation)
- **Required Role**: `viewer`
- **Usage**: `ws://federation_core:9405/ws?token=<jwt_token>`
- **Purpose**: Real-time federation status updates and collaboration events
- **Hardening**: Message size caps (131072 bytes), rate limiting (per-IP), schema validation, origin allowlist

### Pantheon Council Stream

- **Endpoint**: `/ws/pantheon/{session_id}`
- **Authentication**: JWT token via query parameter (per-message re-validation)
- **Required Role**: `pantheon`
- **Usage**: `ws://federation_core:9405/ws/pantheon/session_123?token=<jwt_token>`
- **Purpose**: Real-time Pantheon Council debate streaming
- **Hardening**: Same as above, plus close-on-violation with structured logging

## 🔐 Authentication

### REST Authentication

**Header Format**:

# 🔱 OMEGA Federation Core - Endpoints & Authentication Guide

## Overview

This document provides a comprehensive guide to the federation_core service's WebSocket/REST endpoints and authentication mechanisms. Enhanced with egress controls, prompt firewall integration, WebSocket hardening, ingress validation, secrets hygiene, and runtime safety measures for impenetrable security.

## 📍 Service Information

- **Service Name**: `federation_core`
- **Port**: `9405`
- **Host**: `federation_core` (container) / `localhost` (dev)
- **Base URL**: `http://federation_core:9405`
- **MCP Server Port**: `9405` (same as main service)

## 🌐 REST Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `GET` | `/mcp` | Public MCP server information |

### Authenticated REST Endpoints

| Method | Endpoint | Required Role | Description |
|--------|----------|---------------|-------------|
| `GET` | `/metrics` | `operator` | Prometheus metrics |
| `POST` | `/collaboration/start` | `viewer` | Start a new collaboration (payload validated via Prompt Firewall) |

### MCP Endpoints (Sub-mounted at `/mcp`)

| Method | Endpoint | Required Role | Description |
|--------|----------|---------------|-------------|
| `POST` | `/mcp/tools/invoke` | `viewer` | Invoke MCP tools (guarded by tool schema validation and egress policy) |
| `GET` | `/mcp/info` | None | Public MCP server info |
| `GET` | `/mcp/resources/prompts/{name}` | `viewer` | Get prompt resources (sanitized outputs) |
| `GET` | `/mcp/resources/policies/{name}` | `operator` | Get policy resources |
| `GET` | `/mcp/resources/list` | `viewer` | List available resources |

## ⚡ WebSocket Endpoints

### General Federation Stream

- **Endpoint**: `/ws`
- **Authentication**: JWT token via query parameter (per-message re-validation)
- **Required Role**: `viewer`
- **Usage**: `ws://federation_core:9405/ws?token=<jwt_token>`
- **Purpose**: Real-time federation status updates and collaboration events
- **Hardening**: Message size caps (131072 bytes), rate limiting (per-IP), schema validation, origin allowlist

### Pantheon Council Stream

- **Endpoint**: `/ws/pantheon/{session_id}`
- **Authentication**: JWT token via query parameter (per-message re-validation)
- **Required Role**: `pantheon`
- **Usage**: `ws://federation_core:9405/ws/pantheon/session_123?token=<jwt_token>`
- **Purpose**: Real-time Pantheon Council debate streaming
- **Hardening**: Same as above, plus close-on-violation with structured logging

## 🔐 Authentication

### REST Authentication

**Header Format**:
Authorization: Bearer <jwt_token>

**Implementation** (enhanced with per-request validation and audit):

```python
def require_bearer(authorization: str = Header(None), required_role: str = "viewer"):
    """Enhanced bearer token authentication with JWT validation and RBAC"""
```

### WebSocket Authentication

Query Parameter Format:
?token=<jwt_token>

### Implementation

```python
async def authenticate_websocket(websocket: WebSocket, required_role: str = "viewer") -> Dict[str, Any]:
    """Enhanced WebSocket authentication with JWT validation and RBAC"""
```

### 🔑 Role Hierarchy

Role,Level,Permissions
viewer,1,"Basic access - view status, start collaborations"
operator,2,"Advanced access - metrics, policies"
pantheon,3,Divine access - Pantheon Council streams

### 🛡️ Security Features

#### Rate Limiting

HTTP: Per-IP rate limiting via middleware
WebSocket: Connection limits per IP
JWT: Token bucket rate limiting

### CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # From ALLOWED_ORIGINS env var
    allow_credentials=False,        # Never allow credentials
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Signature", "X-Request-ID"]
)
```

Security Headers (Enhanced CSP without 'unsafe-inline')

X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security (HTTPS only)

Egress Policy

Outbound requests guarded by GuardedClient (blocks private IPs, caps sizes/timeouts)

Prompt Firewall

Integrated for LLM/tool inputs/outputs (sanitization, schema validation, PII masking)

Ingress Hardening

Max body size (5MB), path normalization, method allowlists, CSRF tokens for browser APIs

Secrets & Logging

Scrubbed in logs (PII/secrets masked), structured JSON with req IDs

🔌 Usage Examples
REST API Call

```bash
curl -H "Authorization: Bearer <jwt_token>" \
     -H "Content-Type: application/json" \
     -X POST http://federation_core:9405/collaboration/start \
     -d '{"mission_name": "test", "description": "Test collaboration"}'
```

### WebSocket Connection

```javascript
const ws = new WebSocket('ws://federation_core:9405/ws?token=<jwt_token>');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Federation update:', data);
};
```

### MCP Tool Invocation

```bash
curl -H "Authorization: Bearer <jwt_token>" \
     -H "Content-Type: application/json" \
     -X POST http://federation_core:9405/mcp/tools/invoke \
     -d '{"name": "get_federation_status", "parameters": {}}'
```

### 📋 Environment Variables

Variable,Default,Description
PORT,9405,Service port
JWT_SECRET,-,JWT signing secret
JWT_ALGORITHM,HS256,JWT algorithm
JWT_AUDIENCE,omega-federation,JWT audience
ALLOWED_ORIGINS,-,CORS allowed origins
ALLOWED_HOSTS,*,Trusted hosts
MAX_WS_BYTES,131072,Max WebSocket message size
OMEGA_CHANNEL_SALT,default_salt,Redis channel salt
EGRESS_ALLOWLIST,"federation_core,agent_registry,context_server",Outbound host allowlist

### 🔗 Related Services

- Agent Registry: http://agent_registry:9401
- MCP Registry: http://mcp_registry:9402
- Context Server: http://context_server:9411
