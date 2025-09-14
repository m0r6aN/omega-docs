# 🔱 Security Fortress Quick Reference - Titan Cheat Sheet

**Purpose:** Lightning-fast reference for Security Fortress migration patterns  
**Usage:** Keep this open while coding  

---

## ⚡ QUICK IMPORTS

```python
# Standard Security Fortress imports
from core.config.settings import ConfigKey, create_config_manager, get_settings
from core.models.logging import configure_logging
from core.communication.connection_manager_factory import create_connection_manager
```

---

## ⚡ QUICK PATTERNS

### **🅰️ Agent Pattern (inherit from BaseAgent)**

```python
class MyAgent:
    def __init__(self, settings: Optional[BaseAgentSettings] = None):
        self.settings = settings or BaseAgentSettings()
        self.settings.validate_required_config()  # FAIL-FAST
        self.logger = configure_logging(name=self.__class__.__name__)
        self.config = self.settings.config  # Security Fortress access
```

### **🅱️ Service Pattern (FastAPI services)**

```python
class MyService:
    def __init__(self):
        self.config = create_config_manager()
        self.logger = configure_logging(name=self.__class__.__name__)
        self.config.require([ConfigKey.REDIS_URL, ConfigKey.SECRET_KEY])  # FAIL-FAST
        self.setup_config_hot_reload()
```

### **©️ Factory Pattern**

```python
def create_my_thing():
    config = create_config_manager()
    config.require([ConfigKey.REDIS_URL])  # FAIL-FAST
    return MyThing(config.get_str(ConfigKey.REDIS_URL))
```

### **🇩 Settings Pattern**

```python
class MySettings(BaseModel):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.config = create_config_manager()
    
    @property
    def redis_url(self) -> str:
        return self.config.get_str(ConfigKey.REDIS_URL)
```

---

## ⚡ QUICK REPLACEMENTS

### **Environment Access**

```python
# OLD ❌
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

# NEW ✅  
redis_url = config.get_str(ConfigKey.REDIS_URL)
```

### **Type-Safe Access**

```python
# String
url = config.get_str(ConfigKey.REDIS_URL)

# Integer  
port = config.get_int("PORT", 8080)

# Boolean
debug = config.get_bool(ConfigKey.DEBUG)

# Float
timeout = config.get_float("TIMEOUT", 10.5)
```

### **Fail-Fast Validation**

```python
# Single key
config.require([ConfigKey.REDIS_URL])

# Multiple keys
config.require([
    ConfigKey.REDIS_URL,
    ConfigKey.SECRET_KEY,
    ConfigKey.FEDERATION_CORE_URL
])
```

---

## ⚡ HOT-RELOAD SETUP

### **Service Hot-Reload (Standard)**

```python
def setup_config_hot_reload(self):
    def on_config_update(update_data):
        event = update_data.get('event', 'unknown')
        self.logger.info("🔄 Config updated: %s", event)
        self.config.force_refresh()
        
        # Handle LOG_LEVEL changes
        try:
            new_level = self.config.get_str(ConfigKey.LOG_LEVEL)
            self.logger.setLevel(new_level.upper())
        except Exception:
            pass
    
    self._hot_reload_thread = self.config.start_hot_reload(on_config_update)
```

---

## ⚡ CONNECTION MANAGER

### **Get Connections**

```python
# Get connection manager (once per class)
conn_manager = create_connection_manager()

# Get specific connections
redis = conn_manager.get_redis()
http_client = conn_manager.get_http_client()  
mongodb = conn_manager.get_mongodb()
websocket_manager = conn_manager.get_websocket_manager()
```

---

## ⚡ LOGGING SETUP

### **Standard Logging**

```python
# In __init__
self.logger = configure_logging(name=self.__class__.__name__)

# Usage
self.logger.info("🚀 Service started")
self.logger.error("❌ Operation failed: %s", error)
self.logger.debug("🔍 Debug info: %s", data)
```

---

## ⚡ COMMON CONFIG KEYS

### **Most Used Keys**

```python
ConfigKey.REDIS_URL              # Redis connection
ConfigKey.LOG_LEVEL              # Logging level  
ConfigKey.DEBUG                  # Debug mode
ConfigKey.SECRET_KEY             # Security key
ConfigKey.FEDERATION_CORE_URL    # Federation URL
ConfigKey.AGENT_REGISTRY_URL     # Agent registry
ConfigKey.CONTEXT_SERVER_URL     # Context server
ConfigKey.MONGODB_URI              # MongoDB
```

---

## ⚡ TESTING YOUR IMPLEMENTATION

### **Test Hot-Reload**

```bash
# Terminal 1: Start service
python your_service.py

# Terminal 2: Update config  
TOKEN=$(curl -s http://localhost:9421/admin/token | jq -r .token)
curl -X POST http://localhost:9421/config/patch \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"updates": {"LOG_LEVEL": "debug"}}'

# Verify: LOG_LEVEL changes immediately ✅
```

### **Test Fail-Fast**

```bash
# Remove required env var
unset REDIS_URL

# Start service - should fail with clear error
python your_service.py
# Expected: "Required setting 'REDIS_URL' is missing"
```

---

## ⚡ COMMON GOTCHAS

### **❌ DON'T DO**

```python
# Multiple ConfigManagers
self.config1 = create_config_manager()  # ❌
self.config2 = create_config_manager()  # ❌

# Mixed patterns  
self.old_way = os.getenv("OLD")         # ❌
self.new_way = config.get_str("NEW")    # ✅

# Bypass ConfigManager
settings = get_settings()               # ❌ (bypasses hot-reload)

# Circular imports (DO NOT import concrete managers directly)
from core.communication.connection_manager_factory import ConnectionManager  # ❌
```

### **✅ DO THIS**

```python  
# Single ConfigManager per class
self.config = create_config_manager()   # ✅

# All config via ConfigManager
url1 = config.get_str(ConfigKey.URL1)   # ✅
url2 = config.get_str(ConfigKey.URL2)   # ✅

# Always validate
config.require([ConfigKey.REDIS_URL])   # ✅

# Use factory for managers (avoids circular imports)
from core.communication.connection_manager_factory import create_connection_manager  # ✅
conn_manager = create_connection_manager()
redis = conn_manager.get_redis()
mongodb = conn_manager.get_mongodb()
http_client = conn_manager.get_http_client()
```

---

## ⚡ VALIDATION CHECKLIST

Before submitting:

- [ ] No `os.getenv()` calls
- [ ] Single ConfigManager per class
- [ ] `config.require([...])` validation
- [ ] Type-safe `config.get_str()` access
- [ ] Hot-reload setup (services only)
- [ ] Logging with `configure_logging()`
- [ ] Connection manager via factory

---

## ⚡ COMPLETION TEMPLATE

```markdown
- [x] `path/to/file.py` - [YourName] ✅
  - Pattern: A/B/C/D  
  - Validation: Pass
  - Hot-reload: Working
  - Tests: Pass
  - Notes: [Any issues/solutions]
```

---

**🔱 FORGE THE FORTRESS! ⚡**

**Keep this reference open while coding - copy/paste these patterns!**

**Family is forever. Clean code is divine. This is the way.**
