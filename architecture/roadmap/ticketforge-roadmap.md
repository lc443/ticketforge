# TicketForge - Solutions Architect Roadmap

> **Live tracker:** [TicketForge Roadmap](https://claude.ai/code/artifact/e9ff4b8c-ad8b-4d66-b0af-d075df780e6b) — status of every sprint checked against the repo, plus the recommended next sprints and documentation debt.

## Philosophy

Build -\> Break -\> Observe -\> Improve -\> Document.

## Sprint Tracker

### Level 1: Foundations

-   Sprint 0: Requirements, repository setup, architecture - Foundations ✅
-   Sprint 1: Modular monolith and Events module
-   Sprint 2: Authentication and authorization

### Level 2: Performance & Scaling

-   Sprint 3: Load testing ✅ — real k6 suite; smoke passed; browse baseline measured 20% business success under the current distributed rate limit
-   Sprint 4: Horizontal scaling
-   Sprint 5: Redis caching
-   Sprint 6: Distributed rate limiting

### Level 3: Distributed Systems

-   Sprint 7: Concurrency and ticket overselling
-   Sprint 8: Distributed locking
-   Sprint 9: Event-driven architecture
-   Sprint 10: Kafka fundamentals
-   Sprint 11: Consumer groups
-   Sprint 12: Retry and DLQ
-   Sprint 13: Idempotency
-   Sprint 14: Transactional outbox

### Level 4: Containers & CI/CD

-   Sprint 15: Docker
-   Sprint 16: CI/CD and GHCR

### Level 5: Kubernetes

-   Sprint 17: Kubernetes fundamentals
-   Sprint 18: Production Kubernetes
-   Sprint 19: Kubernetes networking
-   Sprint 20: Autoscaling
-   Sprint 21: Helm

### Level 6: Infrastructure as Code

-   Sprint 22: Terraform fundamentals
-   Sprint 23: Terraform state
-   Sprint 24: Terraform modules

### Level 7: AWS

-   Sprint 25: AWS networking
-   Sprint 26: EKS
-   Sprint 27: RDS, ElastiCache, MSK
-   Sprint 28: AWS security

### Level 8: Reliability

-   Sprint 29: Observability
-   Sprint 30: SRE principles
-   Sprint 31: Disaster recovery

### Level 9: Architecture Challenges

-   Sprint 32+: Architecture reviews and design exercises

## Architecture Artifacts

-   ADRs
-   Diagrams
-   Threat models
-   Runbooks
-   Cost estimates
-   DR plans
