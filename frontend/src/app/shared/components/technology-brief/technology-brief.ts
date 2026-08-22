import { Component, input, signal } from '@angular/core';

type OptionId = 'a' | 'b' | 'c';

@Component({
  selector: 'app-technology-brief',
  standalone: true,
  templateUrl: './technology-brief.html',
  styleUrl: './technology-brief.scss',
})
export class TechnologyBrief {
  readonly technology = input.required<string>();
  readonly scenario = input.required<string>();
  readonly definition = input.required<string>();
  readonly why = input.required<string>();
  readonly problem = input.required<string>();
  readonly mentalModel = input.required<string>();
  readonly question = input.required<string>();
  readonly optionA = input.required<string>();
  readonly optionB = input.required<string>();
  readonly optionC = input.required<string>();
  readonly correctOption = input.required<OptionId>();
  readonly explanation = input.required<string>();
  readonly selected = signal<OptionId | null>(null);

  choose(option: OptionId): void { this.selected.set(option); }
  isCorrect(): boolean { return this.selected() === this.correctOption(); }
}
