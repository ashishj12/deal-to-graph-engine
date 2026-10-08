# Execution plan: Unified Supply Chain Analytics

| Field | Value |
| --- | --- |
| Deal id | 174e0df9-150f-403d-bddc-00739b13f69f |
| Package maturity | review-required |
| Graph revision | 0 |
| Nodes | 88 |
| Dependencies | 113 |
| Waves | 9 |
| Operating models | 22 flexible-talent · 22 challenge · 44 private-pod |
| Graph effort | 452.5–692.5 person-days |
| Critical path | 6 node(s), 271.5 person-days |
| Duration estimate | 271.5 person-days |
| Quality gate | Review Required |
| Generator | mock (mock) |

> MOCK AI MODE — no external service was contacted.

## Execution waves

### Wave 1 — 55 node(s), 298 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_CAP_01_BACKEND_API | Catalog and Inventory Management: backend and API | challenge | backend-api | review-required |
| NODE_CAP_02_BACKEND_API | Dashboards and Reporting: backend and API | challenge | backend-api | review-required |
| NODE_CAP_02_CLOUD_DEVOPS | Dashboards and Reporting: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_03_BACKEND_API | Orders and Fulfilment: backend and API | challenge | backend-api | review-required |
| NODE_CAP_03_CLOUD_DEVOPS | Orders and Fulfilment: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_04_BACKEND_API | Workflow and Approvals: backend and API | challenge | backend-api | review-required |
| NODE_CAP_04_CLOUD_DEVOPS | Workflow and Approvals: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_05_BACKEND_API | Core Platform Services: backend and API | private-pod | backend-api | review-required |
| NODE_CAP_05_CLOUD_DEVOPS | Core Platform Services: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_05_DATA_ENGINEERING | Core Platform Services: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_06_DATA_ENGINEERING | Data Quality and Reconciliation: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_08_DATA_ENGINEERING | Master and Reference Data Management: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_09_DATA_ENGINEERING | Personal Data Protection: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_11_CLOUD_DEVOPS | Batch Integration Platform: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_11_INTEGRATION | Batch Integration Platform: integration | private-pod | integration | review-required |
| NODE_CAP_11_INTEGRATION_2 | Batch Integration Platform: integration | private-pod | integration | review-required |
| NODE_CAP_12_CLOUD_DEVOPS | CRM Integration: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_12_INTEGRATION | CRM Integration: integration | private-pod | integration | review-required |
| NODE_CAP_13_CLOUD_DEVOPS | ERP Integration: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_13_INTEGRATION | ERP Integration: integration | private-pod | integration | review-required |
| NODE_CAP_14_CLOUD_DEVOPS | File-Based Integration Platform: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_14_INTEGRATION | File-Based Integration Platform: integration | private-pod | integration | review-required |
| NODE_CAP_15_CLOUD_DEVOPS | Identity Provider Integration: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_15_INTEGRATION | Identity Provider Integration: integration | private-pod | integration | review-required |
| NODE_CAP_17_AI_IMPLEMENTATION | AI Forecasting and Prediction: AI implementation | challenge | ai-implementation | review-required |
| NODE_CAP_17_BACKEND_API | AI Forecasting and Prediction: backend and API | challenge | backend-api | review-required |
| NODE_CAP_17_CLOUD_DEVOPS | AI Forecasting and Prediction: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_19_CLOUD_DEVOPS | Data Encryption: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_19_SECURITY | Data Encryption: security | private-pod | security | review-required |
| NODE_CAP_20_CLOUD_DEVOPS | Role-Based Access Control: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_20_SECURITY | Role-Based Access Control: security | private-pod | security | review-required |
| NODE_CAP_21_CLOUD_DEVOPS | Secrets and Credential Management: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_21_SECURITY | Secrets and Credential Management: security | private-pod | security | review-required |
| NODE_GAP_01 | Manhattan WMS real-time coverage unconfirmed | flexible-talent | discovery | review-required |
| NODE_GAP_02 | Historical migration window undecided | flexible-talent | discovery | review-required |
| NODE_GAP_03 | Target phase for the customer-tracking API not set | flexible-talent | discovery | review-required |
| NODE_PH_1_DEPLOYMENT | Release Discovery and Architecture | private-pod | deployment | review-required |
| NODE_PROVIDE_MISSING_ESTIMATION_INPUT_DATA_VOLUME_AND_MIGRATION_SCOPE | Provide missing estimation input: Data volume and migration scope | flexible-talent | discovery | review-required |
| NODE_PROVIDE_MISSING_ESTIMATION_INPUT_INTEGRATION_READINESS | Provide missing estimation input: Integration readiness | flexible-talent | discovery | review-required |
| NODE_Q_01 | Can Manhattan WMS publish real-time events at all 46 depots? | flexible-talent | discovery | review-required |
| NODE_Q_02 | How far back should historical migration go? | flexible-talent | discovery | review-required |
| NODE_Q_03 | Confirm the target phase for the customer-tracking API | flexible-talent | discovery | review-required |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION_2 | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_MISSING_ESTIMATION_INPUTS | Resolve quality finding: missing-estimation-inputs | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_MISSING_ESTIMATION_INPUTS_2 | Resolve quality finding: missing-estimation-inputs | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_2 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_3 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | review-required |
| NODE_RE_BASELINE_AI_STRATEGY | Re-baseline AI strategy | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_ARCHITECTURE | Re-baseline Architecture | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_DATA_AND_INTEGRATION | Re-baseline Data and integration | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_ESTIMATE | Re-baseline Estimate | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_PRODUCT_REQUIREMENTS | Re-baseline Product requirements | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_QUALITY | Re-baseline Quality | flexible-talent | discovery | review-required |

### Wave 2 — 22 node(s), 143.5 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_CAP_01_TESTING | Catalog and Inventory Management: verification | challenge | testing | review-required |
| NODE_CAP_02_TESTING | Dashboards and Reporting: verification | challenge | testing | review-required |
| NODE_CAP_03_TESTING | Orders and Fulfilment: verification | challenge | testing | review-required |
| NODE_CAP_04_TESTING | Workflow and Approvals: verification | challenge | testing | review-required |
| NODE_CAP_05_SECURITY | Core Platform Services: security | private-pod | security | review-required |
| NODE_CAP_07_CLOUD_DEVOPS | Data Retention and Archival: cloud and DevOps | private-pod | cloud-devops | blocked |
| NODE_CAP_07_DATA_ENGINEERING | Data Retention and Archival: data engineering | private-pod | data-engineering | blocked |
| NODE_CAP_10_CLOUD_DEVOPS | Reporting Data Marts: cloud and DevOps | private-pod | cloud-devops | blocked |
| NODE_CAP_10_DATA_ENGINEERING | Reporting Data Marts: data engineering | private-pod | data-engineering | blocked |
| NODE_CAP_11_TESTING | Batch Integration Platform: verification | challenge | testing | review-required |
| NODE_CAP_12_TESTING | CRM Integration: verification | challenge | testing | review-required |
| NODE_CAP_13_TESTING | ERP Integration: verification | challenge | testing | review-required |
| NODE_CAP_14_TESTING | File-Based Integration Platform: verification | challenge | testing | review-required |
| NODE_CAP_15_TESTING | Identity Provider Integration: verification | challenge | testing | review-required |
| NODE_CAP_16_CLOUD_DEVOPS | Real-Time Integration Platform: cloud and DevOps | private-pod | cloud-devops | blocked |
| NODE_CAP_16_INTEGRATION | Real-Time Integration Platform: integration | private-pod | integration | blocked |
| NODE_CAP_17_TESTING | AI Forecasting and Prediction: verification | challenge | testing | review-required |
| NODE_CAP_18_CLOUD_DEVOPS | Audit Logging and Compliance Monitoring: cloud and DevOps | private-pod | cloud-devops | blocked |
| NODE_CAP_18_SECURITY | Audit Logging and Compliance Monitoring: security | private-pod | security | blocked |
| NODE_CAP_19_TESTING | Data Encryption: verification | private-pod | testing | review-required |
| NODE_CAP_20_TESTING | Role-Based Access Control: verification | challenge | testing | review-required |
| NODE_CAP_21_TESTING | Secrets and Credential Management: verification | challenge | testing | review-required |

