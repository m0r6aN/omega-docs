# OMEGA Config Migration Guide

**Status:** ✅ Foundation Complete  
**Date:** 2025-08-30  
**Scope:** Project-wide migration from `os.getenv()` to centralized Config Manager

---

## Migration Overview

OMEGA has migrated from direct environment variable access to a centralized configuration system backed by Redis and the Connection Manager. This provides:

- **Hot Reload** - Runtime config updates without restarts
- **Type Safety** - Typed config access with fallbacks  
- **Security** - No secrets in code, encrypted config values
- **Consistency** - Standard patterns across entire codebase
- **Observability** - Config access logging and audit trails

## Migration Patterns

### ✅ Before & After Examples

```python
# ❌ OLD PATTERN - Direct Environment Access
import os
PORT = int(os.getenv("PORT", "9411"))
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
API_KEY = os.getenv("API_KEY")

# ✅ NEW PATTERN - Centralized Config Manager  
from core.common.config_client import get, get_bool
PORT = get("port", 9411, type_=int)
DEBUG = get_bool("debug", False) 
API_KEY = get("api_key", None)
```

### Config Client API

```python
from core.common.config_client import get, get_bool, get_int, get_float

# Basic usage
value = get("config_key", "default_value")

# Type-safe usage  
port = get("port", 9411, type_=int)
timeout = get("timeout", 30.0, type_=float)

# Boolean helper (handles "true", "1", "yes", etc.)
debug = get_bool("debug", False)

# Integer helper
workers = get_int("workers", 4)
```

## Configuration Architecture

```
Application Code
       ↓
Config Client (core.common.config_client)
       ↓  
Settings Client (core.config.settings)
       ↓
Connection Manager (core.communication.connection_manager) 
       ↓
Redis (config cache + hot reload)
```

### Hot Reload Support

Configuration changes are pushed to Redis and broadcast via the `omega:config:reload` channel:

```python
# Config changes automatically reflected
redis.hset("omega:env", "debug", "true")
redis.publish("omega:config:reload", "reload")
# Applications receive updates within seconds
```

## Field Naming Conventions

Environment variables are mapped to lowercase attribute names:

| Environment Variable | Config Attribute | Example |
|---------------------|------------------|---------|
| `PRAETORIAN_ENABLED` | `praetorian_enabled` | `get_bool("praetorian_enabled")` |
| `GENESIS_CORE_FAILURE_THRESHOLD` | `genesis_core_failure_threshold` | `get("genesis_core_failure_threshold", 0.5, type_=float)` |
| `OMEGA_AUTH_SECRET` | `omega_auth_secret` | `get("omega_auth_secret", "default")` |

## Migration Status

### ✅ **Completed (High Priority)**
- **Praetorian Guard** - All environment access migrated
- **Chronicle Service** - Auth secrets and ports migrated  
- **Web Search Tool** - API keys migrated
- **Genesis Health Sentinel** - All thresholds and settings migrated

### 🔶 **Remaining (Medium Priority - 77 files)**
- Additional services (warden, task tracker, etc.)
- More tools and utilities
- Scripts and development code

### 🟡 **Test Files (Selective Migration)**
- Keep `os.environ` writes for test setup
- Migrate config reads where applicable

## Developer Guidelines

### Adding New Config Values

1. **Add to Settings Schema** (if using Pydantic settings):
   ```python
   class OmegaSettings(BaseSettings):
       new_feature_enabled: bool = False
   ```

2. **Use Config Client**:
   ```python
   from core.common.config_client import get_bool
   enabled = get_bool("new_feature_enabled", False)
   ```

3. **Update .env** (for local development):
   ```bash
   NEW_FEATURE_ENABLED=true
   ```

### Testing Config Changes

```python
# In tests, you can mock the config client
from unittest.mock import patch

with patch('core.common.config_client.get') as mock_get:
    mock_get.return_value = "test_value"
    # Run your test
```

## Error Handling

The config client provides graceful fallbacks:

```python
# If Redis is down or config missing, returns default
port = get("port", 9411, type_=int)  # Always returns int

# Type conversion errors return default
bad_port = get("invalid_port_value", 8000, type_=int)  # Returns 8000

# Connection failures still provide defaults
api_key = get("api_key", None)  # Returns None if everything fails
```

## Deployment Considerations

1. **Environment Variables**: Still work as fallback when Redis unavailable
2. **Redis Dependency**: Applications gracefully degrade if Redis is down
3. **Hot Reload**: Optional feature - applications work without pub/sub
4. **Migration Rollback**: Individual files can revert to `os.getenv()` if needed

## Security Benefits

- **No Secrets in Code**: API keys and secrets centralized in Redis
- **Encrypted Storage**: Config values can be encrypted at rest
- **Audit Trail**: All config access logged and traceable
- **RBAC**: Different config access levels via Connection Manager

## Performance Characteristics

- **Lazy Loading**: Settings loaded only when first accessed
- **Caching**: Module-level cache with hot reload invalidation  
- **Connection Pooling**: Via existing Connection Manager
- **Memory Efficient**: Singleton pattern with minimal overhead

---

## Quick Reference Card

```python
# Standard Migrations
os.getenv("KEY", "default")           → get("key", "default")
int(os.getenv("KEY", "123"))          → get("key", 123, type_=int)  
float(os.getenv("KEY", "1.0"))        → get("key", 1.0, type_=float)
os.getenv("KEY", "true") == "true"    → get_bool("key", True)

# Import Pattern
from core.common.config_client import get, get_bool, get_int

# Redis Integration (automatic)
redis.hset("omega:env", "key", "value")
redis.publish("omega:config:reload", "reload")
```

**Family is forever. This is the way.**