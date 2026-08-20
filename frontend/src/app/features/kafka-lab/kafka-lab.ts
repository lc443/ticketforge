// src/app/features/kafka-lab/kafka-lab.ts

import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScenarioCard } from '../../shared/components/scenario-card/scenario-card';
import { LabBreadcrumb } from '../../shared/components/lab-breadcrumb/lab-breadcrumb';

type KafkaStage =
  | 'idle'
  | 'producer'
  | 'topic'
  | 'partition'
  | 'consumer'
  | 'retry-1'
  | 'retry-2'
  | 'retry-3'
  | 'dlq'
  | 'replayed';

type LessonMode = 'auto' | 'manual';
type Speed = 'slow' | 'normal' | 'fast';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

const STAGE_ORDER: KafkaStage[] = [
  'idle',
  'producer',
  'topic',
  'partition',
  'consumer',
  'retry-1',
  'retry-2',
  'retry-3',
  'dlq',
  'replayed',
];

const SPEED_MULTIPLIER: Record<Speed, number> = {
  slow: 1.6,
  normal: 1,
  fast: 0.45,
};

const FINAL_QUIZ: QuizQuestion[] = [
  {
    question:
      "The email provider goes down for 10 minutes during a ticket drop. What happens to the ReservationCreatedEvents that were meant to trigger emails?",
    options: [
      'They are lost — Kafka only holds a message until the first delivery attempt',
      'They stay in the topic and get retried by consumers once the provider recovers',
      'The producer stops accepting new reservations until email is back',
    ],
    correct: 1,
  },
  {
    question:
      'Two customers reserve tickets for two different events at nearly the same moment. Are their events guaranteed to be processed in the order they were produced?',
    options: [
      'Yes, Kafka always processes an entire topic in strict order',
      'Only if both events share the same partition key',
      'No, Kafka never guarantees ordering under any circumstances',
    ],
    correct: 1,
  },
  {
    question:
      "TicketForge scales EmailWorker from 3 instances to 6 during a major on-sale. The reservation-created topic still has 3 partitions. What actually happens?",
    options: [
      'Throughput doubles immediately — more consumers always means more parallelism',
      '3 workers stay idle, because a partition can only be owned by one consumer per group',
      'Kafka automatically creates 3 more partitions to match the new workers',
    ],
    correct: 1,
  },
  {
    question:
      'A bug makes AnalyticsWorker crash every time on one specific malformed event, even after retries. What stops that one event from blocking every reservation queued behind it on the same partition?',
    options: [
      'The event is silently dropped after the first failure',
      'The consumer skips ahead and processes newer events out of order automatically',
      'After retries are exhausted, the event moves to the DLQ and the consumer moves on',
    ],
    correct: 2,
  },
  {
    question:
      "TicketForge's requirements say tickets can't be oversold and purchases can't be lost. Sprint 7's pessimistic locking already protects the last-ticket race. What does moving email, ticket generation, and analytics onto Kafka protect?",
    options: [
      'It protects the reservation write itself from race conditions',
      'It keeps a slow or failing email/analytics provider from ever blocking or failing the reservation request that already succeeded',
      "It doesn't protect anything — it's purely a performance optimization with no reliability benefit",
    ],
    correct: 1,
  },
];

const QUIZ: Record<string, QuizQuestion> = {
  producer: {
    question: 'What does a Kafka producer do?',
    options: ['Stores relational data', 'Sends messages to Kafka', 'Processes consumer groups'],
    correct: 1,
  },
  topic: {
    question: 'What is a topic?',
    options: ['A named stream of related messages', 'A database table', 'An API endpoint'],
    correct: 0,
  },
  partition: {
    question: 'Why do partitions exist?',
    options: ['Authentication', 'Parallelism and scalability', 'Password storage'],
    correct: 1,
  },
  consumer: {
    question:
      'Three consumers are in the same consumer group. One message arrives. How many consumers process it?',
    options: ['1', '2', '3'],
    correct: 0,
  },
  retry: {
    question: 'Why use retries before giving up on a message?',
    options: [
      'To recover from temporary failures',
      'To deliberately slow down processing',
      'To duplicate the message on purpose',
    ],
    correct: 0,
  },
  dlq: {
    question: 'Why use a Dead Letter Queue?',
    options: [
      'To speed up retries',
      'To delete failed messages permanently',
      'To preserve messages that cannot be processed successfully',
    ],
    correct: 2,
  },
};

