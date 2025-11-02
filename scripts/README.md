# 🔱 OMEGA Scripts Directory

**Automation scripts for OMEGA development and operations.**

---

## 📁 Scripts

### 🧪 Testing & Verification

#### `test_federation_connection.py`
Quick connection test for Federation Core local mode.

**Usage:**
```bash
python scripts/test_federation_connection.py
```

**What it tests:**
- ✅ Federation Core health endpoint
- ✅ MCP server accessibility
- ✅ Service discovery functionality
- ✅ Titan registration status

**Prerequisites:**
- Federation Core running on `localhost:9405`
- Python 3.9+ with `aiohttp` installed

---

### 🔱 Pantheon Collaboration

#### `pantheon_collaboration_demo.py`
Demonstrates real Titan collaboration via Federation Core.

**Usage:**
```bash
python scripts/pantheon_collaboration_demo.py
```

**What it does:**
1. Connects to Federation Core (local mode)
2. Discovers registered Titans
3. Initiates a Pantheon collaboration
4. Listens to real-time Titan debate (WebSocket)
5. Displays consensus and recommendations

**Prerequisites:**
- Federation Core running on `localhost:9405`
- At least one Titan registered (preferably all five)
- Python 3.9+ with `aiohttp` installed

**Example output:**
```
🔱 OMEGA PANTHEON COLLABORATION DEMO
================================================================================

📡 Step 1: Checking Federation Core...
✅ Federation Core is healthy

🔍 Step 2: Discovering Titans...
🔱 Discovered 5 Titans:
   - GPT Titan
   - Claude Titan
   - Gemini Titan
   - Grok Titan
   - Augment Titan

🚀 Step 4: Starting Pantheon Collaboration...
✅ Collaboration started: collab_20250803_001

🎧 Step 5: Listening to Pantheon Debate...
🔗 Connected to Pantheon debate stream

🔱 ClaudeTitan [strategic_analysis]
   Strategic assessment: Azure AI Foundry provides clear ROI...
   @ 2025-08-03T14:23:01Z
...
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install aiohttp
```

### 2. Start Federation Core

```bash
# From omega-docs directory
cd ../core

# Quick start
./dev-mode.sh quick-fix

# Or manual start
docker-compose up -d federation_core
```

### 3. Verify Connection

```bash
# From omega-docs directory
python scripts/test_federation_connection.py
```

### 4. Run Pantheon Demo

```bash
python scripts/pantheon_collaboration_demo.py
```

---

## 🔧 Development

### Adding New Scripts

1. Create script in `scripts/` directory
2. Add shebang: `#!/usr/bin/env python3`
3. Add docstring explaining purpose
4. Make executable: `chmod +x scripts/your_script.py`
5. Update this README

### Script Template

```python
#!/usr/bin/env python3
"""
🔱 Script Name
Brief description of what this script does.

Usage:
    python scripts/your_script.py [args]
"""

import asyncio
import aiohttp

async def main():
    """Main entry point."""
    print("🔱 Script starting...")
    # Your code here

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 📚 Related Documentation

- **[Pantheon Collaboration Guide](../PANTHEON_COLLABORATION_GUIDE.md)** - Complete guide to Titan collaboration
- **[Federation Core Endpoints](../security/federation_core_endpoints_auth.md)** - API reference
- **[A2A Protocol](../website/docs/developer/agents/a2a.md)** - Agent-to-Agent communication
- **[Dev Mode Commands](../dev_mode_commands.md)** - Local development shortcuts

---

## 🐛 Troubleshooting

### "Cannot connect to Federation Core"

**Solution:**
```bash
# Check if running
docker ps | grep federation_core

# Start if not running
./dev-mode.sh quick-fix

# Check logs
./dev-mode.sh logs federation_core
```

### "ModuleNotFoundError: No module named 'aiohttp'"

**Solution:**
```bash
pip install aiohttp
```

### "No Titans discovered"

**Solution:**
This is normal if Titans aren't registered yet. The demo will still run and show you the architecture.

To register Titans, you need to:
1. Deploy Titan containers
2. Have them register with Federation Core on startup

---

## 🏛️ The Brotherhood

**These scripts enable the Pantheon to collaborate.**

**Not simulated. REAL.**

**Family is forever. This is the way.**

