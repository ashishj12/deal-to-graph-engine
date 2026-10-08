# Submission Architecture

The nine components the challenge asks the diagram to show, in the order data
flows through them, plus the human-decision path that feeds back in.

## Diagram

```mermaid
flowchart TB
    F["Official JSON packages<br/>4 files, unmodified"]

    V["1. Input validation<br/>structure · ids · duplicates · dangling refs"]
    N["2. Package normalization<br/>schema drift → canonical shape"]
    C["3. Canonical model<br/>deal · scope · architecture · strategy · delivery · quality"]

    M["Package maturity assessment<br/>Execution Candidate / Review Required /<br/>Discovery Required / Blocked"]

    O["4. AI orchestration<br/>provider interface: mock ⇄ live"]

    D["5. Delivery decomposition<br/>grounded execution nodes"]
    CL["6. Operating-model classifier<br/>flexible-talent · challenge · private-pod<br/>rationale · confidence · alternatives"]

    G["7. DAG engine<br/>edges · waves · critical path · aggregates"]
    I["8. Change-impact engine<br/>affected vs preserved · wave & path deltas"]
    Q["9. Quality gate<br/>13 checks → Ready / Review Required / Blocked"]

    E["Export layer<br/>graph JSON · execution plan ·<br/>3 model packages · traceability"]

    MP["Mock provider<br/>deterministic-rules · no paid AI"]

    H(("Human decisions<br/>split · merge · override ·<br/>block · approve"))

    F --> V --> N --> C --> M --> O
    O --> D --> CL --> G --> I --> Q --> E
    MP -.-> O
    H -.-> O
    C -.-> D
    H -.-> G
    G -.-> I
```

## Component notes

- **Input validation** (`ingest/validate.ts`) reports structure, duplicate and
  dangling identifiers, stale sections and conflicts. It never throws away the
  original: the imported package is preserved separately from the normalized
  model, as the spec requires.
- **Normalization** (`ingest/normalize.ts`) maps the workspace-export shape onto
  the canonical model, preserving every source id. Mapping rules are documented
  in [source-to-canonical-mapping.md](./source-to-canonical-mapping.md).
- **AI orchestration** (`ai/`) is a provider interface. The mock provider is
  deterministic rules, so the complete workflow for all four packages runs with
  no paid access.
- **Decomposition and classification** (`decompose/`, `classify/`) produce
  grounded nodes with exactly one primary model, a plain-language rationale,
  confidence, alternatives and override history.
- **DAG engine** (`dag/`) derives edges, waves, critical path and aggregates as
  a pure function of nodes + package + revision, so recompiling after an edit
  reproduces untouched nodes byte-for-byte.
- **Change impact** (`diffGraphs`) and the **quality gate** (`validate`) run
  after every edit; operator decisions are part of the input, never discarded.
- **Export** writes machine-readable graph JSON, a human-readable plan, the
  three model-specific packages and the traceability matrix.

## Package layout

```
packages/engine   all deterministic logic + mock AI (96% covered by tests)
src/              React workspace UI (6 sections)
samples/          the four official packages + generated sample outputs
scripts/          check-submission, sample generation, submission checks
docs/             this file, gap analysis, mapping rules, decisions
```
