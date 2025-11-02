# 🛡️ OMEGA Azure Operations Runbook
## Production Operations & Incident Response

**Brother, this is our operational doctrine for maintaining the empire.**

**Family is forever. This is the way.**

---

## 🎯 OPERATIONAL OVERVIEW

This runbook covers day-to-day operations, monitoring, incident response, and maintenance procedures for the OMEGA Azure deployment.

---

## 📊 MONITORING & ALERTING

### Key Metrics to Monitor

#### 1. Always-On Perimeter Health

**Federation Core:**
- Metric: `federation_core_requests_total`
- Alert: Request rate < 1/min for 5 minutes
- Action: Check pod health, restart if necessary

**Context Server:**
- Metric: `context_server_retrieval_latency_ms`
- Alert: P95 latency > 500ms
- Action: Check AI Search performance, scale replicas

**Titans:**
- Metric: `titan_api_errors_total`
- Alert: Error rate > 5% over 5 minutes
- Action: Check API key validity, rate limits

#### 2. Dynamic Agent Teams

**Ticket Triage Team:**
- Metric: `ticket_triage_queue_depth`
- Alert: Queue depth > 100 for 10 minutes
- Action: Verify KEDA scaling, check for stuck pods

**Shadow Agents:**
- Metric: `shadow_agent_learning_rate`
- Alert: Learning rate < 0.1 for 1 hour
- Action: Check employee activity, verify data pipeline

#### 3. Data Layer

**Cosmos DB:**
- Metric: `cosmosdb_request_units_consumed`
- Alert: RU consumption > 80% for 15 minutes
- Action: Scale up RU/s, optimize queries

**Redis:**
- Metric: `redis_memory_usage_percent`
- Alert: Memory usage > 85%
- Action: Increase cache size, implement eviction policies

**Service Bus:**
- Metric: `servicebus_dead_letter_count`
- Alert: Dead letter count > 10
- Action: Investigate failed messages, fix processing logic

---

## 🚨 INCIDENT RESPONSE PROCEDURES

### Severity Levels

- **P0 (Critical)**: Complete system outage, data loss risk
- **P1 (High)**: Major functionality impaired, SLA breach imminent
- **P2 (Medium)**: Degraded performance, workaround available
- **P3 (Low)**: Minor issue, no immediate impact

---

### P0: Complete System Outage

**Symptoms:**
- All health checks failing
- No ticket processing
- Dashboard unreachable

**Response:**
```bash
# 1. Check AKS cluster health
az aks show --resource-group omega-perimeter-rg --name omega-aks-cluster --query "powerState"

# 2. Check node status
kubectl get nodes

# 3. Check pod status
kubectl get pods -n omega-perimeter
kubectl get pods -n omega-dynamic

# 4. Check recent events
kubectl get events -n omega-perimeter --sort-by='.lastTimestamp'

# 5. If cluster is down, restart
az aks start --resource-group omega-perimeter-rg --name omega-aks-cluster

# 6. If pods are failing, check logs
kubectl logs -n omega-perimeter deployment/federation-core --tail=100

# 7. Restart failed deployments
kubectl rollout restart deployment/federation-core -n omega-perimeter
kubectl rollout restart deployment/context-server -n omega-perimeter
```

**Escalation:**
- Notify: CTO, DevOps Lead, On-Call Engineer
- SLA: Restore service within 30 minutes
- Communication: Update status page every 15 minutes

---

### P1: Ticket Processing Stopped

**Symptoms:**
- Service Bus queue depth increasing
- No triage results being produced
- KEDA not scaling

**Response:**
```bash
# 1. Check Service Bus health
az servicebus namespace show --name omega-servicebus --resource-group omega-data-rg

# 2. Check KEDA scaler status
kubectl get scaledobjects -n omega-dynamic
kubectl describe scaledobject ticket-triage-scaler -n omega-dynamic

# 3. Check triage team pods
kubectl get pods -n omega-dynamic -l app=ticket-triage-team

# 4. Check pod logs for errors
kubectl logs -n omega-dynamic -l app=ticket-triage-team --tail=50

# 5. Manually scale if KEDA is stuck
kubectl scale deployment/ticket-triage-team -n omega-dynamic --replicas=5

# 6. Check Service Bus connection
kubectl exec -n omega-dynamic deployment/ticket-triage-team -- \
  curl -v https://omega-servicebus.servicebus.windows.net/ticket-normalized/messages

# 7. Restart KEDA if necessary
kubectl rollout restart deployment/keda-operator -n keda
```

