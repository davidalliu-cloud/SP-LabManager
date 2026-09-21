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
    const plate = specimen?.truckPlate?.trim();
    if (!plate) continue;
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
