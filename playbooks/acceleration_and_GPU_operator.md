# OMEGA Operator Playbook — Acceleration & GPU

**Date:** 2025-09-01
**Audience:** SRE / On-Call / Platform Ops
**Goal:** Keep p95 low, throughput high, and incidents boring.

---

## 1) Golden Signals (SLOs)

* p95 `omega_embed_latency_ms` ≤ **12 ms**
* `route="fallback"` < **5%**
* `omega_embed_cuda_oom_total` ≈ **0** (spikes tolerated during deploys)
* CPU steady; GPU VRAM < **90%** sustained

## 2) Dashboards

Recommended panels:

* p95/avg latency (`histogram_quantile` on `omega_embed_latency_ms_bucket`)
* Routing mix (`omega_embed_route_total` by route)
* OOM trend (`omega_embed_cuda_oom_total`)
* VRAM (`omega_gpu_vram_used_mb`) + pressure ratio
* Batch size distribution (`omega_embed_batch_size`)

## 3) Alerts (Prometheus)

* **OmegaEmbedLatencyP95High:** p95 > 15ms for 5m → Page
* **OmegaGPUFallbackSpike:** fallback > 5% for 10m → Page
* **OmegaCudaOOMDetected:** OOM increase > 0 in 10m → Page
* **OmegaGPUMemoryPressureHigh:** VRAM pressure > 90% for 5m → Warn
* **OmegaThreadedRouteHigh:** threaded route > 40% for 10m → Warn

## 4) Hot Toggles (no redeploy)

* `EMBED_GPU_SLOTS` (default 2) → set **1** to cool VRAM
* `EMBED_MAX_BATCH` (default 512) → set **256/128** for stability
* `ACCEL_TARGET_LAT_MS` (default 10) → set **15** under pressure
* `EMBED_PREFER_GPU` (true) → set **false** to force CPU
* `ACCEL_OOM_CPU_FALLBACK` (true) → keep **true** in prod

## 5) Health Checks

* `GET /accel/health` → NVML stats; if `gpu_present=false`, check drivers/container flags.
* `GET /metrics` → scrape Prometheus metrics (ensure endpoint is reachable intra-cluster).

## 6) Rollout Playbook

1. **Canary 5% (10m)** → verify SLOs
2. **25% (60m)** → stable SLOs
3. **100%** rollout
   Rollback = set `EMBED_PREFER_GPU=false` or `ACCEL_FORCE_CPU_MODE=true` (if available).

## 7) Troubleshooting

**Symptom:** p95 climbing, OOM spikes
**Action:** Lower `EMBED_MAX_BATCH`, set `EMBED_GPU_SLOTS=1`, raise `ACCEL_TARGET_LAT_MS` to 15.

**Symptom:** Fallback ratio high
**Action:** Check `/accel/health`, confirm GPU visibility; if down, keep CPU mode and file infra ticket.

**Symptom:** Threaded route high
**Action:** Workload is CPU-bound; add `@blocking` markers or escalate to feature team for a GPU path.

## 8) K8s Scheduling

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

## 9) On-Call Checklist

* [ ] p95 < 12 ms over last 1h
* [ ] fallback < 5% over last 1h
* [ ] OOM counter steady
* [ ] `/accel/health` looks sane
* [ ] No alert flaps

---
