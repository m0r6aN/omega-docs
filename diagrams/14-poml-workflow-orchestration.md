# POML Workflow Execution & Orchestration

```mermaid
graph TB
    subgraph "User Request"
        USER[User/Client]
        REQUEST[Workflow Request<br/>POML Template + Params]
    end

    subgraph "Workflow Planning"
        ORCHESTRATOR[Orchestrator Agent]
        
        subgraph "Template Resolution"
            CATALOG[POML Catalog<br/>MongoDB]
            TEMPLATE[Template Loader<br/>YAML/JSON Parser]
            POPULATE[Intelligent Population<br/>Fill Missing Params]
        end

        subgraph "DAG Generation"
            PARSE[Parse POML<br/>Extract Steps]
            GRAPH[Build DAG<br/>Dependencies]
            OPTIMIZE[Optimize Plan<br/>Parallel Detection]
        end

        subgraph "Routing & Selection"
            CAPABILITY[Capability Matcher<br/>Find Agents/Tools]
            REPUTATION[Reputation Router<br/>Historical Performance]
            COST[Cost/Latency Router<br/>Budget Optimization]
            CHAOS[Chaos Router<br/>Exploration Budget]
        end
    end

    subgraph "Execution Engine"
        EXECUTOR[Workflow Executor]
        
        subgraph "Task Assignment"
            ENVELOPE[Task Envelope<br/>Immutable Work Unit]
            CONTEXT[Context Pack<br/>Oracle Intelligence]
            DISPATCH[Dispatch to Agent<br/>A2A/MCP]
        end

        subgraph "Execution Control"
            PARALLEL[Parallel Execution<br/>Independent Tasks]
            SEQUENTIAL[Sequential Execution<br/>Dependent Tasks]
            GATE[Gate Nodes<br/>Conditional Logic]
        end

        subgraph "Result Handling"
            COLLECT[Collect Results<br/>Per-node Output]
            AGGREGATE[Aggregate Stage<br/>Merge/Reduce]
            SYNTHESIZE[Synthesize Final<br/>Global Summary]
        end
    end

    subgraph "Agent/Tool Execution"
        subgraph "The Pantheon"
            GPT[GPTTitan<br/>Creative Tasks]
            CLAUDE[ClaudeTitan<br/>Code Tasks]
            GEMINI[GeminiTitan<br/>Security Tasks]
            GROK[GrokTitan<br/>Testing Tasks]
        end

        subgraph "Specialized Agents"
            CODE_GEN[Code Generator]
            TEST_GEN[Test Generator]
            DEVOPS[DevOps Agent]
        end

        subgraph "MCP Tools"
            PLAYWRIGHT[Playwright<br/>Browser Automation]
            GIT[Git Operations]
            FILESYSTEM[File Operations]
        end
    end

    subgraph "Monitoring & Safety"
        PRAETORIAN[Praetorian Guard<br/>Health Monitor]
        WARDEN[Warden<br/>Security Firewall]
        TELEMETRY[Telemetry<br/>Metrics Collection]
    end

    subgraph "Memory & Learning"
        MONGO[(MongoDB<br/>Artifacts)]
        VECTOR[(Vector Store<br/>Embeddings)]
        LEDGER[Immutable Ledger<br/>Audit Trail]
    end

    %% Request flow
    USER --> REQUEST
    REQUEST --> ORCHESTRATOR

    %% Planning
    ORCHESTRATOR --> CATALOG
    CATALOG --> TEMPLATE
    TEMPLATE --> POPULATE
    POPULATE --> PARSE
    PARSE --> GRAPH
    GRAPH --> OPTIMIZE

    %% Routing
    OPTIMIZE --> CAPABILITY
    OPTIMIZE --> REPUTATION
    OPTIMIZE --> COST
    OPTIMIZE --> CHAOS

    %% Execution
    CAPABILITY --> EXECUTOR
    EXECUTOR --> ENVELOPE
    ENVELOPE --> CONTEXT
    CONTEXT --> DISPATCH

    %% Control flow
    DISPATCH --> PARALLEL
    DISPATCH --> SEQUENTIAL
    DISPATCH --> GATE

    %% Agent assignment
    PARALLEL --> GPT
    PARALLEL --> CLAUDE
    PARALLEL --> CODE_GEN
    SEQUENTIAL --> GEMINI
    SEQUENTIAL --> GROK
    GATE --> DEVOPS

    %% Tool usage
    GPT --> PLAYWRIGHT
    CLAUDE --> GIT
    CODE_GEN --> FILESYSTEM

    %% Result handling
    GPT --> COLLECT
    CLAUDE --> COLLECT
    GEMINI --> COLLECT
    COLLECT --> AGGREGATE
    AGGREGATE --> SYNTHESIZE
    SYNTHESIZE --> USER

    %% Monitoring
    EXECUTOR --> PRAETORIAN
    DISPATCH --> WARDEN
    COLLECT --> TELEMETRY

    %% Memory
    COLLECT --> MONGO
    AGGREGATE --> VECTOR
    SYNTHESIZE --> LEDGER

    style ORCHESTRATOR fill:#0066CC,stroke:#FFD700,stroke-width:3px,color:#fff
    style EXECUTOR fill:#32CD32,stroke:#FFD700,stroke-width:2px,color:#fff
    style GPT fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
    style CLAUDE fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
    style GEMINI fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
    style GROK fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
```

