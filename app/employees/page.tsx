"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import type { LabUser, Role } from "@/lib/types";

const roles: Role[] = [
  "Admin / Managing Director",
  "Chief of Lab",
  "Quality Manager",
  "Operations Manager",
  "Document Controller",
  "Technician"
];

const workAreaOptions = [
  "Sample retrieval",
  "Sample registration",
  "Concrete testing",
  "Steel testing",
  "Aggregate testing",
  "Report preparation",
  "Technical review",
  "Approval",
  "Quality control"
];

export default function EmployeesPage() {
  const store = useLabStore();
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<LabUser | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  function openCreate() {
    setEditing(null);
    setSelectedAreas(["Sample retrieval", "Concrete testing"]);
    setShowForm(true);
  }

  function openEdit(employee: LabUser) {
    setEditing(employee);
    setSelectedAreas(employee.workAreas ?? []);
    setShowForm(true);
  }

  function toggleArea(area: string) {
    setSelectedAreas((areas) => (areas.includes(area) ? areas.filter((item) => item !== area) : [...areas, area]));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      fullName: String(form.get("fullName")),
      email: String(form.get("email")),
      role: String(form.get("role")) as Role,
      position: String(form.get("position")),
      phone: String(form.get("phone")),
      workAreas: selectedAreas,
      isActive: form.get("isActive") === "on"
    };

    if (editing) {
      store.updateEmployee(editing.id, input);
    } else {
      store.createEmployee(input);
    }

    setShowForm(false);
    setEditing(null);
    setSelectedAreas([]);
  }

  return (
    <>
      <PageHeader
        title={t("employees.title")}
        description={t("employees.description")}
        action={
          <button
            type="button"
            onClick={openCreate}
            className="btn-primary"
          >
            {t("employees.add")}
          </button>
        }
      />

      {showForm ? (
        <form onSubmit={submit} className="surface-card mb-5 grid gap-4 p-5 lg:grid-cols-2">
          <Field label={t("employees.fullName")}>
            <input name="fullName" required defaultValue={editing?.fullName ?? ""} className="input" placeholder="Technician or engineer name" />
          </Field>
          <Field label={t("employees.position")}>
            <input name="position" defaultValue={editing?.position ?? ""} className="input" placeholder="Concrete technician, site engineer..." />
          </Field>
          <Field label={t("employees.email")}>
            <input name="email" type="email" defaultValue={editing?.email ?? ""} className="input" placeholder="employee@sarplab.com" />
          </Field>
          <Field label={t("employees.phone")}>
            <input name="phone" defaultValue={editing?.phone ?? ""} className="input" placeholder="Phone number" />
          </Field>
          <Field label={t("employees.role")}>
            <select name="role" defaultValue={editing?.role ?? "Technician"} className="input">
              {roles.map((role) => <option key={role}>{role}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2 pt-7 text-sm font-medium text-ink">
            <input name="isActive" type="checkbox" defaultChecked={editing?.isActive ?? true} className="h-4 w-4 rounded border-line" />
            {t("employees.active")}
          </label>
          <div className="lg:col-span-2">
            <div className="mb-2 text-sm font-medium text-ink">{t("employees.workAreas")}</div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {workAreaOptions.map((area) => (
                <label key={area} className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedAreas.includes(area)}
                    onChange={() => toggleArea(area)}
                    className="h-4 w-4 rounded border-line"
                  />
                  {area}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 lg:col-span-2">
            <button className="rounded-md bg-lab-green px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              {editing ? t("employees.saveChanges") : t("employees.save")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setSelectedAreas([]);
              }}
              className="btn-secondary"
            >
              {t("employees.cancel")}
            </button>
          </div>
        </form>
      ) : null}

      <SimpleTable>
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-4 py-3">{t("employees.employee")}</th>
              <th className="px-4 py-3">{t("employees.position")}</th>
              <th className="px-4 py-3">{t("employees.role")}</th>
              <th className="px-4 py-3">{t("employees.phone")}</th>
              <th className="px-4 py-3">{t("employees.email")}</th>
              <th className="px-4 py-3">{t("employees.workAreas")}</th>
              <th className="px-4 py-3">{t("employees.status")}</th>
              <th className="px-4 py-3">{t("employees.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {store.users.map((employee) => (
              <tr key={employee.id} className="hover:bg-lab-mist/60">
                <td className="px-4 py-3 font-semibold text-ink">{employee.fullName}</td>
                <td className="px-4 py-3">{employee.position ?? "-"}</td>
                <td className="px-4 py-3">{employee.role}</td>
                <td className="px-4 py-3">{employee.phone ?? "-"}</td>
                <td className="px-4 py-3">{employee.email}</td>
                <td className="px-4 py-3">{employee.workAreas?.join(", ") || "-"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${employee.isActive === false ? "bg-slate-100 text-slate-600 ring-slate-200" : "bg-green-50 text-lab-green ring-green-100"}`}>
                    {employee.isActive === false ? t("employees.inactiveStatus") : t("employees.activeStatus")}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex w-24 flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(employee)}
                      className="rounded-md border border-line bg-lab-mist px-2 py-1 text-[11px] font-semibold leading-tight text-lab-navy hover:border-lab-steel"
                    >
                      {t("employees.edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => store.removeEmployee(employee.id)}
                      disabled={employee.id === store.currentUserId}
                      className="rounded-md border border-red-100 bg-red-50 px-2 py-1 text-[11px] font-semibold leading-tight text-lab-red hover:bg-red-100 disabled:cursor-not-allowed disabled:border-line disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {t("employees.remove")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SimpleTable>
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
