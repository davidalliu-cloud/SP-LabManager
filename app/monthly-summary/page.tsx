"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { FilterField } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { SummaryCard } from "@/components/ui/summary-card";
import { formatEuropeanDate } from "@/lib/date-format";
import { buildLabPerformance, lastMonths } from "@/lib/lab-performance";
import type { PerformancePeriod } from "@/lib/lab-performance";
import { useLabStore } from "@/lib/lab-store";

const RANGES = [
  { months: 3, label: "3 muajt e fundit" },
  { months: 6, label: "6 muajt e fundit" },
  { months: 12, label: "12 muajt e fundit" },
  { months: 36, label: "Që nga fillimi" }
];

const INK = "#373455";
const BURGUNDY = "#5B193F";
const CYAN = "#6BAEAD";
const GOLD = "#D8A13B";
const GREEN = "#10BB82";

function Delta({ now, before, invert = false, suffix = "" }: { now?: number; before?: number; invert?: boolean; suffix?: string }) {
  if (now === undefined || before === undefined || before === 0) return null;
  const change = Number((((now - before) / before) * 100).toFixed(0));
  if (!Number.isFinite(change) || change === 0) return <span className="text-muted">pa ndryshim</span>;
  // On turnaround and rework, down is the good direction.
  const good = invert ? change < 0 : change > 0;
  return (
    <span className={good ? "text-lab-green" : "text-lab-terracotta"}>
      {change > 0 ? "▲" : "▼"} {Math.abs(change)}%{suffix} kundrejt periudhës së kaluar
    </span>
  );
}

