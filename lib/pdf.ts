import { createSupabaseBrowserClient } from "./supabase/client";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/**
 * Runs the capture with html2canvas measuring the font instead of the page.
 *
 * html2canvas does not lay the text out; it asks the DOM where each run of text
 * sits and then draws the glyphs on a baseline it works out separately. That
 * baseline comes from a probe element it appends to `document.body` — a span
 * and a 1px image, whose offsets it subtracts to find how far below the top of
 * the line the baseline falls. The probe sets the font family and size it is
 * asking about, but not a line-height, so it inherits the page's: this app
 * states `line-height: 24px` on the body, a fixed length, and the probe is
 * therefore measured in a 24px line whatever size it was asked about.
 *
 * Reports are set much tighter than that — 7 to 13px type on lines of 1.05 to
 * 1.2 — so the baseline comes back far too deep and every line of text in the
 * PDF is drawn that much lower than the browser draws it. The measurement, in
 * px below the top of the line, against the font's real ascent:
 *
 *     font      7     8    9.5   11.1  11.9  13.3    20
 *     true      6     7     8     10    11    12      18
 *     body=24  18    19    19     20    21    22      25
 *     body=0.4  7     8     9     10    11    12      17
 *
 * At report sizes it is out by ten px and more — most of a line — which is why
 * a rule drawn directly under a value came out through the middle of it, and
 * why on the masonry report, whose table rows are 12px tall, every row's text
 * sat on the row's own bottom border.
 *
 * Making the body line-height proportional for the duration of the capture
 * puts the probe back in a line the size of its own type, and the measurement
 * lands on the real ascent across the whole range of sizes the reports use. A
 * number rather than a length is the point; 0.4 is where the probe stops being
 * dominated by its line box and starts reporting the font (below about 0.3 it
 * undershoots instead). The report itself never sees this: every template sets
 * its own line-height at its root, so nothing inside inherits the body's.
 */
async function withFontMetricsFixed<T>(run: () => Promise<T>): Promise<T> {
  const previous = document.body.style.lineHeight;
  document.body.style.lineHeight = "0.4";
  try {
    return await run();
  } finally {
    document.body.style.lineHeight = previous;
  }
}

async function renderElementToPdfBlob(element: HTMLElement, options: PdfOptions = {}): Promise<Blob> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);

  // html2canvas renders the DOM under *screen* CSS and ignores @media print, so the
  // captured element must be put into its print (A4) layout explicitly. We toggle a
  // `.pdf-capture` class (which mirrors each report's @media print rules) on the
  // cloned document only, so the on-screen preview is never disturbed. Report
  // families that define a `.pdf-capture` mirror (concrete cube, official family)
  // render as a clean single-page A4; any others simply fall back to the normal
  // capture, which is still fitted onto one page below.
  const canvas = await withFontMetricsFixed(() => html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    // Pin the width the cloned document's media queries resolve against.
    // The reports use Tailwind's responsive grids (sm:grid-cols-2 and friends,
    // 28 of them), and those key off the viewport rather than the element. Left
    // to the operator's own window, a narrow screen collapsed a report's
    // metadata block to a single column, made the page ~50mm taller, and the
    // fit-to-page step below then shrank the whole report — so the same report
    // produced a different PDF on a laptop and on a wide monitor. A fixed width
    // wide enough to clear every breakpoint makes the output deterministic and
    // matches the layout the reports were designed in.
    // Reports are captured at a fixed width so the same report produces the
    // same PDF on a laptop and a wide monitor. A summary is captured at its own
    // on-screen width instead: its charts are SVG sized to the container they
    // were measured in, so re-laying the clone out at a different width leaves
    // the chart drawn at one size inside a box of another. Capturing what is on
    // screen is also the point of the summary — it should reach the client as
    // the operator saw it.
    windowWidth: options.captureWidth ?? 1400,
    windowHeight: 2000,
    onclone: (clonedDoc) => {
      clonedDoc
        .querySelectorAll(".print-surface")
        .forEach((node) => node.classList.add("pdf-capture"));
    }
  }));

  const landscape = options.orientation === "landscape";
  const pageWidthMm = landscape ? A4_HEIGHT_MM : A4_WIDTH_MM;
  const pageHeightMm = landscape ? A4_WIDTH_MM : A4_HEIGHT_MM;
  const pdf = new jsPDF({
    orientation: landscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
    compress: true
  });
  // Use PNG (lossless) rather than JPEG: the reports are thin 1px rules and small
  // text, which JPEG compression blurs and smears. PNG keeps the lines crisp.
  const naturalPageHeightMm = (canvas.height * pageWidthMm) / canvas.width;

  if (naturalPageHeightMm <= pageHeightMm) {
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pageWidthMm, naturalPageHeightMm);
    return pdf.output("blob");
  }

  if (!options.multiPage) {
    // A report is one sheet by definition, so content taller than the page is
    // shrunk to fit rather than split — a report continuing overleaf would be a
    // different document.
    const fittedWidthMm = (pageHeightMm / naturalPageHeightMm) * pageWidthMm;
    const xOffsetMm = (pageWidthMm - fittedWidthMm) / 2;
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", xOffsetMm, 0, fittedWidthMm, pageHeightMm);
    return pdf.output("blob");
  }

  // A client summary is as long as the month was. Shrinking a year of pours onto
  // one sheet would make it unreadable, so it is sliced across pages at the same
  // scale — the table simply continues, as a statement of account does.
  const pageHeightPx = Math.floor((canvas.width * pageHeightMm) / pageWidthMm);
  const slice = document.createElement("canvas");
  slice.width = canvas.width;
  const context = slice.getContext("2d");
  if (!context) throw new Error("Could not prepare the page canvas.");

  for (let offset = 0; offset < canvas.height; offset += pageHeightPx) {
    const sliceHeight = Math.min(pageHeightPx, canvas.height - offset);
    slice.height = sliceHeight;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, slice.width, sliceHeight);
    context.drawImage(canvas, 0, offset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
    if (offset > 0) pdf.addPage();
    pdf.addImage(
      slice.toDataURL("image/png"),
      "PNG",
      0,
      0,
      pageWidthMm,
      (sliceHeight * pageWidthMm) / canvas.width
    );
  }

  return pdf.output("blob");
}

