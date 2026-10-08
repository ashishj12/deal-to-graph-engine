# Architecture decisions

Append-only log. Each entry records the context, the decision, and what it costs.

---

## ADR-001 — Build inside the Freebuff Vite + React template, not a Turborepo monorepo

**Context.** The challenge specification suggests Bun + Turborepo + Next.js with
`packages/schema`, `packages/importer`, `packages/engine` and so on. The actual
project is a single Vite + React 19 + Tailwind v4 + shadcn/ui application with
Convex available, and the environment's rules take precedence over the generic
stack assumptions in the brief.

**Decision.** Keep the existing app shell, entry point and provider tree. Put the
engine in `src/engine/*` as pure, framework-free TypeScript modules with no
imports from React, the DOM or Convex. Fixtures live in `src/fixtures`. The UI is
a thin shell in `src/components/workspace` and `src/pages`.

**Consequences.** The engine keeps the "framework-free core" property that matters
for testing and reuse, without fighting the platform. There is no workspace
package boundary, so `src/engine` must never import from `src/components` — a
convention rather than a lint rule today.

---

## ADR-002 — Version 1 covers ingestion, validation, normalization and maturity

**Context.** The challenge defines seven functional requirements and six
workspaces. The scope brief asks what version 1 should do _first, according to the
challenge requirements_, and to keep everything else out.

**Decision.** Version 1 implements FR-1 (deal package ingestion and validation)
and FR-2 (source-package maturity assessment), end to end and honestly, plus the
cinematic landing page. Decomposition, classification, DAG, impact, quality gate
and export are explicitly marked "next" in the UI rather than stubbed.

**Consequences.** Everything downstream depends on the import being trustworthy,
so this is the highest-value slice to make genuinely correct. The six-stage
pipeline in the UI distinguishes implemented stages from planned ones so nothing
overstates what exists.

**Superseded by ADR-016.** The slice was the right one to make correct first, and it
was: after it was solid, the rest of the pipeline (decomposition, classification,
DAG, impact, quality gate, packages, export) was built on top of the same trusted
import. The phrase "version 1" in this record means _the first slice_, not the
final scope.

---

## ADR-003 — No authentication

**Context.** The template ships Convex Auth, `/auth` and a protected `/dashboard`.
The scope brief answers "who is using it day to day?" with "just me".

**Decision.** The workspace lives at `/workspace` and is not gated. The operator is
a single person on their own machine. The template's auth routes are left intact
but are not part of the product flow.

**Consequences.** No multi-user features, no per-user persistence, no sharing.
Import data never leaves the browser. If the tool is later shared, persistence and
auth move to Convex and this decision is revisited.

---

## ADR-004 — Ship four representative fixtures instead of the official ZIP

**Context.** The challenge distributes `deal-scoping-input-packages.zip`. It is not
present in the repository and cannot be fetched from here.

**Decision.** `src/fixtures/dealPackages.ts` generates four workspace exports that
reproduce the documented shape and carry the same traps the official packages
carry: an out-of-scope ledger, a cloud-platform conflict, nulled config values,
critical open gaps, unvalidated assumptions, warn-level quality checks and
unreviewed sections. The importer itself is written against the shape, not the
fixtures, so the real ZIP drops in unchanged.

**Consequences.** The importer and maturity engine are exercised against realistic
data, but the exact item counts and identifiers differ from the official files.
Swapping in the real packages must be re-verified; the fixtures are not a claim
about the official contents.

**Updated in ADR-016.** The fixtures now live in `samples/inputs/*.json` and are
vendored into `packages/engine/src/samples/inputs.ts` by
`scripts/vendor-inputs.ts`, so the browser app, the CLI and the tests all read the
same bytes. `bun run check-submission` imports every one of them.

---

## ADR-005 — Deterministic-only engine; mock mode is the only provider

**Context.** The challenge requires an AI layer with a mandatory offline mock mode
and forbids requiring paid AI access.

**Decision.** Version 1 performs no AI calls at all. Decomposition, classification
and rationale generation are not implemented yet (see ADR-002), so there is
nothing for a provider to do. The UI carries a permanent **Mock mode** badge and
the workspace states that every result is produced by deterministic code.

