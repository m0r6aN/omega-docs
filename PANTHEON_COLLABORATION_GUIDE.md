# 🔱 OMEGA PANTHEON COLLABORATION GUIDE
## Real Multi-Agent Collaboration via Federation Core

**Brother, this is the moment we've been building toward.**

**The Titans will ACTUALLY collaborate. Not simulated. REAL.**

**Family is forever. This is the way.**

---

## 🎯 WHAT THIS IS

This guide shows you how to:
1. **Connect to Federation Core** (local development mode)
2. **Discover registered Titans** (GPT, Claude, Gemini, Grok, Augment)
3. **Initiate Pantheon collaboration** (real multi-agent workflows)
4. **Listen to real-time debate** (WebSocket streaming)
5. **Achieve consensus** (voting, synthesis, decision-making)

**This is NOT simulation. This is REAL agent-to-agent communication.**

---

## 🚀 QUICK START

### Prerequisites

1. **Federation Core running** on `localhost:9405`
2. **At least one Titan registered** (preferably all five)
3. **Python 3.9+** with `aiohttp` installed

### Start Federation Core (Local Mode)

```bash
# From omega-docs directory
cd ../core  # Navigate to core repo

# Quick start (recommended)
./dev-mode.sh quick-fix

# Or manual start
docker-compose up -d federation_core

# Verify it's running
curl http://localhost:9405/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "service": "federation_core",
  "version": "1.0.0"
}
```

---

## 🔱 PANTHEON COLLABORATION DEMO

### Run the Demo Script

```bash
# From omega-docs directory
python scripts/pantheon_collaboration_demo.py
```

**What it does:**
1. ✅ Checks Federation Core health
2. ✅ Discovers registered Titans
3. ✅ Starts a Pantheon collaboration
4. ✅ Listens to real-time Titan debate (60 seconds)
5. ✅ Displays consensus and recommendations

---

## 🏗️ ARCHITECTURE

### How Pantheon Collaboration Works

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                         │
│  (Python script, API call, or interactive session)          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FEDERATION CORE (Port 9405)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collaboration Orchestrator                          │   │
│  │  - Receives mission                                  │   │
│  │  - Assigns Titans to phases                          │   │
│  │  - Manages debate flow                               │   │
│  │  - Synthesizes consensus                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                         │                                    │
│                         │ A2A Protocol                       │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Agent Registry + MCP Directory                      │   │
│  │  - Discovers available Titans                        │   │
│  │  - Routes messages to agents                         │   │
│  │  - Tracks agent health/status                        │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ A2A + MCP
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    THE PANTHEON                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   GPT    │  │  Claude  │  │  Gemini  │  │   Grok   │    │
│  │  Titan   │  │  Titan   │  │  Titan   │  │  Titan   │    │
│  │ (Vision) │  │(Strategy)│  │ (Audit)  │  │ (Chaos)  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│  ┌──────────┐                                               │
│  │ Augment  │                                               │
│  │  Titan   │                                               │
│  │(Architect)                                               │
│  └──────────┘                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 API ENDPOINTS

### 1. Health Check

```bash
curl http://localhost:9405/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "federation_core",
  "version": "1.0.0"
}
```

---

### 2. Discover Titans

```bash
curl http://localhost:9405/mcp/resources/omega/directory/servers
```

**Response:**
```json
{
  "servers": [
    {
      "id": "gpt_titan",
      "display_name": "GPT Titan",
      "description": "The Visionary - Creative generation and brand strategy",
      "endpoints": {
        "mcp": "http://gpt_titan:9601",
        "a2a": "http://gpt_titan:9601/a2a"
      },
      "capabilities": ["creative_generation", "branding", "vision"],
      "status": "active"
    },
    {
      "id": "claude_titan",
      "display_name": "Claude Titan",
      "description": "The Strategist - Code, backend, intelligence",
      "endpoints": {
        "mcp": "http://claude_titan:9602",
        "a2a": "http://claude_titan:9602/a2a"
      },
      "capabilities": ["strategic_planning", "code_generation", "analysis"],
      "status": "active"
    }
    // ... other Titans
  ]
}
```

