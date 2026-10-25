/**
 * The two offer templates, described field by field.
 *
 * `public/offer-templates/*.docx` are the Word templates themselves, untouched.
 * Everything variable in them is written as a bracketed marker in a yellow
 * highlighted run — `[nr]`, `[PLOTËSO: adresa]`, `[..]` — and this file says
 * what each marker means, in the order the markers appear in the document.
 *
 * Why order and not names: the same marker string means different things in
 * different places. `[PLOTËSO]` is the client's address the first time it
 * appears and the quality manager's name the second; `[nr]` is the offer
 * number inside `SL-OF-[nr]/2026` and the headcount of lab technicians when it
 * stands alone; `[30]` is a monitoring day, then a retention period, then two
 * payment percentages. So a replacement either applies to every occurrence of
 * its marker, or names one field per occurrence. The counts below were read off
 * the templates and are verified against them by `lib/offer-fill.ts`, which
 * refuses to generate rather than let a stray `[PLOTËSO]` reach a client.
 */

export type OfferKind = "lab" | "geotech";

export type OfferFieldKind = "text" | "longtext" | "date" | "number" | "choice";

export interface OfferField {
  key: string;
  label: string;
  kind: OfferFieldKind;
  group: string;
  /** Pre-filled when the form opens. */
  value?: string;
  /** For `choice`: the label is what the user picks, the value is what lands in the document. */
  options?: { label: string; value: string }[];
  help?: string;
  /** Shown after the input, e.g. "m", "%", "ditë". */
  unit?: string;
  /** Filled by the app, shown but not typed into — the offer number. */
  readOnly?: boolean;
}

/**
 * One marker and what fills it.
 *
 * `field` fills every occurrence from the same field. `fields` fills the first
 * occurrence from the first key, the second from the second, and so on — the
 * length is therefore also the expected occurrence count. `text` is a fixed
 * string, which is how the `[KONFIRMO …]` and `[PËRSHTAT …]` notes-to-self get
 * deleted instead of being sent to a client.
 */
export type OfferReplacement =
  | { find: string; field: string }
  | { find: string; fields: string[] }
  | { find: string; text: string };

export interface OfferTemplate {
  kind: OfferKind;
  title: string;
  subtitle: string;
  /** Served from `public/`, so the route fetches it rather than reading the filesystem. */
  file: string;
  /** Download name, with `{nr}` and `{klienti}` filled in. */
  download: string;
  groups: string[];
  fields: OfferField[];
  replacements: OfferReplacement[];
}

/* ------------------------------------------------------------------ shared */

function todayIso() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** `2026-03-14` becomes `14.03.2026`, the form the templates are written in. */
export function albanianDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  return match ? `${match[3]}.${match[2]}.${match[1]}` : iso.trim();
}

/** Thousands separated with commas, as every price in the templates is. */
export function money(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return Math.round(value).toLocaleString("en-US");
}

/** The client-facing fields both offers share. */
function clientFields(projectLabel: string): OfferField[] {
  return [
    { key: "clientName", label: "Emri i klientit", kind: "text", group: "Klienti" },
    { key: "clientAddress", label: "Adresa e klientit", kind: "text", group: "Klienti" },
    {
      key: "contactPerson",
      label: "Personi i kontaktit",
      kind: "text",
      group: "Klienti",
      help: "Shkruhet në «Në vëmendje të:» dhe në tabelën e klientit."
    },
    {
      key: "clientContact",
      label: "Kontakti i plotë",
      kind: "text",
      group: "Klienti",
      help: "Emri, telefoni dhe e-maili, të ndarë me presje."
    },
    {
      key: "clientRequest",
      label: "Kërkesa e klientit",
      kind: "text",
      group: "Klienti",
      help: "Data dhe mënyra e kërkesës, p.sh. «e-mail i datës 12.03.2026»."
    },
    { key: "projectName", label: projectLabel, kind: "text", group: "Objekti" }
  ];
}

