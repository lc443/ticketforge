// src/app/features/labs/monolith-lab/monolith-lab.ts

import { Component, computed, signal } from '@angular/core';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';

type Mode = 'monolith' | 'microservices';

interface Step {
  label: string;
  latency: number;
  failable: boolean;
}

const STEPS: Step[] = [
  { label: 'Check event exists', latency: 1, failable: false },
  { label: 'Check inventory', latency: 1, failable: true },
  { label: 'Create reservation', latency: 1, failable: false },
  { label: 'Create order', latency: 1, failable: true },
];

interface RunStep extends Step {
  ms: number;
  ok: boolean;
}

@Component({
  selector: 'app-monolith-lab',
  standalone: true,
  imports: [ScenarioCard, LabBreadcrumb],
  templateUrl: './monolith-lab.html',
  styleUrl: './monolith-lab.scss',
})
export class MonolithLab {
  mode = signal<Mode>('monolith');
  running = signal(false);
  results = signal<RunStep[] | null>(null);

  quiz = [
    {
      question: "Why shouldn't TicketForge start with microservices?",
      options: [
        'A small app and small team gain nothing from network calls between modules',
        'Microservices are always slower than a monolith, in every case',
        'Java cannot support microservices',
      ],
      correct: 0,
    },
    {
      question: 'What does splitting into microservices too early actually cost you?',
      options: [
        'Nothing — it only adds benefits',
        'Network calls, partial failure, and distributed transactions where there used to be one',
        'It costs money but has no technical downside',
      ],
      correct: 1,
    },
    {
      question: 'When does pulling a module out into its own service make sense?',
      options: [
        'Immediately, before writing any code',
        'Never — monoliths should never be split',
        "When a real boundary has earned it — different scaling needs, ownership, or failure isolation",
      ],
      correct: 2,
    },
  ];
  quizAnswers = signal<Record<number, number | null>>({});

  totalLatency = computed(() => {
    const r = this.results();
    return r ? r.reduce((sum, s) => sum + s.ms, 0) : 0;
  });

  failed = computed(() => {
    const r = this.results();
    return r ? r.some((s) => !s.ok) : false;
  });

  setMode(mode: Mode) {
    if (this.running()) return;
    this.mode.set(mode);
    this.results.set(null);
  }

  async run() {
    if (this.running()) return;

    this.running.set(true);
    this.results.set(null);

    const out: RunStep[] = [];
    let brokeChain = false;

    for (const step of STEPS) {
      await this.wait(250);

      if (this.mode() === 'monolith') {
        out.push({ ...step, ms: step.latency, ok: true });
      } else {
        const ms = 40 + Math.floor(Math.random() * 60);
        const ok = brokeChain ? false : !(step.failable && Math.random() < 0.28);
        if (!ok) brokeChain = true;
        out.push({ ...step, ms, ok });
      }

      this.results.set([...out]);
    }

    this.running.set(false);
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

  private wait(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }
}
