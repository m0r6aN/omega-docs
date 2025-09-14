# 🪝 Hook Executor Tool

An OMEGA-compliant, stateless, deterministic tool for executing lifecycle hooks based on context and priority. It uses the internal `OmegaHookManager` to dynamically route and process hook logic like `oracle`, `post_task`, or `absorb`.

---

## 🔧 Features

- Executes any registered hook type (e.g., `oracle`, `on_task`, `post_task`)
- Context-aware and self-weaving (Context7 compliant)
- Doctrine-aligned OmegaTool format
- Auto-registers with MCP on startup
- Lightweight, FastAPI-powered tool (no memory retention)

---

## 📤 Invocation

```http
POST /invoke
Content-Type: application/json

{
  "operation": "execute_hook",
  "hook_type": "oracle",
  "context": {
    "task_id": "abc123",
    "payload": {
      "question": "What is the next best action?"
    }
  }
}