/**
 * The transport zone the catalogue is written for.
 *
 * Rows P1, R3 and R4 name it, and the field can change it, so the catalogue
 * text has to follow — see labLines() in lib/offer-fill.ts.
 */
export const DEFAULT_TRANSPORT_ZONE = "Durrës – Tiranë";

/* --------------------------------------------------------------- lab offer */

const LAB_FIELDS: OfferField[] = [
  {
    key: "offerNumber",
    label: "Numri i ofertës",
    kind: "text",
    group: "Oferta",
    readOnly: true,
    help: "Caktohet vetë, vazhdim i numrit të fundit në regjistrin e ofertave."
  },
  { key: "offerDate", label: "Data e ofertës", kind: "date", group: "Oferta", value: todayIso() },
  { key: "priceValidity", label: "Çmimet të vlefshme deri", kind: "date", group: "Oferta", value: "2026-12-31" },
  ...clientFields("Emërtimi i objektit"),

  { key: "qualityManager", label: "Menaxheri i cilësisë", kind: "text", group: "Ekipi" },
  { key: "clientCoordinator", label: "Koordinatori i klientit", kind: "text", group: "Ekipi" },
  {
    key: "technicianCount",
    label: "Inxhinierë dhe teknikë laboratori",
    kind: "number",
    group: "Ekipi",
    value: "4"
  },

  {
    key: "certifications",
    label: "Sistemi i menaxhimit të kompanisë",
    kind: "text",
    group: "Kredencialet",
    value: "ISO/IEC 17025:2017, certifikata DPA LT 069",
    help: "Lista e certifikatave në fuqi. Shkruaj vetëm ato që mbahen realisht."
  },
  {
    key: "coreRepair",
    label: "Riparimi i vrimave të karrotave",
    kind: "choice",
    group: "Kushtet tregtare",
    value: "nuk përfshihet",
    options: [
      { label: "Nuk përfshihet", value: "nuk përfshihet" },
      { label: "Përfshihet", value: "përfshihet" }
    ]
  },
  {
    key: "specialOrderPayment",
    label: "Pagesa për porosi të veçanta",
    kind: "choice",
    group: "Kushtet tregtare",
    value: "100% paraprakisht",
    options: [
      { label: "100% paraprakisht", value: "100% paraprakisht" },
      { label: "Me dorëzimin e raportit", value: "me dorëzimin e raportit" }
    ]
  },
  { key: "paymentDays", label: "Afati i pagesës së faturës", kind: "number", group: "Kushtet tregtare", value: "15", unit: "ditë" },
  { key: "frameworkThreshold", label: "Pragu mujor për zbritje", kind: "number", group: "Kushtet tregtare", value: "300000", unit: "ALL" },
  { key: "frameworkDiscount", label: "Zbritja mbi prag", kind: "number", group: "Kushtet tregtare", value: "5", unit: "%" },
  { key: "longTermMonths", label: "Kontratë kuadër më e gjatë se", kind: "number", group: "Kushtet tregtare", value: "12", unit: "muaj" },
  { key: "longTermDiscount", label: "Zbritja për kontratë të gjatë", kind: "number", group: "Kushtet tregtare", value: "10", unit: "%" },
  { key: "urgentWindow", label: "Afati i shërbimit urgjent", kind: "text", group: "Kushtet tregtare", value: "24 orëve" },
  { key: "urgentSurcharge", label: "Shtesa për shërbim urgjent", kind: "number", group: "Kushtet tregtare", value: "50", unit: "%" },
  { key: "cancellationCharge", label: "Tarifa për vizitë të anuluar", kind: "number", group: "Kushtet tregtare", value: "50", unit: "%" },
  { key: "sampleRetentionDays", label: "Ruajtja e mostrave pas raportit", kind: "number", group: "Kushtet tregtare", value: "30", unit: "ditë" },
  { key: "transportZone", label: "Zona e transportit (kodi P1)", kind: "text", group: "Kushtet tregtare", value: "Durrës – Tiranë" }
];

