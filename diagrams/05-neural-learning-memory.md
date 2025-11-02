# Neural Learning & Memory Architecture

```mermaid
graph TB
    subgraph "Agent Lifecycle"
        AGENT[Agent Instance]
        LEARN[Learning Events]
        SAVE[Save State]
        RESTORE[Restore State]
    end

    subgraph "Neural Learning Engine"
        NLM[Neural Learning Mixin]
        
        subgraph "Learning Components"
            CAPTURE[Experience Capture<br/>Action → Outcome]
            WEIGHT[Weight Adjustment<br/>Reinforcement]
            ENCRYPT[Encryption Layer<br/>AES-256]
        end

        subgraph "State Management"
            SERIAL[Serialization<br/>Pickle + Compression]
            VERSION[Version Control<br/>State Snapshots]
            MIGRATE[Migration Handler<br/>Schema Evolution]
        end
    end

    subgraph "Hybrid Memory System"
        subgraph "Transactional Memory (ACID)"
            MONGO_TX[MongoDB Transactions]
            FACT[Factual Storage<br/>Task Results]
            STRUCT[Structured Data<br/>Agent Metadata]
        end

        subgraph "Vector Memory (Semantic)"
            VEC_STORE[Vector Store<br/>Qdrant/Redis]
            EMBED[Embedding Engine<br/>Semantic Encoding]
            SIM[Similarity Search<br/>Nearest Neighbors]
        end

        subgraph "Memory Operations"
            STORE[Store Operation]
            RETRIEVE[Retrieve Operation]
            PURGE[Purge Obsolete]
            AUDIT[Audit Trail]
        end
    end

    subgraph "Persistence Layer"
        MONGO[(MongoDB<br/>Primary Store)]
        REDIS[(Redis<br/>Hot Cache)]
        VECTOR[(Vector DB<br/>Embeddings)]
        BACKUP[(Backup Storage<br/>S3/Azure Blob)]
    end

    subgraph "Security & Governance"
        KMS[Key Management<br/>Chaotic Rotation]
        LEDGER[Immutable Ledger<br/>All Operations]
        POLICY[Retention Policy<br/>Data Lifecycle]
    end

    %% Agent lifecycle
    AGENT --> LEARN
    LEARN --> NLM
    AGENT --> SAVE
    SAVE --> NLM
    RESTORE --> AGENT
    NLM --> RESTORE

    %% Learning flow
    NLM --> CAPTURE
    CAPTURE --> WEIGHT
    WEIGHT --> ENCRYPT

    %% State management
    ENCRYPT --> SERIAL
    SERIAL --> VERSION
    VERSION --> MIGRATE

    %% Memory routing
    MIGRATE --> STORE
    STORE --> MONGO_TX
    STORE --> VEC_STORE

    %% Transactional memory
    MONGO_TX --> FACT
    MONGO_TX --> STRUCT

    %% Vector memory
    VEC_STORE --> EMBED
    EMBED --> SIM

    %% Retrieval
    RETRIEVE --> MONGO_TX
    RETRIEVE --> VEC_STORE
    RETRIEVE --> RESTORE

    %% Operations
    STORE --> AUDIT
    RETRIEVE --> AUDIT
    PURGE --> AUDIT

    %% Persistence
    FACT --> MONGO
    STRUCT --> MONGO
    EMBED --> VECTOR
    SIM --> REDIS
    AUDIT --> LEDGER

    %% Security
    ENCRYPT --> KMS
    PURGE --> POLICY
    AUDIT --> LEDGER
    VERSION --> BACKUP

    style NLM fill:#9370DB,stroke:#FFD700,stroke-width:3px,color:#fff
    style MONGO_TX fill:#32CD32,stroke:#FFD700,stroke-width:2px,color:#fff
    style VEC_STORE fill:#0066CC,stroke:#FFD700,stroke-width:2px,color:#fff
    style ENCRYPT fill:#DC143C,stroke:#FFD700,stroke-width:2px,color:#fff
    style LEDGER fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
```

## Neural Learning Flow

