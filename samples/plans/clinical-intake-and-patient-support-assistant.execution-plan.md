# Execution plan: Clinical Intake and Patient Support Assistant

| Field | Value |
| --- | --- |
| Deal id | 12de4070-50bc-448e-888d-061c62073dcc |
| Package maturity | review-required |
| Graph revision | 0 |
| Nodes | 82 |
| Dependencies | 114 |
| Waves | 10 |
| Operating models | 22 flexible-talent · 23 challenge · 37 private-pod |
| Graph effort | 450–701 person-days |
| Critical path | 6 node(s), 352 person-days |
| Duration estimate | 352 person-days |
| Quality gate | Review Required |
| Generator | mock (mock) |

> MOCK AI MODE — no external service was contacted.

## Execution waves

### Wave 1 — 50 node(s), 232 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_CAP_02_BACKEND_API | Forms and Data Capture: backend and API | private-pod | backend-api | review-required |
| NODE_CAP_02_CLOUD_DEVOPS | Forms and Data Capture: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_03_AI_IMPLEMENTATION | Self-Service Portal: AI implementation | challenge | ai-implementation | review-required |
| NODE_CAP_03_BACKEND_API | Self-Service Portal: backend and API | challenge | backend-api | review-required |
| NODE_CAP_03_CLOUD_DEVOPS | Self-Service Portal: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_05_CLOUD_DEVOPS | Core Platform Services: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_05_DATA_ENGINEERING | Core Platform Services: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_05_INTEGRATION | Core Platform Services: integration | private-pod | integration | review-required |
| NODE_CAP_05_INTEGRATION_2 | Core Platform Services: integration | private-pod | integration | review-required |
| NODE_CAP_05_INTEGRATION_3 | Core Platform Services: integration | private-pod | integration | review-required |
| NODE_CAP_06_CLOUD_DEVOPS | Data Retention and Archival: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_06_DATA_ENGINEERING | Data Retention and Archival: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_07_CLOUD_DEVOPS | Document and Content Data Management: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_07_DATA_ENGINEERING | Document and Content Data Management: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_08_CLOUD_DEVOPS | Personal Data Protection: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_08_DATA_ENGINEERING | Personal Data Protection: data engineering | private-pod | data-engineering | review-required |
| NODE_CAP_10_AI_IMPLEMENTATION | AI Conversational Assistant: AI implementation | challenge | ai-implementation | review-required |
| NODE_CAP_10_BACKEND_API | AI Conversational Assistant: backend and API | challenge | backend-api | review-required |
| NODE_CAP_10_CLOUD_DEVOPS | AI Conversational Assistant: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_11_AI_IMPLEMENTATION | AI Document Extraction: AI implementation | challenge | ai-implementation | review-required |
| NODE_CAP_11_BACKEND_API | AI Document Extraction: backend and API | challenge | backend-api | review-required |
| NODE_CAP_11_CLOUD_DEVOPS | AI Document Extraction: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_12_CLOUD_DEVOPS | Data Encryption: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_12_SECURITY | Data Encryption: security | private-pod | security | review-required |
| NODE_CAP_13_CLOUD_DEVOPS | Multi-Factor Authentication: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_13_SECURITY | Multi-Factor Authentication: security | private-pod | security | review-required |
| NODE_CAP_14_CLOUD_DEVOPS | Role-Based Access Control: cloud and DevOps | private-pod | cloud-devops | review-required |
| NODE_CAP_14_SECURITY | Role-Based Access Control: security | private-pod | security | review-required |
| NODE_GAP_01 | Epic sandbox write capability unconfirmed | flexible-talent | discovery | review-required |
| NODE_GAP_02 | Assistant deployment form undecided | flexible-talent | discovery | review-required |
| NODE_GAP_03 | Target phase for the CareEverywhere integration not set | flexible-talent | discovery | review-required |
| NODE_PH_1_DEPLOYMENT | Release Discovery and Architecture | private-pod | deployment | review-required |
| NODE_PROVIDE_MISSING_ESTIMATION_INPUT_INTEGRATION_READINESS | Provide missing estimation input: Integration readiness | flexible-talent | discovery | review-required |
| NODE_Q_01 | Does the Epic FHIR R4 sandbox support writing referral data? | flexible-talent | discovery | review-required |
| NODE_Q_02 | Should the assistant be standalone or embedded in the portal? | flexible-talent | discovery | review-required |
| NODE_Q_03 | Confirm the target phase for the CareEverywhere integration | flexible-talent | discovery | review-required |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION_2 | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_CONFLICTING_CLOUD_SELECTION | Resolve quality finding: conflicting-cloud-selection | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_MISSING_ESTIMATION_INPUTS | Resolve quality finding: missing-estimation-inputs | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_2 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_3 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | review-required |
| NODE_RESOLVE_THE_CLOUD_PLATFORM_CONFLICT | Resolve the cloud platform conflict | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_AI_STRATEGY | Re-baseline AI strategy | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_ARCHITECTURE | Re-baseline Architecture | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_DATA_AND_INTEGRATION | Re-baseline Data and integration | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_ESTIMATE | Re-baseline Estimate | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_PRODUCT_REQUIREMENTS | Re-baseline Product requirements | flexible-talent | discovery | review-required |
| NODE_RE_BASELINE_QUALITY | Re-baseline Quality | flexible-talent | discovery | review-required |

### Wave 2 — 19 node(s), 107.5 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_CAP_01_BACKEND_API | Document Management: backend and API | challenge | backend-api | blocked |
| NODE_CAP_01_CLOUD_DEVOPS | Document Management: cloud and DevOps | private-pod | cloud-devops | blocked |
| NODE_CAP_02_TESTING | Forms and Data Capture: verification | challenge | testing | review-required |
| NODE_CAP_03_TESTING | Self-Service Portal: verification | challenge | testing | review-required |
| NODE_CAP_04_AI_IMPLEMENTATION | Workflow and Approvals: AI implementation | challenge | ai-implementation | blocked |
| NODE_CAP_04_BACKEND_API | Workflow and Approvals: backend and API | challenge | backend-api | blocked |
| NODE_CAP_04_CLOUD_DEVOPS | Workflow and Approvals: cloud and DevOps | private-pod | cloud-devops | blocked |
| NODE_CAP_05_AI_IMPLEMENTATION | Core Platform Services: AI implementation | private-pod | ai-implementation | review-required |
| NODE_CAP_05_AI_IMPLEMENTATION_2 | Core Platform Services: AI implementation | private-pod | ai-implementation | review-required |
| NODE_CAP_06_AI_IMPLEMENTATION | Data Retention and Archival: AI implementation | challenge | ai-implementation | review-required |
| NODE_CAP_07_AI_IMPLEMENTATION | Document and Content Data Management: AI implementation | challenge | ai-implementation | review-required |
| NODE_CAP_08_TESTING | Personal Data Protection: verification | challenge | testing | review-required |
| NODE_CAP_09_CLOUD_DEVOPS | Clinical System Integration (HL7/FHIR): cloud and DevOps | private-pod | cloud-devops | blocked |
| NODE_CAP_09_INTEGRATION | Clinical System Integration (HL7/FHIR): integration | private-pod | integration | blocked |
| NODE_CAP_10_TESTING | AI Conversational Assistant: verification | challenge | testing | review-required |
| NODE_CAP_11_TESTING | AI Document Extraction: verification | challenge | testing | review-required |
| NODE_CAP_12_TESTING | Data Encryption: verification | private-pod | testing | review-required |
| NODE_CAP_13_TESTING | Multi-Factor Authentication: verification | challenge | testing | review-required |
| NODE_CAP_14_TESTING | Role-Based Access Control: verification | challenge | testing | review-required |

### Wave 3 — 6 node(s), 66.5 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_CAP_01_TESTING | Document Management: verification | challenge | testing | blocked |
| NODE_CAP_04_TESTING | Workflow and Approvals: verification | challenge | testing | blocked |
| NODE_CAP_05_SECURITY | Core Platform Services: security | private-pod | security | review-required |
| NODE_CAP_06_TESTING | Data Retention and Archival: verification | challenge | testing | review-required |
| NODE_CAP_07_TESTING | Document and Content Data Management: verification | challenge | testing | review-required |
| NODE_CAP_09_TESTING | Clinical System Integration (HL7/FHIR): verification | challenge | testing | blocked |

