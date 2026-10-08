# Deal-to-Challenge Graph Engine

A browser-accessible **deal-to-execution compiler**. It imports a deal-scoping
workspace export, preserves the original untouched, normalizes it into a canonical
id-preserving model, validates every reference, and assesses whether the package is
ready to become delivery work — or exactly what is standing in the way.

> Internal planning aid. It never recruits talent, launches a challenge, builds a
> pod, approves funding or commits a delivery timeline.

## Scope

The whole pipeline is implemented: from a raw deal-scoping export through to an
execution-ready plan and the artefacts a delivery team would hand over. Nothing is
stubbed; stages that need operator input say so rather than guessing.

**Shipped**

- Deal package ingestion: four sample packages, drag-and-drop, file picker, paste and
  **ZIP import** (drop `deal-scoping-input-packages.zip` and every package inside is
  unpacked in the browser). No dependency is used for either path — see ADR-013.
- Validation: prototype-safe parsing, shape and identifier checks, dangling and
  name-based reference resolution, quote re-verification, freshness, platform
  conflict, missing estimation inputs, imported quality passthrough.
- Normalization: a canonical model that keeps every source identifier and flags
  synthesized ones.
- Maturity assessment: Execution Candidate / Review Required / Discovery Required /
  Blocked, with every contributing rule and its weight shown.
- Decomposition: package-grounded delivery nodes with source anchors, provenance and
  readiness, plus operator-authored add / split / merge.
- Operating-model classification: a weighted, auditable scorer recommending
  **Flexible Talent**, **Challenge** or **Private Pod**, with the score table and
  rationale for every node and a recorded override path.
- Execution graph: edges and typed dependencies, execution waves, the critical path,
  aggregates, structural findings and a full traceability matrix.
- Change impact: recompiling after an edit proves untouched nodes come back
  byte-for-byte identical and itemises every consequence.
- Quality gate: deterministic **Ready / Review Required / Blocked**, itemised rule by
  rule, and never "Ready" without a recorded human approval.
- Model-specific execution packages: what each of the three models needs, and what is
  still missing before handoff.
- Export: graph JSON, quality JSON, an execution plan in Markdown, per-node packages
  and a ZIP bundle of all of it.
- Append-only decision log: every edit, override, approval, split, merge and AI
  decision is recorded with its rationale.
- AI layer: an `AIProvider` interface with a deterministic mock provider as the
  default. Suggestions are labelled and never applied without a recorded decision.
- Cinematic landing page: a type-only hero on an ambient light field, then the
  delivery graph presented as its own figure. Self-hosted variable fonts (Archivo,
  JetBrains Mono) and no runtime font requests — see ADR-014 and ADR-015.

## Quick start

```bash
bun install
bun run dev          # http://localhost:5173
```

- Landing page: `/`
- Workspace: `/workspace` (also `/workspace?sample=clinical-intake-and-patient-support-assistant`)

Other commands:

```bash
bun test                # engine test suite (123 tests)
bun test --coverage     # same suite with a per-file coverage table
bun tsc -b --noEmit     # typecheck
bun run lint            # eslint
bun run samples         # compile every sample; write samples/{graphs,quality,plans,packages}
bun run check-submission # acceptance harness: import → classify → export → impact
bun run vendor-inputs   # inline samples/inputs/*.json into the engine
```

The deterministic pipeline is fully covered: `packages/engine` reports
**96%+ line and function coverage**, which is where every classification, DAG,
readiness and export decision is made. Nothing in the workflow needs paid AI
access.

### Importing the official ZIP

In the workspace, drop `deal-scoping-input-packages.zip` onto **Bring your own**. The
archive is read in the browser, every `.json` package inside is imported, and the
left rail lists them so you can switch between deals. A `.zip` is detected by
content, not only by extension.

## How it works

```
raw JSON text
  └─ safeParse            prototype-safe parse + duplicate/stripped key report
      └─ normalizePackage canonical model + source index + structural findings
          └─ scanReferences dangling refs, quote verification, reference coverage
              └─ validatePackage validation report + platform conflict
                  └─ assessMaturity maturity level, score and reasons
                      └─ decompose        delivery nodes + anchors + readiness
                          └─ classify     weighted operating-model recommendation
                              └─ buildGraph  edges, waves, critical path, traceability
                                  └─ runQualityGate  Ready | Review Required | Blocked
                                      └─ export  graph JSON · quality JSON · plan · packages · ZIP
```

Everything above runs on one call — `compileDeal(imported, { decisions })` — and
recompiling is deterministic, which is what lets change impact prove that untouched
nodes come back byte-for-byte identical.

The engine is pure TypeScript in the `packages/engine` workspace package (**no React,
DOM, network or Convex imports**), so the same code runs in the browser, in the Bun
CLI (`bun run samples`) and in the test suite without a bundler.

