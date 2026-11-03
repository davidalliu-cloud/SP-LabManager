/**
 * Rezistenca në shtypje sipas impiantit — what each batching plant has given.
 *
 * A client running two plants onto one site asks this first, and until now
 * answered it by laying thirty certificates side by side. One row per plant:
 * the band spans the lowest to the highest cube, the solid rule marks the mean,
 * and every plant is drawn on one shared scale so the rows can be read against
 * each other.
 *
 * No pass or fail. Conformity against the strength class is judged by EN 206
 * over the whole pour, not over the cubes one laboratory happened to receive,
 * and a band coloured red here would be a declaration no report has made.
 */
export type PlantStrengths = {
  plant: string;
  cubes: number;
  average: number;
  min: number;
  max: number;
};

export type PlantAxis = { from: number; to: number };

export function PlantComparison({ rows, axis }: { rows: PlantStrengths[]; axis: PlantAxis }) {
  if (!rows.length) return null;
  const span = axis.to - axis.from;
  const at = (value: number) => `${((value - axis.from) / span) * 100}%`;

  return (
    <section className="surface-card mb-5 p-4">
      <h2 className="text-base font-semibold text-ink">Rezistenca në shtypje sipas impiantit</h2>
      <p className="mt-1 max-w-3xl text-xs leading-5 text-muted">
        Secili impiant me kubikët e tij: brezi shkon nga rezultati më i ulët deri te më i larti, vija e plotë shënon
        mesataren, dhe shkalla nis nga vlera e rrumbullakosur poshtë rezultateve — jo nga zero. Konformiteti me klasën
        vlerësohet sipas EN 206 mbi të gjithë derdhjen dhe nuk deklarohet këtu.
      </p>
      <div className="mt-4 space-y-4">
        {rows.map((row) => (
          <div key={row.plant}>
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
              <span className="font-semibold text-ink">{row.plant}</span>
              <span className="tabular-nums text-muted">
                {row.cubes} kubikë · mesatare <span className="font-semibold text-ink">{row.average.toFixed(2)} MPa</span>{" "}
                · min {row.min.toFixed(2)} · maks {row.max.toFixed(2)}
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-lab-mist">
              {/* A set of one cube has no band to draw, so the minimum width
                  keeps it from vanishing under the mean's rule. */}
              <div
                className="absolute inset-y-0 min-w-[3px] rounded-full bg-lab-burgundy/30"
                style={{ left: at(row.min), width: `${((row.max - row.min) / span) * 100}%` }}
              />
              <div
                className="absolute inset-y-[-2px] w-[3px] -translate-x-1/2 rounded bg-lab-burgundy"
                style={{ left: at(row.average) }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] tabular-nums text-muted">
        <span>{axis.from} MPa</span>
        <span>{axis.to} MPa</span>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">
        Filtroni tabelën më poshtë sipas impiantit për t&apos;i shikuar provat e secilit veç e veç.
      </p>
    </section>
  );
}
