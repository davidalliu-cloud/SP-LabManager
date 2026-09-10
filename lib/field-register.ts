import { getAccreditedTestById, normalizeSampleType } from "./accredited-tests";

/**
 * Rregjistri i Terrenit — work carried out on site rather than in the lab.
 *
 * These four are registered in the field register and nowhere else. They are
 * ordinary samples underneath, so once registered they flow into the test
 * register and the report register exactly like lab work; only the point of
 * entry differs. That is also why they cannot be a separate record type: a
 * parallel list could never appear in those registers.
 *
 * This module is the single place that decides what is field work. The sample
 * register excludes these types, the field register offers only these types,
 * and both read the same list.
 */
export type FieldWorkOption = {
  /** The accredited test this sample is registered for. */
  accreditedTestId: string;
  /** Stored on the sample, and what the two registers filter on. */
  sampleType: string;
  /** Shown in the field register's dropdown. */
  label: string;
};

export const FIELD_WORK_OPTIONS: FieldWorkOption[] = [
  {
    accreditedTestId: "AT-069",
    sampleType: "Sklerometër / Rebound Hammer",
    label: "Sklerometër / Hammer Schmidt"
  },
  {
    accreditedTestId: "AT-056",
    sampleType: "Piastra Statike / Static Plate",
    label: "Piastra statike / Static plate"
  },
  {
    accreditedTestId: "AT-057",
    sampleType: "Piastra Dinamike / Dynamic Plate",
    label: "Piastra dinamike / Dynamic plate"
  },
  {
    accreditedTestId: "AT-CONC-CORE-COMP",
    sampleType: "Karrota Betoni / Concrete Cores",
    label: "Karrota betoni / Concrete cores"
  }
];

const FIELD_SAMPLE_TYPES = new Set(FIELD_WORK_OPTIONS.map((option) => option.sampleType));

export function isFieldSampleType(sampleType?: string) {
  if (!sampleType) return false;
  return FIELD_SAMPLE_TYPES.has(normalizeSampleType(sampleType));
}

export function isFieldSample(sample: { sampleType?: string }) {
  return isFieldSampleType(sample.sampleType);
}

export function fieldOptionForSampleType(sampleType?: string) {
  if (!sampleType) return undefined;
  const normalized = normalizeSampleType(sampleType);
  return FIELD_WORK_OPTIONS.find((option) => option.sampleType === normalized);
}

/** The accredited test behind a field option, for its name and standard. */
export function accreditedTestForFieldOption(option: FieldWorkOption) {
  return getAccreditedTestById(option.accreditedTestId);
}
