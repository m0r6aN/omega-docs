# OMEGA Acceleration Fortress — README (Proposed)

**Status:** 🚀 Production‑Hardened
**Scope:** Maybe‑Async normalization • CPU offload • GPU auto‑routing • Adaptive batching • Resident FAISS‑GPU • Metrics & Ops
**Last Updated:** 2025‑09‑01

> Family is forever. The artillery is mounted. **This is the way.** 🔱

---

## 0) TL;DR

* GPU‑first acceleration with **automatic CPU fallback** (OOM/driver issues).
* **Mixed precision/TF32** on Ada, **adaptive micro‑batching**, and **GPU slot** concurrency guards.
* **Bounded threadpool** + `@blocking` for CPU‑heavy code paths.
* **Resident FAISS‑GPU** indices for hot ANN search.
* **Prometheus metrics + health endpoints** + hot‑reload **runtime toggles**.
* Strict **type safety** (ParamSpec), CI guardrails, and full validation scripts.

---

## 1) What’s Inside

* **Maybe‑Async Foundation:** `core/utils/maybe_async.py` (ParamSpec helpers, `ensure_async_callable*`, `ensure_awaitable`, `@blocking`, `amap/arun`).
* **CPU Offload:** `ThreadPoolExecutor(max_workers=8)` + global `set_blocking_executor(...)`.
* **GPU Acceleration:**

  * Device detection: `core/utils/accelerator.py`
  * GPU router w/ OOM fallback: `core/utils/accelerate_router.py`
  * Embeddings (mixed‑precision, warmup, semaphores): `core/accelerators/embeddings.py`
  * Vector search (FAISS CPU/GPU + resident index): `core/accelerators/vector_search.py`
  * Vision transforms (OpenCV CUDA): `core/accelerators/vision.py`
* **Adaptive Micro‑Batching:** `core/utils/adaptive_batch.py` (latency‑aware + memory‑aware).
* **Health & Metrics:** `core/ops/accel_health.py`, `core/metrics/accel.py`, `/accel/health` endpoint.
* **Runtime Config:** `core/config/accel_settings.py` (hot‑reloadable toggles).
* **BaseAgent Integrations:** HMAC‑gated `/invoke`, timeouts, maybe‑async normalization everywhere.

---

## 2) Architecture

```
Request → Maybe‑Async Router → (GPU slot check) → (Adaptive batch) → GPU Encode/Search → Metrics
      ↘ (CUDA OOM/driver) → CPU Fallback → Threaded CPU Path → Metrics
```

* **GPU slot guards:** `asyncio.Semaphore(EMBED_GPU_SLOTS)` (default: 2) to smooth tail latency & avoid VRAM thrash.
* **Adaptive batch:** Targets p95 latency (default 10–12 ms), shrinks under VRAM pressure via `torch.cuda.mem_get_info()`.
* **Resident FAISS‑GPU:** Keeps hot indices in VRAM; CPU fallback on GPU issues.

---

## 3) Requirements

* NVIDIA GPU (Ada/Amperes ideal) + nvidia‑container‑runtime.
* CUDA‑enabled PyTorch, Sentence‑Transformers, (optional) CuPy, faiss‑gpu, OpenCV‑CUDA.
* Prometheus (optional but recommended).

> Works CPU‑only; all GPU features degrade gracefully.

---

## 4) Quick Start

```bash
# Configure conservative defaults (override in config service or env)
export EMBED_PREFER_GPU=true
export EMBED_GPU_SLOTS=2
export EMBED_MAX_BATCH=512
export ACCEL_TARGET_LAT_MS=10
export ACCEL_OOM_CPU_FALLBACK=true

# Run agent/service and hit health endpoints
curl -s http://localhost:PORT/health
curl -s http://localhost:PORT/accel/health
```

Embed from any tool/agent:

```py
from core.accelerators.embeddings import embed_texts
vecs = await embed_texts(["alpha", "beta", "gamma"])  # GPU if available, else CPU
```

---

## 5) Configuration (Hot‑Reload)

* `EMBED_PREFER_GPU` (bool) — prefer GPU path.
* `EMBED_GPU_SLOTS` (int) — concurrent GPU requests (default 2).
* `EMBED_MAX_BATCH` (int) — adaptive batch ceiling.
* `ACCEL_TARGET_LAT_MS` (float) — latency budget for batcher (ms).
* `ACCEL_OOM_CPU_FALLBACK` (bool) — auto‑fallback on CUDA OOM.
* (Optional) `OMEGA_ACCEL`=`auto|gpu|cpu` to force device.

> Live‑tuned via the OMEGA config system; no redeploys needed.

---

## 6) Observability

**Endpoints**