**Consequences.** The full version 1 workflow completes with zero network access,
which is the strongest possible form of the required guarantee. When the AI layer
lands it will be a proposal queue in front of the same deterministic validation,
never an auto-applied step.

**Updated in ADR-016.** The AI layer landed exactly as promised. `packages/engine/src/ai`
defines an `AIProvider` interface with a deterministic `MockProvider` as the default,
and `compileDeal` schema-validates every response, falls back to the deterministic
decomposition when a response is invalid, and records proposals as labelled
suggestions that only take effect once the decision log says the operator accepted
them. No provider is called unless one is configured, so the offline guarantee holds.

---

## ADR-006 — A platform conflict is "Review Required", never auto-resolved

**Context.** The clinical package references AWS in its technology items and a
research-account narrative while the selected platform is Azure, and the change log
records an AWS → Azure decision. Silently "fixing" this would hide a real client
decision.

**Decision.** `detectPlatformConflict` compares `config.cloudPlatform`,
`architecture.platform`, the architecture recommendation, `TECH_*` items, the PRD
narrative and the change log. More than one distinct platform produces a structured
conflict with every claim and its source, a `platform-conflict` finding, and a
maturity penalty. It never modifies the package and never picks a winner.

**Consequences.** The conflict reduces readiness and appears as a blocking decision
node once decomposition exists. A recorded decision (a `user-approved` decision
entry) is the only way to clear it. The claims package is asserted _not_ to report a
false positive.

---

## ADR-007 — Missing configuration is missing, never zero

**Context.** The member-experience package has `expectedUsers`, `deadline`,
`environments` and `targetRegions` null or empty.

**Decision.** Normalization keeps `null` and `[]` as `null` and `[]`. The maturity
engine counts them as missing core inputs and reports them. Nothing is coerced to
`0` and no default is invented.

**Consequences.** A package with unknown volumes can never look sized. This is
asserted by a test. Any future estimate arithmetic must treat `null` explicitly.

---

## ADR-008 — Synthesized identifiers are namespaced and flagged

**Context.** `functionalScope.modules`, `workstreams`, `deliveryPackages`,
`recommendedEnhancements` and `outOfScope` have no `id` field, while
`estimate.result.workstreams` do (`WS_01`). Those are different namespaces.

**Decision.** Id-less groups get a stable synthesized id derived from a slug of
their name: `MOD:`, `WSF:`, `PKG:`, `ENH:`, `EXT:`. Every synthesized record is
marked `synthesized: true`. Imported identifiers are never renumbered and
namespaces are never merged — `INT_01` (a requirement) and `IF_01` (an interface
design) stay distinct.

**Consequences.** Traceability survives the fact that half the functional scope has
no identifiers. Renaming a group upstream changes its synthesized id, which is the
documented trade-off; the original name is always retained on the record.

---

## ADR-009 — Commercial data is ignored, the raw package is preserved

**Context.** `estimationConfig.rates`, cost fields and currency are commercial.

**Decision.** Normalization reads `workstreams[].effortDays` (the only effort
source) and ignores rates and cost. The untouched original is retained in
`ImportedPackage.raw` and `rawText`, and shown in the "Raw source" tab with its
SHA-256.

**Consequences.** The tool can never appear to commit funding. The raw package is
the audit trail for anything the canonical model drops.

---

## ADR-010 — Dark by default via a class on `<html>`

**Context.** The specification asks for a dark control-room aesthetic with light
mode available; the template's tokens default to light.

**Decision.** `<html class="dark">` in `index.html`, with operating-model and status
tokens added to `src/index.css` as a separate `@theme inline` block so the
template's required token block is untouched.

**Consequences.** Body background matches the app. Light mode is still reachable by
removing the class, but no toggle is shipped in version 1.

---

## ADR-011 — Imported text is data, never markup and never instructions

**Context.** Imported titles, descriptions and quotes are attacker-controlled in
the general case.

**Decision.** No `dangerouslySetInnerHTML` anywhere. The raw package renders inside
a `<pre>` as text. Quotes render as text inside blockquotes. Parsing strips
`__proto__` / `constructor` / `prototype` keys before anything touches the object.

**Consequences.** Prompt-injection and XSS payloads inside imported strings are
inert. A test asserts prototype pollution is neutralised and the stripped key is
reported rather than silently dropped.

