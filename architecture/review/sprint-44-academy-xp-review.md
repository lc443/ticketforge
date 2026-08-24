# Sprint 44 Academy XP review

## What XP is

XP is a visible learning-motivation score. It answers, “How much verified Academy activity has this learner recorded?” It does not replace readiness, reviewed evidence, a practical exam score, or an AWS certification.

## Point rules

```text
10 XP × each currently completed required exercise
25 XP × each distinct quiz module with at least one passing attempt
```

CLF-C02 currently has 32 required exercises and 21 quiz modules, so the maximum is:

```text
(32 × 10) + (21 × 25) = 845 XP
```

The server derives XP from PostgreSQL records. Quiz retries cannot farm points because the calculation counts distinct passed module IDs. Unchecking an exercise removes its 10 current XP, while historical completion timestamps and quiz attempts remain preserved.

## TicketForge scenario

A learner takes the Day 3 quiz five times and passes three times. Day 3 contributes 25 quiz XP, not 75 XP. The attempt history still shows all five attempts so improvement can be analyzed separately from the motivation score.

## Architecture boundary

Formative quiz results originate in the browser and are not tamper-proof assessment evidence. XP is therefore a motivational indicator. Future competency and practical-exam systems must keep stronger evidence and mastery calculations separate.
