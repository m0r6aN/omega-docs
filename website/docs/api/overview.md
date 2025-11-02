# API Reference Overview

Complete API documentation for the OMEGA multi-agent orchestration platform.

## 🎯 API Categories

The OMEGA API is organized into the following categories:

### 1. Core APIs

- [Agent API](/docs/intro) - Agent lifecycle, task execution, status
- [Tool API](/docs/intro) - Tool registration, invocation, discovery
- [Router API](/docs/intro) - Request routing, agent selection

### 2. Communication APIs

- [MCP API](/docs/intro) - Model Context Protocol endpoints
- [A2A API](/docs/intro) - Agent-to-Agent communication
- [FastMCP API](/docs/intro) - Federation and service discovery

### 3. Management APIs

- [Registry API](/docs/intro) - Service registration and discovery
- [Config API](/docs/intro) - Configuration management
- [Health API](/docs/intro) - Health checks and monitoring

### 4. Data APIs

- [Memory API](/docs/intro) - Memory storage and retrieval
- [Context API](/docs/intro) - Context management
- [Telemetry API](/docs/intro) - Metrics and observability

---

## 🔑 Authentication

All OMEGA API endpoints support Bearer token authentication:

```http
Authorization: Bearer <your-api-key>
```

### Get API Key

```bash
curl -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-password"}'
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

## 🌐 Base URLs

### Development
```
http://localhost:8080/api/v1
```

### Staging
```
https://staging-api.omega.dev/api/v1
```

### Production
```
https://api.omega.dev/api/v1
```

---

## 📝 Request Format

All requests use JSON content type:

```http
POST /api/v1/agents/execute
Content-Type: application/json
Authorization: Bearer <token>

{
  "agent_id": "code_generator",
  "task": {
    "type": "generate_code",
    "language": "python",
    "requirements": "Create FastAPI hello world"
  }
}
```

---

## 📤 Response Format

### Success Response

```json
{
  "status": "success",
  "data": {
    "task_id": "abc123",
    "result": "..."
  },
  "meta": {
    "request_id": "req_xyz789",
    "timestamp": "2025-05-25T14:30:00Z",
    "version": "1.0.0"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_AGENT",
    "message": "Agent 'unknown_agent' not found",
    "details": {
      "agent_id": "unknown_agent",
      "available_agents": ["code_generator", "prompt_optimizer"]
    }
  },
  "meta": {
    "request_id": "req_xyz789",
    "timestamp": "2025-05-25T14:30:00Z"
  }
}
```

---

## ⚡ Quick Start Examples

### Execute Agent Task

```bash
curl -X POST http://localhost:8080/api/v1/agents/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "agent_id": "code_generator",
    "task": {
      "type": "generate_code",
      "language": "python"
    }
  }'
```

### Discover Tools

```bash
curl http://localhost:8080/api/v1/tools/discover \
  -H "Authorization: Bearer <token>"
```

### Call Tool

```bash
curl -X POST http://localhost:8080/api/v1/tools/invoke \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "tool_id": "calculator",
    "operation": "add",
    "params": {"a": 5, "b": 3}
  }'
```

---

## 📊 Rate Limits

| Tier | Requests/minute | Burst |
|------|----------------|-------|
| **Free** | 60 | 10 |
| **Pro** | 600 | 100 |
| **Enterprise** | 6000 | 1000 |

Rate limit headers included in responses:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1621234567
```

---

## 🔄 Pagination

List endpoints support cursor-based pagination:

```bash
curl "http://localhost:8080/api/v1/agents?limit=20&cursor=eyJpZCI6MTIzfQ"
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "next_cursor": "eyJpZCI6MTQzfQ",
    "has_more": true,
    "total": 156
  }
}
```

---

## 🔍 Filtering & Searching

### Filter by Capabilities

```bash
curl "http://localhost:8080/api/v1/agents?capability=code_generation"
```

### Search by Name

```bash
curl "http://localhost:8080/api/v1/tools?search=calculator"
```

### Multiple Filters

```bash
curl "http://localhost:8080/api/v1/agents?capability=analysis&status=active&tag=production"
```

---

## 🛡️ Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_REQUEST` | Malformed request body | 400 |
| `UNAUTHORIZED` | Missing or invalid auth token | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `RATE_LIMIT` | Rate limit exceeded | 429 |
| `INTERNAL_ERROR` | Server error | 500 |
| `SERVICE_UNAVAILABLE` | Service temporarily down | 503 |

---

## 🔔 Webhooks

Subscribe to events via webhooks:

### Register Webhook

```bash
curl -X POST http://localhost:8080/api/v1/webhooks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "url": "https://your-app.com/webhook",
    "events": ["agent.completed", "tool.failed"],
    "secret": "your-webhook-secret"
  }'
```

### Webhook Payload

```json
{
  "event": "agent.completed",
  "data": {
    "agent_id": "code_generator",
    "task_id": "abc123",
    "result": "..."
  },
  "timestamp": "2025-05-25T14:30:00Z",
  "signature": "sha256=..."
}
```

---

## 🧪 Testing & SDKs

### Official SDKs

- [Python SDK](https://github.com/omega-framework/omega-python)
- [TypeScript SDK](https://github.com/omega-framework/omega-ts)
- [Go SDK](https://github.com/omega-framework/omega-go)

### Postman Collection

Download the [OMEGA API Postman Collection](https://omega.dev/postman) for interactive testing.

### OpenAPI Spec

Full OpenAPI 3.0 specification available at:
```
http://localhost:8080/api/v1/openapi.json
```

---

## 📚 API Categories

### Core APIs
- [Agent API](/docs/intro) - Agent management and execution
- [Tool API](/docs/intro) - Tool registration and invocation
- [Router API](/docs/intro) - Intelligent request routing

### Communication
- [MCP API](/docs/intro) - Model Context Protocol
- [A2A API](/docs/intro) - Agent-to-Agent communication
- [FastMCP API](/docs/intro) - Federation directory

### Management
- [Registry API](/docs/intro) - Service registry
- [Config API](/docs/intro) - Configuration
- [Health API](/docs/intro) - Health monitoring

### Data
- [Memory API](/docs/intro) - Memory storage
- [Context API](/docs/intro) - Context management
- [Telemetry API](/docs/intro) - Observability

---

## 🆘 Support

- **Documentation:** [docs.omega.dev](https://docs.omega.dev)
- **API Status:** [status.omega.dev](https://status.omega.dev)
- **Community:** [discord.gg/omega](https://discord.gg/omega)
- **Issues:** [github.com/omega-framework/omega/issues](https://github.com/omega-framework/omega/issues)

---

**🏛️ Build powerful multi-agent systems with the OMEGA API.**
