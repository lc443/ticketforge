import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { apiErrorMessage } from '../../../core/http/api-error';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './event-create.html',
  styleUrl: './event-create.scss',
})
export class EventCreate {
  name = '';
  venue = '';
  // datetime-local gives "YYYY-MM-DDTHH:mm" with no timezone — exactly the
  // shape Jackson expects for a LocalDateTime field on the backend, so it's
  // sent through as-is with no conversion.
  eventDate = '';
  totalTickets = 100;

  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private eventService: EventService, private router: Router) {}

  submit() {
    this.error.set(null);
    this.loading.set(true);

    this.eventService
      .create({
        name: this.name,
        venue: this.venue,
        eventDate: this.eventDate,
        totalTickets: this.totalTickets,
        // Every ticket starts available — the entity has no default for
        // this, so the form fills it in rather than asking for two numbers
        // that always start equal.
        availableTickets: this.totalTickets,
      })
      .subscribe({
        next: (event) => {
          this.loading.set(false);
          this.router.navigate(['/events', event.id]);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(apiErrorMessage(error, 'Could not create event.'));
        },
      });
  }
}
