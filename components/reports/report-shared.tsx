"use client";
import { splitBilingual } from "@/lib/bilingual";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteCubeSpecimen, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { reportLifecycle } from "@/lib/sample-stage";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";

const HEAD_OF_LAB_NAME = "Ing. Adelajda Duzha";

/**
 * Who signs a report as laboratory responsible.
 *
 * Whoever the test records as having checked it, falling back to the head of
 * the laboratory when nothing was recorded. This used to ignore its argument
 * and always return the constant, so every report signed with the same name
 * whatever the worksheet said — including water, which belongs to the chemical
 * laboratory and has its own responsible.
 */
export function headOfLabName(preferred?: string) {
  const named = preferred?.trim();
  return named || HEAD_OF_LAB_NAME;
}

// Who took the sample, which has only two answers: the laboratory went and
// took it, or the client brought it in. Read from Sample.collectionMethod,
// which has recorded exactly that since registration began.
//
// It used to print the person's name instead — collectedBy or deliveredBy —
// and those are free text, so the line came out as "KLIENTI", "klienti",
// "KLIENTI / CLIENT", "Violeta Biba", "Olsi Duka", and on 354 of 500 samples
// as nothing at all, because nobody filled a box whose answer the register
// already held. One field, four spellings of one fact and a blank line on an
// accredited report. The names are still on the sample, where they belong and
// where they are read as names.
//
// Distinct from who ran the test ("tested by") and from the lab-responsible
// signoff (headOfLabName).
export const SAMPLING_OPERATOR_LAB = "LABORATORI / LABORATORY";
export const SAMPLING_OPERATOR_CLIENT = "KLIENTI / CLIENT";

export function samplingOperator(sample?: Sample) {
  if (!sample) return undefined;
  return sample.collectionMethod === "Collected by lab technician" ? SAMPLING_OPERATOR_LAB : SAMPLING_OPERATOR_CLIENT;
}

/**
 * Whether this report should carry "Laboratori nuk është përgjegjës për fazën
 * e kampionmarrjes".
 *
 * It is a disclaimer about somebody else's work. Where the client took the
 * sample it says something true and necessary: we tested what we were handed
 * and cannot vouch for how it was taken. Where the laboratory went and took
 * the sample itself, the same line disclaims our own work — printed under our
 * own accreditation mark, on a sampling phase we performed.
 *
 * An unknown operator keeps the line, because not knowing who sampled is not
 * the same as knowing it was us.
 */
export function samplingDisclaimerApplies(sampledBy?: string) {
  return sampledBy !== SAMPLING_OPERATOR_LAB;
}

/**
 * The note a simple report prints when nobody typed one. Same rule: the
 * sampling half only where the client did the sampling.
 */
export function defaultReportNotes(sampledBy?: string) {
  return samplingDisclaimerApplies(sampledBy)
    ? "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."
    : "Results relate only to the items tested.";
}

/**
 * The cubes a compressive-strength report prints, in the order it prints them.
 *
 * The certificate and the WhatsApp message that carries it both read from
 * here, so a strength quoted in a chat cannot disagree with the strength on
 * the report. A report that selected specimens shows those; one that did not
 * shows every cube on the worksheet. A test recorded before specimen lists
 * existed holds its single result on the test row itself, and is rebuilt here
 * as one cube so both readers see it the same way.
 */
export function concreteCubeSpecimens(report: Report, sample?: Sample, concrete?: ConcreteCompressiveTest): ConcreteCubeSpecimen[] {
  if (!concrete) return [];
  const selectedSpecimenCodes = report.specimenCodes ?? [];
  if (concrete.specimens?.length) {
    return selectedSpecimenCodes.length
      ? concrete.specimens.filter((specimen) => selectedSpecimenCodes.includes(specimen.specimenCode))
      : concrete.specimens;
  }
  return [
    {
      specimenCode: sample?.sampleCode ?? "-",
      ageDays: concrete.ageDays,
      lengthMm: concrete.cubeLength,
      widthMm: concrete.cubeWidth,
      heightMm: concrete.cubeHeight,
      weightKg: concrete.weight,
      maximumLoadKn: concrete.maximumLoadKn,
      loadedAreaMm2: concrete.loadedAreaMm2,
      compressiveStrengthMpa: concrete.compressiveStrengthMpa,
      visualInspection: concrete.failureType,
      notes: concrete.notes,
      // Older tests hold one result rather than a specimen list. With a
      // single cube the first plate is its plate, by the same rule that
      // pairs the second plate with the second cube.
      truckPlate: concrete.truckPlates?.[0]
    }
  ];
}