### Wave 3 — 5 node(s), 38.5 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_CAP_05_TESTING | Core Platform Services: verification | private-pod | testing | review-required |
| NODE_CAP_07_TESTING | Data Retention and Archival: verification | challenge | testing | blocked |
| NODE_CAP_10_TESTING | Reporting Data Marts: verification | challenge | testing | blocked |
| NODE_CAP_16_TESTING | Real-Time Integration Platform: verification | challenge | testing | blocked |
| NODE_CAP_18_TESTING | Audit Logging and Compliance Monitoring: verification | challenge | testing | blocked |

### Wave 4 — 1 node(s), 13.5 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_2_DEPLOYMENT | Release Experience and Core Platform | private-pod | deployment | review-required |

### Wave 5 — 1 node(s), 17 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_3_DEPLOYMENT | Release Data and Integration | private-pod | deployment | review-required |

### Wave 6 — 1 node(s), 35 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_4_DEPLOYMENT | Release AI Capabilities | private-pod | deployment | review-required |

### Wave 7 — 1 node(s), 108 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_5_DEPLOYMENT | Release Testing and Hardening | private-pod | deployment | review-required |

### Wave 8 — 1 node(s), 39 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_6_DEPLOYMENT | Release Deployment and Handover | private-pod | deployment | review-required |

### Wave 9 — 1 node(s), 0 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_OPERATIONAL_HANDOFF_APPROVAL | Operational handoff approval | flexible-talent | technical-review | review-required |

## Critical path

Tie-break rule: Longest total effort over effort.maximum; when two predecessors tie, the path arriving through the lexicographically smaller node id wins.

| Order | Node | Title | Effort |
| --- | --- | --- | --- |
| 1 | NODE_PH_1_DEPLOYMENT | Release Discovery and Architecture | 38–59 person-days |
| 2 | NODE_PH_2_DEPLOYMENT | Release Experience and Core Platform | 10.5–13.5 person-days |
| 3 | NODE_PH_3_DEPLOYMENT | Release Data and Integration | 9–17 person-days |
| 4 | NODE_PH_4_DEPLOYMENT | Release AI Capabilities | 27–35 person-days |
| 5 | NODE_PH_5_DEPLOYMENT | Release Testing and Hardening | 71–108 person-days |
| 6 | NODE_PH_6_DEPLOYMENT | Release Deployment and Handover | 26–39 person-days |

Optimistic path (effort.minimum): 181.5 person-days — NODE_PH_1_DEPLOYMENT → NODE_PH_2_DEPLOYMENT → NODE_PH_3_DEPLOYMENT → NODE_PH_4_DEPLOYMENT → NODE_PH_5_DEPLOYMENT → NODE_PH_6_DEPLOYMENT

## Node inventory

