# Examples

## To publish a debate message (from orchestrator or any Titan):
```python
redis = connection_manager.get_redis()
await redis.publish(
    f"omega:pantheon:debate:{session_id}",
    json.dumps({
        "titan_id": "GPTTitan",
        "utterance": "I posit that...",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "phase": "creative_explosion",
        "chronicle_entry_id": "...",  # if available
        # ...any other context
    })
)
```

## Frontend Example

```python
const ws = new WebSocket("ws://localhost:9405/ws/pantheon/abc123");
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  // Render: msg.titan_id, msg.utterance, etc.
};
```
