import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../../../core/http/api-error';
import { AcademyProgressService } from '../../../../core/services/academy-progress.service';
import { TechnologyBrief } from '../../../../shared/components/technology-brief/technology-brief';
import { AcademyQuiz, AcademyQuizQuestion } from '../../../../shared/components/academy-quiz/academy-quiz';
import { CLF_C02_LESSONS } from '../clf-c02-lessons';

@Component({
  selector: 'app-clf-lesson',
  standalone: true,
  imports: [RouterLink, TechnologyBrief, AcademyQuiz],
  templateUrl: './clf-lesson.html',
  styleUrl: './clf-lesson.scss',
})
export class ClfLesson implements OnInit {
  private readonly certificationId = 'aws-clf-c02';
  readonly day = signal(0);
  readonly lesson = computed(() => CLF_C02_LESSONS.find((item) => item.day === this.day()));
  readonly quizQuestions = computed<AcademyQuizQuestion[]>(() => {
    const lesson = this.lesson();
    if (!lesson) return [];
    return [
      { question: lesson.question, options: lesson.options, correct: lesson.correct, explanation: lesson.answer },
      { question: `Which choice best matches this TicketForge need? ${lesson.concepts[1].ticketforge}`, options: [lesson.concepts[0].name, lesson.concepts[1].name, lesson.concepts[2].name], correct: 'b', explanation: lesson.concepts[1].explanation },
      { question: `Which choice best matches this TicketForge need? ${lesson.concepts[2].ticketforge}`, options: [lesson.concepts[0].name, lesson.concepts[1].name, lesson.concepts[2].name], correct: 'c', explanation: lesson.concepts[2].explanation },
    ];
  });
  readonly complete = signal(false);
  readonly saving = signal(false);
  readonly syncError = signal<string | null>(null);
  readonly previousRoute = computed(() => this.day() === 3
    ? '/academy/aws/cloud-practitioner/cloud-foundations'
    : `/academy/aws/cloud-practitioner/day/${this.day() - 1}`);
  readonly nextRoute = computed(() => this.day() < 21
    ? `/academy/aws/cloud-practitioner/day/${this.day() + 1}`
    : '/academy/aws/cloud-practitioner');

  constructor(private route: ActivatedRoute, private progress: AcademyProgressService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.day.set(Number(params.get('day')));
      this.complete.set(false);
      this.syncError.set(null);
      if (this.lesson()) this.loadProgress();
    });
  }

  private loadProgress(): void {
    this.progress.getProgress(this.certificationId).subscribe({
      next: (record) => this.complete.set(record.exercises.some(
        (exercise) => exercise.exerciseId === this.exerciseId() && exercise.completed,
      )),
      error: (error) => this.syncError.set(apiErrorMessage(error, 'Could not load this lesson record.')),
    });
  }

  toggleCompletion(): void {
    if (!this.lesson() || this.saving()) return;
    this.saving.set(true);
    this.syncError.set(null);
    this.progress.setExercise(this.certificationId, this.exerciseId(), !this.complete()).subscribe({
      next: (record) => {
        this.complete.set(record.exercises.some(
          (exercise) => exercise.exerciseId === this.exerciseId() && exercise.completed,
        ));
        this.saving.set(false);
      },
      error: (error) => {
        this.syncError.set(apiErrorMessage(error, 'Could not save this lesson completion.'));
        this.saving.set(false);
      },
    });
  }

  private exerciseId(): string { return `study-day-${String(this.day()).padStart(2, '0')}`; }
}
