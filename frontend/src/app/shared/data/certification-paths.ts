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
    summary: 'Learn why companies use cloud services and how elasticity, resilience, migration, and cloud economics change architecture decisions.',
    evidence: 'Explain how moving TicketForge to AWS would change capacity planning, failure handling, and cost.',
  },
  {
    id: 'security-compliance',
    name: 'Security & Compliance',
    weight: 30,
    summary: 'Learn who is responsible for each security control and how AWS handles identity, governance, and compliance.',
    evidence: 'Secure your AWS learning account and explain which TicketForge security tasks belong to AWS and which belong to your team.',
  },
  {
    id: 'technology-services',
    name: 'Cloud Technology & Services',
    weight: 34,
    summary: 'Learn the main AWS services for compute, networking, storage, databases, operations, analytics, and AI.',
    evidence: 'Choose AWS services for a TicketForge requirement and explain why the other options do not fit as well.',
  },
  {
    id: 'billing-support',
    name: 'Billing, Pricing & Support',
    weight: 12,
    summary: 'Learn how AWS charges for services and which tools help you estimate, monitor, organize, and reduce cost.',
    evidence: 'Estimate a small TicketForge design, configure cost alerts, and explain the difference between an estimate and actual spending.',
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
    purpose: 'Learn the AWS services, security responsibilities, and pricing concepts you need before designing a full TicketForge cloud architecture.',
    prerequisite: 'No AWS production experience required; use a dedicated learning account.',
    nextAction: 'Complete Lab Zero before creating AWS resources.',
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
