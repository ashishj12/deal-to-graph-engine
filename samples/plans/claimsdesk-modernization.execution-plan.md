# Execution plan: ClaimsDesk Modernization

| Field | Value |
| --- | --- |
| Deal id | 74481f79-8922-4630-9f95-bb9be76a47d1 |
| Package maturity | review-required |
| Graph revision | 0 |
| Nodes | 98 |
| Dependencies | 132 |
| Waves | 10 |
| Operating models | 21 flexible-talent · 30 challenge · 47 private-pod |
| Graph effort | 572.5–885 person-days |
| Critical path | 9 node(s), 349.5 person-days |
| Duration estimate | 349.5 person-days |
| Quality gate | Review Required |
| Generator | mock (mock) |

> MOCK AI MODE — no external service was contacted.

## Execution waves

### Wave 1 — 62 node(s), 410 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_CAP_01_BACKEND_API | Dashboards and Reporting: backend and API | challenge | backend-api | review-required |
| NODE_CAP_01_CLOUD_DEVOPS | Dashboards and Reporting: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_02_BACKEND_API | Document Management: backend and API | challenge | backend-api | review-required |
| NODE_CAP_02_CLOUD_DEVOPS | Document Management: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_03_BACKEND_API | Forms and Data Capture: backend and API | private-pod | backend-api | review-required |
| NODE_CAP_04_BACKEND_API | Notifications and Alerts: backend and API | challenge | backend-api | review-required |
| NODE_CAP_07_BACKEND_API | Workflow and Approvals: backend and API | challenge | backend-api | review-required |
| NODE_CAP_08_BACKEND_API | Core Platform Services: backend and API | private-pod | backend-api | review-required |
| NODE_CAP_08_CLOUD_DEVOPS | Core Platform Services: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_09_CLOUD_DEVOPS | Data Migration: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_09_DATA_ENGINEERING | Data Migration: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_09_INTEGRATION | Data Migration: integration | private-pod | integration | review-required |
| NODE_CAP_10_CLOUD_DEVOPS | Data Quality and Reconciliation: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_10_DATA_ENGINEERING | Data Quality and Reconciliation: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_10_INTEGRATION | Data Quality and Reconciliation: integration | private-pod | integration | review-required |
| NODE_CAP_11_DATA_ENGINEERING | Data Retention and Archival: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_12_CLOUD_DEVOPS | Document and Content Data Management: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_12_DATA_ENGINEERING | Document and Content Data Management: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_13_DATA_ENGINEERING | Personal Data Protection: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_14_CLOUD_DEVOPS | API Integration Platform: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_14_INTEGRATION | API Integration Platform: integration | private-pod | integration | review-required |
| NODE_CAP_15_CLOUD_DEVOPS | Email and SMS Gateway Integration: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_15_INTEGRATION | Email and SMS Gateway Integration: integration | private-pod | integration | review-required |
| NODE_CAP_17_CLOUD_DEVOPS | Identity Provider Integration: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_17_INTEGRATION | Identity Provider Integration: integration | private-pod | integration | review-required |
| NODE_CAP_18_CLOUD_DEVOPS | Real-Time Integration Platform: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_18_INTEGRATION | Real-Time Integration Platform: integration | private-pod | integration | review-required |
| NODE_CAP_19_AI_IMPLEMENTATION | AI Recommendations Engine: AI implementation | challenge | ai-implementation | review-required |
| NODE_CAP_19_BACKEND_API | AI Recommendations Engine: backend and API | challenge | backend-api | review-required |
| NODE_CAP_19_CLOUD_DEVOPS | AI Recommendations Engine: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_20_CLOUD_DEVOPS | Audit Logging and Compliance Monitoring: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_21_CLOUD_DEVOPS | Data Encryption: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_21_SECURITY | Data Encryption: security | private-pod | security | review-required |
| NODE_CAP_22_CLOUD_DEVOPS | Multi-Factor Authentication: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_22_SECURITY | Multi-Factor Authentication: security | private-pod | security | review-required |
| NODE_CAP_23_CLOUD_DEVOPS | Network Protection: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_23_SECURITY | Network Protection: security | private-pod | security | review-required |
| NODE_CAP_24_CLOUD_DEVOPS | Role-Based Access Control: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_24_SECURITY | Role-Based Access Control: security | private-pod | security | review-required |
| NODE_CAP_25_CLOUD_DEVOPS | Secrets and Credential Management: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_25_SECURITY | Secrets and Credential Management: security | private-pod | security | review-required |
| NODE_GAP_01 | SAP S/4HANA integration pattern unconfirmed | flexible-talent | discovery | review-required |
| NODE_GAP_02 | Policyholder status tracker phase undecided | flexible-talent | discovery | review-required |
| NODE_GAP_03 | Specific agent accessibility requirements unspecified | flexible-talent | discovery | review-required |
| NODE_GAP_04 | Hyland OnBase future-consolidation scope unclear | flexible-talent | discovery | review-required |
| NODE_PH_1_DEPLOYMENT | Release Discovery and Architecture | private-pod | deployment | review-required |
| NODE_PROVIDE_MISSING_ESTIMATION_INPUT_INTEGRATION_READINESS | Provide missing estimation input: Integration readiness | flexible-talent | discovery | review-required |
| NODE_Q_01 | Does SAP S/4HANA expose a REST API for journal posting? | flexible-talent | discovery | review-required |
| NODE_Q_02 | Will the policyholder status tracker ship in the initial release? | flexible-talent | discovery | review-required |
| NODE_Q_03 | Should the portal eventually replace Hyland OnBase? | flexible-talent | discovery | review-required |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION_2 | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_MISSING_ESTIMATION_INPUTS | Resolve quality finding: missing-estimation-inputs | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_2 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_3 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | review-required |
| NODE_RE_BASELINE_AI_STRATEGY | Re-baseline AI strategy | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_ARCHITECTURE | Re-baseline Architecture | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_DATA_AND_INTEGRATION | Re-baseline Data and integration | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_ESTIMATE | Re-baseline Estimate | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_PRODUCT_REQUIREMENTS | Re-baseline Product requirements | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_QUALITY | Re-baseline Quality | flexible-talent | discovery | review-required |

### Wave 2 — 25 node(s), 151 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_CAP_01_TESTING | Dashboards and Reporting: verification | challenge | testing | review-required |
| NODE_CAP_02_TESTING | Document Management: verification | challenge | testing | review-required |
| NODE_CAP_03_TESTING | Forms and Data Capture: verification | challenge | testing | review-required |
| NODE_CAP_04_TESTING | Notifications and Alerts: verification | challenge | testing | review-required |
| NODE_CAP_05_BACKEND_API | Payments and Billing: backend and API | challenge | backend-api | blocked |
| NODE_CAP_05_CLOUD_DEVOPS | Payments and Billing: cloud and DevOps | private-pod | cloud-devops | blocked |
| NODE_CAP_06_BACKEND_API | Self-Service Portal: backend and API | challenge | backend-api | blocked |
| NODE_CAP_07_TESTING | Workflow and Approvals: verification | challenge | testing | review-required |
| NODE_CAP_08_INTEGRATION | Core Platform Services: integration | private-pod | integration | review-required |
| NODE_CAP_09_TESTING | Data Migration: verification | challenge | testing | review-required |
| NODE_CAP_10_TESTING | Data Quality and Reconciliation: verification | challenge | testing | review-required |
| NODE_CAP_12_TESTING | Document and Content Data Management: verification | challenge | testing | review-required |
| NODE_CAP_14_TESTING | API Integration Platform: verification | challenge | testing | review-required |
| NODE_CAP_15_TESTING | Email and SMS Gateway Integration: verification | challenge | testing | review-required |
| NODE_CAP_16_CLOUD_DEVOPS | ERP Integration: cloud and DevOps | private-pod | cloud-devops | blocked |
| NODE_CAP_16_INTEGRATION | ERP Integration: integration | private-pod | integration | blocked |
| NODE_CAP_17_TESTING | Identity Provider Integration: verification | challenge | testing | review-required |
| NODE_CAP_18_TESTING | Real-Time Integration Platform: verification | challenge | testing | review-required |
| NODE_CAP_19_TESTING | AI Recommendations Engine: verification | challenge | testing | review-required |
| NODE_CAP_20_TESTING | Audit Logging and Compliance Monitoring: verification | challenge | testing | review-required |
| NODE_CAP_21_TESTING | Data Encryption: verification | challenge | testing | review-required |
| NODE_CAP_22_TESTING | Multi-Factor Authentication: verification | challenge | testing | review-required |
| NODE_CAP_23_TESTING | Network Protection: verification | challenge | testing | review-required |
| NODE_CAP_24_TESTING | Role-Based Access Control: verification | challenge | testing | review-required |
| NODE_CAP_25_TESTING | Secrets and Credential Management: verification | challenge | testing | review-required |

