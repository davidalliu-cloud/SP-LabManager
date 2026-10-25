/**
 * Editing the laboratory offer's tables.
 *
 * Marker substitution covers everything that is a blank to be filled. Section
 * 9 is a different job: it is a 108-row catalogue and an offer should carry
 * only the tests being offered, so the rows for everything unticked are
 * removed outright. Section 12's order form is the other half — when the offer
 * quotes quantities, it is filled in and totalled here rather than left for
 * the client to work out.
 *
 * All of it is `<w:tr>` surgery on `word/document.xml`. The tables are
 * uniformly built — seven cells per catalogue row, five per order line — which
 * is what makes this safe to do by pattern; every function below checks that
 * shape before touching anything and reports when it does not hold.
 */

const TABLE = /<w:tbl>[\s\S]*?<\/w:tbl>/g;
const ROW = /<w:tr\b[^>]*>[\s\S]*?<\/w:tr>/g;
const CELL = /<w:tc>[\s\S]*?<\/w:tc>/g;
const TEXT = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g;

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const unescapeXml = (text: string) =>
  text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

const cellText = (cell: string) =>
  unescapeXml([...cell.matchAll(TEXT)].map((match) => match[1]).join("")).trim();

const rowsOf = (table: string) => [...table.matchAll(ROW)].map((match) => match[0]);
const cellsOf = (row: string) => [...row.matchAll(CELL)].map((match) => match[0]);

/**
 * Rebuild a container by rewriting each child in place.
 *
 * Positional, not `String.replace(child, …)`: the blank rows of the order form
 * are byte-identical to one another and so are several of their cells, so
 * searching for one by its text would keep finding the first.
 */
function mapParts(source: string, pattern: RegExp, rewrite: (part: string, index: number) => string) {
  let out = "";
  let cursor = 0;
  let index = 0;

  for (const match of source.matchAll(pattern)) {
    const at = match.index ?? 0;
    out += source.slice(cursor, at) + rewrite(match[0], index);
    cursor = at + match[0].length;
    index += 1;
  }

  return out + source.slice(cursor);
}

/**
 * Put `value` in a cell, keeping the cell's own formatting.
 *
 * Every cell this touches holds exactly one run — the blank ones carry a run
 * with a single space in it — so the value goes into that run's text and
 * inherits its size and colour. Any further runs in the cell are emptied, so
 * the old content cannot survive alongside the new. `align` is for figures,
 * which belong on the right like the printed prices beside them.
 */
function setCellText(cell: string, value: string, align?: "left" | "right") {
  let next = cell;
  if (align) {
    next = next.replace(/<w:jc w:val="(?:left|right|center|both)"\/>/, `<w:jc w:val="${align}"/>`);
  }

  let written = false;
  return next.replace(/(<w:t(?:\s[^>]*)?>)([\s\S]*?)(<\/w:t>)/g, (_full, open: string, _inner, close: string) => {
    if (written) return open + close;
    written = true;
    return open + escapeXml(value) + close;
  });
}

/** Write one row's cells from a list of values, one per cell. */
function setRowCells(row: string, values: string[], aligns: ("left" | "right")[]) {
  return mapParts(row, CELL, (cell, index) =>
    index < values.length ? setCellText(cell, values[index], aligns[index]) : cell
  );
}

/** True for a Section 9 catalogue table: "Kodi" through "Sasia e kërkuar". */
function isCatalogueTable(table: string) {
  const first = rowsOf(table)[0];
  if (!first) return false;
  const header = cellsOf(first).map(cellText);
  return header.length === 7 && header[0] === "Kodi" && header[6] === "Sasia e kërkuar";
}

const codeOf = (row: string) => {
  const cells = cellsOf(row);
  if (cells.length !== 7) return null;
  const code = cellText(cells[0]);
  return /^[A-Z]+\d+$/.test(code) ? code : null;
};