| Path                                    | Contents                                                    |
| --------------------------------------- | ----------------------------------------------------------- |
| `packages/engine/src/canonical/`        | Canonical domain types and execution types                  |
| `packages/engine/src/ingest/`           | Parsing, normalization, validation, maturity, ZIP reader    |
| `packages/engine/src/decompose/`        | Package-grounded delivery-node generation                   |
| `packages/engine/src/classify/`         | The weighted operating-model scorer                         |
| `packages/engine/src/dag/`              | Edges, waves, critical path, aggregates, traceability       |
| `packages/engine/src/impact/`           | Change impact + byte-for-byte preservation proof            |
| `packages/engine/src/quality/`          | The deterministic quality gate                              |
| `packages/engine/src/packages/`         | Model-specific execution packages                           |
| `packages/engine/src/decisions/`        | The append-only decision log                                |
| `packages/engine/src/export/`           | Graph JSON, plan, packages, dependency-free ZIP writer      |
| `packages/engine/src/ai/`               | `AIProvider` interface + deterministic mock provider        |
| `packages/engine/src/compile.ts`        | `compileDeal()` — the single entry point                    |
| `packages/engine/src/samples/`          | The four vendored sample packages                           |
| `src/pages`, `src/components/workspace` | Landing page and the six-workspace UI                       |
| `packages/engine/tests/*.test.ts`       | Engine, export and ZIP test suites                          |
| `scripts/run-all.ts`                    | CLI: compile every sample and write artefacts to `samples/` |
| `scripts/check-submission.ts`           | Acceptance harness over the public interface                |
| `public/fonts/*.woff2`                  | Self-hosted Archivo and JetBrains Mono (SIL OFL 1.1)        |

Docs: [`docs/architecture.md`](docs/architecture.md) (submission diagram) ·
[`docs/gap-analysis.md`](docs/gap-analysis.md) (requirement-by-requirement audit) ·
[`docs/source-to-canonical-mapping.md`](docs/source-to-canonical-mapping.md) ·
[`docs/DECISIONS.md`](docs/DECISIONS.md)

## Mock mode

The workspace header carries a permanent **Mock mode** badge. The default
`AIProvider` is a deterministic `MockProvider`: no network calls, no API key, and the
complete workflow runs offline. Every proposal it returns is schema-validated and
shown as a labelled suggestion — it is never applied without a decision recorded in
the log. A live provider can be swapped in behind the same interface, and every
export states which mode produced it (ADR-005).

## The four sample packages

The official `deal-scoping-input-packages.zip` is not vendored. `samples/inputs/`
holds four exports in the documented shape that carry the same traps as the
originals; `scripts/vendor-inputs.ts` inlines their exact bytes into
`packages/engine/src/samples/inputs.ts` so the browser app, the CLI and the tests all
read the _same_ text.

| Package                                           | Expected maturity  | Exercises                                                               |
| ------------------------------------------------- | ------------------ | ----------------------------------------------------------------------- |
| ClaimsDesk Modernization                          | Review Required    | critical SAP gap, unvalidated assumptions, warn checks                  |
| Clinical Intake and Patient Support Assistant     | Review Required    | AWS-vs-Azure conflict, out-of-scope items, regulated PHI domains        |
| Member Experience Modernisation (early discovery) | Discovery Required | null config, low confidence, nine open gaps/questions, stale anchor     |
| Unified Supply Chain Analytics                    | Review Required    | five integration patterns, six data domains, unresolved dependency name |

No supplied package is ever presented as an Execution Candidate or as `Ready` by the
quality gate. `bun test` and `bun run check-submission` both assert it.

## Known limitations

- The four official deal-scoping packages are vendored byte-for-byte in
  `samples/inputs/` and inlined into `packages/engine/src/samples/inputs.ts`, so
  every import path reads identical bytes with no filesystem or network access.
  The original ZIP is still accepted through the import workspace and the importer
  is schema-tolerant (ADR-004).
- A Flexible Talent or Private Pod package stays incomplete while the package does
  not state a seniority level or a capacity commitment. The engine reports those
  fields as missing rather than inventing them, so such nodes remain
  `review-required` until an operator supplies the value.
- No persistence or sharing: reloading the page clears the imported package and the
  decision log. The tool is a single-operator planning aid with no accounts (ADR-003).
- Classification is a deterministic weighted scorer, not a model judgement. The score
  table and rationale are always shown so an operator can override (FR3).
- `bun run lint` reports warnings only (react-refresh hints in the shadcn primitives
  and `main.tsx`); there are no errors.
- Tests run under Bun and are type-checked by `tsconfig.test.json`, which is part of
  `bun tsc -b --noEmit` (ADR-012).
