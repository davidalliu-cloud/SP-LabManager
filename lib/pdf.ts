import { createSupabaseBrowserClient } from "./supabase/client";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

async function renderElementToPdfBlob(element: HTMLElement): Promise<Blob> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);

  // html2canvas renders the DOM under *screen* CSS and ignores @media print, so the
  // captured element must be put into its print (A4) layout explicitly. We toggle a
  // `.pdf-capture` class (which mirrors each report's @media print rules) on the
  // cloned document only, so the on-screen preview is never disturbed. Report
  // families that define a `.pdf-capture` mirror (concrete cube, official family)
  // render as a clean single-page A4; any others simply fall back to the normal
  // capture, which is still fitted onto one page below.
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    onclone: (clonedDoc) => {
      clonedDoc
        .querySelectorAll(".print-surface")
        .forEach((node) => node.classList.add("pdf-capture"));
    }
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const imageData = canvas.toDataURL("image/jpeg", 0.95);
  const naturalPageHeightMm = (canvas.height * A4_WIDTH_MM) / canvas.width;

  if (naturalPageHeightMm <= A4_HEIGHT_MM) {
    pdf.addImage(imageData, "JPEG", 0, 0, A4_WIDTH_MM, naturalPageHeightMm);
  } else {
    // Content is taller than one page at full width: shrink the whole image
    // proportionally so it still fits on a single page, centered horizontally,
    // rather than splitting it across multiple pages.
    const fittedWidthMm = (A4_HEIGHT_MM / naturalPageHeightMm) * A4_WIDTH_MM;
    const xOffsetMm = (A4_WIDTH_MM - fittedWidthMm) / 2;
    pdf.addImage(imageData, "JPEG", xOffsetMm, 0, fittedWidthMm, A4_HEIGHT_MM);
  }

  return pdf.output("blob");
}

/**
 * Generates a PDF from the given report DOM node, uploads it to the private
 * "reports" Storage bucket, and returns a long-lived signed URL. Used so
 * "issued" reports become a real stored file instead of only the browser's
 * print dialog.
 */
export async function generateAndStoreReportPdf(element: HTMLElement, reportNumber: string): Promise<string> {
  const blob = await renderElementToPdfBlob(element);
  const supabase = createSupabaseBrowserClient();
  const path = `${reportNumber.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

  const { error: uploadError } = await supabase.storage.from("reports").upload(path, blob, {
    contentType: "application/pdf",
    upsert: true
  });

  if (uploadError) {
    throw new Error(`Could not upload PDF: ${uploadError.message}`);
  }

  const oneYearInSeconds = 60 * 60 * 24 * 365;
  const { data, error: signError } = await supabase.storage.from("reports").createSignedUrl(path, oneYearInSeconds);

  if (signError || !data) {
    throw new Error(`Could not create a download link: ${signError?.message ?? "unknown error"}`);
  }

  return data.signedUrl;
}