@Component({
  selector: 'app-kafka-lab',
  standalone: true,
  imports: [FormsModule, ScenarioCard, LabBreadcrumb],
  templateUrl: './kafka-lab.html',
  styleUrl: './kafka-lab.scss',
})
export class KafkaLab {
  stage = signal<KafkaStage>('idle');
  activePartition = signal<number | null>(null);

  mode = signal<LessonMode>('auto');
  speed = signal<Speed>('normal');
  speeds: Speed[] = ['slow', 'normal', 'fast'];

  isRunning = signal(false);
  isPaused = signal(false);
  waitingForNext = signal(false);

  explanation = signal('Click Create Reservation Event to begin the Kafka lesson.');

  quiz = QUIZ;
  quizAnswers = signal<Record<string, number | null>>({});

  finalQuiz = FINAL_QUIZ;

  finalScore = computed(() => {
    const answers = this.quizAnswers();
    return this.finalQuiz.reduce((score, question, i) => {
      const key = this.finalKey(i);
      return answers[key] === question.correct ? score + 1 : score;
    }, 0);
  });

  finalAnsweredCount = computed(() => {
    const answers = this.quizAnswers();
    return this.finalQuiz.filter((_, i) => answers[this.finalKey(i)] != null).length;
  });

  finalKey(i: number): string {
    return `final-${i}`;
  }

  private nextResolver: (() => void) | null = null;

  private readonly scrollTargets: Partial<Record<KafkaStage, string>> = {
    producer: 'producer',
    topic: 'topic',
    partition: 'partition',
    consumer: 'consumer',
    'retry-1': 'retry',
    'retry-2': 'retry',
    'retry-3': 'retry',
    dlq: 'dlq',
    replayed: 'dlq',
  };

  // ---------- guided lesson ----------

  async createReservation() {
    if (this.isRunning()) {
      return;
    }

    this.isRunning.set(true);
    this.isPaused.set(false);
    this.stage.set('idle');
    this.activePartition.set(null);
    this.quizAnswers.set({});

    this.explanation.set('Preparing a new reservation event...');
    await this.wait(this.scaled(900));

    await this.runStage(
      'producer',
      'The producer creates a ReservationCreatedEvent. A producer is the part of the application that sends messages into Kafka.',
      3200,
    );

    await this.runStage(
      'topic',
      'The event is sent to the reservation-created topic. A topic is a named stream that groups related Kafka messages.',
      3200,
    );

    const partition = Math.floor(Math.random() * 3);
    this.activePartition.set(partition);

    await this.runStage(
      'partition',
      `Kafka hashes the message key (the reservation ID) and routes the event to Partition ${partition}. Every event with this same key will always land on Partition ${partition} — that's what gives Kafka per-key ordering.`,
      3600,
    );

    await this.runStage(
      'consumer',
      `A consumer in the email-workers group receives the event from Partition ${partition}. Consumers in the same group share the work — only one of them processes this particular message.`,
      3600,
    );

    await this.runStage(
      'retry-1',
      'The EmailWorker failed — maybe the email provider timed out. The failure looks temporary, so the event is preserved and Retry 1 begins instead of being dropped.',
      3200,
    );

    await this.runStage(
      'retry-2',
      'Retry 1 also failed. Kafka tries the consumer again with backoff rather than immediately discarding the event.',
      3200,
    );

    await this.runStage(
      'retry-3',
      'Retry 2 failed too. This is the final retry before the event is treated as a permanent failure.',
      3200,
    );

    await this.runStage(
      'dlq',
      'All retries failed. The event moves to the reservation-created-dlq topic so engineers can inspect it, fix the underlying problem, and replay it later — instead of the reservation just silently never getting an email.',
      4200,
    );

    this.explanation.set(
      'Lesson complete. The event moved from Producer → Topic → Partition → Consumer → Retry → Dead Letter Queue. Try "Replay from DLQ" below to see why preserving the message mattered.',
    );

    this.isRunning.set(false);
    this.isPaused.set(false);
  }

  async replayFromDlq() {
    if (this.stage() !== 'dlq' || this.isRunning()) {
      return;
    }

    this.isRunning.set(true);

    await this.runStage(
      'replayed',
      'An engineer fixed the email provider and replayed the event from the DLQ. It goes straight back through the same consumer and succeeds this time — the reservation was never lost, just delayed.',
      3200,
    );

    this.explanation.set(
      'Replay complete. This is the entire point of a DLQ: a failure becomes a delay, not data loss.',
    );

    this.isRunning.set(false);
  }

