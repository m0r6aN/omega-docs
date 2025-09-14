# OMEGA Qdrant Integration Plan 🔱

## Phase 1: Core Integration (Ship It!)

### 1. Apply the Patch
```bash
# Save the patch and apply it
git apply --reject --whitespace=fix omega-qdrant-provider.patch
```

### 2. Update Requirements
```bash
echo "qdrant-client>=1.6.0" >> requirements.txt
pip install qdrant-client
```

### 3. Environment Setup
```env
# Add to .env
QDRANT_URL=http://localhost:6333
QDRANT_DISTANCE=COSINE
# QDRANT_API_KEY=your_key_if_cloud
```

### 4. Provider Registration
Update your memory provider factory to include Qdrant:

```python
# in omega/core/memory/factory.py or similar
from .qdrant_memory_provider import QdrantMemoryProvider

MEMORY_PROVIDERS = {
    "mongo": MongoMemoryProvider,
    "qdrant": QdrantMemoryProvider,  # 🆕
    "in_memory": InMemoryProvider,
}
```

### 5. Docker Compose Addition
```yaml
# Add to docker-compose.yml
services:
  qdrant:
    image: qdrant/qdrant:v1.6.1
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage
    environment:
      - QDRANT__SERVICE__HTTP_PORT=6333

volumes:
  qdrant_data:
```

## Phase 2: Advanced Features (Next Sprint)

### Hybrid Search Enhancement
- Dense + sparse vector support
- Query optimization for complex filters
- Batch operations for TransactionManager

### MCP Tool Integration
- Expose `memory.upsert` and `memory.search` 
- Federation Core can fetch context directly
- Vector similarity as an MCP capability

### Monitoring & Observability
- Qdrant metrics in Prometheus
- Vector search performance dashboards
- Memory usage analytics

## Testing Strategy

### Unit Tests
```python
async def test_qdrant_provider_basic_flow():
    provider = await create_qdrant_memory_provider()
    
    # Test storage
    rid = await provider.store("test_table", {
        "vector": [0.1] * 384,
        "agent_id": "test_agent",
        "content": {"message": "test"}
    })
    
    # Test similarity query
    results = await provider.query("test_table", {
        "vector": [0.1] * 384,
        "agent_id": "test_agent"
    })
    
    assert len(results) == 1
    assert results[0]["id"] == rid
```

### Integration Tests
- Test with TransactionManager buffering
- Test with real embedding models
- Test concurrent access patterns

## Success Metrics
- [ ] Qdrant provider passes all existing memory tests
- [ ] Vector similarity search < 50ms for 10k vectors  
- [ ] Seamless failover between Mongo and Qdrant
- [ ] Federation Core can use vector context efficiently

**This is the way.** 🔱
