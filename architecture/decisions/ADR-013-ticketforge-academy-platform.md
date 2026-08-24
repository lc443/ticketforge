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
- Store exercise progress in PostgreSQL and derive ownership exclusively from the validated JWT principal.
- Preserve current exercise state plus first, last, and latest-update timestamps; do not delete history when an exercise is unchecked.
- Issue one immutable TicketForge Academy completion record when the server-owned requirement catalog is satisfied.
- Treat evidence review, assessment integrity, downloadable/verifiable credentials, revocation, renewal, and public validation as future platform work.

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
- Progress follows the authenticated learner across browsers and devices and cannot be assigned through a client-supplied user ID.
- Database uniqueness and a per-learner write lock protect exercise and certificate invariants during concurrent requests.
- Completion records are Academy credentials, not claims that an external provider awarded its certification.
- AWS labs need explicit identity, cost, cleanup, and credential-handling standards.
- Official exam changes require curriculum version review.

## Initial success criteria

- Academy hub, CLF-C02 dashboard, Lab Zero, and Cloud Foundations routes load independently.
- Study-day and lab exercise completion survives reload and is returned from the authenticated learner's backend record.
- Mobile and desktop navigation expose Academy correctly.
- Quiz feedback distinguishes correct and incorrect architectural reasoning.
- No lab requests or stores AWS credentials.