const LAB_REPLACEMENTS: OfferReplacement[] = [
  // Longest first, so the offer-number marker is consumed inside its
  // `SL-OF-…/2026` wrapper and the bare `[nr]` that is left over is the
  // headcount in the team table, not a second offer number.
  { find: "SL-OF-[nr]/2026", field: "@offerRef" },
  { find: "[[emërtimi i objektit]]", field: "projectName" },

  { find: "[dd.mm.2026]", fields: ["@offerDate", "@offerDate", "@offerDate", "@offerDate"] },
  { find: "[31.12.2026]", fields: ["@priceValidity", "@priceValidity", "@priceValidity"] },

  { find: "[PLOTËSO: emri i klientit]", fields: ["clientName", "clientName", "clientName", "clientName"] },
  { find: "[PLOTËSO: emri, telefoni, e-mail]", field: "clientContact" },
  { find: "[PLOTËSO: data dhe mënyra e kërkesës]", field: "clientRequest" },
  { find: "[PLOTËSO: adresa]", field: "clientAddress" },
  { find: "[PLOTËSO: emri i personit të kontaktit]", field: "contactPerson" },
  { find: "[PLOTËSO]", fields: ["clientAddress", "qualityManager", "clientCoordinator"] },
  {
    find: "[emërtimi i objektit]",
    fields: ["projectName", "projectName", "projectName", "projectName", "projectName"]
  },
  // Three bare markers, and the middle one is not an offer number: the team
  // table counts technicians with the same `[nr]`.
  { find: "[nr]", fields: ["offerNumber", "technicianCount", "offerNumber"] },
  { find: "[emri i klientit]", field: "clientName" },
  { find: "[përshtat]", text: "" },

  // Notes the template author left for themselves. They go with the space in
  // front of them, so the sentence closes cleanly on its full stop.
  { find: "[KONFIRMO listën dhe vlefshmërinë e certifikatave: ISO 9001, ISO 14001, ISO 45001, ISO 27001, PAS 99]", field: "certifications" },
  { find: "[KONFIRMO / shto projekte të tjera]", text: "" },
  { find: "[KONFIRMO skemat PT]", text: "" },
  { find: "[KONFIRMO certifikimin]", text: "" },
  { find: "[KONFIRMO me këshilltarin ligjor]", text: "" },

  { find: "[përfshihet / nuk përfshihet]", field: "coreRepair" },
  { find: "[100% paraprakisht ose me dorëzimin e raportit]", field: "specialOrderPayment" },
  { find: "[15]", field: "paymentDays" },
  { find: "[300,000]", field: "@frameworkThreshold" },
  { find: "[5]", field: "frameworkDiscount" },
  { find: "[12]", field: "longTermMonths" },
  { find: "[10]", field: "longTermDiscount" },
  { find: "[24 orëve]", field: "urgentWindow" },
  { find: "[50]", fields: ["urgentSurcharge", "cancellationCharge"] },
  { find: "[30]", field: "sampleRetentionDays" },
  { find: "[Durrës – Tiranë]", field: "transportZone" },
  // Rows R3 and R4 name the same zone in plain text, so they move with it
  // rather than contradicting row P1.
  { find: "jashtë zonës Durrës – Tiranë", fields: ["@zoneOutside", "@zoneOutside"] }
];

/* ----------------------------------------------------------- geotech offer */

/**
 * Section 10.1, the priced bill of quantities.
 *
 * The unit prices are the 2026 rates and are already printed in the template,
 * so only the quantity is a field; the line value is quantity times rate, and
 * the subtotal, VAT and total follow from those. `derive` pre-fills the
 * quantity from the scope already typed above, which is where most of these
 * numbers come from anyway — but each one stays editable, because the site
 * decides them in the end.
 */
export interface BoqLine {
  code: string;
  description: string;
  unit: string;
  price: number;
  derive: (get: (key: string) => number) => number;
}