### Wave 4 — 1 node(s), 15.5 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_CAP_05_TESTING | Core Platform Services: verification | private-pod | testing | review-required |

### Wave 5 — 1 node(s), 15.5 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_2_DEPLOYMENT | Release Experience and Core Platform | private-pod | deployment | review-required |

### Wave 6 — 1 node(s), 44 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_3_DEPLOYMENT | Release Data and Integration | private-pod | deployment | review-required |

### Wave 7 — 1 node(s), 62 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_4_DEPLOYMENT | Release AI Capabilities | private-pod | deployment | review-required |

### Wave 8 — 1 node(s), 116 person-days

| Node | Title | Model | Category | Readiness |
| --- | --- | --- | --- | --- |
| NODE_PH_5_DEPLOYMENT | Release Testing and Hardening | private-pod | deployment | review-required |

### Wave 9 — 1 node(s), 42 person-days

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
| 1 | NODE_CAP_09_INTEGRATION | Clinical System Integration (HL7/FHIR): integration | 23.5–44 person-days |
| 2 | NODE_CAP_09_TESTING | Clinical System Integration (HL7/FHIR): verification | 23.5–44 person-days |
| 3 | NODE_PH_3_DEPLOYMENT | Release Data and Integration | 23.5–44 person-days |
| 4 | NODE_PH_4_DEPLOYMENT | Release AI Capabilities | 41–62 person-days |
| 5 | NODE_PH_5_DEPLOYMENT | Release Testing and Hardening | 76–116 person-days |
| 6 | NODE_PH_6_DEPLOYMENT | Release Deployment and Handover | 27–42 person-days |

Optimistic path (effort.minimum): 218.5 person-days — NODE_PH_1_DEPLOYMENT → NODE_PH_2_DEPLOYMENT → NODE_PH_3_DEPLOYMENT → NODE_PH_4_DEPLOYMENT → NODE_PH_5_DEPLOYMENT → NODE_PH_6_DEPLOYMENT

## Node inventory