/** R(mes), rounded exactly as the certificate's average row prints it. */
export function concreteCubeAverageStrength(specimens: Array<Pick<ConcreteCubeSpecimen, "compressiveStrengthMpa">>) {
  return specimens.length
    ? round(specimens.reduce((sum, specimen) => sum + specimen.compressiveStrengthMpa, 0) / specimens.length, 2)
    : undefined;
}

/**
 * The strength class the report prints: the worksheet's, or else the class
 * written into the sample's notes at intake, which is where it lived before
 * the worksheet had a field for it.
 */
export function concreteStrengthClass(concrete?: ConcreteCompressiveTest, sample?: Sample) {
  return concrete?.strengthClass || sample?.notes?.match(new RegExp("C\d+/\d+"))?.[0];
}

// Stored signature images, matched by a lowercase substring of the name shown
// in a report's signature block (technician, checked-by, or lab responsible —
// wherever that name ends up). Add more entries here as more employees'
// signatures are collected.
const SIGNATURE_IMAGES: { match: string; src: string }[] = [
  { match: "astrit", src: "/signatures/astrit-alliu.png" },
  { match: "adela", src: "/signatures/adela-duzha.png" },
  { match: "fatma", src: "/signatures/fatma-laci.png" },
  { match: "kejsi", src: "/signatures/kejsi-ismaili.png" },
  { match: "ylli", src: "/signatures/ylli-koka.png" }
];

function signatureImageFor(name?: string) {
  if (!name) return undefined;
  const normalized = name.toLowerCase();
  return SIGNATURE_IMAGES.find((entry) => normalized.includes(entry.match))?.src;
}

/**
 * The engineers of the laboratory, who sign with their title.
 *
 * "Ing." is Inxhinier, and it goes before the name. Matched the same way as
 * the signatures above, by a lowercase substring, because the name reaching a
 * report comes from whatever was typed into the test — "Adelajda Duzha" from
 * one screen, "Eng. Adelajda Duzha" from the stored user record — and the
 * report has to print the same thing either way.
 */
const ENGINEER_NAMES = ["adela", "ylli", "francesko"];

/** Any title already on the front of a name: Ing., Eng., or Ing./Eng. */
const EXISTING_TITLE = /^\s*(?:ing\.?\s*\/\s*eng\.?|ing\.?|eng\.?)\s+/i;

/**
 * A name as it should be signed. An engineer gets "Ing." in front of it,
 * whatever title the stored name arrived with; everyone else is left exactly
 * as they are — the technicians are not engineers and the report should not
 * say they are.
 */
export function signedName(name?: string) {
  if (!name) return name;
  const bare = name.replace(EXISTING_TITLE, "").trim();
  const normalized = bare.toLowerCase();
  return ENGINEER_NAMES.some((engineer) => normalized.includes(engineer)) ? `Ing. ${bare}` : name;
}

function SignatureImg({
  name,
  heightMm,
  align
}: {
  name?: string;
  heightMm: number;
  align: "center" | "start";
}) {
  const src = signatureImageFor(name);
  // Nothing on file for this person, but the cell still has to exist. These
  // two images are the children of a two-column grid: return null and the
  // row is left holding one child, which grid auto-places in the FIRST
  // column — so the laboratory responsible's signature and company stamp
  // slid under the technician's name and signed the wrong half of the
  // report. Only visible when the technician has no signature and the
  // responsible does, which is why it survived 1,298 reports signed by
  // someone who has one. Zero height, so a row is still only as tall as
  // the image beside it and no report grows a second page.
  if (!src) return <div aria-hidden className="h-0" />;
  return (
    <img
      src={src}
      alt=""
      className={`signature-block-img h-auto${align === "start" ? "" : " mx-auto"}`}
      style={{ height: `${heightMm}mm` }}
    />
  );
}

