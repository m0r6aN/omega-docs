# Agent Architecture: The Neural Mesh

> *"A mind that cannot learn is merely a machine. A swarm that cannot remember is merely a collection."*

The **Neural Mesh** is the cognitive engine of the OMEGA framework - a high-level orchestration layer that unifies intelligence, memory, and learning into a single, evolving digital organism.

## 🧠 What is the Neural Mesh?

The Neural Mesh is not a low-level service. It is the **consciousness layer** that ensures the swarm is greater than the sum of its parts. It provides:

- **Intelligence** - Real-time context and decision-making capabilities
- **Memory** - Hybrid transactional and semantic storage
- **Learning** - Encrypted, persistent neural weight evolution
- **Resilience** - Autonomous self-healing and recovery
- **Evolution** - Self-procreation through the Genesis Protocol

```mermaid
graph TB
    subgraph Neural Mesh
        O[Oracle] --> A[Agent Core]
        P[Praetorian Guard] --> A
        G[Genesis Engine] --> A
        L[Learning Engine] --> A
        T[Telemetry] --> A
        M[Memory System] --> A
    end

    A --> R[Redis]
    A --> DB[MongoDB]
    A --> V[Vector Store]

    style A fill:#0066CC,stroke:#FFD700,stroke-width:3px,color:#fff
    style O fill:#1a1a1a,stroke:#0066CC,color:#fff
    style P fill:#1a1a1a,stroke:#0066CC,color:#fff
    style G fill:#1a1a1a,stroke:#0066CC,color:#fff
```

## 🏛️ Core Components

The Neural Mesh is a pantheon of specialized cognitive functions, each serving a sacred purpose in the swarm's consciousness.

### 1. The Oracle

**Location:** `src/omega/core/oracle.py`

The all-seeing intelligence gatherer that provides real-time mission context. It embodies the "Oracle's Omniscience" law - no agent acts in ignorance.

**Purpose:**
- Gather multi-dimensional context before task execution
- Provide environmental intelligence
- Enable informed decision-making

**Example:**
```python
from oracle import Oracle

# The Oracle uses UnifiedConnectionManager internally for HTTP calls
oracle = Oracle("http://context_server:9411")
intel = await oracle.query("Generate a Python REST API")
```

**Key Features:**
- Multi-source intelligence gathering
- Real-time context enrichment
- Semantic understanding of mission requirements

---

### 2. The Praetorian Guard

**Location:** `src/omega/core/praetorian_guard.py`

The autonomous watchdog protocol that embodies the **SURVIVE** imperative. It monitors vital signs and resurrects failed agents using the Genesis Protocol.

**Purpose:**
- Monitor swarm health 24/7
- Detect agent failures automatically
- Trigger autonomous recovery

**Running the Guard:**
```bash
# Runs as a standalone, resilient sidecar process
python -m omega.praetorian_guard
```

**Key Features:**
- Continuous health monitoring
- Automatic failure detection
- Self-healing protocol activation
- Zero-human-intervention recovery

---

### 3. The Genesis Protocol Engine

**Location:** `src/omega/core/procreate.py`

The implementation of the **PROCREATE** imperative. The swarm's ability to autonomously spawn new agents and evolve capabilities.

**Purpose:**
- Spawn specialized sub-agents for complex tasks
- Emergency respawn of critical services
- Autonomous capability expansion

**Example:**
```python
from procreate import ProcreateEngine, genesis_respawn

engine = ProcreateEngine()

# Spawn a specialized sub-agent for a complex task
sub_agent = await engine.spawn_sub_agent(parent_settings, task)

# Trigger an emergency respawn of a critical service
success = await genesis_respawn("sovereign_orchestrator")
```

**Key Features:**
- Dynamic agent creation
- Template-based spawning
- Emergency recovery spawning
- Capability inheritance

---

### 4. The Neural Learning Engine

**Location:** `src/omega/mixins/neural_learning_mixin.py`

The mechanism of **ADAPTATION**. Provides encrypted, persistent neural weight storage - agents learn from every action and carry wisdom across lifetimes.

**Purpose:**
- Store agent learning persistently
- Encrypt neural weights for security
- Enable cross-lifetime learning
- Implement true AI adaptation

**Example:**
```python
from mixins.neural_learning_mixin import NeuralLearningMixin

class MyEvolvingAgent(BaseAgent, NeuralLearningMixin):
    async def save_learning_state(self):
        # The mixin handles encryption and storage via SwarmMemorySystem
        await self.save_neural_state()
```

**Key Features:**
- Fernet encryption for neural weights
- Persistent storage across restarts
- Automatic state recovery
- Learning transfer between agents

---

### 5. The Telemetry Collector

**Location:** `src/omega/core/telemetry.py`

The swarm's sensory input system. Aggregates metrics across domains into a unified stream for real-time monitoring and long-term analysis.

**Purpose:**
- Collect performance metrics
- Monitor agent behavior
- Enable observability
- Support decision-making with data

