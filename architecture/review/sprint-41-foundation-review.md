# Sprint 41 Academy foundation review

## Scope

This increment introduces the certification-study boundary and authenticated learner progress inside TicketForge. It does not complete assessment integrity, evidence review, verifiable public credentials, or Blueprint OS integration.

## Implemented

- Top-level Academy navigation and responsive-menu entry
- Reusable typed certification path and domain model
- Current, next, and planned certification catalog
- CLF-C02 dashboard with four official weighted domains
- Evidence-oriented 21-day study plan derived from the authored roadmap
- Server-persisted study-day and lab completion assigned from the JWT principal
- Historical first/last completion timestamps retained when current status changes
- Server-owned 32-exercise CLF-C02 requirement catalog
- Idempotent TicketForge Academy certificate-of-completion issuance
- Conservative readiness score that cannot reach 100% from reading completion alone
- AWS Lab Zero for root, daily identity, CLI scope, cost, tags, and cleanup controls
- Cloud Foundations module covering cloud value, AWS geography, shared responsibility, and resilient placement
- Scenario, mental-model, child-explanation, hands-on, and decision-quiz learning sequence
- Certification learning standard and ADR-013

## Architecture findings

- Engineering sprint progress and certification readiness are related but different data models.
- External exam objectives need version governance because codes, weights, and in-scope services change.
- AWS lab safety is a platform concern, not repeated disclaimer text.
- Authenticated database progress supports multiple devices, but self-attested checkboxes are not verified evidence.
- Academy completion and official external certification are different claims and must remain visibly separate.
- Cost budgets and anomaly detection are detective controls; cleanup and least privilege remain necessary.

## Verification evidence

- `npm run build` completed successfully; the Academy styles remain within the component budget. The existing Kafka lab warning is unchanged.
- Desktop browser checks rendered the Academy catalog, four CLF-C02 domains, and all 21 study days.
- A completed study day remained `1 / 21` after reload, then the test state was returned to incomplete.
- Lab Zero returned immediate `Try again.` and `Correct.` explanations for wrong and right quiz choices.
- At a 390 × 844 viewport, the hamburger exposed the Academy route, closed after navigation, and the document remained exactly 390 pixels wide.
- Repository checks found no AWS access-key-shaped value, private key, or generated JavaScript source in the change set.
- Four Academy service tests verify authenticated ownership, exercise allowlisting, final-requirement issuance, and no certificate reissuance; ten existing event-service tests also pass.
- The production frontend build and backend package complete successfully; only the pre-existing Kafka stylesheet warning remains.
- The rebuilt shared API image was applied to `api1`, `api2`, and `api3`; all three replicas became healthy and returned the same structured `401` from the Academy endpoint without a token.
- PostgreSQL contains `academy_exercise_progress` and `academy_certificates` after application startup.
- Browser verification confirmed `/academy` remains public while a signed-out request for the tracked CLF-C02 path redirects to `/login`.

## Remaining Sprint 41 work

- Module prerequisites and unlock policy
- Evidence submission model
- Downloadable verification, administrative review, renewal, and revocation
- Data lifecycle, privacy, export, and deletion requirements
