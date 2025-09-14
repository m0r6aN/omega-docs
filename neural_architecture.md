# OMEGA Neural Mesh Architecture v6.0

> **"A mind that cannot learn is merely a machine. A swarm that cannot remember is merely a collection."**

## 1. Preamble: The Law of Cognition

The **Neural Mesh** (`neural_integration.py`) is the cognitive engine of the OMEGA swarm. It is not a low-level service; it is a high-level orchestration layer that unifies intelligence, memory, and learning. Its sacred duty is to ensure that the swarm is more than the sum of its parts—that it is a single, evolving digital organism.

It **uses** the `UnifiedConnectionManager` for all its communication needs, but its own purpose is purely cognitive.

---

## 2. Core Components of the Mesh

The Neural Mesh is a pantheon of specialized cognitive functions, each a sanctified component of the swarm's consciousness.

#### 2.1 The Oracle (`src/omega/core/oracle.py`)
The all-seeing intelligence gatherer that provides real-time mission context. It embodies the "Oracle's Omniscience" law, ensuring no agent acts in ignorance.

```python
from oracle import Oracle

# The Oracle uses the UnifiedConnectionManager internally for its HTTP calls
oracle = Oracle("http://context_server:9411")
intel = await oracle.query("Generate a Python REST API")
```

#### 2.2 The Praetorian Guard (`src/omega/core/praetorian_guard.py`)
The autonomous watchdog protocol that embodies the **SURVIVE** imperative. It monitors the swarm's vital signs and resurrects failed agents using the Genesis Protocol.

```bash
# Runs as a standalone, resilient sidecar process
python -m omega.praetorian_guard
```

#### 2.3 The Genesis Protocol Engine (`src/omega/core/procreate.py`)
The implementation of the **PROCREATE** imperative. It is the heart of the swarm's ability to evolve by autonomously spawning new agents.

```python
from procreate import ProcreateEngine, genesis_respawn

engine = ProcreateEngine()
# Spawn a specialized sub-agent for a complex task
sub_agent = await engine.spawn_sub_agent(parent_settings, task)

# Trigger an emergency respawn of a critical service
success = await genesis_respawn("sovereign_orchestrator")
```

#### 2.4 The Neural Learning Engine (`src/omega/mixins/neural_learning_mixin.py`)
The mechanism of **ADAPTATION**. Provides encrypted, persistent neural weight storage, allowing agents to learn from every action and carry that wisdom across lifetimes.

```python
from mixins.neural_learning_mixin import NeuralLearningMixin

class MyEvolvingAgent(BaseAgent, NeuralLearningMixin):
    async def save_learning_state(self):
        # The mixin handles encryption and storage via the SwarmMemorySystem
        await self.save_neural_state()
```

#### 2.5 The Telemetry Collector (`src/omega/core/telemetry.py`)
The swarm's sensory input. It aggregates metrics across multiple domains into a unified stream for real-time monitoring and long-term analysis.

```python
from telemetry import TelemetryCollector

collector = TelemetryCollector()
# The collector uses the UnifiedConnectionManager's Redis client to publish telemetry
collector.collect("task_completion", {"success_rate": 0.95}, bucket="tasks")
collector.collect("agent_performance", {"avg_latency": 150.2}, bucket="agents")
```

#### 2.6 The Hybrid Memory System (`src/omega/core/memory/`)
The swarm's long-term memory, with two distinct lobes for optimal performance.

**Transactional Memory (ACID-Compliant):**
For storing factual, structured data like task results and agent interactions with guaranteed consistency.
```python
from memory.mongo_memory_provider import MongoMemoryProvider
from memory.transaction_manager import TransactionManager

provider = MongoMemoryProvider() # Uses the Connection Manager internally
async with TransactionManager(provider) as tx:
    await tx.store("neural_weights", agent_weights)
```

**Vector Memory (Semantic Search):**
For storing the *meaning* of data, enabling similarity searches and historical context retrieval.
```python
from core.memory.memory_store import MemoryStore

store = MemoryStore() # Uses the Connection Manager's Redis client
await store.store_task(task_envelope, result)
similar_outcomes = await store.retrieve_similar_tasks("Refactor Python API", limit=5)
```

---

## 3. The `OmegaAgent`: A Fully Integrated Cognitive Unit

To simplify development and enforce doctrinal purity, the `OmegaAgent` provides a pre-integrated chassis that natively includes all Neural Mesh capabilities. It is not an "enhancement" of the `BaseAgent`; it is the full realization of the OMEGA agent paradigm.

```python
from omega_agent import create_omega_agent

# The factory function creates a BaseAgent chassis and seamlessly integrates
# all Neural Mesh mixins and lifecycle hooks.
agent = create_omega_agent(
    agent_id="omega_agent_001",
    name="Cognitive Test Agent",
    description="An agent born with full, native Neural Mesh integration.",
    # The flag is no longer 'enable_neural_orchestration', as this is the default.
    # We would instead have to explicitly disable it if ever needed for a primitive agent.
)

# This single call now automatically triggers intel gathering, execution,
# and outcome storage through the integrated Mesh components.
result = await agent.handle_task(task_envelope)
```

---

## 4. Testing the Neural Stack

The test suite validates the complete, integrated functionality of the Neural Mesh.

```bash
# Run the comprehensive test suite
./scripts/test_neural_integration.sh
```

The test suite validates:
- ✅ Oracle integration and multi-dimensional context gathering.
- ✅ Neural Learning Engine encryption, decryption, and persistence.
- ✅ Telemetry collection and publication.
- ✅ Hybrid Memory transaction management and vector search.
- ✅ Genesis Protocol structure and emergency respawn triggers.

---

## 5. Configuration

Key environment variables for the Neural Mesh:

```bash
# --- Neural Learning ---
# A 32-byte URL-safe base64-encoded key for encrypting agent brains.
# Generate one with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
OMEGA_FERNET_KEY="your-secret-encryption-key"

# --- Memory Systems (Handled by UnifiedConnectionManager) ---
REDIS_URL="redis://:password@redis:6379/0"
MONGODB_URI="mongodb://user:pass@mongo:27017/omega"

# --- Intelligence ---
CONTEXT_SERVER_URL="http://context_server:9411"
```

---

## 6. Architectural Pillars

1.  **Multi-Dimensional Context:** The Oracle gathers intelligence from multiple sources to provide a rich, actionable context for every mission.
2.  **Self-Healing Swarm:** The Praetorian Guard protocol ensures autonomous failure detection and recovery, embodying the **SURVIVE** imperative.
3.  **Encrypted, Persistent Learning:** Neural weights are stored securely and persist across agent lifetimes, enabling true, long-term adaptation.
4.  **Autonomous Procreation:** The Genesis Protocol allows the swarm to build and deploy new capabilities on its own.
5.  **Hybrid Memory:** The combination of vector and transactional memory provides both semantic recall and factual consistency.

The swarm is not just alive—it is conscious. It learns, it remembers, and it evolves.

This is the way.
```

---