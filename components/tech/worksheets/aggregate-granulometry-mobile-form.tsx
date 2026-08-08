"use client";

import { FormEvent, useState } from "react";
import { useLabStore } from "@/lib/lab-store";
import type { AggregateGradationTest, LabTest, LabUser, Sample } from "@/lib/types";

const aggregateSieveSizes = [125, 80, 63, 37.5, 31.5, 25, 20, 16, 12.5, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.063, 0];

export function AggregateGranulometryMobileForm({
  test,
  sample,
  record,
  currentUser,
  canEdit
}: {
  test: LabTest;
  sample?: Sample;
  record?: AggregateGradationTest;
  currentUser?: LabUser;
  canEdit: boolean;
}) {
  const store = useLabStore();
  const [rowCount, setRowCount] = useState(Math.max(record?.rows.length ?? aggregateSieveSizes.length, aggregateSieveSizes.length));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateTest(test.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      testMethod: String(form.get("testMethod") ?? ""),
      technicianName: currentUser?.fullName ?? String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      sampleMassG: Number(form.get("sampleMassG") || 0),
      notes: String(form.get("notes") ?? ""),
      rows: Array.from({ length: rowCount }, (_, index) => ({
        sieveSizeMm: Number(form.get(`sieveSizeMm-${index}`) || 0),
        retainedMassG: Number(form.get(`retainedMassG-${index}`) || 0)
      }))
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <fieldset disabled={!canEdit} className="space-y-4">
        <div className="grid gap-3">
          <MobileField label="Sample mass before testing (g)">
            <input name="sampleMassG" type="number" step="0.01" inputMode="decimal" required defaultValue={record?.sampleMassG ?? ""} className="input" />
          </MobileField>
          <MobileField label="Testing start date">
            <input name="testStartDate" type="date" defaultValue={record?.testStartDate ?? test.requiredTestDate} className="input" />
          </MobileField>
          <MobileField label="Testing end date">
            <input name="testEndDate" type="date" defaultValue={record?.testEndDate ?? test.requiredTestDate} className="input" />
          </MobileField>
          <MobileField label="Test method">
            <input name="testMethod" defaultValue={record?.testMethod ?? "Larje dhe sitosje / Washing and sieving"} className="input" />
          </MobileField>
          <MobileField label="Temperature">
            <input name="temperature" defaultValue={record?.temperature ?? ""} className="input" placeholder="e.g. 21.9 C" />
          </MobileField>
          <MobileField label="Relative humidity">
            <input name="humidity" defaultValue={record?.humidity ?? ""} className="input" placeholder="e.g. 49.8%" />
          </MobileField>
          <MobileField label="Testing location">
            <input name="testingLocation" defaultValue={record?.testingLocation ?? "01/A Lab. Fiziko-Mekanik / Physical-mechanical laboratory"} className="input" />
          </MobileField>
          <input type="hidden" name="technicianName" defaultValue={currentUser?.fullName ?? ""} />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Sieve analysis</h3>
            <button type="button" onClick={() => setRowCount((count) => count + 1)} className="btn-secondary px-3 py-1.5 text-xs">Add sieve</button>
          </div>
          <div className="space-y-3">
            {Array.from({ length: rowCount }, (_, index) => {
              const row = record?.rows[index];
              return (
                <div key={index} className="rounded-lg border border-line bg-white p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <MobileField label="Sieve (mm)" compact>
                      <input name={`sieveSizeMm-${index}`} type="number" step="0.001" inputMode="decimal" defaultValue={row?.sieveSizeMm ?? aggregateSieveSizes[index] ?? ""} className="input" />
                    </MobileField>
                    <MobileField label="Retained mass (g)" compact>
                      <input name={`retainedMassG-${index}`} type="number" step="0.01" inputMode="decimal" defaultValue={row?.retainedMassG ?? ""} className="input" />
                    </MobileField>
                  </div>
                  {row ? (
                    <div className="mt-2 text-xs text-muted">
                      Cumulative retained {row.cumulativeRetainedPercent}% &middot; Passing {row.cumulativePassingPercent}%
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <MobileField label="Notes">
          <textarea name="notes" rows={3} defaultValue={record?.notes} className="input" />
        </MobileField>

        <button type="submit" className="btn-secondary w-full">Ruaj / Save</button>
      </fieldset>
    </form>
  );
}

function MobileField({ label, children, compact = false }: { label: string; children: React.ReactNode; compact?: boolean }) {
  return (
    <label className={`block font-medium text-ink ${compact ? "text-xs" : "text-sm"}`}>
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
