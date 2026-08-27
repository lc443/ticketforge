import { Component, computed, effect, input, signal } from '@angular/core';
import { AcademyProgressService } from '../../../core/services/academy-progress.service';
import { apiErrorMessage } from '../../../core/http/api-error';
import { AcademyQuizAttempt } from '../../models/academy.model';

export type QuizOptionId = 'a' | 'b' | 'c';

export interface AcademyQuizQuestion {
  question: string;
  options: [string, string, string];
  correct: QuizOptionId;
  explanation: string;
}

@Component({
  selector: 'app-academy-quiz',
  standalone: true,
  templateUrl: './academy-quiz.html',
  styleUrl: './academy-quiz.scss',
})
export class AcademyQuiz {
  readonly title = input('Check your decisions');
  readonly questions = input.required<AcademyQuizQuestion[]>();
  readonly moduleId = input.required<string>();
  readonly selected = signal<Record<number, QuizOptionId>>({});
  readonly answered = computed(() => Object.keys(this.selected()).length);
  readonly correct = computed(() => this.questions().filter((question, index) => this.selected()[index] === question.correct).length);
  readonly submitted = signal(false);
  readonly score = computed(() => Math.round(this.correct() / this.questions().length * 100));
  readonly passed = computed(() => this.score() >= 67);
  readonly saving = signal(false);
  readonly saveMessage = signal<string | null>(null);
  readonly attempts = signal<AcademyQuizAttempt[]>([]);
  readonly historyError = signal<string | null>(null);
  readonly latestAttempt = computed(() => this.attempts()[0] ?? null);
  readonly bestScore = computed(() => this.attempts().reduce((best, attempt) => Math.max(best, attempt.scorePercent), 0));

  constructor(private progress: AcademyProgressService) {
    effect(() => {
      const moduleId = this.moduleId();
      this.retry();
      this.loadHistory(moduleId);
    });
  }

  choose(index: number, option: QuizOptionId): void {
    if (this.submitted()) return;
    this.selected.update((answers) => ({ ...answers, [index]: option }));
  }

  submit(): void {
    if (this.answered() !== this.questions().length) return;
    this.submitted.set(true); this.saving.set(true); this.saveMessage.set(null);
    this.progress.recordQuizAttempt('aws-clf-c02', this.moduleId(), this.correct(), this.questions().length).subscribe({
      next: (attempt) => { this.attempts.update((attempts) => [attempt, ...attempts]); this.saving.set(false); this.saveMessage.set('Attempt saved to your learner record.'); },
      error: (error) => { this.saving.set(false); this.saveMessage.set(apiErrorMessage(error, 'Score calculated, but the attempt could not be saved.')); },
    });
  }
  retry(): void { this.selected.set({}); this.submitted.set(false); this.saveMessage.set(null); }
  optionId(index: number): QuizOptionId { return (['a', 'b', 'c'] as const)[index]; }

  private loadHistory(moduleId: string): void {
    this.historyError.set(null);
    this.progress.getQuizAttempts('aws-clf-c02').subscribe({
      next: (attempts) => this.attempts.set(attempts.filter((attempt) => attempt.moduleId === moduleId)),
      error: (error) => this.historyError.set(apiErrorMessage(error, 'Could not load saved quiz scores.')),
    });
  }
}
