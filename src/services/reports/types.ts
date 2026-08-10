export type ReportDataStatus = "disconnected" | "ready";

export type ReportCategory =
  | "clients"
  | "operations"
  | "purchases"
  | "sales"
  | "positions"
  | "market";

export type ReportStatus = "available" | "pending" | "failed" | null;

export type ReportExportFormat = "CSV" | "JSON" | "XLSX" | "PDF";

export type ReportDataSource =
  | "clients"
  | "transactions"
  | "purchases"
  | "sales"
  | "positions"
  | "market";

export interface ReportMetric {
  id: string;
  label: string;
  unit: string | null;
  value: number | string | null;
}

export interface ReportTablePreview {
  columns: readonly string[];
  rows: readonly (readonly (number | string | null)[])[];
}

export interface ReportChartPoint {
  label: string;
  value: number | null;
}

export interface ReportChartSeries {
  id: string;
  label: string;
  points: readonly ReportChartPoint[];
}

export interface Report {
  category: ReportCategory;
  chartPreview: readonly ReportChartSeries[];
  createdAt: string | null;
  createdBy: string | null;
  dataSources: readonly ReportDataSource[];
  dataUpdatedAt: string | null;
  exportFormats: readonly ReportExportFormat[];
  generatedAt: string | null;
  id: string;
  name: string;
  status: ReportStatus;
  summary: readonly ReportMetric[];
  tablePreview: ReportTablePreview;
  updatedAt: string | null;
}

export interface ReportSummaryData {
  dataUpdatedAt: string | null;
  exportableReports: number | null;
  latestGeneratedAt: string | null;
  totalReports: number | null;
}

export interface ReportCenterSnapshot {
  dataStatus: ReportDataStatus;
  reports: readonly Report[];
  summary: ReportSummaryData;
  timeZone: "America/Mexico_City";
}

export interface ReportCenterService {
  getSnapshot(): Promise<ReportCenterSnapshot>;
}