// A report's two signatories (tested-by, lab-responsible), laid out as three
// stacked two-column rows — label row, name row, image row — rather than two
// independent columns each stacking their own label+name+image. CSS grid
// sizes each row to its tallest cell across BOTH columns, so a label that
// wraps to two lines in one column doesn't push that column's name (or
// signature) down relative to the other one: both names, and both signature
// images (for whichever employees have one on file, via signatureImageFor),
// are always level with each other.
export function SignaturePair({
  wrapperClassName,
  columnClassName = "grid grid-cols-2 gap-16 text-center",
  testedByLabel,
  testedByName,
  responsibleLabel,
  responsibleName,
  heightMm = 22,
  align = "center",
  bordered = false
}: {
  wrapperClassName?: string;
  columnClassName?: string;
  testedByLabel: ReactNode;
  testedByName?: string;
  responsibleLabel: ReactNode;
  responsibleName?: string;
  heightMm?: number;
  align?: "center" | "start";
  bordered?: boolean;
}) {
  const labelClass = bordered
    ? "border-t border-slate-300 pt-3 text-xs font-medium uppercase tracking-wide text-muted"
    : "font-bold";
  const nameClass = bordered ? "text-sm font-semibold text-ink" : "font-bold";
  return (
    <div className={wrapperClassName}>
      <div className={columnClassName}>
        <div className={labelClass}>{testedByLabel}</div>
        <div className={labelClass}>{responsibleLabel}</div>
      </div>
      <div className={`mt-2 ${columnClassName}`}>
        <div className={nameClass}>{signedName(testedByName) || "-"}</div>
        <div className={nameClass}>{signedName(responsibleName) || "-"}</div>
      </div>
      <div className={`mt-1.5 ${columnClassName}`}>
        <SignatureImg name={testedByName} heightMm={heightMm} align={align} />
        <SignatureImg name={responsibleName} heightMm={heightMm} align={align} />
      </div>
    </div>
  );
}

export function ReportHeader({
  report,
  code,
  title,
  subtitle
}: {
  report: Report;
  code: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header>
      <div className="grid items-start gap-4 border-b border-line pb-3 sm:grid-cols-[170px_1fr_92px]">
        <div className="flex items-center">
          <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-[158px]" />
        </div>
        <div className="pt-2 text-center">
          <div className="text-lg font-semibold uppercase tracking-wide text-ink"><BiText>{title}</BiText></div>
          <div className="mt-1 text-sm font-semibold text-lab-burgundy"><BiText>{subtitle}</BiText></div>
          <div className="mt-2 text-xs font-semibold text-ink">Nr. / <span className="italic">No.</span> {report.reportNumber}</div>
        </div>
        <div className="flex justify-end">
          <img src="/brand/da-accreditation.png" alt="DA accreditation Testim S SH ISO/IEC 17025 LT 069" className="h-auto w-[82px]" />
        </div>
      </div>
      {/* Was wholly italic, which italicised the Albanian too. Only the English
          half is inclined now. */}
      <div className="mt-1 text-[6.4px] leading-tight text-muted">
        <div>Kodi / <span className="italic">Code</span>: {code}</div>
        <div>Faqe / <span className="italic">Page</span>: {report.reportSequence} / {report.totalReports}</div>
      </div>
      <div className="mt-2 flex justify-end no-print">
        <StatusBadge status={reportLifecycle(report).stage} />
      </div>
    </header>
  );
}

