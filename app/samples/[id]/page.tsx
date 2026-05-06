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
    return <PageHeader title="Sample not found" description="The selected sample could not be found in the register." />;
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
        description="Registered sample details, testing schedule, linked reports, and progress."
        action={<StatusBadge status={sample.status} />}
      />

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total cubes received" value={sample.quantity} />
        <SummaryCard label="Cubes tested" value={completedCubes} tone="green" />
        <SummaryCard label="Cubes remaining" value={remainingCubes} tone={remainingCubes ? "amber" : "green"} />
        <SummaryCard label="Reports created" value={reports.length} tone="purple" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="space-y-5">
          <div className="surface-card p-5">
            <h2 className="text-base font-semibold text-ink">Sample Information</h2>
            <div className="mt-4 grid gap-4 text-sm md:grid-cols-3">
              <Info label="Client code" value={client?.clientCode ?? "Pending Chief assignment"} />
              <Info label="Project" value={showClientIdentity ? project?.projectName ?? "Pending assignment" : "Restricted"} />
              <Info label="Project location" value={showClientIdentity ? project?.location : "Restricted"} />
              <Info label="Sample type" value={sample.sampleType} />
              <Info label="Date received" value={sample.dateReceived} />
              <Info label="Time received" value={sample.timeReceived} />
              <Info label="Collection method" value={sample.collectionMethod} />
              <Info label="Delivered by" value={sample.deliveredBy} />
              <Info label="Collected by" value={sample.collectedBy} />
              <Info label="Requested test" value={sample.requestedTestType} />
              <Info label="Standard" value={sample.standard} />
              <Info label="Report due date" value={sample.reportDueDate} />
              <div className="md:col-span-3">
                <Info label="Description" value={sample.sampleDescription} />
              </div>
              <div className="md:col-span-3">
                <Info label="Notes" value={sample.notes || "-"} />
              </div>
            </div>
          </div>

          <div className="surface-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-ink">Testing Schedule</h2>
              {nextTest ? (
                <Link href={`/tests/${nextTest.id}`} className="btn-primary px-3">
                  Open next test
                </Link>
              ) : null}
            </div>
            <div className="overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="table-head">
                  <tr>
                    <th className="px-4 py-3">Test ID</th>
                    <th className="px-4 py-3">Batch</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">Required date</th>
                    <th className="px-4 py-3">Report due</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {tests.map((test) => (
                    <tr key={test.id}>
                      <td className="px-4 py-3 font-semibold text-ink">{test.testCode}</td>
                      <td className="px-4 py-3">{test.cubeCount} cubes</td>
                      <td className="px-4 py-3">{test.scheduledAgeDays} days</td>
                      <td className="px-4 py-3">{test.requiredTestDate}</td>
                      <td className="px-4 py-3">{test.dueDate}</td>
                      <td className="px-4 py-3"><StatusBadge status={test.status} /></td>
                      <td className="px-4 py-3"><Link href={`/tests/${test.id}`} className="font-semibold text-lab-burgundy hover:text-lab-purple">Open</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="surface-card p-5">
            <h2 className="text-base font-semibold text-ink">Client Access</h2>
            <p className="mt-2 text-sm text-muted">
              Client identity is restricted to preserve impartiality during testing. Technicians see only the assigned client code.
            </p>
            {canAssignClient ? (
              <form onSubmit={submitAssignment} className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-ink">
                  Assign client
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
                  Assign project
                  <select name="projectId" value={selectedAssignmentProjectId} onChange={(event) => setAssignmentProjectId(event.target.value)} className="input mt-1">
                    {assignmentProjects.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.projectName}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="btn-primary w-full">Save client assignment</button>
              </form>
            ) : null}
            {showClientIdentity ? (
              <div className="mt-4 space-y-3 text-sm">
                <Info label="Client name" value={client?.clientName} />
                <Info label="Contact" value={client?.contactPerson} />
                <Info label="Email" value={client?.email} />
                <Info label="Phone" value={client?.phone} />
                <Info label="Address" value={client?.address} />
              </div>
            ) : (
              <div className="mt-4 rounded-md border border-line bg-lab-porcelain p-3 text-sm text-muted">
                Client name and contact details are hidden for this role.
              </div>
            )}
          </div>

          <div className="surface-card p-5">
            <h2 className="text-base font-semibold text-ink">Reports</h2>
            <div className="mt-4 space-y-3">
              {reports.length ? (
                reports.map((report) => (
                  <Link key={report.id} href={`/reports/${report.id}`} className="block rounded-md border border-line p-3 hover:bg-lab-mist">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-ink">{report.reportNumber}</div>
                      <StatusBadge status={report.reportStatus} />
                    </div>
                    <div className="mt-2 text-xs text-muted">
                      Part {report.reportSequence} of {report.totalReports} / {report.specimenCodes.join(", ")}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-line p-3 text-sm text-muted">
                  No reports have been generated for this sample yet.
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
