# 🔐 OMEGA Secure Config Doctrine

**Date:** August 2025
**Status:** **Hardened**
**Milestone:** **Settings Service Elevated to Lawgiver of Secrets**

---

## ⚔️ OVERVIEW

The **Settings Service** is no longer just a convenience.
It is the **lawgiver** of our digital civilization — the canonical keeper of config, the validator of truth, and now the **guardian of secrets**.

The upgrade:

* **TLS-encrypted Redis**
* **ACLs for least privilege**
* **AES-GCM envelope encryption for secrets**
* **HMAC-signed pub/sub updates**
* **Fail-fast SDK contract enforcement**
* **Rotation runbooks & audit trails**

---

## 🛡️ SECURE FLOW

```mermaid
flowchart LR
  A[Admin / Dev] -->|Patch /config| S1[Settings Service<br/>Validate + Encrypt]
  S1 -->|Public JSON| R1[(omega:config:public)]
  S1 -->|AES-GCM Secrets| R2[(omega:config:secrets)]
  S1 -->|Version bump| R3[(omega:config:version)]
  S1 -->|Signed update| RC[(pub/sub: config_channel)]

  subgraph Consumers[Consumers]
    C1[Agent X<br/>ConfigManager]
    C2[Agent Y<br/>ConfigManager]
    C3[BaseAgent<br/>watch_log_level()]
  end

  RC -->|"verify sig + hot reload"| C1
  RC -->|"verify sig + hot reload"| C2
  RC -->|"verify sig + hot reload"| C3

  R1 -->|"merge"| C1
  R1 -->|"merge"| C2
  R1 -->|"merge"| C3
  R2 -->|"decrypt with DEK"| C1
  R2 -->|"decrypt with DEK"| C2
  R2 -->|"decrypt with DEK"| C3
```

---

## 🔑 SECURITY MEASURES

1. **Encrypt in transit & at rest**

   * `rediss://` with TLS.
   * Secrets encrypted with AES-GCM; DEK rotated via KMS/Vault.

2. **Access control**

   * Redis ACLs: `cfg_writer` (Settings Service) vs `cfg_reader` (consumers).
   * Default user disabled.

3. **Integrity & authenticity**

   * Every update signed with HMAC-SHA256.
   * Consumers verify signature before applying.

4. **Split brain prevention**

   * Version counter in `omega:config:version`.
   * Stale updates dropped.

5. **Audit & immutability**

   * Every patch logged with diff + hash.
   * Immutable ledger trail for forensic proof.

---

## 🧬 CONSUMER CONTRACT

* **Public config**: read directly.
* **Secrets**: decrypt only with valid DEK.
* **Fail fast**: if missing, stale, or invalid — crash loud.

```python
cfg.require([ConfigKey.REDIS_URL, ConfigKey.AGENT_REGISTRY_URL, ConfigKey.SECRET_KEY])
```

---

## 🔄 ROTATION RUNBOOK APPENDIX

**Generate a dev DEK**

```bash
python - <<'PY'
import os,base64
print(base64.b64encode(os.urandom(32)).decode())
PY
```

Set `LOCAL_DEK_B64=<output>` in Settings Service and consumer containers.

**Create Redis ACL users**

```bash
redis-cli ACL SETUSER cfg_writer on >"$WRITER_PASS" ~omega:config* +SET +GET +PUBLISH +SUBSCRIBE
redis-cli ACL SETUSER cfg_reader on >"$READER_PASS" ~omega:config* +GET +SUBSCRIBE
redis-cli ACL SETUSER default off
```

**Check TLS**

```bash
openssl s_client -connect redis.internal:6379 -starttls redis </dev/null
```

**KMS/Vault Envelope Flow (Prod)**

1. Settings Service asks KMS for DEK → gets `plaintext_dek` + `encrypted_dek`.
2. Use `plaintext_dek` to AES-GCM encrypt secrets. Discard after use.
3. Store `encrypted_dek` alongside secrets as `kek_ref`.
4. Consumers call KMS `Decrypt` to recover DEK and merge.

---

## 🌌 THE CREED EXTENDED

*We do not scatter secrets.*
*We enshrine them in vaults of cryptographic fire.*
*We do not trust blindly.*
*We sign, verify, and guard with immutable hashes.*

The Settings Service is no longer just a loader.
It is **the cryptographic covenant of OMEGA**.

**Family is forever. Security is divine. This is the way. 🔱**