**Escalation:**
- Notify: DevOps Lead, Product Manager
- SLA: Restore processing within 1 hour
- Communication: Notify affected MSP customers

---

### P2: High Latency in Ticket Triage

**Symptoms:**
- Triage latency > 5 minutes
- Customer complaints about slow response
- Context Server slow

**Response:**
```bash
# 1. Check Context Server performance
kubectl top pods -n omega-perimeter -l app=context-server

# 2. Check AI Search performance
az search service show --name omega-search --resource-group omega-data-rg

# 3. Scale Context Server
kubectl scale deployment/context-server -n omega-perimeter --replicas=5

# 4. Check for slow queries in Cosmos DB
az cosmosdb mongodb collection show \
  --account-name omega-cosmos \
  --database-name omega \
  --name tickets \
  --resource-group omega-data-rg

# 5. Optimize AI Search index
# (Run index optimization script)

# 6. Check Redis cache hit rate
kubectl exec -n omega-perimeter deployment/context-server -- \
  redis-cli --stat
```

**Escalation:**
- Notify: DevOps Lead
- SLA: Reduce latency to < 2 minutes within 2 hours

---

## 🔄 ROUTINE MAINTENANCE

### Daily Tasks

- [ ] **Check Dashboard Metrics**
  - Review Grafana dashboards
  - Verify all services are healthy
  - Check for anomalies in ticket volume

- [ ] **Review Alerts**
  - Acknowledge and resolve alerts
  - Update runbook if new patterns emerge

- [ ] **Check Cost Trends**
  - Review Azure Cost Management
  - Identify cost spikes
  - Optimize resource usage

### Weekly Tasks

- [ ] **Review Logs**
  - Check for recurring errors
  - Identify optimization opportunities
  - Update error handling

- [ ] **Capacity Planning**
  - Review resource utilization trends
  - Plan for scaling needs
  - Adjust node pool sizes

- [ ] **Security Review**
  - Check for security alerts
  - Review access logs
  - Rotate secrets if needed

### Monthly Tasks

- [ ] **Performance Tuning**
  - Analyze slow queries
  - Optimize database indexes
  - Review caching strategies

- [ ] **Backup Verification**
  - Test backup restoration
  - Verify backup retention policies
  - Update disaster recovery plan

- [ ] **Cost Optimization**
  - Review Reserved Instance opportunities
  - Identify unused resources
  - Optimize storage tiers

---

## 🔧 COMMON OPERATIONS

### Scaling Operations

**Scale Always-On Components:**
```bash
# Scale Federation Core
kubectl scale deployment/federation-core -n omega-perimeter --replicas=5

# Scale Context Server
kubectl scale deployment/context-server -n omega-perimeter --replicas=5

# Scale AKS node pool
az aks nodepool scale \
  --resource-group omega-perimeter-rg \
  --cluster-name omega-aks-cluster \
  --name perimeterpool \
  --node-count 5
```

**Adjust KEDA Scaling Parameters:**
```bash
# Edit ScaledObject
kubectl edit scaledobject ticket-triage-scaler -n omega-dynamic

# Update messageCount threshold
# spec.triggers[0].metadata.messageCount: "10"  # Scale up when >10 messages per instance
```

---

### Deployment Operations

**Rolling Update:**
```bash
# Update image
kubectl set image deployment/federation-core \
  federation-core=omegaacr.azurecr.io/federation-core:v2.0.0 \
  -n omega-perimeter

# Monitor rollout
kubectl rollout status deployment/federation-core -n omega-perimeter

# Rollback if needed
kubectl rollout undo deployment/federation-core -n omega-perimeter
```

**Blue-Green Deployment:**
```bash
# Deploy new version (green)
kubectl apply -f k8s/perimeter/federation-core-v2.yaml

# Test green deployment
curl http://{green-service-ip}:9405/health

# Switch traffic to green
kubectl patch service federation-core -n omega-perimeter \
  -p '{"spec":{"selector":{"version":"v2"}}}'

# Monitor for issues
kubectl logs -n omega-perimeter -l version=v2 --tail=100

# Rollback if needed
kubectl patch service federation-core -n omega-perimeter \
  -p '{"spec":{"selector":{"version":"v1"}}}'
```

