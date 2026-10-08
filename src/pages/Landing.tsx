import { BlueprintGraph } from "@/components/landing/BlueprintGraph";
import { Button } from "@/components/ui/button";
import { SAMPLE_PACKAGES } from "@deal-to-challenge/engine/samples";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";

/* ------------------------------------------------------------------ */
/* Content                                                              */
/* ------------------------------------------------------------------ */

const NAV: [string, string][] = [
  ["Pipeline", "#pipeline"],
  ["Models", "#models"],
  ["Evidence", "#evidence"],
  ["Method", "#method"],
];

/** The six workspaces, in order, each with the artefact it emits. */
const STAGES = [
  {
    index: "01",
    name: "Import",
    detail: "Read the export, freeze the original beside it, and check every reference, quote and identifier.",
    emits: "validated package",
  },
  {
    index: "02",
    name: "Decomposition",
    detail: "Turn grounded source items into delivery nodes you can edit, split, merge or drop.",
    emits: "delivery nodes",
  },
  {
    index: "03",
    name: "Graph",
    detail: "Wire the dependencies and surface what breaks the graph: cycles, orphans, blocked nodes.",
    emits: "edges · waves",
  },
  {
    index: "04",
    name: "Execution plan",
    detail: "Order the work into waves against real effort, and mark the critical path through it.",
    emits: "execution-plan.md",
  },
  {
    index: "05",
    name: "Packages",
    detail: "Draft what is missing for each node's operating model, and show what still has to be supplied.",
    emits: "model packages",
  },
  {
    index: "06",
    name: "Validate & export",
    detail: "Run the quality gate, itemise the change impact, and export the traceable bundle.",
    emits: "bundle.zip",
  },
];

const MODELS = [
  {
    key: "flexible-talent",
    name: "Flexible Talent",
    color: "var(--model-flexible)",
    summary: "Named specialists, matched to skills you can already describe.",
    criteria: ["Skills and roles already known", "Assignable to specific individuals", "No exploration needed to choose an approach"],
  },
  {
    key: "challenge",
    name: "Challenge",
    color: "var(--model-challenge)",
    summary: "Open participation, several credible approaches, comparable outcomes.",
    criteria: ["Alternatives add genuine value", "Evaluation criteria can be written up front", "Packages independently of the rest"],
  },
  {
    key: "private-pod",
    name: "Private Pod",
    color: "var(--model-pod)",
    summary: "A coordinated, vetted team owning one coupled, sensitive area.",
    criteria: ["Several roles must work as one", "Architecture and build are coupled", "Restricted access applies"],
  },
];

const METHOD = [
  {
    index: "i",
    title: "Everything is source-traceable",
    body: "No node reaches the graph without an imported identifier behind it. Synthesized ids are namespaced and flagged, never blended in.",
  },
  {
    index: "ii",
    title: "Nothing missing is invented",
    body: "Absent volumes, deadlines and environments stay absent. They lower readiness and surface as blockers, not as plausible prose.",
  },
  {
    index: "iii",
    title: "Conflicts are reported, not resolved",
    body: "When the config, the architecture and the change log disagree about a platform, the engine shows all three claims and waits.",
  },
  {
    index: "iv",
    title: "The calculation is on screen",
    body: "Coverage, weights, waves and readiness are computed deterministically and shown next to the inputs they came from.",
  },
];

function buildVitals() {
  const rows = SAMPLE_PACKAGES.map((deal) => {
    const items = (deal.json as { scope: { items: { critical?: boolean; inScope?: boolean }[] } }).scope.items;
    return {
      id: deal.id,
      title: deal.title,
      fileName: deal.fileName,
      scenario: deal.character,
      expected: deal.expectedMaturity,
      items: items.length,
      critical: items.filter((item) => item.critical && item.inScope !== false).length,
    };
  });
  return {
    rows,
    totals: {
      packages: rows.length,
      items: rows.reduce((sum, row) => sum + row.items, 0),
      critical: rows.reduce((sum, row) => sum + row.critical, 0),
    },
  };
}

/* ------------------------------------------------------------------ */
/* Primitives                                                           */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 0.84, 0.28, 1] as const;

function MaskLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={reduced ? undefined : { y: "112%" }}
        animate={reduced ? undefined : { y: "0%" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? undefined : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Section opener. One label, one headline, one lede — nothing else competes. */
function SectionIntro({
  index,
  label,
  title,
  lede,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  lede?: string;
}) {
  return (
    <Reveal className="max-w-4xl">
      <p className="label">
        {index} — {label}
      </p>
      <h2 className="mt-7 text-balance text-[clamp(1.75rem,3.8vw,3.3rem)] leading-[1.02] font-[600] tracking-[-0.03em] uppercase sm:mt-8">
        {title}
      </h2>
      {lede && (
        <p className="mt-6 max-w-[58ch] text-pretty text-[15px] leading-8 text-muted-foreground sm:mt-7 sm:text-[16px]">
          {lede}
        </p>
      )}
    </Reveal>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-hairline pt-5 sm:pt-6">
      <div className="font-mono-data text-[clamp(1.35rem,2.4vw,2rem)] leading-none tabular-nums">{value}</div>
      <div className="label mt-3 sm:mt-4">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function Landing() {
  const vitals = useMemo(() => buildVitals(), []);
  const figureRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: figureRef,
    offset: ["start end", "end start"],
  });
  const figureY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape closes the mobile menu; the panel is the only thing that traps focus.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* ---------------- header ---------------- */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-10">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <span className="flex size-6 items-center justify-center border border-rule-strong">
              <span className="size-1.5 bg-signal" />
            </span>
            <span className="font-mono-data text-[11px] tracking-[0.14em] uppercase">
              Deal<span className="text-muted-foreground">→</span>Challenge
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map(([text, href]) => (
              <a
                key={href}
                href={href}
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {text}
              </a>
            ))}
          </nav>

          <Link
            to="/workspace"
            className="group hidden items-center gap-2 border border-rule-strong px-4 py-2 text-[12px] tracking-[0.02em] transition-colors hover:border-foreground hover:bg-foreground hover:text-background md:inline-flex"
          >
            Open workspace
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-9 place-items-center border border-rule-strong text-foreground md:hidden"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              key="menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="overflow-hidden border-t border-hairline bg-background/95 backdrop-blur-xl md:hidden"
            >
              <nav className="mx-auto flex w-full max-w-[1320px] flex-col px-5 sm:px-10">
                {NAV.map(([text, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between border-b border-hairline py-4 text-[15px] text-foreground"
                  >
                    {text}
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                  </a>
                ))}
                <Link
                  to="/workspace"
                  onClick={() => setMenuOpen(false)}
                  className="my-5 inline-flex items-center justify-between border border-rule-strong px-4 py-3 text-[13px]"
                >
                  Open workspace
                  <ArrowUpRight className="size-4" />
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ---------------- hero: type, light and air ---------------- */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 sm:pt-28">
        {/* Cinematic backdrop: two soft light pools, a vignette and film grain. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="aurora animate-aurora absolute -inset-[18%]" />
          <div className="vignette absolute inset-0" />
          <div className="grain absolute inset-0 opacity-[0.35]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1320px] flex-1 items-center px-5 py-14 sm:px-10 sm:py-16">
          <div className="max-w-[58rem]">
            <Reveal>
              <p className="label">Deal-to-Challenge Graph Engine</p>
            </Reveal>

            <h1 className="mt-8 text-balance text-[clamp(2.05rem,7vw,6.2rem)] leading-[0.95] font-[600] tracking-[-0.035em] uppercase sm:mt-9">
              <MaskLine delay={0.15}>A reviewed solution</MaskLine>
              <MaskLine delay={0.28}>is not yet</MaskLine>
              <MaskLine delay={0.41}>
                <span className="text-signal">an execution plan.</span>
              </MaskLine>
            </h1>

            <Reveal delay={0.62}>
              <p className="mt-9 max-w-[46ch] text-pretty text-[16px] leading-8 text-muted-foreground sm:mt-10 sm:text-[17px]">
                Point it at a deal-scoping export and it returns the work behind it: delivery nodes
                traced back to their source lines, each one routed to Flexible Talent, a Challenge or
                a Private Pod — and every open question that has to be settled first.
              </p>
            </Reveal>

            <Reveal delay={0.74}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 sm:mt-11">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/workspace">
                    Open the workspace
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
                <Link
                  to="/workspace?sample=clinical-intake-and-patient-support-assistant"
                  className="text-[13px] text-muted-foreground underline decoration-hairline underline-offset-[6px] transition-colors hover:text-foreground"
                >
                  or open the clinical intake package
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Hero rail: orientation without noise. */}
        <Reveal delay={0.9} className="relative">
          <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-10">
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-t border-hairline py-6 sm:gap-x-12 sm:py-7">
              <span className="label inline-flex items-center gap-2.5">
                <motion.span
                  animate={reduced ? undefined : { y: [0, 3, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex"
                >
                  <ArrowDown className="size-3" />
                </motion.span>
                Scroll
              </span>
              <ul className="flex flex-wrap items-center gap-x-7 gap-y-3 sm:gap-x-9">
                {MODELS.map((model) => (
                  <li key={model.key} className="label flex items-center gap-2.5">
                    <span className="size-1.5" style={{ background: model.color }} />
                    {model.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- figure: the graph gets its own space ---------------- */}
      <section ref={figureRef} className="relative border-t border-hairline">
        <div className="mx-auto w-full max-w-[1320px] px-5 pt-24 sm:px-10 sm:pt-40">
          <Reveal>
            <p className="label">Figure 01 — Illustrative delivery graph</p>
          </Reveal>

          {/* Below `sm` the drawing keeps a legible minimum width and pans, rather
              than shrinking 9px labels into the ground. */}
          <motion.div style={reduced ? undefined : { y: figureY }} className="mt-12 sm:mt-16">
            <div className="-mx-5 overflow-x-auto px-5 pb-3 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
              <div className="min-w-[720px] sm:min-w-0">
                <BlueprintGraph />
              </div>
            </div>
            <p className="label mt-5 sm:hidden">Drag to pan the drawing</p>
          </motion.div>

          <Reveal delay={0.1}>
            <p className="mt-16 max-w-[64ch] text-pretty text-[14px] leading-8 text-muted-foreground sm:mt-20 sm:text-[15px]">
              Drawn, not generated. This is what the workspace emits for a package: nodes held down by
              their source records, one operating model each, and the critical path marked straight
              through the dependency graph.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 sm:mt-20 sm:grid-cols-4 sm:gap-y-12 sm:pb-40">
              <Stat value={String(vitals.totals.packages)} label="Packages in the set" />
              <Stat value={String(vitals.totals.items)} label="Source items" />
              <Stat value={String(vitals.totals.critical)} label="Critical open" />
              <Stat value="3" label="Operating models" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- pipeline ---------------- */}
      <section id="pipeline" className="scroll-mt-20 border-t border-hairline">
        <div className="mx-auto w-full max-w-[1320px] px-5 py-24 sm:px-10 sm:py-40">
          <SectionIntro
            index="01"
            label="Pipeline"
            title={
              <>
                Six stages.
                <br />
                <span className="text-muted-foreground">One compile.</span>
              </>
            }
            lede="Everything runs off a single pass over the package, and the import comes first on purpose: every node, model and finding downstream is only as trustworthy as the source behind it."
          />

          <div className="mt-16 max-w-3xl sm:mt-20">
            {STAGES.map((stage, position) => (
              <Reveal key={stage.index} delay={position * 0.05}>
                <div className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 border-b border-hairline py-7 first:border-t sm:grid-cols-[auto_1fr_auto] sm:gap-x-10 sm:py-8">
                  <span className="pt-0.5 font-mono-data text-[11px] text-muted-foreground/60 transition-colors group-hover:text-signal">
                    {stage.index}
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[16px] font-[600] tracking-[-0.01em] uppercase sm:text-[17px]">
                      {stage.name}
                    </span>
                    <span className="mt-2.5 block max-w-xl text-pretty text-[13px] leading-7 text-muted-foreground sm:mt-3 sm:text-[14px]">
                      {stage.detail}
                    </span>
                  </div>
                  <span className="col-start-2 self-start font-mono-data text-[11px] text-muted-foreground/45 lowercase sm:col-start-3 sm:pt-0.5">
                    {stage.emits}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- models ---------------- */}
      <section id="models" className="scroll-mt-20 border-t border-hairline">
        <div className="mx-auto w-full max-w-[1320px] px-5 py-24 sm:px-10 sm:py-40">
          <SectionIntro
            index="02"
            label="Operating models"
            title={
              <>
                Not every unit of work
                <br />
                <span className="text-muted-foreground">should become a challenge.</span>
              </>
            }
            lede="Every node is scored against all three models and comes out with exactly one primary recommendation, with the weights and the rationale attached so a reviewer can push back."
          />

          <div className="mt-16 border-t border-hairline sm:mt-20">
            {MODELS.map((model, position) => (
              <Reveal key={model.key} delay={position * 0.06}>
                <div className="grid gap-7 border-b border-hairline py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
                  <div className="border-l-2 pl-6 sm:pl-7 lg:col-span-5" style={{ borderColor: model.color }}>
                    <h3
                      className="text-[18px] leading-tight font-[600] tracking-[-0.01em] uppercase sm:text-[19px]"
                      style={{ color: model.color }}
                    >
                      {model.name}
                    </h3>
                    <p className="mt-4 max-w-[34ch] text-pretty text-[14px] leading-7 text-muted-foreground sm:mt-5">
                      {model.summary}
                    </p>
                  </div>

                  <ul className="space-y-4 lg:col-span-6 lg:col-start-7 lg:space-y-5">
                    {model.criteria.map((criterion) => (
                      <li key={criterion} className="flex items-baseline gap-4 sm:gap-5">
                        <span className="h-px w-4 shrink-0 translate-y-[-0.3em] bg-rule-strong" />
                        <span className="text-[14px] leading-7 text-muted-foreground">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- evidence ---------------- */}
      <section id="evidence" className="scroll-mt-20 border-t border-hairline">
        <div className="mx-auto w-full max-w-[1320px] px-5 py-24 sm:px-10 sm:py-40">
          <SectionIntro
            index="03"
            label="Input evidence"
            title={
              <>
                Four packages,
                <br />
                <span className="text-muted-foreground">four different verdicts.</span>
              </>
            }
            lede="A claims platform modernisation, an AI clinical assistant, a member-experience programme still in discovery, and a supply-chain analytics build. None of them clears the gate as Ready, and each one is held up by something different."
          />

          <Reveal delay={0.12}>
            <div className="mt-16 max-w-4xl sm:mt-20">
              {vitals.rows.map((row) => (
                <Link
                  key={row.id}
                  to={`/workspace?sample=${row.id}`}
                  className="group block border-b border-hairline py-8 transition-colors first:border-t hover:bg-surface-raise/40 sm:py-9"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
                    <span className="text-[16px] font-[600] tracking-[-0.01em] transition-colors group-hover:text-signal sm:text-[17px]">
                      {row.title}
                    </span>
                    <span
                      className={`label ${
                        row.expected === "discovery-required"
                          ? "text-model-pod"
                          : row.expected === "blocked"
                            ? "text-blocked"
                            : "text-review"
                      }`}
                    >
                      {row.expected.replace(/-/g, " ")}
                    </span>
                  </div>
                  <p className="mt-3.5 max-w-2xl text-pretty text-[14px] leading-7 text-muted-foreground sm:mt-4">
                    {row.scenario}
                  </p>
                  <p className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono-data text-[11px] text-muted-foreground/60 sm:mt-4">
                    <span>{row.fileName}</span>
                    <span aria-hidden>·</span>
                    <span>{row.items} items</span>
                    <span aria-hidden>·</span>
                    <span>{row.critical > 0 ? `${row.critical} critical` : "no critical items"}</span>
                    <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                  </p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- method ---------------- */}
      <section id="method" className="scroll-mt-20 border-t border-hairline">
        <div className="mx-auto w-full max-w-[1320px] px-5 py-24 sm:px-10 sm:py-40">
          <SectionIntro
            index="04"
            label="Method"
            title={
              <>
                Deterministic
                <br />
                <span className="text-muted-foreground">by construction.</span>
              </>
            }
            lede="The same package and the same decisions produce byte-identical output. That is what lets change impact prove an edit stayed local — and why AI is optional, labelled and never auto-applied."
          />

          <div className="mt-16 grid max-w-4xl gap-x-16 gap-y-12 sm:mt-20 sm:grid-cols-2 sm:gap-y-16">
            {METHOD.map((entry, position) => (
              <Reveal key={entry.index} delay={position * 0.06}>
                <div className="border-t border-hairline pt-6 sm:pt-7">
                  <span className="font-mono-data text-[11px] text-signal uppercase">{entry.index}</span>
                  <h3 className="mt-4 text-[15px] font-[600] tracking-[-0.01em] sm:mt-5 sm:text-[16px]">
                    {entry.title}
                  </h3>
                  <p className="mt-3.5 text-pretty text-[14px] leading-7 text-muted-foreground sm:mt-4">
                    {entry.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- close ---------------- */}
      <section className="relative overflow-hidden border-t border-hairline">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="aurora absolute -inset-[18%] opacity-70" />
          <div className="vignette absolute inset-0" />
        </div>
        <div className="relative mx-auto w-full max-w-[1320px] px-5 py-28 sm:px-10 sm:py-48">
          <Reveal>
            <p className="label">Begin</p>
            <h2 className="mt-7 max-w-4xl text-balance text-[clamp(1.75rem,4.8vw,4rem)] leading-[1.02] font-[600] tracking-[-0.035em] uppercase sm:mt-8">
              Start with a package.
              <br />
              <span className="text-muted-foreground">Find out what is missing.</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 sm:mt-12">
              <Button asChild size="lg" className="gap-2">
                <Link to="/workspace">
                  Open the workspace
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Link
                to="/workspace?sample=member-experience-modernisation-early-discovery"
                className="text-[13px] text-muted-foreground underline decoration-hairline underline-offset-[6px] transition-colors hover:text-foreground"
              >
                or open the early-discovery package
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-4 px-5 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10">
          <span className="label">Deal-to-Challenge Graph Engine</span>
          <span className="max-w-lg text-[12px] leading-6 text-muted-foreground/70">
            Internal planning aid. Never recruits talent, launches a challenge, builds a pod, approves
            funding or commits a delivery timeline.
          </span>
        </div>
      </footer>
    </div>
  );
}
