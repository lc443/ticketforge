import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../../core/http/api-error';
import { AcademyProgressService } from '../../../core/services/academy-progress.service';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { TechnologyBrief } from '../../../shared/components/technology-brief/technology-brief';
import { AcademyQuiz, AcademyQuizQuestion } from '../../../shared/components/academy-quiz/academy-quiz';

@Component({
  selector: 'app-lab-zero', standalone: true, imports: [RouterLink, ScenarioCard, TechnologyBrief, AcademyQuiz],
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
  readonly quizQuestions: AcademyQuizQuestion[] = [
    { question: 'Why configure both a budget and cost anomaly detection?', options: ['A budget checks thresholds while anomaly detection finds unusual patterns', 'Both stop every charge automatically', 'They replace least-privilege IAM'], correct: 'a', explanation: 'They are different detective controls. Neither guarantees that resources stop.' },
    { question: 'Which identity should run ordinary TicketForge lab commands?', options: ['The root user', 'A named Identity Center user with temporary role credentials', 'An access key committed to Git'], correct: 'b', explanation: 'Daily work uses a named, auditable identity with scoped temporary access. Root is reserved for root-only tasks.' },
    { question: 'What proves an AWS lab resource was cleaned up?', options: ['The delete command returned successfully', 'The terminal was closed', 'A follow-up service query shows the resource and dependencies are absent'], correct: 'c', explanation: 'Deletion is proven only after a new observation confirms absence.' },
  ];

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
