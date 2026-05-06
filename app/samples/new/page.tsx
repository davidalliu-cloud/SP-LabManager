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
      selectedTest?.measurementRange ? `Intervali i akredituar: ${selectedTest.measurementRange}` : "",
      selectedTest?.samplingStandard ? `Standardi i kampionimit: ${selectedTest.samplingStandard}` : ""
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
      collectionMethod: String(form.get("collectionMethod")) as "Delivered by client" | "Collected by lab technician",
      deliveredBy: String(form.get("deliveredBy")),
      collectedBy: String(form.get("collectedBy")),
      requestedTestType: selectedTest?.testName ?? String(form.get("requestedTestType")),
      standard: selectedTest?.standard || "Standardi nuk është përcaktuar në listën e akreditimit",
      requiredTestDate: String(form.get("requiredTestDate")),
      reportDueDate: String(form.get("reportDueDate")),
      schedules: showConcreteSchedule
        ? Array.from({ length: scheduleRows }, (_, index) => ({
            cubeCount: Number(form.get(`scheduleCubeCount-${index}`) || 0),
            ageDays: Number(form.get(`scheduleMoshaDays-${index}`) || 0),
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
      <PageHeader title="Kampion i ri" description="Regjistroni kampionin e pranuar pa identitet klienti. Kryelaboranti cakton më pas klientin dhe projektin për të ruajtur paanshmërinë." />
      <form onSubmit={submit} className="surface-card grid gap-4 p-5 lg:grid-cols-2">
        <div className="soft-panel p-4 text-sm text-muted lg:col-span-2">
          Zgjedhja e klientit është e fshehur gjatë regjistrimit të kampionit. Pas ruajtjes, kampioni kalon në pritje për caktimin e klientit nga Kryelaboranti.
        </div>
        <Field label="Tipi i kampionit">
          <select value={sampleType} onChange={(event) => changeSampleType(event.target.value)} className="input">
            {accreditedSampleTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field label="Testi i akredituar i kërkuar">
          <select value={selectedTest?.id ?? ""} onChange={(event) => setAccreditedTestId(event.target.value)} name="requestedTestType" className="input">
            {testOptions.map((test) => (
              <option key={test.id} value={test.id}>{test.testName}</option>
            ))}
          </select>
        </Field>
        <Field label="Përshkrimi i kampionit"><input name="sampleDescription" required className="input" placeholder="Kube 150 mm nga betonimi i soletës" /></Field>
        <Field label={showConcreteSchedule ? "Numri total i kubeve të pranuara" : showSteelWorksheet ? "Numri total i mostrave të çelikut të pranuara" : "Sasia e pranuar"}><input name="quantity" required type="number" min="1" defaultValue={showConcreteSchedule ? "60" : showSteelWorksheet ? "6" : "1"} className="input" /></Field>
        <Field label="Data e pranimit"><input name="dateReceived" required type="date" defaultValue="2026-04-29" className="input" /></Field>
        <Field label="Ora e pranimit"><input name="timeReceived" required type="time" defaultValue="09:00" className="input" /></Field>
        <Field label="Mënyra e dorëzimit">
          <select name="collectionMethod" className="input">
            <option value="Delivered by client">Dorëzuar nga klienti</option>
            <option value="Collected by lab technician">Marrë nga tekniku i laboratorit</option>
          </select>
        </Field>
        <Field label="Dorëzuar nga"><input name="deliveredBy" className="input" placeholder="Personi që dorëzoi kampionin" /></Field>
        <Field label="Marrë nga"><input name="collectedBy" className="input" placeholder="Emri i teknikut të laboratorit" /></Field>
        <Field label="Standardi përkatës"><input name="standard" value={selectedTest?.standard || "Standardi nuk është përcaktuar në listën e akreditimit"} readOnly className="input bg-lab-porcelain" /></Field>
        <Field label="Intervali i akredituar i matjes"><input value={selectedTest?.measurementRange || "-"} readOnly className="input bg-lab-porcelain" /></Field>
        <Field label="Standardi i kampionimit"><input value={selectedTest?.samplingStandard || "-"} readOnly className="input bg-lab-porcelain" /></Field>
        <Field label="Data e parë e kërkuar për testim"><input name="requiredTestDate" required type="date" defaultValue="2026-05-01" className="input" /></Field>
        <Field label="Afati final i raportit"><input name="reportDueDate" required type="date" defaultValue="2026-05-03" className="input" /></Field>
        {showConcreteSchedule ? (
        <div className="lg:col-span-2">
          <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-ink">Plani i testimit</h2>
              <p className="mt-1 text-sm text-muted">Ndani kubet e pranuara sipas moshës dhe datës së kërkuar të testimit. Çdo rresht krijon një grup testi dhe njoftim të veçantë.</p>
            </div>
            <button
              type="button"
              onClick={() => setScheduleRows((count) => count + 1)}
              className="btn-secondary px-3"
            >
              Shto rresht plani
            </button>
          </div>
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-3 py-2">Grupi</th>
                  <th className="px-3 py-2">Kube për testim</th>
                  <th className="px-3 py-2">Mosha</th>
                  <th className="px-3 py-2">Data e kërkuar e testimit</th>
                  <th className="px-3 py-2">Afati i raportit</th>
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
                      <select name={`scheduleMoshaDays-${index}`} defaultValue={index === 0 ? 7 : 28} className="input">
                        <option value="3">3 ditë</option>
                        <option value="7">7 ditë</option>
                        <option value="14">14 ditë</option>
                        <option value="28">28 ditë</option>
                        <option value="56">56 ditë</option>
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
            Ky test i akredituar krijon një test në pritje sipas datës së kërkuar më sipër. Testet e çelikut hapin fletën e punës me rreshta për diametra të ndryshëm.
          </div>
        )}
        <div className="lg:col-span-2">
          <label className="text-sm font-medium text-ink">Shënime</label>
          <textarea name="notes" rows={4} className="input mt-1" placeholder="Shënime trajtimi, referenca dokumentesh ose udhëzime të klientit" />
        </div>
        <div className="lg:col-span-2">
          <button className="btn-primary">Regjistro kampionin dhe krijo testin</button>
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