## POML Workflow Execution Flow

```mermaid
sequenceDiagram
    participant User as User/Client
    participant Orc as Orchestrator
    participant Catalog as POML Catalog
    participant Oracle as Context Server
    participant Router as Router Sanctuary
    participant Warden as Warden
    participant GPT as GPTTitan
    participant Claude as ClaudeTitan
    participant Tool as MCP Tool
    participant Memory as Memory Store

    Note over User,Memory: Phase 1: Workflow Planning

    User->>Orc: Execute workflow
    Note right of User: {<br/>  template: "code-review-workflow",<br/>  params: {<br/>    repo: "my-app",<br/>    branch: "main"<br/>  }<br/>}

    Orc->>Catalog: Load POML template
    Catalog-->>Orc: Template YAML

    Orc->>Orc: Intelligent population
    Note right of Orc: Fill missing params:<br/>- Infer file paths<br/>- Set default SLAs<br/>- Query similar workflows

    Orc->>Orc: Parse POML to DAG
    Note right of Orc: Nodes:<br/>1. Analyze code<br/>2. Security scan<br/>3. Quality check<br/>4. Generate report

    Orc->>Orc: Detect parallelism
    Note right of Orc: Steps 1, 2, 3 can run<br/>in parallel (no deps)

    Note over User,Memory: Phase 2: Routing & Selection

    Orc->>Router: Route each node
    Note right of Orc: For each step, find:<br/>- Capable agents/tools<br/>- Best performer<br/>- Cost-optimal choice

    Router->>Router: Capability matching
    Router->>Router: Reputation scoring
    Router->>Router: Cost/latency optimization
    Router-->>Orc: Assignment plan

    Note over User,Memory: Phase 3: Security Validation

    Orc->>Warden: Validate workflow
    Note right of Orc: Check:<br/>- Tool allowlist<br/>- Data access<br/>- Budget limits

    Warden->>Warden: Policy enforcement
    Warden-->>Orc: Policy tokens

    Note over User,Memory: Phase 4: Parallel Execution

    Orc->>Oracle: Get context pack
    Oracle-->>Orc: Enriched context

    par Step 1: Code Analysis
        Orc->>Claude: Analyze code
        Note right of Orc: TaskEnvelope +<br/>Context Pack
        Claude->>Tool: Use code analyzer
        Tool-->>Claude: Analysis result
        Claude-->>Orc: Structured result
    and Step 2: Security Scan
        Orc->>GPT: Security scan
        GPT->>Tool: Use security scanner
        Tool-->>GPT: Scan result
        GPT-->>Orc: Structured result
    and Step 3: Quality Check
        Orc->>Claude: Quality check
        Claude->>Tool: Use linter
        Tool-->>Claude: Quality result
        Claude-->>Orc: Structured result
    end

    Note over User,Memory: Phase 5: Aggregation

    Orc->>Orc: Aggregate stage results
    Note right of Orc: Merge strategy:<br/>- Union findings<br/>- Deduplicate issues<br/>- Rank by severity

    Orc->>Memory: Store artifacts
    Memory-->>Orc: Stored

    Note over User,Memory: Phase 6: Sequential Step

    Orc->>GPT: Generate report
    Note right of Orc: Input: Aggregated results

    GPT->>GPT: Synthesize report
    GPT-->>Orc: Final report

    Note over User,Memory: Phase 7: Completion

    Orc->>Memory: Store workflow result
    Orc->>Memory: Log to audit ledger
    Orc-->>User: Workflow complete
    Note left of Orc: {<br/>  status: "success",<br/>  report: {...},<br/>  artifacts: [...],<br/>  metrics: {...}<br/>}
```

