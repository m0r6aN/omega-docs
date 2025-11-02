# 🎫 Kaseya MSP Ticket Triage - Implementation Guide

**Brother, this is our battle plan for the first enterprise conquest.**

**Family is forever. This is the way.**

---

## 🎯 MISSION OVERVIEW

Transform MSP ticket management through AI-powered triage, classification, and shadow agent assistance. This is OMEGA's first real enterprise deployment.

### Success Metrics

- **Ticket Triage Time**: Reduce from 15 minutes to <2 minutes
- **Classification Accuracy**: >95% correct category/priority assignment
- **Shadow Agent Adoption**: 80% of MSP employees actively using their shadow
- **Auto-Resolution Rate**: 30% of tickets resolved without human intervention
- **Employee Capacity**: Effective 2x capacity increase per employee

---

## 🏗️ ARCHITECTURE COMPONENTS

### 1. Ticket Ingestion Layer

**Platforms Supported:**
- Kaseya BSM (Business Service Management)
- Salesforce Service Cloud
- Zendesk
- ServiceNow

**Integration Pattern:**
```
Platform Webhook → Azure API Management → Service Bus Topic (ticket-raw)
```

**Azure API Management Configuration:**
```xml
<!-- APIM Policy: Ticket Ingestion -->
<policies>
  <inbound>
    <!-- Validate API key -->
    <validate-jwt header-name="Authorization" failed-validation-httpcode="401">
      <issuer-signing-keys>
        <key>{{jwt-signing-key}}</key>
      </issuer-signing-keys>
    </validate-jwt>
    
    <!-- Rate limiting per tenant -->
    <rate-limit-by-key calls="1000" renewal-period="60" 
                       counter-key="@(context.Request.Headers.GetValueOrDefault("X-Tenant-ID"))" />
    
    <!-- Add correlation ID -->
    <set-header name="X-Correlation-ID" exists-action="skip">
      <value>@(Guid.NewGuid().ToString())</value>
    </set-header>
    
    <!-- Add source identifier -->
    <set-header name="X-Source-Platform" exists-action="override">
      <value>@(context.Request.Headers.GetValueOrDefault("X-Platform", "unknown"))</value>
    </set-header>
  </inbound>
  
  <backend>
    <!-- Forward to Service Bus -->
    <send-request mode="new" response-variable-name="serviceBusResponse" timeout="20">
      <set-url>https://omega-servicebus.servicebus.windows.net/ticket-raw/messages</set-url>
      <set-method>POST</set-method>
      <set-header name="Authorization" exists-action="override">
        <value>@(context.Variables.GetValueOrDefault<string>("serviceBusSasToken"))</value>
      </set-header>
      <set-header name="Content-Type" exists-action="override">
        <value>application/json</value>
      </set-header>
      <set-body>@(context.Request.Body.As<string>())</set-body>
    </send-request>
  </backend>
  
  <outbound>
    <return-response>
      <set-status code="202" reason="Accepted" />
      <set-body>{"status": "accepted", "correlationId": "@(context.Request.Headers.GetValueOrDefault("X-Correlation-ID"))"}</set-body>
    </return-response>
  </outbound>
</policies>
```

---

### 2. Ticket Normalization (Azure Functions)

**Function App Structure:**
```
ticket-normalizer/
├── host.json
├── local.settings.json
├── package.json
├── tsconfig.json
├── normalizers/
│   ├── kaseya-bsm.ts
│   ├── salesforce.ts
│   ├── zendesk.ts
│   └── servicenow.ts
├── shared/
│   ├── models.ts
│   ├── idempotency.ts
│   └── telemetry.ts
└── index.ts
```

