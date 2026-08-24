export type CertificationStatus = 'current' | 'next' | 'planned';

export interface CertificationDomain {
  id: string;
  name: string;
  weight: number;
  summary: string;
  evidence: string;
}

export interface CertificationPath {
  id: string;
  provider: string;
  title: string;
  code: string;
  level: string;
  status: CertificationStatus;
  purpose: string;
  prerequisite: string;
  nextAction: string;
  route?: string;
  domains?: CertificationDomain[];
}

export const CLF_C02_DOMAINS: CertificationDomain[] = [
  {
    id: 'cloud-concepts',
    name: 'Cloud Concepts',
    weight: 24,
    summary: 'Cloud value, design principles, migration, elasticity, resilience, and economics.',
    evidence: 'Explain when cloud changes cost, capacity, and failure-domain decisions for TicketForge.',
  },
  {
    id: 'security-compliance',
    name: 'Security & Compliance',
    weight: 30,
    summary: 'Shared responsibility, identity, governance, compliance, and security services.',
    evidence: 'Secure a learning account, inspect identity, and defend least-privilege boundaries.',
  },
  {
    id: 'technology-services',
    name: 'Cloud Technology & Services',
    weight: 34,
    summary: 'Compute, networking, storage, databases, deployment, operations, analytics, and AI/ML.',
    evidence: 'Choose services from requirements and verify representative resources in AWS.',
  },
  {
    id: 'billing-support',
    name: 'Billing, Pricing & Support',
    weight: 12,
    summary: 'Pricing models, cost tools, account structures, support, and optimization resources.',
    evidence: 'Estimate a design, configure guardrails, and explain actual-versus-forecast cost tools.',
  },
];

export const CERTIFICATION_PATHS: CertificationPath[] = [
  {
    id: 'aws-clf-c02',
    provider: 'AWS',
    title: 'Certified Cloud Practitioner',
    code: 'CLF-C02',
    level: 'Foundational',
    status: 'current',
    purpose: 'Build cloud, security, service, and cost literacy before deeper architecture design.',
    prerequisite: 'No AWS production experience required; use a dedicated learning account.',
    nextAction: 'Complete Lab Zero and prove the account safety controls.',
    route: '/academy/aws/cloud-practitioner',
    domains: CLF_C02_DOMAINS,
  },
  {
    id: 'aws-saa-c03',
    provider: 'AWS',
    title: 'Solutions Architect – Associate',
    code: 'SAA-C03',
    level: 'Associate',
    status: 'next',
    purpose: 'Design secure, resilient, high-performing, and cost-optimized AWS architectures.',
    prerequisite: 'Cloud Practitioner knowledge plus hands-on AWS service experience.',
    nextAction: 'Unlock after the CLF-C02 readiness review.',
  },
  {
    id: 'terraform-associate', provider: 'HashiCorp', title: 'Terraform Associate', code: '004', level: 'Associate', status: 'planned',
    purpose: 'Validate infrastructure-as-code workflow, state, modules, and Terraform operations.', prerequisite: 'TicketForge Terraform Sprints 23–25.', nextAction: 'Planned after Terraform modules.',
  },
  {
    id: 'cka', provider: 'CNCF', title: 'Certified Kubernetes Administrator', code: 'CKA', level: 'Professional', status: 'planned',
    purpose: 'Validate practical Kubernetes administration, troubleshooting, and lifecycle operations.', prerequisite: 'TicketForge Kubernetes Sprints 18–22.', nextAction: 'Planned after timed cluster drills.',
  },
  {
    id: 'aws-security', provider: 'AWS', title: 'Security – Specialty', code: 'SCS-C03', level: 'Specialty', status: 'planned',
    purpose: 'Deepen workload security, detection, incident response, identity, and data protection.', prerequisite: 'Associate-level AWS architecture and security evidence.', nextAction: 'Planned after the TicketForge threat model.',
  },
  {
    id: 'aws-sap-c02', provider: 'AWS', title: 'Solutions Architect – Professional', code: 'SAP-C02', level: 'Professional', status: 'planned',
    purpose: 'Design complex, multi-account, hybrid, migration, and continuously improved systems.', prerequisite: 'Substantial AWS architecture practice after SAA-C03.', nextAction: 'Long-term architect milestone.',
  },
];