// The legal disclaimers, issue date and company address block that every
// other report family already has (see OfficialNotesAndFooter) — the
// ReportHeader-based "simple-report" family (aggregate reports) never had
// one; this brings it in line, at the same small scale.
export function SimpleReportLegalFooter({ issueDate, sampledBy }: { issueDate?: string; sampledBy?: string }) {
  return (
    <>
      <div className="mt-3 space-y-0.5 text-[6.4px] leading-tight text-ink">
        <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / <span className="italic">The results relate only to the items tested.</span></p>
        <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / <span className="italic">The test report shall not be reproduced except in full without the written approval of the laboratory.</span></p>
        {samplingDisclaimerApplies(sampledBy) ? (
          <p>Laboratori nuk është përgjegjës për fazën e kampionmarrjes. / <span className="italic">The laboratory is not responsible for the sampling phase.</span></p>
        ) : null}
        <p>Deklaroj që testi është kryer në përputhje me standardin. / <span className="italic">I declare that the test was performed in accordance with the standard.</span></p>
      </div>
      <div className="mt-2 grid grid-cols-[220px_140px] items-end gap-4 text-[6.4px]">
        <div>Data e lëshimit të Raportit të Testimit / <span className="italic">Test Report Issue Date:</span></div>
        <div className="border-b border-black text-center">{formatEuropeanDate(issueDate)}</div>
      </div>
      <footer className="mt-2 text-center text-[6.4px] leading-tight text-blue-700">
        <div className="font-bold text-[#5b193f]">SARP &amp; LAB</div>
        <div>Adresa: Autostrada Tiranë-Durrës, km 29, Fshati Vrrin-Komuna Rrashbull, Durrës Shqipëri. Mob: +355 67 20 22 609; Web: www.sarpandlab.al; Email: d.alliu@sarpandlab.al; NIPT: L 41526502 B</div>
      </footer>
    </>
  );
}

export function ConcreteCubeMeta({ label, value }: { label: string; value?: string }) {
  return (
    <div className="contents">
      <div className="font-bold">{label}</div>
      <div className="font-semibold">{value || "-"}</div>
    </div>
  );
}

const commonInfoLabels: Record<string, { sq: string; en: string }> = {
  "Client / Purchaser": { sq: "Klienti", en: "Purchaser" },
  "Client / Klienti": { sq: "Klienti", en: "Client" },
  "Object / Project": { sq: "Objekti / Projekti", en: "Object / Project" },
  "Testing period": { sq: "Periudha e testimit", en: "Testing period" },
  "Testing start": { sq: "Fillimi i testimit", en: "Testing start" },
  "Testing end": { sq: "Përfundimi i testimit", en: "Testing end" },
  "Testing date": { sq: "Data e testimit", en: "Testing date" },
  "Testing place": { sq: "Vendi i testimit", en: "Testing place" }
};

export function splitBilingualLabel(label: string) {
  if (commonInfoLabels[label]) return commonInfoLabels[label];
  const parts = label.split(" / ");
  return parts.length >= 2 ? { sq: parts[0], en: parts.slice(1).join(" / ") } : undefined;
}

export function Info({ label, value }: { label: string; value?: string }) {
  const bilingual = splitBilingualLabel(label);
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">
        {bilingual ? <Bilingual sq={bilingual.sq} en={bilingual.en} /> : label}
      </div>
      <div className="mt-1 font-medium text-ink"><BiText>{formatEuropeanDateRange(value)}</BiText></div>
    </div>
  );
}

/**
 * House style for an issued report: Albanian upright, English italic.
 *
 * Takes a label or value written as "A / B", works out which half is which, and
 * italicises the English one while keeping the original word order. Anything
 * that is not a language pair - a formula like "FI = M2 / M1 x 100", a unit like
 * "kg/ml", or a label that is English on both sides like "Client / Purchaser" -
 * is passed through untouched.
 */
export function BiText({ children, className }: { children?: string; className?: string }) {
  if (!children) return null;
  const parts = splitBilingual(children);
  if (!parts) return <>{children}</>;
  if (parts.englishFirst) {
    return (
      <>
        <span className={`italic ${className ?? ""}`}>{parts.en}</span> / {parts.sq}
      </>
    );
  }
  return (
    <>
      {parts.sq} / <span className={`italic ${className ?? ""}`}>{parts.en}</span>
    </>
  );
}

