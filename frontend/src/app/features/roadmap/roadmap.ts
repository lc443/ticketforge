// src/app/features/roadmap/roadmap.ts
//
// Static roadmap data. Update this by hand as sprints move —
// just flip a sprint's `status` and, if you want, tighten its `note`.
//
// Statuses: 'done' | 'next' | 'partial' | 'todo' | 'gap'
//   done    — shipped and reviewed
//   next    — the sprint you're doing right now / about to start
//   partial — started, or covered conceptually, but not finished
//   todo    — not started yet
//   gap     — was skipped out of order and still needs to be circled back to

import { Component, computed, signal } from '@angular/core';

export type SprintStatus = 'done' | 'next' | 'partial' | 'todo' | 'gap';

export interface Sprint {
  num: string;
  name: string;
  note: string;
  status: SprintStatus;
}

export interface Level {
  name: string;
  sprints: Sprint[];
}

const STATUS_LABEL: Record<SprintStatus, string> = {
  done: 'Done',
  next: 'Next',
  partial: 'Partial',
  todo: 'Not started',
  gap: 'Gap',
};

@Component({
  selector: 'app-roadmap',
  standalone: true,
  templateUrl: './roadmap.html',
  styleUrl: './roadmap.scss',
})
export class Roadmap {
  statusLabel = STATUS_LABEL;

