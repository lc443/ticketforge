# TicketForge
### A Hands-On Solutions Architecture Curriculum

> **How this document works:** You gave me two drafts of this — a narrative pitch and a formal README — covering the same project with two slightly different level numberings. This merges them into one document, using the README's more granular 9-level structure (it splits "Containers/CI-CD" from "Kubernetes," and merges the old Level 3/4 into one "Distributed Systems" level). Every sprint keeps its original topic list, then adds two things: a short **Why it matters**, and a **Real-world example** — a verified, real incident or practice that shows the concept isn't academic. Neither section answers the open questions the roadmap poses on purpose (Sprint 1's monolith question, Sprint 8's locking question, Sprint 26's EKS question). Those are still yours to work through when you get there.

---

## Contents

- [Mission](#mission)
- [The Application](#the-application)
- [The Core Problem](#the-core-problem)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Initial Architecture (v1)](#initial-architecture-v1)
- [How Sessions Work](#how-sessions-work)
- [Progress Tracker](#progress-tracker)
- [Level 1: Build a Real Application](#level-1-build-a-real-application)
- [Level 2: Performance & Scaling](#level-2-performance--scaling)
- [Level 3: Distributed Systems](#level-3-distributed-systems)
- [Level 4: Containers & CI/CD](#level-4-containers--cicd)
- [Level 5: Kubernetes](#level-5-kubernetes)
- [Level 6: Infrastructure as Code](#level-6-infrastructure-as-code)
- [Level 7: AWS Solutions Architecture](#level-7-aws-solutions-architecture)
- [Level 8: Reliability](#level-8-reliability)
- [Level 9: Solutions Architect Mode](#level-9-solutions-architect-mode)
- [Architecture Documentation Practice](#architecture-documentation-practice)
- [Success Criteria](#success-criteria)

---

## Mission

Learn Solutions Architecture by building a small but realistic application that evolves from a simple monolith into a cloud-native, distributed system.

Every technology introduced into TicketForge must solve a real problem. Nothing gets added because it's popular — Kafka, Redis, Kubernetes, and Terraform only show up once the application has actually hit the wall that each one exists to solve.

**Learning workflow, every sprint:**

1. Define the business problem.
2. Identify the architectural challenge.
3. Design the solution.
4. Implement the solution.
5. Break the solution.
6. Observe system behavior.
7. Improve the implementation.
8. Document architectural decisions.
9. Answer interview questions.

---

## The Application

```
User
  │
  ▼
Browse Events
  │
  ▼
View Ticket Availability
  │
  ▼
Reserve Ticket
  │
  ▼
Purchase Ticket
  │
  ▼
Receive Confirmation
```

**Users can:**
- Register / log in
- Browse events
- View ticket inventory for an event
- Reserve a ticket
- Purchase a ticket
- View their purchased tickets

**Admins can:**
- Create events
- Create and manage ticket inventory
- View purchases

---

## The Core Problem

```
Event: UFC Fight Night
Tickets remaining: 1

Customer A ───┐
              ├──▶ PostgreSQL
Customer B ───┘

Without protection:
  Customer A buys ✓
  Customer B buys ✓
  Tickets sold: 2      ← oversold
```

Almost everything past Sprint 6 exists because of this one scenario. Transactions, race conditions, optimistic/pessimistic locking, distributed locks, Kafka, idempotency, caching, rate limiting, horizontal scaling, Kubernetes, Terraform, AWS, observability, and disaster recovery are all, one way or another, answers to "who gets the last ticket."

**Real-world example:** Airlines solve a version of this problem every day, on purpose. They oversell seats using a probabilistic model, betting that some ticketed passengers won't show up. Most of the time the bet is invisible. Occasionally it isn't — most infamously in April 2017, when a paying, seated passenger on a United Express flight was forcibly removed after the flight was oversold, which became national news and a costly settlement. The airline industry decided that risk was worth the revenue. TicketForge's whole premise is that a ticketing platform doesn't get to make that same trade — tickets can't be oversold, full stop — and that constraint is what makes the rest of this roadmap necessary rather than optional.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21, TypeScript, SCSS, Signals |
| Backend | Java 21, Spring Boot 3, Spring Security, JWT, Spring Data JPA |
| Data | PostgreSQL, Redis |
| Messaging | Apache Kafka |
| Containers | Docker, Docker Compose |
| Orchestration | Kubernetes, Minikube, Helm |
| Infrastructure as Code | Terraform |
| Cloud | AWS |
| Observability | Micrometer, Prometheus, Grafana, OpenTelemetry |

---

## Repository Structure

```
ticketforge/
├── frontend/
├── backend/
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   ├── helm/
│   └── terraform/
├── architecture/
│   ├── requirements/
│   ├── decisions/
│   ├── diagrams/
│   ├── security/
│   ├── reliability/
│   ├── cost/
│   └── runbooks/
├── platform/
│   ├── kafka/
│   ├── redis/
│   ├── prometheus/
│   ├── grafana/
│   └── otel/
├── load-tests/
├── chaos/
├── scripts/
└── .github/
    └── workflows/
```

---

## Initial Architecture (v1)

```
┌───────────────┐
│  Angular 21   │
└───────┬───────┘
        │ HTTP
        ▼
┌───────────────┐
│  Spring Boot  │
│  (Modular     │
│   Monolith)   │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  PostgreSQL   │
└───────────────┘
```

No Kafka. No Redis. No Kubernetes. No microservices. No Terraform. Not yet — every one of those gets earned in a later sprint, not bolted on up front.

---

## How Sessions Work

The rule that makes this different from a typical tutorial: you won't be told *"today we're learning Kafka, add Kafka."*

Instead, you'll get something like:

> *Ticket purchases take six seconds because email, ticket generation, analytics, and notifications all happen inside the HTTP request. How would you improve this architecture?*

You propose something. It gets challenged. Only then do you build it — and by Level 9, the roles flip: TicketForge presents requirements like a customer or an architecture review board, and you design, defend, and get challenged on the whole system. That's deliberate. It's the difference between knowing a technology exists and being able to justify choosing it in front of people who disagree with you.

---

## Progress Tracker

- [ ] **Sprint 0** — Requirements & Initial Architecture *(up next)*
- [ ] **Sprint 1** — Modular Monolith
- [ ] **Sprint 2** — Authentication & Security
- [ ] **Sprint 3** — Load Testing
- [ ] **Sprint 4** — Horizontal Scaling
- [ ] **Sprint 5** — Redis Caching
- [ ] **Sprint 6** — Rate Limiting
- [ ] **Sprint 7** — Concurrency & Overselling
- [ ] **Sprint 8** — Distributed Locking
- [ ] **Sprints 9–14** — Kafka & Event-Driven Architecture
- [ ] **Sprints 15–16** — Docker & CI/CD
- [ ] **Sprints 17–21** — Kubernetes & Helm
- [ ] **Sprints 22–24** — Terraform
- [ ] **Sprints 25–28** — AWS Architecture
- [ ] **Sprints 29–31** — Observability & Reliability
- [ ] **Sprint 32+** — Solutions Architect Challenges

This restarts tracking from zero — it doesn't inherit ScaleLab's completion status.

---

## Level 1: Build a Real Application

### Sprint 0: Requirements & Initial Architecture

**Topics:** functional requirements, non-functional requirements, architecture constraints, assumptions, availability, latency, throughput, RPO/RTO, architecture diagrams, ADRs

**Deliverables:** TicketForge requirements doc, system context diagram, initial architecture diagram, ADR-001 ("Why Modular Monolith")

**Why it matters:** This is the sprint that separates "I can code" from "I can architect." Every technical decision later in this roadmap gets justified by tracing back to a requirement written here — that's also exactly the muscle a real Solutions Architect interview tests.

**Real-world example:** Amazon's internal process for greenlighting a new project famously runs on a written narrative document and a requirements-driven "working backwards" memo — not a slide deck. Nothing gets built until that document survives scrutiny. Sprint 0 is the same discipline at a much smaller scale: the requirements exist in writing before a line of code does.

### Sprint 1: Modular Monolith

**Modules:** auth, events, inventory, reservations, orders

**Topics:** REST, controllers, services, repositories, transactions, entity relationships, indexes, modular architecture, database design

```
Angular
   │
   ▼
Spring Boot (modular monolith)
   │
   ▼
PostgreSQL
```

**Open question — yours to answer, not mine:** Why shouldn't TicketForge start with microservices?

**Real-world example:** Shopify is the textbook counter-example to "microservices by default." Publicly, they've kept a single, well-modularized monolith at a scale that absorbs enormous simultaneous flash-sale traffic (their Black Friday / Cyber Monday peak), splitting out standalone services only where a boundary had actually earned it. Worth having a real, specific answer ready before an interviewer asks you this, because "microservices scale better" alone won't hold up.

### Sprint 2: Authentication & Security

**Build:** login, JWT, ADMIN/CUSTOMER roles, authorization

**Topics:** authentication, authorization, JWT, OAuth/OIDC concepts, password security, CORS, CSRF, RBAC

**Why it matters:** Broken authentication and authorization consistently rank at or near the top of OWASP's API security risk list — this isn't a checkbox sprint, it's one of the highest-frequency real vulnerability classes in production systems.

**Real-world example:** A well-known JWT footgun is the "`alg: none`" class of bugs — libraries that trusted the algorithm named *inside* the token itself let an attacker hand back an unsigned token and have it accepted as valid. It's a good illustration of why you verify the signing algorithm server-side rather than trusting anything the client claims about itself. Later in the roadmap you'll compare what you build here against a managed identity provider like AWS Cognito.

---

## Level 2: Performance & Scaling

### Sprint 3: Load Testing

**Topics:** throughput, latency, bottleneck identification. Generate load at 10 / 100 / 1,000 / 5,000 users. Measure requests/sec, p50/p95/p99 latency, CPU, memory, DB connections, error rate.

**Rule:** measure before optimizing.

**Real-world example:** HealthCare.gov's October 2013 launch is the canonical cautionary tale here. The site buckled under real user traffic that had never been properly load-tested at that scale beforehand, and it became a national story. The lesson wasn't "the code was bad" — it was that nobody had measured what would actually happen under real load before it mattered.

### Sprint 4: Horizontal Scaling

```
                 ┌── API #1 ──┐
Angular → NGINX ─┼── API #2 ──┼──▶ PostgreSQL
                 └── API #3 ──┘
```

Kill API #2. TicketForge keeps working.

**Topics:** stateless applications, load balancing, health checks, failover, replicas

**Why it matters:** Statelessness isn't an optimization bolted on later — it's the prerequisite that makes horizontal scaling, and cloud autoscaling generally, possible at all. If a server holds session state in memory, you can't just kill it and expect nothing to break. This is exactly why cloud-native fleets are built from disposable, interchangeable instances behind a load balancer, each one expected to die and get replaced without anyone noticing.

### Sprint 5: Redis Cache

```
API
 ├── Redis
 └── PostgreSQL
```

**Topics:** cache-aside, TTL, cache hits, cache misses, invalidation, stale data, cache stampede. Measure p95 with vs. without Redis.

**Real-world example:** Facebook's widely-cited "Scaling Memcache at Facebook" engineering paper described a caching fleet absorbing billions of read requests per second, specifically to protect the database tier underneath it. It's the same cache-aside pattern you're implementing here, just at a scale most systems never need to reach.

### Sprint 6: Rate Limiting

```
while true
do
  curl ticketforge.com/api/events
done
```

**Topics:** fixed window, sliding window, token bucket, Redis atomic operations

**Real-world example:** GitHub's REST API returns `X-RateLimit-Limit` / `X-RateLimit-Remaining` headers on every single response — the industry-standard way of telling a client "here's your budget," rather than silently throttling and leaving the client to guess why requests started failing.

---

## Level 3: Distributed Systems

This is where TicketForge earns its name. Sprints 7 through 14 exist entirely because of the one-ticket, two-buyers problem described above.

### Sprint 7: Concurrency & Overselling

```
Tickets Available: 1

Customer A buys
Customer B buys

Tickets Sold: 2      ← Oops.
```

You'll recreate this bug intentionally, then fix it.

**Topics:** race conditions, transaction isolation, optimistic locking, pessimistic locking, atomic updates

**Real-world example:** see [The Core Problem](#the-core-problem) above — this sprint is where you build the actual fix to the same "sold more than we have" tradeoff airlines make on purpose. This will likely be the single most important lesson in the whole curriculum.

### Sprint 8: Distributed Locking

```
API #1                     API #2
   │                          │
synchronized(ticket)   synchronized(ticket)
   │                          │
   └─────────────┬────────────┘
                 ▼
            PostgreSQL

Each JVM has its own lock — a local `synchronized`
block only coordinates threads inside ONE process.
```

**Topics:** distributed locks, lock TTL, ownership, failure handling, Redlock concepts

**Open question — yours to answer, not mine:** When should we *not* use a distributed lock?

**Real-world example:** This question has a genuinely public, unresolved-feeling answer in the industry, and it's worth reading before you form your own opinion. In February 2016, Martin Kleppmann (author of *Designing Data-Intensive Applications*) published a widely-read critique of Redis's own Redlock algorithm, arguing it relies on unsafe assumptions about clocks and process pauses and lacks fencing tokens to protect against them. Salvatore "antirez" Sanfilippo, Redis's creator, wrote a public rebuttal defending it. Two serious distributed-systems engineers looked at the same algorithm and reached different conclusions about when it's safe to trust. Read both sides before you answer the sprint's question.

### Sprint 9: Our First Kafka Problem

```
Purchase
   ↓
Save Order
   ↓
Send Email
   ↓
Generate Ticket
   ↓
Update Analytics
   ↓
Notify Admin
   ↓
Return Response
```

That entire chain currently runs inside one HTTP request.

**Topics:** synchronous vs. asynchronous processing, coupling

**Why it matters:** the slowest step in that chain — usually a third-party call like the email provider — sets the latency and failure rate for the *entire* purchase endpoint. Decoupling isn't about Kafka being fashionable; it's about not letting your email provider's bad day take down ticket sales.

### Sprint 10: Kafka Fundamentals

```
Purchase
   │
   ▼
Order Created
   │
   ▼
 Kafka Topic
 ┌────┼────┐
 ▼    ▼    ▼
Email Ticket Analytics
Worker Worker Worker
```

**Topics:** producer, consumer, broker, topic, partition, offset, consumer group, replication, ordering

**Real-world example:** Kafka was built at LinkedIn (Jay Kreps, Neha Narkhede, and Jun Rao, around 2010–2011) because their existing messaging systems couldn't keep up with activity-stream and operational data at LinkedIn's scale. It was open-sourced not long after and now sits underneath event pipelines at companies like Uber, Netflix, and Airbnb. You're about to run into the exact mechanics — partition assignment, consumer groups — that made it worth building in the first place.

### Sprint 11: Consumer Scaling

```
Kafka
 ├── Worker 1
 ├── Worker 2
 ├── Worker 3
 └── Worker 4
```

**Topics:** consumer groups, parallel processing, scaling workers

**Why it matters:** this is how you absorb a 100,000-purchase spike without touching a single line of producer code — you add workers, and Kafka rebalances partitions across them automatically.

### Sprint 12: Retries and DLQ

```
Kafka
 ↓
Email Worker
 ↓
FAIL → Retry → Retry → Retry → DLQ
```

**Topics:** retry, backoff, poison messages, dead-letter queues, replay

**Real-world example:** this pattern is common enough that AWS SQS ships dead-letter queues as a first-class managed feature rather than something every team builds from scratch — a strong signal that "messages will sometimes fail permanently" is a universal design constraint, not an edge case you can design around.

### Sprint 13: Idempotency

```
Purchase #3821

event
event         ← delivered twice

Without protection:
  Two tickets generated
  Two emails sent
  Possible double charge
```

**Topics:** idempotency keys, deduplication, at-least-once delivery, exactly-once myths and tradeoffs

**Real-world example:** Stripe's API requires an `Idempotency-Key` header on requests that could otherwise double-charge a customer if retried — probably the most commonly cited real implementation of exactly this pattern, and directly relevant since TicketForge is also moving money.

### Sprint 14: Transactional Outbox

```
1. Save purchase          → SUCCESS
2. Publish Kafka event    → FAILURE

Database says PURCHASE COMPLETE.
Kafka never finds out.
```

Fix:

```
BEGIN TRANSACTION
  INSERT INTO purchases (...)
  INSERT INTO outbox_events (...)
COMMIT

Worker:  outbox table  →  Kafka
```

**Topics:** consistency, atomicity, event delivery guarantees

**Real-world example:** Debezium — a widely used open-source change-data-capture tool — exists largely to implement exactly this. It reads a database's write-ahead log, notices new outbox rows, and relays them to Kafka reliably, without the application ever having to "remember" to publish an event as a separate, riskier step.

---

## Level 4: Containers & CI/CD

### Sprint 15: Docker

**Topics:** images, containers, layers, networking, volumes, health checks, multi-stage builds, registries

**Why it matters:** containers are the deployment unit for everything else in this roadmap from here on — Kubernetes, CI/CD, and every cloud service downstream all assume the app already ships as a container.

### Sprint 16: CI/CD

```
git push
   ↓
GitHub Actions
   ↓
Build
   ↓
Test
   ↓
Security Checks
   ↓
Docker Build
   ↓
GHCR
```

**Topics:** GitHub Actions, testing, container builds, registries

**Real-world example:** Amazon has long cited a striking internal statistic — at one point a change was going to production somewhere in their systems roughly every 11.6 seconds on average, across an architecture where a single web page might call over a hundred backend services. Separately, DevOps research (the Puppet Labs / Gene Kim "State of DevOps" work) found that high-performing teams with pipelines like the one you're building here deploy around 30x more often, recover from incidents roughly 12x faster, and see about half the failure rate of teams without one. Frequent, small, automated deploys are safer than rare, big, manual ones — this sprint is where you build the machinery that makes that true for TicketForge.

---

## Level 5: Kubernetes

### Sprint 17: Kubernetes Fundamentals

**Topics:** Pod, Deployment, ReplicaSet, Service, Namespace

**Real-world example:** Kubernetes is Google's public rewrite of Borg, the internal system they'd used for over a decade to schedule containers across their own datacenters. It was open-sourced in 2014 and is now close to the default answer, industry-wide, to "how do you run containers in production."

### Sprint 18: Kubernetes Production Concepts

**Topics:** liveness probe, readiness probe, ConfigMap, Secret, CPU/memory requests, CPU/memory limits, rolling update, rollback

Kill pods. Exhaust memory. Deploy a broken release. Recover.

**Why it matters:** probes are how Kubernetes tells the difference between "slow" and "dead" — without them, a hung process just keeps receiving traffic while looking healthy from the outside.

**Real-world example:** The 2012 Knight Capital incident is the extreme version of the bug this sprint teaches you to prevent. During a deployment, one of eight production servers didn't receive the new code, leaving dormant trading logic from 2003 active on just that one machine. The mismatched deployment went live, the dormant code started firing on real orders, and it cost the firm roughly $440 million in about 45 minutes before anyone could shut it down. A deployment mechanism that guarantees every replica ends up in the same state — exactly what Kubernetes rolling updates are for — is precisely the guardrail that incident was missing.

### Sprint 19: Kubernetes Networking

**Topics:** ClusterIP, service discovery, DNS, Gateway API, Ingress concepts, TLS

**Why it matters:** pod IPs change constantly as things get rescheduled; DNS-based service discovery is the only reason anything can reliably find anything else inside the cluster.

### Sprint 20: Kubernetes Autoscaling

```
Traffic ↑             Traffic ↓
2 → 4 → 8 → 12 pods    12 → 8 → 4 → 2 pods
```

**Topics:** Horizontal Pod Autoscaler (HPA), metrics server, resource management

**Why it matters:** this is the exact mechanism large retailers lean on to absorb Black-Friday-scale traffic spikes without paying for that peak capacity 365 days a year. You're about to watch the same curve happen to your own pods.

### Sprint 21: Helm

**Topics:** templates, values files, environment configuration

**Why it matters:** the closest thing Kubernetes has to a package manager. Once your YAML sprawls across dev/staging/prod, hand-editing it stops scaling — same reason nobody manages Node dependencies by hand-copying files.

---

## Level 6: Infrastructure as Code

### Sprint 22: Terraform Fundamentals

**Topics:** providers, resources, variables, outputs, locals, data sources. Master `terraform init`, `plan`, `apply`, `destroy`.

**Why it matters:** declarative infrastructure is what turns "environments" from hand-configured snowflakes into something reproducible and diffable — you can look at a pull request and know exactly what will change in AWS before it happens.

### Sprint 23: Terraform State

**Topics:** tfstate, remote state, locking, drift, import, state management

You'll intentionally modify infrastructure by hand and make Terraform discover the drift.

**Real-world example:** this is the single most common real-world Terraform footgun — someone changes something in the AWS console "just this once," and Terraform's next plan no longer matches reality. Remote state with locking (commonly an S3 bucket plus a DynamoDB lock table on AWS) exists specifically so two people can't `apply` at the same moment and corrupt the shared state file.

### Sprint 24: Terraform Modules

**Topics:** reusable infrastructure, environment separation

```
terraform/
├── modules/
│   ├── network
│   ├── eks
│   ├── database
│   ├── redis
│   └── monitoring
└── environments/
    ├── dev
    ├── staging
    └── production
```

---

## Level 7: AWS Solutions Architecture

### Sprint 25: AWS Networking

```
VPC
 ├── Public Subnet   (AZ-A / AZ-B)
 ├── Private Subnet  (AZ-A / AZ-B)
 └── Database Subnets
```

**Topics:** CIDR, route tables, Internet Gateway, NAT, security groups, NACLs, availability zones, VPC endpoints

**Why it matters:** this sprint shows up almost verbatim in AWS's own Well-Architected Framework. Networking fundamentals are the part of "Solutions Architect" that's genuinely hard to fake in an interview — you either know why the database subnet has no route to the internet gateway, or you don't.

### Sprint 26: AWS Compute

**Topics:** EC2, ECS, Fargate, EKS, Lambda

**Open question — yours to answer, not mine:** Why are we choosing EKS?

**Why it matters:** "which compute service and why" is one of the most commonly asked real system-design-interview questions for anyone targeting a Solutions Architect title. Knowing how to deploy EKS matters far less than being able to defend choosing it over ECS, Fargate, or Lambda for this specific workload.

### Sprint 27: Managed Data

Move PostgreSQL → RDS, Redis → ElastiCache, Kafka → MSK.

Compare self-managed vs. AWS-managed across cost, maintenance, availability, control, scaling, backups, and patching.

**Real-world example:** past a certain team size, most engineering organizations deliberately pay the cost premium of RDS, ElastiCache, and MSK specifically to *not* run their own on-call rotation for database failover and patching. It's a genuinely common, deliberate tradeoff — not laziness — and it's worth being able to say exactly where that tradeoff stops making sense.

### Sprint 28: AWS Security

**Topics:** IAM, roles, policies, least privilege, KMS, Secrets Manager, security groups, CloudTrail, WAF

**Real-world example:** the 2019 Capital One breach is the textbook case study for this exact sprint. A misconfigured web application firewall let an attacker perform a server-side request forgery against the EC2 instance metadata endpoint, which handed back temporary credentials for an IAM role with far more access than that WAF ever needed. That one over-privileged role was enough to reach roughly 100 million customers' data. Least-privilege IAM isn't a compliance checkbox — it's the thing that determines how much damage a single misconfiguration can actually do.

---

## Level 8: Reliability

### Sprint 29: Observability

```
Browser → API → Kafka → Worker → PostgreSQL
   (metrics, logs, and a trace span emitted at every hop)
```

**Topics:** metrics, logs, traces — Micrometer, Prometheus, Grafana, OpenTelemetry, Tempo

**Real-world example:** distributed tracing as a concept traces back to Google's 2010 "Dapper" paper, which described attaching a single trace ID to a request and following it across every internal service it touched. It's the direct ancestor of Zipkin, Jaeger, and the OpenTelemetry tooling you're about to wire up here.

### Sprint 30: Reliability Engineering

**Topics:** SLI, SLO, SLA, error budgets, availability, MTTR, MTBF

Example targets: 99.9% availability, purchase p95 < 500ms, error rate < 0.1%.

**Real-world example:** this entire vocabulary — SLI, SLO, error budget — comes directly from Google's Site Reliability Engineering practice, written up in their freely available SRE book (2016). The error-budget chapter specifically is worth reading once you hit this sprint: it's the idea that turns "reliability" from a vague goal into a number you can actually trade off against feature velocity.

### Sprint 31: Disaster Recovery

Simulate: API failure, worker failure, Redis failure, Kafka failure, database failure, a bad deployment, an AZ failure, data loss. Diagnose and recover.

**Topics:** RPO, RTO, backups, restore, failover, multi-AZ, runbooks

**Real-world example:** Netflix's Chaos Monkey (part of their "Simian Army") randomly kills production instances on purpose, on a schedule, specifically so failure becomes a routine, boring, well-rehearsed event instead of a 3 a.m. surprise. Separately, AWS's own well-documented February 2017 outage is worth knowing here: a single mistyped parameter in a routine debugging command removed far more S3 capacity than intended in the US-EAST-1 region, taking the service down for about four hours — including AWS's own status dashboard, which was itself hosted on S3. Chaos Monkey shows why you rehearse failure on purpose; the S3 outage shows why "just use another AWS service as your backup" isn't automatically safe if it shares a blast radius with the thing that just broke.

---

## Level 9: Solutions Architect Mode

TicketForge stops being a coding assistant relationship and starts being a customer, or an architecture review board.

> TicketForge currently handles 5,000 customers. A partnership is expected to increase traffic to 2,000,000 customers. Major ticket releases cause 100x traffic spikes. Tickets cannot be oversold. Purchases cannot be lost. Budget is $15,000/month. The company wants 99.99% purchase availability.
>
> Design it. Then defend it — requirements, architecture, networking, compute, database, caching, messaging, scaling, security, availability, DR, observability, cost, and tradeoffs.

**Why it matters:** this brief is the whole roadmap compressed into one paragraph. Every sprint above is a piece of the answer you'll be assembling here.

**Real-world example:** you don't have to imagine this scenario — it already happened. Ticketmaster's real Eras Tour presale in November 2022 saw roughly 3.5 million people register for a "Verified Fan" presale meant for a fraction of that volume. The site partially collapsed within the first hour of sales. Even so, Ticketmaster still sold roughly 2 million tickets in a single day — by its own account, the most ever sold for an artist in one day — and then canceled the general public on-sale entirely, citing insufficient remaining inventory. It became a U.S. Senate Judiciary Committee hearing two months later. Cloud providers now document a named architecture pattern for exactly this shape of problem — Azure's Architecture Center calls it "Queue-Based Load Leveling" — which tells you the problem is well-understood enough to have a textbook answer. Your job in this level is to arrive at your own version of that answer, in your own architecture, and be able to defend it when it's challenged.

---

## Architecture Documentation Practice

Diagram types you'll practice throughout, not just once:

- System Context
- Container Architecture
- Component Architecture
- Deployment Architecture
- AWS Network Architecture
- Sequence Diagrams
- Data Flow Diagrams

**ADR template** (the shape, not filled-in content — you write the actual decisions as you make them):

```
ADR-XXX: <Decision Title>

Context:       Why is a decision needed here?
Decision:      What are we doing?
Alternatives:  What else did we consider?
Consequences:  What does this make easier or harder?
Tradeoffs:     What are we giving up?
```

**Every major sprint produces at least one artifact:**

Requirements · ADR · System Context Diagram · Container Diagram · Component Diagram · Deployment Diagram · Sequence Diagram · Threat Model · Capacity Estimate · Cost Estimate · Runbook · Disaster Recovery Plan

---

## Success Criteria

By the end of TicketForge, you should be able to:

- Design distributed systems
- Build cloud-native applications
- Deploy Kubernetes workloads
- Write Terraform
- Design AWS architectures
- Explain architectural tradeoffs
- Estimate costs
- Design for reliability
- Secure distributed applications
- Lead architecture discussions

Most importantly: you should be able to walk into a Solutions Architect interview, receive a system design problem, and confidently design, justify, and defend your architecture.
