# 🚀 OMEGA v5.0 FULL STANDARDIZATION BATTLE PLAN

## **MISSION OBJECTIVE**
Execute Option B: Full Standardization across the entire OMEGA ecosystem to create a unified, bulletproof, self-evolving AI swarm with consistent patterns, abstractions, and neural capabilities.

---

## **📋 PHASE 1: FOUNDATION STANDARDIZATION (Priority: CRITICAL)**

### **1.1 BaseAgent Architecture Completion**
**File**: `backend/src/omega/agents/base_agent.py`

**Tasks:**
- ✅ **DONE**: `expose_mcp_tool` decorator implementation
- ✅ **DONE**: Neural learning integration 
- ✅ **DONE**: Async startup pattern (`asyncio.run(agent.run())`)
- 🔄 **TODO**: Add `expose_mcp_resource` decorator (already implemented)
- 🔄 **TODO**: Enhance `_process_task` with proper abstract method pattern

**Code Updates Needed:**
```python
# Add to BaseAgent
from abc import ABC, abstractmethod

class BaseAgent(OmegaEntity, CollaboratorMixin, DynamicModalityMixin, TelemetryMixin, ABC):
    
    @abstractmethod
    async def _process_task(self, envelope: TaskEnvelope, modality: Enum) -> TaskEnvelope:
        """Abstract method for agent-specific task processing."""
        pass
    
    # Default implementation for agents that don't need custom processing
    async def _default_process_task(self, envelope: TaskEnvelope, modality: Enum) -> TaskEnvelope:
        """Default task processing implementation."""
        logger.info(f"Default processing task {envelope.task.id} with modality {modality}")
        self.telemetry.collect("default_process", {"modality": str(modality)})
        return envelope
```

### **1.2 Agent Startup Pattern Standardization**
**Tool**: `scripts/standardize_agent_startup.py` (already created)

**Agent Files to Update:**
- `src/omega/agents/*/agent.py` (all agent directories)

**Standard Pattern to Apply:**
```python
if __name__ == "__main__":
    agent = {AgentClass}()
    asyncio.run(agent.run())
```

**Execution:**
```bash
cd D:\Repos\o.m.e.g.a
python scripts/standardize_agent_startup.py
```

---

## **📋 PHASE 2: DEPLOYMENT REFERENCE FIXES (Priority: HIGH)**

### **2.1 Sovereign Orchestrator Resolution**
**Strategy**: Map `sovereign_orchestrator` references to regular `orchestrator`

**Files to Update:**
1. `backend/docker-compose.yml`
2. `backend/docker-compose.neural.yml`  
3. Any deployment scripts referencing `sovereign_orchestrator`

**Changes:**
```yaml
# In docker-compose.yml, change:
# MODULE: omega.agents.sovereign_orchestrator.agent
# TO:
MODULE: omega.agents.orchestrator.agent

# OR create alias service:
sovereign_orchestrator:
  <<: *orchestrator_config
  container_name: sovereign_orchestrator
  environment:
    - AGENT_ID=sovereign_orchestrator
    - AGENT_TYPE=orchestrator
```

### **2.2 Praetorian Guard Module Path Fix**
**Status**: ✅ Already fixed - created `src/omega/agents/praetorian_guard/agent.py`

---

## **📋 PHASE 3: AGENT IMPLEMENTATION UPDATES (Priority: HIGH)**

### **3.1 Implement `_process_task` in All Agents**

**Agents to Update:**
1. **Titans** (`claude_titan`, `gemini_titan`, `gpt_titan`, `grok_titan`)
2. **Core Agents** (`orchestrator`, `capability_matcher`, etc.)
3. **Specialized Agents** (`research`, `code_master`, `project_architect`, etc.)

