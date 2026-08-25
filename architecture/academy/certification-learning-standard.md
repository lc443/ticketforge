# TicketForge Academy certification learning standard

## Purpose

Certification paths organize official exam objectives, but TicketForge Academy must produce usable engineering judgment rather than isolated memorization. A credential is a milestone; scenarios, labs, failure evidence, cleanup, and architecture defense demonstrate applied understanding.

## Separation of concerns

- **Architecture Engineering labs** follow TicketForge implementation sprints and preserve system evidence.
- **Certification Academy paths** map an external exam blueprint to concepts, practice, remediation, and readiness.
- Certification modules may reference existing sprint evidence, but they do not replace the deeper engineering labs.
- A reusable certification data model holds provider, exam code, level, status, prerequisites, domains, and next action so future paths do not require a new visual system.

## Required learning loop

```text
Scenario
  → Explain it like I’m a kid
  → Precise technical boundary
  → Map to TicketForge
  → Compare alternatives
  → Predict behavior
  → Perform a safe lab
  → Inspect or introduce failure
  → Prove the result
  → Destroy resources
  → Prove absence
  → Explain the decision
  → Answer scenario questions
  → Remediate mistakes
```

## Writing and teaching style

The Certification Academy assumes no programming, cloud, networking, or IT work experience. A learner should never need outside technical knowledge merely to understand the explanation. Hands-on activities may use the AWS Console or commands, but the lesson must teach every required action and must not confuse certification knowledge with application-development skill.

- Introduce ideas in this order: the human or business problem, an everyday comparison, the AWS term, a TicketForge example, nearby choices, guided practice, and exam-style questions.
- Define a term before using it to explain another term. Expand an acronym the first time it appears.
- Use one new idea per paragraph. Prefer ordinary words, then place the precise AWS term beside them.
- Explain what the learner should notice in an exam scenario. Point out clue words and also explain why the tempting alternatives do not fit.
- State whether an activity needs an AWS account, may create a charge, requires code, or is only a written decision exercise.
- Never imply that course completion guarantees an AWS exam pass. Readiness must use fresh practice results, corrected mistakes, and the learner's ability to explain choices.

- Begin with a direct sentence that tells the learner what they will understand or do.
- Use TicketForge as the default application example. Introduce another example only when it explains the boundary better.
- Present a concrete TicketForge problem before introducing a list of services or technical terms.
- Write complete sentences for scenarios, explanations, instructions, and completion criteria. Short labels are appropriate for navigation, status, and scanning.
- Define necessary technical language in plain words. Do not replace a precise term with a vague slogan.
- Tell the learner exactly what an exercise proves. Avoid broad phrases such as “produce evidence” unless the required evidence is named immediately.
- Prefer “TicketForge must survive one Availability Zone failure” over “design for resilience.” The first statement gives the learner a measurable problem.

## AWS account safety gate

No resource-creating AWS lab should precede Lab Zero. The learner must:

1. Protect the root identity with MFA and avoid root access keys.
2. Use a named daily access path with temporary credentials where practical.
3. Verify account, principal, profile, and Region before commands.
4. Configure a cost budget and cost anomaly alerting.
5. Apply the Academy tag contract to supported resources.
6. Record every created resource and dependency.
7. Delete in dependency order and query again to prove absence.

Never ask learners to paste passwords, MFA codes, secret access keys, session tokens, or full credential files into the Academy UI, source control, screenshots, or lab evidence.

## Lab contract

Every resource-creating lab declares:

```yaml
provider: AWS
account-purpose: learning
region: explicit
estimated-cost: bounded estimate
maximum-duration: explicit
required-tags:
  Project: TicketForgeAcademy
  Certification: exam-code
  Lab: lab-id
  Owner: learner
  ExpiresOn: YYYY-MM-DD
cleanup-required: true
```

The lab must contain preflight, prediction, creation, observation, failure or constraint, diagnosis, cleanup, and absence evidence. A successful delete request alone is not cleanup proof.

## Progress and readiness

Reading completion is not certification readiness. The Academy tracks these separately:

- Official domain coverage and weighting
- Concept and service-comparison quiz performance
- Hands-on lab evidence
- Cleanup evidence
- Incorrect-answer classification and remediation
- Timed practice-exam history
- Explanation and architecture-review checkpoints

The initial CLF-C02 gate requires all domains, required labs, service-tradeoff explanations, remediation of recorded weak areas, multiple quality practice scores around 80% or better, and one reviewed timed exam.

## Learner ownership and completion records

- Progress writes derive the learner from the validated authentication principal; clients never select a progress owner.
- One progress row exists per learner, certification, and recognized exercise.
- Unchecking retains the row and historical first/last completion timestamps.
- The current CLF-C02 implementation requires 21 study checkpoints, six Lab Zero controls, and five Cloud Foundations exercises.
- Meeting all 32 current requirements issues one immutable TicketForge Academy completion record.
- A TicketForge completion record is not an AWS certification. Verifiable evidence, review, revocation, renewal, and public validation remain separate credential-governance capabilities.
- See [the learner progress lab](learner-progress-lab.md) for the request flow, schema, commands, and ownership quiz.

## Source governance

- Store the certification code and the official exam guide used for mapping.
- Revalidate certification codes, domains, weights, and in-scope services before publishing a path or after an exam revision.
- Distinguish official objectives from TicketForge's additional practical exercises.
- Do not reproduce proprietary practice exams. Write original scenario questions that teach the same decision boundaries.
