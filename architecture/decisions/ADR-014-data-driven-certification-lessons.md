# ADR-014: Data-driven certification lessons

- Status: Accepted
- Date: 2026-08-24
- Sprint: 42

## Context

The CLF-C02 study plan listed 21 days, but only Cloud Foundations and Lab Zero had full lesson pages. The other days described what to study without teaching it. Building 19 unrelated Angular pages would duplicate progress loading, quiz behavior, navigation, layout, and error handling. That duplication would make later certification paths slow to author and easy to make inconsistent.

## Decision

- Keep Cloud Foundations and Lab Zero as specialized lessons because they contain multi-step exercises and AWS account-safety controls.
- Define Days 3–21 as typed curriculum records in `clf-c02-lessons.ts`.
- Render those records with one reusable, authenticated Angular lesson component.
- Give every lesson a direct definition, a TicketForge scenario, the problem it solves, a mental model, a child-friendly explanation, three important service boundaries, one concrete exercise, required proof, and one decision-oriented quiz.
- Store lesson completion through the existing Academy API as `study-day-03` through `study-day-21` under the authenticated learner.
- React to route-parameter changes so previous/next navigation cannot show stale lesson content.
- Keep completion self-attested for now. Reviewed evidence and scored assessment attempts remain separate platform capabilities.

## Alternatives

### Create one Angular component for every day

Rejected. The content differs, but the learning and persistence behavior does not. Nineteen components would multiply maintenance without adding a useful architectural boundary.

### Keep the remaining days as checklist descriptions

Rejected. A checklist can organize learning, but it does not explain service boundaries, create practice evidence, or test a decision.

### Put the curriculum only in Markdown

Rejected as the learner experience. Markdown remains useful for architecture records, but it cannot share authenticated progress and immediate quiz feedback with the Academy UI.

## Consequences

- All 21 CLF-C02 days now lead to complete lesson experiences.
- New lessons can be authored without duplicating Angular state and persistence logic.
- A schema change to the lesson model affects every data-driven lesson and therefore requires a production build plus curriculum-integrity checks.
- The single-question lesson quizzes teach one important distinction; they do not replace a scored practice-exam bank.
- A checked lesson proves learner attestation, not independent review of the submitted artifact.

