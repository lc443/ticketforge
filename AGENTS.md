# TicketForge working agreement

## Goal

TicketForge is a hands-on Solutions Architect curriculum, not only an application implementation. Optimize the work for learning how to discover requirements, make architecture decisions, defend tradeoffs, validate behavior, and communicate designs.

## Sprint workflow

- Use branches named `sprint-00-{title}` with the correct chronological sprint number and a short kebab-case title. Never use a `codex/` prefix.
- Before implementation, explain what the sprint is, the business/technical problem, the architecture concerns, the proposed solution, alternatives, and important tradeoffs.
- Explain meaningful implementation actions and discoveries while working so the user understands the concepts.
- Reuse the established TicketForge UI design system and neighboring page patterns. Do not invent a separate page-specific visual language.
- Use actual commands in educational labs; aliases may be documented separately as optional shortcuts.
- Verify behavior in proportion to risk, including failure paths and invariants rather than only successful compilation.
- Add or update a lab, architecture review/ADR/runbook as appropriate, and the roadmap for each completed sprint.
- Mark roadmap work complete only after implementation and verification are complete.

## Solutions Architect emphasis

- Translate feature requests into lifecycle, security, data, integration, operability, reliability, cost, compliance, and migration questions where relevant.
- Make requirements and assumptions explicit. Include measurable non-functional requirements when the decision depends on them.
- Compare viable alternatives and document why the selected option fits TicketForge's current constraints.
- Prefer evidence such as tests, load measurements, failure drills, restore exercises, health checks, cost estimates, and architecture reviews.
- Maintain the roadmap as a living curriculum. Add missing architect competencies instead of treating the current list as fixed.
- Produce artifacts appropriate to the decision: ADRs, C4 diagrams, sequence diagrams, data flows, threat models, capacity models, cost models, runbooks, DR plans, migration plans, and review presentations.

## Academy lab learning standard

- Every routed lab must begin with a technology-specific scenario and explicitly answer: What is the technology? Why does TicketForge need it? What problem does it solve?
- Include a concise, intuitive mental model or analogy that explains the mechanism without replacing technical accuracy.
- Include a separate “Explain it like I’m a kid” story using concrete, age-friendly language while preserving the technology's real boundary and behavior.
- Follow the briefing with hands-on evidence and at least one decision-oriented quiz question with immediate correct/incorrect feedback and an explanation.
- Prefer questions about boundaries, failure modes, tradeoffs, and appropriate use over command or vocabulary trivia.
- Reuse the shared `TechnologyBrief` component and established lab styles so the teaching sequence is consistent across the academy.
- Preserve deeper scenarios, exercises, and quizzes already present; the briefing is an orientation layer, not a substitute for implementation evidence.

## Docker and NGINX teaching depth

- Teach Docker and NGINX from first principles and in greater depth than ordinary feature work. Do not provide only a completed file or command list.
- Before writing configuration, explain the problem being solved, where Docker or NGINX sits in the architecture, the request/process flow, and the responsibilities of each component.
- Build Dockerfiles, Compose files, and NGINX configuration incrementally from start to finish. Explain the syntax, purpose, scope, and runtime effect of every meaningful instruction, directive, block, flag, port, network, volume, environment variable, and health check.
- For Docker, distinguish image build time from container runtime; images from containers; `COPY` from bind mounts and volumes; `ARG` from `ENV`; `CMD` from `ENTRYPOINT`; host ports from container ports; build context from Dockerfile location; and named volumes from ephemeral container storage.
- For Docker Compose, explain service discovery, dependency ordering versus readiness, health checks, shared images, networks, volumes, environment interpolation, replica behavior, and the exact effect of `build`, `up`, `down`, `start`, `stop`, `restart`, `logs`, `ps`, and `exec` commands used in the sprint.
- For NGINX, explain configuration context and inheritance; `events`, `http`, `upstream`, `server`, and `location` blocks; URI matching; `proxy_pass` URI behavior; forwarded headers; DNS/service discovery; load-balancing behavior; timeouts; buffering; health endpoints; static-file serving; and SPA fallback routing when relevant.
- Trace at least one request end to end: browser or client → published host port → NGINX listener/location → upstream service/container → application → dependencies → response.
- Explain common failure modes and how to diagnose them using actual commands, logs, response headers, container inspection, and configuration validation.
- Use actual Docker and NGINX commands in the labs. Show aliases only afterward as optional convenience shortcuts.
- Verify configuration explicitly with appropriate checks such as `docker compose config`, image builds, container health/status, logs, `nginx -t`, HTTP requests, load distribution, restart behavior, and persistence tests.
- End each Docker or NGINX lesson with a concise mental model, a from-scratch reconstruction exercise, and questions that require explaining tradeoffs rather than memorizing commands.
