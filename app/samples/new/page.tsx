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
  isMasonryUnitSampleType,
  isPavingElementSampleType,
  isSteelSampleType,
  KERB_UNIT_PACKAGE_NAME,
  KERB_UNIT_PACKAGE_STANDARD,
  MASONRY_UNIT_PACKAGE_NAME,
  MASONRY_UNIT_PACKAGE_STANDARD,
  pavingElementKind,
  PAVING_FLAG_PACKAGE_NAME,
  PAVING_FLAG_PACKAGE_STANDARD
} from "@/lib/accredited-tests";
import { AGGREGATE_ORIGINS, aggregateSampleDescription, aggregateSubtypeKind } from "@/lib/aggregate-subtypes";
import { formatEuropeanDate } from "@/lib/date-format";
import { isFieldSampleType } from "@/lib/field-register";
import { useLabStore, type NewSampleInput } from "@/lib/lab-store";
import { MIN_MATURITY_DAYS, addDaysIso, maturityFromTestDate } from "@/lib/maturity";

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
  // Field work — rebound hammer, static and dynamic plate, concrete cores — is
  // registered in the Field Register and is deliberately not offered here.
  const labSampleTypes = useMemo(() => accreditedSampleTypes.filter((type) => !isFieldSampleType(type)), []);
  const initialSampleType = labSampleTypes[0] ?? "";
  const initialTestId = getAccreditedTestsForSampleType(initialSampleType)[0]?.id ?? "";
  const [sampleType, setSampleType] = useState(initialSampleType);
  const [accreditedTestId, setAccreditedTestId] = useState(initialTestId);
  // Sand and gravel carry an origin and a fraction, but only the origin is
  // known here — the fraction is what the sieving says, so it is chosen later,
  // on the worksheet, and this form does not ask for it. The origin starts
  // empty so the technician has to choose: a pre-selected first option would
  // have half the register reading "river sand" by default.
  const [aggregateOrigin, setAggregateOrigin] = useState("");
  // Other accredited tests asked for on this same material. An aggregate
  // usually arrives for several at once, and each one is its own worksheet and
  // its own certificate, so each becomes a test of its own when the sample is
  // accepted — under one sample code, because it is one delivery of one sand.
  const [extraTestIds, setExtraTestIds] = useState<string[]>([]);
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
  // Masonry units are registered as one package: no sub-test choice; all four
  // determinations are run together and reported on one SL-RA-EM report.
  const isMasonryUnit = isMasonryUnitSampleType(sampleType);
  // Kerbs and paving flags register the same way: the three accredited
  // determinations are run on one delivered set across two worksheets and come
  // out on one report, so there is no sub-test to choose.
  const isPavingElement = isPavingElementSampleType(sampleType);
  const pavingKind = pavingElementKind(sampleType);
  const showSteelWorksheet = isSteelSampleType(sampleType);
  const showAsphaltWorksheet = isAsphaltSampleType(sampleType);
  // Only aggregates for now: a cube sample's several tests are the same test at
  // different ages (that is what the schedule below does), and masonry, kerbs
  // and flags already register as one package.
  const canAddTests = isAggregateGranulometrySampleType(sampleType);
  const subtypeKind = aggregateSubtypeKind(sampleType);
  const extraTestOptions = useMemo(
    () => testOptions.filter((test) => test.id !== (selectedTest?.id ?? "")),
    [testOptions, selectedTest]
  );
  const chosenExtraTests = extraTestIds
    .map((id) => getAccreditedTestById(id))
    .filter((test): test is NonNullable<typeof test> => Boolean(test));

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
    // The origin belonged to the delivery being left behind.
    setAggregateOrigin("");
    setAccreditedTestId(isSteelSampleType(nextSampleType) ? "AT-073" : isAggregateGranulometrySampleType(nextSampleType) ? nextTests[0]?.id ?? "" : nextTests[0]?.id ?? "");
    // The other tests belonged to the material being left behind.
    setExtraTestIds([]);
  }

  function toggleExtraTest(testId: string) {
    setExtraTestIds((ids) => (ids.includes(testId) ? ids.filter((id) => id !== testId) : [...ids, testId]));
  }

  /** The main test moving into the list would ask for the same thing twice. */
  function chooseMainTest(testId: string) {
    setAccreditedTestId(testId);
    setExtraTestIds((ids) => ids.filter((id) => id !== testId));
  }

  function updateScheduleAge(index: number, ageDays: number) {
    setScheduleAges((ages) => {
      const next = [...ages];
      next[index] = ageDays;
      return next;
    });
  }

  /**
   * The other direction: name the day the cube is tested, and the age follows.
   *
   * The age stays the single stored value - this writes through to it rather
   * than keeping a second copy of the same fact, so the two can never drift.
   */
  function updateScheduleTestDate(index: number, value: string) {
    const castingDate = scheduleConcretingDates[index] ?? concretingDate;
    const ageDays = maturityFromTestDate(castingDate, value);
    if (ageDays === undefined) return;
    updateScheduleAge(index, ageDays);
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
      sampleDescription: subtypeKind ? aggregateSampleDescription(sampleType, aggregateOrigin) : "",
      aggregateOrigin: subtypeKind ? aggregateOrigin : undefined,
      quantity: Number(form.get("quantity")),
      dateReceived: String(form.get("dateReceived")),
      timeReceived: String(form.get("timeReceived")),
      collectionMethod: String(form.get("collectionMethod")) as "Delivered by client" | "Collected by lab technician",
      deliveredBy: String(form.get("deliveredBy")),
      collectedBy: String(form.get("collectedBy") || "").trim() || "Violeta Biba",
      concretingDate: showConcreteSchedule ? String(form.get("concretingDate") || concretingDate) : "",
      requestedTestType: isMasonryUnit
        ? MASONRY_UNIT_PACKAGE_NAME
        : pavingKind === "kerb"
          ? KERB_UNIT_PACKAGE_NAME
          : pavingKind === "flag"
            ? PAVING_FLAG_PACKAGE_NAME
            : (selectedTest?.testName ?? String(form.get("requestedTestType"))),
      standard: isMasonryUnit
        ? MASONRY_UNIT_PACKAGE_STANDARD
        : pavingKind === "kerb"
          ? KERB_UNIT_PACKAGE_STANDARD
          : pavingKind === "flag"
            ? PAVING_FLAG_PACKAGE_STANDARD
            : (selectedTest?.standard || "Standardi nuk është përcaktuar në listën e akreditimit"),
      requiredTestDate,
      reportDueDate,
      additionalTests: canAddTests
        ? chosenExtraTests.map((test) => ({
            testName: test.testName,
            standard: test.standard || "Standardi nuk është përcaktuar në listën e akreditimit"
          }))
        : undefined,
      assignedTechnician: String(form.get("assignedTechnician") || ""),
      schedules: showConcreteSchedule ? concreteSchedules : [],
      notes
    };

    const sampleId = store.createSample(primaryInput);
    router.push(`/samples/${sampleId}`);
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
            {labSampleTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </Field>
        {subtypeKind ? (
          <>
            <Field label="Origjina / Origin">
              <select
                value={aggregateOrigin}
                onChange={(event) => setAggregateOrigin(event.target.value)}
                className="input"
                required
              >
                <option value="">— Zgjidh origjinën —</option>
                {AGGREGATE_ORIGINS.map((origin) => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </Field>
            <div className="soft-panel p-3 text-sm text-muted lg:col-span-2">
              Përshkrimi i kampionit në raport:{" "}
              <span className="font-semibold text-ink">
                {aggregateOrigin
                  ? aggregateSampleDescription(sampleType, aggregateOrigin)
                  : "— plotëso origjinën —"}
              </span>
              <div className="mt-1">
                Fraksioni shtohet në emër pas granulometrisë — zgjidhet në fletën e punës, para gjenerimit të raportit.
              </div>
            </div>
          </>
        ) : null}
        {isMasonryUnit || isPavingElement ? (
          <Field label="Testi i akredituar i kërkuar">
            <div className="input flex items-center bg-lab-porcelain text-muted">
              {isMasonryUnit
                ? "Paketë e plotë — të gjitha testet e muraturës / Full package — all masonry tests"
                : pavingKind === "kerb"
                  ? "Paketë e plotë — dimensionet, absorbimi, përkulja (EN 1340) / Full package"
                  : "Paketë e plotë — dimensionet, absorbimi, përkulja (EN 1339) / Full package"}
            </div>
          </Field>
        ) : (
          <Field label="Testi i akredituar i kërkuar">
            <select value={selectedTest?.id ?? ""} onChange={(event) => chooseMainTest(event.target.value)} name="requestedTestType" className="input">
              {testOptions.map((test) => (
                <option key={test.id} value={test.id}>{test.testName}</option>
              ))}
            </select>
          </Field>
        )}
        {canAddTests && extraTestOptions.length ? (
          <div className="soft-panel p-4 lg:col-span-2">
            <h2 className="text-sm font-semibold text-ink">Teste të tjera për të njëjtin material</h2>
            <p className="mt-1 text-sm text-muted">
              Zgjidh çdo test tjetër që kërkohet për këtë {sampleType}. Kampioni mbetet një, me një kod të vetëm; për secilin
              test krijohet fleta e vet e punës dhe raporti i vet kur Kryelaboranti e pranon kampionin.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {extraTestOptions.map((test) => (
                <label key={test.id} className="flex items-start gap-2 rounded-md border border-line bg-white p-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={extraTestIds.includes(test.id)}
                    onChange={() => toggleExtraTest(test.id)}
                    className="mt-0.5 h-4 w-4 accent-lab-burgundy"
                  />
                  <span>
                    {test.testName}
                    <span className="block text-xs text-muted">{test.standard}</span>
                  </span>
                </label>
              ))}
            </div>
            {chosenExtraTests.length ? (
              <p className="mt-3 text-sm font-medium text-ink">
                Do të krijohen {chosenExtraTests.length + 1} teste për këtë kampion.
              </p>
            ) : null}
          </div>
        ) : null}
        {showAsphaltWorksheet ? (
          <div className="soft-panel p-4 text-sm text-muted lg:col-span-2">
            Për asfalt mund të regjistrohet vetëm Tapet, vetëm Binder, ose Tapet + Binder në të njëjtin kampion. Fleta e testimit më pas ruan të dhënat e përbashkëta dhe raportet dalin veçmas.
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
          <p className="mb-2 text-xs leading-snug text-muted">
            Mosha dhe data e testimit janë e njëjta gjë e shkruar në dy mënyra: ndryshoni njërën dhe tjetra llogaritet vetë.
            Për kampionët që mbërrijnë vonë, caktoni datën kur doni ta testoni dhe mosha reale del automatikisht.
          </p>
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
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          min={addDaysIso(selectedConcretingDate, MIN_MATURITY_DAYS)}
                          value={calculatedTestDate(selectedConcretingDate, selectedAge)}
                          onChange={(event) => updateScheduleTestDate(index, event.target.value)}
                          className="input"
                        />
                        {selectedAge !== maturityAgeForRow(index) ? (
                          <p className="mt-1 text-xs text-muted">Mosha {selectedAge} ditë</p>
                        ) : null}
                      </td>
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