/**
 * Walk the catalogue tables, letting `transform` rewrite each one. Returning
 * null drops the table and the "Tabela 9.x: …" caption above it, so a section
 * with nothing selected leaves no orphan heading behind.
 */
function eachCatalogueTable(xml: string, transform: (table: string) => string | null) {
  let out = "";
  let cursor = 0;

  for (const match of xml.matchAll(TABLE)) {
    const table = match[0];
    const at = match.index ?? 0;
    if (!isCatalogueTable(table)) continue;

    const next = transform(table);
    let head = xml.slice(cursor, at);

    if (next === null) {
      // Drop the caption paragraph immediately above, which is this table's.
      head = head.replace(
        /<w:p\b[^>]*>(?:(?!<\/w:p>)[\s\S])*?Tabela 9\.\d+:[\s\S]*?<\/w:p>\s*$/,
        ""
      );
    }

    out += head + (next ?? "");
    cursor = at + table.length;
  }

  return out + xml.slice(cursor);
}

export interface PruneResult {
  xml: string;
  kept: string[];
  removed: string[];
  warnings: string[];
}

/** Keep only the ticked tests in Section 9, dropping emptied tables entirely. */
export function pruneCatalogue(xml: string, keep: Set<string>): PruneResult {
  const kept: string[] = [];
  const removed: string[] = [];
  const warnings: string[] = [];
  let tables = 0;

  const next = eachCatalogueTable(xml, (table) => {
    tables += 1;
    const rows = rowsOf(table);
    const survivors: string[] = [];
    let dataRows = 0;

    for (const row of rows) {
      const code = codeOf(row);
      if (code === null) {
        survivors.push(row); // the header, and any row that is not a test
        continue;
      }
      dataRows += 1;
      if (keep.has(code)) {
        survivors.push(row);
        kept.push(code);
      } else {
        removed.push(code);
      }
    }

    if (!dataRows) {
      warnings.push("Një tabelë e Seksionit 9 nuk kishte rreshta testimesh.");
      return table;
    }
    if (survivors.length === rows.length) return table;

    // Nothing in this group was chosen, so only the header is left and the
    // whole table goes.
    if (!survivors.some((row) => codeOf(row) !== null)) return null;

    return mapParts(table, ROW, (row) => {
      const code = codeOf(row);
      return code !== null && !keep.has(code) ? "" : row;
    });
  });

  if (!tables) warnings.push("Nuk u gjet asnjë tabelë e katalogut në Seksionin 9.");
  const missing = [...keep].filter((code) => !kept.includes(code));
  if (missing.length) {
    warnings.push(`Kodet e zgjedhura që nuk u gjetën në shabllon: ${missing.join(", ")}.`);
  }

  return { xml: next, kept, removed, warnings };
}

/** Write the "Sasia e kërkuar" column for the rows that are left. */
export function writeCatalogueQuantities(xml: string, quantities: Map<string, string>) {
  return eachCatalogueTable(xml, (table) =>
    mapParts(table, ROW, (row) => {
      const code = codeOf(row);
      const quantity = code === null ? undefined : quantities.get(code);
      if (!quantity) return row;
      return mapParts(row, CELL, (cell, index) =>
        index === 6 ? setCellText(cell, quantity, "right") : cell
      );
    })
  );
}

export interface OrderLine {
  code: string;
  description: string;
  quantity: string;
  unitPrice: string;
  value: string;
}

/** True for Section 12's order form: "Kodi" through "Vlera pa TVSH (ALL)". */
function isOrderForm(table: string) {
  const first = rowsOf(table)[0];
  if (!first) return false;
  const header = cellsOf(first).map(cellText);
  return header.length === 5 && header[0] === "Kodi" && header[4].startsWith("Vlera pa TVSH");
}

export interface OrderFormResult {
  xml: string;
  warnings: string[];
}

/**
 * Fill Section 12's order form.
 *
 * The template leaves ten blank lines and three totals. Spare lines are
 * removed so the signed form has no empty rows in it, and when there are more
 * tests than lines the last blank row is cloned to make room.
 */
