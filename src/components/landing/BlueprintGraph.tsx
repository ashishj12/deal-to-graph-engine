import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

type Model = "flexible-talent" | "challenge" | "private-pod";

interface Node {
  id: string;
  index: string;
  title: string;
  x: number;
  y: number;
  model: Model;
  effort: string;
  critical?: boolean;
}

interface Edge {
  from: string;
  to: string;
  critical?: boolean;
  label?: string;
}

const MODEL_COLOR: Record<Model, string> = {
  "flexible-talent": "var(--model-flexible)",
  challenge: "var(--model-challenge)",
  "private-pod": "var(--model-pod)",
};

const NODES: Node[] = [
  {
    id: "n1",
    index: "N01",
    title: "Confirm API contracts",
    x: 132,
    y: 196,
    model: "flexible-talent",
    effort: "8d",
    critical: true,
  },
  {
    id: "n3",
    index: "N03",
    title: "Collect data volumes",
    x: 132,
    y: 336,
    model: "flexible-talent",
    effort: "3d",
  },
  {
    id: "n2",
    index: "N02",
    title: "Explore UX concepts",
    x: 132,
    y: 476,
    model: "challenge",
    effort: "15d",
  },
  {
    id: "n4",
    index: "N04",
    title: "Data platform foundation",
    x: 476,
    y: 262,
    model: "private-pod",
    effort: "34d",
    critical: true,
  },
  {
    id: "n5",
    index: "N05",
    title: "Forecast model exploration",
    x: 476,
    y: 430,
    model: "challenge",
    effort: "22d",
  },
  {
    id: "n6",
    index: "N06",
    title: "Integrated build",
    x: 820,
    y: 178,
    model: "private-pod",
    effort: "61d",
    critical: true,
  },
  {
    id: "n7",
    index: "N07",
    title: "Independent QA",
    x: 820,
    y: 386,
    model: "challenge",
    effort: "18d",
  },
  {
    id: "n8",
    index: "N08",
    title: "Deploy and hand over",
    x: 1152,
    y: 282,
    model: "private-pod",
    effort: "12d",
    critical: true,
  },
];

const EDGES: Edge[] = [
  { from: "n1", to: "n4", critical: true, label: "blocking-discovery" },
  { from: "n3", to: "n4" },
  { from: "n2", to: "n6" },
  { from: "n4", to: "n6", critical: true, label: "model-handoff" },
  { from: "n4", to: "n5" },
  { from: "n5", to: "n7" },
  { from: "n6", to: "n8", critical: true, label: "release-sequencing" },
  { from: "n7", to: "n8" },
];

const WAVES = [
  { x: 132, label: "WAVE 01" },
  { x: 476, label: "WAVE 02" },
  { x: 820, label: "WAVE 03" },
  { x: 1152, label: "WAVE 04" },
];

/** Orthogonal elbow routing, the way a wiring diagram is drawn. */
function route(from: Node, to: Node): string {
  const mid = from.x + (to.x - from.x) / 2;
  return `M ${from.x + 10} ${from.y} H ${mid} V ${to.y} H ${to.x - 10}`;
}

