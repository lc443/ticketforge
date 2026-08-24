import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { TechnologyBrief } from '../../../shared/components/technology-brief/technology-brief';

@Component({ selector: 'app-cloud-foundations', standalone: true, imports: [RouterLink, ScenarioCard, TechnologyBrief], templateUrl: './cloud-foundations.html', styleUrl: './cloud-foundations.scss' })
export class CloudFoundations {
  readonly exerciseCount = 5;
  readonly completed = signal<Set<number>>(new Set());
  readonly answer = signal<string | null>(null);
  readonly progress = computed(() => Math.round(this.completed().size / this.exerciseCount * 100));
  toggleExercise(step: number): void { const next = new Set(this.completed()); next.has(step) ? next.delete(step) : next.add(step); this.completed.set(next); }
  selectAnswer(answer: string): void { this.answer.set(answer); }
}
