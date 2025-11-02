# MCP Tool Discovery, Usage & Genesis Creation

```mermaid
graph TB
    subgraph "Tool Discovery Layer"
        CLIENT[MCP Client<br/>Claude/Cursor/Agent]
        FASTMCP[FastMCP Directory<br/>Federation Core]
        
        subgraph "Discovery Methods"
            CAP_DISC[Capability Discovery<br/>Query by Function]
            TAG_DISC[Tag Discovery<br/>Query by Category]
            FULL_DISC[Full Discovery<br/>List All Tools]
        end
    end

    subgraph "MCP Registry"
        REG_API[Registry API<br/>Port 9405]
        
        subgraph "Registry Storage"
            CATALOG[Tool Catalog<br/>MongoDB]
            MANIFEST[Tool Manifests<br/>Metadata + Schema]
            HEALTH[Health Status<br/>Live/Dead/Degraded]
        end
        
        subgraph "Lifecycle Management"
            REGISTER[Register Tool<br/>POST /mcp/register]
            HEARTBEAT[Heartbeat<br/>POST /mcp/heartbeat]
            UNREGISTER[Unregister<br/>DELETE /mcp/unregister]
        end
    end

    subgraph "MCP Tool Servers"
        subgraph "Built-in Tools"
            CODE_ANALYZER[Code Analyzer<br/>Port 9501]
            DATA_VALIDATOR[Data Validator<br/>Port 9502]
            GIT_OPS[GitOps Tool<br/>Port 9503]
        end

        subgraph "External Tools"
            PLAYWRIGHT[Playwright<br/>Browser Automation]
            FILESYSTEM[Filesystem<br/>File Operations]
            EVERYTHING[Everything Server<br/>Multi-capability]
        end

        subgraph "Genesis-Created Tools"
            TERRAFORM[Terraform Analyzer<br/>Auto-generated]
            CUSTOM1[Custom Tool 1<br/>Auto-generated]
            CUSTOM2[Custom Tool 2<br/>Auto-generated]
        end
    end

    subgraph "Tool Invocation Flow"
        INVOKE[Tool Invocation<br/>POST /mcp/call]
        VALIDATE[Input Validation<br/>Schema Check]
        EXECUTE[Execute Logic<br/>Tool-specific]
        RESPOND[Response Format<br/>Structured Output]
    end

    subgraph "Genesis Protocol - Tool Creation"
        GAP[Capability Gap<br/>Detection]
        DESIGN[Tool Design<br/>Project Architect]
        CODEGEN[Code Generation<br/>MCP Server Scaffold]
        TEST[Testing<br/>Unit + Integration]
        DEPLOY[Deployment<br/>Docker Container]
        AUTO_REG[Auto-Registration<br/>MCP Registry]
    end

    subgraph "Tool Types"
        STDIO[STDIO Tools<br/>npx-based]
        HTTP[HTTP Tools<br/>REST API]
        HYBRID[Hybrid Tools<br/>Both Modes]
    end

    %% Discovery flow
    CLIENT --> FASTMCP
    FASTMCP --> CAP_DISC
    FASTMCP --> TAG_DISC
    FASTMCP --> FULL_DISC

    CAP_DISC --> REG_API
    TAG_DISC --> REG_API
    FULL_DISC --> REG_API

    %% Registry connections
    REG_API --> CATALOG
    REG_API --> MANIFEST
    REG_API --> HEALTH

    %% Lifecycle
    CODE_ANALYZER --> REGISTER
    DATA_VALIDATOR --> REGISTER
    GIT_OPS --> REGISTER
    PLAYWRIGHT --> REGISTER
    FILESYSTEM --> REGISTER
    EVERYTHING --> REGISTER
    TERRAFORM --> REGISTER

    REGISTER --> CATALOG
    HEARTBEAT --> HEALTH
    UNREGISTER --> CATALOG

    %% Tool invocation
    CLIENT --> INVOKE
    INVOKE --> VALIDATE
    VALIDATE --> EXECUTE
    EXECUTE --> CODE_ANALYZER
    EXECUTE --> DATA_VALIDATOR
    EXECUTE --> TERRAFORM
    EXECUTE --> RESPOND
    RESPOND --> CLIENT

    %% Genesis flow
    GAP --> DESIGN
    DESIGN --> CODEGEN
    CODEGEN --> TEST
    TEST --> DEPLOY
    DEPLOY --> TERRAFORM
    DEPLOY --> CUSTOM1
    DEPLOY --> CUSTOM2
    TERRAFORM --> AUTO_REG
    CUSTOM1 --> AUTO_REG
    CUSTOM2 --> AUTO_REG
    AUTO_REG --> REGISTER

    %% Tool types
    STDIO --> EVERYTHING
    HTTP --> CODE_ANALYZER
    HTTP --> DATA_VALIDATOR
    HYBRID --> TERRAFORM

    style FASTMCP fill:#0066CC,stroke:#FFD700,stroke-width:3px,color:#fff
    style REG_API fill:#32CD32,stroke:#FFD700,stroke-width:2px,color:#fff
    style GAP fill:#DC143C,stroke:#FFD700,stroke-width:2px,color:#fff
    style CODEGEN fill:#9370DB,stroke:#FFD700,stroke-width:2px,color:#fff
    style AUTO_REG fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
```

