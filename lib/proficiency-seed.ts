import type { ProficiencyTest } from "./proficiency";

/**
 * From SL-RP-7.7.1k, Versioni 5, as updated 16.09.2025.
 *
 * The rounds from June 2024 onward, which is what the current 2025–2028 cycle
 * and the year before it consist of. The register's earlier history, back to
 * 2015, stays in the Word document: it is thirteen pages, it belongs to closed
 * cycles, and transcribing it by hand would introduce errors into the one
 * record whose accuracy the lab has already been marked down on.
 *
 * Results are not seeded. Every verdict on the page is computed from the
 * z-score, which is also how the register's own −2.03 "i kënaqshëm" gets
 * corrected without anyone having to notice it.
 */
type Row = [
  testName: string,
  matrix: string,
  method: string,
  comparisonType: string,
  organiser: string,
  labCode: string,
  period: string,
  year: number,
  zScore: number | undefined
];

const IN = "Instituti i ndërtimit";
const PTS = "PTS BULGARIA";
const ILC = "Krahasim nderlaboratorik";
const PT = "Test zotësie";

const ROWS: Row[] = [
  // Instituti i ndërtimit, IN-L-9, Qershor 2024
  ["Formulimi i recetës së betonit", "Beton i freskët", "BS EN 206-2013:A2-2021", ILC, IN, "IN-L-9", "Qershor 2024", 2024, -1.64],
  ["Përcaktimi i shpejtësisë së impulsit ultrasonik", "Beton i ngurtësuar", "BS EN 12504-4:2021", ILC, IN, "IN-L-9", "Qershor 2024", 2024, 0.85],
  ["Përcaktimi i reduktimit të ujit", "Shtesa për beton (Aditivë)", "BS EN 934-2:2009+A1-2012", ILC, IN, "IN-L-9", "Qershor 2024", 2024, -1.07],
  ["Përcaktimi i lëndës së thatë", "Shtesa për beton (Aditivë)", "BS EN 480-8:2012", ILC, IN, "IN-L-9", "Qershor 2024", 2024, 0.02],
  ["Përcaktimi i rezistencës së ngjitjes për ngjitësit me bazë çimento", "Adezivë për pllaka qeramike (kolla)", "SSH EN 12004-2:2017", ILC, IN, "IN-L-9", "Qershor 2024", 2024, 0.28],

  // PTS BULGARIA, 24133, Qershor 2024
  ["Pesha volumore", "Agregate", "BS EN 1097-3:1998", PT, PTS, "24133", "Qershor 2024", 2024, -1.18],

  // PTS BULGARIA, 251104, Janar – Gusht 2025
  ["Përcaktimi i rezistencës në fragmentim – Los Angeles", "Agregate", "BS EN 1097-2:2020", PT, PTS, "251104", "Janar - Gusht 2025", 2025, 0.84],

  // Instituti i ndërtimit, IN-L-12, Janar – Korrik 2025
  ["Përcaktimi i numrit të kthimit - Sklerometër", "Beton i ngurtësuar", "BS EN 12350-2:2021", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, 0.72],
  ["Përcaktimi i rezistencës në përkulje", "Çimento", "BS EN 196-1:2016", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, -0.44],
  ["Përcaktimi i rezistencës në shtypje", "Çimento", "BS EN 196-1:2016", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, -0.53],
  ["Përcaktimi i shpërndarjes granulometrike – Metoda me sita (4 mm)", "Agregate (Rëra)", "BS EN 933-1:2012", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, 2.53],
  ["Përcaktimi i shpërndarjes granulometrike – Metoda me sita (2 mm)", "Agregate (Rëra)", "BS EN 933-1:2012", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, 0.06],
  ["Përcaktimi i shpërndarjes granulometrike – Metoda me sita (1 mm)", "Agregate (Rëra)", "BS EN 933-1:2012", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, 0.53],
  ["Përcaktimi i shpërndarjes granulometrike – Metoda me sita (0.5 mm)", "Agregate (Rëra)", "BS EN 933-1:2012", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, 0.77],
  ["Përcaktimi i shpërndarjes granulometrike – Metoda me sita (0.250 mm)", "Agregate (Rëra)", "BS EN 933-1:2012", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, 1.26],
  ["Përcaktimi i shpërndarjes granulometrike – Metoda me sita (0.125 mm)", "Agregate (Rëra)", "BS EN 933-1:2012", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, 1.27],
  ["Përcaktimi i shpërndarjes granulometrike – Metoda me sita (0.063 mm)", "Agregate (Rëra)", "BS EN 933-1:2012", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, 0.62],
  ["Masa për njësi të gjatësisë", "Shufra çeliku", "EN ISO 6892-1:2019", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, 0.2],
  ["Kontrolli i përmasave (diametri)", "Shufra çeliku", "EN ISO 6892-1:2019", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, 1.47],
  ["Rezistenca në tërheqje në këputje", "Shufra çeliku", "EN ISO 6892-1:2019", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, -1.99],
  ["Zgjatimi relativ", "Shufra çeliku", "EN ISO 6892-1:2019", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, 1.51],
  ["Përcaktimi i absorbimit të ujit për shkak të kapilaritetit", "Tulla Qeramike", "EN 772-11:2011", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, -1.69],
  ["Rezistenca në shtypje", "Tulla Qeramike", "EN 772-1:2011", ILC, IN, "IN-L-12", "Janar - Korrik 2025", 2025, -2.03],

  // PTS BULGARIA, 257118, Korrik 2025 – Janar 2026
  ["Përcaktimi i konsistencës", "Çimento", "EN 196-3:2016", PT, PTS, "257118", "Korrik 2025 - Janar 2026", 2025, 1.8],
  ["Përcaktimi i fillimit të kohës së ngrirjes", "Çimento", "EN 196-3:2016", PT, PTS, "257118", "Korrik 2025 - Janar 2026", 2025, 0.39],
  ["Përcaktimi i mbarimit të kohës së ngrirjes", "Çimento", "EN 196-3:2016", PT, PTS, "257118", "Korrik 2025 - Janar 2026", 2025, 0.28],
  ["Përcaktimi i ndryshimit të njëtrajtshëm të vëllimit (Ekspansioni)", "Çimento", "EN 196-3:2016", PT, PTS, "257118", "Korrik 2025 - Janar 2026", 2025, 1.58]
];

export const proficiencySeed: ProficiencyTest[] = ROWS.map(
  ([testName, matrix, method, comparisonType, organiser, labCode, period, year, zScore], index) => ({
    id: `pt-${String(index + 1).padStart(3, "0")}`,
    testName,
    matrix,
    method,
    comparisonType,
    organiser,
    labCode,
    period,
    year,
    zScore,
    createdAt: "2026-09-20T00:00:00.000Z"
  })
);
