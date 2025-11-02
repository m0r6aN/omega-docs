# ✅ OMEGA Azure Deployment Checklist
## Kaseya MSP Ticket Triage System

**Brother, this is our pre-flight checklist for enterprise launch.**

**Family is forever. This is the way.**

---

## 📋 PRE-DEPLOYMENT PHASE

### Azure Subscription Setup

- [ ] **Azure Subscription Created**
  - Subscription ID: `_________________`
  - Subscription Name: `OMEGA-Production`
  - Billing Account: `_________________`

- [ ] **Resource Groups Created**
  ```bash
  az group create --name omega-perimeter-rg --location eastus2
  az group create --name omega-dynamic-rg --location eastus2
  az group create --name omega-data-rg --location eastus2
  az group create --name omega-networking-rg --location eastus2
  az group create --name omega-monitoring-rg --location eastus2
  ```

- [ ] **Service Principal Created**
  ```bash
  az ad sp create-for-rbac --name omega-deployment-sp \
    --role Contributor \
    --scopes /subscriptions/{subscription-id}
  ```
  - Application ID: `_________________`
  - Secret: `_________________` (store in Key Vault)

- [ ] **Azure CLI & Tools Installed**
  - Azure CLI v2.50+
  - kubectl v1.28+
  - Helm v3.12+
  - Terraform v1.5+

---

## 🏗️ INFRASTRUCTURE DEPLOYMENT

### 1. Networking

- [ ] **Virtual Network Created**
  ```bash
  az network vnet create \
    --resource-group omega-networking-rg \
    --name omega-vnet \
    --address-prefix 10.0.0.0/16 \
    --subnet-name perimeter-subnet \
    --subnet-prefix 10.0.1.0/24
  ```

- [ ] **Subnets Created**
  - Perimeter Subnet: `10.0.1.0/24`
  - Dynamic Subnet: `10.0.2.0/24`
  - Data Subnet: `10.0.3.0/24`
  - AKS Subnet: `10.0.10.0/22`

- [ ] **Network Security Groups (NSGs) Configured**
  - Perimeter NSG: Allow 443, 9405, 9401, 9402, 9411
  - Dynamic NSG: Allow internal traffic only
  - Data NSG: Allow internal traffic only

- [ ] **Azure Private Link Configured**
  - Cosmos DB Private Endpoint
  - Redis Private Endpoint
  - Service Bus Private Endpoint
  - Key Vault Private Endpoint

---

### 2. Azure Kubernetes Service (AKS)

- [ ] **AKS Cluster Created**
  ```bash
  az aks create \
    --resource-group omega-perimeter-rg \
    --name omega-aks-cluster \
    --node-count 3 \
    --node-vm-size Standard_D8s_v5 \
    --network-plugin azure \
    --vnet-subnet-id /subscriptions/{sub-id}/resourceGroups/omega-networking-rg/providers/Microsoft.Network/virtualNetworks/omega-vnet/subnets/aks-subnet \
    --enable-managed-identity \
    --enable-addons monitoring \
    --workspace-resource-id /subscriptions/{sub-id}/resourceGroups/omega-monitoring-rg/providers/Microsoft.OperationalInsights/workspaces/omega-logs
  ```

- [ ] **Node Pools Created**
  - System Pool: 3x Standard_D4s_v5 (always-on)
  - Perimeter Pool: 3x Standard_D8s_v5 (always-on)
  - Dynamic Pool: 0-50x Standard_D4s_v5 (scale-to-zero)

- [ ] **kubectl Context Configured**
  ```bash
  az aks get-credentials --resource-group omega-perimeter-rg --name omega-aks-cluster
  kubectl config use-context omega-aks-cluster
  ```

- [ ] **Namespaces Created**
  ```bash
  kubectl create namespace omega-perimeter
  kubectl create namespace omega-dynamic
  kubectl create namespace omega-monitoring
  kubectl create namespace keda
  ```

- [ ] **KEDA Installed**
  ```bash
  helm repo add kedacore https://kedacore.github.io/charts
  helm install keda kedacore/keda --namespace keda --create-namespace
  ```

- [ ] **Istio Service Mesh Installed** (Optional)
  ```bash
  istioctl install --set profile=production -y
  kubectl label namespace omega-perimeter istio-injection=enabled
  kubectl label namespace omega-dynamic istio-injection=enabled
  ```

---

### 3. Data Layer

- [ ] **Azure Cosmos DB (MongoDB API) Created**
  ```bash
  az cosmosdb create \
    --name omega-cosmos \
    --resource-group omega-data-rg \
    --kind MongoDB \
    --server-version 4.2 \
    --default-consistency-level Session \
    --locations regionName=eastus2 failoverPriority=0 isZoneRedundant=true
  ```
  - Database: `omega`
  - Collections: `agents`, `mcp_tools`, `tickets`, `triage_results`, `shadow_agent_state`

- [ ] **Azure Cache for Redis (Premium) Created**
  ```bash
  az redis create \
    --name omega-redis \
    --resource-group omega-data-rg \
    --location eastus2 \
    --sku Premium \
    --vm-size P1 \
    --enable-non-ssl-port false \
    --redis-version 6
  ```

