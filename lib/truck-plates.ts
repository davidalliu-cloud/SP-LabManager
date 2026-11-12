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
 * Each cube's delivery line exactly as the technician typed it — the
 * registration plate, the hour the lorry left and the slump kept together as
 * one item, because all three describe the same lorry-load and the certificate
 * reads them as one delivery, not as separate facts.
 *
 * One line per cube, in cube order. An identical line is written once, so a
 * truck that filled two of the cubes on this report does not read as two
 * deliveries; two genuinely different lines (even from the same plate at
 * different hours) are both kept.
 */
export function deliveriesForReport(specimens: { truckPlate?: string }[], limit = 3): string[] {
  const seen = new Set<string>();
  const lines: string[] = [];

  for (const specimen of specimens) {
    const line = specimen?.truckPlate?.trim().replace(/\s+/g, " ");
    if (!line) continue;
    const key = line.toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(line);
    if (lines.length >= limit) break;
  }

  return lines;
}

/** The per-cube delivery lines as they read on the report, joined with " ; ". */
export function formatDeliveriesForReport(specimens: { truckPlate?: string }[], limit = 3) {
  const lines = deliveriesForReport(specimens, limit);
  return lines.length ? lines.join(" ; ") : undefined;
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
  // Whichever comes first: a separator, a word that names something else, or
  // the hour. The hour is its own test because it is written in forms the
  // keyword list does not hold — "0RA 14:10" with a zero for the O, "OR 11:03"
  // shortened — and a plate not cut short of one of those carries the time into
  // the plate line, where it reads as part of the registration and is printed a
  // second time beside the plant.
  const ends = [text.search(PLATE_ENDS), text.search(HOUR_IN_TEXT)].filter((index) => index >= 0);
  const cut = ends.length ? Math.min(...ends) : -1;
  const plate = (cut < 0 ? text : text.slice(0, cut)).replace(/[,;.\s]+$/, "").trim();
  // A line that starts with one of those words has no registration in front of
  // it. Better to show what was typed than an empty cell.
  return plate || text.trim();
}

/**
 * The hour the lorry left the plant, out of the same box as the plate.
 *
 * Written ORA, and written loosely: "ORA 15:25", "ORA13:40", "ORA 8 :30",
 * "ORE 11:50", and with a zero for the O — "0RA 14:10" — or shortened to OR.
 * The minutes are sometimes divided off with a semicolon: "ORA 11;00".
 *
 * The keyword is required, and that is a deliberate limit rather than an
 * oversight. Most boxes in the register write the hour with no keyword at all
 * ("AB 029 XE 12:20"), and on those the time is already printed, stuck to the
 * end of the registration on the plate line, because plateOnly has nothing to
 * cut at. Reading it here as well would print it twice. Cutting the plate at a
 * bare time instead would fix both, but it would also drop the slump those
 * same boxes carry ("SL-19"), which is recorded nowhere else — so that is a
 * decision for the lab, not a regex.
 *
 * Padded to two digits so a column of them lines up: the box holds 8:30 and
 * 08:15 for the same hour of the same morning.
 */
const HOUR_IN_TEXT = /\b(?:ora|ore|0ra|or)\s*\.?\s*:?\s*([0-9]{1,2})\s*[:;]\s*([0-9]{2})/i;

export function deliveryHour(text?: string): string | undefined {
  const match = text?.match(HOUR_IN_TEXT);
  if (!match) return undefined;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return undefined;
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

/**
 * The delivery hours behind the cubes on one report, as the other-data line
 * reads them.
 *
 * Order follows the cubes, as the plant and the plates do, so the three lists
 * can be read down together against the specimen table. An hour repeated across
 * cubes is written once: two cubes moulded off one lorry-load are one delivery,
 * and printing 15:15 three times would read as three.
 */
export function formatHoursForReport(lines: Array<string | undefined>): string | undefined {
  const hours: string[] = [];
  for (const line of lines) {
    const hour = deliveryHour(line);
    if (!hour || hours.includes(hour)) continue;
    hours.push(hour);
  }
  return hours.length ? `Ora ${hours.join(", ")}` : undefined;
}
