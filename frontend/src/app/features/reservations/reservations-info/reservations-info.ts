import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reservations-info',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reservations-info.html',
  styleUrl: './reservations-info.scss',
})
export class ReservationsInfo {}
