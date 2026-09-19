import type { Equipment } from "./equipment";

/**
 * The calibrated instruments, taken from SL-FB-6.4.7 PROGRAMI I KALIBRIMIT TË
 * PAJISJEVE LABORATORIKE (Versioni 7, viti 2026), updated 13.05.2026 by the
 * Quality Manager and approved by the Head of Laboratory.
 *
 * Generated from the workbook cells rather than retyped, so the register and
 * the controlled document cannot quietly disagree about a date or a
 * certificate number.
 *
 * Two documents, one register. ROWS below are the 29 instruments under formal
 * calibration, from SL-FB-6.4.7. INVENTORY is the rest of SL-FB-6.4.1 LISTA E
 * PAJISJEVE LABORATORIKE (Versioni 6, 22.10.2024): sieves, moulds, glassware
 * and the accessories carried under a parent instrument, which hold identity
 * and location but have no calibration of their own.
 *
 * Where a code appears in both, the inventory's columns are merged onto the
 * calibrated record rather than producing a second entry for one instrument.
 */
/**
 * uniqueCode is optional here alone: the AEP pressure gauge on the form has no
 * code in that column. Inventing one would put a number in the register that
 * appears nowhere on the instrument or the certificate, so the gap is carried
 * through and shown as a gap.
 */
type SeedRow = Omit<Equipment, "id" | "status" | "createdAt" | "uniqueCode"> & { uniqueCode?: string };

const ROWS: SeedRow[] = [
  {
    uniqueCode: "PT2",
    name: "Presa në shtypje",
    field: "Pajisje matëse të forcës",
    measuringRange: "deri në 2000 kN",
    accuracyClass: "Class 1",
    manufacturer: "CONTROLS, Italy",
    model: "201E1.X0828",
    serialNumber: "7701003",
    calibrationType: "I jashtëm",
    lastCalibration: "03.09.2025",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Gusht 2026",
    nextCalibrationDate: "31.08.2026",
    calibrationBody: "RBC Media",
    certificateCode: "24/0646F"
  },
  {
    uniqueCode: "FM38/1",
    name: "Presa në shtypje",
    field: "Pajisje matëse të forcës",
    measuringRange: "deri në 2000 kN",
    accuracyClass: "Class 1",
    manufacturer: "CONTROLS, Italy",
    model: "50-C46G2",
    serialNumber: "2031447",
    calibrationType: "I jashtëm",
    lastCalibration: "03.09.2025",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Gusht 2026",
    nextCalibrationDate: "31.08.2026",
    calibrationBody: "RBC Media",
    certificateCode: "25/0798F"
  },
  {
    uniqueCode: "FM39",
    name: "Presa në shtypje elektromekanike universale",
    field: "Pajisje matëse të forcës",
    measuringRange: "deri në 50 kN",
    accuracyClass: "Class 1",
    manufacturer: "CONTROLS, Italy",
    model: "70-T0108/E/TCE",
    serialNumber: "03116015/112572",
    calibrationType: "I jashtëm",
    lastCalibration: "03.09.2025",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Gusht 2026",
    nextCalibrationDate: "31.08.2026",
    calibrationBody: "RBC Media",
    certificateCode: "25/0799F"
  },
  {
    uniqueCode: "FM165",
    name: "Presa në shtypje-tërheqje",
    field: "Pajisje matëse të forcës",
    measuringRange: "deri në 500/600 kN",
    accuracyClass: "Class 2 (intervali 100 kN)/Class 1 (intervali 100 kN)/Class 0.5 (intervali 200.5÷500 kN)",
    manufacturer: "UTEST, Turkey",
    model: "UTM-4000",
    serialNumber: "06/013",
    calibrationType: "I jashtëm",
    lastCalibration: "03.09.2025",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Gusht 2026",
    nextCalibrationDate: "31.08.2026",
    calibrationBody: "RBC Media",
    certificateCode: "25/0802F"
  },
  {
    uniqueCode: "LB3",
    name: "Presa në përkulje",
    field: "Pajisje matëse të forcës",
    measuringRange: "deri në 100 kN",
    accuracyClass: "Class 1",
    manufacturer: "CONTROLS, Italy",
    model: "53-C0900",
    serialNumber: "2031654",
    calibrationType: "I jashtëm",
    lastCalibration: "03.09.2025",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Gusht 2026",
    nextCalibrationDate: "31.08.2026",
    calibrationBody: "RBC Media",
    certificateCode: "25/0801F"
  },
  {
    uniqueCode: "FM178",
    name: "Presa Marshall",
    field: "Pajisje matëse të forcës",
    measuringRange: "deri në 50kN",
    accuracyClass: "Class 1",
    manufacturer: "CONTROLS, Italy",
    serialNumber: "2105942",
    calibrationType: "I jashtëm",
    lastCalibration: "03.09.2025",
    calibrationInterval: "2 herë në vit",
    nextCalibrationPeriod: "Gusht 2026",
    nextCalibrationDate: "31.08.2026",
    calibrationBody: "RBC Media",
    certificateCode: "25/0800F"
  },
  {
    uniqueCode: "GJ9",
    name: "Oedometer automatik",
    field: "Pajisje matëse të forcës",
    measuringRange: "15000/10000 N",
    manufacturer: "WYKEHAM -FARRANCE/AEP, Italy",
    model: "TS",
    serialNumber: "1400973/228408",
    calibrationType: "I jashtëm",
    lastCalibration: "03.09.2025",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Gusht 2026",
    nextCalibrationDate: "31.08.2026",
    calibrationBody: "RBC Media",
    certificateCode: "25/0804F"
  },
  {
    uniqueCode: "GJ6",
    name: "Shear apparatus",
    field: "Pajisje matëse të forcës",
    measuringRange: "5000 N",
    accuracyClass: "Class 1",
    manufacturer: "WYKEHAM -FARRANCE/AEP, Italy",
    model: "27-WF25420/TS05",
    serialNumber: "07006219/325357",
    calibrationType: "I jashtëm",
    lastCalibration: "03.09.2025",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Gusht 2026",
    nextCalibrationDate: "31.08.2026",
    calibrationBody: "RBC Media",
    certificateCode: "25/0803F"
  },
  {
    uniqueCode: "K12",
    name: "Peshore elektronike",
    field: "Pajisje matëse të peshës",
    measuringRange: "Max.=210 g, d=0.1 mg",
    accuracyClass: "Class I",
    manufacturer: "OHAUS",
    model: "PA214C",
    serialNumber: "8729512353",
    calibrationType: "I jashtëm",
    lastCalibration: "13.05.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Maj 2027",
    nextCalibrationDate: "12.05.2027",
    calibrationBody: "Drejtoria e Përgjithshme e Metrologjisë",
    certificateCode: "LM-0526P213",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/%C3%87ertifikata%20kalibrimi%20-%20LM-0526P213%20OHAUS%20210%20g.pdf"
  },
  {
    uniqueCode: "FM10",
    name: "Peshore elektronike",
    field: "Pajisje matëse të peshës",
    measuringRange: "Max.=4200 g, d=0.01 g",
    accuracyClass: "Class II",
    manufacturer: "KERN",
    model: "EG 4200-2NM",
    serialNumber: "74950293",
    calibrationType: "I jashtëm",
    lastCalibration: "13.05.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Maj 2027",
    nextCalibrationDate: "12.05.2027",
    calibrationBody: "Drejtoria e Përgjithshme e Metrologjisë",
    certificateCode: "LM-0526P214",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/%C3%87ertifikata%20kalibrimi%20-%20LM-0526P214%20KERN%204200%20g.pdf"
  },
  {
    uniqueCode: "FM185",
    name: "Peshore elektronike",
    field: "Pajisje matëse të peshës",
    measuringRange: "Max.=30 kg, d=0.1 g",
    accuracyClass: "Class II",
    manufacturer: "NECKLIFE",
    model: "JZC-TSC-30",
    calibrationType: "I jashtëm",
    lastCalibration: "13.05.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Maj 2027",
    nextCalibrationDate: "12.05.2027",
    calibrationBody: "Drejtoria e Përgjithshme e Metrologjisë",
    certificateCode: "LM-0526P215",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/%C3%87ertifikata%20kalibrimi%20-%20LM-0526P215%20NECLIFE%2030%20kg.pdf"
  },
  {
    uniqueCode: "FM24",
    name: "Peshore elektronike",
    field: "Pajisje matëse të peshës",
    measuringRange: "Max.=40 kg, d=2 g",
    accuracyClass: "Class III",
    manufacturer: "CONSTANT",
    model: "14192-44",
    serialNumber: "14192",
    calibrationType: "I jashtëm",
    lastCalibration: "13.05.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Maj 2027",
    nextCalibrationDate: "12.05.2027",
    calibrationBody: "Drejtoria e Përgjithshme e Metrologjisë",
    certificateCode: "LM-0526P217",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/%C3%87ertifikata%20kalibrimi%20-%20LM-0526P217%20CONSTANT%2040kg.pdf"
  },
  {
    uniqueCode: "FM166/2",
    name: "Peshore elektronike",
    field: "Pajisje matëse të peshës",
    measuringRange: "Max.=8100 g, d=0.1 g",
    accuracyClass: "Class II",
    manufacturer: "METTLER TOLEDO",
    model: "SB 8001",
    serialNumber: "1121510620",
    calibrationType: "I jashtëm",
    lastCalibration: "13.05.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Maj 2027",
    nextCalibrationDate: "12.05.2027",
    calibrationBody: "Drejtoria e Përgjithshme e Metrologjisë",
    certificateCode: "LM-0526P216",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/%C3%87ertifikata%20kalibrimi%20-%20LM-0526P216%20METTLER%20TOLEDO%208100%20g.pdf"
  },
  {
    uniqueCode: "GJ-3/6/3",
    name: "Dial gauge",
    field: "Pajisje matëse të gjatësisë",
    measuringRange: "Intervali i matjes 0÷30 mm; rezolucioni 0.01 mm",
    serialNumber: "636",
    calibrationType: "I jashtëm",
    lastCalibration: "13.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "12.02.2027",
    calibrationBody: "Autoinstrument Doo",
    certificateCode: "LM26LAB-0101",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/LM26LAB-0101%20dial%20gauge.pdf"
  },
  {
    uniqueCode: "GJ-3/6/4",
    name: "Dial gauge",
    field: "Pajisje matëse të gjatësisë",
    measuringRange: "Intervali i matjes 0÷30 mm; rezolucioni 0.01 mm",
    manufacturer: "IDF",
    serialNumber: "227712",
    calibrationType: "I jashtëm",
    lastCalibration: "13.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "12.02.2027",
    calibrationBody: "Autoinstrument Doo",
    certificateCode: "LM26LAB-0098",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/LM26LAB0098%20dial%20gauge.pdf"
  },
  {
    uniqueCode: "GJ-3/6/1",
    name: "Dial gauge",
    field: "Pajisje matëse të gjatësisë",
    measuringRange: "Intervali i matjes 0÷30 mm; rezolucioni 0.01 mm",
    manufacturer: "IDF",
    serialNumber: "218591",
    calibrationType: "I jashtëm",
    lastCalibration: "13.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "12.02.2027",
    calibrationBody: "Autoinstrument Doo",
    certificateCode: "LM26LAB-0097",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/LM26LAB-0097%20dial%20gauge.pdf"
  },
  {
    uniqueCode: "GJ-3/6",
    name: "Dial gauge",
    field: "Pajisje matëse të gjatësisë",
    measuringRange: "Intervali i matjes 0÷30 mm; rezolucioni 0.01 mm",
    manufacturer: "IDF",
    serialNumber: "32176",
    calibrationType: "I jashtëm",
    lastCalibration: "13.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "12.02.2027",
    calibrationBody: "Autoinstrument Doo",
    certificateCode: "LM26LAB-0099",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/LM26LAB-0099%20dial%20gauge.pdf"
  },
  {
    uniqueCode: "FM14",
    name: "Kaliber Vernier",
    field: "Pajisje matëse të gjatësisë",
    measuringRange: "Intervali i matjes 0÷300 mm; rezolucioni 0.02 mm",
    manufacturer: "UIK",
    serialNumber: "5-96",
    calibrationType: "I jashtëm",
    lastCalibration: "13.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "12.02.2027",
    calibrationBody: "Autoinstrument Doo",
    certificateCode: "LM25LAB-0045"
  },
  {
    uniqueCode: "FM15",
    name: "Kaliber Vernier",
    field: "Pajisje matëse të gjatësisë",
    measuringRange: "Intervali i matjes 0÷200 mm; rezolucioni 0.05 mm",
    manufacturer: "CONTROLS, Italy",
    model: "47-D0542/A",
    serialNumber: "14004020",
    calibrationType: "I jashtëm",
    lastCalibration: "13.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "12.02.2027",
    calibrationBody: "Autoinstrument Doo",
    certificateCode: "LM26LAB-0095",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/LM26LAB-0095%20vernier%20caliper%20FM14.pdf"
  },
  {
    uniqueCode: "LB24",
    name: "Vizore metalike",
    field: "Pajisje matëse të gjatësisë",
    measuringRange: "Intervali i matjes 0÷500 mm; rezolucioni 1 mm",
    serialNumber: "A1309",
    calibrationType: "I jashtëm",
    lastCalibration: "13.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "12.02.2027",
    calibrationBody: "Autoinstrument Doo",
    certificateCode: "LM26LAB-0100",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/LM26LAB-0100%20steel%20ruler.pdf"
  },
  {
    uniqueCode: "K6",
    name: "Termoçift dixhital me sondë",
    field: "Pajisje matëse të temperaturës",
    measuringRange: "Intervali i matjes -50÷200 oC; rezolucioni 0.1 oC",
    accuracyClass: "Type K",
    manufacturer: "HANNA INSTRUMENTS",
    model: "HI 935005N",
    serialNumber: "A2295/08495958",
    calibrationType: "I jashtëm",
    lastCalibration: "13.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "12.02.2027",
    calibrationBody: "Autoinstrument Doo",
    certificateCode: "TP26LAB-0027",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/TP26LAB-0027%20k-type.pdf"
  },
  {
    uniqueCode: "K22",
    name: "Termometer prej qelqi (me zhytje të pjesshme)",
    field: "Pajisje matëse të temperaturës",
    measuringRange: "Intervali i matjes 57÷65 oC; rezolucioni 0.1 oC",
    manufacturer: "ASTM",
    model: "Type 20C",
    serialNumber: "AA2607",
    calibrationType: "I jashtëm",
    lastCalibration: "13.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "12.02.2027",
    calibrationBody: "Autoinstrument Doo",
    certificateCode: "TP26LAB-0026",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/TP26LAB-0026%20thermometer.pdf"
  },
  {
    uniqueCode: "K17",
    name: "Kohëmatës dixhital",
    field: "Pajisje matëse të kohës",
    measuringRange: "Intervali i matjes 00:00:00÷00:30:00 h:min:s; rezolucioni 0.01 s; Intervali i matjes 00:30:00÷12:00:00 h:min:s; rezolucioni 1 s",
    model: "ZSD-009",
    serialNumber: "A2605",
    calibrationType: "I jashtëm",
    lastCalibration: "13.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "12.02.2027",
    calibrationBody: "Autoinstrument Doo",
    certificateCode: "SW26LAB-0027",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/SW26LAB-0027%20stopwatch.pdf"
  },
  {
    uniqueCode: "GJ-DC-1",
    name: "Manometer presioni",
    field: "Pajisje matëse të presionit",
    measuringRange: "Intervali i matjes 0÷50 kN (344.80 bar), rezolucioni 0.25 kN (1.72 bar)",
    manufacturer: "CONTROLS, Italy",
    model: "Hydraulic",
    serialNumber: "5A00010",
    calibrationType: "I jashtëm",
    lastCalibration: "29.08.2024",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Gusht 2025",
    nextCalibrationDate: "29.08.2025",
    calibrationBody: "Drejtoria e Përgjithshme e Metrologjisë",
    certificateCode: "LP-0824M013",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/LP-0824M013%20Manometer%20presioni%20controls.pdf"
  },
  {
    name: "Manometer presioni",
    field: "Pajisje matëse të presionit",
    measuringRange: "Intervali i matjes 0÷700 bar, rezolucioni 0.01 bar",
    manufacturer: "AEP Transducers",
    model: "Hydraulic dixhital",
    serialNumber: "935293",
    calibrationType: "I jashtëm",
    lastCalibration: "24.09.2025",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shtator 2026",
    nextCalibrationDate: "23.09.2026",
    calibrationBody: "Drejtoria e Përgjithshme e Metrologjisë",
    certificateCode: "LP-0925M031",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/LP-0925M031%20Manometer%20presioni%20AEP%20Transducers.pdf"
  },
  {
    uniqueCode: "FM32/3",
    name: "Manometer presioni",
    field: "Pajisje matëse të presionit",
    measuringRange: "Intervali i matjes 0÷10 bar, rezolucioni 0.5 bar",
    accuracyClass: "Class 1.6",
    manufacturer: "R",
    model: "Manual",
    serialNumber: "008",
    calibrationType: "I jashtëm",
    lastCalibration: "24.09.2025",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shtator 2026",
    nextCalibrationDate: "23.09.2026",
    calibrationBody: "Drejtoria e Përgjithshme e Metrologjisë",
    certificateCode: "LP-0925M030",
    certificateUrl: "https://sarpandlab.sharepoint.com/sites/LaboratoriMaterialeve2026/Shared%20Documents/2.Dokumenta%20laboratori/SARP%20LAB%20TESTIM/Dokumenta%20akreditimi/2026/6.%20K%C3%8BRKESA%20T%C3%8B%20BURIMEVE/6.4%20Pajisjet/Kalibrime%20pajisjesh/%C3%87ertifikata%20kalibrimi/LP-0925M030%20Manometer%20presioni%20(Penetrimi%20i%20betonit).pdf"
  },
  {
    uniqueCode: "FM181",
    name: "Termometër",
    field: "Pajisje matëse të temperaturës",
    measuringRange: "Temperatura -50 oC - 300 oC",
    manufacturer: "JY - 300",
    serialNumber: "TP101",
    calibrationType: "I brendshëm",
    lastCalibration: "05.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "03.02.2027",
    calibrationBody: "Sarp&Lab Shpk",
    certificateCode: "SL-ÇK-01"
  },
  {
    uniqueCode: "SR01",
    name: "Vizore metalike",
    field: "Pajisje matëse të gjatësisë",
    measuringRange: "Matje dimensionesh nga 0 deri në 300 mm",
    calibrationType: "I brendshëm",
    lastCalibration: "03.02.2026",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Shkurt 2027",
    nextCalibrationDate: "03.02.2027",
    calibrationBody: "Sarp&Lab Shpk",
    certificateCode: "SL-ÇK-01"
  },
  {
    uniqueCode: "LB 23",
    name: "Kaliber",
    field: "Pajisje matëse të gjatësisë",
    measuringRange: "Matje dimensionesh nga 0 deri në 150 mm",
    manufacturer: "VERNIER",
    serialNumber: "1-7659",
    calibrationType: "I brendshëm",
    lastCalibration: "15.10.2025",
    calibrationInterval: "1 herë në vit",
    nextCalibrationPeriod: "Tetor 2026",
    nextCalibrationDate: "14.10.2026",
    calibrationBody: "Sarp&Lab Shpk",
    certificateCode: "SL-ÇK-01"
  }
];

/**
 * The inventory, SL-FB-6.4.1.
 *
 * Codes are reused in it — FM1 names both the freeze-thaw cabinet and the
 * muffle furnace — and 176 rows carry no code at all, so identity here comes
 * from the row's position in the sheet. Every row is kept: they are separate
 * physical items, and dropping one because it shares a code would quietly
 * shrink the lab's asset list.
 */
type InventoryRow = Omit<Equipment, "id" | "status" | "createdAt" | "uniqueCode"> & {
  uniqueCode?: string;
  seedIndex: number;
};

