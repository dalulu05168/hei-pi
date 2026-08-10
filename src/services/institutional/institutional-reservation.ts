import type {
  InstitutionalReservationService,
  InstitutionalReservationSnapshot,
} from "./types";

const institutionalSnapshot: InstitutionalReservationSnapshot = {
  dataStatus: "ready",
  lastUpdatedAt: new Date().toISOString(),
  reservations: [
    { id: "inst-amxl", ticker: "AMXL", companyName: "América Móvil", market: "BMV", country: "México", currency: "MXN", reservedQuantity: 180000, availableQuantity: 92000, assignedQuantity: 88000, institutionalPrice: 16.84, referencePrice: 17.31, discountPercent: 2.7, status: "Disponible", reservationDate: "2026-08-06" },
    { id: "inst-walmex", ticker: "WALMEX", companyName: "Walmart de México", market: "BMV", country: "México", currency: "MXN", reservedQuantity: 125000, availableQuantity: 47000, assignedQuantity: 78000, institutionalPrice: 56.12, referencePrice: 57.4, discountPercent: 2.2, status: "Disponible", reservationDate: "2026-08-06" },
    { id: "inst-aapl", ticker: "AAPL", companyName: "Apple Inc.", market: "NASDAQ", country: "Estados Unidos", currency: "USD", reservedQuantity: 24000, availableQuantity: 0, assignedQuantity: 24000, institutionalPrice: 211.45, referencePrice: 216.1, discountPercent: 2.2, status: "Asignada", reservationDate: "2026-08-05" },
    { id: "inst-nvda", ticker: "NVDA", companyName: "NVIDIA Corporation", market: "NASDAQ", country: "Estados Unidos", currency: "USD", reservedQuantity: 16000, availableQuantity: 6200, assignedQuantity: 9800, institutionalPrice: 175.84, referencePrice: 180.2, discountPercent: 2.4, status: "Disponible", reservationDate: "2026-08-06" },
    { id: "inst-msft", ticker: "MSFT", companyName: "Microsoft Corporation", market: "NASDAQ", country: "Estados Unidos", currency: "USD", reservedQuantity: 18500, availableQuantity: 7600, assignedQuantity: 10900, institutionalPrice: 403.82, referencePrice: 412.35, discountPercent: 2.1, status: "Disponible", reservationDate: "2026-08-06" },
    { id: "inst-googl", ticker: "GOOGL", companyName: "Alphabet Inc.", market: "NASDAQ", country: "Estados Unidos", currency: "USD", reservedQuantity: 22000, availableQuantity: 8300, assignedQuantity: 13700, institutionalPrice: 191.34, referencePrice: 196.12, discountPercent: 2.4, status: "Disponible", reservationDate: "2026-08-06" },
    { id: "inst-tsla", ticker: "TSLA", companyName: "Tesla Inc.", market: "NASDAQ", country: "Estados Unidos", currency: "USD", reservedQuantity: 12000, availableQuantity: 3900, assignedQuantity: 8100, institutionalPrice: 315.7, referencePrice: 326.48, discountPercent: 3.3, status: "En validación", reservationDate: "2026-08-06" },
    { id: "inst-gfnorte", ticker: "GFNORTEO", companyName: "Grupo Financiero Banorte", market: "BMV", country: "México", currency: "MXN", reservedQuantity: 98000, availableQuantity: 41000, assignedQuantity: 57000, institutionalPrice: 168.42, referencePrice: 172.18, discountPercent: 2.2, status: "Disponible", reservationDate: "2026-08-06" },
    { id: "inst-bimbo", ticker: "BIMBOA", companyName: "Grupo Bimbo", market: "BMV", country: "México", currency: "MXN", reservedQuantity: 140000, availableQuantity: 68000, assignedQuantity: 72000, institutionalPrice: 57.86, referencePrice: 59.41, discountPercent: 2.6, status: "Disponible", reservationDate: "2026-08-06" },
    { id: "inst-cemex", ticker: "CEMEXCPO", companyName: "CEMEX", market: "BMV", country: "México", currency: "MXN", reservedQuantity: 260000, availableQuantity: 114000, assignedQuantity: 146000, institutionalPrice: 13.92, referencePrice: 14.35, discountPercent: 3.0, status: "Disponible", reservationDate: "2026-08-06" },
    { id: "inst-femsa", ticker: "FEMSAUBD", companyName: "FEMSA", market: "BMV", country: "México", currency: "MXN", reservedQuantity: 76000, availableQuantity: 29000, assignedQuantity: 47000, institutionalPrice: 184.76, referencePrice: 188.92, discountPercent: 2.2, status: "Asignada", reservationDate: "2026-08-05" },
    { id: "inst-kimber", ticker: "KIMBERA", companyName: "Kimberly-Clark de México", market: "BMV", country: "México", currency: "MXN", reservedQuantity: 112000, availableQuantity: 52000, assignedQuantity: 60000, institutionalPrice: 35.21, referencePrice: 36.17, discountPercent: 2.7, status: "Disponible", reservationDate: "2026-08-06" },
  ],
  summary: {
    availableQuantity: 145200,
    institutionalOperations: 12,
    reservedQuantity: 1083500,
    requestStatus: "Disponible",
  },
  timeZone: "America/Mexico_City",
};

// This isolated source can be replaced by an institutional API without
// sharing storage with clients, positions, or buy/sell operations.
export const institutionalReservationService: InstitutionalReservationService = {
  async getSnapshot() {
    return institutionalSnapshot;
  },
};