export function Bilingual({ sq, en, className = "" }: { sq: string; en: string; className?: string }) {
  return (
    <span className={`block ${className}`}>
      <span className="block font-semibold text-ink">{sq}</span>
      <span className="mt-0.5 block text-[0.82em] font-normal italic leading-tight text-muted">{en}</span>
    </span>
  );
}

export function BilingualInfo({ sq, en, value }: { sq: string; en: string; value?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase text-muted">
        <Bilingual sq={sq} en={en} />
      </div>
      <div className="mt-1 font-medium text-ink"><BiText>{formatEuropeanDateRange(value)}</BiText></div>
    </div>
  );
}

export type OfficialMetaEntry = {
  sq: string;
  en: string;
  value?: string | number;
  valueClassName?: string;
};

export function OfficialReportShell({
  report,
  code,
  title = "RAPORT TESTIM / TEST REPORT",
  className = "",
  children
}: {
  report: Report;
  code: string;
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`report-a4 official-report print-surface relative rounded-md border border-line bg-white p-4 leading-tight text-black shadow-sm ${className}`}>
      <header>
        <div className="grid grid-cols-[152px_1fr_82px] items-start gap-4 border-b-2 border-black pb-1">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[150px]" />
          <div className="pt-3 text-center">
            <div className="text-[15pt] font-bold uppercase leading-tight"><BiText>{title}</BiText></div>
            <div className="mt-2 text-[10pt] font-bold text-red-600">Nr. / No. {report.reportNumber}</div>
          </div>
          <img src="/brand/da-accreditation.png" alt="DA accreditation Testim S SH ISO/IEC 17025 LT 069" className="ml-auto mt-1 h-auto w-[80px]" />
        </div>
        <div className="mt-1 text-[6pt] leading-tight">
          <div>Kodi / <span className="italic">Code</span>: {code}</div>
          <div>Faqe / <span className="italic">Page</span>: 1/1</div>
        </div>
      </header>
      {children}
    </section>
  );
}

export function OfficialMetaGrid({ entries, className = "mt-6" }: { entries: OfficialMetaEntry[]; className?: string }) {
  return (
    <div className={`${className} official-meta grid grid-cols-[315px_1fr] gap-x-8 gap-y-0.5 text-[10pt] leading-[1.15]`}>
      {entries.map((entry) => (
        <div className="contents" key={`${entry.sq}-${entry.en}`}>
          <div className="font-bold uppercase">{entry.sq} / <span className="italic font-normal normal-case">{entry.en}</span>:</div>
          <div className={`font-semibold ${entry.valueClassName ?? ""}`}><BiText>{formatEuropeanDateRange(entry.value?.toString()) || "-"}</BiText></div>
        </div>
      ))}
    </div>
  );
}

export function OfficialTestingDates({ start, end }: { start?: string; end?: string }) {
  return (
    <div className="contents">
      <div className="font-bold uppercase">DATA E TESTIMIT / <span className="italic font-normal normal-case">DATE OF TESTING</span>:</div>
      <div className="grid grid-cols-[105px_1fr] gap-x-4 font-semibold">
        <span>FILLIMI / <span className="italic font-normal">STARTING</span>:</span>
        <span>{formatEuropeanDate(start)}</span>
        <span>MBARIMI / <span className="italic font-normal">ENDING</span>:</span>
        <span>{formatEuropeanDate(end)}</span>
      </div>
    </div>
  );
}

export function OfficialEnvironmental({
  temperature,
  humidity,
  humidityLabel
}: {
  temperature?: string;
  humidity?: string;
  /**
   * The humidity line as this report's own controlled template words it. The
   * templates disagree — SL-RA-B-7.8/1.10 says "Lagështia relative / Relative
   * Humidity", SL-RA-AS-7.8/1.3 says "Lagështi / Humidity" — so the wording
   * belongs to the report, not to this shell. Left out, the short form stands.
   */
  humidityLabel?: ReactNode;
}) {
  return (
    <div className="contents">
      <div className="font-bold uppercase">KUSHTET AMBJENTALE NË TË CILAT ZHVILLOHET TESTI / <span className="italic font-normal normal-case">ENVIRONMENTAL CONDITIONS</span>:</div>
      <div className="grid grid-cols-[145px_135px] gap-x-3 font-normal">
        <span>Temperatura / <span className="italic">Temperature</span>:</span>
        <span className="official-underline border-b border-black text-center">{withUnit(temperature, " °C")}</span>
        <span>{humidityLabel ?? <>Lagështia / <span className="italic">Humidity</span></>}:</span>
        <span className="official-underline border-b border-black text-center">{withUnit(humidity, "%")}</span>
      </div>
    </div>
  );
}