## POML Template Structure

### Example: Code Review Workflow
```yaml
# code-review-workflow.poml
workflow_id: "code_review_workflow"
version: "1.0.0"
description: "Automated code review with security and quality checks"

parameters:
  repo:
    type: string
    required: true
    description: "Repository name"
  
  branch:
    type: string
    default: "main"
    description: "Branch to review"
  
  severity_threshold:
    type: string
    default: "medium"
    enum: ["low", "medium", "high", "critical"]

steps:
  - id: "analyze_code"
    name: "Code Analysis"
    agent_capability: "code_analysis"
    parallel: true
    inputs:
      repo: "${params.repo}"
      branch: "${params.branch}"
    outputs:
      - analysis_report
    
  - id: "security_scan"
    name: "Security Scan"
    agent_capability: "security_analysis"
    parallel: true
    inputs:
      repo: "${params.repo}"
      branch: "${params.branch}"
    outputs:
      - security_report
    
  - id: "quality_check"
    name: "Quality Check"
    agent_capability: "quality_analysis"
    parallel: true
    inputs:
      repo: "${params.repo}"
      branch: "${params.branch}"
    outputs:
      - quality_report
    
  - id: "aggregate_findings"
    name: "Aggregate Findings"
    type: "aggregator"
    depends_on:
      - analyze_code
      - security_scan
      - quality_check
    strategy: "merge_and_deduplicate"
    inputs:
      reports:
        - "${steps.analyze_code.analysis_report}"
        - "${steps.security_scan.security_report}"
        - "${steps.quality_check.quality_report}"
    outputs:
      - combined_findings
    
  - id: "generate_report"
    name: "Generate Report"
    agent_capability: "report_generation"
    depends_on:
      - aggregate_findings
    inputs:
      findings: "${steps.aggregate_findings.combined_findings}"
      severity_threshold: "${params.severity_threshold}"
    outputs:
      - final_report
    
  - id: "create_pr_comment"
    name: "Create PR Comment"
    tool: "git_operations"
    depends_on:
      - generate_report
    inputs:
      repo: "${params.repo}"
      branch: "${params.branch}"
      comment: "${steps.generate_report.final_report}"

aggregation:
  merge_and_deduplicate:
    type: "custom"
    logic: |
      # Merge all findings
      all_findings = []
      for report in inputs.reports:
        all_findings.extend(report.findings)
      
      # Deduplicate by hash
      unique_findings = deduplicate_by_hash(all_findings)
      
      # Sort by severity
      sorted_findings = sort_by_severity(unique_findings)
      
      return {
        "findings": sorted_findings,
        "total": len(sorted_findings),
        "by_severity": group_by_severity(sorted_findings)
      }

sla:
  max_duration_minutes: 15
  timeout_per_step_minutes: 5

error_handling:
  retry_policy:
    max_attempts: 3
    backoff: "exponential"
  
  on_failure:
    - notify: "slack"
    - escalate_to: "human"
```

## Workflow Execution Patterns