const INVENTORY: InventoryRow[] = [
  {
    inventoryNo: 1,
    uniqueCode: "FM117",
    name: "Sita me hapje 45 mic",
    description: "material S/Steel (diameter 291 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6185271",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 1
  },
  {
    inventoryNo: 2,
    uniqueCode: "EL12",
    name: "Sita me hapje 63 mic",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310-1; BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5927108",
    location: "01/A",
    quantity: 1,
    seedIndex: 2
  },
  {
    inventoryNo: 3,
    uniqueCode: "EL13",
    name: "Sita me hapje 63 mic",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310-1; BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5927112",
    location: "01/A",
    quantity: 1,
    seedIndex: 3
  },
  {
    inventoryNo: 4,
    uniqueCode: "EL14",
    name: "Sita me hapje 63 mic",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310-1; BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5927107",
    location: "01/A",
    quantity: 1,
    seedIndex: 4
  },
  {
    inventoryNo: 5,
    uniqueCode: "EL15",
    name: "Sita me hapje 63 mic",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310-1; BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "593474",
    location: "01/A",
    quantity: 1,
    seedIndex: 5
  },
  {
    inventoryNo: 6,
    uniqueCode: "EL16",
    name: "Sita me hapje 63 mic",
    description: "material S/Steel (diameter 455 mm)",
    manufacturer: "ELE INTERNATIONAL",
    model: "ISO 3310-1",
    serialNumber: "5814627",
    location: "01/A",
    quantity: 1,
    seedIndex: 6
  },
  {
    inventoryNo: 7,
    uniqueCode: "FM119",
    name: "Sita me hapje 75 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6240911",
    location: "01/A",
    storage: "Rafti A2",
    notes: "punon",
    quantity: 1,
    seedIndex: 7
  },
  {
    inventoryNo: 8,
    uniqueCode: "FM119/1",
    name: "Sita me hapje 75 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6007608",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "punon",
    quantity: 1,
    seedIndex: 8
  },
  {
    inventoryNo: 9,
    uniqueCode: "FM156",
    name: "Sita me hapje 75 mic",
    description: "material S/Steel (diameter 194 mm)",
    manufacturer: "CONTROLS",
    model: "ASTM E-11",
    serialNumber: "5718830",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 9
  },
  {
    inventoryNo: 10,
    uniqueCode: "FM120",
    name: "Sita me hapje 90 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6279914",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 10
  },
  {
    inventoryNo: 11,
    uniqueCode: "FM121",
    name: "Sita me hapje 106 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6288637",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 11
  },
  {
    inventoryNo: 12,
    uniqueCode: "YKM1",
    name: "Sita me hapje 106 mic",
    description: "material S/Steel (diameter 187 mm)",
    manufacturer: "YUKSEL KAYA MAKINA",
    model: "ISO 3310-2",
    serialNumber: "12",
    location: "01/A",
    storage: "Rafti A3",
    notes: "MESH 140",
    quantity: 1,
    seedIndex: 12
  },
  {
    inventoryNo: 13,
    uniqueCode: "FM122",
    name: "Sita me hapje 125 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "14080914",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 13
  },
  {
    inventoryNo: 14,
    uniqueCode: "FM157",
    name: "Sita me hapje 125 mic",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5744351",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 14
  },
  {
    inventoryNo: 15,
    uniqueCode: "FM162/2",
    name: "Sita me hapje 125 mic",
    description: "material S/Steel (diameter 292 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 15
  },
  {
    inventoryNo: 16,
    uniqueCode: "FS4",
    name: "Sita me hapje 125 mic",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "INFRATEST",
    model: "ISO 565 - DIN ISO 3310-1",
    serialNumber: "D-74336",
    location: "01/A",
    quantity: 1,
    seedIndex: 16
  },
  {
    inventoryNo: 17,
    uniqueCode: "FM123/2",
    name: "Sita me hapje 150 mic",
    description: "material S/Steel (diameter 289 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "15031040",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 17
  },
  {
    inventoryNo: 18,
    uniqueCode: "FM123/1",
    name: "Sita me hapje 150 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6250433",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 18
  },
  {
    inventoryNo: 19,
    uniqueCode: "FM158",
    name: "Sita me hapje 150 mic",
    description: "material S/Steel (diameter 193 mm)",
    manufacturer: "CONTROLS",
    model: "ASTM E-11",
    serialNumber: "5718948",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 19
  },
  {
    inventoryNo: 20,
    uniqueCode: "FM124/1",
    name: "Sita me hapje 212 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "15041168",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 20
  },
  {
    inventoryNo: 21,
    uniqueCode: "FM124/2",
    name: "Sita me hapje 212 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6250414",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 21
  },
  {
    inventoryNo: 22,
    uniqueCode: "FM124/3",
    name: "Sita me hapje 212 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "5998564",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 22
  },
  {
    inventoryNo: 23,
    uniqueCode: "FM134",
    name: "Sita me hapje 210 mic",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "GGT Torino",
    location: "01/A",
    storage: "Rafti A3",
    notes: "MESH 70",
    quantity: 1,
    seedIndex: 23
  },
  {
    inventoryNo: 24,
    uniqueCode: "YKM2",
    name: "Sita me hapje 250 mic",
    description: "material S/Steel (diameter 186 mm)",
    manufacturer: "YUKSEL KAYA MAKINA",
    model: "ISO 3310-2",
    serialNumber: "2934",
    location: "01/A",
    storage: "Rafti A3",
    notes: "MESH 60",
    quantity: 1,
    seedIndex: 24
  },
  {
    inventoryNo: 25,
    uniqueCode: "FM162/3",
    name: "Sita me hapje 250 mic",
    description: "material S/Steel (diameter 291 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 25
  },
  {
    inventoryNo: 26,
    uniqueCode: "FM125",
    name: "Sita me hapje 250 mic",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310-1",
    serialNumber: "6188990",
    location: "01/A",
    quantity: 1,
    seedIndex: 26
  },
  {
    inventoryNo: 27,
    uniqueCode: "FM126/1",
    name: "Sita me hapje 300 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "15031046",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 27
  },
  {
    inventoryNo: 28,
    uniqueCode: "FM126/1/1",
    name: "Sita me hapje 300 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "15031045",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 28
  },
  {
    inventoryNo: 29,
    uniqueCode: "FM136/2",
    name: "Sita me hapje 300 mic",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "GGT Torino",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 29
  },
  {
    inventoryNo: 30,
    uniqueCode: "FM153",
    name: "Sita me hapje 300 mic",
    description: "material S/Steel (diameter 192 mm)",
    manufacturer: "CONTROLS",
    model: "UNI",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 30
  },
  {
    inventoryNo: 31,
    uniqueCode: "FM126/5",
    name: "Sita me hapje 300 mic",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ASTM E-11",
    serialNumber: "30097",
    location: "01/A",
    notes: "( nr. 935 )",
    quantity: 1,
    seedIndex: 31
  },
  {
    inventoryNo: 32,
    uniqueCode: "FM126/3",
    name: "Sita me hapje 300 mic",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "ELE INTERNATIONAL",
    location: "01/A",
    quantity: 1,
    seedIndex: 32
  },
  {
    inventoryNo: 33,
    uniqueCode: "FM127",
    name: "Sita me hapje 425 mic",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "BS.ISO 3310",
    serialNumber: "15031701",
    location: "01/A",
    quantity: 1,
    seedIndex: 33
  },
  {
    inventoryNo: 34,
    uniqueCode: "EL17",
    name: "Sita me hapje 425 mic",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310-1; BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5846298",
    location: "01/A",
    quantity: 1,
    seedIndex: 34
  },
  {
    inventoryNo: 35,
    uniqueCode: "FM162/4",
    name: "Sita me hapje 500 mic",
    description: "material S/Steel (diameter 288 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 35
  },
  {
    inventoryNo: 36,
    uniqueCode: "FM154",
    name: "Sita me hapje 500 mic",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "INFRATEST",
    model: "ISO 565 - DIN ISO 3310-1",
    serialNumber: "D-74336",
    location: "01/A",
    quantity: 1,
    seedIndex: 36
  },
  {
    inventoryNo: 37,
    uniqueCode: "FM128/2",
    name: "Sita me hapje 600 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "15031049",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 37
  },
  {
    inventoryNo: 38,
    uniqueCode: "FM128/1",
    name: "Sita me hapje 600 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6279929",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 38
  },
  {
    inventoryNo: 39,
    uniqueCode: "FM159",
    name: "Sita me hapje 710 mic",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5785354",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 39
  },
  {
    inventoryNo: 40,
    uniqueCode: "FM137/1",
    name: "Sita me hapje 840 mic",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "GGT Torino",
    location: "01/A",
    storage: "Rafti A3",
    notes: "MESH 20",
    quantity: 1,
    seedIndex: 40
  },
  {
    inventoryNo: 41,
    uniqueCode: "FM130",
    name: "Sita me hapje 850 mic",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6208226",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 41
  },
  {
    inventoryNo: 42,
    uniqueCode: "YKM3",
    name: "Sita me hapje 850 mic",
    description: "material S/Steel (diameter 188 mm)",
    manufacturer: "YUKSEL KAYA MAKINA",
    model: "ISO 3310-2",
    serialNumber: "2535",
    location: "01/A",
    storage: "Rafti A3",
    notes: "MESH 10",
    quantity: 1,
    seedIndex: 42
  },
  {
    inventoryNo: 43,
    uniqueCode: "FM138",
    name: "Sita me hapje 1.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "GGT Torino",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 43
  },
  {
    inventoryNo: 44,
    uniqueCode: "FM138/2",
    name: "Sita me hapje 1.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5910757",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 44
  },
  {
    inventoryNo: 45,
    uniqueCode: "FM162/5",
    name: "Sita me hapje 1.00 mm",
    description: "material S/Steel (diameter 292 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 45
  },
  {
    inventoryNo: 46,
    uniqueCode: "FS5",
    name: "Sita me hapje 1.00 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "ELE INTERNATIONAL",
    model: "ISO 3310-1",
    serialNumber: "5814710",
    location: "01/A",
    notes: "( nr.1130 )",
    quantity: 1,
    seedIndex: 46
  },
  {
    inventoryNo: 47,
    uniqueCode: "FM89/1",
    name: "Sita me hapje 1.18 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "15041175",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 47
  },
  {
    inventoryNo: 48,
    uniqueCode: "FM89/2",
    name: "Sita me hapje 1.18 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6182053",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 48
  },
  {
    inventoryNo: 49,
    uniqueCode: "FM89/3",
    name: "Sita me hapje 1.18 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ASTM",
    location: "01/A",
    quantity: 1,
    seedIndex: 49
  },
  {
    inventoryNo: 50,
    uniqueCode: "FM90",
    name: "Sita me hapje 1.60 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "690005",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 50
  },
  {
    inventoryNo: 51,
    uniqueCode: "FM91",
    name: "Sita me hapje 1.70 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "671259",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 51
  },
  {
    inventoryNo: 52,
    uniqueCode: "FM92/1",
    name: "Sita me hapje 2.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "15031008",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 52
  },
  {
    inventoryNo: 53,
    uniqueCode: "FM136/1",
    name: "Sita me hapje 2.00 mm",
    description: "material S/Steel (diameter 189 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5742175",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 53
  },
  {
    inventoryNo: 54,
    uniqueCode: "FM162/6",
    name: "Sita me hapje 2.00 mm",
    description: "material S/Steel (diameter 288 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 54
  },
  {
    inventoryNo: 55,
    uniqueCode: "FM92",
    name: "Sita me hapje 2.00 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "BS/ISO 3310",
    serialNumber: "14080951",
    location: "01/A",
    quantity: 1,
    seedIndex: 55
  },
  {
    inventoryNo: 56,
    uniqueCode: "FM93/2",
    name: "Sita me hapje 2.36 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ASTM E-11",
    serialNumber: "30101",
    location: "01/A",
    quantity: 1,
    seedIndex: 56
  },
  {
    inventoryNo: 57,
    uniqueCode: "FM93/1",
    name: "Sita me hapje 2.36 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6245916",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 57
  },
  {
    inventoryNo: 58,
    uniqueCode: "FM135",
    name: "Sita me hapje 2.50 mm",
    description: "material S/Steel (diameter 192 mm)",
    manufacturer: "CONTROLS",
    model: "NF",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 58
  },
  {
    inventoryNo: 59,
    uniqueCode: "FM94/1",
    name: "Sita me hapje 3.35 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "14120820",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 59
  },
  {
    inventoryNo: 60,
    uniqueCode: "FM94/2",
    name: "Sita me hapje 3.35 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "14120819",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 60
  },
  {
    inventoryNo: 61,
    uniqueCode: "FM139/1",
    name: "Sita me hapje 4.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5742619",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 61
  },
  {
    inventoryNo: 62,
    uniqueCode: "FM139/2",
    name: "Sita me hapje 4.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5909320",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 62
  },
  {
    inventoryNo: 63,
    uniqueCode: "FM139",
    name: "Sita me hapje 4.00 mm",
    description: "material S/Steel (diameter 192 mm)",
    manufacturer: "CONTROLS",
    model: "NF",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 63
  },
  {
    inventoryNo: 64,
    uniqueCode: "FM162/7",
    name: "Sita me hapje 4.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 64
  },
  {
    inventoryNo: 65,
    uniqueCode: "FS6",
    name: "Sita me hapje 4.00 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "ELE INTERNATIONAL",
    model: "ISO 3310-2",
    serialNumber: "5791979",
    location: "01/A",
    quantity: 1,
    seedIndex: 65
  },
  {
    inventoryNo: 66,
    uniqueCode: "FM95/2",
    name: "Sita me hapje 4.75 mm",
    description: "material S/Steel (diameter 291 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "15042086",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 66
  },
  {
    inventoryNo: 67,
    uniqueCode: "FM95/3",
    name: "Sita me hapje 4.75 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ASTM",
    location: "01/A",
    quantity: 1,
    seedIndex: 67
  },
  {
    inventoryNo: 68,
    uniqueCode: "FM96/2",
    name: "Sita me hapje 5.00 mm",
    description: "material S/Steel (diameter 291 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "14081174",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 68
  },
  {
    inventoryNo: 69,
    uniqueCode: "FM96/1",
    name: "Sita me hapje 5.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6247780",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 69
  },
  {
    inventoryNo: 70,
    uniqueCode: "FM140",
    name: "Sita me hapje 5.00 mm",
    description: "material S/Steel (diameter 192 mm)",
    manufacturer: "CONTROLS",
    model: "NF",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 70
  },
  {
    inventoryNo: 71,
    uniqueCode: "FM97/1",
    name: "Sita me hapje 6.30 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "14081665",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 71
  },
  {
    inventoryNo: 72,
    uniqueCode: "FM141/1",
    name: "Sita me hapje 6.30 mm",
    description: "material S/Steel (diameter 192 mm)",
    manufacturer: "ELE INTERNATIONAL",
    model: "ISO 3310-2",
    serialNumber: "5788240",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 72
  },
  {
    inventoryNo: 73,
    uniqueCode: "FM141/2",
    name: "Sita me hapje 6.30 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5744199",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 73
  },
  {
    inventoryNo: 74,
    uniqueCode: "FM97/2",
    name: "Sita me hapje 6.30 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ASTM",
    location: "01/A",
    quantity: 1,
    seedIndex: 74
  },
  {
    inventoryNo: 75,
    uniqueCode: "FM141/3",
    name: "Sita me hapje 7.1 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "GGT Torino",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 75
  },
  {
    inventoryNo: 76,
    uniqueCode: "FM142",
    name: "Sita me hapje 8.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5745930",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 76
  },
  {
    inventoryNo: 77,
    uniqueCode: "FM162/8",
    name: "Sita me hapje 8.00 mm",
    description: "material S/Steel (diameter 291 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 77
  },
  {
    inventoryNo: 78,
    uniqueCode: "FS7",
    name: "Sita me hapje 8.00 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310",
    serialNumber: "6297201",
    location: "01/A",
    quantity: 1,
    seedIndex: 78
  },
  {
    inventoryNo: 79,
    uniqueCode: "FM98/1",
    name: "Sita me hapje 9.50 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6250421",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 79
  },
  {
    inventoryNo: 80,
    uniqueCode: "FM98/2",
    name: "Sita me hapje 9.50 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ASTM",
    location: "01/A",
    quantity: 1,
    seedIndex: 80
  },
  {
    inventoryNo: 81,
    uniqueCode: "FM99/1",
    name: "Sita me hapje 10.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "14081286",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 81
  },
  {
    inventoryNo: 82,
    uniqueCode: "FM162/9",
    name: "Sita me hapje 10.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 82
  },
  {
    inventoryNo: 83,
    uniqueCode: "FM99/2",
    name: "Sita me hapje 10.00 mm",
    description: "material M/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "BS/ISO 3310",
    serialNumber: "14081285",
    location: "01/A",
    quantity: 1,
    seedIndex: 83
  },
  {
    inventoryNo: 84,
    uniqueCode: "FM100",
    name: "Sita me hapje 12.50 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6248180",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 84
  },
  {
    inventoryNo: 85,
    uniqueCode: "FM143/1",
    name: "Sita me hapje 12.50 mm",
    description: "material S/Steel (diameter 192 mm)",
    manufacturer: "ELE INTERNATIONAL",
    model: "ISO 3310-2",
    serialNumber: "5784702",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 85
  },
  {
    inventoryNo: 86,
    uniqueCode: "FM162/10",
    name: "Sita me hapje 12.50 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 86
  },
  {
    inventoryNo: 87,
    uniqueCode: "FS8",
    name: "Sita me hapje 12.50 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ASTM E-11",
    serialNumber: "30105",
    location: "01/A",
    notes: "( nr.1185 )",
    quantity: 1,
    seedIndex: 87
  },
  {
    inventoryNo: 88,
    uniqueCode: "FM101",
    name: "Sita me hapje 13.20 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6279919",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 88
  },
  {
    inventoryNo: 89,
    uniqueCode: "FM102/1",
    name: "Sita me hapje 14.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "14120812",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 89
  },
  {
    inventoryNo: 90,
    uniqueCode: "FM102/2",
    name: "Sita me hapje 14.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "15010916",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 90
  },
  {
    inventoryNo: 91,
    uniqueCode: "FM144",
    name: "Sita me hapje 15.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "GGT Torino",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 91
  },
  {
    inventoryNo: 92,
    uniqueCode: "FM145/1",
    name: "Sita me hapje 16.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5746039",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 92
  },
  {
    inventoryNo: 93,
    uniqueCode: "FM145/2",
    name: "Sita me hapje 16.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5909546",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 93
  },
  {
    inventoryNo: 94,
    uniqueCode: "FM145",
    name: "Sita me hapje 16.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5777560",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 94
  },
  {
    inventoryNo: 95,
    uniqueCode: "FM162/11",
    name: "Sita me hapje 16.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 95
  },
  {
    inventoryNo: 96,
    uniqueCode: "FS9",
    name: "Sita me hapje 16.00 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "INFRATEST",
    model: "ISO 565 - DIN ISO 3310-2",
    serialNumber: "D-74336",
    location: "01/A",
    quantity: 1,
    seedIndex: 96
  },
  {
    inventoryNo: 97,
    uniqueCode: "FM103",
    name: "Sita me hapje 16.00 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310-1",
    serialNumber: "6279200",
    location: "01/A",
    quantity: 1,
    seedIndex: 97
  },
  {
    inventoryNo: 98,
    uniqueCode: "FM104/1",
    name: "Sita me hapje 19.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6248184",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 98
  },
  {
    inventoryNo: 99,
    uniqueCode: "FM104/2",
    name: "Sita me hapje 19.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6248218",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 99
  },
  {
    inventoryNo: 100,
    uniqueCode: "FM104/3",
    name: "Sita me hapje 19.00 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ASTM E-11",
    serialNumber: "30106",
    location: "01/A",
    quantity: 1,
    seedIndex: 100
  },
  {
    inventoryNo: 101,
    uniqueCode: "FM105/2",
    name: "Sita me hapje 20.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "14120803",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 101
  },
  {
    inventoryNo: 102,
    uniqueCode: "FM146",
    name: "Sita me hapje 20.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "ELE INTERNATIONAL",
    model: "ISO 3310-2",
    serialNumber: "5782977",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 102
  },
  {
    inventoryNo: 103,
    uniqueCode: "FS10",
    name: "Sita me hapje 20.00 mm",
    description: "material M/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "BS/ISO 3310",
    serialNumber: "15030794",
    location: "01/A",
    notes: "( nr.1520 )",
    quantity: 1,
    seedIndex: 103
  },
  {
    inventoryNo: 104,
    uniqueCode: "FM162/12",
    name: "Sita me hapje 22.40 mm",
    description: "material S/Steel (diameter 288 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 104
  },
  {
    inventoryNo: 105,
    uniqueCode: "FM106",
    name: "Sita me hapje 22.40 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "INFRATEST",
    location: "01/A",
    quantity: 1,
    seedIndex: 105
  },
  {
    inventoryNo: 106,
    uniqueCode: "FM107/1",
    name: "Sita me hapje 25.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "14080640",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 106
  },
  {
    inventoryNo: 107,
    uniqueCode: "FM147",
    name: "Sita me hapje 25.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5723516",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 107
  },
  {
    inventoryNo: 108,
    uniqueCode: "FM162/13",
    name: "Sita me hapje 25.00 mm",
    description: "material S/Steel (diameter 288 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 108
  },
  {
    inventoryNo: 109,
    uniqueCode: "FM107/2",
    name: "Sita me hapje 25.00 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310-1",
    serialNumber: "6253823",
    location: "01/A",
    notes: "( nr.1100 )",
    quantity: 1,
    seedIndex: 109
  },
  {
    inventoryNo: 110,
    uniqueCode: "FM148",
    name: "Sita me hapje 30.00 mm",
    description: "material S/Steel (diameter 200 mm)",
    manufacturer: "GGT Torino",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 110
  },
  {
    inventoryNo: 111,
    uniqueCode: "FM149",
    name: "Sita me hapje 31.50 mm",
    description: "material S/Steel (diameter 192 mm)",
    manufacturer: "ELE INTERNATIONAL",
    model: "ISO 3310-2",
    serialNumber: "5788237",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 111
  },
  {
    inventoryNo: 112,
    uniqueCode: "FM162/14",
    name: "Sita me hapje 31.50 mm",
    description: "material S/Steel (diameter 289 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 112
  },
  {
    inventoryNo: 113,
    uniqueCode: "FM108",
    name: "Sita me hapje 31.50 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310-1",
    serialNumber: "6148256",
    location: "01/A",
    quantity: 1,
    seedIndex: 113
  },
  {
    inventoryNo: 114,
    uniqueCode: "FM109/1",
    name: "Sita me hapje 37.50 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "14120795",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 114
  },
  {
    inventoryNo: 115,
    uniqueCode: "FM162/15",
    name: "Sita me hapje 37.50 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 115
  },
  {
    inventoryNo: 116,
    uniqueCode: "FM109/2",
    name: "Sita me hapje 37.50 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310-1",
    serialNumber: "671274",
    location: "01/A",
    notes: "( nr.1275 )",
    quantity: 1,
    seedIndex: 116
  },
  {
    inventoryNo: 117,
    uniqueCode: "FM110",
    name: "Sita me hapje 40.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6186683",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 117
  },
  {
    inventoryNo: 118,
    uniqueCode: "FM105/1",
    name: "Sita me hapje 40.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6182871",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 118
  },
  {
    inventoryNo: 119,
    uniqueCode: "FM150",
    name: "Sita me hapje 40.00 mm",
    description: "material S/Steel (diameter 189 mm)",
    manufacturer: "GGT Torino",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 119
  },
  {
    inventoryNo: 120,
    uniqueCode: "FM162/16",
    name: "Sita me hapje 45.00 mm",
    description: "material S/Steel (diameter 288 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 120
  },
  {
    inventoryNo: 121,
    uniqueCode: "FM111/1",
    name: "Sita me hapje 50.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "15040028",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 121
  },
  {
    inventoryNo: 122,
    uniqueCode: "FM111/2",
    name: "Sita me hapje 50.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6249912",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 122
  },
  {
    inventoryNo: 123,
    uniqueCode: "FM151",
    name: "Sita me hapje 50.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN4148, 4188",
    serialNumber: "5723502",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 123
  },
  {
    inventoryNo: 124,
    uniqueCode: "FM151",
    name: "Sita me hapje 50.00 mm",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "CONTROLS",
    model: "ISO",
    location: "01/A",
    quantity: 1,
    seedIndex: 124
  },
  {
    inventoryNo: 125,
    uniqueCode: "FM162/17",
    name: "Sita me hapje 53.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 125
  },
  {
    inventoryNo: 126,
    uniqueCode: "FM112/1",
    name: "Sita me hapje 63.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "14081351",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 126
  },
  {
    inventoryNo: 127,
    uniqueCode: "FM112/2",
    name: "Sita me hapje 63.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6184990",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 127
  },
  {
    inventoryNo: 128,
    uniqueCode: "FM162/18",
    name: "Sita me hapje 63.00 mm",
    description: "material S/Steel (diameter 289 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 128
  },
  {
    inventoryNo: 129,
    uniqueCode: "FM112/3",
    name: "Sita me hapje 63.00 mm",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    model: "ISO 3310-1",
    serialNumber: "671295",
    location: "01/A",
    notes: "( nr.1130 )",
    quantity: 1,
    seedIndex: 129
  },
  {
    inventoryNo: 130,
    uniqueCode: "FM113/2",
    name: "Sita me hapje 75.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "B.S / ISO3310",
    serialNumber: "15031686",
    location: "01/A",
    storage: "Rafti A1",
    quantity: 1,
    seedIndex: 130
  },
  {
    inventoryNo: 131,
    uniqueCode: "FM113/1",
    name: "Sita me hapje 75.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "66830",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 131
  },
  {
    inventoryNo: 132,
    uniqueCode: "FM113/3",
    name: "Sita me hapje 75.00 mm",
    description: "material S/Steel (diameter 290 mm)",
    manufacturer: "CONTROLS",
    model: "BS 410-NF X11 501, 504, UNI 8520, DIN 4187, 4188",
    serialNumber: "6187495",
    location: "01/A",
    storage: "Rafti A2",
    quantity: 1,
    seedIndex: 132
  },
  {
    inventoryNo: 133,
    uniqueCode: "FM162/19",
    name: "Sita me hapje 80.00 mm",
    description: "material S/Steel (diameter 288 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 133
  },
  {
    inventoryNo: 134,
    uniqueCode: "FM162/20",
    name: "Sita me hapje 100.00 mm",
    description: "material S/Steel (diameter 292 mm)",
    manufacturer: "VECTOR",
    model: "EN 993-2, ISO 3310, BS 410",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 134
  },
  {
    inventoryNo: 135,
    uniqueCode: "FM132",
    name: "Kapak",
    description: "material S/Steel (diameter 192 mm)",
    manufacturer: "CONTROLS",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 135
  },
  {
    inventoryNo: 136,
    uniqueCode: "FM132/1",
    name: "Kapak",
    description: "material S/Steel (diameter 192 mm)",
    manufacturer: "CONTROLS",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 136
  },
  {
    inventoryNo: 137,
    uniqueCode: "FM132/2",
    name: "Kapak",
    description: "material S/Steel (diameter 192 mm)",
    manufacturer: "CONTROLS",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 137
  },
  {
    inventoryNo: 138,
    uniqueCode: "FM161",
    name: "Kapak",
    description: "material S/Steel (diameter 292 mm)",
    manufacturer: "VECTOR",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 138
  },
  {
    inventoryNo: 139,
    uniqueCode: "FM88/1",
    name: "Kapak",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 139
  },
  {
    inventoryNo: 140,
    uniqueCode: "FM88/2",
    name: "Kapak",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 140
  },
  {
    inventoryNo: 141,
    uniqueCode: "FM88/3",
    name: "Kapak",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 141
  },
  {
    inventoryNo: 142,
    uniqueCode: "FM131",
    name: "Mbetja",
    description: "material S/Steel (diameter 190 mm)",
    manufacturer: "GGT Torino",
    location: "01/A",
    storage: "Rafti A3",
    quantity: 1,
    seedIndex: 142
  },
  {
    inventoryNo: 143,
    uniqueCode: "MBS02",
    name: "Mbetja",
    description: "material S/Steel (diameter 292 mm)",
    manufacturer: "VECTOR",
    model: "BS.ISO.EN",
    location: "01/A",
    storage: "siper Raftit A1",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 143
  },
  {
    inventoryNo: 144,
    uniqueCode: "FM87/1",
    name: "Mbetja",
    description: "material S/Steel (diameter 292 mm)",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 144
  },
  {
    inventoryNo: 145,
    uniqueCode: "FM87/2",
    name: "Mbetja",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 145
  },
  {
    inventoryNo: 146,
    uniqueCode: "FM87/3",
    name: "Mbetja",
    description: "material S/Steel (diameter 300 mm)",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 146
  },
  {
    uniqueCode: "FM32/4",
    name: "Adaptori për sitat",
    manufacturer: "CONTROLS",
    model: "15-D0406",
    location: "01/A",
    quantity: 1,
    seedIndex: 147
  },
  {
    uniqueCode: "FM32/5",
    name: "Adaptori për sitat",
    manufacturer: "CONTROLS",
    serialNumber: "52105",
    location: "01/A",
    quantity: 1,
    seedIndex: 148
  },
  {
    inventoryNo: 148,
    uniqueCode: "FM85/10",
    name: "Sitë katrore me hapje 2.50 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/01",
    serialNumber: "13603605",
    location: "01/A",
    quantity: 1,
    seedIndex: 149
  },
  {
    inventoryNo: 149,
    uniqueCode: "FM85/1",
    name: "Sitë katrore me hapje 3.15 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/02",
    serialNumber: "13603625",
    location: "01/A",
    quantity: 1,
    seedIndex: 150
  },
  {
    inventoryNo: 150,
    uniqueCode: "FM85/4",
    name: "Sitë katrore me hapje 4.00 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/03",
    serialNumber: "13603652",
    location: "01/A",
    quantity: 1,
    seedIndex: 151
  },
  {
    inventoryNo: 151,
    uniqueCode: "FM85/9",
    name: "Sitë katrore me hapje 5.00 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/04",
    serialNumber: "13603680",
    location: "01/A",
    quantity: 1,
    seedIndex: 152
  },
  {
    inventoryNo: 152,
    uniqueCode: "FM85/13",
    name: "Sitë katrore me hapje 6.30 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/05",
    serialNumber: "13603717",
    location: "01/A",
    quantity: 1,
    seedIndex: 153
  },
  {
    inventoryNo: 153,
    uniqueCode: "FM85/7",
    name: "Sitë katrore me hapje 8.00 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/06",
    serialNumber: "13603748",
    location: "01/A",
    quantity: 1,
    seedIndex: 154
  },
  {
    inventoryNo: 154,
    uniqueCode: "FM85/14",
    name: "Sitë katrore me hapje 10.00 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/07",
    serialNumber: "13603770",
    location: "01/A",
    quantity: 1,
    seedIndex: 155
  },
  {
    inventoryNo: 155,
    uniqueCode: "FM85/12",
    name: "Sitë katrore me hapje 12.50 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/08",
    serialNumber: "13603814",
    location: "01/A",
    quantity: 1,
    seedIndex: 156
  },
  {
    inventoryNo: 156,
    uniqueCode: "FM85/6",
    name: "Sitë katrore me hapje 16.00 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/09",
    serialNumber: "13603828",
    location: "01/A",
    quantity: 1,
    seedIndex: 157
  },
  {
    inventoryNo: 157,
    uniqueCode: "FM85/5",
    name: "Sitë katrore me hapje 20.00 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/10",
    serialNumber: "13603857",
    location: "01/A",
    quantity: 1,
    seedIndex: 158
  },
  {
    inventoryNo: 158,
    uniqueCode: "FM85/11",
    name: "Sitë katrore me hapje 25.00 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/11",
    serialNumber: "13603886",
    location: "01/A",
    quantity: 1,
    seedIndex: 159
  },
  {
    inventoryNo: 159,
    uniqueCode: "FM85/8",
    name: "Sitë katrore me hapje 31.50 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/12",
    serialNumber: "13603929",
    location: "01/A",
    quantity: 1,
    seedIndex: 160
  },
  {
    inventoryNo: 160,
    uniqueCode: "FM85/2",
    name: "Sitë katrore me hapje 40.00 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/13",
    serialNumber: "13603943",
    location: "01/A",
    quantity: 1,
    seedIndex: 161
  },
  {
    inventoryNo: 161,
    uniqueCode: "FM85/3",
    name: "Sitë katrore me hapje 50.00 mm",
    manufacturer: "CONTROLS",
    model: "47-D0418/14",
    serialNumber: "13603955",
    location: "01/A",
    quantity: 1,
    seedIndex: 162
  },
  {
    inventoryNo: 162,
    uniqueCode: "FM13",
    name: "Instrument matës i gjatësisë për agregatet",
    manufacturer: "CONTROLS",
    model: "47-D0541",
    serialNumber: "14002381",
    location: "01/A",
    quantity: 1,
    seedIndex: 163
  },
  {
    inventoryNo: 163,
    uniqueCode: "FM12",
    name: "Instrument matës i trashësisë për agregatet",
    manufacturer: "CONTROLS",
    model: "47-D0540",
    serialNumber: "14001333",
    location: "01/A",
    quantity: 1,
    seedIndex: 164
  },
  {
    inventoryNo: 165,
    uniqueCode: "FMA/1",
    name: "Pajisja e Los Angeles",
    manufacturer: "CONTROLS",
    model: "48-D0500/D",
    location: "01/A",
    quantity: 1,
    seedIndex: 165
  },
  {
    uniqueCode: "FMA/1/2",
    name: "Tava metalike",
    quantity: 1,
    seedIndex: 166
  },
  {
    uniqueCode: "FMA/1/3",
    name: "Sfera metalike",
    quantity: 12,
    seedIndex: 167
  },
  {
    uniqueCode: "FMA/1/4",
    name: "Çelës për hapjen e kapakut",
    quantity: 1,
    seedIndex: 168
  },
  {
    inventoryNo: 166,
    uniqueCode: "FM68",
    name: "Pajisja e ACV",
    description: "diameter 75 mm",
    manufacturer: "VECTOR",
    location: "01/A",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 169
  },
  {
    uniqueCode: "FM68/1",
    name: "Pllaka",
    seedIndex: 170
  },
  {
    uniqueCode: "FM68/2",
    name: "Cilindri",
    quantity: 1,
    seedIndex: 171
  },
  {
    uniqueCode: "FM68/3",
    name: "Pistoni",
    quantity: 1,
    seedIndex: 172
  },
  {
    inventoryNo: 167,
    uniqueCode: "FM69",
    name: "Pajisja e ACV",
    description: "diameter 150 mm",
    manufacturer: "VECTOR",
    location: "01/A",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 173
  },
  {
    uniqueCode: "FM69/1",
    name: "Pllaka",
    location: "01/A",
    quantity: 1,
    seedIndex: 174
  },
  {
    uniqueCode: "FM69/2",
    name: "Cilindri",
    location: "01/A",
    quantity: 1,
    seedIndex: 175
  },
  {
    uniqueCode: "FM69/3",
    name: "Pistoni",
    location: "01/A",
    quantity: 1,
    seedIndex: 176
  },
  {
    inventoryNo: 168,
    uniqueCode: "FM4",
    name: "Furrë tharëse laboratorike",
    description: "Interval temperature nga 0 deri në 300 oC",
    manufacturer: "ELE INTERNATIONAL",
    model: "LB-14",
    serialNumber: "30002803",
    location: "01/A",
    notes: "+ 3 zgara ndarëse",
    quantity: 1,
    seedIndex: 177
  },
  {
    inventoryNo: 169,
    uniqueCode: "FM172",
    name: "Furrë tharëse laboratorike",
    description: "Interval temperature nga 0 deri në 300 oC",
    manufacturer: "CONTROLS",
    model: "LB-15",
    location: "05/A",
    notes: "+ 2 zgara ndarëse",
    quantity: 1,
    seedIndex: 178
  },
  {
    inventoryNo: 170,
    uniqueCode: "LO1",
    name: "Furrë tharëse laboratorike",
    description: "Interval temperature nga 0 deri në 300 oC",
    manufacturer: "CONTROLS",
    model: "10-D1391/A",
    serialNumber: "2020826",
    location: "01/A",
    quantity: 1,
    seedIndex: 179
  },
  {
    inventoryNo: 171,
    uniqueCode: "LO2",
    name: "Furrë tharëse laboratorike",
    description: "Interval temperature nga 0 deri në 300 oC",
    manufacturer: "CONTROLS",
    model: "LB-17",
    location: "05/A",
    quantity: 1,
    seedIndex: 180
  },
  {
    inventoryNo: 172,
    uniqueCode: "FM1",
    name: "Furra Muffle",
    description: "Interval temperature nga 0 deri në 1200 oC",
    manufacturer: "CONTROLS",
    model: "K114",
    serialNumber: "221795",
    location: "02/B",
    quantity: 1,
    seedIndex: 181
  },
  {
    inventoryNo: 173,
    uniqueCode: "FM167",
    name: "Furnelë",
    location: "01/B",
    quantity: 1,
    seedIndex: 182
  },
  {
    inventoryNo: 174,
    uniqueCode: "FM16",
    name: "Përzjerës manjetik me ngrohje",
    description: "Volumi maksimal që mund të përziejë (H2O): deri në 15 liter; Temperatura: deri në 550 °C ; Shpejtësia e përzierjes: deri në 1500 rpm",
    manufacturer: "VELP",
    serialNumber: "551196",
    location: "01/B",
    notes: "Blerë në Prill 2021",
    quantity: 1,
    seedIndex: 183
  },
  {
    inventoryNo: 175,
    uniqueCode: "K16",
    name: "Përzierës manjetik",
    manufacturer: "IKA PRODUCTS",
    model: "LAB DISC",
    serialNumber: "1677288",
    location: "01/B",
    notes: "Blerë në Shtator 2019",
    quantity: 1,
    seedIndex: 184
  },
  {
    inventoryNo: 176,
    uniqueCode: "GJ-7/3",
    name: "Përzjerës",
    description: "230 V, 50 – 60 Hz",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 185
  },
  {
    inventoryNo: 177,
    uniqueCode: "FM2",
    name: "Banjo Mari",
    description: "Temperatura: deri në 60 °C",
    manufacturer: "CONTROLS",
    model: "76-B0066/S",
    serialNumber: "02116385",
    location: "02/B",
    notes: "2 Kapakë",
    quantity: 1,
    seedIndex: 186
  },
  {
    inventoryNo: 178,
    uniqueCode: "K2-2",
    name: "BanjoMari",
    description: "Temperatura: deri në 100 °C",
    manufacturer: "CONTROLS",
    location: "05/A",
    notes: "1 Kapak",
    quantity: 1,
    seedIndex: 187
  },
  {
    inventoryNo: 179,
    uniqueCode: "FM1",
    name: "Kabineti i cikleve ngirje - shkrirje",
    description: "Intervali i temperaturës -30 °C deri në +50 °C",
    manufacturer: "U-TEST",
    model: "SHNEIDER ELECTRIC",
    location: "01/A",
    quantity: 1,
    seedIndex: 188
  },
  {
    uniqueCode: "FM1/1 & FM1/2",
    name: "Sonda të brendshme",
    quantity: 2,
    seedIndex: 189
  },
  {
    uniqueCode: "FM1/3",
    name: "Enë metalike për mbajtjen e materialit",
    quantity: 1,
    seedIndex: 190
  },
  {
    inventoryNo: 180,
    uniqueCode: "FM2/1",
    name: "Volumometer cilindrik prej metali",
    description: "Kapaciteti 1,15 liter",
    location: "01/A",
    quantity: 1,
    seedIndex: 191
  },
  {
    uniqueCode: "FM2/1/2",
    name: "Unaza për peshën volumore",
    quantity: 1,
    seedIndex: 192
  },
  {
    inventoryNo: 181,
    uniqueCode: "FM2/2",
    name: "Volumometer cilindrik prej metali",
    description: "Kapaciteti 3 liter",
    location: "01/A",
    quantity: 1,
    seedIndex: 193
  },
  {
    inventoryNo: 182,
    uniqueCode: "FM2/3",
    name: "Volumometer cilindrik prej metali",
    description: "Kapaciteti 5 liter",
    location: "01/A",
    quantity: 1,
    seedIndex: 194
  },
  {
    uniqueCode: "FM2/1/1",
    name: "Unaza për peshën volumore",
    quantity: 1,
    seedIndex: 195
  },
  {
    inventoryNo: 183,
    uniqueCode: "FM2/4",
    name: "Volumometer cilindrik prej metali",
    description: "Kapaciteti 15 liter",
    location: "01/A",
    quantity: 1,
    seedIndex: 196
  },
  {
    inventoryNo: 184,
    uniqueCode: "FM3",
    name: "Koni Abraham’s",
    description: "Prej metali",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 197
  },
  {
    uniqueCode: "FM3/1",
    name: "Hinka",
    description: "Prej metali",
    model: "D-0440/P1",
    quantity: 1,
    seedIndex: 198
  },
  {
    uniqueCode: "FM3/2",
    name: "Çekiç",
    description: "Prej metali",
    model: "D-0440/P1",
    quantity: 1,
    seedIndex: 199
  },
  {
    uniqueCode: "GJ-23",
    name: "Xhami mbështetës",
    model: "22-T0040/1",
    quantity: 1,
    seedIndex: 200
  },
  {
    inventoryNo: 185,
    uniqueCode: "FM 6/1",
    name: "Piknometer",
    description: "Kapaciteti 1000 ml",
    manufacturer: "SIMAX",
    serialNumber: "55/44",
    location: "01/A",
    quantity: 1,
    seedIndex: 201
  },
  {
    inventoryNo: 186,
    uniqueCode: "FM 7",
    name: "Piknometer",
    description: "Kapaciteti 1000 ml",
    manufacturer: "VECTOR",
    model: "SHUBER",
    location: "01/A",
    quantity: 1,
    seedIndex: 202
  },
  {
    inventoryNo: 187,
    uniqueCode: "FM 8",
    name: "Piknometer",
    description: "Kapaciteti 500 ml",
    manufacturer: "VECTOR",
    model: "SHUBER",
    location: "01/A",
    quantity: 1,
    seedIndex: 203
  },
  {
    uniqueCode: "FM8/1",
    name: "Hinkë plastike",
    quantity: 1,
    seedIndex: 204
  },
  {
    inventoryNo: 188,
    uniqueCode: "K 2/1",
    name: "Piknometer",
    description: "Kapaciteti 100 ml",
    manufacturer: "POBEL",
    location: "01/A",
    quantity: 1,
    seedIndex: 205
  },
  {
    inventoryNo: 189,
    uniqueCode: "K2",
    name: "Piknometer",
    description: "Kapaciteti 50 ml",
    manufacturer: "POBEL",
    location: "01/A",
    quantity: 1,
    seedIndex: 206
  },
  {
    inventoryNo: 190,
    name: "Seti i ekuivalentit të rërës",
    manufacturer: "CONTROLS",
    model: "T56",
    serialNumber: "50990010",
    location: "01/A",
    quantity: 1,
    seedIndex: 207
  },
  {
    uniqueCode: "FM-9",
    name: "Tundësi elektrik",
    manufacturer: "CONTROLS",
    model: "47-10056/B",
    quantity: 1,
    seedIndex: 208
  },
  {
    uniqueCode: "FM9/3",
    name: "Sondë",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 209
  },
  {
    uniqueCode: "FM9/11",
    name: "Sondë",
    manufacturer: "VECTOR",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 210
  },
  {
    uniqueCode: "FM9/4",
    name: "Balon qelqi",
    manufacturer: "CONTROLS",
    model: "T0050/4A7",
    quantity: 1,
    seedIndex: 211
  },
  {
    uniqueCode: "FM9/12",
    name: "Shishe plastike",
    manufacturer: "VECTOR",
    notes: "+1 tub metalik (Blerë në Janar 2021)",
    quantity: 1,
    seedIndex: 212
  },
  {
    uniqueCode: "FM9/6",
    name: "Tretësira e ekuivalentit të rërës",
    manufacturer: "E përgatitur në lab",
    notes: "1 shishe 5 litra",
    quantity: 1,
    seedIndex: 213
  },
  {
    uniqueCode: "FM9/7",
    name: "Cilindra plastikë",
    manufacturer: "VECTOR",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 214
  },
  {
    uniqueCode: "FM9/8",
    name: "Cilindra plastikë",
    manufacturer: "VECTOR",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 215
  },
  {
    uniqueCode: "FM9/9",
    name: "Cilindra plastikë",
    manufacturer: "VECTOR",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 216
  },
  {
    uniqueCode: "FM9/10",
    name: "Cilindra plastikë",
    manufacturer: "VECTOR",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 217
  },
  {
    uniqueCode: "FM9/5",
    name: "Tapë gome",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 218
  },
  {
    inventoryNo: 191,
    uniqueCode: "K12",
    name: "Peshore elektronike analitike",
    description: "Instrument jo-automatik peshimi NAWI (Klasa I); Max.=210 g, d=0.1 mg",
    manufacturer: "PIONEER ORHAUS",
    model: "PA214C",
    serialNumber: "8729512353",
    location: "01/B",
    notes: "Peshorja që përdoret për analizat kimike",
    quantity: 1,
    seedIndex: 219
  },
  {
    inventoryNo: 192,
    uniqueCode: "FM174",
    name: "Peshore elektronike",
    description: "Instrument jo-automatik peshimi NAWI (Klasa II); Max.=2200 g, d=0.01 g",
    manufacturer: "KERN",
    model: "EG-2200-2NM",
    serialNumber: "74940233",
    location: "02/B",
    notes: "Peshorja që përdoret për çimenton / llaçet",
    quantity: 1,
    seedIndex: 220
  },
  {
    inventoryNo: 193,
    uniqueCode: "FM10",
    name: "Peshore elektronike",
    description: "Instrument jo-automatik peshimi NAWI (Klasa II); Max.=4200 g, d=0.01 g",
    manufacturer: "KERN",
    model: "EG 4200-2NM",
    serialNumber: "74950293",
    location: "05/A",
    notes: "Peshorja që përdoret për asfaltobetonet",
    quantity: 1,
    seedIndex: 221
  },
  {
    inventoryNo: 196,
    uniqueCode: "FM24",
    name: "Peshore elektronike",
    description: "Instrument jo-automatik peshimi NAWI (Klasa II); Max.=30 kg, d=1 g",
    manufacturer: "BILANCAI",
    model: "NWSH 30K",
    serialNumber: "Y15",
    location: "01/A",
    notes: "Peshorja që përdoret për kubikët e betonit",
    quantity: 1,
    seedIndex: 222
  },
  {
    inventoryNo: 197,
    uniqueCode: "FM184",
    name: "Peshore elektronike",
    description: "Instrument jo-automatik peshimi NAWI (Klasa II); Max.=30 kg, d=0.5 g",
    manufacturer: "BRANDER",
    model: "MOD H7-708",
    location: "01/A",
    quantity: 1,
    seedIndex: 223
  },
  {
    inventoryNo: 198,
    uniqueCode: "FM26",
    name: "Peshore elektronike",
    description: "Instrument jo-automatik peshimi NAWI (Klasa II); Max.=40 kg, d= 5 g",
    manufacturer: "DAHONGYING",
    location: "01/A",
    notes: "Ardhur nga projekti i Shëngjinit, datë 12.12.2022",
    quantity: 1,
    seedIndex: 224
  },
  {
    inventoryNo: 199,
    uniqueCode: "FM183",
    name: "Peshore elektronike",
    description: "Instrument jo-automatik peshimi NAWI (Klasa II); Max.=60 kg, d= 1 g",
    manufacturer: "VECTOR",
    model: "XKXK3113-SCC",
    serialNumber: "D-200404111",
    location: "Dhoma e betonit",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 225
  },
  {
    inventoryNo: 200,
    uniqueCode: "FM180",
    name: "Tavolina per peshim hidrostatik",
    manufacturer: "CONTROLS",
    model: "11-D0612/A",
    serialNumber: "2020858",
    location: "05/A",
    quantity: 1,
    seedIndex: 226
  },
  {
    uniqueCode: "FM180/1",
    name: "Kova plastike e cila mbushet me ujë",
    quantity: 1,
    seedIndex: 227
  },
  {
    uniqueCode: "FM180/2",
    name: "Çengeli për peshoren",
    quantity: 1,
    seedIndex: 228
  },
  {
    uniqueCode: "FM180/3",
    name: "Kontenier rrjetë prej metali",
    quantity: 1,
    seedIndex: 229
  },
  {
    uniqueCode: "FM180/4",
    name: "Aksesori ku vendosen kubikë apo gurët e mëdha",
    quantity: 1,
    seedIndex: 230
  },
  {
    name: "Sitë me doreza",
    quantity: 1,
    seedIndex: 231
  },
  {
    inventoryNo: 201,
    uniqueCode: "FM33",
    name: "Pajisja Polished Stone Value",
    manufacturer: "CONTROLS",
    model: "48-PV5262",
    serialNumber: "18004183",
    location: "01/A",
    notes: "Blerë në 2018",
    quantity: 1,
    seedIndex: 232
  },
  {
    uniqueCode: "FM33/1",
    name: "Pesha",
    quantity: 1,
    seedIndex: 233
  },
  {
    uniqueCode: "FM33/2",
    name: "Rrotë gome",
    quantity: 1,
    seedIndex: 234
  },
  {
    uniqueCode: "FM33/3",
    name: "Pluhur",
    description: "paketuar në qese",
    model: "48-PV0525/13",
    quantity: 2,
    seedIndex: 235
  },
  {
    uniqueCode: "FM33/5",
    name: "Granil PSV",
    description: "paketuar në thasë",
    model: "48-PV0525/17",
    quantity: 2,
    seedIndex: 236
  },
  {
    uniqueCode: "FM33/7",
    name: "Granil PSV",
    description: "paketuar në qese",
    model: "48-PV0525/18",
    quantity: 2,
    seedIndex: 237
  },
  {
    uniqueCode: "FM33/9",
    name: "Granil PSV",
    description: "paketuar në qese",
    model: "48-PV0525/12",
    quantity: 2,
    seedIndex: 238
  },
  {
    uniqueCode: "FM33/11",
    name: "Bidon + zorrë",
    model: "44659",
    quantity: 1,
    seedIndex: 239
  },
  {
    uniqueCode: "FM33/12",
    name: "Kuarc",
    description: "paketuar në qese",
    quantity: 1,
    seedIndex: 240
  },
  {
    inventoryNo: 202,
    uniqueCode: "FM31",
    name: "Pajisja për përcaktimin e rezistencës në rrëshqitje (Skid Resistance)",
    manufacturer: "CONTROLS",
    model: "40-14019014",
    serialNumber: "7009826",
    location: "01/A",
    notes: "Blerë në 2018",
    quantity: 1,
    seedIndex: 241
  },
  {
    uniqueCode: "FM31/1",
    name: "Pllaka metalike për forma kampioni",
    notes: "+ 9 mini aksesore",
    quantity: 2,
    seedIndex: 242
  },
  {
    inventoryNo: 203,
    uniqueCode: "LB-10",
    name: "Riciklues tretësire asfalti",
    manufacturer: "CONTROLS",
    model: "75-B0027/A",
    serialNumber: "13007043",
    location: "01/A",
    quantity: 1,
    seedIndex: 243
  },
  {
    uniqueCode: "LB-10/1",
    name: "Kapaku",
    quantity: 1,
    seedIndex: 244
  },
  {
    uniqueCode: "LB-10/2",
    name: "Hinka",
    quantity: 1,
    seedIndex: 245
  },
  {
    uniqueCode: "LB-10/3",
    name: "Sita e brendshme",
    quantity: 1,
    seedIndex: 246
  },
  {
    inventoryNo: 204,
    uniqueCode: "FM168",
    name: "Pajisja për ekstraksionin e bitumit",
    manufacturer: "CONTROLS",
    location: "05/A",
    quantity: 1,
    seedIndex: 247
  },
  {
    uniqueCode: "FM168/1",
    name: "Cilinder qelqi",
    quantity: 1,
    seedIndex: 248
  },
  {
    uniqueCode: "FM168/4",
    name: "Kosha ekstraksioni",
    quantity: 1,
    seedIndex: 249
  },
  {
    uniqueCode: "FM168/3",
    name: "Letra filtri",
    quantity: 25,
    seedIndex: 250
  },
  {
    uniqueCode: "FM168/4",
    name: "Kapaku i ekstraksionit",
    quantity: 1,
    seedIndex: 251
  },
  {
    inventoryNo: 205,
    uniqueCode: "FM169",
    name: "Pajisja për ekstraksionin e bitumit",
    manufacturer: "VECTOR",
    location: "05/A",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 252
  },
  {
    uniqueCode: "FM169/1",
    name: "Fusela për ekstraksion",
    quantity: 1,
    seedIndex: 253
  },
  {
    inventoryNo: 206,
    uniqueCode: "FM179",
    name: "Përzierësi me ngrohje elektrike i asfalteve",
    manufacturer: "CONTROLS",
    model: "16-B0072/C",
    serialNumber: "2605473",
    location: "05/A",
    quantity: 1,
    seedIndex: 254
  },
  {
    uniqueCode: "FM179/1",
    name: "Ena e përzierësit",
    quantity: 1,
    seedIndex: 255
  },
  {
    uniqueCode: "FM179/2",
    name: "Spatula përzjerëse metalike",
    quantity: 1,
    seedIndex: 256
  },
  {
    inventoryNo: 207,
    uniqueCode: "FM171",
    name: "Kompaktor automatik Marshall",
    manufacturer: "CONTROLS",
    model: "76-B4112",
    serialNumber: "7004756",
    location: "05/A",
    quantity: 1,
    seedIndex: 257
  },
  {
    inventoryNo: 208,
    uniqueCode: "FM173",
    name: "Krik për karrotat e asfaltit",
    manufacturer: "CONTROLS",
    location: "05/A",
    quantity: 1,
    seedIndex: 258
  },
  {
    uniqueCode: "FM173/2",
    name: "Leva e krikut",
    quantity: 1,
    seedIndex: 259
  },
  {
    uniqueCode: "FM173/3",
    name: "Spesorë metalike",
    quantity: 2,
    seedIndex: 260
  },
  {
    inventoryNo: 209,
    name: "Krik për karrotat e asfaltit",
    manufacturer: "CONTROLS",
    location: "05/A",
    quantity: 1,
    seedIndex: 261
  },
  {
    name: "Leva e krikut",
    quantity: 1,
    seedIndex: 262
  },
  {
    name: "Spesorë metalike",
    quantity: 2,
    seedIndex: 263
  },
  {
    inventoryNo: 210,
    name: "Krik për karrotat e asfaltit",
    manufacturer: "CONTROLS",
    location: "05/A",
    seedIndex: 264
  },
  {
    name: "Leva e krikut",
    seedIndex: 265
  },
  {
    name: "Spesorë metalike",
    seedIndex: 266
  },
  {
    inventoryNo: 211,
    uniqueCode: "FM175",
    name: "Centrifugë fileri",
    manufacturer: "CONTROLS",
    model: "75-B0024/N",
    location: "05/A",
    quantity: 1,
    seedIndex: 267
  },
  {
    uniqueCode: "FM175/1",
    name: "Kapaku i centrifugës",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 268
  },
  {
    uniqueCode: "FM175/2",
    name: "Busoloti",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 269
  },
  {
    uniqueCode: "FM175/4",
    name: "Ena e solventit",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 270
  },
  {
    uniqueCode: "FM178/3",
    name: "Aparatura Digimax",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 271
  },
  {
    uniqueCode: "FM178/1",
    name: "Nofullat",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 272
  },
  {
    inventoryNo: 213,
    uniqueCode: "FM176",
    name: "Penetrometer automatik bitumi",
    manufacturer: "NORMALAB",
    model: "81B0103/A",
    serialNumber: "7601250",
    location: "05/A",
    quantity: 1,
    seedIndex: 273
  },
  {
    uniqueCode: "FM176/1",
    name: "Sonda",
    quantity: 2,
    seedIndex: 274
  },
  {
    inventoryNo: 214,
    uniqueCode: "FM182",
    name: "Aparati manual për pikën e zbutjes dhe penetrimin e bitumit",
    manufacturer: "CONTROLS",
    serialNumber: "50020030",
    location: "05/A",
    quantity: 1,
    seedIndex: 275
  },
  {
    uniqueCode: "FM182/1",
    name: "Gurë metalik për shtimin e peshës",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 276
  },
  {
    uniqueCode: "FM182/4",
    name: "Enë metalike për mbajtjen e bitumit",
    manufacturer: "CONTROLS",
    notes: "50 ml secila",
    quantity: 2,
    seedIndex: 277
  },
  {
    inventoryNo: 215,
    uniqueCode: "FM186",
    name: "Pikë zbutje-penetrim",
    manufacturer: "VECTOR-DELTA",
    model: "YN300",
    serialNumber: "00158",
    location: "05/A",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 278
  },
  {
    name: "Gotë kimike qelqi 600 ml",
    quantity: 1,
    seedIndex: 279
  },
  {
    inventoryNo: 216,
    uniqueCode: "FM40",
    name: "Pajisja Straight Edge",
    manufacturer: "CONTROLS",
    model: "80-B0185/1",
    location: "01/A",
    quantity: 1,
    seedIndex: 280
  },
  {
    inventoryNo: 217,
    uniqueCode: "GJ-1",
    name: "Aparati Casagrande",
    manufacturer: "VECTOR",
    location: "01/A",
    quantity: 1,
    seedIndex: 281
  },
  {
    uniqueCode: "GJ-1/1/3",
    name: "Ngjeshës prej druri",
    manufacturer: "WYKEHAM FARRANCE",
    model: "27-NF0215/8",
    location: "01/A",
    quantity: 1,
    seedIndex: 282
  },
  {
    uniqueCode: "GJ-1/1/4",
    name: "Kapëse metalike",
    location: "01/A",
    quantity: 4,
    seedIndex: 283
  },
  {
    uniqueCode: "GJ1/1/7",
    name: "Busolotë",
    description: "6x7.7 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 284
  },
  {
    uniqueCode: "GJ1/1/8",
    name: "Shufër metalike",
    description: "20 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 285
  },
  {
    uniqueCode: "GJ1/1/9",
    name: "Thike niveluese me maje me harke",
    location: "01/A",
    quantity: 1,
    seedIndex: 286
  },
  {
    uniqueCode: "GJ-1/2",
    name: "Spatula e përkulshme 100 mm",
    model: "L001-R2",
    location: "01/A",
    quantity: 1,
    seedIndex: 287
  },
  {
    uniqueCode: "GJ-1/3",
    name: "Spatula e përkulshme prej hekuri",
    manufacturer: "VECTOR",
    location: "01/A",
    seedIndex: 288
  },
  {
    uniqueCode: "GJ-1/4",
    name: "Kapsula",
    location: "01/A",
    seedIndex: 289
  },
  {
    uniqueCode: "GJ-1/5",
    name: "Enë porcelani",
    description: "me diameter 150 mm",
    location: "01/A",
    seedIndex: 290
  },
  {
    uniqueCode: "EL31/1-EL31/8",
    name: "Kontenierë metalike për testin e Atterberg",
    description: "diameter 50 mm",
    location: "01/A",
    quantity: 8,
    seedIndex: 291
  },
  {
    uniqueCode: "EL31/9-EL31/12",
    name: "Kontenierë metalike për testin e Atterberg (sete)",
    description: "diameter 60 mm",
    location: "01/A",
    quantity: 4,
    seedIndex: 292
  },
  {
    uniqueCode: "EL31/13-EL31/23",
    name: "Kontenierë metalike për testin e Atterberg (pa kapake)",
    description: "diameter 90 mm",
    location: "01/A",
    quantity: 11,
    seedIndex: 293
  },
  {
    inventoryNo: 218,
    uniqueCode: "GJ2/5",
    name: "Aparati Casagrande",
    model: "S171",
    serialNumber: "S17124403",
    location: "01/A",
    quantity: 1,
    seedIndex: 294
  },
  {
    uniqueCode: "GJ2/5",
    name: "Pjesë mekanizmi për aparatin Casagrande",
    model: "70-C0953/C",
    location: "01/A",
    quantity: 1,
    seedIndex: 295
  },
  {
    uniqueCode: "EL31",
    name: "Aparat Casagrande",
    manufacturer: "FROWAG",
    model: "2445",
    serialNumber: "1120",
    location: "01/A",
    quantity: 1,
    seedIndex: 296
  },
  {
    inventoryNo: 219,
    uniqueCode: "GJ-7",
    name: "Pajisja e hidrometrisë",
    model: "22-T0060/A",
    serialNumber: "7004585",
    location: "01/A",
    quantity: 1,
    seedIndex: 297
  },
  {
    uniqueCode: "GJ-7/1",
    name: "Hidrometer 151H",
    model: "22-T60/A",
    quantity: 1,
    seedIndex: 298
  },
  {
    uniqueCode: "GJ-7/4",
    name: "Hidrometer 55 mN/m",
    quantity: 1,
    seedIndex: 299
  },
  {
    uniqueCode: "EL1",
    name: "Hidrometer 152H",
    model: "ASTM E100/152 H-62",
    serialNumber: "477230",
    quantity: 1,
    seedIndex: 300
  },
  {
    uniqueCode: "GJ-7/2",
    name: "Kontenier hidrometrie qelqi",
    description: "110 V, 60 Hz",
    model: "22-T0060/1",
    quantity: 1,
    seedIndex: 301
  },
  {
    uniqueCode: "GJ-7/5",
    name: "Rezistencë elektrike në formë cilindrike",
    description: "[Na6P6O18]",
    quantity: 1,
    seedIndex: 302
  },
  {
    uniqueCode: "GJ-7/6",
    name: "Tretësirë Hekzametafosfat natriumi",
    description: "kapaciteti 1000 ml",
    quantity: 1,
    seedIndex: 303
  },
  {
    uniqueCode: "GJ-7/7",
    name: "Balon qelqi",
    manufacturer: "SIMAX",
    quantity: 1,
    seedIndex: 304
  },
  {
    uniqueCode: "GJ-7/10",
    name: "Cilinder qelqi",
    description: "kapaciteti - 5 + 60 g/L ndarje 1g/L",
    quantity: 4,
    seedIndex: 305
  },
  {
    inventoryNo: 220,
    uniqueCode: "GJ-8",
    name: "Pajisja për përshkrueshmërinë e dherave",
    manufacturer: "CONTROLS",
    model: "38-T0185/2",
    serialNumber: "7005113",
    location: "01/A",
    quantity: 1,
    seedIndex: 306
  },
  {
    uniqueCode: "GJ-8/1",
    name: "Gypa",
    quantity: 1,
    seedIndex: 307
  },
  {
    uniqueCode: "GJ-8/2",
    name: "Meter",
    quantity: 1,
    seedIndex: 308
  },
  {
    uniqueCode: "GJ-8/3",
    name: "Depozitë e vogël uji",
    model: "38-T0185/3",
    quantity: 1,
    seedIndex: 309
  },
  {
    uniqueCode: "GJ-8/4",
    name: "Fustela e dheut + bazamenti shtrëngues",
    model: "38-T0185/1",
    serialNumber: "7006841",
    quantity: 1,
    seedIndex: 310
  },
  {
    uniqueCode: "GJ-8/5",
    name: "Bazamenti për mbështetjen e cilindrit",
    model: "28-WF4220",
    quantity: 1,
    seedIndex: 311
  },
  {
    uniqueCode: "GJ-6/1",
    name: "Unaza dinamometrike",
    description: "5000 N",
    model: "27-WF1003/ST",
    location: "02/B",
    seedIndex: 312
  },
  {
    uniqueCode: "GJ-6/2",
    name: "Matës i deformimeve vertikale",
    description: "10 x 0.002 mm",
    model: "30-WF6401",
    location: "02/B",
    quantity: 1,
    seedIndex: 313
  },
  {
    uniqueCode: "GJ-6/3",
    name: "Matës i deformimeve horizontale",
    description: "30 x 0.01 mm",
    model: "30-WF6402",
    location: "02/B",
    quantity: 1,
    seedIndex: 314
  },
  {
    uniqueCode: "GJ-6/4",
    name: "Kutia e prerjes",
    description: "60 x 60 mm",
    model: "27-WF25511",
    location: "02/B",
    quantity: 2,
    seedIndex: 315
  },
  {
    uniqueCode: "GJ-6/5",
    name: "Pllaka e ngarkesës",
    model: "27-WF25517",
    location: "02/B",
    quantity: 2,
    seedIndex: 316
  },
  {
    uniqueCode: "GJ-6/6",
    name: "Pllaka e bazës",
    model: "27-WF25518",
    location: "02/B",
    quantity: 2,
    seedIndex: 317
  },
  {
    uniqueCode: "GJ-6/7",
    name: "Gurët poroze",
    model: "27-WF25519",
    location: "02/B",
    quantity: 3,
    seedIndex: 318
  },
  {
    uniqueCode: "GJ-6/8",
    name: "Pllakat plastike",
    manufacturer: "WYKEHAM FARRANCE",
    model: "27- WF25520",
    location: "02/B",
    notes: "4 me vrima, 4 me vija",
    quantity: 8,
    seedIndex: 319
  },
  {
    uniqueCode: "GJ-6/9",
    name: "Pllakat poroze",
    model: "27- WF25521",
    location: "02/B",
    seedIndex: 320
  },
  {
    uniqueCode: "GJ-6/10",
    name: "Fustela me borde prerëse",
    model: "27- WF25522",
    location: "02/B",
    notes: "me diameter të ndryshëm",
    quantity: 2,
    seedIndex: 321
  },
  {
    uniqueCode: "GJ-6/11",
    name: "Tamponi ekstraktor",
    description: "prej druri",
    model: "27- WF25523",
    location: "02/B",
    quantity: 1,
    seedIndex: 322
  },
  {
    uniqueCode: "GJ-6/12",
    name: "Peshat",
    description: "8 kg",
    location: "02/B",
    quantity: 4,
    seedIndex: 323
  },
  {
    uniqueCode: "GJ-6/13",
    name: "Peshat",
    description: "4 kg",
    location: "02/B",
    quantity: 6,
    seedIndex: 324
  },
  {
    uniqueCode: "GJ-6/14",
    name: "Peshat",
    description: "2 kg",
    location: "02/B",
    quantity: 3,
    seedIndex: 325
  },
  {
    uniqueCode: "GJ-6/15",
    name: "Peshat",
    description: "1 kg",
    location: "02/B",
    quantity: 4,
    seedIndex: 326
  },
  {
    uniqueCode: "GJ-6/16",
    name: "Peshat",
    description: "0.5 kg",
    location: "02/B",
    quantity: 4,
    seedIndex: 327
  },
  {
    uniqueCode: "GJ-6/17",
    name: "Peshat",
    description: "0.25 kg",
    location: "02/B",
    quantity: 4,
    seedIndex: 328
  },
  {
    name: "Qeliza e trupit",
    model: "26-WF0320",
    location: "02/B",
    quantity: 1,
    seedIndex: 329
  },
  {
    name: "Aksesorë për kutinë prerëse / mbajtëse",
    location: "02/B",
    quantity: 1,
    seedIndex: 330
  },
  {
    name: "Vida",
    location: "02/B",
    quantity: 2,
    seedIndex: 331
  },
  {
    uniqueCode: "GJ-9/1",
    name: "Software",
    model: "26-WF3120/SF",
    quantity: 1,
    seedIndex: 332
  },
  {
    uniqueCode: "GJ-9/2",
    name: "Çela me unazë",
    description: "50.47 mm",
    model: "26-WF0320",
    quantity: 1,
    seedIndex: 333
  },
  {
    uniqueCode: "GJ-9/3",
    name: "Çela me unazë",
    description: "71.40 mm",
    model: "26-WF0325",
    quantity: 1,
    seedIndex: 334
  },
  {
    uniqueCode: "GJ-9/4",
    name: "Disku i kalibrimit",
    model: "26-WF0320/9",
    seedIndex: 335
  },
  {
    uniqueCode: "GJ-9/5",
    name: "Gurët poroze",
    quantity: 1,
    seedIndex: 336
  },
  {
    uniqueCode: "GJ-9/6",
    name: "Bureta",
    model: "26-WF0338/B",
    seedIndex: 337
  },
  {
    uniqueCode: "GJ-9/7",
    name: "Geodatalog",
    model: "30-WF6016",
    quantity: 1,
    seedIndex: 338
  },
  {
    inventoryNo: 223,
    uniqueCode: "GJ-4",
    name: "Aparati për provat e pjastres dinamike",
    manufacturer: "TERRATEST 5000 BLUE",
    model: "2489",
    location: "01/A",
    quantity: 1,
    seedIndex: 339
  },
  {
    uniqueCode: "GJ-4/1",
    name: "Kompjuter + Printer",
    quantity: 1,
    seedIndex: 340
  },
  {
    uniqueCode: "GJ-4/2",
    name: "Ngarkesë",
    description: "Pesha 10 kg",
    quantity: 1,
    seedIndex: 341
  },
  {
    uniqueCode: "GJ-4/3",
    name: "Ngarkesë",
    description: "Pesha 15 kg",
    quantity: 1,
    seedIndex: 342
  },
  {
    uniqueCode: "GJ-4/4",
    name: "Pllake metalike",
    description: "Diametri i pllakës Ø 300 mm",
    quantity: 1,
    seedIndex: 343
  },
  {
    inventoryNo: 224,
    uniqueCode: "GJ-4-1",
    name: "Aparati për provat e pjastres dinamike",
    manufacturer: "MAGDEBURGER PRUFGERATEBAU GmbH",
    model: "HPM LFG",
    location: "01/A",
    quantity: 1,
    seedIndex: 344
  },
  {
    uniqueCode: "GJ-4-1/1",
    name: "Kompjuter + Printer",
    quantity: 1,
    seedIndex: 345
  },
  {
    uniqueCode: "GJ-4-1/2",
    name: "Ngarkesë",
    description: "Pesha 10 kg",
    quantity: 1,
    seedIndex: 346
  },
  {
    uniqueCode: "GJ-4-1/3",
    name: "Ngarkesë",
    description: "Pesha 15 kg",
    quantity: 1,
    seedIndex: 347
  },
  {
    inventoryNo: 225,
    name: "Aparati për provat e pjastres statike",
    manufacturer: "CONTROL",
    location: "01/A",
    quantity: 1,
    seedIndex: 348
  },
  {
    uniqueCode: "GJ-3",
    name: "Pllakë metalike",
    description: "Diameter 300 mm",
    manufacturer: "CONTROL",
    location: "01/A",
    quantity: 1,
    seedIndex: 349
  },
  {
    uniqueCode: "GJ-3/1",
    name: "Pompë / Kriku",
    description: "deri në 100 kN",
    manufacturer: "CONTROL",
    model: "35-T1173/D",
    serialNumber: "16000742",
    location: "01/A",
    quantity: 1,
    seedIndex: 350
  },
  {
    uniqueCode: "GJ-3/2",
    name: "Pistoni",
    manufacturer: "CONTROL",
    model: "RSC-258",
    serialNumber: "P04041609-16",
    location: "01/A",
    quantity: 1,
    seedIndex: 351
  },
  {
    uniqueCode: "GJ-3/3",
    name: "Matës (manometer) dixhital presioni",
    description: "0- 50 kN",
    manufacturer: "AEP Transducers",
    serialNumber: "919984",
    location: "01/A",
    quantity: 1,
    seedIndex: 352
  },
  {
    uniqueCode: "GJ-3/4",
    name: "Matës (manometer) dixhital presioni",
    description: "0- 50 kN / 0 - 700 Bar",
    manufacturer: "AEP Transducers",
    model: "DFP.R5",
    serialNumber: "935293",
    location: "01/A",
    notes: "Blerë me datë 14.02.2022 dhe ardhur në laborator me datë 29.03.2022",
    quantity: 1,
    seedIndex: 353
  },
  {
    uniqueCode: "GJ-3/4/2",
    name: "Matës (manometer) presioni",
    description: "0- 50 kN / 0 - 700 Bar",
    manufacturer: "CONTROLS",
    serialNumber: "5A00010",
    location: "01/A",
    quantity: 1,
    seedIndex: 354
  },
  {
    uniqueCode: "GJ-DC-2",
    name: "Komparatorë zhvendosjeje",
    description: "0 - 25 mm, d= 0,01 mm (FM-3)",
    manufacturer: "ELLE INTERNATIONAL",
    model: "EL 24-9275",
    serialNumber: "C2760",
    location: "01/A",
    quantity: 1,
    seedIndex: 355
  },
  {
    uniqueCode: "EL4",
    name: "Komparatorë zhvendosjeje për pajisjen e Pjastres statike",
    description: "intervali i matjes 0 ÷ 30 mm / 0.01 mm",
    manufacturer: "MESSZEUGE Germany",
    model: "4039321005940",
    serialNumber: "641",
    location: "01/A",
    quantity: 1,
    seedIndex: 356
  },
  {
    uniqueCode: "EL5",
    name: "Komparatorë zhvendosjeje për pajisjen e Pjastres statike",
    description: "intervali i matjes 0 ÷ 30 mm / 0.01 mm",
    manufacturer: "MESSZEUGE Germany",
    model: "1024005",
    serialNumber: "117945",
    location: "01/A",
    quantity: 1,
    seedIndex: 357
  },
  {
    uniqueCode: "EL6",
    name: "Komparatorë zhvendosjeje për pajisjen e Pjastres statike",
    description: "intervali i matjes 0 ÷ 30 mm / 0.01 mm",
    manufacturer: "MESSZEUGE Germany",
    model: "636-2",
    serialNumber: "640",
    location: "01/A",
    quantity: 1,
    seedIndex: 358
  },
  {
    uniqueCode: "EL7",
    name: "Komparatorë zhvendosjeje për pajisjen e Pjastres statike",
    description: "intervali i matjes 0 ÷ 25 mm / 0.2 mm",
    manufacturer: "ELLE INTERNATIONAL",
    model: "HT-352M / EDP 52250C-SL1",
    serialNumber: "50758796",
    location: "01/A",
    quantity: 1,
    seedIndex: 359
  },
  {
    uniqueCode: "GJ-3/4/1",
    name: "Shina",
    manufacturer: "CONTROLS",
    model: "35-T1173/D",
    serialNumber: "16000742",
    location: "01/A",
    quantity: 4,
    seedIndex: 360
  },
  {
    uniqueCode: "GJ-3/5",
    name: "Kamalec / Këmbë",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 2,
    seedIndex: 361
  },
  {
    uniqueCode: "GJ-3/6/2",
    name: "Tuba metalik për mbështetje",
    location: "01/A",
    quantity: 2,
    seedIndex: 362
  },
  {
    name: "Adaptor",
    location: "01/A",
    quantity: 2,
    seedIndex: 363
  },
  {
    name: "Mbajtëse manometri",
    location: "01/A",
    quantity: 3,
    seedIndex: 364
  },
  {
    name: "Vida për shinat",
    location: "01/A",
    quantity: 7,
    seedIndex: 365
  },
  {
    name: "Pllaka metalike për krikun / bazament",
    location: "01/A",
    quantity: 1,
    seedIndex: 366
  },
  {
    inventoryNo: 226,
    uniqueCode: "GJ-5",
    name: "Pajisja e Dynamic Cone Penetration",
    manufacturer: "CONTROLS",
    model: "16-T0012/A",
    serialNumber: "16099",
    location: "01/A",
    quantity: 1,
    seedIndex: 367
  },
  {
    uniqueCode: "GJ-5/1",
    name: "Vizore metalike",
    description: "0-1000 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 368
  },
  {
    uniqueCode: "GJ-5/2",
    name: "Maja konike",
    model: "16-T0012/1",
    serialNumber: "69818",
    location: "01/A",
    quantity: 1,
    seedIndex: 369
  },
  {
    uniqueCode: "GJ-5/2/1",
    name: "Adaptori i majës konike",
    location: "01/A",
    quantity: 1,
    seedIndex: 370
  },
  {
    uniqueCode: "GJ-5/3",
    name: "Shtanga zgjatuese / bashkuese",
    description: "81 cm",
    model: "16-T0012/3",
    serialNumber: "69621",
    location: "01/A",
    quantity: 1,
    seedIndex: 371
  },
  {
    uniqueCode: "GJ-5/4",
    name: "Shtanga shtuese",
    description: "42.5 cm",
    model: "16-T0012/4",
    location: "01/A",
    quantity: 1,
    seedIndex: 372
  },
  {
    uniqueCode: "GJ-5/5",
    name: "Shtanga bashkuese",
    model: "16-T0012/2",
    serialNumber: "16099",
    location: "01/A",
    seedIndex: 373
  },
  {
    uniqueCode: "GJ5/6",
    name: "Shtanga bashkuese",
    description: "94.3 cm",
    location: "01/A",
    quantity: 1,
    seedIndex: 374
  },
  {
    uniqueCode: "GJ5/7",
    name: "Shtanga goditëse",
    description: "103 cm",
    location: "01/A",
    quantity: 1,
    seedIndex: 375
  },
  {
    uniqueCode: "GJ5/8",
    name: "Mbajtëse vizore",
    location: "01/A",
    quantity: 1,
    seedIndex: 376
  },
  {
    uniqueCode: "GJ5/9",
    name: "Çelës",
    description: "13",
    location: "01/A",
    quantity: 1,
    seedIndex: 377
  },
  {
    inventoryNo: 227,
    uniqueCode: "GJ-10",
    name: "Pajisja e Proctor-it",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 378
  },
  {
    uniqueCode: "GJ-10/1/1",
    name: "Fustela + Kollare",
    location: "01/A",
    seedIndex: 379
  },
  {
    uniqueCode: "GJ-10/4",
    name: "Çekiçi i goditjes",
    description: "pesha 2.5 kg",
    model: "33-T0075",
    location: "01/A",
    seedIndex: 380
  },
  {
    uniqueCode: "EL21",
    name: "Fusela per testin e Proctor",
    manufacturer: "ELE INTERNATIONAL",
    location: "01/A",
    quantity: 1,
    seedIndex: 381
  },
  {
    inventoryNo: 228,
    uniqueCode: "GJ-10/5",
    name: "Kompaktori automatik për Proctor",
    manufacturer: "CONTROLS",
    model: "33-T8502",
    serialNumber: "14003563",
    location: "01/A",
    quantity: 1,
    seedIndex: 382
  },
  {
    inventoryNo: 229,
    uniqueCode: "GJ-17",
    name: "Pajisja e Shearmeter",
    manufacturer: "CONTROLS",
    model: "16-T0175/A",
    serialNumber: "15010054",
    location: "01/A",
    quantity: 1,
    seedIndex: 383
  },
  {
    uniqueCode: "GJ-17/1",
    name: "Koka te ndryshme",
    description: "diametri 0.2 mm",
    location: "01/A",
    quantity: 3,
    seedIndex: 384
  },
  {
    inventoryNo: 230,
    uniqueCode: "GJ-16",
    name: "Pajisja e California Bearing Ratio",
    manufacturer: "UNIFRAME",
    model: "70-T0108/E",
    serialNumber: "3116015",
    location: "01/A",
    quantity: 1,
    seedIndex: 385
  },
  {
    uniqueCode: "GJ -16/1",
    name: "Piston i penetrimi për CBR",
    model: "76-T0103/1",
    location: "01/A",
    quantity: 1,
    seedIndex: 386
  },
  {
    uniqueCode: "GJ -16/2",
    name: "Fusela + Kollare",
    manufacturer: "CONTROLS",
    model: "34-T0090",
    location: "01/A",
    quantity: 1,
    seedIndex: 387
  },
  {
    uniqueCode: "GJ -16/3",
    name: "Spesorë në formë pllake rrethore",
    manufacturer: "CONTROLS",
    model: "34-T0691",
    location: "01/A",
    quantity: 1,
    seedIndex: 388
  },
  {
    uniqueCode: "GJ -16/4",
    name: "Pesha cilindrike me hapësirë në mes",
    manufacturer: "CONTROLS",
    model: "34-T0094",
    location: "01/A",
    quantity: 1,
    seedIndex: 389
  },
  {
    uniqueCode: "EL18 - EL19",
    name: "Fusela per testin e CBR",
    manufacturer: "ELE INTERNATIONAL",
    model: "BS EN",
    location: "01/A",
    quantity: 2,
    seedIndex: 390
  },
  {
    uniqueCode: "40",
    name: "Aksesore për fuselat e CBR",
    description: "sete",
    manufacturer: "ELE INTERNATIONAL",
    serialNumber: "40",
    location: "01/A",
    quantity: 3,
    seedIndex: 391
  },
  {
    uniqueCode: "EL20",
    name: "Bazamenti metalik",
    manufacturer: "ELE INTERNATIONAL",
    location: "01/A",
    quantity: 1,
    seedIndex: 392
  },
  {
    inventoryNo: 231,
    uniqueCode: "GJ-19/1",
    name: "Unaza e vogël",
    description: "Aksesorë të peshës volumore të dherave",
    location: "01/A",
    quantity: 1,
    seedIndex: 393
  },
  {
    inventoryNo: 232,
    uniqueCode: "GJ-19/2",
    name: "Unaza e madhe",
    description: "Aksesorë të peshës volumore të dherave",
    location: "01/A",
    quantity: 1,
    seedIndex: 394
  },
  {
    inventoryNo: 233,
    uniqueCode: "GJ-18",
    name: "Pajisja e Pinhole",
    manufacturer: "CONTROLS",
    model: "38-T0189/A",
    serialNumber: "16000642",
    seedIndex: 395
  },
  {
    inventoryNo: 234,
    name: "Seti i konit të rërës",
    description: "diameter d=165.1 mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 396
  },
  {
    uniqueCode: "GJ-11/1",
    name: "Pjesa e siperme e konit te reres",
    description: "diameter d=165.1 mm",
    manufacturer: "CONTROLS",
    model: "35-T0129/1",
    quantity: 1,
    seedIndex: 397
  },
  {
    uniqueCode: "GJ-11/3",
    name: "Bidoni i konit te reres",
    description: "plastik",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 398
  },
  {
    uniqueCode: "GJ-11/2",
    name: "Bazamenti i konit te reres",
    description: "metalik",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 399
  },
  {
    inventoryNo: 235,
    uniqueCode: "GJ-11/15",
    name: "Seti i konit të rërës",
    description: "diameter d=165.1 mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 400
  },
  {
    uniqueCode: "GJ-11/15.1",
    name: "Pjesa e siperme e konit te reres",
    description: "diameter d=165.1 mm",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 401
  },
  {
    uniqueCode: "GJ-11/15.2",
    name: "Bidoni i konit te reres",
    description: "plastik",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 402
  },
  {
    uniqueCode: "GJ-11/15.3",
    name: "Bazamenti i konit te reres",
    description: "metalik",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 403
  },
  {
    inventoryNo: 236,
    name: "Seti i konit të rërës",
    description: "diameter d=320.5mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 404
  },
  {
    uniqueCode: "GJ11/6",
    name: "Pjesa e siperme e konit te reres",
    description: "diameter d=320.5mm",
    manufacturer: "CONTROLS",
    model: "S231",
    serialNumber: "S231*4*04",
    quantity: 1,
    seedIndex: 405
  },
  {
    uniqueCode: "GJ-11/5.4",
    name: "Bidoni i konit te reres",
    description: "plastik",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 406
  },
  {
    uniqueCode: "GJ11/9",
    name: "Bazamenti i konit te reres",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 407
  },
  {
    inventoryNo: 237,
    name: "Seti i konit të rërës",
    description: "diameter d=320.5mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 408
  },
  {
    uniqueCode: "GJ11/7",
    name: "Pjesa e siperme e konit te reres",
    description: "diameter d=320.5mm",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 409
  },
  {
    name: "Bidoni i konit te reres",
    manufacturer: "CONTROLS",
    seedIndex: 410
  },
  {
    name: "Bazamenti i konit te reres",
    manufacturer: "CONTROLS",
    seedIndex: 411
  },
  {
    inventoryNo: 238,
    uniqueCode: "EL24/1",
    name: "Kon Rërë",
    description: "Hinka metalike",
    manufacturer: "CONTROLS",
    model: "35-T0129/1",
    serialNumber: "01785800000000",
    location: "01/A",
    quantity: 1,
    seedIndex: 412
  },
  {
    uniqueCode: "EL25",
    name: "Bidona plastike për Konin e rërës",
    location: "01/A",
    quantity: 1,
    seedIndex: 413
  },
  {
    inventoryNo: 239,
    uniqueCode: "FM41",
    name: "Pajisja e Speedy moisture",
    manufacturer: "CONTROLS",
    model: "19-T0019",
    serialNumber: "1602496",
    location: "01/A",
    quantity: 1,
    seedIndex: 414
  },
  {
    uniqueCode: "FM41/1",
    name: "Kapsula karbiti",
    model: "1402",
    quantity: 60,
    seedIndex: 415
  },
  {
    uniqueCode: "FM41/2",
    name: "Peshore + stendë metalike",
    quantity: 1,
    seedIndex: 416
  },
  {
    uniqueCode: "FM41/3",
    name: "Dinamometer",
    quantity: 1,
    seedIndex: 417
  },
  {
    uniqueCode: "FM41/4/1",
    name: "Sfera",
    quantity: 3,
    seedIndex: 418
  },
  {
    uniqueCode: "FM41/5",
    name: "Enë metalike",
    quantity: 1,
    seedIndex: 419
  },
  {
    uniqueCode: "FM41/6/1",
    name: "Enë plastike",
    quantity: 2,
    seedIndex: 420
  },
  {
    inventoryNo: 240,
    uniqueCode: "GJ-21",
    name: "Pajisja për provën Braziliane",
    description: "Dimensione 225 x 350 x 370 mm",
    manufacturer: "CONTROLS",
    model: "50-C9000/B",
    serialNumber: "14003818",
    location: "01/A",
    quantity: 1,
    seedIndex: 421
  },
  {
    uniqueCode: "GJ-21/1",
    name: "Mbështetëse druri",
    description: "300 mm",
    serialNumber: "19209",
    quantity: 39,
    seedIndex: 422
  },
  {
    name: "Cilinder metalik për dherat",
    description: "20.5 x 8mm",
    quantity: 2,
    seedIndex: 423
  },
  {
    name: "Cilinder metalik për dherat",
    description: "14.5 x 8mm",
    quantity: 5,
    seedIndex: 424
  },
  {
    name: "Cilinder metalik për dherat",
    description: "13.5 x 8mm",
    quantity: 4,
    seedIndex: 425
  },
  {
    name: "Cilinder metalik për dherat",
    description: "10.5 x 8mm",
    quantity: 1,
    seedIndex: 426
  },
  {
    name: "Mbajtëse manometri",
    description: "Pllaka me vrima + bisht",
    quantity: 3,
    seedIndex: 427
  },
  {
    name: "Vida për montim të fuselës + kollare",
    description: "E madhe",
    quantity: 2,
    seedIndex: 428
  },
  {
    inventoryNo: 241,
    uniqueCode: "FM-B-1",
    name: "Table flow per betone",
    location: "01/A",
    quantity: 1,
    seedIndex: 429
  },
  {
    uniqueCode: "FM-B-1/1",
    name: "Bazament",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 430
  },
  {
    uniqueCode: "FM-B-1/2",
    name: "Koni",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 431
  },
  {
    uniqueCode: "FM-B-1/3",
    name: "Hinkë e sipërme",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 432
  },
  {
    uniqueCode: "FM-B-1/4",
    name: "Shkop druri",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 433
  },
  {
    inventoryNo: 242,
    uniqueCode: "FM166",
    name: "Pajisja e Shrinkage për beton",
    description: "Dimensione 50*10 mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 434
  },
  {
    uniqueCode: "FM166/1",
    name: "Komparator zhvendosjeje (Digital micron indicator)",
    description: "Intervali i matjes 0-12,7 mm, e=0,001 mm",
    manufacturer: "CHINA",
    serialNumber: "1728881",
    quantity: 1,
    seedIndex: 435
  },
  {
    inventoryNo: 243,
    uniqueCode: "FM32",
    name: "Aparati për përshkueshmërinë e ujit në beton",
    manufacturer: "STRASSEN TEST",
    serialNumber: "10563",
    location: "01/A",
    quantity: 1,
    seedIndex: 436
  },
  {
    uniqueCode: "FM32/1",
    name: "Gomina rrethore",
    manufacturer: "STRASSEN TEST",
    quantity: 6,
    seedIndex: 437
  },
  {
    uniqueCode: "FM32/2",
    name: "Çelës metalik",
    description: "27/24 mm",
    manufacturer: "STRASSEN TEST",
    quantity: 1,
    seedIndex: 438
  },
  {
    inventoryNo: 244,
    uniqueCode: "FM48",
    name: "Porozimeter",
    description: "CONTROLS",
    manufacturer: "54-C0170/E",
    model: "2010405",
    location: "01/A",
    quantity: 1,
    seedIndex: 439
  },
  {
    inventoryNo: 245,
    uniqueCode: "FM49",
    name: "Porozimeter + pompë plastike",
    description: "ELE INTERNATIONAL",
    manufacturer: "34-3265",
    model: "30323",
    location: "01/A",
    notes: "ok",
    quantity: 1,
    seedIndex: 440
  },
  {
    inventoryNo: 246,
    uniqueCode: "FM50",
    name: "Porozimeter",
    description: "ELE INTERNATIONAL",
    manufacturer: "34-3265",
    model: "30929",
    location: "01/A",
    notes: "ok",
    quantity: 1,
    seedIndex: 441
  },
  {
    inventoryNo: 247,
    uniqueCode: "FM 63",
    name: "Vibrues betoni",
    description: "CONTROLS",
    manufacturer: "58-C0162/E",
    model: "9600797",
    location: "Dhoma e betonit",
    quantity: 1,
    seedIndex: 442
  },
  {
    inventoryNo: 248,
    uniqueCode: "BB-1",
    name: "Betoniere",
    description: "0,025 m3",
    location: "Dhoma e betonit",
    quantity: 1,
    seedIndex: 443
  },
  {
    inventoryNo: 249,
    uniqueCode: "FM65/1",
    name: "Set Slumpi",
    description: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 444
  },
  {
    inventoryNo: 250,
    uniqueCode: "FM65/2",
    name: "Set Slumpi",
    description: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 445
  },
  {
    inventoryNo: 251,
    uniqueCode: "FM66/1",
    name: "Slump (Koni Abraham’s) për beton",
    description: "CONTROLS",
    location: "01/A",
    quantity: 6,
    seedIndex: 446
  },
  {
    uniqueCode: "FM66/7",
    name: "Bazamenti",
    description: "CONTROLS",
    location: "01/A",
    quantity: 7,
    seedIndex: 447
  },
  {
    uniqueCode: "FM66/21",
    name: "Shufra metalike",
    description: "CONTROLS",
    location: "01/A",
    quantity: 2,
    seedIndex: 448
  },
  {
    uniqueCode: "FM66/27",
    name: "Aksesori në formë koni i sipërm",
    description: "CONTROLS",
    location: "01/A",
    quantity: 5,
    seedIndex: 449
  },
  {
    inventoryNo: 252,
    uniqueCode: "TC1",
    name: "Kamera Termike",
    manufacturer: "FLIR",
    model: "E-53",
    location: "01/A",
    notes: "Blerë në Janar 2020",
    quantity: 1,
    seedIndex: 450
  },
  {
    uniqueCode: "TC1/1",
    name: "Fisha e karikusit",
    description: "Aksesor",
    quantity: 2,
    seedIndex: 451
  },
  {
    name: "Koka karikuese",
    description: "Aksesor",
    quantity: 8,
    seedIndex: 452
  },
  {
    name: "Fishë",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 453
  },
  {
    name: "Bateri",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 454
  },
  {
    name: "Karikues për baterinë",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 455
  },
  {
    inventoryNo: 253,
    uniqueCode: "FM42",
    name: "Sklerometer betoni",
    description: "BOVIAR",
    manufacturer: "GEICONCRETE",
    model: "MATR.A/08/SC0007",
    location: "01/A",
    notes: "Blerë në Janar 2021",
    quantity: 1,
    seedIndex: 456
  },
  {
    uniqueCode: "FM42/1",
    name: "Etaloni per verifikimin e brendshem",
    manufacturer: "SINT03",
    model: "SIM0107C06",
    quantity: 1,
    seedIndex: 457
  },
  {
    uniqueCode: "FM42/2",
    name: "Diagrama e vendosjes së pikave në strukturë",
    quantity: 1,
    seedIndex: 458
  },
  {
    uniqueCode: "FM42/3",
    name: "Guri zmerilues",
    quantity: 1,
    seedIndex: 459
  },
  {
    inventoryNo: 254,
    uniqueCode: "FM43",
    name: "Sklerometer betoni",
    description: "GEOHUMER",
    manufacturer: "N04L008120",
    location: "01/A",
    notes: "Në çantën EUROSIT",
    quantity: 1,
    seedIndex: 460
  },
  {
    uniqueCode: "FM43/1",
    name: "Guri zmerilues",
    location: "01/A",
    quantity: 1,
    seedIndex: 461
  },
  {
    uniqueCode: "FM46/1",
    name: "Guri zmerilues",
    notes: "i thyer",
    quantity: 1,
    seedIndex: 462
  },
  {
    uniqueCode: "FM46/2",
    name: "Diagrama e vendosjes së pikave në strukturë",
    quantity: 1,
    seedIndex: 463
  },
  {
    inventoryNo: 255,
    uniqueCode: "FM 42",
    name: "Sklerometer betoni",
    manufacturer: "BOVIAR",
    model: "GEICONCRETE",
    location: "01/A",
    notes: "punon",
    quantity: 1,
    seedIndex: 464
  },
  {
    inventoryNo: 256,
    uniqueCode: "FM46/3",
    name: "Sklerometer betoni",
    manufacturer: "BOVIAR",
    model: "GEICONCRETE",
    serialNumber: "MATR.A/08/SC0003",
    location: "01/A",
    notes: "punon",
    quantity: 1,
    seedIndex: 465
  },
  {
    uniqueCode: "FM46/4",
    name: "Diagrama e vendosjes së pikave në strukturë",
    quantity: 1,
    seedIndex: 466
  },
  {
    inventoryNo: 257,
    uniqueCode: "RT2",
    name: "Sklerometer betoni",
    description: "N - Type",
    manufacturer: "RANTEK",
    model: "REC2470",
    serialNumber: "RC 78679",
    location: "01/A",
    notes: "Blerë me datë 03.10.2022",
    quantity: 1,
    seedIndex: 467
  },
  {
    name: "Guri zmerilues",
    quantity: 1,
    seedIndex: 468
  },
  {
    name: "Kaçavida",
    quantity: 2,
    seedIndex: 469
  },
  {
    name: "Susta rezervë e sklerometrit",
    quantity: 1,
    seedIndex: 470
  },
  {
    inventoryNo: 258,
    uniqueCode: "RT4",
    name: "Sklerometer betoni",
    description: "N - Type",
    manufacturer: "RANTEK",
    model: "ROC2470",
    serialNumber: "RC 78680",
    location: "01/A",
    notes: "Blerë me datë 03.10.2022",
    quantity: 1,
    seedIndex: 471
  },
  {
    name: "Guri zmerilues",
    quantity: 1,
    seedIndex: 472
  },
  {
    name: "Kaçavida",
    quantity: 2,
    seedIndex: 473
  },
  {
    name: "Susta rezervë e sklerometrit",
    quantity: 1,
    seedIndex: 474
  },
  {
    inventoryNo: 259,
    uniqueCode: "RT5",
    name: "Sklerometer betoni",
    description: "N - Type",
    manufacturer: "RANTEK",
    model: "ROC2470",
    serialNumber: "RC 78678",
    location: "01/A",
    notes: "Blerë me datë 03.10.2022",
    quantity: 1,
    seedIndex: 475
  },
  {
    name: "Guri zmerilues",
    quantity: 1,
    seedIndex: 476
  },
  {
    name: "Kaçavida",
    quantity: 2,
    seedIndex: 477
  },
  {
    name: "Susta rezervë e sklerometrit",
    quantity: 1,
    seedIndex: 478
  },
  {
    inventoryNo: 260,
    uniqueCode: "FM47",
    name: "Elcometer",
    description: "Diameter 5 – 50 mm",
    manufacturer: "CONTROLS",
    model: "HF 11777-017",
    serialNumber: "PA11489",
    location: "01/A",
    notes: "+ koke lexuese",
    quantity: 1,
    seedIndex: 479
  },
  {
    uniqueCode: "FM47/1",
    name: "Elcometer bore hole probe (sensing direction)",
    manufacturer: "CONTROLS",
    notes: "sonda",
    quantity: 1,
    seedIndex: 480
  },
  {
    uniqueCode: "FM47/2",
    name: "Bar tracker monitor",
    manufacturer: "CONTROLS",
    model: "58-E6102",
    serialNumber: "14601280",
    quantity: 1,
    seedIndex: 481
  },
  {
    uniqueCode: "FM47/3",
    name: "Kokë lexuese",
    manufacturer: "CONTROLS",
    serialNumber: "PC01045",
    quantity: 1,
    seedIndex: 482
  },
  {
    uniqueCode: "FM47/4",
    name: "Kokë lexuese",
    manufacturer: "CONTROLS",
    model: "58-E61100/1",
    serialNumber: "14601979",
    quantity: 1,
    seedIndex: 483
  },
  {
    uniqueCode: "FM47/5",
    name: "Kokë lexuese",
    manufacturer: "CONTROLS",
    model: "58-E61100/2",
    serialNumber: "14601982",
    quantity: 1,
    seedIndex: 484
  },
  {
    uniqueCode: "FM47/6",
    name: "Kufje",
    quantity: 2,
    seedIndex: 485
  },
  {
    name: "Karikues",
    quantity: 1,
    seedIndex: 486
  },
  {
    inventoryNo: 261,
    name: "Elcometer",
    manufacturer: "CONTROLS",
    model: "58-E6102",
    serialNumber: "14601280",
    location: "01/A",
    quantity: 1,
    seedIndex: 487
  },
  {
    name: "Kokë lexuese",
    quantity: 1,
    seedIndex: 488
  },
  {
    name: "Lidhës me kompjuterin",
    quantity: 1,
    seedIndex: 489
  },
  {
    uniqueCode: "FM47/7",
    name: "Pjesë e elcometrit dhe trapanos",
    manufacturer: "CONTROLS",
    model: "58-E6100/4",
    serialNumber: "PA11489",
    quantity: 1,
    seedIndex: 490
  },
  {
    inventoryNo: 262,
    uniqueCode: "FM55/17",
    name: "Pajisja Ultrasonic",
    manufacturer: "BOVIAR",
    model: "UTD1004",
    serialNumber: "S.081-051",
    location: "01/A",
    quantity: 1,
    seedIndex: 491
  },
  {
    uniqueCode: "FM55/18",
    name: "Monitori",
    quantity: 1,
    seedIndex: 492
  },
  {
    uniqueCode: "FM55/19/1",
    name: "Elektroda",
    quantity: 2,
    seedIndex: 493
  },
  {
    uniqueCode: "FM55/21",
    name: "Etalon",
    quantity: 1,
    seedIndex: 494
  },
  {
    uniqueCode: "FM55/22",
    name: "Ena e grasos",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 495
  },
  {
    uniqueCode: "FM55/23",
    name: "Fisha që lidhet monitori me elektrodat",
    description: "Aksesor",
    quantity: 2,
    seedIndex: 496
  },
  {
    inventoryNo: 263,
    uniqueCode: "FM56",
    name: "Pajisja e integritetit të pilotave",
    description: "BOVIAR",
    model: "303",
    location: "01/A",
    quantity: 1,
    seedIndex: 497
  },
  {
    uniqueCode: "FM56/1",
    name: "Monitori",
    location: "01/A",
    quantity: 1,
    seedIndex: 498
  },
  {
    uniqueCode: "FM56/2",
    name: "Çekiçi",
    location: "01/A",
    quantity: 1,
    seedIndex: 499
  },
  {
    uniqueCode: "FM56/3",
    name: "Sensori",
    location: "01/A",
    quantity: 1,
    seedIndex: 500
  },
  {
    uniqueCode: "FM56/4",
    name: "Karikuesi",
    location: "01/A",
    quantity: 1,
    seedIndex: 501
  },
  {
    uniqueCode: "FM56/5",
    name: "Fisha lidhëse me kompjuterin",
    location: "01/A",
    quantity: 1,
    seedIndex: 502
  },
  {
    inventoryNo: 264,
    uniqueCode: "FM58/5",
    name: "Karrotatrice",
    manufacturer: "HILTI",
    model: "DD160",
    serialNumber: "104550",
    location: "01/A",
    quantity: 1,
    seedIndex: 503
  },
  {
    uniqueCode: "FM58/6",
    name: "Koronë",
    description: "Diameter ø 52 mm",
    manufacturer: "HILTI",
    location: "01/A",
    quantity: 1,
    seedIndex: 504
  },
  {
    uniqueCode: "FM58/7",
    name: "Koronë",
    description: "Diameter ø 152 mm",
    manufacturer: "INC-CO",
    model: "DCB581528",
    location: "01/A",
    quantity: 1,
    seedIndex: 505
  },
  {
    uniqueCode: "FM58/8",
    name: "Koronë",
    description: "Diameter ø 122 mm",
    manufacturer: "INC-CO",
    model: "DCB581228",
    location: "01/A",
    quantity: 1,
    seedIndex: 506
  },
  {
    uniqueCode: "FM58/9",
    name: "Koronë",
    description: "Diameter ø 82 mm",
    manufacturer: "INC-CO",
    model: "DCB580828",
    location: "01/A",
    quantity: 1,
    seedIndex: 507
  },
  {
    uniqueCode: "FM58/10",
    name: "Kokë për koronë",
    description: "Diametri ø 102 mm",
    manufacturer: "HILTI",
    location: "01/A",
    quantity: 10,
    seedIndex: 508
  },
  {
    inventoryNo: 265,
    uniqueCode: "FM58",
    name: "Karrotatrice",
    manufacturer: "HILTI",
    model: "DD160",
    serialNumber: "32663",
    location: "01/A",
    quantity: 1,
    seedIndex: 509
  },
  {
    uniqueCode: "FM58/1",
    name: "Koronë",
    description: "Diameter ø 77 mm",
    manufacturer: "HILTI",
    location: "01/A",
    quantity: 1,
    seedIndex: 510
  },
  {
    uniqueCode: "FM58/2",
    name: "Koronë",
    description: "Diameter ø 102 mm",
    manufacturer: "HILTI",
    location: "01/A",
    quantity: 4,
    seedIndex: 511
  },
  {
    uniqueCode: "FM58/3",
    name: "Koronë",
    description: "Diameter ø 152 mm",
    manufacturer: "HILTI",
    location: "01/A",
    quantity: 1,
    seedIndex: 512
  },
  {
    uniqueCode: "FM58/4",
    name: "Koronë",
    description: "Diameter ø 200 mm",
    manufacturer: "HILTI",
    location: "01/A",
    seedIndex: 513
  },
  {
    uniqueCode: "FM58/11",
    name: "Upa për karrotratiçe",
    manufacturer: "HILTI",
    location: "01/A",
    quantity: 66,
    seedIndex: 514
  },
  {
    name: "Shufra + koka lidhëse me karrotatriçen",
    manufacturer: "HILTI",
    location: "01/A",
    quantity: 2,
    seedIndex: 515
  },
  {
    name: "Dalti",
    manufacturer: "HILTI",
    location: "01/A",
    quantity: 2,
    seedIndex: 516
  },
  {
    inventoryNo: 266,
    uniqueCode: "FM59",
    name: "Karrotatrice",
    manufacturer: "DEWALT",
    model: "D2585",
    location: "01/A",
    notes: "Blerë në Prill 2021",
    quantity: 1,
    seedIndex: 517
  },
  {
    uniqueCode: "FM59/4",
    name: "Aksesorët e sharrës së karrotave",
    location: "01/A",
    seedIndex: 518
  },
  {
    uniqueCode: "FM59/6",
    name: "Ngrohëse për gominat",
    location: "01/A",
    seedIndex: 519
  },
  {
    uniqueCode: "FM59/7",
    name: "Kapëse për karrotat",
    location: "01/A",
    quantity: 2,
    seedIndex: 520
  },
  {
    uniqueCode: "FM59/9",
    name: "Aksesorë për zgjatje karrotatriçe",
    location: "01/A",
    quantity: 2,
    seedIndex: 521
  },
  {
    uniqueCode: "FM59/11",
    name: "Disk prerës – sharra e karrotave",
    location: "01/A",
    seedIndex: 522
  },
  {
    inventoryNo: 267,
    uniqueCode: "FM54",
    name: "Pajisja e Pull Off",
    manufacturer: "ELLE INTERNATIONAL",
    model: "ENERPAC",
    location: "01/A",
    quantity: 1,
    seedIndex: 523
  },
  {
    inventoryNo: 268,
    uniqueCode: "FM55",
    name: "Pajisja e Pull Off",
    manufacturer: "CONTROLS",
    model: "58-C0218/T",
    serialNumber: "7000542",
    location: "01/A",
    quantity: 1,
    seedIndex: 524
  },
  {
    inventoryNo: 269,
    uniqueCode: "FM55/23",
    name: "Pajisja e Pull Off",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 525
  },
  {
    uniqueCode: "FM54/1",
    name: "Pistoni",
    manufacturer: "ELLE INTERNATIONAL",
    serialNumber: "RC506",
    quantity: 1,
    seedIndex: 526
  },
  {
    uniqueCode: "FM54/2",
    name: "Barometer",
    description: "0-1 MN/m2",
    manufacturer: "ELLE INTERNATIONAL",
    quantity: 1,
    seedIndex: 527
  },
  {
    uniqueCode: "FM55/24/1",
    name: "Disqe çeliku",
    description: "Aksesor",
    notes: "Diameter 5 cm (vetëm njëri prej disqeve ka diameter 6 cm)",
    quantity: 5,
    seedIndex: 528
  },
  {
    uniqueCode: "EL33/1",
    name: "Disqe çeliku",
    description: "Aksesor",
    manufacturer: "CONTROLS",
    model: "58-C0215/5",
    quantity: 2,
    seedIndex: 529
  },
  {
    uniqueCode: "FM55/25",
    name: "Karikues",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 530
  },
  {
    inventoryNo: 270,
    uniqueCode: "FM55",
    name: "Pajisja e Pull Out",
    manufacturer: "HILTI",
    serialNumber: "15263",
    location: "01/A",
    quantity: 1,
    seedIndex: 531
  },
  {
    uniqueCode: "FM55/1",
    name: "Dial manometer",
    description: "0-5 kN ; 0-1100 lbf",
    manufacturer: "HILTI",
    quantity: 1,
    seedIndex: 532
  },
  {
    uniqueCode: "FM55/2",
    name: "Dial manometer",
    description: "0-10 kN; 0-2000 lbf",
    manufacturer: "HILTI",
    quantity: 1,
    seedIndex: 533
  },
  {
    uniqueCode: "FM55/3",
    name: "Furça teli pastruese + furçë druri",
    manufacturer: "HILTI",
    quantity: 2,
    seedIndex: 534
  },
  {
    uniqueCode: "FM55/5",
    name: "Çelës",
    description: "10 mm",
    manufacturer: "HILTI",
    quantity: 2,
    seedIndex: 535
  },
  {
    uniqueCode: "FM55/6",
    name: "Çelës",
    description: "22 mm",
    seedIndex: 536
  },
  {
    uniqueCode: "FM55/7",
    name: "Spray për pastrim",
    quantity: 1,
    seedIndex: 537
  },
  {
    uniqueCode: "FM55/8",
    name: "Shufër Teli",
    quantity: 1,
    seedIndex: 538
  },
  {
    uniqueCode: "FM55/9",
    name: "Gomina",
    quantity: 5,
    seedIndex: 539
  },
  {
    uniqueCode: "FM55/10",
    name: "Pistoleta gjuajtëse",
    manufacturer: "HILTI",
    model: "Dx450-SCT",
    serialNumber: "636757",
    quantity: 1,
    seedIndex: 540
  },
  {
    uniqueCode: "FM55/11",
    name: "Pajisje tërheqëse",
    description: "Aksesor testues",
    serialNumber: "15263",
    quantity: 1,
    seedIndex: 541
  },
  {
    uniqueCode: "FM55/12",
    name: "Bazament me 3 këmb",
    quantity: 1,
    seedIndex: 542
  },
  {
    uniqueCode: "FM55/13",
    name: "Lenda plasëse për gjuajtje",
    model: "03MAY13-F",
    notes: "540 Jeshile + 120 verdha",
    seedIndex: 543
  },
  {
    uniqueCode: "FM55/14/1",
    name: "Sonda",
    description: "Gozhdë ngulëse 102 mm",
    model: "X-M6-8-72D12",
    seedIndex: 544
  },
  {
    uniqueCode: "FM55/15/1",
    name: "Sonda",
    description: "Gozhdë ngulëse 72 mm",
    model: "X-M6-8-52D12",
    seedIndex: 545
  },
  {
    uniqueCode: "FM55/16/2",
    name: "Sonda",
    description: "Gozhdë ngulëse 52 mm",
    model: "X-M6-8-95D12",
    seedIndex: 546
  },
  {
    name: "Aksesorë për kokat",
    quantity: 12,
    seedIndex: 547
  },
  {
    name: "Aksesorë për pajisjen tërheqëse",
    quantity: 1,
    seedIndex: 548
  },
  {
    inventoryNo: 271,
    uniqueCode: "FM6",
    name: "Përzierës llaçesh",
    manufacturer: "CONTROLS",
    model: "65-L0005",
    serialNumber: "SL5",
    location: "02/B",
    quantity: 1,
    seedIndex: 549
  },
  {
    uniqueCode: "FM6/1",
    name: "Enë e madhe metalike ku përzihet llaçi",
    description: "Enë metalik, kapaciteti 5 litra",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 550
  },
  {
    uniqueCode: "FM6/2",
    name: "Krahu përzjerës",
    description: "Material metalik",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 551
  },
  {
    inventoryNo: 272,
    uniqueCode: "FM13",
    name: "Tundësi i llaçeve",
    manufacturer: "UTEST",
    model: "UTCM-0091",
    serialNumber: "17/001345",
    location: "02/B",
    quantity: 1,
    seedIndex: 552
  },
  {
    uniqueCode: "FM13/1",
    name: "Prizë zgjatuese me 3 vende",
    quantity: 1,
    seedIndex: 553
  },
  {
    inventoryNo: 273,
    uniqueCode: "FM11",
    name: "Flow Table për llaçet",
    manufacturer: "CONTROLS",
    model: "64-L0038/A",
    serialNumber: "18009567",
    location: "02/B",
    quantity: 1,
    seedIndex: 554
  },
  {
    uniqueCode: "FM11/1",
    name: "Forma konike prej metali",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 555
  },
  {
    uniqueCode: "FM11/2",
    name: "Çekiçi metalik",
    manufacturer: "CONTROLS",
    notes: "+1 pjesëz e sipërme konike",
    quantity: 1,
    seedIndex: 556
  },
  {
    inventoryNo: 274,
    uniqueCode: "FM8",
    name: "Aparati Vikkat",
    manufacturer: "CONTROLS",
    model: "L20",
    serialNumber: "18009567",
    location: "02/B",
    quantity: 1,
    seedIndex: 557
  },
  {
    uniqueCode: "FM8/1",
    name: "Gjilpëra me majë të mprehtë",
    description: "Aksesor",
    notes: "0-40 mm",
    quantity: 1,
    seedIndex: 558
  },
  {
    uniqueCode: "FM8/2",
    name: "Gjilpëra me fund të gjerë",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 559
  },
  {
    uniqueCode: "FM8/3",
    name: "Xhama mbulues",
    description: "Aksesor",
    quantity: 2,
    seedIndex: 560
  },
  {
    uniqueCode: "FM8/4",
    name: "Forma konike prej gome",
    description: "Aksesor",
    notes: "1 i madh + 2 mesatare + 2 të vegjël",
    quantity: 1,
    seedIndex: 561
  },
  {
    uniqueCode: "FM8/5",
    name: "Lugë metalike",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 562
  },
  {
    uniqueCode: "FM8/6",
    name: "Lugë plastike",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 563
  },
  {
    inventoryNo: 275,
    uniqueCode: "FM9",
    name: "Aparati Vikkat",
    manufacturer: "CONTROLS",
    serialNumber: "SL6",
    location: "02/B",
    quantity: 1,
    seedIndex: 564
  },
  {
    uniqueCode: "FM9/1",
    name: "Gjilpëra me fund me formë",
    description: "Aksesor",
    notes: "0-50 mm",
    quantity: 1,
    seedIndex: 565
  },
  {
    name: "Gjilpëra me majë të mprehtë",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 566
  },
  {
    inventoryNo: 276,
    uniqueCode: "K1",
    name: "Aparati Blaine",
    manufacturer: "CONTROLS",
    model: "62-L0041/A",
    serialNumber: "1104253",
    location: "01/B",
    quantity: 1,
    seedIndex: 567
  },
  {
    uniqueCode: "K1/1",
    name: "Letra filtri",
    manufacturer: "CONTROLS",
    model: "62-L0041/3",
    seedIndex: 568
  },
  {
    uniqueCode: "K1/2",
    name: "Vaji i aparatit",
    seedIndex: 569
  },
  {
    uniqueCode: "K1/3",
    name: "Mërkur",
    description: "HgCl2",
    seedIndex: 570
  },
  {
    inventoryNo: 277,
    uniqueCode: "FM60",
    name: "Flow Cone për mishela",
    location: "01/A",
    quantity: 1,
    seedIndex: 571
  },
  {
    uniqueCode: "FM60/1",
    name: "Kasë druri",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 572
  },
  {
    uniqueCode: "FM60/2",
    name: "Hinka metalike",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 573
  },
  {
    uniqueCode: "FM60/3",
    name: "Sita metalike",
    description: "Aksesor",
    quantity: 1,
    seedIndex: 574
  },
  {
    inventoryNo: 278,
    uniqueCode: "Ç1",
    name: "Seti Le Chatelier",
    manufacturer: "CONTROLS",
    location: "02/B",
    quantity: 1,
    seedIndex: 575
  },
  {
    uniqueCode: "Ç1/1",
    name: "Forma cilindrike prej metali me dy krahe",
    description: "Aksesor",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 576
  },
  {
    uniqueCode: "Ç1/2",
    name: "Xhama mbulues prej qelqi",
    description: "Aksesor",
    manufacturer: "CONTROLS",
    quantity: 2,
    seedIndex: 577
  },
  {
    inventoryNo: 279,
    uniqueCode: "FM20/1",
    name: "Forma llaçi",
    description: "Material prej metali, katrore me dimensione 70x70x70 mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 578
  },
  {
    inventoryNo: 280,
    uniqueCode: "FM20/2",
    name: "Forma llaçi",
    description: "Material prej metali, katrore me dimensione 70x70x70 mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 579
  },
  {
    inventoryNo: 281,
    uniqueCode: "FM20/3",
    name: "Forma llaçi",
    description: "Material prej metali, katrore me dimensione 70x70x70 mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 580
  },
  {
    uniqueCode: "FM20/8",
    name: "Mbajtëse për format e llaçeve",
    manufacturer: "CONTROLS",
    serialNumber: "80163",
    location: "01/A",
    quantity: 2,
    seedIndex: 581
  },
  {
    inventoryNo: 282,
    uniqueCode: "FM14/1",
    name: "Forma llaçi",
    description: "Material prej metali, prizem me dimensione 40x40x160 mm",
    manufacturer: "CONTROLS",
    serialNumber: "SL8",
    location: "02/B",
    notes: "3 vende prizmash",
    quantity: 1,
    seedIndex: 582
  },
  {
    inventoryNo: 283,
    uniqueCode: "FM14/1/1",
    name: "Forma llaçi",
    description: "Material prej metali, prizem me dimensione 40x40x160 mm",
    manufacturer: "CONTROLS",
    location: "02/B",
    notes: "3 vende prizmash",
    quantity: 1,
    seedIndex: 583
  },
  {
    inventoryNo: 284,
    uniqueCode: "FM14/2",
    name: "Forma llaçi",
    description: "Material prej metali, prizem me dimensione 40x40x160 mm",
    manufacturer: "CONTROLS",
    serialNumber: "SL9",
    location: "02/B",
    notes: "3 vende prizmash",
    quantity: 1,
    seedIndex: 584
  },
  {
    inventoryNo: 285,
    name: "Forma llaçi",
    description: "Material prej metali, në formë 8",
    manufacturer: "CONTROLS",
    location: "02/B",
    quantity: 1,
    seedIndex: 585
  },
  {
    inventoryNo: 286,
    uniqueCode: "EL9",
    name: "Forma llaçi",
    description: "Material prej metali, prizem me dimensione 40x40x160 mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 586
  },
  {
    inventoryNo: 287,
    uniqueCode: "EL10",
    name: "Forma llaçi",
    description: "Material prej metali, prizem me dimensione 40x40x160 mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 587
  },
  {
    inventoryNo: 288,
    uniqueCode: "FM164",
    name: "Presë për tërheqjen e shufrave të çelikut",
    description: "500 - 1000 kN",
    manufacturer: "CONTROLS",
    model: "C0019",
    serialNumber: "201216 / 1E03179",
    location: "02/A",
    quantity: 1,
    seedIndex: 588
  },
  {
    uniqueCode: "FM164/1",
    name: "Nofulla për kapjen e shufrës së çelikut",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 589
  },
  {
    uniqueCode: "FM164/3",
    name: "Aksesorë për nofullat",
    notes: "(janë çift)",
    quantity: 1,
    seedIndex: 590
  },
  {
    uniqueCode: "FM164/5",
    name: "Set me 4 copë – Pompë + paketë elekrike",
    manufacturer: "CONTROLS",
    model: "R00-3804100.9",
    notes: "të vjetra",
    quantity: 1,
    seedIndex: 591
  },
  {
    uniqueCode: "FM 164/7",
    name: "Manometer për presën e shufrave të çeliku",
    manufacturer: "CONTROLS",
    model: "1370806002",
    notes: "Është e presës së vjetër që ka qenë manuale",
    quantity: 1,
    seedIndex: 592
  },
  {
    inventoryNo: 289,
    uniqueCode: "FM165",
    name: "Presë për tërheqjen e shufrave të çelikut",
    description: "600 kN",
    manufacturer: "U-TEST",
    model: "UTM - 4000",
    serialNumber: "06/013",
    location: "02/A",
    quantity: 1,
    seedIndex: 593
  },
  {
    uniqueCode: "FM165/1",
    name: "Laptop",
    manufacturer: "HONETECH",
    quantity: 1,
    seedIndex: 594
  },
  {
    uniqueCode: "FM165/2",
    name: "Paneli kontaktues",
    manufacturer: "U-TEST",
    quantity: 1,
    seedIndex: 595
  },
  {
    uniqueCode: "FM165/3",
    name: "Software",
    manufacturer: "VECTOR",
    notes: "Blerë në Janar 2020",
    quantity: 1,
    seedIndex: 596
  },
  {
    inventoryNo: 300,
    uniqueCode: "FM163",
    name: "Presë për përkuljen e shufrave të çelikut",
    manufacturer: "U-TEST",
    model: "UTM-8400",
    serialNumber: "17/000295",
    location: "02/A",
    quantity: 1,
    seedIndex: 597
  },
  {
    uniqueCode: "FM163/1",
    name: "Akesesorë për pistonin shtytës",
    description: "Aksesorë 2 cm",
    manufacturer: "U-TEST",
    quantity: 3,
    seedIndex: 598
  },
  {
    uniqueCode: "FM163/4",
    name: "Koka shtytëse",
    quantity: 1,
    seedIndex: 599
  },
  {
    inventoryNo: 301,
    uniqueCode: "F1",
    name: "Distilator uji",
    manufacturer: "GFL",
    model: "2001/4",
    serialNumber: "8603070",
    location: "01/A",
    quantity: 1,
    seedIndex: 600
  },
  {
    inventoryNo: 302,
    uniqueCode: "K10",
    name: "Kapa aspiruese",
    serialNumber: "SL2",
    location: "01/B",
    quantity: 1,
    seedIndex: 601
  },
  {
    inventoryNo: 303,
    uniqueCode: "AS10",
    name: "Kapa aspiruese",
    location: "05/A",
    quantity: 1,
    seedIndex: 602
  },
  {
    inventoryNo: 304,
    uniqueCode: "K15",
    name: "Ph metër",
    manufacturer: "HANNA INSTRUMENTS",
    model: "HI 8424",
    serialNumber: "N1654238",
    location: "01/B",
    quantity: 1,
    seedIndex: 603
  },
  {
    uniqueCode: "K15/1",
    name: "Elektroda pH metri",
    description: "pH 0-12; Temp: -5 – 70 oC",
    manufacturer: "HANNA INSTRUMENTS",
    model: "HI 1230",
    location: "01/B",
    quantity: 2,
    seedIndex: 604
  },
  {
    uniqueCode: "K15/3",
    name: "Solucion për ruajtjen e elektrodave",
    description: "25 ml",
    manufacturer: "HANNA INSTRUMENTS",
    model: "HI170300",
    serialNumber: "LOT8485",
    location: "01/B",
    seedIndex: 605
  },
  {
    inventoryNo: 305,
    uniqueCode: "K5",
    name: "EC/TDS/NaCl Meter",
    manufacturer: "HANNA INSTRUMENTS",
    model: "HI 9835",
    serialNumber: "8597822",
    location: "01/B",
    quantity: 1,
    seedIndex: 606
  },
  {
    inventoryNo: 306,
    uniqueCode: "K7",
    name: "Ph/ORP, DO, CD/TDS, Salt meter",
    manufacturer: "PCE-PHD 1",
    model: "Q642363",
    location: "01/B",
    quantity: 1,
    seedIndex: 607
  },
  {
    uniqueCode: "K7/1",
    name: "Sonda e aparatit",
    quantity: 1,
    seedIndex: 608
  },
  {
    uniqueCode: "K6/1",
    name: "Sonda e termoçiftit",
    manufacturer: "HANNA INSTRUMENTS",
    serialNumber: "A2295",
    quantity: 1,
    seedIndex: 609
  },
  {
    inventoryNo: 308,
    uniqueCode: "K6.1",
    name: "Termoçift K-Thermocouple Thermometer",
    manufacturer: "HANNA INSTRUMENTS",
    model: "HI 935005N",
    serialNumber: "8504829",
    location: "01/B",
    quantity: 1,
    seedIndex: 610
  },
  {
    uniqueCode: "K6.1/1",
    name: "Sonda e termoçiftit",
    manufacturer: "HANNA INSTRUMENTS",
    serialNumber: "A2606",
    quantity: 1,
    seedIndex: 611
  },
  {
    inventoryNo: 309,
    uniqueCode: "K22",
    name: "Termometër",
    description: "Temperatura -35 ÷ 70 oC",
    model: "IP74CGB9",
    serialNumber: "A2607",
    location: "01/B",
    quantity: 1,
    seedIndex: 612
  },
  {
    inventoryNo: 310,
    uniqueCode: "K19",
    name: "Termohigrometër manual",
    model: "21871675 / D01Q64",
    serialNumber: "3060",
    location: "Dhoma e betonit",
    quantity: 1,
    seedIndex: 613
  },
  {
    inventoryNo: 311,
    uniqueCode: "K20",
    name: "Matës ajri",
    description: "380 - 420 ppm",
    manufacturer: "WOHLER / ASSI CONTROL",
    model: "CLD 210",
    serialNumber: "100003567",
    location: "01/B",
    quantity: 1,
    seedIndex: 614
  },
  {
    inventoryNo: 312,
    uniqueCode: "K3",
    name: "Lupë",
    manufacturer: "PROIND",
    serialNumber: "SL1",
    location: "01/B",
    quantity: 1,
    seedIndex: 615
  },
  {
    inventoryNo: 314,
    uniqueCode: "FM7",
    name: "Kronometër",
    model: "C580",
    serialNumber: "A2296",
    location: "01/B",
    quantity: 1,
    seedIndex: 616
  },
  {
    inventoryNo: 315,
    uniqueCode: "K11",
    name: "Desikator",
    serialNumber: "SL3",
    location: "01/B",
    quantity: 1,
    seedIndex: 617
  },
  {
    inventoryNo: 316,
    uniqueCode: "K11.1",
    name: "Desikator",
    serialNumber: "SL4",
    location: "01/B",
    quantity: 1,
    seedIndex: 618
  },
  {
    inventoryNo: 317,
    uniqueCode: "FM10",
    name: "Termometer Qelqi",
    description: "Temperatura 0 – 100 oC",
    location: "01/A",
    quantity: 1,
    seedIndex: 619
  },
  {
    name: "USB",
    quantity: 1,
    seedIndex: 620
  },
  {
    uniqueCode: "FM38/2",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 621
  },
  {
    uniqueCode: "FM38/3",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 622
  },
  {
    uniqueCode: "FM38/4",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 623
  },
  {
    uniqueCode: "FM38/5",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 624
  },
  {
    uniqueCode: "FM38/6",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 625
  },
  {
    uniqueCode: "FM38/7",
    name: "Lapsi për ekranin",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 626
  },
  {
    inventoryNo: 330,
    uniqueCode: "PM-9",
    name: "Presë për përcaktimin e rezistencës në shtypje",
    description: "2000 kN",
    manufacturer: "MATEST",
    model: "YIMC109NC",
    serialNumber: "AH10047",
    location: "01/A",
    quantity: 1,
    seedIndex: 627
  },
  {
    uniqueCode: "PM-9/1",
    name: "Aksesori për presën",
    manufacturer: "CONTROLS",
    model: "50-C90/B",
    serialNumber: "14003518",
    notes: "Përdoren për provën Braziliane",
    quantity: 1,
    seedIndex: 628
  },
  {
    uniqueCode: "PM-9/2",
    name: "Ristela druri",
    manufacturer: "CONTROLS",
    model: "19209",
    notes: "Përdoren për provën Braziliane",
    quantity: 1,
    seedIndex: 629
  },
  {
    inventoryNo: 331,
    uniqueCode: "PT1",
    name: "Presë për përcaktimin e rezistencës në shtypje",
    description: "2000 kN",
    manufacturer: "CONTROLS",
    model: "50-C23C02",
    serialNumber: "16004959",
    location: "01/A",
    quantity: 1,
    seedIndex: 630
  },
  {
    uniqueCode: "LB-3/1",
    name: "Aksesorë",
    manufacturer: "CONTROLS",
    model: "CRETOVSIR",
    location: "01/A",
    quantity: 1,
    seedIndex: 631
  },
  {
    inventoryNo: 334,
    uniqueCode: "FM16",
    name: "Presë për përcaktimin e rezistencës në shtypje",
    description: "2000 kN",
    manufacturer: "CONTROLS",
    model: "C46G2",
    serialNumber: "2031447",
    location: "01/A",
    quantity: 1,
    seedIndex: 632
  },
  {
    uniqueCode: "FM16/1",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    notes: "4 pllaka të përdorshme + 8 pllaka rezervë + 1 pllakë nuk bën",
    quantity: 1,
    seedIndex: 633
  },
  {
    uniqueCode: "FM16/2",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 634
  },
  {
    uniqueCode: "FM16/3",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 635
  },
  {
    uniqueCode: "FM16/4",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 636
  },
  {
    uniqueCode: "FM16/5",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 637
  },
  {
    uniqueCode: "FM16/6",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 638
  },
  {
    uniqueCode: "FM16/7",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 639
  },
  {
    uniqueCode: "FM16/8",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 640
  },
  {
    uniqueCode: "FM16/9",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 641
  },
  {
    uniqueCode: "FM16/10",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 642
  },
  {
    uniqueCode: "FM16/11",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 643
  },
  {
    uniqueCode: "FM16/12",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 644
  },
  {
    uniqueCode: "FM16/13",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 645
  },
  {
    uniqueCode: "FM16/14",
    name: "Pllaka",
    description: "Material çeliku në formë rrethore",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 646
  },
  {
    uniqueCode: "FM17",
    name: "Aparati Digimax",
    manufacturer: "CONTROLS",
    model: "Q0802",
    serialNumber: "2031447",
    quantity: 1,
    seedIndex: 647
  },
  {
    uniqueCode: "FM18",
    name: "Printeri",
    manufacturer: "CONTROLS",
    model: "82-P0172",
    serialNumber: "10601728",
    quantity: 1,
    seedIndex: 648
  },
  {
    name: "Kapëse që mban pllakën e aksesorit",
    manufacturer: "CONTROLS",
    quantity: 1,
    seedIndex: 649
  },
  {
    uniqueCode: "FM39/1",
    name: "Aksesorë për përkuljen dhe shtypjen e prizmave të çimentos / llaçeve",
    manufacturer: "CONTROLS",
    model: "G-4/14",
    location: "01/A",
    notes: "2 sete",
    quantity: 4,
    seedIndex: 650
  },
  {
    uniqueCode: "FM39/5",
    name: "Aksesorë për shtypjen e polisterolit apo materialeve të tjera",
    manufacturer: "CONTROLS",
    location: "01/A",
    notes: "Aksesorë rrethore",
    quantity: 2,
    seedIndex: 651
  },
  {
    uniqueCode: "FM39/7",
    name: "Dorezë për rregullimin e nivelit",
    manufacturer: "CONTROLS",
    model: "34-T0103/1",
    location: "01/A",
    quantity: 1,
    seedIndex: 652
  },
  {
    uniqueCode: "FM39/8",
    name: "Bulon i gjatë me vidë",
    manufacturer: "CONTROLS",
    location: "01/A",
    notes: "2 vida",
    quantity: 1,
    seedIndex: 653
  },
  {
    uniqueCode: "FM39/9",
    name: "Bulon i shkurtër pa vidë",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 3,
    seedIndex: 654
  },
  {
    uniqueCode: "FM39/11",
    name: "Çelësa të madhësive të ndryshëm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 14,
    seedIndex: 655
  },
  {
    uniqueCode: "FM 39/12",
    name: "Mini pajisja ku montohen aksesorët",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 1,
    seedIndex: 656
  },
  {
    inventoryNo: 336,
    uniqueCode: "GJ2/6/2",
    name: "Tavë metalike",
    description: "7.5x2.5 mm",
    location: "01/A",
    quantity: 6,
    seedIndex: 657
  },
  {
    uniqueCode: "GJ2/6/3",
    name: "Tavë metalike",
    description: "7.5x1 mm",
    location: "01/A",
    quantity: 5,
    seedIndex: 658
  },
  {
    uniqueCode: "EL34/1-EL34/2",
    name: "Tavë metalike katrore",
    description: "Dimensione 590 x 590 mm",
    manufacturer: "CONTROLS",
    model: "83-D1310",
    serialNumber: "D014 0095790000000",
    location: "01/A",
    quantity: 2,
    seedIndex: 659
  },
  {
    uniqueCode: "EL34/3-EL34/5",
    name: "Tavë metalike katrore",
    description: "Dimensione 615 x 605 mm",
    location: "01/A",
    quantity: 3,
    seedIndex: 660
  },
  {
    uniqueCode: "EL34/6-EL34/9",
    name: "Tavë metalike katrore",
    description: "Dimensione 285 x 285 mm",
    location: "01/A",
    quantity: 4,
    seedIndex: 661
  },
  {
    uniqueCode: "EL34/10-EL34/12",
    name: "Tavë metalike katrore",
    description: "Dimensione 380 x 380 mm",
    location: "01/A",
    quantity: 3,
    seedIndex: 662
  },
  {
    uniqueCode: "FM64/1",
    name: "Tavë Shotcrete",
    description: "Tavë metalike 85x85x8",
    location: "01/A",
    quantity: 1,
    seedIndex: 663
  },
  {
    uniqueCode: "FM64/2",
    name: "Tavë Shotcrete",
    description: "Tavë metalike 85x85x8",
    location: "01/A",
    quantity: 1,
    seedIndex: 664
  },
  {
    uniqueCode: "FM64/3",
    name: "Tavë Shotcrete",
    description: "Tavë metalike 71x77x10",
    location: "01/A",
    quantity: 1,
    seedIndex: 665
  },
  {
    uniqueCode: "FM64/4",
    name: "Tavë Shotcrete",
    description: "Tavë metalike 70x70x10",
    location: "01/A",
    quantity: 1,
    seedIndex: 666
  },
  {
    uniqueCode: "FM64/5",
    name: "Tavë Shotcrete",
    description: "Tavë metalike 70x70x10",
    location: "01/A",
    quantity: 1,
    seedIndex: 667
  },
  {
    uniqueCode: "FM64/6",
    name: "Tavë Shotcrete",
    description: "Tavë metalike 70x70x10",
    location: "01/A",
    quantity: 1,
    seedIndex: 668
  },
  {
    uniqueCode: "FM64/8",
    name: "Tavë Shotcrete",
    description: "Tavë metalike 70x70x10",
    location: "01/A",
    quantity: 1,
    seedIndex: 669
  },
  {
    uniqueCode: "FM64/7",
    name: "Tavë Shotcrete",
    description: "Tavë metalike 51.5x36.6x24.5",
    location: "01/A",
    quantity: 1,
    seedIndex: 670
  },
  {
    name: "Tavë Shotcrete",
    description: "Tavë metalike 52.5*52.5",
    location: "01/A",
    quantity: 1,
    seedIndex: 671
  },
  {
    inventoryNo: 337,
    name: "Forma kubike betoni plastike",
    description: "Dimensione 150 x 150 x 150 mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    quantity: 50,
    seedIndex: 672
  },
  {
    inventoryNo: 338,
    uniqueCode: "FM 21/10",
    name: "Forma kubike betoni prej metali",
    description: "Dimensione 150 x 150 x 150 mm",
    manufacturer: "CONTROLS",
    location: "01/A",
    seedIndex: 673
  },
  {
    inventoryNo: 339,
    uniqueCode: "FM 21/1",
    name: "Forma cilindrike betoni prej metali",
    description: "Dimensione 150 x 300 mm",
    manufacturer: "CONTROLS",
    model: "55-C0100",
    location: "01/A",
    quantity: 1,
    seedIndex: 674
  },
  {
    inventoryNo: 340,
    uniqueCode: "FM 22/1",
    name: "Forma cilindrike betoni prej plastike",
    description: "Dimensione 150 x 300 mm",
    manufacturer: "CONTROLS",
    model: "55-C0100/PC15A",
    location: "01/A",
    quantity: 2,
    seedIndex: 675
  },
  {
    inventoryNo: 341,
    uniqueCode: "FM 61",
    name: "Pompë vakuumi",
    manufacturer: "CONTROLS",
    serialNumber: "19723",
    location: "01/A",
    quantity: 1,
    seedIndex: 676
  },
  {
    inventoryNo: 342,
    uniqueCode: "FM 170",
    name: "Enë vakuumi",
    manufacturer: "CONTROLS",
    model: "75-D1122",
    serialNumber: "2105916",
    location: "01/A",
    quantity: 1,
    seedIndex: 677
  },
  {
    inventoryNo: 343,
    uniqueCode: "FM 188",
    name: "Kompresor ajri",
    model: "AP-24",
    serialNumber: "210100224",
    location: "05/A",
    quantity: 1,
    seedIndex: 678
  },
  {
    inventoryNo: 344,
    uniqueCode: "FM 11",
    name: "Kompresor ajri",
    manufacturer: "INGCO",
    model: "2HP/242",
    location: "01/A",
    quantity: 1,
    seedIndex: 679
  },
  {
    inventoryNo: 345,
    uniqueCode: "FM 11/3",
    name: "Kompresor ajri",
    manufacturer: "STURM",
    serialNumber: "14040101",
    location: "01/A",
    quantity: 1,
    seedIndex: 680
  },
  {
    uniqueCode: "FM 11/1",
    name: "Barometer",
    description: "0 - 15 bar",
    location: "01/A",
    notes: "Aksesor",
    quantity: 2,
    seedIndex: 681
  },
  {
    name: "Zorrë kompresori",
    location: "01/A",
    notes: "Aksesor",
    quantity: 1,
    seedIndex: 682
  },
  {
    inventoryNo: 347,
    uniqueCode: "LB 24/1",
    name: "Vizore metalike",
    description: "Intervali i matjes 0-150 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 683
  },
  {
    inventoryNo: 349,
    uniqueCode: "SR02",
    name: "Vizore metalike",
    description: "intervali i matjes 0 ÷ 300 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 684
  },
  {
    inventoryNo: 350,
    uniqueCode: "SR03",
    name: "Vizore metalike",
    description: "intervali i matjes 0 ÷ 300 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 685
  },
  {
    inventoryNo: 351,
    uniqueCode: "SR04",
    name: "Vizore metalike",
    description: "intervali i matjes 0 ÷ 300 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 686
  },
  {
    inventoryNo: 352,
    uniqueCode: "SR05",
    name: "Vizore metalike",
    description: "intervali i matjes 0 ÷ 300 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 687
  },
  {
    inventoryNo: 355,
    uniqueCode: "LB 22",
    name: "Kaliber",
    description: "Intervali i matjes 0-500 mm",
    manufacturer: "VERNIER",
    serialNumber: "40315",
    location: "01/A",
    quantity: 1,
    seedIndex: 688
  },
  {
    inventoryNo: 356,
    uniqueCode: "T1",
    name: "Thermo-hygro-barometer",
    description: "10 mbar-1100 mbar",
    manufacturer: "PCE Instruments",
    model: "PCE-THB 40",
    serialNumber: "90102",
    notes: "Blere në Janar 2024",
    quantity: 1,
    seedIndex: 689
  },
  {
    uniqueCode: "FM62",
    name: "Sharrë polisteroli",
    model: "TUVGS",
    serialNumber: "15004382",
    location: "01/A",
    notes: "ka edhe sharrën aksesor",
    quantity: 1,
    seedIndex: 690
  },
  {
    uniqueCode: "FM75",
    name: "Kontrollues lagështie",
    manufacturer: "TERRATEST 5000",
    location: "01/A",
    quantity: 1,
    seedIndex: 691
  },
  {
    uniqueCode: "FM76",
    name: "Karroca për pjaster dinamike",
    location: "01/A",
    quantity: 1,
    seedIndex: 692
  },
  {
    uniqueCode: "FM77",
    name: "Fshesë korenti",
    location: "01/A",
    quantity: 1,
    seedIndex: 693
  },
  {
    uniqueCode: "FM79/1",
    name: "Aksesorë për testim tulle",
    location: "01/A",
    quantity: 4,
    seedIndex: 694
  },
  {
    name: "Kompresor",
    manufacturer: "STURN",
    serialNumber: "14040101",
    location: "01/A",
    seedIndex: 695
  },
  {
    uniqueCode: "FM81",
    name: "Transpalet",
    description: "Kapaciteti 2000 kg",
    manufacturer: "BILANCAI",
    serialNumber: "T15E",
    location: "01/A",
    quantity: 1,
    seedIndex: 696
  },
  {
    uniqueCode: "FM82",
    name: "Zgjatues",
    manufacturer: "REEL",
    model: "KF-BG-10",
    location: "01/A",
    quantity: 1,
    seedIndex: 697
  },
  {
    name: "Përzierës materialesh / Trapano",
    manufacturer: "SKILL",
    location: "01/A",
    quantity: 1,
    seedIndex: 698
  },
  {
    name: "Koka përzierësit",
    manufacturer: "SKILL",
    location: "01/A",
    quantity: 5,
    seedIndex: 699
  },
  {
    uniqueCode: "FM163",
    name: "Gjeneratori",
    manufacturer: "LONCIN",
    model: "EK2MCT",
    serialNumber: "84213125DA2",
    location: "01/A",
    quantity: 1,
    seedIndex: 700
  },
  {
    name: "Pincë universale",
    description: "Profi 8”200 mm",
    manufacturer: "BAU VORA",
    model: "HCP28208",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 701
  },
  {
    name: "Meter i verdhë",
    description: "5m x 25mm",
    manufacturer: "BAU VORA",
    model: "HSMT0835-1",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 702
  },
  {
    name: "Kaçavida mekanike",
    description: "PZ1x100 mm",
    manufacturer: "BAU VORA",
    model: "HS28PZ1100",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 703
  },
  {
    name: "Kaçavida mekanike e drejtë",
    description: "4 x 100 mm",
    manufacturer: "BAU VORA",
    model: "HS284100",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 704
  },
  {
    name: "Furçë boje vaji",
    description: "me bisht druri 2.5 15.5 x 51 mm",
    manufacturer: "BAU VORA",
    model: "CHPTB0125",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 705
  },
  {
    name: "Furçë boje vaji",
    description: "me bisht druri 3 16 x 57 mm",
    manufacturer: "BAU VORA",
    model: "CHPTB0103",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 706
  },
  {
    name: "Çekiç gome industrial",
    description: "me bisht gome 450 g",
    manufacturer: "BAU VORA",
    model: "HRUH8216",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 707
  },
  {
    name: "Verë me bisht fibre",
    description: "2000 g",
    manufacturer: "BAU VORA",
    model: "HSTH8804",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 708
  },
  {
    name: "Mistri",
    description: "7”/180 mm",
    manufacturer: "BAU VORA",
    model: "HBT738",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 709
  },
  {
    name: "Komplet hekzagon i gjatë",
    description: "9 copë / 1.5 10 mm",
    manufacturer: "BAU VORA",
    model: "HHK11091",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 710
  },
  {
    name: "Shpatull patinimi",
    description: "125 mm",
    manufacturer: "BAU VORA",
    model: "HPUT08125",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 711
  },
  {
    name: "Shpatull doreze",
    description: "2 komponente 80 mm",
    manufacturer: "BAU VORA",
    model: "HPUT08080",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 712
  },
  {
    name: "Shpatull doreze",
    description: "2 komponente 60 mm",
    manufacturer: "BAU VORA",
    model: "HPUT08060",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 713
  },
  {
    name: "Mallo inoksi",
    description: "280x130 mm",
    manufacturer: "BAU VORA",
    model: "HPT28138S",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 714
  },
  {
    name: "Daltë betoni me gominë me majë",
    description: "300 mm",
    manufacturer: "BAU VORA",
    model: "HCCL082412",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 715
  },
  {
    name: "Daltë betoni me gominë me majë",
    description: "350 mm",
    manufacturer: "BAU VORA",
    model: "HCC0841016",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 716
  },
  {
    name: "Doreza pune e gomuar e verdhë",
    description: "masa XL",
    manufacturer: "BAU VORA",
    model: "HGVL03",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 2,
    seedIndex: 717
  },
  {
    name: "Furçe teli me dorezë plastike",
    description: "250 mm",
    manufacturer: "BAU VORA",
    model: "HWB02250",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 718
  },
  {
    name: "Doreza lëkurë saldimi",
    description: "16”",
    manufacturer: "BAU VORA",
    model: "HGVW02",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 719
  },
  {
    name: "Rubinet me sferë",
    description: "1/4M-1/4 F",
    manufacturer: "BAU VORA",
    model: "1268/2",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 720
  },
  {
    name: "Rakorderi me fileto",
    description: "1/4M për tub 8 mm",
    manufacturer: "BAU VORA",
    model: "1233/4",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    quantity: 1,
    seedIndex: 721
  },
  {
    name: "Tub Ajri REFITTEX Acetilene",
    description: "8 x15 mm 50 m",
    manufacturer: "BAU VORA",
    model: "92800.25950.07",
    location: "01/A",
    notes: "Data e blerjes 10.05.2021",
    seedIndex: 722
  },
  {
    name: "Bashkuese",
    description: "BI-I",
    manufacturer: "HILTI",
    model: "236120",
    location: "01/A",
    notes: "Data e blerjes 24.06.2021",
    quantity: 2,
    seedIndex: 723
  },
  {
    name: "Upa me goditje",
    description: "HKD M12x50 bucket",
    manufacturer: "HILTI",
    model: "378553",
    location: "01/A",
    notes: "Data e blerjes 24.06.2021",
    quantity: 250,
    seedIndex: 724
  },
  {
    name: "Vegël prerëse diamanti",
    description: "DD160 230 V",
    manufacturer: "HILTI",
    model: "2005205",
    location: "01/A",
    notes: "Data e blerjes 24.06.2021",
    quantity: 1,
    seedIndex: 725
  },
  {
    name: "Setting tool",
    description: "HSD-G M12 1/2x50",
    manufacturer: "HILTI",
    model: "243743",
    location: "01/A",
    notes: "Data e blerjes 24.06.2021",
    quantity: 1,
    seedIndex: 726
  },
  {
    name: "Gotë diamanti",
    description: "B 102/450 SP-H abras.",
    manufacturer: "HILTI",
    model: "2158237",
    location: "01/A",
    notes: "Data e blerjes 24.06.2021",
    quantity: 1,
    seedIndex: 727
  },
  {
    name: "Kambalec Vegle",
    description: "DD-ST 160 SFL",
    manufacturer: "HILTI",
    model: "2203157",
    location: "01/A",
    notes: "Data e blerjes 24.06.2021",
    quantity: 1,
    seedIndex: 728
  },
  {
    name: "Gomina plastike",
    location: "01/A",
    quantity: 1,
    seedIndex: 729
  },
  {
    name: "Furnelë",
    location: "01/A",
    notes: "Sirtari tek distilatori",
    quantity: 1,
    seedIndex: 730
  },
  {
    name: "Acid Acetik 99%",
    location: "01/A",
    notes: "shishe",
    quantity: 1,
    seedIndex: 731
  },
  {
    name: "Acid Formik",
    location: "01/A",
    notes: "shishe",
    quantity: 1,
    seedIndex: 732
  },
  {
    name: "Beker qelqi",
    description: "400 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 733
  },
  {
    uniqueCode: "FMK/1",
    name: "Ene Konike",
    description: "1000 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 734
  },
  {
    uniqueCode: "FMK/7",
    name: "Enë Konike",
    description: "100 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 735
  },
  {
    uniqueCode: "FMK/10",
    name: "Beker plastik",
    description: "1000 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 736
  },
  {
    uniqueCode: "FMK/11",
    name: "Beker plastik",
    description: "500 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 737
  },
  {
    uniqueCode: "FMK/11/1",
    name: "Beker plastik",
    description: "250 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 738
  },
  {
    uniqueCode: "FMK/12",
    name: "Enë plastike me dorezë",
    description: "5 liter",
    location: "01/A",
    quantity: 1,
    seedIndex: 739
  },
  {
    uniqueCode: "FMK12/1",
    name: "Enë plastike me dorezë",
    description: "500 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 740
  },
  {
    uniqueCode: "FMK/13",
    name: "Wash bottle",
    description: "500 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 741
  },
  {
    name: "Wash bottle",
    description: "1000 ml",
    manufacturer: "CONTROLS",
    model: "86-D1538",
    location: "01/A",
    quantity: 1,
    seedIndex: 742
  },
  {
    name: "Wash bottle",
    description: "250 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 743
  },
  {
    name: "Wash bottle me fenoftaleinë",
    description: "250 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 744
  },
  {
    uniqueCode: "FMK/14",
    name: "Hinkë e vogël",
    location: "01/A",
    quantity: 1,
    seedIndex: 745
  },
  {
    uniqueCode: "FMK14/1",
    name: "Hinkë e vogël",
    location: "01/A",
    quantity: 1,
    seedIndex: 746
  },
  {
    name: "Hinkë e vogël",
    manufacturer: "54/12",
    location: "01/A",
    quantity: 1,
    seedIndex: 747
  },
  {
    uniqueCode: "FMK14/2",
    name: "Hinkë e mesme",
    model: "54/20BM",
    location: "01/A",
    quantity: 1,
    seedIndex: 748
  },
  {
    uniqueCode: "FMK14/4",
    name: "Hinkë e madhe",
    model: "54/30BM",
    location: "01/A",
    quantity: 1,
    seedIndex: 749
  },
  {
    uniqueCode: "FMK/15",
    name: "Cilinder plastik",
    description: "1000 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 750
  },
  {
    uniqueCode: "FMK/15/1",
    name: "Cilinder plastik",
    description: "500 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 751
  },
  {
    uniqueCode: "FMK/15/4",
    name: "Cilinder plastik",
    description: "250 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 752
  },
  {
    name: "MgSO4 (lënget)",
    location: "01/A",
    notes: "Bidon plastik",
    quantity: 1,
    seedIndex: 753
  },
  {
    name: "MgSO4 (pluhur)",
    location: "01/A",
    notes: "Qese",
    quantity: 1,
    seedIndex: 754
  },
  {
    uniqueCode: "FMK/16",
    name: "Furça teli për pastrim të enëve kimike",
    location: "01/A",
    quantity: 1,
    seedIndex: 755
  },
  {
    name: "Kapak tasi metalik",
    location: "01/A",
    quantity: 13,
    seedIndex: 756
  },
  {
    name: "Tasa handmade nga kapakët",
    location: "01/A",
    quantity: 4,
    seedIndex: 757
  },
  {
    name: "Tasa metalik",
    location: "01/A",
    quantity: 13,
    seedIndex: 758
  },
  {
    name: "Tepsi",
    description: "diametra të ndryshëm",
    location: "01/A",
    quantity: 14,
    seedIndex: 759
  },
  {
    name: "Lopata plastike e madhe",
    location: "01/A",
    quantity: 1,
    seedIndex: 760
  },
  {
    name: "Lopata plastike e vogël",
    location: "01/A",
    quantity: 5,
    seedIndex: 761
  },
  {
    name: "Lopata metalike e vogël",
    location: "01/A",
    quantity: 1,
    seedIndex: 762
  },
  {
    name: "Lopata metalike e madhe",
    location: "01/A",
    quantity: 1,
    seedIndex: 763
  },
  {
    name: "Tava katrore metalike",
    location: "01/A",
    notes: "me asfalt",
    quantity: 2,
    seedIndex: 764
  },
  {
    name: "Tave rrethore metalike",
    location: "01/A",
    notes: "me asfalt",
    quantity: 5,
    seedIndex: 765
  },
  {
    name: "Tasa",
    location: "01/A",
    notes: "me asfalt",
    quantity: 2,
    seedIndex: 766
  },
  {
    name: "Lopatë metalike me dalje",
    location: "01/A",
    quantity: 1,
    seedIndex: 767
  },
  {
    name: "Hinkë e madhe plastike",
    location: "01/A",
    quantity: 2,
    seedIndex: 768
  },
  {
    name: "Formë cilindrike për karrote asfalti",
    description: "10.5 x 7 cm",
    location: "01/A",
    quantity: 4,
    seedIndex: 769
  },
  {
    name: "Furçë plastike për pastrim me dorezë",
    location: "01/A",
    quantity: 1,
    seedIndex: 770
  },
  {
    name: "Kufje për zhurmat",
    location: "01/A",
    quantity: 1,
    seedIndex: 771
  },
  {
    name: "Furçë plastike për pastrim",
    location: "01/A",
    quantity: 1,
    seedIndex: 772
  },
  {
    name: "Spatul",
    location: "01/A",
    quantity: 1,
    seedIndex: 773
  },
  {
    name: "Vizore Kendore",
    description: "20 cm",
    manufacturer: "ACIER TREMPE",
    location: "01/A",
    quantity: 1,
    seedIndex: 774
  },
  {
    name: "Gotë kimike plastike",
    description: "1000 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 775
  },
  {
    name: "Gotë në formë hinke",
    description: "500 ml",
    location: "01/A",
    quantity: 1,
    seedIndex: 776
  },
  {
    name: "Furçë e butë për sitat",
    location: "01/A",
    quantity: 1,
    seedIndex: 777
  },
  {
    name: "Furçë teli për sitat",
    location: "01/A",
    quantity: 1,
    seedIndex: 778
  },
  {
    name: "Nivel tek dhoma e hekurit",
    location: "01/A",
    quantity: 1,
    seedIndex: 779
  },
  {
    name: "Vizore Kendore",
    description: "50 cm me nivel",
    manufacturer: "EPICA STAR",
    model: "MT112050",
    location: "01/A",
    quantity: 1,
    seedIndex: 780
  },
  {
    name: "Matës Temperature + Lagështi",
    model: "HTC-1",
    location: "01/A",
    quantity: 1,
    seedIndex: 781
  },
  {
    name: "Etalon",
    description: "300 gr",
    location: "01/A",
    quantity: 1,
    seedIndex: 782
  },
  {
    name: "Etalon",
    description: "2 kg",
    location: "01/A",
    quantity: 1,
    seedIndex: 783
  },
  {
    name: "Karrocë për kubet",
    location: "01/A",
    quantity: 1,
    seedIndex: 784
  },
  {
    name: "Karrocë",
    location: "01/A",
    quantity: 1,
    seedIndex: 785
  },
  {
    name: "Çekiç Gome",
    location: "01/A",
    quantity: 4,
    seedIndex: 786
  },
  {
    name: "Karikues baterie",
    manufacturer: "CELL ON",
    model: "96087",
    location: "01/A",
    notes: "Tek sirtaret të fiziko-mekaniku",
    quantity: 1,
    seedIndex: 787
  },
  {
    name: "Manometer",
    description: "25 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 788
  },
  {
    name: "Përzierës me dorë",
    location: "01/A",
    quantity: 1,
    seedIndex: 789
  },
  {
    name: "Mall me dhëmbëza",
    description: "48 cm",
    location: "01/A",
    quantity: 1,
    seedIndex: 790
  },
  {
    name: "Mall me dhëmbëza",
    description: "28 x 13 cm",
    location: "01/A",
    quantity: 7,
    seedIndex: 791
  },
  {
    name: "Mall pa dhëmbëza",
    description: "30 x 13 cm",
    location: "01/A",
    quantity: 2,
    seedIndex: 792
  },
  {
    name: "Shpatulla",
    location: "01/A",
    quantity: 4,
    seedIndex: 793
  },
  {
    name: "Mistri",
    location: "01/A",
    quantity: 3,
    seedIndex: 794
  },
  {
    name: "Sharrë druri",
    location: "01/A",
    quantity: 2,
    seedIndex: 795
  },
  {
    name: "Sharrë hekuri",
    location: "01/A",
    quantity: 1,
    seedIndex: 796
  },
  {
    name: "Pompë sprucimi lubrifikant",
    location: "01/A",
    quantity: 1,
    seedIndex: 797
  },
  {
    name: "Fenelinë për makina",
    location: "01/A",
    quantity: 1,
    seedIndex: 798
  },
  {
    name: "Zorrë kompresori",
    location: "01/A",
    quantity: 2,
    seedIndex: 799
  },
  {
    name: "Pistoletë kompresori",
    location: "01/A",
    quantity: 1,
    seedIndex: 800
  },
  {
    name: "Shkrirëse / tharëse",
    description: "650 oC",
    location: "01/A",
    quantity: 2,
    seedIndex: 801
  },
  {
    name: "Çelsa të madhësive të ndryshme",
    description: "41 mm",
    location: "01/A",
    quantity: 2,
    seedIndex: 802
  },
  {
    name: "Çelsa të madhësive të ndryshme",
    description: "32 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 803
  },
  {
    name: "Çelsa të madhësive të ndryshme",
    description: "30 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 804
  },
  {
    name: "Çelsa të madhësive të ndryshme",
    description: "27 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 805
  },
  {
    name: "Çelsa të madhësive të ndryshme",
    description: "24 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 806
  },
  {
    name: "Çelsa të madhësive të ndryshme",
    description: "19 mm",
    location: "01/A",
    quantity: 1,
    seedIndex: 807
  },
  {
    name: "Daltë betoni me gominë",
    location: "01/A",
    quantity: 1,
    seedIndex: 808
  },
  {
    name: "Daltë betoni pa gominë",
    location: "01/A",
    quantity: 1,
    seedIndex: 809
  },
  {
    name: "Pinca",
    location: "01/A",
    quantity: 3,
    seedIndex: 810
  },
  {
    name: "Thika",
    location: "01/A",
    quantity: 2,
    seedIndex: 811
  },
  {
    name: "Çekiç hekuri",
    location: "01/A",
    quantity: 3,
    seedIndex: 812
  },
  {
    name: "Disk Fresibel betoni",
    location: "01/A",
    quantity: 1,
    seedIndex: 813
  },
  {
    name: "Nivelues për inertet, me dy doreza",
    location: "01/A",
    quantity: 1,
    seedIndex: 814
  },
  {
    name: "Kuti me çelsa set",
    description: "10 mm - 32 mm",
    location: "01/A",
    notes: "18 çelsa + 2 koka",
    quantity: 1,
    seedIndex: 815
  },
  {
    name: "Syze plastike",
    location: "01/A",
    quantity: 1,
    seedIndex: 816
  },
  {
    name: "Pllaka për shtypjen e karrotave",
    description: "d=100 mm",
    location: "01/A",
    quantity: 3,
    seedIndex: 817
  },
  {
    name: "Pllaka për shtypjen e karrotave",
    description: "d=70 mm",
    location: "01/A",
    quantity: 2,
    seedIndex: 818
  },
  {
    name: "Pistoletë silikoni plastike",
    location: "01/A",
    quantity: 1,
    seedIndex: 819
  },
  {
    name: "Darë",
    location: "01/A",
    quantity: 2,
    seedIndex: 820
  },
  {
    name: "Pincetë",
    location: "01/A",
    quantity: 1,
    seedIndex: 821
  },
  {
    name: "Lime",
    location: "01/A",
    quantity: 3,
    seedIndex: 822
  },
  {
    name: "Fresibel",
    manufacturer: "METABO",
    location: "01/A",
    quantity: 1,
    seedIndex: 823
  },
  {
    name: "Trapano",
    manufacturer: "HIKOKI",
    location: "01/A",
    quantity: 1,
    seedIndex: 824
  },
  {
    name: "Punto",
    location: "01/A",
    quantity: 9,
    seedIndex: 825
  },
  {
    name: "Matrapik",
    manufacturer: "BLOCK&DECKER",
    location: "01/A",
    quantity: 1,
    seedIndex: 826
  },
  {
    name: "Korona",
    description: "Ø 64 mm",
    manufacturer: "SHALL",
    location: "01/A",
    quantity: 1,
    seedIndex: 827
  },
  {
    name: "Lugë metalike",
    location: "01/A",
    quantity: 1,
    seedIndex: 828
  },
  {
    name: "Furça për pastrim",
    location: "01/A",
    seedIndex: 829
  },
  {
    name: "Lugë metalike",
    description: "për beton (dimensione Gjatësi 29 cm x Gjerësi 17 cm x Thellësi 10 cm",
    location: "01/A",
    seedIndex: 830
  },
  {
    name: "Enë metalike për asfalt",
    location: "01/A",
    seedIndex: 831
  },
  {
    name: "Kovë metalike",
    location: "01/A",
    seedIndex: 832
  },
  {
    name: "Kroxhola porcelani",
    location: "01/B",
    seedIndex: 833
  },
  {
    uniqueCode: "Miratoi:",
    name: "Përditësoi:",
    description: "Menaxheri i Cilësisë",
    storage: "Zv.Përgjegjësi i Laboratorit",
    seedIndex: 834
  },
  {
    uniqueCode: "Emër / Mbiemër:",
    name: "Emër / Mbiemër:",
    description: "Adelajda Duzha",
    storage: "Klevis Sheteli",
    seedIndex: 835
  },
  {
    uniqueCode: "Date:",
    name: "Date:",
    description: "29.10.2024",
    storage: "29.10.2024",
    seedIndex: 836
  },
  {
    uniqueCode: "Nënshkrimi:",
    name: "Nënshkrimi:",
    seedIndex: 837
  }
];

