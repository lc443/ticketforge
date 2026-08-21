import { Component, computed, signal } from '@angular/core';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';

type StrategyId = 'local' | 'postgres' | 'redis';
interface Strategy {
  id: StrategyId; name: string; authority: string; outcome: string;
  correct: boolean; measured: boolean; tradeoff: string;
}

@Component({
  selector: 'app-distributed-lock-lab', standalone: true,
  imports: [ScenarioCard, LabBreadcrumb], templateUrl: './distributed-lock-lab.html',
  styleUrl: './distributed-lock-lab.scss',
})
export class DistributedLockLab {
  strategies: Strategy[] = [
    { id: 'local', name: 'Local synchronized', authority: 'Each API JVM',
      outcome: 'Both replicas can enter because they own different locks. Inventory can oversell.',
      correct: false, measured: false, tradeoff: 'Simple inside one process, but provides no cluster-wide coordination.' },
    { id: 'postgres', name: 'PostgreSQL row lock', authority: 'Shared event row',
      outcome: 'One request created a reservation; the other waited, re-read zero inventory, and returned 409.',
      correct: true, measured: true, tradeoff: 'Correct and transactional, but hot events serialize and waiting increases tail latency.' },
    { id: 'redis', name: 'Redis lease lock', authority: 'Shared Redis key',
      outcome: 'Can coordinate replicas, but the lock and protected inventory live in different systems.',
      correct: true, measured: false, tradeoff: 'Requires ownership tokens, expiry, failure handling, and often fencing against stale holders.' },
  ];
  selectedId = signal<StrategyId>('postgres');
  selectedStrategy = computed(() => this.strategies.find((s) => s.id === this.selectedId())!);

  quiz = [
    { question: 'Why does PostgreSQL locking coordinate all three TicketForge replicas?',
      options: ['Spring copies JVM locks between servers', 'Every replica consults the same database row', 'NGINX allows only one request'], correct: 1 },
    { question: 'Why did TicketForge not add a Redis inventory lock?',
      options: ['Redis cannot implement locks', 'The protected data and transaction already live in PostgreSQL', 'Redis is always slower than PostgreSQL'], correct: 1 },
    { question: 'What did the real two-request experiment prove?',
      options: ['One 201, one 409, one row, zero tickets remaining', 'Both requests succeeded', 'Only one API replica was running'], correct: 0 },
  ];
  quizAnswers = signal<Record<number, number | null>>({});
  select(id: StrategyId) { this.selectedId.set(id); }
  answerQuiz(i: number, answer: number) {
    if (this.quizAnswers()[i] == null) this.quizAnswers.update((a) => ({ ...a, [i]: answer }));
  }
  wasAnswered(i: number) { return this.quizAnswers()[i] != null; }
  selectedAnswer(i: number) { return this.quizAnswers()[i] ?? null; }
}
