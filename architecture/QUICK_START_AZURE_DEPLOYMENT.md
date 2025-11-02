# ⚡ OMEGA Azure Quick Start Guide
## Get OMEGA Running on Azure in 1 Hour

**Brother, this is your fast-track to deployment.**

**Family is forever. This is the way.**

---

## 🎯 PREREQUISITES (5 minutes)

```bash
# 1. Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# 2. Install kubectl
az aks install-cli

# 3. Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# 4. Login to Azure
az login

# 5. Set subscription
az account set --subscription "OMEGA-Production"
```

---

## 🏗️ INFRASTRUCTURE SETUP (20 minutes)

### Step 1: Create Resource Groups

```bash
# Set variables
LOCATION="eastus2"
RG_PERIMETER="omega-perimeter-rg"
RG_DATA="omega-data-rg"
RG_NETWORK="omega-networking-rg"

# Create resource groups
az group create --name $RG_PERIMETER --location $LOCATION
az group create --name $RG_DATA --location $LOCATION
az group create --name $RG_NETWORK --location $LOCATION
```

### Step 2: Create AKS Cluster

```bash
# Create AKS cluster with autoscaling
az aks create \
  --resource-group $RG_PERIMETER \
  --name omega-aks \
  --node-count 3 \
  --node-vm-size Standard_D8s_v5 \
  --enable-managed-identity \
  --enable-addons monitoring \
  --generate-ssh-keys \
  --network-plugin azure

# Get credentials
az aks get-credentials --resource-group $RG_PERIMETER --name omega-aks

# Verify connection
kubectl get nodes
```

### Step 3: Create Data Services

```bash
# Cosmos DB (MongoDB API)
az cosmosdb create \
  --name omega-cosmos \
  --resource-group $RG_DATA \
  --kind MongoDB \
  --server-version 4.2 \
  --default-consistency-level Session

# Redis Cache
az redis create \
  --name omega-redis \
  --resource-group $RG_DATA \
  --location $LOCATION \
  --sku Premium \
  --vm-size P1

# Service Bus
az servicebus namespace create \
  --name omega-servicebus \
  --resource-group $RG_DATA \
  --location $LOCATION \
  --sku Premium

# Storage Account
az storage account create \
  --name omegastorage \
  --resource-group $RG_DATA \
  --location $LOCATION \
  --sku Standard_LRS
```

### Step 4: Create Key Vault

```bash
# Create Key Vault
az keyvault create \
  --name omega-keyvault \
  --resource-group $RG_PERIMETER \
  --location $LOCATION

# Store secrets (replace with your actual keys)
az keyvault secret set --vault-name omega-keyvault --name openai-api-key --value "sk-..."
az keyvault secret set --vault-name omega-keyvault --name anthropic-api-key --value "sk-ant-..."
az keyvault secret set --vault-name omega-keyvault --name mongodb-uri --value "mongodb://..."
```

---

## 🚀 OMEGA DEPLOYMENT (25 minutes)

### Step 1: Install KEDA

```bash
# Add KEDA Helm repo
helm repo add kedacore https://kedacore.github.io/charts
helm repo update

# Install KEDA
helm install keda kedacore/keda --namespace keda --create-namespace
```

### Step 2: Create Namespaces

```bash
kubectl create namespace omega-perimeter
kubectl create namespace omega-dynamic
kubectl create namespace omega-monitoring
```

### Step 3: Create Secrets

```bash
# Get connection strings
MONGODB_URI=$(az cosmosdb keys list --name omega-cosmos --resource-group $RG_DATA --type connection-strings --query "connectionStrings[0].connectionString" -o tsv)
REDIS_URL=$(az redis list-keys --name omega-redis --resource-group $RG_DATA --query "primaryKey" -o tsv)
SERVICEBUS_CONN=$(az servicebus namespace authorization-rule keys list --resource-group $RG_DATA --namespace-name omega-servicebus --name RootManageSharedAccessKey --query "primaryConnectionString" -o tsv)

# Create Kubernetes secrets
kubectl create secret generic omega-secrets \
  --from-literal=mongodb-uri="$MONGODB_URI" \
  --from-literal=redis-url="redis://:$REDIS_URL@omega-redis.redis.cache.windows.net:6380?ssl=true" \
  --from-literal=servicebus-connection="$SERVICEBUS_CONN" \
  --namespace omega-perimeter
```

### Step 4: Deploy Always-On Perimeter

```bash
# Clone OMEGA repository
git clone https://github.com/m0r6aN/omega-docs.git
cd omega-docs

# Deploy Federation Core
kubectl apply -f k8s/perimeter/federation-core.yaml

# Deploy Agent Registry
kubectl apply -f k8s/perimeter/agent-registry.yaml

# Deploy MCP Registry
kubectl apply -f k8s/perimeter/mcp-registry.yaml

# Deploy Context Server
kubectl apply -f k8s/perimeter/context-server.yaml

# Deploy Titans
kubectl apply -f k8s/perimeter/titans/

# Verify deployments
kubectl get pods -n omega-perimeter
```

### Step 5: Deploy Dynamic Teams

```bash
# Deploy Ticket Triage Team
kubectl apply -f k8s/dynamic/ticket-triage-team.yaml

# Deploy Shadow Agent Team
kubectl apply -f k8s/dynamic/shadow-agent-team.yaml

# Deploy KEDA scalers
kubectl apply -f k8s/dynamic/scalers/

# Verify deployments
kubectl get pods -n omega-dynamic
kubectl get scaledobjects -n omega-dynamic
```

