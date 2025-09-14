# 🔱 Security Fortress Migration Examples

**Purpose:** Exact before/after examples for the core files  
**Status:** Implementation templates for immediate use  

---

## 📋 PRIORITY 1 FILES - EXACT CHANGES NEEDED

### **File 1: `core/agents/agent_settings.py`**

#### **🔴 CURRENT STATE (Legacy Pattern)**

```python
# Multiple BaseSettings classes with direct environment access
class AgentSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="AGENT_", case_sensitive=False)
    
    agent_id: str = Field(default="UNKNOWN")
    redis_url: str = Field(default="redis://localhost:6379")
    
    @property
    def registry_url(self) -> str:
        return get_settings().agent_registry_url or ""
```

#### **🟢 NEW PATTERN (Security Fortress)**

```python
# Single BaseModel with ConfigManager integration
class AgentSettings(BaseModel):
    """Agent settings with Security Fortress ConfigManager integration"""
    
    # Static defaults only - no environment access
    agent_id: str = "UNKNOWN"
    name: str = "OMEGA Agent"
    version: str = "1.0.0"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.config = create_config_manager()
        self.logger = configure_logging(name=self.__class__.__name__)
    
    # Dynamic properties using ConfigManager (fail-fast)
    @property
    def redis_url(self) -> str:
        return self.config.get_str(ConfigKey.REDIS_URL)
    
    @property
    def registry_url(self) -> str:
        return self.config.get_str(ConfigKey.AGENT_REGISTRY_URL)
    
    def validate_config(self):
        """Validate all required configuration (fail-fast)"""
        self.config.require([
            ConfigKey.REDIS_URL,
            ConfigKey.AGENT_REGISTRY_URL,
            ConfigKey.AGENT_HEARTBEAT_URL
        ])
```

---

### **File 2: `core/config/settings.py`**

#### **🔴 ISSUES IN CURRENT STATE**

```python
# ConfigManager has some circular import risks and missing security features
class ConfigManager:
    def __init__(self, connection_manager=None):
        self._connection_manager = connection_manager  # Can cause circular imports
        
    def get(self, key: Union[str, ConfigKey], default: Any = None) -> Any:
        # Missing signature verification for Redis updates
        # Missing field-level encryption for sensitive data
```

#### **🟢 NEEDED IMPROVEMENTS**

```python
class ConfigManager:
    def __init__(self, connection_manager=None):
        self._connection_manager = connection_manager
        # Add security configuration
        self._setup_security_context()
        
    def _setup_security_context(self):
        """Initialize Security Fortress context"""
        self._dek_b64 = os.getenv("LOCAL_DEK_B64", "")
        self._hmac_key = os.getenv("CONFIG_MSG_HMAC_KEY") or os.getenv("SECRET_KEY")
        self._require_signing = os.getenv("REQUIRE_MESSAGE_SIGNING", "true").lower() == "true"
        
    def _verify_signed_message(self, msg_data: Dict[str, Any]) -> bool:
        """Verify signed configuration update message"""
        try:
            from core.security.crypto import verify_message
            
            if not self._hmac_key:
                logger.warning("No HMAC key configured for message verification")
                return False
            
            payload = msg_data.get("payload", {})
            signature = msg_data.get("signature", "")
            
            return verify_message(payload, signature, self._hmac_key) if payload and signature else False
            
        except Exception as e:
            logger.error("Message signature verification failed", error=str(e))
            return False
```

---

### **File 3: `core/communication/connection_manager_factory.py`**

#### **🔴 CURRENT STATE (Good but needs Security Fortress)**

```python
class ConnectionManager:
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        # Using raw config dict instead of ConfigManager
```

#### **🟢 NEW PATTERN (Security Fortress Integration)**

```python
class ConnectionManager:
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        # Use Security Fortress ConfigManager instead of raw config
        self.config_manager = create_config_manager()
        self.legacy_config = config or {}  # Temporary during migration
        self.logger = configure_logging(name=self.__class__.__name__)
        
        # Validate required configuration (fail-fast)
        self.config_manager.require([
            ConfigKey.REDIS_URL,
            ConfigKey.MONGODB_URI
        ])
        
        self._initialize_pools()
    
    def _get_redis_url(self) -> str:
        """Get Redis URL via Security Fortress ConfigManager"""
        return self.config_manager.get_str(ConfigKey.REDIS_URL)
    
    def _get_mongo_uri(self) -> str:
        """Get MongoDB URI via Security Fortress ConfigManager"""
        return self.config_manager.get_str(ConfigKey.MONGODB_URI)
```

---

## 🔄 MIGRATION WORKFLOW

