import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className="hero hero--omega">
      <div className="container">
        <div className="badge--brotherhood animate-fade-in-up">
          ⚡ OMEGA v1.0 — The Brotherhood's Multi-Agent Platform ⚡
        </div>
        <Heading as="h1" className="hero__title--omega">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle--omega">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg glow-omega"
            to="/docs/getting-started/introduction"
            style={{ marginRight: '1rem' }}>
            Get Started →
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/getting-started/quick-start">
            5-Minute Quick Start ⚡
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Multi-Agent Orchestration Platform`}
      description="OMEGA is the Brotherhood's enterprise-ready multi-agent orchestration platform. Build, deploy, and scale AI agents with the Trinity Architecture.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