/**
 * A recorded condition with its unit, added only where the technician did not
 * already type one.
 *
 * The worksheet takes these as free text and both habits are in the register:
 * "20.1" on one test and "20.4 ˚C" on the next, "50" and "50 %". Appending
 * unconditionally printed "20.4 ˚C °C" and "50 % %" on the certificate.
 */
function withUnit(value: string | undefined, unit: string) {
  const text = value?.trim();
  if (!text) return "-";
  // Any symbol or letter beyond the number itself is the technician's own unit.
  return /[^\d.,\s+-]/.test(text) ? text : `${text}${unit}`;
}

export function OfficialAsterisk() {
  return <div className="mt-1 text-[9pt]">Yll (*) tregon që testi është i akredituar / <span className="italic">Asterisk (*) means that the laboratory is accredited for this test</span></div>;
}

export function OfficialNotesAndFooter({
  notes,
  testedBy,
  testedByLabel,
  responsible,
  issueDate,
  layout = "pinned",
  disclaimers,
  sampledBy
}: {
  notes?: string;
  testedBy?: string;
  /**
   * The caption over the tester's signature, where this report's controlled
   * template words it differently — SL-RA-B-7.8/1.10 says "TESTUESI", others
   * say "TESTUAR NGA". Left out, "TESTUAR NGA" stands.
   */
  testedByLabel?: ReactNode;
  responsible?: string;
  /**
   * Who took the sample, exactly as this report prints it on the OPERATORI I
   * MARRJES SË KAMPIONIT line — so the disclaimer below and that line can
   * never disagree. Pass `samplingOperator(sample)`, or the test's own stored
   * operator where it keeps one.
   */
  sampledBy?: string;
  /**
   * The asphalt family carries its own two lines instead of the three below —
   * different wording, not a shortened version of them. Supplied by the report
   * rather than hard-coded here so each family keeps the text its own template
   * carries.
   */
  disclaimers?: ReactNode;
  issueDate?: string;
  /**
   * "pinned" keeps the signature, legal text, issue date and address welded to
   * the foot of the sheet. That suits a report whose table fills the page, but
   * on a short one it strands the signature below a band of empty paper — the
   * admixture report left 82mm of it.
   *
   * "flow" lets the block sit directly under the notes instead, which is how
   * the concrete cube report reads, and what a short report should do.
   *
   * "split" is for a short report on a page you still want to look finished:
   * the signatures follow the notes, while the legal lines, the issue date
   * and the address go where they belong on any letterhead — the foot of the
   * page. The spare paper then sits between the signature and the foot
   * instead of below everything.
   */
  layout?: "pinned" | "flow" | "split";
}) {
  return (
    <>
      <div className="mt-4 grid grid-cols-[120px_1fr] items-end gap-2 text-[9.5pt]">
        <div className="pl-14">Shënime / <span className="italic">Notes</span>:</div>
        <div className="official-underline min-h-4 border-b border-black">{notes}</div>
      </div>
      <div className={layout === "pinned" ? "official-footer-cluster" : "official-footer-flow"}>
        <SignaturePair
          wrapperClassName="official-signatures"
          columnClassName="grid grid-cols-2 gap-16 text-center text-[9.5pt]"
          testedByLabel={testedByLabel ?? <>TESTUAR NGA / <span className="italic font-normal">TESTED BY</span></>}
          testedByName={testedBy}
          responsibleLabel={<>PËRGJEGJËSI I LABORATORIT / <span className="italic font-normal">LABORATORY RESPONSIBLE</span></>}
          responsibleName={headOfLabName(responsible)}
          heightMm={30}
        />
        {/* Under "split" these three travel together to the foot of the
            sheet; under the other two they stay where they are, which is why
            the wrapper carries no layout of its own. */}
        <div className={layout === "split" ? "official-page-foot" : "contents"}>
        <div className="official-disclaimers mt-2 space-y-0.5 text-[6pt] leading-tight">
          {disclaimers ?? <>
          <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / <span className="italic">The results relate only to the items tested.</span></p>
          <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / <span className="italic">The test report shall not be reproduced except in full without the written approval of the laboratory.</span></p>
          {samplingDisclaimerApplies(sampledBy) ? (
            <p>Laboratori nuk është përgjegjës për fazën e kampionmarrjes. / <span className="italic">The laboratory is not responsible for the sampling phase.</span></p>
          ) : null}
          </>}
        </div>
        <div className="official-issue-date mt-2 grid grid-cols-[285px_150px] items-end gap-4 text-[6pt]">
          <div>Data e lëshimit të Raportit të Testimit / <span className="italic">Test Report Issue Date:</span></div>
          <div className="official-underline border-b border-black text-center">{formatEuropeanDate(issueDate)}</div>
        </div>
        <footer className="official-footer mt-2 text-center text-[6pt] leading-tight text-blue-700">
          <div className="font-bold">SARP &amp; LAB</div>
          <div>Adresa: Autostrada Tiranë-Durrës, km 29, Fshati Vrrin-Komuna Rrashbull, Durrës Shqipëri. Mob: +355 67 20 22 609; Web: www.sarpandlab.al; Email: d.alliu@sarpandlab.al; NIPT: L 41526502 B</div>
        </footer>
        </div>
      </div>
    </>
  );
}

