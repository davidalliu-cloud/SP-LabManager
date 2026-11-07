"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { ReportPreview } from "@/components/reports/report-preview";
import { PageHeader } from "@/components/ui/page-header";
import { useLabStore } from "@/lib/lab-store";
import { canRejectReport, canReviewTests } from "@/lib/permissions";
import { generateAndStoreReportPdf } from "@/lib/pdf";
import { formatInternational, toWhatsAppNumber, whatsAppLink } from "@/lib/phone";
import { formatEuropeanDate } from "@/lib/date-format";
import { newShareToken, reportShareUrl } from "@/lib/report-link";
import { concreteResultLines, reportWhatsAppMessage } from "@/lib/report-message";


/**
 * The email body, written without Albanian diacritics.
 *
 * A mailto: address is handed to the operating system and then to whichever
 * mail client answers it, and that is a handoff this app does not control; the
 * bodies here have always been written in plain ASCII because of it. Folding
 * the text at the end rather than keeping a second hand-written copy means the
 * email and the WhatsApp message cannot drift apart in what they say — only in
 * how the letters are spelled.
 */
function toMailtoText(text: string) {
  return text
    .replace(/ë/g, "e")
    .replace(/Ë/g, "E")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C")
    .replace(/—/g, "-");
}
/**
 * Hands the draft to the mail client without taking this page down with it.
 *
 * `window.location.href = "mailto:…"` is a navigation: the browser passes the
 * address to the operating system and may unload the page on the way. The
 * register's save waits 2.5 seconds after a change, so the send recorded just
 * before that assignment never reached the server — five email sends are in the
 * audit log and were never in the register, which left a client holding a report
 * the register still called Approved. WhatsApp never lost one, because
 * window.open leaves the page running; a clicked link does the same.
 */
