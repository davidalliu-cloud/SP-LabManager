"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import {
  accreditedSampleTypes,
  getAccreditedTestById,
  getAccreditedTestsForSampleType,
  isAggregateGranulometrySampleType,
  isConcreteCompressiveAccreditedTest,
  isSteelSampleType
} from "@/lib/accredited-tests";
import { useLabStore } from "@/lib/lab-store";

export default function NewSamplePage() {
  const router = useRouter();
  const store = useLabStore();
  const initialSampleType = accreditedSampleTypes[0] ?? "";
  const initialTestId = getAccreditedTestsForSampleType(initialSampleType)[0]?.id ?? "";
  const [sampleType, setSampleType] = useState(initialSampleType);
  const [accreditedTestId, setAccreditedTestId] = useState(initialTestId);
  const [scheduleRows, setScheduleRows] = useState(2);
  const testOptions = useMemo(() => getAccreditedTestsForSampleType(sampleType), [sampleType]);
  const selectedTest = getAccreditedTestById(accreditedTestId) ?? testOptions[0];
  const showConcreteSchedule = isConcreteCompressiveAccreditedTest(selectedTest);
  const showSteelWorksheet = isSteelSampleType(sampleType);

  function changeSampleType(nextSampleType: string) {
    const nextTests = getAccreditedTestsForSampleType(nextSampleType);
    setSampleType(nextSampleType);
    setAccreditedTestId(isSteelSampleType(nextSampleType) ? "AT-073" : isAggregateGranulometrySampleType(nextSampleType) ? nextTests[0]?.id ?? "" : nextTests[0]?.id ?? "");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const notes = [
      String(form.get("notes") ?? ""),
      selectedTest?.measurementRange ? `Accredited range: ${selectedTest.measurementRange}` : "",
      selectedTest?.samplingStandard ? `Sampling standard: ${selectedTest.samplingStandard}` : ""
    ]
      .filter(Boolean)
      .join(" | ");
    const sampleId = store.createSample({
      clientId: "",
      projectId: "",
      sampleType,
      sampleDescription: String(form.get("sampleDescription")),
      quantity: Number(form.get("quantity")),
      dateReceived: String(form.get("dateReceived")),
      timeReceived: String(form.get("timeReceived")),
      collectionMethod: String(form.get("collectionMethod")) as "Delivered by client",
      deliveredBy: String(form.get("deliveredBy")),
      collectedBy: String(form.get("collectedBy")),
      requestedTestType: selectedTest?.testName ?? String(form.get("requestedTestType")),
      standard: selectedTest?.standard || "Standard not specified in accreditation list",
      requiredTestDate: String(form.get("requiredTestDate")),
      reportDueDate: String(form.get("reportDueDate")),
      schedules: showConcreteSchedule
        ? Array.from({ length: scheduleRows }, (_, index) => ({
            cubeCount: Number(form.get(`scheduleCubeCount-${index}`) || 0),
            ageDays: Number(form.get(`scheduleAgeDays-${index}`) || 0),
            requiredTestDate: String(form.get(`scheduleRequiredDate-${index}`) || ""),
            reportDueDate: String(form.get(`scheduleReportDueDate-${index}`) || "")
          })).filter((row) => row.cubeCount > 0 && row.ageDays > 0 && row.requiredTestDate)
        : [],
      notes
    });
    router.push(`/samples/${sampleId}`);
  }

  return (
    <>
      <PageHeader title="New Sample" description="Register the received sample without client identity. The Chief of Lab assigns the client/project afterward to preserve impartiality." />
      <form onSubmit={submit} className="surface-card grid gap-4 p-5 lg:grid-cols-2">
        <div className="soft-panel p-4 text-sm text-muted lg:col-span-2">
          Client selection is intentionally hidden during sample registration. After saving, the sample appears as pending client assignment for the Chief of Lab.
        </div>
        <Field label="Sample type">
          <select value={sampleType} onChange={(event) => changeSampleType(event.target.value)} className="input">
            {accreditedSampleTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field label="Accredited requested test">
          <select value={selectedTest?.id ?? ""} onChange={(event) => setAccreditedTestId(event.target.value)} name="requestedTestType" className="input">
            {testOptions.map((test) => (
              <option key={test.id} value={test.id}>{test.testName}</option>
            ))}
          </select>
        </Field>
        <Field label="Sample description"><input name="sampleDescription" required className="input" placeholder="150 mm cubes from slab pour" /></Field>
        <Field label={showConcreteSchedule ? "Total cubes received" : showSteelWorksheet ? "Total rebar specimens received" : "Quantity received"}><input name="quantity" required type="number" min="1" defaultValue={showConcreteSchedule ? "60" : showSteelWorksheet ? "6" : "1"} className="input" /></Field>
        <Field label="Date received"><input name="dateReceived" required type="date" defaultValue="2026-04-29" className="input" /></Field>
        <Field label="Time received"><input name="timeReceived" required type="time" defaultValue="09:00" className="input" /></Field>
        <Field label="Collection method">
          <select name="collectionMethod" className="input">
            <option>Delivered by client</option>
            <option>Collected by lab technician</option>
          </select>
        </Field>
        <Field label="Delivered by"><input name="deliveredBy" className="input" placeholder="Person delivering sample" /></Field>
        <Field label="Collected by"><input name="collectedBy" className="input" placeholder="Lab technician name" /></Field>
        <Field label="Relevant standard"><input name="standard" value={selectedTest?.standard || "Standard not specified in accreditation list"} readOnly className="input bg-lab-porcelain" /></Field>
        <Field label="Accredited measurement range"><input value={selectedTest?.measurementRange || "-"} readOnly className="input bg-lab-porcelain" /></Field>
        <Field label="Sampling standard"><input value={selectedTest?.samplingStandard || "-"} readOnly className="input bg-lab-porcelain" /></Field>
        <Field label="First required test date"><input name="requiredTestDate" required type="date" defaultValue="2026-05-01" className="input" /></Field>
        <Field label="Final report due date"><input name="reportDueDate" required type="date" defaultValue="2026-05-03" className="input" /></Field>
        {showConcreteSchedule ? (
        <div className="lg:col-span-2">
          <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-ink">Testing schedule</h2>
              <p className="mt-1 text-sm text-muted">Split the received cubes by requested test age/date. Each row creates a separate test alert and batch.</p>
            </div>
            <button
              type="button"
              onClick={() => setScheduleRows((count) => count + 1)}
              className="btn-secondary px-3"
            >
              Add schedule row
            </button>
          </div>
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-3 py-2">Batch</th>
                  <th className="px-3 py-2">Cubes to test</th>
                  <th className="px-3 py-2">Age</th>
                  <th className="px-3 py-2">Required test date</th>
                  <th className="px-3 py-2">Report due date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {Array.from({ length: scheduleRows }, (_, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 font-semibold text-ink">{index + 1}</td>
                    <td className="px-3 py-2">
                      <input name={`scheduleCubeCount-${index}`} type="number" min="0" defaultValue={index === 0 ? 20 : index === 1 ? 40 : ""} className="input" />
                    </td>
                    <td className="px-3 py-2">
                      <select name={`scheduleAgeDays-${index}`} defaultValue={index === 0 ? 7 : 28} className="input">
                        <option value="3">3 days</option>
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="28">28 days</option>
                        <option value="56">56 days</option>
                      </select>
                    </td>
                    <td className="px-3 py-2"><input name={`scheduleRequiredDate-${index}`} type="date" defaultValue={index === 0 ? "2026-05-06" : index === 1 ? "2026-05-27" : ""} className="input" /></td>
                    <td className="px-3 py-2"><input name={`scheduleReportDueDate-${index}`} type="date" defaultValue={index === 0 ? "2026-05-07" : index === 1 ? "2026-05-28" : ""} className="input" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        ) : (
          <div className="soft-panel p-4 text-sm text-muted lg:col-span-2">
            This accredited test will create one pending test record using the required test date above. Rebar tensile tests open the steel worksheet with specimen rows for multiple diameters.
          </div>
        )}
        <div className="lg:col-span-2">
          <label className="text-sm font-medium text-ink">Notes</label>
          <textarea name="notes" rows={4} className="input mt-1" placeholder="Handling notes, uploaded document references, or client instructions" />
        </div>
        <div className="lg:col-span-2">
          <button className="btn-primary">Register sample and create test</button>
        </div>
      </form>
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
