# ADR-013: TicketForge Academy certification platform

- Status: Accepted
- Date: 2026-08-24
- Sprint: 41

## Context

TicketForge already teaches architecture by building and breaking a real system. A new Cloud Practitioner roadmap introduces certification preparation, and more certifications will follow. Adding every credential as an unrelated page would duplicate layout, progress logic, safety guidance, and readiness definitions. Mixing certification checklists into engineering sprint labs would also confuse exam coverage with implementation evidence.

## Decision

- Add `/academy` as a top-level application area beside Labs and Roadmap.
- Preserve existing engineering labs and introduce certification paths as a connected but distinct track.
- Represent certification metadata and official domains through a reusable typed data model.
- Start with AWS Certified Cloud Practitioner CLF-C02, followed by Solutions Architect Associate.
- Map CLF-C02 progress to the four official weighted domains.
- Convert the authored 21-day roadmap into an interactive, evidence-oriented study plan.
- Require Lab Zero before AWS resource-creating exercises.
- Add one initial Cloud Foundations module to prove the shared teaching pattern.
- Store early progress locally in the learner's browser; treat server-synchronized profiles, assessment integrity, and portable credentials as future platform work.

## Alternatives

### Add certification cards to the existing Labs page

Rejected. Sprint labs describe implementation history, while certification paths describe external blueprint coverage and assessment readiness. Combining them obscures both models.

### Build only a static Markdown study guide

Rejected as the final experience. The source roadmap is valuable, but static text cannot expose weighted progress, next action, readiness gates, interactive quizzes, or later evidence tracking.

### Create a separate application

Deferred. One TicketForge shell lets certification learning reference the system and its labs directly. A separate product boundary may become appropriate when authentication, credentials, organizations, or public learners require independent scale and ownership.

## Consequences

- New certification paths can reuse navigation, status, domain, and card structures.
- The Academy can map certification concepts directly to TicketForge evidence.
- Local progress is simple and private but is tied to one browser and is not yet auditable.
- AWS labs need explicit identity, cost, cleanup, and credential-handling standards.
- Official exam changes require curriculum version review.

## Initial success criteria

- Academy hub, CLF-C02 dashboard, Lab Zero, and Cloud Foundations routes load independently.
- The 21-day plan preserves completion after reload.
- Mobile and desktop navigation expose Academy correctly.
- Quiz feedback distinguishes correct and incorrect architectural reasoning.
- No lab requests or stores AWS credentials.