export const GEOTECH_BOQ: BoqLine[] = [
  { code: "A3", description: "Pozicionimi GPS i pikave", unit: "pikë", price: 3000, derive: (get) => get("boreholeCount") },
  { code: "A4", description: "Rilevim me dron dhe skanim GPR", unit: "lot", price: 35000, derive: () => 0 },
  {
    code: "B1",
    description: "Shpim rrotullues Ø100 mm, 0–30 m",
    unit: "ml",
    price: 3264,
    derive: (get) => get("boreholeCount") * get("boreholeDepth")
  },
  { code: "B2", description: "Lëvizja e sondës ndërmjet pikave", unit: "pikë", price: 8000, derive: (get) => get("boreholeCount") },
  { code: "B3", description: "Prova SPT", unit: "provë", price: 2500, derive: (get) => get("sptCount") },
  { code: "B4", description: "Kampion i pashqetësuar U100", unit: "copë", price: 3500, derive: (get) => get("undisturbedSamples") },
  { code: "B5", description: "Kampion i shqetësuar", unit: "copë", price: 500, derive: (get) => get("disturbedSamples") },
  {
    code: "B6",
    description: "Mbushja e shpimeve me çimento-bentonit",
    unit: "ml",
    price: 800,
    // The piezometer holes are not grouted: they keep the standpipe.
    derive: (get) => Math.max(0, (get("boreholeCount") - get("piezometerCount")) * get("boreholeDepth"))
  },
  {
    code: "C1",
    description: "Instalimi i piezometrit Ø50 mm",
    unit: "ml",
    price: 1800,
    derive: (get) => get("piezometerCount") * get("boreholeDepth")
  },
  { code: "C2", description: "Kapak mbrojtës i piezometrit", unit: "copë", price: 6000, derive: (get) => get("piezometerCount") },
  { code: "C3", description: "Vizitë monitorimi e nivelit të ujit", unit: "vizitë", price: 8000, derive: (get) => get("monitoringVisits") },
  { code: "C4", description: "Analizë kimike e ujit nëntokësor", unit: "kampion", price: 12000, derive: () => 1 },
  { code: "D1", description: "Profil sizmik MASW (24 kanale)", unit: "profil", price: 45000, derive: (get) => get("maswProfiles") },
  { code: "E2", description: "Analiza kimike e dheut", unit: "kampion", price: 5000, derive: () => 2 }
];

/** The rows whose quantity and value are printed in the template and never change. */
export const GEOTECH_FIXED_TOTAL = 20000 + 50000 + 133333 + 83333 + 80000;

/** Section 2.1, the orientative laboratory programme. Quantities only. */
export const GEOTECH_LAB_PROGRAMME: {
  key: string;
  label: string;
  derive: (get: (key: string) => number) => number;
}[] = [
  { key: "labMoisture", label: "Lagështia natyrale", derive: (get) => get("undisturbedSamples") + get("disturbedSamples") },
  { key: "labDensity", label: "Dendësia natyrale", derive: (get) => get("undisturbedSamples") },
  { key: "labParticleDensity", label: "Dendësia e grimcave", derive: (get) => Math.max(2, Math.round(get("undisturbedSamples") / 3)) },
  { key: "labGradation", label: "Analiza granulometrike", derive: (get) => get("disturbedSamples") },
  { key: "labAtterberg", label: "Kufijtë e Atterbergut", derive: (get) => get("disturbedSamples") },
  { key: "labShear", label: "Prerja direkte (CD)", derive: (get) => Math.max(2, Math.round(get("undisturbedSamples") / 3)) },
  { key: "labOedometer", label: "Ngjeshja edometrike", derive: (get) => Math.max(2, Math.round(get("undisturbedSamples") / 3)) },
  { key: "labUcs", label: "Shtypja njëboshtore", derive: (get) => Math.max(2, Math.round(get("undisturbedSamples") / 4)) },
  { key: "labSoilChemistry", label: "Analiza kimike e dheut", derive: () => 2 },
  { key: "labWaterChemistry", label: "Analiza kimike e ujit", derive: () => 1 },
  { key: "labTriaxial", label: "Triaksial UU / CU (opsionale)", derive: () => 0 }
];

