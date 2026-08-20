# Sprint 4 Review - Redis Caching

---

# The Problem

```text
10,000 users request the same event.

Without Redis:

10,000 requests
        ↓
10,000 database queries
```

---

# The Solution

```text
          Client
             │
             ▼
           API
        ┌────┴────┐
        │         │
        ▼         ▼
     Redis    PostgreSQL
```

---

# Concept 1: Caching

```text
Request
   │
   ▼
Check cache
   │
 ┌─┴─┐
 │   │
 ▼   ▼
Hit Miss
 │    │
 ▼    ▼
Redis DB
```

---

# Concept 2: Cache-Aside Pattern

```text
Request
   │
   ▼
Redis lookup
   │
 ┌─┴─┐
 │   │
 ▼   ▼
Hit Miss
 │    │
 ▼    ▼
Return PostgreSQL
         │
         ▼
    Store in Redis
         │
         ▼
    Return response
```

---

# Concept 3: Cache Hit vs. Cache Miss

```text
Cache Hit

Redis contains the data.

No database query is required.
```

```text
Cache Miss

Redis does not contain the data.

The application queries PostgreSQL.
```

---

# Architecture Principle

```text
Frequently accessed data should be stored closer to the application.
```

---

# Architecture Scenario

```text
100,000 users open the same event page.
```

Question:

Should every request query PostgreSQL?

Answer:

```text
NO
```

Cache the frequently accessed data.

---

# Quiz

## 1. What problem does Redis solve?

```text
A. Authentication

B. Database performance

C. Authorization
```

Answer:

```text
B
```

---

## 2. What happens during a cache miss?

```text
A. Redis returns the data.

B. PostgreSQL is queried.
```

Answer:

```text
B
```

---

## 3. What happens during a cache hit?

```text
A. PostgreSQL is queried.

B. Redis returns the data.
```

Answer:

```text
B
```

---

# Sprint Takeaway

```text
Cache frequently accessed data.

Reduce database load.

Improve response times.
```

---

# Sprint Status

```text
Sprint 4: COMPLETE ✅
```