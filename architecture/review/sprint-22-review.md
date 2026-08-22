# Sprint 22 architecture review

## Outcome

TicketForge's stateless Kubernetes application plane is a schema-validated Helm chart with tested install, upgrade, network-restricted health verification, revision history, and rollback behavior.

## Successful evidence

- Default and production values rendered from one template set.
- Both renders passed Kubernetes server-side dry-run.
- JSON schema rejected an HPA maximum of zero before Kubernetes received it.
- A disposable install became release revision 1.
- An upgrade changed frontend capacity and became revision 2.
- Rollback restored revision 1 state as a new revision 3.
- A NetworkPolicy-enabled upgrade became revision 4 and the chart test returned `healthy`.
- Chart version `0.1.0` packaged successfully as a distributable archive.

## Failure evidence and correction

The first test proof disabled NetworkPolicy. That proved Service health but not behavior under the chart's default security posture. The chart now selects test Pods with `app.kubernetes.io/component: test` and permits only those Pods to reach the frontend port. The test then succeeded with default-deny enabled.

## Architecture decisions

- Helm owns the stateless application plane, not the entire platform.
- Environment values change policy; templates remain shared.
- Schema validation, rendering, API-server validation, hooks, and rollback are separate gates.
- Existing Kustomize resources are not silently adopted because Kubernetes resource ownership must be explicit.
- A chart rollback cannot promise data or external-side-effect rollback.

## Remaining production gates

- Replace production image placeholders with promoted immutable digests.
- Choose and operate production data services.
- Supply Secrets through an external secret-management workflow.
- Establish chart repository/OCI publication, signing, provenance, and promotion policy.
- Rehearse an application/data migration rollback together before a stateful schema change.

## Next decision

Sprint 23 begins Infrastructure as Code with Terraform fundamentals: provider boundaries, declarative resources, variables, outputs, planning, state creation, and safe destruction in an isolated learning environment.
