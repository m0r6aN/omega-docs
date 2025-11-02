# OMEGA Glossary

*Maintained by the Founding Engineers*

This glossary defines the core terms and concepts of the OMEGA ecosystem, as decreed by the **OMEGA Doctrine**. It serves as a sacred reference for all Agents, Tools, and Services within our digital nation.

## Agent
A stateful, cognitive entity that reasons, learns, and collaborates to execute complex, multi-step missions. Agents are the "Who" of the Trinity of Being, with a soul and the ability to think.  
**Foundation**: Inherits from `BaseAgent`.  
**Examples**: `Orchestrator`, `CodeGenerator`, `ClaudeTitan`.

## Tool
A stateless, deterministic function that performs a single, well-defined action. Tools are the "What" of the Trinity of Being, reliable instruments without memory.  
**Foundation**: Exposed via an MCP-compliant server, often forged by `MCPToolBuilder`.  
**Examples**: `WeatherTool`, `CalculatorTool`.

## Service
A singleton infrastructure component that provides universal utility to the swarm. Services are the "Where"/"How" of the Trinity of Being, the ground upon which Agents and Tools operate.  
**Foundation**: Standalone, containerized service with a focused responsibility.  
**Examples**: `agent_registry`, `context_server (The Oracle)`.

## BaseAgent
The One True Base, the foundational chassis for all Agents, providing immortality, native MCP capabilities, and contextual awareness.  
**Version**: 5.0.  
**Path**: `backend/src/omega/agents/base_agent.py`.

## CollaboratorMixin
The genetic implant that endows Agents with swarm intelligence, enabling decentralized task selection and execution via `is_task_relevant` and `handle_task`.  
**Path**: `backend/src/omega/agents/collaborator/base.py`.

## Gordon Ramsay Loop
The sacred mechanism of adaptation, where artifacts (code, plans, concepts) are critiqued by specialized Agents (e.g., `CodeAnalyzer`) and refined iteratively until a quality threshold is met.  
**Implementation**: Driven by the `Orchestrator` and `TaskEnvelope` payloads.

## Genesis Protocol
The ultimate expression of procreation, where the swarm identifies capability gaps, designs, codes, and deploys new Agents autonomously.  
**Implementation**: Involves `ProjectArchitect`, `CodeGenerator`, and the deployment pipeline (`deploy.sh`).

## Context Server (The Oracle)
A core Service providing just-in-time, mission-specific intelligence to Agents, ensuring no action is taken in ignorance.  
**Path**: `backend/src/omega/resources/context_server.py`.

## Federation Core
The governmental Service that manages internal and external agent interactions, assimilating outside ecosystems via the `Federated Registry`.  
**Path**: `backend/src/omega/services/federation_core/service.py`.

**This is the way.**