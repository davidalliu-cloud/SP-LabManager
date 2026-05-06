"use client";

import { PageHeader } from "@/components/ui/page-header";
import { TestCard } from "@/components/workflow/test-card";
import { useLabStore } from "@/lib/lab-store";
import { canViewClientIdentity } from "@/lib/permissions";

export default function TestsPage() {
  const store = useLabStore();
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentity = canViewClientIdentity(currentUser?.role);
  return (
    <>
      <PageHeader title="Tests" description="Concrete cube compressive strength tests with deadline and status tracking." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {store.tests.map((test) => (
          <TestCard
            key={test.id}
            test={test}
            sample={store.samples.find((sample) => sample.id === test.sampleId)}
            client={store.clients.find((client) => client.id === test.clientId)}
            project={store.projects.find((project) => project.id === test.projectId)}
            technician={store.users.find((user) => user.id === test.assignedTechnician)}
            showClientIdentity={showClientIdentity}
          />
        ))}
      </div>
    </>
  );
}
