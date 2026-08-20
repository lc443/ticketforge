# Sprint 5 Review - Distributed Rate Limiting

---

# The Problem

```text
3 API replicas

API 1 → 10 requests allowed
API 2 → 10 requests allowed
API 3 → 10 requests allowed
```

A client can bypass the limit by sending requests to different API instances.

---

# The Solution

```text
                 Client
                    │
                    ▼
                  NGINX
                    │
            ┌───────┼───────┐
            ▼       ▼       ▼
          API 1   API 2   API 3
                    │
                    ▼
                  Redis
```

Redis stores a single, shared counter that every API instance uses.

---

# Concept 1: Shared State

```text
❌ Wrong

API 1 → Counter = 10

API 2 → Counter = 10

API 3 → Counter = 10
```

```text
✅ Correct

Redis → Counter = 10
```

---

# Concept 2: Atomic Operations

```text
INCR rate-limit:127.0.0.1
```

```text
Request 1  → 1
Request 2  → 2
Request 3  → 3
...
Request 10 → 10
Request 11 → 429
```

Redis guarantees that `INCR` is atomic.

---

# Concept 3: TTL (Time To Live)

```text
rate-limit:127.0.0.1
```

```text
TTL = 60 seconds
```

After the TTL expires:

```text
The key is automatically removed.
```

---

# Concept 4: Filter Order

```text
Request
   │
   ▼
RateLimitFilter
   │
   ▼
JwtAuthenticationFilter
   │
   ▼
Controller
```

Your implementation proved that filter order matters.

---

# Architecture Principle

```text
State shared between multiple servers
should not live inside application memory.
```

---

# Scenario

```text
Three API replicas are deployed.

A client sends 1,000 requests.
```

Question:

```text
Should each API maintain its own request counter?
```

Answer:

```text
No.

The counter must be shared.
```

---

# Commands Used

```bash
docker exec -it ticketforge-redis redis-cli

KEYS rate-limit:*

TTL rate-limit:127.0.0.1
```

```bash
for i in {1..12}; do
  curl -o /dev/null \
       -s \
       -w "%{http_code}\n" \
       http://localhost:8085/api/events \
       -H "Authorization: Bearer YOUR_TOKEN"
done
```

Expected:

```text
200
200
200
200
200
200
200
200
200
200
429
429
```

---

# Quiz

## 1. Why can't we store the request counter inside each API?

```text
A. The counter would be duplicated.

B. Redis is faster.

C. PostgreSQL would stop working.
```

Answer:

```text
A
```

---

## 2. Which Redis command increments the counter?

```text
A. GET

B. SET

C. INCR
```

Answer:

```text
C
```

---

## 3. What does TTL do?

```text
A. Deletes keys automatically.

B. Encrypts Redis data.

C. Compresses Redis data.
```

Answer:

```text
A
```

---

# Concepts Learned

```text
Distributed state

Redis counters

Atomic operations

TTL

Filter ordering

Distributed rate limiting
```

---

# Sprint Takeaway

```text
Local state doesn't scale.

Shared state belongs in a shared service.
```

---

# Sprint Status

```text
Sprint 5: COMPLETE ✅
```