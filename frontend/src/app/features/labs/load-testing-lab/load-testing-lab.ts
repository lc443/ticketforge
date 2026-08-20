// src/app/features/labs/load-testing-lab/load-testing-lab.ts

import { Component, computed, signal } from '@angular/core';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';

type Load = 10 | 100 | 1000 | 5000;

interface Metrics {
  rps: number;
  p50: number;
  p95: number;
  p99: number;
  errorRate: number;
}

// Rough, made-up curve: fine up to ~500 concurrent users, then the
// (single, unscaled) instance starts queuing and erroring.
function metricsFor(load: Load): Metrics {
  const capacity = 500;
  const strain = Math.max(0, load - capacity) / capacity;

  return {
    rps: Math.round(Math.min(load, capacity) * 0.9 - strain * 30),
    p50: Math.round(40 + strain * 300),
    p95: Math.round(90 + strain * 1400),
    p99: Math.round(160 + strain * 3200),
    errorRate: Math.round(Math.min(60, strain * 45) * 10) / 10,
  };
}

@Component({
  selector: 'app-load-testing-lab',
  standalone: true,
  imports: [ScenarioCard, LabBreadcrumb],
  templateUrl: './load-testing-lab.html',
  styleUrl: './load-testing-lab.scss',
})
export class LoadTestingLab {
  loads: Load[] = [10, 100, 1000, 5000];
  load = signal<Load>(10);
  running = signal(false);
  ran = signal(false);

  metrics = computed<Metrics>(() => metricsFor(this.load()));

  quiz = [
    {
      question: 'What is the rule this sprint is built around?',
      options: [
        'Optimize first, measure later',
        'Measure before optimizing',
        'Never measure — trust your instincts',
      ],
      correct: 1,
    },
    {
      question: "HealthCare.gov's 2013 launch is the cautionary tale here because:",
      options: [
        'The code had a typo',
        'It was never load-tested at real-world scale before it mattered',
        'It used the wrong programming language',
      ],
      correct: 1,
    },
    {
      question: 'Why look at p95/p99 latency instead of just the average?',
      options: [
        'Averages hide the slow requests that real users actually experience',
        'p95/p99 are easier to calculate',
        "They're the same number, just renamed",
      ],
      correct: 0,
    },
  ];
  quizAnswers = signal<Record<number, number | null>>({});

  async run() {
    if (this.running()) return;
    this.running.set(true);
    this.ran.set(false);
    await new Promise((r) => setTimeout(r, 700));
    this.ran.set(true);
    this.running.set(false);
  }

  setLoad(load: Load) {
    if (this.running()) return;
    this.load.set(load);
    this.ran.set(false);
  }

  answerQuiz(i: number, index: number) {
    if (this.quizAnswers()[i] != null) return;
    this.quizAnswers.update((a) => ({ ...a, [i]: index }));
  }

  wasAnswered(i: number) {
    return this.quizAnswers()[i] != null;
  }

  selected(i: number) {
    return this.quizAnswers()[i] ?? null;
  }
}
