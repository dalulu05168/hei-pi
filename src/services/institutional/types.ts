export type InstitutionalDataStatus = "disconnected" | "ready";

export type InstitutionalMarket = "BMV" | "NASDAQ" | "NYSE";

export type InstitutionalCountry = "México" | "Estados Unidos";

export type InstitutionalCurrency = "MXN" | "USD";

export interface InstitutionalReservation {
  assignedQuantity: number | null;
  availableQuantity: number | null;
  companyName: string;
  country: InstitutionalCountry;
  currency: InstitutionalCurrency;
  discountPercent: number | null;
  id: string;
  institutionalPrice: number | null;
  market: InstitutionalMarket;
  referencePrice: number | null;
  reservationDate: string | null;
  reservedQuantity: number | null;
  status: string | null;
  ticker: string;
}

export interface ReservationSummaryData {
  availableQuantity: number | null;
  institutionalOperations: number | null;
  reservedQuantity: number | null;
  requestStatus: string | null;
}

export interface InstitutionalReservationSnapshot {
  dataStatus: InstitutionalDataStatus;
  lastUpdatedAt: string | null;
  reservations: readonly InstitutionalReservation[];
  summary: ReservationSummaryData;
  timeZone: "America/Mexico_City";
}

export interface InstitutionalReservationService {
  getSnapshot(): Promise<InstitutionalReservationSnapshot>;
}
