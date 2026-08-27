# Academy learner progress and completion records lab

## Scenario

Leron completes Lab Zero on a laptop and opens TicketForge on another device. The Academy must recognize the same learner, restore completed exercises, and eventually record path completion without trusting a user ID sent by the browser.

## What is the technology?

Authenticated progress tracking is a server-side record that joins a learner identity, certification path, exercise, current completion state, and timestamps. Certificate issuance is a separate immutable record created only when the path's completion invariant is true.

## Why does TicketForge need it?

Browser storage belongs to a device, not a person. Server records make progress portable, queryable, and assignable to the authenticated learner. A separate certificate record preserves the exact completion event instead of recalculating history differently on every page load.

## What problem does it solve?

It prevents lost progress, client-supplied ownership, duplicate certificates, unknown exercise IDs, and the false claim that a browser checkbox is an official AWS credential.

## Mental model

The JWT is the learner's named library card. Each exercise row is a stamped page in that learner's private workbook. When every required page has a current stamp, the librarian creates one numbered TicketForge completion record.

## Explain it like I'm a kid

Imagine every student has their own sticker book at school. You cannot write another student's name on your page. The teacher looks at your school badge, opens your book, and saves every sticker. When all the required sticker spaces are filled, the teacher writes one graduation number in a separate book that is never erased by accident.

## Data model

```text
users
  1 ─── * academy_exercise_progress
  1 ─── * academy_certificates

academy_exercise_progress unique key:
  user_id + certification_id + exercise_id

academy_certificates unique keys:
  user_id + certification_id
  certificate_number
```

`first_completed_at` proves when the exercise was first completed. `last_completed_at` records the latest completion. `updated_at` records the latest state change. Unchecking changes `completed` but does not delete the row or its historical completion timestamps.

## Request flow

```text
Browser
  → Authorization: Bearer <JWT>
  → JwtAuthenticationFilter validates token and extracts email
  → Principal supplies authenticated email to AcademyProgressController
  → service locks that user's row
  → service validates certification and exercise against the server catalog
  → progress row is inserted or updated
  → service checks all 32 CLF-C02 requirements
  → one TicketForge Academy certificate is issued if eligible
  → current learner progress is returned
```

The request body contains only the desired state:

```json
{
  "completed": true
}
```

It intentionally does not contain `userId` or `email`.

## API exercises

Sign in first, then use a token from the local TicketForge login response without committing or sharing it.

```bash
curl --request GET \
  --header "Authorization: Bearer YOUR_LOCAL_TOKEN" \
  http://localhost:8080/api/academy/certifications/aws-clf-c02/progress
```

```bash
curl --request PUT \
  --header "Authorization: Bearer YOUR_LOCAL_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{"completed":true}' \
  http://localhost:8080/api/academy/certifications/aws-clf-c02/exercises/study-day-01
```

Try an unknown ID and verify that the server returns `400 Bad Request` without creating a row:

```bash
curl --request PUT \
  --header "Authorization: Bearer YOUR_LOCAL_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{"completed":true}' \
  http://localhost:8080/api/academy/certifications/aws-clf-c02/exercises/not-a-real-exercise
```

## Completion invariant

CLF-C02 currently requires:

```text
21 study-day checkpoints
 6 Lab Zero controls
 5 Cloud Foundations exercises
──
32 required exercise records
```

The certificate is a **TicketForge Academy Certificate of Completion**. It is not an AWS-issued certification. Sprint 44 remains responsible for evidence manifests, downloadable documents, verification, renewal, and revocation.

## Quiz

Two learners send `userId: 7` in a completion request. Which boundary should decide ownership?

- A. Trust the submitted user ID because it came from the UI.
- B. Resolve the user from the validated JWT principal and ignore client-selected ownership.
- C. Store one shared progress row for both learners.

Correct answer: **B**. Authorization identity comes from the validated security context. Client input may select an allowed exercise and desired state, but it must not select the owner.