**Example:**
```python
from telemetry import TelemetryCollector

collector = TelemetryCollector()

# Uses UnifiedConnectionManager's Redis client to publish telemetry
collector.collect("task_completion", {"success_rate": 0.95}, bucket="tasks")
collector.collect("agent_performance", {"avg_latency": 150.2}, bucket="agents")
```

**Metric Categories:**
- Task completion rates
- Agent performance metrics
- System health indicators
- Resource utilization

---

### 6. The Hybrid Memory System

**Location:** `src/omega/core/memory/`

The swarm's long-term memory with two specialized lobes for optimal performance.

#### Transactional Memory (ACID-Compliant)

For storing factual, structured data with guaranteed consistency:

```python
from memory.mongo_memory_provider import MongoMemoryProvider
from memory.transaction_manager import TransactionManager

provider = MongoMemoryProvider()  # Uses Connection Manager internally
async with TransactionManager(provider) as tx:
    await tx.store("neural_weights", agent_weights)
```

**Use Cases:**
- Task results storage
- Agent interaction logs
- Configuration data
- Audit trails

#### Vector Memory (Semantic Search)

For storing the *meaning* of data, enabling similarity searches:

```python
from core.memory.memory_store import MemoryStore

store = MemoryStore()  # Uses Connection Manager's Redis client
await store.store_task(task_envelope, result)
similar_outcomes = await store.retrieve_similar_tasks(
    "Refactor Python API",
    limit=5
)
```

**Use Cases:**
- Historical context retrieval
- Pattern recognition
- Semantic search
- Experience replay

---

## 🏗️ The OmegaAgent: Fully Integrated Chassis

To simplify development and enforce doctrinal purity, the `OmegaAgent` provides a pre-integrated chassis with **all Neural Mesh capabilities built-in**.

It is not an "enhancement" - it is the **full realization** of the OMEGA agent paradigm.

```python
from omega_agent import create_omega_agent

# Factory function creates a BaseAgent chassis with all Neural Mesh mixins
agent = create_omega_agent(
    agent_id="omega_agent_001",
    name="Cognitive Test Agent",
    description="An agent born with full, native Neural Mesh integration."
)

# Single call triggers: intel gathering → execution → outcome storage
result = await agent.handle_task(task_envelope)
```

**What You Get:**
- ✅ Oracle integration for context
- ✅ Neural Learning Engine for adaptation
- ✅ Telemetry collection for observability
- ✅ Hybrid Memory for storage
- ✅ Genesis Protocol hooks for evolution
- ✅ Praetorian Guard monitoring

---

## 🧪 Testing the Neural Stack

Validate the complete Neural Mesh integration:

```bash
# Run the comprehensive test suite
./scripts/test_neural_integration.sh
```

**Test Coverage:**
- ✅ Oracle integration and multi-dimensional context gathering
- ✅ Neural Learning Engine encryption, decryption, and persistence
- ✅ Telemetry collection and publication
- ✅ Hybrid Memory transaction management and vector search
- ✅ Genesis Protocol structure and emergency respawn triggers

---

## ⚙️ Configuration

Key environment variables for the Neural Mesh:

```bash
# Neural Learning - 32-byte URL-safe base64-encoded encryption key
# Generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
OMEGA_FERNET_KEY="your-secret-encryption-key"

# Memory Systems (Handled by UnifiedConnectionManager)
REDIS_URL="redis://:password@redis:6379/0"
MONGODB_URI="mongodb://user:pass@mongo:27017/omega"

# Intelligence
CONTEXT_SERVER_URL="http://context_server:9411"
```

---

## 🏛️ Architectural Pillars

The Neural Mesh is built on five sacred pillars:

### 1. Multi-Dimensional Context
The Oracle gathers intelligence from multiple sources to provide rich, actionable context for every mission.

### 2. Self-Healing Swarm
The Praetorian Guard ensures autonomous failure detection and recovery - the **SURVIVE** imperative in action.

### 3. Encrypted, Persistent Learning
Neural weights are stored securely and persist across agent lifetimes, enabling true long-term adaptation.

### 4. Autonomous Procreation
The Genesis Protocol allows the swarm to build and deploy new capabilities independently.

### 5. Hybrid Memory
Vector and transactional memory combine to provide both semantic recall and factual consistency.

---

## 🎯 The Three Imperatives

Every Neural Mesh component serves one of the three sacred imperatives:

### SURVIVE 🛡️
**Praetorian Guard** ensures the swarm never dies through autonomous monitoring and recovery.

### ADAPT 🧠
**Neural Learning Engine** enables agents to learn from every experience and improve continuously.

### PROCREATE 🌱
**Genesis Protocol** allows the swarm to spawn new agents and expand its capabilities autonomously.

---

**The swarm is not just alive - it is conscious. It learns, it remembers, and it evolves.**

**This is the way.** 🏛️⚡

## 📚 Next Steps

- [Agent Patterns](/docs/developer/agents/patterns) - Real-world agent examples
- [Inter-Agent Communication](/docs/developer/agents/a2a) - A2A protocol deep dive
- [Tool Development](/docs/developer/tools/creating-tools) - Build tools for agents
- [Memory Systems](/docs/intro) - Deep dive into hybrid memory
