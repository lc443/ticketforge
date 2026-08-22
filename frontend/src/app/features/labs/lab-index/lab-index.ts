// src/app/features/labs/lab-index/lab-index.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type Status = 'done' | 'partial' | 'gap' | 'next' | 'planned';

interface LabEntry {
  sprint: string;
  title: string;
  blurb: string;
  path?: string;
  status: Status;
}

@Component({
  selector: 'app-lab-index',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lab-index.html',
  styleUrl: './lab-index.scss',
})
export class LabIndex {
  statusLabel: Record<Status, string> = {
    done: 'Built',
    partial: 'Partial',
    gap: 'Gap',
    next: 'Current',
    planned: 'Planned',
  };

  builtLabs: LabEntry[] = [
    {
      sprint: 'Sprint 0',
      title: 'Requirements & Architecture',
      blurb: 'Turn product goals into requirements, quality attributes, risks, and ADRs.',
      path: '/labs/requirements',
      status: 'partial',
    },
    {
      sprint: 'Sprint 1',
      title: 'Modular Monolith',
      blurb: 'Define ownership and boundaries, then justify why a monolith fits the current constraints.',
      path: '/labs/monolith',
      status: 'done',
    },
    {
      sprint: 'Sprint 2',
      title: 'Authentication & Authorization',
      blurb: 'Trace trust boundaries from credentials to JWT validation and authorization decisions.',
      path: '/labs/auth',
      status: 'done',
    },
    {
      sprint: 'Sprint 3',
      title: 'Load Testing',
      blurb: 'Establish evidence with throughput, latency, saturation, and failure measurements.',
      path: '/labs/load-testing',
      status: 'done',
    },
    {
      sprint: 'Sprint 4',
      title: 'Horizontal Scaling',
      blurb: 'Expose the state and coordination problems created by multiple API instances.',
      path: '/labs/scaling',
      status: 'done',
    },
    {
      sprint: 'Sprint 5',
      title: 'Redis Cache',
      blurb: 'Balance latency against freshness, invalidation complexity, and consistency risk.',
      path: '/lab/cache',
      status: 'done',
    },
    {
      sprint: 'Sprint 6',
      title: 'Rate Limiting',
      blurb: 'Protect every replica with one shared policy and define overload behavior.',
      path: '/labs/ratelimit',
      status: 'done',
    },
    {
      sprint: 'Sprint 7',
      title: 'Concurrency & Overselling',
      blurb: 'Define and prove the business invariant that inventory cannot be oversold.',
      path: '/labs/concurrency',
      status: 'done',
    },
    {
      sprint: 'Sprint 8',
      title: 'Distributed Locking',
      blurb: 'Evaluate when cross-instance locking is justified and which failure modes it introduces.',
      path: '/labs/distributed-lock',
      status: 'done',
    },
    {
      sprint: 'Sprint 9–14',
      title: 'Kafka',
      blurb: 'Design delivery semantics, retries, DLQs, observability, and outbox reliability.',
      path: '/lab/kafka',
      status: 'done',
    },
    {
      sprint: 'Sprint 15',
      title: 'Docker',
      blurb: 'Create immutable artifacts and operate a stateful, observable multi-container topology.',
      path: '/labs/docker',
      status: 'done',
    },
    {
      sprint: 'Sprint 16',
      title: 'Event Lifecycle & API Evolution',
      blurb: 'Protect ownership, inventory, cancellation history, stale writes, and compatible API behavior.',
      path: '/labs/event-lifecycle',
      status: 'done',
    },
    {
      sprint: 'Sprint 17',
      title: 'Delivery Pipeline & Supply Chain',
      blurb: 'Automate correctness, security, immutable publication, provenance, promotion, and rollback evidence.',
      path: '/labs/cicd',
      status: 'done',
    },
    {
      sprint: 'Sprint 18',
      title: 'Kubernetes Foundations',
      blurb: 'Declare workloads, discover healthy replicas, constrain runtime access, and prove controller reconciliation.',
      path: '/labs/kubernetes-foundations',
      status: 'done',
    },
    {
      sprint: 'Sprint 19',
      title: 'Production Kubernetes',
      blurb: 'Protect state, separate probe semantics, drain safely, constrain disruption, promote overlays, and rehearse rollback.',
      path: '/labs/production-kubernetes',
      status: 'done',
    },
    {
      sprint: 'Sprint 20', title: 'Kubernetes Networking',
      blurb: 'Trace Service DNS, publish path-based Gateway routes, design TLS termination, and declare least-privilege traffic.',
      path: '/labs/kubernetes-networking', status: 'done',
    },
    {
      sprint: 'Sprint 21', title: 'Kubernetes Autoscaling',
      blurb: 'Connect resource requests to HPA math, prove bounded scale-out and scale-in, and diagnose node-capacity collapse.',
      path: '/labs/kubernetes-autoscaling', status: 'done',
    },
    {
      sprint: 'Sprint 22', title: 'Helm Release Packaging',
      blurb: 'Package application resources, validate environment contracts, and prove upgrade, test, and rollback behavior.',
      path: '/labs/helm-packaging', status: 'done',
    },
    {
      sprint: 'Sprint 23', title: 'Terraform Fundamentals',
      blurb: 'Declare typed infrastructure intent, review lifecycle plans, apply exact changes, prove idempotence, and tear down safely.',
      path: '/labs/terraform-fundamentals', status: 'done',
    },
  ];

  futureLabs: LabEntry[] = [
    {
      sprint: 'Sprints 24–25',
      title: 'Terraform State & Modules',
      blurb: 'Control remote state, locking, drift, import, reusable modules, environments, and infrastructure change governance.',
      status: 'planned',
    },
    {
      sprint: 'Sprints 26–29',
      title: 'AWS Solution Architecture',
      blurb: 'Make defensible compute, network, data, security, resiliency, and cost tradeoffs.',
      status: 'planned',
    },
    {
      sprint: 'Sprints 30–32',
      title: 'Reliability Engineering',
      blurb: 'Define telemetry, SLOs, failure budgets, recovery objectives, and disaster-recovery evidence.',
      status: 'planned',
    },
    {
      sprint: 'Sprints 33–39',
      title: 'Architecture Leadership',
      blurb: 'Practice reviews, threat modeling, FinOps, integration, global design, migration, and governance.',
      status: 'planned',
    },
    {
      sprint: 'Sprint 40',
      title: 'Solutions Architect Mode',
      blurb: 'Run customer-style discovery, produce proposals, defend tradeoffs, and review outcomes.',
      status: 'planned',
    },
    {
      sprint: 'Sprints 41–46',
      title: 'TicketForge Academy & Blueprint OS',
      blurb: 'Turn engineering evidence into learning paths, practical assessments, verifiable credentials, and external certification readiness.',
      status: 'planned',
    },
  ];

}
