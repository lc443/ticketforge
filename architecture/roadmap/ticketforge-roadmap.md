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
-   Sprint 8: Distributed locking ✅ — PostgreSQL chosen as the shared lock authority; two-request last-ticket invariant verified; ADR-002 accepted
-   Sprint 9: Event-driven architecture
-   Sprint 10: Kafka fundamentals
-   Sprint 11: Consumer groups
-   Sprint 12: Retry and DLQ
-   Sprint 13: Idempotency
-   Sprint 14: Transactional outbox

### Level 4: Product Lifecycle, Containers & Delivery

-   Sprint 15: Docker ✅ — multi-stage API/frontend images, one API digest across three replicas, health-gated startup, bounded NGINX failover, and PostgreSQL volume persistence verified
-   Sprint 16: Event lifecycle and API evolution — update/delete semantics, cancellation policy, ownership, auditability, referential integrity, and cache consistency
-   Sprint 17: CI/CD and GHCR ✅ — correctness gates, isolated integration topology, three-image vulnerability policy, exact-artifact handoff, main-only GHCR publication, and three provenance attestations verified in GitHub Actions run 32526738146

### Level 5: Kubernetes

-   Sprint 18: Kubernetes fundamentals ✅ — isolated kind cluster, Kustomize base, configuration boundary, development dependencies, secured three-replica API Deployment, Service discovery, probes, and Pod replacement verified
-   Sprint 19: Production Kubernetes — persistence, application probe groups, graceful shutdown, disruption policy, environment overlays, configuration rollout, and rollback evidence
-   Sprint 20: Kubernetes networking
-   Sprint 21: Autoscaling
-   Sprint 22: Helm

### Level 6: Infrastructure as Code

-   Sprint 23: Terraform fundamentals
-   Sprint 24: Terraform state
-   Sprint 25: Terraform modules

### Level 7: AWS

-   Sprint 26: AWS networking
-   Sprint 27: Compute selection — EC2, ECS, Fargate, EKS, and Lambda
-   Sprint 28: RDS, ElastiCache, MSK
-   Sprint 29: AWS security

### Level 8: Reliability

-   Sprint 30: Observability
-   Sprint 31: SRE principles
-   Sprint 32: Disaster recovery

### Level 9: Architecture Leadership

-   Sprint 33: AWS Well-Architected review and remediation plan
-   Sprint 34: Threat modeling, data classification, and compliance mapping
-   Sprint 35: Cost architecture, unit economics, and FinOps
-   Sprint 36: Data and integration architecture, API evolution, and governance
-   Sprint 37: Multi-region and global architecture
-   Sprint 38: Migration and modernization strategy
-   Sprint 39: Architecture governance, documentation, and executive communication

### Level 10: Solutions Architect Mode

-   Sprint 40: Customer discovery, architecture proposals, tradeoff defense, and review-board exercises

### Level 11: TicketForge Academy and Blueprint OS

-   Sprint 41: Academy foundations — tracks, modules, lessons, prerequisites, learner profiles, progress, and credential policy
-   Sprint 42: Competency and evidence graph — connect labs, tests, ADRs, reviews, failure drills, and portfolio artifacts to measurable skills
-   Sprint 43: Assessments and practical exams — scenarios, rubrics, attempts, scoring, feedback, and mastery thresholds
-   Sprint 44: Verifiable academy credentials — evidence-backed certificates, unique IDs, QR verification, renewal, and revocation
-   Sprint 45: Blueprint OS integration — identity, transcripts, evidence APIs, credential synchronization, consent, and public profiles
-   Sprint 46: External certification preparation — official objective mapping, study plans, readiness checks, and renewal tracking; begin with AWS Solutions Architect Associate

## Architecture Artifacts

-   ADRs
-   Diagrams
-   Threat models
-   Runbooks
-   Cost estimates
-   DR plans
-   Well-Architected review reports
-   Threat models and compliance control maps
-   Migration wave plans and rollback strategies
-   Architecture review presentations for technical and executive audiences
-   Competency matrices and evidence manifests
-   Assessment rubrics and practical-exam records
-   Verifiable academy certificates and public credential records
-   External certification objective maps and readiness reports