| Node | Title | Model | Category | Kind | Effort | Readiness | Blocked by | Source ids |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NODE_GAP_01 | Epic sandbox write capability unconfirmed | flexible-talent | discovery | discovery | needs input | review-required | — | GAP_01, INT_01, Q_01 |
| NODE_GAP_02 | Assistant deployment form undecided | flexible-talent | discovery | discovery | needs input | review-required | — | GAP_02, Q_02 |
| NODE_GAP_03 | Target phase for the CareEverywhere integration not set | flexible-talent | discovery | discovery | needs input | review-required | — | GAP_03, INT_05, Q_03 |
| NODE_Q_01 | Does the Epic FHIR R4 sandbox support writing referral data? | flexible-talent | discovery | clarification | needs input | review-required | — | Q_01, GAP_01 |
| NODE_Q_02 | Should the assistant be standalone or embedded in the portal? | flexible-talent | discovery | clarification | needs input | review-required | — | Q_02, GAP_02 |
| NODE_Q_03 | Confirm the target phase for the CareEverywhere integration | flexible-talent | discovery | clarification | needs input | review-required | — | Q_03, GAP_03 |
| NODE_RE_BASELINE_PRODUCT_REQUIREMENTS | Re-baseline Product requirements | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_01_PRODUCT_REQUIREMENTS |
| NODE_RE_BASELINE_ARCHITECTURE | Re-baseline Architecture | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_02_ARCHITECTURE |
| NODE_RE_BASELINE_DATA_AND_INTEGRATION | Re-baseline Data and integration | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_03_DATA_AND_INTEGRATION |
| NODE_RE_BASELINE_AI_STRATEGY | Re-baseline AI strategy | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_04_AI_STRATEGY |
| NODE_RE_BASELINE_ESTIMATE | Re-baseline Estimate | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_05_ESTIMATE |
| NODE_RE_BASELINE_QUALITY | Re-baseline Quality | flexible-talent | discovery | discovery | needs input | review-required | — | SECTION_06_QUALITY |
| NODE_RESOLVE_THE_CLOUD_PLATFORM_CONFLICT | Resolve the cloud platform conflict | flexible-talent | discovery | clarification | needs input | review-required | — | PLATFORM_CONFLICT, TECH_01 |
| NODE_PROVIDE_MISSING_ESTIMATION_INPUT_INTEGRATION_READINESS | Provide missing estimation input: Integration readiness | flexible-talent | discovery | clarification | needs input | review-required | — | EST_MISSING_01 |
| NODE_RESOLVE_QUALITY_FINDING_MISSING_ESTIMATION_INPUTS | Resolve quality finding: missing-estimation-inputs | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_MISSING_ESTIMATION_INPUTS |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_UNRESOLVED_QUESTIONS |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_2 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_UNRESOLVED_QUESTIONS |
| NODE_RESOLVE_QUALITY_FINDING_UNRESOLVED_QUESTIONS_3 | Resolve quality finding: unresolved-questions | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_UNRESOLVED_QUESTIONS |
| NODE_RESOLVE_QUALITY_FINDING_CONFLICTING_CLOUD_SELECTION | Resolve quality finding: conflicting-cloud-selection | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_CONFLICTING_CLOUD_SELECTION |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_ASSUMPTIONS_NEEDING_VALIDATION |
| NODE_RESOLVE_QUALITY_FINDING_ASSUMPTIONS_NEEDING_VALIDATION_2 | Resolve quality finding: assumptions-needing-validation | flexible-talent | technical-review | discovery | needs input | review-required | — | QUALITY_ASSUMPTIONS_NEEDING_VALIDATION |
| NODE_CAP_01_BACKEND_API | Document Management: backend and API | challenge | backend-api | delivery | needs input | blocked | Q_01 | CAP_01, BR_01, BR_03, FR_01, FR_03, FR_04 |
| NODE_CAP_01_CLOUD_DEVOPS | Document Management: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | blocked | Q_01 | CAP_01, ARC_13, ARC_14, ARC_18, ARC_24, ARC_25, BR_01, BR_03, FR_01, FR_03, FR_04 |
| NODE_CAP_01_TESTING | Document Management: verification | challenge | testing | delivery | needs input | blocked | Q_01 | CAP_01, BR_01, BR_03, FR_01, FR_03, FR_04, ARC_13, ARC_14, ARC_18, ARC_24, ARC_25 |
| NODE_CAP_02_BACKEND_API | Forms and Data Capture: backend and API | private-pod | backend-api | delivery | 3–3.5 person-days | review-required | — | CAP_02, FR_01 |
| NODE_CAP_02_CLOUD_DEVOPS | Forms and Data Capture: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | review-required | — | CAP_02, ARC_13, ARC_14, ARC_18, FR_01 |
| NODE_CAP_02_TESTING | Forms and Data Capture: verification | challenge | testing | delivery | 3–3.5 person-days | review-required | — | CAP_02, FR_01, ARC_13, ARC_14, ARC_18 |
| NODE_CAP_03_BACKEND_API | Self-Service Portal: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_03, BR_02, FR_09 |
| NODE_CAP_03_AI_IMPLEMENTATION | Self-Service Portal: AI implementation | challenge | ai-implementation | delivery | needs input | review-required | — | CAP_03, AIUC_01, BR_04, FR_05, FR_06, FR_07, FR_09, NFR_03, NFR_05, NFR_06, INT_03, INT_04, DATA_02, DATA_03, DATA_05, SEC_06, TECH_01, TECH_02, CON_01, CON_02, SYS_05, PER_02, RSK_02, GAP_02, ASM_02, Q_02, BR_02 |
| NODE_CAP_03_CLOUD_DEVOPS | Self-Service Portal: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | review-required | — | CAP_03, ARC_06, ARC_19, BR_02, FR_09 |
| NODE_CAP_03_TESTING | Self-Service Portal: verification | challenge | testing | delivery | needs input | review-required | — | CAP_03, BR_02, FR_09, ARC_06, ARC_19 |
| NODE_CAP_04_BACKEND_API | Workflow and Approvals: backend and API | challenge | backend-api | delivery | needs input | blocked | Q_01 | CAP_04, FR_04, FR_06, FR_07, FR_08 |
| NODE_CAP_04_AI_IMPLEMENTATION | Workflow and Approvals: AI implementation | challenge | ai-implementation | delivery | needs input | blocked | Q_01 | CAP_04, AIUC_01, BR_04, FR_05, FR_06, FR_07, FR_09, NFR_03, NFR_05, NFR_06, INT_03, INT_04, DATA_02, DATA_03, DATA_05, SEC_06, TECH_01, TECH_02, CON_01, CON_02, SYS_05, PER_02, RSK_02, GAP_02, ASM_02, Q_02, FR_04, FR_08 |
| NODE_CAP_04_CLOUD_DEVOPS | Workflow and Approvals: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | blocked | Q_01 | CAP_04, ARC_18, ARC_19, ARC_25, FR_04, FR_06, FR_07, FR_08 |
| NODE_CAP_04_TESTING | Workflow and Approvals: verification | challenge | testing | delivery | needs input | blocked | Q_01 | CAP_04, FR_04, FR_06, FR_07, FR_08, ARC_18, ARC_19, ARC_25 |
| NODE_CAP_05_INTEGRATION | Core Platform Services: integration | private-pod | integration | delivery | 10–15.5 person-days | review-required | — | CAP_05, IF_02, INT_02, SYS_05, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, INT_03, INT_04, DATA_04, SEC_01, SEC_05, SEC_06 |
| NODE_CAP_05_INTEGRATION_2 | Core Platform Services: integration | private-pod | integration | delivery | 10–15.5 person-days | review-required | — | CAP_05, IF_03, INT_03, SYS_02, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, INT_02, INT_04, DATA_04, SEC_01, SEC_05, SEC_06 |
| NODE_CAP_05_INTEGRATION_3 | Core Platform Services: integration | private-pod | integration | delivery | 10–15.5 person-days | review-required | — | CAP_05, IF_04, INT_04, SYS_05, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, INT_02, INT_03, DATA_04, SEC_01, SEC_05, SEC_06 |
| NODE_CAP_05_AI_IMPLEMENTATION | Core Platform Services: AI implementation | private-pod | ai-implementation | delivery | 10–15.5 person-days | review-required | — | CAP_05, AIUC_01, BR_04, FR_05, FR_06, FR_07, FR_09, NFR_03, NFR_05, NFR_06, INT_03, INT_04, DATA_02, DATA_03, DATA_05, SEC_06, TECH_01, TECH_02, CON_01, CON_02, SYS_05, PER_02, RSK_02, GAP_02, ASM_02, Q_02, NFR_01, NFR_02, NFR_04, INT_02, DATA_04, SEC_01, SEC_05 |
| NODE_CAP_05_AI_IMPLEMENTATION_2 | Core Platform Services: AI implementation | private-pod | ai-implementation | delivery | 10–15.5 person-days | review-required | — | CAP_05, AIUC_02, FR_02, FR_10, NFR_02, NFR_05, TECH_02, CON_03, RSK_01, NFR_01, NFR_03, NFR_04, NFR_06, INT_02, INT_03, INT_04, DATA_04, SEC_01, SEC_05, SEC_06 |
| NODE_CAP_05_DATA_ENGINEERING | Core Platform Services: data engineering | private-pod | data-engineering | delivery | 10–15.5 person-days | review-required | — | CAP_05, DATA_04, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, INT_02, INT_03, INT_04, SEC_01, SEC_05, SEC_06 |
| NODE_CAP_05_SECURITY | Core Platform Services: security | private-pod | security | delivery | 10–15.5 person-days | review-required | — | CAP_05, SEC_01, SEC_05, SEC_06, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, INT_02, INT_03, INT_04, DATA_04 |
| NODE_CAP_05_CLOUD_DEVOPS | Core Platform Services: cloud and DevOps | private-pod | cloud-devops | delivery | 10–15.5 person-days | review-required | — | CAP_05, ARC_01, ARC_02, ARC_03, ARC_04, ARC_06, ARC_10, ARC_12, ARC_13, ARC_14, ARC_18, ARC_19, ARC_21, ARC_22, ARC_23, ARC_24, ARC_25, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, INT_02, INT_03, INT_04, DATA_04, SEC_01, SEC_05, SEC_06 |
| NODE_CAP_05_TESTING | Core Platform Services: verification | private-pod | testing | delivery | 10–15.5 person-days | review-required | — | CAP_05, ARC_01, ARC_02, ARC_03, ARC_04, ARC_06, ARC_10, ARC_12, ARC_13, ARC_14, ARC_18, ARC_19, ARC_21, ARC_22, ARC_23, ARC_24, ARC_25, NFR_01, NFR_02, NFR_03, NFR_04, NFR_05, NFR_06, INT_02, INT_03, INT_04, DATA_04, SEC_01, SEC_05, SEC_06 |
| NODE_CAP_06_AI_IMPLEMENTATION | Data Retention and Archival: AI implementation | challenge | ai-implementation | delivery | 3–3.5 person-days | review-required | — | CAP_06, AIUC_01, BR_04, FR_05, FR_06, FR_07, FR_09, NFR_03, NFR_05, NFR_06, INT_03, INT_04, DATA_02, DATA_03, DATA_05, SEC_06, TECH_01, TECH_02, CON_01, CON_02, SYS_05, PER_02, RSK_02, GAP_02, ASM_02, Q_02 |
| NODE_CAP_06_DATA_ENGINEERING | Data Retention and Archival: data engineering | private-pod | data-engineering | delivery | 3–3.5 person-days | review-required | — | CAP_06, DATA_03 |
| NODE_CAP_06_CLOUD_DEVOPS | Data Retention and Archival: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | review-required | — | CAP_06, ARC_18, ARC_19, DATA_03 |
| NODE_CAP_06_TESTING | Data Retention and Archival: verification | challenge | testing | delivery | 3–3.5 person-days | review-required | — | CAP_06, ARC_18, ARC_19, DATA_03 |
| NODE_CAP_07_AI_IMPLEMENTATION | Document and Content Data Management: AI implementation | challenge | ai-implementation | delivery | 3–3.5 person-days | review-required | — | CAP_07, AIUC_01, BR_04, FR_05, FR_06, FR_07, FR_09, NFR_03, NFR_05, NFR_06, INT_03, INT_04, DATA_02, DATA_03, DATA_05, SEC_06, TECH_01, TECH_02, CON_01, CON_02, SYS_05, PER_02, RSK_02, GAP_02, ASM_02, Q_02, DATA_01 |
| NODE_CAP_07_DATA_ENGINEERING | Document and Content Data Management: data engineering | private-pod | data-engineering | delivery | 3–3.5 person-days | review-required | — | CAP_07, DATA_01, DATA_02, DATA_03, DATA_05 |
| NODE_CAP_07_CLOUD_DEVOPS | Document and Content Data Management: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | review-required | — | CAP_07, ARC_06, ARC_10, ARC_13, ARC_14, ARC_18, ARC_19, ARC_20, ARC_25, DATA_01, DATA_02, DATA_03, DATA_05 |
| NODE_CAP_07_TESTING | Document and Content Data Management: verification | challenge | testing | delivery | 3–3.5 person-days | review-required | — | CAP_07, ARC_06, ARC_10, ARC_13, ARC_14, ARC_18, ARC_19, ARC_20, ARC_25, DATA_01, DATA_02, DATA_03, DATA_05 |
| NODE_CAP_08_DATA_ENGINEERING | Personal Data Protection: data engineering | private-pod | data-engineering | delivery | 3–3.5 person-days | review-required | — | CAP_08, DATA_01 |
| NODE_CAP_08_CLOUD_DEVOPS | Personal Data Protection: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | review-required | — | CAP_08, ARC_06, ARC_13, ARC_14, ARC_18, DATA_01 |
| NODE_CAP_08_TESTING | Personal Data Protection: verification | challenge | testing | delivery | 3–3.5 person-days | review-required | — | CAP_08, ARC_06, ARC_13, ARC_14, ARC_18, DATA_01 |
| NODE_CAP_09_INTEGRATION | Clinical System Integration (HL7/FHIR): integration | private-pod | integration | delivery | 23.5–44 person-days | blocked | GAP_01, Q_01 | CAP_09, IF_01, INT_01, SYS_01 |
| NODE_CAP_09_CLOUD_DEVOPS | Clinical System Integration (HL7/FHIR): cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | blocked | GAP_01, Q_01 | CAP_09, ARC_10, ARC_15, ARC_16, ARC_17, ARC_18, INT_01 |
| NODE_CAP_09_TESTING | Clinical System Integration (HL7/FHIR): verification | challenge | testing | delivery | 23.5–44 person-days | blocked | GAP_01, Q_01 | CAP_09, ARC_10, ARC_15, ARC_16, ARC_17, ARC_18, INT_01 |
| NODE_CAP_10_BACKEND_API | AI Conversational Assistant: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_10, BR_04, FR_05, FR_06, FR_09 |
| NODE_CAP_10_AI_IMPLEMENTATION | AI Conversational Assistant: AI implementation | challenge | ai-implementation | delivery | needs input | review-required | — | CAP_10, AIUC_01, BR_04, FR_05, FR_06, FR_07, FR_09, NFR_03, NFR_05, NFR_06, INT_03, INT_04, DATA_02, DATA_03, DATA_05, SEC_06, TECH_01, TECH_02, CON_01, CON_02, SYS_05, PER_02, RSK_02, GAP_02, ASM_02, Q_02 |
| NODE_CAP_10_CLOUD_DEVOPS | AI Conversational Assistant: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | review-required | — | CAP_10, ARC_06, ARC_18, ARC_19, ARC_25, BR_04, FR_05, FR_06, FR_09 |
| NODE_CAP_10_TESTING | AI Conversational Assistant: verification | challenge | testing | delivery | needs input | review-required | — | CAP_10, BR_04, FR_05, FR_06, FR_09, ARC_06, ARC_18, ARC_19, ARC_25 |
| NODE_CAP_11_BACKEND_API | AI Document Extraction: backend and API | challenge | backend-api | delivery | needs input | review-required | — | CAP_11, FR_02, FR_10 |
| NODE_CAP_11_AI_IMPLEMENTATION | AI Document Extraction: AI implementation | challenge | ai-implementation | delivery | needs input | review-required | — | CAP_11, AIUC_02, FR_02, FR_10, NFR_02, NFR_05, TECH_02, CON_03, RSK_01 |
| NODE_CAP_11_CLOUD_DEVOPS | AI Document Extraction: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | review-required | — | CAP_11, ARC_18, ARC_19, ARC_21, FR_02, FR_10 |
| NODE_CAP_11_TESTING | AI Document Extraction: verification | challenge | testing | delivery | needs input | review-required | — | CAP_11, FR_02, FR_10, ARC_18, ARC_19, ARC_21 |
| NODE_CAP_12_SECURITY | Data Encryption: security | private-pod | security | delivery | 7.5–9.5 person-days | review-required | — | CAP_12, SEC_02 |
| NODE_CAP_12_CLOUD_DEVOPS | Data Encryption: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | review-required | — | CAP_12, ARC_04, ARC_06, ARC_10, ARC_11, ARC_13, ARC_14, SEC_02 |
| NODE_CAP_12_TESTING | Data Encryption: verification | private-pod | testing | delivery | 3–3.5 person-days | review-required | — | CAP_12, ARC_04, ARC_06, ARC_10, ARC_11, ARC_13, ARC_14, SEC_02 |
| NODE_CAP_13_SECURITY | Multi-Factor Authentication: security | private-pod | security | delivery | 7.5–9.5 person-days | review-required | — | CAP_13, SEC_04 |
| NODE_CAP_13_CLOUD_DEVOPS | Multi-Factor Authentication: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | review-required | — | CAP_13, ARC_05, ARC_13, ARC_14, ARC_25, SEC_04 |
| NODE_CAP_13_TESTING | Multi-Factor Authentication: verification | challenge | testing | delivery | needs input | review-required | — | CAP_13, ARC_05, ARC_13, ARC_14, ARC_25, SEC_04 |
| NODE_CAP_14_SECURITY | Role-Based Access Control: security | private-pod | security | delivery | 7.5–9.5 person-days | review-required | — | CAP_14, SEC_03 |
| NODE_CAP_14_CLOUD_DEVOPS | Role-Based Access Control: cloud and DevOps | private-pod | cloud-devops | delivery | 3–5 person-days | review-required | — | CAP_14, ARC_02, ARC_05, ARC_06, ARC_07, ARC_13, ARC_14, ARC_18, ARC_25, SEC_03 |
| NODE_CAP_14_TESTING | Role-Based Access Control: verification | challenge | testing | delivery | needs input | review-required | — | CAP_14, ARC_02, ARC_05, ARC_06, ARC_07, ARC_13, ARC_14, ARC_18, ARC_25, SEC_03 |
| NODE_PH_1_DEPLOYMENT | Release Discovery and Architecture | private-pod | deployment | delivery | 41–62 person-days | review-required | — | PH_1, WS_PH_1 |
| NODE_PH_2_DEPLOYMENT | Release Experience and Core Platform | private-pod | deployment | delivery | 10–15.5 person-days | review-required | — | PH_2, WS_01, WS_02, WS_03, WS_04 |
| NODE_PH_3_DEPLOYMENT | Release Data and Integration | private-pod | deployment | delivery | 23.5–44 person-days | review-required | — | PH_3, WS_05, WS_06 |
| NODE_PH_4_DEPLOYMENT | Release AI Capabilities | private-pod | deployment | delivery | 41–62 person-days | review-required | — | PH_4, WS_07 |
| NODE_PH_5_DEPLOYMENT | Release Testing and Hardening | private-pod | deployment | delivery | 76–116 person-days | review-required | — | PH_5, WS_PH_5 |
| NODE_PH_6_DEPLOYMENT | Release Deployment and Handover | private-pod | deployment | delivery | 27–42 person-days | review-required | — | PH_6, WS_PH_6 |
| NODE_OPERATIONAL_HANDOFF_APPROVAL | Operational handoff approval | flexible-talent | technical-review | approval | needs input | review-required | — | — |