### Wave 3 — 4 node(s), 46.5 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_CAP_05_TESTING | Payments and Billing: verification | challenge | testing | blocked |
| NODE_CAP_06_TESTING | Self-Service Portal: verification | challenge | testing | blocked |
| NODE_CAP_08_SECURITY | Core Platform Services: security | private-pod | security | review-required |
| NODE_CAP_16_TESTING | ERP Integration: verification | challenge | testing | blocked |

### Wave 4 — 1 node(s), 24 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_CAP_08_TESTING | Core Platform Services: verification | private-pod | testing | review-required |

### Wave 5 — 1 node(s), 24 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_2_DEPLOYMENT | Release Experience and Core Platform | private-pod | deployment | review-required |

### Wave 6 — 1 node(s), 22.5 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_3_DEPLOYMENT | Release Data and Integration | private-pod | deployment | review-required |

### Wave 7 — 1 node(s), 21 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_4_DEPLOYMENT | Release AI Capabilities | private-pod | deployment | review-required |

### Wave 8 — 1 node(s), 137 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_5_DEPLOYMENT | Release Testing and Hardening | private-pod | deployment | review-required |

### Wave 9 — 1 node(s), 49 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_6_DEPLOYMENT | Release Deployment and Handover | private-pod | deployment | review-required |

### Wave 10 — 1 node(s), 0 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_OPERATIONAL_HANDOFF_APPROVAL | Operational handoff approval | flexible-talent | technical-review | review-required |

## Critical path

Tie-break rule: Longest total effort over effort.maximum; when two predecessors tie, the path arriving through the lexicographically smaller node id wins.

| Order | Node | Title | Effort |
| --- | --- | --- | --- |
| 1 | NODE_CAP_08_BACKEND_API | Core Platform Services: backend and API | 15.5–24 person-days |
| 2 | NODE_CAP_08_INTEGRATION | Core Platform Services: integration | 15.5–24 person-days |
| 3 | NODE_CAP_08_SECURITY | Core Platform Services: security | 15.5–24 person-days |
| 4 | NODE_CAP_08_TESTING | Core Platform Services: verification | 15.5–24 person-days |
| 5 | NODE_PH_2_DEPLOYMENT | Release Experience and Core Platform | 15.5–24 person-days |
| 6 | NODE_PH_3_DEPLOYMENT | Release Data and Integration | 12–22.5 person-days |
| 7 | NODE_PH_4_DEPLOYMENT | Release AI Capabilities | 16–21 person-days |
| 8 | NODE_PH_5_DEPLOYMENT | Release Testing and Hardening | 89–137 person-days |
| 9 | NODE_PH_6_DEPLOYMENT | Release Deployment and Handover | 32–49 person-days |

Optimistic path (effort.minimum): 226.5 person-days — NODE_CAP_08_BACKEND_API → NODE_CAP_08_INTEGRATION → NODE_CAP_08_SECURITY → NODE_CAP_08_TESTING → NODE_PH_2_DEPLOYMENT → NODE_PH_3_DEPLOYMENT → NODE_PH_4_DEPLOYMENT → NODE_PH_5_DEPLOYMENT → NODE_PH_6_DEPLOYMENT

## Node inventory

