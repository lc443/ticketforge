import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { Event } from '../../../shared/models/event.model';
import { ReservationResponse } from '../../../shared/models/reservation.model';
import { apiErrorMessage } from '../../../core/http/api-error';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
})
export class EventDetail implements OnInit {
  event = signal<Event | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  quantity = 1;
  reserving = signal(false);
  reserveError = signal<string | null>(null);
  confirmation = signal<ReservationResponse | null>(null);
  deleting = signal(false);
  deleteError = signal<string | null>(null);

  // The route param is always a string — Angular's router doesn't know or
  // care what type an ID is, it's just a URL segment. We convert once here
  // rather than at every call site.
  private eventId!: number;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private reservationService: ReservationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getById(this.eventId).subscribe({
      next: (event) => {
        this.event.set(event);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(error, 'Could not load the event.'));
      },
    });
  }

  reserve() {
    this.reserveError.set(null);
    this.reserving.set(true);

    this.reservationService.create(this.eventId, { quantity: this.quantity }).subscribe({
      next: (res) => {
        this.reserving.set(false);
        this.confirmation.set(res);
        // Reflect the drop in available tickets locally — the backend
        // decremented it, but there's no way to re-fetch a single source
        // of truth for it without another round trip.
        const current = this.event();
        if (current) {
          this.event.set({
            ...current,
            availableTickets: current.availableTickets - res.quantity,
          });
        }
      },
      error: (err) => {
        this.reserving.set(false);
        this.reserveError.set(apiErrorMessage(err, 'Reservation failed. Try again.'));
      },
    });
  }

  deleteEvent() {
    const event = this.event();
    if (!event || !window.confirm(`Delete "${event.name}"? This cannot be undone.`)) {
      return;
    }

    this.deleteError.set(null);
    this.deleting.set(true);
    this.eventService.delete(this.eventId).subscribe({
      next: () => this.router.navigate(['/events']),
      error: (error) => {
        this.deleting.set(false);
        this.deleteError.set(apiErrorMessage(error, 'Could not delete the event.'));
      },
    });
  }
}
