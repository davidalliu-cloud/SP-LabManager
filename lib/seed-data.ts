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
  samples: [
    {
      id: "s-1",
      sampleCode: "2026-04-001",
      clientId: "c-1",
      projectId: "p-1",
      sampleType: "Kubike Betoni / Concrete Cubes",
      sampleDescription: "150 mm cubes from slab pour zone B",
      quantity: 6,
      dateReceived: "2026-04-03",
      timeReceived: "09:30",
      collectionMethod: "Delivered by client",
      deliveredBy: "Nadine Farah",
      requestedTestType: "Compressive Strength Test",
      standard: "BS EN 12390-3",
      requiredTestDate: "2026-04-30",
      reportDueDate: "2026-05-02",
      status: "In Progress",
      notes: "28-day test set.",
      createdBy: "u-ops",
      createdAt: now
    },
    {
      id: "s-2",
      sampleCode: "2026-03-001",
      clientId: "c-2",
      projectId: "p-2",
      sampleType: "Kubike Betoni / Concrete Cubes",
      sampleDescription: "Cubes from culvert base pour",
      quantity: 3,
      dateReceived: "2026-03-21",
      timeReceived: "14:20",
      collectionMethod: "Collected by lab technician",
      collectedBy: "Youssef Khalil",
      requestedTestType: "Compressive Strength Test",
      standard: "ASTM C39",
      requiredTestDate: "2026-04-19",
      reportDueDate: "2026-04-22",
      status: "Completed",
      createdBy: "u-ops",
      createdAt: now
    }
  ],
  tests: [
    {
      id: "t-1",
      testCode: "TEST-2026-0001",
      sampleId: "s-1",
      clientId: "c-1",
      projectId: "p-1",
      testType: "Compressive Strength Test",
      standard: "BS EN 12390-3",
      assignedTechnician: "u-tech",
      cubeCount: 6,
      scheduledAgeDays: 28,
      requiredTestDate: "2026-04-30",
      dueDate: "2026-05-02",
      status: "In Progress",
      priority: "High",
      notes: "Priority client.",
      createdAt: now
    },
    {
      id: "t-2",
      testCode: "TEST-2026-0002",
      sampleId: "s-2",
      clientId: "c-2",
      projectId: "p-2",
      testType: "Compressive Strength Test",
      standard: "ASTM C39",
      assignedTechnician: "u-tech",
      cubeCount: 3,
      scheduledAgeDays: 28,
      requiredTestDate: "2026-04-19",
      dueDate: "2026-04-22",
      status: "Completed",
      priority: "Normal",
      completedAt: "2026-04-19T15:00:00.000Z",
      completedBy: "u-tech",
      createdAt: now
    }
  ],
  concreteTests: [
    {
      id: "ct-2",
      testId: "t-2",
      testStartDate: "2026-04-19",
      testEndDate: "2026-04-19",
      temperature: "22 C",
      humidity: "55%",
      testingLocation: "Main compression lab",
      castingDate: "2026-03-22",
      testDate: "2026-04-19",
      ageDays: 28,
      cubeLength: 150,
      cubeWidth: 150,
      cubeHeight: 150,
      weight: 8.1,
      maximumLoadKn: 810,
      loadedAreaMm2: 22500,
      compressiveStrengthMpa: 36,
      failureType: "Satisfactory cone failure",
      machineUsed: "Compression Machine CM-02",
      technicianName: "Youssef Khalil",
      notes: "No visible defects before testing.",
      specimens: [
        {
          specimenCode: "2026-03-001/1",
          ageDays: 28,
          lengthMm: 150,
          widthMm: 150,
          heightMm: 150,
          weightKg: 8.1,
          maximumLoadKn: 810,
          loadedAreaMm2: 22500,
          compressiveStrengthMpa: 36,
          visualInspection: "Satisfactory cone failure",
          notes: "No visible defects before testing."
        },
        {
          specimenCode: "2026-03-001/2",
          ageDays: 28,
          lengthMm: 150,
          widthMm: 150,
          heightMm: 150,
          weightKg: 8.2,
          maximumLoadKn: 825,
          loadedAreaMm2: 22500,
          compressiveStrengthMpa: 36.67,
          visualInspection: "Satisfactory cone failure",
          notes: ""
        }
      ],
      createdAt: now
    }
  ],
  concreteWaterPenetrationTests: [],
  concreteFlexuralTests: [],
  concreteDensityTests: [],
  concreteIndirectTensileTests: [],
  thermalInsulationTests: [],
  cementConsistencyTests: [],
  cementStrengthTests: [],
  cementBlaineTests: [],
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
  notifications: [
    {
      id: "n-1",
      userId: "u-doc",
      title: "Report ready to prepare",
      message: "TEST-2026-0002 has been completed.",
      relatedTestId: "t-2",
      isRead: false,
      createdAt: now
    }
  ],
  auditLog: [
    {
      id: "a-1",
      userId: "u-ops",
      action: "sample_created",
      entityType: "sample",
      entityId: "s-1",
      description: "Sample 2026-04-001 created and test generated.",
      createdAt: now
    }
  ]
};
