// src/app/features/labs/concurrency-lab/concurrency-lab.ts

import { Component, signal } from '@angular/core';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';

interface Outcome {
  a: 'won' | 'lost' | null;
  b: 'won' | 'lost' | null;
  sold: number;
  oversold: boolean;
}

@Component({
  selector: 'app-concurrency-lab',
  standalone: true,
  imports: [ScenarioCard, LabBreadcrumb],
  templateUrl: './concurrency-lab.html',
  styleUrl: './concurrency-lab.scss',
})
export class ConcurrencyLab {
  locking = signal(true);
  running = signal(false);
  outcome = signal<Outcome | null>(null);

  quiz = [
    {
      question: 'What is a race condition, in this scenario?',
      options: [
        'Two threads both read "1 ticket available" before either writes, so both proceed',
        'A ticket that takes too long to generate',
        'The database running out of disk space',
      ],
      correct: 0,
    },
    {
      question: "Why doesn't a plain read-then-write fix overselling?",
      options: [
        'It does fix it, no lock is ever needed',
        "Between the read and the write, another transaction can read the same stale value — the check and the update aren't atomic together",
        'Reads are always slower than writes',
      ],
      correct: 1,
    },
    {
      question: 'What do you give up by using pessimistic locking (SELECT ... FOR UPDATE)?',
      options: [
        'Nothing — it has no downsides',
        'The second transaction has to wait for the first to finish, reducing throughput under heavy contention',
        'Data consistency',
      ],
      correct: 1,
    },
  ];
  quizAnswers = signal<Record<number, number | null>>({});

  toggleLocking() {
    if (this.running()) return;
    this.locking.update((v) => !v);
    this.outcome.set(null);
  }

  async simulate() {
    if (this.running()) return;
    this.running.set(true);
    this.outcome.set(null);

    await this.wait(600);

    if (this.locking()) {
      // A locks the row, B waits, A commits (sold), B re-reads and sees 0 left.
      this.outcome.set({ a: 'won', b: 'lost', sold: 1, oversold: false });
    } else {
      // Both read "1 available" before either writes.
      this.outcome.set({ a: 'won', b: 'won', sold: 2, oversold: true });
    }

    this.running.set(false);
  }

  reset() {
    this.outcome.set(null);
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
