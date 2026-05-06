"use client";

import { PageHeader } from "@/components/ui/page-header";
import { TestCard } from "@/components/workflow/test-card";
import { useLabStore } from "@/lib/lab-store";
import { isOverdue } from "@/lib/status";

export default function DelayedPage() {
  const store = useLabStore();
  const delayed = store.tests.filter((test) => test.status === "Delayed" || isOverdue(test.requiredTestDate, test.status));
  return (
    <>
      <PageHeader title="Artikuj me vonesë" description="Teste që kanë kaluar datën e kërkuar ose janë shënuar me vonesë." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {delayed.map((test) => (
          <TestCard
            key={test.id}
            test={{ ...test, status: "Delayed" }}
            sample={store.samples.find((sample) => sample.id === test.sampleId)}
            client={store.clients.find((client) => client.id === test.clientId)}
            project={store.projects.find((project) => project.id === test.projectId)}
            technician={store.users.find((user) => user.id === test.assignedTechnician)}
          />
        ))}
      </div>
      {!delayed.length ? <div className="rounded-md border border-line bg-white p-6 text-sm text-muted shadow-sm">Nuk ka teste me vonesë për momentin.</div> : null}
    </>
  );
}