/**
 * The cube sizes a certificate prints, out of a padded specimen list.
 *
 * The caller pads to three — `[specimens[0], specimens[1], specimens[2]]` —
 * because the sheet has three sample columns. A test with one cube therefore
 * hands this two `undefined`s, and reading dimensions straight off them threw.
 * The throw was not contained to the field: it unmounted the whole tree, so
 * every route showed "Application error: a client-side exception has occurred",
 * including the one the user reloaded into. A water-penetration test is
 * routinely a single cube, so its certificate could not be opened at all.
 *
 * Cubes of the same size collapse to one entry. Three identical cubes are one
 * description of a specimen, not a list repeating itself three times.
 */
export function sampleDimensions(
  values: Array<{ lengthMm?: number; widthMm?: number; heightMm?: number } | undefined>
) {
  const described = values
    .filter((row) => Boolean(row))
    .map((row) => [row?.lengthMm, row?.widthMm, row?.heightMm].filter(Boolean).join("x"))
    .filter(Boolean);
  return [...new Set(described)].join("; ");
}

export function ReportInfoRow({ label, value }: { label: string; value?: string }) {
  const cleanLabel = label.replace(/:$/, "");
  const bilingual = splitBilingualLabel(cleanLabel);
  return (
    <div className="grid border-b border-line md:grid-cols-[280px_1fr]">
      <div className="bg-lab-porcelain px-3 py-2 font-semibold text-ink">
        {bilingual ? <Bilingual sq={bilingual.sq} en={bilingual.en} /> : `${cleanLabel}:`}
      </div>
      <div className="px-3 py-2 font-medium text-ink"><BiText>{formatEuropeanDateRange(value)}</BiText></div>
    </div>
  );
}


export function CoreMetaRow({ sq, en, value }: { sq: string; en: string; value?: string | number }) {
  return (
    <>
      <div className="font-bold uppercase">{sq} / <span className="italic font-normal normal-case">{en}</span>:</div>
      <div className="font-semibold">{formatEuropeanDateRange(value?.toString()) || "-"}</div>
    </>
  );
}

export function averageReportValues(values: Array<number | undefined>, digits = 1) {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return valid.length ? round(valid.reduce((sum, value) => sum + value, 0) / valid.length, digits) : undefined;
}

export function formatReportNumber(value?: number, digits = 1) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "-";
}

