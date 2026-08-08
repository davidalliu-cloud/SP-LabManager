"use client";

import { FormEvent } from "react";
import { useLabStore } from "@/lib/lab-store";
import type { AggregateSandEquivalentTest, LabTest, LabUser, Sample } from "@/lib/types";

export function AggregateSandEquivalentMobileForm({
  test,
  sample,
  record,
  currentUser,
  canEdit
}: {
  test: LabTest;
  sample?: Sample;
  record?: AggregateSandEquivalentTest;
  currentUser?: LabUser;
  canEdit: boolean;
}) {
  const store = useLabStore();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateSandEquivalentTest(test.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: currentUser?.fullName ?? String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      moistureRuns: [1, 2].map((index) => ({
        emptyDishMassG: Number(form.get(`sandM0-${index}`) || 0),
        dishWetSampleMassG: Number(form.get(`sandM1-${index}`) || 0),
        dishDrySampleMassG: Number(form.get(`sandM2-${index}`) || 0)
      })),
      finesRuns: [1, 2].map((index) => ({
        sampleMassG: Number(form.get(`finesM1-${index}`) || 0),
        retained0063MassG: Number(form.get(`finesM2-${index}`) || 0)
      })),
      sandRuns: [1, 2].map((index) => ({
        materialMassG: Number(form.get(`sandMaterial-${index}`) || 0),
        clayReadingMm: Number(form.get(`sandH1-${index}`) || 0),
        sandReadingMm: Number(form.get(`sandH2-${index}`) || 0)
      }))
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <fieldset disabled={!canEdit} className="space-y-4">
        <div className="grid gap-3">
          <MobileField label="Testing start date">
            <input name="testStartDate" type="date" defaultValue={record?.testStartDate ?? test.requiredTestDate} className="input" />
          </MobileField>
          <MobileField label="Testing end date">
            <input name="testEndDate" type="date" defaultValue={record?.testEndDate ?? test.requiredTestDate} className="input" />
          </MobileField>
          <MobileField label="Testing location">
            <input name="testingLocation" defaultValue={record?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" />
          </MobileField>
          <MobileField label="Temperature">
            <input name="temperature" defaultValue={record?.temperature ?? ""} className="input" />
          </MobileField>
          <MobileField label="Humidity">
            <input name="humidity" defaultValue={record?.humidity ?? ""} className="input" />
          </MobileField>
          <input type="hidden" name="technicianName" defaultValue={currentUser?.fullName ?? ""} />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink">Moisture content</h3>
          <div className="space-y-3">
            {[1, 2].map((index) => {
              const row = record?.moistureRuns[index - 1];
              return (
                <div key={index} className="rounded-lg border border-line bg-white p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-lab-burgundy">Run {index}</div>
                  <div className="grid grid-cols-3 gap-2">
                    <MobileField label="m0 dish (g)" compact><input name={`sandM0-${index}`} type="number" step="0.01" inputMode="decimal" defaultValue={row?.emptyDishMassG ?? ""} className="input" /></MobileField>
                    <MobileField label="m1 wet (g)" compact><input name={`sandM1-${index}`} type="number" step="0.01" inputMode="decimal" defaultValue={row?.dishWetSampleMassG ?? ""} className="input" /></MobileField>
                    <MobileField label="m2 dry (g)" compact><input name={`sandM2-${index}`} type="number" step="0.01" inputMode="decimal" defaultValue={row?.dishDrySampleMassG ?? ""} className="input" /></MobileField>
                  </div>
                  {row ? <div className="mt-2 text-xs text-muted">Moisture {row.moisturePercent}%</div> : null}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink">Fines and sand equivalent</h3>
          <div className="space-y-3">
            {[1, 2].map((index) => {
              const fines = record?.finesRuns[index - 1];
              const sand = record?.sandRuns[index - 1];
              return (
                <div key={index} className="rounded-lg border border-line bg-white p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-lab-burgundy">Run {index}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <MobileField label="Sample M1 (g)" compact><input name={`finesM1-${index}`} type="number" step="0.01" inputMode="decimal" defaultValue={fines?.sampleMassG ?? ""} className="input" /></MobileField>
                    <MobileField label="Retained 0.063 M2 (g)" compact><input name={`finesM2-${index}`} type="number" step="0.01" inputMode="decimal" defaultValue={fines?.retained0063MassG ?? ""} className="input" /></MobileField>
                    <MobileField label="Material (g)" compact><input name={`sandMaterial-${index}`} type="number" step="0.01" inputMode="decimal" defaultValue={sand?.materialMassG ?? record?.materialForTestG ?? ""} className="input" /></MobileField>
                    <MobileField label="h1 clay (mm)" compact><input name={`sandH1-${index}`} type="number" step="0.01" inputMode="decimal" defaultValue={sand?.clayReadingMm ?? ""} className="input" /></MobileField>
                    <MobileField label="h2 sand (mm)" compact><input name={`sandH2-${index}`} type="number" step="0.01" inputMode="decimal" defaultValue={sand?.sandReadingMm ?? ""} className="input" /></MobileField>
                  </div>
                  {fines || sand ? (
                    <div className="mt-2 text-xs text-muted">
                      {fines ? `Fines ${fines.finesPercent}%` : ""} {sand ? `· SE ${sand.sandEquivalent}` : ""}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          {record ? (
            <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-line bg-white p-3 text-sm">
              <Info label="Average moisture" value={`${record.averageMoisturePercent}%`} />
              <Info label="Average fines" value={`${record.averageFinesPercent}%`} />
              <Info label="Material for test" value={`${record.materialForTestG} g`} />
              <Info label="Sand equivalent" value={`${record.sandEquivalentValue}`} />
            </div>
          ) : null}
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-0.5 font-medium text-ink">{value}</div>
    </div>
  );
}
