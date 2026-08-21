// src/app/shared/data/lab-nav.ts
//
// Sprint order for the labs, shared by the lab index and the breadcrumb.
// Keep this in sync with LabIndex.labs — sprint, title, and path only
// (LabIndex carries the extra blurb/status fields for its cards).

export interface LabNavEntry {
  sprint: string;
  title: string;
  path: string;
}

export const LAB_NAV: LabNavEntry[] = [
  { sprint: 'Sprint 0', title: 'Requirements & Architecture', path: '/labs/requirements' },
  { sprint: 'Sprint 1', title: 'Modular Monolith', path: '/labs/monolith' },
  { sprint: 'Sprint 2', title: 'Authentication & Authorization', path: '/labs/auth' },
  { sprint: 'Sprint 3', title: 'Load Testing', path: '/labs/load-testing' },
  { sprint: 'Sprint 4', title: 'Horizontal Scaling', path: '/labs/scaling' },
  { sprint: 'Sprint 5', title: 'Redis Cache', path: '/lab/cache' },
  { sprint: 'Sprint 6', title: 'Rate Limiting', path: '/labs/ratelimit' },
  { sprint: 'Sprint 7', title: 'Concurrency & Overselling', path: '/labs/concurrency' },
  { sprint: 'Sprint 8', title: 'Distributed Locking', path: '/labs/distributed-lock' },
  { sprint: 'Sprint 9–14', title: 'Kafka', path: '/lab/kafka' },
  { sprint: 'Sprint 15', title: 'Docker', path: '/labs/docker' },
  { sprint: 'Sprint 16', title: 'Event Lifecycle & API Evolution', path: '/labs/event-lifecycle' },
  { sprint: 'Sprint 17', title: 'CI/CD & Software Supply Chain', path: '/labs/cicd' },
  { sprint: 'Sprint 18', title: 'Kubernetes Foundations', path: '/labs/kubernetes-foundations' },
  { sprint: 'Sprint 19', title: 'Production Kubernetes', path: '/labs/production-kubernetes' },
  { sprint: 'Sprint 20', title: 'Kubernetes Networking', path: '/labs/kubernetes-networking' },
];
