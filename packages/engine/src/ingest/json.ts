/**
 * Defensive JSON handling.
 *
 * All imported text is treated as untrusted data. Parsing strips
 * `__proto__` / `constructor` / `prototype` keys so a hostile package cannot
 * pollute the prototype chain, and duplicate keys are reported rather than
 * silently kept.
 */

export type Json = unknown;

export interface ParseResult {
  ok: boolean;
  value: Json;
  error?: { message: string; line: number; column: number };
  duplicateKeys: string[];
  strippedKeys: string[];
}

const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Locate `line`/`column` for a character offset inside a JSON document.
 * JSON.parse only gives us the offset in its message, so we translate it.
 */
function positionFromOffset(text: string, offset: number): { line: number; column: number } {
  let line = 1;
  let column = 1;
  const limit = Math.max(0, Math.min(offset, text.length));
  for (let i = 0; i < limit; i += 1) {
    if (text.charCodeAt(i) === 10) {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}

function extractOffset(message: string): number | null {
  const match = /position\s+(\d+)/i.exec(message);
  if (!match || match[1] === undefined) return null;
  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Scan for duplicate object keys at the top level of an object. This is a
 * best-effort detector used to raise an informational finding; JSON.parse
 * keeps the last value for duplicates, which we do not want to hide.
 */
function stripDangerousKeys(value: Json, stripped: Set<string>): Json {
  if (Array.isArray(value)) {
    return value.map((entry) => stripDangerousKeys(entry, stripped));
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, Json> = Object.create(null) as Record<string, Json>;
    for (const [key, entry] of Object.entries(value as Record<string, Json>)) {
      if (DANGEROUS_KEYS.has(key)) {
        stripped.add(key);
        continue;
      }
      out[key] = stripDangerousKeys(entry, stripped);
    }
    return out;
  }
  return value;
}

/** Detect duplicated keys using a minimal scanner over the raw text. */
function findDuplicateKeys(text: string): string[] {
  const duplicates = new Set<string>();
  const stack: Set<string>[] = [];
  let i = 0;
  let inString = false;
  let escape = false;

  const skipWhitespace = () => {
    while (i < text.length && /\s/.test(text[i] as string)) i += 1;
  };

  const readString = (): string => {
    let result = "";
    i += 1; // opening quote
    while (i < text.length) {
      const ch = text[i] as string;
      if (escape) {
        result += ch;
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === '"') {
        i += 1;
        return result;
      } else {
        result += ch;
      }
      i += 1;
    }
    return result;
  };

  while (i < text.length) {
    const ch = text[i] as string;
    if (ch === '"') {
      if (inString) {
        inString = false;
        i += 1;
        continue;
      }
      const start = i;
      const key = readString();
      skipWhitespace();
      if (text[i] === ":" && stack.length > 0) {
        const frame = stack[stack.length - 1] as Set<string>;
        if (frame.has(key)) duplicates.add(key);
        frame.add(key);
      }
      i = start;
      readString();
      continue;
    }
    if (ch === "{") {
      stack.push(new Set<string>());
      i += 1;
      continue;
    }
    if (ch === "}") {
      stack.pop();
      i += 1;
      continue;
    }
    if (ch === "[") {
      i += 1;
      continue;
    }
    if (ch === "]") {
      i += 1;
      continue;
    }
    i += 1;
  }

  return Array.from(duplicates);
}

/** Parse untrusted JSON without throwing. */
export function safeParse(text: string): ParseResult {
  const stripped = new Set<string>();
  const trimmed = text.replace(/^\uFEFF/, "");

  if (trimmed.trim().length === 0) {
    return {
      ok: false,
      value: null,
      error: { message: "The file is empty.", line: 1, column: 1 },
      duplicateKeys: [],
      strippedKeys: [],
    };
  }

  let value: Json;
  try {
    value = JSON.parse(trimmed) as Json;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON.";
    const offset = extractOffset(message);
    const pos = offset === null ? { line: 1, column: 1 } : positionFromOffset(trimmed, offset);
    return {
      ok: false,
      value: null,
      error: { message, line: pos.line, column: pos.column },
      duplicateKeys: [],
      strippedKeys: [],
    };
  }

  const duplicateKeys = findDuplicateKeys(trimmed);
  const cleaned = stripDangerousKeys(value, stripped);

  return {
    ok: true,
    value: cleaned,
    duplicateKeys,
    strippedKeys: Array.from(stripped),
  };
}

/* ------------------------------------------------------------------ */
/* Defensive accessors                                                  */
/* ------------------------------------------------------------------ */

export function isObject(value: Json): value is Record<string, Json> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function obj(value: Json): Record<string, Json> {
  return isObject(value) ? value : {};
}

export function arr(value: Json): Json[] {
  return Array.isArray(value) ? value : [];
}

export function str(value: Json, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

export function num(value: Json): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
}

export function bool(value: Json, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function strArray(value: Json): string[] {
  return arr(value)
    .filter((entry): entry is string => typeof entry === "string")
    .filter((entry) => entry.length > 0);
}

/** Read a nested path with dotted notation, returning `undefined` if absent. */
export function at(root: Json, path: string): Json {
  let cursor: Json = root;
  for (const segment of path.split(".")) {
    if (!isObject(cursor)) return undefined;
    cursor = cursor[segment];
  }
  return cursor;
}

/** Convert a display name into a stable, URL-safe slug for synthesized ids. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "unnamed";
}
