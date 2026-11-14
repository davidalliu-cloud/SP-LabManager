import { formatEuropeanDate } from "@/lib/date-format";
import { concreteResultLines } from "@/lib/report-message";
import type { ConcreteCompressiveTest, Client, LabTest, LabUser, Project, Report, Sample } from "@/lib/types";

/**
 * What a client reads when the lab writes to them.
 *
 * Four screens send mail to clients - a report from its own page, a batch from
 * the register, and a period summary from both the client page and the server
 * route behind it - and each had grown its own three-line note, written
 * without diacritics and signed "SARP LAB". A client filing a certificate for
 * a supervisor sees the covering email first, and it was the least considered
 * document the lab produced.
 *
 * So it is written once, here, as a letter: who is writing, what is attached,
 * what it was tested against, and who to ask. The attached PDF is still the
 * report - nothing in these lines replaces it.
 */

/** The letterhead, the same one printed at the foot of every certificate. */
export const LAB_DETAILS = {
  name: "SARP & LAB sh.p.k.",
  address: "Autostrada Tiranë-Durrës, km 29, Fshati Vrrin, Rrashbull, Durrës",
  phone: "+355 67 20 22 609",
  web: "www.sarpandlab.al",
  accreditation: "Laborator provash i akredituar sipas ISO/IEC 17025 — LT 069"
};

/** Whoever pressed send: the mail leaves as njoftime@ but replies come here. */
export type EmailSignatory = Pick<LabUser, "fullName" | "email"> & Partial<Pick<LabUser, "position" | "phone">>;

export type ReportEmailItem = {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  concrete?: ConcreteCompressiveTest;
  /** Set only where the client gets a link rather than the file itself. */
  shareUrl?: string;
};

const clean = (lines: Array<string | undefined | false>) => lines.filter((line): line is string => Boolean(line));

/**
 * The closing block.
 *
 * The sender's own name and address, because a certificate arriving from a
 * notifications mailbox with no person on it is the kind of mail people leave
 * unanswered. The lab's accreditation goes under it for the same reason it is
 * on the certificate: it is what the document is worth.
 */
export function signatureLines(signer?: EmailSignatory): string[] {
  const contact = clean([signer?.phone || LAB_DETAILS.phone, signer?.email, LAB_DETAILS.web]).join(" · ");
  return clean([
    "Me respekt,",
    "",
    signer?.fullName,
    signer?.position,
    LAB_DETAILS.name,
    LAB_DETAILS.address,
    contact,
    LAB_DETAILS.accreditation
  ]);
}

/** "7215/26 — Përcaktimi i qëndrueshmërisë në tërheqje (kampioni 2026-10-225)" */
function itemLine(item: ReportEmailItem, prefix: string) {
  const test = item.test?.testType ? ` — ${item.test.testType}` : "";
  const sample = item.sample?.sampleCode ? ` (kampioni ${item.sample.sampleCode})` : "";
  return `${prefix}${item.report.reportNumber}${test}${sample}`;
}

/**
 * The strengths, for a cube report, indented under its own line.
 *
 * The same helper the WhatsApp message and the certificate use, so a client
 * who is told a figure in a covering email is told the report's figure. A
 * client reading a compressive-strength result wants to know whether it passed
 * before they open anything.
 */
function resultLines(item: ReportEmailItem) {
  return concreteResultLines({ ...item, shareUrl: item.shareUrl ?? "" }, "compact").map((line) => `  ${line}`);
}

/**
 * The covering letter for one report or a batch of them.
 *
 * `delivery` is the only difference between the two ways a report travels: the
 * register attaches the PDFs to the mail, while a single report sent from its
 * own page hands over a link, because that screen opens the user's own mail
 * client and no mail client will attach a file for us.
 */
