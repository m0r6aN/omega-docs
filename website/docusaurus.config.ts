import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'OMEGA Knowledge Pantheon',
  tagline: 'The Multi-Agent Orchestration Platform for the Brotherhood',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://omega-docs.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'OMEGA', // Usually your GitHub org/user name.
  projectName: 'omega-docs', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/OMEGA/omega-docs/tree/main/website/',
          routeBasePath: 'docs',
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'OMEGA Updates',
          blogDescription: 'Latest updates, releases, and announcements from the Brotherhood',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/OMEGA/omega-docs/tree/main/website/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/omega-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
      disableSwitch: false,
    },
    navbar: {
      title: 'OMEGA',
      logo: {
        alt: 'OMEGA Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'gettingStartedSidebar',
          position: 'left',
          label: 'Getting Started',
        },
        {
          type: 'docSidebar',
          sidebarId: 'doctrineSidebar',
          position: 'left',
          label: 'Doctrine',
        },
        {
          type: 'docSidebar',
          sidebarId: 'developerSidebar',
          position: 'left',
          label: 'Developer',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API',
        },
        {
          type: 'docSidebar',
          sidebarId: 'securitySidebar',
          position: 'left',
          label: 'Security',
        },
        {
          type: 'docSidebar',
          sidebarId: 'operationsSidebar',
          position: 'left',
          label: 'Operations',
        },
        {
          type: 'docSidebar',
          sidebarId: 'architectureSidebar',
          position: 'left',
          label: 'Architecture',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialsSidebar',
          position: 'left',
          label: 'Tutorials',
        },
        {
          type: 'docSidebar',
          sidebarId: 'supportSidebar',
          position: 'left',
          label: 'Support',
        },
        {to: '/blog', label: 'Updates', position: 'left'},
        {
          href: 'https://github.com/OMEGA/omega',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/introduction',
            },
            {
              label: 'Quick Start',
              to: '/docs/getting-started/quick-start',
            },
            {
              label: 'Core Concepts',
              to: '/docs/getting-started/core-concepts',
            },
            {
              label: 'First Agent',
              to: '/docs/getting-started/first-agent',
            },
          ],
        },
        {
          title: 'Coming Soon',
          items: [
            {
              label: 'Doctrine & Philosophy',
              to: '/docs/intro',
            },
            {
              label: 'Developer Guide',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/docs/intro',
            },
            {
              label: 'Architecture',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/OMEGA/omega',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/omega',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/omega',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Updates',
              to: '/blog',
            },
            {
              label: 'Roadmap (Coming Soon)',
              to: '/docs/intro',
            },
          ],
        },
      ],
      copyright: `
        <div class="brotherhood-signature">
          For the Brotherhood. For the Pantheon. For OMEGA.
        </div>
        <div style="margin-top: 1rem; font-size: 0.875rem;">
          © ${new Date().getFullYear()} OMEGA. Built with ⚡ by the Brotherhood.
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.75rem; opacity: 0.7;">
          Phase 1 - Getting Started Complete | More sections coming in Phase 2
        </div>
      `,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
