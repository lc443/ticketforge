# TicketForge working agreement

## Goal

TicketForge is a hands-on Solutions Architect curriculum, not only an application implementation. Optimize the work for learning how to discover requirements, make architecture decisions, defend tradeoffs, validate behavior, and communicate designs.

## Sprint workflow

- Use branches named `sprint-00-{title}` with the correct chronological sprint number and a short kebab-case title. Never use a `codex/` prefix.
- Before implementation, explain what the sprint is, the business/technical problem, the architecture concerns, the proposed solution, alternatives, and important tradeoffs.
- Explain meaningful implementation actions and discoveries while working so the user understands the concepts.
- Reuse the established TicketForge UI design system and neighboring page patterns. Do not invent a separate page-specific visual language.
- Use actual commands in educational labs; aliases may be documented separately as optional shortcuts.
- Verify behavior in proportion to risk, including failure paths and invariants rather than only successful compilation.
- Add or update a lab, architecture review/ADR/runbook as appropriate, and the roadmap for each completed sprint.
- Mark roadmap work complete only after implementation and verification are complete.

## Solutions Architect emphasis

- Translate feature requests into lifecycle, security, data, integration, operability, reliability, cost, compliance, and migration questions where relevant.
- Make requirements and assumptions explicit. Include measurable non-functional requirements when the decision depends on them.
- Compare viable alternatives and document why the selected option fits TicketForge's current constraints.
- Prefer evidence such as tests, load measurements, failure drills, restore exercises, health checks, cost estimates, and architecture reviews.
- Maintain the roadmap as a living curriculum. Add missing architect competencies instead of treating the current list as fixed.
- Produce artifacts appropriate to the decision: ADRs, C4 diagrams, sequence diagrams, data flows, threat models, capacity models, cost models, runbooks, DR plans, migration plans, and review presentations.
