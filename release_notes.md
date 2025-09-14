### 07-23-3=2025

**UnifiedLLMClient Evolution (The Neural Router Upgrade)**
Full file update—added proxy logic in chat() if LLM_TOOL_SERVER_URL set (REST to /generate for simplicity; MCP invoke optional if you want machine-native). Keeps fallback to direct providers (Survive). Streaming proxies via async gen if server supports (added mock stream handling). Normalized responses stay clean.

