# Sprint 8 Review — Distributed Locking

## What it is

A distributed lock coordinates competing processes through an authority they all share. “Distributed” describes the coordination boundary, not a requirement to use Redis.

## TicketForge's problem

NGINX distributes reservations across three JVMs. A local `synchronized` block can coordinate threads inside one API process but cannot stop a second API process from entering its own critical section.

## Solution

TicketForge locks the PostgreSQL event row with `SELECT … FOR UPDATE`. PostgreSQL owns both the lock and the inventory transaction. Competing requests wait; after the winner commits, the next transaction re-reads current inventory and rejects an unavailable ticket.

Redis locking was considered and rejected for this boundary because it would place the lock and protected data in separate systems.

## Real experiment

The `load-tests/reservation-race.js` scenario sent two simultaneous reservation requests for a disposable event with one available ticket through NGINX.

Measured outcome:

| Measurement | Result |
|---|---:|
| Successful reservations | 1 |
| Clean `409` rejections | 1 |
| Reservation rows | 1 |
| Available tickets after test | 0 |
| p95 latency | 261.16 ms |

## Architecture principle

> Protect shared data where the shared data lives, and do not add a second lock authority without a problem that requires it.

## Tradeoff

Pessimistic locking provides straightforward correctness under heavy contention, but serializes reservations for the same event. A future experiment should measure lock-wait time and compare optimistic locking or admission queues if tail latency becomes unacceptable.

## Decision

ADR-002 accepts PostgreSQL row locking and rejects JVM-local and redundant Redis inventory locks for the current architecture.