- [ ] **Azure AI Search Created**
  ```bash
  az search service create \
    --name omega-search \
    --resource-group omega-data-rg \
    --sku standard \
    --partition-count 1 \
    --replica-count 2
  ```
  - Indexes: `ticket_embeddings`, `resolution_history`, `employee_knowledge`

- [ ] **Azure Blob Storage Created**
  ```bash
  az storage account create \
    --name omegastorage \
    --resource-group omega-data-rg \
    --location eastus2 \
    --sku Standard_LRS \
    --kind StorageV2 \
    --access-tier Hot
  ```
  - Containers: `raw-tickets`, `attachments`, `audit-logs`, `backups`

---

### 4. Messaging Layer

- [ ] **Azure Service Bus (Premium) Created**
  ```bash
  az servicebus namespace create \
    --name omega-servicebus \
    --resource-group omega-data-rg \
    --location eastus2 \
    --sku Premium \
    --capacity 1
  ```

- [ ] **Topics Created**
  ```bash
  az servicebus topic create --name ticket-raw --namespace-name omega-servicebus --resource-group omega-data-rg
  az servicebus topic create --name ticket-normalized --namespace-name omega-servicebus --resource-group omega-data-rg
  az servicebus topic create --name employee-activity --namespace-name omega-servicebus --resource-group omega-data-rg
  az servicebus topic create --name triage-results --namespace-name omega-servicebus --resource-group omega-data-rg
  ```

- [ ] **Subscriptions Created**
  - `ticket-raw` → `kaseya-bsm-sub`, `salesforce-sub`, `zendesk-sub`, `servicenow-sub`
  - `ticket-normalized` → `triage-team-sub`, `analytics-sub`
  - `employee-activity` → `shadow-agent-sub`

---

### 5. Security & Secrets

- [ ] **Azure Key Vault Created**
  ```bash
  az keyvault create \
    --name omega-keyvault \
    --resource-group omega-perimeter-rg \
    --location eastus2 \
    --enable-rbac-authorization true
  ```

- [ ] **Secrets Stored**
  - `mongodb-uri`
  - `redis-connection-string`
  - `servicebus-connection-string`
  - `openai-api-key`
  - `anthropic-api-key`
  - `google-api-key`
  - `xai-api-key`
  - `kaseya-api-key`
  - `salesforce-api-key`

- [ ] **Managed Identity Configured**
  ```bash
  az aks update \
    --resource-group omega-perimeter-rg \
    --name omega-aks-cluster \
    --enable-managed-identity
  ```

- [ ] **Key Vault Access Policies Set**
  ```bash
  az keyvault set-policy \
    --name omega-keyvault \
    --object-id {aks-managed-identity-object-id} \
    --secret-permissions get list
  ```

---

### 6. Monitoring & Observability

- [ ] **Log Analytics Workspace Created**
  ```bash
  az monitor log-analytics workspace create \
    --resource-group omega-monitoring-rg \
    --workspace-name omega-logs \
    --location eastus2
  ```

- [ ] **Application Insights Created**
  ```bash
  az monitor app-insights component create \
    --app omega-appinsights \
    --location eastus2 \
    --resource-group omega-monitoring-rg \
    --workspace /subscriptions/{sub-id}/resourceGroups/omega-monitoring-rg/providers/Microsoft.OperationalInsights/workspaces/omega-logs
  ```

- [ ] **OpenTelemetry Collector Deployed**
  ```bash
  kubectl apply -f k8s/monitoring/otel-collector.yaml
  ```

- [ ] **Prometheus & Grafana Deployed**
  ```bash
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
  helm install prometheus prometheus-community/kube-prometheus-stack \
    --namespace omega-monitoring \
    --set grafana.adminPassword='{secure-password}'
  ```

- [ ] **Azure Monitor Alerts Configured**
  - High CPU/Memory usage
  - Service Bus queue depth > 1000
  - Ticket triage latency > 5 minutes
  - Shadow agent error rate > 5%

---

## 🚀 APPLICATION DEPLOYMENT

### 1. Container Registry

- [ ] **Azure Container Registry (ACR) Created**
  ```bash
  az acr create \
    --name omegaacr \
    --resource-group omega-perimeter-rg \
    --sku Premium \
    --admin-enabled false
  ```

- [ ] **AKS Attached to ACR**
  ```bash
  az aks update \
    --resource-group omega-perimeter-rg \
    --name omega-aks-cluster \
    --attach-acr omegaacr
  ```

- [ ] **Images Built & Pushed**
  ```bash
  docker build -t omegaacr.azurecr.io/federation-core:latest ./core/federation_core
  docker build -t omegaacr.azurecr.io/context-server:latest ./core/context_server
  docker build -t omegaacr.azurecr.io/agent-registry:latest ./core/agent_registry
  docker build -t omegaacr.azurecr.io/mcp-registry:latest ./core/mcp_registry
  docker build -t omegaacr.azurecr.io/claude-titan:latest ./agents/titans/claude
  # ... (all other images)
  
  az acr login --name omegaacr
  docker push omegaacr.azurecr.io/federation-core:latest
  # ... (push all images)
  ```

