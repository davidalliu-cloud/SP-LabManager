"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { isAggregateAcvAccreditedTest, isAggregateBulkDensityAccreditedTest, isAggregateChemicalAccreditedTest, isAggregateDensityAbsorptionAccreditedTest, isAggregateElongationIndexAccreditedTest, isAggregateFillerDensityAccreditedTest, isAggregateFlakinessIndexAccreditedTest, isAggregateFreezeThawAccreditedTest, isAggregateGranulometrySampleType, isAggregateLosAngelesAccreditedTest, isAggregateSandEquivalentAccreditedTest, isAggregateShapeIndexAccreditedTest, isAggregateSoundnessAccreditedTest, isCementBlaineAstmAccreditedTest, isCementBlaineBsEnAccreditedTest, isCementConsistencyAccreditedTest, isCementStrengthAccreditedTest, isConcreteDensityAccreditedTest, isConcreteFlexuralAccreditedTest, isConcreteIndirectTensileAccreditedTest, isConcreteWaterPenetrationAccreditedTest, isSteelSampleType, isThermalInsulationAccreditedTest } from "@/lib/accredited-tests";
import { useLabStore } from "@/lib/lab-store";
import { canViewClientIdentity } from "@/lib/permissions";
import type { LabUser } from "@/lib/types";

const aggregateSieveSizes = [125, 80, 63, 37.5, 31.5, 25, 20, 16, 12.5, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.063, 0];

