import type { ReportCenterService, ReportCenterSnapshot } from "./types";

const disconnectedSnapshot: ReportCenterSnapshot = {
  dataStatus: "disconnected",
  reports: [],
  summary: {
    dataUpdatedAt: null,
    exportableReports: null,
    latestGeneratedAt: null,
    totalReports: null,
  },
  timeZone: "America/Mexico_City",
};

// La implementación real será una capa de lectura. Consolidará datos canónicos
// de Clientes, Operaciones y Posiciones sin modificar sus fuentes de origen.
export const reportCenterService: ReportCenterService = {
  async getSnapshot() {
    return disconnectedSnapshot;
  },
};
