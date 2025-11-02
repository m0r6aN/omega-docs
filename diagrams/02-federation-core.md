# Federation Core Architecture

```mermaid
graph TB
    subgraph "External Clients"
        EXT1[External Agent]
        EXT2[Third-party Tool]
        EXT3[Remote Registry]
    end

    subgraph "Federation Core Service"
        API[REST API<br/>Port 9405]
        WS[WebSocket Server<br/>Real-time Events]
        
        subgraph "Core Components"
            DIR[FastMCP Directory<br/>Discovery Protocol]
            REG[Registry Manager<br/>Lifecycle Control]
            ROUTE[Intelligent Router<br/>Capability Matching]
            HEALTH[Health Manager<br/>SLO Monitoring]
        end

        subgraph "Security Layer"
            AUTH[Authentication<br/>JWT + Passport]
            SIGN[Manifest Signing<br/>HMAC-SHA256]
            MTLS[mTLS Validator<br/>Certificate Checks]
        end

        subgraph "Federation Logic"
            LOCAL[Local Registry<br/>Internal Agents]
            REMOTE[Remote Discovery<br/>External Registries]
            REP[Reputation Engine<br/>Quality Scoring]
            CB[Circuit Breaker<br/>Failure Isolation]
            CACHE[Smart Cache<br/>Hot Tool Storage]
        end
    end

    subgraph "Internal Services"
        AR[Agent Registry<br/>MongoDB]
        MR[MCP Registry<br/>Tool Catalog]
        CS[Context Server<br/>Intelligence]
        REDIS[(Redis<br/>Pub/Sub)]
    end

    subgraph "Agent Fleet"
        A1[Orchestrator]
        A2[Code Generator]
        A3[Capability Matcher]
        A4[Praetorian Guard]
    end

    %% External connections
    EXT1 --> API
    EXT2 --> API
    EXT3 --> REMOTE

    %% API routing
    API --> AUTH
    WS --> AUTH
    AUTH --> DIR
    AUTH --> REG
    AUTH --> ROUTE

    %% Security flow
    DIR --> SIGN
    REG --> MTLS
    ROUTE --> SIGN

    %% Federation logic
    DIR --> LOCAL
    DIR --> REMOTE
    ROUTE --> REP
    ROUTE --> CB
    REMOTE --> CACHE

    %% Internal service connections
    LOCAL --> AR
    LOCAL --> MR
    REG --> AR
    REG --> MR
    ROUTE --> CS
    HEALTH --> REDIS

    %% Agent connections
    A1 --> API
    A2 --> API
    A3 --> API
    A4 --> HEALTH

    %% Reputation feedback
    REP --> AR
    CB --> HEALTH

    style API fill:#0066CC,stroke:#FFD700,stroke-width:3px,color:#fff
    style DIR fill:#32CD32,stroke:#FFD700,stroke-width:2px,color:#fff
    style AUTH fill:#DC143C,stroke:#FFD700,stroke-width:2px,color:#fff
    style LOCAL fill:#9370DB,stroke:#FFD700,stroke-width:2px,color:#fff
    style REMOTE fill:#FF8C00,stroke:#FFD700,stroke-width:2px,color:#fff
```

## Federation Core Responsibilities

### 1. Service Discovery
- **FastMCP Directory**: Exposes discovery endpoints over HTTP tunnels
- **Registry API**: Member lifecycle management (register/heartbeat/unregister)
- **Capability Matching**: Routes requests to agents with required skills

### 2. Federation Protocol
- **Local-first**: Internal registry is the source of truth
- **Federate-on-demand**: Reaches out to remote registries when needed
- **Reputation Scoring**: Tracks latency, uptime, and result quality
- **Circuit Breaker**: Auto-isolates failing or noisy neighbors
- **Smart Caching**: Keeps high-value remote tools hot and local

### 3. Security Framework
- **Manifest Signing**: HMAC-SHA256 (upgradeable to JWS)
- **Agent Passport**: JWT with KMS-backed private keys
- **mTLS**: Certificate-based mutual authentication
- **Rate Limiting**: Per-tenant quotas and throttling

### 4. Health Monitoring
- **SLO Tracking**: Service-level objective compliance
- **Fleet Health**: Aggregates checks from all agents
- **Auto-remediation**: Triggers Praetorian Guard for failures
- **Telemetry**: Real-time metrics via Redis pub/sub

## Key Endpoints

### Public (No Auth)
- `GET /health` - Service health check
- `GET /fastmcp/manifest` - FastMCP discovery manifest

### Authenticated
- `POST /agents/register` - Register new agent
- `POST /agents/{id}/heartbeat` - Agent heartbeat
- `DELETE /agents/{id}` - Unregister agent
- `GET /agents/discover` - Capability-based discovery
- `POST /route` - Intelligent task routing

### WebSocket
- `ws://federation:9405/ws` - Real-time event stream
- Agent status updates
- Task completion notifications
- Health alerts