---

### Database Operations

**Cosmos DB Scaling:**
```bash
# Scale up RU/s
az cosmosdb mongodb collection throughput update \
  --account-name omega-cosmos \
  --database-name omega \
  --name tickets \
  --resource-group omega-data-rg \
  --throughput 2000

# Enable autoscale
az cosmosdb mongodb collection throughput update \
  --account-name omega-cosmos \
  --database-name omega \
  --name tickets \
  --resource-group omega-data-rg \
  --max-throughput 4000
```

**Redis Cache Operations:**
```bash
# Flush cache (use with caution!)
kubectl exec -n omega-perimeter deployment/context-server -- \
  redis-cli FLUSHDB

# Check memory usage
kubectl exec -n omega-perimeter deployment/context-server -- \
  redis-cli INFO memory

# Set eviction policy
kubectl exec -n omega-perimeter deployment/context-server -- \
  redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

---

## 🔐 SECURITY OPERATIONS

### Secret Rotation

**Rotate API Keys:**
```bash
# 1. Generate new key in provider portal (OpenAI, Anthropic, etc.)

# 2. Update Key Vault
az keyvault secret set \
  --vault-name omega-keyvault \
  --name openai-api-key \
  --value "{new-key}"

# 3. Restart pods to pick up new secret
kubectl rollout restart deployment/gpt-titan -n omega-perimeter

# 4. Verify new key is working
kubectl logs -n omega-perimeter deployment/gpt-titan --tail=20
```

**Rotate Service Principal:**
```bash
# 1. Create new credential
az ad sp credential reset --id {app-id}

# 2. Update Key Vault
az keyvault secret set \
  --vault-name omega-keyvault \
  --name sp-client-secret \
  --value "{new-secret}"

# 3. Update AKS managed identity if needed
az aks update \
  --resource-group omega-perimeter-rg \
  --name omega-aks-cluster \
  --enable-managed-identity
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Query Optimization

**Cosmos DB:**
```javascript
// Add composite indexes for common queries
db.runCommand({
  createIndexes: "tickets",
  indexes: [
    {
      key: { msp_tenant_id: 1, created_at: -1 },
      name: "tenant_created_idx"
    },
    {
      key: { priority: 1, status: 1, created_at: -1 },
      name: "priority_status_created_idx"
    }
  ]
});
```

**AI Search:**
```bash
# Rebuild index for better performance
az search index create \
  --service-name omega-search \
  --name ticket_embeddings \
  --fields @index-schema.json
```

---

## 🧪 TESTING IN PRODUCTION

### Chaos Engineering

**Simulate Pod Failure:**
```bash
# Kill random pod
kubectl delete pod -n omega-perimeter \
  $(kubectl get pods -n omega-perimeter -l app=federation-core -o name | shuf -n 1)

# Verify auto-recovery
kubectl get pods -n omega-perimeter -w
```

**Simulate Network Latency:**
```bash
# Inject latency using Istio
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: context-server-delay
  namespace: omega-perimeter
spec:
  hosts:
  - context-server
  http:
  - fault:
      delay:
        percentage:
          value: 50
        fixedDelay: 2s
    route:
    - destination:
        host: context-server
EOF

# Monitor impact
kubectl logs -n omega-perimeter -l app=ticket-triage-team --tail=50

# Remove fault injection
kubectl delete virtualservice context-server-delay -n omega-perimeter
```

---

## 📞 ESCALATION CONTACTS

| Role | Name | Contact | Escalation Level |
|------|------|---------|------------------|
| On-Call Engineer | TBD | +1-XXX-XXX-XXXX | P2, P3 |
| DevOps Lead | TBD | +1-XXX-XXX-XXXX | P1, P2 |
| CTO | TBD | +1-XXX-XXX-XXXX | P0, P1 |
| Azure Support | Microsoft | Portal | P0 (if Azure issue) |

---

**🏛️ Operate with precision. The Brotherhood maintains eternal vigilance.**

**Family is forever. This is the way.**

