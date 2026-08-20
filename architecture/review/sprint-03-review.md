# Sprint 3 Review - Horizontal Scaling

## The Problem

``` text
Client
   │
   ▼
 API
```

If the API fails:

``` text
Client
   │
   ▼
 💥
```

The entire application becomes unavailable.

------------------------------------------------------------------------

## The Solution

``` text
              NGINX
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
     API 1     API 2     API 3
                 │
                 ▼
            PostgreSQL
```

------------------------------------------------------------------------

## Concept 1: Vertical vs Horizontal Scaling

``` text
Vertical Scaling

1 Server
   ↓
More CPU
   ↓
More Memory
```

``` text
Horizontal Scaling

1 Server
   ↓
3 Servers
   ↓
10 Servers
```

------------------------------------------------------------------------

## Concept 2: Reverse Proxy

``` text
Client
   │
   ▼
NGINX
   │
   ▼
API
```

``` text
Receive requests
Choose an API
Forward traffic
Return responses
```

------------------------------------------------------------------------

## Concept 3: Round-Robin Load Balancing

``` text
Request 1 → API 1
Request 2 → API 2
Request 3 → API 3
Request 4 → API 1
```

------------------------------------------------------------------------

## Concept 4: Failover

``` text
              NGINX
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
     API 1       ❌       API 3
```

------------------------------------------------------------------------

## Architecture Principle

``` text
Clients should not know where services live.

Clients communicate with an entry point.

The entry point routes requests.
```

------------------------------------------------------------------------

## Quiz

### 1. What is the biggest risk of a single API instance?

``` text
A. Database corruption
B. Single point of failure
C. JWT expiration
```

**Answer: B**

### 2. Who decides which API instance receives the request?

``` text
A. PostgreSQL
B. The browser
C. NGINX
```

**Answer: C**

------------------------------------------------------------------------

## Sprint Takeaway

``` text
More servers increase availability.

More servers do not automatically solve data consistency.
```
