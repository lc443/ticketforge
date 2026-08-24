# Sprint 42 CLF-C02 curriculum review

## The sprint

Sprint 42 turns the Cloud Practitioner plan into a complete routed curriculum. Before this sprint, a learner could see all 21 study days, but only the first two destinations contained full instruction. The plan described the destination without providing the road.

## Problem and solution

TicketForge needs to teach a learner how to distinguish AWS services in a scenario, not only expose a list of names. Each day now states what the technology is, why TicketForge needs it, which problem it solves, and where its responsibility ends. One reusable page renders typed content for Days 3–21; the existing specialized Cloud Foundations and Lab Zero pages continue to teach Days 1–2.

The page records completion as `study-day-XX` through the authenticated Academy API. That lets the same learner continue on another browser while preventing one client from choosing another user's identity.

## Curriculum map

| Days | Focus | TicketForge decision |
|---|---|---|
| 1–2 | Cloud foundations and identity safety | Place the system resiliently and use AWS without exposing the account |
| 3–5 | Compute, containers, and storage | Choose where TicketForge runs and where each kind of data belongs |
| 6–7 | Review and remediation | Diagnose a weak concept instead of rereading everything |
| 8–12 | Networking, data, integration, delivery, and governance | Trace a request and assign each operational responsibility to the right service |
| 13–14 | Architecture review and remediation | Defend choices and reject plausible alternatives |
| 15–18 | Security, pricing, cost, and Well-Architected | Protect and govern TicketForge while making cost and quality explicit |
| 19–21 | Timed assessment, remediation, and readiness | Use evidence to make a go/no-go exam decision |

## Learning sequence used by every data-driven lesson

1. Read the direct outcome and TicketForge scenario.
2. Learn the technology's definition, purpose, problem, and mental model.
3. Read the child-friendly explanation without losing the real technical boundary.
4. Compare three services or concepts that are commonly confused.
5. Complete a concrete design, command, calculation, or review exercise.
6. Produce the stated proof.
7. Answer a decision-oriented quiz with immediate feedback.
8. Save completion to the learner record.

The lesson arrows form one continuous route:

```text
Study plan → Lab Zero → Cloud Foundations → Day 3 → … → Day 21 → Study plan
```

Lab Zero is the safety prerequisite, Cloud Foundations is the first certification lesson, and every following page provides both backward and forward navigation. On narrow screens, the two arrows stack vertically instead of compressing the labels.

## Verification

```bash
cd frontend
npm run build
```

The production build completed successfully. The only style-budget warning is the pre-existing Kafka lab stylesheet warning.

A curriculum-integrity check confirmed:

```text
lesson content: 19 ordered, unique days (3-21)
study plan: 21 ordered, unique days (1-21)
```

Route navigation was implemented with reactive route state. This matters because Angular reuses the lesson component when `/day/3` changes to `/day/4`; reading the route only during construction would leave stale Day 3 content on the screen.

Deep-link and source checks confirmed that every arrow target maps to an authenticated Academy route and that Day 21 returns to the study plan.

## Boundaries and next work

- Completion is currently learner-attested.
- Each lesson has one formative decision quiz, not a scored exam bank.
- Evidence text tells the learner what to produce, but evidence upload and reviewer approval come in the competency-and-evidence sprint.
- Timed attempt history, rubrics, domain scoring, and mastery thresholds come in the assessment sprint.
- TicketForge Academy completion is not an AWS-issued certification.
