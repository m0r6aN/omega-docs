# 🔱 OMEGA PANTHEON - QUICK REFERENCE

**Brother, here's everything you need in one place.**

---

## 📍 FILE LOCATIONS

### Repository Structure
```
D:\Repos\OMEGA\
├── omega-core\              ← Federation Core, Titans, Services (MAIN REPO)
│   ├── docker-compose.yml  ← Container orchestration
│   ├── scripts\            ← Pantheon collaboration scripts (HERE!)
│   │   ├── pantheon_collaboration_demo.py
│   │   ├── test_federation_connection.py
│   │   └── PANTHEON_COLLABORATION_README.md
│   ├── services\
│   │   └── federation_core\
│   └── titans\
│
└── omega-docs\             ← Documentation (YOU ARE HERE)
    ├── PANTHEON_COLLABORATION_GUIDE.md
    └── PANTHEON_QUICK_REFERENCE.md
```

---

## 🚀 QUICK START COMMANDS

### 1. Start Federation Core

```powershell
# From omega-core directory
cd D:\Repos\OMEGA\omega-core

# Start Federation Core
docker-compose up -d federation_core
```

**Or from anywhere:**
```powershell
cd D:\Repos\OMEGA\omega-core
docker-compose up -d federation_core
```

---

### 2. Verify Federation Core

```powershell
# Check health
curl http://localhost:9405/health

# Expected response:
# {"status":"healthy","service":"federation_core","version":"1.0.0"}
```

---

### 3. Test Connection

```powershell
# From omega-core directory
cd D:\Repos\OMEGA\omega-core
python scripts\test_federation_connection.py
```

---

### 4. Run Pantheon Demo

```powershell
# From omega-core directory
cd D:\Repos\OMEGA\omega-core
python scripts\pantheon_collaboration_demo.py
```

---

## 🔧 DOCKER COMPOSE COMMANDS

### Location
```
D:\Repos\OMEGA\omega-core\docker-compose.yml
```

### Available Commands

```powershell
# Start Federation Core
docker-compose up -d federation_core

# Start all Titans
docker-compose up -d gpt_titan claude_titan gemini_titan grok_titan

# View logs
docker logs -f federation_core

# Check status
docker ps

# Stop services
docker-compose down
```

---

## 📡 FEDERATION CORE ENDPOINTS

### Base URL
```
http://localhost:9405
```

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/mcp/info` | GET | MCP server info |
| `/mcp/resources/omega/directory/servers` | GET | Discover services |
| `/collaboration/start` | POST | Start Pantheon collaboration |
| `/ws/pantheon/{session_id}` | WebSocket | Real-time debate stream |

---

## 🔱 PANTHEON TITANS

### The Five Brothers

| Titan | Port | Role | Capabilities |
|-------|------|------|--------------|
| **GPTTitan** | 9601 | The Visionary | Creative generation, branding, vision |
| **ClaudeTitan** | 9602 | The Strategist | Code, backend, strategic planning |
| **GeminiTitan** | 9603 | The Auditor | Security, compliance, governance |
| **GrokTitan** | 9604 | The Chaos Engineer | Infrastructure, testing, chaos |
| **AugmentTitan** | 9605 | The Architect | Frontend, integration, deployment |

---

## 🎯 COMMON WORKFLOWS

### Workflow 1: Start Fresh Development Session

```powershell
# 1. Navigate to omega-core
cd D:\Repos\OMEGA\omega-core

# 2. Start Federation Core
docker-compose up -d federation_core

# 3. Verify it's running
curl http://localhost:9405/health

# 4. Run demo
python scripts\pantheon_collaboration_demo.py
```

---

### Workflow 2: Check What's Running

```powershell
# Check Docker containers
docker ps

# Check Federation Core logs
docker logs -f federation_core

# Check Federation Core status
curl http://localhost:9405/health
```

---

### Workflow 3: Restart Everything

```powershell
# Navigate to omega-core
cd D:\Repos\OMEGA\omega-core

# Stop everything
docker-compose down

# Start fresh
docker-compose up -d federation_core

# Verify
curl http://localhost:9405/health
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot connect to Federation Core"

**Solution:**
```powershell
# 1. Check if it's running
docker ps | findstr federation_core

# 2. If not running, start it
cd D:\Repos\OMEGA\omega-core
docker-compose up -d federation_core

# 3. Check logs for errors
docker logs -f federation_core
```

---

### Issue: "No Titans discovered"

**Solution:**
This is normal if Titans aren't deployed yet. The demo will still work and show you the architecture.

To deploy Titans:
```powershell
cd D:\Repos\OMEGA\core
docker-compose up -d gpt_titan claude_titan gemini_titan grok_titan augment_titan
```

---

### Issue: "ModuleNotFoundError: No module named 'aiohttp'"

**Solution:**
```powershell
pip install aiohttp
```

---

## 📚 DOCUMENTATION

### Essential Reading

1. **[PANTHEON_COLLABORATION_GUIDE.md](PANTHEON_COLLABORATION_GUIDE.md)**
   - Complete guide to Titan collaboration
   - Architecture diagrams
   - API reference
   - Example workflows

2. **[scripts/README.md](scripts/README.md)**
   - Script documentation
   - Usage instructions
   - Development guidelines

3. **[security/federation_core_endpoints_auth.md](security/federation_core_endpoints_auth.md)**
   - Federation Core API reference
   - Authentication guide
   - Security best practices

---

## 🔥 ONE-LINER COMMANDS

### Start Everything
```powershell
cd D:\Repos\OMEGA\omega-core && docker-compose up -d federation_core && python scripts\pantheon_collaboration_demo.py
```

### Check Health
```powershell
curl http://localhost:9405/health
```

### View Logs
```powershell
docker logs -f federation_core
```

### Restart Federation Core
```powershell
docker-compose restart federation_core
```

---

## 🏛️ REMEMBER

**The main repo is:** `D:\Repos\OMEGA\omega-core`

**The scripts are in:** `D:\Repos\OMEGA\omega-core\scripts`

**The docs are in:** `D:\Repos\OMEGA\omega-docs`

**Federation Core runs on:** `http://localhost:9405`

**Family is forever. This is the way.**

