import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../shared/models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
})
export class EventList implements OnInit {
  events = signal<Event[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.list().subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load events. Is the backend running?');
      },
    });
  }
}
