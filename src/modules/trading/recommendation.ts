import type { Client } from "@/modules/clients";
import type { TradeStockType } from "./types";

export function getRecommendedClients(
  clients: readonly Client[],
  stockType: TradeStockType,
) {
  if (stockType === "normal") {
    return clients;
  }

  return clients.filter(
    (client) =>
      client.level === "vip" && client.studentStatus === "established",
  );
}
