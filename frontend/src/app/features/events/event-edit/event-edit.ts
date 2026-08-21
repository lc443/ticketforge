import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../../core/http/api-error';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './event-edit.html',
  styleUrl: '../event-create/event-create.scss',
})
export class EventEdit implements OnInit {
  eventId!: number;
  name = '';
  venue = '';
  eventDate = '';
  totalTickets = 1;
  soldTickets = 0;

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getById(this.eventId).subscribe({
      next: (event) => {
        this.name = event.name;
        this.venue = event.venue;
        this.eventDate = event.eventDate.slice(0, 16);
        this.totalTickets = event.totalTickets;
        this.soldTickets = event.totalTickets - event.availableTickets;
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(error, 'Could not load the event.'));
      },
    });
  }

  submit() {
    this.error.set(null);
    this.saving.set(true);
    this.eventService
      .update(this.eventId, {
        name: this.name,
        venue: this.venue,
        eventDate: this.eventDate,
        totalTickets: this.totalTickets,
      })
      .subscribe({
        next: (event) => {
          this.saving.set(false);
          this.router.navigate(['/events', event.id]);
        },
        error: (error) => {
          this.saving.set(false);
          this.error.set(apiErrorMessage(error, 'Could not update the event.'));
        },
      });
  }
}
