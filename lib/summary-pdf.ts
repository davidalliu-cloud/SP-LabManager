import type { ClientAnalysis } from "./client-analysis";
import { formatPeriod } from "./client-analysis";
import { formatEuropeanDate } from "./date-format";
import { money } from "./offer-fields";

/**
 * The client summary, built as a PDF rather than photographed from the page.
 *
 * The first attempt screenshotted the whole sheet and sliced the image into
 * page-height strips. That cuts wherever the strip ends — through a chart,
 * through a row of cubes — because the image knows nothing about what is drawn
 * on it. A document that splits a cube's result across two pages is not one a
 * client should receive.
 *
 * So the tables are drawn here, row by row, and a row is only drawn if the
 * whole of it fits on the page that is open. The charts are the one thing still
 * captured from the screen, because a bar chart redrawn in jsPDF would be a
 * second implementation to keep in step with the first; each chart is placed
 * whole or moved to the next page.
 *
 * Everything is A4 landscape, 10mm margins, with the header repeated and the
 * pages numbered.
 */
const PAGE_WIDTH_MM = 297;
const PAGE_HEIGHT_MM = 210;
const MARGIN_MM = 10;
const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2;
const HEADER_HEIGHT_MM = 26;
const FOOTER_HEIGHT_MM = 8;
const CONTENT_TOP_MM = MARGIN_MM + HEADER_HEIGHT_MM;
const CONTENT_BOTTOM_MM = PAGE_HEIGHT_MM - MARGIN_MM - FOOTER_HEIGHT_MM;

const INK = { r: 23, g: 23, b: 23 };
const RULE = { r: 150, g: 150, b: 150 };
const BAND = { r: 242, g: 240, b: 238 };

export type SummaryChart = { dataUrl: string; width: number; height: number };

export type SummaryPdfInput = {
  analysis: ClientAnalysis;
  issuedBy: string;
  logoDataUrl?: string;
  accreditationDataUrl?: string;
  charts: SummaryChart[];
  /**
   * Whether the sheet carries what the period is worth.
   *
   * A summary is sent for two different reasons. In front of an invoice it has
   * to price every report and total them; sent to a site engineer, or to a
   * client who is only being shown what was tested, the money is nobody's
   * business and asking for the sheet should not mean handing it over.
   *
   * Off drops both places a price appears — the two columns on the report list
   * and the valuation that follows it — and nothing else: the same reports,
   * the same dates, the same codes.
   */
  includePricing?: boolean;
};

type Column<Row> = {
  header: string;
  width: number;
  align?: "left" | "right";
  value: (row: Row) => string;
};

/** Fits text to a column, cutting with an ellipsis rather than wrapping — a
 *  wrapped cell makes a row two lines tall and rows must stay whole. */
function fit(pdf: any, text: string, widthMm: number) {
  const available = widthMm - 2;
  if (pdf.getTextWidth(text) <= available) return text;
  let cut = text;
  while (cut.length > 1 && pdf.getTextWidth(`${cut}…`) > available) cut = cut.slice(0, -1);
  return `${cut}…`;
}

