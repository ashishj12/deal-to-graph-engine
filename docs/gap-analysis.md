# Requirement Gap Analysis

A clause-by-clause audit of the challenge specification against this repository,
written the way a reviewer will read it: what was asked, what the code does, and
where the evidence lives. Everything marked **Fixed** was a real defect found
during the audit, not a cosmetic change.

## Method

1. Every functional requirement and evaluation-criteria line was traced to the
   module that implements it and to a test that fails if it regresses.
2. All four official packages were imported end-to-end and their outputs
   asserted (`samples/`, `scripts/check-submission.ts`).
3. Coverage was measured on the engine, which is where all deterministic logic
   lives (`bun run test:coverage`).

---

## 1. Input Validation and Normalization (15%)

| Requirement                                     | Status | Evidence                                                                                   |
| ----------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| Import all four supplied packages directly      | Pass   | `scripts/check-submission.ts` compiles all four from `samples/` with no manual conversion  |
| Source-ID preservation                          | Pass   | `tests/regression.test.ts` asserts every imported id survives normalization verbatim       |
| Reference validation (duplicate / dangling ids) | Pass   | `ingest/validate.ts` → `findings.danglingReferences`, `duplicateIds`                       |
| Package-maturity assessment (4 levels)          | Pass   | `ingest/maturity.ts`: Execution Candidate / Review Required / Discovery Required / Blocked |
| Missing information reported, never invented    | Pass   | `missingInputs` becomes clarification nodes; nulls stay null                               |

### Fixed during audit

- **`customer.name` → `Unnamed customer`.** The official packages use
  `customer.customerName`. The app showed a placeholder for all four. Now reads
  both ([normalize.ts](../packages/engine/src/ingest/normalize.ts)).
- **`outOfScope[]` collapsed to an anonymous placeholder.** The official shape is
  `{ text, refs, label }`, not `{ name, requirementIds }`. Exclusions lost their
  wording and their traceability. Now read correctly.
- **External flow endpoints reported as invalid.** Architecture flows address
  external systems as `ext:<id>:<name>`; the validator only knew internal
  components, so legitimate integrations were flagged `invalid`. Endpoints now
  resolve against integrations and scope items; only genuinely unresolvable
  endpoints are reported.
- **`roles` / `skills` dropped from estimate workstreams.** Upstream writes
  records (`{ roleId, label, days, dayRate, cost }`), code expected strings, so
  every node lost its role and skill grounding. Both shapes supported, `label`
  preferred for human-readable output.
- **`missingInputs` lost its prose.** Read as strings only; official packages
  send `{ key, label, effect, affected, howToResolve }`. Each entry now becomes
  a readable clarification node carrying the `howToResolve` guidance.
- **Capability `acceptance[]` and `scope` ignored.** Acceptance conditions the
  importer had already reviewed were discarded, then the engine reported nodes
  `missing-acceptance`. Now the only acceptance conditions the engine may attach
  without a human decision are exactly these imported ones.

## 2. Source-Package Maturity Assessment

Pass. Critical questions, unconfirmed assumptions, missing contracts and estimate
confidence all reduce readiness. An incomplete package can never present as
Execution Candidate when a blocking gap exists.

**Fixed — the critical defect:** every one of the four official packages
compiled to `Blocked` because release nodes were absorbed into the wrong phase,
closing a cycle between releases. Root cause and fix are documented in
[source-to-canonical-mapping.md § 6](./source-to-canonical-mapping.md). All four
now compile to a defensible maturity with zero structural cycles.

## 3. Delivery Node Generation (20%)

| Requirement                                                          | Status | Evidence                                                         |
| -------------------------------------------------------------------- | ------ | ---------------------------------------------------------------- |
| 13 work categories                                                   | Pass   | `canonical/execution.ts` `WorkCategory`                          |
| Full node field set (id, objective, effort, provenance, readiness …) | Pass   | `canonical/execution.ts` `ExecutionNode`                         |
| Edit / add / remove / split / merge                                  | Pass   | `compile.ts` decision log; `tests/regression.test.ts`            |
| Approve / reject AI nodes                                            | Pass   | decision `approve-node` / `reject-node`                          |
| Mark blocked / review-required                                       | Pass   | decision `set-blocked`; survives recompilation (see below)       |
| Grounded in imported info or an approved decision                    | Pass   | `readinessBlockers` includes `unsupported` for source-less nodes |

### Fixed during audit

- **Split produced orphans.** The parent was removed before its edges were
  rewired, so both halves landed with zero dependencies — invisible to waves and
  the critical path. Neighbours are now read from the pre-removal edge set, so
  replacements inherit the parent's upstream and downstream.
- **Merge produced orphans** — same defect, same fix.
- **User decisions silently discarded on recompile.** `finaliseReadiness`
  recomputed readiness from scratch, so an operator's block or rejection decayed
  back to `review-required` after the next compile. A block now re-applies as an
  `open-blocker`.