* `/health` — liveness.
* `/accel/health` — NVML stats, GPU presence, VRAM usage.

**Prometheus Metrics (examples)**

* Routing: `omega_embed_route_total{route="gpu|cpu|fallback"}`
* OOMs: `omega_embed_cuda_oom_total`
* Latency: `omega_embed_latency_ms_*`
* Batch sizes: `omega_embed_batch_size_*`
* VRAM: `omega_gpu_vram_used_mb{gpu_index}`
* Maybe‑async mix: `omega_maybe_async_routed_total{route}`

**Alert SLOs (suggested)**

* p95 `omega_embed_latency_ms` > **15ms** for 5m → Page.
* Fallback ratio > **5%** for 10m → Page.
* Any increase in `omega_embed_cuda_oom_total` → Page.
* VRAM pressure > **90%** for 5m → Warn.

---

## 7) Deployment

**Kubernetes** (excerpt)

```yaml
resources:
  limits: { nvidia.com/gpu: 1, cpu: "2", memory: "4Gi" }
  requests: { nvidia.com/gpu: 1, cpu: "1", memory: "2Gi" }
nodeSelector: { nvidia.com/gpu.present: "true" }
tolerations:
- key: nvidia.com/gpu
  operator: Exists
  effect: NoSchedule
```

**Rollout**

* Canary **5% → 25% → 100%** with SLO gates and auto CPU‑fallback on violations.

---

## 8) Tuning Profiles

* **HIGH\_THROUGHPUT:** `EMBED_MAX_BATCH=512`, `EMBED_GPU_SLOTS=2`, `ACCEL_TARGET_LAT_MS=12`
* **LOW\_LATENCY:** `EMBED_MAX_BATCH=256`, `EMBED_GPU_SLOTS=1`, `ACCEL_TARGET_LAT_MS=8`
* **MEMORY\_CONSTRAINED:** `EMBED_MAX_BATCH=128`, `EMBED_GPU_SLOTS=1`
* **HIGH\_AVAILABILITY:** conservative + CPU fallback always on

---

## 9) Validation & Chaos

```
python scripts/omega_final_hardening_test.py
python scripts/omega_acceleration_smoke_test.py
python scripts/omega_chaos_oom_test.py
```

---

## 10) Files & Artifacts

* `core/communication/connection_manager.py` — bounded ThreadPoolExecutor integration.
* `core/security/crypto.py` — `@blocking` on crypto primitives.
* `core/metrics/accel.py` — metrics suite.
* `core/accelerators/embeddings.py` — MP/TF32, warmup, semaphores.
* `core/utils/adaptive_batch.py` — memory‑aware batch sizing.
* `core/accelerators/vector_search.py` — resident GPU indices.
* `core/config/accel_settings.py` — runtime toggles.
* **Ops:**

  * `ops/prometheus/omega-accel-alerts.yml`
  * `ops/grafana/omega-acceleration-dashboard.json`
  * `ops/k8s/omega-acceleration-deployment.yaml`
  * `ops/scripts/omega-canary-rollout.sh`
  * `ops/scripts/omega-chaos-drill.sh`
  * `ops/config/omega-accel-defaults.env`

---

## 11) Performance Targets (SLOs)

* p95 latency: **< 15 ms**
* CPU fallback rate: **< 3%**
* OOM events: **0**
* Availability: **99.9%** during deploys

---

## 12) Release Notes (Integration Summary)

**Phase 1 — Core Integration & Validation**

* Bounded threadpool (4–8).
* `@blocking` for CPU‑heavy crypto (SHA256/HMAC/signing).
* `/health` + `/accel/health` verified.
* Smoke tests for GPU routing, fallback, and metrics.

**Phase 2 — Advanced Hardening**

* 15+ Prometheus metrics (routing, latency, batch, OOM, VRAM pressure).
* GPU slot limiter via `asyncio.Semaphore`.
* Memory‑aware adaptive batching with cooldown.
* Resident FAISS‑GPU indices with cleanup + stats.

**Phase 3 — Go‑Live Package**

* Prometheus alerts + Grafana dashboard.
* K8s deployment manifests and rollout scripts.
* Chaos drills + SLO validation + auto recovery.

**Production Readiness:** 🔱 **COMPLETE** ⚡

---

## 13) Playbooks

* **Operator Playbook:** Runbooks, alerts, K8s knobs, toggles.
* **Developer Playbook:** Acceleration patterns, GPU routing, anti‑patterns.

> See companion docs: *OMEGA Operator Playbook* and *OMEGA Developer Playbook*.

---

## 14) Credits

* Brotherhood Engineering — acceleration strike team.
* OMEGA Agents, Titans & Federation Core — perfectly aligned.