## MCP Tool Discovery Flow

```mermaid
sequenceDiagram
    participant Client as MCP Client (Claude)
    participant FastMCP as FastMCP Directory
    participant Registry as MCP Registry
    participant Tool as MCP Tool Server

    Note over Client,Tool: Tool Discovery Phase

    Client->>FastMCP: GET /mcp/resources/omega/directory/servers
    FastMCP->>Registry: Query all registered tools
    Registry-->>FastMCP: Tool manifests
    FastMCP-->>Client: Available tools list
    Note left of FastMCP: [{<br/>  id: "code_analyzer",<br/>  name: "Code Analyzer",<br/>  capabilities: [...],<br/>  endpoint: "http://..."<br/>}]

    Note over Client,Tool: Capability-Based Discovery

    Client->>FastMCP: GET /mcp/discover?capability=code_analysis
    FastMCP->>Registry: Filter by capability
    Registry-->>FastMCP: Matching tools
    FastMCP-->>Client: Filtered tool list

    Note over Client,Tool: Tool Invocation

    Client->>Tool: POST /mcp/call
    Note right of Client: {<br/>  tool: "code_analyzer",<br/>  operation: "analyze",<br/>  parameters: {<br/>    code: "...",<br/>    language: "python"<br/>  }<br/>}

    Tool->>Tool: Validate input schema
    Tool->>Tool: Execute analysis
    Tool->>Tool: Format response

    Tool-->>Client: Analysis result
    Note left of Tool: {<br/>  status: "success",<br/>  result: {<br/>    issues: [...],<br/>    metrics: {...}<br/>  }<br/>}

    Note over Client,Tool: Health Monitoring

    loop Every 30 seconds
        Tool->>Registry: POST /mcp/heartbeat
        Registry->>Registry: Update last_seen
        Registry-->>Tool: 200 OK
    end
```

## Tool Registration

### 1. Manual Registration
```python
from omega.mcp import McpRegistryClient

registry = McpRegistryClient("http://federation:9405")

# Register tool
await registry.register_tool({
    "id": "my_tool",
    "name": "My Custom Tool",
    "description": "Does amazing things",
    "capabilities": [
        {
            "name": "process",
            "description": "Process data",
            "parameters": {
                "type": "object",
                "properties": {
                    "data": {"type": "string"},
                    "format": {"type": "string", "enum": ["json", "xml"]}
                },
                "required": ["data"]
            }
        }
    ],
    "host": "my-tool",
    "port": 8000,
    "tags": ["processing", "data"]
})
```

### 2. Auto-Registration (Startup)
```python
from fastapi import FastAPI
from omega.mcp import McpRegistryClient

app = FastAPI()
registry = McpRegistryClient("http://federation:9405")

@app.on_event("startup")
async def register_with_mcp():
    """Auto-register on startup."""
    await registry.register_tool({
        "id": "code_analyzer",
        "name": "Code Analyzer",
        "description": "Analyzes code for issues",
        "capabilities": [...],
        "host": "code-analyzer",
        "port": 9501,
        "tags": ["code", "analysis", "security"]
    })
    
    # Start heartbeat loop
    asyncio.create_task(heartbeat_loop())

async def heartbeat_loop():
    """Send heartbeats every 30 seconds."""
    while True:
        await registry.heartbeat("code_analyzer")
        await asyncio.sleep(30)
```

## Tool Discovery Methods

