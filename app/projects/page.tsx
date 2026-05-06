"use client";

import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { useLabStore } from "@/lib/lab-store";

export default function ProjectsPage() {
  const store = useLabStore();
  return (
    <>
      <PageHeader title="Projektet" description="Regjistrat e projekteve të lidhura me klientët dhe kampionët laboratorikë." />
      <SimpleTable>
        <table className="w-full text-left text-sm">
          <thead className="table-head">
            <tr><th className="px-4 py-3">Projekti</th><th className="px-4 py-3">Klienti</th><th className="px-4 py-3">Vendndodhja</th><th className="px-4 py-3">Përshkrimi</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {store.projects.map((project) => <tr key={project.id}><td className="px-4 py-3 font-semibold">{project.projectName}</td><td className="px-4 py-3">{store.clients.find((client) => client.id === project.clientId)?.clientName}</td><td className="px-4 py-3">{project.location}</td><td className="px-4 py-3">{project.description}</td></tr>)}
          </tbody>
        </table>
      </SimpleTable>
    </>
  );
}
