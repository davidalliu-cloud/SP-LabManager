"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { analysisShareUrl, newAnalysisToken } from "@/lib/analysis-link";
import { buildClientAnalysis, formatPeriod, monthPeriod } from "@/lib/client-analysis";
import { storePdfBlob } from "@/lib/pdf";
import { buildSummaryPdf, imageAsDataUrl, type SummaryChart } from "@/lib/summary-pdf";
import { formatInternational, toWhatsAppNumber, whatsAppLink } from "@/lib/phone";
import { formatEuropeanDate } from "@/lib/date-format";
import { useLabStore } from "@/lib/lab-store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Përmbledhje e punës për klientin — the analysis that goes to a client each
 * month, and the sheet that goes in front of an invoice.
 *
 * It answers, for a period the operator chooses: what did you send us, what did
 * we test, what did we issue, how long did it take, and what were the concrete
 * strengths. The report table at the bottom is the part that faces the invoice —
 * it is the list the client can tick off against their own records.
 *
 * Rejected reports are absent by design. They were never issued, so they are
 * not work to bill for, and a voided number on a client's summary invites a
 * question with no good answer.
 */
export default function ClientAnalysisPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const store = useLabStore();

  const period = useMemo(() => {
    const fallback = monthPeriod();
    const from = search.get("from") || fallback.from;
    const to = search.get("to") || fallback.to;
    return from <= to ? { from, to } : { from: to, to: from };
  }, [search]);

  const analysis = useMemo(
    () => buildClientAnalysis(store, params.id, period),
    [store.clients, store.projects, store.samples, store.tests, store.reports, store.concreteTests, params.id, period]
  );

  const record = store.clientAnalyses.find(
    (row) => row.clientId === params.id && row.from === period.from && row.to === period.to
  );
  const mintedToken = useRef(newAnalysisToken());
  const token = record?.shareToken ?? mintedToken.current;
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [pdfState, setPdfState] = useState<"idle" | "working" | "error">("idle");
  const [pdfError, setPdfError] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMessage, setSendMessage] = useState("");

  const whatsApp = toWhatsAppNumber(analysis.client?.phone);

  /**
   * Renders the sheet to a PDF, stores it, and files the record — which is what
   * makes the /a/ link resolve. Sending is a separate press, because the sheet
   * should be looked at before it goes to a client.
   */
  async function storePdf() {
    const surface = surfaceRef.current;
    if (!surface || !analysis.client) return;
    setPdfState("working");
    setPdfError("");
    try {
      const name = `analiza-${analysis.client.clientCode}-${period.from}-${period.to}`;

      // Only the charts are photographed. Everything else is drawn as text in
      // the PDF, which is what lets a table break between rows instead of
      // through one, and keeps the file small and the numbers selectable.
      const [{ default: html2canvas }, logoDataUrl, accreditationDataUrl] = await Promise.all([
        import("html2canvas"),
        imageAsDataUrl("/brand/sarp-logo.png"),
        imageAsDataUrl("/brand/da-accreditation.png")
      ]);

      const charts: SummaryChart[] = [];
      for (const node of Array.from(surface.querySelectorAll<HTMLElement>(".summary-chart"))) {
        const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff", logging: false });
        charts.push({ dataUrl: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height });
      }

      const blob = await buildSummaryPdf({
        analysis,
        issuedBy: store.users.find((user) => user.id === store.currentUserId)?.fullName ?? "—",
        logoDataUrl,
        accreditationDataUrl,
        charts
      });
      const pdfUrl = await storePdfBlob(blob, name, record?.pdfUrl);
      store.saveClientAnalysis({ clientId: params.id, from: period.from, to: period.to, pdfUrl, shareToken: token });
      setPdfState("idle");
    } catch (error) {
      setPdfState("error");
      setPdfError(error instanceof Error ? error.message : "Gabim i panjohur gjatë gjenerimit të PDF-së.");
    }
  }

  function shareUrl() {
    return analysisShareUrl(window.location.origin, analysis.client!.clientCode, token);
  }

  function confirmResend() {
    if (!record?.sentAt) return true;
    const when = new Date(record.sentAt).toLocaleString("sq-AL");
    return window.confirm(
      `Kjo përmbledhje u dërgua tashmë${record.sentTo ? ` te ${record.sentTo}` : ""} (${when}).\n\nDëshironi ta dërgoni përsëri?`
    );
  }

  /**
   * Sends from njoftime@ with the PDF attached, through the same Graph route
   * the reports use. Not a mailto: no mail client will attach a file, and the
   * server reads the PDF and the address from the register rather than taking
   * the browser's word for what it is sending to whom.
   *
   * `testToSelf` routes it to the sender instead of the client, so a summary can
   * be looked at as the client will receive it before it actually goes.
   */
  async function sendByEmail(testToSelf: boolean) {
    if (!record?.pdfUrl || sending) return;
    if (!testToSelf && (!analysis.client?.email || !confirmResend())) return;
    setSending(true);
    setSendMessage("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const response = await fetch("/api/client-analysis/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session?.access_token ?? ""}`
        },
        body: JSON.stringify({ clientId: params.id, from: period.from, to: period.to, testToSelf })
      });
      const result = (await response.json()) as { ok: boolean; error?: string; sentTo?: string };
      if (!result.ok) {
        setSendMessage(`Nuk u dërgua: ${result.error ?? "gabim i panjohur"}`);
        return;
      }
      if (testToSelf) {
        setSendMessage(`Kopje testuese u dërgua te ${result.sentTo}. Përmbledhja nuk u shënua si e dërguar.`);
        return;
      }
      store.recordClientAnalysisSent(params.id, period.from, period.to, result.sentTo ?? "", "email");
      setSendMessage(`Përmbledhja u dërgua te ${result.sentTo} me PDF-në bashkëngjitur.`);
    } catch (error) {
      setSendMessage(error instanceof Error ? error.message : "Dërgimi dështoi.");
    } finally {
      setSending(false);
    }
  }

  function sendByWhatsApp() {
    if (!record?.pdfUrl || !whatsApp.ok || !confirmResend()) return;
    const message = [
      "Pershendetje,",
      "",
      `Permbledhja e punes laboratorike per ${formatPeriod(period)}:`,
      "",
      shareUrl(),
      "",
      "SARP & LAB sh.p.k."
    ].join("\n");
    window.open(whatsAppLink(whatsApp.e164, message), "_blank", "noopener");
    store.recordClientAnalysisSent(params.id, period.from, period.to, formatInternational(whatsApp.e164), "whatsapp");
  }

  if (!analysis.client) return <PageHeader title="Klienti nuk u gjet" />;

  const { client } = analysis;
  const nothing = analysis.samplesReceived === 0 && analysis.testsCompleted === 0 && analysis.reportsIssued === 0;
  const strengthChart = analysis.concrete?.byClass.map((row) => ({
    name: row.strengthClass,
    mpa: row.averageStrengthMpa,
    specimens: row.specimens
  }));

  return (
    <>
      {/*
        Landscape, because the cube table has eleven columns and a client should
        not have to turn the page sideways to read their own results. @page is
        global when printing, which is harmless: only one page prints at a time.
      */}
      <style>{`@media print { @page { size: A4 landscape; margin: 10mm; } }`}</style>

      <div className="no-print">
        <PageHeader
          title={`Përmbledhje — ${client.clientName}`}
          description={`${client.clientCode} · ${formatPeriod(period)}`}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/clients/${client.id}`} className="btn-secondary">
                Kthehu te klienti
              </Link>
              <button onClick={() => window.print()} className="btn-primary">
                Printo / PDF
              </button>
            </div>
          }
        />
      </div>

      <section className="no-print mb-6 rounded-lg border border-line bg-lab-porcelain p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={storePdf} disabled={pdfState === "working"} className="btn-primary disabled:bg-slate-300">
            {pdfState === "working" ? "Duke gjeneruar…" : record?.pdfUrl ? "Rigjenero PDF-në" : "Gjenero dhe ruaj PDF-në"}
          </button>

          <button
            onClick={() => sendByEmail(false)}
            disabled={!record?.pdfUrl || !client.email || sending}
            className="btn-success disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {sending ? "Duke dërguar…" : "Dërgo me email"}
          </button>

          <button
            onClick={() => sendByEmail(true)}
            disabled={!record?.pdfUrl || sending}
            className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Kopje testuese te vetja
          </button>

          <button
            onClick={sendByWhatsApp}
            disabled={!record?.pdfUrl || !whatsApp.ok}
            className="rounded-md bg-[#25D366] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1DA851] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Dërgo me WhatsApp
          </button>

          {record?.pdfUrl ? (
            <a href={record.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Shiko PDF-në e ruajtur
            </a>
          ) : null}
        </div>

        {/* Why the send buttons wait: the link a client opens resolves through
            the stored PDF, so there is nothing to send until one exists. */}
        {!record?.pdfUrl ? (
          <p className="mt-2 text-xs text-muted">
            Gjeneroni PDF-në së pari — linku që hap klienti çon te dokumenti i ruajtur.
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted">
            Linku i klientit: <span className="font-semibold text-ink">/a/{client.clientCode}-{token}</span>
            {record.sentAt ? (
              <>
                {" · "}dërguar {record.sentVia === "whatsapp" ? "me WhatsApp" : "me email"}
                {record.sentTo ? ` te ${record.sentTo}` : ""} më {new Date(record.sentAt).toLocaleString("sq-AL")}
              </>
            ) : null}
          </p>
        )}

        {!client.email ? (
          <p className="mt-1 text-xs text-amber-800">Klienti nuk ka email të regjistruar.</p>
        ) : null}
        {!whatsApp.ok ? (
          <p className="mt-1 text-xs text-amber-800">
            {whatsApp.reason === "not-a-mobile"
              ? "Numri i klientit nuk është celular, prandaj nuk mund të marrë WhatsApp."
              : "Klienti nuk ka numër celulari për WhatsApp."}
          </p>
        ) : null}
        {pdfState === "error" ? <p className="mt-2 text-xs text-lab-red">{pdfError}</p> : null}
        {sendMessage ? <p className="mt-2 text-xs font-medium text-ink">{sendMessage}</p> : null}
      </section>

      {/* The printed sheet. Everything inside carries its own heading, because a
          page that leaves the screen has to say what it is without the app
          around it. */}
      {/*
        Deliberately not `print-surface`. That class belongs to the reports and
        carries their rules with it: the PDF path pins it to 210mm portrait and
        a readability rule flattens every bold weight. Applied here it squeezed
        a landscape sheet into a portrait column and took the emphasis off the
        strengths. The summary gets its own surface, and its own print rules.
      */}
      <div ref={surfaceRef} className="summary-sheet space-y-6 rounded-md bg-white p-6">
        {/* The sheet's own header. On screen as well as in print: the operator
            should see the document the client will receive, not a version of it. */}
        <header className="grid grid-cols-[170px_1fr_90px] items-start gap-4 border-b-2 border-black pb-3">
          <img src="/brand/sarp-logo.png" alt="SARP & LAB" className="h-auto w-[168px]" />
          <div className="pt-1 text-center">
            <div className="text-[15px] font-bold uppercase tracking-wide text-black">
              Përmbledhje e punës laboratorike
            </div>
            <div className="text-[11px] italic text-black/70">Laboratory work summary</div>
            <div className="mt-2 text-[13px] font-semibold text-black">{client.clientName}</div>
            <div className="text-[11px] text-black/80">
              {client.clientCode}
              {client.address ? ` · ${client.address}` : ""}
            </div>
          </div>
          <img
            src="/brand/da-accreditation.png"
            alt="DA akreditim ISO/IEC 17025 LT 069"
            className="ml-auto h-auto w-[88px]"
          />
        </header>

        <div className="grid grid-cols-2 gap-x-8 gap-y-1 border-b border-black/30 pb-2 text-[11px] text-black sm:grid-cols-4">
          <HeaderField label="Periudha / Period" value={formatPeriod(period)} />
          <HeaderField label="Lëshuar më / Issued" value={formatEuropeanDate(new Date().toISOString())} />
          <HeaderField label="Raporte / Reports" value={String(analysis.reportsIssued)} />
          <HeaderField
            label="Lëshoi / Issued by"
            value={store.users.find((user) => user.id === store.currentUserId)?.fullName ?? "—"}
          />
        </div>

        {nothing ? (
          <div className="rounded-lg border border-line bg-lab-porcelain p-6 text-sm text-ink">
            <div className="font-semibold">Asnjë aktivitet për këtë periudhë.</div>
            <p className="mt-1 text-xs text-muted">
              Nuk ka mostra të pranuara, teste të përfunduara apo raporte të lëshuara për {client.clientName} midis{" "}
              {formatPeriod(period)}.
            </p>
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Mostra të pranuara" value={analysis.samplesReceived} />
          <Tile label="Teste të përfunduara" value={analysis.testsCompleted} />
          <Tile label="Raporte të lëshuara" value={analysis.reportsIssued} />
          <Tile
            label="Kohë mesatare (ditë)"
            value={analysis.averageTurnaroundDays ?? "—"}
            hint="Nga pranimi i mostrës deri në lëshimin e raportit"
          />
        </section>

        {/* Two across: landscape has the width, and a client comparing volume
            against strength should see both without scrolling. */}
        <div className="grid gap-6 lg:grid-cols-2">
        {analysis.byTestType.length ? (
          <section className="summary-chart surface-card p-4">
            <h2 className="text-sm font-semibold text-ink">Testet sipas tipit</h2>
            <p className="mt-0.5 text-xs text-muted">Teste të përfunduara dhe raporte të lëshuara në periudhë.</p>
            <div className="mt-4" style={{ height: Math.max(220, analysis.byTestType.length * 34) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.byTestType} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="label" width={230} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="tests" name="Teste" fill="#6B1D3F" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="reports" name="Raporte" fill="#C9A227" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        ) : null}

        {analysis.byMonth.length > 1 ? (
          <section className="summary-chart surface-card p-4">
            <h2 className="text-sm font-semibold text-ink">Rrjedha sipas mujore</h2>
            <p className="mt-0.5 text-xs text-muted">Vetëm kur periudha përfshin më shumë se një muaj.</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysis.byMonth} margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="samples" name="Mostra" stroke="#1F4E79" strokeWidth={2} />
                  <Line type="monotone" dataKey="tests" name="Teste" stroke="#6B1D3F" strokeWidth={2} />
                  <Line type="monotone" dataKey="reports" name="Raporte" stroke="#C9A227" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        ) : null}

        {analysis.concrete && strengthChart ? (
          <section className="summary-chart surface-card p-4">
            <h2 className="text-sm font-semibold text-ink">Rezistenca në shtypje</h2>
            <p className="mt-0.5 text-xs text-muted">
              {analysis.concrete.specimens} kampione · mesatarja {analysis.concrete.averageStrengthMpa} MPa · minimumi{" "}
              {analysis.concrete.minStrengthMpa} MPa · maksimumi {analysis.concrete.maxStrengthMpa} MPa
            </p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strengthChart} margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis unit=" MPa" tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number, name) => (name === "mpa" ? `${value} MPa` : value)} />
                  <Bar dataKey="mpa" name="Mesatarja" radius={[3, 3, 0, 0]}>
                    {strengthChart.map((row) => (
                      <Cell key={row.name} fill="#6B1D3F" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted">
              Mesataret janë të kampionëve të testuar në këtë periudhë, grupuar sipas klasës së deklaruar. Konformiteti
              me klasën vlerësohet sipas EN 206 mbi të gjithë derdhjen dhe nuk deklarohet në këtë përmbledhje.
            </p>
          </section>
        ) : null}

        </div>

        {analysis.projects.length ? (
          <section className="surface-card overflow-hidden">
            <header className="border-b border-line bg-lab-porcelain px-4 py-2.5">
              <h2 className="text-sm font-semibold text-ink">Objektet</h2>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-sm">
                <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-2">Objekti</th>
                    <th className="px-4 py-2 text-right">Mostra</th>
                    <th className="px-4 py-2 text-right">Teste</th>
                    <th className="px-4 py-2 text-right">Raporte</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.projects.map((project) => (
                    <tr key={project.id} className="border-b border-line/70 last:border-0">
                      <td className="px-4 py-2.5 text-ink">{project.name}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{project.samples}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{project.tests}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{project.reports}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {analysis.concreteRows.length ? (
          <section className="surface-card overflow-hidden">
            <header className="flex items-baseline justify-between gap-3 border-b border-line bg-lab-porcelain px-4 py-2.5">
              <div>
                <h2 className="text-sm font-semibold text-ink">Rezistenca në shtypje — kubikë betoni</h2>
                <p className="text-xs text-muted">
                  Çdo set kubikësh: data e betonimit, data e provës, mosha dhe rezultatet.
                </p>
              </div>
              <span className="whitespace-nowrap text-xs text-muted">
                {analysis.concreteRows.reduce((sum, row) => sum + row.cubes.length, 0)} kubikë ·{" "}
                {analysis.concreteRows.length} sete
              </span>
            </header>
            <div className="overflow-x-auto">
              {/* One line per cube, every column filled on every line even where
                  it repeats. A sheet whose continuation rows are blank reads
                  only from the top down: it cannot be sorted, filtered or cut
                  and pasted into the client's own records, and a page break in
                  the wrong place leaves a row that says nothing about itself.
                  The repetition costs a little ink and makes every line stand
                  on its own. */}
              <table className="w-full min-w-[64rem] text-[12px]">
                <thead className="border-b border-line text-left text-[10px] uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-3 py-2">Kubi</th>
                    <th className="px-3 py-2">Objekti / elementi</th>
                    <th className="px-3 py-2">Klasa</th>
                    <th className="px-3 py-2">Betonimi</th>
                    <th className="px-3 py-2">Prova</th>
                    <th className="px-3 py-2 text-right">Mosha</th>
                    <th className="px-3 py-2 text-right">Pesha (kg)</th>
                    <th className="px-3 py-2 text-right">Ngarkesa (kN)</th>
                    <th className="px-3 py-2 text-right">Rezistenca (MPa)</th>
                    <th className="px-3 py-2">Targa</th>
                    <th className="px-3 py-2">Raporti</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.concreteRows.flatMap((row, rowIndex) =>
                    row.cubes.map((cube, cubeIndex) => (
                      <tr
                        key={`${row.sampleCode}-${row.ageDays}-${rowIndex}-${cube.specimenCode}-${cubeIndex}`}
                        className={cubeIndex === 0 ? "border-t border-line" : ""}
                      >
                        <td className="whitespace-nowrap px-3 py-1.5 font-semibold tabular-nums text-ink">
                          {cube.specimenCode}
                        </td>
                        <td className="px-3 py-1.5 text-ink">
                          {row.element}
                          {row.projectName && row.projectName !== "—" ? (
                            <span className="block text-[11px] text-muted">{row.projectName}</span>
                          ) : null}
                        </td>
                        <td className="whitespace-nowrap px-3 py-1.5 tabular-nums">{row.strengthClass}</td>
                        <td className="whitespace-nowrap px-3 py-1.5 tabular-nums">{formatEuropeanDate(row.castingDate)}</td>
                        <td className="whitespace-nowrap px-3 py-1.5 tabular-nums">{formatEuropeanDate(row.testDate)}</td>
                        <td className="whitespace-nowrap px-3 py-1.5 text-right tabular-nums">
                          {cube.ageDays ? `${cube.ageDays} d` : "—"}
                        </td>
                        <td className="px-3 py-1.5 text-right tabular-nums">
                          {typeof cube.weightKg === "number" && cube.weightKg > 0 ? cube.weightKg.toFixed(2) : "—"}
                        </td>
                        <td className="px-3 py-1.5 text-right tabular-nums">
                          {typeof cube.loadKn === "number" && cube.loadKn > 0 ? cube.loadKn.toFixed(1) : "—"}
                        </td>
                        <td className="px-3 py-1.5 text-right font-semibold tabular-nums text-ink">
                          {typeof cube.strengthMpa === "number" && cube.strengthMpa > 0
                            ? cube.strengthMpa.toFixed(2)
                            : "—"}
                        </td>
                        <td className="px-3 py-1.5 text-[11px] uppercase">{cube.truckPlate ?? "—"}</td>
                        <td className="whitespace-nowrap px-3 py-1.5 tabular-nums">{row.reportNumber}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="border-t border-line px-4 py-2 text-[11px] leading-5 text-muted">
              Mesatarja është e kubikëve të këtij seti. Konformiteti me klasën vlerësohet sipas EN 206 mbi të gjithë
              derdhjen dhe nuk deklarohet këtu.
            </p>
          </section>
        ) : null}

        {analysis.reportRows.length ? (
          <section className="surface-card overflow-hidden">
            <header className="flex items-baseline justify-between gap-3 border-b border-line bg-lab-porcelain px-4 py-2.5">
              <h2 className="text-sm font-semibold text-ink">Raportet e lëshuara</h2>
              <span className="text-xs text-muted">{analysis.reportRows.length}</span>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] text-sm">
                <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-2">Nr. raporti</th>
                    <th className="px-4 py-2">Nr. regjistri</th>
                    <th className="px-4 py-2">Objekti</th>
                    <th className="px-4 py-2">Testi</th>
                    <th className="px-4 py-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.reportRows.map((row) => (
                    <tr key={row.reportNumber} className="border-b border-line/70 last:border-0">
                      <td className="whitespace-nowrap px-4 py-2.5 font-semibold tabular-nums text-ink">{row.reportNumber}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 tabular-nums">{row.sampleCode}</td>
                      <td className="px-4 py-2.5">{row.projectName}</td>
                      <td className="px-4 py-2.5">{row.testType}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 tabular-nums">{formatEuropeanDate(row.issuedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <p className="text-xs leading-5 text-muted">
          Mostrat numërohen sipas datës së pranimit, testet sipas datës së përfundimit dhe raportet sipas datës së
          lëshimit — një mostër e pranuar në fund të muajit testohet dhe raportohet në muajin pasardhës. Raportet e
          refuzuara nuk përfshihen.
        </p>
      </div>
    </>
  );
}

function HeaderField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold uppercase tracking-wide text-black/60">{label}: </span>
      <span className="tabular-nums text-black">{value}</span>
    </div>
  );
}

function Tile({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="text-2xl font-bold tabular-nums text-ink">{value}</div>
      <div className="mt-1 text-sm font-medium text-ink">{label}</div>
      {hint ? <div className="mt-1 text-xs leading-4 text-muted">{hint}</div> : null}
    </div>
  );
}