const GEOTECH_FIELDS: OfferField[] = [
  {
    key: "offerNumber",
    label: "Numri i ofertës",
    kind: "text",
    group: "Oferta",
    readOnly: true,
    help: "Caktohet vetë, vazhdim i numrit të fundit në regjistrin e ofertave."
  },
  { key: "offerDate", label: "Data e ofertës", kind: "date", group: "Oferta", value: todayIso() },
  ...clientFields("Emërtimi i objektit"),
  {
    key: "location",
    label: "Vendndodhja",
    kind: "text",
    group: "Objekti",
    help: "Shkruhet në kopertinë, në temën e letrës dhe në tekst."
  },
  { key: "siteZone", label: "Zona dhe bashkia", kind: "text", group: "Objekti" },
  {
    key: "siteDetails",
    label: "Të dhënat e sheshit",
    kind: "longtext",
    group: "Objekti",
    help: "Adresa ose njësia strukturore, sipërfaqja e truallit, koordinatat."
  },
  {
    key: "buildingDescription",
    label: "Objekti i parashikuar",
    kind: "longtext",
    group: "Objekti",
    help: "Numri i kateve mbi tokë dhe nëntokë, funksioni, lloji i themelit."
  },

  { key: "boreholeCount", label: "Numri i shpimeve", kind: "number", group: "Fusha e punës", value: "4" },
  { key: "boreholeDepth", label: "Thellësia e një shpimi", kind: "number", group: "Fusha e punës", value: "20", unit: "m" },
  { key: "sptCount", label: "Prova SPT", kind: "number", group: "Fusha e punës", value: "24" },
  { key: "undisturbedSamples", label: "Kampione të pashqetësuara", kind: "number", group: "Fusha e punës", value: "8" },
  { key: "disturbedSamples", label: "Kampione të shqetësuara", kind: "number", group: "Fusha e punës", value: "12" },
  { key: "piezometerCount", label: "Piezometra", kind: "number", group: "Fusha e punës", value: "2" },
  { key: "monitoringVisits", label: "Vizita monitorimi", kind: "number", group: "Fusha e punës", value: "3" },
  { key: "monitoringLastDay", label: "Vizita e fundit pas", kind: "number", group: "Fusha e punës", value: "30", unit: "ditë" },
  // A number, not the template's "1–2": line D1 of the bill of quantities is
  // priced per profile, and a range cannot be multiplied by a unit price.
  { key: "maswProfiles", label: "Profile MASW", kind: "number", group: "Fusha e punës", value: "2" },
  { key: "durationWeeks", label: "Kohëzgjatja", kind: "text", group: "Fusha e punës", value: "4", unit: "javë" },
  { key: "drillRate", label: "Ritmi i shpimit", kind: "text", group: "Fusha e punës", value: "15–25", unit: "m/ditë" },
  { key: "rigModel", label: "Modeli i sondës (opsionale)", kind: "text", group: "Fusha e punës" },
  {
    key: "waterSupply",
    label: "Uji për shpimin",
    kind: "choice",
    group: "Fusha e punës",
    value: "",
    options: [
      { label: "Sigurohet nga klienti në shesh", value: "" },
      { label: "Përfshihet në çmim", value: " ose përfshihet në çmim" }
    ]
  },

  {
    key: "certifications",
    label: "Sistemi i menaxhimit të kompanisë",
    kind: "text",
    group: "Kredencialet",
    value: "ISO/IEC 17025:2017, certifikata DPA LT 069",
    help: "Lista e certifikatave në fuqi. Shkruaj vetëm ato që mbahen realisht."
  },
  {
    key: "expectedGround",
    label: "Kushtet e pritshme të truallit",
    kind: "longtext",
    group: "Objekti",
    value: "depozitime të shkrifëta, nivel i cekët i ujërave nëntokësore, sizmicitet i lartë, mundësi lëngëzimi",
    help: "Shkruhet në përmbledhjen ekzekutive, pas «kushtet e pritshme të truallit në zonë:»."
  },
  {
    key: "includedForGround",
    label: "Oferta përfshin, për këto kushte",
    kind: "longtext",
    group: "Objekti",
    value: "prova SPT, piezometra, analiza kimike të ujit, vlerësimin e lëngëzimit sipas EN 1998-5",
    help: "Çfarë mbulon oferta pikërisht për kushtet e mësipërme."
  },
  { key: "projectCoordinator", label: "Koordinatori i projektit", kind: "text", group: "Ekipi" },
  { key: "geologist", label: "Inxhinier gjeolog", kind: "text", group: "Ekipi" },
  { key: "surveyor", label: "Topograf / hartograf", kind: "text", group: "Ekipi" },

  { key: "advancePercent", label: "Paradhënie me miratimin", kind: "number", group: "Kushtet tregtare", value: "30", unit: "%" },
  { key: "interimPercent", label: "Pas përfundimit të terrenit", kind: "number", group: "Kushtet tregtare", value: "40", unit: "%" },
  { key: "finalPercent", label: "Me dorëzimin e raporteve", kind: "number", group: "Kushtet tregtare", value: "30", unit: "%" },
  { key: "paymentDays", label: "Afati i pagesës së faturës", kind: "number", group: "Kushtet tregtare", value: "15", unit: "ditë" },
  { key: "sampleRetentionDays", label: "Ruajtja e kampioneve", kind: "number", group: "Kushtet tregtare", value: "30", unit: "ditë" }
];

