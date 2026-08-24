import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../../core/http/api-error';
import { AcademyProgressService } from '../../../core/services/academy-progress.service';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { TechnologyBrief } from '../../../shared/components/technology-brief/technology-brief';
import { AcademyQuiz, AcademyQuizQuestion } from '../../../shared/components/academy-quiz/academy-quiz';

@Component({ selector: 'app-cloud-foundations', standalone: true, imports: [RouterLink, ScenarioCard, TechnologyBrief, AcademyQuiz], templateUrl: './cloud-foundations.html', styleUrl: './cloud-foundations.scss' })
export class CloudFoundations implements OnInit {
  private readonly certificationId = 'aws-clf-c02';
  private readonly exerciseIds = [
    'cloud-foundations-cloud-value', 'cloud-foundations-global-infrastructure',
    'cloud-foundations-cli-regions', 'cloud-foundations-shared-responsibility',
    'cloud-foundations-architecture-defense',
  ];
  readonly exerciseCount = 5;
  readonly completed = signal<Set<number>>(new Set());
  readonly answer = signal<string | null>(null);
  readonly syncError = signal<string | null>(null);
  readonly progress = computed(() => Math.round(this.completed().size / this.exerciseCount * 100));
  readonly quizQuestions: AcademyQuizQuestion[] = [
    { question: 'Two API instances run in one Availability Zone. What failure can still stop both?', options: ['One instance process failure only', 'The shared Availability Zone failure', 'A CloudFront cache miss'], correct: 'b', explanation: 'Instance redundancy inside one AZ does not remove the shared AZ failure domain.' },
    { question: 'Which statement describes elasticity?', options: ['Capacity expands and contracts with demand', 'Every workload runs in three Regions', 'AWS owns all customer data permissions'], correct: 'a', explanation: 'Elasticity changes capacity with demand; it is not the same as availability or shared responsibility.' },
    { question: 'Who configures TicketForge IAM permissions when using Amazon S3?', options: ['AWS alone', 'The customer', 'The edge location'], correct: 'b', explanation: 'AWS secures the cloud infrastructure; the customer owns identities, access, data, and workload configuration.' },
  ];

  constructor(private academyProgress: AcademyProgressService) {}

  ngOnInit(): void { this.loadProgress(); }
  toggleExercise(step: number): void {
    const completed = !this.completed().has(step);
    this.syncError.set(null);
    this.academyProgress.setExercise(this.certificationId, this.exerciseIds[step - 1], completed).subscribe({
      next: (progress) => this.applyProgress(progress.exercises.filter((item) => item.completed).map((item) => item.exerciseId)),
      error: (error) => this.syncError.set(apiErrorMessage(error, 'Could not save your exercise completion.')),
    });
  }
  selectAnswer(answer: string): void { this.answer.set(answer); }

  private loadProgress(): void {
    this.academyProgress.getProgress(this.certificationId).subscribe({
      next: (progress) => this.applyProgress(progress.exercises.filter((item) => item.completed).map((item) => item.exerciseId)),
      error: (error) => this.syncError.set(apiErrorMessage(error, 'Could not load your exercise completion.')),
    });
  }
  private applyProgress(ids: string[]): void {
    this.completed.set(new Set(this.exerciseIds.map((id, index) => ids.includes(id) ? index + 1 : 0).filter(Boolean)));
  }
}