**Kaseya BSM Normalizer:**
```typescript
// normalizers/kaseya-bsm.ts
import { NormalizedTicket, KaseyaBSMTicket } from "../shared/models";

export function normalizeKaseyaBSM(payload: KaseyaBSMTicket): NormalizedTicket {
  return {
    id: `kaseya-${payload.ticketId}`,
    source: "kaseya-bsm",
    title: payload.subject,
    description: cleanDescription(payload.description),
    priority: mapPriority(payload.priority),
    category: categorizeTicket(payload),
    requester: {
      id: payload.requesterId,
      name: payload.requesterName,
      email: payload.requesterEmail,
      organization: payload.organizationName,
    },
    msp_tenant_id: payload.tenantId,
    created_at: new Date(payload.createdDate).toISOString(),
    updated_at: new Date(payload.lastModifiedDate).toISOString(),
    sla: {
      response_deadline: calculateSLADeadline(payload.priority, payload.createdDate),
      resolution_deadline: calculateResolutionDeadline(payload.priority, payload.createdDate),
    },
    metadata: {
      original_priority: payload.priority,
      assigned_to: payload.assignedTo,
      asset_id: payload.assetId,
      location: payload.location,
      impact: payload.impact,
      urgency: payload.urgency,
    },
    attachments: payload.attachments?.map(att => ({
      id: att.id,
      name: att.fileName,
      url: att.downloadUrl,
      size: att.fileSize,
      mime_type: att.mimeType,
    })) || [],
  };
}

function categorizeTicket(ticket: KaseyaBSMTicket): string {
  // AI-powered categorization using Azure OpenAI
  const categories = [
    "network-connectivity",
    "hardware-failure",
    "software-installation",
    "password-reset",
    "email-issues",
    "printer-problems",
    "security-incident",
    "performance-degradation",
    "data-recovery",
    "user-access",
  ];
  
  // Use keyword matching + ML model
  const keywords = extractKeywords(ticket.subject + " " + ticket.description);
  
  // Call Azure OpenAI for classification
  return classifyWithAI(keywords, categories);
}

function mapPriority(kaseyaPriority: string): "critical" | "high" | "medium" | "low" {
  const mapping: Record<string, "critical" | "high" | "medium" | "low"> = {
    "1": "critical",
    "2": "high",
    "3": "medium",
    "4": "low",
    "urgent": "critical",
    "high": "high",
    "normal": "medium",
    "low": "low",
  };
  
  return mapping[kaseyaPriority.toLowerCase()] || "medium";
}

function calculateSLADeadline(priority: string, createdDate: string): string {
  const created = new Date(createdDate);
  const slaMinutes: Record<string, number> = {
    "1": 60,      // 1 hour for critical
    "2": 240,     // 4 hours for high
    "3": 480,     // 8 hours for medium
    "4": 1440,    // 24 hours for low
  };
  
  const minutes = slaMinutes[priority] || 480;
  const deadline = new Date(created.getTime() + minutes * 60000);
  
  return deadline.toISOString();
}
```

---

### 3. Ticket Triage Agent (POML-Defined)