| Node | Title | Model | Category | Kind | Effort | Readiness | Blocked by | Source ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NODE_GAP_01 | Manhattan WMS real-time coverage unconfirmed | flexible-talent | discovery | discovery | needs input | review-required | — | GAP_01, INT_02, Q_01 |
| NODE_GAP_02 | Historical migration window undecided | flexible-talent | discovery | discovery | needs input | review-required | — | GAP_02, NFR_04, Q_02 |
| NODE_GAP_03 | Target phase for the customer-tracking API not set | flexible-talent | discovery | discovery | needs input | review-required | — | GAP_03, Q_03 |
| NODE_Q_01 | Can Manhattan WMS publish real-time events at all 46 depots? | flexible-talent | discovery | clarification | needs input | review-required | — | Q_01, GAP_01 |
| NODE_Q_02 | How far back should historical migration go? | flexible-talent | discovery | clarification | needs input | review-required | — | Q_02, GAP_02 |
| NODE_Q_03 | Confirm the target phase for the customer-tracking API | flexible-talent | discovery | clarification | needs input | review-required | — | Q_03, GAP_03 |
| NODE_RE_BASELINE_PRODUCT_REQUIREMENTS | Re-baseline Product requirements | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_01_PRODUCT_REQUIREMENTS |
| NODE_RE_BASELINE_ARCHITECTURE | Re-baseline Architecture | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_02_ARCHITECTURE |
| NODE_RE_BASELINE_DATA_AND_INTEGRATION | Re-baseline Data and integration | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_03_DATA_AND_INTEGRATION |
| NODE_RE_BASELINE_AI_STRATEGY | Re-baseline AI strategy | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_04_AI_STRATEGY |
| NODE_RE_BASELINE_ESTIMATE | Re-baseline Estimate | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_05_ESTIMATE |
| NODE_RE_BASELINE_QUALITY | Re-baseline Quality | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_06_QUALITY |
| NODE_PROVIDE_MISSING_ESTIMATION_INPUT_INTEGRATION_READINESS | Provide missing estimation input: Integration readiness | flexible-talent | discovery | clarification | needs input | review-required | — | EST_MISSING_01 |
| NODE_PROVIDE_MISSING_ESTIMATION_INPUT_DATA_VOLUME_AND_MIGRATION_SCOPE | Provide missing estimation input: Data volume and migration scope | flexible-talent | discovery | clarification | needs input | review-required | — | EST_MISSING_02 |
| NODE_RESOLVE_QUALITY_FINDING_MISSING_ESTIMATION_INPUTS | Resolve quality finding: missing-estimation-inputs | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_MISSING_ESTIMATION_INPUTS |
| NODE_RESOLVE_QUALITY_FINDING_MISSING_ESTIMATION_INPUTS_2 | Resolve quality finding: missing-estimation-inputs | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_MISSING_ESTIMATION_INPUTS |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_UNRESOLVED_QUESTIONS |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_2 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_UNRESOLVED_QUESTIONS |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_3 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_UNRESOLVED_QUESTIONS |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_ASSUMPTIONS_NEEDING_VALIDATION |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION_2 | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_ASSUMPTIONS_NEEDING_VALIDATION |
| NODE_CAP_01_BACKEND_API | Catalog and Inventory Management: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_01, BR_01, FR_05 |
| NODE_CAP_01_TESTING | Catalog and Inventory Management: verification | challenge | testing | delivery | needs input | review-required | — | CAP_01, BR_01, FR_05 |
| NODE_CAP_02_BACKEND_API | Dashboards and Reporting: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_02, FR_06, FR_09, FR_10 |
| NODE_CAP_02_CLOUD_DEVOPS | Dashboards and Reporting: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | review-required | — | CAP_02, ARC_21, ARC_23, FR_06, FR_09, FR_10 |
| NODE_CAP_02_TESTING | Dashboards and Reporting: verification | challenge | testing | delivery | needs input | review-required | — | CAP_02, FR_06, FR_09, FR_10, ARC_21, ARC_23 |
| NODE_CAP_03_BACKEND_API | Orders and Fulfilment: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_03, FR_01 |
| NODE_CAP_03_CLOUD_DEVOPS | Orders and Fulfilment: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | review-required | — | CAP_03, ARC_01, ARC_18, ARC_22, FR_01 |
| NODE_CAP_03_TESTING | Orders and Fulfilment: verification | challenge | testing | delivery | needs input | review-required | — | CAP_03, FR_01, ARC_01, ARC_18, ARC_22 |
| NODE_CAP_04_BACKEND_API | Workflow and Approvals: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_04, FR_07 |
| NODE_CAP_04_CLOUD_DEVOPS | Workflow and Approvals: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | review-required | — | CAP_04, ARC_21, ARC_23, ARC_27, FR_07 |
| NODE_CAP_04_TESTING | Workflow and Approvals: verification | challenge | testing | delivery | needs input | review-required | — | CAP_04, FR_07, ARC_21, ARC_23, ARC_27 |
| NODE_CAP_05_BACKEND_API | Core Platform Services: backend and API | private-pod | backend-api | delivery | 10.5–13.5 person-days | review-required | — | CAP_05, BR_02, BR_04, FR_02, FR_03, FR_04, NFR_01, NFR_02, NFR_03, NFR_05, NFR_06, DATA_02, SEC_05 |
| NODE_CAP_05_DATA_ENGINEERING | Core Platform Services: data engineering | private-pod | data-engineering | delivery | 10.5–13.5 person-days | review-required | — | CAP_05, DATA_02, BR_02, BR_04, FR_02, FR_03, FR_04, NFR_01, NFR_02, NFR_03, NFR_05, NFR_06, SEC_05 |
| NODE_CAP_05_SECURITY | Core Platform Services: security | private-pod | security | delivery | 10.5–13.5 person-days | review-required | — | CAP_05, SEC_05, BR_02, BR_04, FR_02, FR_03, FR_04, NFR_01, NFR_02, NFR_03, NFR_05, NFR_06, DATA_02 |
| NODE_CAP_05_CLOUD_DEVOPS | Core Platform Services: cloud and DevOps | private-pod | cloud-devops | delivery | 10.5–13.5 person-days | review-required | — | CAP_05, ARC_01, ARC_02, ARC_03, ARC_04, ARC_06, ARC_13, ARC_14, ARC_18, ARC_21, ARC_22, ARC_23, ARC_26, BR_02, BR_04, FR_02, FR_03, FR_04, NFR_01, NFR_02, NFR_03, NFR_05, NFR_06, DATA_02, SEC_05 |
| NODE_CAP_05_TESTING | Core Platform Services: verification | private-pod | testing | delivery | 10.5–13.5 person-days | review-required | — | CAP_05, BR_02, BR_04, FR_02, FR_03, FR_04, ARC_01, ARC_02, ARC_03, ARC_04, ARC_06, ARC_13, ARC_14, ARC_18, ARC_21, ARC_22, ARC_23, ARC_26, NFR_01, NFR_02, NFR_03, NFR_05, NFR_06, DATA_02, SEC_05 |
| NODE_CAP_06_DATA_ENGINEERING | Data Quality and Reconciliation: data engineering | private-pod | data-engineering | delivery | 6.5–10 person-days | review-required | — | CAP_06, DATA_03, DATA_04 |
| NODE_CAP_07_DATA_ENGINEERING | Data Retention and Archival: data engineering | private-pod | data-engineering | delivery | 6.5–10 person-days | blocked | GAP_02 | CAP_07, DATA_06 |
| NODE_CAP_07_CLOUD_DEVOPS | Data Retention and Archival: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | blocked | GAP_02 | CAP_07, ARC_12, ARC_21, ARC_23, DATA_06 |
| NODE_CAP_07_TESTING | Data Retention and Archival: verification | challenge | testing | delivery | 6.5–10 person-days | blocked | GAP_02 | CAP_07, ARC_12, ARC_21, ARC_23, DATA_06 |
| NODE_CAP_08_DATA_ENGINEERING | Master and Reference Data Management: data engineering | private-pod | data-engineering | delivery | 6.5–10 person-days | review-required | — | CAP_08, DATA_04 |
| NODE_CAP_09_DATA_ENGINEERING | Personal Data Protection: data engineering | private-pod | data-engineering | delivery | 6.5–10 person-days | review-required | — | CAP_09, DATA_05 |
| NODE_CAP_10_DATA_ENGINEERING | Reporting Data Marts: data engineering | private-pod | data-engineering | delivery | 6.5–10 person-days | blocked | GAP_02 | CAP_10, DATA_01, DATA_06 |
| NODE_CAP_10_CLOUD_DEVOPS | Reporting Data Marts: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | blocked | GAP_02 | CAP_10, ARC_12, ARC_21, ARC_23, DATA_01, DATA_06 |
| NODE_CAP_10_TESTING | Reporting Data Marts: verification | challenge | testing | delivery | 6.5–10 person-days | blocked | GAP_02 | CAP_10, ARC_12, ARC_21, ARC_23, DATA_01, DATA_06 |
| NODE_CAP_11_INTEGRATION | Batch Integration Platform: integration | private-pod | integration | delivery | 3.5–5 person-days | review-required | — | CAP_11, IF_01, INT_01, SYS_01, INT_03 |
| NODE_CAP_11_INTEGRATION_2 | Batch Integration Platform: integration | private-pod | integration | delivery | 3.5–5 person-days | review-required | — | CAP_11, IF_03, INT_03, SYS_02, INT_01 |
| NODE_CAP_11_CLOUD_DEVOPS | Batch Integration Platform: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_11, ARC_15, ARC_16, ARC_17, ARC_20, INT_01, INT_03 |
| NODE_CAP_11_TESTING | Batch Integration Platform: verification | challenge | testing | delivery | 3.5–5 person-days | review-required | — | CAP_11, ARC_15, ARC_16, ARC_17, ARC_20, INT_01, INT_03 |
| NODE_CAP_12_INTEGRATION | CRM Integration: integration | private-pod | integration | delivery | 9–17 person-days | review-required | — | CAP_12, IF_03, INT_03, SYS_02 |
| NODE_CAP_12_CLOUD_DEVOPS | CRM Integration: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | review-required | — | CAP_12, ARC_15, ARC_16, ARC_17, ARC_20, INT_03 |
| NODE_CAP_12_TESTING | CRM Integration: verification | challenge | testing | delivery | 9–17 person-days | review-required | — | CAP_12, ARC_15, ARC_16, ARC_17, ARC_20, INT_03 |
| NODE_CAP_13_INTEGRATION | ERP Integration: integration | private-pod | integration | delivery | 9–17 person-days | review-required | — | CAP_13, IF_01, INT_01, SYS_01 |
| NODE_CAP_13_CLOUD_DEVOPS | ERP Integration: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | review-required | — | CAP_13, ARC_15, ARC_16, ARC_17, ARC_20, INT_01 |
| NODE_CAP_13_TESTING | ERP Integration: verification | challenge | testing | delivery | 9–17 person-days | review-required | — | CAP_13, ARC_15, ARC_16, ARC_17, ARC_20, INT_01 |
| NODE_CAP_14_INTEGRATION | File-Based Integration Platform: integration | private-pod | integration | delivery | 3.5–5 person-days | review-required | — | CAP_14, IF_04, INT_04, SYS_04 |
| NODE_CAP_14_CLOUD_DEVOPS | File-Based Integration Platform: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | review-required | — | CAP_14, ARC_15, ARC_16, ARC_17, ARC_19, ARC_26, INT_04 |
| NODE_CAP_14_TESTING | File-Based Integration Platform: verification | challenge | testing | delivery | 3.5–5 person-days | review-required | — | CAP_14, ARC_15, ARC_16, ARC_17, ARC_19, ARC_26, INT_04 |
| NODE_CAP_15_INTEGRATION | Identity Provider Integration: integration | private-pod | integration | delivery | 9–17 person-days | review-required | — | CAP_15, IF_05, INT_05 |
| NODE_CAP_15_CLOUD_DEVOPS | Identity Provider Integration: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | review-required | — | CAP_15, ARC_13, ARC_14, ARC_15, ARC_16, ARC_17, INT_05 |
| NODE_CAP_15_TESTING | Identity Provider Integration: verification | challenge | testing | delivery | 9–17 person-days | review-required | — | CAP_15, ARC_13, ARC_14, ARC_15, ARC_16, ARC_17, INT_05 |
| NODE_CAP_16_INTEGRATION | Real-Time Integration Platform: integration | private-pod | integration | delivery | 3.5–5 person-days | blocked | GAP_01 | CAP_16, IF_02, INT_02, SYS_03 |
| NODE_CAP_16_CLOUD_DEVOPS | Real-Time Integration Platform: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5 person-days | blocked | GAP_01 | CAP_16, ARC_15, ARC_16, ARC_17, ARC_18, INT_02 |
| NODE_CAP_16_TESTING | Real-Time Integration Platform: verification | challenge | testing | delivery | 3.5–5 person-days | blocked | GAP_01 | CAP_16, ARC_15, ARC_16, ARC_17, ARC_18, INT_02 |
| NODE_CAP_17_BACKEND_API | AI Forecasting and Prediction: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_17, BR_03, FR_08 |
| NODE_CAP_17_AI_IMPLEMENTATION | AI Forecasting and Prediction: AI implementation | challenge | ai-implementation | delivery | needs input | review-required | — | CAP_17, AIUC_01, BR_03, FR_08, PER_01 |
| NODE_CAP_17_CLOUD_DEVOPS | AI Forecasting and Prediction: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | review-required | — | CAP_17, ARC_24, ARC_25, BR_03, FR_08 |
| NODE_CAP_17_TESTING | AI Forecasting and Prediction: verification | challenge | testing | delivery | needs input | review-required | — | CAP_17, BR_03, FR_08, ARC_24, ARC_25 |
| NODE_CAP_18_SECURITY | Audit Logging and Compliance Monitoring: security | private-pod | security | delivery | 8–12.5 person-days | blocked | GAP_02 | CAP_18, SEC_04, NFR_04 |
| NODE_CAP_18_CLOUD_DEVOPS | Audit Logging and Compliance Monitoring: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | blocked | GAP_02 | CAP_18, ARC_06, ARC_07, ARC_12, ARC_13, ARC_14, NFR_04, SEC_04 |
| NODE_CAP_18_TESTING | Audit Logging and Compliance Monitoring: verification | challenge | testing | delivery | needs input | blocked | GAP_02 | CAP_18, ARC_06, ARC_07, ARC_12, ARC_13, ARC_14, NFR_04, SEC_04 |
| NODE_CAP_19_SECURITY | Data Encryption: security | private-pod | security | delivery | 8–12.5 person-days | review-required | — | CAP_19, SEC_01 |
| NODE_CAP_19_CLOUD_DEVOPS | Data Encryption: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | review-required | — | CAP_19, ARC_04, ARC_11, ARC_13, ARC_14, ARC_21, ARC_23, SEC_01 |
| NODE_CAP_19_TESTING | Data Encryption: verification | private-pod | testing | delivery | 6.5–10 person-days | review-required | — | CAP_19, ARC_04, ARC_11, ARC_13, ARC_14, ARC_21, ARC_23, SEC_01 |
| NODE_CAP_20_SECURITY | Role-Based Access Control: security | private-pod | security | delivery | 8–12.5 person-days | review-required | — | CAP_20, SEC_02 |
| NODE_CAP_20_CLOUD_DEVOPS | Role-Based Access Control: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | review-required | — | CAP_20, ARC_02, ARC_05, ARC_13, ARC_14, SEC_02 |
| NODE_CAP_20_TESTING | Role-Based Access Control: verification | challenge | testing | delivery | needs input | review-required | — | CAP_20, ARC_02, ARC_05, ARC_13, ARC_14, SEC_02 |
| NODE_CAP_21_SECURITY | Secrets and Credential Management: security | private-pod | security | delivery | 8–12.5 person-days | review-required | — | CAP_21, SEC_03 |
| NODE_CAP_21_CLOUD_DEVOPS | Secrets and Credential Management: cloud and DevOps | private-pod | cloud-devops | delivery | 3.5–5.5 person-days | review-required | — | CAP_21, ARC_10, ARC_11, ARC_13, ARC_14, SEC_03 |
| NODE_CAP_21_TESTING | Secrets and Credential Management: verification | challenge | testing | delivery | needs input | review-required | — | CAP_21, ARC_10, ARC_11, ARC_13, ARC_14, SEC_03 |
| NODE_PH_1_DEPLOYMENT | Release Discovery and Architecture | private-pod | deployment | delivery | 38–59 person-days | review-required | — | PH_1, WS_PH_1 |
| NODE_PH_2_DEPLOYMENT | Release Experience and Core Platform | private-pod | deployment | delivery | 10.5–13.5 person-days | review-required | — | PH_2, WS_01, WS_02, WS_03, WS_04 |
| NODE_PH_3_DEPLOYMENT | Release Data and Integration | private-pod | deployment | delivery | 9–17 person-days | review-required | — | PH_3, WS_05, WS_06 |
| NODE_PH_4_DEPLOYMENT | Release AI Capabilities | private-pod | deployment | delivery | 27–35 person-days | review-required | — | PH_4, WS_07 |
| NODE_PH_5_DEPLOYMENT | Release Testing and Hardening | private-pod | deployment | delivery | 71–108 person-days | review-required | — | PH_5, WS_PH_5 |
| NODE_PH_6_DEPLOYMENT | Release Deployment and Handover | private-pod | deployment | delivery | 26–39 person-days | review-required | — | PH_6, WS_PH_6 |
| NODE_OPERATIONAL_HANDOFF_APPROVAL | Operational handoff approval | flexible-talent | technical-review | approval | needs input | review-required | — | — |

