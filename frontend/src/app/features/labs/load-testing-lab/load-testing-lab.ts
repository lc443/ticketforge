import { Component, computed, signal } from '@angular/core';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';
import { TechnologyBrief } from '../../../shared/components/technology-brief/technology-brief';

type RunId = 'smoke' | 'browse';
interface MeasuredRun {
  id: RunId; label: string; traffic: string; requests: number; successRate: number;
  p95: number; p99: number; rateLimited: number; result: 'passed' | 'threshold-failed'; note: string;
}

@Component({
  selector: 'app-load-testing-lab', standalone: true,
  imports: [ScenarioCard, LabBreadcrumb, TechnologyBrief], templateUrl: './load-testing-lab.html',
  styleUrl: './load-testing-lab.scss',
})
export class LoadTestingLab {
  runs: MeasuredRun[] = [
    { id: 'smoke', label: 'Smoke', traffic: '1 iteration', requests: 2, successRate: 100,
      p95: 413.21, p99: 426.83, rateLimited: 0, result: 'passed',
      note: 'Login and event listing both succeeded. This proves the path works, not that it scales.' },
    { id: 'browse', label: 'Browse baseline', traffic: '5 req/s · 10 seconds', requests: 51,
      successRate: 20, p95: 16.51, p99: 275.45, rateLimited: 40, result: 'threshold-failed',
      note: 'The API stayed fast, but Redis rate limiting rejected 80% of browse operations after the first 10.' },
  ];
  selectedId = signal<RunId>('browse');
  selectedRun = computed(() => this.runs.find((run) => run.id === this.selectedId())!);
  quiz = [
    { question: 'The browse run had a 16.51ms p95 but only 20% business success. Was it healthy?',
      options: ['Yes — latency was low', 'No — fast 429 responses are still failed user operations', 'Yes — all HTTP responses count as success'], correct: 1 },
    { question: 'What is the rule this sprint is built around?',
      options: ['Optimize first, measure later', 'Measure before optimizing', 'Trust architectural assumptions'], correct: 1 },
    { question: 'Why inspect p95/p99 instead of only the average?',
      options: ['Averages hide slow requests that real users experience', 'They are easier to calculate', 'They are the same number'], correct: 0 },
  ];
  quizAnswers = signal<Record<number, number | null>>({});
  select(id: RunId) { this.selectedId.set(id); }
  answerQuiz(i: number, answer: number) {
    if (this.quizAnswers()[i] == null) this.quizAnswers.update((a) => ({ ...a, [i]: answer }));
  }
  wasAnswered(i: number) { return this.quizAnswers()[i] != null; }
  selectedAnswer(i: number) { return this.quizAnswers()[i] ?? null; }
}