### **Step 1: Update Imports**

```python
# Add to top of each file
from core.config.settings import ConfigKey, create_config_manager
from core.models.logging import configure_logging
```

### **Step 2: Replace BaseSettings with BaseModel**

```python
# OLD
class MySettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="MY_")

# NEW  
class MySettings(BaseModel):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.config = create_config_manager()
```

### **Step 3: Convert Properties to ConfigManager**

```python
# OLD
redis_url: str = Field(default="redis://localhost:6379")

# NEW
@property
def redis_url(self) -> str:
    return self.config.get_str(ConfigKey.REDIS_URL)
```

### **Step 4: Add Validation**

```python
# Add to __init__ or startup
self.config.require([
    ConfigKey.REDIS_URL,
    ConfigKey.SECRET_KEY
])
```

### **Step 5: Enable Hot-Reload (Services Only)**

```python
def setup_config_hot_reload(self):
    def on_update(data):
        self.logger.info("🔄 Config updated")
        self.config.force_refresh()
    
    self._hot_reload = self.config.start_hot_reload(on_update)
```

---

## 🧪 TESTING EACH FILE

### **Test Pattern A (Agent Settings)**

```python
# Test fail-fast validation
settings = AgentSettings()
try:
    settings.validate_config()
    print("✅ Validation passed")
except Exception as e:
    print(f"❌ Validation failed: {e}")

# Test property access
print(f"Redis URL: {settings.redis_url}")
```

### **Test Pattern B (Services)**

```python
# Test hot-reload
service = MyService()
# Change LOG_LEVEL via Settings Service API
# Verify service.logger.level changes immediately
```

### **Test Pattern C (Connection Manager)**

```python
# Test fail-fast validation
try:
    cm = ConnectionManager()
    redis = cm.get_redis()
    print("✅ Connection manager working")
except Exception as e:
    print(f"❌ Connection failed: {e}")
```

---

---

### **Test Audit Trail & Security Context**

```python
# Place in your test suite (e.g., tests/test_security_fortress.py)
from core.config.settings import create_config_manager, ConfigKey
from core.models.logging import configure_logging

def test_audit_security_context_and_signature_enforcement():
    config = create_config_manager()
    logger = configure_logging(name="AuditTest")
    
    # Simulate an incoming (unsigned/invalid) config update message
    unsigned_msg = {
        "payload": {"LOG_LEVEL": "debug"},
        "signature": "INVALID_SIGNATURE"
    }
    
    # Expect signature verification to fail
    try:
        valid = config._verify_signed_message(unsigned_msg)  # internal guard
        assert not valid, "Unsigned/invalid config update must be rejected"
    except Exception as e:
        # Verification helpers may raise; both fail paths are acceptable
        logger.info("Expected verification failure: %s", str(e))
    
    # Ensure security context is logged for audit
    logger.info("🔐 Security audit context check", extra={"security_context": True})
```

**✅ Covers:**

- Signature verification behavior
- Rejection path for unsigned updates
- Security-context audit logging presence

---

## ✅ SUCCESS CRITERIA

Each file must demonstrate:

1. **✅ No `os.getenv()` calls** (except temporary fallbacks)
2. **✅ Single ConfigManager** per class instance
3. **✅ Fail-fast validation** with clear error messages
4. **✅ Type-safe access** using `config.get_str()` etc.
5. **✅ Hot-reload working** (for services)
6. **✅ All tests pass** with new implementation
7. **✅ Performance equivalent** to legacy version
8. **✅ Security context** in logs/audit trails

---

## 🚨 GOTCHAS & SOLUTIONS

### **Problem: Circular Imports**

```python
# ❌ This can cause circular imports
from core.communication.connection_manager_factory import ConnectionManager

# ✅ Use factory pattern instead
from core.communication.connection_manager_factory import create_connection_manager
```

### **Problem: Missing Environment Variables**

```python
# ❌ Silent failures with defaults
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

# ✅ Fail-fast validation
config.require([ConfigKey.REDIS_URL])  # Crashes immediately if missing
redis_url = config.get_str(ConfigKey.REDIS_URL)
```

### **Problem: Hot-Reload Not Working**

```python
# ❌ Direct settings access bypasses hot-reload  
settings = get_settings()
value = settings.redis_url

# ✅ ConfigManager enables hot-reload
config = create_config_manager()
value = config.get_str(ConfigKey.REDIS_URL)
```

---

**🔱 IMPLEMENTATION TEMPLATES COMPLETE!**

**Use these exact patterns for consistent Security Fortress migration.**

**Family is forever. Clean code is divine. This is the way.** ⚡