| Node | Title | Model | Category | Kind | Effort | Readiness | Blocked by | Source ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NODE_GAP_01 | SAP S/4HANA integration pattern unconfirmed | flexible-talent | discovery | discovery | needs input | review-required | — | GAP_01, INT_02, Q_01 |
| NODE_GAP_02 | Policyholder status tracker phase undecided | flexible-talent | discovery | discovery | needs input | review-required | — | GAP_02, FR_05, Q_02 |
| NODE_GAP_03 | Specific agent accessibility requirements unspecified | flexible-talent | discovery | discovery | needs input | review-required | — | GAP_03 |
| NODE_GAP_04 | Hyland OnBase future-consolidation scope unclear | flexible-talent | discovery | discovery | needs input | review-required | — | GAP_04, DEP_01, Q_03 |
| NODE_Q_01 | Does SAP S/4HANA expose a REST API for journal posting? | flexible-talent | discovery | clarification | needs input | review-required | — | Q_01, GAP_01, INT_02 |
| NODE_Q_02 | Will the policyholder status tracker ship in the initial release? | flexible-talent | discovery | clarification | needs input | review-required | — | Q_02, GAP_02, FR_05 |
| NODE_Q_03 | Should the portal eventually replace Hyland OnBase? | flexible-talent | discovery | clarification | needs input | review-required | — | Q_03, DEP_01, GAP_04 |
| NODE_RE_BASELINE_PRODUCT_REQUIREMENTS | Re-baseline Product requirements | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_01_PRODUCT_REQUIREMENTS |
| NODE_RE_BASELINE_ARCHITECTURE | Re-baseline Architecture | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_02_ARCHITECTURE |
| NODE_RE_BASELINE_DATA_AND_INTEGRATION | Re-baseline Data and integration | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_03_DATA_AND_INTEGRATION |
| NODE_RE_BASELINE_AI_STRATEGY | Re-baseline AI strategy | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_04_AI_STRATEGY |
| NODE_RE_BASELINE_ESTIMATE | Re-baseline Estimate | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_05_ESTIMATE |
| NODE_RE_BASELINE_QUALITY | Re-baseline Quality | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_06_QUALITY |
| NODE_PROVIDE_MISSING_ESTIMATION_INPUT_INTEGRATION_READINESS | Provide missing estimation input: Integration readiness | flexible-talent | discovery | clarification | needs input | review-required | — | EST_MISSING_01 |
| NODE_RESOLVE_QUALITY_FINDING_MISSING_ESTIMATION_INPUTS | Resolve quality finding: missing-estimation-inputs | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_MISSING_ESTIMATION_INPUTS |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_UNRESOLVED_QUESTIONS |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_2 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_UNRESOLVED_QUESTIONS |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_3 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_UNRESOLVED_QUESTIONS |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_ASSUMPTIONS_NEEDING_VALIDATION |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION_2 | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_ASSUMPTIONS_NEEDING_VALIDATION |
| NODE_CAP_01_BACKEND_API | Dashboards and Reporting: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_01, FR_06 |
| NODE_CAP_01_CLOUD_DEVOPS | Dashboards and Reporting: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_01, ARC_19, ARC_22, FR_06 |
| NODE_CAP_01_TESTING | Dashboards and Reporting: verification | challenge | testing | delivery | needs input | review-required | — | CAP_01, FR_06, ARC_19, ARC_22 |
| NODE_CAP_02_BACKEND_API | Document Management: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_02, FR_02 |
| NODE_CAP_02_CLOUD_DEVOPS | Document Management: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_02, ARC_19, ARC_21, ARC_22, FR_02 |
| NODE_CAP_02_TESTING | Document Management: verification | challenge | testing | delivery | needs input | review-required | — | CAP_02, FR_02, ARC_19, ARC_21, ARC_22 |
| NODE_CAP_03_BACKEND_API | Forms and Data Capture: backend and API | private-pod | backend-api | delivery | 5–6.5 person-days | review-required | — | CAP_03, BR_01, BR_04, FR_07 |
| NODE_CAP_03_TESTING | Forms and Data Capture: verification | challenge | testing | delivery | 5–6.5 person-days | review-required | — | CAP_03, BR_01, BR_04, FR_07, ARC_30 |
| NODE_CAP_04_BACKEND_API | Notifications and Alerts: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_04, FR_09 |
| NODE_CAP_04_TESTING | Notifications and Alerts: verification | challenge | testing | delivery | needs input | review-required | — | CAP_04, FR_09, ARC_29 |
| NODE_CAP_05_BACKEND_API | Payments and Billing: backend and API | challenge | backend-api | delivery | needs input | blocked | GAP_01, Q_01 | CAP_05, BR_02, FR_03, FR_04 |
| NODE_CAP_05_CLOUD_DEVOPS | Payments and Billing: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | blocked | GAP_01, Q_01 | CAP_05, ARC_20, ARC_30, BR_02, FR_03, FR_04 |
| NODE_CAP_05_TESTING | Payments and Billing: verification | challenge | testing | delivery | needs input | blocked | GAP_01, Q_01 | CAP_05, BR_02, FR_03, FR_04, ARC_20, ARC_30 |
| NODE_CAP_06_BACKEND_API | Self-Service Portal: backend and API | challenge | backend-api | delivery | needs input | blocked | GAP_02 | CAP_06, FR_05 |
| NODE_CAP_06_TESTING | Self-Service Portal: verification | challenge | testing | delivery | needs input | blocked | GAP_02 | CAP_06, FR_05, ARC_21 |
| NODE_CAP_07_BACKEND_API | Workflow and Approvals: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_07, BR_04 |
| NODE_CAP_07_TESTING | Workflow and Approvals: verification | challenge | testing | delivery | needs input | review-required | — | CAP_07, BR_04, ARC_30 |
| NODE_CAP_08_BACKEND_API | Core Platform Services: backend and API | private-pod | backend-api | delivery | 15.5–24 person-days | review-required | — | CAP_08, BR_03, BR_05, FR_01, FR_08, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, INT_06, SEC_01 |
| NODE_CAP_08_INTEGRATION | Core Platform Services: integration | private-pod | integration | delivery | 15.5–24 person-days | review-required | — | CAP_08, IF_06, INT_06, SYS_05, BR_03, BR_05, FR_01, FR_08, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, SEC_01 |
| NODE_CAP_08_SECURITY | Core Platform Services: security | private-pod | security | delivery | 15.5–24 person-days | review-required | — | CAP_08, SEC_01, BR_03, BR_05, FR_01, FR_08, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, INT_06 |
| NODE_CAP_08_CLOUD_DEVOPS | Core Platform Services: cloud and DevOps | private-pod | cloud-devops | delivery | 15.5–24 person-days | review-required | — | CAP_08, ARC_01, ARC_02, ARC_03, ARC_04, ARC_06, ARC_12, ARC_21, ARC_25, ARC_26, ARC_27, ARC_28, BR_03, BR_05, FR_01, FR_08, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, INT_06, SEC_01 |
| NODE_CAP_08_TESTING | Core Platform Services: verification | private-pod | testing | delivery | 15.5–24 person-days | review-required | — | CAP_08, BR_03, BR_05, FR_01, FR_08, ARC_01, ARC_02, ARC_03, ARC_04, ARC_06, ARC_12, ARC_21, ARC_25, ARC_26, ARC_27, ARC_28, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, INT_06, SEC_01 |
| NODE_CAP_09_INTEGRATION | Data Migration: integration | private-pod | integration | delivery | 12–22.5 person-days | review-required | — | CAP_09, IF_07, SYS_04, DATA_04, DATA_01, DATA_02 |
| NODE_CAP_09_DATA_ENGINEERING | Data Migration: data engineering | private-pod | data-engineering | delivery | 5–6.5 person-days | review-required | — | CAP_09, DATA_01, DATA_02, DATA_04 |
| NODE_CAP_09_CLOUD_DEVOPS | Data Migration: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_09, ARC_19, ARC_20, ARC_21, ARC_22, DATA_01, DATA_02, DATA_04 |
| NODE_CAP_09_TESTING | Data Migration: verification | challenge | testing | delivery | 5–6.5 person-days | review-required | — | CAP_09, ARC_19, ARC_20, ARC_21, ARC_22, DATA_01, DATA_02, DATA_04 |
| NODE_CAP_10_INTEGRATION | Data Quality and Reconciliation: integration | private-pod | integration | delivery | 12–22.5 person-days | review-required | — | CAP_10, IF_07, SYS_04, DATA_04 |
| NODE_CAP_10_DATA_ENGINEERING | Data Quality and Reconciliation: data engineering | private-pod | data-engineering | delivery | 5–6.5 person-days | review-required | — | CAP_10, DATA_04 |
| NODE_CAP_10_CLOUD_DEVOPS | Data Quality and Reconciliation: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_10, ARC_19, ARC_20, ARC_22, DATA_04 |
| NODE_CAP_10_TESTING | Data Quality and Reconciliation: verification | challenge | testing | delivery | 5–6.5 person-days | review-required | — | CAP_10, ARC_19, ARC_20, ARC_22, DATA_04 |
| NODE_CAP_11_DATA_ENGINEERING | Data Retention and Archival: data engineering | private-pod | data-engineering | delivery | 5–6.5 person-days | review-required | — | CAP_11, DATA_05 |
| NODE_CAP_12_DATA_ENGINEERING | Document and Content Data Management: data engineering | private-pod | data-engineering | delivery | 5–6.5 person-days | review-required | — | CAP_12, DATA_02 |
| NODE_CAP_12_CLOUD_DEVOPS | Document and Content Data Management: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_12, ARC_20, ARC_21, DATA_02 |
| NODE_CAP_12_TESTING | Document and Content Data Management: verification | challenge | testing | delivery | 5–6.5 person-days | review-required | — | CAP_12, ARC_20, ARC_21, DATA_02 |
| NODE_CAP_13_DATA_ENGINEERING | Personal Data Protection: data engineering | private-pod | data-engineering | delivery | 5–6.5 person-days | review-required | — | CAP_13, DATA_03 |
| NODE_CAP_14_INTEGRATION | API Integration Platform: integration | private-pod | integration | delivery | 5.5–8.5 person-days | review-required | — | CAP_14, IF_04, INT_04 |
| NODE_CAP_14_CLOUD_DEVOPS | API Integration Platform: cloud and DevOps | private-pod | cloud-devops | delivery | 5.5–8.5 person-days | review-required | — | CAP_14, ARC_15, ARC_16, ARC_17, INT_04 |
| NODE_CAP_14_TESTING | API Integration Platform: verification | challenge | testing | delivery | 5.5–8.5 person-days | review-required | — | CAP_14, ARC_15, ARC_16, ARC_17, INT_04 |
| NODE_CAP_15_INTEGRATION | Email and SMS Gateway Integration: integration | private-pod | integration | delivery | 12–22.5 person-days | review-required | — | CAP_15, IF_05, INT_05 |
| NODE_CAP_15_CLOUD_DEVOPS | Email and SMS Gateway Integration: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_15, ARC_15, ARC_16, ARC_17, ARC_29, INT_05 |
| NODE_CAP_15_TESTING | Email and SMS Gateway Integration: verification | challenge | testing | delivery | 12–22.5 person-days | review-required | — | CAP_15, ARC_15, ARC_16, ARC_17, ARC_29, INT_05 |
| NODE_CAP_16_INTEGRATION | ERP Integration: integration | private-pod | integration | delivery | 12–22.5 person-days | blocked | GAP_01, Q_01 | CAP_16, IF_02, INT_02, SYS_02 |
| NODE_CAP_16_CLOUD_DEVOPS | ERP Integration: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | blocked | GAP_01, Q_01 | CAP_16, ARC_15, ARC_16, ARC_17, ARC_30, INT_02 |
| NODE_CAP_16_TESTING | ERP Integration: verification | challenge | testing | delivery | 12–22.5 person-days | blocked | GAP_01, Q_01 | CAP_16, ARC_15, ARC_16, ARC_17, ARC_30, INT_02 |
| NODE_CAP_17_INTEGRATION | Identity Provider Integration: integration | private-pod | integration | delivery | 12–22.5 person-days | review-required | — | CAP_17, IF_03, INT_03, SYS_03 |
| NODE_CAP_17_CLOUD_DEVOPS | Identity Provider Integration: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_17, ARC_15, ARC_16, ARC_17, INT_03 |
| NODE_CAP_17_TESTING | Identity Provider Integration: verification | challenge | testing | delivery | 12–22.5 person-days | review-required | — | CAP_17, ARC_15, ARC_16, ARC_17, INT_03 |
| NODE_CAP_18_INTEGRATION | Real-Time Integration Platform: integration | private-pod | integration | delivery | 5.5–8.5 person-days | review-required | — | CAP_18, IF_01, INT_01, SYS_01 |
| NODE_CAP_18_CLOUD_DEVOPS | Real-Time Integration Platform: cloud and DevOps | private-pod | cloud-devops | delivery | 5.5–8.5 person-days | review-required | — | CAP_18, ARC_15, ARC_16, ARC_17, ARC_18, INT_01 |
| NODE_CAP_18_TESTING | Real-Time Integration Platform: verification | challenge | testing | delivery | 5.5–8.5 person-days | review-required | — | CAP_18, ARC_15, ARC_16, ARC_17, ARC_18, INT_01 |
| NODE_CAP_19_BACKEND_API | AI Recommendations Engine: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_19, FR_10 |
| NODE_CAP_19_AI_IMPLEMENTATION | AI Recommendations Engine: AI implementation | challenge | ai-implementation | delivery | needs input | review-required | — | CAP_19, AIUC_01, FR_10 |
| NODE_CAP_19_CLOUD_DEVOPS | AI Recommendations Engine: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_19, ARC_23, ARC_24, FR_10 |
| NODE_CAP_19_TESTING | AI Recommendations Engine: verification | challenge | testing | delivery | needs input | review-required | — | CAP_19, FR_10, ARC_23, ARC_24 |
| NODE_CAP_20_CLOUD_DEVOPS | Audit Logging and Compliance Monitoring: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_20, ARC_06, ARC_07, NFR_07 |
| NODE_CAP_20_TESTING | Audit Logging and Compliance Monitoring: verification | challenge | testing | delivery | needs input | review-required | — | CAP_20, ARC_06, ARC_07, NFR_07 |
| NODE_CAP_21_SECURITY | Data Encryption: security | private-pod | security | delivery | 8.5–11 person-days | review-required | — | CAP_21, SEC_02 |
| NODE_CAP_21_CLOUD_DEVOPS | Data Encryption: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_21, ARC_04, ARC_11, SEC_02 |
| NODE_CAP_21_TESTING | Data Encryption: verification | challenge | testing | delivery | 5–6.5 person-days | review-required | — | CAP_21, ARC_04, ARC_11, SEC_02 |
| NODE_CAP_22_SECURITY | Multi-Factor Authentication: security | private-pod | security | delivery | 8.5–11 person-days | review-required | — | CAP_22, SEC_04 |
| NODE_CAP_22_CLOUD_DEVOPS | Multi-Factor Authentication: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_22, ARC_05, ARC_30, SEC_04 |
| NODE_CAP_22_TESTING | Multi-Factor Authentication: verification | challenge | testing | delivery | needs input | review-required | — | CAP_22, ARC_05, ARC_30, SEC_04 |
| NODE_CAP_23_SECURITY | Network Protection: security | private-pod | security | delivery | 8.5–11 person-days | review-required | — | CAP_23, SEC_05 |
| NODE_CAP_23_CLOUD_DEVOPS | Network Protection: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_23, ARC_13, ARC_14, SEC_05 |
| NODE_CAP_23_TESTING | Network Protection: verification | challenge | testing | delivery | needs input | review-required | — | CAP_23, ARC_13, ARC_14, SEC_05 |
| NODE_CAP_24_SECURITY | Role-Based Access Control: security | private-pod | security | delivery | 8.5–11 person-days | review-required | — | CAP_24, SEC_03 |
| NODE_CAP_24_CLOUD_DEVOPS | Role-Based Access Control: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_24, ARC_02, ARC_05, SEC_03 |
| NODE_CAP_24_TESTING | Role-Based Access Control: verification | challenge | testing | delivery | needs input | review-required | — | CAP_24, ARC_02, ARC_05, SEC_03 |
| NODE_CAP_25_SECURITY | Secrets and Credential Management: security | private-pod | security | delivery | 8.5–11 person-days | review-required | — | CAP_25, SEC_06 |
| NODE_CAP_25_CLOUD_DEVOPS | Secrets and Credential Management: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_25, ARC_10, ARC_11, SEC_06 |
| NODE_CAP_25_TESTING | Secrets and Credential Management: verification | challenge | testing | delivery | needs input | review-required | — | CAP_25, ARC_10, ARC_11, SEC_06 |
| NODE_PH_1_DEPLOYMENT | Release Discovery and Architecture | private-pod | deployment | delivery | 48–74 person-days | review-required | — | PH_1, WS_PH_1 |
| NODE_PH_2_DEPLOYMENT | Release Experience and Core Platform | private-pod | deployment | delivery | 15.5–24 person-days | review-required | — | PH_2, WS_01, WS_02, WS_03, WS_04 |
| NODE_PH_3_DEPLOYMENT | Release Data and Integration | private-pod | deployment | delivery | 12–22.5 person-days | review-required | — | PH_3, WS_05, WS_06 |
| NODE_PH_4_DEPLOYMENT | Release AI Capabilities | private-pod | deployment | delivery | 16–21 person-days | review-required | — | PH_4, WS_07 |
| NODE_PH_5_DEPLOYMENT | Release Testing and Hardening | private-pod | deployment | delivery | 89–137 person-days | review-required | — | PH_5, WS_PH_5 |
| NODE_PH_6_DEPLOYMENT | Release Deployment and Handover | private-pod | deployment | delivery | 32–49 person-days | review-required | — | PH_6, WS_PH_6 |
| NODE_OPERATIONAL_HANDOFF_APPROVAL | Operational handoff approval | flexible-talent | technical-review | approval | needs input | review-required | — | — |

