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
    "nav.tests": "Tests",
    "nav.reports": "Reports Register",
    "nav.procedures": "Procedures",
    "nav.clients": "Clients",
    "nav.projects": "Projects",
    "nav.employees": "Employees",
    "nav.delayedItems": "Delayed Items",
    "nav.monthlySummary": "Monthly Summary",
    "nav.settings": "Settings",

    "status.Registered": "Registered",
    "status.Accepted": "Accepted",
    "status.In Testing": "In Testing",
    "status.Tested": "Tested",
    "status.In Reporting": "In Reporting",
    "status.Report Issued": "Report Issued",
    "status.Delivered": "Delivered",
    "lifecycleDetail.awaitTesting": "Awaiting testing",
    "lifecycleDetail.testing": "Testing in progress",
    "lifecycleDetail.awaitTechApproval": "Awaiting technical approval",
    "lifecycleDetail.awaitReport": "Awaiting report",
    "lifecycleDetail.reportPreparing": "Report being prepared",
    "lifecycleDetail.reportAwaitApproval": "Report awaiting approval",
    "lifecycleDetail.reportApproved": "Report approved, ready to issue",
    "lifecycleDetail.rejected": "Rejected – needs correction",
    "lifecycleDetail.delivered": "Delivered to client",
    "lifecycleDetail.registered": "Registered – awaiting acceptance",
    "status.Pending Acceptance": "Pending Acceptance",
    "status.Pending Testing": "Pending Testing",
    "status.In Progress": "In Testing",
    "status.Partially Tested": "Partially Tested",
    "status.Completed": "Tested",
    "status.Pending Technical Review": "Pending Technical Review",
    "status.Delayed": "Delayed",
    "status.Pending": "Accepted",
    "status.Scheduled": "Scheduled",
    "status.Report Drafted": "Report Drafted",
    "status.Pending Approval": "Pending Approval",
    "status.Approved": "Approved",
    "status.Report Approved": "Report Approved",
    "status.Rejected": "Rejected",
    "status.Issued": "Report Issued",
    "status.Sent to Client": "Delivered",
    "status.Draft": "Draft",

    "dashboard.title": "Dashboard",
    "dashboard.description": "Live operational view for samples, tests, reports, approvals, and delayed work.",
    "dashboard.registerSample": "Register sample",
    "dashboard.samplesThisMonth": "Samples this month",
    "dashboard.testsCompleted": "Tests completed",
    "dashboard.reportsToPrepare": "Reports to prepare",
    "dashboard.pendingApproval": "Pending approval",
    "dashboard.approvedNotIssued": "Approved not sent",
    "dashboard.delayedTests": "Delayed tests",
    "dashboard.workflowColumns": "Workflow Table",
    "dashboard.openAllTests": "Open all tests",
    "dashboard.noTests": "No tests",
    "dashboard.managementSnapshot": "Management Snapshot",
    "dashboard.topClient": "Top client this month",
    "dashboard.commonSample": "Most common sample type",
    "dashboard.nextApproval": "Next approval queue",

    "samples.title": "Sample Register",
    "samples.description": "Excel-style register with linked test and report workflow actions.",
    "samples.new": "New sample",
    "samples.search": "Search sample or report code, client, project, type, or technician",
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

    "table.showing": "Showing",
    "table.of": "of",
    "table.filteredFrom": "filtered from",
    "table.noRows": "No rows match these filters",
    "table.page": "Page",
    "table.first": "First page",
    "table.previous": "Previous page",
    "table.next": "Next page",
    "table.last": "Last page",
    "table.recentWindow": "Open work + last 90 days",
    "table.clearSearch": "Clear search",

    "filters.status": "Status",
    "filters.sampleType": "Sample type",
    "filters.technician": "Technician",
    "filters.client": "Client",
    "filters.dateReceived": "Date received",
    "filters.reportDue": "Report due",
    "filters.testType": "Test type",
    "filters.requiredDate": "Required test date",
    "filters.results.tests": "tests",
    "filters.noClient": "No client yet",

    "views.openWork": "Open work",
    "views.myTests": "My tests",
    "views.overdue": "Overdue",
    "views.awaitingAcceptance": "Awaiting acceptance",
    "views.awaitingReview": "Awaiting technical review",
    "views.rejected": "Rejected",
    "views.noClient": "No client yet",
    "views.unassigned": "Unassigned",
    "views.allHistory": "All history",
    "filters.overdueOnly": "Overdue only",
    "filters.overdue": "Overdue",
    "filters.all": "All",
    "filters.unassigned": "Unassigned",
    "filters.from": "From",
    "filters.to": "To",
    "filters.search": "Search",
    "filters.clearAll": "Clear filters",
    "filters.remove": "Remove filter",
    "filters.results": "samples",

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
    ,"notifications.markAllRead": "Mark all read"
    ,"notifications.none": "Nothing new"
    ,"save.saved": "Saved"
    ,"save.saving": "Saving…"
    ,"save.offline": "Offline — not saved"
    ,"save.offlineHint": "Your change is held on this device and will be sent when the connection returns."
    ,"save.error": "Not saved"
    ,"save.conflict": "Not saved — someone else edited first"
    ,"save.reload": "Reload"
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
    "nav.tests": "Testet",
    "nav.reports": "Rregjistri Raporteve",
    "nav.procedures": "Procedurat",
    "nav.clients": "Klientët",
    "nav.projects": "Projektet",
    "nav.employees": "Punonjësit",
    "nav.delayedItems": "Vonesat",
    "nav.monthlySummary": "Përmbledhje Mujore",
    "nav.settings": "Cilësimet",

    "status.Registered": "Regjistruar",
    "status.Accepted": "Pranuar",
    "status.In Testing": "Në testim",
    "status.Tested": "Testuar / Përfunduar",
    "status.In Reporting": "Në raportim",
    "status.Report Issued": "Raporti i lëshuar",
    "status.Delivered": "Dërguar klientit",
    "lifecycleDetail.awaitTesting": "Pret testim",
    "lifecycleDetail.testing": "Në testim e sipër",
    "lifecycleDetail.awaitTechApproval": "Pret aprovim teknik",
    "lifecycleDetail.awaitReport": "Pret përgatitje raporti",
    "lifecycleDetail.reportPreparing": "Raporti në përgatitje",
    "lifecycleDetail.reportAwaitApproval": "Raporti pret aprovim",
    "lifecycleDetail.reportApproved": "Raporti i miratuar, gati për lëshim",
    "lifecycleDetail.rejected": "U refuzua – për korrigjim",
    "lifecycleDetail.delivered": "Dërguar te klienti",
    "lifecycleDetail.registered": "Regjistruar – pret pranim",
    "status.Pending Acceptance": "Në pritje pranimi",
    "status.Pending Testing": "Në pritje të testimit",
    "status.In Progress": "Në testim",
    "status.Partially Tested": "Testuar pjesërisht",
    "status.Completed": "Testuar / Përfunduar",
    "status.Pending Technical Review": "Në pritje të verifikimit teknik",
    "status.Delayed": "Me vonesë",
    "status.Pending": "Pranuar",
    "status.Scheduled": "Planifikuar",
    "status.Report Drafted": "Raport i përgatitur",
    "status.Pending Approval": "Në pritje miratimi",
    "status.Approved": "Miratuar",
    "status.Report Approved": "Raporti i miratuar",
    "status.Rejected": "Refuzuar",
    "status.Issued": "Raporti i lëshuar",
    "status.Sent to Client": "Dërguar klientit",
    "status.Draft": "Draft",

    "dashboard.title": "Paneli",
    "dashboard.description": "Pamje operative për kampionët, testet, raportet, miratimet dhe vonesat.",
    "dashboard.registerSample": "Regjistro kampion",
    "dashboard.samplesThisMonth": "Kampionë këtë muaj",
    "dashboard.testsCompleted": "Teste të përfunduara",
    "dashboard.reportsToPrepare": "Raporte për përgatitje",
    "dashboard.pendingApproval": "Në pritje miratimi",
    "dashboard.approvedNotIssued": "Miratuar pa u dërguar",
    "dashboard.delayedTests": "Teste me vonesë",
    "dashboard.workflowColumns": "Tabela e procesit",
    "dashboard.openAllTests": "Hap të gjitha testet",
    "dashboard.noTests": "Nuk ka teste",
    "dashboard.managementSnapshot": "Përmbledhje menaxheriale",
    "dashboard.topClient": "Klienti kryesor i muajit",
    "dashboard.commonSample": "Tipi më i shpeshtë i kampionit",
    "dashboard.nextApproval": "Radha e miratimeve",

    "samples.title": "Regjistri i Kampionëve",
    "samples.description": "Regjistër i ngjashëm me Excel me veprime të lidhura për teste dhe raporte.",
    "samples.new": "Kampion i ri",
    "samples.search": "Kërko kodin e kampionit ose raportit, klientin, projektin, tipin ose teknikun",
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

    "table.showing": "Duke shfaqur",
    "table.of": "nga",
    "table.filteredFrom": "filtruar nga",
    "table.noRows": "Asnjë rresht nuk përputhet me këto filtra",
    "table.page": "Faqja",
    "table.first": "Faqja e parë",
    "table.previous": "Faqja e mëparshme",
    "table.next": "Faqja tjetër",
    "table.last": "Faqja e fundit",
    "table.recentWindow": "Punë në proces + 90 ditët e fundit",
    "table.clearSearch": "Pastro kërkimin",

    "filters.status": "Statusi",
    "filters.sampleType": "Tipi i kampionit",
    "filters.technician": "Tekniku",
    "filters.client": "Klienti",
    "filters.dateReceived": "Data e pranimit",
    "filters.reportDue": "Afati i raportit",
    "filters.testType": "Tipi i testit",
    "filters.requiredDate": "Data e kërkuar e testimit",
    "filters.results.tests": "teste",
    "filters.noClient": "Pa klient ende",

    "views.openWork": "Punë në proces",
    "views.myTests": "Testet e mia",
    "views.overdue": "Të vonuara",
    "views.awaitingAcceptance": "Pret pranim",
    "views.awaitingReview": "Pret verifikim teknik",
    "views.rejected": "Refuzuar",
    "views.noClient": "Pa klient ende",
    "views.unassigned": "Pa teknik",
    "views.allHistory": "I gjithë historiku",
    "filters.overdueOnly": "Vetëm të vonuara",
    "filters.overdue": "Të vonuara",
    "filters.all": "Të gjitha",
    "filters.unassigned": "Pa caktuar",
    "filters.from": "Nga",
    "filters.to": "Deri",
    "filters.search": "Kërkim",
    "filters.clearAll": "Pastro filtrat",
    "filters.remove": "Hiq filtrin",
    "filters.results": "kampionë",

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
    ,"notifications.markAllRead": "Shëno të gjitha si të lexuara"
    ,"notifications.none": "Asgjë e re"
    ,"save.saved": "U ruajt"
    ,"save.saving": "Duke ruajtur…"
    ,"save.offline": "Jashtë linje — nuk u ruajt"
    ,"save.offlineHint": "Ndryshimi është ruajtur në këtë pajisje dhe do të dërgohet kur të kthehet lidhja."
    ,"save.error": "Nuk u ruajt"
    ,"save.conflict": "Nuk u ruajt — dikush tjetër ndryshoi i pari"
    ,"save.reload": "Rifresko"
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