## Dependencies

| Edge | From | To | Type | Blocking | Handoff | Rationale |
| --- | --- | --- | --- | --- | --- | --- |
| EDGE_001 | NODE_CAP_01_BACKEND_API | NODE_CAP_01_TESTING | sequencing | yes | Deliverable ready for verification | Catalog and Inventory Management: verification verifies the output of NODE_CAP_01_BACKEND_API. |
| EDGE_002 | NODE_CAP_01_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Catalog and Inventory Management: verification to be complete. |
| EDGE_003 | NODE_CAP_02_BACKEND_API | NODE_CAP_02_TESTING | sequencing | yes | Deliverable ready for verification | Dashboards and Reporting: verification verifies the output of NODE_CAP_02_BACKEND_API. |
| EDGE_004 | NODE_CAP_02_CLOUD_DEVOPS | NODE_CAP_02_TESTING | model-handoff | yes | Deliverable ready for verification | Dashboards and Reporting: verification verifies the output of NODE_CAP_02_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_005 | NODE_CAP_02_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_006 | NODE_CAP_02_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Dashboards and Reporting: verification to be complete. |
| EDGE_007 | NODE_CAP_03_BACKEND_API | NODE_CAP_03_TESTING | sequencing | yes | Deliverable ready for verification | Orders and Fulfilment: verification verifies the output of NODE_CAP_03_BACKEND_API. |
| EDGE_008 | NODE_CAP_03_CLOUD_DEVOPS | NODE_CAP_03_TESTING | model-handoff | yes | Deliverable ready for verification | Orders and Fulfilment: verification verifies the output of NODE_CAP_03_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_009 | NODE_CAP_03_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_010 | NODE_CAP_03_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Orders and Fulfilment: verification to be complete. |
| EDGE_011 | NODE_CAP_04_BACKEND_API | NODE_CAP_04_TESTING | sequencing | yes | Deliverable ready for verification | Workflow and Approvals: verification verifies the output of NODE_CAP_04_BACKEND_API. |
| EDGE_012 | NODE_CAP_04_CLOUD_DEVOPS | NODE_CAP_04_TESTING | model-handoff | yes | Deliverable ready for verification | Workflow and Approvals: verification verifies the output of NODE_CAP_04_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_013 | NODE_CAP_04_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_014 | NODE_CAP_04_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Workflow and Approvals: verification to be complete. |
| EDGE_015 | NODE_CAP_05_BACKEND_API | NODE_CAP_05_SECURITY | security-gate | yes | Security review | Core Platform Services: security reviews the security controls of NODE_CAP_05_BACKEND_API before release. |
| EDGE_016 | NODE_CAP_05_BACKEND_API | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_BACKEND_API. |
| EDGE_017 | NODE_CAP_05_BACKEND_API | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_018 | NODE_CAP_05_CLOUD_DEVOPS | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_CLOUD_DEVOPS. |
| EDGE_019 | NODE_CAP_05_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_020 | NODE_CAP_05_DATA_ENGINEERING | NODE_CAP_05_SECURITY | security-gate | yes | Security review | Core Platform Services: security reviews the security controls of NODE_CAP_05_DATA_ENGINEERING before release. |
| EDGE_021 | NODE_CAP_05_DATA_ENGINEERING | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_DATA_ENGINEERING. |
| EDGE_022 | NODE_CAP_05_DATA_ENGINEERING | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_023 | NODE_CAP_05_SECURITY | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_SECURITY. |
| EDGE_024 | NODE_CAP_05_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_025 | NODE_CAP_05_TESTING | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_026 | NODE_CAP_06_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_027 | NODE_CAP_07_CLOUD_DEVOPS | NODE_CAP_07_TESTING | model-handoff | yes | Deliverable ready for verification | Data Retention and Archival: verification verifies the output of NODE_CAP_07_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_028 | NODE_CAP_07_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_029 | NODE_CAP_07_DATA_ENGINEERING | NODE_CAP_07_TESTING | model-handoff | yes | Deliverable ready for verification | Data Retention and Archival: verification verifies the output of NODE_CAP_07_DATA_ENGINEERING. Handoff from private-pod to challenge. |
| EDGE_030 | NODE_CAP_07_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_031 | NODE_CAP_07_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_032 | NODE_CAP_08_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_033 | NODE_CAP_09_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_034 | NODE_CAP_10_CLOUD_DEVOPS | NODE_CAP_10_TESTING | model-handoff | yes | Deliverable ready for verification | Reporting Data Marts: verification verifies the output of NODE_CAP_10_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_035 | NODE_CAP_10_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_036 | NODE_CAP_10_DATA_ENGINEERING | NODE_CAP_10_TESTING | model-handoff | yes | Deliverable ready for verification | Reporting Data Marts: verification verifies the output of NODE_CAP_10_DATA_ENGINEERING. Handoff from private-pod to challenge. |
| EDGE_037 | NODE_CAP_10_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_038 | NODE_CAP_10_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_039 | NODE_CAP_11_CLOUD_DEVOPS | NODE_CAP_11_TESTING | model-handoff | yes | Deliverable ready for verification | Batch Integration Platform: verification verifies the output of NODE_CAP_11_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_040 | NODE_CAP_11_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. |
| EDGE_041 | NODE_CAP_11_INTEGRATION | NODE_CAP_11_TESTING | model-handoff | yes | Deliverable ready for verification | Batch Integration Platform: verification verifies the output of NODE_CAP_11_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_042 | NODE_CAP_11_INTEGRATION | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. |
| EDGE_043 | NODE_CAP_11_INTEGRATION_2 | NODE_CAP_11_TESTING | model-handoff | yes | Deliverable ready for verification | Batch Integration Platform: verification verifies the output of NODE_CAP_11_INTEGRATION_2. Handoff from private-pod to challenge. |
| EDGE_044 | NODE_CAP_11_INTEGRATION_2 | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. |
| EDGE_045 | NODE_CAP_11_TESTING | NODE_PH_2_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. Handoff from challenge to private-pod. |
| EDGE_046 | NODE_CAP_12_CLOUD_DEVOPS | NODE_CAP_12_TESTING | model-handoff | yes | Deliverable ready for verification | CRM Integration: verification verifies the output of NODE_CAP_12_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_047 | NODE_CAP_12_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_048 | NODE_CAP_12_INTEGRATION | NODE_CAP_12_TESTING | model-handoff | yes | Deliverable ready for verification | CRM Integration: verification verifies the output of NODE_CAP_12_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_049 | NODE_CAP_12_INTEGRATION | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. |
| EDGE_050 | NODE_CAP_12_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. Handoff from challenge to private-pod. |
| EDGE_051 | NODE_CAP_13_CLOUD_DEVOPS | NODE_CAP_13_TESTING | model-handoff | yes | Deliverable ready for verification | ERP Integration: verification verifies the output of NODE_CAP_13_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_052 | NODE_CAP_13_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_053 | NODE_CAP_13_INTEGRATION | NODE_CAP_13_TESTING | model-handoff | yes | Deliverable ready for verification | ERP Integration: verification verifies the output of NODE_CAP_13_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_054 | NODE_CAP_13_INTEGRATION | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. |
| EDGE_055 | NODE_CAP_13_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. Handoff from challenge to private-pod. |
| EDGE_056 | NODE_CAP_14_CLOUD_DEVOPS | NODE_CAP_14_TESTING | model-handoff | yes | Deliverable ready for verification | File-Based Integration Platform: verification verifies the output of NODE_CAP_14_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_057 | NODE_CAP_14_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. |
| EDGE_058 | NODE_CAP_14_INTEGRATION | NODE_CAP_14_TESTING | model-handoff | yes | Deliverable ready for verification | File-Based Integration Platform: verification verifies the output of NODE_CAP_14_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_059 | NODE_CAP_14_INTEGRATION | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. |
| EDGE_060 | NODE_CAP_14_TESTING | NODE_PH_2_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. Handoff from challenge to private-pod. |
| EDGE_061 | NODE_CAP_15_CLOUD_DEVOPS | NODE_CAP_15_TESTING | model-handoff | yes | Deliverable ready for verification | Identity Provider Integration: verification verifies the output of NODE_CAP_15_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_062 | NODE_CAP_15_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_063 | NODE_CAP_15_INTEGRATION | NODE_CAP_15_TESTING | model-handoff | yes | Deliverable ready for verification | Identity Provider Integration: verification verifies the output of NODE_CAP_15_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_064 | NODE_CAP_15_INTEGRATION | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. |
| EDGE_065 | NODE_CAP_15_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. Handoff from challenge to private-pod. |
| EDGE_066 | NODE_CAP_16_CLOUD_DEVOPS | NODE_CAP_16_TESTING | model-handoff | yes | Deliverable ready for verification | Real-Time Integration Platform: verification verifies the output of NODE_CAP_16_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_067 | NODE_CAP_16_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. |
| EDGE_068 | NODE_CAP_16_INTEGRATION | NODE_CAP_16_TESTING | model-handoff | yes | Deliverable ready for verification | Real-Time Integration Platform: verification verifies the output of NODE_CAP_16_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_069 | NODE_CAP_16_INTEGRATION | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. |
| EDGE_070 | NODE_CAP_16_TESTING | NODE_PH_2_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_02. Handoff from challenge to private-pod. |
| EDGE_071 | NODE_CAP_17_AI_IMPLEMENTATION | NODE_CAP_17_TESTING | sequencing | yes | Deliverable ready for verification | AI Forecasting and Prediction: verification verifies the output of NODE_CAP_17_AI_IMPLEMENTATION. |
| EDGE_072 | NODE_CAP_17_BACKEND_API | NODE_CAP_17_TESTING | sequencing | yes | Deliverable ready for verification | AI Forecasting and Prediction: verification verifies the output of NODE_CAP_17_BACKEND_API. |
| EDGE_073 | NODE_CAP_17_CLOUD_DEVOPS | NODE_CAP_17_TESTING | model-handoff | yes | Deliverable ready for verification | AI Forecasting and Prediction: verification verifies the output of NODE_CAP_17_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_074 | NODE_CAP_17_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_075 | NODE_CAP_17_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires AI Forecasting and Prediction: verification to be complete. |
| EDGE_076 | NODE_CAP_18_CLOUD_DEVOPS | NODE_CAP_18_TESTING | model-handoff | yes | Deliverable ready for verification | Audit Logging and Compliance Monitoring: verification verifies the output of NODE_CAP_18_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_077 | NODE_CAP_18_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_078 | NODE_CAP_18_SECURITY | NODE_CAP_18_TESTING | model-handoff | yes | Deliverable ready for verification | Audit Logging and Compliance Monitoring: verification verifies the output of NODE_CAP_18_SECURITY. Handoff from private-pod to challenge. |
| EDGE_079 | NODE_CAP_18_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_080 | NODE_CAP_18_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Audit Logging and Compliance Monitoring: verification to be complete. |
| EDGE_081 | NODE_CAP_19_CLOUD_DEVOPS | NODE_CAP_19_TESTING | sequencing | yes | Deliverable ready for verification | Data Encryption: verification verifies the output of NODE_CAP_19_CLOUD_DEVOPS. |
| EDGE_082 | NODE_CAP_19_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_083 | NODE_CAP_19_SECURITY | NODE_CAP_19_TESTING | sequencing | yes | Deliverable ready for verification | Data Encryption: verification verifies the output of NODE_CAP_19_SECURITY. |
| EDGE_084 | NODE_CAP_19_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_085 | NODE_CAP_19_TESTING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_086 | NODE_CAP_20_CLOUD_DEVOPS | NODE_CAP_20_TESTING | model-handoff | yes | Deliverable ready for verification | Role-Based Access Control: verification verifies the output of NODE_CAP_20_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_087 | NODE_CAP_20_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_088 | NODE_CAP_20_SECURITY | NODE_CAP_20_TESTING | model-handoff | yes | Deliverable ready for verification | Role-Based Access Control: verification verifies the output of NODE_CAP_20_SECURITY. Handoff from private-pod to challenge. |
| EDGE_089 | NODE_CAP_20_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_090 | NODE_CAP_20_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Role-Based Access Control: verification to be complete. |
| EDGE_091 | NODE_CAP_21_CLOUD_DEVOPS | NODE_CAP_21_TESTING | model-handoff | yes | Deliverable ready for verification | Secrets and Credential Management: verification verifies the output of NODE_CAP_21_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_092 | NODE_CAP_21_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_093 | NODE_CAP_21_SECURITY | NODE_CAP_21_TESTING | model-handoff | yes | Deliverable ready for verification | Secrets and Credential Management: verification verifies the output of NODE_CAP_21_SECURITY. Handoff from private-pod to challenge. |
| EDGE_094 | NODE_CAP_21_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_095 | NODE_CAP_21_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Secrets and Credential Management: verification to be complete. |
| EDGE_096 | NODE_GAP_01 | NODE_CAP_16_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is unconfirmed whether Manhattan WMS can publish real-time stock events at all 46 depots or only the 12 depots on the newer WMS version. |
| EDGE_097 | NODE_GAP_01 | NODE_CAP_16_INTEGRATION | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is unconfirmed whether Manhattan WMS can publish real-time stock events at all 46 depots or only the 12 depots on the newer WMS version. |
| EDGE_098 | NODE_GAP_01 | NODE_CAP_16_TESTING | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is unconfirmed whether Manhattan WMS can publish real-time stock events at all 46 depots or only the 12 depots on the newer WMS version. |
| EDGE_099 | NODE_GAP_02 | NODE_CAP_07_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of GAP_02 | NODE_GAP_02 must be resolved before this work is sequenced: No decision has been made on whether historical data migration should go back three years or the full six-year retention window at initial load. |
| EDGE_100 | NODE_GAP_02 | NODE_CAP_07_DATA_ENGINEERING | blocking-discovery | yes | Resolution of GAP_02 | NODE_GAP_02 must be resolved before this work is sequenced: No decision has been made on whether historical data migration should go back three years or the full six-year retention window at initial load. |
| EDGE_101 | NODE_GAP_02 | NODE_CAP_07_TESTING | blocking-discovery | yes | Resolution of GAP_02 | NODE_GAP_02 must be resolved before this work is sequenced: No decision has been made on whether historical data migration should go back three years or the full six-year retention window at initial load. |
| EDGE_102 | NODE_GAP_02 | NODE_CAP_10_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of GAP_02 | NODE_GAP_02 must be resolved before this work is sequenced: No decision has been made on whether historical data migration should go back three years or the full six-year retention window at initial load. |
| EDGE_103 | NODE_GAP_02 | NODE_CAP_10_DATA_ENGINEERING | blocking-discovery | yes | Resolution of GAP_02 | NODE_GAP_02 must be resolved before this work is sequenced: No decision has been made on whether historical data migration should go back three years or the full six-year retention window at initial load. |
| EDGE_104 | NODE_GAP_02 | NODE_CAP_10_TESTING | blocking-discovery | yes | Resolution of GAP_02 | NODE_GAP_02 must be resolved before this work is sequenced: No decision has been made on whether historical data migration should go back three years or the full six-year retention window at initial load. |
| EDGE_105 | NODE_GAP_02 | NODE_CAP_18_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of GAP_02 | NODE_GAP_02 must be resolved before this work is sequenced: No decision has been made on whether historical data migration should go back three years or the full six-year retention window at initial load. |
| EDGE_106 | NODE_GAP_02 | NODE_CAP_18_SECURITY | blocking-discovery | yes | Resolution of GAP_02 | NODE_GAP_02 must be resolved before this work is sequenced: No decision has been made on whether historical data migration should go back three years or the full six-year retention window at initial load. |
| EDGE_107 | NODE_GAP_02 | NODE_CAP_18_TESTING | blocking-discovery | yes | Resolution of GAP_02 | NODE_GAP_02 must be resolved before this work is sequenced: No decision has been made on whether historical data migration should go back three years or the full six-year retention window at initial load. |
| EDGE_108 | NODE_PH_1_DEPLOYMENT | NODE_PH_2_DEPLOYMENT | sequencing | yes | Release Discovery and Architecture released | Release Experience and Core Platform follows Release Discovery and Architecture in the imported delivery plan. |
| EDGE_109 | NODE_PH_2_DEPLOYMENT | NODE_PH_3_DEPLOYMENT | sequencing | yes | Release Experience and Core Platform released | Release Data and Integration follows Release Experience and Core Platform in the imported delivery plan. |
| EDGE_110 | NODE_PH_3_DEPLOYMENT | NODE_PH_4_DEPLOYMENT | sequencing | yes | Release Data and Integration released | Release AI Capabilities follows Release Data and Integration in the imported delivery plan. |
| EDGE_111 | NODE_PH_4_DEPLOYMENT | NODE_PH_5_DEPLOYMENT | sequencing | yes | Release AI Capabilities released | Release Testing and Hardening follows Release AI Capabilities in the imported delivery plan. |
| EDGE_112 | NODE_PH_5_DEPLOYMENT | NODE_PH_6_DEPLOYMENT | sequencing | yes | Release Testing and Hardening released | Release Deployment and Handover follows Release Testing and Hardening in the imported delivery plan. |
| EDGE_113 | NODE_PH_6_DEPLOYMENT | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Release Deployment and Handover to be complete. |

