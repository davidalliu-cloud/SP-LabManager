import type { Equipment } from "./equipment";

/**
 * The calibrated instruments, transcribed from SL-FP-6.4.7 PROGRAMI I
 * KALIBRIMEVE (Versioni 6, updated 01.03.2025 by the Quality Manager).
 *
 * Seeded exactly as the document reads, expired dates included. That document
 * had not been updated since March 2025 while the lab's 2026 certificates sat
 * in SharePoint, so most entries arrive overdue. That is the point: the
 * register shows what is unrecorded, and correcting it in the app is what
 * makes the app the master copy rather than a third place to look.
 *
 * Tuple order matches the columns of the form:
 * [uniqueCode, name, measurementField, calibrationCentre, type, validFrom,
 *  validUntil, frequency]
 */
type Row = [string, string, string, string, "I.J" | "I.B", string, string, string];

const SARP = "Sarp & Lab";
const DPM = "Drejtoria e Përgjithshme e Metrologjisë";
const AUTO = "Autoinstrument";
const RBC = "RBC Media";

const YEARLY = "1 herë në vit";
const MONTHLY = "1 herë në muaj";
const HALF_YEARLY = "1 herë në 6 muaj";
const THRICE = "3 herë në vit";
const EACH_USE = "Sa herë që përdoret";
const BEFORE_USE = "Para çdo përdorimi";
const NEXT_USE = "Në përdorimin tjetër";

