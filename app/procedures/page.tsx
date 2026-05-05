"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useLabStore } from "@/lib/lab-store";
import type { ProcedureRevisionStatus } from "@/lib/types";

const statusClass: Record<ProcedureRevisionStatus, string> = {
  Current: "bg-green-50 text-lab-green ring-green-100",
  Draft: "bg-slate-100 text-slate-700 ring-slate-200",
  "In Review": "bg-fuchsia-50 text-lab-purple ring-fuchsia-100",
  Approved: "bg-green-50 text-lab-green ring-green-100",
  Superseded: "bg-lab-mist text-lab-navy ring-cyan-100",
  Rejected: "bg-red-50 text-lab-red ring-red-100"
};

export default function ProceduresPage() {
  const store = useLabStore();
  const [category, setCategory] = useState("Aggregate");
  const [selectedProcedureId, setSelectedProcedureId] = useState(store.procedures[0]?.id ?? "");
  const [previewRevisionId, setPreviewRevisionId] = useState("");
  const [comments, setComments] = useState("");

  const categories = Array.from(new Set(store.procedures.map((procedure) => procedure.category)));
  const procedures = store.procedures.filter((procedure) => procedure.category === category);
  const selectedProcedure = procedures.find((procedure) => procedure.id === selectedProcedureId) ?? procedures[0];
  const revisions = useMemo(
    () =>
      selectedProcedure
        ? store.procedureRevisions
            .filter((revision) => revision.procedureId === selectedProcedure.id)
            .sort((a, b) => Number(b.revision) - Number(a.revision))
        : [],
    [selectedProcedure, store.procedureRevisions]
  );
  const currentRevision = selectedProcedure ? store.procedureRevisions.find((revision) => revision.id === selectedProcedure.currentRevisionId) : undefined;
  const previewRevision = revisions.find((revision) => revision.id === previewRevisionId) ?? currentRevision;
  const pendingReview = store.procedureRevisions.filter((revision) => revision.status === "In Review").length;
  const draftCount = store.procedureRevisions.filter((revision) => revision.status === "Draft").length;
  const aggregateCount = store.procedures.filter((procedure) => procedure.category === "Aggregate").length;

  useEffect(() => {
    setPreviewRevisionId(currentRevision?.id ?? "");
  }, [currentRevision?.id]);

  function createRevision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!selectedProcedure) return;
    store.createProcedureRevision({
      procedureId: selectedProcedure.id,
      assignedTo: String(form.get("assignedTo") ?? ""),
      changeSummary: String(form.get("changeSummary") ?? ""),
      fileName: String(form.get("fileName") ?? ""),
      fileUrl: String(form.get("fileUrl") ?? "")
    });
    event.currentTarget.reset();
  }

  return (
    <>
      <PageHeader
        title="Procedures"
        description="Controlled SOP directory with current and previous revisions, assignments, review, and approval."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="Aggregate SOPs" value={String(aggregateCount)} />
        <Metric label="Draft revisions" value={String(draftCount)} />
        <Metric label="Pending Lab Chief review" value={String(pendingReview)} />
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[360px_1fr]">
        <aside className="surface-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-ink">Directory</h2>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="input max-w-40">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="mt-4 space-y-2">
            {procedures.map((procedure) => {
              const current = store.procedureRevisions.find((revision) => revision.id === procedure.currentRevisionId);
              const active = procedure.id === selectedProcedure?.id;
              return (
                <button
                  key={procedure.id}
                  type="button"
                  onClick={() => setSelectedProcedureId(procedure.id)}
                  className={`w-full rounded-md border p-3 text-left transition ${active ? "border-lab-burgundy bg-lab-mist" : "border-line bg-white hover:border-lab-steel"}`}
                >
                  <div className="text-sm font-semibold text-ink">{procedure.code}</div>
                  <div className="mt-1 text-sm text-muted">{procedure.title}</div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted">Rev. {current?.revision ?? "-"}</span>
                    <ProcedureStatus status={current?.status ?? "Current"} />
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-5">
          {selectedProcedure ? (
            <>
              <section className="surface-card p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">{selectedProcedure.category}</div>
                    <h2 className="mt-1 text-xl font-semibold text-ink">{selectedProcedure.code} · {selectedProcedure.title}</h2>
                    <p className="mt-2 text-sm text-muted">{selectedProcedure.testName}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentRevision?.pdfUrl ? <a href={currentRevision.pdfUrl} target="_blank" className="btn-primary" rel="noreferrer">Open PDF</a> : null}
                    {currentRevision?.pdfUrl ? <a href={currentRevision.pdfUrl} download className="btn-secondary">Download PDF</a> : null}
                    {currentRevision?.fileUrl ? <a href={currentRevision.fileUrl} download className="btn-secondary">Download Word</a> : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 text-sm md:grid-cols-4">
                  <Info label="Current revision" value={currentRevision?.revision} />
                  <Info label="Status" value={currentRevision?.status} />
                  <Info label="Effective date" value={currentRevision?.effectiveDate} />
                  <Info label="Approved by" value={store.users.find((user) => user.id === currentRevision?.approvedBy)?.fullName ?? currentRevision?.approvedBy} />
                </div>
              </section>

              <section className="surface-card overflow-hidden">
                <div className="flex flex-col justify-between gap-3 border-b border-line px-5 py-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-base font-semibold text-ink">PDF Preview</h2>
                    <p className="mt-1 text-sm text-muted">
                      Viewing {previewRevision ? `revision ${previewRevision.revision}` : "the selected revision"} inside the software.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {previewRevision?.pdfUrl ? <a href={previewRevision.pdfUrl} target="_blank" rel="noreferrer" className="btn-secondary">Open in new tab</a> : null}
                    {previewRevision?.pdfUrl ? <a href={previewRevision.pdfUrl} download className="btn-secondary">Download PDF</a> : null}
                    {previewRevision?.fileUrl ? <a href={previewRevision.fileUrl} download className="btn-secondary">Download Word</a> : null}
                  </div>
                </div>
                {previewRevision?.pdfUrl ? (
                  <iframe
                    title={`${selectedProcedure.code} revision ${previewRevision.revision} PDF preview`}
                    src={previewRevision.pdfUrl}
                    className="h-[720px] w-full bg-lab-porcelain"
                  />
                ) : (
                  <div className="p-6 text-sm text-muted">No PDF has been uploaded for this revision yet.</div>
                )}
              </section>

              <section className="surface-card p-5">
                <h2 className="text-base font-semibold text-ink">Create New Revision</h2>
                <form onSubmit={createRevision} className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field label="Assign update to">
                    <select name="assignedTo" required className="input">
                      {store.users.filter((user) => user.isActive !== false).map((user) => (
                        <option key={user.id} value={user.id}>{user.fullName} · {user.position ?? user.role}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Draft file URL or path">
                    <input name="fileUrl" placeholder={currentRevision?.fileUrl ?? "/procedures/aggregate/new-revision.doc"} className="input" />
                  </Field>
                  <Field label="Draft file name">
                    <input name="fileName" placeholder={`${selectedProcedure.code} revision.doc`} className="input" />
                  </Field>
                  <Field label="Reason / change summary">
                    <input name="changeSummary" required placeholder="Describe why this SOP needs revision" className="input" />
                  </Field>
                  <div className="md:col-span-2 flex justify-end">
                    <button className="btn-secondary">Create draft revision</button>
                  </div>
                </form>
              </section>

              <section className="surface-card overflow-hidden">
                <div className="border-b border-line px-5 py-4">
                  <h2 className="text-base font-semibold text-ink">Revision History</h2>
                  <p className="mt-1 text-sm text-muted">Previous approved revisions remain available after a new revision becomes current.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1080px] text-left text-sm">
                    <thead className="table-head">
                      <tr>
                        <th className="px-4 py-3">Revision</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Assigned to</th>
                        <th className="px-4 py-3">Change summary</th>
                        <th className="px-4 py-3">Approved</th>
                        <th className="px-4 py-3">Files</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {revisions.map((revision) => (
                        <tr key={revision.id}>
                          <td className="px-4 py-3 font-semibold text-ink">Rev. {revision.revision}</td>
                          <td className="px-4 py-3"><ProcedureStatus status={revision.status} /></td>
                          <td className="px-4 py-3">{store.users.find((user) => user.id === revision.assignedTo)?.fullName ?? "-"}</td>
                          <td className="px-4 py-3">{revision.changeSummary ?? "-"}</td>
                          <td className="px-4 py-3">{revision.approvedAt ? new Date(revision.approvedAt).toLocaleDateString() : "-"}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              {revision.pdfUrl ? <button type="button" onClick={() => setPreviewRevisionId(revision.id)} className="text-left font-semibold text-lab-burgundy hover:text-lab-purple">Preview PDF</button> : null}
                              {revision.pdfUrl ? <a href={revision.pdfUrl} target="_blank" rel="noreferrer" className="font-semibold text-lab-burgundy hover:text-lab-purple">Open PDF</a> : null}
                              {revision.pdfUrl ? <a href={revision.pdfUrl} download className="text-xs font-semibold text-ink hover:text-lab-burgundy">Download PDF</a> : null}
                              {revision.fileUrl ? <a href={revision.fileUrl} download className="text-xs font-semibold text-ink hover:text-lab-burgundy">Download Word</a> : null}
                              {!revision.pdfUrl && !revision.fileUrl ? "-" : null}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-2">
                              <button onClick={() => store.submitProcedureRevision(revision.id)} disabled={!["Draft", "Rejected"].includes(revision.status)} className="rounded-md border border-line bg-white px-2 py-1 text-xs font-semibold text-ink disabled:cursor-not-allowed disabled:text-slate-400">Submit review</button>
                              <button onClick={() => store.approveProcedureRevision(revision.id)} disabled={revision.status !== "In Review"} className="rounded-md border border-green-100 bg-green-50 px-2 py-1 text-xs font-semibold text-lab-green disabled:cursor-not-allowed disabled:text-slate-400">Approve current</button>
                              <button onClick={() => store.rejectProcedureRevision(revision.id, comments || "Please update the SOP and resubmit.")} disabled={revision.status !== "In Review"} className="rounded-md border border-red-100 bg-red-50 px-2 py-1 text-xs font-semibold text-lab-red disabled:cursor-not-allowed disabled:text-slate-400">Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-line p-4">
                  <textarea value={comments} onChange={(event) => setComments(event.target.value)} rows={3} placeholder="Lab Chief rejection comments" className="input" />
                </div>
              </section>
            </>
          ) : (
            <div className="surface-card p-6 text-sm text-muted">No procedures have been added yet.</div>
          )}
        </div>
      </section>
    </>
  );
}

function ProcedureStatus({ status }: { status: ProcedureRevisionStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass[status]}`}>{status}</span>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
    </div>
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

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md border border-line p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 font-semibold text-ink">{value ?? "-"}</div>
    </div>
  );
}
