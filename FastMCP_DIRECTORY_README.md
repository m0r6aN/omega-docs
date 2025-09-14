# OMEGA • FastMCP Directory (federation_core)

## 🔱 Overview

The OMEGA FastMCP Directory is a streamlined, production-ready service discovery system integrated directly into the Federation Core. It provides FastMCP Resources for discovery and minimal registry endpoints for member lifecycle management.

### Key Features

- **FastMCP Resources**: Discovery endpoints that work over HTTP tunnels
- **Registry API**: Member lifecycle management (register/heartbeat/unregister)
- **Lightweight Architecture**: Focused, minimal, no tool proxying
- **Security Framework**: Manifest signing with HMAC-SHA256 (upgradeable to JWS)
- **Production Ready**: Docker Compose, health checks, monitoring

## 🚀 Quick Start

### 1. Start the Federation Core with FastMCP Directory

```bash
cd ops
make -f Makefile.fastmcp.core up
```

This will:
- Start Federation Core on port 9405 with integrated FastMCP Directory
- Initialize MongoDB and Redis for persistence
- Set up health checks and monitoring

### 2. Verify the deployment

```bash
# Check all services are healthy
make -f Makefile.fastmcp.core health

# List registered servers (should be empty initially)
make -f Makefile.fastmcp.core list

# View all available commands
make -f Makefile.fastmcp.core help
```

## 📡 API Endpoints

### FastMCP Resources (Discovery)

All resources are available at `/mcp/resources/` prefix:

- **`GET /mcp/resources/omega/directory/servers`** — List all servers
  - Query params: `tag`, `capability`, `q` (search), `page`, `limit`
  - Returns paginated list with signed manifests

- **`GET /mcp/resources/omega/directory/servers/{id}`** — Get specific server
  - Returns single signed manifest

- **`GET /mcp/resources/omega/directory/tags`** — List all available tags
  - Returns tag taxonomy across all servers

- **`GET /mcp/resources/omega/directory/search`** — Search helper
  - Query params: `q`, `tag`, `capability`
  - Convenience endpoint for complex searches

### Registry API (Member Lifecycle)

- **`POST /servers/register`** — Register/update server manifest
- **`POST /servers/heartbeat`** — Update heartbeat timestamp
- **`DELETE /servers/{id}`** — Unregister server
- **`GET /servers/status`** — Registry statistics and health

## 🧪 Testing & Examples

### Register a Test Server

```bash
curl -s -X POST http://localhost:9405/servers/register \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "my_analyzer",
    "display_name": "My Code Analyzer",
    "description": "Custom code analysis service",
    "endpoints": {
      "mcp": "http://my-analyzer:9501",
      "health": "http://my-analyzer:9501/health"
    },
    "tools": [
      {"name": "analyze_code", "endpoint": "http://my-analyzer:9501/analyze"}
    ],
    "tags": ["code", "analysis", "custom"],
    "version": "1.0.0"
  }' | jq
```

### Discover Servers

```bash
# List all servers
curl -s http://localhost:9405/mcp/resources/omega/directory/servers | jq

# Search by tag
curl -s 'http://localhost:9405/mcp/resources/omega/directory/search?tag=code' | jq

# Search by text
curl -s 'http://localhost:9405/mcp/resources/omega/directory/search?q=analyzer' | jq

# Get specific server
curl -s http://localhost:9405/mcp/resources/omega/directory/servers/my_analyzer | jq
```

### Send Heartbeat

```bash
curl -s -X POST http://localhost:9405/servers/heartbeat \
  -H 'Content-Type: application/json' \
  -d '{"id": "my_analyzer"}' | jq
```

### Check Registry Status

```bash
curl -s http://localhost:9405/servers/status | jq
```

## 🏗️ Architecture

### Integration with Federation Core

The FastMCP Directory is integrated directly into the existing Federation Core service:

```
┌─────────────────┐    ┌──────────────────────────────┐
│   MCP Client    │    │      Federation Core        │
│ (Claude/Code)   │◄──►│  ┌─────────────────────────┐ │
└─────────────────┘    │  │   FastMCP Directory     │ │
                       │  │  /mcp/resources/...     │ │
                       │  └─────────────────────────┘ │
                       │  ┌─────────────────────────┐ │
                       │  │    Registry API         │ │
                       │  │  /servers/...           │ │
                       │  └─────────────────────────┘ │
                       │  ┌─────────────────────────┐ │
                       │  │   Existing MCP Server   │ │
                       │  │  /mcp/tools/...         │ │
                       │  └─────────────────────────┘ │
                       └──────────────────────────────┘
```

### Data Flow

1. **Member Registration**: Services register themselves via `/servers/register`
2. **Heartbeat Maintenance**: Services send periodic heartbeats via `/servers/heartbeat`
3. **Discovery**: Clients query FastMCP resources to discover available services
4. **Direct Connection**: Clients connect directly to discovered services (no proxying)

## 🔧 Development

### Local Development

```bash
# Start services
make -f ops/Makefile.fastmcp.core up

# View logs
make -f ops/Makefile.fastmcp.core logs

# Run tests
make -f ops/Makefile.fastmcp.core test

# Debug issues
make -f ops/Makefile.fastmcp.core debug

# Stop services
make -f ops/Makefile.fastmcp.core down
```

### Configuration

Environment variables (set in `ops/.env.fastmcp.example`):

- `FED_DIR_SIGNING_SECRET`: Secret for manifest signing (change in production!)
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection string
- `LOG_LEVEL`: Logging verbosity

## 🛡️ Security

### Manifest Signing

All server manifests are signed with HMAC-SHA256:

```python
def sign_manifest(payload: Dict) -> str:
    msg = (payload.get("id", "") + "|" + payload.get("version", "") + "|" + str(payload.get("cache_ttl_seconds", 60))).encode()
    mac = hmac.new(SIGNING_SECRET.encode(), msg, hashlib.sha256).digest()
    return base64.urlsafe_b64encode(mac).decode().rstrip("=")
```

### Production Security Enhancements

For production deployment:

1. **Replace HMAC with JWS**: Use PyJWT with KMS-backed keys
2. **Implement mTLS**: Add mutual TLS authentication at ingress
3. **Add RBAC/ABAC**: Per-tenant access controls and rate limiting
4. **Audit Logging**: Comprehensive security event logging
5. **Secret Management**: Use proper secret management (Vault, K8s secrets)

## 📊 Production Deployment

### Persistence

Replace in-memory `SERVERS` dict with MongoDB/Redis:

```python
# Example MongoDB integration
async def get_servers():
    db = connection_manager.get_mongodb()
    servers_collection = db["federation_servers"]
    return await servers_collection.find({}).to_list(None)
```

### Monitoring

Add OpenTelemetry metrics and spans:

- Discovery call metrics
- Registration success/failure rates
- Heartbeat frequency and health
- Response time distributions

### Scaling

- Use Redis for distributed caching
- Implement horizontal scaling with load balancers
- Add circuit breakers for external service calls

## 🔱 OMEGA Integration

The FastMCP Directory seamlessly integrates with the OMEGA ecosystem:

- **Coexists** with existing MCP server at `/mcp/tools/`
- **Extends** Federation Core without breaking existing functionality
- **Follows** OMEGA security and architectural patterns
- **Supports** the immortal swarm with self-registering services

**This is the way.** 🏛️
