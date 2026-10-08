# Challenge package: Dashboards and Reporting: backend and API

| Field                     | Value                   |
| ------------------------- | ----------------------- |
| Node id                   | NODE_CAP_01_BACKEND_API |
| Work category             | backend-api             |
| Operating model           | challenge               |
| Classification confidence | medium                  |
| Readiness                 | review-required         |
| Handoff ready             | no                      |
| Provenance                | Deterministic           |
| Source ids                | CAP_01, FR_06           |

## Classification rationale

- The work is not naturally separable into an independently judgeable submission.
- Scope is clear enough to assign.
- Acceptance conditions are stated in the package, so the result is objectively reviewable.
- One role is enough (role not named in the package), so this can be assigned to a named person.
- The work can be carried by one or two contributors.

## Challenge objective

Provide dashboards and reporting so stakeholders can monitor operational and business metrics without manual data extraction. It delivers: FR_06 (Supervisor reassignment and workload view).

## Business context

Meridian Assurance Group — Dashboards and Reporting. Delivery confidence: Medium.

## Technical context

Touches data-warehouse (Azure Synapse Analytics (dedicated SQL pool)), bi-reporting (Power BI) on azure.

## Deliverables

- data-warehouse updated for Dashboards and Reporting
- bi-reporting updated for Dashboards and Reporting

## Evaluation criteria

- Demonstrated when: A named stakeholder dashboard loads the current metrics without a manual export step.
- Demonstrated when: Report figures reconcile with the underlying transactional data for a sample period.

## Acceptance conditions

- A named stakeholder dashboard loads the current metrics without a manual export step.
- Report figures reconcile with the underlying transactional data for a sample period.

## Input assets

- Approved design for data-warehouse
- Approved design for bi-reporting

## Required technologies or skills

_Not present in the imported package — the operator must supply this before handoff._

## Dependencies

_Not present in the imported package — the operator must supply this before handoff._

## Confidentiality limitations

- No confidentiality limitations apply: every source this work derives from is classified as non-restricted.

## Expected review process

- Review of submissions against the stated acceptance conditions.

## Completeness

Missing: technologies, skills, dependencies

- Not handoff-ready: technologies, skills, dependencies are not present in the imported package.

> MOCK AI MODE — no external service was contacted.
