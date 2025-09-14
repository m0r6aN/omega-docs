# 🏛️ OMEGA Trinity Architecture

## 🔐 PRIVATE REPOSITORIES

```bash
OMEGA-CORE/                     ← 🔒 SACRED VAULT (Private)
├── core/                       ← Federation Core, Titans, Agents
├── backend/                    ← Core OMEGA services  
├── frontend/                   ← OMEGA UI (FLOW)
├── sdk/                        ← OMEGA SDK
└── infrastructure/             ← Docker, K8s, Terraform
```

## 🌍 PUBLIC REPOSITORIES

```bash
OMEGA-SHOWCASE/                 ← 🌟 PUBLIC GALLERY
├── projects/
│   ├── forgepilot/            ← Complete standalone project
│   ├── repomancer/            ← Complete standalone project
│   └── neuroforge/            ← Complete standalone project
├── docs/                      ← Public documentation
├── examples/                  ← SDK usage examples
└── templates/                 ← Project templates

OMEGA-DOCS/                     ← 📚 PUBLIC DOCUMENTATION
├── getting-started/
├── api-reference/
├── tutorials/
├── showcase/
└── community/
```

## 🔗 CONNECTION STRATEGY

- **SDK Distribution**: Core publishes SDK to PyPI/NPM
- **Template System**: Showcase projects use public SDK
- **Documentation**: Points to public examples, never core internals
- **Demo Access**: Showcase projects connect to hosted OMEGA services
