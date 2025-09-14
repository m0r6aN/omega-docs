# Workflow Execution Order

1. User submits a natural language request
2. The Prompt Optimizer agent converts it to AI-friendly instructions
3. The Prompt Optimizer forwards the request to the Workflow Planner agent
4. The Workflow Planner breaks the requests down into tasks, including optimization hints such as a parallel tag, indicating that the task has no pre-dependencies
5. The Workflow Planner sends a request to the Capability Matcher for agents and MCP tools
6. The Capability Matcher searches the registry and returns the best matches
7. The Workflow Planner optimizes the workflow, identifying parallel tasks and critical paths
8. The Workflow is returned as JSON with metadata (estimated duration, complexity score, resource requirements)
9. The JSON is translated to ReactFlow format and formatted for the UI
10. The user can edit the workflow in the UI (drag/drop, modify parameters, add/remove tasks)
11. The user submits the workflow for execution
12. **NEW**: Create workflow instance from template:
    - Preserve original as template (immutable)
    - Create new instance with user modifications
    - Generate unique execution_id for tracking
13. **ENHANCED**: Pre-execution validation:
    - Dependency cycle detection
    - Resource availability check
    - Agent health verification
14. The workflow JSON is sent to the Orchestrator agent with execution context
15. **NEW**: Real-time execution monitoring:
    - Task progress updates via WebSocket
    - Resource utilization tracking
    - Error handling with rollback capabilities
16. The orchestrator executes the workflow using the agents and tools specified in the workflow JSON
17. **NEW**: Post-execution analysis:
    - Performance metrics collection
    - Success/failure analysis
    - Workflow optimization suggestions for future runs