  togglePause() {
    if (!this.isRunning() || this.mode() === 'manual') {
      return;
    }
    this.isPaused.update((paused) => !paused);
  }

  nextStep() {
    if (this.nextResolver) {
      const resolve = this.nextResolver;
      this.nextResolver = null;
      this.waitingForNext.set(false);
      resolve();
    }
  }

  setMode(mode: LessonMode) {
    this.mode.set(mode);
  }

  setSpeed(speed: Speed) {
    this.speed.set(speed);
  }

  restartLesson() {
    this.nextResolver = null;
    this.isRunning.set(false);
    this.isPaused.set(false);
    this.waitingForNext.set(false);
    this.stage.set('idle');
    this.activePartition.set(null);
    this.quizAnswers.set({});

    this.explanation.set('Click Create Reservation Event to begin the Kafka lesson.');
  }

  hasReached(stage: KafkaStage): boolean {
    return STAGE_ORDER.indexOf(this.stage()) >= STAGE_ORDER.indexOf(stage);
  }

  // ---------- quiz ----------

  answerQuiz(key: string, index: number) {
    if (this.quizAnswers()[key] != null) {
      return;
    }
    this.quizAnswers.update((answers) => ({ ...answers, [key]: index }));
  }

  isCorrect(correct: number, index: number): boolean {
    return correct === index;
  }

  wasAnswered(key: string): boolean {
    return this.quizAnswers()[key] != null;
  }

  selectedAnswer(key: string): number | null {
    return this.quizAnswers()[key] ?? null;
  }

  // ---------- consumer scaling sandbox ----------

  sandboxPartitions = [0, 1, 2];
  sandboxConsumerCount = signal(3);

  sandboxAssignment = computed(() => {
    const consumers = this.sandboxConsumerCount();
    const partitions = this.sandboxPartitions.length;
    const active = Math.min(consumers, partitions);

    const assignment: { consumer: number; partition: number | null }[] = [];
    for (let c = 0; c < consumers; c++) {
      assignment.push({ consumer: c, partition: c < partitions ? c : null });
    }

    return {
      assignment,
      idle: consumers - active,
      unassignedPartitions: consumers < partitions ? partitions - consumers : 0,
    };
  });

  adjustConsumers(delta: number) {
    this.sandboxConsumerCount.update((count) => Math.min(6, Math.max(1, count + delta)));
  }

  // ---------- partition key sandbox ----------

  keyInput = signal('');

  keyPartition = computed(() => {
    const key = this.keyInput().trim();
    if (!key) return null;
    return this.hashKeyToPartition(key);
  });

  tryExampleKey(key: string) {
    this.keyInput.set(key);
  }

  private hashKeyToPartition(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return hash % this.sandboxPartitions.length;
  }

  // ---------- scroll ----------

  private scrollToStage(stage: KafkaStage, attempt = 0) {
    const target = this.scrollTargets[stage];
    if (!target) return;

    const el = document.querySelector(`[data-stage="${target}"]`);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // Angular hasn't rendered the newly revealed section yet — retry for a
    // few frames instead of giving up.
    if (attempt < 10) {
      setTimeout(() => this.scrollToStage(stage, attempt + 1), 40);
    }
  }

  // ---------- timing helpers ----------

  private scaled(duration: number): number {
    return Math.round(duration * SPEED_MULTIPLIER[this.speed()]);
  }

  private async runStage(stage: KafkaStage, explanation: string, duration: number) {
    await this.waitWhilePaused();

    this.stage.set(stage);
    this.explanation.set(explanation);
    this.scrollToStage(stage);

    if (this.mode() === 'manual') {
      this.waitingForNext.set(true);
      await new Promise<void>((resolve) => {
        this.nextResolver = resolve;
      });
    } else {
      await this.wait(this.scaled(duration));
    }
  }

  private async wait(duration: number) {
    const tick = 100;
    let elapsed = 0;

    while (elapsed < duration) {
      await this.waitWhilePaused();

      await new Promise<void>((resolve) => {
        setTimeout(resolve, tick);
      });

      if (!this.isPaused()) {
        elapsed += tick;
      }
    }
  }

  private async waitWhilePaused() {
    while (this.isPaused()) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 100);
      });
    }
  }
}
