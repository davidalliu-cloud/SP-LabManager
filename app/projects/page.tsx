"use client";

import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { useLabStore } from "@/lib/lab-store";

export default function ProjectsPage() {
  const store = useLabStore();
  return (
    <>
      <PageHeader title="Projects" description="Project records linked to clients and laboratory samples." />
      <SimpleTable>
        <table className="w-full text-left text-sm">
          <thead className="table-head">
            <tr><th className="px-4 py-3">Project</th><th className="px-4 py-3">Client</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Description</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {store.projects.map((project) => <tr key={project.id}><td className="px-4 py-3 font-semibold">{project.projectName}</td><td className="px-4 py-3">{store.clients.find((client) => client.id === project.clientId)?.clientName}</td><td className="px-4 py-3">{project.location}</td><td className="px-4 py-3">{project.description}</td></tr>)}
          </tbody>
        </table>
      </SimpleTable>
    </>
  );
}
