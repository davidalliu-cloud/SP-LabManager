/**
 * Which delivery trucks a report names, and in what order.
 *
 * A pour can arrive on up to ten trucks, but a report carries at most three
 * cubes, so at most three plates can ever appear on one — and only when each
 * of those cubes came off a different truck. The plates are not a list of the
 * trucks that served the pour; they are the trucks behind the cubes on this
 * report, which is the narrower and more useful statement.
 *
 * Order follows the cubes: the first cube's plate first, the second cube's
 * next. That way a reader comparing a strength against a delivery can count
 * down the specimen table and down the plate list together.
 *
 * A plate repeated across cubes is written once. Printing the same registration
 * twice would read as two deliveries where there was one.
 */
export function platesForReport(
  specimens: { truckPlate?: string }[],
  limit = 3
): string[] {
  const seen = new Set<string>();
  const plates: string[] = [];

  for (const specimen of specimens) {
    const typed = specimen?.truckPlate?.trim();
    if (!typed) continue;
    const plate = plateOnly(typed);
    // Case and inner spacing vary with whoever typed it; AA123BB and
    // aa 123 bb are one truck, and the register should not imply two.
    const key = plate.replace(/\s+/g, "").toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    plates.push(plate);
    if (plates.length >= limit) break;
  }

  return plates;
}

/** The plates as they read on the report line, or undefined when there are none. */
export function formatPlatesForReport(specimens: { truckPlate?: string }[], limit = 3) {
  const plates = platesForReport(specimens, limit);
  return plates.length ? `Targat / Plates: ${plates.join(", ")}` : undefined;
}

/**
 * Where the registration stops, in a plate box that holds more than one thing.
 *
 * Either a separator, or the first word that names something else about the
 * delivery. The hour is written ORA or ORE and the plant IMPIANTI or IMP, and
 * neither is ever part of a registration.
 */
const PLATE_ENDS = /[,;]|\b(?:ora|ore|data|kuota|imp|impiant|impjant|fabrik)/i;

/**
 * The registration alone, out of whatever was typed into the plate box.
 *
 * The box is one line on the worksheet, and the delivery note in front of the
 * technician carries three things, so some of them type all three:
 * "AB 916 KK, ORA 10:00, IMP 2" — the plate, the hour the lorry left, and the
 * plant it was mixed at. Printed whole, that line reads as a registration: the
 * certificate's plate line names an hour and a plant as though they were
 * trucks, and the client's own summary shows the plant under Targa with a dash
 * under Impianti, which is how this was noticed.
 *
 * Nothing is lost by cutting here. The plant is read back out of the same text
 * by `batchingPlant`, and the line as typed stays in the register and on the
 * worksheet.
 */
export function plateOnly(text: string) {
  const cut = text.search(PLATE_ENDS);
  const plate = (cut < 0 ? text : text.slice(0, cut)).replace(/[,;.\s]+$/, "").trim();
  // A line that starts with one of those words has no registration in front of
  // it. Better to show what was typed than an empty cell.
  return plate || text.trim();
}