export function reportEmailDraft(input: {
  items: ReportEmailItem[];
  client?: Client;
  project?: Project;
  signer?: EmailSignatory;
  delivery: "attached" | "link";
}): { subject: string; body: string } {
  const { items, client, project, signer, delivery } = input;
  const numbers = items.map((item) => item.report.reportNumber);
  const one = items.length === 1;
  const attached = delivery === "attached";

  const subject = one
    ? `Raport laboratorik ${numbers[0]}`
    : numbers.length <= 4
      ? `Raporte laboratorike ${numbers.join(", ")}`
      : `${numbers.length} raporte laboratorike${client?.clientCode ? ` (${client.clientCode})` : ""}`;

  // The project as the register holds it, so the client reads the same name
  // their own correspondence uses. Omitted rather than guessed when unknown.
  // The lab's name ends in a full stop of its own, so the sentence only
  // takes one when something follows it.
  const forProject = project?.projectName ? ` për objektin "${project.projectName}".` : "";
  const opening = one
    ? attached
      ? `Bashkëlidhur po ju dërgojmë raportin e provës laboratorike të kryer nga ${LAB_DETAILS.name}${forProject}`
      : `Më poshtë gjeni raportin e provës laboratorike të kryer nga ${LAB_DETAILS.name}${forProject}`
    : attached
      ? `Bashkëlidhur po ju dërgojmë raportet e provave laboratorike të kryera nga ${LAB_DETAILS.name}${forProject}`
      : `Më poshtë gjeni raportet e provave laboratorike të kryera nga ${LAB_DETAILS.name}${forProject}`;

  const list = one
    ? [
        itemLine(items[0], "Raporti "),
        ...resultLines(items[0]),
        ...(items[0].shareUrl ? ["", `Shkarkoni raportin: ${items[0].shareUrl}`] : [])
      ]
    : [
        attached ? `Raportet e bashkëlidhura (${items.length}):` : `Raportet (${items.length}):`,
        "",
        ...items.flatMap((item) =>
          clean([itemLine(item, "- "), ...resultLines(item), item.shareUrl && `  ${item.shareUrl}`])
        )
      ];

  const validity = one ? "Raporti është i vlefshëm" : "Raportet janë të vlefshme";
  const body = [
    // Not "I nderuar zoti X": the register keeps a contact name, not whether
    // that person is a man or a woman, and a letter that guesses wrong is
    // worse than one that does not try.
    "Të nderuar,",
    "",
    opening,
    "",
    ...list,
    "",
    `Provat janë kryer sipas standardeve të cituara në ${one ? "raport" : "secilin raport"}. Rezultatet u përkasin vetëm kampioneve të provuara.`,
    "",
    `${validity} vetëm ${one ? "i plotë dhe i pandryshuar" : "të plota dhe të pandryshuara"}.`,
    "",
    "Për çdo paqartësi apo informacion shtesë, mund t'i ktheni përgjigje këtij emaili.",
    "",
    ...signatureLines(signer)
  ].join("\n");

  return { subject, body };
}

/**
 * The covering letter for a period summary.
 *
 * The summary is a statement of the work, not a result: it says what was
 * received, tested and reported between two dates, and the certificates
 * themselves went out at the time. The letter says exactly that, so nobody
 * reads the summary as a substitute for the reports.
 */
export function clientSummaryEmailDraft(input: {
  client: Pick<Client, "clientName">;
  from: string;
  to: string;
  signer?: EmailSignatory;
  shareUrl?: string;
}): { subject: string; body: string } {
  const period = `${formatEuropeanDate(input.from)} - ${formatEuropeanDate(input.to)}`;
  return {
    subject: `Përmbledhje e punës laboratorike ${period} — ${input.client.clientName}`,
    body: [
      "Të nderuar,",
      "",
      `${input.shareUrl ? "Më poshtë gjeni" : "Bashkëlidhur po ju dërgojmë"} përmbledhjen e punës laboratorike të kryer nga ${LAB_DETAILS.name} për periudhën ${period}.`,
      "",
      "Përmbledhja paraqet kampionet e marra në dorëzim, provat e kryera dhe raportet e lëshuara gjatë kësaj periudhe. Rezultatet e plota jepen në raportet përkatëse, të cilat ju janë dërguar veçmas.",
      ...(input.shareUrl ? ["", `Shkarkoni përmbledhjen: ${input.shareUrl}`] : []),
      "",
      "Për çdo paqartësi apo informacion shtesë, mund t'i ktheni përgjigje këtij emaili.",
      "",
      ...signatureLines(input.signer)
    ].join("\n")
  };
}
