export type TemplateDataStatus = "disconnected" | "ready";

export type TemplateCategory = "script" | "message" | "trade" | "other";

export type TemplateProjectStatus = "active" | "inactive" | "draft" | null;

export type TemplateProjectType =
  | "buy"
  | "sell"
  | "vip-ticket"
  | "regular-ticket"
  | "dual-ticket"
  | "custom";

export interface TemplateVariable {
  key: string;
  label: string;
  valueSource: string | null;
}

export interface TemplateUsageRecord {
  id: string;
  referenceId: string | null;
  usedAt: string;
}

export interface TemplateChangeRecord {
  author: string | null;
  changedAt: string;
  description: string | null;
  id: string;
}

export interface TemplateNodeDefinition {
  attrs: Readonly<Record<string, unknown>>;
  className: string;
}

export interface TemplateProject {
  applicable: string | null;
  background: string | null;
  category: TemplateCategory;
  changeRecords: readonly TemplateChangeRecord[];
  createdAt: string | null;
  id: string;
  name: string;
  nodes: readonly TemplateNodeDefinition[];
  previewSourceUrl: string | null;
  status: TemplateProjectStatus;
  templateType: TemplateProjectType;
  updatedAt: string | null;
  usageCount: number | null;
  usageRecords: readonly TemplateUsageRecord[];
  variables: readonly TemplateVariable[];
  version: string | null;
}

export interface TemplateSummaryData {
  activeTemplates: number | null;
  categoryCount: number | null;
  latestUpdatedAt: string | null;
  totalTemplates: number | null;
}

export interface TemplateLibrarySnapshot {
  dataStatus: TemplateDataStatus;
  summary: TemplateSummaryData;
  templates: readonly TemplateProject[];
}

export interface TemplateLibraryService {
  getSnapshot(): Promise<TemplateLibrarySnapshot>;
}
