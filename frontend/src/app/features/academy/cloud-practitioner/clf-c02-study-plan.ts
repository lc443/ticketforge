export interface StudyDay {
  day: number;
  week: number;
  title: string;
  focus: string;
  domain: string;
  route?: string;
  evidence: string;
}

export const CLF_C02_STUDY_PLAN: StudyDay[] = [
  { day: 1, week: 1, title: 'Cloud foundations & global infrastructure', focus: 'Cloud value, Regions, AZs, edge locations, elasticity, resilience, and shared responsibility.', domain: 'Cloud Concepts', route: '/academy/aws/cloud-practitioner/cloud-foundations', evidence: 'Explain Region versus AZ and map a resilient TicketForge deployment.' },
  { day: 2, week: 1, title: 'Identity & account security', focus: 'Root user, IAM Identity Center, users, groups, roles, policies, MFA, and temporary credentials.', domain: 'Security & Compliance', route: '/academy/aws/cloud-practitioner/lab-zero', evidence: 'Prove caller identity and account guardrails without exposing credentials.' },
  { day: 3, week: 1, title: 'EC2 & compute economics', focus: 'Instances, AMIs, EBS, security groups, user data, Auto Scaling, ELB, and purchasing models.', domain: 'Technology & Services', evidence: 'Choose a compute and pricing model from a TicketForge demand scenario.' },
  { day: 4, week: 1, title: 'Containers & serverless', focus: 'Lambda, ECS, Fargate, EKS, execution boundaries, and operational ownership.', domain: 'Technology & Services', evidence: 'Defend EC2 versus ECS versus EKS versus Lambda.' },
  { day: 5, week: 1, title: 'Storage choices', focus: 'S3, EBS, EFS, versioning, encryption, lifecycle, and storage classes.', domain: 'Technology & Services', evidence: 'Build and remove a versioned S3 bucket; choose object, block, or file storage.' },
  { day: 6, week: 1, title: 'Domain review', focus: 'Review foundations, IAM, compute, containers, and storage with 30–50 questions.', domain: 'Mixed', evidence: 'Record every missed question by misconception category.' },
  { day: 7, week: 1, title: 'Weak-area recovery', focus: 'Rest or review only the concepts identified by evidence.', domain: 'Remediation', evidence: 'Explain one previously missed concept without notes.' },
  { day: 8, week: 2, title: 'AWS networking', focus: 'VPC, subnets, route tables, internet and NAT gateways, security groups, NACLs, and load balancers.', domain: 'Technology & Services', evidence: 'Trace a request from internet edge to a private TicketForge workload.' },
  { day: 9, week: 2, title: 'Database choices', focus: 'RDS, Aurora, DynamoDB, ElastiCache, Redshift, Multi-AZ, and read replicas.', domain: 'Technology & Services', evidence: 'Separate availability, read scaling, cache, NoSQL, and analytics requirements.' },
  { day: 10, week: 2, title: 'Application integration', focus: 'SQS, SNS, EventBridge, Step Functions, decoupling, and event-driven flows.', domain: 'Technology & Services', evidence: 'Choose queue, pub/sub, or event routing for three TicketForge scenarios.' },
  { day: 11, week: 2, title: 'DNS & content delivery', focus: 'Route 53, CloudFront, Global Accelerator, edge locations, and caching.', domain: 'Technology & Services', evidence: 'Trace DNS resolution and cached content delivery.' },
  { day: 12, week: 2, title: 'Monitoring & governance', focus: 'CloudWatch, CloudTrail, Config, Trusted Advisor, Organizations, Control Tower, and Systems Manager.', domain: 'Security & Compliance', evidence: 'Differentiate telemetry, API audit history, and configuration compliance.' },
  { day: 13, week: 2, title: 'Architecture review', focus: 'Identify AWS services from requirements and complete 40–60 questions.', domain: 'Mixed', evidence: 'Defend every selected service and reject at least one alternative.' },
  { day: 14, week: 2, title: 'Weak-area recovery', focus: 'Review only evidence-backed gaps.', domain: 'Remediation', evidence: 'Retake missed concepts with new scenarios.' },
  { day: 15, week: 3, title: 'Security services', focus: 'KMS, Secrets Manager, GuardDuty, Inspector, Macie, Shield, WAF, Security Hub, and Artifact.', domain: 'Security & Compliance', evidence: 'Map prevention, protection, detection, response, and compliance services.' },
  { day: 16, week: 3, title: 'Pricing models', focus: 'Pay-as-you-go, On-Demand, Spot, reservations, Savings Plans, transfer, and Free Tier.', domain: 'Billing & Support', evidence: 'Choose pricing from interruption tolerance and commitment evidence.' },
  { day: 17, week: 3, title: 'Billing & cost management', focus: 'Budgets, Cost Explorer, Pricing Calculator, allocation tags, consolidated billing, and Organizations.', domain: 'Billing & Support', evidence: 'Differentiate alerting, historical analysis, and future estimation.' },
  { day: 18, week: 3, title: 'Well-Architected Framework', focus: 'Operational excellence, security, reliability, performance, cost, and sustainability.', domain: 'Cloud Concepts', evidence: 'Review TicketForge against all six pillars and name one improvement.' },
  { day: 19, week: 3, title: 'Timed practice exam', focus: 'Complete one uninterrupted exam and classify every miss.', domain: 'Assessment', evidence: 'Record score and misconception categories before reading explanations.' },
  { day: 20, week: 3, title: 'Targeted remediation', focus: 'Study only weak domains and confused service pairs.', domain: 'Remediation', evidence: 'Reach at least 80% on a fresh quality assessment.' },
  { day: 21, week: 3, title: 'Readiness review', focus: 'Review the definition of done and make a go/no-go exam decision.', domain: 'Assessment', evidence: 'Defend readiness with domain, lab, cleanup, and practice evidence.' },
];