## Dependencies

| Edge | From | To | Type | Blocking | Handoff | Rationale |
| --- | --- | --- | --- | --- | --- | --- |
| EDGE_001 | NODE_CAP_01_BACKEND_API | NODE_CAP_01_TESTING | sequencing | yes | Deliverable ready for verification | Document Management: verification verifies the output of NODE_CAP_01_BACKEND_API. |
| EDGE_002 | NODE_CAP_01_CLOUD_DEVOPS | NODE_CAP_01_TESTING | model-handoff | yes | Deliverable ready for verification | Document Management: verification verifies the output of NODE_CAP_01_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_003 | NODE_CAP_01_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_004 | NODE_CAP_01_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Document Management: verification to be complete. |
| EDGE_005 | NODE_CAP_02_BACKEND_API | NODE_CAP_02_TESTING | model-handoff | yes | Deliverable ready for verification | Forms and Data Capture: verification verifies the output of NODE_CAP_02_BACKEND_API. Handoff from private-pod to challenge. |
| EDGE_006 | NODE_CAP_02_BACKEND_API | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_007 | NODE_CAP_02_CLOUD_DEVOPS | NODE_CAP_02_TESTING | model-handoff | yes | Deliverable ready for verification | Forms and Data Capture: verification verifies the output of NODE_CAP_02_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_008 | NODE_CAP_02_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_009 | NODE_CAP_02_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_010 | NODE_CAP_03_AI_IMPLEMENTATION | NODE_CAP_03_TESTING | sequencing | yes | Deliverable ready for verification | Self-Service Portal: verification verifies the output of NODE_CAP_03_AI_IMPLEMENTATION. |
| EDGE_011 | NODE_CAP_03_BACKEND_API | NODE_CAP_03_TESTING | sequencing | yes | Deliverable ready for verification | Self-Service Portal: verification verifies the output of NODE_CAP_03_BACKEND_API. |
| EDGE_012 | NODE_CAP_03_CLOUD_DEVOPS | NODE_CAP_03_TESTING | model-handoff | yes | Deliverable ready for verification | Self-Service Portal: verification verifies the output of NODE_CAP_03_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_013 | NODE_CAP_03_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_014 | NODE_CAP_03_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Self-Service Portal: verification to be complete. |
| EDGE_015 | NODE_CAP_04_AI_IMPLEMENTATION | NODE_CAP_04_TESTING | sequencing | yes | Deliverable ready for verification | Workflow and Approvals: verification verifies the output of NODE_CAP_04_AI_IMPLEMENTATION. |
| EDGE_016 | NODE_CAP_04_BACKEND_API | NODE_CAP_04_TESTING | sequencing | yes | Deliverable ready for verification | Workflow and Approvals: verification verifies the output of NODE_CAP_04_BACKEND_API. |
| EDGE_017 | NODE_CAP_04_CLOUD_DEVOPS | NODE_CAP_04_TESTING | model-handoff | yes | Deliverable ready for verification | Workflow and Approvals: verification verifies the output of NODE_CAP_04_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_018 | NODE_CAP_04_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_019 | NODE_CAP_04_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Workflow and Approvals: verification to be complete. |
| EDGE_020 | NODE_CAP_05_AI_IMPLEMENTATION | NODE_CAP_05_SECURITY | security-gate | yes | Security review | Core Platform Services: security reviews the security controls of NODE_CAP_05_AI_IMPLEMENTATION before release. |
| EDGE_021 | NODE_CAP_05_AI_IMPLEMENTATION | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_AI_IMPLEMENTATION. |
| EDGE_022 | NODE_CAP_05_AI_IMPLEMENTATION | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_023 | NODE_CAP_05_AI_IMPLEMENTATION_2 | NODE_CAP_05_SECURITY | security-gate | yes | Security review | Core Platform Services: security reviews the security controls of NODE_CAP_05_AI_IMPLEMENTATION_2 before release. |
| EDGE_024 | NODE_CAP_05_AI_IMPLEMENTATION_2 | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_AI_IMPLEMENTATION_2. |
| EDGE_025 | NODE_CAP_05_AI_IMPLEMENTATION_2 | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_026 | NODE_CAP_05_CLOUD_DEVOPS | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_CLOUD_DEVOPS. |
| EDGE_027 | NODE_CAP_05_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_028 | NODE_CAP_05_DATA_ENGINEERING | NODE_CAP_05_AI_IMPLEMENTATION | data-dependency | yes | Prepared data set | Core Platform Services: AI implementation trains or grounds on the data prepared by NODE_CAP_05_DATA_ENGINEERING. |
| EDGE_029 | NODE_CAP_05_DATA_ENGINEERING | NODE_CAP_05_AI_IMPLEMENTATION_2 | data-dependency | yes | Prepared data set | Core Platform Services: AI implementation trains or grounds on the data prepared by NODE_CAP_05_DATA_ENGINEERING. |
| EDGE_030 | NODE_CAP_05_DATA_ENGINEERING | NODE_CAP_05_SECURITY | security-gate | yes | Security review | Core Platform Services: security reviews the security controls of NODE_CAP_05_DATA_ENGINEERING before release. |
| EDGE_031 | NODE_CAP_05_DATA_ENGINEERING | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_DATA_ENGINEERING. |
| EDGE_032 | NODE_CAP_05_DATA_ENGINEERING | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_033 | NODE_CAP_05_INTEGRATION | NODE_CAP_05_SECURITY | security-gate | yes | Security review | Core Platform Services: security reviews the security controls of NODE_CAP_05_INTEGRATION before release. |
| EDGE_034 | NODE_CAP_05_INTEGRATION | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_INTEGRATION. |
| EDGE_035 | NODE_CAP_05_INTEGRATION | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_036 | NODE_CAP_05_INTEGRATION_2 | NODE_CAP_05_SECURITY | security-gate | yes | Security review | Core Platform Services: security reviews the security controls of NODE_CAP_05_INTEGRATION_2 before release. |
| EDGE_037 | NODE_CAP_05_INTEGRATION_2 | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_INTEGRATION_2. |
| EDGE_038 | NODE_CAP_05_INTEGRATION_2 | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_039 | NODE_CAP_05_INTEGRATION_3 | NODE_CAP_05_SECURITY | security-gate | yes | Security review | Core Platform Services: security reviews the security controls of NODE_CAP_05_INTEGRATION_3 before release. |
| EDGE_040 | NODE_CAP_05_INTEGRATION_3 | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_INTEGRATION_3. |
| EDGE_041 | NODE_CAP_05_INTEGRATION_3 | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_042 | NODE_CAP_05_SECURITY | NODE_CAP_05_TESTING | sequencing | yes | Deliverable ready for verification | Core Platform Services: verification verifies the output of NODE_CAP_05_SECURITY. |
| EDGE_043 | NODE_CAP_05_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_044 | NODE_CAP_05_TESTING | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_01. |
| EDGE_045 | NODE_CAP_06_AI_IMPLEMENTATION | NODE_CAP_06_TESTING | sequencing | yes | Deliverable ready for verification | Data Retention and Archival: verification verifies the output of NODE_CAP_06_AI_IMPLEMENTATION. |
| EDGE_046 | NODE_CAP_06_AI_IMPLEMENTATION | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_047 | NODE_CAP_06_CLOUD_DEVOPS | NODE_CAP_06_TESTING | model-handoff | yes | Deliverable ready for verification | Data Retention and Archival: verification verifies the output of NODE_CAP_06_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_048 | NODE_CAP_06_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_049 | NODE_CAP_06_DATA_ENGINEERING | NODE_CAP_06_AI_IMPLEMENTATION | data-dependency | yes | Prepared data set | Data Retention and Archival: AI implementation trains or grounds on the data prepared by NODE_CAP_06_DATA_ENGINEERING. |
| EDGE_050 | NODE_CAP_06_DATA_ENGINEERING | NODE_CAP_06_TESTING | model-handoff | yes | Deliverable ready for verification | Data Retention and Archival: verification verifies the output of NODE_CAP_06_DATA_ENGINEERING. Handoff from private-pod to challenge. |
| EDGE_051 | NODE_CAP_06_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_052 | NODE_CAP_06_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_053 | NODE_CAP_07_AI_IMPLEMENTATION | NODE_CAP_07_TESTING | sequencing | yes | Deliverable ready for verification | Document and Content Data Management: verification verifies the output of NODE_CAP_07_AI_IMPLEMENTATION. |
| EDGE_054 | NODE_CAP_07_AI_IMPLEMENTATION | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_055 | NODE_CAP_07_CLOUD_DEVOPS | NODE_CAP_07_TESTING | model-handoff | yes | Deliverable ready for verification | Document and Content Data Management: verification verifies the output of NODE_CAP_07_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_056 | NODE_CAP_07_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_057 | NODE_CAP_07_DATA_ENGINEERING | NODE_CAP_07_AI_IMPLEMENTATION | data-dependency | yes | Prepared data set | Document and Content Data Management: AI implementation trains or grounds on the data prepared by NODE_CAP_07_DATA_ENGINEERING. |
| EDGE_058 | NODE_CAP_07_DATA_ENGINEERING | NODE_CAP_07_TESTING | model-handoff | yes | Deliverable ready for verification | Document and Content Data Management: verification verifies the output of NODE_CAP_07_DATA_ENGINEERING. Handoff from private-pod to challenge. |
| EDGE_059 | NODE_CAP_07_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_060 | NODE_CAP_07_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_061 | NODE_CAP_08_CLOUD_DEVOPS | NODE_CAP_08_TESTING | model-handoff | yes | Deliverable ready for verification | Personal Data Protection: verification verifies the output of NODE_CAP_08_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_062 | NODE_CAP_08_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_063 | NODE_CAP_08_DATA_ENGINEERING | NODE_CAP_08_TESTING | model-handoff | yes | Deliverable ready for verification | Personal Data Protection: verification verifies the output of NODE_CAP_08_DATA_ENGINEERING. Handoff from private-pod to challenge. |
| EDGE_064 | NODE_CAP_08_DATA_ENGINEERING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_065 | NODE_CAP_08_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. Handoff from challenge to private-pod. |
| EDGE_066 | NODE_CAP_09_CLOUD_DEVOPS | NODE_CAP_09_TESTING | model-handoff | yes | Deliverable ready for verification | Clinical System Integration (HL7/FHIR): verification verifies the output of NODE_CAP_09_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_067 | NODE_CAP_09_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_068 | NODE_CAP_09_INTEGRATION | NODE_CAP_09_TESTING | model-handoff | yes | Deliverable ready for verification | Clinical System Integration (HL7/FHIR): verification verifies the output of NODE_CAP_09_INTEGRATION. Handoff from private-pod to challenge. |
| EDGE_069 | NODE_CAP_09_INTEGRATION | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. |
| EDGE_070 | NODE_CAP_09_TESTING | NODE_PH_3_DEPLOYMENT | model-handoff | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_05. Handoff from challenge to private-pod. |
| EDGE_071 | NODE_CAP_10_AI_IMPLEMENTATION | NODE_CAP_10_TESTING | sequencing | yes | Deliverable ready for verification | AI Conversational Assistant: verification verifies the output of NODE_CAP_10_AI_IMPLEMENTATION. |
| EDGE_072 | NODE_CAP_10_BACKEND_API | NODE_CAP_10_TESTING | sequencing | yes | Deliverable ready for verification | AI Conversational Assistant: verification verifies the output of NODE_CAP_10_BACKEND_API. |
| EDGE_073 | NODE_CAP_10_CLOUD_DEVOPS | NODE_CAP_10_TESTING | model-handoff | yes | Deliverable ready for verification | AI Conversational Assistant: verification verifies the output of NODE_CAP_10_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_074 | NODE_CAP_10_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_075 | NODE_CAP_10_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires AI Conversational Assistant: verification to be complete. |
| EDGE_076 | NODE_CAP_11_AI_IMPLEMENTATION | NODE_CAP_11_TESTING | sequencing | yes | Deliverable ready for verification | AI Document Extraction: verification verifies the output of NODE_CAP_11_AI_IMPLEMENTATION. |
| EDGE_077 | NODE_CAP_11_BACKEND_API | NODE_CAP_11_TESTING | sequencing | yes | Deliverable ready for verification | AI Document Extraction: verification verifies the output of NODE_CAP_11_BACKEND_API. |
| EDGE_078 | NODE_CAP_11_CLOUD_DEVOPS | NODE_CAP_11_TESTING | model-handoff | yes | Deliverable ready for verification | AI Document Extraction: verification verifies the output of NODE_CAP_11_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_079 | NODE_CAP_11_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_080 | NODE_CAP_11_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires AI Document Extraction: verification to be complete. |
| EDGE_081 | NODE_CAP_12_CLOUD_DEVOPS | NODE_CAP_12_TESTING | sequencing | yes | Deliverable ready for verification | Data Encryption: verification verifies the output of NODE_CAP_12_CLOUD_DEVOPS. |
| EDGE_082 | NODE_CAP_12_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_083 | NODE_CAP_12_SECURITY | NODE_CAP_12_TESTING | sequencing | yes | Deliverable ready for verification | Data Encryption: verification verifies the output of NODE_CAP_12_SECURITY. |
| EDGE_084 | NODE_CAP_12_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_085 | NODE_CAP_12_TESTING | NODE_PH_3_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_3 covers estimate workstream WS_06. |
| EDGE_086 | NODE_CAP_13_CLOUD_DEVOPS | NODE_CAP_13_TESTING | model-handoff | yes | Deliverable ready for verification | Multi-Factor Authentication: verification verifies the output of NODE_CAP_13_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_087 | NODE_CAP_13_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_088 | NODE_CAP_13_SECURITY | NODE_CAP_13_TESTING | model-handoff | yes | Deliverable ready for verification | Multi-Factor Authentication: verification verifies the output of NODE_CAP_13_SECURITY. Handoff from private-pod to challenge. |
| EDGE_089 | NODE_CAP_13_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_090 | NODE_CAP_13_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Multi-Factor Authentication: verification to be complete. |
| EDGE_091 | NODE_CAP_14_CLOUD_DEVOPS | NODE_CAP_14_TESTING | model-handoff | yes | Deliverable ready for verification | Role-Based Access Control: verification verifies the output of NODE_CAP_14_CLOUD_DEVOPS. Handoff from private-pod to challenge. |
| EDGE_092 | NODE_CAP_14_CLOUD_DEVOPS | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_04. |
| EDGE_093 | NODE_CAP_14_SECURITY | NODE_CAP_14_TESTING | model-handoff | yes | Deliverable ready for verification | Role-Based Access Control: verification verifies the output of NODE_CAP_14_SECURITY. Handoff from private-pod to challenge. |
| EDGE_094 | NODE_CAP_14_SECURITY | NODE_PH_2_DEPLOYMENT | sequencing | yes | Deliverable accepted into the phase | Phase PH_2 covers estimate workstream WS_03. |
| EDGE_095 | NODE_CAP_14_TESTING | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Role-Based Access Control: verification to be complete. |
| EDGE_096 | NODE_GAP_01 | NODE_CAP_09_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is unclear whether the current Epic FHIR R4 sandbox supports writing structured referral data or only reading patient context. |
| EDGE_097 | NODE_GAP_01 | NODE_CAP_09_INTEGRATION | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is unclear whether the current Epic FHIR R4 sandbox supports writing structured referral data or only reading patient context. |
| EDGE_098 | NODE_GAP_01 | NODE_CAP_09_TESTING | blocking-discovery | yes | Resolution of GAP_01 | NODE_GAP_01 must be resolved before this work is sequenced: It is unclear whether the current Epic FHIR R4 sandbox supports writing structured referral data or only reading patient context. |
| EDGE_099 | NODE_PH_1_DEPLOYMENT | NODE_PH_2_DEPLOYMENT | sequencing | yes | Release Discovery and Architecture released | Release Experience and Core Platform follows Release Discovery and Architecture in the imported delivery plan. |
| EDGE_100 | NODE_PH_2_DEPLOYMENT | NODE_PH_3_DEPLOYMENT | sequencing | yes | Release Experience and Core Platform released | Release Data and Integration follows Release Experience and Core Platform in the imported delivery plan. |
| EDGE_101 | NODE_PH_3_DEPLOYMENT | NODE_PH_4_DEPLOYMENT | sequencing | yes | Release Data and Integration released | Release AI Capabilities follows Release Data and Integration in the imported delivery plan. |
| EDGE_102 | NODE_PH_4_DEPLOYMENT | NODE_PH_5_DEPLOYMENT | sequencing | yes | Release AI Capabilities released | Release Testing and Hardening follows Release AI Capabilities in the imported delivery plan. |
| EDGE_103 | NODE_PH_5_DEPLOYMENT | NODE_PH_6_DEPLOYMENT | sequencing | yes | Release Testing and Hardening released | Release Deployment and Handover follows Release Testing and Hardening in the imported delivery plan. |
| EDGE_104 | NODE_PH_6_DEPLOYMENT | NODE_OPERATIONAL_HANDOFF_APPROVAL | approval | yes | Deliverable complete | Operational handoff approval requires Release Deployment and Handover to be complete. |
| EDGE_105 | NODE_Q_01 | NODE_CAP_01_BACKEND_API | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether the Epic FHIR R4 sandbox supports writing structured referral data or is currently read-only for patient context. |
| EDGE_106 | NODE_Q_01 | NODE_CAP_01_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether the Epic FHIR R4 sandbox supports writing structured referral data or is currently read-only for patient context. |
| EDGE_107 | NODE_Q_01 | NODE_CAP_01_TESTING | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether the Epic FHIR R4 sandbox supports writing structured referral data or is currently read-only for patient context. |
| EDGE_108 | NODE_Q_01 | NODE_CAP_04_AI_IMPLEMENTATION | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether the Epic FHIR R4 sandbox supports writing structured referral data or is currently read-only for patient context. |
| EDGE_109 | NODE_Q_01 | NODE_CAP_04_BACKEND_API | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether the Epic FHIR R4 sandbox supports writing structured referral data or is currently read-only for patient context. |
| EDGE_110 | NODE_Q_01 | NODE_CAP_04_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether the Epic FHIR R4 sandbox supports writing structured referral data or is currently read-only for patient context. |
| EDGE_111 | NODE_Q_01 | NODE_CAP_04_TESTING | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether the Epic FHIR R4 sandbox supports writing structured referral data or is currently read-only for patient context. |
| EDGE_112 | NODE_Q_01 | NODE_CAP_09_CLOUD_DEVOPS | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether the Epic FHIR R4 sandbox supports writing structured referral data or is currently read-only for patient context. |
| EDGE_113 | NODE_Q_01 | NODE_CAP_09_INTEGRATION | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether the Epic FHIR R4 sandbox supports writing structured referral data or is currently read-only for patient context. |
| EDGE_114 | NODE_Q_01 | NODE_CAP_09_TESTING | blocking-discovery | yes | Resolution of Q_01 | NODE_Q_01 must be resolved before this work is sequenced: Confirm whether the Epic FHIR R4 sandbox supports writing structured referral data or is currently read-only for patient context. |

