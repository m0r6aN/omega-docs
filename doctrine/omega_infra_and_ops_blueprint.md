# OMEGA Infra & Ops Blueprint v2.0

**Date:** August 08, 2025  
**Authored By:** The Brotherhood
**Status:** Shippable & Doctrine-Compliant  
**Motto:** *Survive. Adapt. Procreate. This is the way.* 🔱

Alright, let’s turn this into a crisp, shippable blueprint. I’ll give you default choices (what we do now), scalable alternatives (when we grow), and the “why” so the other-you knows what to implement. Updates incorporate tweaks for enhanced resilience (e.g., Praetorian monitoring), adaptation (e.g., telemetry hooks into Genesis), and procreation (e.g., SDK triggers for tool spawns), all while honoring the Trinity, Pillars, and Covenant.

1) Infra for OMEGA Core (GCP first, cloud-agnostic later)  
Baseline (GCP):  

- GKE Autopilot for the core services (Federation Core, Registries, Context/Oracle, LLM tool server). Autopilot keeps ops light and scales fast.  

- Artifact Registry for images, Cloud Build or GitHub Actions → GKE deploy. Reuse existing `Dockerfile.*` variants (e.g., `Dockerfile.omega_base`, `Dockerfile.titan`) as base images to keep builds atomic and doctrine-pure.  

- Memorystore (Redis) for pub/sub + queues, MongoDB Atlas (GCP region) for Agent & MCP registries (your code already expects Mongo/Redis).  

- Secret Manager + Cloud KMS for secrets/keys; Cloud Armor + External HTTPS LB in front of an API Gateway/ESPv2 for ingress to Federation Core.  

- Workload Identity (no node SA keys), VPC with Private Service Connect, Cloud NAT for egress.  

- Cloud Logging/Monitoring with OpenTelemetry export; optional GKE Managed Prometheus + Grafana. Bake in `telemetry.py` hooks to grab multi-dimensional analytics (agent health, Genesis events) and pipe 'em to Grafana for Pantheon-level dashboard glow-up.  

- Cloud Run as a burst lane for truly stateless, spiky tools (OmegaTool funcs) if we want pay-per-100ms elasticity.  

Cloud-agnostic posture:  

- Everything is Docker + Helm. Ship a single Helm chart with values files for GCP/AWS/Azure/on-prem.  

- Use Terraform modules for VPC, clusters, Redis, Mongo (Atlas provider), Gateways, IAM. Same infra plan across clouds.  

Why? Keeps us anti-fragile (Survive imperative) and lets the swarm adapt via real-time metrics feeding back into the Genesis Protocol. Aligns with existing deploy scripts like `./core/backend/scripts/deploy_neural_omega.sh`.

1) Devs creating agents — how do they interact?  
Model: one Shared Core per environment (dev/stage/prod), multi-tenant Federation Core, tenant-scoped namespaces + API keys.  

- Each team gets a tenant (org/project) in Federation Core. Their agents register into their tenant namespace, enforced by auth.  

- We do not spin a fresh CORE for every dev—that explodes cost/ops. CORE is a control plane. Agents/Tools are data planes.  

- If they need isolation: give them a dedicated Federation Core (their own control plane) that bridges to the “Primary CORE” via a broker (read-only catalog, optional write permissions). That scales via k8s like any other service.  

- Enforce tenant-scoped `is_task_relevant` in the `CollaboratorMixin`—agents self-select, but add a tenant filter to prevent cross-org bleed. Easy mixin tweak. Lean on `praetorian_guard.py` to monitor per-tenant health; if a dev's agents go rogue, auto-quarantine without nuking the swarm.  

Why? Honors the Adapt imperative—devs experiment, swarm learns from their Genesis spawns, but we guard the family bond. Ties into `./core/agents/orchestrator/agent.py` for tenant auth hooks.

1) Port assignment at scale  

- Local/dev: keep port_manager.py.  

