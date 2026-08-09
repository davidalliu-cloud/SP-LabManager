"use client";

import { MobileApprovalCard } from "@/components/tech/mobile-approval-card";
import { MobileTestCard } from "@/components/tech/mobile-test-card";
import { useLabStore } from "@/lib/lab-store";
import { canReviewTests, canTechnicianAccessTest } from "@/lib/permissions";
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

// Matches the exact condition the desktop test page uses to decide whether a
// test is awaiting a reviewer's technical approval (app/tests/[id]/page.tsx).
const awaitingTechnicalReviewStatuses: TestStatus[] = ["Pending Technical Review", "Completed"];

export default function MyTestsPage() {
  const store = useLabStore();
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canReview = canReviewTests(currentUser?.role);

  const pendingReviewTests = canReview
    ? store.tests.filter((test) => awaitingTechnicalReviewStatuses.includes(test.status))
    : [];
  const pendingApprovalReports = canReview
    ? store.reports.filter((report) => report.reportStatus === "Pending Approval")
    : [];

  const myTests = store.tests
    .filter((test) => canTechnicianAccessTest(store.currentUserId, test))
    .sort((a, b) => {
      const orderA = statusOrder.includes(a.status) ? statusOrder.indexOf(a.status) : statusOrder.length;
      const orderB = statusOrder.includes(b.status) ? statusOrder.indexOf(b.status) : statusOrder.length;
      if (orderA !== orderB) return orderA - orderB;
      return a.requiredTestDate.localeCompare(b.requiredTestDate);
    });

  return (
    <div className="space-y-8">
      {canReview ? (
        <div>
          <h1 className="text-xl font-bold text-ink">Awaiting your approval</h1>
          <p className="mt-1 text-sm text-muted">
            Tests waiting on technical review and reports waiting on approval, across the whole lab — not just tests assigned to you.
          </p>
          <div className="mt-5 space-y-3">
            {pendingReviewTests.length || pendingApprovalReports.length ? (
              <>
                {pendingReviewTests.map((test) => {
                  const sample = store.samples.find((item) => item.id === test.sampleId);
                  return (
                    <MobileApprovalCard
                      key={`test-${test.id}`}
                      href={`/tests/${test.id}`}
                      eyebrow={test.testCode}
                      title={test.testType}
                      subtitle={`${sample?.sampleCode ?? "-"} · Technical review`}
                      status={test.status}
                    />
                  );
                })}
                {pendingApprovalReports.map((report) => {
                  const client = store.clients.find((item) => item.id === report.clientId);
                  return (
                    <MobileApprovalCard
                      key={`report-${report.id}`}
                      href={`/reports/${report.id}`}
                      eyebrow={report.reportNumber}
                      title={client?.clientName ?? "Report"}
                      subtitle="Report approval"
                      status={report.reportStatus}
                    />
                  );
                })}
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-line bg-white p-6 text-center text-sm text-muted">
                Nothing is waiting on your approval right now.
              </div>
            )}
          </div>
        </div>
      ) : null}

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
    </div>
  );
}
