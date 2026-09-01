"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { ReportPreview } from "@/components/reports/report-preview";
import { PageHeader } from "@/components/ui/page-header";
import { useLabStore } from "@/lib/lab-store";
import { canRejectReport, canReviewTests } from "@/lib/permissions";
import { generateAndStoreReportPdf } from "@/lib/pdf";

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

  function downloadApprovedPdf() {
    const originalTitle = document.title;
    document.title = "";
    window.print();
    window.setTimeout(() => {
      document.title = originalTitle;
    }, 500);
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
    if (!recipientEmail || activeReport.reportStatus !== "Approved") return;
    const subject = `Raporti laboratorik SARP LAB - ${activeReport.reportNumber}`;
    const body = [
      "Pershendetje,",
      "",
      `Raporti ${activeReport.reportNumber} eshte miratuar dhe gati per shqyrtim.`,
      "",
      // Only the stored PDF's signed URL. `${origin}/reports/${id}` used to be
      // included too, but that is a page inside this app behind a login - a
      // client receiving it could never open it.
      activeReport.pdfUrl
        ? `Shkarkoni PDF-ne e raportit: ${activeReport.pdfUrl}`
        : "PDF-ja e raportit do te dergohet ne nje email vijues.",
      "",
      "Me respekt,",
      "SARP LAB"
    ]
      .filter((line): line is string => line !== null)
      .join("\n");
    window.location.href = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    store.issueReport(activeReport.id, recipientEmail, `Dërguar me email: ${activeReport.reportNumber}`);
  }

  return (
    <>
      <div className="no-print">
        <PageHeader title={activeReport.reportNumber} description="Përgatitja, miratimi, shkarkimi PDF dhe dërgimi i raportit te klienti." />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div ref={reportSurfaceRef}>
          <ReportPreview report={activeReport} test={test} sample={sample} client={client} project={project} concrete={concrete} concreteWater={concreteWater} concreteFlexural={concreteFlexural} concreteDensity={concreteDensity} concreteIndirectTensile={concreteIndirectTensile} concreteCore={concreteCore} asphalt={asphalt} thermalInsulation={thermalInsulation} cementConsistency={cementConsistency} cementStrength={cementStrength} cementBlaine={cementBlaine} admixture={admixture} mortar={mortar} steel={steel} aggregate={aggregate} aggregateChemical={aggregateChemical} aggregateLosAngeles={aggregateLosAngeles} aggregateFreezeThaw={aggregateFreezeThaw} aggregateAcv={aggregateAcv} aggregateDensity={aggregateDensity} aggregateFillerDensity={aggregateFillerDensity} aggregateShapeIndex={aggregateShapeIndex} aggregateFlakiness={aggregateFlakiness} aggregateElongation={aggregateElongation} aggregateBulkDensity={aggregateBulkDensity} aggregateSandEquivalent={aggregateSandEquivalent} aggregateSoundness={aggregateSoundness} />
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
              <button onClick={downloadApprovedPdf} className="w-full text-xs font-medium text-muted underline hover:text-lab-burgundy">
                Ose printo/shfaq për printim manual
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
                disabled={activeReport.reportStatus !== "Approved" || !recipientEmail}
                className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Dërgo te klienti
              </button>
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
