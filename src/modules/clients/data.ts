import { desktopData, toPersonType } from "@/data/desktop";
import type {
  Client,
  ClientDataStatus,
  ClientDetailRecord,
  ClientFinancialSummary,
  ClientStatsSummary,
} from "./types";

export const clients: readonly Client[] = desktopData.people.map((person) => ({
  accountFunds: person.balance,
  accountId: `ACC${String(1000 + Number(person.personId)).padStart(7, "0")}`,
  accountStatus: person.accountStatus,
  age: person.age,
  createdAt: person.accountOpenedAt ?? undefined,
  gender: person.gender === "女" ? "female" : "male",
  group: person.groupName,
  id: person.personId,
  investedAmount: person.invested,
  level: person.vipStatus === "vip" ? "vip" : "standard",
  name: person.name,
  personType: toPersonType(person.type),
  phone: person.phone,
  region: person.region,
  riskLevel: person.riskLevel,
  status: person.followUp
    ? "follow_up"
    : person.accountStatus === "opened"
      ? "active"
      : "inactive",
  studentStatus: person.type.startsWith("新") ? "new" : "established",
  todayProfitLoss: person.profit,
  todayTrades: person.todayTrades,
  totalProfitLoss: person.profit,
  vipTier: person.vipTier,
}));

export const clientsDataStatus: ClientDataStatus = "ready";

// Retained only for API compatibility. Holdings are sourced from unified Position data.
export const clientDetailRecords: readonly ClientDetailRecord[] = [];

export const emptyClientFinancialSummary: ClientFinancialSummary = {
  netWorth: null,
  positionValue: null,
  profitLossRatio: null,
  totalProfitLoss: null,
};

function getMexicoCityDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Mexico_City",
    year: "numeric",
  }).format(date);
}

export function getClientById(id: string) {
  return clients.find((client) => client.id === id) ?? null;
}

export function getClientDetailRecord(id: string) {
  return clientDetailRecords.find((record) => record.clientId === id) ?? null;
}

export function getClientStats(): ClientStatsSummary {
  const today = getMexicoCityDateKey(new Date());
  return {
    active: clients.filter((client) => client.status === "active").length,
    addedToday: clients.filter(
      (client) => client.createdAt && getMexicoCityDateKey(new Date(client.createdAt)) === today,
    ).length,
    followUp: clients.filter((client) => client.status === "follow_up").length,
    inactive: clients.filter((client) => client.status === "inactive").length,
    total: clients.length,
    vip: clients.filter((client) => client.level === "vip").length,
  };
}