  levels = signal<Level[]>([
    {
      name: 'Level 1 · Build a Real Application',
      sprints: [
        {
          num: '0',
          name: 'Requirements & Initial Architecture',
          note: 'Requirements doc exists but thin; ADR-001 file created but empty; no system-context or container diagram yet',
          status: 'partial',
        },
        {
          num: '1',
          name: 'Modular Monolith',
          note: 'auth, event, inventory, order, reservation modules all built',
          status: 'done',
        },
        {
          num: '2',
          name: 'Authentication & Security',
          note: 'JWT, roles, BCrypt — reviewed',
          status: 'done',
        },
      ],
    },
    {
      name: 'Level 2 · Performance & Scaling',
      sprints: [
        {
          num: '3',
          name: 'Load Testing',
          note: 'Real k6 smoke, browse, rate-limit, and last-ticket scenarios; baseline exposed the 10 req/min limiter as the first bottleneck',
          status: 'done',
        },
        {
          num: '4',
          name: 'Horizontal Scaling',
          note: 'NGINX round-robin, reviewed',
          status: 'done',
        },
        {
          num: '5',
          name: 'Redis Cache',
          note: 'Cache-aside, CacheConfig, reviewed',
          status: 'done',
        },
        {
          num: '6',
          name: 'Rate Limiting',
          note: 'RateLimitFilter + Redis INCR, reviewed',
          status: 'done',
        },
      ],
    },
    {
      name: 'Level 3 · Distributed Systems',
      sprints: [
        {
          num: '7',
          name: 'Concurrency & Overselling',
          note: 'Built early, out of order — pessimistic locking, reviewed',
          status: 'done',
        },
        {
          num: '8',
          name: 'Distributed Locking',
          note: 'PostgreSQL row lock selected over JVM-local and redundant Redis locks; real two-request race verified one winner and one 409',
          status: 'done',
        },
        {
          num: '9',
          name: 'Our First Kafka Problem',
          note: 'Covered in the Sprint 6 review',
          status: 'done',
        },
        {
          num: '10',
          name: 'Kafka Fundamentals',
          note: 'Producer, topic, partitions — ReservationProducer, KafkaConfig',
          status: 'done',
        },
        {
          num: '11',
          name: 'Consumer Scaling',
          note: 'Consumer groups covered; EmailWorker, AnalyticsWorker built',
          status: 'done',
        },
        {
          num: '12',
          name: 'Retries and DLQ',
          note: "Covered conceptually in the review; not yet confirmed wired into the workers' code",
          status: 'partial',
        },
        {
          num: '13',
          name: 'Idempotency',
          note: 'ProcessedEvent unique-constraint dedup wired into EmailWorker + AnalyticsWorker, reviewed',
          status: 'done',
        },
        {
          num: '14',
          name: 'Transactional Outbox',
          note: 'OutboxEvent written in the same transaction as the reservation; OutboxPublisher polls and sends, reviewed',
          status: 'done',
        },
      ],
    },
    {
      name: 'Level 4 · Product Lifecycle, Containers & Delivery',
      sprints: [
        {
          num: '15',
          name: 'Docker',
          note: 'Multi-stage API/frontend images, shared replica artifact, health-gated Compose, failover, and persistent PostgreSQL verified',
          status: 'done',
        },
        {
          num: '16',
          name: 'Event Lifecycle & API Evolution',
          note: 'Organizer ownership, guarded edit/delete, cancellation, audit history, inventory invariants, stale-write detection, DTO contract, and replica-safe cache evolution verified',
          status: 'done',
        },
        {
          num: '17',
          name: 'CI/CD',
          note: 'Java/Node gates, isolated dependencies, three scanned images, exact-artifact GHCR publication, provenance attestations, digest promotion, and rollback verified on main',
          status: 'done',
        },
      ],
    },
    {
      name: 'Level 5 · Kubernetes',
      sprints: [
        {
          num: '18',
          name: 'Kubernetes Fundamentals',
          note: 'kind cluster, namespaces, Kustomize, configuration boundaries, three-replica API Deployment, Service discovery, security context, probes, and self-healing verified',
          status: 'done',
        },
        {
          num: '19',
          name: 'Production Kubernetes',
          note: 'Persistent storage, application probe groups, graceful shutdown, disruption policy, environment overlays, configuration rollout, and rollback',
          status: 'todo',
        },
        {
          num: '20',
          name: 'Kubernetes Networking',
          note: 'ClusterIP, DNS, Ingress',
          status: 'todo',
        },
        {
          num: '21',
          name: 'Autoscaling',
          note: 'HPA, metrics server',
          status: 'todo',
        },
        {
          num: '22',
          name: 'Helm',
          note: 'infrastructure/helm/ is empty',
          status: 'todo',
        },
      ],
    },
    {
      name: 'Level 6 · Infrastructure as Code',
      sprints: [
        {
          num: '23',
          name: 'Terraform Fundamentals',
          note: 'infrastructure/terraform/ is empty',
          status: 'todo',
        },
        {
          num: '24',
          name: 'Terraform State',
          note: 'Remote state, locking, drift',
          status: 'todo',
        },
        {
          num: '25',
          name: 'Terraform Modules',
          note: 'network, eks, database, redis, monitoring',
          status: 'todo',
        },
      ],
    },
    {
      name: 'Level 7 · AWS Solutions Architecture',
      sprints: [
        {
          num: '26',
          name: 'AWS Networking',
          note: 'VPC, subnets, NAT, security groups',
          status: 'todo',
        },
        {
          num: '27',
          name: 'AWS Compute',
          note: 'EC2 / ECS / Fargate / EKS / Lambda — open question on EKS still unanswered',
          status: 'todo',
        },
        {
          num: '28',
          name: 'Managed Data',
          note: 'RDS, ElastiCache, MSK',
          status: 'todo',
        },
        {
          num: '29',
          name: 'AWS Security',
          note: 'IAM, KMS, Secrets Manager, WAF',
          status: 'todo',
        },
      ],
    },
    {
      name: 'Level 8 · Reliability',
      sprints: [
        {
          num: '30',
          name: 'Observability',
          note: 'platform/prometheus, grafana, otel dirs are all empty',
          status: 'todo',
        },
        {
          num: '31',
          name: 'Reliability Engineering',
          note: 'SLI/SLO/SLA, error budgets',
          status: 'todo',
        },
        {
          num: '32',
          name: 'Disaster Recovery',
          note: 'disaster-recovery-plan.md exists but is empty',
          status: 'todo',
        },
      ],
    },
    {
      name: 'Level 9 · Architecture Leadership',
      sprints: [
        {
          num: '33',
          name: 'AWS Well-Architected Review',
          note: 'Assess operational excellence, security, reliability, performance, cost, and sustainability; produce risks and remediation priorities',
          status: 'todo',
        },
        {
          num: '34',
          name: 'Threat Modeling & Compliance',
          note: 'Trust boundaries, STRIDE, data classification, OWASP, PCI concepts, evidence, and compensating controls',
          status: 'todo',
        },
        {
          num: '35',
          name: 'Cost Architecture & FinOps',
          note: 'Cost model, unit economics, tagging, budgets, right-sizing, commitments, and cost/performance tradeoffs',
          status: 'todo',
        },
        {
          num: '36',
          name: 'Data & Integration Architecture',
          note: 'System of record, API contracts/versioning, schema evolution, CDC, retention, governance, and build-vs-buy decisions',
          status: 'todo',
        },
        {
          num: '37',
          name: 'Multi-Region & Global Architecture',
          note: 'Latency, DNS routing, active-active vs active-passive, data consistency, failover, and blast-radius containment',
          status: 'todo',
        },
        {
          num: '38',
          name: 'Migration & Modernization Strategy',
          note: 'Current-state assessment, 7 Rs, strangler pattern, dependency waves, cutover, rollback, and organizational risk',
          status: 'todo',
        },
        {
          num: '39',
          name: 'Architecture Governance & Communication',
          note: 'C4 views, ADR portfolio, standards, exception process, architecture review board, executive narrative, and delivery roadmap',
          status: 'todo',
        },
      ],
    },
    {
      name: 'Level 10 · Solutions Architect Mode',
      sprints: [
        {
          num: '40',
          name: 'Architecture Reviews & Design Exercises',
          note: 'Customer discovery, constraints, proposals, tradeoff defense, implementation roadmaps, and review-board challenges',
          status: 'todo',
        },
      ],
    },
    {
      name: 'Level 11 · TicketForge Academy & Blueprint OS',
      sprints: [
        {
          num: '41',
          name: 'Academy Foundations',
          note: 'Tracks, modules, lessons, prerequisites, learner profiles, progress, and an honest credential policy',
          status: 'todo',
        },
        {
          num: '42',
          name: 'Competency & Evidence Graph',
          note: 'Map labs, tests, ADRs, reviews, failure drills, and portfolio artifacts to measurable engineering competencies',
          status: 'todo',
        },
        {
          num: '43',
          name: 'Assessments & Practical Exams',
          note: 'Question banks, scenarios, hands-on rubrics, attempts, scoring, feedback, and mastery thresholds',
          status: 'todo',
        },
        {
          num: '44',
          name: 'Verifiable Academy Credentials',
          note: 'Credential IDs, evidence manifests, certificate generation, QR verification, renewal, revocation, and public validation',
          status: 'todo',
        },
        {
          num: '45',
          name: 'Blueprint OS Integration',
          note: 'Identity, learner transcript, evidence and credential APIs, consent, synchronization, and public profile linking',
          status: 'todo',
        },
        {
          num: '46',
          name: 'External Certification Preparation',
          note: 'Official exam objective mapping, study plans, readiness assessments, renewal tracking, and AWS Solutions Architect Associate first',
          status: 'todo',
        },
      ],
    },
  ]);

  totalSprints = computed(() =>
    this.levels().reduce((sum, level) => sum + level.sprints.length, 0),
  );

  doneSprints = computed(() =>
    this.levels().reduce(
      (sum, level) =>
        sum +
        level.sprints.filter((s) => s.status === 'done').length +
        level.sprints.filter((s) => s.status === 'partial').length * 0.5,
      0,
    ),
  );

  levelsTouched = computed(
    () => this.levels().filter((level) => level.sprints.some((s) => s.status !== 'todo')).length,
  );

  gapCount = computed(() =>
    this.levels().reduce(
      (sum, level) => sum + level.sprints.filter((s) => s.status === 'gap').length,
      0,
    ),
  );

  nextSprint = computed(() => {
    for (const level of this.levels()) {
      const found = level.sprints.find((s) => s.status === 'next');
      if (found) return found;
    }
    return null;
  });

  levelFraction(level: Level): string {
    const done = level.sprints.filter((s) => s.status === 'done').length;
    const partial = level.sprints.filter((s) => s.status === 'partial').length * 0.5;
    const total = level.sprints.length;
    const n = done + partial;
    return `${Number.isInteger(n) ? n : n.toFixed(1)} / ${total}`;
  }
}
