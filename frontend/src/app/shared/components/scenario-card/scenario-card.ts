// src/app/shared/components/scenario-card/scenario-card.ts

import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-scenario-card',
  standalone: true,
  templateUrl: './scenario-card.html',
  styleUrl: './scenario-card.scss',
})
export class ScenarioCard {
  eyebrow = input('Start with what you already built');
  title = input('A real TicketForge scenario');

  expanded = signal(true);

  toggle() {
    this.expanded.update((value) => !value);
  }
}