## Quality gate

Status: **Review Required** (score 76/100)

| Rule | Status | Finding |
| --- | --- | --- |
| source-coverage | pass | Source coverage is 109% (93/85 requirements, components, integrations and AI use cases are referenced by at least one node). |
| unsupported-nodes | pass | Every node cites an imported source or an approved user decision. |
| duplicate-scope | warn | 4 group(s) of nodes share a category and identical sources. |
| missing-acceptance | warn | 6 delivery node(s) have no acceptance condition in the package. |
| missing-inputs | warn | 11 delivery node(s) do not state what they need to start. |
| classification-completeness | pass | 88/88 nodes carry exactly one primary operating model. |
| missing-rationale | pass | Every classification explains itself in plain English. |
| model-to-work-mismatch | pass | No operating model contradicts the work it covers. |
| missing-package-fields | warn | 88 node(s) are missing information their operating model requires. |
| cycles | pass | The dependency graph is acyclic. |
| orphan-nodes | pass | Every delivery node is connected to the graph. |
| invalid-dependencies | pass | Every edge has a known type, a rationale and source identifiers. |
| blocked-or-stale | warn | 12 node(s) are blocked: NODE_CAP_07_DATA_ENGINEERING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_10_DATA_ENGINEERING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING, NODE_CAP_16_INTEGRATION, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING, NODE_CAP_18_SECURITY, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING |
| critical-path-completeness | pass | The critical path (6 node(s), 271.5 person-days) is fully estimated. |
| human-approval | warn | No operator has approved the graph yet; operational handoff needs a recorded human decision. |

