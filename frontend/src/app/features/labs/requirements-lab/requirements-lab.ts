// src/app/features/labs/requirements-lab/requirements-lab.ts

import { Component, signal } from '@angular/core';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';

@Component({
  selector: 'app-requirements-lab',
  standalone: true,
  imports: [ScenarioCard, LabBreadcrumb],
  templateUrl: './requirements-lab.html',
  styleUrl: './requirements-lab.scss',
})
export class RequirementsLab {
  quiz = [
    {
      question: 'What separates "I can code" from "I can architect," per this sprint?',
      options: [
        'Writing more lines of code, faster',
        'Being able to trace a technical decision back to a written requirement',
        'Knowing the most frameworks',
      ],
      correct: 1,
    },
    {
      question: 'What is an ADR for?',
      options: [
        'A record of a decision, the alternatives considered, and the tradeoffs accepted',
        'A code style guide',
        'A list of bugs to fix later',
      ],
      correct: 0,
    },
    {
      question: 'Why write RPO/RTO and availability targets before building anything?',
      options: [
        "They don't matter until production",
        'They turn vague goals like "reliable" into numbers you can actually design and test against',
        'They are only needed for AWS billing',
      ],
      correct: 1,
    },
  ];
  quizAnswers = signal<Record<number, number | null>>({});

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