/**
 * Columns the inventory adds to an instrument the calibration programme already
 * describes — chiefly where it is kept, which the programme does not record.
 */
const INVENTORY_DETAIL = new Map<string, Partial<Equipment>>([
  ["FM32/3", { location: "01/A", quantity: 1, inventoryNo: 147 }],
  ["FM15", { description: "Intervali i matjes 0 - 200 mm", location: "01/A", quantity: 1, inventoryNo: 164 }],
  ["FM166/2", { description: "Instrument jo-automatik peshimi NAWI (Klasa II); Max.=8100 g, d=0.1 g", location: "02/A", notes: "Peshorja që përdoret për shufrat e çelikut", quantity: 1, inventoryNo: 194 }],
  ["FM185", { description: "Instrument jo-automatik peshimi NAWI (Klasa II); Max.=30 kg, d=0.1g", location: "01/A", notes: "Blerë në Janar 2021, Peshorja që përdoret për agregatet", quantity: 1, inventoryNo: 195 }],
  ["FM178", { description: "Kapaciteti max 50 kN", location: "05/A", quantity: 1, inventoryNo: 212 }],
  ["GJ-6", { location: "02/B", quantity: 1, inventoryNo: 221 }],
  ["GJ-9", { location: "02/B", quantity: 1, inventoryNo: 222 }],
  ["GJ-3/6/3", { description: "0 - 30 mm, d= 0,01 mm", location: "01/A", quantity: 1 }],
  ["GJ-3/6", { description: "0 - 30 mm, d= 0,01 mm", location: "01/A", quantity: 1 }],
  ["GJ-3/6/1", { description: "0 - 30 mm, d= 0,01 mm", location: "01/A", quantity: 1 }],
  ["GJ-DC-1", { description: "0 - 30 mm, d= 0,01 mm", location: "01/A", quantity: 1 }],
  ["K6", { location: "01/B", quantity: 1, inventoryNo: 307 }],
  ["K17", { location: "01/B", quantity: 1, inventoryNo: 313 }],
  ["FM181", { description: "Temperatura -50oC – 300oC", location: "01/A", quantity: 1, inventoryNo: 318 }],
  ["FM38/1", { description: "2000 kN", location: "01/A", quantity: 1, inventoryNo: 329 }],
  ["PT2", { description: "2000 kN", location: "01/A", quantity: 1, inventoryNo: 332 }],
  ["LB-3", { description: "100 kN", location: "01/A", quantity: 1, inventoryNo: 333 }],
  ["FM39", { description: "50 kN", location: "01/A", quantity: 1, inventoryNo: 335 }],
  ["LB 24", { description: "Intervali i matjes 0-500 mm", location: "01/A", quantity: 1, inventoryNo: 346 }],
  ["SR01", { description: "intervali i matjes 0 ÷ 300 mm", location: "01/A", quantity: 1, inventoryNo: 348 }],
  ["LB 23", { description: "Intervali i matjes 0-150 mm", location: "01/A", quantity: 1, inventoryNo: 353 }],
  ["FM 14", { description: "Intervali i matjes 0-300 mm", location: "01/A", quantity: 1, inventoryNo: 354 }]
]);

/**
 * Ids are derived from the unique code rather than random, so re-seeding an
 * environment produces the same records and a code can be found by its id.
 * The one instrument on the form without a code — the AEP pressure gauge — is
 * keyed by its serial instead, so it still has a stable identity.
 */
const CREATED_AT = "2026-09-19T00:00:00.000Z";

const calibrated: Equipment[] = ROWS.map((row) => ({
  ...INVENTORY_DETAIL.get(row.uniqueCode ?? ""),
  ...row,
  uniqueCode: row.uniqueCode ?? "",
  id:
    "eq-" +
    (row.uniqueCode || row.serialNumber || row.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
  status: "Në përdorim" as const,
  createdAt: CREATED_AT
}));

const inventoryOnly: Equipment[] = INVENTORY.map(({ seedIndex, ...row }) => ({
  ...row,
  uniqueCode: row.uniqueCode ?? "",
  // Position, not code: neither the code nor the number is unique across the
  // whole sheet, and an id has to be.
  id: "inv-" + String(seedIndex).padStart(4, "0"),
  status: "Në përdorim" as const,
  createdAt: CREATED_AT
}));

export const equipmentSeed: Equipment[] = [...calibrated, ...inventoryOnly];