## Traceability

| Source | Kind | Title | Nodes | Covered |
| --- | --- | --- | --- | --- |
| BR_01 | business | Trusted available-to-promise inventory view | NODE_CAP_01_BACKEND_API, NODE_CAP_01_TESTING | yes |
| BR_02 | business | Eliminate the weekly manual reconciliation | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| BR_03 | business | Two-week-ahead stockout forecasting | NODE_CAP_17_BACKEND_API, NODE_CAP_17_AI_IMPLEMENTATION, NODE_CAP_17_CLOUD_DEVOPS, NODE_CAP_17_TESTING | yes |
| BR_04 | business | Consolidated order, margin and carrier-cost view | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| BR_05 | business | Customer-facing order tracking (future candidate) | — | no |
| FR_01 | functional | Near-real-time SAP ECC order ingestion | NODE_CAP_03_BACKEND_API, NODE_CAP_03_CLOUD_DEVOPS, NODE_CAP_03_TESTING | yes |
| FR_02 | functional | Daily Salesforce account and opportunity ingestion | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| FR_03 | functional | Near-real-time Manhattan WMS event ingestion | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| FR_04 | functional | Carrier EDI message parsing | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| FR_05 | functional | Automated inventory reconciliation | NODE_CAP_01_BACKEND_API, NODE_CAP_01_TESTING | yes |
| FR_06 | functional | Margin and carrier-cost reporting | NODE_CAP_02_BACKEND_API, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING | yes |
| FR_07 | functional | Data-steward correction workflow | NODE_CAP_04_BACKEND_API, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING | yes |
| FR_08 | functional | Twelve-month trailing stockout forecast | NODE_CAP_17_BACKEND_API, NODE_CAP_17_AI_IMPLEMENTATION, NODE_CAP_17_CLOUD_DEVOPS, NODE_CAP_17_TESTING | yes |
| FR_09 | functional | Ad hoc Looker dashboards without data engineering | NODE_CAP_02_BACKEND_API, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING | yes |
| FR_10 | functional | Full data lineage trail | NODE_CAP_02_BACKEND_API, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING | yes |
| NFR_01 | nonFunctional | 40,000 SAP order-line changes per day at peak | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| NFR_02 | nonFunctional | 60-minute inventory dashboard refresh | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| NFR_03 | nonFunctional | Approximately 350 named users | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| NFR_04 | nonFunctional | Six-year transaction-level retention | NODE_GAP_02, NODE_CAP_18_SECURITY, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| NFR_05 | nonFunctional | Idempotent EDI file processing | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| NFR_06 | nonFunctional | 2% SAP/WMS variance-flagging threshold | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| INT_01 | integration | SAP ECC batch integration | NODE_CAP_11_INTEGRATION, NODE_CAP_11_INTEGRATION_2, NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING, NODE_CAP_13_INTEGRATION, NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING | yes |
| INT_02 | integration | Manhattan WMS event-driven integration | NODE_GAP_01, NODE_CAP_16_INTEGRATION, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING | yes |
| INT_03 | integration | Salesforce Sales Cloud batch integration | NODE_CAP_11_INTEGRATION, NODE_CAP_11_INTEGRATION_2, NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING, NODE_CAP_12_INTEGRATION, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING | yes |
| INT_04 | integration | Carrier SFTP file integration | NODE_CAP_14_INTEGRATION, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| INT_05 | integration | Okta staff authentication for Looker | NODE_CAP_15_INTEGRATION, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING | yes |
| INT_06 | integration | Future customer-tracking shipment-status API (candidate) | — | no |
| DATA_01 | data | Conformed dimensional model | NODE_CAP_10_DATA_ENGINEERING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| DATA_02 | data | Domain-based data ownership | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| DATA_03 | data | Automated data-quality rules | NODE_CAP_06_DATA_ENGINEERING | yes |
| DATA_04 | data | SAP/WMS product and depot master-data reconciliation | NODE_CAP_06_DATA_ENGINEERING, NODE_CAP_08_DATA_ENGINEERING | yes |
| DATA_05 | data | Salesforce trade-account contact data | NODE_CAP_09_DATA_ENGINEERING | yes |
| DATA_06 | data | Six-year transaction retention with indefinite marts | NODE_CAP_07_DATA_ENGINEERING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_10_DATA_ENGINEERING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| SEC_01 | security | Encryption in transit | NODE_CAP_19_SECURITY, NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING | yes |
| SEC_02 | security | Role-based access to margin data | NODE_CAP_20_SECURITY, NODE_CAP_20_CLOUD_DEVOPS, NODE_CAP_20_TESTING | yes |
| SEC_03 | security | Managed SFTP credential rotation | NODE_CAP_21_SECURITY, NODE_CAP_21_CLOUD_DEVOPS, NODE_CAP_21_TESTING | yes |
| SEC_04 | security | Audit trail for manual corrections | NODE_CAP_18_SECURITY, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| SEC_05 | security | UK GDPR handling for trade-account contacts | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| TECH_01 | technology | BigQuery warehouse for Looker | — | no |
| TECH_02 | technology | No existing analytics cloud footprint | — | no |
| TECH_03 | technology | SQL-first transformation preference | — | no |
| CON_01 | constraint | 30-week pre-peak go-live target | — | no |
| CON_02 | constraint | Phased depot rollout | — | no |
| CON_03 | constraint | Half-time customer data analyst; partner owns data engineering | — | no |
| CON_04 | constraint | Retire legacy reconciliation spreadsheet within 90 days | — | no |
| SYS_01 | existingSystem | SAP ECC | NODE_CAP_11_INTEGRATION, NODE_CAP_13_INTEGRATION | yes |
| SYS_02 | existingSystem | Salesforce Sales Cloud | NODE_CAP_11_INTEGRATION_2, NODE_CAP_12_INTEGRATION | yes |
| SYS_03 | existingSystem | Manhattan Associates WMS | NODE_CAP_16_INTEGRATION | yes |
| SYS_04 | existingSystem | Carrier EDI Feeds (DHL, UPS, Fastway) | NODE_CAP_14_INTEGRATION | yes |
| SYS_05 | existingSystem | Legacy Access-Based Reconciliation Spreadsheet | — | no |
| PER_01 | persona | Supply Chain Planner | NODE_CAP_17_AI_IMPLEMENTATION | yes |
| PER_02 | persona | Finance Analyst | — | no |
| PER_03 | persona | Merchandiser | — | no |
| PER_04 | persona | Data Steward | — | no |
| ARC_01 | component | web-hosting-cdn (Firebase Hosting (global CDN)) | NODE_CAP_03_CLOUD_DEVOPS, NODE_CAP_03_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| ARC_02 | component | api-gateway (Apigee API Management) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_20_CLOUD_DEVOPS, NODE_CAP_20_TESTING | yes |
| ARC_03 | component | container-runtime (Google Cloud Run) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| ARC_04 | component | managed-relational-db (Cloud SQL for PostgreSQL) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING | yes |
| ARC_05 | component | identity-customer (Identity Platform) | NODE_CAP_20_CLOUD_DEVOPS, NODE_CAP_20_TESTING | yes |
| ARC_06 | component | monitoring (Cloud Monitoring) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| ARC_07 | component | logging (Cloud Logging) | NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| ARC_08 | component | ci-cd (Cloud Build with Cloud Deploy) | — | no |
| ARC_09 | component | infrastructure-as-code (Google Cloud Infrastructure Manager) | — | no |
| ARC_10 | component | secrets-manager (Secret Manager) | NODE_CAP_21_CLOUD_DEVOPS, NODE_CAP_21_TESTING | yes |
| ARC_11 | component | key-management (Cloud KMS) | NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING, NODE_CAP_21_CLOUD_DEVOPS, NODE_CAP_21_TESTING | yes |
| ARC_12 | component | backup (Google Cloud Backup and DR Service) | NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| ARC_13 | component | private-networking (VPC Service Controls with Private Service Connect) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING, NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING, NODE_CAP_20_CLOUD_DEVOPS, NODE_CAP_20_TESTING, NODE_CAP_21_CLOUD_DEVOPS, NODE_CAP_21_TESTING | yes |
| ARC_14 | component | waf-ddos (Google Cloud Armor) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING, NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING, NODE_CAP_20_CLOUD_DEVOPS, NODE_CAP_20_TESTING, NODE_CAP_21_CLOUD_DEVOPS, NODE_CAP_21_TESTING | yes |
| ARC_15 | component | api-gateway (Apigee API Management) | NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING, NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING | yes |
| ARC_16 | component | integration-service (Application Integration) | NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING, NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING | yes |
| ARC_17 | component | message-queue (Pub/Sub (queue-style subscription)) | NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING, NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING | yes |
| ARC_18 | component | event-bus (Eventarc) | NODE_CAP_03_CLOUD_DEVOPS, NODE_CAP_03_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING | yes |
| ARC_19 | component | sftp-file-transfer (Storage Transfer Service with a self-managed SFTP gateway on Compute Engine) | NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| ARC_20 | component | scheduler (Cloud Scheduler) | NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING, NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING | yes |
| ARC_21 | component | data-warehouse (BigQuery) | NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING, NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING | yes |
| ARC_22 | component | etl-pipeline (Dataflow) | NODE_CAP_03_CLOUD_DEVOPS, NODE_CAP_03_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| ARC_23 | component | bi-reporting (Looker) | NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING, NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING | yes |
| ARC_24 | component | llm-platform (Vertex AI (Generative AI / Model Garden)) | NODE_CAP_17_CLOUD_DEVOPS, NODE_CAP_17_TESTING | yes |
| ARC_25 | component | ml-platform (Vertex AI (custom training and pipelines)) | NODE_CAP_17_CLOUD_DEVOPS, NODE_CAP_17_TESTING | yes |
| ARC_26 | component | cache (Memorystore for Redis) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| ARC_27 | component | workflow-orchestration (Workflows) | NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING | yes |
| IF_01 | integration | SAP ECC batch integration | NODE_CAP_11_INTEGRATION, NODE_CAP_13_INTEGRATION | yes |
| IF_02 | integration | Manhattan WMS event-driven integration | NODE_CAP_16_INTEGRATION | yes |
| IF_03 | integration | Salesforce Sales Cloud batch integration | NODE_CAP_11_INTEGRATION_2, NODE_CAP_12_INTEGRATION | yes |
| IF_04 | integration | Carrier SFTP file integration | NODE_CAP_14_INTEGRATION | yes |
| IF_05 | integration | Okta staff authentication for Looker | NODE_CAP_15_INTEGRATION | yes |
| AIUC_01 | aiUseCase | Forecasting model: Twelve-month trailing stockout forecast | NODE_CAP_17_AI_IMPLEMENTATION | yes |
| CAP_01 | capability | Catalog and Inventory Management | NODE_CAP_01_BACKEND_API, NODE_CAP_01_TESTING | yes |
| CAP_02 | capability | Dashboards and Reporting | NODE_CAP_02_BACKEND_API, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING | yes |
| CAP_03 | capability | Orders and Fulfilment | NODE_CAP_03_BACKEND_API, NODE_CAP_03_CLOUD_DEVOPS, NODE_CAP_03_TESTING | yes |
| CAP_04 | capability | Workflow and Approvals | NODE_CAP_04_BACKEND_API, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING | yes |
| CAP_05 | capability | Core Platform Services | NODE_CAP_05_BACKEND_API, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| CAP_06 | capability | Data Quality and Reconciliation | NODE_CAP_06_DATA_ENGINEERING | yes |
| CAP_07 | capability | Data Retention and Archival | NODE_CAP_07_DATA_ENGINEERING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING | yes |
| CAP_08 | capability | Master and Reference Data Management | NODE_CAP_08_DATA_ENGINEERING | yes |
| CAP_09 | capability | Personal Data Protection | NODE_CAP_09_DATA_ENGINEERING | yes |
| CAP_10 | capability | Reporting Data Marts | NODE_CAP_10_DATA_ENGINEERING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| CAP_11 | capability | Batch Integration Platform | NODE_CAP_11_INTEGRATION, NODE_CAP_11_INTEGRATION_2, NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING | yes |
| CAP_12 | capability | CRM Integration | NODE_CAP_12_INTEGRATION, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING | yes |
| CAP_13 | capability | ERP Integration | NODE_CAP_13_INTEGRATION, NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING | yes |
| CAP_14 | capability | File-Based Integration Platform | NODE_CAP_14_INTEGRATION, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| CAP_15 | capability | Identity Provider Integration | NODE_CAP_15_INTEGRATION, NODE_CAP_15_CLOUD_DEVOPS, NODE_CAP_15_TESTING | yes |
| CAP_16 | capability | Real-Time Integration Platform | NODE_CAP_16_INTEGRATION, NODE_CAP_16_CLOUD_DEVOPS, NODE_CAP_16_TESTING | yes |
| CAP_17 | capability | AI Forecasting and Prediction | NODE_CAP_17_BACKEND_API, NODE_CAP_17_AI_IMPLEMENTATION, NODE_CAP_17_CLOUD_DEVOPS, NODE_CAP_17_TESTING | yes |
| CAP_18 | capability | Audit Logging and Compliance Monitoring | NODE_CAP_18_SECURITY, NODE_CAP_18_CLOUD_DEVOPS, NODE_CAP_18_TESTING | yes |
| CAP_19 | capability | Data Encryption | NODE_CAP_19_SECURITY, NODE_CAP_19_CLOUD_DEVOPS, NODE_CAP_19_TESTING | yes |
| CAP_20 | capability | Role-Based Access Control | NODE_CAP_20_SECURITY, NODE_CAP_20_CLOUD_DEVOPS, NODE_CAP_20_TESTING | yes |
| CAP_21 | capability | Secrets and Credential Management | NODE_CAP_21_SECURITY, NODE_CAP_21_CLOUD_DEVOPS, NODE_CAP_21_TESTING | yes |

## Notes

- 6 discovery, clarification or approval node(s) generated from gaps, questions and unconfirmed assumptions.
- 88 node(s) after removing 0 user-removed node(s).
- AI layer: provider mock in mock mode produced 98 suggestion(s); none are applied without a recorded user decision.
- Quality gate: Review Required (0 failing, 6 warning rule(s)).

Blocked or incomplete nodes are marked `not ready for operational handoff`. This document is a planning aid: it never recruits talent, launches a challenge or commits delivery.
