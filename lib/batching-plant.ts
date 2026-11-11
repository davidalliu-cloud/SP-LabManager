/**
 * Impianti i betonit — which batching plant a pour came from.
 *
 * Nobody ever added a field for it. It is typed into the concrete worksheet's
 * free-text "other data" box, next to the hour the truck left the plant, and
 * that same box carries objects, levels and villa numbers for every other
 * client. So the plant is read back out of the text rather than stored, and it
 * is read out here only: the client portal lists it, filters on it and averages
 * by it, and all three have to agree about what "Impianti 2" means.
 *
 * Written loosely on purpose. IMPIANT 2, IMPIANTI 1 and Impianti nr. 3 are one
 * convention in the hands of three technicians; the plant is sometimes named
 * rather than numbered, sometimes shortened to IMP 2, and sometimes typed into
 * a cube's plate box instead of this one. Anything that is not a plant at all — OBJEKTI 2,
 * KUOTA -0.45 m, a column of truck plates — has to come back as nothing, which
 * is why the keyword is required and never guessed at.
 */

/**
 * The keyword, then the designator that follows it.
 *
 * The designator is kept short deliberately: the box usually reads
 * "IMPIANTI 2, ORA 14:27", but the comma is not guaranteed, and a greedy match
 * would make the pour's time part of the plant's name and every pour its own
 * plant.
 */
const PLANT_IN_TEXT =
  /\b(?:(?:impiant|impjant|fabrik)[a-zëç]*\s*(?:nr\.?|no\.?|#)?\s*([0-9]{1,3}[a-zëç]?|[a-zëç][a-zëç0-9-]{0,14})?|imp\.?\s*([0-9]{1,3}[a-zëç]?))/i;

/** Words that follow the keyword but name something else about the pour. */
const NOT_A_PLANT = new Set(["ORA", "ORE", "DATA", "DATE", "KUOTA", "OBJEKTI"]);

/**
 * The plant named in a worksheet's "other data", as one canonical label.
 *
 * The label is the grouping key as well as what is printed, so the spelling is
 * settled here: a plant written IMPIANT 2 by one technician and IMPIANTI 2 by
 * another is one plant on the client's page, not two.
 */
export function batchingPlant(otherData?: string): string | undefined {
  if (!otherData) return undefined;
  const match = otherData.match(PLANT_IN_TEXT);
  if (!match) return undefined;
  // The spelt-out keyword or the abbreviation, whichever matched. IMP counts
  // as a plant only with a designator behind it, so it cannot swallow an
  // unrelated word that happens to start the same way.
  const designator = (match[1] ?? match[2] ?? "").trim().toUpperCase().replace(/[.:,;]+$/, "");
  if (!designator || NOT_A_PLANT.has(designator)) return "Impianti";
  return `Impianti ${designator}`;
}

/**
 * The distinct plants behind the cubes on one report, in cube order.
 *
 * A report carries at most three cubes, and a pour can arrive from more than
 * one plant (IMP 2 for two cubes, IMP 3 for the third), so the certificate
 * names each plant that actually mixed a cube it reports, written once. Read
 * from each cube's plate box, where the plant is typed next to the registration
 * ("AB 051 KL, ORA 15:25, IMP 2"); falls back to the worksheet's other-data box
 * when nothing was typed per cube.
 */
export function plantsForReport(specimens: Array<{ truckPlate?: string }>, otherData?: string): string[] {
  const seen = new Set<string>();
  const plants: string[] = [];
  for (const specimen of specimens) {
    const plant = batchingPlant(specimen?.truckPlate);
    if (!plant || seen.has(plant)) continue;
    seen.add(plant);
    plants.push(plant);
  }
  if (!plants.length) {
    const fromOther = batchingPlant(otherData);
    if (fromOther) plants.push(fromOther);
  }
  return plants;
}

/** The plant line as it reads on the report, or undefined when there is none. */
export function formatPlantsForReport(specimens: Array<{ truckPlate?: string }>, otherData?: string) {
  const plants = plantsForReport(specimens, otherData);
  return plants.length ? `Impianti / Batching plant: ${plants.join(", ")}` : undefined;
}

/**
 * The plant each pour came from, keyed by sample.
 *
 * Keyed by the pour rather than by the test on purpose. The plant is a property
 * of the concrete that was delivered, and the 7-, 14- and 28-day worksheets off
 * one sample are the same lorry-load; the technician types the plant once, on
 * whichever worksheet they happen to be filling in when the delivery note is in
 * front of them. Read per test, the plant would show on one row in three and a
 * filter on it would hide the other two.
 *
 * Where two worksheets of one pour disagree, the first recorded wins — that is
 * a typing error in the register, not two plants, and the page should not
 * invent a second one.
 */
export function batchingPlantsBySample(
  concreteTests: PlantSource[],
  tests: Array<{ id: string; sampleId: string }>
): Map<string, string> {
  const sampleIdByTest = new Map(tests.map((test) => [test.id, test.sampleId]));
  const plants = new Map<string, string>();
  for (const concrete of concreteTests) {
    const plant = batchingPlant(concrete.otherData) ?? plantAcrossCubes(concrete);
    if (!plant) continue;
    const sampleId = sampleIdByTest.get(concrete.testId);
    if (sampleId && !plants.has(sampleId)) plants.set(sampleId, plant);
  }
  return plants;
}

/** A worksheet, as far as the plant is concerned: wherever it may have been typed. */
type PlantSource = {
  testId: string;
  otherData?: string;
  truckPlates?: string[];
  specimens?: Array<{ truckPlate?: string }>;
};

/**
 * The plant named across a pour's cubes — but only where the cubes agree.
 *
 * Some technicians write the whole delivery line into each cube's plate box,
 * which puts the plant one level below the worksheet: per cube, not per pour.
 * A pour can arrive from two plants (2026-10-227 is nine cubes off both), and
 * such a pour has no single plant. Taking the first would file nine results
 * under a plant that mixed only some of them, so a pour that disagrees with
 * itself comes back as nothing and stays out of the per-plant averages. The
 * client's own summary is finer grained and still names the plant cube by
 * cube.
 */
function plantAcrossCubes(concrete: PlantSource): string | undefined {
  const typed = [
    ...(concrete.truckPlates ?? []),
    ...(concrete.specimens ?? []).map((specimen) => specimen.truckPlate ?? "")
  ];
  const plants = new Set<string>();
  for (const line of typed) {
    const plant = batchingPlant(line);
    if (plant) plants.add(plant);
  }
  return plants.size === 1 ? [...plants][0] : undefined;
}
