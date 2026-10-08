# Private Pod package: Dashboards and Reporting: cloud and DevOps

| Field | Value |
| --- | --- |
| Node id | NODE_CAP_01_CLOUD_DEVOPS |
| Work category | cloud-devops |
| Operating model | private-pod |
| Classification confidence | medium |
| Readiness | review-required |
| Handoff ready | no |
| Provenance | Deterministic |
| Source ids | CAP_01, ARC_19, ARC_22, FR_06 |

## Classification rationale

- 5 roles (solution-architect, backend-engineer, devops-engineer, security-engineer, qa-engineer) have to work in step.
- Continuous architectural ownership is needed across 2 component(s).
- Delivery depends on several roles working together rather than on one contributor.
- The work is not naturally separable into an independently judgeable submission.
- Delivery coordination cannot sit with the client as things stand.

## Pod objective

Provide dashboards and reporting so stakeholders can monitor operational and business metrics without manual data extraction. It delivers: FR_06 (Supervisor reassignment and workload view).

## Required roles and skills

- solution-architect
- backend-engineer
- devops-engineer
- security-engineer
- qa-engineer
- Microsoft Azure infrastructure as code
- CI/CD and release automation
- Observability and site reliability
- Performance and resilience testing

## Technical leadership

Technical lead owns data-warehouse and bi-reporting.

## Component ownership

- data-warehouse
- bi-reporting

## Delivery responsibilities

- data-warehouse updated for Dashboards and Reporting
- bi-reporting updated for Dashboards and Reporting

## Security and access

_Not present in the imported package — the operator must supply this before handoff._

## Coordination dependencies

_Not present in the imported package — the operator must supply this before handoff._

## Expected duration

3.5–5 person-days

## Definition of completion

- A named stakeholder dashboard loads the current metrics without a manual export step.
- Report figures reconcile with the underlying transactional data for a sample period.

## Completeness

Missing: securityAndAccess, coordinationDependencies
- Not handoff-ready: securityAndAccess, coordinationDependencies are not present in the imported package.

> MOCK AI MODE — no external service was contacted.