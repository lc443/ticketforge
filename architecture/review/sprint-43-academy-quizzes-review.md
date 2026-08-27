# Sprint 43 Academy formative quizzes

## Problem

One quick-check question can confirm one distinction, but it cannot expose a pattern of weak reasoning. TicketForge also discarded the result after navigation, so a learner could not show improvement over repeated attempts.

## Solution

Every CLF-C02 module now contains a three-question quiz. Questions use TicketForge requirements and AWS service boundaries rather than vocabulary recall. The learner must answer every question before scoring, receives an explanation for every answer, sees a percentage and pass/review result, and can retry.

Each submission creates an immutable `academy_quiz_attempts` row owned by the authenticated JWT learner. The record stores certification, module, correct answers, total questions, server-calculated percentage, pass/fail, and submission time. Previous attempts remain available through the quiz-attempt history endpoint.

```text
POST /api/academy/certifications/aws-clf-c02/quizzes/{moduleId}/attempts
GET  /api/academy/certifications/aws-clf-c02/quiz-attempts
```

## Architecture boundary

These are formative quizzes. Questions and answers are delivered to the browser, so a determined client can inspect them. The backend validates the certification and module, calculates the percentage, and preserves history, but the result is not a secure exam score. A future practical-exam system needs server-owned questions, server-side scoring, attempt timing, versioned rubrics, and stronger assessment integrity.

## Verification

- Angular production build passes.
- Backend test suite passes: 15 tests, zero failures.
- PostgreSQL schema creation includes `academy_quiz_attempts`.
- The server rejects impossible counts and unknown module IDs.
- The existing Kafka stylesheet budget warning remains unchanged.