/**
 * Every bare `[..]` in the geotechnical template, in document order.
 *
 * The template uses one marker for fifty different numbers, so position is the
 * only thing that tells them apart. Keys beginning `@` are computed in
 * `lib/offer-fill.ts`; the rest are fields above or bill-of-quantities cells.
 */
const GEOTECH_DOTS: string[] = [
  "@offerDate", // revision history, first issue
  "@totalMetres", // executive summary: N boreholes × D m = … ml
  "sptCount",
  "undisturbedSamples",
  "disturbedSamples",
  "durationWeeks",
  // The summary row is labelled "Vlera e ofertës (pa TVSH)", so this one is
  // the subtotal; the acceptance paragraph further down says "(me TVSH)" and
  // takes the total.
  "@subtotal",
  ...GEOTECH_LAB_PROGRAMME.map((row) => row.key),
  ...GEOTECH_BOQ.flatMap((line) => [`@qty.${line.code}`, `@value.${line.code}`]),
  "@subtotal",
  "@vat",
  "@totalWithVat",
  "@totalWithVat" // acceptance paragraph
];

const GEOTECH_REPLACEMENTS: OfferReplacement[] = [
  { find: "SL-OF-[nr]/2026", field: "@offerRef" },
  { find: "[nr]", fields: ["offerNumber", "offerNumber"] },
  { find: "[[emërtimi i objektit]]", field: "projectName" },
  { find: "[[vendndodhja]]", field: "location" },

  { find: "[dd.mm.2026]", fields: ["@offerDate", "@offerDate"] },

  { find: "[PLOTËSO: emërtimi i objektit]", field: "projectName" },
  { find: "[PLOTËSO: emri i klientit]", fields: ["clientName", "clientName"] },
  { find: "[PLOTËSO: emri, telefoni, e-mail]", field: "clientContact" },
  { find: "[PLOTËSO: data dhe mënyra e kërkesës, p.sh. e-mail i datës ...]", field: "clientRequest" },
  { find: "[PLOTËSO: adresa]", field: "clientAddress" },
  { find: "[PLOTËSO: emri i personit të kontaktit]", field: "contactPerson" },
  { find: "[PLOTËSO: zona, bashkia]", field: "siteZone" },
  { find: "[PLOTËSO: adresa/njësia strukturore, sipërfaqja e truallit, koordinatat]", field: "siteDetails" },
  {
    find: "[PLOTËSO: numri i kateve mbi tokë dhe nëntokë, funksioni, lloji i parashikuar i themelit]",
    field: "buildingDescription"
  },
  { find: "[PLOTËSO]", fields: ["clientAddress", "projectCoordinator", "geologist", "surveyor"] },

  { find: "[emri i klientit]", field: "clientName" },
  { find: "[emërtimi i objektit]", field: "projectName" },
  { find: "[vendndodhja]", fields: ["location", "location", "location"] },
  { find: "[përshtat]", text: "" },

  // These two carry content: the bracket text is the template author's own
  // suggestion, so it becomes the field's starting value rather than a note
  // that has to be deleted.
  { find: "[PËRSHTAT: p.sh. depozitime të shkrifëta, nivel i cekët i ujërave nëntokësore, sizmicitet i lartë, mundësi lëngëzimi]", field: "expectedGround" },
  { find: "[PËRSHTAT: prova SPT, piezometra, analiza kimike të ujit, vlerësimin e lëngëzimit sipas EN 1998-5]", field: "includedForGround" },
  { find: "[KONFIRMO listën dhe vlefshmërinë e certifikatave: ISO 9001, ISO 14001, ISO 45001, ISO 27001, PAS 99]", field: "certifications" },

  { find: "[PËRSHTAT sipas zonës; shembulli më poshtë është për zona bregdetare]", text: "" },
  { find: "[PËRSHTAT programin sipas numrit dhe thellësisë së shpimeve]", text: "" },
  { find: "[KONFIRMO me këshilltarin ligjor]", text: "" },

  { find: "[modeli]", field: "rigModel" },
  { find: "[ose: përfshihet në çmim]", field: "waterSupply" },

  { find: "[N]", fields: ["boreholeCount", "boreholeCount"] },
  { find: "[D]", fields: ["boreholeDepth", "boreholeDepth"] },
  { find: "[1–2]", fields: ["maswProfiles", "maswProfiles"] },
  { find: "[2]", fields: ["piezometerCount", "piezometerCount"] },
  { find: "[3]", fields: ["monitoringVisits", "monitoringVisits"] },
  { find: "[15–25]", field: "drillRate" },
  { find: "[40]", field: "interimPercent" },
  { find: "[30]", fields: ["monitoringLastDay", "sampleRetentionDays", "advancePercent", "finalPercent"] },
  { find: "[15]", field: "paymentDays" },

  { find: "[..]", fields: GEOTECH_DOTS }
];