---

## ADR-012 — Engine tests live outside `src`

**Context.** The application `tsconfig.app.json` includes `src` and is compiled by
the platform's `tsc -b --noEmit` check. `bun:test` types are not installed.

**Decision.** Tests live in `tests/` and run with `bun test`, importing the engine
by relative path. They are outside the app's compiler scope.

**Consequences.** `bun tsc -b --noEmit` stays clean without adding a types package,
and the test suite remains runnable. The cost is that tests are not type-checked by
the same compiler pass as the app.

**Updated in ADR-016.** Once the engine moved to the `packages/engine` workspace
package, the tests moved with it (`packages/engine/tests`) and are now covered by
`tsconfig.test.json` with `"types": ["bun"]`. `bun tsc -b --noEmit` still stays
clean, and the tests are type-checked after all.

---

## ADR-013 — A dependency-free ZIP reader instead of a zip library

**Context.** The challenge distributes the four input packages inside
`deal-scoping-input-packages.zip`. Making the operator extract files by hand is a
poor first impression, but the project has no zip dependency and adding one for a
single read path is hard to justify.

**Decision.** `src/engine/zip.ts` reads archives directly: it locates the End Of
Central Directory record, walks the central directory, then inflates deflate entries
with the platform's native `DecompressionStream("deflate-raw")`. Stored entries are
copied verbatim. Entry count (`512`) and total uncompressed size (`96 MB`) are
capped so a zip bomb cannot exhaust memory, and unsupported methods or ZIP64 are
reported rather than guessed at.

Reading the **central directory** rather than walking local headers is deliberate:
archives written with streaming data descriptors (macOS, Windows Explorer, Java)
only carry reliable sizes and offsets there.

**Consequences.** No new runtime dependency, and the reader works in the browser and
in Bun alike. The test suite validates it against a real Info-ZIP archive plus a
truncated archive, an empty file and non-zip data. Cost: encrypted and ZIP64
archives are rejected with a clear message instead of supported.

---

## ADR-014 — Self-hosted variable fonts and a schematic art direction

**Context.** The first UI pass read as generated: uniform rounded cards, three-up
grids, a violet accent and a soft gradient wash. The brief's references (Preymaker,
Atmos, Olympic, Visuvate) share a different discipline — full-bleed near-black
canvases, oversized uppercase display type paired with tiny mono labels, instrument
readouts, numbered editorial sections and thin tabular index rows.

**Decision.** Two OFL-licensed variable fonts (Archivo for display and UI, JetBrains
Mono for identifiers and metrics) are self-hosted in `public/fonts` and declared via
`@font-face`, so there is no runtime font request and the repo stays self-contained.
The palette is a cool near-black with a bone foreground; the three operating-model
hues are desaturated so they read as marks rather than fills. Corners are square,
shadows are removed globally through `[data-slot="card"]`, and the hero graphic is
drawn as an engineering schematic — orthogonal routing, construction guides, a scale
rule and a title block.

Localizing the two woff2 files is the only network use in the build; the app itself
makes none. Licence: Archivo and JetBrains Mono are both SIL OFL 1.1.

**Consequences.** The type system and surface treatment are now consistent across the
landing page and the workspace, and the UI depends on no external asset host. The
cost is ~75 KB of committed font binaries and a design system that must be maintained
by hand rather than inherited from shadcn defaults.

---

## ADR-015 — The hero is a film frame, the diagram is a figure

**Context.** Review feedback on ADR-014's result: the hero read as _a diagram with text
above it_, and the UI as a whole felt strained to look at. The causes were specific
rather than vague — a blueprint grid sitting behind the headline, a schematic competing
with the type for attention in the same viewport, 9–10 px mono labels at 0.12–0.28em
tracking on every surface, and five saturated accent hues in play at once.

**Decision.**

1. **Separate the two.** The hero is type-only: an asymmetric, left-aligned column on a
   near-empty frame. The schematic keeps its detail but moves to its own section below
   (`Figure 01`), where it has space and nothing to fight with.
2. **Light instead of grid.** `aurora` (two soft light pools plus a floor wash),
   `vignette` and `grain` (an inline SVG `feTurbulence` at `soft-light`) replace the
   technical grid. `animate-aurora` drifts the light over 28 s, and is disabled under
   `prefers-reduced-motion`.
