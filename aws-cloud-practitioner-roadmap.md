# AWS Certified Cloud Practitioner (CLF-C02) Roadmap

**Target:** Pass the AWS Certified Cloud Practitioner (CLF-C02) exam\
**Recommended duration:** 3 weeks\
**Study style:** Learn → Hands-on Lab → Explain → Practice Questions\
**Next certification:** AWS Certified Solutions Architect -- Associate

------------------------------------------------------------------------

## Goal

This roadmap is designed to build a strong AWS foundation before moving
into Solutions Architect Associate.

The objective is **not just to memorize AWS services**. By the end, you
should understand what the major AWS services do, why you would choose
them, how they connect, and the basic security/cost implications of
using them.

------------------------------------------------------------------------

# Week 1 --- AWS & Cloud Foundations

## Day 1 --- Cloud Computing + AWS Global Infrastructure

### Learn

-   What cloud computing is
-   IaaS vs PaaS vs SaaS
-   AWS Regions
-   Availability Zones
-   Edge Locations
-   High availability
-   Fault tolerance
-   Elasticity vs scalability
-   AWS Shared Responsibility Model

### Hands-on

-   Create/sign into AWS account
-   Secure the root account with MFA
-   Explore the AWS Management Console
-   Change between AWS Regions
-   Configure an AWS Budget / billing alert

### Checkpoint

You should be able to explain: - Region vs Availability Zone - Why
applications use multiple AZs - What AWS secures vs what the customer
secures

------------------------------------------------------------------------

## Day 2 --- IAM & AWS Security Basics

### Learn

-   IAM users
-   IAM groups
-   IAM roles
-   IAM policies
-   Least privilege
-   MFA
-   Root user best practices
-   Temporary credentials

### Mental Model

``` text
Principal
    ↓
Policy
    ↓
Action
    ↓
Resource
```

### Hands-on

-   Explore IAM
-   Create an IAM policy
-   Create an IAM role
-   Inspect AWS-managed policies
-   Configure AWS CLI
-   Run:

``` bash
aws sts get-caller-identity
```

### Checkpoint

Explain the difference between: - User - Group - Role - Policy

------------------------------------------------------------------------

## Day 3 --- EC2 & Compute

### Learn

-   Amazon EC2
-   Instance types
-   AMIs
-   EBS
-   Security Groups
-   User Data
-   Auto Scaling
-   Elastic Load Balancing
-   On-Demand instances
-   Reserved Instances
-   Savings Plans
-   Spot Instances

### Hands-on

Launch a small EC2 instance, inspect its networking/security
configuration, connect to it if appropriate, and terminate it after the
lab.

### Architecture

``` text
Internet
   ↓
Load Balancer
   ↓
EC2 Instances
```

### Checkpoint

Know when you might choose: - EC2 - Auto Scaling - Load Balancer -
Spot - Savings Plans

------------------------------------------------------------------------

## Day 4 --- Containers & Serverless

### Learn

-   AWS Lambda
-   Amazon ECS
-   AWS Fargate
-   Amazon EKS
-   Container concepts
-   Serverless concepts

### Map Existing Knowledge to AWS

``` text
Docker → ECS / EKS
Kubernetes → EKS
Functions → Lambda
Managed containers → Fargate
```

### Hands-on

-   Explore ECS
-   Explore EKS
-   Create a simple Lambda function
-   Invoke the Lambda
-   View its CloudWatch logs
-   Delete lab resources

### Checkpoint

Be able to answer:

> When would I use EC2 vs ECS vs EKS vs Lambda?

------------------------------------------------------------------------

## Day 5 --- Storage

### Learn

-   Amazon S3
-   S3 buckets and objects
-   S3 versioning
-   S3 encryption
-   S3 lifecycle policies
-   S3 storage classes
-   Amazon EBS
-   Amazon EFS
-   AWS Storage Gateway

### Hands-on

-   Create an S3 bucket
-   Upload an object
-   Enable versioning
-   Inspect permissions
-   Delete the resources afterward

### Know the Difference

``` text
S3 → Object storage
EBS → Block storage
EFS → Shared file storage
```

------------------------------------------------------------------------

## Day 6 --- Review + Practice

Review: - Cloud fundamentals - Global infrastructure - IAM - EC2 -
Lambda - ECS/EKS - S3/EBS/EFS

Complete approximately **30--50 practice questions**.

Create a list of every incorrect answer and explain **why** the correct
answer is correct.

------------------------------------------------------------------------