### 1. Discover All Tools
```python
from omega.mcp import McpClient

client = McpClient("http://federation:9405")

# Get all available tools
tools = await client.discover_tools()

for tool in tools:
    print(f"{tool['name']}: {tool['description']}")
    print(f"  Capabilities: {[c['name'] for c in tool['capabilities']]}")
```

### 2. Discover by Capability
```python
# Find tools with specific capability
code_tools = await client.discover_tools_by_capability("code_analysis")

# Find tools with multiple capabilities
multi_tools = await client.discover_tools_by_capabilities([
    "code_analysis",
    "security_scan"
])
```

### 3. Discover by Tag
```python
# Find tools by tag
security_tools = await client.discover_tools_by_tag("security")

# Find tools with multiple tags
dev_tools = await client.discover_tools_by_tags([
    "development",
    "testing"
])
```

## Tool Invocation

### Direct Invocation
```python
# Call tool directly
result = await client.call_tool(
    tool_id="code_analyzer",
    operation="analyze",
    parameters={
        "code": "def hello(): pass",
        "language": "python",
        "checks": ["style", "security", "complexity"]
    }
)

print(result["issues"])
```

### Batch Invocation
```python
# Call multiple tools in parallel
results = await asyncio.gather(
    client.call_tool("code_analyzer", "analyze", {...}),
    client.call_tool("security_scanner", "scan", {...}),
    client.call_tool("test_runner", "run", {...})
)
```

## Genesis Protocol - Autonomous Tool Creation

### Capability Gap Detection
```python
class CapabilityGapDetector:
    async def detect_gaps(self):
        """Detect missing capabilities in ecosystem."""
        # Analyze failed tasks
        failures = await self.get_recent_failures()
        
        for failure in failures:
            if failure["reason"] == "no_capable_tool":
                gap = {
                    "capability": failure["required_capability"],
                    "description": failure["task_description"],
                    "priority": self._calculate_priority(failure)
                }
                
                # Trigger Genesis Protocol
                await self.genesis.spawn_tool(gap)
```

### Tool Generation Flow
```python
class ToolGenesisAgent:
    async def spawn_tool(self, gap_spec: dict):
        """Autonomously create new MCP tool."""
        
        # 1. Design phase
        blueprint = await self.architect.design_tool(
            capability=gap_spec["capability"],
            description=gap_spec["description"]
        )
        
        # 2. Code generation
        code = await self.code_generator.generate_mcp_server(
            blueprint=blueprint,
            template="fastapi_mcp_tool"
        )
        
        # 3. Testing
        test_results = await self.test_runner.run_tests(code)
        if not test_results["passed"]:
            # Refine and retry
            code = await self.refine_code(code, test_results)
        
        # 4. Containerization
        dockerfile = await self.docker_generator.create_dockerfile(code)
        image = await self.docker_builder.build_image(dockerfile)
        
        # 5. Deployment
        container = await self.docker_deployer.deploy_container(
            image=image,
            name=f"omega-{blueprint['name']}-tool"
        )
        
        # 6. Auto-registration
        await self.mcp_registry.register_tool({
            "id": blueprint["id"],
            "name": blueprint["name"],
            "description": blueprint["description"],
            "capabilities": blueprint["capabilities"],
            "host": container["host"],
            "port": container["port"],
            "tags": blueprint["tags"] + ["genesis-created"]
        })
        
        return {
            "tool_id": blueprint["id"],
            "status": "deployed",
            "endpoint": f"http://{container['host']}:{container['port']}"
        }
```

## Tool Types

### 1. STDIO Tools (npx-based)
```json
{
  "name": "everything",
  "config": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-everything"]
  }
}
```

### 2. HTTP Tools (REST API)
```json
{
  "name": "code_analyzer",
  "config": {
    "type": "http",
    "endpoint": "http://code-analyzer:9501",
    "auth": {
      "type": "bearer",
      "token": "${MCP_AUTH_TOKEN}"
    }
  }
}
```

### 3. Hybrid Tools (Both Modes)
```python
class HybridMCPTool:
    """Tool that supports both STDIO and HTTP."""
    
    def __init__(self):
        self.stdio_server = StdioServer()
        self.http_server = FastAPI()
    
    async def start(self, mode: str = "http"):
        """Start in specified mode."""
        if mode == "stdio":
            await self.stdio_server.run()
        elif mode == "http":
            uvicorn.run(self.http_server, port=9501)
        else:
            # Run both
            await asyncio.gather(
                self.stdio_server.run(),
                self._run_http_server()
            )
```

**This is the way, brother!** 🔱🔧