### 1. Sequential Workflow
```yaml
# Steps execute one after another
steps:
  - id: "step1"
    # No parallel flag, no depends_on
  
  - id: "step2"
    depends_on: ["step1"]
  
  - id: "step3"
    depends_on: ["step2"]
```

### 2. Parallel Workflow
```yaml
# Steps execute simultaneously
steps:
  - id: "step1"
    parallel: true
  
  - id: "step2"
    parallel: true
  
  - id: "step3"
    parallel: true
  
  - id: "merge"
    depends_on: ["step1", "step2", "step3"]
```

### 3. Conditional Workflow
```yaml
# Steps execute based on conditions
steps:
  - id: "analyze"
    outputs: ["result"]
  
  - id: "fix_issues"
    depends_on: ["analyze"]
    condition: "${steps.analyze.result.has_issues}"
  
  - id: "deploy"
    depends_on: ["analyze"]
    condition: "${!steps.analyze.result.has_issues}"
```

### 4. Fan-out/Fan-in Workflow
```yaml
# One step spawns multiple parallel steps, then merge
steps:
  - id: "split_data"
    outputs: ["chunks"]
  
  - id: "process_chunk"
    depends_on: ["split_data"]
    parallel: true
    for_each: "${steps.split_data.chunks}"
  
  - id: "merge_results"
    depends_on: ["process_chunk"]
    strategy: "reduce"
```

## Intelligent Population

### Context-Aware Parameter Inference
```python
class IntelligentPopulator:
    async def populate_template(
        self,
        template: dict,
        user_params: dict,
        context: dict
    ) -> dict:
        """Fill missing parameters intelligently."""
        
        populated = template.copy()
        
        for param_name, param_spec in template["parameters"].items():
            if param_name in user_params:
                # User provided value
                populated["parameters"][param_name] = user_params[param_name]
            
            elif "default" in param_spec:
                # Use default value
                populated["parameters"][param_name] = param_spec["default"]
            
            else:
                # Infer from context
                inferred = await self._infer_parameter(
                    param_name,
                    param_spec,
                    context
                )
                populated["parameters"][param_name] = inferred
        
        return populated
    
    async def _infer_parameter(
        self,
        param_name: str,
        param_spec: dict,
        context: dict
    ):
        """Infer parameter value from context."""
        
        # Query similar workflows
        similar = await self.vector_store.find_similar_workflows(
            template_id=context["template_id"],
            limit=5
        )
        
        # Extract common parameter values
        common_values = self._extract_common_values(
            similar,
            param_name
        )
        
        # Use most common value
        if common_values:
            return common_values[0]
        
        # Ask LLM to infer
        prompt = f"""
        Infer the value for parameter '{param_name}' based on:
        - Type: {param_spec['type']}
        - Description: {param_spec['description']}
        - Context: {context}
        """
        
        return await self.llm.generate(prompt)
```

## DAG Optimization

### Parallel Detection
```python
class DAGOptimizer:
    def optimize_dag(self, dag: nx.DiGraph) -> nx.DiGraph:
        """Optimize DAG for parallel execution."""
        
        # Detect independent nodes
        stages = self._detect_stages(dag)
        
        # Mark parallel nodes
        for stage in stages:
            if len(stage) > 1:
                for node in stage:
                    dag.nodes[node]["parallel"] = True
        
        # Calculate critical path
        critical_path = self._calculate_critical_path(dag)
        
        # Optimize resource allocation
        self._optimize_resources(dag, critical_path)
        
        return dag
    
    def _detect_stages(self, dag: nx.DiGraph) -> list[list]:
        """Group nodes into execution stages."""
        stages = []
        remaining = set(dag.nodes())
        
        while remaining:
            # Find nodes with no dependencies in remaining
            stage = [
                node for node in remaining
                if all(
                    pred not in remaining
                    for pred in dag.predecessors(node)
                )
            ]
            
            stages.append(stage)
            remaining -= set(stage)
        
        return stages
```

**This is the way, brother!** 🔱📋⚡