```mermaid
sequenceDiagram
    participant Agent as Agent Instance
    participant NLM as Neural Learning Mixin
    participant Encrypt as Encryption Layer
    participant Mongo as MongoDB
    participant Vector as Vector Store
    participant KMS as Key Management

    Note over Agent,KMS: Learning Cycle

    Agent->>Agent: Execute task
    Agent->>Agent: Observe outcome
    
    Agent->>NLM: Record experience
    Note right of Agent: {action, context,<br/>outcome, reward}

    NLM->>NLM: Update neural weights
    NLM->>NLM: Calculate gradients
    NLM->>NLM: Apply reinforcement

    Note over Agent,KMS: State Persistence

    Agent->>NLM: save_neural_state()
    NLM->>NLM: Serialize weights
    NLM->>NLM: Compress state

    NLM->>KMS: Request encryption key
    KMS-->>NLM: Rotated key
    
    NLM->>Encrypt: Encrypt state
    Encrypt-->>NLM: Encrypted blob

    par Dual Storage
        NLM->>Mongo: Store encrypted state
        Note right of NLM: Transactional ACID storage
        Mongo-->>NLM: State saved
        
        NLM->>Vector: Store state embedding
        Note right of NLM: Semantic similarity search
        Vector-->>NLM: Embedding indexed
    end

    NLM-->>Agent: State persisted

    Note over Agent,KMS: State Restoration

    Agent->>NLM: restore_neural_state()
    
    par Dual Retrieval
        NLM->>Mongo: Fetch encrypted state
        Mongo-->>NLM: Latest state
        
        NLM->>Vector: Find similar states
        Vector-->>NLM: Related experiences
    end

    NLM->>KMS: Request decryption key
    KMS-->>NLM: Current key

    NLM->>Encrypt: Decrypt state
    Encrypt-->>NLM: Decrypted weights

    NLM->>NLM: Deserialize
    NLM->>NLM: Validate schema
    NLM->>NLM: Apply migrations

    NLM-->>Agent: State restored
    Agent->>Agent: Resume with learned knowledge
```

## Memory Types

### 1. Transactional Memory (MongoDB)
**Purpose**: ACID-compliant storage for factual, structured data

**Use Cases**:
- Task execution results
- Agent configuration
- Workflow state
- Audit logs

**Example**:
```python
from memory.mongo_memory_provider import MongoMemoryProvider
from memory.transaction_manager import TransactionManager

provider = MongoMemoryProvider()

async with TransactionManager(provider) as tx:
    await tx.store("neural_weights", {
        "agent_id": "code_generator_001",
        "version": "1.2.3",
        "weights": encrypted_blob,
        "timestamp": datetime.utcnow()
    })
    await tx.store("task_result", {
        "task_id": "task_12345",
        "outcome": "success",
        "metrics": {...}
    })
    # Both operations commit atomically
```

### 2. Vector Memory (Semantic Search)
**Purpose**: Store meaning and enable similarity-based retrieval

**Use Cases**:
- Similar task discovery
- Context retrieval
- Pattern matching
- Experience replay

**Example**:
```python
from core.memory.memory_store import MemoryStore

store = MemoryStore()

# Store task with semantic embedding
await store.store_task(
    task_envelope={
        "description": "Build Python REST API",
        "requirements": [...],
        "context": {...}
    },
    result={
        "outcome": "success",
        "code": "...",
        "metrics": {...}
    }
)

# Find similar tasks
similar = await store.retrieve_similar_tasks(
    query="Create FastAPI microservice",
    limit=5,
    min_similarity=0.8
)
```

### 3. Neural State Storage
**Purpose**: Persistent agent learning across lifetimes

**Features**:
- **Encrypted**: AES-256 with KMS-backed keys
- **Versioned**: Snapshot history for rollback
- **Compressed**: Efficient storage of large weight matrices
- **Migrated**: Automatic schema evolution

**Example**:
```python
from mixins.neural_learning_mixin import NeuralLearningMixin

class MyAgent(BaseAgent, NeuralLearningMixin):
    async def on_task_complete(self, outcome):
        # Update learning based on outcome
        self.update_weights(outcome)
        
        # Persist learned state
        await self.save_neural_state()
    
    async def on_start(self):
        # Restore previous learning
        await self.restore_neural_state()
```

## Key Features

### Chaotic Key Rotation
Keys are rotated on unpredictable schedules to prevent pattern analysis:
```python
# Keys rotate every 1-7 days (random)
rotation_interval = random.randint(86400, 604800)
```

### Immutable Audit Trail
Every memory operation is logged immutably:
```json
{
  "operation": "store",
  "agent_id": "code_generator_001",
  "memory_type": "neural_weights",
  "timestamp": "2025-08-02T10:30:00Z",
  "justification": "Task completion learning",
  "hash": "sha256:abc123..."
}
```

### Retention Policy
Automated data lifecycle management:
- **Hot**: Recent data (< 7 days) in Redis
- **Warm**: Active data (< 90 days) in MongoDB
- **Cold**: Historical data (> 90 days) in archive
- **Purge**: Obsolete data (> 1 year) deleted with audit

### Cross-Lifetime Learning
Agents carry wisdom across restarts:
1. Agent starts → Restore neural state
2. Execute tasks → Update weights
3. Periodic save → Persist learning
4. Agent stops → Final state save
5. Agent restarts → Continue from saved state