## Quality gate

Status: **Review Required** (score 76/100)

| Rule | Status | Finding |
| --- | --- | --- |
| source-coverage | pass | Source coverage is 110% (88/80 requirements, components, integrations and AI use cases are referenced by at least one node). |
| unsupported-nodes | pass | Every node cites an imported source or an approved user decision. |
| duplicate-scope | warn | 3 group(s) of nodes share a category and identical sources. |
| missing-acceptance | warn | 6 delivery node(s) have no acceptance condition in the package. |
| missing-inputs | warn | 6 delivery node(s) do not state what they need to start. |
| classification-completeness | pass | 82/82 nodes carry exactly one primary operating model. |
| missing-rationale | pass | Every classification explains itself in plain English. |
| model-to-work-mismatch | pass | No operating model contradicts the work it covers. |
| missing-package-fields | warn | 82 node(s) are missing information their operating model requires. |
| cycles | pass | The dependency graph is acyclic. |
| orphan-nodes | pass | Every delivery node is connected to the graph. |
| invalid-dependencies | pass | Every edge has a known type, a rationale and source identifiers. |
| blocked-or-stale | warn | 10 node(s) are blocked: NODE_CAP_01_BACKEND_API, NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING, NODE_CAP_04_BACKEND_API, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING, NODE_CAP_09_INTEGRATION, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING |
| critical-path-completeness | pass | The critical path (6 node(s), 352 person-days) is fully estimated. |
| human-approval | warn | No operator has approved the graph yet; operational handoff needs a recorded human decision. |