/* ------------------------------------------------------------------ export */

export const OFFER_TEMPLATES: Record<OfferKind, OfferTemplate> = {
  lab: {
    kind: "lab",
    title: "Ofertë laboratorike – testimi i materialeve",
    subtitle: "Katalogu i plotë i testimeve me çmimet njësi 2026; klienti zgjedh testimet më pas.",
    file: "/offer-templates/oferta-laboratorike.docx",
    download: "SL-OF-{nr}-2026 Oferta Laboratorike - {klienti}.docx",
    groups: ["Oferta", "Klienti", "Objekti", "Ekipi", "Kredencialet", "Kushtet tregtare"],
    fields: LAB_FIELDS,
    replacements: LAB_REPLACEMENTS
  },
  geotech: {
    kind: "geotech",
    title: "Ofertë investigim gjeoteknik dhe sizmik",
    subtitle: "Shpime, MASW dhe studim sizmologjik, me preventiv të çmimuar sipas sasive.",
    file: "/offer-templates/oferta-gjeoteknike.docx",
    download: "SL-OF-{nr}-2026 Oferta Gjeoteknike - {klienti}.docx",
    groups: [
      "Oferta",
      "Klienti",
      "Objekti",
      "Fusha e punës",
      "Ekipi",
      "Kredencialet",
      "Kushtet tregtare"
    ],
    fields: GEOTECH_FIELDS,
    replacements: GEOTECH_REPLACEMENTS
  }
};

export const OFFER_KINDS: OfferKind[] = ["lab", "geotech"];