- **Contradictory rationale text.** Nodes classified `challenge` led with "not
  naturally separable into an independently judgeable submission" — the opposite
  of the classification. Rewritten to argue from the actual signal.

## 4. Operating-Model Classification and Packages (20%)

| Requirement                                      | Status | Evidence                                                             |
| ------------------------------------------------ | ------ | -------------------------------------------------------------------- |
| Exactly one primary model per executable node    | Pass   | `tests/regression.test.ts` invariant over all four graphs            |
| Rationale present, in plain language             | Pass   | `missing-rationale` blocker; rationale asserted non-empty            |
| Confidence + alternatives + override history     | Pass   | `operatingModel.{confidence,alternatives,overrideHistory}`           |
| Mixed-model graphs, no Challenge-only assumption | Pass   | all four packages exercise 2–3 models; `operatingModelSummary.mixed` |
| Split recommended when work straddles models     | Pass   | `splitRecommended` + `splitReason`                                   |
| Three distinct package shapes                    | Pass   | `decompose/package.ts`; sample outputs include one of each           |

**Fixed:** role/skill normalization (above) meant Flexible Talent packages
previously had no `requiredRoles` — the single most important field for that
model. They now do.

## 5. DAG Construction (15%)

| Requirement                                                                | Status | Evidence                                          |
| -------------------------------------------------------------------------- | ------ | ------------------------------------------------- |
| Edge carries source, target, type, rationale, sourceIds, blocking, handoff | Pass   | `dag/edges.ts` `GraphEdge`                        |
| Cycles, orphans, self-deps, duplicate/invalid edges detected               | Pass   | `dag/validate.ts` → `graph.findings`              |
| Waves, critical path, earliest start, aggregates                           | Pass   | `dag/analysis.ts`                                 |
| Model distribution by wave                                                 | Pass   | `waves[].operatingModelSummary`                   |
| Cycle ⇒ graph not ready                                                    | Pass   | `cycle` finding blocks readiness                  |
| Every dependency has a rationale                                           | Pass   | `edges.ts` derives rationale from source evidence |

### Fixed during audit

- **User-added edges were evaluated too late.** Edges appended by the operator
  were added _after_ `buildGraph` computed findings, waves and the critical
  path. A cycle the user introduced went undetected, and the schedule described
  a graph that no longer existed. `recomputeEdges` now rebuilds `dependsOn`,
  waves, critical path, aggregates and structural findings from the final edge
  set — so a user's cycle is caught and blocks readiness.

## 6. Change Impact and Quality Validation (10%)

Pass. `diffGraphs` reports affected/unaffected nodes, changed dependencies,
invalidated packages, wave and critical-path changes, and effort deltas;
`preservedExactly` proves untouched nodes are byte-identical. Quality gate
covers all thirteen specified checks with Ready / Review Required / Blocked.

## 7. Execution Plan and Export (10%)

Pass. Graph JSON, human-readable plan, traceability matrix and per-model
packages export with node ids, source ids, rationales, waves, critical path,
findings and readiness. Blocked nodes are labelled not-ready in every artefact.

## 8. UX and Visual Design (5%)

Six workspaces as specified, DAG canvas with model/blocked/critical-path
styling, per-node rationale and override controls.

### Fixed during audit

- **`samples/index.ts` still read `customer.name`**, so the in-app deal summary
  would show "unknown customer" for every official package even after the
  normalizer was fixed.
- **README and `.env.example` were leftover Convex boilerplate** from a
  different project — scaffold markers, Convex/Recharts/React-Hook-Form
  instructions for packages that were never dependencies. README rewritten to
  the required sections; `.env.example` now describes what the app actually
  reads.
- **`vite.config.ts` referenced non-existent packages** and produced an empty
  `forms` chunk. Restricted to installed, used dependencies.
- Browser verification: zero console errors, no layout overflow, all four
  packages load with correct counts.

## 9. Code Quality and Documentation (5%)

- **Coverage: 96.16% functions / 95.76% lines** on the engine — above the 90%
  target. Weak files found by measurement were lifted with regression tests
  (`compile.ts` 64% → 99%, `ai/mock.ts` 57% → 100%, `canonical/provenance.ts`
  25% → 100%, `decisions` 85% → 100%, `ingest/ids.ts` 71% → higher).
- 123 tests, typecheck clean, lint 0 errors, production build passes.
- Mock mode: the whole workflow runs on `deterministic-rules`, no paid AI.

---

## Remaining Known Limitations

Stated honestly, per the spec's own instruction not to invent:

1. Sample outputs in `samples/` are generated by the deterministic pipeline;
   re-run `bun run samples` after any rule change so they stay in sync.
2. Effort aggregation is plan-level (person-days summed from imported
   estimates); it does not model resource levelling or calendar dates.
3. The importer accepts the official workspace-export shape. Deeply nested
   unknown sections are preserved in the raw payload but not surfaced as
   first-class nodes.
4. No authentication — explicitly optional in the spec, and the app is a local
   planning tool.
