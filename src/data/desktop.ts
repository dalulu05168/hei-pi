import seed from "./desktop-seed.json";

export type DesktopPersonType = "老男" | "老女" | "新男" | "新女";

export interface DesktopPerson {
  accountOpenedAt: string | null;
  accountStatus: "opened" | "unopened";
  age: number;
  balance: number;
  followUp: boolean;
  gender: "男" | "女";
  groupName: string;
  id: string;
  invested: number;
  name: string;
  personId: string;
  phone: string;
  profit: number;
  region: string;
  riskLevel: string;
  todayTrades: number;
  type: DesktopPersonType;
  vipStatus: "vip" | "normal";
  vipTier: string;
}

export interface DesktopStock {
  currency: "USD" | "MXN";
  currentPrice: number;
  discount: number;
  exchange: "NASDAQ" | "NYSE" | "BMV";
  industry: string;
  name: string;
  price: number;
  ticker: string;
}

export interface DesktopHolding {
  costPrice: number;
  currentPrice: number;
  id: string;
  openedAt: number;
  personId: string;
  remainingHours: number;
  sellDeadline: number;
  shares: number;
  status: string;
  stockName: string;
  ticker: string;
}

export interface DesktopPendingStock {
  assignedAt: number;
  name: string;
  ticker: string;
}

export const desktopData = seed as unknown as {
  accountTrend: readonly unknown[];
  holdings: readonly DesktopHolding[];
  pendingStocks: readonly DesktopPendingStock[];
  people: readonly DesktopPerson[];
  stockCatalog: readonly DesktopStock[];
  tradingTrend: readonly unknown[];
  vipTrend: readonly unknown[];
};

export function toPersonType(type: DesktopPersonType) {
  if (type === "老男") return "legacy_male" as const;
  if (type === "老女") return "legacy_female" as const;
  if (type === "新男") return "new_male" as const;
  return "new_female" as const;
}

export function toMarket(currency: "USD" | "MXN") {
  return currency === "USD" ? "US" as const : "MX" as const;
}
