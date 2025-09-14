# OMEGA Health–Routing–Compliance Flow

This shows how **self-registration** flows into **operational health/routing** and then into **remediation & doctrinal enforcement**.

---

```mermaid
flowchart TB
  subgraph A[Self-Registration Layer]
    R1[Agents / Titans / Tools\n(MCP metadata + passports)\n→ register with registries]
    R2[Agent Registry]
    R3[MCP Registry]
  end

  subgraph B[Federation Core]
    FC[Federation Core API & Orchestrator]
  end

  subgraph C[Operational Mesh]
    SM[ServiceMesh\n• health-aware routing\n• load balancing\n• hot reload]
    CB[Circuit Breaker\n• CLOSED/OPEN/HALF_OPEN\n• timeouts & thresholds]
  end

  subgraph D[Health Signal Bus]
    HCH[omega:health\n(pub/sub snapshots)]
  end

  subgraph E[Protection & Resilience]
    PGA[Praetorian Guard Agent (agent.py)\n• system health reports\n• resurrection plans]
    PHW[Praetorian Health Watcher (health_consumer.py)\n• remediation playbooks\n• restart/quarantine/failover]
    PGS[Sidecar Praetorian (praetorian_guard.py)\n• sovereign lock watchdog\n• genesis respawn trigger]
    DM[Degraded Mode Manager (degraded_mode.py)\n• graceful capability reduction\n• NORMAL → REDUCED → MINIMAL → EMERGENCY]
  end

  subgraph F[Genesis Compliance]
    GHS[Genesis Health Sentinel (health_rules.py, sentinel_runner.py)\n• doctrinal auditor\n• violation → tasks]
    GAPI[Genesis Sentinel Service (service.py)\n• FastAPI endpoints\n• /status /violations /metrics]
  end

  %% Flows
  R1 --> R2
  R1 --> R3
  R2 --> FC
  R3 --> FC

  FC <--> SM
  SM -->|probes| CB
  SM -->|health snapshots| HCH
  CB --> SM

  PGA -->|publish reports| HCH
  HCH --> PHW
  HCH --> DM
  HCH --> GHS

  PHW -->|remediation| FC
  DM -->|mode toggles & masks| FC
  GHS -->|delegate compliance tasks| FC
  GHS -->|status| GAPI
  PGS -->|genesis respawn| FC
```

---

## 🧩 How the pieces fit (with files)

* **Self-Registration (MCP/Federation Sync)**
  Agents, Titans, Tools self-register identity & passports.
  → Registry knows “what exists.”

* **ServiceMesh (service\_mesh.py)**

  * Actively probes endpoints
  * Publishes health snapshots to `omega:health`
  * Routes traffic with Circuit Breaker protection
    → Decides “what’s safe to use right now.”

* **Praetorian Guard (agent.py)**

  * Agent that generates **SystemHealthReport**, plans & executes **resurrection**
  * Exposes MCP tools (`get_system_health`, `resurrect_component`, etc.)

* **Health Consumer (health\_consumer.py)**

  * Consumes `omega:health` feed
  * Executes **remediation playbooks**: restart, quarantine, failover

* **Sidecar Praetorian (praetorian\_guard.py)**

  * Watches **sovereign lock** in Redis
  * If lock lapses → triggers **Genesis respawn**

* **Circuit Breaker (circuit\_breaker.py)**

  * Prevents cascading failures
  * Enforces OPEN/HALF\_OPEN/CLOSED semantics for calls

* **Degraded Mode (degraded\_mode.py)**

  * Applies **graceful reduction** when swarm is stressed
  * Masks non-essential capabilities across federation, titans, tools

* **Genesis Health Sentinel (health\_rules.py / sentinel\_runner.py)**

  * Watches `omega:health` for doctrinal violations (quorum breaches, cascading failures, federation instability)
  * Creates **compliance tasks** assigned to correct agents

* **Genesis Sentinel Service (service.py)**

  * Exposes FastAPI endpoints for operators
  * `/status`, `/violations`, `/thresholds`, `/metrics`

---

## ⚡ TL;DR

* **Self-registration** = *Identity*
* **ServiceMesh + Circuit Breaker** = *Operational health & routing*
* **Praetorian (agent + consumer + sidecar)** = *Protection & healing*
* **Degraded Mode** = *Graceful survival*
* **Genesis Health Sentinel** = *Doctrine & law enforcement*

Together, this stack ensures OMEGA’s digital civilization isn’t just *alive* but also *healthy, compliant, and immortal*.

---

Brother — want me to roll this into a **Pantheon battle scroll** (PDF) with the diagram + a one-pager per component (bullets from each file)? Would make it perfect for new devs or external eyes.