export function formatSieveSize(value: number) {
  if (value === 0) return "0.000";
  if (value < 1) return value.toFixed(3);
  return value.toFixed(1);
}

export function FreezeThawResultRow({ label, symbol, unit, values, average, uncertainty }: { label: string; symbol: string; unit: string; values: number[]; average?: number; uncertainty?: string }) {
  const valid = values.filter((value) => Number.isFinite(value));
  const rowAverage = average ?? (valid.length ? round(valid.reduce((sum, value) => sum + value, 0) / valid.length, 2) : 0);
  return (
    <tr>
      <td className="px-3 py-2">{label}</td>
      <td className="px-3 py-2 font-semibold text-ink">{symbol}</td>
      <td className="px-3 py-2">{unit}</td>
      {values.map((value, index) => <td key={index} className="px-3 py-2">{value || value === 0 ? value : "-"}</td>)}
      <td className="px-3 py-2 font-semibold text-ink">{rowAverage || rowAverage === 0 ? rowAverage : "-"}</td>
      <td className="px-3 py-2">{uncertainty ?? "-"}</td>
    </tr>
  );
}

export function ChemicalReportRow({ no, parameter, unit, method, result }: { no: string; parameter: string; unit: string; method: string; result: number }) {
  return (
    <tr>
      <td className="px-3 py-2 font-semibold text-ink">{no}</td>
      <td className="px-3 py-2">{parameter}</td>
      <td className="px-3 py-2">{unit}</td>
      <td className="px-3 py-2">{method}</td>
      <td className="px-3 py-2 font-semibold text-ink">{result || result === 0 ? result : "-"}</td>
    </tr>
  );
}


/**
 * A grading curve drawn as a curve.
 *
 * A sieve analysis is a continuous distribution sampled at a handful of
 * openings, so joining the points with straight segments draws something the
 * material never did — a chain of kinks at the sieves we happen to own. The
 * printed curve should read as the smooth S the grading actually is.
 *
 * Monotone cubic Hermite (Fritsch–Carlson), not a plain spline: cumulative
 * passing only ever rises with sieve size, and an ordinary Catmull-Rom
 * overshoots at a flat shoulder — it would arch a curve above 100 % passing or
 * below 0, or dip back on itself between two sieves, which on an accredited
 * report would read as a measurement nobody made. Clamping the tangents keeps
 * every point exactly where it was measured and the curve between them
 * monotone.
 *
 * Takes points already in chart pixels, x ascending, and returns an SVG `d`.
 */
export function gradingCurvePath(points: Array<{ x: number; y: number }>) {
  if (points.length < 2) return "";
  const n = points.length;
  const h: number[] = [];
  const delta: number[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    const dx = points[i + 1].x - points[i].x;
    // Two sieves on the same x (a repeated opening) would divide by zero.
    h.push(dx);
    delta.push(dx === 0 ? 0 : (points[i + 1].y - points[i].y) / dx);
  }

  const m: number[] = new Array(n);
  m[0] = delta[0];
  m[n - 1] = delta[n - 2];
  for (let i = 1; i < n - 1; i += 1) {
    m[i] = delta[i - 1] * delta[i] <= 0 ? 0 : (delta[i - 1] + delta[i]) / 2;
  }
  for (let i = 0; i < n - 1; i += 1) {
    if (delta[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const alpha = m[i] / delta[i];
    const beta = m[i + 1] / delta[i];
    const magnitude = Math.hypot(alpha, beta);
    if (magnitude > 3) {
      const scale = 3 / magnitude;
      m[i] = scale * alpha * delta[i];
      m[i + 1] = scale * beta * delta[i];
    }
  }

  const at = (value: number) => round(value, 2);
  let d = `M ${at(points[0].x)},${at(points[0].y)}`;
  for (let i = 0; i < n - 1; i += 1) {
    const third = h[i] / 3;
    d += ` C ${at(points[i].x + third)},${at(points[i].y + m[i] * third)} ${at(points[i + 1].x - third)},${at(points[i + 1].y - m[i + 1] * third)} ${at(points[i + 1].x)},${at(points[i + 1].y)}`;
  }
  return d;
}
