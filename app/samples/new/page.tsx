"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import {
  accreditedSampleTypes,
  getAccreditedTestById,
  getAccreditedTestsForSampleType,
  isAggregateGranulometrySampleType,
  isAsphaltSampleType,
  isConcreteCompressiveAccreditedTest,
  isSteelSampleType
} from "@/lib/accredited-tests";
import { formatEuropeanDate } from "@/lib/date-format";
import { useLabStore, type NewSampleInput } from "@/lib/lab-store";

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function dateFromInput(value: string) {
  return new Date(`${value}T00:00:00`);
}

function maturityAgeForRow(index: number) {
  return [7, 28, 14][index] ?? 28;
}

export default function NewSamplePage() {
  const router = useRouter();
  const store = useLabStore();
  const initialSampleType = accreditedSampleTypes[0] ?? "";
  const initialTestId = getAccreditedTestsForSampleType(initialSampleType)[0]?.id ?? "";
  const [sampleType, setSampleType] = useState(initialSampleType);
  const [accreditedTestId, setAccreditedTestId] = useState(initialTestId);
  const [extraMaterials, setExtraMaterials] = useState<Array<{ sampleType: string; accreditedTestId: string }>>([]);
  const [scheduleRows, setScheduleRows] = useState(2);
  const [scheduleAges, setScheduleAges] = useState([7, 28]);
  const [concretingDate, setConcretingDate] = useState(formatDateInput(new Date()));
  const [scheduleConcretingDates, setScheduleConcretingDates] = useState(() => {
    const today = formatDateInput(new Date());
    return [today, today];
  });
  const testOptions = useMemo(() => getAccreditedTestsForSampleType(sampleType), [sampleType]);
  const selectedTest = getAccreditedTestById(accreditedTestId) ?? testOptions[0];
  const showConcreteSchedule = isConcreteCompressiveAccreditedTest(selectedTest);
  const showSteelWorksheet = isSteelSampleType(sampleType);
  const showAsphaltWorksheet = isAsphaltSampleType(sampleType);
  const canAddMaterials = isAggregateGranulometrySampleType(sampleType);
  const aggregateMaterialTypes = useMemo(
    () => accreditedSampleTypes.filter((type) => isAggregateGranulometrySampleType(type)),
    []
  );
  const chosenMaterialTypes = [sampleType, ...extraMaterials.map((row) => row.sampleType)];

  function addExtraMaterial() {
    const nextType = aggregateMaterialTypes.find((type) => !chosenMaterialTypes.includes(type)) ?? aggregateMaterialTypes[0];
    const nextTests = getAccreditedTestsForSampleType(nextType);
    setExtraMaterials((rows) => [...rows, { sampleType: nextType, accreditedTestId: nextTests[0]?.id ?? "" }]);
  }

  function updateExtraMaterialType(index: number, nextType: string) {
    const nextTests = getAccreditedTestsForSampleType(nextType);
    setExtraMaterials((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { sampleType: nextType, accreditedTestId: nextTests[0]?.id ?? "" } : row)));
  }

  function updateExtraMaterialTest(index: number, testId: string) {
    setExtraMaterials((rows) => rows.map((row, rowIndex) => (rowIndex === index ? { ...row, accreditedTestId: testId } : row)));
  }

  function removeExtraMaterial(index: number) {
    setExtraMaterials((rows) => rows.filter((_, rowIndex) => rowIndex !== index));
  }
  const activeEmployees = store.users.filter((user) => user.isActive !== false);
  const defaultTechnicianId =
    activeEmployees.find((user) => user.fullName.toLowerCase().includes("astrit"))?.id ??
    activeEmployees.find((user) => user.role === "Technician")?.id ??
    activeEmployees[0]?.id ??
    "";
  const today = new Date();
  const defaultReceivedDate = formatDateInput(today);
  const defaultRequiredDate = formatDateInput(today);
  const defaultReportDueDate = formatDateInput(addDays(today, 2));
  const calculatedTestDate = (castingDate: string, ageDays: number) => formatDateInput(addDays(dateFromInput(castingDate), ageDays));
  const calculatedReportDate = (castingDate: string, ageDays: number) => formatDateInput(addDays(dateFromInput(castingDate), ageDays + 1));

  function changeSampleType(nextSampleType: string) {
    const nextTests = getAccreditedTestsForSampleType(nextSampleType);
    setSampleType(nextSampleType);
    setAccreditedTestId(isSteelSampleType(nextSampleType) ? "AT-073" : isAggregateGranulometrySampleType(nextSampleType) ? nextTests[0]?.id ?? "" : nextTests[0]?.id ?? "");
    if (!isAggregateGranulometrySampleType(nextSampleType)) {
      setExtraMaterials([]);
    } else {
      setExtraMaterials((rows) => rows.filter((row) => row.sampleType !== nextSampleType));
    }
  }

  function updateScheduleAge(index: number, ageDays: number) {
    setScheduleAges((ages) => {
      const next = [...ages];
      next[index] = ageDays;
      return next;
    });
  }

  function updateScheduleConcretingDate(index: number, value: string) {
    setScheduleConcretingDates((dates) => {
      const next = [...dates];
      next[index] = value;
      return next;
    });
  }

  function updateDefaultConcretingDate(nextDate: string) {
    setConcretingDate((current) => {
      setScheduleConcretingDates((dates) => dates.map((date) => (date === current ? nextDate : date)));
      return nextDate;
    });
  }

  function removeScheduleRow(indexToRemove: number) {
    setScheduleRows((count) => Math.max(1, count - 1));
    setScheduleAges((ages) => {
      const next = ages.filter((_, index) => index !== indexToRemove);
      return next.length ? next : [7];
    });
    setScheduleConcretingDates((dates) => {
      const next = dates.filter((_, index) => index !== indexToRemove);
      return next.length ? next : [concretingDate];
    });
  }

  function buildNoteFor(test: ReturnType<typeof getAccreditedTestById>, freeformNotes: string): string {
    return [
      freeformNotes,
      test?.measurementRange ? `Intervali i akredituar: ${test.measurementRange}` : "",
      test?.samplingStandard ? `Standardi i kampionimit: ${test.samplingStandard}` : ""
    ]
      .filter(Boolean)
      .join(" | ");
  }

  function buildInputFor(
    materialSampleType: string,
    test: ReturnType<typeof getAccreditedTestById>,
    shared: {
      quantity: number;
      dateReceived: string;
      timeReceived: string;
      collectionMethod: "Delivered by client" | "Collected by lab technician";
      deliveredBy: string;
      collectedBy: string;
      assignedTechnician: string;
      freeformNotes: string;
      requiredTestDate: string;
      reportDueDate: string;
    }
  ): NewSampleInput {
    return {
      clientId: "",
      projectId: "",
      sampleType: materialSampleType,
      sampleDescription: "",
      quantity: shared.quantity,
      dateReceived: shared.dateReceived,
      timeReceived: shared.timeReceived,
      collectionMethod: shared.collectionMethod,
      deliveredBy: shared.deliveredBy,
      collectedBy: shared.collectedBy,
      concretingDate: "",
      requestedTestType: test?.testName ?? "",
      standard: test?.standard || "Standardi nuk është përcaktuar në listën e akreditimit",
      requiredTestDate: shared.requiredTestDate,
      reportDueDate: shared.reportDueDate,
      assignedTechnician: shared.assignedTechnician,
      schedules: [],
      notes: buildNoteFor(test, shared.freeformNotes)
    };
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const freeformNotes = String(form.get("notes") ?? "");
    const notes = buildNoteFor(selectedTest, freeformNotes);
    const concreteSchedules = Array.from({ length: scheduleRows }, (_, index) => {
      const ageDays = Number(form.get(`scheduleMoshaDays-${index}`) || 0);
      const rowConcretingDate = String(form.get(`scheduleConcretingDate-${index}`) || concretingDate);
      return {
        cubeCount: Number(form.get(`scheduleCubeCount-${index}`) || 0),
        ageDays,
        concretingDate: rowConcretingDate,
        requiredTestDate: calculatedTestDate(rowConcretingDate, ageDays),
        reportDueDate: calculatedReportDate(rowConcretingDate, ageDays)
      };
    }).filter((row) => row.cubeCount > 0 && row.ageDays > 0);
    const firstConcreteSchedule = concreteSchedules[0];
    const requiredTestDate = showConcreteSchedule ? firstConcreteSchedule?.requiredTestDate ?? calculatedTestDate(concretingDate, 7) : String(form.get("requiredTestDate"));
    const reportDueDate = showConcreteSchedule ? firstConcreteSchedule?.reportDueDate ?? calculatedReportDate(concretingDate, 7) : String(form.get("reportDueDate"));

    const primaryInput: NewSampleInput = {
      clientId: "",
      projectId: "",
      sampleType,
      sampleDescription: "",
      quantity: Number(form.get("quantity")),
      dateReceived: String(form.get("dateReceived")),
      timeReceived: String(form.get("timeReceived")),
      collectionMethod: String(form.get("collectionMethod")) as "Delivered by client" | "Collected by lab technician",
      deliveredBy: String(form.get("deliveredBy")),
      collectedBy: String(form.get("collectedBy") || "").trim() || "Violeta Biba",
      concretingDate: showConcreteSchedule ? String(form.get("concretingDate") || concretingDate) : "",
      requestedTestType: selectedTest?.testName ?? String(form.get("requestedTestType")),
      standard: selectedTest?.standard || "Standardi nuk është përcaktuar në listën e akreditimit",
      requiredTestDate,
      reportDueDate,
      assignedTechnician: String(form.get("assignedTechnician") || ""),
      schedules: showConcreteSchedule ? concreteSchedules : [],
      notes
    };

    if (!extraMaterials.length) {
      const sampleId = store.createSample(primaryInput);
      router.push(`/samples/${sampleId}`);
      return;
    }

    const shared = {
      quantity: primaryInput.quantity,
      dateReceived: primaryInput.dateReceived,
      timeReceived: primaryInput.timeReceived,
      collectionMethod: primaryInput.collectionMethod,
      deliveredBy: primaryInput.deliveredBy ?? "",
      collectedBy: primaryInput.collectedBy ?? "",
      assignedTechnician: primaryInput.assignedTechnician ?? "",
      freeformNotes,
      requiredTestDate,
      reportDueDate
    };
    const extraInputs = extraMaterials.map((row) => buildInputFor(row.sampleType, getAccreditedTestById(row.accreditedTestId), shared));
    const sampleIds = store.createSampleGroup([primaryInput, ...extraInputs]);
    router.push(`/samples/${sampleIds[0]}`);
  }

  return (
    <>
      <PageHeader title="Kampion i ri" description="Regjistroni kampionin e pranuar pa krijuar test. Kryelaboranti cakton kodin e klientit, pranon kampionin dhe pastaj testi mund të niset." />
      <form onSubmit={submit} className="surface-card grid gap-4 p-5 lg:grid-cols-2">
        <div className="soft-panel p-4 text-sm text-muted lg:col-span-2">
          Zgjedhja e klientit është e fshehur gjatë regjistrimit. Pas ruajtjes, Kryelaboranti merr njoftim për të caktuar kodin e klientit dhe për të pranuar kampionin.
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
        {showAsphaltWorksheet ? (
          <div className="soft-panel p-4 text-sm text-muted lg:col-span-2">
            Për asfalt mund të regjistrohet vetëm Tapet, vetëm Binder, ose Tapet + Binder në të njëjtin kampion. Fleta e testimit më pas ruan të dhënat e përbashkëta dhe raportet dalin veçmas.
          </div>
        ) : null}
        {canAddMaterials ? (
          <div className="soft-panel p-4 lg:col-span-2">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold text-ink">Materiale të tjera në të njëjtin dorëzim</h2>
                <p className="mt-1 text-sm text-muted">
                  Nëse klienti ka sjellë disa materiale njëherësh (p.sh. rërë dhe zhavorr), shtoji këtu. Për secilin krijohet kampion i vet, me kod dhe raport të veçantë, por i lidhur me këtë dorëzim.
                </p>
              </div>
              <button type="button" onClick={addExtraMaterial} className="btn-secondary shrink-0 px-3">
                Shto material
              </button>
            </div>
            {extraMaterials.length ? (
              <div className="mt-4 space-y-3">
                {extraMaterials.map((row, index) => {
                  const rowTests = getAccreditedTestsForSampleType(row.sampleType);
                  return (
                    <div key={index} className="grid gap-3 rounded-md border border-line bg-white p-3 sm:grid-cols-[1fr_1fr_auto]">
                      <label className="block text-sm font-medium text-ink">
                        Materiali
                        <select value={row.sampleType} onChange={(event) => updateExtraMaterialType(index, event.target.value)} className="input mt-1">
                          {aggregateMaterialTypes.map((type) => (
                            <option key={type} value={type} disabled={type !== row.sampleType && chosenMaterialTypes.includes(type)}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm font-medium text-ink">
                        Testi i kërkuar
                        <select value={row.accreditedTestId} onChange={(event) => updateExtraMaterialTest(index, event.target.value)} className="input mt-1">
                          {rowTests.map((test) => (
                            <option key={test.id} value={test.id}>{test.testName}</option>
                          ))}
                        </select>
                      </label>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeExtraMaterial(index)}
                          className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-lab-red transition hover:bg-red-50"
                        >
                          Hiq
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
        <Field label={showConcreteSchedule ? "Numri total i kubeve të pranuara" : showSteelWorksheet ? "Numri total i mostrave të çelikut të pranuara" : showAsphaltWorksheet ? "Numri i mostrave të asfaltit të pranuara" : "Sasia e pranuar"}><input name="quantity" required type="number" min="1" defaultValue={showConcreteSchedule ? "60" : showSteelWorksheet ? "6" : showAsphaltWorksheet ? "2" : "1"} className="input" /></Field>
        <Field label="Data e pranimit"><input name="dateReceived" required type="date" defaultValue={defaultReceivedDate} className="input" /></Field>
        <Field label="Ora e pranimit"><input name="timeReceived" required type="time" defaultValue="09:00" className="input" /></Field>
        <Field label="Mënyra e dorëzimit">
          <select name="collectionMethod" className="input">
            <option value="Delivered by client">Dorëzuar nga klienti</option>
            <option value="Collected by lab technician">Marrë nga tekniku i laboratorit</option>
          </select>
        </Field>
        <Field label="Dorëzuar nga"><input name="deliveredBy" className="input" placeholder="Personi që dorëzoi kampionin" /></Field>
        <Field label="Marrë nga"><input name="collectedBy" className="input" defaultValue="Violeta Biba" placeholder="Emri i personit që regjistron ose merr kampionin" /></Field>
        {showConcreteSchedule ? (
          <Field label="Data bazë e betonimit">
            <input
              name="concretingDate"
              required
              type="date"
              value={concretingDate}
              onChange={(event) => updateDefaultConcretingDate(event.target.value)}
              className="input"
            />
          </Field>
        ) : null}
        <Field label="Personi që do të kryejë testin">
          <select name="assignedTechnician" required defaultValue={defaultTechnicianId} className="input">
            <option value="" disabled>Zgjidh teknikun ose inxhinierin</option>
            {activeEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName}{employee.position ? ` - ${employee.position}` : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Standardi përkatës"><input name="standard" value={selectedTest?.standard || "Standardi nuk është përcaktuar në listën e akreditimit"} readOnly className="input bg-lab-porcelain" /></Field>
        <Field label="Intervali i akredituar i matjes"><input value={selectedTest?.measurementRange || "-"} readOnly className="input bg-lab-porcelain" /></Field>
        <Field label="Standardi i kampionimit"><input value={selectedTest?.samplingStandard || "-"} readOnly className="input bg-lab-porcelain" /></Field>
        {!showConcreteSchedule ? (
          <>
            <Field label="Data e parë e kërkuar për testim"><input name="requiredTestDate" required type="date" defaultValue={defaultRequiredDate} className="input" /></Field>
            <Field label="Afati final i raportit"><input name="reportDueDate" required type="date" defaultValue={defaultReportDueDate} className="input" /></Field>
          </>
        ) : null}
        {showConcreteSchedule ? (
        <div className="lg:col-span-2">
          <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-ink">Plani i testimit</h2>
              <p className="mt-1 text-sm text-muted">Ndani kubet sipas moshës së testimit. Numri i ditëve shkruhet manualisht për çdo grup, ndërsa datat llogariten automatikisht nga data e betonimit e atij rreshti.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setScheduleRows((count) => count + 1);
                setScheduleAges((ages) => [...ages, 28]);
                setScheduleConcretingDates((dates) => [...dates, concretingDate]);
              }}
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
                  <th className="px-3 py-2">Data e betonimit</th>
                  <th className="px-3 py-2">Data e kërkuar e testimit</th>
                  <th className="px-3 py-2">Afati i raportit</th>
                  <th className="px-3 py-2">Veprim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {Array.from({ length: scheduleRows }, (_, index) => {
                  const selectedAge = scheduleAges[index] ?? maturityAgeForRow(index);
                  const selectedConcretingDate = scheduleConcretingDates[index] ?? concretingDate;
                  return (
                    <tr key={index}>
                      <td className="px-3 py-2 font-semibold text-ink">{index + 1}</td>
                      <td className="px-3 py-2">
                        <input name={`scheduleCubeCount-${index}`} type="number" min="0" defaultValue={index === 0 ? 20 : index === 1 ? 40 : ""} className="input" />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          name={`scheduleMoshaDays-${index}`}
                          type="number"
                          min="1"
                          step="1"
                          value={selectedAge}
                          onChange={(event) => updateScheduleAge(index, Number(event.target.value) || 0)}
                          className="input"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          name={`scheduleConcretingDate-${index}`}
                          type="date"
                          value={selectedConcretingDate}
                          onChange={(event) => updateScheduleConcretingDate(index, event.target.value)}
                          className="input"
                        />
                      </td>
                      <td className="px-3 py-2"><input readOnly value={formatEuropeanDate(calculatedTestDate(selectedConcretingDate, selectedAge))} className="input bg-lab-porcelain" /></td>
                      <td className="px-3 py-2"><input readOnly value={formatEuropeanDate(calculatedReportDate(selectedConcretingDate, selectedAge))} className="input bg-lab-porcelain" /></td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => removeScheduleRow(index)}
                          disabled={scheduleRows <= 1}
                          className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-lab-red transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-line disabled:text-slate-400"
                        >
                          Hiq rresht
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        ) : (
          <div className="soft-panel p-4 text-sm text-muted lg:col-span-2">
            Ky plan ruhet me kampionin. Testi krijohet vetëm pasi Kryelaboranti të caktojë klientin dhe të pranojë kampionin.
          </div>
        )}
        <div className="lg:col-span-2">
          <label className="text-sm font-medium text-ink">Shënime</label>
          <textarea name="notes" rows={4} className="input mt-1" placeholder="Shënime trajtimi, referenca dokumentesh ose udhëzime të klientit" />
        </div>
        <div className="lg:col-span-2">
          <button className="btn-primary">Regjistro kampionin</button>
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
