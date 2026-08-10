import type { TemplateLibraryService, TemplateLibrarySnapshot, TemplateProject } from "./types";

const templateSources = [
  { id: "buy", name: "买入信号模板", templateType: "buy", category: "trade", previewSourceUrl: "/templates/actinver-buy.png" },
  { id: "sell", name: "卖出信号模板", templateType: "sell", category: "trade", previewSourceUrl: "/templates/actinver-sell.png" },
  { id: "vip-ticket", name: "VIP票模板", templateType: "vip-ticket", category: "other", previewSourceUrl: "/templates/actinver-vip.png" },
  { id: "regular-ticket", name: "常规单票模板", templateType: "regular-ticket", category: "other", previewSourceUrl: "/templates/actinver-regular.png" },
  { id: "dual-ticket", name: "双票模板", templateType: "dual-ticket", category: "other", previewSourceUrl: "/templates/actinver-dual.png" },
] as const;

const templates: readonly TemplateProject[] = templateSources.map((template) => ({
  ...template,
  applicable: null,
  background: null,
  changeRecords: [],
  createdAt: null,
  nodes: [],
  status: "active" as const,
  updatedAt: null,
  usageCount: null,
  usageRecords: [],
  variables: [],
  version: null,
}));

const snapshot: TemplateLibrarySnapshot = {
  dataStatus: "ready",
  summary: {
    activeTemplates: templates.length,
    categoryCount: new Set(templates.map((template) => template.category)).size,
    latestUpdatedAt: null,
    totalTemplates: templates.length,
  },
  templates,
};

export const templateLibraryService: TemplateLibraryService = {
  async getSnapshot() { return snapshot; },
};