## Day 7 --- Light Review / Rest

Review weak topics only.

Avoid cramming.

------------------------------------------------------------------------

# Week 2 --- AWS Architecture & Core Services

## Day 8 --- AWS Networking

### Learn

-   Amazon VPC
-   Public subnets
-   Private subnets
-   Route tables
-   Internet Gateway
-   NAT Gateway
-   Security Groups
-   Network ACLs
-   Elastic Load Balancers

### Architecture

``` text
Internet
   ↓
Internet Gateway
   ↓
Public Subnet
   ↓
Load Balancer
   ↓
Private Subnet
   ↓
Application
```

### Goal

Understand the architecture conceptually. Deep VPC engineering comes
during Solutions Architect Associate.

------------------------------------------------------------------------

## Day 9 --- Databases

### Learn

-   Amazon RDS
-   Amazon Aurora
-   Amazon DynamoDB
-   Amazon ElastiCache
-   Amazon Redshift
-   Multi-AZ concepts
-   Read replicas

### Map Existing Knowledge

``` text
PostgreSQL → RDS PostgreSQL / Aurora
Redis → ElastiCache
NoSQL → DynamoDB
Data warehouse → Redshift
```

### Checkpoint

Know why you would choose: - RDS - Aurora - DynamoDB - ElastiCache -
Redshift

------------------------------------------------------------------------

## Day 10 --- Messaging & Application Integration

### Learn

-   Amazon SQS
-   Amazon SNS
-   Amazon EventBridge
-   AWS Step Functions
-   Decoupling
-   Event-driven architecture

### Mental Model

``` text
Producer
   ↓
  SQS
   ↓
Consumer
```

and:

``` text
Publisher
   ↓
  SNS
 ↙   ↘
A     B
```

### Checkpoint

Understand at a high level: - Queue → SQS - Pub/Sub → SNS - Event
routing → EventBridge

------------------------------------------------------------------------

## Day 11 --- DNS, CDN & Content Delivery

### Learn

-   Amazon Route 53
-   Amazon CloudFront
-   AWS Global Accelerator
-   Edge locations
-   Caching

### Architecture

``` text
User
 ↓
Route 53
 ↓
CloudFront
 ↓
Application / S3
```

------------------------------------------------------------------------

## Day 12 --- Monitoring & Governance

### Learn

-   Amazon CloudWatch
-   AWS CloudTrail
-   AWS Config
-   AWS Trusted Advisor
-   AWS Organizations
-   AWS Control Tower
-   AWS Systems Manager

### Key Distinction

``` text
CloudWatch → Metrics / logs / alarms
CloudTrail → API activity / auditing
AWS Config → Resource configuration/compliance
```

------------------------------------------------------------------------

## Day 13 --- Architecture Review

Practice identifying services from requirements.

Examples:

> Need object storage? → S3

> Need managed relational database? → RDS

> Need managed Redis? → ElastiCache

> Need a message queue? → SQS

> Need CDN? → CloudFront

> Need DNS? → Route 53

> Need API auditing? → CloudTrail

Complete **40--60 practice questions**.

------------------------------------------------------------------------

## Day 14 --- Review / Rest

Focus on weak areas.

------------------------------------------------------------------------

# Week 3 --- Security, Pricing & Exam Preparation

## Day 15 --- AWS Security Services

### Learn

-   AWS KMS
-   AWS Secrets Manager
-   Amazon GuardDuty
-   Amazon Inspector
-   Amazon Macie
-   AWS Shield
-   AWS WAF
-   AWS Security Hub
-   AWS Artifact

### Mental Map

``` text
KMS → Encryption keys
Secrets Manager → Secrets/passwords
GuardDuty → Threat detection
Inspector → Vulnerability management
Macie → Sensitive S3 data discovery
Shield → DDoS protection
WAF → Web request filtering
Artifact → Compliance reports/documents
```

------------------------------------------------------------------------

## Day 16 --- AWS Pricing

### Learn

-   Pay-as-you-go
-   On-Demand
-   Spot
-   Reserved Instances
-   Savings Plans
-   Data transfer costs
-   AWS Free Tier concepts

### Goal

Understand **why one pricing model is selected over another**.

------------------------------------------------------------------------

## Day 17 --- Billing & Cost Management

### Learn

-   AWS Budgets
-   AWS Cost Explorer
-   AWS Pricing Calculator
-   Cost allocation tags
-   Consolidated billing
-   AWS Organizations

### Key Distinction