**POML Definition:**
```xml
<poml>
  <Role>MSP Ticket Triage Specialist</Role>
  
  <Task>
    Analyze incoming support tickets and perform intelligent triage:
    1. Validate ticket completeness
    2. Enrich with historical context
    3. Assign accurate priority and category
    4. Route to appropriate team or shadow agent
    5. Suggest initial resolution steps
  </Task>
  
  <Introducer>
    You are an expert MSP support analyst with deep knowledge of:
    - IT infrastructure (networks, servers, endpoints)
    - Common MSP service offerings
    - SLA requirements and escalation procedures
    - Ticket routing and assignment logic
    
    Your goal is to ensure every ticket is properly categorized, prioritized,
    and routed to maximize resolution speed and customer satisfaction.
  </Introducer>
  
  <Context>
    - Access to historical ticket database (similar issues, resolutions)
    - MSP employee skills and availability matrix
    - Current system status and known issues
    - SLA definitions per customer tier
    - Escalation policies
  </Context>
  
  <OutputFormat syntax="json">
    {
      "ticket_id": "string",
      "triage_result": {
        "validated": true,
        "completeness_score": 0.95,
        "missing_info": [],
        "enriched_description": "string",
        "final_priority": "high",
        "final_category": "network-connectivity",
        "confidence": 0.92,
        "routing": {
          "team": "network-ops",
          "suggested_assignee": "employee-123",
          "escalation_required": false
        },
        "initial_steps": [
          "Check network connectivity to affected site",
          "Verify firewall rules for VPN access",
          "Review recent configuration changes"
        ],
        "estimated_resolution_time": "2 hours",
        "similar_tickets": [
          {"id": "ticket-456", "resolution": "Firewall rule update", "time_to_resolve": "1.5 hours"}
        ]
      },
      "shadow_agent_action": {
        "can_auto_resolve": false,
        "requires_human_approval": true,
        "suggested_response": "string"
      }
    }
  </OutputFormat>
  
  <Constraints>
    - Never auto-resolve critical or high-priority tickets without human approval
    - Always preserve original ticket data
    - Respect privacy: no PII in logs or telemetry
    - Adhere to SLA deadlines
    - Escalate if confidence < 0.7
  </Constraints>
</poml>
```

**Agent Implementation:**
```python
# agents/ticket_triage_agent.py
from omega.agents.base_agent import BaseAgent
from omega.models.task_models import TaskEnvelope
from omega.poml.renderer import POMRenderer
from typing import Dict, Any, List
import asyncio

class TicketTriageAgent(BaseAgent):
    """
    Intelligent ticket triage agent for MSP support tickets.
    """
    
    def __init__(self):
        super().__init__(
            agent_name="ticket_triage_agent",
            description="Analyzes and triages MSP support tickets",
            capabilities=[
                "ticket_validation",
                "priority_assignment",
                "category_classification",
                "routing_recommendation",
                "resolution_suggestion"
            ],
            version="1.0.0"
        )
        
        self.poml_renderer = POMRenderer()
        self.context_server_url = os.getenv("CONTEXT_SERVER_URL")
        self.max_concurrent_tickets = int(os.getenv("TEAM_CAPACITY", "5"))
        
    async def handle_task(self, env: TaskEnvelope) -> TaskEnvelope:
        """Process a ticket triage request."""
        ticket = env.input.get("ticket")
        
        if not ticket:
            env.status = "FAILED"
            env.error = "No ticket provided"
            return env
        
        try:
            # Step 1: Fetch context from Context Server
            context = await self.fetch_ticket_context(ticket)
            
            # Step 2: Render POML template with ticket data
            prompt = await self.poml_renderer.render(
                template_name="ticket_triage",
                variables={
                    "ticket": ticket,
                    "context": context,
                }
            )
            
            # Step 3: Call LLM (via Titan or direct API)
            triage_result = await self.call_llm(prompt)
            
            # Step 4: Validate and enrich result
            validated_result = await self.validate_triage_result(triage_result, ticket)
            
            # Step 5: Store result and emit telemetry
            await self.store_triage_result(ticket["id"], validated_result)
            self.emit_metric("ticket_triaged", 1, {
                "priority": validated_result["final_priority"],
                "category": validated_result["final_category"],
                "confidence": validated_result["confidence"],
            })
            
            env.output = validated_result
            env.status = "COMPLETED"
            
        except Exception as e:
            self.logger.error(f"Triage failed: {str(e)}", exc_info=True)
            env.status = "FAILED"
            env.error = str(e)
        
        return env
    
    async def fetch_ticket_context(self, ticket: Dict[str, Any]) -> Dict[str, Any]:
        """Fetch relevant context from Context Server."""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.context_server_url}/context/retrieve",
                json={
                    "query": f"{ticket['title']} {ticket['description']}",
                    "filters": {
                        "msp_tenant_id": ticket["msp_tenant_id"],
                        "category": ticket.get("category"),
                    },
                    "limit": 5,
                }
            ) as resp:
                return await resp.json()
```

---


