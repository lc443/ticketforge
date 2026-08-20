// src/app/features/labs/lab-index/lab-index.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type Status = 'done' | 'partial' | 'gap';

interface LabEntry {
  sprint: string;
  title: string;
  blurb: string;
  path: string;
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
  };

  labs: LabEntry[] = [
    {
      sprint: 'Sprint 0',
      title: 'Requirements & Architecture',
      blurb: 'Why the requirements doc and ADR-001 come before any code.',
      path: '/labs/requirements',
      status: 'partial',
    },
    {
      sprint: 'Sprint 1',
      title: 'Modular Monolith',
      blurb: 'Same request, traced as a monolith vs. microservices.',
      path: '/labs/monolith',
      status: 'done',
    },
    {
      sprint: 'Sprint 2',
      title: 'Authentication & Authorization',
      blurb: 'Log in, inspect a JWT, then try to tamper it.',
      path: '/labs/auth',
      status: 'done',
    },
    {
      sprint: 'Sprint 3',
      title: 'Load Testing',
      blurb: 'Simulated — never actually run against TicketForge yet.',
      path: '/labs/load-testing',
      status: 'gap',
    },
    {
      sprint: 'Sprint 4',
      title: 'Horizontal Scaling',
      blurb: 'Kill an API instance mid-traffic. Watch NGINX route around it.',
      path: '/labs/scaling',
      status: 'done',
    },
    {
      sprint: 'Sprint 5',
      title: 'Redis Cache',
      blurb: 'Load the same event 3x — watch requests 2 and 3 skip the database.',
      path: '/lab/cache',
      status: 'done',
    },
    {
      sprint: 'Sprint 6',
      title: 'Rate Limiting',
      blurb: 'Drain a 5-token bucket and watch it refill.',
      path: '/labs/ratelimit',
      status: 'done',
    },
    {
      sprint: 'Sprint 7',
      title: 'Concurrency & Overselling',
      blurb: 'One ticket, two buyers, one instant. Toggle the lock.',
      path: '/labs/concurrency',
      status: 'done',
    },
    {
      sprint: 'Sprint 8',
      title: 'Distributed Locking',
      blurb: 'A local lock only knows about its own process. Two instances prove it.',
      path: '/labs/distributed-lock',
      status: 'gap',
    },
    {
      sprint: 'Sprint 9–14',
      title: 'Kafka',
      blurb: 'Producer → topic → partition → consumer → retry → DLQ, step by step.',
      path: '/lab/kafka',
      status: 'done',
    },
  ];
}
