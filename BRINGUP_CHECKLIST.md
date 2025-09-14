# OMEGA Core Bring-Up Checklist

This document provides the steps to bring up and verify the OMEGA Core services in a Windows Docker Desktop environment.

## 1. Prerequisites

- Docker Desktop for Windows installed and running.
- PowerShell or a compatible terminal.
- The repository cloned at `D:\repos\omega`.

## 2. Environment Setup

Ensure the `.env` file exists in the repository root (`D:\repos\omega`) with the following content:

```dotenv
# Core service URLs (Windows Docker; containers talk via service DNS)
FEDERATION_CORE_URL=http://federation_core:9405
AGENT_REGISTRY_URL=http://agent_registry:9401
MCP_REGISTRY_URL=http://mcp_registry:9402
CONTEXT_SERVER_URL=http://context_server:9411

# Legacy/Entity defaults (kept for compatibility)
FEDERATION_URL=http://federation_core:9405
REGISTRY_URL=http://agent_registry:9401

HEARTBEAT_INTERVAL=30
```

## 3. System Bring-Up

Navigate to the `core` directory and run the following commands in PowerShell:

```powershell
cd D:\repos\omega\core

docker compose pull
docker compose up -d --build
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
```

## 4. Post-Deployment Verification

Execute these commands to verify the health and status of the core services. All checks should pass without error.

### Federation Core
```powershell
# Check Federation Core health
curl -s http://localhost:9405/health

# Expected Output (example):
# {"status":"healthy","id":"federation_core","type":"service", ...}
```

### FastMCP Directory Resource
```powershell
# Check a directory resource on the Federation Core
curl -s http://localhost:9405/mcp/resources/omega/directory/servers

# Expected Output (example):
# A JSON object listing registered servers.
```

### Agent Registry
```powershell
# Check Agent Registry health
curl -s http://localhost:9401/agent_registry/health

# Expected Output (example):
# {"status":"healthy","service_id":"agent_registry", ...}
```

### Orchestrator Agent
```powershell
# Check the main app health for the orchestrator agent
curl -s http://localhost:9000/health

# Expected Output (example):
# {"status":"healthy","id":"orchestrator", ...}

# Check the MCP app health for the orchestrator agent
curl -s http://localhost:9001/mcp/health

# Expected Output (example):
# {"status":"healthy","id":"orchestrator","type":"mcp", ...}
```

### Example Tool Server
```powershell
# Check the health of a running tool server (if applicable)
curl -s http://localhost:9420/health

# Expected Output (example):
# {"status":"healthy","name":"ExampleTool","type":"tool", ...}
```

## 5. Acceptance Criteria

- All `docker compose` commands execute successfully.
- `docker ps` shows all core containers as running.
- All `curl` verification commands return a `200 OK` status with a JSON body indicating a `healthy` status.
- Federation Core's directory resource returns a non-empty list of registered servers.
- No `TypeError` or `NoneType` errors related to `REGISTRY_URL` appear in the logs for any `OmegaEntity`.
- Agent logs show successful heartbeats being sent to the registry.
