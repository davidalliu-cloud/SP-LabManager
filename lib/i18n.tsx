"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type Language = "en" | "sq";

const translations = {
  en: {
    "app.title": "SARP LAB Management System",
    "app.subtitle": "Sample tracking, test control, approvals, and reporting",
    "brand.lab": "LAB Management",
    "brand.domain": "Construction Materials Laboratory",
    "language.label": "Language",
    "language.en": "English",
    "language.sq": "Albanian",

    "nav.dashboard": "Dashboard",
    "nav.sampleRegister": "Sample Register",
    "nav.newSample": "New Sample",
    "nav.tests": "Tests",
    "nav.reports": "Reports",
    "nav.procedures": "Procedures",
    "nav.clients": "Clients",
    "nav.projects": "Projects",
    "nav.employees": "Employees",
    "nav.delayedItems": "Delayed Items",
    "nav.monthlySummary": "Monthly Summary",
    "nav.users": "Users",
    "nav.settings": "Settings",

    "status.Registered": "Registered",
    "status.Pending Testing": "Pending Testing",
    "status.In Progress": "In Progress",
    "status.Partially Tested": "Partially Tested",
    "status.Completed": "Completed",
    "status.Delayed": "Delayed",
    "status.Pending": "Pending",
    "status.Scheduled": "Scheduled",
    "status.Report Drafted": "Report Drafted",
    "status.Pending Approval": "Pending Approval",
    "status.Approved": "Approved",
    "status.Rejected": "Rejected",
    "status.Issued": "Issued",
    "status.Draft": "Draft",

    "dashboard.title": "Dashboard",
    "dashboard.description": "Live operational view for samples, tests, reports, approvals, and delayed work.",
    "dashboard.registerSample": "Register sample",
    "dashboard.samplesThisMonth": "Samples this month",
    "dashboard.testsCompleted": "Tests completed",
    "dashboard.reportsToPrepare": "Reports to prepare",
    "dashboard.pendingApproval": "Pending approval",
    "dashboard.approvedNotIssued": "Approved not issued",
    "dashboard.delayedTests": "Delayed tests",
    "dashboard.workflowColumns": "Workflow Columns",
    "dashboard.openAllTests": "Open all tests",
    "dashboard.noTests": "No tests",
    "dashboard.managementSnapshot": "Management Snapshot",
    "dashboard.topClient": "Top client this month",
    "dashboard.commonSample": "Most common sample type",
    "dashboard.nextApproval": "Next approval queue",

    "samples.title": "Sample Register",
    "samples.description": "Excel-style register with linked test and report workflow actions.",
    "samples.new": "New sample",
    "samples.search": "Search by sample code, client code, project, or sample type",
    "samples.sampleCode": "Sample code",
    "samples.dateReceived": "Date received",
    "samples.clientCode": "Client code",
    "samples.project": "Project",
    "samples.sampleType": "Sample type",
    "samples.qty": "Qty",
    "samples.requestedTest": "Requested test",
    "samples.requiredDate": "Required test date",
    "samples.reportDue": "Report due",
    "samples.status": "Status",
    "samples.assignedTechnician": "Assigned technician",
    "samples.reportStatus": "Report status",
    "samples.actions": "Actions",
    "samples.viewSample": "View sample",
    "samples.openTest": "Open test",
    "samples.report": "Report",

    "employees.title": "Employees",
    "employees.description": "Manage technicians and engineers who handle sample retrieval, testing, reporting, and approvals.",
    "employees.add": "Add employee",
    "employees.fullName": "Full name",
    "employees.position": "Position",
    "employees.email": "Email",
    "employees.phone": "Phone",
    "employees.role": "System role",
    "employees.active": "Active employee",
    "employees.workAreas": "Work areas",
    "employees.save": "Save employee",
    "employees.saveChanges": "Save changes",
    "employees.cancel": "Cancel",
    "employees.employee": "Employee",
    "employees.status": "Status",
    "employees.actions": "Actions",
    "employees.edit": "Edit",
    "employees.remove": "Remove",
    "employees.activeStatus": "Active",
    "employees.inactiveStatus": "Inactive",

    "notifications.alerts": "Alerts"
    ,"test.batch": "Batch"
    ,"test.required": "Required"
    ,"test.technician": "Technician"
    ,"test.cubes": "cubes"
    ,"test.unassigned": "Unassigned"
  },
  sq: {
    "app.title": "Sistemi i Menaxhimit SARP LAB",
    "app.subtitle": "Gjurmimi i kampionëve, kontrolli i testeve, miratimet dhe raportimi",
    "brand.lab": "Menaxhimi i Laboratorit",
    "brand.domain": "Laborator i Materialeve të Ndërtimit",
    "language.label": "Gjuha",
    "language.en": "Anglisht",
    "language.sq": "Shqip",

    "nav.dashboard": "Paneli",
    "nav.sampleRegister": "Regjistri i Kampionëve",
    "nav.newSample": "Kampion i Ri",
    "nav.tests": "Testet",
    "nav.reports": "Raportet",
    "nav.procedures": "Procedurat",
    "nav.clients": "Klientët",
    "nav.projects": "Projektet",
    "nav.employees": "Punonjësit",
    "nav.delayedItems": "Vonesat",
    "nav.monthlySummary": "Përmbledhje Mujore",
    "nav.users": "Përdoruesit",
    "nav.settings": "Cilësimet",

    "status.Registered": "Regjistruar",
    "status.Pending Testing": "Në pritje të testimit",
    "status.In Progress": "Në proces",
    "status.Partially Tested": "Testuar pjesërisht",
    "status.Completed": "Përfunduar",
    "status.Delayed": "Me vonesë",
    "status.Pending": "Në pritje",
    "status.Scheduled": "Planifikuar",
    "status.Report Drafted": "Raport i përgatitur",
    "status.Pending Approval": "Në pritje miratimi",
    "status.Approved": "Miratuar",
    "status.Rejected": "Refuzuar",
    "status.Issued": "Lëshuar",
    "status.Draft": "Draft",

    "dashboard.title": "Paneli",
    "dashboard.description": "Pamje operative për kampionët, testet, raportet, miratimet dhe vonesat.",
    "dashboard.registerSample": "Regjistro kampion",
    "dashboard.samplesThisMonth": "Kampionë këtë muaj",
    "dashboard.testsCompleted": "Teste të përfunduara",
    "dashboard.reportsToPrepare": "Raporte për përgatitje",
    "dashboard.pendingApproval": "Në pritje miratimi",
    "dashboard.approvedNotIssued": "Miratuar pa u lëshuar",
    "dashboard.delayedTests": "Teste me vonesë",
    "dashboard.workflowColumns": "Kolonat e procesit",
    "dashboard.openAllTests": "Hap të gjitha testet",
    "dashboard.noTests": "Nuk ka teste",
    "dashboard.managementSnapshot": "Përmbledhje menaxheriale",
    "dashboard.topClient": "Klienti kryesor i muajit",
    "dashboard.commonSample": "Tipi më i shpeshtë i kampionit",
    "dashboard.nextApproval": "Radha e miratimeve",

    "samples.title": "Regjistri i Kampionëve",
    "samples.description": "Regjistër i ngjashëm me Excel me veprime të lidhura për teste dhe raporte.",
    "samples.new": "Kampion i ri",
    "samples.search": "Kërko sipas kodit të kampionit, kodit të klientit, projektit ose tipit",
    "samples.sampleCode": "Kodi i kampionit",
    "samples.dateReceived": "Data e pranimit",
    "samples.clientCode": "Kodi i klientit",
    "samples.project": "Projekti",
    "samples.sampleType": "Tipi i kampionit",
    "samples.qty": "Sasia",
    "samples.requestedTest": "Testi i kërkuar",
    "samples.requiredDate": "Data e testimit",
    "samples.reportDue": "Afati i raportit",
    "samples.status": "Statusi",
    "samples.assignedTechnician": "Tekniku i caktuar",
    "samples.reportStatus": "Statusi i raportit",
    "samples.actions": "Veprime",
    "samples.viewSample": "Shiko kampionin",
    "samples.openTest": "Hap testin",
    "samples.report": "Raporti",

    "employees.title": "Punonjësit",
    "employees.description": "Menaxho teknikët dhe inxhinierët që merren me marrjen e kampionëve, testimin, raportimin dhe miratimet.",
    "employees.add": "Shto punonjës",
    "employees.fullName": "Emri i plotë",
    "employees.position": "Pozicioni",
    "employees.email": "Email",
    "employees.phone": "Telefoni",
    "employees.role": "Roli në sistem",
    "employees.active": "Punonjës aktiv",
    "employees.workAreas": "Fushat e punës",
    "employees.save": "Ruaj punonjësin",
    "employees.saveChanges": "Ruaj ndryshimet",
    "employees.cancel": "Anulo",
    "employees.employee": "Punonjësi",
    "employees.status": "Statusi",
    "employees.actions": "Veprime",
    "employees.edit": "Ndrysho",
    "employees.remove": "Hiq",
    "employees.activeStatus": "Aktiv",
    "employees.inactiveStatus": "Jo aktiv",

    "notifications.alerts": "Njoftime"
    ,"test.batch": "Grupi"
    ,"test.required": "Afati"
    ,"test.technician": "Tekniku"
    ,"test.cubes": "kube"
    ,"test.unassigned": "Pa caktuar"
  }
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("sq");
  const value = useMemo<I18nValue>(() => ({
    language,
    setLanguage,
    t: (key) => translations[language][key] ?? translations.en[key] ?? key
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