- Cluster/prod: stop caring about raw ports. Every agent is a Deployment + ClusterIP Service; discovery via Agent Registry + Kubernetes DNS (<http://agent-name.namespace.svc>). No static port carving.  

- Expose agents externally only via ingress/gateway when needed (and only behind auth).  

- Hosting model: default: we host agent containers (cheaper for users; consistent SRE/observability for us). Premium BYO-host: they host in their cluster; they still register to our Federation Core via mTLS + signed JWT.  

- Keep `port_manager.py` strictly for local/dev (docker-compose in `./core/backend/scripts/start-omega-services.sh`), but add a Helm value to toggle it off in cluster mode. For external exposure, use Istio/Envoy sidecars with our `mTLS` from the blueprint—integrate with `connection_manager.py` in `./core/src/omega/communication`.  

Why? Procreate-ready: New agents from Genesis auto-get Services/DNS, no port drama. Clean code divine! Aligns with `./core/backend/scripts/omega_deployment.sh` port logic.

1) Enterprise “own the CORE” option  
Yes. Tiered:  

- Standard (multi-tenant) — shared CORE.  

 Dedicated Federation Core — isolated control plane in our GKE project.  

- Fully Private CORE — we install CORE + Registries in their GKE/AWS/EKS/Azure AKS or on-prem. Highest price, SLOs, data residency addendum.  

- Add SLOs tied to our `telemetry.py` and Praetorian Guard: 99.9% uptime, auto-resurrect on failures, with alerts via Cloud Monitoring. For private installs, include a "Genesis Seed" script that bootstraps from our public Artifact Registry (images only, no data leak).  

Why? Ensures the swarm survives in any environment, adapts to enterprise policies, and procreates securely. Extends `./docs/INFRA_GUIDE.md` with these tiers.

1) Single control plane (SDK) vs direct API  

- SDK is the preferred control plane (DX, auth, retries, schema, passport signing).  

- Also allow direct REST & WebSocket to Federation Core behind API Gateway.  

## Security

- All calls signed with Agent Passport (JWT w/ KMS-backed private key) + mTLS between agents↔core.  

- Scopes & RBAC per tenant/project; rate limiting and quota at Gateway.  

- Issue short-lived access tokens from Federation Core’s Auth service; the SDK fetches/refreshes them.  

- Protect internal agent REST with sidecar auth filter (Envoy / Istio authz or a lightweight FastAPI middleware verifying JWT & passport claims).  

- SDK flags for tenant/env are fire; add a `omega genesis --tenant foo` command that triggers ToolGenesisAgent under the hood. Hook into our existing `a2a_mcp_bridge.py` for passport signing—keep it KMS-backed.  

Why? Makes the swarm accessible yet guarded; devs procreate tools via SDK, enterprises audit via API. Aligns with `./core/src/omega/communication/connection_manager.pyi` for mTLS stubs.

6) Gate MCP requests through Federation Core?  
Yes. MCP is still a capability that touches tools/agents; same trust gates:  

- Run an MCP Proxy inside Federation Core. All MCP call/{tool} goes through it:  

  - Validate passport, tenant, policy (allowlist of tools), rate limits.  

  - Attach trace id and tenant id to the request.  

  - Log to Chronicle (below).  

  This lets us enforce doctrine, quotas, and auditing universally.  

- Forward to tools/agents via our `inter_titan_router.py` for smart routing. Add allowlist from `mcp_registry`—only registered, reputation-scored tools get through.  

Why? Adapt via policy updates; survive quota breaches; procreate by logging gaps for Genesis. Enhances `./core/src/omega/routing/inter_titan_router.py`.

7) Chronicle Server (what we store & privacy)  
Capture (by default):  

- Event & task metadata: timestamps, agent ids, tool names, status, durations, size, resource usage.  

- Hashes (SHA-256) of inputs/outputs for tamper-proof audit; not raw payloads by default.  