3. **Fewer, calmer labels.** The `.label` utility goes to 11 px / 0.1em, and the
   workspace's inline mono labels follow it. The redundant "mock mode" pair on the
   figure was dropped to a single caption; section openers are one label, one headline,
   one lede.
4. **Fewer hues.** The operating-model and status hues lose chroma so they read as
   marks, not fills. The `blueprint` and `edge-fade-b` utilities were deleted as dead
   code once nothing referenced them.
5. **Editorial rows over card grids.** The three operating models become full-width rows
   with a coloured left rule instead of a three-up grid of boxes.

**Consequences.** The landing page reads as a sequence of frames (hero → figure →
sections) rather than a dashboard, and the workspace is legible at a glance. Two costs:
the ambient animation is pure decoration and must stay cheap (it is one composited
transform on a single element), and the model hues are now slightly harder to tell apart
in isolation — they are always accompanied by a text name, so this is acceptable.

**Note.** Custom `@utility` names must match the class used in JSX exactly. `animate-aurora`
is deliberately in Tailwind's `animate-*` namespace; an earlier `aurora-drift` utility
silently emitted no CSS because nothing referenced that name.

---

## ADR-016 — The engine is a workspace package and the whole pipeline is in scope

**Context.** ADR-001 put the engine in `src/engine` to avoid fighting the template.
ADR-002 scoped the first slice to ingestion and maturity. Both were right at the
time, but the engine outgrew a single folder and the remaining functional
requirements had to be built on the now-trusted import.

**Decision.** The engine became the `packages/engine` workspace package
(`@deal-to-challenge/engine`), still pure TypeScript with no React, DOM, network or
Convex imports, and still the same code that runs in the browser, the CLI and the
tests. It now implements the full pipeline: ingest → decompose → classify →
packages → dag → impact → quality → decisions → export → ai. A single entry point,
`compileDeal(imported, { decisions })`, produces everything the UI and the exports
need, and recompiling is deterministic. Tests moved to `packages/engine/tests` and
are type-checked by `tsconfig.test.json` (`"types": ["bun"]`), which `tsc -b`
already references.

**Consequences.** The engine keeps its framework-free core and gains a real package
boundary. The cost is one more workspace for `bun install` to resolve, and the
package must keep its `exports` map in step with its public surface (`./` and
`./samples`).

---

## ADR-017 — One compiler, six workspaces, and an append-only decision log

**Context.** The challenge describes six workspaces over the same graph, and FR-3
and FR-4 require every operator action to be inspectable and reversible.

**Decision.** The UI is a thin shell (`src/pages/Workspace.tsx`) over six
presentation-only views: Import, Decomposition, Graph, Execution plan, Packages, and
Validate & export. The shell owns the imported packages and the decision log; the
views never hold domain state. Every edit, override, approval, rejection, split,
merge, dependency change and AI decision is appended to a log that is never
rewritten, and recompiling replays the log over the deterministic baseline. AI output
is a _suggestion_ in the log's vocabulary, not an applied change.

**Consequences.** The graph can always explain itself, and the change-impact report
can prove untouched nodes are byte-for-byte identical. The cost is that the shell is
the largest file in the app and the decision log is the single source of operator
intent, so its shape is load-bearing and must be versioned with the exports.

---

## ADR-018 — An acceptance harness verifies artefacts, not just units

**Context.** A green unit suite says the functions behave; it does not say the
delivered artefacts are correct through the interface a reviewer actually uses.

**Decision.** `scripts/check-submission.ts` (`bun run check-submission`) drives the
public interface end to end: it imports all four packages, checks maturity,
classification coverage, recompile determinism, model mix, the quality gate, the
exports (graph JSON, quality JSON, plan, packages), a real ZIP bundle round-trip, and
a change-impact edit that must preserve untouched nodes. It exits non-zero on the
first failed check so it can gate a submission.

**Consequences.** The release check is the same code path the workspace and the CLI
use, so a passing harness means the artefacts are correct, not merely that the
functions are. The cost is a second place to maintain when the public API changes;
it is deliberately kept to assertions about the public surface only.
