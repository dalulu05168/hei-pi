import type { Currency } from "@/types";

export const REPORTING_CURRENCY = "MXN" as const;
export const USD_TO_MXN_RATE = 18;

/** Converts a value to MXN without changing its source-record currency. */
export function toReportingMxn(value: number, currency: Currency) {
  return currency === "USD" ? value * USD_TO_MXN_RATE : value;
}

/** Normalizes values before adding them, preventing cross-currency summation. */
export function sumAsReportingMxn(
  values: readonly { currency: Currency; value: number | null }[],
) {
  if (values.some(({ value }) => value === null)) return null;

  return values.reduce(
    (total, { currency, value }) => total + toReportingMxn(value ?? 0, currency),
    0,
  );
}

export function formatReportingMxn(value: number | null) {
  if (value === null) return null;

  return new Intl.NumberFormat("es-MX", {
    currency: REPORTING_CURRENCY,
    currencyDisplay: "code",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}