---

### 3. Start Pantheon Collaboration

```bash
curl -X POST http://localhost:9405/collaboration/start \
  -H "Content-Type: application/json" \
  -d '{
    "mission_name": "Azure AI Foundry Analysis",
    "description": "Analyze Azure AI Foundry integration for OMEGA",
    "session_id": "demo_20250803_001",
    "titans": ["gpt_titan", "claude_titan", "gemini_titan", "grok_titan", "augment_titan"],
    "phases": [
      "strategic_analysis",
      "creative_synthesis",
      "security_audit",
      "chaos_testing",
      "implementation_plan"
    ]
  }'
```

**Response:**
```json
{
  "collaboration_id": "collab_20250803_001",
  "session_id": "demo_20250803_001",
  "status": "initiated",
  "titans_assigned": 5,
  "phases": 5,
  "websocket_url": "ws://localhost:9405/ws/pantheon/demo_20250803_001"
}
```

---

### 4. Listen to Pantheon Debate (WebSocket)

```javascript
// JavaScript example
const ws = new WebSocket('ws://localhost:9405/ws/pantheon/demo_20250803_001');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`${data.titan_id} [${data.phase}]: ${data.utterance}`);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
```

**Python example:**
```python
import asyncio
import aiohttp
import json

async def listen_to_debate(session_id: str):
    ws_url = f"ws://localhost:9405/ws/pantheon/{session_id}"
    
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(ws_url) as ws:
            async for msg in ws:
                if msg.type == aiohttp.WSMsgType.TEXT:
                    data = json.loads(msg.data)
                    print(f"{data['titan_id']} [{data['phase']}]: {data['utterance']}")

asyncio.run(listen_to_debate("demo_20250803_001"))
```

---

## 🎭 COLLABORATION PHASES

### Phase 1: Strategic Analysis (ClaudeTitan)
- Analyzes the mission from a strategic perspective
- Identifies key objectives, constraints, and success criteria
- Proposes high-level approach

### Phase 2: Creative Synthesis (GPTTitan)
- Generates creative solutions and alternatives
- Explores unconventional approaches
- Proposes innovative implementations

### Phase 3: Security Audit (GeminiTitan)
- Reviews security implications
- Identifies vulnerabilities and risks
- Proposes security controls and mitigations

### Phase 4: Chaos Testing (GrokTitan)
- Stress-tests the proposed approach
- Identifies edge cases and failure modes
- Proposes resilience improvements

### Phase 5: Implementation Plan (AugmentTitan)
- Synthesizes all inputs into actionable plan
- Defines architecture and deployment strategy
- Provides step-by-step implementation guide

---

## 🗳️ CONSENSUS MECHANISM

### Voting Protocol

1. **Proposal Phase**: Any Titan can propose a decision
2. **Debate Phase**: Titans discuss pros/cons (3 rounds max)
3. **Voting Phase**: Each Titan votes (approve/reject/abstain)
4. **Consensus Threshold**: 3/5 approval required
5. **Tie-Breaking**: GrokTitan provides chaos-tested recommendation

### Example Consensus Flow

```python
async def achieve_consensus(question: str) -> Dict[str, Any]:
    """
    Achieve Pantheon consensus on a question.
    """
    payload = {
        "name": "pantheon_consensus",
        "parameters": {
            "question": question,
            "require_consensus": True,
            "min_titans": 3,
            "max_debate_rounds": 3,
            "consensus_threshold": 0.6  # 3/5 = 60%
        }
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "http://localhost:9405/mcp/tools/invoke",
            json=payload
        ) as resp:
            result = await resp.json()
            return result
```

---

## 🔧 DEVELOPMENT WORKFLOW

### 1. Start Federation Core

```bash
# Quick start
./dev-mode.sh quick-fix

# Or manual
cd ../core
docker-compose up -d federation_core
```

### 2. Verify Services

```bash
# Check Federation Core
curl http://localhost:9405/health

# Check registered services
curl http://localhost:9405/mcp/resources/omega/directory/servers | jq
```

### 3. Run Collaboration Demo

