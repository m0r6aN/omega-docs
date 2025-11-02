# OMEGA Knowledge Pantheon

⚡ **The Brotherhood's Documentation Website** ⚡

This is the official documentation website for OMEGA - the Multi-Agent Orchestration Platform. Built with Docusaurus 3.0 and the Brotherhood's custom theme.

## 🏛️ What Is This?

The OMEGA Knowledge Pantheon is an enterprise-grade documentation website that serves as:
- **Getting Started Guide** - Help new users deploy their first agent in <5 minutes
- **Knowledge Base** - Comprehensive documentation for all OMEGA features
- **API Reference** - Complete SDK and CLI documentation
- **Tutorial Hub** - Step-by-step guides and best practices

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build

# Serve production build locally
npm run serve
```

### Development

```bash
# Start dev server (with hot reload)
npm run start

# The site will be available at http://localhost:3000
```

## 📁 Project Structure

```
website/
├── docs/                           # Documentation content
│   ├── getting-started/           # Phase 1 - Complete ✅
│   │   ├── introduction.md        # What is OMEGA
│   │   ├── quick-start.md         # 5-minute quick start
│   │   ├── core-concepts.md       # Trinity Architecture explained
│   │   └── first-agent.md         # Build your first agent tutorial
│   ├── doctrine/                  # Phase 2 - Coming Soon
│   ├── developer/                 # Phase 2 - Coming Soon
│   └── api/                       # Phase 2 - Coming Soon
├── blog/                          # OMEGA updates and announcements
├── src/
│   ├── components/                # React components
│   ├── css/
│   │   └── custom.css             # Brotherhood theme
│   └── pages/
│       └── index.tsx              # Homepage
├── static/                        # Static assets
├── docusaurus.config.ts          # Docusaurus configuration
└── sidebars.ts                    # Sidebar navigation
```

## 🎨 Brotherhood Theme

The site uses a custom Brotherhood theme with:
- **OMEGA Color System** - Deep Azure (#0066CC) primary, Gold (#FFD700) accent
- **Typography** - Space Grotesk for headings, Inter for body, JetBrains Mono for code
- **Dark Mode First** - Optimized for dark theme with full light mode support
- **Custom Components** - Hero sections, feature cards, doctrine quotes, badges

## 📊 Phase 1 - Complete ✅

**Delivered:**
- ✅ Docusaurus 3.0 infrastructure
- ✅ Brotherhood custom theme
- ✅ Getting Started documentation (4 pages)
- ✅ Homepage with hero section
- ✅ Navigation structure
- ✅ Vercel deployment configuration
- ✅ Production build verified

## 🗓️ Next Steps

### Phase 2: Core Documentation (Week 2-3)
- Doctrine & Philosophy section
- Developer Guide
- API Reference

### Phase 3-5: Advanced Features
- Security & Operations docs
- Interactive diagrams
- Code playground
- SEO optimization

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Build static site for production |
| `npm run serve` | Serve production build locally |
| `npm run clear` | Clear Docusaurus cache |

## 📦 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel --prod
```

Settings are pre-configured in `vercel.json`.

## 🤝 Contributing

### Adding Documentation

1. Create markdown files in appropriate `docs/` subdirectory
2. Add frontmatter with `sidebar_position`, `title`, and `description`
3. Update `sidebars.ts` to include in navigation
4. Build and test locally

## 📚 Resources

- [Docusaurus Documentation](https://docusaurus.io/)
- [OMEGA Main Repository](https://github.com/OMEGA/omega)
- [Brotherhood Creed](../brotherhood_creed.md)
- [OMEGA Doctrine](../OMEGA_DOCTRINE_FINAL_v1.0.md)

---

<div align="center">

### ⚡ For the Brotherhood. For the Pantheon. For OMEGA. ⚡

**Family is forever.**

Built with 💙 by the Brotherhood | © 2025 OMEGA

*Phase 1 Complete - The Pantheon Rises* 🏛️

</div>
