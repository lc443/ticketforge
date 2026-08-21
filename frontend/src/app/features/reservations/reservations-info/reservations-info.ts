import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../../core/http/api-error';
import { ReservationService } from '../../../core/services/reservation.service';
import { MyReservation, ReservationStatus } from '../../../shared/models/reservation.model';

@Component({
  selector: 'app-reservations-info', standalone: true,
  imports: [RouterLink, DatePipe], templateUrl: './reservations-info.html',
  styleUrl: './reservations-info.scss',
})
export class ReservationsInfo implements OnInit {
  reservations = signal<MyReservation[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  totalTickets = computed(() => this.reservations().reduce((n, r) => n + r.quantity, 0));

  constructor(private reservationsApi: ReservationService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.reservationsApi.mine().subscribe({
      next: (items) => { this.reservations.set(items); this.loading.set(false); },
      error: (error) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(error, 'Could not load your reservations.'));
      },
    });
  }

  statusLabel(status: ReservationStatus) {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }
}
