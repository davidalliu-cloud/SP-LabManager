"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SummaryCard } from "@/components/ui/summary-card";
import { formatEuropeanDate } from "@/lib/date-format";
import { useLabStore } from "@/lib/lab-store";
import { canAssignSampleClient, canEditSampleAfterRegistration, canReviewTests, canViewClientIdentity } from "@/lib/permissions";
import { deriveSampleStage } from "@/lib/sample-stage";
import { SampleStageStepper } from "@/components/samples/sample-stage-stepper";

export default function SampleDetailPage() {
  const params = useParams<{ id: string }>();
  const store = useLabStore();
  const [isEditingDetails, setIsEditingDetails] = useState(false);
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
  const canEditSample = canEditSampleAfterRegistration(currentUser?.role);
  const canAcceptSample = canReviewTests(currentUser?.role);
  const activeEmployees = store.users.filter((user) => user.isActive !== false);
  const selectedAssignmentClientId = assignmentClientId || sample.clientId || store.clients[0]?.id || "";
  const assignmentProjects = store.projects.filter((item) => item.clientId === selectedAssignmentClientId);
  const selectedAssignmentProjectId = assignmentProjectId || sample.projectId || assignmentProjects[0]?.id || "";
  const selectedEditClientId = assignmentClientId || sample.clientId || store.clients[0]?.id || "";
  const editProjects = store.projects.filter((item) => item.clientId === selectedEditClientId);
  const selectedEditProjectId = assignmentProjectId || sample.projectId || editProjects[0]?.id || "";
  const tests = store.tests.filter((item) => item.sampleId === sample.id);
  const plannedCastingDates = Array.from(new Set((sample.testSchedules ?? []).map((row) => row.concretingDate).filter(Boolean)));
  const sampleCastingSummary =
    plannedCastingDates.length > 1
      ? `${plannedCastingDates.map((date) => formatEuropeanDate(date)).join(", ")}`
      : sample.concretingDate;
  const reports = store.reports.filter((item) => item.sampleId === sample.id);
  const stage = deriveSampleStage(sample, store.tests, store.reports);
  const finishedStatuses = ["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued", "Sent to Client"];
  const completedCubes = tests
    .filter((test) => finishedStatuses.includes(test.status))
    .reduce((sum, test) => sum + test.cubeCount, 0);
  const remainingCubes = Math.max(0, sample.quantity - completedCubes);
  const nextTest = tests.find((test) => ["Pending", "Scheduled", "In Progress"].includes(test.status));
  const hasMultipleSchedules = (sample.testSchedules?.length ?? 0) > 1;

  function submitAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sample) return;
    const form = new FormData(event.currentTarget);
    store.assignSampleClient(sample.id, String(form.get("clientId")), String(form.get("projectId")));
  }

  function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sample) return;
    const form = new FormData(event.currentTarget);
    store.updateSample(sample.id, {
      clientId: canAssignClient ? String(form.get("clientId") || sample.clientId) : sample.clientId,
      projectId: canAssignClient ? String(form.get("projectId") || sample.projectId) : sample.projectId,
      sampleType: String(form.get("sampleType") || sample.sampleType),
      sampleDescription: String(form.get("sampleDescription") || ""),
      quantity: Number(form.get("quantity") || sample.quantity),
      dateReceived: String(form.get("dateReceived") || sample.dateReceived),
      timeReceived: String(form.get("timeReceived") || sample.timeReceived),
      collectionMethod: String(form.get("collectionMethod") || sample.collectionMethod) as "Delivered by client" | "Collected by lab technician",
      deliveredBy: String(form.get("deliveredBy") || ""),
      collectedBy: String(form.get("collectedBy") || ""),
      concretingDate: String(form.get("concretingDate") || ""),
      requestedTestType: String(form.get("requestedTestType") || sample.requestedTestType),
      standard: String(form.get("standard") || sample.standard),
      requiredTestDate: hasMultipleSchedules ? sample.requiredTestDate : String(form.get("requiredTestDate") || sample.requiredTestDate),
      reportDueDate: hasMultipleSchedules ? sample.reportDueDate : String(form.get("reportDueDate") || sample.reportDueDate),
      assignedTechnician: String(form.get("assignedTechnician") || ""),
      notes: String(form.get("notes") || "")
    });
    setIsEditingDetails(false);
  }

  function acceptSample() {
    if (!sample) return;
    store.acceptSample(sample.id);
  }

  return (
    <>
      <PageHeader
        title={sample.sampleCode}
        description="Detajet e kampionit, plani i testimit, raportet e lidhura dhe progresi."
        action={<StatusBadge status={stage} />}
      />

      <div className="mb-5">
        <SampleStageStepper status={stage} />
      </div>

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total kube të pranuara" value={sample.quantity} />
        <SummaryCard label="Kube të testuara" value={completedCubes} tone="green" />
        <SummaryCard label="Kube të mbetura" value={remainingCubes} tone={remainingCubes ? "amber" : "green"} />
        <SummaryCard label="Raporte të krijuara" value={reports.length} tone="purple" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="space-y-5">
          <div className="surface-card p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h2 className="text-base font-semibold text-ink">Informacioni i kampionit</h2>
              {canEditSample ? (
                <button type="button" onClick={() => setIsEditingDetails((current) => !current)} className="btn-secondary px-3">
                  {isEditingDetails ? "Mbyll modifikimin" : "Modifiko të dhënat"}
                </button>
              ) : null}
            </div>
            {isEditingDetails && canEditSample ? (
              <form onSubmit={submitEdit} className="mt-4 grid gap-4 md:grid-cols-3">
                {canAssignClient ? (
                  <>
                    <Field label="Kodi i klientit">
                      <select
                        name="clientId"
                        value={selectedEditClientId}
                        onChange={(event) => {
                          const nextClientId = event.target.value;
                          setAssignmentClientId(nextClientId);
                          setAssignmentProjectId(store.projects.find((item) => item.clientId === nextClientId)?.id ?? "");
                        }}
                        className="input"
                      >
                        {store.clients.map((item) => (
                          <option key={item.id} value={item.id}>
                            {showClientIdentity ? `${item.clientCode} - ${item.clientName}` : item.clientCode}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Projekti">
                      <select name="projectId" value={selectedEditProjectId} onChange={(event) => setAssignmentProjectId(event.target.value)} className="input">
                        {editProjects.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.projectName}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </>
                ) : null}
                <Field label="Tipi i kampionit"><input name="sampleType" defaultValue={sample.sampleType} className="input" /></Field>
                <Field label="Sasia e pranuar"><input name="quantity" type="number" min="1" defaultValue={sample.quantity} className="input" /></Field>
                <Field label="Data e pranimit"><input name="dateReceived" type="date" defaultValue={sample.dateReceived} className="input" /></Field>
                <Field label="Ora e pranimit"><input name="timeReceived" type="time" defaultValue={sample.timeReceived} className="input" /></Field>
                <Field label="Mënyra e dorëzimit">
                  <select name="collectionMethod" defaultValue={sample.collectionMethod} className="input">
                    <option value="Delivered by client">Dorëzuar nga klienti</option>
                    <option value="Collected by lab technician">Marrë nga tekniku i laboratorit</option>
                  </select>
                </Field>
                <Field label="Dorëzuar nga"><input name="deliveredBy" defaultValue={sample.deliveredBy ?? ""} className="input" /></Field>
                <Field label="Marrë nga"><input name="collectedBy" defaultValue={sample.collectedBy ?? ""} className="input" /></Field>
                <Field label="Data e betonimit"><input name="concretingDate" type="date" defaultValue={sample.concretingDate ?? ""} className="input" /></Field>
                <Field label="Personi që do të kryejë testin">
                  <select name="assignedTechnician" defaultValue={sample.assignedTechnician ?? ""} className="input">
                    <option value="">Zgjidh teknikun ose inxhinierin</option>
                    {activeEmployees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.fullName}{employee.position ? ` - ${employee.position}` : ""}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Testi i kërkuar"><input name="requestedTestType" defaultValue={sample.requestedTestType} className="input" /></Field>
                <Field label="Standardi"><input name="standard" defaultValue={sample.standard} className="input" /></Field>
                {!hasMultipleSchedules ? <Field label="Data e kërkuar për testim"><input name="requiredTestDate" type="date" defaultValue={sample.requiredTestDate} className="input" /></Field> : null}
                {!hasMultipleSchedules ? <Field label="Afati i raportit"><input name="reportDueDate" type="date" defaultValue={sample.reportDueDate} className="input" /></Field> : null}
                <div className="md:col-span-3">
                  <Field label="Përshkrimi"><textarea name="sampleDescription" rows={3} defaultValue={sample.sampleDescription} className="input" /></Field>
                </div>
                <div className="md:col-span-3">
                  <Field label="Shënime"><textarea name="notes" rows={4} defaultValue={sample.notes ?? ""} className="input" /></Field>
                </div>
                {tests.length ? (
                  <div className="soft-panel p-4 text-sm text-muted md:col-span-3">
                    Korrigjimi i kampionit nuk ndryshon grupet e testeve që janë krijuar tashmë. Për testet ekzistuese përditësohen kodi i klientit/projekti, standardi dhe tekniku i caktuar.
                  </div>
                ) : null}
                {hasMultipleSchedules ? (
                  <div className="soft-panel p-4 text-sm text-muted md:col-span-3">
                    Ky kampion ka disa grupe testimi, prandaj datat e planit ruhen siç janë te seksioni "Plani i testimit".
                  </div>
                ) : null}
                <div className="flex gap-3 md:col-span-3">
                  <button className="btn-primary">Ruaj ndryshimet</button>
                  <button type="button" onClick={() => setIsEditingDetails(false)} className="btn-secondary">Anulo</button>
                </div>
              </form>
            ) : (
              <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
                <Info label="Kodi i klientit" value={client?.clientCode ?? "Në pritje të caktimit nga Kryelaboranti"} />
                <Info label="Projekti" value={showClientIdentity ? project?.projectName ?? "Në pritje të caktimit" : "I kufizuar"} />
                <Info label="Vendndodhja e projektit" value={showClientIdentity ? project?.location : "I kufizuar"} />
                <Info label="Tipi i kampionit" value={sample.sampleType} />
                <Info label="Data e pranimit" value={sample.dateReceived} />
                <Info label="Ora e pranimit" value={sample.timeReceived} />
                <Info label="Data e betonimit" value={sampleCastingSummary || sample.concretingDate} />
                <Info label="Mënyra e dorëzimit" value={sample.collectionMethod} />
                <Info label="Dorëzuar nga" value={sample.deliveredBy} />
                <Info label="Marrë nga" value={sample.collectedBy} />
                <Info label="Personi që do të kryejë testin" value={store.users.find((user) => user.id === sample.assignedTechnician)?.fullName ?? "-"} />
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
            )}
          </div>

          <div className="surface-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-ink">Plani i testimit</h2>
              {nextTest ? (
                <Link href={`/tests/${nextTest.id}`} className="btn-primary px-3">
                  Nis testin e radhës
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
                    <th className="px-4 py-3">Data e betonimit</th>
                    <th className="px-4 py-3">Data e kërkuar</th>
                    <th className="px-4 py-3">Afati i raportit</th>
                    <th className="px-4 py-3">Statusi</th>
                    <th className="px-4 py-3">Veprim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {tests.length ? tests.map((test) => (
                    <tr key={test.id}>
                      <td className="px-4 py-3 font-semibold text-ink">{test.testCode}</td>
                      <td className="px-4 py-3">{test.cubeCount} kube</td>
                      <td className="px-4 py-3">{test.scheduledAgeDays} ditë</td>
                      <td className="px-4 py-3">{formatEuropeanDate(test.concretingDate)}</td>
                      <td className="px-4 py-3">{formatEuropeanDate(test.requiredTestDate)}</td>
                      <td className="px-4 py-3">{formatEuropeanDate(test.dueDate)}</td>
                      <td className="px-4 py-3"><StatusBadge status={test.status} /></td>
                      <td className="px-4 py-3"><Link href={`/tests/${test.id}`} className="font-semibold text-lab-burgundy hover:text-lab-purple">Hap</Link></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-sm text-muted">
                        Testet do të krijohen pasi Kryelaboranti të caktojë klientin/projektin dhe të pranojë kampionin.
                      </td>
                    </tr>
                  )}
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
                        {showClientIdentity ? `${item.clientCode} - ${item.clientName}` : item.clientCode}
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
            {canAcceptSample && !tests.length ? (
              <div className="mt-4 rounded-md border border-fuchsia-100 bg-fuchsia-50 p-3">
                <div className="text-sm font-semibold text-lab-purple">Pranimi i kampionit</div>
                <p className="mt-1 text-sm text-muted">
                  Cakto kodin e klientit dhe personin që do të kryejë testin, pastaj prano kampionin për të krijuar testet e planifikuara.
                </p>
                <label className="mt-3 block text-sm font-medium text-ink">
                  Personi që do të kryejë testin
                  <select
                    value={sample.assignedTechnician ?? ""}
                    onChange={(event) => store.assignSampleTechnician(sample.id, event.target.value)}
                    className="input mt-1"
                  >
                    <option value="">Zgjidh teknikun ose inxhinierin</option>
                    {activeEmployees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.fullName}{employee.position ? ` - ${employee.position}` : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={acceptSample}
                  disabled={!sample.clientId || !sample.projectId || !sample.assignedTechnician}
                  className="btn-success mt-3 w-full disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Prano kampionin dhe krijo testet
                </button>
              </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Info({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 font-semibold text-ink">{typeof value === "string" ? formatEuropeanDate(value) : value || "-"}</div>
    </div>
  );
}
