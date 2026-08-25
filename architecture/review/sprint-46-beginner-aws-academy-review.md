# Sprint 46 review: Beginner-first AWS Academy

## Problem

The curriculum was complete, but its first explanation often assumed that the learner already understood software architecture language. A person entering technology could meet terms such as failure domain or service boundary before understanding the ordinary problem behind them.

## Decision

Teach every certification lesson with a zero-assumption sequence:

```text
Human or business problem
  → everyday comparison
  → AWS term in plain language
  → TicketForge example
  → nearby choices and their differences
  → guided practice
  → exam-style scenario and explanation
```

Cloud Practitioner lessons state that programming experience is not required. The dashboard explains domains as groups of related questions, puts conceptual Cloud Foundations before account setup, and distinguishes reading completion from demonstrated readiness. Quiz introductions teach learners to find scenario clues and treat wrong answers as feedback.

## Tradeoffs

- Plain language adds page length, but removes hidden prerequisites.
- Everyday comparisons build a mental model; precise AWS boundaries remain beside them.
- TicketForge remains the consistent scenario, while lessons start with the business need rather than application code.
- The Academy prepares learners and records readiness evidence, but does not guarantee an AWS exam result.

## Verification target

- The Academy catalog welcomes learners without technical experience.
- The CLF-C02 dashboard explains the sequence and exam domains in ordinary language.
- Every shared lesson defines choices, includes guided practice, and provides exam feedback.
- Lab Zero and Cloud Foundations explain their purpose before commands or architecture terminology.
- Desktop and mobile layouts preserve the TicketForge lab design system.
