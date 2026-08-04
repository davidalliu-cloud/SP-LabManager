import { createSupabaseBrowserClient } from "./supabase/client";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

async function renderElementToPdfBlob(element: HTMLElement): Promise<Blob> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const imageData = canvas.toDataURL("image/jpeg", 0.95);
  const pageHeightMm = (canvas.height * A4_WIDTH_MM) / canvas.width;

  if (pageHeightMm <= A4_HEIGHT_MM) {
    pdf.addImage(imageData, "JPEG", 0, 0, A4_WIDTH_MM, pageHeightMm);
  } else {
    let remainingCanvasHeightPx = canvas.height;
    const pageHeightPx = (canvas.width * A4_HEIGHT_MM) / A4_WIDTH_MM;
    let offsetPx = 0;
    let isFirstPage = true;

    while (remainingCanvasHeightPx > 0) {
      const sliceHeightPx = Math.min(pageHeightPx, remainingCanvasHeightPx);
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sliceHeightPx;
      const context = pageCanvas.getContext("2d");
      context?.drawImage(canvas, 0, offsetPx, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);

      if (!isFirstPage) pdf.addPage();
      pdf.addImage(pageCanvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, A4_WIDTH_MM, (sliceHeightPx * A4_WIDTH_MM) / canvas.width);

      offsetPx += sliceHeightPx;
      remainingCanvasHeightPx -= sliceHeightPx;
      isFirstPage = false;
    }
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
