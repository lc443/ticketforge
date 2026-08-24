import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CERTIFICATION_PATHS, CLF_C02_DOMAINS } from '../../../shared/data/certification-paths';
import { CLF_C02_STUDY_PLAN } from './clf-c02-study-plan';

const STORAGE_KEY = 'ticketforge_academy_clf_c02_days';

@Component({
  selector: 'app-cloud-practitioner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cloud-practitioner.html',
  styleUrl: './cloud-practitioner.scss',
})
export class CloudPractitioner {
  readonly certification = CERTIFICATION_PATHS.find((path) => path.id === 'aws-clf-c02')!;
  readonly domains = CLF_C02_DOMAINS;
  readonly studyPlan = CLF_C02_STUDY_PLAN;
  readonly completedDays = signal<Set<number>>(this.readProgress());
  readonly completedCount = computed(() => this.completedDays().size);
  readonly planProgress = computed(() => Math.round(this.completedCount() / this.studyPlan.length * 100));
  readonly readiness = computed(() => Math.min(100, Math.round(this.planProgress() * 0.5)));

  daysForWeek(week: number) { return this.studyPlan.filter((day) => day.week === week); }

  toggleDay(day: number): void {
    const next = new Set(this.completedDays());
    next.has(day) ? next.delete(day) : next.add(day);
    this.completedDays.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  }

  private readProgress(): Set<number> {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      return new Set(Array.isArray(stored) ? stored.filter((day) => Number.isInteger(day) && day >= 1 && day <= 21) : []);
    } catch {
      return new Set();
    }
  }
}