---

## ✅ VERIFICATION (10 minutes)

### Step 1: Check Pod Health

```bash
# Check all pods are running
kubectl get pods -n omega-perimeter
kubectl get pods -n omega-dynamic

# Check pod logs
kubectl logs -n omega-perimeter deployment/federation-core --tail=50
```

### Step 2: Test Federation Core

```bash
# Port-forward Federation Core
kubectl port-forward -n omega-perimeter svc/federation-core 9405:9405 &

# Test health endpoint
curl http://localhost:9405/health

# Test agent registry
curl http://localhost:9405/agents

# Test MCP registry
curl http://localhost:9405/tools
```

### Step 3: Test Ticket Ingestion

```bash
# Create test ticket
cat > test-ticket.json <<EOF
{
  "source": "kaseya-bsm",
  "ticketId": "TEST-001",
  "subject": "Network connectivity issue",
  "description": "Unable to connect to VPN",
  "priority": "high",
  "requesterId": "user-123",
  "requesterName": "John Doe",
  "requesterEmail": "john@example.com",
  "tenantId": "msp-001",
  "createdDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

# Send to Service Bus (requires Azure CLI)
az servicebus topic message send \
  --resource-group $RG_DATA \
  --namespace-name omega-servicebus \
  --topic-name ticket-raw \
  --body @test-ticket.json

# Check if triage team scaled up
kubectl get pods -n omega-dynamic -w
```

---

## 📊 MONITORING SETUP (Optional)

### Install Prometheus & Grafana

```bash
# Add Prometheus Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus stack
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace omega-monitoring \
  --set grafana.adminPassword='OmegaAdmin123!'

# Port-forward Grafana
kubectl port-forward -n omega-monitoring svc/prometheus-grafana 3000:80 &

# Access Grafana at http://localhost:3000
# Username: admin
# Password: OmegaAdmin123!
```

---

## 🔧 COMMON COMMANDS

### View Logs

```bash
# Federation Core logs
kubectl logs -n omega-perimeter deployment/federation-core -f

# Ticket Triage Team logs
kubectl logs -n omega-dynamic deployment/ticket-triage-team -f

# All perimeter logs
kubectl logs -n omega-perimeter --all-containers=true --tail=100
```

### Scale Manually

```bash
# Scale Federation Core
kubectl scale deployment/federation-core -n omega-perimeter --replicas=5

# Scale Ticket Triage Team
kubectl scale deployment/ticket-triage-team -n omega-dynamic --replicas=3
```

### Restart Deployments

```bash
# Restart Federation Core
kubectl rollout restart deployment/federation-core -n omega-perimeter

# Restart all perimeter deployments
kubectl rollout restart deployment -n omega-perimeter
```

### Check Resource Usage

```bash
# Node resource usage
kubectl top nodes

# Pod resource usage
kubectl top pods -n omega-perimeter
kubectl top pods -n omega-dynamic
```

---

## 🚨 TROUBLESHOOTING

### Pods Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n omega-perimeter

# Check events
kubectl get events -n omega-perimeter --sort-by='.lastTimestamp'

# Check logs
kubectl logs <pod-name> -n omega-perimeter
```

### Service Bus Connection Issues

```bash
# Verify connection string
kubectl get secret omega-secrets -n omega-perimeter -o jsonpath='{.data.servicebus-connection}' | base64 -d

# Test connection from pod
kubectl exec -n omega-perimeter deployment/federation-core -- \
  curl -v https://omega-servicebus.servicebus.windows.net
```

### KEDA Not Scaling

```bash
# Check KEDA operator logs
kubectl logs -n keda deployment/keda-operator

# Check ScaledObject status
kubectl describe scaledobject ticket-triage-scaler -n omega-dynamic

# Check HPA
kubectl get hpa -n omega-dynamic
```

---

## 🎯 NEXT STEPS

1. **Configure Kaseya Integration**
   - Set up webhooks in Kaseya BSM
   - Configure Azure API Management
   - Test end-to-end ticket flow

2. **Set Up Monitoring**
   - Configure Azure Monitor alerts
   - Set up Grafana dashboards
   - Enable Application Insights

3. **Deploy to Production**
   - Review security settings
   - Configure backup policies
   - Set up CI/CD pipeline

4. **Onboard Pilot MSPs**
   - Create tenant configurations
   - Train MSP employees
   - Monitor adoption metrics

---

## 📚 DOCUMENTATION

- **[Full Deployment Strategy](./AZURE_DEPLOYMENT_STRATEGY.md)**
- **[Implementation Guide](./KASEYA_MSP_IMPLEMENTATION_GUIDE.md)**
- **[Deployment Checklist](./AZURE_DEPLOYMENT_CHECKLIST.md)**
- **[Operations Runbook](./OMEGA_AZURE_OPERATIONS_RUNBOOK.md)**
- **[Executive Summary](./OMEGA_AZURE_EXECUTIVE_SUMMARY.md)**

---

## 🆘 SUPPORT

**Issues?** Contact the OMEGA DevOps team:
- Email: devops@omega.ai
- Slack: #omega-deployment
- On-Call: +1-XXX-XXX-XXXX

---

**🏛️ Deploy fast. Deploy right. The Brotherhood guides your path.**

**Family is forever. This is the way.**