export function BlueprintGraph() {
  const reduced = useReducedMotion();
  const byId = useMemo(
    () => Object.fromEntries(NODES.map((node) => [node.id, node])),
    [],
  );

  return (
    <svg
      viewBox="0 0 1280 820"
      role="img"
      aria-label="Engineering schematic of a delivery graph: wave-one gate nodes feeding a coordinated build, with the critical path from API contract confirmation through integrated build to deployment."
      className="block h-auto w-full"
    >
      <defs>
        <pattern
          id="bp-grid"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 32 0 L 0 0 0 32"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.07"
            strokeWidth="0.5"
          />
        </pattern>
        <filter id="bp-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      <rect
        x="0"
        y="0"
        width="1280"
        height="820"
        fill="url(#bp-grid)"
        className="text-foreground"
      />

      {/* construction guides */}
      {WAVES.map((wave) => (
        <g key={wave.x}>
          <line
            x1={wave.x}
            y1={132}
            x2={wave.x}
            y2={648}
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeDasharray="1 5"
            className="text-foreground"
          />
          <text
            x={wave.x}
            y={112}
            textAnchor="middle"
            className="fill-current font-mono text-[10px] tracking-[0.28em] uppercase"
            opacity="0.4"
          >
            {wave.label}
          </text>
        </g>
      ))}

      {/* scale rule */}
      <line
        x1="64"
        y1="648"
        x2="1216"
        y2="648"
        stroke="currentColor"
        strokeOpacity="0.25"
        className="text-foreground"
      />
      {Array.from({ length: 25 }).map((_, index) => {
        const x = 64 + index * 48;
        const major = index % 4 === 0;
        return (
          <line
            key={x}
            x1={x}
            y1={648}
            x2={x}
            y2={major ? 660 : 655}
            stroke="currentColor"
            strokeOpacity={major ? 0.3 : 0.18}
            className="text-foreground"
          />
        );
      })}
      <text
        x="64"
        y="676"
        className="fill-current font-mono text-[9px] tracking-[0.2em]"
        opacity="0.35"
      >
        T+0
      </text>
      <text
        x="1216"
        y="676"
        textAnchor="end"
        className="fill-current font-mono text-[9px] tracking-[0.2em]"
        opacity="0.35"
      >
        T+118d
      </text>

      {/* edges */}
      {EDGES.map((edge, index) => {
        const from = byId[edge.from];
        const to = byId[edge.to];
        if (!from || !to) return null;
        const d = route(from, to);
        const critical = Boolean(edge.critical);
        const stroke = critical ? "var(--foreground)" : MODEL_COLOR[to.model];
        const delay = 0.45 + index * 0.09;
        // "Draw-in" (pathLength) and a dash marquee cannot coexist: framer drives
        // pathLength through stroke-dasharray, so critical edges keep their dashes
        // and only fade, while ordinary edges draw in.
        return (
          <g key={`${edge.from}-${edge.to}`}>
            {critical && (
              <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth="4"
                strokeOpacity="0.14"
                filter="url(#bp-glow)"
              />
            )}
            {critical ? (
              <motion.path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
                strokeDasharray="3 5"
                initial={reduced ? undefined : { opacity: 0 }}
                animate={
                  reduced
                    ? undefined
                    : { opacity: 0.95, strokeDashoffset: [0, -32] }
                }
                transition={{
                  opacity: { duration: 0.7, delay },
                  strokeDashoffset: {
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              />
            ) : (
              <motion.path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth="0.9"
                initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
                animate={reduced ? undefined : { pathLength: 1, opacity: 0.45 }}
                transition={{ duration: 1, delay, ease: "easeInOut" }}
              />
            )}
            {/* Direction tick: every edge enters its target horizontally. */}
            <path
              d={`M ${to.x - 16} ${to.y - 3.5} L ${to.x - 9} ${to.y} L ${to.x - 16} ${to.y + 3.5} Z`}
              fill={stroke}
              opacity={critical ? 0.95 : 0.45}
            />
            {edge.label && (
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 8}
                textAnchor="middle"
                className="fill-current font-mono text-[9px] tracking-[0.16em]"
                opacity="0.5"
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      })}

      {/* nodes */}
      {NODES.map((node, index) => (
        <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
          <motion.g
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15 + index * 0.07,
              ease: "easeOut",
            }}
          >
            {node.critical && (
              <rect
                x={-15}
                y={-15}
                width={30}
                height={30}
                fill="none"
                stroke="var(--foreground)"
                strokeOpacity="0.22"
              />
            )}
            <rect
              x={-9}
              y={-9}
              width={18}
              height={18}
              fill="var(--background)"
              stroke={MODEL_COLOR[node.model]}
              strokeWidth={node.critical ? 1.6 : 1.1}
            />
            <rect
              x={-3}
              y={-3}
              width={6}
              height={6}
              fill={MODEL_COLOR[node.model]}
            />
            <text
              x="0"
              y="-22"
              textAnchor="middle"
              className="fill-current font-mono text-[9px] tracking-[0.2em]"
              opacity="0.55"
            >
              {node.index}
            </text>
            <text
              x="0"
              y="32"
              textAnchor="middle"
              className="fill-current font-mono text-[10px] uppercase tracking-[0.14em]"
              opacity="0.78"
            >
              {node.title}
            </text>
            <text
              x="0"
              y="46"
              textAnchor="middle"
              className="fill-current font-mono text-[9px] tracking-[0.18em]"
              opacity="0.4"
            >
              {node.effort}
            </text>
            <title>{`${node.index} — ${node.title} — ${node.model}${node.critical ? " (critical path)" : ""}`}</title>
          </motion.g>
        </g>
      ))}

      {/* legend */}
      <g transform="translate(64 730)">
        <text
          className="fill-current font-mono text-[9px] tracking-[0.24em]"
          opacity="0.4"
        >
          OPERATING MODEL
        </text>
        {(Object.keys(MODEL_COLOR) as Model[]).map((model, index) => (
          <g key={model} transform={`translate(${index * 246} 20)`}>
            <rect
              x="0"
              y="-7"
              width="12"
              height="12"
              fill="none"
              stroke={MODEL_COLOR[model]}
              strokeWidth="1.2"
            />
            <rect x="4" y="-3" width="4" height="4" fill={MODEL_COLOR[model]} />
            <text
              x="22"
              y="3"
              className="fill-current font-mono text-[10px] uppercase tracking-[0.16em]"
              opacity="0.7"
            >
              {model.replace("-", " ")}
            </text>
          </g>
        ))}
        <g transform="translate(760 20)">
          <line
            x1="0"
            y1="0"
            x2="26"
            y2="0"
            stroke="var(--foreground)"
            strokeWidth="1.6"
            strokeDasharray="3 4"
          />
          <text
            x="36"
            y="3"
            className="fill-current font-mono text-[10px] uppercase tracking-[0.16em]"
            opacity="0.7"
          >
            critical path
          </text>
        </g>
      </g>

      {/* title block */}
      <g transform="translate(64 790)">
        <text
          className="fill-current font-mono text-[9px] tracking-[0.24em]"
          opacity="0.32"
        >
          DEAL → DAG · SHEET 01 · SCALE NTS · ILLUSTRATIVE · MOCK MODE · NOT A
          COMMITTED PLAN
        </text>
      </g>
    </svg>
  );
}
