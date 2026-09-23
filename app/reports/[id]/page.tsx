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
import { newShareToken, reportShareUrl } from "@/lib/report-link";

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const store = useLabStore();
  const [comments, setComments] = useState("");
  const [issueEmail, setIssueEmail] = useState("");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "generating" | "error">("idle");
  const [pdfError, setPdfError] = useState("");
  const reportSurfaceRef = useRef<HTMLDivElement>(null);
  const report = store.reports.find((item) => item.id === params.id);
  if (!report) return <PageHeader title="Raporti nuk u gjet" />;
  const activeReport = report;
  const test = store.tests.find((item) => item.id === activeReport.testId);
  const sample = store.samples.find((item) => item.id === activeReport.sampleId);
  const client = store.clients.find((item) => item.id === activeReport.clientId);
  const project = store.projects.find((item) => item.id === activeReport.projectId);
  const concrete = store.concreteTests.find((item) => item.testId === activeReport.testId);
  const concreteWater = store.concreteWaterPenetrationTests.find((item) => item.testId === activeReport.testId);
  const concreteFlexural = store.concreteFlexuralTests.find((item) => item.testId === activeReport.testId);
  const concreteDensity = store.concreteDensityTests.find((item) => item.testId === activeReport.testId);
  const concreteIndirectTensile = store.concreteIndirectTensileTests.find((item) => item.testId === activeReport.testId);
  const concreteCore = store.concreteCoreTests.find((item) => item.testId === activeReport.testId);
  const asphalt = store.asphaltTests.find((item) => item.testId === activeReport.testId);
  const thermalInsulation = store.thermalInsulationTests.find((item) => item.testId === activeReport.testId);
  const cementConsistency = store.cementConsistencyTests.find((item) => item.testId === activeReport.testId);
  const cementStrength = store.cementStrengthTests.find((item) => item.testId === activeReport.testId);
  const cementBlaine = store.cementBlaineTests.find((item) => item.testId === activeReport.testId);
  const admixture = store.admixtureTests.find((item) => item.testId === activeReport.testId);
  const masonryUnit = store.masonryUnitTests.find((item) => item.testId === activeReport.testId);
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
  // A superadmin rejecting a report that was already approved/issued/sent is an
  // override (the normal flow only rejects while "Pending Approval").
  const isRejectOverride = canReject && activeReport.reportStatus !== "Pending Approval";
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
  // A token is minted here but only committed when a message actually goes out,
  // and never replaces one the report already carries.
  const mintedShareToken = useRef(newShareToken());
  const shareToken = activeReport.shareToken ?? mintedShareToken.current;

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
    const surface = reportSurfaceRef.current?.querySelector<HTMLElement>(".print-surface");
    if (!surface) return;
    const originalTitle = document.title;
    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      surface.classList.remove("wet-signature");
      document.title = originalTitle;
      window.removeEventListener("afterprint", restore);
    };
    surface.classList.add("wet-signature");
    document.title = "";
    window.addEventListener("afterprint", restore);
    window.print();
    // Not every browser fires afterprint; restore is idempotent.
    window.setTimeout(restore, 1500);
  }

  async function generateStoredPdf() {
    const surface = reportSurfaceRef.current?.querySelector<HTMLElement>(".print-surface");
    if (!surface) return;
    setPdfStatus("generating");
    setPdfError("");
    try {
      const pdfUrl = await generateAndStoreReportPdf(surface, activeReport.reportNumber, activeReport.pdfUrl);
      store.setReportPdfUrl(activeReport.id, pdfUrl);
      setPdfStatus("idle");
    } catch (error) {
      setPdfStatus("error");
      setPdfError(error instanceof Error ? error.message : "Gabim i panjohur gjatë gjenerimit të PDF-së.");
    }
  }

  function sendReportToClient() {
    if (!recipientEmail || !canSendToClient) return;
    if (alreadySent && !confirmResend()) return;
    const shareUrl = activeReport.pdfUrl
      ? reportShareUrl(window.location.origin, activeReport.reportNumber, shareToken)
      : null;
    const subject = `Raporti laboratorik SARP LAB - ${activeReport.reportNumber}`;
    const body = [
      "Pershendetje,",
      "",
      `Raporti ${activeReport.reportNumber} eshte miratuar dhe gati per shqyrtim.`,
      "",
      // The short link rather than the storage URL, for the same reason as the
      // WhatsApp message: a hundred characters of bucket path and signing token
      // is a wall of noise the reader can only take on trust. `/reports/<id>`
      // was tried once and is worse — that page is behind a login the client
      // does not have.
      shareUrl
        ? `Shkarkoni PDF-ne e raportit: ${shareUrl}`
        : "PDF-ja e raportit do te dergohet ne nje email vijues.",
      "",
      "Me respekt,",
      "SARP LAB"
    ]
      .filter((line): line is string => line !== null)
      .join("\n");
    if (shareUrl) store.setReportShareToken(activeReport.id, shareToken);
    window.location.href = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    store.issueReport(activeReport.id, recipientEmail, `Dërguar me email: ${activeReport.reportNumber}`);
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
    const when = activeReport.issuedAt ? new Date(activeReport.issuedAt).toLocaleString("sq-AL") : "më parë";
    const where = activeReport.issuedTo ? ` te ${activeReport.issuedTo}` : "";
    return window.confirm(
      `Raporti ${activeReport.reportNumber} i është dërguar tashmë klientit${where} (${when}).\n\nDëshironi ta dërgoni përsëri?`
    );
  }

  function sendReportToWhatsApp() {
    if (!whatsAppNumber.ok || !canSendToClient) return;
    if (alreadySent && !confirmResend()) return;

    const shareUrl = activeReport.pdfUrl
      ? reportShareUrl(window.location.origin, activeReport.reportNumber, shareToken)
      : null;
    const message = [
      "Pershendetje,",
      "",
      `Raporti ${activeReport.reportNumber} eshte miratuar${sample?.sampleCode ? ` (kampioni ${sample.sampleCode})` : ""}.`,
      shareUrl ? "" : null,
      shareUrl ? shareUrl : "PDF-ja do t'ju dergohet me email.",
      "",
      "SARP & LAB sh.p.k."
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    // Fix the token before the message leaves, so the link in it resolves. It
    // is only ever set once, so sending again reuses the address the client
    // may already have.
    if (shareUrl) store.setReportShareToken(activeReport.id, shareToken);
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
          <ReportPreview report={activeReport} test={test} sample={sample} client={client} project={project} concrete={concrete} concreteWater={concreteWater} concreteFlexural={concreteFlexural} concreteDensity={concreteDensity} concreteIndirectTensile={concreteIndirectTensile} concreteCore={concreteCore} asphalt={asphalt} thermalInsulation={thermalInsulation} cementConsistency={cementConsistency} cementStrength={cementStrength} cementBlaine={cementBlaine} admixture={admixture} masonryUnit={masonryUnit} waterAnalysis={waterAnalysis} sclerometer={sclerometer} mortar={mortar} steel={steel} aggregate={aggregate} aggregateChemical={aggregateChemical} aggregateLosAngeles={aggregateLosAngeles} aggregateFreezeThaw={aggregateFreezeThaw} aggregateAcv={aggregateAcv} aggregateDensity={aggregateDensity} aggregateFillerDensity={aggregateFillerDensity} aggregateShapeIndex={aggregateShapeIndex} aggregateFlakiness={aggregateFlakiness} aggregateElongation={aggregateElongation} aggregateBulkDensity={aggregateBulkDensity} aggregateSandEquivalent={aggregateSandEquivalent} aggregateSoundness={aggregateSoundness} />
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
                  Si Administrator, mund ta refuzoni këtë raport dhe ta ktheni për korrigjim.
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
                disabled={!canSendToClient || !recipientEmail}
                className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Dërgo te klienti
              </button>

              {alreadySent ? (
                <div className="rounded-md border border-[#f0a93a] bg-brand-risk p-3 text-xs text-ink">
                  <div className="font-semibold">Ky raport i është dërguar tashmë klientit</div>
                  <p className="mt-1">
                    {activeReport.issuedVia === "whatsapp" ? "Me WhatsApp" : "Me email"}
                    {activeReport.issuedTo ? ` te ${activeReport.issuedTo}` : ""}
                    {activeReport.issuedAt ? `, më ${new Date(activeReport.issuedAt).toLocaleString("sq-AL")}` : ""}.
                    Mund ta dërgoni përsëri; do t'ju kërkohet të konfirmoni.
                  </p>
                </div>
              ) : null}

              {whatsAppNumber.ok ? (
                <button
                  onClick={sendReportToWhatsApp}
                  disabled={!canSendToClient}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1DA851] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden="true">
                    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24a8.18 8.18 0 0 1 5.82 2.42 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24Z" />
                  </svg>
                  Dërgo me WhatsApp
                </button>
              ) : (
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
              )}

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
