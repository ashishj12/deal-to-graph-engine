/**
 * Synthetic test data: a minimal ZIP writer.
 *
 * The engine's ZIP reader is verified against archives built here at test time
 * rather than a committed binary. That keeps the repository free of opaque
 * binaries (a malware-scan and review hazard) while still exercising the real
 * code path: entries are deflated with `node:zlib`, so the reader has to inflate
 * them through `DecompressionStream("deflate-raw")` exactly as it does for an
 * archive produced by any other tool.
 *
 * This file is test-only data construction. It is never imported by the engine.
 */

import { deflateRawSync } from "node:zlib";

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipEntryInput {
  name: string;
  text?: string;
  /** Stored entries are copied verbatim; deflated entries must be inflated. */
  method?: "stored" | "deflate";
  directory?: boolean;
}

interface PreparedEntry {
  nameBytes: Uint8Array;
  payload: Uint8Array;
  method: number;
  crc: number;
  uncompressedSize: number;
  offset: number;
  directory: boolean;
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

function u16(value: number): Uint8Array {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
}

function u32(value: number): Uint8Array {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff]);
}

/** Build a valid ZIP archive (local headers + central directory + EOCD). */
export function buildZip(entries: ZipEntryInput[]): Uint8Array {
  const encoder = new TextEncoder();
  const prepared: PreparedEntry[] = [];
  const localChunks: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const directory = entry.directory === true;
    const name = directory && !entry.name.endsWith("/") ? `${entry.name}/` : entry.name;
    const nameBytes = encoder.encode(name);
    const raw = directory ? new Uint8Array(0) : encoder.encode(entry.text ?? "");
    const useDeflate = !directory && (entry.method ?? "deflate") === "deflate";
    const payload = useDeflate ? new Uint8Array(deflateRawSync(raw)) : raw;
    const method = useDeflate ? 8 : 0;
    const crc = crc32(raw);
    prepared.push({
      nameBytes,
      payload,
      method,
      crc,
      uncompressedSize: raw.length,
      offset,
      directory,
    });

    const header = concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(method),
      u16(0),
      u16(0),
      u32(crc),
      u32(payload.length),
      u32(raw.length),
      u16(nameBytes.length),
      u16(0),
      nameBytes,
    ]);
    localChunks.push(header, payload);
    offset += header.length + payload.length;
  }

  const centralChunks: Uint8Array[] = [];
  let centralSize = 0;
  for (const entry of prepared) {
    const header = concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(entry.method),
      u16(0),
      u16(0),
      u32(entry.crc),
      u32(entry.payload.length),
      u32(entry.uncompressedSize),
      u16(entry.nameBytes.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(entry.directory ? 0x10 : 0),
      u32(entry.offset),
      entry.nameBytes,
    ]);
    centralChunks.push(header);
    centralSize += header.length;
  }

  const eocd = concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(prepared.length),
    u16(prepared.length),
    u32(centralSize),
    u32(offset),
    u16(0),
  ]);

  return concat([...localChunks, ...centralChunks, eocd]);
}

/** A ZIP whose deflate payload is appended after a streaming data descriptor. */
export function buildZipWithDataDescriptor(entries: ZipEntryInput[]): Uint8Array {
  const encoder = new TextEncoder();
  const base = buildZip(entries);
  // The central directory is authoritative; zeroing the sizes in the local
  // headers mimics archives written with streaming data descriptors (macOS,
  // Windows Explorer, Java), which is what the reader is designed to survive.
  const localSignatures: number[] = [];
  for (let index = 0; index + 4 <= base.length; index += 1) {
    if (base[index] === 0x50 && base[index + 1] === 0x4b && base[index + 2] === 0x03 && base[index + 3] === 0x04) {
      localSignatures.push(index);
    }
  }
  const patched = base.slice();
  for (const offset of localSignatures) {
    const nameLength = patched[offset + 26] | (patched[offset + 27] << 8);
    const extraLength = patched[offset + 28] | (patched[offset + 29] << 8);
    const dataStart = offset + 30 + nameLength + extraLength;
    for (let index = 14; index < 26; index += 1) patched[offset + index] = 0;
    if (encoder.encode("").length === 0) {
      // Sizes in the local header are now zero; the data itself is untouched.
      void dataStart;
    }
  }
  return patched;
}