export async function buildSummaryPdf(input: SummaryPdfInput): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
  const { analysis, issuedBy } = input;
  const client = analysis.client;

  let y = CONTENT_TOP_MM;
  let page = 1;

  function header() {
    if (input.logoDataUrl) pdf.addImage(input.logoDataUrl, "PNG", MARGIN_MM, MARGIN_MM - 2, 42, 0);
    if (input.accreditationDataUrl) {
      pdf.addImage(input.accreditationDataUrl, "PNG", PAGE_WIDTH_MM - MARGIN_MM - 20, MARGIN_MM - 2, 20, 0);
    }

    pdf.setTextColor(INK.r, INK.g, INK.b);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text("PËRMBLEDHJE E PUNËS LABORATORIKE", PAGE_WIDTH_MM / 2, MARGIN_MM + 4, { align: "center" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text("Laboratory work summary", PAGE_WIDTH_MM / 2, MARGIN_MM + 8.5, { align: "center" });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text(client?.clientName ?? "—", PAGE_WIDTH_MM / 2, MARGIN_MM + 14, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    const line = [
      client?.clientCode,
      formatPeriod(analysis.period),
      `Lëshuar: ${formatEuropeanDate(new Date().toISOString())}`,
      issuedBy
    ]
      .filter(Boolean)
      .join("   ·   ");
    pdf.text(line, PAGE_WIDTH_MM / 2, MARGIN_MM + 18.5, { align: "center" });

    pdf.setDrawColor(INK.r, INK.g, INK.b);
    pdf.setLineWidth(0.4);
    pdf.line(MARGIN_MM, CONTENT_TOP_MM - 3, PAGE_WIDTH_MM - MARGIN_MM, CONTENT_TOP_MM - 3);
  }

  function footer() {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(120, 120, 120);
    pdf.text("SARP & LAB sh.p.k. · Durrës · ISO/IEC 17025", MARGIN_MM, PAGE_HEIGHT_MM - MARGIN_MM + 2);
    pdf.text(`Faqe ${page}`, PAGE_WIDTH_MM - MARGIN_MM, PAGE_HEIGHT_MM - MARGIN_MM + 2, { align: "right" });
    pdf.setTextColor(INK.r, INK.g, INK.b);
  }

  /** Opens a new page and returns the y to continue drawing at. */
  function newPage() {
    footer();
    pdf.addPage();
    page += 1;
    header();
    y = CONTENT_TOP_MM;
  }

  /** Ensures `needed` mm are free on the open page, breaking first if not. */
  function reserve(needed: number) {
    if (y + needed > CONTENT_BOTTOM_MM) newPage();
  }

  header();

  // --- the figures --------------------------------------------------------
  const tiles: Array<[string, string]> = [
    ["Mostra të pranuara", String(analysis.samplesReceived)],
    ["Teste të përfunduara", String(analysis.testsCompleted)],
    ["Raporte të lëshuara", String(analysis.reportsIssued)],
    [
      "Kohë mesatare",
      analysis.averageTurnaroundDays !== undefined ? `${analysis.averageTurnaroundDays} ditë` : "—"
    ]
  ];
  const tileWidth = (CONTENT_WIDTH_MM - 3 * 4) / 4;
  reserve(20);
  tiles.forEach(([label, value], index) => {
    const x = MARGIN_MM + index * (tileWidth + 4);
    pdf.setFillColor(BAND.r, BAND.g, BAND.b);
    pdf.setDrawColor(RULE.r, RULE.g, RULE.b);
    pdf.setLineWidth(0.2);
    pdf.rect(x, y, tileWidth, 16, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text(value, x + 3, y + 7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.text(label, x + 3, y + 12.5);
  });
  y += 16 + 6;

  // --- the charts ---------------------------------------------------------
  // Two across. A chart is placed whole or moved to the next page; it is never
  // cut, which is what the sliced screenshot used to do to them.
  const chartWidth = (CONTENT_WIDTH_MM - 6) / 2;
  let column = 0;
  let rowHeight = 0;
  for (const chart of input.charts) {
    const height = Math.min((chart.height / chart.width) * chartWidth, CONTENT_BOTTOM_MM - CONTENT_TOP_MM);
    if (column === 0) reserve(height);
    const x = MARGIN_MM + column * (chartWidth + 6);
    pdf.addImage(chart.dataUrl, "PNG", x, y, chartWidth, height);
    rowHeight = Math.max(rowHeight, height);
    column += 1;
    if (column === 2) {
      y += rowHeight + 6;
      column = 0;
      rowHeight = 0;
    }
  }
  if (column === 1) y += rowHeight + 6;

  /** Draws a titled table, breaking between rows and repeating the head. */
  function table<Row>(title: string, columns: Column<Row>[], rows: Row[], note?: string) {
    if (!rows.length) return;
    const headHeight = 7;
    const rowHeightMm = 5.4;

    function head(withTitle: boolean) {
      if (withTitle) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text(title, MARGIN_MM, y);
        y += 5;
      }
      pdf.setFillColor(BAND.r, BAND.g, BAND.b);
      pdf.rect(MARGIN_MM, y, CONTENT_WIDTH_MM, headHeight, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      let x = MARGIN_MM;
      for (const column of columns) {
        pdf.text(fit(pdf, column.header, column.width), column.align === "right" ? x + column.width - 1 : x + 1, y + 4.8, {
          align: column.align === "right" ? "right" : "left"
        });
        x += column.width;
      }
      y += headHeight;
    }

    reserve(5 + headHeight + rowHeightMm * 2);
    head(true);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    for (const row of rows) {
      if (y + rowHeightMm > CONTENT_BOTTOM_MM) {
        newPage();
        head(false);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
      }
      let x = MARGIN_MM;
      for (const column of columns) {
        const text = fit(pdf, column.value(row), column.width);
        pdf.text(text, column.align === "right" ? x + column.width - 1 : x + 1, y + 3.8, {
          align: column.align === "right" ? "right" : "left"
        });
        x += column.width;
      }
      pdf.setDrawColor(222, 222, 222);
      pdf.setLineWidth(0.1);
      pdf.line(MARGIN_MM, y + rowHeightMm, PAGE_WIDTH_MM - MARGIN_MM, y + rowHeightMm);
      y += rowHeightMm;
    }

    if (note) {
      reserve(8);
      y += 3;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(110, 110, 110);
      pdf.text(note, MARGIN_MM, y);
      pdf.setTextColor(INK.r, INK.g, INK.b);
      y += 4;
    }
    y += 6;
  }

  // --- cubes, one line each ------------------------------------------------
  const cubeLines = analysis.concreteRows.flatMap((row) => row.cubes.map((cube) => ({ row, cube })));
  const number = (value: number | undefined, places: number) =>
    typeof value === "number" && Number.isFinite(value) && value > 0 ? value.toFixed(places) : "—";

  table<(typeof cubeLines)[number]>(
    "Rezistenca në shtypje — kubikë betoni",
    [
      // Widths sum to the 277mm content width, and each header is short enough
      // to print inside its own column — a truncated column heading is the one
      // piece of text on the page a reader cannot infer from context.
      { header: "Kubi", width: 36, value: ({ cube }) => cube.specimenCode },
      {
        header: "Objekti / elementi",
        width: 66,
        value: ({ row }) => [row.element, row.projectName !== "—" ? row.projectName : ""].filter(Boolean).join(" · ")
      },
      { header: "Klasa", width: 17, value: ({ row }) => row.strengthClass },
      { header: "Betonimi", width: 21, value: ({ row }) => formatEuropeanDate(row.castingDate) },
      { header: "Prova", width: 21, value: ({ row }) => formatEuropeanDate(row.testDate) },
      { header: "Mosha", width: 14, align: "right", value: ({ cube }) => (cube.ageDays ? `${cube.ageDays} d` : "—") },
      { header: "Pesha (kg)", width: 19, align: "right", value: ({ cube }) => number(cube.weightKg, 2) },
      { header: "Ngark. (kN)", width: 21, align: "right", value: ({ cube }) => number(cube.loadKn, 1) },
      { header: "Rez. (MPa)", width: 24, align: "right", value: ({ cube }) => number(cube.strengthMpa, 2) },
      { header: "Targa", width: 25, value: ({ cube }) => cube.truckPlate ?? "—" },
      { header: "Raporti", width: 13, value: ({ row }) => row.reportNumber }
    ],
    cubeLines,
    "Konformiteti me klasën vlerësohet sipas EN 206 mbi të gjithë derdhjen dhe nuk deklarohet në këtë përmbledhje."
  );

  // --- projects ------------------------------------------------------------
  table<ClientAnalysis["projects"][number]>(
    "Objektet",
    [
      { header: "Objekti", width: 160, value: (row) => row.name },
      { header: "Mostra", width: 39, align: "right", value: (row) => String(row.samples) },
      { header: "Teste", width: 39, align: "right", value: (row) => String(row.tests) },
      { header: "Raporte", width: 39, align: "right", value: (row) => String(row.reports) }
    ],
    analysis.projects
  );

  // --- the invoice line ----------------------------------------------------
  //
  // Without the two money columns their 42mm goes back to the object and the
  // test, which are the columns that get cut short; the table still spans the
  // sheet rather than stopping two thirds of the way across it.
  const withPricing = input.includePricing !== false;
  table<ClientAnalysis["reportRows"][number]>(
    "Raportet e lëshuara",
    [
      { header: "Nr. raporti", width: 26, value: (row) => row.reportNumber },
      { header: "Nr. regjistri", width: 30, value: (row) => row.sampleCode },
      { header: "Objekti", width: withPricing ? 66 : 86, value: (row) => row.projectName },
      { header: "Testi", width: withPricing ? 74 : 96, value: (row) => row.testType },
      { header: "Data", width: 25, value: (row) => formatEuropeanDate(row.issuedAt) },
      { header: "Kodi", width: 14, value: (row) => row.code ?? "—" },
      ...(withPricing
        ? [
            { header: "Çmimi", width: 21, align: "right" as const, value: (row: ClientAnalysis["reportRows"][number]) => (row.unitPrice === undefined ? "—" : money(row.unitPrice)) },
            { header: "Vlera", width: 21, align: "right" as const, value: (row: ClientAnalysis["reportRows"][number]) => (row.value === undefined ? "—" : money(row.value)) }
          ]
        : [])
    ],
    analysis.reportRows
  );

  // --- what the period is worth --------------------------------------------
  //
  // Grouped by catalogue code, which is how an invoice reads: four hundred
  // identical cube reports are one line with a count, not four hundred lines.
  const pricing = analysis.pricing;
  if (withPricing && pricing.lines.length) {
    table<ClientAnalysis["pricing"]["lines"][number]>(
      "Vlera e punimeve për periudhën",
      [
        { header: "Kodi", width: 16, value: (row) => row.code },
        { header: "Testimi", width: 132, value: (row) => row.name },
        { header: "Njësia", width: 30, value: (row) => row.unit },
        { header: "Sasia", width: 20, align: "right", value: (row) => String(row.reports) },
        { header: "Çmimi njësi", width: 37, align: "right", value: (row) => money(row.unitPrice) },
        { header: "Vlera (pa TVSH)", width: 42, align: "right", value: (row) => money(row.value) }
      ],
      pricing.lines,
      pricing.offerNumbers.length
        ? `Çmimet sipas ofertës ${pricing.offerNumbers.map((nr) => `SL-OF-${nr}/2026`).join(", ")}; testimet jashtë ofertës çmimohen me listën 2026.`
        : "Çmimet sipas listës 2026 të SARP & LAB. Nuk ka ofertë të pranuar të lidhur me këto objekte."
    );

    // The totals, right-aligned under the value column.
    reserve(20);
    // On a framework contract the lines above are what the work was worth; the
    // bill is the agreed rate. Both are printed, because the client is
    // entitled to see the one and is invoiced the other.
    const totals: Array<[string, string, boolean]> = pricing.framework
      ? [
          ["Nëntotali (pa TVSH)", money(pricing.subtotal), false],
          ["Vlera e punës së kryer (me TVSH)", money(pricing.total), false],
          [
            `Tarifa mujore ${money(pricing.framework.rate)} × ${pricing.framework.months} muaj (pa TVSH)`,
            money(pricing.framework.contracted),
            false
          ],
          ["PËR FATURIM (me TVSH)", money(pricing.framework.contracted * (1 + pricing.vatRate)), true]
        ]
      : [
          ["Nëntotali (pa TVSH)", money(pricing.subtotal), false],
          [`TVSH ${Math.round(pricing.vatRate * 100)}%`, money(pricing.vat), false],
          ["TOTALI (me TVSH)", money(pricing.total), true]
        ];
    for (const [label, value, strong] of totals) {
      pdf.setFont("helvetica", strong ? "bold" : "normal");
      pdf.setFontSize(strong ? 9.5 : 8.5);
      pdf.text(label, PAGE_WIDTH_MM - MARGIN_MM - 42, y + 3.8, { align: "right" });
      pdf.text(`${value} ALL`, PAGE_WIDTH_MM - MARGIN_MM - 1, y + 3.8, { align: "right" });
      y += strong ? 7 : 5.6;
    }

    if (pricing.unpriced) {
      y += 2;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(150, 60, 60);
      pdf.text(
        `${pricing.unpriced} raport${pricing.unpriced === 1 ? "" : "e"} nuk u çmimuan sepse nuk lidhen me asnjë kod të katalogut dhe nuk janë përfshirë në total.`,
        MARGIN_MM,
        y + 3.8
      );
      pdf.setTextColor(INK.r, INK.g, INK.b);
      y += 7;
    }
    y += 4;
  }

  footer();
  return pdf.output("blob");
}

/** Loads a public image as a data URL, so jsPDF can embed it. */
export async function imageAsDataUrl(path: string): Promise<string | undefined> {
  try {
    const response = await fetch(path);
    if (!response.ok) return undefined;
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : undefined);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}
