"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { ReportPreview } from "@/components/reports/report-preview";
import { PageHeader } from "@/components/ui/page-header";
import { useLabStore } from "@/lib/lab-store";

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const store = useLabStore();
  const [comments, setComments] = useState("");
  const [issueEmail, setIssueEmail] = useState("");
  const report = store.reports.find((item) => item.id === params.id);
  if (!report) return <PageHeader title="Raporti nuk u gjet" />;
  const test = store.tests.find((item) => item.id === report.testId);
  const sample = store.samples.find((item) => item.id === report.sampleId);
  const client = store.clients.find((item) => item.id === report.clientId);
  const project = store.projects.find((item) => item.id === report.projectId);
  const concrete = store.concreteTests.find((item) => item.testId === report.testId);
  const concreteWater = store.concreteWaterPenetrationTests.find((item) => item.testId === report.testId);
  const concreteFlexural = store.concreteFlexuralTests.find((item) => item.testId === report.testId);
  const concreteDensity = store.concreteDensityTests.find((item) => item.testId === report.testId);
  const concreteIndirectTensile = store.concreteIndirectTensileTests.find((item) => item.testId === report.testId);
  const thermalInsulation = store.thermalInsulationTests.find((item) => item.testId === report.testId);
  const cementConsistency = store.cementConsistencyTests.find((item) => item.testId === report.testId);
  const cementStrength = store.cementStrengthTests.find((item) => item.testId === report.testId);
  const cementBlaine = store.cementBlaineTests.find((item) => item.testId === report.testId);
  const steel = store.steelTests.find((item) => item.testId === report.testId);
  const aggregate = store.aggregateTests.find((item) => item.testId === report.testId);
  const aggregateChemical = store.aggregateChemicalTests.find((item) => item.testId === report.testId);
  const aggregateLosAngeles = store.aggregateLosAngelesTests.find((item) => item.testId === report.testId);
  const aggregateFreezeThaw = store.aggregateFreezeThawTests.find((item) => item.testId === report.testId);
  const aggregateAcv = store.aggregateAcvTests.find((item) => item.testId === report.testId);
  const aggregateDensity = store.aggregateDensityAbsorptionTests.find((item) => item.testId === report.testId);
  const aggregateFillerDensity = store.aggregateFillerDensityTests.find((item) => item.testId === report.testId);
  const aggregateShapeIndex = store.aggregateShapeIndexTests.find((item) => item.testId === report.testId);
  const aggregateFlakiness = store.aggregateFlakinessIndexTests.find((item) => item.testId === report.testId);
  const aggregateElongation = store.aggregateElongationIndexTests.find((item) => item.testId === report.testId);
  const aggregateBulkDensity = store.aggregateBulkDensityTests.find((item) => item.testId === report.testId);
  const aggregateSandEquivalent = store.aggregateSandEquivalentTests.find((item) => item.testId === report.testId);
  const aggregateSoundness = store.aggregateSoundnessTests.find((item) => item.testId === report.testId);

  return (
    <>
      <PageHeader title={report.reportNumber} description="Përgatitja, miratimi, shkarkimi PDF dhe lëshimi i raportit." />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <ReportPreview report={report} test={test} sample={sample} client={client} project={project} concrete={concrete} concreteWater={concreteWater} concreteFlexural={concreteFlexural} concreteDensity={concreteDensity} concreteIndirectTensile={concreteIndirectTensile} thermalInsulation={thermalInsulation} cementConsistency={cementConsistency} cementStrength={cementStrength} cementBlaine={cementBlaine} steel={steel} aggregate={aggregate} aggregateChemical={aggregateChemical} aggregateLosAngeles={aggregateLosAngeles} aggregateFreezeThaw={aggregateFreezeThaw} aggregateAcv={aggregateAcv} aggregateDensity={aggregateDensity} aggregateFillerDensity={aggregateFillerDensity} aggregateShapeIndex={aggregateShapeIndex} aggregateFlakiness={aggregateFlakiness} aggregateElongation={aggregateElongation} aggregateBulkDensity={aggregateBulkDensity} aggregateSandEquivalent={aggregateSandEquivalent} aggregateSoundness={aggregateSoundness} />
        <aside className="no-print space-y-4">
          <div className="surface-card p-4">
            <h2 className="text-base font-semibold text-ink">Veprimet e miratimit</h2>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => store.submitReport(report.id)}
                disabled={!["Report Drafted", "Rejected"].includes(report.reportStatus)}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Dërgo për miratim
              </button>
              <button
                onClick={() => store.approveReport(report.id)}
                disabled={report.reportStatus !== "Pending Approval"}
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
                onClick={() => store.rejectReport(report.id, comments || "Ju lutemi korrigjoni të dhënat e raportit dhe dërgojeni përsëri për miratim.")}
                disabled={report.reportStatus !== "Pending Approval"}
                className="w-full rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-lab-red transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-line disabled:text-slate-400"
              >
                Refuzo raportin
              </button>
            </div>
          </div>

          <div className="surface-card p-4">
            <h2 className="text-base font-semibold text-ink">Lëshimi i raportit</h2>
            <div className="mt-4 space-y-3">
              <button
                onClick={() => window.print()}
                disabled={report.reportStatus !== "Approved" && report.reportStatus !== "Issued"}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Shkarko PDF-në e miratuar
              </button>
              <input
                value={issueEmail}
                onChange={(event) => setIssueEmail(event.target.value)}
                placeholder={client?.email ?? "Email i klientit"}
                className="input"
              />
              <button
                onClick={() => store.issueReport(report.id, issueEmail || client?.email || "")}
                disabled={report.reportStatus !== "Approved"}
                className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Shëno si të lëshuar
              </button>
            </div>
          </div>
          {report.rejectionComments ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-lab-red">
              <div className="font-semibold">Komentet e refuzimit</div>
              <div className="mt-1">{report.rejectionComments}</div>
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}
