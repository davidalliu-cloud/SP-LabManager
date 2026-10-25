/**
 * Just enough zip to edit one file inside a .docx.
 *
 * A .docx is a zip, and an offer only ever changes `word/document.xml`. Every
 * other entry — styles, fonts, the header images, the numbering — is copied
 * back byte for byte, still compressed, exactly as Word wrote it. That is what
 * keeps the generated offer identical to the template rather than a re-render
 * of it, and it is why this file exists instead of a zip dependency: the one
 * entry that changes is written uncompressed, so nothing here has to deflate.
 *
 * Node only (zlib), so it is used from the route handler, never the browser.
 */

import zlib from "zlib";

const LOCAL_SIG = 0x04034b50;
const CENTRAL_SIG = 0x02014b50;
const EOCD_SIG = 0x06054b50;

export interface ZipEntry {
  name: string;
  /** As stored: deflated when `method` is 8. */
  data: Buffer;
  method: number;
  crc: number;
  compressedSize: number;
  uncompressedSize: number;
  flags: number;
  time: number;
  date: number;
  externalAttributes: number;
}

/** Read every entry, keeping the compressed bytes so they can be written back. */
export function readZip(buffer: Buffer): ZipEntry[] {
  let eocd = buffer.length - 22;
  while (eocd >= 0 && buffer.readUInt32LE(eocd) !== EOCD_SIG) eocd -= 1;
  if (eocd < 0) throw new Error("Nuk u gjet fundi i arkivit: shablloni nuk është .docx i vlefshëm.");

  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const entries: ZipEntry[] = [];

  for (let index = 0; index < count; index += 1) {
    if (buffer.readUInt32LE(offset) !== CENTRAL_SIG) break;

    const flags = buffer.readUInt16LE(offset + 8);
    const method = buffer.readUInt16LE(offset + 10);
    const time = buffer.readUInt16LE(offset + 12);
    const date = buffer.readUInt16LE(offset + 14);
    const crc = buffer.readUInt32LE(offset + 16);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const externalAttributes = buffer.readUInt32LE(offset + 38);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + nameLength);

    if (buffer.readUInt32LE(localOffset) !== LOCAL_SIG) {
      throw new Error(`Hyrja "${name}" nuk ka header lokal të vlefshëm.`);
    }
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;

    entries.push({
      name,
      data: buffer.subarray(dataStart, dataStart + compressedSize),
      method,
      crc,
      compressedSize,
      uncompressedSize,
      // Bit 3 says the sizes live in a trailing descriptor. They are written
      // into the header here, so it must not be carried over.
      flags: flags & ~0x08,
      time,
      date,
      externalAttributes
    });

    offset += 46 + nameLength + extraLength + commentLength;
  }

  if (!entries.length) throw new Error("Arkivi i shabllonit është bosh.");
  return entries;
}

export function inflateEntry(entry: ZipEntry): Buffer {
  if (entry.method === 0) return Buffer.from(entry.data);
  if (entry.method === 8) return zlib.inflateRawSync(entry.data);
  throw new Error(`Metoda e kompresimit ${entry.method} nuk mbështetet.`);
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value;
  }
  return table;
})();

export function crc32(buffer: Buffer): number {
  let crc = ~0;
  for (let index = 0; index < buffer.length; index += 1) {
    crc = CRC_TABLE[(crc ^ buffer[index]) & 0xff] ^ (crc >>> 8);
  }
  return (~crc) >>> 0;
}

/** Replace one entry's contents, deflating it as Word would. */
export function replaceEntry(entries: ZipEntry[], name: string, contents: Buffer): ZipEntry[] {
  const found = entries.some((entry) => entry.name === name);
  if (!found) throw new Error(`Shablloni nuk përmban "${name}".`);

  return entries.map((entry) => {
    if (entry.name !== name) return entry;
    const deflated = zlib.deflateRawSync(contents, { level: 9 });
    return {
      ...entry,
      data: deflated,
      method: 8,
      crc: crc32(contents),
      compressedSize: deflated.length,
      uncompressedSize: contents.length
    };
  });
}

export function writeZip(entries: ZipEntry[]): Buffer {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");

    const local = Buffer.alloc(30 + name.length);
    local.writeUInt32LE(LOCAL_SIG, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(entry.flags, 6);
    local.writeUInt16LE(entry.method, 8);
    local.writeUInt16LE(entry.time, 10);
    local.writeUInt16LE(entry.date, 12);
    local.writeUInt32LE(entry.crc, 14);
    local.writeUInt32LE(entry.compressedSize, 18);
    local.writeUInt32LE(entry.uncompressedSize, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    name.copy(local, 30);

    const central = Buffer.alloc(46 + name.length);
    central.writeUInt32LE(CENTRAL_SIG, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(entry.flags, 8);
    central.writeUInt16LE(entry.method, 10);
    central.writeUInt16LE(entry.time, 12);
    central.writeUInt16LE(entry.date, 14);
    central.writeUInt32LE(entry.crc, 16);
    central.writeUInt32LE(entry.compressedSize, 20);
    central.writeUInt32LE(entry.uncompressedSize, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(entry.externalAttributes, 38);
    central.writeUInt32LE(offset, 42);
    name.copy(central, 46);

    locals.push(local, Buffer.from(entry.data));
    centrals.push(central);
    offset += local.length + entry.data.length;
  }

  const centralBlock = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(EOCD_SIG, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBlock.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...locals, centralBlock, eocd]);
}
