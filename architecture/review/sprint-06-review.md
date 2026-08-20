# Kafka Review - TicketForge

## The Problem

```text
Reservation created
        ↓
Email
        ↓
Analytics
        ↓
Invoice
        ↓
Response
```

If one downstream service is slow or unavailable, the entire request can be delayed or fail.

---

## The Solution

```text
ReservationService
        ↓
ReservationProducer
        ↓
Kafka Topic
        ↓
Consumers
```

Kafka decouples the reservation request from downstream processing.

---

## Core Architecture

```text
ReservationCreatedEvent
        ↓
ReservationProducer
        ↓
reservation-created
        ↓
Partitions
        ↓
Consumer Groups
        ↓
Workers
```

---

## Concept 1: Producer

A producer sends events to Kafka.

```java
kafkaTemplate.send(
    "reservation-created",
    event.reservationId().toString(),
    event
);
```

In TicketForge:

```text
ReservationProducer
        ↓
ReservationCreatedEvent
        ↓
Kafka
```

---

## Concept 2: Topic

A topic is a named stream of related messages.

```text
reservation-created
```

All reservation-created events are published to this topic.

---

## Concept 3: Partition

A topic can be split into partitions.

```text
reservation-created

├── Partition 0
├── Partition 1
└── Partition 2
```

Partitions allow Kafka to process messages in parallel.

The producer sends a message key:

```java
event.reservationId().toString()
```

Kafka uses the key to determine the partition.

---

## Concept 4: Consumer

A consumer reads events from Kafka.

```java
@KafkaListener(
    topics = "reservation-created",
    groupId = "email-workers"
)
public void consume(ReservationCreatedEvent event) {
    // process event
}
```

In TicketForge:

```text
Kafka
  ↓
EmailWorker
```

---

## Concept 5: Consumer Groups

Consumers in the same group share the work.

```text
Consumer Group: email-workers

API-1
API-2
API-3
```

For one message:

```text
Same group
    ↓
Only one consumer processes the message
```

Different groups each receive the event independently.

```text
reservation-created
        ↓
 ┌──────┼────────┐
 ↓      ↓        ↓
Email  Analytics Invoice
Group   Group     Group
```

---

## Concept 6: Partitions and Consumer Scaling

```text
3 partitions
+
3 consumers
=
up to 3 consumers working in parallel
```

But:

```text
1 partition
+
3 consumers
=
1 active consumer
2 idle consumers
```

A partition can only be owned by one consumer in the same consumer group at a time.

---

## Concept 7: Retry

Some failures are temporary.

```text
EmailWorker
    ↓
Failure
    ↓
Retry 1
    ↓
Retry 2
    ↓
Retry 3
```

Retries give transient failures time to recover.

---

## Concept 8: Dead Letter Queue

If all retries fail:

```text
reservation-created
        ↓
Retries exhausted
        ↓
reservation-created-dlq
```

The failed event is preserved instead of being silently lost.

---

## Architecture Principle

```text
Do not make the user request wait for work
that can safely happen asynchronously.
```

Kafka helps decouple services and move slow or failure-prone work off the request path.

---

## Important Trade-Off

Kafka improves decoupling and scalability, but introduces new problems:

```text
Duplicate delivery
Ordering
Retries
DLQ management
Idempotency
Data consistency
Observability
```

Kafka does not remove complexity.

It moves complexity from synchronous service calls into event-driven coordination.

---

## Architecture Scenario

A customer reserves a ticket.

The reservation must trigger:

```text
Email confirmation
Analytics update
Invoice generation
```

### Without Kafka

```text
Reservation API
    ↓
Email
    ↓
Analytics
    ↓
Invoice
    ↓
Response
```

One failure can affect the entire request.

### With Kafka

```text
Reservation API
    ↓
Save reservation
    ↓
Publish ReservationCreatedEvent
    ↓
Return response

Meanwhile:

Kafka
├── Email Worker
├── Analytics Worker
└── Invoice Worker
```

---

## Quiz

### 1. What does a Kafka producer do?

```text
A. Stores relational data
B. Sends messages to Kafka
C. Processes consumer groups
```

Answer:

```text
B
```

### 2. What is a topic?

```text
A. A named stream of related messages
B. A database table
C. An API endpoint
```

Answer:

```text
A
```

### 3. Why do partitions exist?

```text
A. Authentication
B. Parallelism and scalability
C. Password storage
```

Answer:

```text
B
```

### 4. Three consumers are in the same consumer group. One message arrives. How many consumers process it?

```text
A. 1
B. 2
C. 3
```

Answer:

```text
A
```

### 5. What happens when consumers use different group IDs?

```text
Each consumer group can independently receive the event.
```

### 6. Why use retries?

```text
To recover from temporary failures.
```

### 7. Why use a DLQ?

```text
To preserve messages that cannot be processed successfully.
```

### 8. If a topic has 3 partitions and a group has 10 consumers, how many consumers can actively process that topic at once?

```text
3
```

---

## Concepts Learned

```text
Event-driven architecture
Asynchronous processing
Producer
Consumer
Topic
Partition
Message key
Consumer group
Parallel processing
Retry
Dead Letter Queue
Service decoupling
```

---

## Sprint Takeaway

```text
Producer sends events.

Topics organize events.

Partitions scale event processing.

Consumer groups share work.

Retries handle temporary failures.

DLQs preserve permanent failures.
```

---

## What Comes Next

Kafka can deliver the same message more than once.

That introduces the next problem:

```text
Duplicate message
        ↓
Duplicate side effect
```

The next concept is:

```text
Idempotency
```