function Panel({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-5">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {note ? <p className="mt-1 text-xs text-muted">{note}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function LabPerformancePage() {
  const store = useLabStore();
  const [months, setMonths] = useState(6);
  const [custom, setCustom] = useState<PerformancePeriod | null>(null);

  const period = useMemo(() => custom ?? lastMonths(months), [custom, months]);
  const data = useMemo(() => buildLabPerformance(store, period), [store, period]);

  const { totals, previous, concentration } = data;

  return (
    <>
      <PageHeader
        title="Performanca e Laboratorit"
        description={`${formatEuropeanDate(period.from)} – ${formatEuropeanDate(period.to)}. Vëllimi, shpejtësia, njerëzit dhe kapaciteti i pashitur.`}
      />

      <div className="no-print mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr]">
        <FilterField label="Periudha">
          <select
            value={custom ? "custom" : String(months)}
            onChange={(event) => {
              if (event.target.value === "custom") return;
              setCustom(null);
              setMonths(Number(event.target.value));
            }}
            className="input mt-1"
          >
            {RANGES.map((range) => (
              <option key={range.months} value={range.months}>{range.label}</option>
            ))}
            {custom ? <option value="custom">Periudhë e zgjedhur</option> : null}
          </select>
        </FilterField>
        <FilterField label="Nga">
          <input
            type="date"
            value={period.from}
            onChange={(event) => setCustom({ from: event.target.value, to: period.to })}
            className="input mt-1"
          />
        </FilterField>
        <FilterField label="Deri">
          <input
            type="date"
            value={period.to}
            onChange={(event) => setCustom({ from: period.from, to: event.target.value })}
            className="input mt-1"
          />
        </FilterField>
      </div>

      {/* --- How the lab is doing ------------------------------------------ */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Kampionë të pranuar"
          value={totals.samples}
          detail={`${previous.samples} në periudhën e kaluar`}
        />
        <SummaryCard
          label="Teste të përfunduara"
          value={totals.testsCompleted}
          tone="green"
          detail={`${previous.testsCompleted} në periudhën e kaluar`}
        />
        <SummaryCard
          label="Raporte të miratuara"
          value={totals.reportsApproved}
          tone="purple"
          detail="Miratimi është hapi i fundit që sistemi regjistron"
        />
        <SummaryCard
          label="Vonesa pas afatit"
          value={totals.lagAfterDueDays === undefined ? "—" : `${totals.lagAfterDueDays} ditë`}
          tone={totals.lagAfterDueDays !== undefined && totals.lagAfterDueDays <= 1 ? "green" : "amber"}
          detail={
            previous.lagAfterDueDays !== undefined
              ? `më parë ${previous.lagAfterDueDays} ditë · nga pranimi ${totals.turnaroundDays ?? "—"} ditë`
              : `Nga pranimi në rezultat: ${totals.turnaroundDays ?? "—"} ditë`
          }
        />
        <SummaryCard
          label="Rezultate të futura në afat"
          value={totals.onTimePercent === undefined ? "—" : `${totals.onTimePercent}%`}
          tone={totals.onTimePercent !== undefined && totals.onTimePercent >= 80 ? "green" : "red"}
          detail="Sipas datës së kërkuar të testimit"
        />
        <SummaryCard
          label="Teste të hapura / me vonesë"
          value={`${totals.openTests} / ${totals.overdueTests}`}
          tone={totals.overdueTests > 0 ? "red" : "green"}
          detail="Gjendja aktuale, jo e periudhës"
        />
      </section>

      <div className="mt-2 text-xs text-muted">
        <Delta now={totals.testsCompleted} before={previous.testsCompleted} /> ·{" "}
        <Delta now={totals.lagAfterDueDays} before={previous.lagAfterDueDays} invert />
      </div>
      <p className="mt-2 text-xs text-muted">
        “Vonesa pas afatit” është koha që varet nga laboratori: ditë nga data e kërkuar e testimit deri kur rezultati u fut në sistem.
        “Nga pranimi” përfshin edhe maturimin — një kub 28-ditësh nuk mund të testohet më shpejt — ndaj nuk mat shpejtësinë e punës.
      </p>

      {/* --- Trend ---------------------------------------------------------- */}
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel title="Vëllimi muaj pas muaji" note="Kampionë të pranuar, teste të përfunduara dhe raporte të miratuara.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.months}>
                <CartesianGrid stroke="#E3E3E3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar name="Kampionë" dataKey="samples" fill={CYAN} radius={[3, 3, 0, 0]} />
                <Bar name="Teste" dataKey="testsCompleted" fill={BURGUNDY} radius={[3, 3, 0, 0]} />
                <Bar name="Raporte" dataKey="reportsApproved" fill={INK} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Shpejtësia dhe afatet"
          note="Vonesa mesatare pas datës së kërkuar, dhe përqindja e rezultateve të futura brenda afatit."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.months}>
                <CartesianGrid stroke="#E3E3E3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="days" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="pct" orientation="right" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="days" name="Vonesa (ditë)" type="monotone" dataKey="lagAfterDueDays" stroke={GOLD} strokeWidth={2} dot={{ r: 3 }} connectNulls />
                <Line yAxisId="pct" name="Në afat %" type="monotone" dataKey="onTimePercent" stroke={GREEN} strokeWidth={2} dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </section>

      {/* --- People --------------------------------------------------------- */}
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel
          title="Teknikët"
          note="Kush e ka kryer testin, sipas fletës së punës — jo kujt i është caktuar."
        >
          {data.technicians.length === 0 ? (
            <p className="text-sm text-muted">Asnjë test i përfunduar në këtë periudhë.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-3 py-2">Teknik</th>
                  <th className="px-3 py-2">Teste</th>
                  <th className="px-3 py-2">Pesha</th>
                  <th className="px-3 py-2">Vonesa</th>
                  <th className="px-3 py-2">Lloje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.technicians.map((row) => (
                  <tr key={row.name}>
                    <td className="px-3 py-2 font-semibold text-ink">{row.name}</td>
                    <td className="px-3 py-2">{row.tests}</td>
                    <td className="px-3 py-2">{row.sharePercent}%</td>
                    <td className="px-3 py-2">{row.lagAfterDueDays === undefined ? "—" : `${row.lagAfterDueDays} ditë`}</td>
                    <td className="px-3 py-2">{row.sampleTypes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {concentration.topTechnicianShare !== undefined && concentration.topTechnicianShare >= 70 ? (
            <p className="mt-4 rounded-md border border-[#f0a93a] bg-brand-risk p-3 text-xs font-semibold text-ink">
              {concentration.topTechnicianName} ka kryer {concentration.topTechnicianShare}% të testeve. Nëse mungon, laboratori ndalet —
              ose fleta e punës po ruhet gjithmonë me të njëjtin emër dhe puna e të tjerëve nuk po regjistrohet.
            </p>
          ) : null}
        </Panel>

        <Panel title="Miratimi i raporteve" note="Kush i miraton dhe sa kthehen për korrigjim.">
          {data.reviewers.length === 0 ? (
            <p className="text-sm text-muted">Asnjë raport i miratuar në këtë periudhë.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-3 py-2">Personi</th>
                  <th className="px-3 py-2">Miratuar</th>
                  <th className="px-3 py-2">Refuzuar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.reviewers.map((row) => (
                  <tr key={row.name}>
                    <td className="px-3 py-2 font-semibold text-ink">{row.name}</td>
                    <td className="px-3 py-2">{row.approved}</td>
                    <td className="px-3 py-2">{row.rejected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="mt-4 text-xs text-muted">
            Ripunimi: {totals.reworkPercent === undefined ? "—" : `${totals.reworkPercent}%`} e raporteve janë kthyer të paktën një herë.
          </p>
        </Panel>
      </section>

      {/* --- What sells, and what does not ---------------------------------- */}
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel title="Çfarë po kërkohet" note="Kampionë sipas llojit, me ndryshimin kundrejt periudhës së kaluar.">
          {data.testTypes.length === 0 ? (
            <p className="text-sm text-muted">Asnjë kampion në këtë periudhë.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-3 py-2">Lloji</th>
                  <th className="px-3 py-2">Kampionë</th>
                  <th className="px-3 py-2">Pesha</th>
                  <th className="px-3 py-2">Vonesa</th>
                  <th className="px-3 py-2">Ndryshimi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.testTypes.map((row) => (
                  <tr key={row.sampleType}>
                    <td className="px-3 py-2 font-semibold text-ink">{row.sampleType}</td>
                    <td className="px-3 py-2">{row.samples}</td>
                    <td className="px-3 py-2">{row.sharePercent}%</td>
                    <td className={`px-3 py-2 ${row.lagAfterDueDays !== undefined && row.lagAfterDueDays > 5 ? "font-semibold text-lab-terracotta" : ""}`}>
                      {row.lagAfterDueDays === undefined ? "—" : `${row.lagAfterDueDays} ditë`}
                    </td>
                    <td className={`px-3 py-2 ${row.changePercent === undefined ? "text-muted" : row.changePercent >= 0 ? "text-lab-green" : "text-lab-terracotta"}`}>
                      {row.changePercent === undefined ? "i ri" : `${row.changePercent > 0 ? "+" : ""}${row.changePercent}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        <Panel
          title="Kapacitet i akredituar i pashitur"
          note="Lloje për të cilat laboratori është i akredituar, por që nuk kanë sjellë asnjë kampion në këtë periudhë. Kjo është lista e asaj që mund të shitet nesër pa asnjë investim."
        >
          {data.dormant.length === 0 ? (
            <p className="text-sm text-muted">Çdo lloj i akredituar ka pasur punë në këtë periudhë.</p>
          ) : (
            <>
              <p className="mb-3 text-sm font-semibold text-ink">
                {concentration.dormantCount} nga {concentration.accreditedCount} lloje të akredituara pa asnjë kampion.
              </p>
              <div className="max-h-72 overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="table-head">
                    <tr>
                      <th className="px-3 py-2">Lloji</th>
                      <th className="px-3 py-2">Hera e fundit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {data.dormant.map((row) => (
                      <tr key={row.sampleType}>
                        <td className="px-3 py-2">{row.sampleType}</td>
                        <td className="px-3 py-2 text-muted">
                          {row.lastSeen ? formatEuropeanDate(row.lastSeen) : "Asnjëherë"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Panel>
      </section>

      {/* --- Clients -------------------------------------------------------- */}
      <section className="mt-5">
        <Panel
          title="Klientët"
          note="Sa kampionë sjell secili dhe sa lloje testesh blen. Një klient me shumë kampionë por një lloj të vetëm është vendi më i lehtë për të shitur një test të dytë."
        >
          {data.clients.length === 0 ? (
            <p className="text-sm text-muted">Asnjë kampion në këtë periudhë.</p>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.clients.slice(0, 10)} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid stroke="#E3E3E3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar name="Kampionë" dataKey="samples" fill={BURGUNDY} radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="max-h-80 overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="table-head">
                    <tr>
                      <th className="px-3 py-2">Klienti</th>
                      <th className="px-3 py-2">Kampionë</th>
                      <th className="px-3 py-2">Pesha</th>
                      <th className="px-3 py-2">Lloje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {data.clients.map((row) => (
                      <tr key={row.clientId}>
                        <td className="px-3 py-2 font-semibold text-ink">{row.name}</td>
                        <td className="px-3 py-2">{row.samples}</td>
                        <td className="px-3 py-2">{row.sharePercent}%</td>
                        <td className={`px-3 py-2 ${row.sampleTypes === 1 && row.samples >= 5 ? "font-semibold text-lab-gold" : ""}`}>
                          {row.sampleTypes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {concentration.topClientShare !== undefined && concentration.topClientShare >= 30 ? (
            <p className="mt-4 rounded-md border border-[#f0a93a] bg-brand-risk p-3 text-xs font-semibold text-ink">
              {concentration.topClientName} zë {concentration.topClientShare}% të kampionëve. Humbja e një klienti të vetëm do të ndihej menjëherë.
            </p>
          ) : null}
        </Panel>
      </section>
    </>
  );
}