const ROWS: Row[] = [
  ["K 2-2", "Banjo Mari", "Mbajtje e temperaturës konstante / maturim mostre", SARP, "I.B", "10.02.2025", "10.03.2025", MONTHLY],
  ["FM 2", "Banjo Mari", "Mbajtje e temperaturës konstante / maturim mostre", SARP, "I.B", "10.02.2025", "10.03.2025", MONTHLY],
  ["K 12", "Peshore analitike", "Peshim i materialeve me saktesi deri ne 0.1 mg", DPM, "I.J", "30.04.2024", "30.04.2025", YEARLY],
  ["FM 174", "Peshore elektronike", "Peshim i materialeve me saktesi deri ne 0.01 g", SARP, "I.B", "19.02.2025", "19.02.2026", YEARLY],
  ["FM 10", "Peshore elektronike", "Peshim i materialeve me saktesi deri ne 0.01 g", DPM, "I.J", "30.04.2024", "30.04.2025", YEARLY],
  ["FM 185", "Peshore elektronike", "Peshim i materialeve me saktesi deri ne 0.1 g", DPM, "I.J", "30.04.2024", "30.04.2025", YEARLY],
  ["FM 24", "Peshore elektronike", "Peshim i materialeve me saktesi deri ne 1 g", DPM, "I.J", "30.04.2024", "30.04.2025", YEARLY],
  ["FM 166/2", "Peshore elektronike", "Peshim i materialeve me saktesi deri ne 0.1 g", DPM, "I.J", "30.04.2024", "30.04.2025", YEARLY],
  ["FM 4", "Furrë tharëse laboratorike", "Tharje materiali deri në 300 °C", SARP, "I.B", "18.02.2025", "18.03.2025", MONTHLY],
  ["FM 172", "Furrë tharëse laboratorike", "Tharje materiali deri në 300 °C", SARP, "I.B", "18.02.2025", "18.03.2025", MONTHLY],
  ["LO 2", "Furrë tharëse laboratorike", "Tharje materiali deri në 300 °C", SARP, "I.B", "18.02.2025", "18.03.2025", MONTHLY],
  ["FM 1", "Furra Muffle", "Kalcinim materiali deri në 1200 °C", SARP, "I.B", "07.02.2025", "07.03.2025", MONTHLY],
  ["LB 24", "Vizore metalike", "Matje dimensionesh nga 0 deri në 500 mm", AUTO, "I.J", "28.01.2025", "28.01.2026", YEARLY],
  ["LB 24/1", "Vizore metalike", "Matje dimensionesh nga 0 deri në 150 mm", SARP, "I.B", "05.02.2024", "03.02.2025", YEARLY],
  ["SR 01", "Vizore metalike", "Matje dimensionesh nga 0 deri në 300 mm", SARP, "I.B", "05.02.2024", "03.02.2025", YEARLY],
  ["SR 02", "Vizore metalike", "Matje dimensionesh nga 0 deri në 300 mm", SARP, "I.B", "05.02.2024", "03.02.2025", YEARLY],
  ["SR 03", "Vizore metalike", "Matje dimensionesh nga 0 deri në 300 mm", SARP, "I.B", "05.02.2024", "03.02.2025", YEARLY],
  ["SR 04", "Vizore metalike", "Matje dimensionesh nga 0 deri në 300 mm", SARP, "I.B", "05.02.2024", "03.02.2025", YEARLY],
  ["SR 05", "Vizore metalike", "Matje dimensionesh nga 0 deri në 300 mm", SARP, "I.B", "05.02.2024", "03.02.2025", YEARLY],
  ["LB 23", "Kaliber", "Matje dimensionesh nga 0 deri në 150 mm", SARP, "I.B", "17.10.2024", "17.10.2025", YEARLY],
  ["FM 14", "Kaliber", "Matje dimensionesh nga 0 deri në 300 mm", AUTO, "I.J", "28.01.2025", "28.01.2026", YEARLY],
  ["FM 2/1", "Volumometer cilindrik prej metali", "Matje peshe volumore të materialeve (kapacitet 1,15 l)", SARP, "I.B", "22.08.2024", "22.08.2025", YEARLY],
  ["FM 2/2", "Volumometer cilindrik prej metali", "Matje peshe volumore të materialeve (kapacitet 3 l)", SARP, "I.B", "22.08.2024", "22.08.2025", YEARLY],
  ["FM 2/3", "Volumometer cilindrik prej metali", "Matje peshe volumore të materialeve (kapacitet 5 l)", SARP, "I.B", "22.08.2024", "22.08.2025", YEARLY],
  ["FM 2/4", "Volumometer cilindrik prej metali", "Matje peshe volumore të materialeve (kapacitet 15 l)", SARP, "I.B", "22.08.2024", "22.08.2025", YEARLY],
  ["FM 6/1", "Piknometer", "Matje densiteti specifik (kapaciteti 1000 ml)", SARP, "I.B", "15.01.2025", "15.01.2026", YEARLY],
  ["FM 7", "Piknometer", "Matje densiteti specifik (kapaciteti 1000 ml)", SARP, "I.B", "15.01.2025", "15.01.2026", YEARLY],
  ["FM 8", "Piknometer", "Matje densiteti specifik (kapaciteti 500 ml)", SARP, "I.B", "15.01.2025", "15.01.2026", YEARLY],
  ["K 2/1", "Piknometer", "Matje densiteti specifik (kapaciteti 100 ml)", SARP, "I.B", "15.01.2025", "15.01.2026", YEARLY],
  ["K 2", "Piknometer", "Matje densiteti specifik (kapaciteti 50 ml)", SARP, "I.B", "15.01.2025", "15.01.2026", YEARLY],
  ["FM3", "Koni i Rërës për absorbimin", "Përdoret për provën e tharjes së rërës (SSD) për testin e absorbimit", SARP, "I.B", "19.07.2024", "19.07.2025", YEARLY],
  ["FM1", "Kabineti i cikleve ngrirje-shkrirje", "Kabineti i temperaturës i cili simulon ciklet ngrirje-shkrirje të materialeve të ndryshme", SARP, "I.B", "09.07.2024", "09.07.2025", YEARLY],
  ["FM15", "Kaliber Shape Index", "Matës i dimensioneve së kokrrizave të agregatit", AUTO, "I.J", "28.01.2025", "28.01.2026", YEARLY],
  ["FM 12", "Vizore e Shape Index", "Matës i trashësisë së kokrrizave të agregatit", SARP, "I.B", "28.01.2025", "28.01.2026", YEARLY],
  ["FM 13", "Vizore me kunja Shape Index", "Matës i gjatësisë së kokrrizave të agregatit", SARP, "I.B", "28.01.2025", "28.01.2026", YEARLY],

  // Sitat — fraksionim i materialit
  ["FS 6", "Sita", "Fraksionim i materialit me madhësi grimce 4.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 139", "Sita", "Fraksionim i materialit me madhësi grimce 4.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 139/1", "Sita", "Fraksionim i materialit me madhësi grimce 4.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 139/2", "Sita", "Fraksionim i materialit me madhësi grimce 4.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 162/7", "Sita", "Fraksionim i materialit me madhësi grimce 4.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 95/2", "Sita", "Fraksionim i materialit me madhësi grimce 4.75 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 95/3", "Sita", "Fraksionim i materialit me madhësi grimce 4.75 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 96/1", "Sita", "Fraksionim i materialit me madhësi grimce 5.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 96/2", "Sita", "Fraksionim i materialit me madhësi grimce 5.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 140", "Sita", "Fraksionim i materialit me madhësi grimce 5.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 141/1", "Sita", "Fraksionim i materialit me madhësi grimce 6.3 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 141/2", "Sita", "Fraksionim i materialit me madhësi grimce 6.3 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 97/1", "Sita", "Fraksionim i materialit me madhësi grimce 6.3 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 97/2", "Sita", "Fraksionim i materialit me madhësi grimce 6.3 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 141/3", "Sita", "Fraksionim i materialit me madhësi grimce 7.1 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FS 7", "Sita", "Fraksionim i materialit me madhësi grimce 8.0 mm", SARP, "I.B", "26.09.2024", "28.09.2025", YEARLY],
  ["FM 142", "Sita", "Fraksionim i materialit me madhësi grimce 8.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 162/8", "Sita", "Fraksionim i materialit me madhësi grimce 8.0 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 98/1", "Sita", "Fraksionim i materialit me madhësi grimce 9.5 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 98/2", "Sita", "Fraksionim i materialit me madhësi grimce 9.5 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 99/1", "Sita", "Fraksionim i materialit me madhësi grimce 10.0 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 99/2", "Sita", "Fraksionim i materialit me madhësi grimce 10.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 162/3", "Sita", "Fraksionim i materialit me madhësi grimce 10.0 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 162/9", "Sita", "Fraksionim i materialit me madhësi grimce 10.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FS 8", "Sita", "Fraksionim i materialit me madhësi grimce 12.5 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 162/10", "Sita", "Fraksionim i materialit me madhësi grimce 12.5 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 143/1", "Sita", "Fraksionim i materialit me madhësi grimce 12.5 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 100", "Sita", "Fraksionim i materialit me madhësi grimce 12.5 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 101", "Sita", "Fraksionim i materialit me madhësi grimce 13.2 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 102/1", "Sita", "Fraksionim i materialit me madhësi grimce 14.0 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 102/2", "Sita", "Fraksionim i materialit me madhësi grimce 14.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FS 9", "Sita", "Fraksionim i materialit me madhësi grimce 16.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 103", "Sita", "Fraksionim i materialit me madhësi grimce 16.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 145", "Sita", "Fraksionim i materialit me madhësi grimce 16.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 145/1", "Sita", "Fraksionim i materialit me madhësi grimce 16.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 145/2", "Sita", "Fraksionim i materialit me madhësi grimce 16.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 162/11", "Sita", "Fraksionim i materialit me madhësi grimce 16.0 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 104/1", "Sita", "Fraksionim i materialit me madhësi grimce 19.0 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 104/2", "Sita", "Fraksionim i materialit me madhësi grimce 19.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FS 10", "Sita", "Fraksionim i materialit me madhësi grimce 20.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 105/1", "Sita", "Fraksionim i materialit me madhësi grimce 20.0 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 105/2", "Sita", "Fraksionim i materialit me madhësi grimce 20.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 146", "Sita", "Fraksionim i materialit me madhësi grimce 20.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 106", "Sita", "Fraksionim i materialit me madhësi grimce 22.4 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 162/12", "Sita", "Fraksionim i materialit me madhësi grimce 22.4 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 107/1", "Sita", "Fraksionim i materialit me madhësi grimce 25.0 mm", SARP, "I.B", "20.08.2024", "20.08.2025", YEARLY],
  ["FM 107/2", "Sita", "Fraksionim i materialit me madhësi grimce 25.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 147", "Sita", "Fraksionim i materialit me madhësi grimce 25.0 mm", SARP, "I.B", "26.09.2024", "26.09.2024", YEARLY],
  ["FM 162/13", "Sita", "Fraksionim i materialit me madhësi grimce 25.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 108", "Sita", "Fraksionim i materialit me madhësi grimce 31.5 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 149", "Sita", "Fraksionim i materialit me madhësi grimce 31.5 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 162/14", "Sita", "Fraksionim i materialit me madhësi grimce 31.5 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 109/1", "Sita", "Fraksionim i materialit me madhësi grimce 37.5 mm", SARP, "I.B", "26.09.2024", "26.08.2025", YEARLY],
  ["FM 109/2", "Sita", "Fraksionim i materialit me madhësi grimce 37.5 mm", SARP, "I.B", "26.09.2024", "26.08.2025", YEARLY],
  ["FM 162/15", "Sita", "Fraksionim i materialit me madhësi grimce 37.5 mm", SARP, "I.B", "20.08.2024", "20.07.2025", YEARLY],
  ["FM 110", "Sita", "Fraksionim i materialit me madhësi grimce 40.0 mm", SARP, "I.B", "21.08.2024", "21.08.2025", YEARLY],
  ["FM 150", "Sita", "Fraksionim i materialit me madhësi grimce 40.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 162/16", "Sita", "Fraksionim i materialit me madhësi grimce 45.0 mm", SARP, "I.B", "21.08.2024", "21.08.2025", YEARLY],
  ["FM 111/1", "Sita", "Fraksionim i materialit me madhësi grimce 50.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 111/2", "Sita", "Fraksionim i materialit me madhësi grimce 50.0 mm", SARP, "I.B", "21.08.2024", "21.08.2025", YEARLY],
  ["FM 151", "Sita", "Fraksionim i materialit me madhësi grimce 50.0 mm", SARP, "I.B", "26.09.2024", "26.09.2025", YEARLY],
  ["FM 112/1", "Sita", "Fraksionim i materialit me madhësi grimce 63.0 mm", SARP, "I.B", "26.09.2024", "26.08.2025", YEARLY],
  ["FM 112/2", "Sita", "Fraksionim i materialit me madhësi grimce 63.0 mm", SARP, "I.B", "26.09.2024", "26.08.2025", YEARLY],
  ["FM 112/3", "Sita", "Fraksionim i materialit me madhësi grimce 63.0 mm", SARP, "I.B", "26.09.2024", "26.08.2025", YEARLY],
  ["FM 162/17", "Sita", "Fraksionim i materialit me madhësi grimce 53.0 mm", SARP, "I.B", "21.08.2024", "21.08.2025", YEARLY],
  ["FM 162/18", "Sita", "Fraksionim i materialit me madhësi grimce 63.0 mm", SARP, "I.B", "21.08.2024", "21.07.2025", YEARLY],
  ["FM 113/1", "Sita", "Fraksionim i materialit me madhësi grimce 75.0 mm", SARP, "I.B", "20.08.2024", "21.07.2025", YEARLY],
  ["FM 113/2", "Sita", "Fraksionim i materialit me madhësi grimce 75.0 mm", SARP, "I.B", "26.09.2024", "26.08.2025", YEARLY],
  ["FM 113/3", "Sita", "Fraksionim i materialit me madhësi grimce 75.0 mm", SARP, "I.B", "26.09.2024", "26.08.2025", YEARLY],
  ["FM 162/19", "Sita", "Fraksionim i materialit me madhësi grimce 80.0 mm", SARP, "I.B", "21.08.2024", "21.07.2025", YEARLY],
  ["FM 162/20", "Sita", "Fraksionim i materialit me madhësi grimce 100.0 mm", SARP, "I.B", "21.08.2024", "21.07.2025", YEARLY],
  ["FM 32/3", "Tundësi Elektro-Mekanik i sitave", "Tundje e sitave në mënyre automatike", SARP, "I.B", "15.01.2025", "15.01.2026", YEARLY],

  // Sitat katrore — forma e agregateve
  ["FM 85/1", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/2", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/3", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/4", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/5", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/6", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/7", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/8", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/9", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/10", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/11", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/12", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/13", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],
  ["FM 85/14", "Sita katrore", "Sita për formën e agregateve", SARP, "I.B", "19.06.2024", "19.06.2025", YEARLY],

  ["FM 68", "Pajisja e ACV", "Përdoret për përcaktimin e humbjeve në thyerje të agregateve", SARP, "I.B", "22.08.2024", "22.08.2025", YEARLY],
  ["FM 69", "Pajisja e ACV", "Përdoret për përcaktimin e humbjeve në thyerje të agregateve", SARP, "I.B", "22.08.2024", "22.08.2025", YEARLY],
  ["FM A-1", "Pajisja e Los Angeles", "Përdoret për përcaktimin e humbjeve në thërrmim të agregateve", SARP, "I.B", "15.01.2025", "15.01.2026", YEARLY],
  ["FM 9", "Seti i ekuivalentit të rërës", "Përdoret për përcaktimin e pastërtisë së rërës", SARP, "I.B", "19.07.2024", "19.07.2025", YEARLY],
  ["FM 6", "Përzjerësi i llaçeve / çimentos", "Përdoret për përzierjen e pastave të llaçeve dhe çimentos", SARP, "I.B", "16.08.2024", "16.08.2025", YEARLY],
  ["FM 13/V", "Vibruesi automatik", "Përdoret për vibrimin e mostrave të llaçeve dhe çimentos", SARP, "I.B", "05.08.2024", "05.08.2025", YEARLY],
  ["FM 8/V", "Aparati Vikat", "Përdoret për matjen e konsistencës dhe kohës së ngrirjes së çimentos", SARP, "I.B", "20.03.2024", "20.03.2025", YEARLY],
  ["Ç 1", "Aparati Le Chatelier", "Përdoret për matjen e tkurrjes-mufatjes së çimentos", SARP, "I.B", "20.03.2024", "20.03.2025", YEARLY],
  ["K 1", "Aparati Blaine", "Përdoret për përcaktimin e sipërfaqes specifike të çimentos/materialeve të imëta", SARP, "I.B", "15.07.2024", "15.07.2025", YEARLY],
  ["FM 14/1", "Forma metalike prizmi", "Përdoret për mbajtjen e mostrave të çimentos/llaçeve", SARP, "I.B", "10.05.2024", "10.06.2025", YEARLY],
  ["FM 14/1/1", "Forma metalike prizmi", "Përdoret për mbajtjen e mostrave të çimentos/llaçeve", SARP, "I.B", "10.05.2024", "10.06.2025", YEARLY],
  ["FM 171", "Kompaktori Marshall", "Përdoret për ngjeshjen e mostrave cilindrike të asfalteve", SARP, "I.B", "26.06.2024", "26.06.2025", YEARLY],
  ["FM 182", "Penetrometer bitumi", "Përdoret për përcaktimin e penetrimit të bitumit", SARP, "I.B", "28.08.2024", NEXT_USE, EACH_USE],
  ["FM 186", "Aparati për pikën e zbutjes së bitumit", "Përdoret për përcaktimin e pikës së zbutjes së bitumit", SARP, "I.B", "28.08.2024", NEXT_USE, EACH_USE],

  // Gjeoteknika
  ["GJ 2/5", "Aparati Casagrande", "Përdoret për përcaktimin e kufijve të Atterberg të dherave natyrale", SARP, "I.B", "10.12.2024", "10.06.2025", HALF_YEARLY],
  ["GJ 11/1", "Kon i Rërës", "Përdoret për përcaktimin e densitetit të materialit gjeoteknik", SARP, "I.B", "15.01.2025", NEXT_USE, EACH_USE],
  ["GJ 11/15", "Kon i Rërës", "Përdoret për përcaktimin e densitetit të materialit gjeoteknik", SARP, "I.B", "15.01.2025", NEXT_USE, EACH_USE],
  ["GJ 16", "Aparati California Bearing Ratio C.B.R", "Përdoret për përcaktimin e aftësisë mbajtëse të materialeve gjeoteknike", SARP, "I.B", "20.12.2024", "20.04.2025", THRICE],
  ["GJ 10", "Aparati i Proctor-it", "Përdoret për përcaktimin e raportit të Densitetit Maksimal me lagështinë optimale të materialeve gjeoteknike", SARP, "I.B", "11.12.2024", "11.04.2025", THRICE],
  ["GJ 10/5", "Kompaktori automatik për Proctor", "Përdoret për ngjeshjen e mostrave të gjeoteknikës", SARP, "I.B", "20.06.2024", "20.06.2025", YEARLY],
  ["GJ 6", "Pajisja e Digishear", "Përdoret për përcaktimin e rezistencës në prerje të dherave", RBC, "I.J", "26.08.2024", "26.08.2025", YEARLY],
  ["GJ 9", "Pajisja e Oedometrit", "Përdoret për përcaktimin e konsolidimit të dherave", RBC, "I.J", "26.08.2024", "26.08.2025", YEARLY],
  ["GJ 4/1", "Pjaster Dinamike", "Përdoret për përcaktimin e modulit të deformimit të shtresave", SARP, "I.B", "18.06.2024", "18.06.2025", YEARLY],
  ["GJ 3", "Pjaster Statike", "Përdoret për përcaktimin e modulit të deformimit të shtresave", SARP, "I.B", "10.01.2025", "10.06.2025", THRICE],
  ["GJ-3/4/2", "Manometer presioni", "Përdoret për matjen e presionit te ushtruar", DPM, "I.J", "29.08.2024", "29.08.2025", YEARLY],
  ["GJ-3/6/1", "Komparator zhvendosjeje", "Përdoret për përcaktimin e zhvendosjes së shtresës pas aplikimit të një force të caktuar", AUTO, "I.J", "28.01.2025", "28.01.2026", YEARLY],
  ["GJ-3/6", "Komparator zhvendosjeje", "Përdoret për përcaktimin e zhvendosjes së shtresës pas aplikimit të një force të caktuar", AUTO, "I.J", "28.01.2025", "28.01.2026", YEARLY],
  ["GJ-3/6/3", "Komparator zhvendosjeje", "Përdoret për përcaktimin e zhvendosjes së shtresës pas aplikimit të një force të caktuar", AUTO, "I.J", "28.01.2025", "28.01.2026", YEARLY],
  ["GJ-DC-1", "Komparator zhvendosjeje", "Përdoret për përcaktimin e zhvendosjes së shtresës pas aplikimit të një force të caktuar", AUTO, "I.J", "28.01.2025", "28.01.2026", YEARLY],
  ["GJ 5", "Dynamic Cone Penetrometer", "Përdoret për përcaktimin e CBR në terren", SARP, "I.B", "25.08.2023", "24.08.2024", YEARLY],
  ["GJ 7", "Hidrometer", "Përdoret për përcaktimin e sedimentimit të dherave", SARP, "I.B", "27.06.2023", "20.10.2023", THRICE],
  ["K 15", "pH meter", "Përdoret për matjen e pH të tretësirave të ndryshme kimike", SARP, "I.B", "15.09.2023", "16.10.2023", MONTHLY],
  ["K 6", "Termoçift K - Thermocouple thermometer", "Përdoret për kalibrimin e pajisjeve matëse të temperaturës", AUTO, "I.J", "28.01.2025", "28.01.2026", YEARLY],
  ["K 22", "Termometer", "Përdoret për matjen e temperaturës", AUTO, "I.J", "28.01.2025", "28.01.2026", YEARLY],
  ["K 17", "Kronometer", "Përdoret për matjen e kohës dhe kalibrimin e pajisjeve matëse të kohës", AUTO, "I.J", "28.01.2025", "28.01.2026", YEARLY],

  // Presat
  ["FM 38/1", "Presa në shtypje", "Përdoret për shtypjen dhe matjen e qendrueshmërisë të kubikëve të betonit, tullave, karrotave të betonit", RBC, "I.J", "26.08.2024", "26.08.2025", YEARLY],
  ["LB 3", "Presa në përkulje", "Përdoret për përkuljen e trarëve të betonit", RBC, "I.J", "26.08.2024", "26.08.2025", YEARLY],
  ["FM 165", "Presa në shtypje / tërheqje", "Përdoret për tërheqjen e shufrave të çelikut", RBC, "I.J", "26.08.2024", "26.08.2025", YEARLY],
  ["FM 39", "Presa në shtypje Universale", "Përdoret për shtypjen dhe matjen e qendrueshmërisë të çimentos, llaçeve, polisterolit, CBR, Marshall", RBC, "I.J", "26.08.2024", "26.08.2025", YEARLY],

  ["FM 55/17", "Ultrasonic System", "Përdoret për përcaktimin e shpejtësisë së valës në beton", SARP, "I.B", "10.12.2024", "10.06.2025", HALF_YEARLY],
  ["FM 47", "Bartracher Covermeter", "Përdoret për përcaktimin e vendodhjes së shufrave të çelikut në strukturë, diametrit të tyre dhe trashësisë së betonit që mbulon armaturën", SARP, "I.B", "16.01.2025", NEXT_USE, BEFORE_USE],
  ["RT 5", "Sklerometer", "Përdoret për përcaktimin e rezistenës së betonit në struktura", SARP, "I.B", "17.01.2025", NEXT_USE, BEFORE_USE],
  ["RT 4", "Sklerometer", "Përdoret për përcaktimin e rezistenës së betonit në struktura", SARP, "I.B", "19.02.2025", NEXT_USE, BEFORE_USE],
  ["FM 32", "Aparati i penetrimit të ujit në beton", "Përdoret për përcaktimin e nivelit të depërtimit të ujit në beton", DPM, "I.B", "04.10.2024", "04.10.2025", YEARLY],
  ["FM 65/1", "Koni i Slump-it", "Përdoret për përcaktimin e konsistenës së betonit të freskët", SARP, "I.B", "17.07.2024", "17.07.2025", YEARLY],
  ["FM 65/2", "Koni i Slump-it", "Përdoret për përcaktimin e konsistenës së betonit të freskët", SARP, "I.B", "17.07.2024", "17.07.2025", YEARLY],
  ["FM 66/1", "Koni i Slump-it", "Përdoret për përcaktimin e konsistenës së betonit të freskët", SARP, "I.B", "17.07.2024", "17.07.2025", YEARLY],
  ["FM 66/2", "Koni i Slump-it", "Përdoret për përcaktimin e konsistenës së betonit të freskët", SARP, "I.B", "17.07.2024", "17.07.2025", YEARLY],
  ["FM 66/3", "Koni i Slump-it", "Përdoret për përcaktimin e konsistenës së betonit të freskët", SARP, "I.B", "17.07.2024", "17.07.2025", YEARLY],
  ["FM 66/4", "Koni i Slump-it", "Përdoret për përcaktimin e konsistenës së betonit të freskët", SARP, "I.B", "17.07.2024", "17.07.2025", YEARLY],
  ["FM 66/5", "Koni i Slump-it", "Përdoret për përcaktimin e konsistenës së betonit të freskët", SARP, "I.B", "17.07.2024", "17.07.2025", YEARLY],
  ["FM 66/6", "Koni i Slump-it", "Përdoret për përcaktimin e konsistenës së betonit të freskët", SARP, "I.B", "17.07.2024", "17.07.2025", YEARLY],
  ["FM 58/2", "Karrotatriçe (korona)", "Përdoret për marrjen e karrotave të betonit dhe asfaltit", SARP, "I.B", "09.01.2025", NEXT_USE, EACH_USE],
  ["FM 48", "Porozimeter", "Përdoret për përcaktimin e porozitetit të betonit të freskët", SARP, "I.B", "11.06.2024", "11.06.2025", YEARLY],
  ["FM 49", "Porozimeter", "Përdoret për përcaktimin e porozitetit të betonit të freskët", SARP, "I.B", "11.06.2024", "11.06.2025", YEARLY],

  // Format
  ["FM21/10", "Forma kubike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/11", "Forma kubike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/12", "Forma kubike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/14", "Forma kubike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/1", "Forma cilindrike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/2", "Forma cilindrike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/3", "Forma cilindrike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/4", "Forma cilindrike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/5", "Forma cilindrike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/6", "Forma cilindrike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/7", "Forma cilindrike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/8", "Forma cilindrike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM21/9", "Forma cilindrike prej metali", "Përdoret për kalibrimin e formave që përdoren për marrjen e mostrave të betonit të freskët", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],
  ["FM166", "Forma prizmi prej metali", "Përdoret për marrjen e mostrave të betonit të freskët (dimensione 100 x 100 x 500 mm)", SARP, "I.B", "15.06.2024", "14.06.2025", YEARLY],

  // Presa e katërt, e listuar veçmas në planin SL-FP-6.4.6
  ["FM 178", "Presa Marshall", "Përdoret për shtypjen dhe matjen e qendrueshmërisë e asfalteve", RBC, "I.J", "26.08.2024", "26.08.2025", YEARLY],
  ["PM 9", "Presa në shtypje", "Përdoret për shtypjen dhe matjen e qendrueshmërisë të kubikëve të betonit", RBC, "I.J", "26.08.2024", "26.08.2025", YEARLY],
  ["T 1", "Thermo-hygro-barometër", "Përdoret për matjen e kushteve ambjentale (temperature, lagështi dhe presion)", DPM, "I.J", "", "", YEARLY],
  ["FM187/1", "Termometër", "Matje temperature nga -50 °C deri në 300 °C", SARP, "I.B", "", "", YEARLY],
  ["FM187/2", "Termometër", "Matje temperature nga -50 °C deri në 300 °C", SARP, "I.B", "", "", YEARLY],
  ["FM187/3", "Termometër", "Matje temperature nga -50 °C deri në 300 °C", SARP, "I.B", "", "", YEARLY],
  ["FM187/4", "Termometër", "Matje temperature nga -50 °C deri në 300 °C", SARP, "I.B", "", "", YEARLY],
  ["FM187/5", "Termometër", "Matje temperature nga -50 °C deri në 300 °C", SARP, "I.B", "", "", YEARLY],
  ["FM187/6", "Termometër", "Matje temperature nga -50 °C deri në 300 °C", SARP, "I.B", "", "", YEARLY],
  ["FM187/7", "Termometër", "Matje temperature nga -50 °C deri në 300 °C", SARP, "I.B", "", "", YEARLY]
];

/**
 * Ids are derived from the unique code rather than random, so re-seeding an
 * environment produces the same records and a code can be found by its id.
 */
export const equipmentSeed: Equipment[] = ROWS.map(
  ([uniqueCode, name, measurementField, calibrationCentre, calibrationType, validFrom, validUntil, calibrationFrequency]) => ({
    id: `eq-${uniqueCode.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    uniqueCode,
    name,
    measurementField,
    calibrationCentre,
    calibrationType,
    validFrom: validFrom || undefined,
    validUntil: validUntil || undefined,
    calibrationFrequency,
    status: "Në përdorim" as const,
    createdAt: "2026-09-19T00:00:00.000Z"
  })
);
