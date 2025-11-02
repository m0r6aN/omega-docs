# Context Server (The Oracle) Architecture

```mermaid
graph TB
    subgraph "Context Request Flow"
        REQ[Agent Request<br/>Task Context Needed]
    end

    subgraph "Context Server - The Oracle"
        API[Context API<br/>Port 9411]
        
        subgraph "Intelligence Gathering"
            PARSE[Request Parser<br/>Extract Intent]
            ENRICH[Context Enricher<br/>Multi-source Aggregation]
            RANK[Relevance Ranker<br/>Score & Filter]
        end

        subgraph "Context Sources"
            HIST[Historical Tasks<br/>Similar Outcomes]
            KB[Knowledge Base<br/>Domain Expertise]
            CODE[Code Context<br/>Repository Analysis]
            ENV[Environment<br/>System State]
            MEM[Agent Memory<br/>Past Interactions]
        end

        subgraph "Processing Pipeline"
            VEC[Vector Search<br/>Semantic Similarity]
            GRAPH[Knowledge Graph<br/>Relationship Mapping]
            TEMP[Template Engine<br/>Context Formatting]
        end
    end

    subgraph "Data Stores"
        MONGO[(MongoDB<br/>Transactional Memory)]
        REDIS[(Redis<br/>Hot Cache)]
        VECTOR[(Vector Store<br/>Embeddings)]
    end

    subgraph "External Intelligence"
        GIT[Git Repository<br/>Code History]
        DOCS[Documentation<br/>API Specs]
        METRICS[Telemetry<br/>Performance Data]
    end

    %% Request flow
    REQ --> API
    API --> PARSE
    PARSE --> ENRICH

    %% Context gathering
    ENRICH --> HIST
    ENRICH --> KB
    ENRICH --> CODE
    ENRICH --> ENV
    ENRICH --> MEM

    %% Processing
    HIST --> VEC
    KB --> GRAPH
    CODE --> VEC
    ENV --> TEMP
    MEM --> VEC

    %% Ranking
    VEC --> RANK
    GRAPH --> RANK
    TEMP --> RANK

    %% Data store connections
    HIST --> MONGO
    KB --> MONGO
    MEM --> MONGO
    VEC --> VECTOR
    RANK --> REDIS

    %% External sources
    CODE --> GIT
    KB --> DOCS
    ENV --> METRICS

    %% Response
    RANK --> API
    API --> REQ

    style API fill:#9370DB,stroke:#FFD700,stroke-width:3px,color:#fff
    style ENRICH fill:#32CD32,stroke:#FFD700,stroke-width:2px,color:#fff
    style VEC fill:#0066CC,stroke:#FFD700,stroke-width:2px,color:#fff
    style RANK fill:#FF8C00,stroke:#FFD700,stroke-width:2px,color:#fff
```

## Context Server Flow

```mermaid
sequenceDiagram
    participant Agent as Requesting Agent
    participant Oracle as Context Server
    participant Vec as Vector Store
    participant Mongo as MongoDB
    participant Git as Git Repository
    participant Metrics as Telemetry

    Note over Agent,Metrics: Context Request Lifecycle

    Agent->>Oracle: POST /context/query
    Note right of Agent: {task: "Build REST API",<br/>domain: "python",<br/>depth: "detailed"}

    Oracle->>Oracle: Parse request intent
    Oracle->>Oracle: Extract key entities

    par Parallel Intelligence Gathering
        Oracle->>Vec: Semantic search for similar tasks
        Vec-->>Oracle: Top 10 similar contexts
        
        Oracle->>Mongo: Query historical outcomes
        Mongo-->>Oracle: Past task results
        
        Oracle->>Git: Analyze code patterns
        Git-->>Oracle: Repository insights
        
        Oracle->>Metrics: Get performance data
        Metrics-->>Oracle: Success rates & metrics
    end

    Oracle->>Oracle: Aggregate all sources
    Oracle->>Oracle: Build knowledge graph
    Oracle->>Oracle: Rank by relevance

    Oracle->>Oracle: Apply context template
    Oracle->>Oracle: Compress to token budget

    Oracle-->>Agent: Enriched context
    Note left of Oracle: {<br/>  similar_tasks: [...],<br/>  code_patterns: [...],<br/>  best_practices: [...],<br/>  pitfalls: [...],<br/>  estimated_complexity: "medium"<br/>}

    Agent->>Agent: Execute with context
    Agent->>Oracle: POST /context/feedback
    Note right of Agent: {outcome: "success",<br/>context_quality: 0.95}

    Oracle->>Vec: Update embeddings
    Oracle->>Mongo: Store outcome
    Oracle->>Oracle: Improve ranking model
```

## Context Types

### 1. Task Context
Historical data about similar tasks:
```json
{
  "similar_tasks": [
    {
      "task_id": "task_12345",
      "description": "Build Python REST API with FastAPI",
      "outcome": "success",
      "duration_seconds": 450,
      "agent_used": "code_generator_001",
      "similarity_score": 0.92
    }
  ],
  "success_patterns": [
    "Use Pydantic models for validation",
    "Implement async endpoints",
    "Add comprehensive error handling"
  ],
  "common_pitfalls": [
    "Missing CORS configuration",
    "Inadequate input validation"
  ]
}
```

### 2. Code Context
Repository and codebase insights:
```json
{
  "repository_patterns": {
    "architecture": "microservices",
    "frameworks": ["FastAPI", "SQLAlchemy"],
    "testing": "pytest",
    "deployment": "Docker + Kubernetes"
  },
  "relevant_files": [
    {
      "path": "src/api/routes.py",
      "relevance": 0.88,
      "summary": "Existing API route patterns"
    }
  ],
  "coding_standards": {
    "style_guide": "PEP 8",
    "type_hints": "required",
    "docstrings": "Google style"
  }
}
```

### 3. Environment Context
Current system state:
```json
{
  "available_resources": {
    "cpu_cores": 8,
    "memory_gb": 16,
    "gpu": false
  },
  "active_services": [
    "mongodb",
    "redis",
    "federation_core"
  ],
  "configuration": {
    "environment": "development",
    "debug_mode": true,
    "log_level": "INFO"
  }
}
```

### 4. Agent Memory Context
Past interactions and learning:
```json
{
  "agent_history": {
    "total_tasks": 1247,
    "success_rate": 0.96,
    "specializations": ["API development", "Database design"],
    "learned_preferences": {
      "prefers_async": true,
      "testing_framework": "pytest",
      "documentation_style": "detailed"
    }
  },
  "recent_interactions": [
    {
      "timestamp": "2025-08-02T10:30:00Z",
      "task_type": "code_generation",
      "feedback": "excellent",
      "notes": "Agent excels at FastAPI patterns"
    }
  ]
}
```

## Oracle's Omniscience Law

> **"No agent shall act in ignorance."**

Every task execution must be preceded by context gathering:

1. **Query Phase**: Agent requests context from Oracle
2. **Gathering Phase**: Oracle aggregates multi-dimensional intelligence
3. **Enrichment Phase**: Context is ranked, filtered, and formatted
4. **Execution Phase**: Agent acts with full situational awareness
5. **Feedback Phase**: Outcome is stored to improve future context

## Performance Characteristics

- **Query Latency**: < 100ms (p95)
- **Context Depth**: Configurable (shallow/medium/detailed)
- **Token Budget**: Adaptive compression to fit LLM context windows
- **Cache Hit Rate**: > 80% for common queries
- **Freshness**: Real-time for environment, eventual consistency for historical

