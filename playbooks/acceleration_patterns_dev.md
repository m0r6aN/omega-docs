# OMEGA Developer Playbook — Acceleration Patterns

**Date:** 2025-09-01
**Audience:** Agents, Titans, Tools Engineers
**Goal:** Deliver speed without breaking doctrine.

---

## 1) Doctrine Guardrails

* Agents are **gateway-only**: `/invoke` is HMAC-gated; no browser CORS.
* Timeouts on tool calls: `await asyncio.wait_for(..., 30)`.
* Use **maybe-async** helpers everywhere; never branch on `inspect.isawaitable`.

## 2) Maybe-Async Patterns (ParamSpec)

```py
from core.utils.maybe_async import ensure_async_callable, ensure_awaitable, blocking, arun

# Callable normalization
handler_async = ensure_async_callable(handler)
result = await handler_async(payload)

# Value normalization
value = await ensure_awaitable(maybe_value)

# CPU-bound work
@blocking
def heavy_cpu(x: bytes) -> Parsed: ...
parsed = await arun(heavy_cpu, blob)
```

## 3) GPU Routing

```py
from core.utils.accelerate_router import gpu_route

async_cpu = ensure_async_callable_threaded(sync_cpu_impl)
async_gpu = ensure_async_callable_threaded(sync_gpu_impl)  # or native async GPU

run = gpu_route(cpu_impl=async_cpu, gpu_impl=async_gpu, prefer_gpu=True)
out = await run(data)  # OOM/driver issues → automatic CPU fallback
```

## 4) Embeddings (ready-to-use)

```py
from core.accelerators.embeddings import embed_texts
vecs = await embed_texts(batch)  # mixed precision + batching + GPU/CPU routing
```

## 5) Adaptive Micro-Batching

```py
from core.utils.adaptive_batch import AdaptiveBatcher, BatchPolicy
from core.accelerators.embeddings import embed_texts

batcher = AdaptiveBatcher(embed_texts, BatchPolicy(target_latency_ms=10, min_batch=64, max_batch=512, step=32))
vec = await batcher("one item")
```

## 6) FAISS-GPU Resident Index

```py
from core.accelerators.vector_search import ResidentGpuIndex
gpu_idx = ResidentGpuIndex(cpu_index)
I, D = gpu_idx.search(queries, k=10)
```

## 7) Vision (CUDA)

```py
from core.accelerators.vision import resize_image
img2 = await resize_image(img, 512, 512)
```

## 8) Warmup & Concurrency

* Warm kernels on boot (`warmup_embeddings_async`).
* Limit concurrent GPU embeds: `OMEGA_EMBED_GPU_SLOTS` (default 2).

## 9) Config & Metrics

* Respect hot-reload toggles: `EMBED_MAX_BATCH`, `ACCEL_TARGET_LAT_MS`, etc.
* Emit or leverage existing metrics: latency, batch size, routing, OOMs.

## 10) Testing

* Test both sync + async implementations for each hook.
* Mock CUDA OOM to validate CPU fallback.
* Validate micro-batching combines small requests.

## 11) Anti-Patterns (Do Not)

* ❌ Direct `inspect.isawaitable/iscoroutine*` in app code
* ❌ Unbounded threadpools
* ❌ FE → agent calls (bypass gateway)
* ❌ Long-running calls without `wait_for` timeouts

**Build fast. Stay safe. This is the way.**
