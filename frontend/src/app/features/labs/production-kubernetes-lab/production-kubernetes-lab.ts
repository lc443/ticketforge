import { Component, computed, signal } from '@angular/core';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';

@Component({
  selector: 'app-production-kubernetes-lab',
  standalone: true,
  imports: [LabBreadcrumb, ScenarioCard],
  templateUrl: './production-kubernetes-lab.html',
  styleUrl: './production-kubernetes-lab.scss',
})
export class ProductionKubernetesLab {
  readonly exerciseCount = 6;
  readonly completed = signal<Set<number>>(new Set());
  readonly answer = signal<string | null>(null);
  readonly progress = computed(() => Math.round((this.completed().size / this.exerciseCount) * 100));

  toggleExercise(step: number): void {
    const next = new Set(this.completed());
    next.has(step) ? next.delete(step) : next.add(step);
    this.completed.set(next);
  }

  selectAnswer(answer: string): void { this.answer.set(answer); }
}

