"use client";

import { MobileTestCard } from "@/components/tech/mobile-test-card";
import { useLabStore } from "@/lib/lab-store";
import { canTechnicianAccessTest } from "@/lib/permissions";
import type { TestStatus } from "@/lib/types";

// Tests still needing the technician's attention come first; reviewed/closed
// tests trail behind for reference.
const statusOrder: TestStatus[] = [
  "Rejected",
  "Delayed",
  "Pending",
  "Scheduled",
  "In Progress",
  "Pending Technical Review",
  "Completed"
];

export default function MyTestsPage() {
  const store = useLabStore();
  const myTests = store.tests
    .filter((test) => canTechnicianAccessTest(store.currentUserId, test))
    .sort((a, b) => {
      const orderA = statusOrder.includes(a.status) ? statusOrder.indexOf(a.status) : statusOrder.length;
      const orderB = statusOrder.includes(b.status) ? statusOrder.indexOf(b.status) : statusOrder.length;
      if (orderA !== orderB) return orderA - orderB;
      return a.requiredTestDate.localeCompare(b.requiredTestDate);
    });

  return (
    <div>
      <h1 className="text-xl font-bold text-ink">My tests</h1>
      <p className="mt-1 text-sm text-muted">Tests assigned to you. Tap one to enter results.</p>
      <div className="mt-5 space-y-3">
        {myTests.length ? (
          myTests.map((test) => (
            <MobileTestCard key={test.id} test={test} sample={store.samples.find((sample) => sample.id === test.sampleId)} />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
            No tests are assigned to you right now.
          </div>
        )}
      </div>
    </div>
  );
}
