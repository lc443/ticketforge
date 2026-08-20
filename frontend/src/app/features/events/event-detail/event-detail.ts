import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { Event } from '../../../shared/models/event.model';
import { ReservationResponse } from '../../../shared/models/reservation.model';

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

  // The route param is always a string — Angular's router doesn't know or
  // care what type an ID is, it's just a URL segment. We convert once here
  // rather than at every call site.
  private eventId!: number;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getById(this.eventId).subscribe({
      next: (event) => {
        this.event.set(event);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Event not found.');
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
        this.reserveError.set(
          err.status === 409
            ? 'Not enough tickets left for that quantity.'
            : 'Reservation failed. Try again.'
        );
      },
    });
  }
}
