"use client";

import { FormEvent, useState } from "react";
import { useLabStore } from "@/lib/lab-store";
import type { ConcreteCompressiveTest, LabTest, LabUser, Sample } from "@/lib/types";

export function ConcreteCompressiveMobileForm({
  test,
  sample,
  record,
  currentUser,
  canEdit
}: {
  test: LabTest;
  sample?: Sample;
  record?: ConcreteCompressiveTest;
  currentUser?: LabUser;
  canEdit: boolean;
}) {
  const store = useLabStore();
  const existingSpecimens = record?.specimens?.length ? record.specimens : [];
  const [rowCount, setRowCount] = useState(Math.max(test.cubeCount || 1, existingSpecimens.length, 1));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const specimens = Array.from({ length: rowCount }, (_, index) => ({
      specimenCode: String(form.get(`specimenCode-${index}`) ?? ""),
      ageDays: Number(form.get(`ageDays-${index}`) || 0),
      lengthMm: Number(form.get(`lengthMm-${index}`) || 0),
      widthMm: Number(form.get(`widthMm-${index}`) || 0),
      heightMm: Number(form.get(`heightMm-${index}`) || 0),
      weightKg: Number(form.get(`weightKg-${index}`) || 0),
      maximumLoadKn: Number(form.get(`maximumLoadKn-${index}`) || 0),
      visualInspection: String(form.get(`visualInspection-${index}`) ?? ""),
      notes: String(form.get(`specimenNotes-${index}`) ?? "")
    }));
    const first = specimens.find((row) => row.specimenCode || row.maximumLoadKn || row.weightKg) ?? specimens[0];
    store.saveConcreteTest(test.id, {
      castingDate: String(form.get("castingDate")),
      testDate: String(form.get("testDate")),
      testStartDate: String(form.get("testStartDate")),
      testEndDate: String(form.get("testEndDate")),
      temperature: String(form.get("temperature")),
      humidity: String(form.get("humidity")),
      testingLocation: String(form.get("testingLocation")),
      cubeLength: first.lengthMm,
      cubeWidth: first.widthMm,
      cubeHeight: first.heightMm,
      weight: first.weightKg,
      maximumLoadKn: first.maximumLoadKn,
      failureType: first.visualInspection,
      machineUsed: String(form.get("machineUsed")),
      technicianName: currentUser?.fullName ?? String(form.get("technicianName")),
      notes: String(form.get("notes")),
      specimens
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <fieldset disabled={!canEdit} className="space-y-4">
        <div className="grid gap-3">
          <MobileField label="Casting date">
            <input name="castingDate" type="date" required defaultValue={record?.castingDate ?? test.concretingDate ?? sample?.concretingDate ?? sample?.dateReceived ?? ""} className="input" />
          </MobileField>
          <MobileField label="Test date">
            <input name="testDate" type="date" required defaultValue={record?.testDate ?? test.requiredTestDate} className="input" />
          </MobileField>
          <MobileField label="Testing start date">
            <input name="testStartDate" type="date" defaultValue={record?.testStartDate ?? test.requiredTestDate} className="input" />
          </MobileField>
          <MobileField label="Testing end date">
            <input name="testEndDate" type="date" defaultValue={record?.testEndDate ?? test.requiredTestDate} className="input" />
          </MobileField>
          <MobileField label="Equipment used">
            <input name="machineUsed" required defaultValue={record?.machineUsed ?? "Electronic balance max. 30000 g; metal ruler/caliper; Controls 2000 kN concrete press"} className="input" />
          </MobileField>
          <MobileField label="Temperature">
            <input name="temperature" defaultValue={record?.temperature ?? ""} className="input" placeholder="e.g. 22 C" />
          </MobileField>
          <MobileField label="Humidity">
            <input name="humidity" defaultValue={record?.humidity ?? ""} className="input" placeholder="e.g. 55%" />
          </MobileField>
          <MobileField label="Testing location">
            <input name="testingLocation" defaultValue={record?.testingLocation ?? ""} className="input" />
          </MobileField>
          <input type="hidden" name="technicianName" defaultValue={currentUser?.fullName ?? ""} />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Cubes</h3>
            <div className="flex gap-2">
              <button type="button" onClick={() => setRowCount((count) => count + 1)} className="btn-secondary px-3 py-1.5 text-xs">Add cube</button>
              <button type="button" onClick={() => setRowCount((count) => Math.max(1, count - 1))} className="btn-secondary px-3 py-1.5 text-xs">Remove</button>
            </div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: rowCount }, (_, index) => {
              const specimen = existingSpecimens[index];
              const defaultCode = specimen?.specimenCode ?? `${sample?.sampleCode ?? "Sample"}/${test.scheduledAgeDays}d-${index + 1}`;
              return (
                <div key={index} className="rounded-lg border border-line bg-white p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-lab-burgundy">Cube {index + 1}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <MobileField label="Specimen code" compact>
                      <input name={`specimenCode-${index}`} defaultValue={defaultCode} className="input" />
                    </MobileField>
                    <MobileField label="Age (days)" compact>
                      <input name={`ageDays-${index}`} type="number" inputMode="numeric" defaultValue={specimen?.ageDays ?? 28} className="input" />
                    </MobileField>
                    <MobileField label="Length (mm)" compact>
                      <input name={`lengthMm-${index}`} type="number" inputMode="decimal" defaultValue={specimen?.lengthMm ?? 150} className="input" />
                    </MobileField>
                    <MobileField label="Width (mm)" compact>
                      <input name={`widthMm-${index}`} type="number" inputMode="decimal" defaultValue={specimen?.widthMm ?? 150} className="input" />
                    </MobileField>
                    <MobileField label="Height (mm)" compact>
                      <input name={`heightMm-${index}`} type="number" inputMode="decimal" defaultValue={specimen?.heightMm ?? 150} className="input" />
                    </MobileField>
                    <MobileField label="Weight (kg)" compact>
                      <input name={`weightKg-${index}`} type="number" step="0.01" inputMode="decimal" defaultValue={specimen?.weightKg ?? ""} className="input" />
                    </MobileField>
                    <MobileField label="Load (kN)" compact>
                      <input name={`maximumLoadKn-${index}`} type="number" step="0.01" inputMode="decimal" defaultValue={specimen?.maximumLoadKn ?? ""} className="input" />
                    </MobileField>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">Strength</div>
                      <div className="mt-1 text-sm font-semibold text-ink">{specimen ? `${specimen.compressiveStrengthMpa} MPa` : "Save to calculate"}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <MobileField label="Visual inspection" compact>
                      <input name={`visualInspection-${index}`} defaultValue={specimen?.visualInspection ?? ""} className="input" />
                    </MobileField>
                  </div>
                  <div className="mt-2">
                    <MobileField label="Notes" compact>
                      <input name={`specimenNotes-${index}`} defaultValue={specimen?.notes ?? ""} className="input" />
                    </MobileField>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <MobileField label="General notes">
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
