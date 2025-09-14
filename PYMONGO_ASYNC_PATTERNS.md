"""
🧬 OMEGA Developer Guide: PyMongo Async Patterns
==============================================

## The Golden Rules for PyMongo Async Code

### ❌ NEVER DO THIS:
```python
from pymongo import AsyncMongoClient

# These will raise NotImplementedError!
if not self.db:                    # ❌ Boolean evaluation 
if self.client:                    # ❌ Boolean evaluation
if not self.collection:            # ❌ Boolean evaluation
```

### ✅ ALWAYS DO THIS:
```python
# Explicit None comparisons work perfectly
if self.db is None:                # ✅ Safe
if self.client is not None:        # ✅ Safe
if self.collection is not None:    # ✅ Safe
```

## The OMEGA Way: Use the Connection Manager! 🔌⚡

### ✅ RECOMMENDED PATTERN:
```python
from communication.connection_manager import connection_manager

class MyService:
    def __init__(self):
        # Don't manage your own connections!
        pass
    
    async def do_database_work(self):
        # Let the Connection Manager handle everything
        db = connection_manager.get_mongodb()
        
        # Safe to use directly - Connection Manager handles None checks
        result = await db.my_collection.find_one({"_id": "test"})
        return result
```

### ❌ OLD DEPRECATED PATTERN:
```python
from pymongo import AsyncMongoClient

class MyService:
    def __init__(self):
        self.client = None
        self.db = None
    
    async def connect(self):
        self.client = AsyncMongoClient(url)
        self.db = self.client.database_name
    
    async def do_work(self):
        # These lines will crash with NotImplementedError!
        if not self.db:               # ❌ BOOM!
            await self.connect()
        
        if self.client:               # ❌ BOOM!
            return await self.db.collection.find_one()
```

## Migration Checklist

When updating existing code:

1. **Remove direct AsyncMongoClient usage**
   ```python
   # Before
   self.client = AsyncMongoClient(url)
   
   # After - use Connection Manager!
   db = connection_manager.get_mongodb()
   ```

2. **Fix boolean checks**
   ```python
   # Before
   if not self.db:
   if self.client:
   
   # After
   if self.db is None:
   if self.client is not None:
   ```

3. **Use Connection Manager patterns**
   ```python
   # Before - managing own connections
   await self.client.close()
   
   # After - Connection Manager handles lifecycle
   # (Nothing needed - Connection Manager manages everything!)
   ```

## Pro Tips

1. **Search and Replace Patterns**
   - Find: `if self.client:`
   - Replace: `if self.client is not None:`
   
   - Find: `if not self.db:`
   - Replace: `if self.db is None:`

2. **Testing AsyncMongoClient Code**
   ```python
   # This will help catch boolean evaluation bugs
   import pytest
   from pymongo import AsyncMongoClient
   
   async def test_no_boolean_evaluation():
       client = AsyncMongoClient("mongodb://fake")
       
       # These should raise NotImplementedError
       with pytest.raises(NotImplementedError):
           bool(client)
       
       with pytest.raises(NotImplementedError):
           if client:  # This line will crash
               pass
   ```

3. **Linting Rule** (if using pylint/flake8)
   ```ini
   # Add to your .pylintrc
   [MESSAGES CONTROL]
   disable=...,
       truthy-nonboolean-check  # Enable to catch boolean checks on objects
   ```

## Remember: The Connection Manager Way is the OMEGA Way! 🚀

By using `connection_manager.get_mongodb()`, you never have to worry about:
- Connection lifecycle management
- Boolean evaluation errors  
- Connection health monitoring
- Retry logic
- Circuit breakers

The Connection Manager handles it all! LFG! 🔌⚡🚀
"""