import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { apiErrorMessage } from '../../../core/http/api-error';
import { AcademyProgressService } from '../../../core/services/academy-progress.service';
import { AcademyCertificate } from '../../../shared/models/academy.model';
import { CERTIFICATION_PATHS, CLF_C02_DOMAINS } from '../../../shared/data/certification-paths';
import { CLF_C02_STUDY_PLAN } from './clf-c02-study-plan';

@Component({
  selector: 'app-cloud-practitioner',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './cloud-practitioner.html',
  styleUrl: './cloud-practitioner.scss',
})
export class CloudPractitioner implements OnInit {
  readonly certification = CERTIFICATION_PATHS.find((path) => path.id === 'aws-clf-c02')!;
  readonly domains = CLF_C02_DOMAINS;
  readonly studyPlan = CLF_C02_STUDY_PLAN;
  readonly completedDays = signal<Set<number>>(new Set());
  readonly certificate = signal<AcademyCertificate | null>(null);
  readonly syncError = signal<string | null>(null);
  readonly loading = signal(true);
  readonly xp = signal(0);
  readonly maximumXp = signal(845);
  readonly passedQuizModules = signal(0);
  readonly completedCount = computed(() => this.completedDays().size);
  readonly planProgress = computed(() => Math.round(this.completedCount() / this.studyPlan.length * 100));
  readonly readiness = computed(() => Math.min(100, Math.round(this.planProgress() * 0.5)));

  constructor(private academyProgress: AcademyProgressService) {}

  ngOnInit(): void {
    this.academyProgress.getProgress(this.certification.id).subscribe({
      next: (progress) => {
        this.applyProgress(progress.exercises.filter((item) => item.completed).map((item) => item.exerciseId));
        this.certificate.set(progress.certificate);
        this.applyXp(progress);
        this.loading.set(false);
      },
      error: (error) => {
        this.syncError.set(apiErrorMessage(error, 'Could not load your Academy progress.'));
        this.loading.set(false);
      },
    });
  }

  daysForWeek(week: number) { return this.studyPlan.filter((day) => day.week === week); }

  toggleDay(day: number): void {
    const exerciseId = this.dayExerciseId(day);
    const completed = !this.completedDays().has(day);
    this.syncError.set(null);
    this.academyProgress.setExercise(this.certification.id, exerciseId, completed).subscribe({
      next: (progress) => {
        this.applyProgress(progress.exercises.filter((item) => item.completed).map((item) => item.exerciseId));
        this.certificate.set(progress.certificate);
        this.applyXp(progress);
      },
      error: (error) => this.syncError.set(apiErrorMessage(error, 'Could not save your progress.')),
    });
  }

  private applyProgress(exerciseIds: string[]): void {
    const days = exerciseIds
      .filter((id) => /^study-day-\d{2}$/.test(id))
      .map((id) => Number(id.slice(-2)));
    this.completedDays.set(new Set(days));
  }

  private dayExerciseId(day: number): string { return `study-day-${String(day).padStart(2, '0')}`; }
  private applyXp(progress: { xp: number; maximumXp: number; passedQuizModules: number }): void {
    this.xp.set(progress.xp);
    this.maximumXp.set(progress.maximumXp);
    this.passedQuizModules.set(progress.passedQuizModules);
  }
}
