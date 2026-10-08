# Source-to-canonical mapping

How a deal-scoping workspace export becomes the canonical execution model.

The importer never mutates the source. `ImportedPackage.raw` (the parsed object)
and `ImportedPackage.rawText` (the exact bytes) are frozen alongside the
normalized model, addressed by SHA-256.

```
raw JSON text
  └─ safeParse            → prototype-safe object + duplicate/stripped key report
      └─ normalizePackage → CanonicalPackage + SourceIndex + structural findings
          └─ scanReferences → dangling references, quote verification, coverage
              └─ validatePackage → ValidationReport + PlatformConflict
                  └─ assessMaturity → MaturityAssessment
```

---

## 1. Imported sections

| Raw path                                                     | Canonical path                                                       | Rule                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scope.items[]`                                              | `scope.{requirements,assumptions,questions,gaps,risks,dependencies}` | Routed by `kind`. The requirement kinds (`business`, `functional`, `nonFunctional`, `security`, `integration`, `data`, `existingSystem`, `constraint`, `technology`, `persona`) keep their `kind` on the item.                                                                                                                                                                                                                          |
| `input.normalized.lines[]`                                   | _(not copied)_                                                       | Used only to re-verify `source.quote` anchors.                                                                                                                                                                                                                                                                                                                                                                                          |
| `input.rawText`                                              | _(not copied)_                                                       | Retained inside the raw package; rendered in the Raw source tab.                                                                                                                                                                                                                                                                                                                                                                        |
| `outputs.prd.data.functionalScope.capabilities[]`            | `functionalScope.capabilities[]`                                     | `requirementIds` kept verbatim. `dependencies` are **names**, resolved against capability names. Prose is read from `scope` first and `description` second. `acceptance[]` becomes the capability's `acceptanceConditions` — the _only_ acceptance conditions the engine may attach to a node without a human decision. `module`, `workstream` and `deliveryPackage` are kept as `moduleNames` placement hints.                         |
| `outputs.prd.data.functionalScope.modules[]`                 | `functionalScope.modules[]`                                          | Synthesized id `MOD:<slug>`.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `outputs.prd.data.functionalScope.workstreams[]`             | `functionalScope.workstreams[]`                                      | Synthesized id `WSF:<slug>`. **Not** the same namespace as `outputs.estimate...workstreams[]`.                                                                                                                                                                                                                                                                                                                                          |
| `outputs.prd.data.functionalScope.deliveryPackages[]`        | `functionalScope.deliveryPackages[]`                                 | Synthesized id `PKG:<slug>`. `engagementModel` retained as `engagementModelHint` only.                                                                                                                                                                                                                                                                                                                                                  |
| `outputs.prd.data.functionalScope.recommendedEnhancements[]` | `functionalScope.enhancements[]`                                     | Synthesized id `ENH:<slug>`.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `outputs.prd.data.functionalScope.outOfScope[]`              | `functionalScope.outOfScope[]`                                       | Synthesized id `EXT:<slug>`, `inScope: false`. The official packages state exclusions as `{ text, refs, label }` rather than `{ name, requirementIds }`, so the wording is read from `text` and the excluded requirement ids from `refs`; an exclusion never collapses to an anonymous placeholder or loses its traceability.                                                                                                           |
| `outputs.architecture.data.components[]`                     | `architecture.components[]`                                          | `ARC_*` ids preserved verbatim.                                                                                                                                                                                                                                                                                                                                                                                                         |
| `outputs.architecture.data.flows[]`                          | `architecture.flows[]`                                               | Both endpoints validated. An endpoint may name an internal component (`ARC_*`) or an external system addressed as `ext:<scope id>:<name>`, which is resolved against the imported integrations and scope items — an external endpoint is **not** an invalid one. `valid: false` only when neither resolves, and every unresolved endpoint is recorded in `findings.invalidFlowEndpoints`. The flow is kept and reported, never dropped. |
| `outputs.dataIntegration.data.domains[]`                     | `strategy.dataDomains[]`                                             | `regulated: true` when `classification` matches regulated / restricted / PHI / PII / sensitive.                                                                                                                                                                                                                                                                                                                                         |
| `outputs.dataIntegration.data.integrations[]`                | `strategy.integrations[]`                                            | `IF_*` preserved. `pattern` ∈ `api · event · batch · file`.                                                                                                                                                                                                                                                                                                                                                                             |
| `outputs.aiStrategy.data.useCases[]`                         | `strategy.aiUseCases[]`                                              | `AIUC_*` preserved.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `outputs.aiStrategy.data.boundaries[]`                       | `strategy.aiBoundaries[]`                                            | `type` ∈ `ai · deterministic · human`. Drives human-review and AI/deterministic splits later.                                                                                                                                                                                                                                                                                                                                           |
| `outputs.estimate.data.result.workstreams[]`                 | `delivery.workstreams[]`                                             | `WS_*` preserved. `effortDays{low,likely,high}` is the **only** effort source. `roles` and `skills` are read in either form the upstream tool writes: plain strings, or records such as `{ roleId, label, days, dayRate, cost }`, where the human `label` is preferred so a package reads as a brief rather than a list of slugs.                                                                                                       |
| `outputs.estimate.data.result.phases[]`                      | `delivery.phases[]`                                                  | `WS_PH_*` preserved.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `outputs.estimate.data.result.totals.effortDays`             | `delivery.totals`                                                    | Copied as-is.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `outputs.estimate.data.result.{confidence,missingInputs}`    | `delivery.{confidence,missingInputs}`                                | `confidence` also copied to `deal.confidence`. `missingInputs` is read as either `["dataVolume"]` or `[{ key, label, effect, affected, howToResolve }]`; the readable `label` is used, and each entry becomes a clarification node rather than being dropped.                                                                                                                                                                           |
| `config.*`                                                   | `config.*`                                                           | `expectedUsers`, `environments`, `deadline` are `number \| null` / `string \| null`; `targetRegions` is `string[]`. A `null` value is kept as _missing_, never coerced to `0`.                                                                                                                                                                                                                                                          |
| `customer.{customerName,name}`                               | `deal.customer`                                                      | The official packages use `customer.customerName`; older exports used `customer.name`. Both are read so a deal is never labelled with the `Unnamed customer` placeholder.                                                                                                                                                                                                                                                               |
| `quality.checks[]`                                           | `quality.findings[]`                                                 | Copied verbatim with `provenance: "imported"`.                                                                                                                                                                                                                                                                                                                                                                                          |
| `outputs.*.{status,reviewed,staleReasons,meta.scopeVersion}` | `ValidationReport.sections[]`                                        | Per-section freshness; version compared against `scope.version`.                                                                                                                                                                                                                                                                                                                                                                        |
| `changeLog[]`                                                | _(not copied)_                                                       | Read for platform-conflict context only.                                                                                                                                                                                                                                                                                                                                                                                                |

## 2. Ignored sections

| Path                      | Why                                                                        |
| ------------------------- | -------------------------------------------------------------------------- |
| `estimationConfig.rates`  | Commercial rate card. Preserved in the raw package; never used.            |
| Any cost / currency field | The tool must never appear to commit funding.                              |
| `disclaimer`              | Environment banner text. Preserved in raw and rendered as-is.              |
| `outputs.*.meta.mode`     | Records that the _upstream_ tool ran in mock mode; not this engine's mode. |

## 3. Identifier preservation rules

1. Every imported identifier is kept **verbatim** and is the join key for
   traceability. Nothing is renumbered, re-cased or merged.
2. Namespaces are never collapsed. `INT_01` (requirement) and `IF_01` (interface
   design) are separate records, linked only through `requirementIds`.
   `WS_01` (estimate workstream) and `WSF:<slug>` (functional workstream) are
   separate records.
3. Identifiers that do not follow `PREFIX_NN` are admitted and reported as
   `malformed-id` warnings.
4. Synthesized identifiers use `PREFIX:slug` form and are flagged
   `synthesized: true`. They are stable for a given name.
5. Duplicate identifiers across the whole index are reported as **errors**.

## 4. Validation rules

| Code                                          | Severity                   | Trigger                                                            |
| --------------------------------------------- | -------------------------- | ------------------------------------------------------------------ |
| `file-too-large`                              | error                      | Over `MAX_IMPORT_BYTES` (10 MB).                                   |
| `json-parse-error`                            | error                      | Syntax error; line and column are reported.                        |
| `not-a-workspace-export`                      | error                      | Valid JSON that is not an object.                                  |
| `stripped-unsafe-key`                         | warning                    | `__proto__` / `constructor` / `prototype` encountered.             |
| `duplicate-json-key`                          | warning                    | A key repeats in the document.                                     |
| `missing-section`                             | warning                    | A required section is absent.                                      |
| `duplicate-id`                                | error                      | An identifier is defined twice.                                    |
| `malformed-id`                                | warning                    | Identifier does not match `PREFIX_NN`.                             |
| `dangling-reference`                          | error (critical) / warning | A reference points at a missing identifier.                        |
| `unresolved-name-reference`                   | warning                    | A name-based dependency (capability `dependencies`) did not match. |
| `invalid-flow-endpoint`                       | warning                    | An architecture flow references an undefined component.            |
| `excluded-items`                              | info                       | Items with `inScope: false`.                                       |
| `empty-resolution`                            | warning                    | `resolved: true` with no resolution text.                          |
| `quote-mismatch`                              | info                       | `source.quote` not found in the cited lines.                       |
| `critical-unresolved`                         | warning                    | `critical: true` and unresolved.                                   |
| `section-unreviewed`                          | info                       | `reviewed: false`.                                                 |
| `stale-section`                               | warning                    | Non-`current` status, stale reason, or scope-version mismatch.     |
| `platform-conflict`                           | warning                    | More than one cloud platform referenced.                           |
| `missing-estimation-inputs`                   | warning                    | Core config values absent.                                         |
| `estimate-missing-input`                      | warning                    | An entry in `estimate...missingInputs`.                            |
| `quality-check:*`                             | warning                    | An imported check with `status: "warn"`.                           |
| `open-questions` / `open-gaps` / `open-risks` | info                       | Unresolved backlog items.                                          |
| `unvalidated-assumptions`                     | warning                    | Assumptions whose `review` is not approved/validated.              |

## 5. Maturity rules

Weights are applied in `src/engine/maturity.ts`. The level is the worst level any
triggered rule assigns; the score is `100 + Σ delta`, clamped to 0–100.

| Code                             | Level              | Delta |
| -------------------------------- | ------------------ | ----- |
| `structural-errors`              | blocked            | −40   |
| `critical-backlog` (≥ 3)         | discovery-required | −25   |
| `low-estimate-confidence`        | discovery-required | −20   |
| `missing-core-inputs` (≥ 2)      | discovery-required | −15   |
| `no-non-functional-requirements` | discovery-required | −10   |
| `unknown-integrations`           | discovery-required | −10   |
| `critical-items-open` (1–2)      | review-required    | −8    |
| `platform-conflict`              | review-required    | −10   |
| `unvalidated-assumptions`        | review-required    | −6    |
| `quality-warnings`               | review-required    | −5    |
| `stale-sections`                 | review-required    | −6    |
| `unreviewed-sections`            | review-required    | −5    |
| `open-questions`                 | review-required    | −4    |
| `open-gaps`                      | review-required    | −4    |
| `missing-input` (exactly 1)      | review-required    | −4    |
| `open-risks`                     | review-required    | −2    |

`execution-candidate` requires every one of the above to be absent.

## 6. Deterministic graph invariants

These are the rules that keep the compiled graph honest. Each is asserted in
`packages/engine/tests/regression.test.ts`.

1. **A release node belongs to its own phase.** A node carrying `anchors.phaseId`
   is bound only to workstreams listed by _that_ phase, and is structurally
   excluded from being a _member_ of any other phase. Before this rule, PH_5
   ("Testing and Hardening") scored on the token "hardening" inside WS_04
   ("Cloud Infrastructure and Hardening"), was absorbed into PH_2, and closed a
   cycle between releases — which forced every official package to `Blocked`.
2. **Readiness is recomputed, never remembered.** `finaliseReadiness` derives
   readiness from the blockers on the node, so an operator's block or rejection is
   re-applied through `blockingStatus` (as an `open-blocker`) instead of decaying
   back to `review-required` on the next compile.
3. **The edge set is final before anything is derived from it.** Operator-added
   edges, removed edges and the rewiring that keeps a split or merge connected are
   applied first; `dependsOn`, the waves, the critical path, the aggregates and the
   structural findings are then recomputed (`recomputeEdges`). This is what makes a
   cycle the operator introduces detectable, and therefore blockable.
4. **A split or merge stands in place of its parent.** The parents are removed and
   their neighbours are read from the pre-removal deterministic edge set, so the
   replacement nodes inherit the parent's upstream and downstream instead of being
   left as orphans beside the plan.
5. **Nothing is invented.** An absent acceptance condition, effort, contract or
   decision stays absent and is reported; the engine creates discovery,
   clarification or approval work rather than a plausible-looking value.

## 7. Compatibility assumptions

- `input.normalized.lines` is **1-indexed** and `source.lineStart` / `lineEnd` are
  inclusive line numbers into it. Quote matching flattens whitespace and is
  case-insensitive, so re-wrapped text still verifies.
- `outputs.<section>.data` is where payloads live; `<section>.status`,
  `.reviewed`, `.staleReasons` and `.meta.scopeVersion` are read for freshness.
- Unknown and future fields are preserved in `raw` and ignored by the normalizer,
  so a newer export still imports.
- `engagementModel` on delivery packages is treated as an upstream hint. It is
  imported and displayed but never used as a classification result.
- A package may omit entire sections. Missing sections degrade the normalized
  model and raise warnings rather than failing the import.
