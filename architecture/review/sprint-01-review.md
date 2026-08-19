SPRINT 1: CONCURRENCY

Problem:

1 ticket remaining.

2 users purchase simultaneously.

Result:

2 reservations.

Ticket oversold.

--------------------------------------------------

Concept:

Race Condition

Multiple transactions modify the same data simultaneously.

--------------------------------------------------

Failed Solution:

synchronized

Reason:

Each API replica has its own JVM.

--------------------------------------------------

Working Solution:

PostgreSQL pessimistic locking.

Reason:

All API replicas share the same database.

--------------------------------------------------

Architecture Principle:

Protect shared data where the shared data lives.

--------------------------------------------------

Question:

Would 100 API replicas prevent overselling?

Answer:

No.

Scaling improves throughput.

Scaling does not guarantee consistency.