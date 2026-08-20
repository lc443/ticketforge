// src/app/features/labs/scaling-lab/scaling-lab.ts

import { Component, computed, signal } from '@angular/core';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';

interface Instance {
  id: number;
  alive: boolean;
  requests: number;
}

@Component({
  selector: 'app-scaling-lab',
  standalone: true,
  imports: [ScenarioCard, LabBreadcrumb],
  templateUrl: './scaling-lab.html',
  styleUrl: './scaling-lab.scss',
})
export class ScalingLab {
  instances = signal<Instance[]>([
    { id: 1, alive: true, requests: 0 },
    { id: 2, alive: true, requests: 0 },
    { id: 3, alive: true, requests: 0 },
  ]);

  log = signal<string[]>([]);
  activeInstance = signal<number | null>(null);
  private nextIndex = 0;

  aliveCount = computed(() => this.instances().filter((i) => i.alive).length);

  quiz = [
    {
      question: 'Why must the API be stateless for this to work?',
      options: [
        "It doesn't need to be — sessions in memory are fine",
        'Any request can land on any instance, so nothing needed for that request can live only in one instance',
        'Stateless just means it has no database',
      ],
      correct: 1,
    },
    {
      question: 'What does the load balancer do when a health check fails?',
      options: [
        'Nothing, it keeps sending traffic anyway',
        'Stops routing new requests to that instance until it passes health checks again',
        'Deletes the instance permanently',
      ],
      correct: 1,
    },
    {
      question: 'If session data lived in memory on API #2 and #2 died, what breaks?',
      options: [
        'Nothing — the load balancer restores memory automatically',
        'Every user whose session lived on #2 is now logged out or mid-request data is gone',
        'Only #2 users notice a 1ms delay',
      ],
      correct: 1,
    },
  ];
  quizAnswers = signal<Record<number, number | null>>({});

  sendRequest() {
    const list = this.instances();
    const alive = list.filter((i) => i.alive);
    if (alive.length === 0) {
      this.log.update((l) => ['Request FAILED — no healthy instances', ...l].slice(0, 8));
      this.activeInstance.set(null);
      return;
    }

    let tries = 0;
    let target: Instance;
    do {
      target = list[this.nextIndex % list.length];
      this.nextIndex++;
      tries++;
    } while (!target.alive && tries < list.length * 2);

    this.activeInstance.set(target.id);
    this.instances.update((arr) =>
      arr.map((i) => (i.id === target.id ? { ...i, requests: i.requests + 1 } : i)),
    );
    this.log.update((l) => [`Request → API #${target.id} — OK`, ...l].slice(0, 8));
  }

  toggle(id: number) {
    this.instances.update((arr) =>
      arr.map((i) => (i.id === id ? { ...i, alive: !i.alive } : i)),
    );
    const inst = this.instances().find((i) => i.id === id)!;
    this.log.update((l) => [
      inst.alive ? `API #${id} back online` : `API #${id} killed`,
      ...l,
    ].slice(0, 8));
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
