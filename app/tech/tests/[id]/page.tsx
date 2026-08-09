"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AggregateGranulometryMobileForm } from "@/components/tech/worksheets/aggregate-granulometry-mobile-form";
import { AggregateSandEquivalentMobileForm } from "@/components/tech/worksheets/aggregate-sand-equivalent-mobile-form";
import { ConcreteCompressiveMobileForm } from "@/components/tech/worksheets/concrete-compressive-mobile-form";
import { MobileTestFormShell } from "@/components/tech/mobile-test-form-shell";
import {
  isAggregateAcvAccreditedTest,
  isAggregateBulkDensityAccreditedTest,
  isAggregateChemicalAccreditedTest,
  isAggregateDensityAbsorptionAccreditedTest,
  isAggregateElongationIndexAccreditedTest,
  isAggregateFillerDensityAccreditedTest,
  isAggregateFlakinessIndexAccreditedTest,
  isAggregateFreezeThawAccreditedTest,
  isAggregateGranulometrySampleType,
  isAggregateLosAngelesAccreditedTest,
  isAggregateSandEquivalentAccreditedTest,
  isAggregateShapeIndexAccreditedTest,
  isAggregateSoundnessAccreditedTest,
  isConcreteCoreAccreditedTest,
  isConcreteDensityAccreditedTest,
  isConcreteFlexuralAccreditedTest,
  isConcreteIndirectTensileAccreditedTest,
  isConcreteWaterPenetrationAccreditedTest
} from "@/lib/accredited-tests";
import { useLabStore } from "@/lib/lab-store";
import { canEditTestData, canTechnicianAccessTest } from "@/lib/permissions";

export default function MobileTestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const store = useLabStore();
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const test = store.tests.find((item) => item.id === params.id);

  if (!test) {
    return <p className="text-sm text-muted">Test not found.</p>;
  }

  if (!canTechnicianAccessTest(store.currentUserId, test)) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-white p-6 text-center">
        <p className="text-sm font-semibold text-ink">This test isn&apos;t assigned to you.</p>
        <Link href="/tech" className="mt-3 inline-block text-sm font-semibold text-lab-burgundy">&larr; Back to my tests</Link>
      </div>
    );
  }

  const sample = store.samples.find((item) => item.id === test.sampleId);
  const canEdit = canEditTestData(currentUser?.role, test.status);
  const onComplete = () => {
    if (!canEdit) return;
    store.markTestCompleted(test.id);
    router.push("/tech");
  };

  const isWaterPenetration = isConcreteWaterPenetrationAccreditedTest(test.testType);
  const isFlexural = isConcreteFlexuralAccreditedTest(test.testType);
  const isConcreteDensity = isConcreteDensityAccreditedTest(test.testType);
  const isIndirectTensile = isConcreteIndirectTensileAccreditedTest(test.testType);
  const isConcreteCore = isConcreteCoreAccreditedTest(test.testType);
  const isGranulometry = Boolean(sample && isAggregateGranulometrySampleType(sample.sampleType) && test.testType.includes("Granulometri"));
  const isSandEquivalent = isAggregateSandEquivalentAccreditedTest(test.testType);
  const isChemical = isAggregateChemicalAccreditedTest(test.testType);
  const isLosAngeles = isAggregateLosAngelesAccreditedTest(test.testType);
  const isFreezeThaw = isAggregateFreezeThawAccreditedTest(test.testType);
  const isAcv = isAggregateAcvAccreditedTest(test.testType);
  const isDensityAbsorption = isAggregateDensityAbsorptionAccreditedTest(test.testType);
  const isFillerDensity = isAggregateFillerDensityAccreditedTest(test.testType);
  const isShapeIndex = isAggregateShapeIndexAccreditedTest(test.testType);
  const isFlakinessIndex = isAggregateFlakinessIndexAccreditedTest(test.testType);
  const isElongationIndex = isAggregateElongationIndexAccreditedTest(test.testType);
  const isBulkDensity = isAggregateBulkDensityAccreditedTest(test.testType);
  const isSoundness = isAggregateSoundnessAccreditedTest(test.testType);

  if (isSandEquivalent) {
    const record = store.aggregateSandEquivalentTests.find((item) => item.testId === test.id);
    return (
      <MobileTestFormShell test={test} sample={sample} title="Sand Equivalent" description="BS EN 933-8" hasWorksheetData={Boolean(record)} canEdit={canEdit} onComplete={onComplete}>
        <AggregateSandEquivalentMobileForm test={test} sample={sample} record={record} currentUser={currentUser} canEdit={canEdit} />
      </MobileTestFormShell>
    );
  }

  if (isGranulometry) {
    const record = store.aggregateTests.find((item) => item.testId === test.id);
    return (
      <MobileTestFormShell test={test} sample={sample} title="Granulometri / Sieve Analysis" description="BS EN 933-1" hasWorksheetData={Boolean(record)} canEdit={canEdit} onComplete={onComplete}>
        <AggregateGranulometryMobileForm test={test} sample={sample} record={record} currentUser={currentUser} canEdit={canEdit} />
      </MobileTestFormShell>
    );
  }

  const isOtherConcreteType = isWaterPenetration || isFlexural || isConcreteDensity || isIndirectTensile || isConcreteCore;
  const isOtherAggregateType =
    isChemical || isLosAngeles || isFreezeThaw || isAcv || isDensityAbsorption || isFillerDensity || isShapeIndex || isFlakinessIndex || isElongationIndex || isBulkDensity || isSoundness;

  if (isOtherConcreteType || isOtherAggregateType) {
    return (
      <MobileTestFormShell test={test} sample={sample} title={test.testType} hasWorksheetData={false} canEdit={false} onComplete={onComplete}>
        <div className="rounded-lg border border-dashed border-line bg-white p-4 text-sm text-muted">
          This test type isn&apos;t available on mobile yet — please use the desktop app to enter results for it.
        </div>
      </MobileTestFormShell>
    );
  }

  // Default: Concrete Compressive (the desktop app's own fallback for the
  // concrete family — no dedicated predicate exists for it).
  const record = store.concreteTests.find((item) => item.testId === test.id);
  return (
    <MobileTestFormShell test={test} sample={sample} title="Compressive Strength" description="BS EN 12390-3" hasWorksheetData={Boolean(record)} canEdit={canEdit} onComplete={onComplete}>
      <ConcreteCompressiveMobileForm test={test} sample={sample} record={record} currentUser={currentUser} canEdit={canEdit} />
    </MobileTestFormShell>
  );
}
