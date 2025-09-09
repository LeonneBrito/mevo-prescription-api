import type { Prescription } from "src/types";

export function normalizedRow(row: unknown): Prescription {
  const obj = row as Record<string, any>;
  return {
    ...obj,
    days: obj.frequency,
  } as Prescription;
}