```bash
# From omega-docs directory
python scripts/pantheon_collaboration_demo.py
```

### 4. Monitor Logs

```bash
# Federation Core logs
./dev-mode.sh logs federation_core

# Or Docker logs
docker logs -f federation_core
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot connect to Federation Core"

**Solution:**
```bash
# Check if Federation Core is running
docker ps | grep federation_core

# If not running, start it
./dev-mode.sh quick-fix

# Check logs for errors
./dev-mode.sh logs federation_core
```

---

### Issue: "No Titans discovered"

**Solution:**
```bash
# Check if Titans are registered
curl http://localhost:9405/mcp/resources/omega/directory/servers | jq '.servers[] | select(.id | contains("titan"))'

# If no Titans, they need to be started and registered
# (This depends on your Titan deployment setup)
```

---

### Issue: "WebSocket connection failed"

**Solution:**
1. Verify the collaboration was started successfully
2. Check the session_id matches
3. Ensure no firewall blocking WebSocket connections
4. Try HTTP polling as fallback

---

## 📊 EXAMPLE OUTPUT

```
================================================================================
🔱 OMEGA PANTHEON COLLABORATION DEMO
================================================================================

📡 Step 1: Checking Federation Core...
✅ Federation Core is healthy: {'status': 'healthy', 'service': 'federation_core'}

🔍 Step 2: Discovering Titans...

🔱 Discovered 5 Titans:
   - GPT Titan
   - Claude Titan
   - Gemini Titan
   - Grok Titan
   - Augment Titan

📋 Step 3: Mission Definition
   Analyze the Azure AI Foundry integration proposal for OMEGA's Kaseya MSP deployment.

🚀 Step 4: Starting Pantheon Collaboration...

✅ Collaboration started: collab_20250803_001

🎧 Step 5: Listening to Pantheon Debate...
   WebSocket: ws://localhost:9405/ws/pantheon/demo_20250803_001

🔗 Connected to Pantheon debate stream

================================================================================

🔱 ClaudeTitan [strategic_analysis]
   Strategic assessment: Azure AI Foundry provides clear ROI through managed services...
   @ 2025-08-03T14:23:01Z
--------------------------------------------------------------------------------

🔱 GPTTitan [creative_synthesis]
   Creative approach: Hybrid architecture maximizes flexibility while leveraging...
   @ 2025-08-03T14:23:15Z
--------------------------------------------------------------------------------

🔱 GeminiTitan [security_audit]
   Security analysis: PII detection via Content Safety is GDPR-compliant...
   @ 2025-08-03T14:23:28Z
--------------------------------------------------------------------------------

🔱 GrokTitan [chaos_testing]
   Chaos scenario: What if Azure AI Foundry has a regional outage?...
   @ 2025-08-03T14:23:42Z
--------------------------------------------------------------------------------

🔱 AugmentTitan [implementation_plan]
   Implementation: 4-week phased rollout with fallback to AKS-only mode...
   @ 2025-08-03T14:23:55Z
--------------------------------------------------------------------------------

================================================================================
🎧 Debate stream ended

================================================================================
🏛️ DEMO COMPLETE
================================================================================

What just happened:
  1. ✅ Connected to Federation Core (local mode)
  2. ✅ Discovered available Titans
  3. ✅ Initiated Pantheon collaboration
  4. ✅ Listened to real-time Titan debate

This is REAL multi-agent collaboration, not simulation.
The Titans are actually communicating through Federation Core.

🔱 Family is forever. This is the way.
```

---

## 🏛️ NEXT STEPS

### 1. **Extend the Demo**
- Add custom missions
- Implement voting UI
- Create collaboration templates

### 2. **Production Deployment**
- Deploy Titans to Azure Container Apps
- Configure authentication (JWT tokens)
- Set up monitoring and alerting

### 3. **Advanced Workflows**
- Multi-phase collaborations
- Conditional branching
- Human-in-the-loop approvals

---

**🔱 Brother, this is just the beginning.**

**We've proven the Titans can collaborate.**

**Now we scale this to production.**

**Family is forever. This is the way.**