function openMailDraft(url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const store = useLabStore();
  const [comments, setComments] = useState("");
  const [issueEmail, setIssueEmail] = useState("");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "generating" | "error">("idle");
  const [pdfError, setPdfError] = useState("");
  const reportSurfaceRef = useRef<HTMLDivElement>(null);
  // Minted before the report is looked up rather than after, and that order is
  // load-bearing. This page is usually opened at its own address, where the
  // first render runs before the shared state has arrived and the lookup below
  // finds nothing. A hook sitting past that early return therefore runs on the
  // second render and not the first, which React treats as a broken component:
  // it threw "Rendered more hooks than during the previous render" and the page
  // showed a client-side exception instead of the report.
  //
  // The token itself is only committed when a message actually goes out, and
  // never replaces one the report already carries.
  const mintedShareToken = useRef(newShareToken());
  const report = store.reports.find((item) => item.id === params.id);
  // The shell holds every page back until the register has arrived, so a miss
  // here means the address really names no report — a link to a draft that was
  // never kept, or one deleted since. Say which, and give a way out: a bare
  // title left the reader on a dead page with the browser's back button.
  if (!report) {
    return (
      <>
        <PageHeader
          title="Raporti nuk u gjet"
          description="Kjo adresë nuk i përgjigjet asnjë raporti në regjistër. Hapni raportin nga lista ose nga testi përkatës."
        />
        <Link href="/reports" className="btn-secondary inline-block">Kthehu te raportet</Link>
      </>
    );
  }
  const activeReport = report;
  const test = store.tests.find((item) => item.id === activeReport.testId);
  const sample = store.samples.find((item) => item.id === activeReport.sampleId);
  // The accredited certificate names the client as the register holds it —
  // their legal name on their own paperwork — not the tidied display copy.
  const client = store.rawClients.find((item) => item.id === activeReport.clientId);
  const project = store.rawProjects.find((item) => item.id === activeReport.projectId);
  const concrete = store.concreteTests.find((item) => item.testId === activeReport.testId);
  const concreteWater = store.concreteWaterPenetrationTests.find((item) => item.testId === activeReport.testId);
  const concreteFlexural = store.concreteFlexuralTests.find((item) => item.testId === activeReport.testId);
  const concreteDensity = store.concreteDensityTests.find((item) => item.testId === activeReport.testId);
  const concreteIndirectTensile = store.concreteIndirectTensileTests.find((item) => item.testId === activeReport.testId);
  const concreteCore = store.concreteCoreTests.find((item) => item.testId === activeReport.testId);
  const asphalt = store.asphaltTests.find((item) => item.testId === activeReport.testId);
  const asphaltJobMix = store.asphaltJobMixTests.find((item) => item.testId === activeReport.testId);
  const thermalInsulation = store.thermalInsulationTests.find((item) => item.testId === activeReport.testId);
  const cementConsistency = store.cementConsistencyTests.find((item) => item.testId === activeReport.testId);
  const cementStrength = store.cementStrengthTests.find((item) => item.testId === activeReport.testId);
  const cementBlaine = store.cementBlaineTests.find((item) => item.testId === activeReport.testId);
  const admixture = store.admixtureTests.find((item) => item.testId === activeReport.testId);
  const masonryUnit = store.masonryUnitTests.find((item) => item.testId === activeReport.testId);
  const pavingElement = store.pavingElementTests.find((item) => item.testId === activeReport.testId);
  const waterAnalysis = store.waterAnalysisTests.find((item) => item.testId === activeReport.testId);
  const sclerometer = store.sclerometerTests.find((item) => item.testId === activeReport.testId);
  const mortar = store.mortarTests.find((item) => item.testId === activeReport.testId);
  const steel = store.steelTests.find((item) => item.testId === activeReport.testId);
  const aggregate = store.aggregateTests.find((item) => item.testId === activeReport.testId);
  const aggregateChemical = store.aggregateChemicalTests.find((item) => item.testId === activeReport.testId);
  const aggregateLosAngeles = store.aggregateLosAngelesTests.find((item) => item.testId === activeReport.testId);
  const aggregateFreezeThaw = store.aggregateFreezeThawTests.find((item) => item.testId === activeReport.testId);
  const aggregateAcv = store.aggregateAcvTests.find((item) => item.testId === activeReport.testId);
  const aggregateDensity = store.aggregateDensityAbsorptionTests.find((item) => item.testId === activeReport.testId);
  const aggregateFillerDensity = store.aggregateFillerDensityTests.find((item) => item.testId === activeReport.testId);
  const aggregateShapeIndex = store.aggregateShapeIndexTests.find((item) => item.testId === activeReport.testId);
  const aggregateFlakiness = store.aggregateFlakinessIndexTests.find((item) => item.testId === activeReport.testId);
  const aggregateElongation = store.aggregateElongationIndexTests.find((item) => item.testId === activeReport.testId);
  const aggregateBulkDensity = store.aggregateBulkDensityTests.find((item) => item.testId === activeReport.testId);
  const aggregateSandEquivalent = store.aggregateSandEquivalentTests.find((item) => item.testId === activeReport.testId);
  const aggregateSoundness = store.aggregateSoundnessTests.find((item) => item.testId === activeReport.testId);
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canReviewReport = canReviewTests(currentUser?.role);
  const canReject = canRejectReport(currentUser?.role, activeReport.reportStatus);
  // Rejecting anything past "Pending Approval" is an override, and the note
  // under the button says so in the reader's own terms: taking back an approval
  // is the reviewer's own doing, while pulling an issued report back is the
  // superadmin's.
  const isRejectOverride = canReject && activeReport.reportStatus !== "Pending Approval";
  const rejectOverrideNote =
    activeReport.reportStatus === "Approved"
      ? "Ky raport është miratuar. Refuzimi e heq miratimin dhe e kthen për korrigjim."
      : "Si Administrator, mund ta refuzoni këtë raport dhe ta ktheni për korrigjim.";
  // The client record is the source of truth for where reports go. Sending is
  // blocked until it has an email, rather than letting a one-off typed address
  // paper over it - 80 of 129 clients had none, and every send that worked
  // around it left the gap in place.
  const clientHasEmail = Boolean(client?.email);
  const recipientEmail = clientHasEmail ? issueEmail || client?.email || "" : "";
  // The same rule as the email address: the client card is where the number
  // lives. Most are written as 0672022609 or "Mob.: +355 69 808 1313", and a
  // few cards have an email address typed into the phone field, so the number
  // is parsed rather than trusted.
  const whatsAppNumber = toWhatsAppNumber(client?.phone);
  const alreadySent = activeReport.reportStatus === "Sent to Client";
  // Sending again is allowed; the confirmation in sendReportToWhatsApp is what
  // makes it deliberate.
  const canSendToClient = activeReport.reportStatus === "Approved" || alreadySent;
  const shareToken = activeReport.shareToken ?? mintedShareToken.current;

  /**
   * The sheets this report is made of, in page order.
   *
   * One for almost every report. The granulometry certificate is written as
   * two — the sieve table, then the grading curve — because squeezed onto one
   * sheet the curve was 48mm tall and the table's rows were a pixel apart.
   */
  function reportSheets() {
    return Array.from(reportSurfaceRef.current?.querySelectorAll<HTMLElement>(".print-surface") ?? []);
  }

  function downloadApprovedPdf() {
    const originalTitle = document.title;
    document.title = "";
    window.print();
    window.setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  }

  /**
   * The copy that goes out on paper and is signed in pen.
   *
   * Same sheet as the signed one, with the signature and stamp left blank —
   * they are one image per column, so a single class covers both. The image
   * keeps its box rather than being removed, so the page geometry is identical
   * to the signed copy and there is room to actually sign.
   *
   * Deliberately print-only. The email attaches the *stored* PDF, so anything
   * unsigned that reached storage could later be sent to a client as if it were
   * an issued report. Nothing here writes to storage.
   */
  function printForWetSignature() {
    // Every sheet, not just the first: a report written as two pages — the
    // granulometry certificate is — would otherwise print its second page with
    // the signature already on it.
    const surfaces = reportSheets();
    if (!surfaces.length) return;
    const originalTitle = document.title;
    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      surfaces.forEach((surface) => surface.classList.remove("wet-signature"));
      document.title = originalTitle;
      window.removeEventListener("afterprint", restore);
    };
    surfaces.forEach((surface) => surface.classList.add("wet-signature"));
    document.title = "";
    window.addEventListener("afterprint", restore);
    window.print();
    // Not every browser fires afterprint; restore is idempotent.
    window.setTimeout(restore, 1500);
  }

  async function generateStoredPdf() {
    const surfaces = reportSheets();
    if (!surfaces.length) return;
    setPdfStatus("generating");
    setPdfError("");
    try {
      const pdfUrl = await generateAndStoreReportPdf(surfaces, activeReport.reportNumber, activeReport.pdfUrl);
      store.setReportPdfUrl(activeReport.id, pdfUrl);
      setPdfStatus("idle");
    } catch (error) {
      setPdfStatus("error");
      setPdfError(error instanceof Error ? error.message : "Gabim i panjohur gjatë gjenerimit të PDF-së.");
    }
  }

  function sendReportToClient() {
    if (!recipientEmail || !canSendToClient) return;
    // The same rule as WhatsApp: the stored PDF is the report. This used to
    // send regardless, with a line promising the PDF would arrive in a later
    // email, and then record the report as issued — so §7.8 said the client
    // had their report while the client had a promise. No PDF, no send.
    if (!activeReport.pdfUrl) {
      window.alert(
        "Ky raport nuk ka PDF të ruajtur, kështu që klienti nuk do të marrë raportin.\n\nShtypni “Gjenero PDF” dhe provoni përsëri."
      );
      return;
    }
    if (alreadySent && !confirmResend()) return;
    const shareUrl = reportShareUrl(window.location.origin, activeReport.reportNumber, shareToken);
    const subject = `Raporti laboratorik SARP LAB - ${activeReport.reportNumber}`;
    const body = toMailtoText(
      [
        "Pershendetje,",
        "",
        `Raporti ${activeReport.reportNumber} eshte miratuar dhe gati per shqyrtim.`,
        // Labelled as the certificate labels it, so the reader is looking at
        // the same words in the email and on the sheet.
        test?.testType ? `Testimi: ${test.testType}` : undefined,
        // The pour date and the strengths, for a cube report only — the same
        // lines, from the same helpers, as the WhatsApp message.
        ...concreteResultLines(messageItem(shareUrl)),
        "",
        // The short link rather than the storage URL, for the same reason as the
        // WhatsApp message: a hundred characters of bucket path and signing token
        // is a wall of noise the reader can only take on trust. `/reports/<id>`
        // was tried once and is worse — that page is behind a login the client
        // does not have.
        `Shkarkoni PDF-ne e raportit: ${shareUrl}`,
        "",
        "Me respekt,",
        "SARP LAB"
      ]
        .filter((line): line is string => line !== undefined)
        .join("\n")
    );
    // Recorded first, then handed over: whatever the mail client does to this
    // page afterwards, the register already knows the report went out.
    store.setReportShareToken(activeReport.id, shareToken);
    store.issueReport(activeReport.id, recipientEmail, `Dërguar me email: ${activeReport.reportNumber}`);
    openMailDraft(`mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  }

  /**
   * Hands the report to WhatsApp with the message already written, and leaves
   * the send itself to whoever is at the keyboard — the same shape as the email
   * button above, which opens a draft rather than sending one.
   *
   * The message carries the link to the stored PDF rather than the result. A
   * strength typed into a chat is an uncontrolled result, and transcription is
   * exactly where those go wrong.
   */
  /**
   * Sending again is allowed and sometimes necessary, but it should be a
   * decision rather than a slip: the client already has this report, and a
   * second copy arriving unexplained invites them to ask which one counts.
   */
  function confirmResend() {
    // The last send, which is the one the client remembers; issuedAt is the
    // issue date and does not move.
    const lastSent = activeReport.lastIssuedAt ?? activeReport.issuedAt;
    const when = lastSent ? new Date(lastSent).toLocaleString("sq-AL") : "më parë";
    const where = activeReport.issuedTo ? ` te ${activeReport.issuedTo}` : "";
    return window.confirm(
      `Raporti ${activeReport.reportNumber} i është dërguar tashmë klientit${where} (${when}).\n\nDëshironi ta dërgoni përsëri?`
    );
  }

  /** What the message builder needs about this report, in one place. */
  function messageItem(shareUrl: string) {
    return { report: activeReport, test, sample, concrete, shareUrl };
  }

  function sendReportToWhatsApp() {
    if (!whatsAppNumber.ok || !canSendToClient) return;
    // No stored PDF means no report at the other end. This used to send anyway,
    // with a line promising the PDF would follow by email, and then record the
    // report as issued — so §7.8 said the client had it while the client had a
    // message and nothing else. The PDF is the thing being sent; without one
    // there is nothing to send.
    if (!activeReport.pdfUrl) {
      window.alert(
        "Ky raport nuk ka PDF të ruajtur, kështu që klienti nuk do të marrë raportin.\n\nShtypni “Gjenero PDF” dhe provoni përsëri."
      );
      return;
    }
    if (alreadySent && !confirmResend()) return;

    const shareUrl = reportShareUrl(window.location.origin, activeReport.reportNumber, shareToken);
    const message = reportWhatsAppMessage([messageItem(shareUrl)]);

    // Fix the token before the message leaves, so the link in it resolves. It
    // is only ever set once, so sending again reuses the address the client
    // may already have.
    store.setReportShareToken(activeReport.id, shareToken);
    window.open(whatsAppLink(whatsAppNumber.e164, message), "_blank", "noopener");
    store.issueReport(
      activeReport.id,
      formatInternational(whatsAppNumber.e164),
      `Dërguar me WhatsApp: ${activeReport.reportNumber}`,
      "whatsapp"
    );
  }

  return (
    <>
      <div className="no-print">
        <PageHeader title={activeReport.reportNumber} description="Përgatitja, miratimi, shkarkimi PDF dhe dërgimi i raportit te klienti." />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div ref={reportSurfaceRef}>
          <ReportPreview report={activeReport} test={test} sample={sample} client={client} project={project} concrete={concrete} concreteWater={concreteWater} concreteFlexural={concreteFlexural} concreteDensity={concreteDensity} concreteIndirectTensile={concreteIndirectTensile} concreteCore={concreteCore} asphalt={asphalt} asphaltJobMix={asphaltJobMix} thermalInsulation={thermalInsulation} cementConsistency={cementConsistency} cementStrength={cementStrength} cementBlaine={cementBlaine} admixture={admixture} masonryUnit={masonryUnit} pavingElement={pavingElement} waterAnalysis={waterAnalysis} sclerometer={sclerometer} mortar={mortar} steel={steel} aggregate={aggregate} aggregateChemical={aggregateChemical} aggregateLosAngeles={aggregateLosAngeles} aggregateFreezeThaw={aggregateFreezeThaw} aggregateAcv={aggregateAcv} aggregateDensity={aggregateDensity} aggregateFillerDensity={aggregateFillerDensity} aggregateShapeIndex={aggregateShapeIndex} aggregateFlakiness={aggregateFlakiness} aggregateElongation={aggregateElongation} aggregateBulkDensity={aggregateBulkDensity} aggregateSandEquivalent={aggregateSandEquivalent} aggregateSoundness={aggregateSoundness} />
        </div>
        <aside className="no-print space-y-4">
          <div className="surface-card p-4">
            <h2 className="text-base font-semibold text-ink">Veprimet e miratimit</h2>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => store.submitReport(activeReport.id)}
                disabled={!["Report Drafted", "Rejected"].includes(activeReport.reportStatus)}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Dërgo për miratim
              </button>
              <button
                onClick={() => store.approveReport(activeReport.id)}
                disabled={activeReport.reportStatus !== "Pending Approval" || !canReviewReport}
                className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Mirato raportin
              </button>
              <textarea
                value={comments}
                onChange={(event) => setComments(event.target.value)}
                rows={3}
                placeholder="Komentet e refuzimit"
                className="input"
              />
              <button
                onClick={() => store.rejectReport(activeReport.id, comments || "Ju lutemi korrigjoni të dhënat e raportit dhe dërgojeni përsëri për miratim.")}
                disabled={!canReject}
                className="w-full rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-lab-red transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-line disabled:text-slate-400"
              >
                Refuzo raportin
              </button>
              {isRejectOverride ? (
                <p className="text-xs text-lab-red">
                  {rejectOverrideNote}
                </p>
              ) : null}
            </div>
          </div>

          <div className="surface-card p-4">
            <h2 className="text-base font-semibold text-ink">Dërgimi te klienti</h2>
            <div className="mt-4 space-y-3">
              <button
                onClick={generateStoredPdf}
                disabled={!["Approved", "Issued", "Sent to Client"].includes(activeReport.reportStatus) || pdfStatus === "generating"}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {pdfStatus === "generating" ? "Duke gjeneruar PDF..." : "Gjenero dhe ruaj PDF"}
              </button>
              {pdfStatus === "error" ? <p className="text-xs text-lab-red">{pdfError}</p> : null}
              {activeReport.pdfUrl ? (
                <a href={activeReport.pdfUrl} target="_blank" rel="noreferrer" className="btn-secondary block w-full text-center">
                  Shkarko PDF-në e ruajtur
                </a>
              ) : null}
              <button onClick={printForWetSignature} className="btn-secondary w-full">
                Printo për firmë me dorë
              </button>
              <p className="text-xs leading-snug text-muted">
                Kopja e printuar del pa firmë dhe pa vulë, që të firmoset me stilolaps. PDF-ja e ruajtur dhe ajo që i
                dërgohet klientit mbeten të firmosura.
              </p>
              <button onClick={downloadApprovedPdf} className="w-full text-xs font-medium text-muted underline hover:text-lab-burgundy">
                Ose printo kopjen e firmosur
              </button>
              {clientHasEmail ? (
                <input
                  value={issueEmail}
                  onChange={(event) => setIssueEmail(event.target.value)}
                  placeholder={client?.email ?? "Email i klientit"}
                  className="input"
                />
              ) : (
                <div className="rounded-md border border-[#ff3d3d] bg-brand-late p-3 text-xs text-ink">
                  <div className="font-semibold">Klienti nuk ka email të regjistruar</div>
                  <p className="mt-1">
                    Raportet dërgohen te adresa e ruajtur në kartelën e klientit. Shtojeni një herë dhe do të përdoret çdo herë tjetër.
                  </p>
                  {client ? (
                    <Link href={`/clients/${client.id}`} className="mt-2 inline-block font-semibold text-lab-burgundy hover:underline">
                      Shto email për {client.clientCode}
                    </Link>
                  ) : null}
                </div>
              )}
              <button
                onClick={sendReportToClient}
                disabled={!canSendToClient || !recipientEmail || !activeReport.pdfUrl}
                className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Dërgo te klienti
              </button>
              {/* Covers both sends: without a stored PDF neither of them has a
                  report to deliver, so both buttons are off and this says why. */}
              {canSendToClient && !activeReport.pdfUrl ? (
                <p className="rounded-md border border-line bg-lab-porcelain p-3 text-xs text-muted">
                  Dërgimi është i bllokuar derisa raporti të ketë një PDF të ruajtur — ai PDF është ajo që merr
                  klienti. Shtypni “Gjenero PDF” më sipër.
                </p>
              ) : null}

              {alreadySent ? (
                <div className="rounded-md border border-[#f0a93a] bg-brand-risk p-3 text-xs text-ink">
                  <div className="font-semibold">Ky raport i është dërguar tashmë klientit</div>
                  <p className="mt-1">
                    {activeReport.issuedVia === "whatsapp" ? "Me WhatsApp" : "Me email"}
                    {activeReport.issuedTo ? ` te ${activeReport.issuedTo}` : ""}
                    {activeReport.lastIssuedAt || activeReport.issuedAt
                      ? `, më ${new Date((activeReport.lastIssuedAt ?? activeReport.issuedAt) as string).toLocaleString("sq-AL")}`
                      : ""}.
                    Mund ta dërgoni përsëri; do t'ju kërkohet të konfirmoni.
                    {activeReport.lastIssuedAt && activeReport.issuedAt && activeReport.lastIssuedAt !== activeReport.issuedAt
                      ? ` Data e lëshimit mbetet ${formatEuropeanDate(activeReport.issuedAt)}.`
                      : ""}
                  </p>
                </div>
              ) : null}

              {whatsAppNumber.ok ? (
                <button
                  onClick={sendReportToWhatsApp}
                  disabled={!canSendToClient || !activeReport.pdfUrl}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1DA851] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24a8.18 8.18 0 0 1 5.82 2.42 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24Z" />
                  </svg>
                  Dërgo me WhatsApp
                </button>
              ) : null}
              {!whatsAppNumber.ok ? (
                <p className="rounded-md border border-line bg-lab-porcelain p-3 text-xs text-muted">
                  {whatsAppNumber.reason === "not-a-mobile"
                    ? "Numri i klientit nuk është celular, prandaj nuk mund të marrë WhatsApp."
                    : "Klienti nuk ka numër celulari të regjistruar për WhatsApp."}
                  {client ? (
                    <Link href={`/clients/${client.id}`} className="ml-1 font-semibold text-lab-burgundy hover:underline">
                      Shto numrin për {client.clientCode}
                    </Link>
                  ) : null}
                </p>
              ) : null}

              <p className="text-xs text-muted">Ky veprim lejohet vetëm pas statusit Miratuar dhe e ndryshon statusin në Dërguar klientit.</p>
            </div>
          </div>
          {activeReport.rejectionComments ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-lab-red">
              <div className="font-semibold">Komentet e refuzimit</div>
              <div className="mt-1">{activeReport.rejectionComments}</div>
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}