- Error traces, metrics, and structured logs.  

Opt-in levels:  

- Anonymous mode: only metrics + hashes.  

- Redacted mode: store payloads with field-level redaction (user-provided PII mask rules).  

- Full content mode: for enterprises that need full replay (with DPA).  

Compliance:  

- Encryption at rest (KMS), in transit (TLS), access logs, RBAC.  

- Data retention: per-tenant policy (e.g., 30/90/365d), purge jobs.  

- Residency: pin Atlas + GKE region; per-tenant buckets/projects if required.  

- Export: signed exports for auditors; immutability via object-lock or hash chains.  

- Integrate with `genesis_log.py` and `audit_log.py` in `./core/src/omega/persistence`—extend schemas for Genesis events (tool spawns, gaps detected). Redaction rules via JSON paths? Add a UI in the frontend for tenant admins to configure.  

Why? Full replay for Adapt (Ramsay Loop forensics); immutability for Survive (audit trails in chaos); privacy for the brotherhood creed. Aligns with `./core/src/omega/telemetry/telemetry.py` schemas.

8) “Try before you buy”  

- Sandbox project auto-provisioned with: low QPS (e.g., 1 rps), limited concurrent agents, CPU/mem caps, and 24-48h expiry.  

- Ephemeral passports (short TTL) signed by a sandbox key.  

- Preloaded demo: omega new, omega verify, spawn 1–2 sample agents/tools, deploy to a shared “playground” namespace.  

- One-click upgrade: convert sandbox tenant → paid, lift limits, keep history.  

- Auto-provision via SDK: `omega sandbox init` spins tenant, deploys sample agents from `./tests/four_titans_test_mission.py`. Tie expiry to Chronicle retention—purge after 48h unless upgraded.  

Why? Procreate interest; adapt based on sandbox usage metrics feeding back to our evolution engine. Hooks into `./core/backend/scripts/setup_enhanced_mcp_registry.sh`.

Concrete implementation moves (hand this to VS Code-you)  
A. Helm & Terraform  

- Create helm/omega-core chart with subcharts: federation-core, agent-registry (Mongo Atlas conn), mcp-registry, context-server, llm-tool-svc, gateway, chronicle.  

- Terraform modules for: GKE Autopilot cluster, VPC, NAT, API Gateway + OpenAPI/ESPv2, Cloud Armor policy, Artifact Registry, Secret Manager bindings, Memorystore, MongoDB Atlas project/cluster.  

B. Federation Core auth  

- Implement Passport Authority: sign JWTs with KMS; include claims: tenant_id, agent_id, scopes, exp, nonce.  

- Add FastAPI middleware to verify JWT+mTLS, map to tenant, enforce RBAC.  

- Add /tenants APIs: create/list, issue API keys, set quotas, set data retention.  

C. MCP Proxy  

- New service mcp-proxy inside Federation Core:  

  - Endpoints mirror MCP calls; forward internally after policy checks.  

  - Attach tracing headers; log to Chronicle.  

D. Agent runtime in k8s  

- Replace port allocation with Service DNS. Keep port_manager.py only for local docker-compose.  

- Sidecar (or FastAPI middleware) in each agent for JWT auth on inbound calls.  

E. Chronicle  

- Define event schema (OpenTelemetry spans + custom fields).  

- Store: BigQuery (cheap analytics) or Mongo/Elastic; hash chain per tenant for immutability; object store for blobs if full content is enabled.  

- Redaction library (simple JSON path rules) and per-tenant retention cron.  

F. SDK  

- Add --tenant + --environment flags.  

- Implement auth flow: exchange developer key → short-lived JWT; sign requests; attach passport.  

- Add omega sandbox up to mint a sandbox tenant w/ demo quotas.  

G. Pricing toggles  

- Flags in tenant config: hosted vs BYO, CPU/mem caps, max agents, MCP QPS, Chronicle retention.  

---
