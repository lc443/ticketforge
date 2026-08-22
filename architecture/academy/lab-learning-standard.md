# TicketForge Academy lab learning standard

## Goal

Every lab should help a learner answer both “how does this work?” and “when should I choose it?” The Academy uses one repeatable learning loop:

```text
Scenario
  → What is the technology?
  → Why does TicketForge need it?
  → What problem does it solve?
  → What mental model makes the mechanism intuitive?
  → How would we explain it to a child without making it inaccurate?
  → What hands-on evidence proves it?
  → Can the learner defend the decision in a quiz?
```

## Required briefing

Each routed lab renders the shared `TechnologyBrief` component near the beginning of the page. Its content must be specific to the lab:

1. **Scenario** — a concrete TicketForge situation with a customer or operational consequence.
2. **Definition** — what the technology or architecture practice actually is.
3. **Need** — why the current system requires it now.
4. **Solved problem** — the failure, cost, risk, or constraint it addresses.
5. **Mental model** — a memorable analogy that preserves the important mechanism and boundary.
6. **Explain it like I’m a kid** — a short concrete story with minimal jargon that remains technically honest.
7. **Quick check** — three choices, immediate feedback, and an explanation of the decision.

## Quiz quality

Good questions test judgment:

- Which boundary owns the decision?
- What fails if the technology is absent or misconfigured?
- Which signal or invariant matters?
- Why is the selected alternative appropriate now?
- What tradeoff or lifecycle is being protected?

Avoid questions that only ask learners to remember a flag, port, filename, or acronym. Command knowledge belongs in the exercise; architecture knowledge belongs in the decision check.

## Hands-on evidence

The briefing is orientation, not completion. A lab still needs evidence appropriate to its risk: executable commands, simulations, tests, failure drills, measurements, recovery exercises, or architecture artifacts. Existing deeper exercises and quizzes remain valuable and should not be removed simply because the common briefing exists.

## Presentation standard

- Reuse the TicketForge Architecture Lab tokens, typography, spacing, cards, and dark mode.
- Use quiet borders and semantic feedback colors; do not add colored card rails or a separate page visual system.
- Keep code in language-labelled fenced/code blocks.
- Keep the mental model concise enough to remember and technically accurate enough to reuse in an interview.
- Keep the child explanation warm and concrete, never patronizing; use it as a bridge into the precise definition rather than a replacement for it.
- On mobile, stack the three briefing answers while preserving their order and hierarchy.

## Coverage evidence

The initial retrofit covers all 19 routed labs from requirements through Terraform fundamentals. Browser checks proved incorrect and correct quiz feedback on the Terraform lab and correct cache-invalidation feedback on the legacy Redis lab, with no console errors.
