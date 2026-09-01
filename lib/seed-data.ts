import type { LabState } from "./types";

const now = new Date().toISOString();
const aggregateProcedureSeeds = [
  ["proc-ag-granulometria", "rev-ag-granulometria-r1", "SL-SOP-AG-7.2-1.1", "Granulometria", "Granulometri sipas BS EN", "sl-sop-ag-7-2-1-1-granulometria.doc"],
  ["proc-ag-density-absorption", "rev-ag-density-absorption-r1", "SL-SOP-AG-7.2-1.2", "Densiteti specifik dhe absorbimi", "Përcaktimi i peshës specifike dhe absorbimit", "sl-sop-ag-7-2-1-2-dens-specifik-dhe-absorbim.doc"],
  ["proc-ag-shape-index", "rev-ag-shape-index-r1", "SL-SOP-AG-7.2-1.3", "Indeksi i formës", "Përcaktimi i indeksit të formës", "sl-sop-ag-7-2-1-3-indeksi-i-formes.doc"],
  ["proc-ag-flakiness-index", "rev-ag-flakiness-index-r1", "SL-SOP-AG-7.2-1.4", "Indeksi i ciflosjes", "Përcaktimi i indeksit të ciflosjes", "sl-sop-ag-7-2-1-4-indeksi-i-ciflosjes.doc"],
  ["proc-ag-elongation-index", "rev-ag-elongation-index-r1", "SL-SOP-AG-7.2-1.5", "Indeksi i zgjatimit", "Përcaktimi i indeksit të zgjatimit", "sl-sop-ag-7-2-1-5-indeksi-i-zgjatimit.doc"],
  ["proc-ag-bulk-density", "rev-ag-bulk-density-r1", "SL-SOP-AG-7.2-1.7", "Pesha volumore", "Përcaktimi i peshës volumore", "sl-sop-ag-7-2-1-7-pesha-volumore.doc"],
  ["proc-ag-sand-equivalent", "rev-ag-sand-equivalent-r1", "SL-SOP-AG-7.2-1.8", "Ekuivalenti i rërës", "Përcaktimi i ekuivalentit të rërës", "sl-sop-ag-7-2-1-8-ekuivalenti-i-reres.doc"],
  ["proc-ag-soundness", "rev-ag-soundness-r1", "SL-SOP-AG-7.2-1.9", "Soundness", "Përcaktimi i humbjes në peshë me sulfat magnezi", "sl-sop-ag-7-2-1-9-soundness.doc"],
  ["proc-ag-los-angeles", "rev-ag-los-angeles-r1", "SL-SOP-AG-7.2-1.13", "Los Angeles", "Përcaktimi i rezistencës në fragmentim", "sl-sop-ag-7-2-1-13-los-angeles.doc"],
  ["proc-ag-freeze-thaw", "rev-ag-freeze-thaw-r1", "SL-SOP-AG-7.2-1.14", "Cikli ngrirje-shkrirje", "Përcaktimi i rezistencës ndaj cikleve ngrirje-shkrirje", "sl-sop-ag-7-2-1-14-cikli-ngrirje-shkrirje.doc"],
  ["proc-ag-acv", "rev-ag-acv-r1", "SL-SOP-AG-F-7.2-1.15", "ACV", "Përcaktimi i rezistencës në thërmim", "sl-sop-ag-f-7-2-1-15-acv.doc"]
] as const;