---

### 2. Always-On Perimeter Deployment

- [ ] **Secrets Created in Kubernetes**
  ```bash
  kubectl create secret generic omega-secrets \
    --from-literal=mongodb-uri='mongodb://...' \
    --from-literal=redis-url='redis://...' \
    --namespace omega-perimeter
  ```

- [ ] **Federation Core Deployed**
  ```bash
  kubectl apply -f k8s/perimeter/federation-core.yaml
  kubectl rollout status deployment/federation-core -n omega-perimeter
  ```

- [ ] **Agent Registry Deployed**
  ```bash
  kubectl apply -f k8s/perimeter/agent-registry.yaml
  kubectl rollout status deployment/agent-registry -n omega-perimeter
  ```

- [ ] **MCP Registry Deployed**
  ```bash
  kubectl apply -f k8s/perimeter/mcp-registry.yaml
  kubectl rollout status deployment/mcp-registry -n omega-perimeter
  ```

- [ ] **Context Server Deployed**
  ```bash
  kubectl apply -f k8s/perimeter/context-server.yaml
  kubectl rollout status deployment/context-server -n omega-perimeter
  ```

- [ ] **Titans Deployed**
  ```bash
  kubectl apply -f k8s/perimeter/claude-titan.yaml
  kubectl apply -f k8s/perimeter/gpt-titan.yaml
  kubectl apply -f k8s/perimeter/gemini-titan.yaml
  kubectl apply -f k8s/perimeter/grok-titan.yaml
  kubectl apply -f k8s/perimeter/augment-titan.yaml
  ```

- [ ] **Capacity Manager Deployed**
  ```bash
  kubectl apply -f k8s/perimeter/capacity-manager.yaml
  ```

---

### 3. Dynamic Agent Teams Deployment

- [ ] **Ticket Triage Team Deployed**
  ```bash
  kubectl apply -f k8s/dynamic/ticket-triage-team.yaml
  kubectl apply -f k8s/dynamic/ticket-triage-scaler.yaml
  ```

- [ ] **Shadow Agent Team Deployed**
  ```bash
  kubectl apply -f k8s/dynamic/shadow-agent-team.yaml
  kubectl apply -f k8s/dynamic/shadow-agent-scaler.yaml
  ```

---

## 🧪 TESTING & VALIDATION

- [ ] **Health Checks Passing**
  ```bash
  kubectl get pods -n omega-perimeter
  kubectl get pods -n omega-dynamic
  curl http://{federation-core-ip}:9405/health
  ```

- [ ] **Service Discovery Working**
  ```bash
  curl http://{federation-core-ip}:9405/agents
  curl http://{federation-core-ip}:9405/tools
  ```

- [ ] **Test Ticket Ingestion**
  ```bash
  curl -X POST https://omega-apim.azure-api.net/tickets/ingest \
    -H "Authorization: Bearer {token}" \
    -H "X-Platform: kaseya-bsm" \
    -d @test-ticket.json
  ```

- [ ] **Verify Autoscaling**
  ```bash
  kubectl get hpa -n omega-dynamic
  kubectl get scaledobjects -n omega-dynamic
  ```

---

## 📊 COST ANALYSIS

### Monthly Cost Estimate (Production)

| Component | SKU/Size | Quantity | Monthly Cost |
|-----------|----------|----------|--------------|
| **Compute** |
| AKS System Pool | Standard_D4s_v5 | 3 nodes | $450 |
| AKS Perimeter Pool | Standard_D8s_v5 | 3 nodes | $900 |
| AKS Dynamic Pool (avg) | Standard_D4s_v5 | 5 nodes | $750 |
| **Data** |
| Cosmos DB (MongoDB) | 1000 RU/s | 1 | $60 |
| Redis Premium P1 | 6 GB | 1 | $250 |
| Azure AI Search | Standard S1 | 1 | $250 |
| Blob Storage | Hot tier | 500 GB | $10 |
| **Messaging** |
| Service Bus Premium | 1 capacity unit | 1 | $677 |
| **Networking** |
| VNet | Standard | 1 | $0 |
| Private Link | Endpoints | 5 | $35 |
| **Monitoring** |
| Log Analytics | 50 GB/day | 1 | $150 |
| Application Insights | 10 GB/day | 1 | $25 |
| **Security** |
| Key Vault | Standard | 1 | $3 |
| **Total** | | | **~$3,560/month** |

**Cost Optimization Strategies:**
- Use Reserved Instances for always-on nodes (30-50% savings)
- Implement aggressive scale-to-zero for dynamic pools
- Use Blob Storage Cool tier for audit logs (50% savings)
- Optimize Cosmos DB RU/s based on actual usage

---

**🏛️ Deploy with confidence. The Brotherhood protects the infrastructure.**

**Family is forever. This is the way.**