export type PdfOptions = {
  orientation?: "portrait" | "landscape";
  /** Slice across pages instead of shrinking to fit one. */
  multiPage?: boolean;
  /**
   * Width the cloned document lays out against. Reports pin this so the same
   * report produces the same PDF on any screen; a summary passes its own width
   * so what is captured is what was on screen.
   */
  captureWidth?: number;
};

/**
 * Generates a PDF from the given report DOM node, uploads it to the private
 * "reports" Storage bucket, and returns a long-lived signed URL. Used so
 * "issued" reports become a real stored file instead of only the browser's
 * print dialog.
 */
export async function generateAndStoreReportPdf(
  element: HTMLElement,
  reportNumber: string,
  previousUrl?: string,
  options: PdfOptions = {}
): Promise<string> {
  const blob = await renderElementToPdfBlob(element, options);
  return storePdfBlob(blob, reportNumber, previousUrl);
}

/**
 * Uploads a finished PDF and returns a long-lived signed URL.
 *
 * Separate from the rendering above because the client summary builds its PDF
 * rather than photographing one, but stores it in exactly the same place.
 */
export async function storePdfBlob(blob: Blob, name: string, previousUrl?: string): Promise<string> {
  const supabase = createSupabaseBrowserClient();
  const safe = name.replace(/[^a-zA-Z0-9_-]/g, "_");
  // A unique filename per generation. Supabase's storage CDN caches objects by
  // path for a while, so overwriting one fixed name meant "Shkarko PDF-në e
  // ruajtur" could keep serving a stale, previously-generated copy. A fresh path
  // each time guarantees the download is always the just-generated file.
  const path = `${safe}-${Date.now()}.pdf`;

  const { error: uploadError } = await supabase.storage.from("reports").upload(path, blob, {
    contentType: "application/pdf",
    upsert: true,
    cacheControl: "0"
  });

  if (uploadError) {
    throw new Error(`Could not upload PDF: ${uploadError.message}`);
  }

  // Best-effort: delete the report's previous stored file so old copies don't pile
  // up. Derive its storage path from the previous signed URL.
  if (previousUrl) {
    const match = previousUrl.match(/\/reports\/([^?]+)/);
    const oldPath = match ? decodeURIComponent(match[1]) : undefined;
    if (oldPath && oldPath !== path) {
      await supabase.storage.from("reports").remove([oldPath]).catch(() => undefined);
    }
  }

  const oneYearInSeconds = 60 * 60 * 24 * 365;
  const { data, error: signError } = await supabase.storage.from("reports").createSignedUrl(path, oneYearInSeconds);

  if (signError || !data) {
    throw new Error(`Could not create a download link: ${signError?.message ?? "unknown error"}`);
  }

  return data.signedUrl;
}