export const initialState: LabState = {
  users: [
    { id: "u-admin", fullName: "Amina Rahman", email: "admin@sarplab.com", role: "Admin / Managing Director", position: "Managing Director", phone: "+961 1 555 001", workAreas: ["Management", "Approval"], isActive: true },
    { id: "u-chief", fullName: "Dr. Karim Haddad", email: "chief@sarplab.com", role: "Chief of Lab", position: "Chief of Lab", phone: "+961 1 555 002", workAreas: ["Technical review", "Approval"], isActive: true },
    { id: "u-quality", fullName: "Leila Mansour", email: "quality@sarplab.com", role: "Quality Manager", position: "Quality Manager", phone: "+961 1 555 003", workAreas: ["Quality control", "Audit"], isActive: true },
    { id: "u-ops", fullName: "Omar Nasser", email: "ops@sarplab.com", role: "Operations Manager", position: "Floor Manager", phone: "+961 1 555 004", workAreas: ["Sample registration", "Scheduling"], isActive: true },
    { id: "u-doc", fullName: "Maya Saleh", email: "docs@sarplab.com", role: "Document Controller", position: "Document Controller", phone: "+961 1 555 005", workAreas: ["Reports", "Issuing"], isActive: true },
    { id: "u-tech", fullName: "Youssef Khalil", email: "tech@sarplab.com", role: "Technician", position: "Concrete Technician", phone: "+961 1 555 006", workAreas: ["Sample retrieval", "Concrete testing"], isActive: true }
  ],
  clients: [
    {
      id: "c-1",
      clientCode: "CL-104",
      clientName: "Atlas Contractors",
      contactPerson: "Nadine Farah",
      email: "nadine@atlas.example",
      phone: "+961 1 555 010",
      address: "Beirut Central District"
    },
    {
      id: "c-2",
      clientCode: "CL-217",
      clientName: "Northline Developers",
      contactPerson: "Samir Daher",
      email: "samir@northline.example",
      phone: "+961 1 555 014",
      address: "Tripoli"
    }
  ],
  projects: [
    { id: "p-1", clientId: "c-1", projectName: "Riverside Tower", location: "Beirut", description: "High-rise concrete works" },
    { id: "p-2", clientId: "c-2", projectName: "Harbor Access Road", location: "Tripoli", description: "Road and drainage package" }
  ],
  samples: [],
  tests: [],
  concreteTests: [],
  concreteWaterPenetrationTests: [],
  concreteFlexuralTests: [],
  concreteDensityTests: [],
  concreteIndirectTensileTests: [],
  concreteCoreTests: [],
  asphaltTests: [],
  thermalInsulationTests: [],
  cementConsistencyTests: [],
  cementStrengthTests: [],
  cementBlaineTests: [],
  admixtureDryMaterialTests: [],
  mortarTests: [],
  steelTests: [],
  aggregateTests: [],
  aggregateChemicalTests: [],
  aggregateLosAngelesTests: [],
  aggregateFreezeThawTests: [],
  aggregateAcvTests: [],
  aggregateDensityAbsorptionTests: [],
  aggregateFillerDensityTests: [],
  aggregateShapeIndexTests: [],
  aggregateFlakinessIndexTests: [],
  aggregateElongationIndexTests: [],
  aggregateBulkDensityTests: [],
  aggregateSandEquivalentTests: [],
  aggregateSoundnessTests: [],
  reports: [],
  procedures: aggregateProcedureSeeds.map(([id, revisionId, code, title, testName]) => ({
    id,
    category: "Aggregate",
    code,
    title,
    testName,
    currentRevisionId: revisionId,
    ownerRole: "Chief of Lab",
    createdAt: now
  })),
  procedureRevisions: aggregateProcedureSeeds.map(([procedureId, id, code, title, , fileName]) => ({
    id,
    procedureId,
    revision: "1.0",
    status: "Current",
    fileName: `${code} ${title}.doc`,
    fileUrl: `/procedures/aggregate/${fileName}`,
    pdfUrl: `/procedures/aggregate/${fileName.replace(/\.doc$/, ".pdf")}`,
    effectiveDate: "2026-05-01",
    preparedBy: "u-quality",
    reviewedBy: "u-chief",
    approvedBy: "u-chief",
    approvedAt: now,
    changeSummary: "Current approved SOP imported into the controlled procedure directory.",
    createdAt: now
  })),
  notifications: [],
  auditLog: []
};