export default function TestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const store = useLabStore();
  const test = store.tests.find((item) => item.id === params.id);
  if (!test) return <PageHeader title="Test not found" />;
  const activeTest = test;
  const sample = store.samples.find((item) => item.id === activeTest.sampleId);
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentity = canViewClientIdentity(currentUser?.role);
  const client = showClientIdentity ? store.clients.find((item) => item.id === activeTest.clientId) : undefined;
  const project = showClientIdentity ? store.projects.find((item) => item.id === activeTest.projectId) : undefined;
  const concrete = store.concreteTests.find((item) => item.testId === activeTest.id);
  const concreteWater = store.concreteWaterPenetrationTests.find((item) => item.testId === activeTest.id);
  const concreteFlexural = store.concreteFlexuralTests.find((item) => item.testId === activeTest.id);
  const concreteDensity = store.concreteDensityTests.find((item) => item.testId === activeTest.id);
  const concreteIndirectTensile = store.concreteIndirectTensileTests.find((item) => item.testId === activeTest.id);
  const thermalInsulation = store.thermalInsulationTests.find((item) => item.testId === activeTest.id);
  const cementConsistency = store.cementConsistencyTests.find((item) => item.testId === activeTest.id);
  const cementStrength = store.cementStrengthTests.find((item) => item.testId === activeTest.id);
  const cementBlaine = store.cementBlaineTests.find((item) => item.testId === activeTest.id);
  const steel = store.steelTests.find((item) => item.testId === activeTest.id);
  const aggregate = store.aggregateTests.find((item) => item.testId === activeTest.id);
  const aggregateChemical = store.aggregateChemicalTests.find((item) => item.testId === activeTest.id);
  const aggregateLosAngeles = store.aggregateLosAngelesTests.find((item) => item.testId === activeTest.id);
  const aggregateFreezeThaw = store.aggregateFreezeThawTests.find((item) => item.testId === activeTest.id);
  const aggregateAcv = store.aggregateAcvTests.find((item) => item.testId === activeTest.id);
  const aggregateDensity = store.aggregateDensityAbsorptionTests.find((item) => item.testId === activeTest.id);
  const aggregateFillerDensity = store.aggregateFillerDensityTests.find((item) => item.testId === activeTest.id);
  const aggregateShapeIndex = store.aggregateShapeIndexTests.find((item) => item.testId === activeTest.id);
  const aggregateFlakiness = store.aggregateFlakinessIndexTests.find((item) => item.testId === activeTest.id);
  const aggregateElongation = store.aggregateElongationIndexTests.find((item) => item.testId === activeTest.id);
  const aggregateBulkDensity = store.aggregateBulkDensityTests.find((item) => item.testId === activeTest.id);
  const aggregateSandEquivalent = store.aggregateSandEquivalentTests.find((item) => item.testId === activeTest.id);
  const aggregateSoundness = store.aggregateSoundnessTests.find((item) => item.testId === activeTest.id);
  const report = store.reports.find((item) => item.testId === activeTest.id);
  const activeEmployees = store.users.filter((user) => user.isActive !== false);
  const existingSpecimens =
    concrete?.specimens && concrete.specimens.length
      ? concrete.specimens
      : concrete
        ? [
            {
              specimenCode: `${sample?.sampleCode ?? "Sample"}/1`,
              ageDays: concrete.ageDays,
              lengthMm: concrete.cubeLength,
              widthMm: concrete.cubeWidth,
              heightMm: concrete.cubeHeight,
              weightKg: concrete.weight,
              maximumLoadKn: concrete.maximumLoadKn,
              loadedAreaMm2: concrete.loadedAreaMm2,
              compressiveStrengthMpa: concrete.compressiveStrengthMpa,
              visualInspection: concrete.failureType,
              notes: concrete.notes
            }
          ]
        : [];
  const [rowCount, setRowCount] = useState(Math.max(activeTest.cubeCount || 10, existingSpecimens.length));
  const [steelRowCount, setSteelRowCount] = useState(Math.max(sample?.quantity ?? 3, steel?.specimens.length ?? 0, 3));
  const [aggregateRowCount, setAggregateRowCount] = useState(Math.max(aggregate?.rows.length ?? aggregateSieveSizes.length, aggregateSieveSizes.length));
  const [losAngelesRowCount, setLosAngelesRowCount] = useState(Math.max(aggregateLosAngeles?.rows.length ?? 2, 2));
  const [freezeThawRowCount, setFreezeThawRowCount] = useState(Math.max(aggregateFreezeThaw?.specimens.length ?? 3, 3));
  const [shapeRowCount, setShapeRowCount] = useState(Math.max(aggregateShapeIndex?.rows.length ?? 4, 4));
  const [flakinessRowCount, setFlakinessRowCount] = useState(Math.max(aggregateFlakiness?.rows.length ?? 14, 14));
  const [elongationRowCount, setElongationRowCount] = useState(Math.max(aggregateElongation?.rows.length ?? 4, 4));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const specimens = Array.from({ length: rowCount }, (_, index) => ({
      specimenCode: String(form.get(`specimenCode-${index}`) ?? ""),
      ageDays: Number(form.get(`ageDays-${index}`) || 0),
      lengthMm: Number(form.get(`lengthMm-${index}`) || 0),
      widthMm: Number(form.get(`widthMm-${index}`) || 0),
      heightMm: Number(form.get(`heightMm-${index}`) || 0),
      weightKg: Number(form.get(`weightKg-${index}`) || 0),
      maximumLoadKn: Number(form.get(`maximumLoadKn-${index}`) || 0),
      visualInspection: String(form.get(`visualInspection-${index}`) ?? ""),
      notes: String(form.get(`specimenNotes-${index}`) ?? "")
    }));
    const first = specimens.find((row) => row.specimenCode || row.maximumLoadKn || row.weightKg) ?? specimens[0];
    store.saveConcreteTest(activeTest.id, {
      castingDate: String(form.get("castingDate")),
      testDate: String(form.get("testDate")),
      testStartDate: String(form.get("testStartDate")),
      testEndDate: String(form.get("testEndDate")),
      temperature: String(form.get("temperature")),
      humidity: String(form.get("humidity")),
      testingLocation: String(form.get("testingLocation")),
      cubeLength: first.lengthMm,
      cubeWidth: first.widthMm,
      cubeHeight: first.heightMm,
      weight: first.weightKg,
      maximumLoadKn: first.maximumLoadKn,
      failureType: first.visualInspection,
      machineUsed: String(form.get("machineUsed")),
      technicianName: String(form.get("technicianName")),
      notes: String(form.get("notes")),
      specimens
    });
  }

  function complete() {
    store.markTestCompleted(activeTest.id);
  }

  function submitSteel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveSteelTest(activeTest.id, {
      supplyDate: String(form.get("supplyDate") ?? ""),
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      equipmentUsed: String(form.get("equipmentUsed") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      specimens: Array.from({ length: steelRowCount }, (_, index) => ({
        specimenCode: String(form.get(`specimenCode-${index}`) ?? ""),
        nominalDiameterMm: Number(form.get(`nominalDiameterMm-${index}`) || 0),
        actualDiameterMm: Number(form.get(`actualDiameterMm-${index}`) || 0),
        weightG: Number(form.get(`weightG-${index}`) || 0),
        totalLengthMm: Number(form.get(`totalLengthMm-${index}`) || 0),
        initialGaugeLengthMm: Number(form.get(`initialGaugeLengthMm-${index}`) || 0),
        finalGaugeLengthMm: Number(form.get(`finalGaugeLengthMm-${index}`) || 0),
        yieldLoadKn: Number(form.get(`yieldLoadKn-${index}`) || 0),
        ultimateLoadKn: Number(form.get(`ultimateLoadKn-${index}`) || 0),
        postTestDiameterMm: Number(form.get(`postTestDiameterMm-${index}`) || 0),
        fractureType: String(form.get(`fractureType-${index}`) ?? ""),
        notes: String(form.get(`specimenNotes-${index}`) ?? "")
      }))
    });
  }

  function submitConcreteWaterPenetration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveConcreteWaterPenetrationTest(activeTest.id, {
      castingDate: String(form.get("castingDate") ?? ""),
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      curingMethod: String(form.get("curingMethod") ?? ""),
      pressureDirection: String(form.get("pressureDirection") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      specimens: [1, 2, 3].map((index) => ({
        specimenCode: String(form.get(`waterSpecimenCode-${index}`) ?? ""),
        lengthMm: Number(form.get(`waterLength-${index}`) || 0),
        widthMm: Number(form.get(`waterWidth-${index}`) || 0),
        heightMm: Number(form.get(`waterHeight-${index}`) || 0),
        maxPenetrationMm: Number(form.get(`waterPenetration-${index}`) || 0)
      }))
    });
  }

  function submitConcreteFlexural(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveConcreteFlexuralTest(activeTest.id, {
      castingDate: String(form.get("castingDate") ?? ""),
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      apparatusType: String(form.get("apparatusType") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      specimens: [1, 2, 3].map((index) => ({
        specimenCode: String(form.get(`flexSpecimenCode-${index}`) ?? ""),
        widthMm: Number(form.get(`flexWidth-${index}`) || 0),
        lengthMm: Number(form.get(`flexLength-${index}`) || 0),
        thicknessMm: Number(form.get(`flexThickness-${index}`) || 0),
        weightKg: Number(form.get(`flexWeight-${index}`) || 0),
        spanMm: Number(form.get(`flexSpan-${index}`) || 450),
        maximumLoadKn: Number(form.get(`flexLoad-${index}`) || 0)
      }))
    });
  }

  function submitConcreteDensity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveConcreteDensityTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      specimenCondition: String(form.get("specimenCondition") ?? ""),
      volumeMethod: String(form.get("volumeMethod") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      specimens: [1, 2, 3].map((index) => ({
        specimenCode: String(form.get(`densityCode-${index}`) ?? ""),
        massKg: Number(form.get(`densityMass-${index}`) || 0),
        volumeM3: Number(form.get(`densityVolume-${index}`) || 0),
        waterMassKg: Number(form.get(`densityWaterMass-${index}`) || 0),
        airMassKg: Number(form.get(`densityAirMass-${index}`) || 0),
        dryMassKg: Number(form.get(`densityDryMass-${index}`) || 0),
        waterDensityKgM3: Number(form.get(`densityWaterDensity-${index}`) || 998)
      }))
    });
  }

  function submitConcreteIndirectTensile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveConcreteIndirectTensileTest(activeTest.id, {
      castingDate: String(form.get("castingDate") ?? ""),
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      curingMethod: String(form.get("curingMethod") ?? ""),
      surfaceCondition: String(form.get("surfaceCondition") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      specimens: [1, 2, 3].map((index) => ({
        specimenCode: String(form.get(`splitCode-${index}`) ?? ""),
        contactLengthMm: Number(form.get(`splitLength-${index}`) || 0),
        crossSectionMm: Number(form.get(`splitCross-${index}`) || 0),
        maximumLoadN: Number(form.get(`splitLoad-${index}`) || 0),
        failureType: String(form.get(`splitFailure-${index}`) ?? "")
      }))
    });
  }

  function submitThermalInsulation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveThermalInsulationTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      surfaceTreatment: String(form.get("surfaceTreatment") ?? ""),
      productType: String(form.get("productType") ?? ""),
      deliveredForm: String(form.get("deliveredForm") ?? ""),
      defects: String(form.get("defects") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      specimens: [1, 2, 3, 4, 5].map((index) => ({
        specimenCode: String(form.get(`thermalCode-${index}`) ?? ""),
        lengthMm: Number(form.get(`thermalLength-${index}`) || 0),
        widthMm: Number(form.get(`thermalWidth-${index}`) || 0),
        thicknessMm: Number(form.get(`thermalThickness-${index}`) || 0),
        massKg: Number(form.get(`thermalMass-${index}`) || 0),
        absorptionLengthMm: Number(form.get(`thermalAbsLength-${index}`) || 0),
        absorptionWidthMm: Number(form.get(`thermalAbsWidth-${index}`) || 0),
        massBeforeImmersionKg: Number(form.get(`thermalM0-${index}`) || 0),
        massAfterImmersionKg: Number(form.get(`thermalM24-${index}`) || 0),
        compressionLengthMm: Number(form.get(`thermalCompLength-${index}`) || 0),
        compressionWidthMm: Number(form.get(`thermalCompWidth-${index}`) || 0),
        initialThicknessMm: Number(form.get(`thermalInitialThickness-${index}`) || 0),
        displacementMm: Number(form.get(`thermalDisplacement-${index}`) || 0),
        maximumForceN: Number(form.get(`thermalMaxForce-${index}`) || 0),
        forceAtTenPercentN: Number(form.get(`thermalForce10-${index}`) || 0)
      }))
    });
  }

  function submitCementConsistency(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveCementConsistencyTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      consistency: {
        cementMassG: Number(form.get("cementMassG") || 0),
        waterMassG: Number(form.get("waterMassG") || 0),
        pasteStartTime: String(form.get("pasteStartTime") ?? ""),
        probePenetrationMm: Number(form.get("probePenetrationMm") || 0)
      },
      setting: {
        startTime: String(form.get("settingStartTime") ?? ""),
        initialSettingTime: String(form.get("initialSettingTime") ?? ""),
        initialVicatReadingMm: Number(form.get("initialVicatReadingMm") || 0),
        finalSettingTime: String(form.get("finalSettingTime") ?? ""),
        finalVicatReadingMm: Number(form.get("finalVicatReadingMm") || 0)
      },
      expansion: {
        readingAfter24hMm: Number(form.get("readingAfter24hMm") || 0),
        readingAfterBoilingMm: Number(form.get("readingAfterBoilingMm") || 0),
        readingAtAmbientMm: Number(form.get("readingAtAmbientMm") || 0)
      }
    });
  }

  function submitCementStrength(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const cementRows = [
      { rowNo: 1, ageDays: 2, testType: "Flexural" as const, surfaceAreaMm2: 426.7 },
      { rowNo: 2, ageDays: 2, testType: "Compressive" as const, surfaceAreaMm2: 1600 },
      { rowNo: 3, ageDays: 2, testType: "Compressive" as const, surfaceAreaMm2: 1600 },
      { rowNo: 4, ageDays: 7, testType: "Flexural" as const, surfaceAreaMm2: 426.7 },
      { rowNo: 5, ageDays: 7, testType: "Compressive" as const, surfaceAreaMm2: 1600 },
      { rowNo: 6, ageDays: 7, testType: "Compressive" as const, surfaceAreaMm2: 1600 },
      { rowNo: 7, ageDays: 28, testType: "Flexural" as const, surfaceAreaMm2: 426.7 },
      { rowNo: 8, ageDays: 28, testType: "Compressive" as const, surfaceAreaMm2: 1600 },
      { rowNo: 9, ageDays: 28, testType: "Compressive" as const, surfaceAreaMm2: 1600 }
    ];
    store.saveCementStrengthTest(activeTest.id, {
      castingDate: String(form.get("castingDate") ?? ""),
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      specimens: cementRows.map((row, index) => ({
        ...row,
        testDate: String(form.get(`cementStrengthDate-${index}`) ?? ""),
        loadKn: Number(form.get(`cementStrengthLoad-${index}`) || 0)
      }))
    });
  }

  function submitCementBlaine(event: FormEvent<HTMLFormElement>, method: "BS EN" | "ASTM") {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveCementBlaineTest(activeTest.id, {
      method,
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      density: method === "BS EN"
        ? {
            sampleMassG: Number(form.get("densitySampleMassG") || 0),
            initialReadingMl: Number(form.get("initialReadingMl") || 0),
            finalReadingMl: Number(form.get("finalReadingMl") || 0),
            waterEquivalentMassG: Number(form.get("waterEquivalentMassG") || 0),
            waterTemperatureC: Number(form.get("waterTemperatureC") || 0),
            waterDensityGcm3: Number(form.get("waterDensityGcm3") || 0)
          }
        : undefined,
      bsEn: method === "BS EN"
        ? {
            internalCellHeightMm: Number(form.get("internalCellHeightMm") || 0),
            plungerLengthMm: Number(form.get("plungerLengthMm") || 0),
            cellRadiusMm: Number(form.get("cellRadiusMm") || 0),
            porosity: Number(form.get("porosity") || 0),
            referenceSurfaceCm2G: Number(form.get("referenceSurfaceCm2G") || 0),
            referenceDensityGcm3: Number(form.get("referenceDensityGcm3") || 0),
            referenceTimeS: Number(form.get("referenceTimeS") || 0),
            referenceAirViscosity: Number(form.get("referenceAirViscosity") || 0),
            measuredTimeS: Number(form.get("measuredTimeS") || 0),
            airViscosity: Number(form.get("airViscosity") || 0)
          }
        : undefined,
      astm: method === "ASTM"
        ? {
            emptyCellMercuryMassG: Number(form.get("emptyCellMercuryMassG") || 0),
            fullCellMercuryMassG: Number(form.get("fullCellMercuryMassG") || 0),
            mercuryDensityGcm3: Number(form.get("mercuryDensityGcm3") || 0),
            referenceDensityGcm3: Number(form.get("referenceDensityGcm3") || 0),
            porosity: Number(form.get("porosity") || 0),
            referenceSurfaceCm2G: Number(form.get("referenceSurfaceCm2G") || 0),
            referenceTimeS: Number(form.get("referenceTimeS") || 0),
            measuredTimeS: Number(form.get("measuredTimeS") || 0)
          }
        : undefined
    });
  }

  function submitAggregate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      testMethod: String(form.get("testMethod") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      sampleMassG: Number(form.get("sampleMassG") || 0),
      notes: String(form.get("notes") ?? ""),
      rows: Array.from({ length: aggregateRowCount }, (_, index) => ({
        sieveSizeMm: Number(form.get(`sieveSizeMm-${index}`) || 0),
        retainedMassG: Number(form.get(`retainedMassG-${index}`) || 0)
      }))
    });
  }

  function submitAggregateChemical(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const chlorideRun = (index: number) => ({
      silverNitrateVolumeMl: Number(form.get(`chlorideV8-${index}`) || 0),
      waterAggregateRatio: Number(form.get(`chlorideW-${index}`) || 0)
    });
    const waterSulfateRun = (index: number) => ({
      emptyCrucibleMassG: Number(form.get(`waterSulfateM0-${index}`) || 0),
      waterAggregateRatio: Number(form.get(`waterSulfateW-${index}`) || 0),
      cruciblePlusCalcinedMassG: Number(form.get(`waterSulfateM1-${index}`) || 0)
    });
    const acidSulfateRun = (index: number) => ({
      sampleMassG: Number(form.get(`acidSulfateM6-${index}`) || 0),
      emptyCrucibleMassG: Number(form.get(`acidSulfateM0-${index}`) || 0),
      cruciblePlusCalcinedMassG: Number(form.get(`acidSulfateM1-${index}`) || 0)
    });
    store.saveAggregateChemicalTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      chlorideTest1: chlorideRun(1),
      chlorideTest2: chlorideRun(2),
      waterSulfateTest1: waterSulfateRun(1),
      waterSulfateTest2: waterSulfateRun(2),
      acidSulfateTest1: acidSulfateRun(1),
      acidSulfateTest2: acidSulfateRun(2),
      totalSulfurPercent: Number(form.get("totalSulfurPercent") || 0),
      lossOnIgnitionPercent: Number(form.get("lossOnIgnitionPercent") || 0)
    });
  }

  function submitLosAngeles(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateLosAngelesTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      retainedOnOnePointSixMmG: Number(form.get("retainedOnOnePointSixMmG") || 0),
      rows: Array.from({ length: losAngelesRowCount }, (_, index) => ({
        passingSieveMm: Number(form.get(`passingSieveMm-${index}`) || 0),
        retainingSieveMm: Number(form.get(`retainingSieveMm-${index}`) || 0),
        sphereCount: Number(form.get(`sphereCount-${index}`) || 0),
        fractionMassG: Number(form.get(`fractionMassG-${index}`) || 0)
      }))
    });
  }

  function submitFreezeThaw(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateFreezeThawTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      totalCycles: Number(form.get("totalCycles") || 0),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      specimens: Array.from({ length: freezeThawRowCount }, (_, index) => ({
        specimenCode: String(form.get(`freezeSpecimenCode-${index}`) ?? ""),
        maximumAggregateSizeMm: Number(form.get(`maximumAggregateSizeMm-${index}`) || 0),
        initialDryMassG: Number(form.get(`initialDryMassG-${index}`) || 0),
        washingSieveSizeMm: Number(form.get(`washingSieveSizeMm-${index}`) || 0),
        finalDryMassG: Number(form.get(`finalDryMassG-${index}`) || 0),
        particlesBefore: Number(form.get(`particlesBefore-${index}`) || 0),
        splitParticles: Number(form.get(`splitParticles-${index}`) || 0),
        crackedParticles: Number(form.get(`crackedParticles-${index}`) || 0),
        flakedParticles: Number(form.get(`flakedParticles-${index}`) || 0),
        particlesAfter: Number(form.get(`particlesAfter-${index}`) || 0)
      }))
    });
  }

  function submitAcv(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const acvRun = (index: number) => ({
      totalDrySampleMassG: Number(form.get(`acvW1-${index}`) || 0),
      passingTwoPointThirtySixMmMassG: Number(form.get(`acvW2-${index}`) || 0)
    });
    store.saveAggregateAcvTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      test1: acvRun(1),
      test2: acvRun(2)
    });
  }

  function submitDensityAbsorption(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateDensityAbsorptionTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      testMethod: String(form.get("testMethod") ?? ""),
      specimens: [1, 2].map((index) => ({
        specimenCode: String(form.get(`densitySpecimenCode-${index}`) ?? ""),
        waterTemperatureC: Number(form.get(`waterTemperatureC-${index}`) || 0),
        waterDensity: Number(form.get(`waterDensity-${index}`) || 0),
        ovenDryMassG: Number(form.get(`ovenDryMassG-${index}`) || 0),
        ssdMassG: Number(form.get(`ssdMassG-${index}`) || 0),
        pycnometerWaterMassG: Number(form.get(`pycnometerWaterMassG-${index}`) || 0),
        pycnometerWaterSampleMassG: Number(form.get(`pycnometerWaterSampleMassG-${index}`) || 0)
      }))
    });
  }

  function submitFillerDensity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateFillerDensityTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      testMethod: String(form.get("testMethod") ?? ""),
      runs: [1, 2].map((index) => ({
        runLabel: `Test Result ${index}`,
        temperatureC: Number(form.get(`fillerTemperatureC-${index}`) || 0),
        liquidDensity: Number(form.get(`fillerLiquidDensity-${index}`) || 0),
        emptyPycnometerMassG: Number(form.get(`fillerM0-${index}`) || 0),
        pycnometerSampleMassG: Number(form.get(`fillerM1-${index}`) || 0),
        pycnometerSampleLiquidMassG: Number(form.get(`fillerM2-${index}`) || 0),
        pycnometerVolumeMl: Number(form.get(`fillerVolume-${index}`) || 0)
      }))
    });
  }

  function submitShapeIndex(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateShapeIndexTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      rows: Array.from({ length: shapeRowCount }, (_, index) => ({
        fractionLabel: String(form.get(`shapeFraction-${index}`) ?? ""),
        testPortionMassG: Number(form.get(`shapeMass-${index}`) || 0),
        nonCubicalMassG: Number(form.get(`shapeNonCubicalMass-${index}`) || 0)
      }))
    });
  }

  function submitFlakinessIndex(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateFlakinessIndexTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      initialSampleMassesG: [1, 2, 3].map((sampleIndex) => Number(form.get(`flakeInitialMass-${sampleIndex}`) || 0)),
      discardedMassesG: [1, 2, 3].map((sampleIndex) => Number(form.get(`flakeDiscardedMass-${sampleIndex}`) || 0)),
      rows: Array.from({ length: flakinessRowCount }, (_, index) => ({
        fractionLabel: String(form.get(`flakeFraction-${index}`) ?? ""),
        sieveOpeningMm: Number(form.get(`flakeSieveOpening-${index}`) || 0),
        barSieveMm: Number(form.get(`flakeBarSieve-${index}`) || 0),
        retainedMassesG: [1, 2, 3].map((sampleIndex) => Number(form.get(`flakeRetained-${index}-${sampleIndex}`) || 0)),
        passingBarSieveMassesG: [1, 2, 3].map((sampleIndex) => Number(form.get(`flakePassing-${index}-${sampleIndex}`) || 0))
      }))
    });
  }

  function submitElongationIndex(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateElongationIndexTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      rows: Array.from({ length: elongationRowCount }, (_, index) => ({
        fractionLabel: String(form.get(`elongationFraction-${index}`) ?? ""),
        retainedMassG: Number(form.get(`elongationRetainedMass-${index}`) || 0),
        elongatedMassG: Number(form.get(`elongationLongMass-${index}`) || 0)
      }))
    });
  }

  function submitBulkDensity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateBulkDensityTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      specificDensityMgM3: Number(form.get("specificDensityMgM3") || 0),
      runs: [1, 2, 3].map((index) => ({
        containerCapacityM3: Number(form.get(`bulkVolume-${index}`) || 0),
        emptyContainerMassKg: Number(form.get(`bulkM1-${index}`) || 0),
        containerSampleMassKg: Number(form.get(`bulkM2-${index}`) || 0)
      }))
    });
  }

  function submitSandEquivalent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    store.saveAggregateSandEquivalentTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      moistureRuns: [1, 2].map((index) => ({
        emptyDishMassG: Number(form.get(`sandM0-${index}`) || 0),
        dishWetSampleMassG: Number(form.get(`sandM1-${index}`) || 0),
        dishDrySampleMassG: Number(form.get(`sandM2-${index}`) || 0)
      })),
      finesRuns: [1, 2].map((index) => ({
        sampleMassG: Number(form.get(`finesM1-${index}`) || 0),
        retained0063MassG: Number(form.get(`finesM2-${index}`) || 0)
      })),
      sandRuns: [1, 2].map((index) => ({
        materialMassG: Number(form.get(`sandMaterial-${index}`) || 0),
        clayReadingMm: Number(form.get(`sandH1-${index}`) || 0),
        sandReadingMm: Number(form.get(`sandH2-${index}`) || 0)
      }))
    });
  }

  function submitSoundness(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const cycles = Number(form.get("cycles") || 0);
    store.saveAggregateSoundnessTest(activeTest.id, {
      testStartDate: String(form.get("testStartDate") ?? ""),
      testEndDate: String(form.get("testEndDate") ?? ""),
      temperature: String(form.get("temperature") ?? ""),
      humidity: String(form.get("humidity") ?? ""),
      testingLocation: String(form.get("testingLocation") ?? ""),
      technicianName: String(form.get("technicianName") ?? ""),
      checkedBy: String(form.get("checkedBy") ?? ""),
      notes: String(form.get("notes") ?? ""),
      cycles,
      totalParticlesBefore: Number(form.get("totalParticlesBefore") || 0),
      crackedParticles: Number(form.get("crackedParticles") || 0),
      brokenParticles: Number(form.get("brokenParticles") || 0),
      flakedParticles: Number(form.get("flakedParticles") || 0),
      totalParticlesAfter: Number(form.get("totalParticlesAfter") || 0),
      runs: [1, 2].map((index) => ({
        sampleNo: String(form.get(`soundnessSampleNo-${index}`) ?? String(index)),
        sieveSizeMm: String(form.get(`soundnessSieve-${index}`) ?? "10.00 - 14.00"),
        initialMassG: Number(form.get(`soundnessM1-${index}`) || 0),
        finalRetainedMassG: Number(form.get(`soundnessM2-${index}`) || 0),
        cycles: Number(form.get(`soundnessCycles-${index}`) || cycles)
      }))
    });
  }

  function generateReport() {
    const reportId = report?.id ?? store.generateReport(activeTest.id);
    window.setTimeout(() => router.push(`/reports/${reportId}`), 0);
  }

  const specimenCount = concrete?.specimens?.length ?? 0;
  const expectedReportCount = Math.max(1, Math.ceil(specimenCount / 3));
  const isSteelTest = Boolean(sample && isSteelSampleType(sample.sampleType));
  const isWaterPenetrationTest = isConcreteWaterPenetrationAccreditedTest(activeTest.testType);
  const isFlexuralTest = isConcreteFlexuralAccreditedTest(activeTest.testType);
  const isConcreteDensityTest = isConcreteDensityAccreditedTest(activeTest.testType);
  const isIndirectTensileTest = isConcreteIndirectTensileAccreditedTest(activeTest.testType);
  const isThermalInsulationTest = isThermalInsulationAccreditedTest(activeTest.testType);
  const isCementConsistencyTest = isCementConsistencyAccreditedTest(activeTest.testType);
  const isCementStrengthTest = isCementStrengthAccreditedTest(activeTest.testType);
  const isCementBlaineBsEnTest = isCementBlaineBsEnAccreditedTest(activeTest.testType);
  const isCementBlaineAstmTest = isCementBlaineAstmAccreditedTest(activeTest.testType);
  const isAggregateChemicalTest = isAggregateChemicalAccreditedTest(activeTest.testType);
  const isLosAngelesTest = isAggregateLosAngelesAccreditedTest(activeTest.testType);
  const isFreezeThawTest = isAggregateFreezeThawAccreditedTest(activeTest.testType);
  const isAcvTest = isAggregateAcvAccreditedTest(activeTest.testType);
  const isDensityAbsorptionTest = isAggregateDensityAbsorptionAccreditedTest(activeTest.testType);
  const isFillerDensityTest = isAggregateFillerDensityAccreditedTest(activeTest.testType);
  const isShapeIndexTest = isAggregateShapeIndexAccreditedTest(activeTest.testType);
  const isFlakinessIndexTest = isAggregateFlakinessIndexAccreditedTest(activeTest.testType);
  const isElongationIndexTest = isAggregateElongationIndexAccreditedTest(activeTest.testType);
  const isBulkDensityTest = isAggregateBulkDensityAccreditedTest(activeTest.testType);
  const isSandEquivalentTest = isAggregateSandEquivalentAccreditedTest(activeTest.testType);
  const isSoundnessTest = isAggregateSoundnessAccreditedTest(activeTest.testType);
  const isAggregateTest = Boolean(sample && isAggregateGranulometrySampleType(sample.sampleType) && activeTest.testType.includes("Granulometri"));
  const steelReportCount = steel?.specimens.length
    ? Array.from(
        steel.specimens.reduce((groups, specimen) => {
          const key = String(specimen.nominalDiameterMm || specimen.actualDiameterMm || "unknown");
          groups.set(key, (groups.get(key) ?? 0) + 1);
          return groups;
        }, new Map<string, number>()).values()
      ).reduce((sum, count) => sum + Math.ceil(count / 3), 0)
    : 1;

  if (isThermalInsulationTest) {
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Thermal insulation`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitThermalInsulation} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Karakteristikat fiziko-mekanike të produkteve termoizoluese</h2>
              <p className="mt-1 text-sm text-muted">Dimensions, apparent density, short-term water absorption by partial immersion, and compression behaviour.</p>
            </div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input name="productType" defaultValue={thermalInsulation?.productType ?? sample?.sampleType ?? ""} className="input" /></Field>
              <Field label="Date received"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={thermalInsulation?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={thermalInsulation?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Surface treatment"><input name="surfaceTreatment" defaultValue={thermalInsulation?.surfaceTreatment ?? ""} className="input" /></Field>
              <Field label="Delivered form"><input name="deliveredForm" defaultValue={thermalInsulation?.deliveredForm ?? ""} className="input" /></Field>
              <Field label="Defects"><input name="defects" defaultValue={thermalInsulation?.defects ?? "None observed"} className="input" /></Field>
              <Field label="Applied standards"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={thermalInsulation?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={thermalInsulation?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={thermalInsulation?.testingLocation ?? "01/A Lab. Fiziko-Mekanik / Physical-Mechanical laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={thermalInsulation?.temperature ?? ""} className="input" /></Field>
              <Field label="Humidity"><input name="humidity" defaultValue={thermalInsulation?.humidity ?? ""} className="input" /></Field>
            </div>
            <div className="space-y-6 p-5">
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[1800px] text-left text-sm">
                  <thead className="table-head"><tr><th className="px-3 py-2">Sample</th><th className="px-3 py-2">l [mm]</th><th className="px-3 py-2">b [mm]</th><th className="px-3 py-2">d [mm]</th><th className="px-3 py-2">m [kg]</th><th className="px-3 py-2">V [m3]</th><th className="px-3 py-2">Density [kg/m3]</th><th className="px-3 py-2">Abs l [mm]</th><th className="px-3 py-2">Abs b [mm]</th><th className="px-3 py-2">m0 [kg]</th><th className="px-3 py-2">m24 [kg]</th><th className="px-3 py-2">Wp [kg/m2]</th><th className="px-3 py-2">Comp l [mm]</th><th className="px-3 py-2">Comp b [mm]</th><th className="px-3 py-2">d0 [mm]</th><th className="px-3 py-2">Xm [mm]</th><th className="px-3 py-2">εm [%]</th><th className="px-3 py-2">Fm [N]</th><th className="px-3 py-2">F10 [N]</th><th className="px-3 py-2">s10/sm [kPa]</th></tr></thead>
                  <tbody className="divide-y divide-line">
                    {[1, 2, 3, 4, 5].map((index) => {
                      const row = thermalInsulation?.specimens[index - 1];
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2"><input name={`thermalCode-${index}`} defaultValue={row?.specimenCode ?? `${sample?.sampleCode ?? "Sample"}/${index}`} className="input min-w-32" /></td>
                          <td className="px-3 py-2"><input name={`thermalLength-${index}`} type="number" step="0.1" defaultValue={row?.lengthMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`thermalWidth-${index}`} type="number" step="0.1" defaultValue={row?.widthMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`thermalThickness-${index}`} type="number" step="0.1" defaultValue={row?.thicknessMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`thermalMass-${index}`} type="number" step="0.0001" defaultValue={row?.massKg ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2 font-semibold text-ink">{row ? row.volumeM3 : "Save"}</td>
                          <td className="px-3 py-2 font-semibold text-ink">{row ? row.apparentDensityKgM3 : "Save"}</td>
                          <td className="px-3 py-2"><input name={`thermalAbsLength-${index}`} type="number" step="0.1" defaultValue={row?.absorptionLengthMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`thermalAbsWidth-${index}`} type="number" step="0.1" defaultValue={row?.absorptionWidthMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`thermalM0-${index}`} type="number" step="0.0001" defaultValue={row?.massBeforeImmersionKg ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`thermalM24-${index}`} type="number" step="0.0001" defaultValue={row?.massAfterImmersionKg ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2 font-semibold text-ink">{row ? row.waterAbsorptionKgM2 : "Save"}</td>
                          <td className="px-3 py-2"><input name={`thermalCompLength-${index}`} type="number" step="0.1" defaultValue={row?.compressionLengthMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`thermalCompWidth-${index}`} type="number" step="0.1" defaultValue={row?.compressionWidthMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`thermalInitialThickness-${index}`} type="number" step="0.1" defaultValue={row?.initialThicknessMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`thermalDisplacement-${index}`} type="number" step="0.01" defaultValue={row?.displacementMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2 font-semibold text-ink">{row ? row.deformationPercent : "Save"}</td>
                          <td className="px-3 py-2"><input name={`thermalMaxForce-${index}`} type="number" step="0.1" defaultValue={row?.maximumForceN ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`thermalForce10-${index}`} type="number" step="0.1" defaultValue={row?.forceAtTenPercentN ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2 font-semibold text-ink">{row ? row.compressiveStressAtTenPercentKpa || row.compressiveStressKpa : "Save"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3 text-sm md:grid-cols-3">
                <InfoInline label="Average length" value={thermalInsulation ? `${thermalInsulation.averages.lengthMm} mm` : "Save"} />
                <InfoInline label="Average density" value={thermalInsulation ? `${thermalInsulation.averages.apparentDensityKgM3} kg/m3` : "Save"} />
                <InfoInline label="Average compression" value={thermalInsulation ? `${thermalInsulation.averages.compressiveStressKpa} kPa` : "Save"} />
              </div>
              <div><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={thermalInsulation?.notes} className="input mt-1" /></div>
              <div className="flex justify-end"><button className="btn-secondary">Save thermal insulation data</button></div>
            </div>
          </form>
          <TestActionsSidebar ready={Boolean(thermalInsulation)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={thermalInsulation ? `Thermal report data saved with density ${thermalInsulation.averages.apparentDensityKgM3} kg/m3.` : "Save worksheet data first to calculate the report values."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isCementConsistencyTest) {
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Cement consistency, setting, expansion`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitCementConsistency} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Konsistenca, koha e prezës dhe ekspansioni</h2>
              <p className="mt-1 text-sm text-muted">Translated from SL-FP-Ç-7.5.1.1. Water demand, setting time, and volume stability are calculated for the report.</p>
            </div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={cementConsistency?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={cementConsistency?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={cementConsistency?.testingLocation ?? "01/A Lab. Fiziko-Mekanik / Physical-Mechanical laboratory"} className="input" /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={cementConsistency?.technicianName ?? ""} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={cementConsistency?.checkedBy ?? ""} /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={cementConsistency?.temperature ?? ""} className="input" /></Field>
              <Field label="Relative humidity"><input name="humidity" defaultValue={cementConsistency?.humidity ?? ""} className="input" /></Field>
            </div>
            <div className="grid gap-5 p-5 lg:grid-cols-3">
              <div className="rounded-md border border-line p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Consistency</h3>
                <div className="mt-4 space-y-3">
                  <Field label="Cement mass [g]"><input name="cementMassG" type="number" step="0.1" defaultValue={cementConsistency?.consistency.cementMassG ?? ""} className="input" /></Field>
                  <Field label="Water mass [g]"><input name="waterMassG" type="number" step="0.1" defaultValue={cementConsistency?.consistency.waterMassG ?? ""} className="input" /></Field>
                  <Field label="Paste start time"><input name="pasteStartTime" type="time" step="1" defaultValue={cementConsistency?.consistency.pasteStartTime ?? ""} className="input" /></Field>
                  <Field label="Probe penetration [mm]"><input name="probePenetrationMm" type="number" step="0.1" defaultValue={cementConsistency?.consistency.probePenetrationMm ?? ""} className="input" /></Field>
                  <InfoInline label="Water demand" value={cementConsistency ? `${cementConsistency.consistency.waterDemandPercent}%` : "Save"} />
                </div>
              </div>
              <div className="rounded-md border border-line p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Setting Time</h3>
                <div className="mt-4 space-y-3">
                  <Field label="Start time t1"><input name="settingStartTime" type="time" step="1" defaultValue={cementConsistency?.setting.startTime ?? ""} className="input" /></Field>
                  <Field label="Initial setting time"><input name="initialSettingTime" type="time" step="1" defaultValue={cementConsistency?.setting.initialSettingTime ?? ""} className="input" /></Field>
                  <Field label="Initial Vicat reading [mm]"><input name="initialVicatReadingMm" type="number" step="0.1" defaultValue={cementConsistency?.setting.initialVicatReadingMm ?? ""} className="input" /></Field>
                  <Field label="Final setting time"><input name="finalSettingTime" type="time" step="1" defaultValue={cementConsistency?.setting.finalSettingTime ?? ""} className="input" /></Field>
                  <Field label="Final Vicat reading [mm]"><input name="finalVicatReadingMm" type="number" step="0.1" defaultValue={cementConsistency?.setting.finalVicatReadingMm ?? ""} className="input" /></Field>
                  <InfoInline label="Initial / final" value={cementConsistency ? `${cementConsistency.setting.initialSettingMinutes} / ${cementConsistency.setting.finalSettingMinutes} min` : "Save"} />
                </div>
              </div>
              <div className="rounded-md border border-line p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Expansion</h3>
                <div className="mt-4 space-y-3">
                  <Field label="Opening after 24h A [mm]"><input name="readingAfter24hMm" type="number" step="0.1" defaultValue={cementConsistency?.expansion.readingAfter24hMm ?? ""} className="input" /></Field>
                  <Field label="Opening after boiling B [mm]"><input name="readingAfterBoilingMm" type="number" step="0.1" defaultValue={cementConsistency?.expansion.readingAfterBoilingMm ?? ""} className="input" /></Field>
                  <Field label="Opening at ambient C [mm]"><input name="readingAtAmbientMm" type="number" step="0.1" defaultValue={cementConsistency?.expansion.readingAtAmbientMm ?? ""} className="input" /></Field>
                  <InfoInline label="Expansion C - A" value={cementConsistency ? `${cementConsistency.expansion.expansionMm} mm` : "Save"} />
                </div>
              </div>
              <div className="lg:col-span-3">
                <label className="text-sm font-medium text-ink">Notes</label>
                <textarea name="notes" rows={4} defaultValue={cementConsistency?.notes} className="input mt-1" />
              </div>
              <div className="lg:col-span-3 flex justify-end"><button className="btn-secondary">Save cement data</button></div>
            </div>
          </form>
          <TestActionsSidebar ready={Boolean(cementConsistency)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={cementConsistency ? `Water demand ${cementConsistency.consistency.waterDemandPercent}%, initial setting ${cementConsistency.setting.initialSettingMinutes} min.` : "Save worksheet data first to calculate cement consistency results."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isCementStrengthTest) {
    const rows = [
      { label: "2 days flexural", age: 2, type: "Flexural", area: 426.7 },
      { label: "2 days compression 1", age: 2, type: "Compressive", area: 1600 },
      { label: "2 days compression 2", age: 2, type: "Compressive", area: 1600 },
      { label: "7 days flexural", age: 7, type: "Flexural", area: 426.7 },
      { label: "7 days compression 1", age: 7, type: "Compressive", area: 1600 },
      { label: "7 days compression 2", age: 7, type: "Compressive", area: 1600 },
      { label: "28 days flexural", age: 28, type: "Flexural", area: 426.7 },
      { label: "28 days compression 1", age: 28, type: "Compressive", area: 1600 },
      { label: "28 days compression 2", age: 28, type: "Compressive", area: 1600 }
    ];
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Cement strength`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitCementStrength} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Rezistenca në shtypje dhe përkulje e çimentos</h2>
              <p className="mt-1 text-sm text-muted">Translated from SL-FP-Ç-7.5.1.2. Strength is calculated as load divided by surface area.</p>
            </div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Casting date"><input name="castingDate" type="date" defaultValue={cementStrength?.castingDate ?? sample?.dateReceived} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={cementStrength?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={cementStrength?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={cementStrength?.testingLocation ?? "01/A Lab. Fiziko-Mekanik / Physical-Mechanical laboratory"} className="input" /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={cementStrength?.technicianName ?? ""} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={cementStrength?.checkedBy ?? ""} /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={cementStrength?.temperature ?? ""} className="input" /></Field>
              <Field label="Relative humidity"><input name="humidity" defaultValue={cementStrength?.humidity ?? ""} className="input" /></Field>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="table-head"><tr><th className="px-3 py-2">Test</th><th className="px-3 py-2">Age [days]</th><th className="px-3 py-2">Area [mm2]</th><th className="px-3 py-2">Test date</th><th className="px-3 py-2">Load [kN]</th><th className="px-3 py-2">Strength [MPa]</th></tr></thead>
                  <tbody className="divide-y divide-line">
                    {rows.map((row, index) => {
                      const saved = cementStrength?.specimens[index];
                      return (
                        <tr key={row.label}>
                          <td className="px-3 py-2 font-semibold text-ink">{row.label}</td>
                          <td className="px-3 py-2">{row.age}</td>
                          <td className="px-3 py-2">{row.area}</td>
                          <td className="px-3 py-2"><input name={`cementStrengthDate-${index}`} type="date" defaultValue={saved?.testDate ?? activeTest.requiredTestDate} className="input min-w-36" /></td>
                          <td className="px-3 py-2"><input name={`cementStrengthLoad-${index}`} type="number" step="0.01" defaultValue={saved?.loadKn ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2 font-semibold text-ink">{saved ? saved.strengthMpa : "Save"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
                <InfoInline label="2 day average" value={cementStrength ? `${cementStrength.averages.flexural2DayMpa} / ${cementStrength.averages.compressive2DayMpa} MPa` : "Save"} />
                <InfoInline label="7 day average" value={cementStrength ? `${cementStrength.averages.flexural7DayMpa} / ${cementStrength.averages.compressive7DayMpa} MPa` : "Save"} />
                <InfoInline label="28 day average" value={cementStrength ? `${cementStrength.averages.flexural28DayMpa} / ${cementStrength.averages.compressive28DayMpa} MPa` : "Save"} />
              </div>
              <div className="mt-5"><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={cementStrength?.notes} className="input mt-1" /></div>
              <div className="mt-5 flex justify-end"><button className="btn-secondary">Save cement strength data</button></div>
            </div>
          </form>
          <TestActionsSidebar ready={Boolean(cementStrength)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={cementStrength ? `28-day compression average ${cementStrength.averages.compressive28DayMpa} MPa.` : "Save worksheet data first to calculate cement strength."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isCementBlaineBsEnTest || isCementBlaineAstmTest) {
    const method = isCementBlaineAstmTest ? "ASTM" : "BS EN";
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Blaine ${method}`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={(event) => submitCementBlaine(event, method)} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Sipërfaqja specifike Blaine sipas {method}</h2>
              <p className="mt-1 text-sm text-muted">Translated from the cement Blaine worksheet. The report uses the calculated specific surface area.</p>
            </div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={cementBlaine?.testingLocation ?? "01/A Lab. Fiziko-Mekanik / Physical-Mechanical laboratory"} className="input" /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={cementBlaine?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={cementBlaine?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={cementBlaine?.technicianName ?? ""} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={cementBlaine?.checkedBy ?? ""} /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={cementBlaine?.temperature ?? ""} className="input" /></Field>
              <Field label="Relative humidity"><input name="humidity" defaultValue={cementBlaine?.humidity ?? ""} className="input" /></Field>
            </div>
            {method === "BS EN" ? (
              <div className="grid gap-5 p-5 lg:grid-cols-3">
                <div className="rounded-md border border-line p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Density</h3>
                  <div className="mt-4 space-y-3">
                    <Field label="Sample mass P [g]"><input name="densitySampleMassG" type="number" step="0.001" defaultValue={cementBlaine?.density?.sampleMassG ?? ""} className="input" /></Field>
                    <Field label="Initial reading v1 [ml]"><input name="initialReadingMl" type="number" step="0.001" defaultValue={cementBlaine?.density?.initialReadingMl ?? ""} className="input" /></Field>
                    <Field label="Final reading v2 [ml]"><input name="finalReadingMl" type="number" step="0.001" defaultValue={cementBlaine?.density?.finalReadingMl ?? ""} className="input" /></Field>
                    <Field label="Water equivalent mass Pu [g]"><input name="waterEquivalentMassG" type="number" step="0.001" defaultValue={cementBlaine?.density?.waterEquivalentMassG ?? ""} className="input" /></Field>
                    <Field label="Water temperature [C]"><input name="waterTemperatureC" type="number" step="0.1" defaultValue={cementBlaine?.density?.waterTemperatureC ?? ""} className="input" /></Field>
                    <Field label="Water density [g/cm3]"><input name="waterDensityGcm3" type="number" step="0.0001" defaultValue={cementBlaine?.density?.waterDensityGcm3 ?? 0.998} className="input" /></Field>
                    <InfoInline label="Cement density" value={cementBlaine?.density ? `${cementBlaine.density.cementDensityGcm3} g/cm3` : "Save"} />
                  </div>
                </div>
                <div className="rounded-md border border-line p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Cell and K Constant</h3>
                  <div className="mt-4 space-y-3">
                    <Field label="Internal cell height J [mm]"><input name="internalCellHeightMm" type="number" step="0.001" defaultValue={cementBlaine?.bsEn?.internalCellHeightMm ?? ""} className="input" /></Field>
                    <Field label="Plunger length F [mm]"><input name="plungerLengthMm" type="number" step="0.001" defaultValue={cementBlaine?.bsEn?.plungerLengthMm ?? ""} className="input" /></Field>
                    <Field label="Cell radius r [mm]"><input name="cellRadiusMm" type="number" step="0.001" defaultValue={cementBlaine?.bsEn?.cellRadiusMm ?? ""} className="input" /></Field>
                    <Field label="Porosity e"><input name="porosity" type="number" step="0.001" defaultValue={cementBlaine?.bsEn?.porosity ?? 0.5} className="input" /></Field>
                    <Field label="Reference surface S0 [cm2/g]"><input name="referenceSurfaceCm2G" type="number" step="1" defaultValue={cementBlaine?.bsEn?.referenceSurfaceCm2G ?? ""} className="input" /></Field>
                    <Field label="Reference density [g/cm3]"><input name="referenceDensityGcm3" type="number" step="0.001" defaultValue={cementBlaine?.bsEn?.referenceDensityGcm3 ?? ""} className="input" /></Field>
                    <Field label="Reference time t0 [s]"><input name="referenceTimeS" type="number" step="0.1" defaultValue={cementBlaine?.bsEn?.referenceTimeS ?? ""} className="input" /></Field>
                    <Field label="Reference air viscosity"><input name="referenceAirViscosity" type="number" step="0.000001" defaultValue={cementBlaine?.bsEn?.referenceAirViscosity ?? ""} className="input" /></Field>
                  </div>
                </div>
                <div className="rounded-md border border-line p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Specific Surface</h3>
                  <div className="mt-4 space-y-3">
                    <Field label="Measured time t [s]"><input name="measuredTimeS" type="number" step="0.1" defaultValue={cementBlaine?.bsEn?.measuredTimeS ?? ""} className="input" /></Field>
                    <Field label="Air viscosity"><input name="airViscosity" type="number" step="0.000001" defaultValue={cementBlaine?.bsEn?.airViscosity ?? ""} className="input" /></Field>
                    <InfoInline label="Bed volume" value={cementBlaine?.bsEn ? `${cementBlaine.bsEn.bedVolumeCm3} cm3` : "Save"} />
                    <InfoInline label="Sample mass m1" value={cementBlaine?.bsEn ? `${cementBlaine.bsEn.sampleMassG} g` : "Save"} />
                    <InfoInline label="Constant K" value={cementBlaine?.bsEn ? `${cementBlaine.bsEn.constantK}` : "Save"} />
                    <InfoInline label="Specific surface" value={cementBlaine ? `${cementBlaine.specificSurfaceCm2G} cm2/g` : "Save"} />
                  </div>
                </div>
                <div className="lg:col-span-3"><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={cementBlaine?.notes} className="input mt-1" /></div>
                <div className="lg:col-span-3 flex justify-end"><button className="btn-secondary">Save Blaine BS EN data</button></div>
              </div>
            ) : (
              <div className="grid gap-5 p-5 lg:grid-cols-3">
                <Field label="Empty cell mercury mass WB [g]"><input name="emptyCellMercuryMassG" type="number" step="0.001" defaultValue={cementBlaine?.astm?.emptyCellMercuryMassG ?? ""} className="input" /></Field>
                <Field label="Full cell mercury mass WA [g]"><input name="fullCellMercuryMassG" type="number" step="0.001" defaultValue={cementBlaine?.astm?.fullCellMercuryMassG ?? ""} className="input" /></Field>
                <Field label="Mercury density D [g/cm3]"><input name="mercuryDensityGcm3" type="number" step="0.001" defaultValue={cementBlaine?.astm?.mercuryDensityGcm3 ?? 13.55} className="input" /></Field>
                <Field label="Reference density [g/cm3]"><input name="referenceDensityGcm3" type="number" step="0.001" defaultValue={cementBlaine?.astm?.referenceDensityGcm3 ?? ""} className="input" /></Field>
                <Field label="Porosity e"><input name="porosity" type="number" step="0.001" defaultValue={cementBlaine?.astm?.porosity ?? 0.5} className="input" /></Field>
                <Field label="Reference surface S0 [cm2/g]"><input name="referenceSurfaceCm2G" type="number" step="1" defaultValue={cementBlaine?.astm?.referenceSurfaceCm2G ?? ""} className="input" /></Field>
                <Field label="Reference time t0 [s]"><input name="referenceTimeS" type="number" step="0.1" defaultValue={cementBlaine?.astm?.referenceTimeS ?? ""} className="input" /></Field>
                <Field label="Measured time t [s]"><input name="measuredTimeS" type="number" step="0.1" defaultValue={cementBlaine?.astm?.measuredTimeS ?? ""} className="input" /></Field>
                <InfoInline label="Bed volume" value={cementBlaine?.astm ? `${cementBlaine.astm.bedVolumeCm3} cm3` : "Save"} />
                <InfoInline label="Sample mass W" value={cementBlaine?.astm ? `${cementBlaine.astm.sampleMassG} g` : "Save"} />
                <InfoInline label="Constant K" value={cementBlaine?.astm ? `${cementBlaine.astm.constantK}` : "Save"} />
                <InfoInline label="Specific surface" value={cementBlaine ? `${cementBlaine.specificSurfaceCm2G} cm2/g` : "Save"} />
                <div className="lg:col-span-3"><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={cementBlaine?.notes} className="input mt-1" /></div>
                <div className="lg:col-span-3 flex justify-end"><button className="btn-secondary">Save Blaine ASTM data</button></div>
              </div>
            )}
          </form>
          <TestActionsSidebar ready={Boolean(cementBlaine)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={cementBlaine ? `Specific surface ${cementBlaine.specificSurfaceCm2G} cm2/g.` : "Save worksheet data first to calculate Blaine specific surface."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isConcreteDensityTest) {
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Hardened concrete density`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitConcreteDensity} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4"><div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div><h2 className="mt-1 text-lg font-semibold text-ink">Pesha volumore e betonit të ngurtësuar</h2><p className="mt-1 text-sm text-muted">BS EN 12390-7:2019. For regular specimens use D = m / V; for irregular specimens the volume can be calculated from air and water mass.</p></div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Date received"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={concreteDensity?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={concreteDensity?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Specimen condition"><input name="specimenCondition" defaultValue={concreteDensity?.specimenCondition ?? "Treated / oven dried regular shape"} className="input" /></Field>
              <Field label="Volume method"><input name="volumeMethod" defaultValue={concreteDensity?.volumeMethod ?? "Regular shape: measured volume"} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={concreteDensity?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={concreteDensity?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={concreteDensity?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={concreteDensity?.temperature ?? ""} className="input" /></Field>
              <Field label="Humidity"><input name="humidity" defaultValue={concreteDensity?.humidity ?? ""} className="input" /></Field>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[1320px] text-left text-sm">
                  <thead className="table-head"><tr><th className="px-3 py-2">Sample</th><th className="px-3 py-2">Mass m [kg]</th><th className="px-3 py-2">Volume V [m3]</th><th className="px-3 py-2">Water mass mw [kg]</th><th className="px-3 py-2">Air mass ma [kg]</th><th className="px-3 py-2">Dry mass [kg]</th><th className="px-3 py-2">Water density [kg/m3]</th><th className="px-3 py-2">Density [kg/m3]</th></tr></thead>
                  <tbody className="divide-y divide-line">{[1, 2, 3].map((index) => { const row = concreteDensity?.specimens[index - 1]; return <tr key={index}><td className="px-3 py-2"><input name={`densityCode-${index}`} defaultValue={row?.specimenCode ?? `${sample?.sampleCode ?? "Sample"}/${index}`} className="input min-w-32" /></td><td className="px-3 py-2"><input name={`densityMass-${index}`} type="number" step="0.001" defaultValue={row?.massKg ?? ""} className="input min-w-24" /></td><td className="px-3 py-2"><input name={`densityVolume-${index}`} type="number" step="0.000001" defaultValue={row?.volumeM3 ?? ""} className="input min-w-28" /></td><td className="px-3 py-2"><input name={`densityWaterMass-${index}`} type="number" step="0.001" defaultValue={row?.waterMassKg ?? ""} className="input min-w-24" /></td><td className="px-3 py-2"><input name={`densityAirMass-${index}`} type="number" step="0.001" defaultValue={row?.airMassKg ?? ""} className="input min-w-24" /></td><td className="px-3 py-2"><input name={`densityDryMass-${index}`} type="number" step="0.001" defaultValue={row?.dryMassKg ?? ""} className="input min-w-24" /></td><td className="px-3 py-2"><input name={`densityWaterDensity-${index}`} type="number" step="0.1" defaultValue={row?.waterDensityKgM3 ?? 998} className="input min-w-24" /></td><td className="px-3 py-2 font-semibold text-ink">{row ? row.densityKgM3 : "Save"}</td></tr>; })}</tbody>
                </table>
              </div>
              <div className="mt-4 text-sm font-semibold text-ink">Average density: {concreteDensity ? `${concreteDensity.averageDensityKgM3} kg/m3` : "Save"}</div>
              <div className="mt-5"><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={concreteDensity?.notes} className="input mt-1" /></div>
              <div className="mt-5 flex justify-end"><button className="btn-secondary">Save density data</button></div>
            </div>
          </form>
          <TestActionsSidebar ready={Boolean(concreteDensity)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={concreteDensity ? `Average density is ${concreteDensity.averageDensityKgM3} kg/m3.` : "Save worksheet data first to calculate density."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isIndirectTensileTest) {
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Indirect tensile`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitConcreteIndirectTensile} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4"><div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div><h2 className="mt-1 text-lg font-semibold text-ink">Rezistenca në tërheqje indirekte</h2><p className="mt-1 text-sm text-muted">BS EN 12390-6:2009. fct = 2F / (π x L x d), with F in N.</p></div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Date received"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Casting date"><input name="castingDate" type="date" defaultValue={concreteIndirectTensile?.castingDate ?? ""} className="input" /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={concreteIndirectTensile?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={concreteIndirectTensile?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Curing / age"><input name="curingMethod" defaultValue={concreteIndirectTensile?.curingMethod ?? ""} className="input" /></Field>
              <Field label="Surface moisture condition"><input name="surfaceCondition" defaultValue={concreteIndirectTensile?.surfaceCondition ?? ""} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={concreteIndirectTensile?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={concreteIndirectTensile?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={concreteIndirectTensile?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={concreteIndirectTensile?.temperature ?? ""} className="input" /></Field>
              <Field label="Humidity"><input name="humidity" defaultValue={concreteIndirectTensile?.humidity ?? ""} className="input" /></Field>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[1120px] text-left text-sm">
                  <thead className="table-head"><tr><th className="px-3 py-2">Sample</th><th className="px-3 py-2">Contact length L [mm]</th><th className="px-3 py-2">Cross-section d [mm]</th><th className="px-3 py-2">Maximum load F [N]</th><th className="px-3 py-2">Failure type</th><th className="px-3 py-2">fct [MPa]</th></tr></thead>
                  <tbody className="divide-y divide-line">{[1, 2, 3].map((index) => { const row = concreteIndirectTensile?.specimens[index - 1]; return <tr key={index}><td className="px-3 py-2"><input name={`splitCode-${index}`} defaultValue={row?.specimenCode ?? `${sample?.sampleCode ?? "Sample"}/${index}`} className="input min-w-32" /></td><td className="px-3 py-2"><input name={`splitLength-${index}`} type="number" step="0.1" defaultValue={row?.contactLengthMm ?? ""} className="input min-w-28" /></td><td className="px-3 py-2"><input name={`splitCross-${index}`} type="number" step="0.1" defaultValue={row?.crossSectionMm ?? ""} className="input min-w-28" /></td><td className="px-3 py-2"><input name={`splitLoad-${index}`} type="number" step="1" defaultValue={row?.maximumLoadN ?? ""} className="input min-w-28" /></td><td className="px-3 py-2"><input name={`splitFailure-${index}`} defaultValue={row?.failureType ?? ""} className="input min-w-36" /></td><td className="px-3 py-2 font-semibold text-ink">{row ? row.tensileStrengthMpa : "Save"}</td></tr>; })}</tbody>
                </table>
              </div>
              <div className="mt-4 text-sm font-semibold text-ink">Average indirect tensile strength: {concreteIndirectTensile ? `${concreteIndirectTensile.averageTensileStrengthMpa} MPa` : "Save"}</div>
              <div className="mt-5"><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={concreteIndirectTensile?.notes} className="input mt-1" /></div>
              <div className="mt-5 flex justify-end"><button className="btn-secondary">Save indirect tensile data</button></div>
            </div>
          </form>
          <TestActionsSidebar ready={Boolean(concreteIndirectTensile)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={concreteIndirectTensile ? `Average indirect tensile strength is ${concreteIndirectTensile.averageTensileStrengthMpa} MPa.` : "Save worksheet data first to calculate indirect tensile strength."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isWaterPenetrationTest) {
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Water penetration`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitConcreteWaterPenetration} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4"><div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div><h2 className="mt-1 text-lg font-semibold text-ink">Depërtimi i ujit në betonin e ngurtësuar</h2><p className="mt-1 text-sm text-muted">BS EN 12390-8:2019. Record the maximum depth of water penetration for up to three specimens.</p></div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Date received"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Casting date"><input name="castingDate" type="date" defaultValue={concreteWater?.castingDate ?? ""} className="input" /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={concreteWater?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={concreteWater?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Curing period"><input name="curingMethod" defaultValue={concreteWater?.curingMethod ?? ""} className="input" /></Field>
              <Field label="Water pressure direction"><input name="pressureDirection" defaultValue={concreteWater?.pressureDirection ?? ""} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={concreteWater?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={concreteWater?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={concreteWater?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={concreteWater?.temperature ?? ""} className="input" /></Field>
              <Field label="Humidity"><input name="humidity" defaultValue={concreteWater?.humidity ?? ""} className="input" /></Field>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="table-head"><tr><th className="px-3 py-2">Parameter</th><th className="px-3 py-2">Unit</th>{[1, 2, 3].map((index) => <th key={index} className="px-3 py-2">Sample {index}</th>)}<th className="px-3 py-2">Average</th></tr></thead>
                  <tbody className="divide-y divide-line">
                    <ConcreteWaterRow label="Code" names={[1, 2, 3].map((i) => `waterSpecimenCode-${i}`)} values={[1, 2, 3].map((i) => concreteWater?.specimens[i - 1]?.specimenCode)} />
                    <ConcreteWaterRow label="Length" unit="mm" type="number" names={[1, 2, 3].map((i) => `waterLength-${i}`)} values={[1, 2, 3].map((i) => concreteWater?.specimens[i - 1]?.lengthMm)} />
                    <ConcreteWaterRow label="Width" unit="mm" type="number" names={[1, 2, 3].map((i) => `waterWidth-${i}`)} values={[1, 2, 3].map((i) => concreteWater?.specimens[i - 1]?.widthMm)} />
                    <ConcreteWaterRow label="Height" unit="mm" type="number" names={[1, 2, 3].map((i) => `waterHeight-${i}`)} values={[1, 2, 3].map((i) => concreteWater?.specimens[i - 1]?.heightMm)} />
                    <ConcreteWaterRow label="Maximum water penetration" unit="mm" type="number" names={[1, 2, 3].map((i) => `waterPenetration-${i}`)} values={[1, 2, 3].map((i) => concreteWater?.specimens[i - 1]?.maxPenetrationMm)} average={concreteWater?.averagePenetrationMm} />
                  </tbody>
                </table>
              </div>
              <div className="mt-5"><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={concreteWater?.notes} className="input mt-1" /></div>
              <div className="mt-5 flex justify-end"><button className="btn-secondary">Save water penetration data</button></div>
            </div>
          </form>
          <TestActionsSidebar ready={Boolean(concreteWater)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={concreteWater ? `Average water penetration is ${concreteWater.averagePenetrationMm} mm.` : "Save worksheet data first to calculate average penetration."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isFlexuralTest) {
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Flexural strength`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitConcreteFlexural} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4"><div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div><h2 className="mt-1 text-lg font-semibold text-ink">Rezistenca në përkulje / Flexural Strength</h2><p className="mt-1 text-sm text-muted">BS EN 12390-5:2019. Two-point apparatus formula: f = F x l / (d1 x d2²).</p></div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Date received"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Casting date"><input name="castingDate" type="date" defaultValue={concreteFlexural?.castingDate ?? ""} className="input" /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={concreteFlexural?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={concreteFlexural?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Apparatus type"><input name="apparatusType" defaultValue={concreteFlexural?.apparatusType ?? "Aparat dy-pikësor / Two point apparatus"} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={concreteFlexural?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={concreteFlexural?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={concreteFlexural?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={concreteFlexural?.temperature ?? ""} className="input" /></Field>
              <Field label="Humidity"><input name="humidity" defaultValue={concreteFlexural?.humidity ?? ""} className="input" /></Field>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[1280px] text-left text-sm">
                  <thead className="table-head"><tr><th className="px-3 py-2">Sample</th><th className="px-3 py-2">Width [mm]</th><th className="px-3 py-2">Length [mm]</th><th className="px-3 py-2">Thickness [mm]</th><th className="px-3 py-2">Weight [kg]</th><th className="px-3 py-2">Span [mm]</th><th className="px-3 py-2">Max load [kN]</th><th className="px-3 py-2">Volume [m3]</th><th className="px-3 py-2">Density [kg/m3]</th><th className="px-3 py-2">Flexural strength [MPa]</th></tr></thead>
                  <tbody className="divide-y divide-line">{[1, 2, 3].map((index) => { const row = concreteFlexural?.specimens[index - 1]; return <tr key={index}><td className="px-3 py-2"><input name={`flexSpecimenCode-${index}`} defaultValue={row?.specimenCode ?? `${sample?.sampleCode ?? "Sample"}/${index}`} className="input min-w-32" /></td><td className="px-3 py-2"><input name={`flexWidth-${index}`} type="number" step="0.1" defaultValue={row?.widthMm ?? ""} className="input min-w-24" /></td><td className="px-3 py-2"><input name={`flexLength-${index}`} type="number" step="0.1" defaultValue={row?.lengthMm ?? ""} className="input min-w-24" /></td><td className="px-3 py-2"><input name={`flexThickness-${index}`} type="number" step="0.1" defaultValue={row?.thicknessMm ?? ""} className="input min-w-24" /></td><td className="px-3 py-2"><input name={`flexWeight-${index}`} type="number" step="0.01" defaultValue={row?.weightKg ?? ""} className="input min-w-24" /></td><td className="px-3 py-2"><input name={`flexSpan-${index}`} type="number" step="1" defaultValue={row?.spanMm ?? 450} className="input min-w-24" /></td><td className="px-3 py-2"><input name={`flexLoad-${index}`} type="number" step="0.01" defaultValue={row?.maximumLoadKn ?? ""} className="input min-w-24" /></td><td className="px-3 py-2 font-semibold text-ink">{row ? row.volumeM3 : "Save"}</td><td className="px-3 py-2 font-semibold text-ink">{row ? row.apparentDensityKgM3 : "Save"}</td><td className="px-3 py-2 font-semibold text-ink">{row ? row.flexuralStrengthMpa : "Save"}</td></tr>; })}</tbody>
                </table>
              </div>
              <div className="mt-4 text-sm font-semibold text-ink">Average flexural strength: {concreteFlexural ? `${concreteFlexural.averageFlexuralStrengthMpa} MPa` : "Save"}</div>
              <div className="mt-5"><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={concreteFlexural?.notes} className="input mt-1" /></div>
              <div className="mt-5 flex justify-end"><button className="btn-secondary">Save flexural data</button></div>
            </div>
          </form>
          <TestActionsSidebar ready={Boolean(concreteFlexural)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={concreteFlexural ? `Average flexural strength is ${concreteFlexural.averageFlexuralStrengthMpa} MPa.` : "Save worksheet data first to calculate flexural strength."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isSoundnessTest) {
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Soundness`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitSoundness} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Humbja në peshë me sulfat magnezi / Soundness</h2>
              <p className="mt-1 text-sm text-muted">BS EN 1367-2:2009. MS = 100 x ((M1 - M2) / M1), using the two-run worksheet format.</p>
            </div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateSoundness?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateSoundness?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Number of cycles"><input name="cycles" type="number" step="1" defaultValue={aggregateSoundness?.cycles ?? 5} className="input" /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateSoundness?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateSoundness?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateSoundness?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateSoundness?.temperature ?? ""} className="input" /></Field>
              <Field label="Humidity"><input name="humidity" defaultValue={aggregateSoundness?.humidity ?? ""} className="input" /></Field>
            </div>
            <div className="space-y-6 p-5">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Magnesium sulfate loss</h3>
                <div className="mt-3 overflow-x-auto rounded-md border border-line">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="table-head"><tr><th className="px-3 py-2">Sample no.</th><th className="px-3 py-2">Sieve size [mm]</th><th className="px-3 py-2">M1 before [g]</th><th className="px-3 py-2">M2 after retained 10 mm [g]</th><th className="px-3 py-2">Cycles</th><th className="px-3 py-2">MS [%]</th></tr></thead>
                    <tbody className="divide-y divide-line">
                      {[1, 2].map((index) => {
                        const row = aggregateSoundness?.runs[index - 1];
                        return (
                          <tr key={index}>
                            <td className="px-3 py-2"><input name={`soundnessSampleNo-${index}`} defaultValue={row?.sampleNo ?? String(index)} className="input min-w-24" /></td>
                            <td className="px-3 py-2"><input name={`soundnessSieve-${index}`} defaultValue={row?.sieveSizeMm ?? "10.00 - 14.00"} className="input min-w-32" /></td>
                            <td className="px-3 py-2"><input name={`soundnessM1-${index}`} type="number" step="0.01" defaultValue={row?.initialMassG ?? ""} className="input min-w-28" /></td>
                            <td className="px-3 py-2"><input name={`soundnessM2-${index}`} type="number" step="0.01" defaultValue={row?.finalRetainedMassG ?? ""} className="input min-w-28" /></td>
                            <td className="px-3 py-2"><input name={`soundnessCycles-${index}`} type="number" step="1" defaultValue={row?.cycles ?? aggregateSoundness?.cycles ?? 5} className="input min-w-24" /></td>
                            <td className="px-3 py-2 font-semibold text-ink">{row ? `${row.soundnessLossPercent}%` : "Save"}</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-lab-porcelain"><td className="px-3 py-2 font-semibold text-ink" colSpan={5}>Average value</td><td className="px-3 py-2 font-semibold text-ink">{aggregateSoundness ? `${aggregateSoundness.averageSoundnessLossPercent}%` : "Save"}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Qualitative examination</h3>
                <div className="mt-3 grid gap-4 md:grid-cols-5">
                  <Field label="Particles before"><input name="totalParticlesBefore" type="number" step="1" defaultValue={aggregateSoundness?.totalParticlesBefore ?? ""} className="input" /></Field>
                  <Field label="Cracked after"><input name="crackedParticles" type="number" step="1" defaultValue={aggregateSoundness?.crackedParticles ?? ""} className="input" /></Field>
                  <Field label="Broken after"><input name="brokenParticles" type="number" step="1" defaultValue={aggregateSoundness?.brokenParticles ?? ""} className="input" /></Field>
                  <Field label="Flaked after"><input name="flakedParticles" type="number" step="1" defaultValue={aggregateSoundness?.flakedParticles ?? ""} className="input" /></Field>
                  <Field label="Particles after"><input name="totalParticlesAfter" type="number" step="1" defaultValue={aggregateSoundness?.totalParticlesAfter ?? ""} className="input" /></Field>
                </div>
              </div>
              <div><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={aggregateSoundness?.notes} className="input mt-1" /></div>
              <div className="flex justify-end"><button className="btn-secondary">Save soundness data</button></div>
            </div>
          </form>
          <TestActionsSidebar ready={Boolean(aggregateSoundness)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={aggregateSoundness ? `Soundness loss calculated as ${aggregateSoundness.averageSoundnessLossPercent}%.` : "Save worksheet data first to calculate soundness."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isSandEquivalentTest) {
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Sand equivalent`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitSandEquivalent} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Ekuivalenti i rërës / Sand Equivalent</h2>
              <p className="mt-1 text-sm text-muted">BS EN 933-8:2012+A1:2015. SE = h2 / h1 x 100, with moisture and fines checks from the worksheet.</p>
            </div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateSandEquivalent?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateSandEquivalent?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateSandEquivalent?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateSandEquivalent?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateSandEquivalent?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateSandEquivalent?.temperature ?? ""} className="input" /></Field>
              <Field label="Humidity"><input name="humidity" defaultValue={aggregateSandEquivalent?.humidity ?? ""} className="input" /></Field>
            </div>
            <div className="space-y-6 p-5">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Moisture content</h3>
                <div className="mt-3 overflow-x-auto rounded-md border border-line">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="table-head"><tr><th className="px-3 py-2">Run</th><th className="px-3 py-2">m0 dish [g]</th><th className="px-3 py-2">m1 dish + wet [g]</th><th className="px-3 py-2">m2 dish + dry [g]</th><th className="px-3 py-2">w [%]</th></tr></thead>
                    <tbody className="divide-y divide-line">{[1, 2].map((index) => { const row = aggregateSandEquivalent?.moistureRuns[index - 1]; return <tr key={index}><td className="px-3 py-2 font-semibold text-ink">{index}</td><td className="px-3 py-2"><input name={`sandM0-${index}`} type="number" step="0.01" defaultValue={row?.emptyDishMassG ?? ""} className="input min-w-28" /></td><td className="px-3 py-2"><input name={`sandM1-${index}`} type="number" step="0.01" defaultValue={row?.dishWetSampleMassG ?? ""} className="input min-w-28" /></td><td className="px-3 py-2"><input name={`sandM2-${index}`} type="number" step="0.01" defaultValue={row?.dishDrySampleMassG ?? ""} className="input min-w-28" /></td><td className="px-3 py-2 font-semibold text-ink">{row ? `${row.moisturePercent}%` : "Save"}</td></tr>; })}</tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Fines and sand equivalent</h3>
                <div className="mt-3 overflow-x-auto rounded-md border border-line">
                  <table className="w-full min-w-[980px] text-left text-sm">
                    <thead className="table-head"><tr><th className="px-3 py-2">Run</th><th className="px-3 py-2">Sample M1 [g]</th><th className="px-3 py-2">Retained 0.063 M2 [g]</th><th className="px-3 py-2">Fines [%]</th><th className="px-3 py-2">Material [g]</th><th className="px-3 py-2">h1 [mm]</th><th className="px-3 py-2">h2 [mm]</th><th className="px-3 py-2">SE</th></tr></thead>
                    <tbody className="divide-y divide-line">{[1, 2].map((index) => { const fines = aggregateSandEquivalent?.finesRuns[index - 1]; const sand = aggregateSandEquivalent?.sandRuns[index - 1]; return <tr key={index}><td className="px-3 py-2 font-semibold text-ink">{index}</td><td className="px-3 py-2"><input name={`finesM1-${index}`} type="number" step="0.01" defaultValue={fines?.sampleMassG ?? ""} className="input min-w-28" /></td><td className="px-3 py-2"><input name={`finesM2-${index}`} type="number" step="0.01" defaultValue={fines?.retained0063MassG ?? ""} className="input min-w-28" /></td><td className="px-3 py-2 font-semibold text-ink">{fines ? `${fines.finesPercent}%` : "Save"}</td><td className="px-3 py-2"><input name={`sandMaterial-${index}`} type="number" step="0.01" defaultValue={sand?.materialMassG ?? aggregateSandEquivalent?.materialForTestG ?? ""} className="input min-w-28" /></td><td className="px-3 py-2"><input name={`sandH1-${index}`} type="number" step="0.01" defaultValue={sand?.clayReadingMm ?? ""} className="input min-w-28" /></td><td className="px-3 py-2"><input name={`sandH2-${index}`} type="number" step="0.01" defaultValue={sand?.sandReadingMm ?? ""} className="input min-w-28" /></td><td className="px-3 py-2 font-semibold text-ink">{sand ? sand.sandEquivalent : "Save"}</td></tr>; })}</tbody>
                  </table>
                </div>
                <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
                  <Info label="Average moisture" value={aggregateSandEquivalent ? `${aggregateSandEquivalent.averageMoisturePercent}%` : "Save"} />
                  <Info label="Average fines" value={aggregateSandEquivalent ? `${aggregateSandEquivalent.averageFinesPercent}%` : "Save"} />
                  <Info label="Material for test" value={aggregateSandEquivalent ? `${aggregateSandEquivalent.materialForTestG} g` : "Save"} />
                  <Info label="Sand equivalent" value={aggregateSandEquivalent ? `${aggregateSandEquivalent.sandEquivalentValue}` : "Save"} />
                </div>
              </div>
              <div><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={aggregateSandEquivalent?.notes} className="input mt-1" /></div>
              <div className="flex justify-end"><button className="btn-secondary">Save sand equivalent data</button></div>
            </div>
          </form>
          <TestActionsSidebar ready={Boolean(aggregateSandEquivalent)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={aggregateSandEquivalent ? `Sand equivalent calculated as ${aggregateSandEquivalent.sandEquivalentValue}.` : "Save worksheet data first to calculate sand equivalent."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isBulkDensityTest) {
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Bulk density`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitBulkDensity} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4"><div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div><h2 className="mt-1 text-lg font-semibold text-ink">Pesha volumore e agregateve / Bulk Density</h2><p className="mt-1 text-sm text-muted">BS EN 1097-3:1998. Bulk density = (m2 - m1) / V, reported in Mg/m3.</p></div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateBulkDensity?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateBulkDensity?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Specific density [Mg/m3]"><input name="specificDensityMgM3" type="number" step="0.001" defaultValue={aggregateBulkDensity?.specificDensityMgM3 ?? ""} className="input" /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateBulkDensity?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateBulkDensity?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateBulkDensity?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateBulkDensity?.temperature ?? ""} className="input" /></Field>
              <Field label="Humidity"><input name="humidity" defaultValue={aggregateBulkDensity?.humidity ?? ""} className="input" /></Field>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[920px] text-left text-sm">
                  <thead className="table-head"><tr><th className="px-3 py-2">Run</th><th className="px-3 py-2">Container V [m3]</th><th className="px-3 py-2">m1 empty [kg]</th><th className="px-3 py-2">m2 full [kg]</th><th className="px-3 py-2">Bulk density [Mg/m3]</th><th className="px-3 py-2">Voids [%]</th></tr></thead>
                  <tbody className="divide-y divide-line">{[1, 2, 3].map((index) => { const row = aggregateBulkDensity?.runs[index - 1]; return <tr key={index}><td className="px-3 py-2 font-semibold text-ink">{index}</td><td className="px-3 py-2"><input name={`bulkVolume-${index}`} type="number" step="0.000001" defaultValue={row?.containerCapacityM3 ?? 0.005} className="input min-w-28" /></td><td className="px-3 py-2"><input name={`bulkM1-${index}`} type="number" step="0.001" defaultValue={row?.emptyContainerMassKg ?? ""} className="input min-w-28" /></td><td className="px-3 py-2"><input name={`bulkM2-${index}`} type="number" step="0.001" defaultValue={row?.containerSampleMassKg ?? ""} className="input min-w-28" /></td><td className="px-3 py-2 font-semibold text-ink">{row ? row.bulkDensityMgM3 : "Save"}</td><td className="px-3 py-2 font-semibold text-ink">{row ? row.voidsPercent : "Save"}</td></tr>; })}<tr className="bg-lab-porcelain"><td className="px-3 py-2 font-semibold text-ink" colSpan={4}>Average</td><td className="px-3 py-2 font-semibold text-ink">{aggregateBulkDensity?.averageBulkDensityMgM3 ?? "Save"}</td><td className="px-3 py-2 font-semibold text-ink">{aggregateBulkDensity?.averageVoidsPercent ?? "Save"}</td></tr></tbody>
                </table>
              </div>
              <div className="mt-5"><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={aggregateBulkDensity?.notes} className="input mt-1" /></div>
              <div className="mt-5 flex justify-end"><button className="btn-secondary">Save bulk density data</button></div>
            </div>
          </form>
          <TestActionsSidebar ready={Boolean(aggregateBulkDensity)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={aggregateBulkDensity ? `Bulk density calculated as ${aggregateBulkDensity.averageBulkDensityMgM3} Mg/m3.` : "Save worksheet data first to calculate bulk density."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isElongationIndexTest) {
    const defaults = ["4/8 mm", "8/16 mm", "16/31.5 mm", "31.5/63 mm"];
    return (
      <>
        <PageHeader title={activeTest.testCode} description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Elongation index`} action={<StatusBadge status={activeTest.status} />} />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitElongationIndex} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4"><div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div><h2 className="mt-1 text-lg font-semibold text-ink">Indeksi i zgjatimit / Elongation Index</h2><p className="mt-1 text-sm text-muted">BS 812-105.2:1980. EI = elongated particle mass / retained mass x 100.</p></div>
            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateElongation?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateElongation?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateElongation?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateElongation?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateElongation?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateElongation?.temperature ?? ""} className="input" /></Field>
              <Field label="Humidity"><input name="humidity" defaultValue={aggregateElongation?.humidity ?? ""} className="input" /></Field>
            </div>
            <div className="p-5">
              <div className="mb-4 flex justify-end"><button type="button" onClick={() => setElongationRowCount((count) => count + 1)} className="btn-secondary px-3">Add fraction</button></div>
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="table-head"><tr><th className="px-3 py-2">Fraction</th><th className="px-3 py-2">Retained mass [g]</th><th className="px-3 py-2">Elongated mass [g]</th><th className="px-3 py-2">EI [%]</th></tr></thead>
                  <tbody className="divide-y divide-line">{Array.from({ length: elongationRowCount }, (_, index) => { const row = aggregateElongation?.rows[index]; return <tr key={index}><td className="px-3 py-2"><input name={`elongationFraction-${index}`} defaultValue={row?.fractionLabel ?? defaults[index] ?? ""} className="input min-w-32" /></td><td className="px-3 py-2"><input name={`elongationRetainedMass-${index}`} type="number" step="0.01" defaultValue={row?.retainedMassG ?? ""} className="input min-w-32" /></td><td className="px-3 py-2"><input name={`elongationLongMass-${index}`} type="number" step="0.01" defaultValue={row?.elongatedMassG ?? ""} className="input min-w-32" /></td><td className="px-3 py-2 font-semibold text-ink">{row ? `${row.elongationPercent}%` : "Save"}</td></tr>; })}<tr className="bg-lab-porcelain"><td className="px-3 py-2 font-semibold text-ink">Total / EI</td><td className="px-3 py-2 font-semibold text-ink">{aggregateElongation?.totalRetainedMassG ?? "Save"}</td><td className="px-3 py-2 font-semibold text-ink">{aggregateElongation?.totalElongatedMassG ?? "Save"}</td><td className="px-3 py-2 font-semibold text-ink">{aggregateElongation ? `${aggregateElongation.elongationIndexPercent}%` : "Save"}</td></tr></tbody>
                </table>
              </div>
              <div className="mt-5"><label className="text-sm font-medium text-ink">Notes</label><textarea name="notes" rows={4} defaultValue={aggregateElongation?.notes} className="input mt-1" /></div>
              <div className="mt-5 flex justify-end"><button className="btn-secondary">Save elongation index data</button></div>
            </div>
          </form>
          <TestActionsSidebar ready={Boolean(aggregateElongation)} activeTest={activeTest} reportId={report?.id} complete={complete} generateReport={generateReport} message={aggregateElongation ? `Elongation index calculated as ${aggregateElongation.elongationIndexPercent}%.` : "Save worksheet data first to calculate elongation index."} technicianName={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
        </div>
      </>
    );
  }

  if (isFlakinessIndexTest) {
    const fractionDefaults = [
      ["100", 100, 0],
      ["80/100", 80, 50],
      ["63/80", 63, 40],
      ["50/63", 50, 31.5],
      ["40/50", 40, 25],
      ["31.5/40", 31.5, 20],
      ["25/31.5", 25, 16],
      ["20/25", 20, 12.5],
      ["16/20", 16, 10],
      ["12.5/16", 12.5, 8],
      ["10/12.5", 10, 6.3],
      ["8/10", 8, 5],
      ["6.3/8", 6.3, 4],
      ["5/6.3", 5, 3.15],
      ["4/5", 4, 2.5]
    ] as const;
    return (
      <>
        <PageHeader
          title={activeTest.testCode}
          description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Flakiness index`}
          action={<StatusBadge status={activeTest.status} />}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitFlakinessIndex} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Indeksi i ciflosjes / Flakiness Index</h2>
              <p className="mt-1 text-sm text-muted">Based on BS EN 933-3:2012. FIi = mi / Ri x 100; final FI = M2 / M1 x 100.</p>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateFlakiness?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateFlakiness?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateFlakiness?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateFlakiness?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateFlakiness?.testingLocation ?? "Laboratori Fiziko-Mekanik / Physical-mechanical laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateFlakiness?.temperature ?? ""} className="input" /></Field>
              <Field label="Humidity"><input name="humidity" defaultValue={aggregateFlakiness?.humidity ?? ""} className="input" /></Field>
            </div>

            <div className="p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Sample Masses</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {[1, 2, 3].map((sampleIndex) => (
                  <div key={sampleIndex} className="rounded-md border border-line p-3">
                    <div className="mb-2 text-sm font-semibold text-ink">Sample {sampleIndex}</div>
                    <Field label="M0 before testing [g]"><input name={`flakeInitialMass-${sampleIndex}`} type="number" step="0.01" defaultValue={aggregateFlakiness?.initialSampleMassesG[sampleIndex - 1] ?? ""} className="input" /></Field>
                    <Field label="Discarded mass [g]"><input name={`flakeDiscardedMass-${sampleIndex}`} type="number" step="0.01" defaultValue={aggregateFlakiness?.discardedMassesG[sampleIndex - 1] ?? ""} className="input" /></Field>
                    <div className="mt-2 text-xs text-muted">M1 before bar sieve: {aggregateFlakiness ? `${aggregateFlakiness.totals.sampleMassBeforeBarSieveG[sampleIndex - 1]} g` : "Save to calculate"}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-end">
                <button type="button" onClick={() => setFlakinessRowCount((count) => count + 1)} className="btn-secondary px-3">Add fraction</button>
              </div>
              <div className="mt-3 overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[1500px] text-left text-sm">
                  <thead className="table-head">
                    <tr>
                      <th className="px-3 py-2">Fraction</th>
                      <th className="px-3 py-2">Sieve [mm]</th>
                      <th className="px-3 py-2">Bar sieve [mm]</th>
                      {[1, 2, 3].map((sampleIndex) => <th key={`r${sampleIndex}`} className="px-3 py-2">Ri sample {sampleIndex} [g]</th>)}
                      {[1, 2, 3].map((sampleIndex) => <th key={`m${sampleIndex}`} className="px-3 py-2">mi sample {sampleIndex} [g]</th>)}
                      {[1, 2, 3].map((sampleIndex) => <th key={`fi${sampleIndex}`} className="px-3 py-2">FIi sample {sampleIndex}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {Array.from({ length: flakinessRowCount }, (_, index) => {
                      const row = aggregateFlakiness?.rows[index];
                      const defaults = fractionDefaults[index] ?? ["", 0, 0];
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2"><input name={`flakeFraction-${index}`} defaultValue={row?.fractionLabel ?? defaults[0]} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`flakeSieveOpening-${index}`} type="number" step="0.01" defaultValue={(row?.sieveOpeningMm ?? defaults[1]) || ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`flakeBarSieve-${index}`} type="number" step="0.01" defaultValue={(row?.barSieveMm ?? defaults[2]) || ""} className="input min-w-24" /></td>
                          {[1, 2, 3].map((sampleIndex) => <td key={`r${sampleIndex}`} className="px-3 py-2"><input name={`flakeRetained-${index}-${sampleIndex}`} type="number" step="0.01" defaultValue={row?.retainedMassesG[sampleIndex - 1] ?? ""} className="input min-w-28" /></td>)}
                          {[1, 2, 3].map((sampleIndex) => <td key={`m${sampleIndex}`} className="px-3 py-2"><input name={`flakePassing-${index}-${sampleIndex}`} type="number" step="0.01" defaultValue={row?.passingBarSieveMassesG[sampleIndex - 1] ?? ""} className="input min-w-28" /></td>)}
                          {[1, 2, 3].map((sampleIndex) => <td key={`fi${sampleIndex}`} className="px-3 py-2 font-semibold text-ink">{row ? `${row.flakinessPercentages[sampleIndex - 1]}%` : "Save"}</td>)}
                        </tr>
                      );
                    })}
                    <tr className="bg-lab-porcelain">
                      <td className="px-3 py-2 font-semibold text-ink" colSpan={3}>Totals / FI</td>
                      {[0, 1, 2].map((index) => <td key={`tr${index}`} className="px-3 py-2 font-semibold text-ink">{aggregateFlakiness?.totals.totalRetainedMassesG[index] ?? "Save"}</td>)}
                      {[0, 1, 2].map((index) => <td key={`tm${index}`} className="px-3 py-2 font-semibold text-ink">{aggregateFlakiness?.totals.totalPassingMassesG[index] ?? "Save"}</td>)}
                      {[0, 1, 2].map((index) => <td key={`tf${index}`} className="px-3 py-2 font-semibold text-ink">{aggregateFlakiness ? `${aggregateFlakiness.totals.sampleFlakinessPercentages[index]}%` : "Save"}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <label className="text-sm font-medium text-ink">Notes</label>
                <textarea name="notes" rows={4} defaultValue={aggregateFlakiness?.notes} className="input mt-1" />
              </div>
              <div className="mt-5 flex justify-end">
                <button className="btn-secondary">Save flakiness data</button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="surface-card p-4">
              <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
              <div className="mt-4 space-y-3">
                <button onClick={complete} disabled={!aggregateFlakiness} className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300">Mark Test as Completed</button>
                <button onClick={generateReport} disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300">Generate Report</button>
                <div className="soft-panel p-3 text-xs text-muted">
                  {aggregateFlakiness ? `Flakiness index calculated as ${aggregateFlakiness.totals.finalFlakinessIndexPercent}%.` : "Save worksheet data first to calculate flakiness index."}
                </div>
                {report ? <Link className="btn-secondary block text-center" href={`/reports/${report.id}`}>Open Report</Link> : null}
              </div>
            </div>
            <div className="surface-card p-4 text-sm">
              <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
              <Info label="Standard" value={activeTest.standard} />
              <Info label="Required test date" value={activeTest.requiredTestDate} />
              <Info label="Report due date" value={activeTest.dueDate} />
              <Info label="Assigned technician" value={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
            </div>
          </aside>
        </div>
      </>
    );
  }

  if (isShapeIndexTest) {
    return (
      <>
        <PageHeader
          title={activeTest.testCode}
          description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Shape index`}
          action={<StatusBadge status={activeTest.status} />}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitShapeIndex} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Përcaktimi i indeksit të formës</h2>
              <p className="mt-1 text-sm text-muted">Shape index according to BS EN 933-4:2008. SI = non-cubical particle mass / test portion mass x 100.</p>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateShapeIndex?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateShapeIndex?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateShapeIndex?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateShapeIndex?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateShapeIndex?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateShapeIndex?.temperature ?? ""} className="input" placeholder="e.g. 22 C" /></Field>
              <Field label="Relative humidity"><input name="humidity" defaultValue={aggregateShapeIndex?.humidity ?? ""} className="input" placeholder="e.g. 50%" /></Field>
            </div>

            <div className="p-5">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Shape Index Fractions</h3>
                  <p className="mt-1 text-sm text-muted">Enter each size fraction and the mass classified as non-cubical.</p>
                </div>
                <button type="button" onClick={() => setShapeRowCount((count) => count + 1)} className="btn-secondary px-3">Add fraction</button>
              </div>
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="table-head">
                    <tr>
                      <th className="px-3 py-2">Fraction</th>
                      <th className="px-3 py-2">Test portion mass M1 [g]</th>
                      <th className="px-3 py-2">Non-cubical mass M2 [g]</th>
                      <th className="px-3 py-2">Shape index [%]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {Array.from({ length: shapeRowCount }, (_, index) => {
                      const row = aggregateShapeIndex?.rows[index];
                      const defaults = ["4/8 mm", "8/16 mm", "16/31.5 mm", "31.5/63 mm"];
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2"><input name={`shapeFraction-${index}`} defaultValue={row?.fractionLabel ?? defaults[index] ?? ""} className="input min-w-32" /></td>
                          <td className="px-3 py-2"><input name={`shapeMass-${index}`} type="number" step="0.01" defaultValue={row?.testPortionMassG ?? ""} className="input min-w-32" /></td>
                          <td className="px-3 py-2"><input name={`shapeNonCubicalMass-${index}`} type="number" step="0.01" defaultValue={row?.nonCubicalMassG ?? ""} className="input min-w-32" /></td>
                          <td className="px-3 py-2 font-semibold text-ink">{row ? `${row.shapeIndexPercent}%` : "Save to calculate"}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-lab-porcelain">
                      <td className="px-3 py-2 font-semibold text-ink">Total / Shape Index</td>
                      <td className="px-3 py-2 font-semibold text-ink">{aggregateShapeIndex?.totalTestPortionMassG ?? "Save"}</td>
                      <td className="px-3 py-2 font-semibold text-ink">{aggregateShapeIndex?.totalNonCubicalMassG ?? "Save"}</td>
                      <td className="px-3 py-2 font-semibold text-ink">{aggregateShapeIndex ? `${aggregateShapeIndex.shapeIndexPercent}%` : "Save"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <label className="text-sm font-medium text-ink">Notes</label>
                <textarea name="notes" rows={4} defaultValue={aggregateShapeIndex?.notes} className="input mt-1" />
              </div>
              <div className="mt-5 flex justify-end">
                <button className="btn-secondary">Save shape index data</button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="surface-card p-4">
              <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
              <div className="mt-4 space-y-3">
                <button onClick={complete} disabled={!aggregateShapeIndex} className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300">Mark Test as Completed</button>
                <button onClick={generateReport} disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300">Generate Report</button>
                <div className="soft-panel p-3 text-xs text-muted">
                  {aggregateShapeIndex ? `Shape index calculated as ${aggregateShapeIndex.shapeIndexPercent}%.` : "Save worksheet data first to calculate shape index."}
                </div>
                {report ? <Link className="btn-secondary block text-center" href={`/reports/${report.id}`}>Open Report</Link> : null}
              </div>
            </div>
            <div className="surface-card p-4 text-sm">
              <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
              <Info label="Standard" value={activeTest.standard} />
              <Info label="Required test date" value={activeTest.requiredTestDate} />
              <Info label="Report due date" value={activeTest.dueDate} />
              <Info label="Assigned technician" value={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
            </div>
          </aside>
        </div>
      </>
    );
  }

  if (isFillerDensityTest) {
    return (
      <>
        <PageHeader
          title={activeTest.testCode}
          description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / Filler specific density`}
          action={<StatusBadge status={activeTest.status} />}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitFillerDensity} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Densiteti specifik i filerit</h2>
              <p className="mt-1 text-sm text-muted">Filler-only pycnometer method based on SL-FP-AG-7.5.1.2f and BS EN 1097-7:2022.</p>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateFillerDensity?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateFillerDensity?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Test method"><input name="testMethod" defaultValue={aggregateFillerDensity?.testMethod ?? "Metoda me piknometer / Pycnometer method"} className="input" /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateFillerDensity?.technicianName ?? "Ing. Alban Kurti"} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateFillerDensity?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateFillerDensity?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateFillerDensity?.temperature ?? ""} className="input" placeholder="e.g. 25 C" /></Field>
              <Field label="Relative humidity"><input name="humidity" defaultValue={aggregateFillerDensity?.humidity ?? ""} className="input" placeholder="e.g. 50%" /></Field>
            </div>

            <div className="p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Particle Density of Filler</h3>
              <p className="mt-1 text-sm text-muted">Formula: rho f = (m1 - m0) / (V - ((m2 - m1) / rho l)).</p>
              <div className="mt-4 overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[1080px] text-left text-sm">
                  <thead className="table-head">
                    <tr>
                      <th className="px-3 py-2">Run</th>
                      <th className="px-3 py-2">T [C]</th>
                      <th className="px-3 py-2">Liquid density rho l</th>
                      <th className="px-3 py-2">m0 empty pycnometer [g]</th>
                      <th className="px-3 py-2">m1 pycnometer + filler [g]</th>
                      <th className="px-3 py-2">m2 pycnometer + filler + liquid [g]</th>
                      <th className="px-3 py-2">V [ml]</th>
                      <th className="px-3 py-2">rho f [Mg/m3]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {[0, 1].map((index) => {
                      const run = aggregateFillerDensity?.runs[index];
                      const runIndex = index + 1;
                      return (
                        <tr key={runIndex}>
                          <td className="px-3 py-2 font-semibold text-ink">Test Result {runIndex}</td>
                          <td className="px-3 py-2"><input name={`fillerTemperatureC-${runIndex}`} type="number" step="0.1" defaultValue={run?.temperatureC ?? 25} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`fillerLiquidDensity-${runIndex}`} type="number" step="0.00001" defaultValue={run?.liquidDensity ?? 0.99707} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`fillerM0-${runIndex}`} type="number" step="0.01" defaultValue={run?.emptyPycnometerMassG ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`fillerM1-${runIndex}`} type="number" step="0.01" defaultValue={run?.pycnometerSampleMassG ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`fillerM2-${runIndex}`} type="number" step="0.01" defaultValue={run?.pycnometerSampleLiquidMassG ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`fillerVolume-${runIndex}`} type="number" step="0.01" defaultValue={run?.pycnometerVolumeMl ?? 50} className="input min-w-24" /></td>
                          <td className="px-3 py-2 font-semibold text-ink">{run ? run.particleDensity : "Save"}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-lab-porcelain">
                      <td className="px-3 py-2 font-semibold text-ink" colSpan={7}>Average particle density of filler at 25 C</td>
                      <td className="px-3 py-2 font-semibold text-ink">{aggregateFillerDensity?.averageParticleDensity ?? "Save"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <label className="text-sm font-medium text-ink">Notes</label>
                <textarea name="notes" rows={4} defaultValue={aggregateFillerDensity?.notes} className="input mt-1" />
              </div>
              <div className="mt-5 flex justify-end">
                <button className="btn-secondary">Save filler density data</button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="surface-card p-4">
              <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
              <div className="mt-4 space-y-3">
                <button onClick={complete} disabled={!aggregateFillerDensity} className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300">Mark Test as Completed</button>
                <button onClick={generateReport} disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300">Generate Report</button>
                <div className="soft-panel p-3 text-xs text-muted">
                  {aggregateFillerDensity ? `Average filler density ${aggregateFillerDensity.averageParticleDensity} Mg/m3.` : "Save worksheet data first to calculate filler density."}
                </div>
                {report ? <Link className="btn-secondary block text-center" href={`/reports/${report.id}`}>Open Report</Link> : null}
              </div>
            </div>
            <div className="surface-card p-4 text-sm">
              <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
              <Info label="Standard" value={activeTest.standard} />
              <Info label="Required test date" value={activeTest.requiredTestDate} />
              <Info label="Report due date" value={activeTest.dueDate} />
              <Info label="Assigned technician" value={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
            </div>
          </aside>
        </div>
      </>
    );
  }

  if (isDensityAbsorptionTest) {
    return (
      <>
        <PageHeader
          title={activeTest.testCode}
          description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / ${sample?.sampleType ?? ""} / Density and absorption`}
          action={<StatusBadge status={activeTest.status} />}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitDensityAbsorption} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Densiteti specifik dhe absorbimi i agregateve</h2>
              <p className="mt-1 text-sm text-muted">Pycnometer method based on SL-FP-AG-7.5.1.2 and BS EN 1097-6:2022.</p>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateDensity?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateDensity?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Test method"><input name="testMethod" defaultValue={aggregateDensity?.testMethod ?? "Metoda me piknometer / Pycnometer method"} className="input" /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateDensity?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateDensity?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateDensity?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateDensity?.temperature ?? ""} className="input" placeholder="e.g. 20.1 C" /></Field>
              <Field label="Relative humidity"><input name="humidity" defaultValue={aggregateDensity?.humidity ?? ""} className="input" placeholder="e.g. 49.6%" /></Field>
            </div>

            <div className="p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Specific Density and Absorption</h3>
              <p className="mt-1 text-sm text-muted">Enter two pycnometer determinations. Absorption and density values are calculated after saving.</p>
              <div className="mt-4 overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[1280px] text-left text-sm">
                  <thead className="table-head">
                    <tr>
                      <th className="px-3 py-2">Sample</th>
                      <th className="px-3 py-2">Water temp [C]</th>
                      <th className="px-3 py-2">Water density</th>
                      <th className="px-3 py-2">A oven dry mass [g]</th>
                      <th className="px-3 py-2">S SSD mass [g]</th>
                      <th className="px-3 py-2">B pycnometer + water [g]</th>
                      <th className="px-3 py-2">C pycnometer + water + aggregate [g]</th>
                      <th className="px-3 py-2">Absorption [%]</th>
                      <th className="px-3 py-2">OD bulk density</th>
                      <th className="px-3 py-2">SSD bulk density</th>
                      <th className="px-3 py-2">Apparent density</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {[0, 1].map((index) => {
                      const specimen = aggregateDensity?.specimens[index];
                      const sampleIndex = index + 1;
                      return (
                        <tr key={sampleIndex}>
                          <td className="px-3 py-2"><input name={`densitySpecimenCode-${sampleIndex}`} defaultValue={specimen?.specimenCode ?? `${sample?.sampleCode ?? "Sample"}/D-${sampleIndex}`} className="input min-w-36" /></td>
                          <td className="px-3 py-2"><input name={`waterTemperatureC-${sampleIndex}`} type="number" step="0.1" defaultValue={specimen?.waterTemperatureC ?? 20} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`waterDensity-${sampleIndex}`} type="number" step="0.001" defaultValue={specimen?.waterDensity ?? 0.998} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`ovenDryMassG-${sampleIndex}`} type="number" step="0.01" defaultValue={specimen?.ovenDryMassG ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`ssdMassG-${sampleIndex}`} type="number" step="0.01" defaultValue={specimen?.ssdMassG ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`pycnometerWaterMassG-${sampleIndex}`} type="number" step="0.01" defaultValue={specimen?.pycnometerWaterMassG ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`pycnometerWaterSampleMassG-${sampleIndex}`} type="number" step="0.01" defaultValue={specimen?.pycnometerWaterSampleMassG ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2 font-semibold text-ink">{specimen ? `${specimen.absorptionPercent}%` : "Save"}</td>
                          <td className="px-3 py-2 font-semibold text-ink">{specimen ? specimen.ovenDryBulkDensity : "Save"}</td>
                          <td className="px-3 py-2 font-semibold text-ink">{specimen ? specimen.ssdBulkDensity : "Save"}</td>
                          <td className="px-3 py-2 font-semibold text-ink">{specimen ? specimen.apparentDensity : "Save"}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-lab-porcelain">
                      <td className="px-3 py-2 font-semibold text-ink" colSpan={7}>Average values</td>
                      <td className="px-3 py-2 font-semibold text-ink">{aggregateDensity ? `${aggregateDensity.averageAbsorptionPercent}%` : "Save"}</td>
                      <td className="px-3 py-2 font-semibold text-ink">{aggregateDensity?.averageOvenDryBulkDensity ?? "Save"}</td>
                      <td className="px-3 py-2 font-semibold text-ink">{aggregateDensity?.averageSsdBulkDensity ?? "Save"}</td>
                      <td className="px-3 py-2 font-semibold text-ink">{aggregateDensity?.averageApparentDensity ?? "Save"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <label className="text-sm font-medium text-ink">Notes</label>
                <textarea name="notes" rows={4} defaultValue={aggregateDensity?.notes} className="input mt-1" />
              </div>
              <div className="mt-5 flex justify-end">
                <button className="btn-secondary">Save density and absorption data</button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="surface-card p-4">
              <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
              <div className="mt-4 space-y-3">
                <button onClick={complete} disabled={!aggregateDensity} className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300">Mark Test as Completed</button>
                <button onClick={generateReport} disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300">Generate Report</button>
                <div className="soft-panel p-3 text-xs text-muted">
                  {aggregateDensity ? `Average absorption ${aggregateDensity.averageAbsorptionPercent}%, apparent density ${aggregateDensity.averageApparentDensity}.` : "Save the worksheet data first to calculate density and absorption."}
                </div>
                {report ? <Link className="btn-secondary block text-center" href={`/reports/${report.id}`}>Open Report</Link> : null}
              </div>
            </div>
            <div className="surface-card p-4 text-sm">
              <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
              <Info label="Standard" value={activeTest.standard} />
              <Info label="Required test date" value={activeTest.requiredTestDate} />
              <Info label="Report due date" value={activeTest.dueDate} />
              <Info label="Assigned technician" value={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
            </div>
          </aside>
        </div>
      </>
    );
  }

  if (isAcvTest) {
    return (
      <>
        <PageHeader
          title={activeTest.testCode}
          description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / ${sample?.sampleType ?? ""} / ACV`}
          action={<StatusBadge status={activeTest.status} />}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitAcv} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Përcaktimi i rezistencës në thërrmim (ACV)</h2>
              <p className="mt-1 text-sm text-muted">Aggregate Crushing Value based on SL-FP-AG-7.5.1.14 and BS EN 1097-2:2020. ACV is calculated as W2 / W1 x 100.</p>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateAcv?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateAcv?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateAcv?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateAcv?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateAcv?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateAcv?.temperature ?? ""} className="input" placeholder="e.g. 22 C" /></Field>
              <Field label="Relative humidity"><input name="humidity" defaultValue={aggregateAcv?.humidity ?? ""} className="input" placeholder="e.g. 50%" /></Field>
            </div>

            <div className="p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Measured Parameters</h3>
              <p className="mt-1 text-sm text-muted">Enter two ACV determinations. The mean value is calculated after saving.</p>
              <div className="mt-4 overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="table-head">
                    <tr>
                      <th className="px-3 py-2">Run</th>
                      <th className="px-3 py-2">W1 total dry sample mass [g]</th>
                      <th className="px-3 py-2">W2 passing 2.36 mm sieve mass [g]</th>
                      <th className="px-3 py-2">ACV [%]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {[
                      { label: "Test Result 1", run: aggregateAcv?.test1, index: 1 },
                      { label: "Test Result 2", run: aggregateAcv?.test2, index: 2 }
                    ].map(({ label, run, index }) => (
                      <tr key={index}>
                        <td className="px-3 py-2 font-semibold text-ink">{label}</td>
                        <td className="px-3 py-2"><input name={`acvW1-${index}`} type="number" step="0.01" defaultValue={run?.totalDrySampleMassG ?? ""} className="input min-w-36" /></td>
                        <td className="px-3 py-2"><input name={`acvW2-${index}`} type="number" step="0.01" defaultValue={run?.passingTwoPointThirtySixMmMassG ?? ""} className="input min-w-36" /></td>
                        <td className="px-3 py-2 font-semibold text-ink">{run ? `${run.acvPercent}%` : "Save to calculate"}</td>
                      </tr>
                    ))}
                    <tr className="bg-lab-porcelain">
                      <td className="px-3 py-2 font-semibold text-ink" colSpan={3}>Mean aggregate crushing value</td>
                      <td className="px-3 py-2 font-semibold text-ink">{aggregateAcv ? `${aggregateAcv.averageAcvPercent}%` : "Save to calculate"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <label className="text-sm font-medium text-ink">Notes</label>
                <textarea name="notes" rows={4} defaultValue={aggregateAcv?.notes} className="input mt-1" />
              </div>
              <div className="mt-5 flex justify-end">
                <button className="btn-secondary">Save ACV data</button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="surface-card p-4">
              <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
              <div className="mt-4 space-y-3">
                <button onClick={complete} disabled={!aggregateAcv} className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300">Mark Test as Completed</button>
                <button onClick={generateReport} disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300">Generate Report</button>
                <div className="soft-panel p-3 text-xs text-muted">
                  {aggregateAcv ? `Mean ACV calculated as ${aggregateAcv.averageAcvPercent}%.` : "Save the worksheet data first to calculate ACV."}
                </div>
                {report ? <Link className="btn-secondary block text-center" href={`/reports/${report.id}`}>Open Report</Link> : null}
              </div>
            </div>
            <div className="surface-card p-4 text-sm">
              <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
              <Info label="Standard" value={activeTest.standard} />
              <Info label="Required test date" value={activeTest.requiredTestDate} />
              <Info label="Report due date" value={activeTest.dueDate} />
              <Info label="Assigned technician" value={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
            </div>
          </aside>
        </div>
      </>
    );
  }

  if (isFreezeThawTest) {
    return (
      <>
        <PageHeader
          title={activeTest.testCode}
          description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / ${sample?.sampleType ?? ""} / Freeze-thaw cycles`}
          action={<StatusBadge status={activeTest.status} />}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitFreezeThaw} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Përcaktimi i rezistencës ndaj cikleve ngrirje-shkrirje</h2>
              <p className="mt-1 text-sm text-muted">Based on SL-FP-AG-7.5.1.13 and BS EN 1367-1:2007. Mass loss is calculated as F = (M1 - M2) / M1 x 100.</p>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateFreezeThaw?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateFreezeThaw?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Total freeze-thaw cycles"><input name="totalCycles" type="number" defaultValue={aggregateFreezeThaw?.totalCycles ?? ""} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateFreezeThaw?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateFreezeThaw?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateFreezeThaw?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-mechanical laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateFreezeThaw?.temperature ?? ""} className="input" placeholder="e.g. 22 C" /></Field>
              <Field label="Relative humidity"><input name="humidity" defaultValue={aggregateFreezeThaw?.humidity ?? ""} className="input" placeholder="e.g. 50%" /></Field>
            </div>

            <div className="p-5">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Measured Parameters</h3>
                  <p className="mt-1 text-sm text-muted">The report expects three specimens, but extra rows can be added if needed.</p>
                </div>
                <button type="button" onClick={() => setFreezeThawRowCount((count) => count + 1)} className="btn-secondary px-3">Add specimen</button>
              </div>
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[1400px] text-left text-sm">
                  <thead className="table-head">
                    <tr>
                      <th className="px-3 py-2">Specimen</th>
                      <th className="px-3 py-2">Dmax [mm]</th>
                      <th className="px-3 py-2">M1 initial dry mass [g]</th>
                      <th className="px-3 py-2">Washing sieve [mm]</th>
                      <th className="px-3 py-2">M2 final dry mass [g]</th>
                      <th className="px-3 py-2">F mass loss [%]</th>
                      <th className="px-3 py-2">Particles before</th>
                      <th className="px-3 py-2">Split particles</th>
                      <th className="px-3 py-2">Cracked particles</th>
                      <th className="px-3 py-2">Flaked particles</th>
                      <th className="px-3 py-2">Particles after</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {Array.from({ length: freezeThawRowCount }, (_, index) => {
                      const specimen = aggregateFreezeThaw?.specimens[index];
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2"><input name={`freezeSpecimenCode-${index}`} defaultValue={specimen?.specimenCode ?? `${sample?.sampleCode ?? "Sample"}/FT-${index + 1}`} className="input min-w-36" /></td>
                          <td className="px-3 py-2"><input name={`maximumAggregateSizeMm-${index}`} type="number" step="0.01" defaultValue={specimen?.maximumAggregateSizeMm ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`initialDryMassG-${index}`} type="number" step="0.01" defaultValue={specimen?.initialDryMassG ?? ""} className="input min-w-32" /></td>
                          <td className="px-3 py-2"><input name={`washingSieveSizeMm-${index}`} type="number" step="0.01" defaultValue={specimen?.washingSieveSizeMm ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`finalDryMassG-${index}`} type="number" step="0.01" defaultValue={specimen?.finalDryMassG ?? ""} className="input min-w-32" /></td>
                          <td className="px-3 py-2 font-semibold text-ink">{specimen ? `${specimen.massLossPercent}%` : "Save to calculate"}</td>
                          <td className="px-3 py-2"><input name={`particlesBefore-${index}`} type="number" defaultValue={specimen?.particlesBefore ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`splitParticles-${index}`} type="number" defaultValue={specimen?.splitParticles ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`crackedParticles-${index}`} type="number" defaultValue={specimen?.crackedParticles ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`flakedParticles-${index}`} type="number" defaultValue={specimen?.flakedParticles ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`particlesAfter-${index}`} type="number" defaultValue={specimen?.particlesAfter ?? ""} className="input min-w-28" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_280px]">
                <div>
                  <label className="text-sm font-medium text-ink">Notes</label>
                  <textarea name="notes" rows={4} defaultValue={aggregateFreezeThaw?.notes} className="input mt-1" />
                </div>
                <div className="soft-panel p-4 text-sm">
                  <InfoInline label="Average mass loss" value={aggregateFreezeThaw ? `${aggregateFreezeThaw.averageMassLossPercent}%` : "Save to calculate"} />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button className="btn-secondary">Save freeze-thaw data</button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="surface-card p-4">
              <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
              <div className="mt-4 space-y-3">
                <button onClick={complete} disabled={!aggregateFreezeThaw} className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300">Mark Test as Completed</button>
                <button onClick={generateReport} disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300">Generate Report</button>
                <div className="soft-panel p-3 text-xs text-muted">
                  {aggregateFreezeThaw ? `Average freeze-thaw mass loss calculated as ${aggregateFreezeThaw.averageMassLossPercent}%.` : "Save the worksheet data first to calculate freeze-thaw mass loss."}
                </div>
                {report ? <Link className="btn-secondary block text-center" href={`/reports/${report.id}`}>Open Report</Link> : null}
              </div>
            </div>
            <div className="surface-card p-4 text-sm">
              <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
              <Info label="Standard" value={activeTest.standard} />
              <Info label="Required test date" value={activeTest.requiredTestDate} />
              <Info label="Report due date" value={activeTest.dueDate} />
              <Info label="Assigned technician" value={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
            </div>
          </aside>
        </div>
      </>
    );
  }

  if (isLosAngelesTest) {
    return (
      <>
        <PageHeader
          title={activeTest.testCode}
          description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / ${sample?.sampleType ?? ""} / Los Angeles`}
          action={<StatusBadge status={activeTest.status} />}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitLosAngeles} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Përcaktimi i humbjes në fragmentim (Los Angeles test)</h2>
              <p className="mt-1 text-sm text-muted">Translated from SL-FP-AG-7.5.1.12. Fragmentation loss is calculated from the total test mass and retained mass on the 1.6 mm sieve.</p>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateLosAngeles?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateLosAngeles?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateLosAngeles?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateLosAngeles?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateLosAngeles?.testingLocation ?? "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateLosAngeles?.temperature ?? ""} className="input" placeholder="e.g. 22 C" /></Field>
              <Field label="Relative humidity"><input name="humidity" defaultValue={aggregateLosAngeles?.humidity ?? ""} className="input" placeholder="e.g. 50%" /></Field>
            </div>

            <div className="p-5">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Test Fractions</h3>
                  <p className="mt-1 text-sm text-muted">Enter the passing and retaining sieve fractions used for the Los Angeles drum test.</p>
                </div>
                <button type="button" onClick={() => setLosAngelesRowCount((count) => count + 1)} className="btn-secondary px-3">Add fraction</button>
              </div>
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="table-head">
                    <tr>
                      <th className="px-3 py-2">Passing sieve [mm]</th>
                      <th className="px-3 py-2">Retaining sieve [mm]</th>
                      <th className="px-3 py-2">No. of spheres used</th>
                      <th className="px-3 py-2">Fraction mass [g]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {Array.from({ length: losAngelesRowCount }, (_, index) => {
                      const row = aggregateLosAngeles?.rows[index];
                      const defaultPassing = row?.passingSieveMm ?? [14, 12.5][index] ?? "";
                      const defaultRetaining = row?.retainingSieveMm ?? [12.5, 10][index] ?? "";
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2"><input name={`passingSieveMm-${index}`} type="number" step="0.001" defaultValue={defaultPassing} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`retainingSieveMm-${index}`} type="number" step="0.001" defaultValue={defaultRetaining} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`sphereCount-${index}`} type="number" step="1" defaultValue={row?.sphereCount ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`fractionMassG-${index}`} type="number" step="0.1" defaultValue={row?.fractionMassG ?? ""} className="input min-w-32" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Mass retained on 1.6 mm sieve, m [g]"><input name="retainedOnOnePointSixMmG" type="number" step="0.1" defaultValue={aggregateLosAngeles?.retainedOnOnePointSixMmG ?? ""} className="input" /></Field>
                <div className="soft-panel p-4 text-sm">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <InfoInline label="Total m0" value={aggregateLosAngeles ? `${aggregateLosAngeles.totalMassG} g` : "Save to calculate"} />
                    <InfoInline label="Passing m1" value={aggregateLosAngeles ? `${aggregateLosAngeles.passingOnePointSixMmG} g` : "Save to calculate"} />
                    <InfoInline label="LA loss" value={aggregateLosAngeles ? `${aggregateLosAngeles.fragmentationLossPercent}%` : "Save to calculate"} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-ink">Notes</label>
                  <textarea name="notes" rows={4} defaultValue={aggregateLosAngeles?.notes} className="input mt-1" />
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button className="btn-secondary">Save Los Angeles data</button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="surface-card p-4">
              <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
              <div className="mt-4 space-y-3">
                <button onClick={complete} disabled={!aggregateLosAngeles} className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300">Mark Test as Completed</button>
                <button onClick={generateReport} disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300">Generate Report</button>
                <div className="soft-panel p-3 text-xs text-muted">
                  {aggregateLosAngeles ? `Fragmentation loss calculated as ${aggregateLosAngeles.fragmentationLossPercent}%.` : "Save the worksheet data first to calculate Los Angeles fragmentation loss."}
                </div>
                {report ? <Link className="btn-secondary block text-center" href={`/reports/${report.id}`}>Open Report</Link> : null}
              </div>
            </div>
            <div className="surface-card p-4 text-sm">
              <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
              <Info label="Standard" value={activeTest.standard} />
              <Info label="Required test date" value={activeTest.requiredTestDate} />
              <Info label="Report due date" value={activeTest.dueDate} />
              <Info label="Assigned technician" value={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
            </div>
          </aside>
        </div>
      </>
    );
  }

  if (isAggregateChemicalTest) {
    return (
      <>
        <PageHeader
          title={activeTest.testCode}
          description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / ${sample?.sampleType ?? ""} / Klorure dhe sulfate në agregate`}
          action={<StatusBadge status={activeTest.status} />}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitAggregateChemical} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Përcaktimi i klorureve dhe sulfateve në agregate</h2>
              <p className="mt-1 text-sm text-muted">Chemical analysis based on SL-FP-AG-7.5.1.10 and BS EN 1744-1:2009+A1:2012.</p>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregateChemical?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregateChemical?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregateChemical?.technicianName ?? "Ing./Eng. Anxhela KANTO"} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregateChemical?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregateChemical?.testingLocation ?? "01/B Laboratori Kimik / Chemical laboratory"} className="input" /></Field>
              <Field label="Temperature"><input name="temperature" defaultValue={aggregateChemical?.temperature ?? ""} className="input" placeholder="e.g. 22 C" /></Field>
              <Field label="Relative humidity"><input name="humidity" defaultValue={aggregateChemical?.humidity ?? ""} className="input" placeholder="e.g. 50%" /></Field>
            </div>

            <ChemicalSection
              title="Water soluble chlorides"
              subtitle="Mohr worksheet calculation: Cl- = 0.01 x 0.03545 x V8 x W x 4"
              headers={["AgNO3 volume V8 [ml]", "Water / aggregate ratio W [g/g]", "Cl- [%]"]}
              rows={[aggregateChemical?.chlorideTest1, aggregateChemical?.chlorideTest2]}
              names={(index) => [`chlorideV8-${index}`, `chlorideW-${index}`]}
              values={(row) => [row?.silverNitrateVolumeMl, row?.waterAggregateRatio, row?.chloridePercent]}
            />

            <ChemicalSection
              title="Water soluble sulfates SO3"
              subtitle="Worksheet calculation: m3 = m1 - m0, SO3 = 2 x W x 0.343 x m3"
              headers={["Empty crucible m0 [g]", "Water / aggregate ratio W", "Crucible + calcined m1 [g]", "Material m3 [g]", "SO3 [%]"]}
              rows={[aggregateChemical?.waterSulfateTest1, aggregateChemical?.waterSulfateTest2]}
              names={(index) => [`waterSulfateM0-${index}`, `waterSulfateW-${index}`, `waterSulfateM1-${index}`]}
              values={(row) => [row?.emptyCrucibleMassG, row?.waterAggregateRatio, row?.cruciblePlusCalcinedMassG, row?.calcinedMaterialMassG, row?.sulfateSo3Percent]}
            />

            <ChemicalSection
              title="Acid soluble sulfates SO3 / SO4"
              subtitle="Worksheet calculation: m3 = m1 - m0, SO3 = m3 / m6 x 34.3; SO4 is calculated from SO3."
              headers={["Sample mass m6 [g]", "Empty crucible m0 [g]", "Crucible + calcined m1 [g]", "Material m3 [g]", "SO3 [%]", "SO4 [%]"]}
              rows={[aggregateChemical?.acidSulfateTest1, aggregateChemical?.acidSulfateTest2]}
              names={(index) => [`acidSulfateM6-${index}`, `acidSulfateM0-${index}`, `acidSulfateM1-${index}`]}
              values={(row) => [row?.sampleMassG, row?.emptyCrucibleMassG, row?.cruciblePlusCalcinedMassG, row?.calcinedMaterialMassG, row?.sulfateSo3Percent, row?.sulfateSo4Percent]}
            />

            <div className="grid gap-4 border-t border-line p-5 md:grid-cols-2">
              <Field label="Total sulfur content [%]"><input name="totalSulfurPercent" type="number" step="0.001" defaultValue={aggregateChemical?.results.totalSulfurPercent ?? ""} className="input" /></Field>
              <Field label="Loss on ignition [%]"><input name="lossOnIgnitionPercent" type="number" step="0.001" defaultValue={aggregateChemical?.results.lossOnIgnitionPercent ?? ""} className="input" /></Field>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-ink">Notes</label>
                <textarea name="notes" rows={4} defaultValue={aggregateChemical?.notes} className="input mt-1" />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button className="btn-secondary">Save chloride and sulfate data</button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="surface-card p-4">
              <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
              <div className="mt-4 space-y-3">
                <button onClick={complete} disabled={!aggregateChemical} className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300">Mark Test as Completed</button>
                <button onClick={generateReport} disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300">Generate Report</button>
                <div className="soft-panel p-3 text-xs text-muted">
                  {aggregateChemical ? "Calculated chloride and sulfate results are ready for the chemical report." : "Save the worksheet data first to calculate report results."}
                </div>
                {report ? <Link className="btn-secondary block text-center" href={`/reports/${report.id}`}>Open Report</Link> : null}
              </div>
            </div>
            <div className="surface-card p-4 text-sm">
              <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
              <Info label="Standard" value={activeTest.standard} />
              <Info label="Required test date" value={activeTest.requiredTestDate} />
              <Info label="Report due date" value={activeTest.dueDate} />
              <Info label="Assigned technician" value={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
            </div>
          </aside>
        </div>
      </>
    );
  }

  if (isAggregateTest) {
    return (
      <>
        <PageHeader
          title={activeTest.testCode}
          description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / ${sample?.sampleType ?? ""} / Granulometri sipas BS EN`}
          action={<StatusBadge status={activeTest.status} />}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitAggregate} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Granulometri sipas BS EN</h2>
              <p className="mt-1 text-sm text-muted">Aggregate particle size distribution by washing and sieving, based on SL-FP-AG-7.5.1.1a.</p>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample type"><input className="input bg-lab-porcelain" value={sample?.sampleType ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={aggregate?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={aggregate?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Sample mass before testing [g]"><input name="sampleMassG" type="number" step="0.01" required defaultValue={aggregate?.sampleMassG ?? ""} className="input" /></Field>
              <Field label="Test"><input className="input bg-lab-porcelain" value="Determination of particle size distribution. Sieving method" readOnly /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Test method"><input name="testMethod" defaultValue={aggregate?.testMethod ?? "Larje dhe sitosje / Washing and sieving"} className="input" /></Field>
              <Field label="Technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={aggregate?.technicianName ?? "Ing./Eng."} /></Field>
              <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={aggregate?.checkedBy ?? "Ing./Eng. Besiana ALLIU"} /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={aggregate?.testingLocation ?? "01/A Lab. Fiziko-Mekanik / Physical-mechanical laboratory"} className="input" /></Field>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-2">
              <Field label="Temperature"><input name="temperature" defaultValue={aggregate?.temperature ?? ""} className="input" placeholder="e.g. 21.9 C" /></Field>
              <Field label="Relative humidity"><input name="humidity" defaultValue={aggregate?.humidity ?? ""} className="input" placeholder="e.g. 49.8%" /></Field>
            </div>

            <div className="p-5">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Sieve Analysis</h3>
                  <p className="mt-1 text-sm text-muted">Enter mass retained on each sieve. Progressive retained mass, retained percent, and cumulative passing are calculated after saving.</p>
                </div>
                <button type="button" onClick={() => setAggregateRowCount((count) => count + 1)} className="btn-secondary px-3">Add sieve</button>
              </div>
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="table-head">
                    <tr>
                      <th className="px-3 py-2">Sieve [mm]</th>
                      <th className="px-3 py-2">Retained mass [g]</th>
                      <th className="px-3 py-2">Progressive retained mass [g]</th>
                      <th className="px-3 py-2">Progressive retained [%]</th>
                      <th className="px-3 py-2">Cumulative passing [%]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {Array.from({ length: aggregateRowCount }, (_, index) => {
                      const row = aggregate?.rows[index];
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2"><input name={`sieveSizeMm-${index}`} type="number" step="0.001" defaultValue={row?.sieveSizeMm ?? aggregateSieveSizes[index] ?? ""} className="input min-w-28" /></td>
                          <td className="px-3 py-2"><input name={`retainedMassG-${index}`} type="number" step="0.01" defaultValue={row?.retainedMassG ?? ""} className="input min-w-32" /></td>
                          <td className="px-3 py-2 font-semibold text-ink">{row ? row.cumulativeRetainedMassG : "Save to calculate"}</td>
                          <td className="px-3 py-2 font-semibold text-ink">{row ? `${row.cumulativeRetainedPercent}%` : "Save to calculate"}</td>
                          <td className="px-3 py-2 font-semibold text-ink">{row ? `${row.cumulativePassingPercent}%` : "Save to calculate"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <label className="text-sm font-medium text-ink">Notes</label>
                <textarea name="notes" rows={4} defaultValue={aggregate?.notes} className="input mt-1" />
              </div>
              <div className="mt-5 flex justify-end">
                <button className="btn-secondary">Save granulometry data</button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="surface-card p-4">
              <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
              <div className="mt-4 space-y-3">
                <button onClick={complete} disabled={!aggregate} className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300">Mark Test as Completed</button>
                <button onClick={generateReport} disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300">Generate Report</button>
                <div className="soft-panel p-3 text-xs text-muted">{aggregate?.rows.length ?? 0} sieve row{(aggregate?.rows.length ?? 0) === 1 ? "" : "s"} saved. The report uses BS EN cumulative passing calculations.</div>
                {report ? <Link className="btn-secondary block text-center" href={`/reports/${report.id}`}>Open Report</Link> : null}
              </div>
            </div>
            <div className="surface-card p-4 text-sm">
              <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
              <Info label="Standard" value={activeTest.standard} />
              <Info label="Required test date" value={activeTest.requiredTestDate} />
              <Info label="Report due date" value={activeTest.dueDate} />
              <Info label="Assigned technician" value={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
            </div>
          </aside>
        </div>
      </>
    );
  }

  if (isSteelTest) {
    return (
      <>
        <PageHeader
          title={activeTest.testCode}
          description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / ${sample?.quantity ?? activeTest.cubeCount} rebar specimen${(sample?.quantity ?? activeTest.cubeCount) === 1 ? "" : "s"}`}
          action={<StatusBadge status={activeTest.status} />}
        />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <form onSubmit={submitSteel} className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
              <h2 className="mt-1 text-lg font-semibold text-ink">Determination of Physical-Mechanical Characteristics of Steel Rebar</h2>
              <p className="mt-1 text-sm text-muted">Translated from SL-FP-H-7.5.1.1 Rez. ne terheqje. One test sitting can include many specimens with different diameters.</p>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
              <Field label="Sample name"><input className="input bg-lab-porcelain" value={sample?.sampleDescription ?? ""} readOnly /></Field>
              <Field label="Sample received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
              <Field label="Supply date"><input name="supplyDate" type="date" defaultValue={steel?.supplyDate ?? sample?.dateReceived} className="input" /></Field>
              <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={steel?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={steel?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
              <Field label="Test"><input className="input bg-lab-porcelain" value="Physical-mechanical tensile characteristics of steel rebar" readOnly /></Field>
              <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
              <Field label="Assigned technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={steel?.technicianName ?? "Astrit Prethi"} /></Field>
              <div className="md:col-span-3">
                <label className="text-sm font-medium text-ink">Equipment used</label>
                <input
                  name="equipmentUsed"
                  required
                  defaultValue={steel?.equipmentUsed ?? "Steel tensile testing press, electronic balance, caliper"}
                  className="input mt-1"
                />
              </div>
            </div>

            <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
              <div className="md:col-span-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Laboratory Environmental Conditions</h3>
              </div>
              <Field label="Temperature"><input name="temperature" defaultValue={steel?.temperature ?? ""} className="input" placeholder="e.g. 22 C" /></Field>
              <Field label="Humidity"><input name="humidity" defaultValue={steel?.humidity ?? ""} className="input" placeholder="e.g. 55%" /></Field>
              <Field label="Testing location"><input name="testingLocation" defaultValue={steel?.testingLocation ?? ""} className="input" placeholder="Steel tensile area" /></Field>
            </div>

            <div className="p-5">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Physical Characteristics of the Specimens</h3>
                  <p className="mt-1 text-sm text-muted">Enter at least three specimens for each diameter where applicable. Strength and elongation are calculated after saving.</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSteelRowCount((count) => count + 1)} className="btn-secondary px-3">Add specimen</button>
                  <button type="button" onClick={() => setSteelRowCount((count) => Math.max(1, count - 1))} className="btn-secondary px-3">Remove row</button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="w-full min-w-[1500px] text-left text-sm">
                  <thead className="table-head">
                    <tr>
                      <th className="px-3 py-2">Specimen code</th>
                      <th className="px-3 py-2">Nominal Ø [mm]</th>
                      <th className="px-3 py-2">Actual Ø [mm]</th>
                      <th className="px-3 py-2">Weight [g]</th>
                      <th className="px-3 py-2">Total length Lt [mm]</th>
                      <th className="px-3 py-2">Initial Lo [mm]</th>
                      <th className="px-3 py-2">Final Lu [mm]</th>
                      <th className="px-3 py-2">Yield load Fe [kN]</th>
                      <th className="px-3 py-2">Ultimate load Fm [kN]</th>
                      <th className="px-3 py-2">Post-test Ø [mm]</th>
                      <th className="px-3 py-2">Yield strength [MPa]</th>
                      <th className="px-3 py-2">Tensile strength [MPa]</th>
                      <th className="px-3 py-2">Elongation [%]</th>
                      <th className="px-3 py-2">Fracture type</th>
                      <th className="px-3 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {Array.from({ length: steelRowCount }, (_, index) => {
                      const specimen = steel?.specimens[index];
                      const diameterDefaults = [8, 8, 8, 12, 12, 12, 16, 16, 16];
                      const nominalDiameter = specimen?.nominalDiameterMm ?? diameterDefaults[index] ?? "";
                      const defaultCode = specimen?.specimenCode ?? `${sample?.sampleCode ?? "Sample"}/RB-${index + 1}`;
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2"><input name={`specimenCode-${index}`} defaultValue={defaultCode} className="input min-w-36" /></td>
                          <td className="px-3 py-2"><input name={`nominalDiameterMm-${index}`} type="number" step="0.01" defaultValue={nominalDiameter} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`actualDiameterMm-${index}`} type="number" step="0.01" defaultValue={specimen?.actualDiameterMm ?? nominalDiameter} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`weightG-${index}`} type="number" step="0.01" defaultValue={specimen?.weightG ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`totalLengthMm-${index}`} type="number" step="0.01" defaultValue={specimen?.totalLengthMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`initialGaugeLengthMm-${index}`} type="number" step="0.01" defaultValue={specimen?.initialGaugeLengthMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`finalGaugeLengthMm-${index}`} type="number" step="0.01" defaultValue={specimen?.finalGaugeLengthMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`yieldLoadKn-${index}`} type="number" step="0.01" defaultValue={specimen?.yieldLoadKn ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`ultimateLoadKn-${index}`} type="number" step="0.01" defaultValue={specimen?.ultimateLoadKn ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2"><input name={`postTestDiameterMm-${index}`} type="number" step="0.01" defaultValue={specimen?.postTestDiameterMm ?? ""} className="input min-w-24" /></td>
                          <td className="px-3 py-2 font-semibold text-ink">{specimen ? `${specimen.yieldStrengthMpa} MPa` : "Save to calculate"}</td>
                          <td className="px-3 py-2 font-semibold text-ink">{specimen ? `${specimen.tensileStrengthMpa} MPa` : "Save to calculate"}</td>
                          <td className="px-3 py-2 font-semibold text-ink">{specimen ? `${specimen.elongationPercent}%` : "Save to calculate"}</td>
                          <td className="px-3 py-2"><input name={`fractureType-${index}`} defaultValue={specimen?.fractureType ?? ""} className="input min-w-40" /></td>
                          <td className="px-3 py-2"><input name={`specimenNotes-${index}`} defaultValue={specimen?.notes ?? ""} className="input min-w-40" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-ink">General notes</label>
                  <textarea name="notes" rows={4} defaultValue={steel?.notes} className="input mt-1" />
                </div>
                <Field label="Checked by"><EmployeeSelect name="checkedBy" employees={activeEmployees} value={steel?.checkedBy ?? ""} /></Field>
              </div>

              <div className="mt-5 flex justify-end">
                <button className="btn-secondary">Save steel tensile data</button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="surface-card p-4">
              <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
              <div className="mt-4 space-y-3">
                <button
                  onClick={complete}
                  disabled={!steel}
                  className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Mark Test as Completed
                </button>
                <button
                  onClick={generateReport}
                  disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Generate {steelReportCount} Report{steelReportCount === 1 ? "" : "s"}
                </button>
                <div className="soft-panel p-3 text-xs text-muted">
                  {steel?.specimens.length ?? 0} specimen{(steel?.specimens.length ?? 0) === 1 ? "" : "s"} saved. Reports split by diameter with a maximum of 3 specimens per report.
                </div>
                {report ? <Link className="btn-secondary block text-center" href={`/reports/${report.id}`}>Open Report</Link> : null}
              </div>
            </div>
            <div className="surface-card p-4 text-sm">
              <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
              <Info label="Standard" value={activeTest.standard} />
              <Info label="Required test date" value={activeTest.requiredTestDate} />
              <Info label="Report due date" value={activeTest.dueDate} />
              <Info label="Priority" value={activeTest.priority} />
              <Info label="Assigned technician" value={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
            </div>
          </aside>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={activeTest.testCode}
        description={`${client?.clientName ?? ""} / ${project?.projectName ?? ""} / ${sample?.sampleCode ?? ""} / ${activeTest.cubeCount} cube${activeTest.cubeCount === 1 ? "" : "s"} at ${activeTest.scheduledAgeDays} days`}
        action={<StatusBadge status={activeTest.status} />}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="surface-card">
          <div className="border-b border-line bg-lab-porcelain px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lab-burgundy">Work Sheet</div>
            <h2 className="mt-1 text-lg font-semibold text-ink">Determination of Physical-Mechanical Characteristics of Concrete Cubes</h2>
            <p className="mt-1 text-sm text-muted">Translated from SL-FP-B-7.5.1.6 Rez. ne shtypje. One test can contain many cube specimens for the same client and project.</p>
          </div>

          <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
            <Field label="Register number"><input className="input bg-lab-porcelain" value={sample?.sampleCode ?? ""} readOnly /></Field>
            <Field label="Samples received in lab"><input className="input bg-lab-porcelain" value={sample?.dateReceived ?? ""} readOnly /></Field>
            <Field label="Casting date"><input name="castingDate" type="date" required defaultValue={concrete?.castingDate ?? "2026-04-03"} className="input" /></Field>
            <Field label="Testing start date"><input name="testStartDate" type="date" defaultValue={concrete?.testStartDate ?? activeTest.requiredTestDate} className="input" /></Field>
            <Field label="Testing end date"><input name="testEndDate" type="date" defaultValue={concrete?.testEndDate ?? activeTest.requiredTestDate} className="input" /></Field>
            <Field label="Test date for report"><input name="testDate" type="date" required defaultValue={concrete?.testDate ?? activeTest.requiredTestDate} className="input" /></Field>
            <Field label="Test"><input className="input bg-lab-porcelain" value="Compressive strength of concrete cubes" readOnly /></Field>
            <Field label="Applied standard"><input className="input bg-lab-porcelain" value={activeTest.standard} readOnly /></Field>
            <Field label="Assigned technician"><EmployeeSelect name="technicianName" employees={activeEmployees} required value={concrete?.technicianName ?? "Youssef Khalil"} /></Field>
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-ink">Equipment used</label>
              <input
                name="machineUsed"
                required
                defaultValue={concrete?.machineUsed ?? "Electronic balance max. 30000 g; metal ruler/caliper; Controls 2000 kN concrete press"}
                className="input mt-1"
              />
            </div>
          </div>

          <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
            <div className="md:col-span-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Laboratory Environmental Conditions</h3>
            </div>
            <Field label="Temperature"><input name="temperature" defaultValue={concrete?.temperature ?? ""} className="input" placeholder="e.g. 22 C" /></Field>
            <Field label="Humidity"><input name="humidity" defaultValue={concrete?.humidity ?? ""} className="input" placeholder="e.g. 55%" /></Field>
            <Field label="Testing location"><input name="testingLocation" defaultValue={concrete?.testingLocation ?? ""} className="input" placeholder="Laboratory room / press area" /></Field>
          </div>

          <div className="p-5">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Physical Characteristics of the Specimens</h3>
                <p className="mt-1 text-sm text-muted">Strength is calculated as load divided by loaded area for each cube.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setRowCount((count) => count + 1)} className="btn-secondary px-3">Add cube</button>
                <button type="button" onClick={() => setRowCount((count) => Math.max(1, count - 1))} className="btn-secondary px-3">Remove row</button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-md border border-line">
              <table className="w-full min-w-[1200px] text-left text-sm">
                <thead className="table-head">
                  <tr>
                    <th className="px-3 py-2">No.</th>
                    <th className="px-3 py-2">Specimen code</th>
                    <th className="px-3 py-2">Age (days)</th>
                    <th className="px-3 py-2">Length (mm)</th>
                    <th className="px-3 py-2">Width (mm)</th>
                    <th className="px-3 py-2">Height (mm)</th>
                    <th className="px-3 py-2">Weight (kg)</th>
                    <th className="px-3 py-2">Load (kN)</th>
                    <th className="px-3 py-2">Strength (MPa)</th>
                    <th className="px-3 py-2">Visual inspection</th>
                    <th className="px-3 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {Array.from({ length: rowCount }, (_, index) => {
                    const specimen = existingSpecimens[index];
                    const defaultCode = specimen?.specimenCode ?? `${sample?.sampleCode ?? "Sample"}/${activeTest.scheduledAgeDays}d-${index + 1}`;
                    return (
                      <tr key={index}>
                        <td className="px-3 py-2 font-semibold text-ink">{index + 1}</td>
                        <td className="px-3 py-2"><input name={`specimenCode-${index}`} defaultValue={defaultCode} className="input min-w-36" /></td>
                        <td className="px-3 py-2"><input name={`ageDays-${index}`} type="number" defaultValue={specimen?.ageDays ?? 28} className="input min-w-24" /></td>
                        <td className="px-3 py-2"><input name={`lengthMm-${index}`} type="number" defaultValue={specimen?.lengthMm ?? 150} className="input min-w-24" /></td>
                        <td className="px-3 py-2"><input name={`widthMm-${index}`} type="number" defaultValue={specimen?.widthMm ?? 150} className="input min-w-24" /></td>
                        <td className="px-3 py-2"><input name={`heightMm-${index}`} type="number" defaultValue={specimen?.heightMm ?? 150} className="input min-w-24" /></td>
                        <td className="px-3 py-2"><input name={`weightKg-${index}`} type="number" step="0.01" defaultValue={specimen?.weightKg ?? ""} className="input min-w-24" /></td>
                        <td className="px-3 py-2"><input name={`maximumLoadKn-${index}`} type="number" step="0.01" defaultValue={specimen?.maximumLoadKn ?? ""} className="input min-w-24" /></td>
                        <td className="px-3 py-2 font-semibold text-ink">{specimen ? `${specimen.compressiveStrengthMpa} MPa` : "Save to calculate"}</td>
                        <td className="px-3 py-2"><input name={`visualInspection-${index}`} defaultValue={specimen?.visualInspection ?? ""} className="input min-w-44" /></td>
                        <td className="px-3 py-2"><input name={`specimenNotes-${index}`} defaultValue={specimen?.notes ?? ""} className="input min-w-40" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-ink">General notes</label>
              <textarea name="notes" rows={4} defaultValue={concrete?.notes} className="input mt-1" />
            </div>

            <div className="mt-5 flex justify-end">
              <button className="btn-secondary">Save data</button>
            </div>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="surface-card p-4">
            <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
            <div className="mt-4 space-y-3">
              <button
                onClick={complete}
                disabled={!concrete}
                className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Mark Test as Completed
              </button>
              <button
                onClick={generateReport}
                disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Generate {expectedReportCount} Report{expectedReportCount === 1 ? "" : "s"}
              </button>
              {concrete ? (
                <div className="soft-panel p-3 text-xs text-muted">
                  {specimenCount || 1} cube{(specimenCount || 1) === 1 ? "" : "s"} will be split into reports with a maximum of 3 cubes each.
                </div>
              ) : null}
              {report ? <Link className="btn-secondary block text-center" href={`/reports/${report.id}`}>Open Report</Link> : null}
            </div>
          </div>
          <div className="surface-card p-4 text-sm">
            <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
            <Info label="Standard" value={activeTest.standard} />
            <Info label="Required test date" value={activeTest.requiredTestDate} />
            <Info label="Report due date" value={activeTest.dueDate} />
            <Info label="Priority" value={activeTest.priority} />
            <Info label="Assigned technician" value={store.users.find((user) => user.id === activeTest.assignedTechnician)?.fullName} />
          </div>
        </aside>
      </div>
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

function EmployeeSelect({
  name,
  employees,
  value,
  required = false
}: {
  name: string;
  employees: LabUser[];
  value?: string;
  required?: boolean;
}) {
  const selectedValue = employees.some((employee) => employee.fullName === value) ? value : "";
  return (
    <select name={name} required={required} defaultValue={selectedValue} className="input">
      <option value="" disabled={required}>
        Select employee
      </option>
      {employees.map((employee) => (
        <option key={employee.id} value={employee.fullName}>
          {employee.fullName}{employee.position ? ` - ${employee.position}` : ""}
        </option>
      ))}
    </select>
  );
}

function ConcreteWaterRow({
  label,
  unit = "",
  names,
  values,
  average,
  type = "text"
}: {
  label: string;
  unit?: string;
  names: string[];
  values: Array<string | number | undefined>;
  average?: number;
  type?: "text" | "number";
}) {
  return (
    <tr>
      <td className="px-3 py-2 font-semibold text-ink">{label}</td>
      <td className="px-3 py-2">{unit}</td>
      {names.map((name, index) => (
        <td key={name} className="px-3 py-2">
          <input name={name} type={type} step={type === "number" ? "0.1" : undefined} defaultValue={values[index] ?? ""} className="input min-w-28" />
        </td>
      ))}
      <td className="px-3 py-2 font-semibold text-ink">{average ?? ""}</td>
    </tr>
  );
}

function TestActionsSidebar({
  ready,
  activeTest,
  reportId,
  complete,
  generateReport,
  message,
  technicianName
}: {
  ready: boolean;
  activeTest: { status: string; standard: string; requiredTestDate: string; dueDate: string };
  reportId?: string;
  complete: () => void;
  generateReport: () => void;
  message: string;
  technicianName?: string;
}) {
  return (
    <aside className="space-y-4">
      <div className="surface-card p-4">
        <h2 className="text-base font-semibold text-ink">Workflow Actions</h2>
        <div className="mt-4 space-y-3">
          <button onClick={complete} disabled={!ready} className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300">Mark Test as Completed</button>
          <button onClick={generateReport} disabled={!["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(activeTest.status)} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300">Generate Report</button>
          <div className="soft-panel p-3 text-xs text-muted">{message}</div>
          {reportId ? <Link className="btn-secondary block text-center" href={`/reports/${reportId}`}>Open Report</Link> : null}
        </div>
      </div>
      <div className="surface-card p-4 text-sm">
        <h2 className="text-base font-semibold text-ink">Test Metadata</h2>
        <Info label="Standard" value={activeTest.standard} />
        <Info label="Required test date" value={activeTest.requiredTestDate} />
        <Info label="Report due date" value={activeTest.dueDate} />
        <Info label="Assigned technician" value={technicianName} />
      </div>
    </aside>
  );
}

function ChemicalSection<T>({
  title,
  subtitle,
  headers,
  rows,
  names,
  values
}: {
  title: string;
  subtitle: string;
  headers: string[];
  rows: Array<T | undefined>;
  names: (index: number) => string[];
  values: (row: T | undefined) => Array<number | undefined>;
}) {
  return (
    <div className="border-b border-line p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
      <div className="mt-4 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-3 py-2">Trial</th>
              {headers.map((header) => (
                <th key={header} className="px-3 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row, rowIndex) => {
              const rowNames = names(rowIndex + 1);
              const rowValues = values(row);
              return (
                <tr key={rowIndex}>
                  <td className="px-3 py-2 font-semibold text-ink">Test {rowIndex + 1}</td>
                  {headers.map((header, cellIndex) => (
                    <td key={header} className="px-3 py-2">
                      {cellIndex < rowNames.length ? (
                        <input
                          name={rowNames[cellIndex]}
                          type="number"
                          step="0.001"
                          defaultValue={rowValues[cellIndex] ?? ""}
                          className="input min-w-32"
                        />
                      ) : (
                        <span className="font-semibold text-ink">{rowValues[cellIndex] ?? "Save to calculate"}</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoInline({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 font-semibold text-ink">{value}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="mt-3 border-t border-line pt-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 font-semibold text-ink">{value ?? "-"}</div>
    </div>
  );
}