## Dependencies

| Edge | From | To | Type | Blocking | Handoff | Rationale |
| --- | --- | --- | --- | --- | --- | --- |
| EDGE_001 | NODE_CAP_01_BACKEND_API | NODE_CAP_01_TESTING | sequencing | yes | Deliverable ready for verification | Dashboards and Reporting: verification verifies the output of NODE_CAP_01_BACKEND_API. |
| EDGE_002 | NODE_CAP_01_CLOUD_DEVOPS | NODE_CAP_01_TESTING | model-handoff | yes | Deliverable ready for verification | Dashboards and Reporting: verification verifies the output of NODE_CAP_01_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_003 | NODE_CAP_01_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_004 | NODE_CAP_01_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Dashboards and Reporting: verification to be complete. |
| EDGE_005 | NODE_CAP_02_BACKEND_API | NODE_CAP_02_TESTING | sequencing | yes | Deliverable ready for verification | Document Management: verification verifies the output of NODE_CAP_02_BACKEND_API. |
| EDGE_006 | NODE_CAP_02_CLOUD_DEVOPS | NODE_CAP_02_TESTING | model-handoff | yes | Deliverable ready for verification | Document Management: verification verifies the output of NODE_CAP_02_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_007 | NODE_CAP_02_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_008 | NODE_CAP_02_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Document Management: verification to be complete. |
| EDGE_009 | NODE_CAP_03_BACKEND_API | NODE_CAP_03_TESTING | model-handoff | yes | Deliverable ready for verification | Forms and Data Capture: verification verifies the output of NODE_CAP_03_BACKEND_API. Handoff from private-pod to challenge. |
| EDGE_010 | NODE_CAP_03_BACKEND_API | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_011 | NODE_CAP_03_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_012 | NODE_CAP_04_BACKEND_API | NODE_CAP_04_TESTING | sequencing | yes | Deliverable ready for verification | Notifications and Alerts: verification verifies the output of NODE_CAP_04_BACKEND_API. |
| EDGE_013 | NODE_CAP_04_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Notifications and Alerts: verification to be complete. |
| EDGE_014 | NODE_CAP_05_BACKEND_API | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Payments and Billing: verification verifies the output of NODE_CAP_05_BACKEND_API. |
| EDGE_015 | NODE_CAP_05_CLOUD_DEVOPS | NODE_CAP_05_TESTING | model-handoff | yes | Deliverable ready for verification | Payments and Billing: verification verifies the output of NODE_CAP_05_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_016 | NODE_CAP_05_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_017 | NODE_CAP_05_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Payments and Billing: verification to be complete. |
| EDGE_018 | NODE_CAP_06_BACKEND_API | NODE_CAP_06_TESTING | sequencing | yes | Deliverable ready for verification | Self-Service Portal: verification verifies the output of NODE_CAP_06_BACKEND_API. |
| EDGE_019 | NODE_CAP_06_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Self-Service Portal: verification to be complete. |
| EDGE_020 | NODE_CAP_07_BACKEND_API | NODE_CAP_07_TESTING | sequencing | yes | Deliverable ready for verification | Workflow and Approvals: verification verifies the output of NODE_CAP_07_BACKEND_API. |
| EDGE_021 | NODE_CAP_07_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Workflow and Approvals: verification to be complete. |
| EDGE_022 | NODE_CAP_08_BACKEND_API | NODE_CAP_08_INTEGRATION | api-contract | yes | Agreed API contract | Core Platform Services: integration consumes the interface defined by NODE_CAP_08_BACKEND_API. |
| EDGE_023 | NODE_CAP_08_BACKEND_API | NODE_CAP_08_SECURITY | security-gate | yes | Security review | Core Platform Services: security reviews the security controls of NODE_CAP_08_BACKEND_API before release. |
| EDGE_024 | NODE_CAP_08_BACKEND_API | NODE_CAP_08_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_08_BACKEND_API. |
| EDGE_025 | NODE_CAP_08_BACKEND_API | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_026 | NODE_CAP_08_CLOUD_DEVOPS | NODE_CAP_08_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_08_CLOUD_DEVOPS. |
| EDGE_027 | NODE_CAP_08_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_028 | NODE_CAP_08_INTEGRATION | NODE_CAP_08_SECURITY | security-gate | yes | Security review | Core Platform Services: security reviews the security controls of NODE_CAP_08_INTEGRATION before release. |
| EDGE_029 | NODE_CAP_08_INTEGRATION | NODE_CAP_08_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_08_INTEGRATION. |
| EDGE_030 | NODE_CAP_08_INTEGRATION | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_031 | NODE_CAP_08_SECURITY | NODE_CAP_08_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_08_SECURITY. |
| EDGE_032 | NODE_CAP_08_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_033 | NODE_CAP_08_TESTING | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_034 | NODE_CAP_09_CLOUD_DEVOPS | NODE_CAP_09_TESTING | model-handoff | yes | Deliverable ready for verification | Data Migration: verification verifies the output of NODE_CAP_09_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_035 | NODE_CAP_09_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_036 | NODE_CAP_09_DATA_ENGINEERING | NODE_CAP_09_TESTING | model-handoff | yes | Deliverable ready for verification | Data Migration: verification verifies the output of NODE_CAP_09_DATA_ENGINEERING. Handoff from private-pod to challenge. |
| EDGE_037 | NODE_CAP_09_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_038 | NODE_CAP_09_INTEGRATION | NODE_CAP_09_TESTING | model-handoff | yes | Deliverable ready for verification | Data Migration: verification verifies the output of NODE_CAP_09_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_039 | NODE_CAP_09_INTEGRATION | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. |
| EDGE_040 | NODE_CAP_09_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_041 | NODE_CAP_10_CLOUD_DEVOPS | NODE_CAP_10_TESTING | model-handoff | yes | Deliverable ready for verification | Data Quality and Reconciliation: verification verifies the output of NODE_CAP_10_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_042 | NODE_CAP_10_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_043 | NODE_CAP_10_DATA_ENGINEERING | NODE_CAP_10_TESTING | model-handoff | yes | Deliverable ready for verification | Data Quality and Reconciliation: verification verifies the output of NODE_CAP_10_DATA_ENGINEERING. Handoff from private-pod to challenge. |
| EDGE_044 | NODE_CAP_10_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_045 | NODE_CAP_10_INTEGRATION | NODE_CAP_10_TESTING | model-handoff | yes | Deliverable ready for verification | Data Quality and Reconciliation: verification verifies the output of NODE_CAP_10_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_046 | NODE_CAP_10_INTEGRATION | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. |
| EDGE_047 | NODE_CAP_10_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_048 | NODE_CAP_11_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_049 | NODE_CAP_12_CLOUD_DEVOPS | NODE_CAP_12_TESTING | model-handoff | yes | Deliverable ready for verification | Document and Content Data Management: verification verifies the output of NODE_CAP_12_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_050 | NODE_CAP_12_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_051 | NODE_CAP_12_DATA_ENGINEERING | NODE_CAP_12_TESTING | model-handoff | yes | Deliverable ready for verification | Document and Content Data Management: verification verifies the output of NODE_CAP_12_DATA_ENGINEERING. Handoff from private-pod to challenge. |
| EDGE_052 | NODE_CAP_12_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_053 | NODE_CAP_12_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_054 | NODE_CAP_13_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_055 | NODE_CAP_14_CLOUD_DEVOPS | NODE_CAP_14_TESTING | model-handoff | yes | Deliverable ready for verification | API Integration Platform: verification verifies the output of NODE_CAP_14_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_056 | NODE_CAP_14_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. |
| EDGE_057 | NODE_CAP_14_INTEGRATION | NODE_CAP_14_TESTING | model-handoff | yes | Deliverable ready for verification | API Integration Platform: verification verifies the output of NODE_CAP_14_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_058 | NODE_CAP_14_INTEGRATION | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. |
| EDGE_059 | NODE_CAP_14_TESTING | NODE_PH_2_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. Handoff from challenge to private-pod. |
| EDGE_060 | NODE_CAP_15_CLOUD_DEVOPS | NODE_CAP_15_TESTING | model-handoff | yes | Deliverable ready for verification | Email and SMS Gateway Integration: verification verifies the output of NODE_CAP_15_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_061 | NODE_CAP_15_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_062 | NODE_CAP_15_INTEGRATION | NODE_CAP_15_TESTING | model-handoff | yes | Deliverable ready for verification | Email and SMS Gateway Integration: verification verifies the output of NODE_CAP_15_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_063 | NODE_CAP_15_INTEGRATION | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. |
| EDGE_064 | NODE_CAP_15_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. Handoff from challenge to private-pod. |
| EDGE_065 | NODE_CAP_16_CLOUD_DEVOPS | NODE_CAP_16_TESTING | model-handoff | yes | Deliverable ready for verification | ERP Integration: verification verifies the output of NODE_CAP_16_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_066 | NODE_CAP_16_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_067 | NODE_CAP_16_INTEGRATION | NODE_CAP_16_TESTING | model-handoff | yes | Deliverable ready for verification | ERP Integration: verification verifies the output of NODE_CAP_16_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_068 | NODE_CAP_16_INTEGRATION | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. |
| EDGE_069 | NODE_CAP_16_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. Handoff from challenge to private-pod. |
| EDGE_070 | NODE_CAP_17_CLOUD_DEVOPS | NODE_CAP_17_TESTING | model-handoff | yes | Deliverable ready for verification | Identity Provider Integration: verification verifies the output of NODE_CAP_17_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_071 | NODE_CAP_17_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_072 | NODE_CAP_17_INTEGRATION | NODE_CAP_17_TESTING | model-handoff | yes | Deliverable ready for verification | Identity Provider Integration: verification verifies the output of NODE_CAP_17_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_073 | NODE_CAP_17_INTEGRATION | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. |
| EDGE_074 | NODE_CAP_17_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. Handoff from challenge to private-pod. |
| EDGE_075 | NODE_CAP_18_CLOUD_DEVOPS | NODE_CAP_18_TESTING | model-handoff | yes | Deliverable ready for verification | Real-Time Integration Platform: verification verifies the output of NODE_CAP_18_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_076 | NODE_CAP_18_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. |
| EDGE_077 | NODE_CAP_18_INTEGRATION | NODE_CAP_18_TESTING | model-handoff | yes | Deliverable ready for verification | Real-Time Integration Platform: verification verifies the output of NODE_CAP_18_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_078 | NODE_CAP_18_INTEGRATION | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. |
| EDGE_079 | NODE_CAP_18_TESTING | NODE_PH_2_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. Handoff from challenge to private-pod. |
| EDGE_080 | NODE_CAP_19_AI_IMPLEMENTATION | NODE_CAP_19_TESTING | sequencing | yes | Deliverable ready for verification | AI Recommendations Engine: verification verifies the output of NODE_CAP_19_AI_IMPLEMENTATION. |
| EDGE_081 | NODE_CAP_19_BACKEND_API | NODE_CAP_19_TESTING | sequencing | yes | Deliverable ready for verification | AI Recommendations Engine: verification verifies the output of NODE_CAP_19_BACKEND_API. |
| EDGE_082 | NODE_CAP_19_CLOUD_DEVOPS | NODE_CAP_19_TESTING | model-handoff | yes | Deliverable ready for verification | AI Recommendations Engine: verification verifies the output of NODE_CAP_19_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_083 | NODE_CAP_19_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_084 | NODE_CAP_19_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires AI Recommendations Engine: verification to be complete. |
| EDGE_085 | NODE_CAP_20_CLOUD_DEVOPS | NODE_CAP_20_TESTING | model-handoff | yes | Deliverable ready for verification | Audit Logging and Compliance Monitoring: verification verifies the output of NODE_CAP_20_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_086 | NODE_CAP_20_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_087 | NODE_CAP_20_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Audit Logging and Compliance Monitoring: verification to be complete. |
| EDGE_088 | NODE_CAP_21_CLOUD_DEVOPS | NODE_CAP_21_TESTING | model-handoff | yes | Deliverable ready for verification | Data Encryption: verification verifies the output of NODE_CAP_21_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_089 | NODE_CAP_21_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_090 | NODE_CAP_21_SECURITY | NODE_CAP_21_TESTING | model-handoff | yes | Deliverable ready for verification | Data Encryption: verification verifies the output of NODE_CAP_21_SECURITY. Handoff from private-pod to challenge. |
| EDGE_091 | NODE_CAP_21_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_092 | NODE_CAP_21_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_093 | NODE_CAP_22_CLOUD_DEVOPS | NODE_CAP_22_TESTING | model-handoff | yes | Deliverable ready for verification | Multi-Factor Authentication: verification verifies the output of NODE_CAP_22_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_094 | NODE_CAP_22_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_095 | NODE_CAP_22_SECURITY | NODE_CAP_22_TESTING | model-handoff | yes | Deliverable ready for verification | Multi-Factor Authentication: verification verifies the output of NODE_CAP_22_SECURITY. Handoff from private-pod to challenge. |
| EDGE_096 | NODE_CAP_22_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_097 | NODE_CAP_22_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Multi-Factor Authentication: verification to be complete. |
| EDGE_098 | NODE_CAP_23_CLOUD_DEVOPS | NODE_CAP_23_TESTING | model-handoff | yes | Deliverable ready for verification | Network Protection: verification verifies the output of NODE_CAP_23_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_099 | NODE_CAP_23_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_100 | NODE_CAP_23_SECURITY | NODE_CAP_23_TESTING | model-handoff | yes | Deliverable ready for verification | Network Protection: verification verifies the output of NODE_CAP_23_SECURITY. Handoff from private-pod to challenge. |
| EDGE_101 | NODE_CAP_23_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_102 | NODE_CAP_23_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Network Protection: verification to be complete. |
| EDGE_103 | NODE_CAP_24_CLOUD_DEVOPS | NODE_CAP_24_TESTING | model-handoff | yes | Deliverable ready for verification | Role-Based Access Control: verification verifies the output of NODE_CAP_24_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_104 | NODE_CAP_24_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_105 | NODE_CAP_24_SECURITY | NODE_CAP_24_TESTING | model-handoff | yes | Deliverable ready for verification | Role-Based Access Control: verification verifies the output of NODE_CAP_24_SECURITY. Handoff from private-pod to challenge. |
| EDGE_106 | NODE_CAP_24_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_107 | NODE_CAP_24_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Role-Based Access Control: verification to be complete. |
| EDGE_108 | NODE_CAP_25_CLOUD_DEVOPS | NODE_CAP_25_TESTING | model-handoff | yes | Deliverable ready for verification | Secrets and Credential Management: verification verifies the output of NODE_CAP_25_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_109 | NODE_CAP_25_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_110 | NODE_CAP_25_SECURITY | NODE_CAP_25_TESTING | model-handoff | yes | Deliverable ready for verification | Secrets and Credential Management: verification verifies the output of NODE_CAP_25_SECURITY. Handoff from private-pod to challenge. |
| EDGE_111 | NODE_CAP_25_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_112 | NODE_CAP_25_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Secrets and Credential Management: verification to be complete. |
| EDGE_113 | NODE_GAP_01 | NODE_CAP_05_BACKEND_API | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is not yet known whether SAP S/4HANA exposes a REST API for journal posting or only IDoc/BAPI interfaces, which changes the integration design. |
| EDGE_114 | NODE_GAP_01 | NODE_CAP_05_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is not yet known whether SAP S/4HANA exposes a REST API for journal posting or only IDoc/BAPI interfaces, which changes the integration design. |
| EDGE_115 | NODE_GAP_01 | NODE_CAP_05_TESTING | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is not yet known whether SAP S/4HANA exposes a REST API for journal posting or only IDoc/BAPI interfaces, which changes the integration design. |
| EDGE_116 | NODE_GAP_01 | NODE_CAP_16_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is not yet known whether SAP S/4HANA exposes a REST API for journal posting or only IDoc/BAPI interfaces, which changes the integration design. |
| EDGE_117 | NODE_GAP_01 | NODE_CAP_16_INTEGRATION | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is not yet known whether SAP S/4HANA exposes a REST API for journal posting or only IDoc/BAPI interfaces, which changes the integration design. |
| EDGE_118 | NODE_GAP_01 | NODE_CAP_16_TESTING | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is not yet known whether SAP S/4HANA exposes a REST API for journal posting or only IDoc/BAPI interfaces, which changes the integration design. |
| EDGE_119 | NODE_GAP_02 | NODE_CAP_06_BACKEND_API | blocking-discovery | yes | Resolution of GAP_02 | NODE_GAP_02 must be resolved before this work is sequenced: Whether the policyholder-facing status tracker ships in the initial release or a fast-follow phase has not been decided. |
| EDGE_120 | NODE_GAP_02 | NODE_CAP_06_TESTING | blocking-discovery | yes | Resolution of GAP_02 | NODE_GAP_02 must be resolved before this work is sequenced: Whether the policyholder-facing status tracker ships in the initial release or a fast-follow phase has not been decided. |
| EDGE_121 | NODE_PH_1_DEPLOYMENT | NODE_PH_2_DEPLOYMENT | sequencing | yes | Release Discovery and Architecture released | Release Experience and Core Platform follows Release Discovery and Architecture in the imported delivery plan. |
| EDGE_122 | NODE_PH_2_DEPLOYMENT | NODE_PH_3_DEPLOYMENT | sequencing | yes | Release Experience and Core Platform released | Release Data and Integration follows Release Experience and Core Platform in the imported delivery plan. |
| EDGE_123 | NODE_PH_3_DEPLOYMENT | NODE_PH_4_DEPLOYMENT | sequencing | yes | Release Data and Integration released | Release AI Capabilities follows Release Data and Integration in the imported delivery plan. |
| EDGE_124 | NODE_PH_4_DEPLOYMENT | NODE_PH_5_DEPLOYMENT | sequencing | yes | Release AI Capabilities released | Release Testing and Hardening follows Release AI Capabilities in the imported delivery plan. |
| EDGE_125 | NODE_PH_5_DEPLOYMENT | NODE_PH_6_DEPLOYMENT | sequencing | yes | Release Testing and Hardening released | Release Deployment and Handover follows Release Testing and Hardening in the imported delivery plan. |
| EDGE_126 | NODE_PH_6_DEPLOYMENT | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Release Deployment and Handover to be complete. |
| EDGE_127 | NODE_Q_01 | NODE_CAP_05_BACKEND_API | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether SAP S/4HANA exposes a REST API for journal posting, or only IDoc/BAPI interfaces, before finalising the integration design. |
| EDGE_128 | NODE_Q_01 | NODE_CAP_05_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether SAP S/4HANA exposes a REST API for journal posting, or only IDoc/BAPI interfaces, before finalising the integration design. |
| EDGE_129 | NODE_Q_01 | NODE_CAP_05_TESTING | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether SAP S/4HANA exposes a REST API for journal posting, or only IDoc/BAPI interfaces, before finalising the integration design. |
| EDGE_130 | NODE_Q_01 | NODE_CAP_16_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether SAP S/4HANA exposes a REST API for journal posting, or only IDoc/BAPI interfaces, before finalising the integration design. |
| EDGE_131 | NODE_Q_01 | NODE_CAP_16_INTEGRATION | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether SAP S/4HANA exposes a REST API for journal posting, or only IDoc/BAPI interfaces, before finalising the integration design. |
| EDGE_132 | NODE_Q_01 | NODE_CAP_16_TESTING | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether SAP S/4HANA exposes a REST API for journal posting, or only IDoc/BAPI interfaces, before finalising the integration design. |