``` text
Budget → Alert me
Cost Explorer → Analyze spending
Pricing Calculator → Estimate future cost
```

------------------------------------------------------------------------

## Day 18 --- AWS Well-Architected Framework

Study the six pillars:

1.  Operational Excellence
2.  Security
3.  Reliability
4.  Performance Efficiency
5.  Cost Optimization
6.  Sustainability

For each pillar, understand the **goal**, not just the name.

------------------------------------------------------------------------

## Day 19 --- Full Practice Exam

Take a timed practice exam.

Do not immediately look at answers while taking it.

Afterward, classify every incorrect answer:

``` text
Incorrect
   ↓
Why did I miss it?
   ├── Didn't know service
   ├── Confused two services
   ├── Misread question
   └── Didn't understand AWS concept
```

Create a targeted review list.

------------------------------------------------------------------------

## Day 20 --- Weak Areas

Only study areas identified from the practice exam.

Avoid restarting the entire course.

Recommended target before the real exam:

**Consistently score around 80%+ on quality practice exams.**

------------------------------------------------------------------------

## Day 21 --- Final Review

Review: - IAM - Shared Responsibility Model - EC2 pricing - S3 - RDS vs
DynamoDB - SQS/SNS/EventBridge - CloudWatch vs CloudTrail - Security
services - AWS pricing/billing - Well-Architected Framework -
Regions/AZs/Edge Locations

Then schedule/take the **AWS Certified Cloud Practitioner (CLF-C02)**
exam when ready.

------------------------------------------------------------------------

# Service Cheat Sheet

  Need                          AWS Service
  ----------------------------- -----------------
  Virtual server                EC2
  Object storage                S3
  Block storage                 EBS
  Shared file storage           EFS
  Relational database           RDS
  AWS-optimized relational DB   Aurora
  NoSQL database                DynamoDB
  Redis/Memcached               ElastiCache
  Functions                     Lambda
  Containers                    ECS
  Kubernetes                    EKS
  Serverless containers         Fargate
  Queue                         SQS
  Pub/Sub                       SNS
  Event routing                 EventBridge
  DNS                           Route 53
  CDN                           CloudFront
  Monitoring                    CloudWatch
  API audit history             CloudTrail
  Encryption keys               KMS
  Secrets                       Secrets Manager
  DDoS protection               Shield
  Web firewall                  WAF
  Infrastructure as Code        CloudFormation

------------------------------------------------------------------------

# Study Rules

1.  **Don't memorize blindly.** Ask what problem each AWS service
    solves.
2.  **Use the console.** Every major service should be seen at least
    once.
3.  **Delete lab resources.** Avoid unnecessary AWS charges.
4.  **Track mistakes.** Wrong practice questions are part of the
    curriculum.
5.  **Explain concepts aloud.** If you cannot explain a service simply,
    review it.
6.  **Don't over-engineer Cloud Practitioner.** Solutions Architect
    Associate is where deeper architecture work begins.

------------------------------------------------------------------------

# Certification Path After Cloud Practitioner

``` text
AWS Certified Cloud Practitioner
              ↓
AWS Solutions Architect – Associate
              ↓
HashiCorp Terraform Associate
              ↓
AWS Developer – Associate
              ↓
Certified Kubernetes Administrator (CKA)
              ↓
AWS Solutions Architect – Professional
```

------------------------------------------------------------------------

# Definition of Done

Before taking the Cloud Practitioner exam, you should be able to:

-   [ ] Explain AWS Regions, AZs, and Edge Locations
-   [ ] Explain the Shared Responsibility Model
-   [ ] Explain IAM users, groups, roles, and policies
-   [ ] Identify the purpose of major AWS compute services
-   [ ] Choose between S3, EBS, and EFS at a high level
-   [ ] Choose between RDS, DynamoDB, and ElastiCache at a high level
-   [ ] Explain SQS, SNS, and EventBridge
-   [ ] Explain CloudWatch vs CloudTrail
-   [ ] Identify major AWS security services
-   [ ] Understand major AWS pricing models
-   [ ] Understand AWS billing/cost-management tools
-   [ ] Explain the six Well-Architected pillars
-   [ ] Consistently score around 80%+ on quality practice exams
-   [ ] Complete at least one full timed practice exam
-   [ ] Review every missed practice question

------------------------------------------------------------------------

## Next Milestone

**Pass AWS Certified Cloud Practitioner (CLF-C02), then immediately
begin the AWS Solutions Architect -- Associate roadmap.**
