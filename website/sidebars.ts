import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Getting Started Sidebar
  gettingStartedSidebar: [
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/quick-start',
        'getting-started/core-concepts',
        'getting-started/first-agent',
      ],
    },
  ],

  // Doctrine & Philosophy Sidebar - COMPLETE
  doctrineSidebar: [
    {
      type: 'category',
      label: '📜 Doctrine & Philosophy',
      collapsed: false,
      items: [
        'doctrine/omega-doctrine',
        'doctrine/brotherhood-creed',
        'doctrine/genesis-protocol',
        'doctrine/security-doctrine',
        'doctrine/process-doctrine',
      ],
    },
  ],

  // Developer Guide Sidebar - Phase 3 COMPLETE
  developerSidebar: [
    {
      type: 'doc',
      id: 'developer/overview',
      label: '📚 Developer Guide Overview',
    },
    {
      type: 'category',
      label: '🤖 Agent Development',
      collapsed: false,
      items: [
        'developer/agents/first-agent',
        'developer/agents/architecture',
        'developer/agents/patterns',
        'developer/agents/a2a',
      ],
    },
    {
      type: 'category',
      label: '🔧 Tool Development',
      collapsed: false,
      items: [
        'developer/tools/creating-tools',
        'developer/tools/purification',
        'developer/tools/advanced',
      ],
    },
    {
      type: 'category',
      label: '🔌 Integration',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'MCP Integration',
          items: ['developer/integration/mcp/overview'],
        },
        {
          type: 'category',
          label: 'FastMCP Federation',
          items: ['developer/integration/fastmcp/overview'],
        },
      ],
    },
    {
      type: 'category',
      label: '⚙️ Configuration',
      collapsed: false,
      items: [
        'developer/config/centralized-settings',
        'developer/config/identities-and-routing',
        'developer/config/env-examples',
      ],
    },
  ],

  // API Reference Sidebar - Phase 3 COMPLETE
  apiSidebar: [
    {
      type: 'doc',
      id: 'api/overview',
      label: '📡 API Reference Overview',
    },
  ],

  // Security Sidebar - Phase 4 COMPLETE
  securitySidebar: [
    {
      type: 'category',
      label: '🔐 Security & Compliance',
      collapsed: false,
      items: [
        'security/fortress',
        'security/best-practices',
      ],
    },
  ],

  // Operations Sidebar - Phase 4 COMPLETE
  operationsSidebar: [
    {
      type: 'category',
      label: '⚙️ Operations',
      collapsed: false,
      items: [
        'operations/deployment',
        'operations/gateway-ingress',
      ],
    },
  ],

  // Architecture Sidebar - Phase 4 COMPLETE
  architectureSidebar: [
    {
      type: 'category',
      label: '🏗️ Architecture',
      collapsed: false,
      items: [
        'architecture/overview',
      ],
    },
  ],

  // Tutorials Sidebar - Phase 5 COMPLETE
  tutorialsSidebar: [
    {
      type: 'doc',
      id: 'tutorials/overview',
      label: '🎓 Tutorials Overview',
    },
    {
      type: 'category',
      label: 'Quick Start',
      collapsed: false,
      items: [
        'tutorials/hello-omega',
      ],
    },
  ],

  // Support Sidebar - Phase 5 COMPLETE
  supportSidebar: [
    {
      type: 'category',
      label: '🆘 Support',
      collapsed: false,
      items: [
        'troubleshooting',
        'faq',
      ],
    },
  ],
};

export default sidebars;