## Quality gate

Status: **Review Required** (score 76/100)

| Rule | Status | Finding |
| --- | --- | --- |
| source-coverage | pass | Source coverage is 112% (105/94 requirements, components, integrations and AI use cases are referenced by at least one node). |
| unsupported-nodes | pass | Every node cites an imported source or an approved user decision. |
| duplicate-scope | warn | 5 group(s) of nodes share a category and identical sources. |
| missing-acceptance | warn | 6 delivery node(s) have no acceptance condition in the package. |
| missing-inputs | warn | 8 delivery node(s) do not state what they need to start. |
| classification-completeness | pass | 98/98 nodes carry exactly one primary operating model. |
| missing-rationale | pass | Every classification explains itself in plain English. |
| model-to-work-mismatch | pass | No operating model contradicts the work it covers. |
| missing-package-fields | warn | 98 node(s) are missing information their operating model requires. |
| cycles | pass | The dependency graph is acyclic. |
| orphan-nodes | pass | Every delivery node is connected to the graph. |
| invalid-dependencies | pass | Every edge has a known type, a rationale and source identifiers. |
| blocked-or-stale | warn | 8 node(s) are blocked: NODE_CAP_05_BACKEND_API, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_06_BACKEND_API, NODE_CAP_06_TESTING, NODE_CAP_16_INTEGRATION, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING |
| critical-path-completeness | pass | The critical path (9 node(s), 349.5 person-days) is fully estimated. |
| human-approval | warn | No operator has approved the graph yet; operational handoff needs a recorded human decision. |

