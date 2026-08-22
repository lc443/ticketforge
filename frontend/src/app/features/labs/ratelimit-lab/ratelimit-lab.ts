// src/app/features/labs/ratelimit-lab/ratelimit-lab.ts

import { Component, OnDestroy, signal } from '@angular/core';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';
import { TechnologyBrief } from '../../../shared/components/technology-brief/technology-brief';

const CAPACITY = 5;
const REFILL_MS = 1500;

@Component({
  selector: 'app-ratelimit-lab',
  standalone: true,
  imports: [ScenarioCard, LabBreadcrumb, TechnologyBrief],
  templateUrl: './ratelimit-lab.html',
  styleUrl: './ratelimit-lab.scss',
})
export class RatelimitLab implements OnDestroy {
  capacity = CAPACITY;
  tokens = signal(CAPACITY);
  log = signal<{ status: 200 | 429; label: string }[]>([]);

  private timer = setInterval(() => {
    this.tokens.update((t) => Math.min(this.capacity, t + 1));
  }, REFILL_MS);

  quiz = [
    {
      question: 'What does a fixed-window counter let happen at the boundary between two windows?',
      options: [
        "Nothing unusual, it's identical to a token bucket",
        'Up to 2x the intended limit — a burst at the end of one window plus a burst at the start of the next',
        'It blocks all traffic during the reset',
      ],
      correct: 1,
    },
    {
      question: "What status code and header tell a client it's been rate limited?",
      options: [
        '404 Not Found with no extra header',
        '429 Too Many Requests, often with a Retry-After or X-RateLimit-* header',
        '500 Internal Server Error',
      ],
      correct: 1,
    },
    {
      question: 'Why store the token count in Redis instead of in memory on each API instance?',
      options: [
        "It doesn't matter, in-memory is equivalent",
        'Redis is required by law for rate limiting',
        'With multiple API instances behind a load balancer, each would count independently — the real limit becomes N times higher than intended',
      ],
      correct: 2,
    },
  ];
  quizAnswers = signal<Record<number, number | null>>({});

  sendRequest() {
    if (this.tokens() > 0) {
      this.tokens.update((t) => t - 1);
      this.log.update((l) => [{ status: 200 as const, label: '200 OK' }, ...l].slice(0, 10));
    } else {
      this.log.update((l) =>
        [{ status: 429 as const, label: '429 Too Many Requests' }, ...l].slice(0, 10),
      );
    }
  }

  burst() {
    for (let i = 0; i < 10; i++) {
      this.sendRequest();
    }
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

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
