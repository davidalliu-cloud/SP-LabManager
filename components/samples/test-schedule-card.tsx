"use client";

import { useState } from "react";
import { formatEuropeanDate } from "@/lib/date-format";
import { useLabStore } from "@/lib/lab-store";
import { MIN_MATURITY_DAYS, addDaysIso, maturityFromTestDate, reportDueFor, testDateFor } from "@/lib/maturity";
import { canEditSampleAfterRegistration, isSampleLocked } from "@/lib/permissions";

/**
 * The ages a sample's cubes are booked for, corrected after registration.
 *
 * A technician books the delivery in and types 7 where the client asked for
 * 14. Nothing downstream notices: the test is created for the wrong day and
 * comes up on the wrong day's list. The sample edit form was no help - with
 * more than one group it leaves every date alone, because one date cannot
 * stand for three - so the groups are edited here, as groups.
 *
 * The age and the test date are the same thing written two ways, as they are
 * at registration: type either and the other follows from the casting date.
 * Only the two people who may edit a registered sample may touch this, and
 * only a group whose cubes are still waiting - once they are on the press the
 * row is history, not a booking.
 */
export function TestScheduleCard({ sampleId }: { sampleId: string }) {
  const store = useLabStore();
  const sample = store.samples.find((row) => row.id === sampleId);
  const schedules = sample?.testSchedules ?? [];
  // Re-seeded whenever the stored plan changes, so a save - or another
  // session's edit - leaves the boxes showing what is actually booked.
  const signature = JSON.stringify(schedules);
  const [seeded, setSeeded] = useState(signature);
  const [draft, setDraft] = useState(() => schedules.map(seed));
  if (seeded !== signature) {
    setSeeded(signature);
    setDraft(schedules.map(seed));
  }
  if (!sample || !schedules.length) return null;

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const tests = store.tests.filter((row) => row.sampleId === sampleId);
  const reports = store.reports.filter((row) => row.sampleId === sampleId);
  const locked = isSampleLocked(tests.map((row) => row.status), reports.length > 0);
  const permitted = canEditSampleAfterRegistration(currentUser?.email);
  const mayEdit = permitted && !locked;

  /** The tests this group booked, if the sample has been accepted yet. */
  const testsFor = (ageDays: number) => tests.filter((row) => row.scheduledAgeDays === ageDays);
  const startedRow = (ageDays: number) =>
    testsFor(ageDays).some((row) => !["Pending", "Scheduled"].includes(row.status));

  const rowDate = (index: number) => testDateFor(draft[index]?.concretingDate, draft[index]?.ageDays ?? 0);
  const ages = draft.map((row) => row.ageDays);
  const duplicateAges = new Set(ages).size !== ages.length;
  const changed = draft.some(
    (row, index) =>
      !startedRow(schedules[index].ageDays) &&
      (row.ageDays !== schedules[index].ageDays ||
        row.cubeCount !== schedules[index].cubeCount ||
        row.concretingDate !== (schedules[index].concretingDate ?? ""))
  );

  function set(index: number, change: Partial<Row>) {
    setDraft((rows) => rows.map((row, position) => (position === index ? { ...row, ...change } : row)));
  }

  return (
    <div className="surface-card p-5">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">Plani i moshave</h2>
        {mayEdit ? (
          <button
            type="button"
            disabled={!changed || duplicateAges}
            onClick={() => store.setTestSchedules(sampleId, draft)}
            className="btn-primary px-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ruaj planin
          </button>
        ) : null}
      </div>
      <p className="mb-3 text-xs leading-snug text-muted">
        Mosha dhe data e testimit janë e njëjta gjë e shkruar në dy mënyra: ndryshoni njërën dhe tjetra llogaritet vetë.
        Korrigjoni këtu nëse një grup është regjistruar me moshë të gabuar — testi dhe afati i raportit lëvizin bashkë me të.
      </p>
      <div className="overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-3 py-2">Grupi</th>
              <th className="px-3 py-2">Kube për testim</th>
              <th className="px-3 py-2">Mosha</th>
              <th className="px-3 py-2">Data e betonimit</th>
              <th className="px-3 py-2">Data e kërkuar e testimit</th>
              <th className="px-3 py-2">Afati i raportit</th>
              <th className="px-3 py-2">Gjendja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {schedules.map((schedule, index) => {
              const row = draft[index] ?? seed(schedule);
              const started = startedRow(schedule.ageDays);
              const editable = mayEdit && !started;
              const testDate = rowDate(index);
              return (
                <tr key={index}>
                  <td className="px-3 py-2 font-semibold text-ink">{index + 1}</td>
                  <td className="px-3 py-2">
                    {editable ? (
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={row.cubeCount}
                        onChange={(event) => set(index, { cubeCount: Number(event.target.value) || 0 })}
                        className="input"
                      />
                    ) : (
                      `${schedule.cubeCount} kube`
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editable ? (
                      <input
                        type="number"
                        min={MIN_MATURITY_DAYS}
                        step="1"
                        value={row.ageDays}
                        onChange={(event) => set(index, { ageDays: Number(event.target.value) || 0 })}
                        className="input"
                      />
                    ) : (
                      `${schedule.ageDays} ditë`
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editable ? (
                      <input
                        type="date"
                        value={row.concretingDate}
                        onChange={(event) => set(index, { concretingDate: event.target.value })}
                        className="input"
                      />
                    ) : (
                      formatEuropeanDate(schedule.concretingDate)
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editable ? (
                      <input
                        type="date"
                        min={addDaysIso(row.concretingDate, MIN_MATURITY_DAYS)}
                        value={testDate}
                        onChange={(event) => {
                          const ageDays = maturityFromTestDate(row.concretingDate, event.target.value);
                          if (ageDays !== undefined) set(index, { ageDays });
                        }}
                        className="input"
                      />
                    ) : (
                      formatEuropeanDate(schedule.requiredTestDate)
                    )}
                  </td>
                  <td className="px-3 py-2 text-muted">
                    {formatEuropeanDate(editable ? reportDueFor(testDate) : schedule.reportDueDate)}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted">
                    {started
                      ? "Testimi ka nisur — nuk ndryshohet"
                      : testsFor(schedule.ageDays).length
                        ? "I planifikuar"
                        : "Pa test ende"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {duplicateAges ? (
        <p className="mt-2 text-xs font-medium text-lab-red">
          Dy grupe nuk mund të kenë të njëjtën moshë — testet e tyre nuk do të dalloheshin nga njëri-tjetri.
        </p>
      ) : null}
      {!permitted ? (
        <p className="mt-2 text-xs text-muted">
          Planin e ndryshojnë vetëm Drejtori Ekzekutiv dhe Kryelaboranti.
        </p>
      ) : locked ? (
        <p className="mt-2 text-xs text-muted">
          Kampioni është i mbyllur nga një test i miratuar ose një raport — përdorni «Rishkruaj kampionin» më poshtë.
        </p>
      ) : null}
    </div>
  );
}

type Row = { cubeCount: number; ageDays: number; concretingDate: string };

const seed = (schedule: { cubeCount: number; ageDays: number; concretingDate?: string }): Row => ({
  cubeCount: schedule.cubeCount,
  ageDays: schedule.ageDays,
  concretingDate: schedule.concretingDate ?? ""
});
