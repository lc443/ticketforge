# Sprint 45 Quiz score history and reset

## Scenario

A learner scores 67%, studies the explanation, resets the form, and later scores 100%. TicketForge must show improvement without deleting the earlier attempt.

## Behavior

- Every submitted attempt remains in PostgreSQL.
- Each module displays the latest score, best score, and number of saved attempts.
- `Reset answers` clears an unfinished selection.
- `Reset quiz` clears the submitted answer state so the learner can retry.
- Reset never calls a delete endpoint and never changes XP or stored attempts.
- Moving between reused `/day/:day` routes reloads history for the new module so scores cannot leak between lesson views.

## Mental model

The quiz form is scratch paper; reset gives you clean scratch paper. Attempt history is the gradebook; it remains intact.

## Verification

The Angular production build passes. The only warning remains the pre-existing Kafka lab stylesheet budget warning.

