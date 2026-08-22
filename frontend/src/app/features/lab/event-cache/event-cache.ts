import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';
import { JsonPipe } from '@angular/common';
import { EventLabService } from '../../../core/services/event-lab.service';
import { TechnologyBrief } from '../../../shared/components/technology-brief/technology-brief';

@Component({
  selector: 'app-event-cache',
  standalone: true,
  imports: [FormsModule, LabBreadcrumb, TechnologyBrief],
  templateUrl: './event-cache.html',
  styleUrl: './event-cache.scss',
})
export class EventCache {
  private readonly eventLabService = inject(EventLabService);

  token = '';
  eventId = '';

  requestCount = signal(0);
  responseTime = signal(0);
  event = signal<any>(null);
  error = signal('');

  loadEvent() {
    this.error.set('');

    const startedAt = performance.now();

    this.eventLabService.loadEvent(this.eventId, this.token).subscribe({
      next: (response) => {
        this.requestCount.update((count) => count + 1);
        this.responseTime.set(Math.round(performance.now() - startedAt));
        this.event.set(response);
      },
      error: (error) => {
        this.responseTime.set(Math.round(performance.now() - startedAt));
        this.error.set(`Request failed: ${error.status} ${error.statusText}`);
      },
    });
  }
}
