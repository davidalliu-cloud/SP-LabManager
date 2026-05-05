"use client";

import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { useLabStore } from "@/lib/lab-store";

export default function UsersPage() {
  const { users } = useLabStore();
  return (
    <>
      <PageHeader title="Users" description="Role assignments for permissions and workflow notifications." />
      <SimpleTable>
        <table className="w-full text-left text-sm">
          <thead className="table-head">
            <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((user) => <tr key={user.id}><td className="px-4 py-3 font-semibold">{user.fullName}</td><td className="px-4 py-3">{user.email}</td><td className="px-4 py-3">{user.role}</td></tr>)}
          </tbody>
        </table>
      </SimpleTable>
    </>
  );
}
