import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🏛️ Trinity Architecture',
    icon: '🏛️',
    description: (
      <>
        Built on the sacred Trinity: <strong>Agents</strong> for orchestration,
        <strong> Tools</strong> for execution, and <strong> Routers</strong> for
        intelligent decision-making. Enterprise-grade architecture from the ground up.
      </>
    ),
  },
  {
    title: '⚡ Multi-Agent Orchestration',
    icon: '⚡',
    description: (
      <>
        Coordinate complex workflows with multiple AI agents. Built-in support for
        <strong> MCP</strong> (Model Context Protocol) and <strong>A2A</strong> (Agent-to-Agent)
        communication patterns.
      </>
    ),
  },
  {
    title: '🔒 Security First',
    icon: '🔒',
    description: (
      <>
        Fortress-grade security with encryption gateways, audit protocols, and compliance
        frameworks. Built according to the <strong>OMEGA Security Doctrine</strong>.
      </>
    ),
  },
  {
    title: '🚀 Deploy Anywhere',
    icon: '🚀',
    description: (
      <>
        Docker-ready, Kubernetes-native, cloud-agnostic. Deploy to AWS, Azure, GCP, or
        on-premises. Full infrastructure-as-code support with Terraform.
      </>
    ),
  },
  {
    title: '📡 Real-Time Communication',
    icon: '📡',
    description: (
      <>
        WebSocket-powered real-time updates, Server-Sent Events for streaming, and
        REST APIs for integration. Built with <strong>FastMCP</strong> federation.
      </>
    ),
  },
  {
    title: '🎯 Developer Experience',
    icon: '🎯',
    description: (
      <>
        TypeScript-first SDK, comprehensive CLI tools, hot-reload development mode,
        and extensive documentation. Get your first agent running in <strong>under 5 minutes</strong>.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="feature-card">
        <div className="feature-card__icon">{icon}</div>
        <Heading as="h3" className="feature-card__title">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