export function fillOrderForm(
  xml: string,
  lines: OrderLine[],
  totals: { subtotal: string; vat: string; total: string }
): OrderFormResult {
  const warnings: string[] = [];
  let found = false;
  let out = "";
  let cursor = 0;

  for (const match of xml.matchAll(TABLE)) {
    const table = match[0];
    const at = match.index ?? 0;
    if (!isOrderForm(table)) continue;
    found = true;

    const rows = rowsOf(table);
    const header = rows[0];
    const blanks = rows.filter((row) => cellsOf(row).length === 5 && row !== header);
    const totalRows = rows.filter((row) => cellsOf(row).length === 2);

    if (!blanks.length || totalRows.length !== 3) {
      warnings.push("Formulari i porosisë nuk ka strukturën e pritur; u lanë bosh.");
      continue;
    }

    // One blank row is the pattern for every order line, however many there
    // are: ten of them in the template, but a long order gets as many as it
    // needs and a short one leaves none empty behind.
    const blank = blanks[blanks.length - 1];
    const aligns: ("left" | "right")[] = ["left", "left", "right", "right", "right"];
    const filled = lines.map((line) =>
      setRowCells(blank, [line.code, line.description, line.quantity, line.unitPrice, line.value], aligns)
    );

    const labelled = [totals.subtotal, totals.vat, totals.total].map((value, index) =>
      mapParts(totalRows[index], CELL, (cell, position) =>
        position === 1 ? setCellText(cell, value, "right") : cell
      )
    );

    // Rebuilt positionally from the first blank row to the last totals row,
    // because the blank rows are byte-identical and cannot be found by text.
    let seenBlank = 0;
    let seenTotal = 0;
    const rebuilt = mapParts(table, ROW, (row) => {
      if (cellsOf(row).length === 2) {
        const next = labelled[seenTotal];
        seenTotal += 1;
        return next ?? row;
      }
      if (row !== blank) return row;
      const next = filled[seenBlank];
      seenBlank += 1;
      // Spare template rows are dropped; extra order lines ride on the last.
      if (seenBlank === blanks.length && filled.length > blanks.length) {
        return filled.slice(blanks.length - 1).join("");
      }
      return next ?? "";
    });

    out += xml.slice(cursor, at) + rebuilt;
    cursor = at + table.length;
  }

  if (!found) warnings.push("Formulari i porosisë (Tabela 12.1) nuk u gjet.");
  return { xml: out + xml.slice(cursor), warnings };
}

/**
 * Swap one of the template's sentences for another.
 *
 * Two paragraphs of the laboratory offer tell the client to choose the tests
 * and write in the quantities. That is right for a catalogue offer and wrong
 * for one that already quotes a scope, where the offer would be instructing
 * the client to do work it has itself done. Returns the text unchanged, and
 * says so, when the sentence is not there to swap — the template may have been
 * reworded.
 */
export function replaceSentence(xml: string, original: string, replacement: string) {
  const escaped = escapeXml(original);
  if (xml.includes(escaped)) return { xml: xml.replace(escaped, escapeXml(replacement)), replaced: true };
  return { xml, replaced: false };
}

/** The instruction above Section 12's order form. */
export const ORDER_FORM_INTRO =
  "Plotësoni kodet e testimeve të zgjedhura nga Seksioni 9 dhe dërgojeni formularin me e-mail në info@sarpandlab.al. Për testime të përsëritura gjatë gjithë objektit (p.sh. kubikët e betonit), mjafton të shënoni kodin dhe sasinë e parashikuar.";

/** The sentence in Section 9's preamble that asks the client to enter quantities. */
export const CATALOGUE_INTRO_SENTENCE =
  "Klienti zgjedh testimet duke shënuar sasinë (numrin e raporteve) në kolonën e fundit ose duke përdorur Formularin e Porosisë në Seksionin 12.";
