"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SummaryCard } from "@/components/ui/summary-card";
import { useLabStore } from "@/lib/lab-store";
import { canAssignSampleClient, canViewClientIdentity } from "@/lib/permissions";

export default function SampleDetailPage() {
  const params = useParams<{ id: string }>();
  const store = useLabStore();
  const [assignmentClientId, setAssignmentClientId] = useState("");
  const [assignmentProjectId, setAssignmentProjectId] = useState("");
  const sample = store.samples.find((item) => item.id === params.id);

  if (!sample) {
    return <PageHeader title="Kampioni nuk u gjet" description="Kampioni i zgjedhur nuk u gjet në regjistër." />;
  }

  const client = store.clients.find((item) => item.id === sample.clientId);
  const project = store.projects.find((item) => item.id === sample.projectId);
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentity = canViewClientIdentity(currentUser?.role);
  const canAssignClient = canAssignSampleClient(currentUser?.role);
  const selectedAssignmentClientId = assignmentClientId || sample.clientId || store.clients[0]?.id || "";
  const assignmentProjects = store.projects.filter((item) => item.clientId === selectedAssignmentClientId);
  const selectedAssignmentProjectId = assignmentProjectId || sample.projectId || assignmentProjects[0]?.id || "";
  const tests = store.tests.filter((item) => item.sampleId === sample.id);
  const reports = store.reports.filter((item) => item.sampleId === sample.id);
  const finishedStatuses = ["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"];
  const completedCubes = tests
    .filter((test) => finishedStatuses.includes(test.status))
    .reduce((sum, test) => sum + test.cubeCount, 0);
  const remainingCubes = Math.max(0, sample.quantity - completedCubes);
  const nextTest = tests.find((test) => ["Pending", "Scheduled", "In Progress"].includes(test.status));

  function submitAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sample) return;
    const form = new FormData(event.currentTarget);
    store.assignSampleClient(sample.id, String(form.get("clientId")), String(form.get("projectId")));
  }

  return (
    <>
      <PageHeader
        title={sample.sampleCode}
        description="Detajet e kampionit, plani i testimit, raportet e lidhura dhe progresi."
        action={<StatusBadge status={sample.status} />}
      />

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total kube të pranuara" value={sample.quantity} />
        <SummaryCard label="Kube të testuara" value={completedCubes} tone="green" />
        <SummaryCard label="Kube të mbetura" value={remainingCubes} tone={remainingCubes ? "amber" : "green"} />
        <SummaryCard label="Raporte të krijuara" value={reports.length} tone="purple" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="space-y-5">
          <div className="surface-card p-5">
            <h2 className="text-base font-semibold text-ink">Informacioni i kampionit</h2>
            <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
              <Info label="Kodi i klientit" value={client?.clientCode ?? "Në pritje të caktimit nga Kryelaboranti"} />
              <Info label="Projekti" value={showClientIdentity ? project?.projectName ?? "Në pritje të caktimit" : "I kufizuar"} />
              <Info label="Vendndodhja e projektit" value={showClientIdentity ? project?.location : "I kufizuar"} />
              <Info label="Tipi i kampionit" value={sample.sampleType} />
              <Info label="Data e pranimit" value={sample.dateReceived} />
              <Info label="Ora e pranimit" value={sample.timeReceived} />
              <Info label="Mënyra e dorëzimit" value={sample.collectionMethod} />
              <Info label="Dorëzuar nga" value={sample.deliveredBy} />
              <Info label="Marrë nga" value={sample.collectedBy} />
              <Info label="Testi i kërkuar" value={sample.requestedTestType} />
              <Info label="Standardi" value={sample.standard} />
              <Info label="Afati i raportit" value={sample.reportDueDate} />
              <div className="md:col-span-3">
                <Info label="Përshkrimi" value={sample.sampleDescription} />
              </div>
              <div className="md:col-span-3">
                <Info label="Shënime" value={sample.notes || "-"} />
              </div>
            </div>
          </div>

          <div className="surface-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-ink">Plani i testimit</h2>
              {nextTest ? (
                <Link href={`/tests/${nextTest.id}`} className="btn-primary px-3">
                  Hap testin e radhës
                </Link>
              ) : null}
            </div>
            <div className="overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="table-head">
                  <tr>
                    <th className="px-4 py-3">ID e testit</th>
                    <th className="px-4 py-3">Grupi</th>
                    <th className="px-4 py-3">Mosha</th>
                    <th className="px-4 py-3">Data e kërkuar</th>
                    <th className="px-4 py-3">Afati i raportit</th>
                    <th className="px-4 py-3">Statusi</th>
                    <th className="px-4 py-3">Veprim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {tests.map((test) => (
                    <tr key={test.id}>
                      <td className="px-4 py-3 font-semibold text-ink">{test.testCode}</td>
                      <td className="px-4 py-3">{test.cubeCount} kube</td>
                      <td className="px-4 py-3">{test.scheduledAgeDays} ditë</td>
                      <td className="px-4 py-3">{test.requiredTestDate}</td>
                      <td className="px-4 py-3">{test.dueDate}</td>
                      <td className="px-4 py-3"><StatusBadge status={test.status} /></td>
                      <td className="px-4 py-3"><Link href={`/tests/${test.id}`} className="font-semibold text-lab-burgundy hover:text-lab-purple">Hap</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="surface-card p-5">
            <h2 className="text-base font-semibold text-ink">Aksesi i klientit</h2>
            <p className="mt-2 text-sm text-muted">
              Identiteti i klientit është i kufizuar për të ruajtur paanshmërinë gjatë testimit. Teknikët shohin vetëm kodin e klientit.
            </p>
            {canAssignClient ? (
              <form onSubmit={submitAssignment} className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-ink">
                  Cakto klientin
                  <select
                    name="clientId"
                    value={selectedAssignmentClientId}
                    onChange={(event) => {
                      const nextClientId = event.target.value;
                      setAssignmentClientId(nextClientId);
                      setAssignmentProjectId(store.projects.find((item) => item.clientId === nextClientId)?.id ?? "");
                    }}
                    className="input mt-1"
                  >
                    {store.clients.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.clientCode} - {item.clientName}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-ink">
                  Cakto projektin
                  <select name="projectId" value={selectedAssignmentProjectId} onChange={(event) => setAssignmentProjectId(event.target.value)} className="input mt-1">
                    {assignmentProjects.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.projectName}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="btn-primary w-full">Ruaj caktimin e klientit</button>
              </form>
            ) : null}
            {showClientIdentity ? (
              <div className="mt-4 space-y-3 text-sm">
                <Info label="Emri i klientit" value={client?.clientName} />
                <Info label="Kontakti" value={client?.contactPerson} />
                <Info label="Email" value={client?.email} />
                <Info label="Telefoni" value={client?.phone} />
                <Info label="Adresa" value={client?.address} />
              </div>
            ) : (
              <div className="mt-4 rounded-md border border-line bg-lab-porcelain p-3 text-sm text-muted">
                Emri i klientit dhe të dhënat e kontaktit janë të fshehura për këtë rol.
              </div>
            )}
          </div>

          <div className="surface-card p-5">
            <h2 className="text-base font-semibold text-ink">Raportet</h2>
            <div className="mt-4 space-y-3">
              {reports.length ? (
                reports.map((report) => (
                  <Link key={report.id} href={`/reports/${report.id}`} className="block rounded-md border border-line p-3 hover:bg-lab-mist">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-ink">{report.reportNumber}</div>
                      <StatusBadge status={report.reportStatus} />
                    </div>
                    <div className="mt-2 text-xs text-muted">
                      Pjesa {report.reportSequence} nga {report.totalReports} / {report.specimenCodes.join(", ")}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-line p-3 text-sm text-muted">
                  Nuk është gjeneruar ende asnjë raport për këtë kampion.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 font-semibold text-ink">{value || "-"}</div>
    </div>
  );
}
