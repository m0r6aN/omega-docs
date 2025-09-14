# OMEGA FastMCP Federation Directory • Usage Guide

## Overview

The OMEGA FastMCP Federation Directory provides a production-ready skeleton for:

1. **Federation Core** as a FastMCP Resource server (the "yellow pages")
2. **Member Services** as FastMCP Tool servers (edge actions)
3. **Registry endpoints** (register/heartbeat/unregister) inside Federation Core
4. **Security stubs** (mTLS hooks, JWS signing) and DX helpers

## Quick Start

### 1. Bring the directory and member services online:

```bash
cd ops
make -f Makefile.fastmcp up
```

This will:
- Start Federation Core on port 9405
- Start Code Analyzer on port 9501
- Initialize MongoDB and Redis
- Auto-register the code analyzer with the directory

### 2. Discover servers via FastMCP Resource (HTTP tunnel):

```bash
curl -s http://localhost:9405/mcp/resources/omega/directory/servers | jq
```

### 3. Get a specific server manifest:

```bash
curl -s http://localhost:9405/mcp/resources/omega/directory/servers/code_analyzer_fastmcp | jq
```

### 4. Search servers by tag or capability:

```bash
# Search by tag
curl -s 'http://localhost:9405/mcp/resources/omega/directory/search?tag=code' | jq

# Search by capability
curl -s 'http://localhost:9405/mcp/resources/omega/directory/search?capability=repo.read' | jq
```

## Using the Code Analyzer Tools

### Analyze a Repository

```bash
curl -s -X POST http://localhost:9501/mcp/call/analyze_repo \
  -H 'Content-Type: application/json' \
  -d '{"repo_url": "https://github.com/your/repo"}' | jq
```

### Get Refactoring Suggestions

```bash
curl -s -X POST http://localhost:9501/mcp/call/refactor \
  -H 'Content-Type: application/json' \
  -d '{"code_snippet": "def hello():\n    print(\"world\")", "language": "python"}' | jq
```

### Security Scan

```bash
curl -s -X POST http://localhost:9501/mcp/call/security_scan \
  -H 'Content-Type: application/json' \
  -d '{"code_snippet": "import os\npassword = \"hardcoded\"", "language": "python"}' | jq
```

## Integration with Claude Desktop/Code

From your MCP client (Claude Desktop/Code), connect to Federation Core as a FastMCP server:

1. **Add to your MCP configuration:**
   ```json
   {
     "mcpServers": {
       "omega_federation": {
         "command": "curl",
         "args": ["-s", "http://localhost:9405/mcp/resources/omega/directory/servers"]
       }
     }
   }
   ```

2. **Call the resource** `omega/directory/servers` to list available services

3. **Pick a service** (e.g., `code_analyzer_fastmcp`) and open a new MCP connection to its `endpoints.mcp` URL

4. **Use the tools** exposed by that service

## Development Commands

```bash
# View all available commands
make -f ops/Makefile.fastmcp help

# Start services
make -f ops/Makefile.fastmcp up

# View logs
make -f ops/Makefile.fastmcp logs

# Check health
make -f ops/Makefile.fastmcp health

# Run integration tests
make -f ops/Makefile.fastmcp test

# Stop services
make -f ops/Makefile.fastmcp down

# Clean up everything
make -f ops/Makefile.fastmcp clean
```

## Local Development

Run services locally for development:

```bash
# Terminal 1: Federation Core
make -f ops/Makefile.fastmcp server

# Terminal 2: Code Analyzer
make -f ops/Makefile.fastmcp member
```

## Configuration

Copy and customize the environment file:

```bash
cp ops/.env.fastmcp.example ops/.env.fastmcp
# Edit ops/.env.fastmcp with your settings
```

Key configuration options:
- `FED_DIR_SIGNING_SECRET`: Secret for signing manifests (change in production!)
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection string
- `LOG_LEVEL`: Logging verbosity
- `FEDERATION_DIR_URL`: URL for member registration

## Security Considerations

### Production Deployment

1. **Replace `verify_mtls()`** with your mesh/ingress mTLS checks
2. **Rotate `FED_DIR_SIGNING_SECRET`** - replace HMAC with JWS (PyJWT) tied to your KMS
3. **Inject short-lived bearer tokens** + scopes in manifests when issuing to clients
4. **Implement `/servers/unregister`** on graceful shutdown hooks in members

### Security Features

- **Manifest Signing**: All server manifests are cryptographically signed
- **mTLS Support**: Stubs for mutual TLS authentication
- **Bearer Token Auth**: Token-based authentication for API access
- **Scope-based Authorization**: Fine-grained permission system

## Production Notes

### Persistence

- Back `SERVERS` dict with MongoDB/Redis for production
- Add indexes on `tags`, `security.scopes`, `telemetry.heartbeat_ts`
- Implement garbage collection: drop servers with stale heartbeats (`> 3 * interval`)

### Monitoring

- Add rate limits per IP/tenant on registry endpoints
- Emit OpenTelemetry spans/metrics for discovery calls and member heartbeats
- Set up health checks and alerting

### Scaling

- Use Redis for distributed caching
- Implement horizontal scaling with load balancers
- Add circuit breakers for external service calls

## Troubleshooting

### Services won't start
```bash
# Check container status
make -f ops/Makefile.fastmcp ps

# View logs
make -f ops/Makefile.fastmcp logs

# Debug information
make -f ops/Makefile.fastmcp debug
```

### Registration failures
- Check `FEDERATION_DIR_URL` environment variable
- Verify network connectivity between services
- Check federation core logs for registration attempts

### Tool calls failing
- Verify service is registered: `make -f ops/Makefile.fastmcp list`
- Check service health: `make -f ops/Makefile.fastmcp health`
- Validate request format matches expected schema

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Client    │    │  Federation Core │    │ Member Services │
│ (Claude/Code)   │◄──►│   (Directory)    │◄──►│ (Code Analyzer) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                         │
                              ▼                         ▼
                       ┌─────────────┐         ┌─────────────┐
                       │   MongoDB   │         │    Redis    │
                       │ (Manifests) │         │  (Caching)  │
                       └─────────────┘         └─────────────┘
```

The Federation Core acts as a discovery service, while member services provide actual functionality through FastMCP tool interfaces.
