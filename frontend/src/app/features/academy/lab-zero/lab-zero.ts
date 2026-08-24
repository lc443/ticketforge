import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../../core/http/api-error';
import { AcademyProgressService } from '../../../core/services/academy-progress.service';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { TechnologyBrief } from '../../../shared/components/technology-brief/technology-brief';

@Component({
  selector: 'app-lab-zero', standalone: true, imports: [RouterLink, ScenarioCard, TechnologyBrief],
  templateUrl: './lab-zero.html', styleUrl: './lab-zero.scss',
})
export class LabZero implements OnInit {
  private readonly certificationId = 'aws-clf-c02';
  private readonly exerciseIds = [
    'lab-zero-root-boundary', 'lab-zero-daily-identity', 'lab-zero-cli-identity',
    'lab-zero-cost-controls', 'lab-zero-tagging-contract', 'lab-zero-cleanup-contract',
  ];
  readonly exerciseCount = 6;
  readonly completed = signal<Set<number>>(new Set());
  readonly answer = signal<string | null>(null);
  readonly syncError = signal<string | null>(null);
  readonly progress = computed(() => Math.round(this.completed().size / this.exerciseCount * 100));

  constructor(private academyProgress: AcademyProgressService) {}

  ngOnInit(): void { this.loadProgress(); }

  toggleExercise(step: number): void {
    const completed = !this.completed().has(step);
    this.syncError.set(null);
    this.academyProgress.setExercise(this.certificationId, this.exerciseIds[step - 1], completed).subscribe({
      next: (progress) => this.applyProgress(progress.exercises.filter((item) => item.completed).map((item) => item.exerciseId)),
      error: (error) => this.syncError.set(apiErrorMessage(error, 'Could not save your exercise completion.')),
    });
  }
  selectAnswer(answer: string): void { this.answer.set(answer); }

  private loadProgress(): void {
    this.academyProgress.getProgress(this.certificationId).subscribe({
      next: (progress) => this.applyProgress(progress.exercises.filter((item) => item.completed).map((item) => item.exerciseId)),
      error: (error) => this.syncError.set(apiErrorMessage(error, 'Could not load your exercise completion.')),
    });
  }
  private applyProgress(ids: string[]): void {
    this.completed.set(new Set(this.exerciseIds.map((id, index) => ids.includes(id) ? index + 1 : 0).filter(Boolean)));
  }
}
