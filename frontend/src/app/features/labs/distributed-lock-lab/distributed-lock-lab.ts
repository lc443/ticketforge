// src/app/features/labs/distributed-lock-lab/distributed-lock-lab.ts

import { Component, signal } from '@angular/core';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';

type LockType = 'jvm' | 'distributed';

interface Outcome {
  a: 'won' | 'lost';
  b: 'won' | 'lost';
  sold: number;
  oversold: boolean;
}

@Component({
  selector: 'app-distributed-lock-lab',
  standalone: true,
  imports: [ScenarioCard, LabBreadcrumb],
  templateUrl: './distributed-lock-lab.html',
  styleUrl: './distributed-lock-lab.scss',
})
export class DistributedLockLab {
  lockType = signal<LockType>('jvm');
  running = signal(false);
  outcome = signal<Outcome | null>(null);

  quiz = [
    {
      question: "Why doesn't a Java `synchronized` block protect this across two API instances?",
      options: [
        'It does — synchronized works cluster-wide by default',
        'Each JVM has its own lock; synchronized only coordinates threads inside one process',
        '`synchronized` is deprecated and does nothing',
      ],
      correct: 1,
    },
    {
      question: 'What does a distributed lock (e.g. Redis-based) add that a local lock cannot?',
      options: [
        'Faster reads',
        'A single shared lock that every instance, on every machine, checks before proceeding',
        'Automatic database backups',
      ],
      correct: 1,
    },
    {
      question:
        "Kleppmann and antirez publicly disagreed about Redlock. What was the core of the disagreement?",
      options: [
        'Whether Redis is open source',
        'Whether Redlock is safe under real-world clock drift and process pauses without fencing tokens',
        'Which programming language Redis should be written in',
      ],
      correct: 1,
    },
  ];
  quizAnswers = signal<Record<number, number | null>>({});

  setLockType(type: LockType) {
    if (this.running()) return;
    this.lockType.set(type);
    this.outcome.set(null);
  }

  async simulate() {
    if (this.running()) return;
    this.running.set(true);
    this.outcome.set(null);

    await new Promise((r) => setTimeout(r, 600));

    if (this.lockType() === 'distributed') {
      this.outcome.set({ a: 'won', b: 'lost', sold: 1, oversold: false });
    } else {
      this.outcome.set({ a: 'won', b: 'won', sold: 2, oversold: true });
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
}