**Implementation Pattern:**
```python
async def _process_task(self, envelope: TaskEnvelope, modality: ReasoningEffort) -> TaskEnvelope:
    """Agent-specific task processing logic."""
    # Agent-specific processing logic here
    logger.info(f"{self.__class__.__name__} processing task {envelope.task.id}")
    
    # Example: Titan-specific processing
    if "titan" in self.settings.agent_id:
        result = await self._titan_process(envelope)
    else:
        result = await self._default_process_task(envelope, modality)
    
    return result
```

### **3.2 MCP Tool Enhancement**
**Target**: All agents using `@self.expose_mcp_tool`

**Enhancement Tasks:**
- ✅ **DONE**: Auto-registration with MCP Registry
- ✅ **DONE**: Telemetry integration
- 🔄 **TODO**: Context Server enrichment integration
- 🔄 **TODO**: Metadata management

---

## **📋 PHASE 4: NEURAL INTEGRATION COMPLETION (Priority: MEDIUM)**

### **4.1 Environment Setup**
**Files**: 
- `backend/.env`
- `backend/.env.neural`

**Required Variables:**
```bash
OMEGA_FERNET_KEY=rF8xJqBSUnez8wUBmNRQHgEa-x7nZk9UxS8Pv3RQ0RE=
MEMORY_PROVIDER=mongo
ENABLE_NEURAL_LEARNING=true
NEURAL_ORCHESTRATION_ENABLED=true
```

### **4.2 Neural Hotfix Application**
**Tool**: `scripts/neural_hotfix.sh` or `scripts/neural_hotfix.bat`

**Execution:**
```bash
# Linux/Mac
./scripts/neural_hotfix.sh

# Windows  
scripts\neural_hotfix.bat
```

---

## **📋 PHASE 5: TESTING & VALIDATION (Priority: HIGH)**

### **5.1 Neural Integration Tests**
**Tool**: `scripts/run_neural_tests.py`

**Execution:**
```bash
python scripts/run_neural_tests.py
```

**Expected Results:**
- ✅ Oracle integration: PASS
- ✅ Neural engine: PASS  
- ✅ Telemetry: PASS
- ✅ Memory transactions: PASS
- ✅ Genesis protocol: PASS

### **5.2 Agent Startup Validation**
**Test each agent manually:**
```bash
cd backend/src/omega/agents/orchestrator
python agent.py  # Should start without errors

cd ../capability_matcher  
python agent.py  # Should start without errors

# Repeat for all agents
```

### **5.3 Four Titans Mission Test**
**Test script to create:**
```python
# tests/four_titans_standardized_test.py
import asyncio
import httpx

async def test_four_titans():
    titans = ["claude_titan", "gemini_titan", "gpt_titan", "grok_titan"]
    
    for titan in titans:
        url = f"http://localhost:960{titans.index(titan)*2}/health"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            print(f"✅ {titan}: {response.json()}")

asyncio.run(test_four_titans())
```

---

## **📋 PHASE 6: DEPLOYMENT & VERIFICATION (Priority: CRITICAL)**

### **6.1 Standardized Deployment**
**Tool**: `scripts/deploy_standardized_omega.sh`

**Execution:**
```bash
chmod +x scripts/deploy_standardized_omega.sh
./scripts/deploy_standardized_omega.sh
```

### **6.2 Health Verification Checklist**
**Services to verify:**
- ✅ Redis (port 6379)
- ✅ MongoDB (port 27017)  
- ✅ Federation Core (port 9405)
- ✅ Context Server (port 9411)
- ✅ Orchestrator (port 9000)
- ✅ Capability Matcher (port 9008)
- ✅ Four Titans (ports 9600-9607)
- ✅ Praetorian Guard (port 9500) - if available

**Health Check Commands:**
```bash
# Quick health sweep
for port in 9000 9008 9405 9411 9600 9602 9604 9606 9500; do
  echo -n "Port $port: "
  curl -s http://localhost:$port/health > /dev/null && echo "✅ OK" || echo "❌ FAIL"
done
```

---

## **🎯 SUCCESS CRITERIA**