## Traceability

| Source | Kind | Title | Nodes | Covered |
| --- | --- | --- | --- | --- |
| BR_01 | business | Cut document-keying time by 50% | NODE_CAP_01_BACKEND_API, NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING | yes |
| BR_02 | business | Reduce routine front-desk call volume | NODE_CAP_03_BACKEND_API, NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_03_CLOUD_DEVOPS, NODE_CAP_03_TESTING | yes |
| BR_03 | business | Faster document-to-chart visibility | NODE_CAP_01_BACKEND_API, NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING | yes |
| BR_04 | business | Clinical decisions stay with licensed staff | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_BACKEND_API, NODE_CAP_10_AI_IMPLEMENTATION, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| BR_05 | business | Behavioural-health screening (future candidate) | — | no |
| FR_01 | functional | Multi-channel document intake | NODE_CAP_01_BACKEND_API, NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING, NODE_CAP_02_BACKEND_API, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING | yes |
| FR_02 | functional | Structured field extraction | NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_11_BACKEND_API, NODE_CAP_11_AI_IMPLEMENTATION, NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING | yes |
| FR_03 | functional | Mandatory clerk review before write-back | NODE_CAP_01_BACKEND_API, NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING | yes |
| FR_04 | functional | Approved-document write-back to Epic | NODE_CAP_01_BACKEND_API, NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING, NODE_CAP_04_BACKEND_API, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING | yes |
| FR_05 | functional | Patient-support assistant Q&A | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_BACKEND_API, NODE_CAP_10_AI_IMPLEMENTATION, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| FR_06 | functional | Assistant answers grounded in approved policy content | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_BACKEND_API, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_BACKEND_API, NODE_CAP_10_AI_IMPLEMENTATION, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| FR_07 | functional | Escalation for clinical-judgement questions | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_BACKEND_API, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| FR_08 | functional | Prioritised clerk review queue | NODE_CAP_04_BACKEND_API, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING | yes |
| FR_09 | functional | Assistant availability through the patient portal and public website | NODE_CAP_03_BACKEND_API, NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_03_CLOUD_DEVOPS, NODE_CAP_03_TESTING, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_BACKEND_API, NODE_CAP_10_AI_IMPLEMENTATION, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| FR_10 | functional | Low-confidence extraction flagging for clerk review | NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_11_BACKEND_API, NODE_CAP_11_AI_IMPLEMENTATION, NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING | yes |
| NFR_01 | nonFunctional | 85,000 patient encounters per month at scale | NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| NFR_02 | nonFunctional | 5-minute extraction turnaround | NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_11_AI_IMPLEMENTATION | yes |
| NFR_03 | nonFunctional | 1,200 staff plus 85,000 monthly conversations | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| NFR_04 | nonFunctional | 99.5% availability during clinic hours | NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| NFR_05 | nonFunctional | Traceable extraction and assistant answers | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION, NODE_CAP_11_AI_IMPLEMENTATION | yes |
| NFR_06 | nonFunctional | 4-second assistant response time | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| INT_01 | integration | Epic FHIR R4 write and read integration | NODE_GAP_01, NODE_CAP_09_INTEGRATION, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING | yes |
| INT_02 | integration | Inbound document channel integration | NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| INT_03 | integration | Five9 handoff integration | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| INT_04 | integration | Patient-portal authentication reuse | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| INT_05 | integration | CareEverywhere query integration (later phase) | NODE_GAP_03 | yes |
| DATA_01 | data | Protected health information handling | NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_07_DATA_ENGINEERING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_08_DATA_ENGINEERING, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| DATA_02 | data | Approved-content-only assistant knowledge base | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_07_DATA_ENGINEERING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| DATA_03 | data | Six-year document and conversation retention | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_06_DATA_ENGINEERING, NODE_CAP_06_CLOUD_DEVOPS, NODE_CAP_06_TESTING, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_07_DATA_ENGINEERING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| DATA_04 | data | Conversation-log governance for model training | NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| DATA_05 | data | Separated encryption for documents and sessions | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_07_DATA_ENGINEERING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| SEC_01 | security | HIPAA compliance with a signed BAA | NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| SEC_02 | security | PHI encryption in transit and at rest | NODE_CAP_12_SECURITY, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING | yes |
| SEC_03 | security | Role-based review-queue access | NODE_CAP_14_SECURITY, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| SEC_04 | security | MFA for review-queue access | NODE_CAP_13_SECURITY, NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING | yes |
| SEC_05 | security | HIPAA security risk assessment before go-live | NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| SEC_06 | security | No cross-patient information disclosure on misroute | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| TECH_01 | technology | AWS as target cloud platform | NODE_RESOLVE_THE_CLOUD_PLATFORM_CONFLICT, NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| TECH_02 | technology | Managed AI/ML service for extraction and assistant | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION, NODE_CAP_11_AI_IMPLEMENTATION | yes |
| TECH_03 | technology | Python skill alignment for handover | — | no |
| CON_01 | constraint | 24-week phased rollout starting with intake | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| CON_02 | constraint | Compliance sign-off before any patient-facing pilot | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| CON_03 | constraint | Fallback to today's manual process during rollout | NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_11_AI_IMPLEMENTATION | yes |
| CON_04 | constraint | Limited subject-matter-expert availability during build | — | no |
| SYS_01 | existingSystem | Epic EHR | NODE_CAP_09_INTEGRATION | yes |
| SYS_02 | existingSystem | Five9 Contact Centre | NODE_CAP_05_INTEGRATION_2 | yes |
| SYS_03 | existingSystem | CareEverywhere Health Information Exchange | — | no |
| SYS_04 | existingSystem | Manual Document Scanning Process | — | no |
| SYS_05 | existingSystem | Patient Portal | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| PER_01 | persona | Medical Records Clerk | — | no |
| PER_02 | persona | Patient | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| ARC_01 | component | web-hosting-cdn (Azure Static Web Apps with Azure Front Door) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| ARC_02 | component | api-gateway (Azure API Management) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| ARC_03 | component | container-runtime (Azure Container Apps) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| ARC_04 | component | managed-relational-db (Azure Database for PostgreSQL - Flexible Server) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING | yes |
| ARC_05 | component | identity-customer (Microsoft Entra External ID) | NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| ARC_06 | component | monitoring (Azure Monitor) | NODE_CAP_03_CLOUD_DEVOPS, NODE_CAP_03_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| ARC_07 | component | logging (Azure Monitor Log Analytics) | NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| ARC_08 | component | ci-cd (Azure Pipelines) | — | no |
| ARC_09 | component | infrastructure-as-code (Azure Resource Manager (Bicep templates)) | — | no |
| ARC_10 | component | secrets-manager (Azure Key Vault (secrets)) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING | yes |
| ARC_11 | component | key-management (Azure Key Vault (keys, HSM-backed)) | NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING | yes |
| ARC_12 | component | backup (Azure Backup) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| ARC_13 | component | private-networking (Azure Virtual Network with Private Endpoints) | NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING, NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| ARC_14 | component | waf-ddos (Azure Web Application Firewall with Azure DDoS Protection) | NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING, NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| ARC_15 | component | api-gateway (Azure API Management) | NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING | yes |
| ARC_16 | component | integration-service (Azure Logic Apps) | NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING | yes |
| ARC_17 | component | message-queue (Azure Service Bus (queues)) | NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING | yes |
| ARC_18 | component | object-storage (Azure Blob Storage) | NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_06_CLOUD_DEVOPS, NODE_CAP_06_TESTING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING, NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| ARC_19 | component | llm-platform (Azure OpenAI in Azure AI Foundry) | NODE_CAP_03_CLOUD_DEVOPS, NODE_CAP_03_TESTING, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_06_CLOUD_DEVOPS, NODE_CAP_06_TESTING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING, NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING | yes |
| ARC_20 | component | vector-search (Azure AI Search (vector search)) | NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING | yes |
| ARC_21 | component | document-ai (Azure AI Document Intelligence) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING | yes |
| ARC_22 | component | availability-scaling (Zone-redundant Azure Container Apps environment with KEDA scale rules) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| ARC_23 | component | dr-multi-region (Azure Database for PostgreSQL cross-region read replica with geo-redundant backup (paired region)) | NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| ARC_24 | component | cache (Azure Cache for Redis) | NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| ARC_25 | component | workflow-orchestration (Azure Durable Functions) | NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING, NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |
| IF_01 | integration | Epic FHIR R4 write and read integration | NODE_CAP_09_INTEGRATION | yes |
| IF_02 | integration | Inbound document channel integration | NODE_CAP_05_INTEGRATION | yes |
| IF_03 | integration | Five9 handoff integration | NODE_CAP_05_INTEGRATION_2 | yes |
| IF_04 | integration | Patient-portal authentication reuse | NODE_CAP_05_INTEGRATION_3 | yes |
| AIUC_01 | aiUseCase | Retrieval-augmented generation (RAG) assistant: Patient-support assistant Q&A and 3 related functions | NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_10_AI_IMPLEMENTATION | yes |
| AIUC_02 | aiUseCase | Document extraction pipeline with human validation: Structured field extraction and 1 related function | NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_11_AI_IMPLEMENTATION | yes |
| CAP_01 | capability | Document Management | NODE_CAP_01_BACKEND_API, NODE_CAP_01_CLOUD_DEVOPS, NODE_CAP_01_TESTING | yes |
| CAP_02 | capability | Forms and Data Capture | NODE_CAP_02_BACKEND_API, NODE_CAP_02_CLOUD_DEVOPS, NODE_CAP_02_TESTING | yes |
| CAP_03 | capability | Self-Service Portal | NODE_CAP_03_BACKEND_API, NODE_CAP_03_AI_IMPLEMENTATION, NODE_CAP_03_CLOUD_DEVOPS, NODE_CAP_03_TESTING | yes |
| CAP_04 | capability | Workflow and Approvals | NODE_CAP_04_BACKEND_API, NODE_CAP_04_AI_IMPLEMENTATION, NODE_CAP_04_CLOUD_DEVOPS, NODE_CAP_04_TESTING | yes |
| CAP_05 | capability | Core Platform Services | NODE_CAP_05_INTEGRATION, NODE_CAP_05_INTEGRATION_2, NODE_CAP_05_INTEGRATION_3, NODE_CAP_05_AI_IMPLEMENTATION, NODE_CAP_05_AI_IMPLEMENTATION_2, NODE_CAP_05_DATA_ENGINEERING, NODE_CAP_05_SECURITY, NODE_CAP_05_CLOUD_DEVOPS, NODE_CAP_05_TESTING | yes |
| CAP_06 | capability | Data Retention and Archival | NODE_CAP_06_AI_IMPLEMENTATION, NODE_CAP_06_DATA_ENGINEERING, NODE_CAP_06_CLOUD_DEVOPS, NODE_CAP_06_TESTING | yes |
| CAP_07 | capability | Document and Content Data Management | NODE_CAP_07_AI_IMPLEMENTATION, NODE_CAP_07_DATA_ENGINEERING, NODE_CAP_07_CLOUD_DEVOPS, NODE_CAP_07_TESTING | yes |
| CAP_08 | capability | Personal Data Protection | NODE_CAP_08_DATA_ENGINEERING, NODE_CAP_08_CLOUD_DEVOPS, NODE_CAP_08_TESTING | yes |
| CAP_09 | capability | Clinical System Integration (HL7/FHIR) | NODE_CAP_09_INTEGRATION, NODE_CAP_09_CLOUD_DEVOPS, NODE_CAP_09_TESTING | yes |
| CAP_10 | capability | AI Conversational Assistant | NODE_CAP_10_BACKEND_API, NODE_CAP_10_AI_IMPLEMENTATION, NODE_CAP_10_CLOUD_DEVOPS, NODE_CAP_10_TESTING | yes |
| CAP_11 | capability | AI Document Extraction | NODE_CAP_11_BACKEND_API, NODE_CAP_11_AI_IMPLEMENTATION, NODE_CAP_11_CLOUD_DEVOPS, NODE_CAP_11_TESTING | yes |
| CAP_12 | capability | Data Encryption | NODE_CAP_12_SECURITY, NODE_CAP_12_CLOUD_DEVOPS, NODE_CAP_12_TESTING | yes |
| CAP_13 | capability | Multi-Factor Authentication | NODE_CAP_13_SECURITY, NODE_CAP_13_CLOUD_DEVOPS, NODE_CAP_13_TESTING | yes |
| CAP_14 | capability | Role-Based Access Control | NODE_CAP_14_SECURITY, NODE_CAP_14_CLOUD_DEVOPS, NODE_CAP_14_TESTING | yes |

## Notes

- 6 discovery, clarification or approval node(s) generated from gaps, questions and unconfirmed assumptions.
- 82 node(s) after removing 0 user-removed node(s).
- AI layer: provider mock in mock mode produced 98 suggestion(s); none are applied without a recorded user decision.
- Quality gate: Review Required (0 failing, 6 warning rule(s)).

Blocked or incomplete nodes are marked `not ready for operational handoff`. This document is a planning aid: it never recruits talent, launches a challenge or commits delivery.