## Traceability

| Source | Kind | Title | Nodes | Covered |
| --- | --- | --- | --- | --- |
| BR_01 | business | Reduce claim-intake processing time | NODE_CAP_03_BACKEND_API, NODE_CAP_03_TESTING | yes |
| BR_02 | business | Unified claim, policy and payment view for examiners | NODE_CAP_05_BACKEND_API, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| BR_03 | business | Improve first-contact resolution for simple claims | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| BR_04 | business | Enable direct agent claim submission | NODE_CAP_03_BACKEND_API, NODE_CAP_03_TESTING, NODE_CAP_07_BACKEND_API, NODE_CAP_07_TESTING | yes |
| BR_05 | business | Policyholder claim-status tracker (candidate) | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| FR_01 | functional | Claim record lifecycle management | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| FR_02 | functional | First-notice-of-loss document upload | NODE_CAP_02_BACKEND_API, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING | yes |
| FR_03 | functional | Consolidated claim timeline | NODE_CAP_05_BACKEND_API, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| FR_04 | functional | Automated payment posting to SAP S/4HANA | NODE_CAP_05_BACKEND_API, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| FR_05 | functional | Policyholder self-service claim status | NODE_GAP_02, NODE_Q_02, NODE_CAP_06_BACKEND_API, NODE_CAP_06_TESTING | yes |
| FR_06 | functional | Supervisor reassignment and workload view | NODE_CAP_01_BACKEND_API, NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING | yes |
| FR_07 | functional | Agent-scoped claim visibility | NODE_CAP_03_BACKEND_API, NODE_CAP_03_TESTING | yes |
| FR_08 | functional | Seven-year claim history retention | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| FR_09 | functional | SIU flagging with automatic notification | NODE_CAP_04_BACKEND_API, NODE_CAP_04_TESTING | yes |
| FR_10 | functional | Advisory reserve-range suggestion for examiners | NODE_CAP_19_BACKEND_API, NODE_CAP_19_AI_IMPLEMENTATION, NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING | yes |
| NFR_01 | nonFunctional | 99.9% availability during business hours | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| NFR_02 | nonFunctional | Sub-2-second claim search performance | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| NFR_03 | nonFunctional | Registered user base of approximately 242,000 | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| NFR_04 | nonFunctional | Claim-data RPO/RTO targets | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| NFR_05 | nonFunctional | WCAG 2.1 AA accessibility | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| NFR_06 | nonFunctional | 900 concurrent sessions during catastrophe events | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| NFR_07 | nonFunctional | Immutable seven-year audit log | NODE_CAP_20_CLOUD_DEVOPS, NODE_CAP_20_TESTING | yes |
| INT_01 | integration | Guidewire ClaimCenter integration | NODE_CAP_18_INTEGRATION, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| INT_02 | integration | SAP S/4HANA payment-posting integration | NODE_GAP_01, NODE_Q_01, NODE_CAP_16_INTEGRATION, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING | yes |
| INT_03 | integration | Okta SSO federation | NODE_CAP_17_INTEGRATION, NODE_CAP_17_CLOUD_DEVOPS, NODE_CAP_17_TESTING | yes |
| INT_04 | integration | Agent-facing claim-submission API | NODE_CAP_14_INTEGRATION, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| INT_05 | integration | Twilio SMS/email claim notifications | NODE_CAP_15_INTEGRATION, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING | yes |
| INT_06 | integration | Hyland OnBase document-imaging integration | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| DATA_01 | data | Legacy claim data migration | NODE_CAP_09_INTEGRATION, NODE_CAP_09_DATA_ENGINEERING, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING | yes |
| DATA_02 | data | Scanned attachment migration | NODE_CAP_09_INTEGRATION, NODE_CAP_09_DATA_ENGINEERING, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING, NODE_CAP_12_DATA_ENGINEERING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING | yes |
| DATA_03 | data | Claim and policyholder PII classification | NODE_CAP_13_DATA_ENGINEERING | yes |
| DATA_04 | data | Migration reconciliation checks | NODE_CAP_09_INTEGRATION, NODE_CAP_09_DATA_ENGINEERING, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING, NODE_CAP_10_INTEGRATION, NODE_CAP_10_DATA_ENGINEERING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| DATA_05 | data | Cold-storage archival for claims over seven years (candidate) | NODE_CAP_11_DATA_ENGINEERING | yes |
| SEC_01 | security | GDPR scope for EU-resident policyholders | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| SEC_02 | security | Encryption at rest and in transit | NODE_CAP_21_SECURITY, NODE_CAP_21_CLOUD_DEVOPS, NODE_CAP_21_TESTING | yes |
| SEC_03 | security | Role-based claim access control | NODE_CAP_24_SECURITY, NODE_CAP_24_CLOUD_DEVOPS, NODE_CAP_24_TESTING | yes |
| SEC_04 | security | MFA for payment approval | NODE_CAP_22_SECURITY, NODE_CAP_22_CLOUD_DEVOPS, NODE_CAP_22_TESTING | yes |
| SEC_05 | security | Third-party penetration testing | NODE_CAP_23_SECURITY, NODE_CAP_23_CLOUD_DEVOPS, NODE_CAP_23_TESTING | yes |
| SEC_06 | security | Revocable scoped API credentials for agents | NODE_CAP_25_SECURITY, NODE_CAP_25_CLOUD_DEVOPS, NODE_CAP_25_TESTING | yes |
| TECH_01 | technology | Azure as target cloud platform | — | no |
| TECH_02 | technology | Managed PostgreSQL or Azure SQL database | — | no |
| TECH_03 | technology | React / .NET staff skill alignment | — | no |
| CON_01 | constraint | 46-week go-live target | — | no |
| CON_02 | constraint | 60-day parallel-run stabilisation | — | no |
| CON_03 | constraint | Limited customer staffing for the program | — | no |
| CON_04 | constraint | Idaho pilot before statewide rollout | — | no |
| CON_05 | constraint | Policy Admin System excluded from this engagement | — | no |
| SYS_01 | existingSystem | Guidewire ClaimCenter | NODE_CAP_18_INTEGRATION | yes |
| SYS_02 | existingSystem | SAP S/4HANA | NODE_CAP_16_INTEGRATION | yes |
| SYS_03 | existingSystem | Okta | NODE_CAP_17_INTEGRATION | yes |
| SYS_04 | existingSystem | Legacy ClaimsDesk Portal | NODE_CAP_09_INTEGRATION, NODE_CAP_10_INTEGRATION | yes |
| SYS_05 | existingSystem | Hyland OnBase | NODE_CAP_08_INTEGRATION | yes |
| PER_01 | persona | Claims Examiner | — | no |
| PER_02 | persona | Independent Agent | — | no |
| PER_03 | persona | Policyholder | — | no |
| PER_04 | persona | Claims Supervisor | — | no |
| ARC_01 | component | web-hosting-cdn (Azure Static Web Apps with Azure Front Door) | NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| ARC_02 | component | api-gateway (Azure API Management) | NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING, NODE_CAP_24_CLOUD_DEVOPS, NODE_CAP_24_TESTING | yes |
| ARC_03 | component | container-runtime (Azure Container Apps) | NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| ARC_04 | component | managed-relational-db (Azure Database for PostgreSQL - Flexible Server) | NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING, NODE_CAP_21_CLOUD_DEVOPS, NODE_CAP_21_TESTING | yes |
| ARC_05 | component | identity-customer (Microsoft Entra External ID) | NODE_CAP_22_CLOUD_DEVOPS, NODE_CAP_22_TESTING, NODE_CAP_24_CLOUD_DEVOPS, NODE_CAP_24_TESTING | yes |
| ARC_06 | component | monitoring (Azure Monitor) | NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING, NODE_CAP_20_CLOUD_DEVOPS, NODE_CAP_20_TESTING | yes |
| ARC_07 | component | logging (Azure Monitor Log Analytics) | NODE_CAP_20_CLOUD_DEVOPS, NODE_CAP_20_TESTING | yes |
| ARC_08 | component | ci-cd (Azure Pipelines) | — | no |
| ARC_09 | component | infrastructure-as-code (Azure Resource Manager (Bicep templates)) | — | no |
| ARC_10 | component | secrets-manager (Azure Key Vault (secrets)) | NODE_CAP_25_CLOUD_DEVOPS, NODE_CAP_25_TESTING | yes |
| ARC_11 | component | key-management (Azure Key Vault (keys, HSM-backed)) | NODE_CAP_21_CLOUD_DEVOPS, NODE_CAP_21_TESTING, NODE_CAP_25_CLOUD_DEVOPS, NODE_CAP_25_TESTING | yes |
| ARC_12 | component | backup (Azure Backup) | NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| ARC_13 | component | private-networking (Azure Virtual Network with Private Endpoints) | NODE_CAP_23_CLOUD_DEVOPS, NODE_CAP_23_TESTING | yes |
| ARC_14 | component | waf-ddos (Azure Web Application Firewall with Azure DDoS Protection) | NODE_CAP_23_CLOUD_DEVOPS, NODE_CAP_23_TESTING | yes |
| ARC_15 | component | api-gateway (Azure API Management) | NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING, NODE_CAP_17_CLOUD_DEVOPS, NODE_CAP_17_TESTING, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| ARC_16 | component | integration-service (Azure Logic Apps) | NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING, NODE_CAP_17_CLOUD_DEVOPS, NODE_CAP_17_TESTING, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| ARC_17 | component | message-queue (Azure Service Bus (queues)) | NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING, NODE_CAP_17_CLOUD_DEVOPS, NODE_CAP_17_TESTING, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| ARC_18 | component | event-bus (Azure Event Grid) | NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| ARC_19 | component | data-warehouse (Azure Synapse Analytics (dedicated SQL pool)) | NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| ARC_20 | component | etl-pipeline (Azure Data Factory) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING | yes |
| ARC_21 | component | object-storage (Azure Blob Storage) | NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING, NODE_CAP_06_TESTING, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING | yes |
| ARC_22 | component | bi-reporting (Power BI) | NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| ARC_23 | component | llm-platform (Azure OpenAI in Azure AI Foundry) | NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING | yes |
| ARC_24 | component | ml-platform (Azure Machine Learning) | NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING | yes |
| ARC_25 | component | availability-scaling (Zone-redundant Azure Container Apps environment with KEDA scale rules) | NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| ARC_26 | component | dr-multi-region (Azure Database for PostgreSQL cross-region read replica with geo-redundant backup (paired region)) | NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| ARC_27 | component | cache (Azure Cache for Redis) | NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| ARC_28 | component | search-service (Azure AI Search) | NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| ARC_29 | component | notification (Azure Communication Services) | NODE_CAP_04_TESTING, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING | yes |
| ARC_30 | component | workflow-orchestration (Azure Durable Functions) | NODE_CAP_03_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_07_TESTING, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING, NODE_CAP_22_CLOUD_DEVOPS, NODE_CAP_22_TESTING | yes |
| IF_01 | integration | Guidewire ClaimCenter integration | NODE_CAP_18_INTEGRATION | yes |
| IF_02 | integration | SAP S/4HANA payment-posting integration | NODE_CAP_16_INTEGRATION | yes |
| IF_03 | integration | Okta SSO federation | NODE_CAP_17_INTEGRATION | yes |
| IF_04 | integration | Agent-facing claim-submission API | NODE_CAP_14_INTEGRATION | yes |
| IF_05 | integration | Twilio SMS/email claim notifications | NODE_CAP_15_INTEGRATION | yes |
| IF_06 | integration | Hyland OnBase document-imaging integration | NODE_CAP_08_INTEGRATION | yes |
| IF_07 | integration | Legacy ClaimsDesk Portal (parallel-run cutover) | NODE_CAP_09_INTEGRATION, NODE_CAP_10_INTEGRATION | yes |
| AIUC_01 | aiUseCase | Advisory reserve-range suggestion for examiners | NODE_CAP_19_AI_IMPLEMENTATION | yes |
| CAP_01 | capability | Dashboards and Reporting | NODE_CAP_01_BACKEND_API, NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING | yes |
| CAP_02 | capability | Document Management | NODE_CAP_02_BACKEND_API, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING | yes |
| CAP_03 | capability | Forms and Data Capture | NODE_CAP_03_BACKEND_API, NODE_CAP_03_TESTING | yes |
| CAP_04 | capability | Notifications and Alerts | NODE_CAP_04_BACKEND_API, NODE_CAP_04_TESTING | yes |
| CAP_05 | capability | Payments and Billing | NODE_CAP_05_BACKEND_API, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| CAP_06 | capability | Self-Service Portal | NODE_CAP_06_BACKEND_API, NODE_CAP_06_TESTING | yes |
| CAP_07 | capability | Workflow and Approvals | NODE_CAP_07_BACKEND_API, NODE_CAP_07_TESTING | yes |
| CAP_08 | capability | Core Platform Services | NODE_CAP_08_BACKEND_API, NODE_CAP_08_INTEGRATION, NODE_CAP_08_SECURITY, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| CAP_09 | capability | Data Migration | NODE_CAP_09_INTEGRATION, NODE_CAP_09_DATA_ENGINEERING, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING | yes |
| CAP_10 | capability | Data Quality and Reconciliation | NODE_CAP_10_INTEGRATION, NODE_CAP_10_DATA_ENGINEERING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| CAP_11 | capability | Data Retention and Archival | NODE_CAP_11_DATA_ENGINEERING | yes |
| CAP_12 | capability | Document and Content Data Management | NODE_CAP_12_DATA_ENGINEERING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING | yes |
| CAP_13 | capability | Personal Data Protection | NODE_CAP_13_DATA_ENGINEERING | yes |
| CAP_14 | capability | API Integration Platform | NODE_CAP_14_INTEGRATION, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| CAP_15 | capability | Email and SMS Gateway Integration | NODE_CAP_15_INTEGRATION, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING | yes |
| CAP_16 | capability | ERP Integration | NODE_CAP_16_INTEGRATION, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING | yes |
| CAP_17 | capability | Identity Provider Integration | NODE_CAP_17_INTEGRATION, NODE_CAP_17_CLOUD_DEVOPS, NODE_CAP_17_TESTING | yes |
| CAP_18 | capability | Real-Time Integration Platform | NODE_CAP_18_INTEGRATION, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| CAP_19 | capability | AI Recommendations Engine | NODE_CAP_19_BACKEND_API, NODE_CAP_19_AI_IMPLEMENTATION, NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING | yes |
| CAP_20 | capability | Audit Logging and Compliance Monitoring | NODE_CAP_20_CLOUD_DEVOPS, NODE_CAP_20_TESTING | yes |
| CAP_21 | capability | Data Encryption | NODE_CAP_21_SECURITY, NODE_CAP_21_CLOUD_DEVOPS, NODE_CAP_21_TESTING | yes |
| CAP_22 | capability | Multi-Factor Authentication | NODE_CAP_22_SECURITY, NODE_CAP_22_CLOUD_DEVOPS, NODE_CAP_22_TESTING | yes |
| CAP_23 | capability | Network Protection | NODE_CAP_23_SECURITY, NODE_CAP_23_CLOUD_DEVOPS, NODE_CAP_23_TESTING | yes |
| CAP_24 | capability | Role-Based Access Control | NODE_CAP_24_SECURITY, NODE_CAP_24_CLOUD_DEVOPS, NODE_CAP_24_TESTING | yes |
| CAP_25 | capability | Secrets and Credential Management | NODE_CAP_25_SECURITY, NODE_CAP_25_CLOUD_DEVOPS, NODE_CAP_25_TESTING | yes |

## Notes

- 7 discovery, clarification or approval node(s) generated from gaps, questions and unconfirmed assumptions.
- 98 node(s) after removing 0 user-removed node(s).
- AI layer: provider mock in mock mode produced 98 suggestion(s); none are applied without a recorded user decision.
- Quality gate: Review Required (0 failing, 6 warning rule(s)).

Blocked or incomplete nodes are marked `not ready for operational handoff`. This document is a planning aid: it never recruits talent, launches a challenge or commits delivery.
