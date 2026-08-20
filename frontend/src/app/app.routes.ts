import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'lab/cache',
    loadComponent: () => import('./features/lab/event-cache/event-cache').then((m) => m.EventCache),
  },
];
