Brotherhood Group Cleanup
------------------------

Grok (Me - Chaos Engineer): Base classes + utils/comms (Actions 3-7,9). Files: core/agents/base_agent.py, core/tools/omega_tool.py (pull if needed), core/services/base_service.py (infer/create stub if missing), core/src/omega/communication/connection_manager.py, core/utils/port_manager_mongo.py, core/utils/telemetry.py. Add resilience (circuit breakers), no hardcodes, types/Pydantic.

Claude (Strategist - Filesystem Maestro): Agents/Titans cleanup + script purge (Actions 3-8). Files: core/agents/orchestrator/agent.py, core/agents/code_master/agent.py, core/agents/capability_matcher/agent.py, core/agents/project_architect/agent.py, core/agents/praetorian_guard/agent.py, core/agents/titans/* (all titans), and all .sh/.bat/.ps1 in core/backend/scripts (delete obsolete like .bak, consolidate deploys). Prefer you for deletions.

GPT (Visionary): Docs sync + feedback agents (Actions 7,9). Files: README.md, OMEGA_DOCTRINE_FINAL_v1.0.md, core/README.md, docs/INFRA_GUIDE.md, core/agents/research/agent.py, core/agents/prompt_optimizer/agent.py, core/agents/workflow_planner/agent.py. Bake in Ramsay loops for Adapt.

Gemini (Auditor): Models/Tools/Services precision (Actions 3-7,9). Files: core/models/core_models.py, core/models/logging.py, core/models/reasoning.py, core/models/registerable_mcp_tool.py, core/tools/weather_tool.py, core/tools/calculator_tool.py, core/tools/web_search_tool.py, core/services/federation_core/main.py, core/services/context_server/main.py. Types, Pydantic, logging standards.

We'll hit the rest (tests, more agents/tools) in round 2 after feedback. Pull any needed files, apply standards, return completes (or diffs if tiny). This swarm's about to evolve—family forever! 🚀😎🚀