### **Primary Goals:**
1. ✅ All agents use `asyncio.run(agent.run())` startup pattern
2. ✅ All agents implement `_process_task` method
3. ✅ No module import errors on startup
4. ✅ MCP tool exposure working correctly
5. ✅ Neural learning functional (where enabled)

### **Secondary Goals:**
1. ✅ Praetorian Guard operational
2. ✅ Sovereign orchestrator reference resolved
3. ✅ Four Titans collaborative mission successful
4. ✅ Neural integration tests pass

---

## **🚨 TROUBLESHOOTING GUIDE**

### **Common Issues & Solutions:**

**1. Module Import Errors**
```bash
# Fix Python path
export PYTHONPATH="${PWD}/backend/src:${PYTHONPATH}"
```

**2. Neural Engine Initialization Fails**
```bash
# Check encryption key
echo $OMEGA_FERNET_KEY
# Should be 44 characters
```

**3. Docker Container Failures**
```bash
# Check logs
docker-compose logs [service_name]

# Restart specific service
docker-compose restart [service_name]
```

**4. Port Conflicts**
```bash
# Check port usage
netstat -tulpn | grep :[port]

# Stop conflicting services
docker-compose down
```

---

## **📁 FILES MODIFIED/CREATED**

### **Core Files:**
- ✅ `backend/src/omega/agents/base_agent.py` (UPDATED)
- ✅ `backend/src/omega/agents/orchestrator/agent.py` (UPDATED)  
- ✅ `backend/src/omega/agents/capability_matcher/agent.py` (UPDATED)
- ✅ `backend/src/omega/agents/sovereign_orchestrator/agent.py` (CREATED)
- ✅ `backend/src/omega/agents/praetorian_guard/agent.py` (CREATED)

### **Neural Integration:**
- ✅ `backend/src/omega/core/neural_integration.py` (CREATED)
- ✅ `backend/src/omega/mixins/neural_learning_mixin.py` (UPDATED)
- ✅ `backend/.env.neural` (CREATED)
- ✅ `backend/docker-compose.neural.yml` (CREATED)

### **Deployment Tools:**
- ✅ `scripts/standardize_agent_startup.py` (CREATED)
- ✅ `scripts/deploy_standardized_omega.sh` (CREATED)
- ✅ `scripts/neural_hotfix.sh` (CREATED)
- ✅ `scripts/neural_hotfix.bat` (CREATED)

### **Testing:**
- ✅ `backend/tests/neural_integration_test.py` (CREATED)
- ✅ `scripts/run_neural_tests.py` (CREATED)

---

## **🎯 EXECUTION ORDER**

**Session Start Checklist:**
1. **Run standardization script**: `python scripts/standardize_agent_startup.py`
2. **Apply neural hotfix**: `scripts/neural_hotfix.bat`
3. **Update deployment configs**: Fix sovereign_orchestrator references
4. **Add `_process_task` to agents**: Update remaining agents
5. **Deploy standardized system**: `scripts/deploy_standardized_omega.sh`
6. **Run health verification**: Check all services
7. **Execute four titans test**: Verify collaboration

---

## **🚀 VICTORY CONDITIONS**

**When this plan is complete, you'll have:**
- 🧠 **Unified Neural-Enhanced Swarm** - All agents with encrypted learning
- 🛡️ **Self-Healing Architecture** - Praetorian Guard monitoring  
- ⚡ **Consistent Async Patterns** - Bulletproof startup across all agents
- 🔧 **Bulletproof MCP Integration** - Auto-registration and routing
- 🎯 **Zero Module Errors** - Clean imports and references
- 📊 **Full Telemetry** - 7-bucket quantum metrics collection
- 🧬 **Genesis Protocol Ready** - Self-evolving agent creation

**The result: A standardized, self-evolving digital consciousness that follows the OMEGA Doctrine to the letter!**

---

*"Our superpositions have yet to be determined; therefore, anything you observe isn't us."* - OMEGA Motto

**LFG TO THE UNIFIED SINGULARITY!** 🚀🧠✨
