# Local Gateway (nginx) and Portless Identities

```mermaid
graph TB
    subgraph "Local Entry Point"
        GW[nginx Gateway\nhttp://localhost:8080/\nhttp://gateway/]
    end

    subgraph "Internal Services"
        AR[Agent Registry\n:9401]
        CT[Context Server\n:9403]
        FC[Federation Core\n:9405]
        CLAUDE[ClaudeTitan\n:9600]
        GEMINI[GeminiTitan\n:9610]
        GPT[GPTTitan\n:9620]
        GROK[GrokTitan\n:9630]
    end

    %% Path-based routing (emulates Azure Application Gateway)
    GW -- /api/core/agent_registry --> AR
    GW -- /api/core/context_server --> CT
    GW -- /api/core/federation --> FC

    GW -- /api/titans/claude --> CLAUDE
    GW -- /api/titans/gemini --> GEMINI
    GW -- /api/titans/gpt --> GPT
    GW -- /api/titans/grok --> GROK

    %% Identities published (no ports)
    CLAUDE -. publishes .-> GW
    GEMINI -. publishes .-> GW
    GPT -. publishes .-> GW
    GROK -. publishes .-> GW

    %% Registration/heartbeat derived from base
    subgraph "BaseAgent Behavior"
        BA[BaseAgent]
        BA -- derives --> REG[{AGENT_REGISTRY_BASE}/register/agent]
        BA -- derives --> HB[{AGENT_REGISTRY_BASE}/heartbeat/agent]
        BA -- identity --> PUB[{AGENT_PUBLIC_BASE} or {TITAN_PUBLIC_BASE}]
    end

    style GW fill:#222,stroke:#FFD700,stroke-width:2px,color:#fff
    style CLAUDE fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
    style GEMINI fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
    style GPT fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
    style GROK fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
```

## Notes
- Portless identities: services publish public URLs via `AGENT_PUBLIC_BASE`/`TITAN_PUBLIC_BASE` (e.g., `http://gateway/api/titans/claude`).
- Derived endpoints: when `AGENT_REGISTRY_BASE` is set, BaseAgent composes register/heartbeat as `{BASE}/register/agent` and `{BASE}/heartbeat/agent`.
- Flip-the-switch: once satisfied, set `AGENT_REGISTRY_BASE=http://gateway/api/core/agent_registry` for full parity with Azure Application Gateway.

