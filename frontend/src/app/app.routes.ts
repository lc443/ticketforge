import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),

    children: [
      {
        path: '',
        redirectTo: 'labs',
        pathMatch: 'full',
      },

      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },

      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },

      {
        path: 'events',
        loadComponent: () =>
          import('./features/events/event-list/event-list').then((m) => m.EventList),
        canActivate: [authGuard],
      },

      // Registered before 'events/:id' — route matching is order-sensitive,
      // and a param route would otherwise swallow '/events/new' with
      // id='new'.
      {
        path: 'events/new',
        loadComponent: () =>
          import('./features/events/event-create/event-create').then((m) => m.EventCreate),
        canActivate: [authGuard],
      },

      {
        path: 'events/:id/edit',
        loadComponent: () =>
          import('./features/events/event-edit/event-edit').then((m) => m.EventEdit),
        canActivate: [authGuard],
      },

      {
        path: 'events/:id',
        loadComponent: () =>
          import('./features/events/event-detail/event-detail').then((m) => m.EventDetail),
        canActivate: [authGuard],
      },

      {
        path: 'reservations',
        loadComponent: () =>
          import('./features/reservations/reservations-info/reservations-info').then(
            (m) => m.ReservationsInfo,
          ),
        canActivate: [authGuard],
      },

      {
        path: 'labs',
        loadComponent: () => import('./features/labs/lab-index/lab-index').then((m) => m.LabIndex),
      },

      {
        path: 'labs/requirements',
        loadComponent: () =>
          import('./features/labs/requirements-lab/requirements-lab').then(
            (m) => m.RequirementsLab,
          ),
      },

      {
        path: 'labs/monolith',
        loadComponent: () =>
          import('./features/labs/monolith-lab/monolith-lab').then((m) => m.MonolithLab),
      },

      {
        path: 'labs/auth',
        loadComponent: () => import('./features/labs/auth-lab/auth-lab').then((m) => m.AuthLab),
      },

      {
        path: 'labs/load-testing',
        loadComponent: () =>
          import('./features/labs/load-testing-lab/load-testing-lab').then((m) => m.LoadTestingLab),
      },

      {
        path: 'labs/scaling',
        loadComponent: () =>
          import('./features/labs/scaling-lab/scaling-lab').then((m) => m.ScalingLab),
      },

      {
        path: 'labs/ratelimit',
        loadComponent: () =>
          import('./features/labs/ratelimit-lab/ratelimit-lab').then((m) => m.RatelimitLab),
      },

      {
        path: 'labs/concurrency',
        loadComponent: () =>
          import('./features/labs/concurrency-lab/concurrency-lab').then((m) => m.ConcurrencyLab),
      },

      {
        path: 'labs/distributed-lock',
        loadComponent: () =>
          import('./features/labs/distributed-lock-lab/distributed-lock-lab').then(
            (m) => m.DistributedLockLab,
          ),
      },

      {
        path: 'lab/kafka',
        loadComponent: () => import('./features/kafka-lab/kafka-lab').then((m) => m.KafkaLab),
      },

      {
        path: 'labs/docker',
        loadComponent: () =>
          import('./features/labs/docker-lab/docker-lab').then((m) => m.DockerLab),
      },

      {
        path: 'labs/event-lifecycle',
        loadComponent: () =>
          import('./features/labs/event-lifecycle-lab/event-lifecycle-lab').then(
            (m) => m.EventLifecycleLab,
          ),
      },

      {
        path: 'labs/cicd',
        loadComponent: () =>
          import('./features/labs/cicd-lab/cicd-lab').then((m) => m.CicdLab),
      },

      {
        path: 'lab/cache',
        loadComponent: () =>
          import('./features/lab/event-cache/event-cache').then((m) => m.EventCache),
      },

      {
        path: 'roadmap',
        loadComponent: () => import('./features/roadmap/roadmap').then((m) => m.Roadmap),
      },
    ],
  },
];
