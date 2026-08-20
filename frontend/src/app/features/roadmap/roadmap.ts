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
          note: 'Skipped — load-tests/ is empty, no review exists',
          status: 'gap',
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
          note: 'Open question never answered; still just single-instance Postgres locking',
          status: 'gap',
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
          note: 'Covered conceptually in the review; not yet confirmed wired into the workers\' code',
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
      name: 'Level 4 · Containers & CI/CD',
      sprints: [
        {
          num: '15',
          name: 'Docker',
          note: 'docker-compose.yml and Dockerfile.api exist; not reviewed as its own sprint',
          status: 'next',
        },
        {
          num: '16',
          name: 'CI/CD',
          note: '.github/workflows/ is empty',
          status: 'todo',
        },
      ],
    },
    {
      name: 'Level 5 · Kubernetes',
      sprints: [
        {
          num: '17',
          name: 'Kubernetes Fundamentals',
          note: 'infrastructure/kubernetes/ has no manifests yet',
          status: 'todo',
        },
        {
          num: '18',
          name: 'Production Kubernetes',
          note: 'Probes, ConfigMap, Secret, rollout/rollback',
          status: 'todo',
        },
        {
          num: '19',
          name: 'Kubernetes Networking',
          note: 'ClusterIP, DNS, Ingress',
          status: 'todo',
        },
        {
          num: '20',
          name: 'Autoscaling',
          note: 'HPA, metrics server',
          status: 'todo',
        },
        {
          num: '21',
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
          num: '22',
          name: 'Terraform Fundamentals',
          note: 'infrastructure/terraform/ is empty',
          status: 'todo',
        },
        {
          num: '23',
          name: 'Terraform State',
          note: 'Remote state, locking, drift',
          status: 'todo',
        },
        {
          num: '24',
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
          num: '25',
          name: 'AWS Networking',
          note: 'VPC, subnets, NAT, security groups',
          status: 'todo',
        },
        {
          num: '26',
          name: 'AWS Compute',
          note: 'EC2 / ECS / Fargate / EKS / Lambda — open question on EKS still unanswered',
          status: 'todo',
        },
        {
          num: '27',
          name: 'Managed Data',
          note: 'RDS, ElastiCache, MSK',
          status: 'todo',
        },
        {
          num: '28',
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
          num: '29',
          name: 'Observability',
          note: 'platform/prometheus, grafana, otel dirs are all empty',
          status: 'todo',
        },
        {
          num: '30',
          name: 'Reliability Engineering',
          note: 'SLI/SLO/SLA, error budgets',
          status: 'todo',
        },
        {
          num: '31',
          name: 'Disaster Recovery',
          note: 'disaster-recovery-plan.md exists but is empty',
          status: 'todo',
        },
      ],
    },
    {
      name: 'Level 9 · Solutions Architect Mode',
      sprints: [
        {
          num: '32+',
          name: 'Architecture Reviews & Design Exercises',
          note: 'The 2M-customer / $15k-budget brief from the README, and further ones like it',
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
