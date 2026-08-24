# Sprint 41 Academy foundation review

## Scope

This increment introduces the certification-study boundary inside TicketForge. It does not complete server-backed learner profiles, assessment integrity, credentials, or Blueprint OS integration.

## Implemented

- Top-level Academy navigation and responsive-menu entry
- Reusable typed certification path and domain model
- Current, next, and planned certification catalog
- CLF-C02 dashboard with four official weighted domains
- Evidence-oriented 21-day study plan derived from the authored roadmap
- Browser-persisted study-day completion with input validation
- Conservative readiness score that cannot reach 100% from reading completion alone
- AWS Lab Zero for root, daily identity, CLI scope, cost, tags, and cleanup controls
- Cloud Foundations module covering cloud value, AWS geography, shared responsibility, and resilient placement
- Scenario, mental-model, child-explanation, hands-on, and decision-quiz learning sequence
- Certification learning standard and ADR-013

## Architecture findings

- Engineering sprint progress and certification readiness are related but different data models.
- External exam objectives need version governance because codes, weights, and in-scope services change.
- AWS lab safety is a platform concern, not repeated disclaimer text.
- Local browser progress is acceptable for the first private iteration but cannot support portable transcripts, verified evidence, multiple devices, or public credentials.
- Cost budgets and anomaly detection are detective controls; cleanup and least privilege remain necessary.

## Verification evidence

- `npm run build` completed successfully; the Academy styles remain within the component budget. The existing Kafka lab warning is unchanged.
- Desktop browser checks rendered the Academy catalog, four CLF-C02 domains, and all 21 study days.
- A completed study day remained `1 / 21` after reload, then the test state was returned to incomplete.
- Lab Zero returned immediate `Try again.` and `Correct.` explanations for wrong and right quiz choices.
- At a 390 × 844 viewport, the hamburger exposed the Academy route, closed after navigation, and the document remained exactly 390 pixels wide.
- Repository checks found no AWS access-key-shaped value, private key, or generated JavaScript source in the change set.

## Remaining Sprint 41 work

- Authenticated learner profile and server-backed progress
- Module prerequisites and unlock policy
- Evidence submission model
- Credential honesty and issuance policy
- Data lifecycle, privacy, export, and deletion requirements
